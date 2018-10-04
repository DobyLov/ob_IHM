import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { ToasterService } from '../service/toaster.service';
import { NGXLogger } from 'ngx-logger';


@Injectable()
export class AuthGuardService implements CanActivate {

  constructor( private logger: NGXLogger,
               private router: Router, 
               private _authService: AuthService,
               private _toasterService: ToasterService) {}

  canActivate() {

    this.logger.info("AuthGuardService Log : Verifie le La validite du Token");

    if (!this._authService.isTokenDateIsNotExpired() == true) {

      this.logger.info("AuthGuardService Log : Le Token est valide");
      return true;

    } else {

      this.logger.info("AuthGuardService Log : Le Token n est pas valide");
      this._toasterService.showToaster("Veuillez vous Connectez !", "snackbarWarning", 2500);    
      this._authService.logOut(this._authService.getMailFromToken());
      this.router.navigate(['/login']);
      return false;
    
    }
  }
}
