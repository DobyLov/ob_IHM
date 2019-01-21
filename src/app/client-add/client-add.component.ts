import { Component, OnInit, Output } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { HistoryRoutingService } from '../service/historyRouting.service';
import { GenreService } from '../genre/genre.service';
import { Router } from '@angular/router';
import { Genre } from '../genre/genre';
import { ToasterService } from '../service/toaster.service';
import { Client } from '../client/client';
import { ClientService } from '../client/client.service';
import { FormControl, Validators, FormGroup, AbstractControl } from '@angular/forms';
import { CurrentUtilisateur } from '../login/currentUtilisateur';
import { Subscription } from 'rxjs';
import { Utilisateur } from '../utilisateur/utilisateur';
import { UtilisateurService } from '../utilisateur/utilisateur.service';
import { MAT_DATE_LOCALE, DateAdapter, MatOptionSelectionChange } from '@angular/material';
import { ClientAdresse } from '../client/clientAdresse';


// customValidator
export function CustomEmailValidator( control: AbstractControl ): {[key: string]: any} {

  return (control: AbstractControl): { [key: string]: any } => {

   return (control.value || '' ).trim().length == 0 ? { 'clientEmail': true } : null;

  };
};

@Component({
  selector: '<app-clientAdd [inputclientTelMobil]=inputTelMob></app-clientAdd>',
  templateUrl: './client-add.component.html',
  styleUrls: ['./client-add.component.scss'],
  providers: [{provide: MAT_DATE_LOCALE, useValue: 'fr-FR'}],
})
export class ClientAddComponent implements OnInit {

  // RouterHistory
  previousRoute: string;
  // Utilisateur
  @Output() isUserIsConnected$: boolean = false;
  currentUtilisateur$: CurrentUtilisateur;
  cUtilisateur = new Subscription();
  utilisateur: Utilisateur = new Utilisateur();
  // Client
  client: Client = new Client();
  // Genre
  genre: Genre = new Genre();
  genreList: Genre[];
  // Adresseclient
  adresseClient: ClientAdresse = new ClientAdresse;
  // date Today
  datePickerMaxDateOfToday: Date = new Date();
  // DateOfBirth
  dateOfBirthSel: Date;

 // fields

  // Slider
  ts_Color: string = 'primary'; 
  slider_Commercials: boolean = false;
  slider_NLetter: boolean = false;
  slider_Sms: boolean = false;
  slider_Mail: boolean = false;

  // FormGroup
  clientFg: FormGroup;
  
  constructor(private logger: NGXLogger,
              private _historyRouting: HistoryRoutingService,
              private _genreService: GenreService,
              private _clientService: ClientService,
              private _utilisateurService: UtilisateurService,
              private _router: Router,
              private _toasterService: ToasterService,
              private adapter: DateAdapter<any>
              ) { }

  ngOnInit() {

        // Historique de navigation stocke la route precedent afin de faire un BackPage
        this.previousRoute = this._historyRouting.getPreviousUrl();

        this.getGenreList();
        this.getCurrentUtilisateur();
        this.clientFg = new FormGroup({
          clientNom: new FormControl( '', [Validators.pattern('^[a-zA-Z-éè]+$'), Validators.required, Validators.maxLength(30)]),
          clientPrenom: new FormControl( '', [Validators.pattern('^[a-zA-Z-éèç]+$'),Validators.required, Validators.maxLength(30)]),
          clientDateOfBirth: new FormControl({value: null, disabled: true}),
          clientGenre: new FormControl('', [Validators.required] ),
          clientAdresseNumRue: new FormControl('', [Validators.pattern('^(0|[1-9][0-9]*)$'), Validators.maxLength(3)]),
          clientAdresseRue: new FormControl('', [Validators.pattern('^[a-zA-Z- éèêàç]+$'), Validators.maxLength(30)]),
          clientAdresseCodePostale: new FormControl('', [Validators.pattern('^(0|[1-9][0-9]*)$'), Validators.minLength(5)]),
          clientAdresseVille: new FormControl('',[Validators.pattern('^[a-zA-Z- ]+$'), Validators.maxLength(30)]),
          clientTelFix: new FormControl('', [Validators.pattern('([0])[0-9]{9}'), Validators.minLength(10)]),
          clientTelMobil: new FormControl({value: '', disabled: false}, [Validators.pattern('([0])([6]|[7])[0-9]{8}'), Validators.minLength(10)]),
          clientEmail: new FormControl({value: '', disabled: false}, [CustomEmailValidator, Validators.maxLength(30), 
                        Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]
                        // Validators.pattern()
                        
                        )
                        
          })
          
  }

  french() {

    this.adapter.setLocale('fr');
  }

