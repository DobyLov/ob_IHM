import { Component, OnInit, Output, ChangeDetectorRef, AfterViewInit, OnDestroy, AfterContentInit } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { HistoryRoutingService } from '../service/historyRouting.service';
import { Router } from '@angular/router';
import { CurrentUtilisateur } from '../login/currentUtilisateur';
import { Subscription } from 'rxjs';
import { Utilisateur } from '../utilisateur/utilisateur';
import { UtilisateurService } from '../utilisateur/utilisateur.service';
import { Prestation } from '../prestation/prestation';
import { PrestationService } from '../prestation/prestation.service';
import { Activite } from '../activite/activite';
import { ActiviteService } from '../activite/activite.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatOptionSelectionChange } from '@angular/material';
import { Genre } from '../genre/genre';
import { GenreService } from '../genre/genre.service';

@Component({
  selector: 'app-prestation-search',
  templateUrl: './prestation-search.component.html',
  styleUrls: ['./prestation-search.component.scss']
})
export class PrestationSearchComponent implements OnInit {

  // RouterHistory
  previousRoute: string;
  // Utilisateur
  @Output() isUserIsConnected$: boolean = false;
  currentUtilisateur$: CurrentUtilisateur;
  cUtilisateur = new Subscription();
  utilisateur: Utilisateur = new Utilisateur();
  // Prestation
  prestation: Prestation = new Prestation();
  prestationList: Prestation[];
  filteredPrestation: Prestation[];
  // Activite
  activite: Activite;
  activiteList: Activite[];
  // Genre
  genre: Genre;
  genreList: Genre[];
  // Table
  // Datasource
  dataSource: Prestation[];
  // clolonnes
  // tabNomsColonnes: string[] = ['numeroCli'];
  tabNomsColonnes: string[] = ['activ', 'soin', 'genre', 'forfait', 'idPrat'];
  // FormGroup
  prestationFg: FormGroup;
  // Slider
  ts_Color: string = 'primary';
  slider_Forfait: boolean = false;
  slider_Genre: boolean = false;

  // States
  state_activite: boolean = false;
  state_genre: boolean = false;

  constructor(private logger: NGXLogger,
    private _historyRouting: HistoryRoutingService,
    private _prestationService: PrestationService,
    private _genreService: GenreService,
    private _activiteservice: ActiviteService,
    private _utilisateurService: UtilisateurService,
    private _cd: ChangeDetectorRef,
    private _route: Router,
    private _router: Router) { }

  ngOnInit() {

    // Historique de navigation stocke la route precedent afin de faire un BackPage
    this.previousRoute = this._historyRouting.getPreviousUrl();

    // Formgroup
    this.prestationFg = new FormGroup({
      activiteFc: new FormControl(),
      genreFc: new FormControl()
    })

    this.getCurrentUtilisateur();
    this.getPrestationList();
    this.getActiviteList();
    this.getGenreList();


  }

  /**
  * Recupere l utilisateur loggé
  */
  private async getCurrentUtilisateur() {

    this.logger.info("ClientSearchComponent log : Recuperation du currentuser ");
    this.cUtilisateur = await this._utilisateurService.getObjCurrentUtilisateur
      .subscribe((cUtilisateur: CurrentUtilisateur) => { this.currentUtilisateur$ = cUtilisateur },
        () => {
          this.logger.error("ClientSearchComponent log : La requete n a pas fonctionnée");
        });
  }

  /**
   * Récuperation de la liste des Prestation
   */
  private getPrestationList() {

    this._prestationService.getPrestationList().subscribe(
      prestationL => {
        let prestaOrderd = prestationL.sort((a: Prestation, b: Prestation) => a.activite.activiteNom < b.activite.activiteNom ? -1 : 1)
        this.dataSource = prestationL;
        this.prestationList = prestaOrderd;
        this.filteredPrestation = prestaOrderd;
        this._cd.markForCheck();
      }
    )
      
  }

  /**
  * Récuperation de la liste des activite
  */
  private getActiviteList() {

    this._activiteservice.getActiviteList().subscribe(
      activiteL => {
        this.activiteList = activiteL;
        // this._cd.detectChanges();
      }
    )
  }

