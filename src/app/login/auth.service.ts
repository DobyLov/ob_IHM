import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import * as jwt_decode from 'jwt-decode';
// a suppr
import {default as decode} from 'jwt-decode';


export const TOKEN_NAME: string = 'jwt_token';

@Injectable()
export class AuthService {
  
    private url: string = '192.168.1.100:8080/opusbeaute-0/obws';
    private headers = new Headers({ 'Content-Type': 'application/json' });
  
    constructor(private http: Http) { }
  
    getToken(): string {
      console.log("auth.service : getToken");
      return localStorage.getItem(TOKEN_NAME);
    }
  
    setToken(token: string): void {
      console.log("auth.service : setToken");
      localStorage.setItem(TOKEN_NAME, token);
    }
  
    getTokenExpirationDate(token: string): Date {
      console.log("auth.service : get expirationdate token");
      const decoded = jwt_decode(token);
  
      if (decoded.exp === undefined) return null;
  
      const date = new Date(0); 
      date.setUTCSeconds(decoded.exp);
      return date;
    }
  
    isTokenExpired(token?: string): boolean {
      console.log("auth.service : check if TokenIsExpired");
      if(!token) token = this.getToken();
      if(!token) return true;
  
      const date = this.getTokenExpirationDate(token);
      if(date === undefined) return false;
      return !(date.valueOf() > new Date().valueOf());
    }
  
    login(user): Promise<string> {
      console.log("auth.service : loginUser");
      return this.http
        .post(`${this.url}/login`, JSON.stringify(user), { headers: this.headers })
        .toPromise()
        .then(res => res.text());
    }

}
