import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';
import { AuthRgpdService } from '../rgpd/authRgpd.service';
import { NGXLogger } from 'ngx-logger';
import { Router } from '@angular/router';

// const AUTH_HEADER_KEY = 'Authorization';
// const AUTH_PREFIX = 'Bearer';

@Injectable()
 export class AuthRequestOptions implements HttpInterceptor { 

   constructor ( private logger: NGXLogger,
                 private _authservice: AuthService,
                 public _authrgpdservice: AuthRgpdService,
                 private router: Router ) {}

    /**
     * Intercepte les requètes pour les filtrer:
     * Si la requète intercptée avec un Header contenant "Content-Type" => la laisse tel quelle.
     *    Si regex detectee injecte le Token correspondant Rgpd ou non.
     *    Puis clone la requète et remplace le Header par "Authorization" type "Bearer" et insere le Token.
     * @param req 
     * @param next
     * @returns Observable<HttpEvent<any>> 
     */
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

      this.logger.info("AuthRequestOptions Log : Interception de la requete.")
      if (req.headers.get("Content-Type") == 'application/x-www-form-urlencoded') {

        this.logger.info("AuthRequestOptions Log : Requete de Login detectee  = Content-Type => (Application/x-www-form-urlencoded)");
        return next.handle(req);

      } else  {
        

        if ( this.isRgpdSpecialStringIsInsideUrl() ) {

          this.logger.info("AuthRequestOptions Log : Injection du Token RGPD dans la requete");
          let rgpdToken: string = this._authrgpdservice.getRgpdTokenFromLS();
          let headers = new HttpHeaders().append("Authorization", "Bearer" +  rgpdToken);
          const newReq = req.clone({headers});
          return next.handle(newReq);

        } else {

          if ( this.chercheTokenDansLS ) {
            this.logger.info("AuthRequestoption log : Il y a bien un token dans le LS");

            if ( this.tokenIsValid ) {

              this.logger.info("AuthRequestoption log : Le token trouvé dans le Ls est valide.");

              let tokenNamdGetter = this._authservice.getOBTokenFromLocalStorage(); 
              let headers = new HttpHeaders().append("Authorization", "Bearer" +  tokenNamdGetter);  
              this.logger.info("AuthRequestOptions Log : Injection du Token Utilisateur/Praticien dans la requete"); 
              const newReq = req.clone({headers});
              return next.handle(newReq);

            } else {

              this.logger.info("AuthRequestoption log : Le token trouvé n'est plus valide.");
              this._authservice.logOut(this._authservice.getMailFromToken());
              this.router.navigate(['/login']);

            }

          } else  {

            this.logger.info("AuthRequestoption log : Il n'y a pas de token dans le LS");
            this._authservice.logOut(this._authservice.getMailFromToken());
            this.router.navigate(['/login']);

          }          
        } 
      }
  }

  /**
   * Filtre l Url du browser avec le regex "rgpd?tkn="
   * @returns boolean
   */
  private isRgpdSpecialStringIsInsideUrl(): Boolean {
    this.logger.info("AuthRequestOptions Log : Detection de la chaine ( rgpd?tkn= ) dans l URL du browser");
    let isTknIsPresentIntoTheString: Boolean = false;
    let regex = new RegExp(`rgpd` + `\\?` + `tkn=`);
    if (window.location.href.toString().search(regex) != -1) {

      isTknIsPresentIntoTheString = true;
      this.logger.info("AuthRequestOptions Log : Chaine ( rgpd?token= ) detectee");

    } else {
      
      isTknIsPresentIntoTheString = false;
      this.logger.info("AuthRequestOptions Log : Chaine ( rgpd?token= ) non detectee");

    }

    return isTknIsPresentIntoTheString;
  }

  /**
   * Retourne un boolean si un token est trouve dans le LS
   * @returns boolean
   */
  private chercheTokenDansLS(): boolean {

    if ( this._authservice.IsThereAnObtknInLs() ) {

      return true;

    } else {

      return false;

    }
  }

  /**
   * Retourne un boolean de la validite du token
   * @returns boolean
   */
  private tokenIsValid(): boolean {

    if ( this._authservice.isTokenDateIsValid()) {

      return true;

    } else  {

      this._authservice.removeGivenTokenFromLS(this._authservice.getMailFromToken());

      return false;

    }

  }


}