  /**
  * Récuperation de la liste des genres
  */
  private getGenreList() {

    this._genreService.getGenreList().subscribe(
      genreL => {
        this.genreList = genreL;
        // this._cd.detectChanges();

      }
    )
  }

  /**
 * Assigne le paramatre activite selectionne par l utilisateur au formControl
 */
  public activiteSelectionnee(event: MatOptionSelectionChange, activite: Activite) {

    if (event.source.selected) {
      this.logger.info("PrestationSearchComponent Log : Activite selectionnée : " + activite.activiteNom)
      this.prestationFg.get('activiteFc').setValue(activite.idActivite);
      if (this.state_activite == false ) {
        this.state_activite = true;
      }
      this.refreshPrestationListSelonLesOptions();
    }
  }

  /**
  * Assigne le paramatre activite selectionne par l utilisateur au formControl
  */
  public genreSelectionne(event: MatOptionSelectionChange, genre: Genre) {

    if (event.source.selected) {
      this.logger.info("PrestationSearchComponent Log : Genre selectionné : " + genre.genreHum)
      this.prestationFg.get('genreFc').setValue(genre.idGenre);
      if (this.state_genre == false ) {
        this.state_genre = true;
      }
      this.refreshPrestationListSelonLesOptions();
    }
  }

  /**
 * Change la valeur du slider forfait
 */
  public onChangeTs_forfait_Checked() {

    this.slider_Forfait = !this.slider_Forfait;
    this.logger.info("PrestationsearchComponent log : Valeur de Forfait : " + this.slider_Forfait);
    this.refreshPrestationListSelonLesOptions();

  }

  /**
   * Filtre La liste des prestations en fonction des options choisies Activite / Genre / fofait
   */
  private refreshPrestationListSelonLesOptions(): void {

    if (this.state_activite == false && this.state_genre == false) {

      // this.filteredPrestation = this.prestationList
      this.dataSource = this.prestationList;
      
      // this.logger.info("PrestationSerachComponent Log : listeFiltree Activite et Genre : " + this.filteredPrestation);

    } else if (this.state_activite == true && this.state_genre == false) {

      this.filteredPrestation = this.prestationList
        // filtre en fonction des Activites selectionnees
        .filter(presta => presta.activite.idActivite == this.prestationFg.get('activiteFc').value) 
        // filtre en fonction du fofait
        .filter(presta => presta.forfait == this.slider_Forfait.valueOf());

      this.dataSource = this.filteredPrestation;
      // this.logger.info("PrestationSerachComponent Log : listeFiltree Activite : " + this.filteredPrestation);

    } else if (this.state_activite == false && this.state_genre == true) {

      this.filteredPrestation = this.prestationList
        // filtre en fonction du genre selectionné
        .filter(presta => presta.genre.idGenre == this.prestationFg.get('genreFc').value)
        // filtre en fonction du fofait
        .filter(presta => presta.forfait == this.slider_Forfait.valueOf());

      this.dataSource = this.filteredPrestation;
      // this.logger.info("PrestationSerachComponent Log : listeFiltree Genre : " + this.filteredPrestation);

    } else if (this.state_activite == true && this.state_genre == true) {

      this.filteredPrestation = this.prestationList
        // filtre en fonction des Activites selectionnees
        .filter(presta => presta.activite.idActivite == this.prestationFg.get('activiteFc').value )
        // filtre en fonction du genre selectionné
        .filter(presta => presta.genre.idGenre == this.prestationFg.get('genreFc').value)
        // filtre en fonction du fofait
        .filter(presta => presta.forfait == this.slider_Forfait.valueOf());
      
      this.dataSource = this.filteredPrestation;
      // this.logger.info("PrestationSerachComponent Log : listeFiltree Activite et Genre : " + this.filteredPrestation);

    }
  }

  /**
   * Annule les filtres
   */
  public resetFilters() {

    this.state_activite = false;
    this.state_genre = false;
    this.prestationFg.get('activiteFc').setValue('');
    this.prestationFg.get('genreFc').setValue('');
    this.slider_Forfait = false;
    this.refreshPrestationListSelonLesOptions();
  }

}

