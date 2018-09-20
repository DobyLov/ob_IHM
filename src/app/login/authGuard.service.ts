import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { ToasterService } from '../service/toaster.service';
import { NGXLogger } from 'ngx-logger';


@Injectable()
export class AuthGuardService implements CanActivate {

  constructor( private logger: NGXLogger,
               private router: Router, 
               private authService: AuthService,
               private _toasterService: ToasterService) {}

  canActivate() {

    this.logger.info("AuthGuardService Log : Verifie le La validite du Token");

    if (!this.authService.isTokenDateIsExpired() == true) {

      this.logger.info("AuthGuardService Log : Le Token est valide");
      return true;

    } else {

      this.logger.info("AuthGuardService Log : Le Token n est pas valide");
    this._toasterService.showToaster("veuillez vous Connectez !", "snackbarWarning", 2500);
    this.authService.logOut;
    this.router.navigate(['/login']);
    return false;
    
    }
  }
}
