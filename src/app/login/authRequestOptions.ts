import { Injectable } from '@angular/core';
import { BaseRequestOptions, RequestOptions } from '@angular/http';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';

const AUTH_HEADER_KEY = 'Authorization';
const AUTH_PREFIX = 'Bearer';

@Injectable()
 export class AuthRequestOptions implements HttpInterceptor { 

   constructor (public _authservice: AuthService) {}
   
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (req.headers.get("Content-Type") == 'application/x-www-form-urlencoded') {
      // console.log("AuthRequestOptions : header type =>  Content Type" ) 
      return next.handle(req);

    } else  {
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
