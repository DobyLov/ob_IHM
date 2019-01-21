import { Component, OnInit, Output, ChangeDetectorRef } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { HistoryRoutingService } from '../service/historyRouting.service';
import { Router } from '@angular/router';
import { ToasterService } from '../service/toaster.service';
import { CurrentUtilisateur } from '../login/currentUtilisateur';
import { Subscription } from 'rxjs';
import { Utilisateur } from '../utilisateur/utilisateur';
import { UtilisateurService } from '../utilisateur/utilisateur.service';
import { Praticien } from '../praticien/praticien';
import { PraticienService } from '../praticien/praticien.service';


@Component({
  selector: 'app-praticien-search',
  templateUrl: './praticien-search.component.html',
  styleUrls: ['./praticien-search.component.scss']
})
export class PraticienSearchComponent implements OnInit {

  // RouterHistory
  previousRoute: string;
  // Utilisateur
  @Output() isUserIsConnected$: boolean = false;
  currentUtilisateur$: CurrentUtilisateur;
  cUtilisateur = new Subscription();
  utilisateur: Utilisateur = new Utilisateur();
  // Client
  praticien: Praticien = new Praticien();
  praticienList: Praticien[];
 praticienIndex: number = 0;
  // Table
  // Datasource
  dataSource: Praticien[];
  // clolonnes
  // tabNomsColonnes: string[] = ['numeroCli'];
  tabNomsColonnes: string[] = ['nomPrat', 'prenomPrat', 'telMobilPrat', 'idPrat'];

  constructor(private logger: NGXLogger,
    private _historyRouting: HistoryRoutingService,
    private _praticienService: PraticienService,
    private _utilisateurService: UtilisateurService,
    private _cd: ChangeDetectorRef,
    private _route: Router,
    private _router: Router,
    private _toasterService: ToasterService) { }

  ngOnInit() {

    // Historique de navigation stocke la route precedent afin de faire un BackPage
    this.previousRoute = this._historyRouting.getPreviousUrl();

    this.getCurrentUtilisateur();
    this.getPraticienList();

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
   * Récuperation de la liste des genres Humain
   */
  private getPraticienList() {

    this._praticienService.getPraticienList().subscribe(
      praticienL => {
        this.praticienList = praticienL;        
        this.praticienIndex = this.praticienList.length;  
        this.dataSource = this.praticienList;
        this._cd.detectChanges();
        
        }
    )

    
  };
  
  private test() {
    this.logger.info("praticienSearchComponent Log : Nombre de Client dans la Bdd : " + this.praticienIndex );
    for (var i = 0; i < this.praticienIndex; i++ ) {
      this.logger.info("praticienSearchComponent Log : " + this.dataSource[i].idPraticien);
      this.logger.info("praticienSearchComponent Log : " + this.dataSource[i].nomPraticien);
      this.logger.info("praticienSearchComponent Log : " + this.dataSource[i].prenomPraticien);
    }
  }
}
