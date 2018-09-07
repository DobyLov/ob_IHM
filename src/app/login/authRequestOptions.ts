import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';
import { AuthRgpdService } from '../rgpd/authRgpd.service';
import { NGXLogger } from 'ngx-logger';

// const AUTH_HEADER_KEY = 'Authorization';
// const AUTH_PREFIX = 'Bearer';

@Injectable()
 export class AuthRequestOptions implements HttpInterceptor { 

   constructor ( private logger: NGXLogger,
                 private _authservice: AuthService,
                 public _authrgpdservice: AuthRgpdService) {}

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
        
        if (this.isRgpdSpecialStringIsInsideUrl()) {

          this.logger.info("AuthRequestOptions Log : Injection du Token Rgpd dans la requete");
          let rgpdToken: string = this._authrgpdservice.getRgpdTokenFromLS();
          let headers = new HttpHeaders().append("Authorization", "Bearer" +  rgpdToken);
          const newReq = req.clone({headers});
          return next.handle(newReq);

        } else {

          let tokenNamdGetter = this._authservice.getOBTokenFromLocalStorage(); 
          let headers = new HttpHeaders().append("Authorization", "Bearer" +  tokenNamdGetter);  
          this.logger.info("AuthRequestOptions Log : Injection du Token Utilisateur/Praticien dans la requete"); 
          const newReq = req.clone({headers});
          return next.handle(newReq);
          
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


}
