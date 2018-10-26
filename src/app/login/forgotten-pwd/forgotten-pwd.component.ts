import { Component, OnInit, Inject } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogConfig } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';
import { ResponsiveAppMediaService } from '../../service/responsiveAppMedia.service';
import { BreakpointObserver } from '../../../../node_modules/@angular/cdk/layout';

@Component({
  selector: 'app-forgotten-pwd',
  templateUrl: './forgotten-pwd.component.html',
  styleUrls: ['./forgotten-pwd.component.scss'],
  providers: [ NGXLogger ]
})

export class ForgottenPwdComponent implements OnInit {

  // parametres des champs du modal
  emailForgottenPwd =' ';
  hide = true;

  // Taille du Modal
  modalWidth: number = 430;
  modalHeight: number = 400; 
  // infos pour definir le modal
  isDeviceIsMobile: boolean;
  isMobileOrientationLandscape: boolean;

  constructor( private logger: NGXLogger,
               private dialog: MatDialog,
               private router: Router,
               private _responsivappmediaservice: ResponsiveAppMediaService,
              public _breakpointobserver: BreakpointObserver ) { 

              this._responsivappmediaservice.isAMobilePlatform$
              .subscribe(res => { this.isDeviceIsMobile = res.valueOf()})            

              const layoutChanges = _breakpointobserver.observe(
                '(orientation: portrait)'
              );
              
              layoutChanges.subscribe(result => {
                this.logger.info("Logincomponent log : mode " + result.matches)
              });

              this.setModalMobilResolution();
               }

  ngOnInit() { 
			    // open modal
					setTimeout(() => {
            this.logger.info("ForgottenPwdComponnent Log : Ouverture du Modal (Mot de passe oublie)");
            this.openDialog();
          })
  }

  /**
   * Defini les dimensions du modal
   * en fonction du Device detecte
   */
  private setModalMobilResolution() {

    if (this.isDeviceIsMobile == true ) {
      this.logger.info("LoginComponent Log : UI sur Terminal mobile");
      this.modalWidth = 330;
      this.modalHeight = 370;
   } else {
      this.logger.info("LoginComponent Log : Ui sur Desktop ");
   }
  }
                 
  openDialog(): void {    
    
    const modalForgottenPwd: MatDialogConfig = {
      id: '2',
      hasBackdrop: true,
      disableClose:  true,
      width: this.modalWidth + 'px',
      maxHeight: this.modalHeight + 'px'
    }

    let dialogRef = this.dialog.open(ForgottenPwdModalComponent, modalForgottenPwd)
    
    dialogRef.afterClosed().subscribe (result => {
        this.emailForgottenPwd = result,
        this.logger.info("ForgottenPwdComponnent Log : Fermeture du Modal (Mot de passe oublie)");
        this.router.navigate(['./login']) })
        
  }
}


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
        this.emailForgottenPwd.hasError('email') ? 'Format d\'email non valide !' :
        this.emailForgottenPwd.hasError('pattern') ? 'Format d\'email non valide !' :
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
