import { Component, OnInit, Output } from '@angular/core';
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
import { PraticienService } from '../praticien/praticien.service';


// customValidator
export function CustomEmailValidator( control: AbstractControl ): {[key: string]: any} {

  return (control: AbstractControl): { [key: string]: any } => {

   return (control.value || '' ).trim().length == 0 ? { 'clientEmail': true } : null;

  };
};

@Component({
  selector: 'app-praticien-add',
  templateUrl: './praticien-add.component.html',
  styleUrls: ['./praticien-add.component.scss']
})
export class PraticienAddComponent implements OnInit {

  // RouterHistory
  previousRoute: string;
  // Utilisateur
  @Output() isUserIsConnected$: boolean = false;
  currentUtilisateur$: CurrentUtilisateur;
  cUtilisateur = new Subscription();
  utilisateur: Utilisateur = new Utilisateur();
  // Praticien
  praticien: Praticien = new Praticien();

  // Slider
  ts_Color: string = 'primary'; 

  slider_Sms: boolean = false;
  slider_Mail: boolean = false;

  // FormGroup
  praticienFg: FormGroup;
  
  constructor(private logger: NGXLogger,
              private _historyRouting: HistoryRoutingService,
              private _genreService: GenreService,
              private _praticienService: PraticienService,
              private _utilisateurService: UtilisateurService,
              private _router: Router,
              private _toasterService: ToasterService
              ) { }

  ngOnInit() {

        // Historique de navigation stocke la route precedent afin de faire un BackPage
        this.previousRoute = this._historyRouting.getPreviousUrl();

        this.getCurrentUtilisateur();
        this.praticienFg = new FormGroup({
          praticienNom: new FormControl( '', [Validators.pattern('^[a-zA-Z-éè]+$'), Validators.required, Validators.maxLength(30)]),
          praticienPrenom: new FormControl( '', [Validators.pattern('^[a-zA-Z-éèç]+$'),Validators.required, Validators.maxLength(30)]),
          praticienTelMobil: new FormControl({value: '', disabled: false}, [Validators.pattern('([0])([6]|[7])[0-9]{8}'), Validators.minLength(10)]),
          praticienEmail: new FormControl({value: '', disabled: false}, [CustomEmailValidator, Validators.maxLength(30), 
                        Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]
                        // Validators.pattern()
                        
                        )
                        
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
  public getIdNomErrorMessage(): string {
    return this.praticienFg.get('praticienNom').getError('required') ? 'Champs obligatoire' :
    this.praticienFg.get('praticienNom').getError('pattern') ? 'Charactères spéciaux : tiret autorisé' :
    this.praticienFg.get('praticienNom').getError('minlength') ? '1 caractère minimum !' : '';

  }

    /**
   * Recupere le message d erreur du control sur le champs TelFix
   */
  public getIdPrenomErrorMessage(): string {
    return this.praticienFg.get('praticienNom').getError('required') ? 'Champs obligatoire' :
    this.praticienFg.get('praticienPrenom').getError('pattern') ? 'Charactères spéciaux : tiret autorisé' :
    this.praticienFg.get('praticienPrenom').getError('minlength') ? '1 caractère minimum !' : '';
  }

  /**
   * Recupere le message d erreur du control sur le champs TelMobile
   */
  public getTelMobileErrorMessage(): string {
    return this.praticienFg.get('praticienTelMobil').getError('pattern') ? 'DoitCommencer par 06 ou 07' :
    this.praticienFg.get('praticienTelMobil').getError('minlength') ? 'Tel à 10 numéros !' : '';
  }

  /**
 * Recupere le message d erreur du control sur le champs Email
 */
  public getEmailErrorMessage(): string {

    return this.praticienFg.get('praticienEmail').getError('required') ? 'Email obligatoire' :
        this.praticienFg.get('praticienEmail').getError('email') ? 'Format d\'email non valide ( xyz@xyz.xyz)' :
        this.praticienFg.get('praticienEmail').getError('pattern') ? 'Format d\'email non valide  ( xyz@xyz.xyz)' :
        this.praticienFg.get('praticienEmail').getError('maxlength') ? '30 caractères maximum !' : '';

  }

   

  

  /**
   * Change la valeur du slider de rappel de Rdv par Sms
   */
  public onChangeTs_SmsRdvRemider_Checked() {
    
    this.slider_Sms = !this.slider_Sms;
    if ( this.slider_Sms == true) {

      this.praticienFg.get('praticienTelMobil').disable();

    } else {

      this.praticienFg.get('praticienTelMobil').enable();
    }
    
  }

  /**
   * Change la valeur du slider de rappel de Rdv par Mail
   */
  public onChangeTs_MailRdvReminder_Checked() {
    this.slider_Mail = !this.slider_Mail;

    if ( this.slider_Mail == true ) {

        this.praticienFg.get('praticienEmail').disable();
    } else {

      this.praticienFg.get('praticienEmail').enable();
    }

    if ( this.slider_Mail == false ) {


    }

  }  
  
  /**
   * persiste le nouveau client
   */
  public post(): void {

    this.logger.info("ClientAddComponent Log : Persistance du Nouveau Client");
    // IdClient --------
    this.praticien.nomPraticien = this.praticienFg.get('praticienNom').value;
    this.praticien.prenomPraticien = this.praticienFg.get('praticienPrenom').value;
    // tel Mobile
    this.praticien.teleMobilePraticien = this.praticienFg.get('praticienTelMobil').value;
    // Email
    this.praticien.adresseMailPraticien = this.praticienFg.get('praticienEmail').value;
    // Sliders --------
    // Slider 
    this.praticien.suscribedMailReminder = this.slider_Mail.valueOf();
    // Slider SMS
    this.praticien.suscribedSmsReminder = this.slider_Sms.valueOf();

    this._praticienService.post(this.praticien)

    .subscribe(
      res => {
        res;
        let messageOk: string = "Votre Praticien est enregistré";
        // this._router.navigate(['./home']);
        this.toasterMessage(messageOk,'snackbarInfo',5000);
        this.logger.info("PraticienAddComponent Log : Nouveau Praticien persisté");

      },
      err => {
        let messageNOk: string = "Il y a eu un problème, vérifiez les infos ..."
        this.toasterMessage(messageNOk,'snackbarWarning', 5000);
        this.logger.error("PraticienAddComponent Log : Le Praticien n'a pas été enregistré");
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

