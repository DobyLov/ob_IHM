import { Component, OnInit, Output, ChangeDetectorRef, Inject } from '@angular/core';
import { CurrentUtilisateur } from '../login/currentUtilisateur';
import { Subscription } from 'rxjs';
import { Utilisateur } from '../utilisateur/utilisateur';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { NGXLogger } from 'ngx-logger';
import { MatDialog, MatOptionSelectionChange, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MAT_DATE_LOCALE } from '@angular/material';
import { ClientService } from '../client/client.service';
import { UtilisateurService } from '../utilisateur/utilisateur.service';
import { HistoryRoutingService } from '../service/historyRouting.service';
import { ToasterService } from '../service/toaster.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Client } from '../client/client';
import { GenreService } from '../genre/genre.service';
import { Genre } from '../genre/genre';
import { ClientAdresse } from '../client/clientAdresse';
import { AuthService } from '../login/auth.service';
import { HttpResponse } from '@angular/common/http';

// customValidator
export function CustomEmailValidator(control: AbstractControl): { [key: string]: any } {

  return (control: AbstractControl): { [key: string]: any } => {

    return (control.value || '').trim().length == 0 ? { 'clientEmail': true } : null;

  };
};

@Component({
  selector: 'app-client-details',
  templateUrl: './client-details.component.html',
  styleUrls: ['./client-details.component.scss'],
  providers: [{provide: MAT_DATE_LOCALE, useValue: 'fr-FR'}] 
})
export class ClientDetailsComponent implements OnInit {

  // RouterHistory
  previousRoute: string;
  // Utilisateur
  @Output() isUserIsConnected$: boolean = false;
  currentUtilisateur$: CurrentUtilisateur;
  cUtilisateur = new Subscription();
  utilisateur: Utilisateur = new Utilisateur();
  // Utilisateur connecte
  emailUserConnected: string;
  // Route Id
  idClientFromRoute: number;
  // parametre route observable
  idClientFromRouteObservable: any;
  isClientIsCancelled: boolean = false;
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

  clientRecupere: boolean = false;

  update_button_state: boolean = true;

  // Slider
  ts_Color: string = 'primary';
  slider_Commercials: boolean;
  slider_NLetter: boolean;
  slider_Sms: boolean;
  slider_Mail: boolean;

  // FormGroup
  clientFg: FormGroup;

  // Confirm Suppression
  userConfimSuppression: boolean = false;

  constructor(private logger: NGXLogger,
    public dialog: MatDialog,
    private _genreService: GenreService,
    private _clientService: ClientService,
    private _utilisateurService: UtilisateurService,
    private _historyRouting: HistoryRoutingService,
    private _authService: AuthService,
    private _toasterService: ToasterService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _cd: ChangeDetectorRef) {

    this.idClientFromRouteObservable = this._route.params.subscribe(
      res => { this.idClientFromRoute = res['idClient'] }
    )

    this.emailUserConnected = this._authService.getMailFromToken();
    this._utilisateurService.setCurrentUtilisateur(this.emailUserConnected);

  }

  ngOnInit() {
    // Historique de navigation stocke la route precedent afin de faire un BackPage
    this.previousRoute = this._historyRouting.getPreviousUrl();
    // this.getCurrentUtilisateur();
    // this.getGenreList();
    // this.getClientFromId(this.idClientFromRoute);

    this.clientFg = new FormGroup({
      clientNom: new FormControl('', [Validators.pattern('^[a-zA-Z-éè]+$'), Validators.required, Validators.maxLength(30)]),
      clientPrenom: new FormControl('', [Validators.pattern('^[a-zA-Z-éèç]+$'), Validators.required, Validators.maxLength(30)]),
      clientDateOfBirth: new FormControl({ value: null, disabled: true }),
      clientGenre: new FormControl({ value: '', disabled: false }, [Validators.required]),
      clientAdresseNumRue: new FormControl('', [Validators.pattern('^(0|[1-9][0-9]*)$'), Validators.maxLength(3)]),
      clientAdresseRue: new FormControl('', [Validators.pattern('^[a-zA-Z- éèêàç]+$'), Validators.maxLength(30)]),
      clientAdresseCodePostale: new FormControl('', [Validators.pattern('^(0|[1-9][0-9]*)$'), Validators.minLength(5)]),
      clientAdresseVille: new FormControl('', [Validators.pattern('^[a-zA-Z- ]+$'), Validators.maxLength(30)]),
      clientTelFix: new FormControl({ value: '', disabled: false }, [Validators.pattern('([0])[0-9]{9}'), Validators.minLength(10)]),
      clientTelMobil: new FormControl({ value: '', disabled: false }, [Validators.pattern('([0])([6]|[7])[0-9]{8}'), Validators.minLength(10)]),
      clientEmail: new FormControl({ value: '', disabled: false }, [CustomEmailValidator, Validators.maxLength(30),
        Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]
        // Validators.pattern()

      )

    })
  }

