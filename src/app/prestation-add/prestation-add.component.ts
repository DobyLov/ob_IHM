import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { HistoryRoutingService } from '../service/historyRouting.service';
import { Praticien } from '../praticien/praticien';
import { GenreService } from '../genre/genre.service';
import { Router } from '@angular/router';
import { ToasterService } from '../service/toaster.service';
import { FormControl, Validators, FormGroup, AbstractControl } from '@angular/forms';
import { CurrentUtilisateur } from '../login/currentUtilisateur';
import { Subscription } from 'rxjs';
import { Utilisateur } from '../utilisateur/utilisateur';
import { UtilisateurService } from '../utilisateur/utilisateur.service';
import { Activite } from '../activite/activite';
import { Genre } from '../genre/genre';
import { Prestation } from '../prestation/prestation';
import { PraticienService } from '../praticien/praticien.service';
import { MatOptionSelectionChange } from '@angular/material';
import { PrestationService } from '../prestation/prestation.service';
import { ActiviteService } from '../activite/activite.service';


// customValidator
export function CustomEmailValidator( control: AbstractControl ): {[key: string]: any} {

  return (control: AbstractControl): { [key: string]: any } => {

   return (control.value || '' ).trim().length == 0 ? { 'clientEmail': true } : null;

  };
};


@Component({
  selector: 'app-prestation-add',
  templateUrl: './prestation-add.component.html',
  styleUrls: ['./prestation-add.component.scss']
})
export class PrestationAddComponent implements OnInit {

  // RouterHistory
  previousRoute: string;
  // Utilisateur
  @Output() isUserIsConnected$: boolean = false;
  currentUtilisateur$: CurrentUtilisateur;
  cUtilisateur = new Subscription();
  utilisateur: Utilisateur = new Utilisateur();

  // activite
  activitePrestation: Activite;
  activite: Activite = new Activite();
  activiteList: Activite[];
  // genre
  genrePrestation: Genre;
  genre: Genre = new Genre();
  genreList: Genre[];

  // prestation
  prestation: Prestation = new Prestation();
  

  // Slider
  ts_Color: string = 'primary'; 
  slider_Forfait: boolean = false;


  // FormGroup
  prestationFg: FormGroup;
  
  constructor(private logger: NGXLogger,
              private _historyRouting: HistoryRoutingService,
              private _activiteService: ActiviteService,
              private _genreService: GenreService,
              private _prestationService: PrestationService,
              private _utilisateurService: UtilisateurService,
              private _router: Router,
              private _toasterService: ToasterService
              ) { }

  ngOnInit() {

        // Historique de navigation stocke la route precedent afin de faire un BackPage
        this.previousRoute = this._historyRouting.getPreviousUrl();


        this.getCurrentUtilisateur();
        this.prestationFg = new FormGroup({
          prestationActivite: new FormControl({value: ''}, [Validators.pattern('^[a-zA-Z-éèç]+$'), Validators.required, Validators.maxLength(50)]),
          praticienSoin: new FormControl( '', [Validators.pattern('^[a-zA-Z-éèç]+$'),Validators.required, Validators.maxLength(50)]),
          prestationGenre: new FormControl({value: ''}, [Validators.required]),  
          // prestationForfait: new FormControl({value: ''}, [Validators.required]),
          prestationNbSeance: new FormControl({value: '', disabled: false}, [Validators.pattern('^[0-9]'), Validators.required, Validators.maxLength(2)]),
          prestationDureeSeance: new FormControl({value: '', disabled: false}, [Validators.pattern('^[0-9]'), Validators.required, Validators.maxLength(3)]),
          prestationDescription: new FormControl( '', [Validators.pattern('^[a-zA-Z-éèàç]+$'), Validators.maxLength(500)]),
          prestationPrix: new FormControl({value: ''},[Validators.pattern('^[0-9.,]+$'), Validators.required, Validators.maxLength(5)])
       
          })
          
  }
  
  /**
* Recupere l utilisateur loggé
*/
 private async getCurrentUtilisateur() {

  this.logger.info("ClientAddComponent log : Recuperation du currentuser ");
  this.cUtilisateur = await this._utilisateurService.getObjCurrentUtilisateur
    .subscribe((cUtilisateur: CurrentUtilisateur) => { this.currentUtilisateur$ = cUtilisateur },
      () => {
        this.logger.error("RclientAddComponent log : La requete n a pas fonctionnée");
      });
}

