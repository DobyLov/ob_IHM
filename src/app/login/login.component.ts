import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AuthService } from './auth.service'
import { Router } from '@angular/router';
import { Credentials } from './credentials';
import { NGXLogger } from 'ngx-logger';
import { ResponsiveAppMediaService } from '../service/responsiveAppMedia.service';
import { BreakpointObserver } from '../../../node_modules/@angular/cdk/layout';
 
@Component({
  selector: 'app-login',
  templateUrl: '../login/login.component.html',
  styleUrls: ['../login/login.component.scss'],
  providers: [ NGXLogger ]
})

export class LoginComponent implements OnInit {

  // Taille du Modal
  modalWidth: number = 430;
  modalHeight: number = 400; 
  // options supplementaires du modal
  isDeviceIsMobile: boolean;
  isMobileOrientationLandscape: boolean;

  constructor( private logger: NGXLogger,
               private router: Router,               
               private _responsivappmediaservice: ResponsiveAppMediaService,
               public dialog: MatDialog,
               public _breakpointobserver: BreakpointObserver ) { 

                this._responsivappmediaservice.isAMobilePlatform$
                  .subscribe(res => { this.isDeviceIsMobile = res.valueOf()})
                
                this.setModalMobilResolution()

                const layoutChanges = _breakpointobserver.observe(
                  '(orientation: portrait)'
                );
                
                layoutChanges.subscribe(result => {
                  this.logger.info("Logincomponent log : mode " + result.matches)
                });

               }
              


	ngOnInit() {
				setTimeout(() => {
					this.openDialog()})
  }
  
  /**
   * Defini les dimensions du modal
   * en fonction du Device detecte
   */

  private setModalMobilResolution() {

    if (this.isDeviceIsMobile == true ) {
      this.logger.info("LoginComponent Log : UI sur Terminal mobile");
      this.modalWidth = 330;
      this.modalHeight = 300;
   } else {
      this.logger.info("LoginComponent Log : Ui sur Desktop ");
   }
  }
  
  /**
   * Ouvrir le Modal de Login
   */
  openDialog(): void {
    this.logger.info("LoginComponent Log : Ouverture du Modal ( Login )");
    let dialogRef = this.dialog.open(LoginModalComponent, {
      width: this.modalWidth + 'px',
      maxHeight: this.modalHeight + 'px',
      data: {  }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.logger.info("LoginComponent Log : Fermeture du Modal ( Login )");
    });
  
    // dialogRef.afterClosed().subscribe( result => {});
    this.openWelcomePage();

    
  }

  /**
   * Ouvre la page d accueil Welcom
   */
	private openWelcomePage(): void {
		this.router.navigate(['./welcome']);
  }
  
  /**
   * Ouvre la page home
   */
  // private openHomePage(): void {
	// 	this.router.navigate(['./home']);
  // }

  /**
   * Deconnexion de l utilisateur
   */
  public logout(): void {
    // this._authService.logOut(userMail);
    this.router.navigate(['./welcome']);
  }

}   
 
@Component({
    selector: 'app-loginModal',
    templateUrl: './login_modal/login.modal.html',
    styleUrls: ['./login_modal/login.modal.scss'],
    providers: [ NGXLogger]
  })
  export class LoginModalComponent implements OnInit {
  
    // Masque par defaut la saisie du mot de passe
    hide = true;    
    loginForm: FormGroup;
    isUserIsConnected$: boolean;
    isPortrait: boolean;
    isLandscape: Boolean;

    constructor( private logger: NGXLogger,
                 private router: Router,
                 public _authService: AuthService,
                 public dialogRef: MatDialogRef<LoginModalComponent>,
                 public credz: Credentials,
                 @Inject(MAT_DIALOG_DATA) public data: any) {

                this._authService.statusOfIsUserIsLogged.subscribe(isLoggedIn => {
                  this.isUserIsConnected$ = isLoggedIn.valueOf();
                  if (this.isUserIsConnected$ === true) {
                      this.dialogRef.close();
                  } 
                })
 
                }
                					
		ngOnInit() {
    
      this.createFromGroup();

    }
    
    /**
     * Creation du FormGroup / des FormControls pour la validation des champs login
     */
    private createFromGroup(): void {
      this.loginForm = new FormGroup ({
        mail: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(30), 
                                Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]),
        pwd: new FormControl('', [Validators.required, Validators.minLength(7), Validators.maxLength(30)]) }); 
    
    }
    
    /**
     * Recupere le message d erreur du control sur le champs Email
     */
    private getEmailErrorMessage(): string {
      return this.loginForm.get('mail').getError('required') ? 'Email obligatoire' :
          this.loginForm.get('mail').getError('email') ? 'Format d\'email non valide !! ( xyz@xyz.xyz)' :
          this.loginForm.get('mail').getError('pattern') ? 'Format d\'email non valide !! ( xyz@xyz.xyz)' :
          this.loginForm.get('mail').getError('maxlength') ? '30 caractères maximum !' :
							'';
    }

    /**
     * * Recupere le message d erreur du control sur le champs pwd
     */
    private getPwdErrorMessage(): string {
      return this.loginForm.get('pwd').getError('required') ? 'Mot de passe obligatoire' :
              this.loginForm.get('pwd').getError('minlength') ? '7 caractères minimum !' :
              this.loginForm.get('pwd').getError('maxlength') ? '30 caractères maximum !' :
              '';
    }    
  
    /**
     * Ferme le Modal de Login si clic exterieur de la fenetre
     */
    onNoClick(): void {	
      this.logger.info("LoginModalComponent Log : Fermeture du Modal ( Login )");	
      this.loginForm.reset();				
			this.dialogRef.close();
    }

    /**
     * ouvre le Modal de mot de pass oublie 
     */
    public openForgottenPwd(): void {
			this.dialogRef.close();
      this.router.navigate(['./forgottenpwd']);
    }

    /**
     * Envoi les Credentiels au MiddleWare
     */
    public login(): void {
      let credz: Credentials = new Credentials();
      credz.email = this.loginForm.get('mail').value;
      credz.pwd = this.loginForm.get('pwd').value;
      this._authService.login(credz);
      
    }

    /**
     * Ferme le Modal ( Login )
     */
    public closeLoginModal(): void {
          this.loginForm.reset();
          this.dialogRef.close();
          this.router.navigate(['./welcome'])
      }
}
  

  