import { Component, OnInit, Output, EventEmitter, SimpleChanges, OnChanges, Input } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { HistoryRoutingService } from '../service/historyRouting.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormControl, Validators, FormGroup, AbstractControl } from '@angular/forms';
import { MatOptionSelectionChange } from '@angular/material';
import { ToasterService } from '../service/toaster.service';
import { CurrentUtilisateur } from '../login/currentUtilisateur';
import { Utilisateur } from '../utilisateur/utilisateur';
import { UtilisateurService } from '../utilisateur/utilisateur.service';
import { ActiviteService } from '../activite/activite.service';
import { Activite } from '../activite/activite';
import { Genre } from '../genre/genre';
import { GenreService } from '../genre/genre.service';
import { Prestation } from '../prestation/prestation';
import { PrestationService } from '../prestation/prestation.service';



// customValidator
// export function CustomValidator( control: AbstractControl ): {[key: string]: any} {

//   return (control: AbstractControl): { [key: string]: any } => {

//    return (control.value || '' ).trim().length == 0 ? { 'prestationNouvActFc': true } : null;

//   };
// };

export interface nbSeance {
  value: number;
  viewValue: string;
}

export interface dureeSeance {
  value: number;
  viewValue: string;
}


@Component({
  selector: 'app-prestation-add',
  templateUrl: './prestation-add.component.html',
  styleUrls: ['./prestation-add.component.scss']
})
export class PrestationAddComponent implements OnInit, OnChanges {

  // RouterHistory
  previousRoute: string;
  // Utilisateur
  @Output() isUserIsConnected$: boolean = false;
  // @Input() set inputNouvelleActivite(value: string);

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

  // Seances
  // duree Seance
  dureeSeanceList: dureeSeance[] = [
          {value: 15, viewValue: '15'},
          {value: 30, viewValue:'30'},
          {value: 45, viewValue:'45'},
          {value: 60, viewValue:'60'},
          {value: 75, viewValue:'75'},
          {value: 90, viewValue:'90'},
          {value: 105, viewValue:'105'},
          {value: 120, viewValue:'120'}
        ];
                
  // Nombre Seances
  nbSeanceList: nbSeance[] = [
        {value: 1, viewValue: '1'},
        {value: 2, viewValue: '2'},
        {value: 3, viewValue: '3'},
        {value: 4, viewValue: '4'},
        {value: 5, viewValue: '5'},
        {value: 6, viewValue: '6'},
        {value: 7, viewValue: '7'},
        {value: 8, viewValue: '8'},
        {value: 9, viewValue: '9'},
        {value: 10, viewValue: '10'},
        {value: 11, viewValue: '11'},
        {value: 12, viewValue: '12'}    
      ];

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

        this.getActiviteList();
        this.getGenreList();
        this.getCurrentUtilisateur();
        this.prestationFg = new FormGroup({
          prestationSoinFc: new FormControl( '', [Validators.pattern('^[a-zA-Z-éèçà ]+$'),Validators.required, Validators.maxLength(50)]),
          prestationActiviteFc: new FormControl({value: ''}),
          prestationNouvActFc: new FormControl('', [Validators.pattern('^[a-zA-Z-éèàç]+$'), Validators.maxLength(50)]),
          prestationGenreFc: new FormControl({value: ''}, [Validators.required]),  
          // prestationForfait: new FormControl({value: ''}, [Validators.required]),
          prestationNbSeanceFc: new FormControl({value: '1', disabled: false}, [Validators.required]),
          prestationDureeSeanceFc: new FormControl({value: '', disabled: false}, [Validators.required]),
          prestationDescriptionFc: new FormControl( '', [Validators.pattern('^[a-zA-Z-éèàç]+$'), Validators.maxLength(500)]),
          prestationPrixFc: new FormControl('',[Validators.pattern('^[0-9.,]+$'), Validators.required, Validators.maxLength(5)])
       
          })
          
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes.inputNouvelleActivite.currentValue());
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
 * Recupere la liste des Activites
 */
private getActiviteList() {
  this.logger.info("PrestationAddComponent log : Recuperation de la liste des Activites.");
  this._activiteService.getActiviteList().subscribe(
    ((activiteList: Activite[]) => {
      this.activiteList = activiteList;
    }
    )
  )
}

/**
 * Recupere la liste des Genres
 */
