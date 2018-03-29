import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
// jwt webToken
import * as jwt_decode from "jwt-decode";
// moment pour le formatage des dates
import * as moment from 'moment/moment';
moment.locale('fr');


const apiOpusBeaute: String = "http://192.168.1.100:8080/opusbeaute-0/obws";
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded'
  })
};

@Injectable()
export class LoginService {

  constructor(private httpCli: HttpClient) { }

  login(userEmail: string, pwd: string) {

    //check si le token de l utilisateur est dans le LocalStorage
    if (this.checkIfTokenExistInLocalStorage(userEmail) == true) {
      let token = this.getTokenFromLocalStorage(userEmail);
      let isDateIsExpired: Date = this.getTokenExpirationDate(token);
      let isTokenDateValid = this.isTokenDateIsExpired(isDateIsExpired);

      if (isTokenDateValid === false) {
        this.removeUserTokenFromLocalStorage(userEmail);
        this.getTokenFromMiddleware(userEmail, pwd);
        let preprenom = this.getPrenomFromLocalStorage();
        console.log("recup userconnected : " + preprenom);

      }

    } else {
      this.getTokenFromMiddleware(userEmail, pwd);

    }

  }

  checkIfTokenExistInLocalStorage(userEmail: string): boolean {

    let getLocalToken = localStorage.getItem(userEmail);
    if (getLocalToken != null) {
      console.log("checkIfTokenExistInLocalStorage : il y a bien un Token dans le local Storage.");
      return true;

    } else {
      console.log("checkIfTokenExistInLocalStorage : il y a pas de Token dans le local Storage.");
      return false;
    }

  }

  getTokenFromLocalStorage(userEmail: string) {
    let locTok = localStorage.getItem(userEmail);
    console.log("getTokenFromLocalStorage : Le token du Local storage est recupere.")
    return locTok;
  }

  getTokenFromMiddleware(userEmail: string, pwd: string) {

    let body = `email=${userEmail}&pwd=${pwd}`;
    let url = `${apiOpusBeaute}/login`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    console.log("getTokenFromMiddleware : recuperation du token depuis le MW et depot dans le localStrorage");

    let token = this.httpCli.post(url, body, { headers, withCredentials: true, responseType: 'text' })
      .subscribe(resultat => { this.tokenToLocalStorage(userEmail, resultat) },
      error => console.log('oops', error));

    return token;
  }

  getTokenExpirationDate(token: string): Date {

    let decodedToken = jwt_decode(token);
    let extracDateFromToken = decodedToken.exp;
    let expirationDate: Date = new Date(extracDateFromToken * 1000);
    console.log("getTokenExpirationDate : Date d expiration du token : " + expirationDate);

    return expirationDate;
  }

  isTokenDateIsExpired(expirationDate: Date): boolean {
    let testExpirationDate = new Date(expirationDate);
    if (testExpirationDate > this.getDateNow()) {
      console.log("isTokenDateIsExpired : token est valide :");
      return true;

    } else {
      console.log("isTokenDateIsExpired : token n es plus valide : ");
      return false;
    }
  }

  removeUserTokenFromLocalStorage(userEmail) {
    console.log("removeUserTokenFromLocalStorage : Suppression du Token.")
    localStorage.removeItem(userEmail);
  }

  getDateNow(): Date {

    let dateNow = new Date();
    console.log("getDateNow : Date instantanee : " + dateNow)
    return dateNow;
  }

  getPrenomFromToken(token: string): string {

    let prenom = jwt_decode(token).prenom;
    // let extracPrenomFromToken = decoToken.prenom;
    console.log("getPrenomFromToken : userConnected : " + prenom);

    return prenom;
  }

  getPrenomFromLocalStorage(): string {
    let prenom = localStorage.getItem('connectedUser');
    return prenom
  }

  logout(userEmail) {
    console.log("logout : Token supprime du LocalStorage.")
    localStorage.removeItem(userEmail);
    console.log("logout : userConnected prenom supprime du LocalStorage.")
    localStorage.removeItem('connectedUser');
    console.log("logout : userConnected email supprime du LocalStorage.")
    localStorage.removeItem('userEmail');
  }

  tokenToLocalStorage(userEmail, resultat: string) {
    console.log("tokenToLocalStorage : token persiste dans le localStorage")
    localStorage.setItem(userEmail, resultat);
    let prenom: string = this.getPrenomFromToken(resultat);
    this.prenomToLocalStorage(prenom);
    this.emailToLocalStorage(userEmail);

  }

  emailToLocalStorage(userEmail) {
    console.log("emailToLocalStorage : userEmail persiste dans le localStorage");
    localStorage.setItem('userEmail', userEmail);
  }

  getEmailFromLocalStorage(): string {
    console.log("getEmailFromLocalStorage : userEmail persiste dans le localStorage");
    let email: string = localStorage.getItem('userEmail');

    return email;
  }

  prenomToLocalStorage(userPrenom: string) {
    console.log("prenomToLocalStorage : Prenom persiste dans le localStorage")
    localStorage.setItem('connectedUser', userPrenom);
  }

  resetPwd(email: String) {

    let url = `${apiOpusBeaute}/renewpwd/${email}`;
    return this.httpCli.post(url, httpOptions)
      .subscribe(res => console.log("retour du serveur : " + res));
  }

}
