import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { LoginService } from '../login/login.service'
import { Router } from '@angular/router';
import { User } from '../login/user'
 
@Component({
  selector: 'app-login',
  templateUrl: '../login/login.component.html',
  styleUrls: ['../login/login.component.scss']
})

export class LoginComponent implements OnInit {
  
  constructor(private router: Router,
              public dialog: MatDialog,
							public _loginService: LoginService) { }

	ngOnInit() {
				// open modal
				setTimeout(() => {
					this.openDialog()})
	}
  
  openDialog(): void {
    let dialogRef = this.dialog.open(LoginModalComponent, {
      width: '450px',
      data: {  }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
		//    = result;
			
		this.openWelcomePage();
    });
  }

	openWelcomePage() {
		this.router.navigate(['./welcome']);
  }
  
  openHomePage() {
		this.router.navigate(['./home']);
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

    constructor(private router: Router,
                public _loginService: LoginService,
                public dialogRef: MatDialogRef<LoginModalComponent>,
                // private formBuilder: FormBuilder,
                @Inject(MAT_DIALOG_DATA) public data: any) { }
                					
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

    checkCredentials() {
      console.log("Le formaulaire de login est : " + this.loginForm.valid)
      let user: User = new User();
      user.email = this.loginForm.get('mail').value;
      user.pwd = this.loginForm.get('pwd').value;
      if(this.loginForm.valid) { 
        this._loginService.login(user);
      
      } else {
        this.loginForm.setValue(this.loginForm.get('mail').value,
                                null);

      }
    }

    closeLoginModal() {
          this.loginForm.reset();
          this.dialogRef.close();
          this.router.navigate(['./welcome'])
      }
}
  

  