private getGenreList() {
  this.logger.info("PrestationAddComponent log : Recuperation de la liste des Genres.");
  this._genreService.getGenreList().subscribe(
    ((genreList: Genre[]) => {
      this.genreList = genreList;
    }
    )
  )
}

    /**
   * Recupere le message d erreur du control sur le champs TelFix
   */
  public getSoinErrorMessage(): string {
    return this.prestationFg.get('prestationSoinFc').getError('required') ? 'Champs obligatoire' :
    this.prestationFg.get('prestationSoinFc').getError('pattern') ? 'Charactères spéciaux : tiret autorisé' :
    this.prestationFg.get('prestationSoinFc').getError('maxlength') ? '1 caractère maximum !' : '';
  }

    /**
   * Recupere le message d erreur du control sur le champs TelFix
   */
  public getActiviteErrorMessage(): string {
    return this.prestationFg.get('prestationActiviteFc').getError('pattern') ? 'Charactères spéciaux : tiret autorisé' :
    this.prestationFg.get('prestationActiviteFc').getError('maxlength') ? '50 caractères maximum !' : '';

  }

  /**
   * Recupere le message d erreur du control de la nouvelle activite
   */
  public getNouvActFcErrorMessage() {
    return this.prestationFg.get('prestationNouvActFc').getError('pattern') ? 'Charactères spéciaux : tiret autorisé' :
    this.prestationFg.get('prestationNouvActFc').getError('maxlength') ? '50 caractères maximum !' : '';
  }



    /**
   * Recupere le message d erreur du control sur le champs TelMobile
   */
  public getNbSeanceErrorMessage(): string {
    return this.prestationFg.get('prestationNbSeanceFc').getError('required') ? 'Champs obligatoire' :
    // this.prestationFg.get('prestationNbSeanceFc').getError('pattern') ? 'Que des chiffres svp' :
    this.prestationFg.get('prestationNbSeanceFc').getError('maxlength') ? '2 chiffres max !' : '';
  }



    /**
   * Recupere le message d erreur du control sur le champs Genre
   */
  public getGenreErrorMessage(): string {
    return this.prestationFg.get('prestationGenreFc').getError('required') ? 'Champs obligatoire' : '';
  }

  public getDureeSeanceErrorMessage(): string {
    return this.prestationFg.get('prestationDureeSeanceFc').getError('required') ? 'Champs obligatoire' :
    // this.prestationFg.get('prestationDureeSeanceFc').getError('pattern') ? 'Chiffres uniquement' :
    this.prestationFg.get('prestationDureeSeanceFc').getError('maxlength') ? '3 chiffres max !' : '';
  }

  /**
 * Recupere le message d erreur du control sur le champs Email
 */
  public getDescriptionErrorMessage(): string {

    return this.prestationFg.get('prestationDescriptionFc').getError('email') ? 'Format d\'email non valide ( xyz@xyz.xyz)' :
        this.prestationFg.get('prestationDescriptionFc').getError('pattern') ? 'Lettre uniquement' :
        this.prestationFg.get('prestationDescriptionFc').getError('maxlength') ? '500 caractères maximum !' : '';

  }
  public getPrixErrorMessage() {
    return this.prestationFg.get('prestationPrixFc').getError('required') ? 'Champs obligatoire' :
        this.prestationFg.get('prestationPrixFc').getError('pattern') ? 'Chiffres uniquement' :
        this.prestationFg.get('prestationPrixFc').getError('maxlength') ? '5 caractères maximum !' : '';
  }

   
public activiteSelectionne(event: MatOptionSelectionChange, activite: Activite) {

  if (event.source.selected) {
    this.logger.info("PrestationAddComponent Log : valeur de ActiviteSelectionne : " + activite.activiteNom);

    if (activite != null) {
      this.prestationFg.get('prestationNouvActFc').setValue('');
      this.prestationFg.get('prestationNouvActFc').disable();
    } 
  }

  if ( !event.source.selected ) {

    this.prestationFg.get('prestationNouvActFc').enable();
  }

}

public inputFieldNouvelleActivite(inputNouvelleActivite: string) {

  this.logger.info("PrestationAddComponent Log : Nouvelle activiete touched value: " + inputNouvelleActivite);
  
  if (inputNouvelleActivite != null || inputNouvelleActivite != '') {
    
    this.prestationFg.get('prestationActiviteFc').disable();

  } else {

    this.prestationFg.get('prestationActiviteFc').enable();

  }

  if (inputNouvelleActivite.length == 0) {
    this.logger.info("PrestationAddComponent Log : field null");
    this.prestationFg.get('prestationActiviteFc').enable();
  }
}

/**
 * Assigne le parametre nombre de seance au Formcontrol
 * @param event 
 * @param nombreSeance 
 */
public nombreSeanceSelectionnee(event: EventEmitter<MatOptionSelectionChange>, nbS: nbSeance) {

  this.logger.info("PrestationAddComponent log : valeur de nombreSeance :" + nbS.value);
  this.prestationFg.get('prestationNbSeanceFc').setValue(nbS.value);

}

/**
 * Assigne le parametre dureeSeance au formcontrol
 * @param event 
 * @param dureeSeance 
 */
public dureeSeanceSelectionnee(event: EventEmitter<MatOptionSelectionChange>, dureeS: dureeSeance) {

  this.logger.info("PrestationAddComponent log : valeur de nombreSeance :" + dureeS.value);
  this.prestationFg.get('prestationDureeSeanceFc').setValue(dureeS.value);

}

public genreSelectionnee(event: EventEmitter<MatOptionSelectionChange>, genre) {

}
   

  /**
   * Change la valeur du slider de rappel de Rdv par Sms
   */
  public onChangeTs_forfait_Checked() {
    
    this.slider_Forfait = !this.slider_Forfait;
    
  }
  
  /**
   * persiste le nouveau client
   */
  public post(): void {

    this.logger.info("ClientAddComponent Log : Persistance de la nouvelle prestation");
    this.genre;
    this.activite;
    this.prestation;

    this.prestation.soin = this.prestationFg.get('').value;
    // recuperation de l activite > soit valeur selcetionne ou valeur saisie dans l Input

    if (this.prestationFg.get('prestationActiviteFc').disabled == true) {

    } else {

    }
    // this.prestation.

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