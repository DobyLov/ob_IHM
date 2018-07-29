import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { ToasterService } from '../service/toaster.service';


@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(
    private router: Router, 
    private authService: AuthService,
    private _toasterService: ToasterService) {}

  canActivate() {
    // let isTokenIsExpired = this.authService.isTokenDateIsExpired();
    // console.log("authGard : presence du token : " + isTokenIsExpired);
    if (!this.authService.isTokenDateIsExpired() == true) {
      // console.log("authGard : canactivate : verifToken : Token is OK");
      return true;
    } else {
    // console.log("authGard : canactivate : token HS / tokenExpired");
    this._toasterService.showToaster("veuillez vous Connectez !", "snackbarWarning", 2500);
    this.router.navigate(['/login']);
    return false;
    }
  }
}
