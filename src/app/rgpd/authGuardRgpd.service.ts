import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Location } from '@angular/common';
import { AuthRgpdService } from './authRgpd.service';
import { NGXLogger } from 'ngx-logger';


@Injectable(
  { providedIn: 'root' }
)
export class AuthGuardRgpdService implements CanActivate {

  url: string;

  constructor( private logger: NGXLogger,
               private router: Router,
               private location: Location,
               private _authrgpdservice: AuthRgpdService) {

              // récuperation de l Url dans la barre de navigation
              this.url = this.location.path();
              this.logger.info("AuthGuardRgpdService : Recuperation de l url via Locate@AngularCommon");
  }

/**
 * Directive pour acceder ou Non à la page Rgpd
 * 
 */
  canActivate() {

    this.logger.info("AuthGuardRgpdService : Intervention de la methode Activate.");

    if (this._authrgpdservice.searchRgpdTknStringInsideRgpdUrl(this.url)) {

      this.logger.info("AuthGuardRgpdService : Il y bien un Token dans l URL.");
      
      if (!this._authrgpdservice.rgpdTokenIntegrityChecker(this._authrgpdservice.urlRgpdTokenExtractor(this.url))) {

        this.logger.error("AuthGuardRgpdService : Le Token fourni dans l URL n est pas integre");
        this.router.navigate(['./rgpdurlaltered']);
        // return false;

      } else if (this._authrgpdservice.isRgpdTokenDateIsValid((this._authrgpdservice.urlRgpdTokenExtractor(this.url)))) {
        
        this.logger.info("AuthGuardRgpdService : Le Token est valide.");
        return true;
        this.logger.info("AuthGuardRgpdService : Fin de la Methode Activate");
        this.router.navigate(['./rgpd']);
        

      } else {

        this.logger.info("AuthGuardRgpdService : La date du Token est perimee");
        this.logger.info("AuthGuardRgpdService : Fin de la Methode Activate");
        this.router.navigate(['./rgpdtokenexpired']);
        // return false;
      }  

    } else {

      if (this._authrgpdservice.isRgpdTokenIsvalid(this._authrgpdservice.getRgpdTokenFromLS())) {
        return true;
      }

      if (this.url.search(new RegExp('/rgpdtokenexpired'))) {
        this.logger.error("AuthGuardRgpdService : Redirection vers la page Lien Expire");
          this.router.navigate(['./rgpdtokenexpired']);
          // return false;

        } else {
          this.logger.error("AuthGuardRgpdService : Il n y a pas de Token dans l URL");
          this.router.navigate(['./rgpdpagenotfound']);
          // return false;
        }
    }
  }
}