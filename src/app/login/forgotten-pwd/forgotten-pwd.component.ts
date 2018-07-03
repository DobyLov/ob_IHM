import { Component, OnInit, Inject } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-forgotten-pwd',
  templateUrl: './forgotten-pwd.component.html',
  styleUrls: ['./forgotten-pwd.component.scss']
})

export class ForgottenPwdComponent implements OnInit {

  emailForgottenPwd =' ';
  hide = true;

  constructor(public dialog: MatDialog,
              private router: Router,) { }

  ngOnInit() { 
			    // open modal
					setTimeout(() => {
            this.openDialog();
          })
  }
                 
  openDialog(): void {        
    let dialogRef = this.dialog.open(ForgottenPwdModalComponent, 
        {width: '450px'})
    
  dialogRef.afterClosed().subscribe (result => {
      this.emailForgottenPwd = result,
      this.router.navigate(['./login']) })
      
  }}


// ***********************************
// ************ Modals ***************
// ***********************************


@Component({
  selector: 'app-forgottenPwdmodal',
  templateUrl: './forgotten-pwd_modal/forgotten.pwd.modal.html',
  styleUrls: ['./forgotten-pwd_modal/forgotten.pwd.modal.scss']
})

export class ForgottenPwdModalComponent {
  
  constructor(  
                // public _loginService: LoginService,
                public _authService: AuthService,
                private router: Router,
                public dialogRef: MatDialogRef<ForgottenPwdModalComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) {  }


  // ngOnInit() {  } 

  // controle
  emailForgottenPwd = new FormControl('', [Validators.required, Validators.email, Validators.maxLength(30), 
    Validators.pattern( /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)] );
  
  getMailPwdErrorMessage() {
    return this.emailForgottenPwd.hasError('required') ? 'valeur obligatoire' :
        this.emailForgottenPwd.hasError('email') ? 'Format d\'email non valide ! (xyz@xyz.xyz)' :
        this.emailForgottenPwd.hasError('pattern') ? 'Format d\'email non valide ! (xyz@xyz.xyz)' :
        this.emailForgottenPwd.hasError('maxlength') ? '30 caractères maximum !' :
            '';
  }

  onNoClick(): void {
    
    this.dialogRef.close();
  }
  // Authentification 
  closeModal() {
    this.dialogRef.close();
  }

  transmitEMail() {
    console.log("transmitEMail : " + this.emailForgottenPwd.value);
    this._authService.resetPwd(this.emailForgottenPwd.value);
    this.dialogRef.close();   

  }

}
