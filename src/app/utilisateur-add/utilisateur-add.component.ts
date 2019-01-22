import { Component, OnInit, Output } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { HistoryRoutingService } from '../service/historyRouting.service';
import { Router } from '@angular/router';
import { ToasterService } from '../service/toaster.service';
import { FormControl, Validators, FormGroup, AbstractControl } from '@angular/forms';
import { CurrentUtilisateur } from '../login/currentUtilisateur';
import { Subscription } from 'rxjs';
import { Utilisateur } from '../utilisateur/utilisateur';
import { UtilisateurService } from '../utilisateur/utilisateur.service';
import { RolesUtilisateur } from '../roles/rolesUtilisateur';
import { RolesUtilisateurService } from '../roles/rolesUtilisateur.service';
import { MatOptionSelectionChange } from '@angular/material';

// customValidator
export function CustomEmailValidator( control: AbstractControl ): {[key: string]: any} {

  return (control: AbstractControl): { [key: string]: any } => {

   return (control.value || '' ).trim().length == 0 ? { 'clientEmail': true } : null;

  };
};

@Component({
  selector: 'app-utilisateur-add',
  templateUrl: './utilisateur-add.component.html',
  styleUrls: ['./utilisateur-add.component.scss']
})
export class UtilisateurAddComponent implements OnInit {

  // RouterHistory
  previousRoute: string;
  // Utilisateur
  @Output() isUserIsConnected$: boolean = false;
  currentUtilisateur$: CurrentUtilisateur;
  cUtilisateur = new Subscription();
  utilisateur: Utilisateur = new Utilisateur();
  // Utilisateur
  user: Utilisateur = new Utilisateur();
  // Slider
  ts_Color: string = 'primary';
  slider_Sms: boolean = false;
  slider_Mail: boolean = false;
  slider_Erasable: boolean = false;
  disable_Erasable_toggle: boolean = true;
  // FormGroup
  utilisateurFg: FormGroup;
  // roles
  userRoles: RolesUtilisateur = new RolesUtilisateur();
  roles: RolesUtilisateur;
  rolesList: RolesUtilisateur[];
  
  constructor(private logger: NGXLogger,
              private _historyRouting: HistoryRoutingService,
              private _rolesServices: RolesUtilisateurService,
              private _utilisateurService: UtilisateurService,
              private _router: Router,
              private _toasterService: ToasterService
              ) { }