  /**
   * Retourne un message d erreur sur le champs Date d anniversaire
   */
  public getDateErrorMessage() {

    return this.clientFg.get('clientDateOfBirth').getError('pattern') ? 'Date inalide - dd/mm/aaaa' :
        this.clientFg.get('clientDateOfBirth').getError('maxlength') ? '10 caractères maximum !' : '';

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
  public getIdNomErrorMessage(): string {
    return this.clientFg.get('clientNom').getError('required') ? 'Champs obligatoire' :
    this.clientFg.get('clientNom').getError('pattern') ? 'Charactères spéciaux : tiret autorisé' :
    this.clientFg.get('clientNom').getError('minlength') ? '1 caractère minimum !' : '';

  }

    /**
   * Recupere le message d erreur du control sur le champs TelFix
   */
  public getIdPrenomErrorMessage(): string {
    return this.clientFg.get('clientNom').getError('required') ? 'Champs obligatoire' :
    this.clientFg.get('clientPrenom').getError('pattern') ? 'Charactères spéciaux : tiret autorisé' :
    this.clientFg.get('clientPrenom').getError('minlength') ? '1 caractère minimum !' : '';
  }

      /**
   * Recupere le message d erreur du control sur le champs TelFix
   */
  public getClientGenreErrorMessage(): string {
    return this.clientFg.get('clientGenre').getError('required') ? 'Champs obligatoire' : '';
  }

  /**
   * Recupere le message d erreur du control sur le champs TelFix
   */
  public getTelFixErrorMessage(): string {
    return this.clientFg.get('clientTelFix').getError('pattern') ? 'Doit commencer par 0' :
    this.clientFg.get('clientTelFix').getError('minlength') ? 'Tel à 10 numéros !' : '';
  }

  /**
   * Recupere le message d erreur du control sur le champs TelMobile
   */
  public getTelMobileErrorMessage(): string {
    return this.clientFg.get('clientTelMobil').getError('pattern') ? 'DoitCommencer par 06 ou 07' :
    this.clientFg.get('clientTelMobil').getError('minlength') ? 'Tel à 10 numéros !' : '';
  }

  // private testTelNotNull(testmobil: FormControl) {
  //   if (testmobil.)
  //   return this.clientFg.get('clientTelMobil').valid;
  // }

    // Mail check errors
  /**
 * Recupere le message d erreur du control sur le champs Email
 */
  public getEmailErrorMessage(): string {

    return this.clientFg.get('clientEmail').getError('required') ? 'Email obligatoire' :
        this.clientFg.get('clientEmail').getError('email') ? 'Format d\'email non valide ( xyz@xyz.xyz)' :
        this.clientFg.get('clientEmail').getError('pattern') ? 'Format d\'email non valide  ( xyz@xyz.xyz)' :
        this.clientFg.get('clientEmail').getError('maxlength') ? '30 caractères maximum !' : '';

  }

   /**
   * Recupere le message d erreur du control sur le champs TelMobile
   */
  public getAdresseNumRueErrorMessage(): string {
    return this.clientFg.get('clientAdresseNumRue').getError('pattern') ? 'Saisir que des chiffres' :
    this.clientFg.get('clientAdresseNumRue').getError('maxlength') ? '3 caractères maximum !' :
    this.clientFg.get('clientAdresseNumRue').getError('minlength') ? '1 caractères maximum !' : '';
  }

  /**
   * Recupere le message d erreur du control sur le champs TelMobile
   */
  public getgetAdresseRueErrorMessage(): string {
    return this.clientFg.get('clientAdresseRue').getError('pattern') ? 'Saisir que des chiffres ou lettres' :
    this.clientFg.get('clientAdresseRue').getError('maxlength') ? '3 caractères maximum !' : '';
  }

  /**
   * Recupere le message d erreur du control sur le champs TelMobile
   */
  public getAdresseCodePostaleErrorMessage(): string {
    return this.clientFg.get('clientAdresseCodePostale').getError('pattern') ? 'Saisir que des chiffres' :
    this.clientFg.get('clientAdresseCodePostale').getError('minlength') ? '5 caractères minimum !' : '';
  }

    /**
   * Recupere le message d erreur du control sur le champs TelMobile
   */
  public getAdresseVilleErrorMessage(): string {
    return this.clientFg.get('clientAdresseRue').getError('pattern') ? 'Saisir que des chiffres' :
    this.clientFg.get('clientAdresseRue').getError('maxlength') ? '3 caractères maximum !' : '';
  }


  /**
   * Récuperation de la liste des genres Humain
   */
  private getGenreList():void {

    this._genreService.getGenreList().subscribe(
      (genre: Genre[]) => {
        this.genreList = genre;
      }
    )

  }

  // Toggle sliders
  /**
   * Chnage la valeur du Slider Commercials
   */
  public onChangeTs_Commercials_Checked() {
    this.slider_Commercials = !this.slider_Commercials;
    if( this.slider_Commercials == true || this.slider_Mail == true 
        || this.slider_NLetter == true) {

          this.clientFg.get('clientEmail').disable();
        }
    if (this.slider_Commercials == false && this.slider_Mail == false 
      && this.slider_NLetter == false ) {
        
        this.clientFg.get('clientEmail').enable();
  
      } 

  }

  /**
   * Change la valeur du Slider NewsLetter
   */
  public onChangeTs_NewsLetter_Checked() {

    this.slider_NLetter = !this.slider_NLetter;

    if( this.slider_Commercials == true || this.slider_Mail == true 
      || this.slider_NLetter == true) {

        this.clientFg.get('clientEmail').disable();
    } 

    if (this.slider_Commercials == false && this.slider_Mail == false 
      && this.slider_NLetter == false ) {
        
        this.clientFg.get('clientEmail').enable();
  
      }

  }

  /**
   * Change la valeur du slider de rappel de Rdv par Sms
   */
  public onChangeTs_SmsRdvRemider_Checked() {
    
    this.slider_Sms = !this.slider_Sms;
    if ( this.slider_Sms == true) {

      this.clientFg.get('clientTelMobil').disable();

    } else {

      this.clientFg.get('clientTelMobil').enable();
    }
    
  }

  /**
   * Change la valeur du slider de rappel de Rdv par Mail
   */
  public onChangeTs_MailRdvReminder_Checked() {
    this.slider_Mail = !this.slider_Mail;

    if ( this.slider_Commercials == true || this.slider_Mail == true 
      || this.slider_NLetter == true) {

        this.clientFg.get('clientEmail').disable();
      } 

    if (this.slider_Commercials == false && this.slider_Mail == false 
    && this.slider_NLetter == false ) {
      
      this.clientFg.get('clientEmail').enable();

    }

  }


  /**
   * Mapp la selection a l objet Genre et a clientFg
   */
  public genreSelectionne(event: MatOptionSelectionChange, genre: Genre) {

    if (event.source.selected) {
      this.clientFg.get('clientGenre').setValue(genre.idGenre);
      this.genre.idGenre = genre.idGenre;
      
    }
  }
  
  /**
   * persiste le nouveau client
   */
  public postClient(): void {

    this.logger.info("ClientAddComponent Log : Persistance du Nouveau Client");
    // IdClient --------
    this.client.nomClient = this.clientFg.get('clientNom').value;
    this.client.prenomClient = this.clientFg.get('clientPrenom').value;
    // Genre
    this.genre.idGenre = this.genre.idGenre;
    this.client.genreClient = this.genre;
    // Date Annif
    this.client.dateAnniversaireClient = this.clientFg.get('clientDateOfBirth').value;
    // tel fixe
    this.client.telephoneClient = this.clientFg.get('clientTelFix').value;
    // tel Mobile
    this.client.telMobileClient = this.clientFg.get('clientTelMobil').value;
    this.logger.info("ClientAddComponent Log : clientTelMobil : " + this.clientFg.get('clientTelMobil').value);
    // Email
    this.client.adresseMailClient = this.clientFg.get('clientEmail').value;
    // Sliders --------
    // Slider Commercials
    this.client.suscribedCommercials = this.slider_Commercials.valueOf();
    this.logger.info("ClientAddComponent Log : Slider_Commercial : " + this.slider_Commercials.valueOf());
    // Slider NewsLetter
    this.client.suscribedNewsLetter = this.slider_NLetter.valueOf();
    this.logger.info("ClientAddComponent Log : Slider_NLetter : " + this.slider_NLetter.valueOf());
    // Slider 
    this.client.suscribedMailReminder = this.slider_Mail.valueOf();
    this.logger.info("ClientAddComponent Log : Slider_Maill : " + this.slider_Mail.valueOf());
    // Slider SMS
    this.client.suscribedSmsReminder = this.slider_Sms.valueOf();
    this.logger.info("ClientAddComponent Log : Slider_Sms : " + this.slider_Sms.valueOf());
    // Adresse --------
    this.adresseClient.numero = this.clientFg.get('clientAdresseNumRue').value;
    this.adresseClient.rue = this.clientFg.get('clientAdresseRue').value;
    this.adresseClient.zipCode = this.clientFg.get('clientAdresseCodePostale').value;
    this.adresseClient.ville = this.clientFg.get('clientAdresseVille').value;
    this.adresseClient.pays = 'FRANCE';
    this.client.adresse = this.adresseClient;

    // options Rdgp
    this.client.rgpdDateClientvalidation = null;
    this.client.rgpdInfoClientValidation = false;
    this.client.rgpdClientCanModifyRgpdSettings = true;
    
    // (dateInput)="dateSelectionnee()"

    this._clientService.postClient(this.client)

    .subscribe(
      res => {
        res;
        let messageOk: string = "Votre Client est enregistré";
        this._router.navigate(['./home']);
        this.toasterMessage(messageOk,'snackbarInfo',5000);
        this.logger.info("ClientAddComponent Log : Nouveau client persisté");

      },
      err => {
        let messageNOk: string = "Il y a eu un problème, vérifiez les infos ..."
        this.toasterMessage(messageNOk,'snackbarWarning', 5000);
        this.logger.error("ClientAddComponent Log : Le client n'a pas été enregistré");
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
