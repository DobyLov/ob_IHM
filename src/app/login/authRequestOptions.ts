import { Injectable } from '@angular/core';
import { BaseRequestOptions, RequestOptions } from '@angular/http';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';
import { AuthRgpdService } from '../rgpd/authRgpd.service';

const AUTH_HEADER_KEY = 'Authorization';
const AUTH_PREFIX = 'Bearer';

@Injectable()
 export class AuthRequestOptions implements HttpInterceptor { 

   constructor (public _authservice: AuthService,
                public _authrgpdservice: AuthRgpdService) {}
   
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

      if (req.headers.get("Content-Type") == 'application/x-www-form-urlencoded') {
        // console.log("AuthRequestOptions : header type =>  Content Type" ) 
        return next.handle(req);

      } else  {
        
        if (this.isRgpdSpecialStringIsInsideUrl()) {
          // si dans le contenu de l url il y a rgpd?tnk= execut ce bout de code
          // sinon procedure normale
          let rgpdToken: string = this._authrgpdservice.getRgpdTokenFromLS();
          let headers = new HttpHeaders().append("Authorization", "Bearer" +  rgpdToken);
          const newReq = req.clone({headers});
          return next.handle(newReq);

        } else {

          let extractMailFromToken = this._authservice.getMailFromToken();
          let tokenNamdGetter = this._authservice.getOBTokenFromLocalStorage(); 
          let headers = new HttpHeaders().append("Authorization", "Bearer" +  tokenNamdGetter);      
          // console.log("AuthRequestOptions : Header type => Authorisation : token => " + tokenNamdGetter );
          const newReq = req.clone({headers});
          // console.log("AuthRequestOptions : injection du Token dans le Header");
          return next.handle(newReq);
        } 
      }
  }

  private isRgpdSpecialStringIsInsideUrl(): Boolean {

    let isTknIsPresentIntoTheString: Boolean = false;
    let regex = new RegExp(`rgpd` + `\\?` + `tkn=`);
    if (window.location.href.toString().search(regex) != -1) {
      isTknIsPresentIntoTheString = true;
      // console.log("AuthGuardRgpdService : String present => rgpd?tkn=  : " + isTknIsPresentIntoTheString);    
    } else {
      isTknIsPresentIntoTheString = false;
      // console.log("AuthGuardRgpdService : String present => rgpd?tkn=  : " + isTknIsPresentIntoTheString);
    }
    return isTknIsPresentIntoTheString;
  }


}