  ngOnInit() {

        // Historique de navigation stocke la route precedent afin de faire un BackPage
        this.previousRoute = this._historyRouting.getPreviousUrl();
        this.getRolesList();
        this.getCurrentUtilisateur();
        this.utilisateurFg = new FormGroup({
          utilisateurNom: new FormControl( '', [Validators.pattern('^[a-zA-Z-éè]+$'), Validators.required, Validators.maxLength(30)]),
          utilisateurPrenom: new FormControl( '', [Validators.pattern('^[a-zA-Z-éèç]+$'),Validators.required, Validators.maxLength(30)]),
          utilisateurTelMobil: new FormControl({value: '', disabled: false}, [Validators.pattern('([0])([6]|[7])[0-9]{8}'), Validators.minLength(10)]),
          utilisateurRoles: new FormControl({value: '', disabled: false}, [Validators.required] ),
          utilisateurEmail: new FormControl({value: '', disabled: false}, [CustomEmailValidator, Validators.required, Validators.maxLength(30), 
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
    return this.utilisateurFg.get('utilisateurNom').getError('required') ? 'Champs obligatoire' :
    this.utilisateurFg.get('utilisateurNom').getError('pattern') ? 'Charactères spéciaux : tiret autorisé' :
    this.utilisateurFg.get('utilisateurNom').getError('minlength') ? '1 caractère minimum !' : '';

  }

    /**
   * Recupere le message d erreur du control sur le champs TelFix
   */
  public getIdPrenomErrorMessage(): string {
    return this.utilisateurFg.get('utilisateurNom').getError('required') ? 'Champs obligatoire' :
    this.utilisateurFg.get('utilisateurPrenom').getError('pattern') ? 'Charactères spéciaux : tiret autorisé' :
    this.utilisateurFg.get('utilisateurPrenom').getError('minlength') ? '1 caractère minimum !' : '';
  }

  /**
   * Recupere le message d erreur du control sur le champs TelMobile
   */
  public getTelMobileErrorMessage(): string {
    return this.utilisateurFg.get('utilisateurTelMobil').getError('pattern') ? 'DoitCommencer par 06 ou 07' :
    this.utilisateurFg.get('utilisateurTelMobil').getError('minlength') ? 'Tel à 10 numéros !' : '';
  }

  /**
 * Recupere le message d erreur du control sur le champs Email
 */
  public getEmailErrorMessage(): string {

    return this.utilisateurFg.get('utilisateurEmail').getError('required') ? 'Email obligatoire' :
        this.utilisateurFg.get('utilisateurEmail').getError('email') ? 'Format d\'email non valide ( xyz@xyz.xyz)' :
        this.utilisateurFg.get('utilisateurEmail').getError('pattern') ? 'Format d\'email non valide  ( xyz@xyz.xyz)' :
        this.utilisateurFg.get('utilisateurEmail').getError('maxlength') ? '30 caractères maximum !' : '';

  }

  /**
   * Récuperation de la liste des roles
   */
  private getRolesList():void {

    this._rolesServices.getRolesList().subscribe(
      (roles: RolesUtilisateur[]) => {
        this.rolesList = roles;
      }
    )
  }  

  public rolesSelectionnne(event: MatOptionSelectionChange, selectedeRoles: RolesUtilisateur) {


    if (event.source.selected) {
      this.logger.info("UtilisateurAddComponent log : role selectionné id: " + selectedeRoles.idRoles);
      this.utilisateurFg.get('utilisateurRoles').setValue(selectedeRoles.idRoles);
      this.logger.info("UtilisateurAddComponent log : role selectionné Fcontrol : " + this.utilisateurFg.get('utilisateurRoles').value);
      this.userRoles.idRoles = selectedeRoles.idRoles;
      if ( this.utilisateurFg.get('utilisateurRoles').value == 1 
      || this.utilisateurFg.get('utilisateurRoles').value == 2) {

          this.slider_Erasable = false;
          this.disable_Erasable_toggle = true;

      } else {

          this.disable_Erasable_toggle = false;
    
      }
  }  



  }

  /**
   * Change la valeur du slider de rappel de Rdv par Sms
   */
  public onChangeTs_SmsRdvRemider_Checked() {
    
    this.slider_Sms = !this.slider_Sms;
    if ( this.slider_Sms == true) {

      this.utilisateurFg.get('utilisateurTelMobil').disable();

    } else {

      this.utilisateurFg.get('utilisateurTelMobil').enable();
    }
    
  }

  /**
   * Change la valeur du slider de rappel de Rdv par Mail
   */
  public onChangeTs_MailRdvReminder_Checked() {

    this.slider_Mail = !this.slider_Mail;

    if ( this.slider_Mail == true ) {

        this.utilisateurFg.get('utilisateurEmail').disable();
    } else {

      this.utilisateurFg.get('utilisateurEmail').enable();
    }

  }  

  onChangeTs_DisableErasable_Checked() {

    this.slider_Erasable = !this.slider_Erasable;

    if ( this.slider_Erasable == true ) {

      this.utilisateurFg.get('utilisateurRoles').disable();   

    } else {

      this.utilisateurFg.get('utilisateurRoles').enable();

    }

  }
  
  /**
   * persiste le nouveau client
   */
  public post(): void {

    this.logger.info("ClientAddComponent Log : Persistance du Nouveau Client");
    // IdClient --------
    this.utilisateur.nomUtilisateur = this.utilisateurFg.get('utilisateurNom').value;
    this.utilisateur.prenomUtilisateur = this.utilisateurFg.get('utilisateurPrenom').value;
    // tel Mobile
    this.utilisateur.teleMobileUtilisateur = this.utilisateurFg.get('utilisateurTelMobil').value;
    // Email
    this.utilisateur.adresseMailUtilisateur = this.utilisateurFg.get('utilisateurEmail').value;
    // Sliders
    this.utilisateur.suscribedMailReminder = this.slider_Mail.valueOf();
    // Slider SMS
    this.utilisateur.suscribedSmsReminder = this.slider_Sms.valueOf();
    // Slider is utilisateur can be Erased
    this.utilisateur.compteEffacable = this.slider_Erasable.valueOf();
    this.utilisateur.isLogged = null;
    // Roles
    // this.userRoles.idRoles = this.utilisateurFg.get('utilisateurRoles').value;
    this.utilisateur.rolesUtilisateur = this.userRoles;this.logger.info("UtilisateurAddComponent Log : Role a persister : " + JSON.stringify(this.userRoles));
    this.logger.info("UtilisateurAddComponent Log : Utilisateur a persister : " + JSON.stringify(this.utilisateur));
    this._utilisateurService.post(this.utilisateur)

    .subscribe(
      res => {
        res;
        let messageOk: string = "Votre utilisateur est enregistré";
        // this._router.navigate(['./home']);
        this.toasterMessage(messageOk,'snackbarInfo',5000);
        this.logger.info("UtilisateurAddComponent Log : Nouveau utilisateur persisté");

      },
      err => {
        let messageNOk: string = "Il y a eu un problème, vérifiez les infos ..."
        this.toasterMessage(messageNOk,'snackbarWarning', 5000);
        this.logger.error("UtilisateurAddComponent Log : Le utilisateur n'a pas été enregistré");
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