    /**
   * Recupere le message d erreur du control sur le champs TelFix
   */
  public getActiviteErrorMessage(): string {
    return this.prestationFg.get('prestationActivite').getError('required') ? 'Champs obligatoire' :
    this.prestationFg.get('prestationActivite').getError('pattern') ? 'Charactères spéciaux : tiret autorisé' :
    this.prestationFg.get('prestationActivite').getError('maxlength') ? '50 caractères maximum !' : '';

  }

    /**
   * Recupere le message d erreur du control sur le champs TelFix
   */
  public getSoinErrorMessage(): string {
    return this.prestationFg.get('praticienSoin').getError('required') ? 'Champs obligatoire' :
    this.prestationFg.get('praticienSoin').getError('pattern') ? 'Charactères spéciaux : tiret autorisé' :
    this.prestationFg.get('praticienSoin').getError('maxlength') ? '1 caractère maximum !' : '';
  }

    /**
   * Recupere le message d erreur du control sur le champs Genre
   */
  public getGenreErrorMessage(): string {
    return this.prestationFg.get('praticienSoin').getError('required') ? 'Champs obligatoire' : '';
  }

  /**
   * Recupere le message d erreur du control sur le champs TelMobile
   */
  public getNbSeanceErrorMessage(): string {
    return this.prestationFg.get('praticienNbSeance').getError('required') ? 'Champs obligatoire' :
    this.prestationFg.get('praticiepraticienNbSeancenTelMobil').getError('pattern') ? 'Que des chiffres svp' :
    this.prestationFg.get('praticienNbSeance').getError('maxlength') ? '2 chiffres max !' : '';
  }

  public getDureeSeanceErrorMessage(): string {
    return this.prestationFg.get('prestationDureeSeance').getError('required') ? 'Champs obligatoire' :
    this.prestationFg.get('prestationDureeSeance').getError('pattern') ? 'Chiffres uniquement' :
    this.prestationFg.get('prestationDureeSeance').getError('maxlength') ? '3 chiffres max !' : '';
  }

  /**
 * Recupere le message d erreur du control sur le champs Email
 */
  public getDescriptionErrorMessage(): string {

    return this.prestationFg.get('prestationDescription').getError('email') ? 'Format d\'email non valide ( xyz@xyz.xyz)' :
        this.prestationFg.get('prestationDescription').getError('pattern') ? 'Lettre uniquement' :
        this.prestationFg.get('prestationDescription').getError('maxlength') ? '500 caractères maximum !' : '';

  }
  public getPrixErrorMessage() {
    return this.prestationFg.get('prestationPrix').getError('required') ? 'Champs obligatoire' :
        this.prestationFg.get('prestationPrix').getError('pattern') ? 'Chiffres uniquement' :
        this.prestationFg.get('prestationPrix').getError('maxlength') ? '5 caractères maximum !' : '';
  }

   
public activiteSelectionne(event: EventEmitter<MatOptionSelectionChange>, activite) {

}

public genreSelectionne(event: EventEmitter<MatOptionSelectionChange>, genre) {

}
   

  /**
   * Change la valeur du slider de rappel de Rdv par Sms
   */
  public onChangeTs_forfait_Checked() {
    
    this.slider_Forfait = !this.slider_Forfait;
    // if ( this.slider_Sms == true) {

    //   this.prestationFg.get('praticienTelMobil').disable();

    // } else {

    //   this.prestationFg.get('praticienTelMobil').enable();
    // }
    
  }
  
  /**
   * persiste le nouveau client
   */
  public post(): void {

    this.logger.info("ClientAddComponent Log : Persistance de la nouvelle prestation");
    this.genre;
    this.activite;
    this.prestation;

    this._prestationService.post(this.prestation)

    .subscribe(
      res => {
        res;
        let messageOk: string = "Prestation enregistrée";
        // this._router.navigate(['./home']);
        this.toasterMessage(messageOk,'snackbarInfo',5000);
        this.logger.info("PraticienAddComponent Log : Nouveau Praticien persisté");

      },
      err => {
        let messageNOk: string = "Il y a eu un problème, vérifiez les infos ..."
        this.toasterMessage(messageNOk,'snackbarWarning', 5000);
        this.logger.error("PraticienAddComponent Log : La Prestation n'a pas été enregistrée");
      })

    
  }

  /**
   * Popup de communication avec l utilisateur
   * @param snackMessage 
   * @param snackStyle 
   * @param snackTimer 
   */
  private toasterMessage(snackMessage: string, snackStyle: string, snackTimer: number): void {
    this._toasterService.showToaster(snackMessage, snackStyle, snackTimer)
  }

}