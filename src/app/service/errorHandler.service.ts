import { Injectable, ErrorHandler } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../login/auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService implements ErrorHandler {

  constructor( private logger: NGXLogger,
              private router: Router,
              private _authService: AuthService ) { }

  /**
   * 
   * @param error 
   */
  handleError(error: Error) {

    this.errorTypeDetector(error);
    
  }

  private errorTypeDetector(error: Error) {

    this.logger.info("ErrorHandlerService log : Detection du type d erreur.");

    if ( error.name == 'HttpErrorResponse' ) {

      this.errorTypeHttp(error);

    } else {

      this.logger.error("ErrorHandlerService log : Type d'erreur non reseignée dans le gestionnaire d'erreur"); 
    
      return error;
    }


  }

  /**
   * 
   * @param error 
   */
  private errorTypeHttp(error) {

    let errorHttp: HttpErrorResponse = error;
    this.logger.info("ErrorHandlerService log : message de l erreure : " + error.message);


    if (errorHttp.message.search("402 Forbidden") != -1) {

      this.logger.error("ErrorHandlerService log : Erreure de type authentification, le token doit etre expiré");
      this.logOut();


    } if (errorHttp.message.search("403 Forbidden") != -1) {

      this.logger.error("ErrorHandlerService log : Erreure de type authentification, le token doit etre expiré");
      this.logOut();

    // Serveur MW qui ne repond pas sur le reseau
    } if ( errorHttp.message.search( "(unknown url)" ) != -1) {

      this.logger.error("ErrorHandlerService log : Le serveur MiddleWare ne repond pas sur le réseau");
      this.goToWelcomePage();
    }

    // return error;
  }

  /**
   * Procedure de deconnexion de l'utilisateur non authorisé
   */
  private logOut(): void {

    this._authService.logOut(this._authService.getOBTokenViaMailFromLS);
    this.router.navigate(['./login']);
  }

  /**
   *  le serveur ne répond pas force le retour sur la home page
   */
  private goToWelcomePage(): void {

    this.router.navigate(['./welcome']);
    this._authService.logOut(this._authService.getMailFromToken());
    this._authService.changeStatusOfIsLogged(false);

  }

}
