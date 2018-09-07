import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AuthService } from './auth.service'
import { Router } from '@angular/router';
import { Credentials } from './credentials';
import { NGXLogger } from 'ngx-logger';
 
@Component({
  selector: 'app-login',
  templateUrl: '../login/login.component.html',
  styleUrls: ['../login/login.component.scss'],
  providers: [ NGXLogger ]
})

export class LoginComponent implements OnInit {

  constructor( private logger: NGXLogger,
               private router: Router,
               public dialog: MatDialog) { }
  

	ngOnInit() {
				setTimeout(() => {
					this.openDialog()})
	}
  
  /**
   * Ouvrir le Modal de Login
   */
  openDialog(): void {
    this.logger.info("LoginComponent Log : Ouverture du Modal ( Login )");
    let dialogRef = this.dialog.open(LoginModalComponent, {
      width: '430px',
      maxHeight: '400px',
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
  private openHomePage(): void {
		this.router.navigate(['./home']);
  }

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
  

  