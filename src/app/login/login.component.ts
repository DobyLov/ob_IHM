import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AuthService } from '../login/auth.service'
import { Router } from '@angular/router';
import { Utilisateur } from '../utilisateur/utilisateur'
import { Credentials } from '../login/credentials';
import { Observable } from 'rxjs/Observable';
import { UtilisateurService } from '../utilisateur/utilisateur.service';
 
@Component({
  selector: 'app-login',
  templateUrl: '../login/login.component.html',
  styleUrls: ['../login/login.component.scss']
})

export class LoginComponent implements OnInit {

  constructor(private router: Router,
              public _authService: AuthService,
              public dialog: MatDialog) { }
  

	ngOnInit() {
				setTimeout(() => {
					this.openDialog()})
	}
  
  openDialog(): void {
    let dialogRef = this.dialog.open(LoginModalComponent, {
      width: '450px',
      data: {  }
    });

    // dialogRef.afterClosed().subscribe( result => {});
    this.openWelcomePage();
  }

	openWelcomePage() {
		this.router.navigate(['./welcome']);
  }
  
  openHomePage() {
		this.router.navigate(['./home']);
  }

  logout(){
    // this._authService.logOut(userMail);
    this.router.navigate(['./welcome']);
  }

}   
 
@Component({
    selector: 'app-loginModal',
    templateUrl: './login_modal/login.modal.html',
    styleUrls: ['./login_modal/login.modal.scss']
  })
  export class LoginModalComponent implements OnInit {
  
    // Masque par defaut la saisie du mot de passe
    hide = true;    
    loginForm: FormGroup;
    isUserIsConnected$: boolean;
    // isLogged$: Observable<boolean>;

    constructor(private router: Router,
                public _authService: AuthService,
                public dialogRef: MatDialogRef<LoginModalComponent>,
                public credz: Credentials,
                private _utilisateurservice: UtilisateurService,
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
    
    createFromGroup() {
      this.loginForm = new FormGroup ({
        mail: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(30), 
                                Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]),
        pwd: new FormControl('', [Validators.required, Validators.minLength(7), Validators.maxLength(30)]) }); 
    
    }
    
    getEmailErrorMessage() {
      return this.loginForm.get('mail').getError('required') ? 'Email obligatoire' :
          this.loginForm.get('mail').getError('email') ? 'Format d\'email non valide !! ( xyz@xyz.xyz)' :
          this.loginForm.get('mail').getError('pattern') ? 'Format d\'email non valide !! ( xyz@xyz.xyz)' :
          this.loginForm.get('mail').getError('maxlength') ? '30 caractères maximum !' :
							'';
    }

    getPwdErrorMessage() {
      return this.loginForm.get('pwd').getError('required') ? 'Mot de passe obligatoire' :
              this.loginForm.get('pwd').getError('minlength') ? '7 caractères minimum !' :
              this.loginForm.get('pwd').getError('maxlength') ? '30 caractères maximum !' :
              '';
    }    
  
    onNoClick() {		
      this.loginForm.reset();				
			this.dialogRef.close();
    }

    openForgottenPwd() {
			this.dialogRef.close();
      this.router.navigate(['./forgottenpwd']);
    }

    login() {
      let credz: Credentials = new Credentials();
      credz.email = this.loginForm.get('mail').value;
      credz.pwd = this.loginForm.get('pwd').value;
      this._authService.login(credz);
      
    }

    closeLoginModal() {
          this.loginForm.reset();
          this.dialogRef.close();
          this.router.navigate(['./welcome'])
      }
}
  

  