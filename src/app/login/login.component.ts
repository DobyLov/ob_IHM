import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { LoginService } from '../login/login.service'
import { ToasterService } from '../service/toaster.service';

@Component({
  selector: 'app-login',
  templateUrl: '../login/login.component.html',
  styleUrls: ['../login/login.component.scss']
})
export class LoginComponent implements OnInit {

  emailForgottenPwd =' ';
  hide = true;
  pwd = '';

  // controles
  emailLogin = new FormControl('', [Validators.required, Validators.email]);
  
  constructor(private router: Router,
              public dialog: MatDialog,
              public _loginService: LoginService,
              private _toasterService: ToasterService) { }

      openDialog(): void {
        
        let dialogRef = this.dialog.open(ForgottenPwdModalComponent, {width: '350px'});
    
        dialogRef.afterClosed().subscribe(result => {
          this.emailForgottenPwd = result;
        });
      }
  

  getErrorMessage() {
    return this.emailLogin.hasError('required') ? 'valeur obligatoire' :
        this.emailLogin.hasError('email') ? 'Format d\'email non valide' :
            '';
  }

  ngOnInit() {}

  login(emailLogin, pwd) {

    this._loginService.login(emailLogin, pwd);
    this._toasterService.showToaster('helloworld');

  }
   openForgottenPwdModal() {
     this.openDialog();
   }

   closeForgottenPwdModal() {
    this.router.navigate(['./welcome']);
   }

   
}

// ***********************************
// ************ Modals ***************
// ***********************************


@Component({
  selector: 'app-forgottenPwdmodal',
  templateUrl: '../modal/forgotten-pwd_modal/forgotten.pwd.modal.html',
  styleUrls: ['../modal/forgotten-pwd_modal/forgotten.pwd.modal.scss']

})

export class ForgottenPwdModalComponent implements OnInit {

  hide = true;
  pwd = '';
  userIsConnected: boolean;  
  toggletext = "Saisir login et mot de passe pour s'authentitfier";
  
  constructor(  public _loginService: LoginService,
                private router: Router,
                public dialogRef: MatDialogRef<ForgottenPwdModalComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) {  }


  ngOnInit() {

  } 

  // controles
  emailForgottenPwd = new FormControl('', [Validators.required, Validators.email]);
  getErrorMessage() {
    return this.emailForgottenPwd.hasError('required') ? 'valeur obligatoire' :
        this.emailForgottenPwd.hasError('email') ? 'Format d\'email non valide' :
            '';
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  // Authentification 
  closeModal() {

    this.dialogRef.close();
  }

  transmitEMail(email) {
    console.log("loginComponent loginRenewPwd : " + email);
    this._loginService.resetPwd(email);
    this.dialogRef.close();

  }

}