    /**
  * Recupere l utilisateur loggé
  */
 private async getCurrentUtilisateur() {

  this.logger.info("ClientDetailsComponent log : Recuperation du currentuser ");
  this.cUtilisateur = await this._utilisateurService.getObjCurrentUtilisateur
    .subscribe((cUtilisateur: CurrentUtilisateur) => { this.currentUtilisateur$ = cUtilisateur },
      () => {
        this.logger.error("ClientDetailsComponent log : La requete n a pas fonctionnée");
      });
}

  // Recupérér le rdv id xx
  /**
   * Recupere le rdv via son Id
   * @param idRdvFromRoute 
   */
  private getClientFromId(idClientFromRoute: number) {

    this.logger.info("ClientDetailsComponant log : récupereation du client id : " + idClientFromRoute);

    this._clientService.getClientByID(idClientFromRoute).subscribe(
      res => {
        this.client = res;
        this.clientRecupere = true;
        // this.attribuerLesValeursDuClientFromBddAuFormulaire();
        this._cd.markForCheck();
      },
      err => {
        err;
        let messageRdvNOk: string = "Recuperation idclient: " + this.idClientFromRoute + " échec";
        this.toasterMessage(messageRdvNOk, 'snackbarWarning', 5000);
        this.goHomePage();
        this.logger.error("rgpdService Log : Le rendez-vous n'a pas été Récupéré");
      }
    )

  }

  // attribuer les champs au formgroupe
  private attribuerLesValeursDuClientFromBddAuFormulaire(): void {

    // Clients
    this.clientFg.get('clientNom').setValue(this.client.nomClient);
    this.clientFg.get('clientPrenom').setValue(this.client.prenomClient);
    this.clientFg.get('clientDateOfBirth').setValue(this.client.dateAnniversaireClient);
    this.clientFg.get('clientTelFix').setValue(this.client.telephoneClient);
    this.clientFg.get('clientTelMobil').setValue(this.client.telMobileClient);
    this.clientFg.get('clientEmail').setValue(this.client.adresseMailClient);
    // Sliders
    this.slider_Mail = this.client.suscribedMailReminder.valueOf();
    this.slider_Sms = this.client.suscribedSmsReminder.valueOf();
    this.slider_NLetter = this.client.suscribedNewsLetter.valueOf();
    this.slider_Commercials = this.client.suscribedCommercials.valueOf();
    // Adresse Client
    this.clientFg.get('clientAdresseNumRue').setValue(this.client.adresse.numero.valueOf());
    this.clientFg.get('clientAdresseRue').setValue(this.client.adresse.rue.valueOf());
    this.clientFg.get('clientAdresseVille').setValue(this.client.adresse.ville.valueOf());
    this.clientFg.get('clientAdresseCodePostale').setValue(this.client.adresse.zipCode.valueOf());


    this.clientFg.get('clientGenre').setValue(this.client.genreClient.genreHum.valueOf());

  }



  /**
   * Ouvrir le Modal de Login
   */
  private openDialog(): void {

    const modalConf: MatDialogConfig = {
      hasBackdrop: true,
      disableClose:  true,
      data: { userConfimSuppression: this.userConfimSuppression,
              idClient: this.client.idClient }
    };

    this.logger.info("ClientDetailComponent Log : Valeur de userConfimSuppression : " + this.userConfimSuppression);
    this.logger.info("ClientDetailComponent Log : Ouverture du Modal ( Confimation suppression )");
    // let dialogRef = this.dialog.open(ConfirmRdvDetailsModalcomponent, modalLogin );
    let dialogRef = this.dialog.open(ConfirmClientDetailsModalComponent,  modalConf);

    dialogRef.afterClosed().subscribe( resultFromModal => {

      this.logger.info("ClientDetailComponent Log : Fermeture du Modal ( ConfirmAtion suppression )");
      this.logger.info("ClientDetailComponent Log : Valeur de userConfimSuppression : " + resultFromModal.userConfimSuppression);
      this.userConfimSuppression = resultFromModal.userConfimRdvSuppression;

      if (this.userConfimSuppression) {

        this.deleteAfterConfirmation(resultFromModal.idClient);

      } else {
        
        this.logger.info("RdvDetailComponent Log : Annulation de la deletion du rdv id: " + resultFromModal.idRdv);
      }

    });
  
 }


   /**
   * Effacer le rdv
   */
  private deleteAfterConfirmation(idClient: number) {  

    this.logger.info("RdvDetailsComponent log : Effacer le rdv id:" + idClient);
    this._clientService.deleteClient(idClient).subscribe(
      
      res => {},

      (err: HttpResponse<number>) => {

          if (err.status != 200) {

            this.toasterMessage("Le client id: " + idClient + " n'a pas été effacé", 'snackbarWarning', 3000);
            this.logger.error("RdvDetailsComponent log : Le Rdv id: " + idClient + " non éffacé");
          
          } else {

            this.toasterMessage("Client id: " + idClient +" éffacé",'snackbarInfo',3000);
            this.logger.info("clientDetailsComponent log : Le Client id: " + idClient + " éffacé");
            this._router.navigate(['./home']);

          }
      }  
    );

  }

