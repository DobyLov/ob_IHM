import { Injectable } from '@angular/core';
import { ActivatedRoute, CanActivate, Router } from '@angular/router';
import { AuthRgpdService } from '../rgpd/authRgpd.service';


@Injectable()
export class AuthGuardRgpdService implements CanActivate {

  url: string;
  prenomClient: string;
  emailClient: string;
  idClient: number;
  tokenExtracted: string;

  constructor(private router: Router,
              private route: ActivatedRoute,
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

    if (this._authrgpdservice.searchTknStringInsideRgpdUrl(this.url)) {

      console.log("AuthGuardRgpdService : il y a un token dans l url :)");
      if (!this._authrgpdservice.tokenIntegrityChecker(this._authrgpdservice.urlTokenExtractor(this.url))) {
        console.log("AuthGuardRgpdService : le token fourni dans l Url n est pas integre :((")
        this.router.navigate(['./rgpdurlaltered']);
      }

      if (this._authrgpdservice.tokenDateValidator((this._authrgpdservice.urlTokenExtractor(this.url)))) {
        console.log("AuthGuardRgpdService : La date du token est valide :)");
        this.router.navigate(['./rgpd']);
        return true;
      
      } else {
        console.log("AuthGuardRgpdService : La date du token est perimee :(");
        this.router.navigate(['./rgpdtokenexpired']);
        console.log("AuthGuardRgpdService : pouete fin de methode Activate")
        return false;
      }
      
    } else {
      console.log("AuthGuardRgpdService : il n'y a pas tkn dans l url :)");
      this.router.navigate(['./rgpdpagenotfound']);
      return false;
    }
  }
}