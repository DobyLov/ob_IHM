import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthRgpdService } from './authRgpd.service';


@Injectable()
export class AuthGuardRgpdService implements CanActivate {

  url: string;
  // prenomClient: string;
  // emailClient: string;
  // idClient: number;
  // tokenExtracted: string;

  constructor(private router: Router,
              // private route: ActivatedRoute,
              private _authrgpdservice: AuthRgpdService) {

    // récuperation de l Url dans la barre de navigation
    this.url = window.location.href.toString();
    // console.log("AuthGuardRgpdService : Constructor : path : " + w
    console.log("AuthGuardRgpdService : Constructor : url : " + this.url);
  }
/**
 * directive pour acceder ou non a un page
 */
  canActivate() {
    // console.log("AuthGuardRgpdService : activate ok");

    if (this._authrgpdservice.searchRgpdTknStringInsideRgpdUrl(this.url)) {

      console.log("AuthGuardRgpdService : il y a un token dans l url :)");
      if (!this._authrgpdservice.rgpdTokenIntegrityChecker(this._authrgpdservice.urlRgpdTokenExtractor(this.url))) {
        console.log("AuthGuardRgpdService : le token fourni dans l Url n est pas integre :((")
        this.router.navigate(['./rgpdurlaltered']);
        // return false;

      } else if (this._authrgpdservice.isRgpdTokenDateIsValid((this._authrgpdservice.urlRgpdTokenExtractor(this.url)))) {
        console.log("AuthGuardRgpdService : Le token est valide :)");
        return true;
        this.router.navigate(['./rgpd']);
        

      } else {
        console.log("AuthGuardRgpdService : La date du token est perimee :(");
        this.router.navigate(['./rgpdtokenexpired']);
        console.log("AuthGuardRgpdService : pouete fin de methode Activate")
        // return false;
      }  

    } else {

      if (this._authrgpdservice.isRgpdTokenIsvalid(this._authrgpdservice.getRgpdTokenFromLS())) {
        return true;
      }

      if (this.url.search(new RegExp('/rgpdtokenexpired'))) {
          console.log("AuthGuardRgpd : redirection vers expired");
          this.router.navigate(['./rgpdtokenexpired']);
          // return false;

        } else {
          console.log("AuthGuardRgpdService : il n'y a pas tkn dans l url :)");
          this.router.navigate(['./rgpdpagenotfound']);
          // return false;
        }
    }
  }
}