  /**
   * Retourne un message d erreur sur le champs Date d anniversaire
   */
  public getDateErrorMessage() {

    return this.clientFg.get('clientDateOfBirth').getError('pattern') ? 'Date inalide - dd/mm/aaaa' :
      this.clientFg.get('clientDateOfBirth').getError('maxlength') ? '10 caractères maximum !' : '';

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
  private getGenreList(): void {

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
    if (this.slider_Commercials == true || this.slider_Mail == true
      || this.slider_NLetter == true) {

      this.clientFg.get('clientEmail').disable();
    }
    if (this.slider_Commercials == false && this.slider_Mail == false
      && this.slider_NLetter == false) {

      this.clientFg.get('clientEmail').enable();

    }

  }

  /**
   * Change la valeur du Slider NewsLetter
   */
  public onChangeTs_NewsLetter_Checked() {

    this.slider_NLetter = !this.slider_NLetter;

    if (this.slider_Commercials == true || this.slider_Mail == true
      || this.slider_NLetter == true) {

      this.clientFg.get('clientEmail').disable();
    }

    if (this.slider_Commercials == false && this.slider_Mail == false
      && this.slider_NLetter == false) {

      this.clientFg.get('clientEmail').enable();

    }

  }

  /**
   * Change la valeur du slider de rappel de Rdv par Sms
   */
  public onChangeTs_SmsRdvRemider_Checked() {

    this.slider_Sms = !this.slider_Sms;
    if (this.slider_Sms == true) {

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

    if (this.slider_Commercials == true || this.slider_Mail == true
      || this.slider_NLetter == true) {

      this.clientFg.get('clientEmail').disable();
    }

    if (this.slider_Commercials == false && this.slider_Mail == false
      && this.slider_NLetter == false) {

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
   * Ouvrir le popup de confirmation de suppression 
   */
  public eraseClient() {

    this.openDialog();

  }

    /**
  * Active / Desactive Boutton Sauvegarder
  */
 private toggleSaveButtonStatus() {    

  if ( this.update_button_state == true ) {

    this.update_button_state = !this.update_button_state;
    this.logger.info("RdvDetailComponent log : Activation du bouton Update");
  }

}

  /**
  * Ne pas modifier le Rdv en retournant a la page Home
  */
  public annulerLesModifications() {
    this.logger.info("ClientDetailsComponent log : Retour à la page home.")
    this._router.navigate(['./home']);
  }

  public updateClient():void {

  }

  /**
   * aller à la page Home
   */
  private goHomePage() {

    this._router.navigate(['./home']);
  }

  /**
   * pupup
   * @param snackMessage 
   * @param snackStyle 
   * @param snackTimer 
   */
  private toasterMessage(snackMessage: string, snackStyle: string, snackTimer: number): void {
    this._toasterService.showToaster(snackMessage, snackStyle, snackTimer)
  }

}


@Component({
  selector: 'app-confirmClientDetailsModal',
  templateUrl: '../confirm-clientDetails-modal/confirm-clientDetails-modal.component.html',
  styleUrls: ['../confirm-clientDetails-modal/confirm-clientDetails-modal.component.scss'],
  providers: [ NGXLogger]
})

export class ConfirmClientDetailsModalComponent implements OnInit {


  constructor( private logger: NGXLogger,
               public _authService: AuthService,
               public dialogRef: MatDialogRef<ConfirmClientDetailsModalComponent>,
               @Inject(MAT_DIALOG_DATA) public data: any) {

               } 
        
  ngOnInit() {

    this.logger.info("ConfirmClientDetailsModalComponent Log : Valeur d'origine de userConfimRdvSuppression : " 
        + this.data.userConfimRdvSuppression);

  }
  
  /**
   * mettre a true le boolean qui servira a confirmer la suppression du Rdv,
   * Fermer le Modal / Dialog
   */
  public okDelete() {
    this.data.userConfimRdvSuppression = true;
    this.logger.info("ConfirmRdvDetailsModalComponent Log : Nouvelle valeur de userConfimRdvSuppression : " 
        + this.data.userConfimRdvSuppression);
    this.dialogRef.close(this.data);
  }

  /**
   * Mettre a False le boolean qui servira a annuler la suppression du Rdv,
   * Fermer le Modal / Dialog
   */
  public cancelDeletion() {
    this.data.userConfimRdvSuppression = false;
    this.logger.info("ConfirmRdvDetailsModalComponent Log : Maintient de la Valeur de userConfimRdvSuppression : " 
        + this.data.userConfimRdvSuppression);
    this.dialogRef.close(this.data);
    
  }
              
}