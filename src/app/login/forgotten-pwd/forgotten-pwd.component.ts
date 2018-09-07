import { Component, OnInit, Inject } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-forgotten-pwd',
  templateUrl: './forgotten-pwd.component.html',
  styleUrls: ['./forgotten-pwd.component.scss'],
  providers: [ NGXLogger ]
})

export class ForgottenPwdComponent implements OnInit {

  emailForgottenPwd =' ';
  hide = true;

  constructor( private logger: NGXLogger,
               private dialog: MatDialog,
               private router: Router,) { }

  ngOnInit() { 
			    // open modal
					setTimeout(() => {
            this.logger.info("ForgottenPwdComponnent Log : Ouverture du Modal (Mot de passe oublie)");
            this.openDialog();
          })
  }
                 
  openDialog(): void {        
    let dialogRef = this.dialog.open(ForgottenPwdModalComponent, {
      maxWidth: '430px',
      maxHeight: '400px',
        })
    
  dialogRef.afterClosed().subscribe (result => {
      this.emailForgottenPwd = result,
      this.logger.info("ForgottenPwdComponnent Log : Fermeture du Modal (Mot de passe oublie)");
      this.router.navigate(['./login']) })
      
  }}


// ***********************************
// ************ Modals ***************
// ***********************************


@Component({
  selector: 'app-forgottenPwdmodal',
  templateUrl: './forgotten-pwd_modal/forgotten.pwd.modal.html',
  styleUrls: ['./forgotten-pwd_modal/forgotten.pwd.modal.scss'],
  providers: [ NGXLogger ]
})

export class ForgottenPwdModalComponent {
  
  constructor(  private logger: NGXLogger,
                private _authService: AuthService,
                public dialogRef: MatDialogRef<ForgottenPwdModalComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) {  }


  // ngOnInit() {  } 

  // controle
  emailForgottenPwd = new FormControl('', [Validators.required, Validators.email, Validators.maxLength(30), 
    Validators.pattern( /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)] );
  
    /**
     * Affiche le message d erreur lors de la saisie de l Email
     * @returns string
     */
  public getMailPwdErrorMessage(): string {
    return this.emailForgottenPwd.hasError('required') ? 'valeur obligatoire' :
        this.emailForgottenPwd.hasError('email') ? 'Format d\'email non valide ! (xyz@xyz.xyz)' :
        this.emailForgottenPwd.hasError('pattern') ? 'Format d\'email non valide ! (xyz@xyz.xyz)' :
        this.emailForgottenPwd.hasError('maxlength') ? '30 caractères maximum !' :
            '';
  }

  /**
   * Ferme le modal en cas de clic a l exterieur du Modal
   */
  private onNoClick(): void {
    this.logger.info("ForgottenPwdModal Log : Fermeture du Modal (Mot de passe oublie)");
    this.dialogRef.close();
  }

  /**
   * Fermeture du modal par clic sur la croix ou fermer
   */
  public closeModal() {
    this.logger.info("ForgottenPwdModal Log : Fermeture du Modal (Mot de passe oublie)");
    this.dialogRef.close();
  }

  /**
   * Envoyer l email au Middleware pour 
   * la reinitialisation du mot de passe
   */
  public transmitEMail():void {
    this.logger.info("ForgottenPwdModal Log : Mail " + this.emailForgottenPwd.value + "envoye au MiddleWare pour traitement")
    this._authService.resetPwd(this.emailForgottenPwd.value);
    this.dialogRef.close();   

  }

}
