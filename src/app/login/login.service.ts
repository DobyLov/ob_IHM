import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
// jwt webToken
import * as jwt_decode from "jwt-decode";
// moment pour le formatage des dates
import * as moment from 'moment/moment';
import { ToasterService } from '../service/toaster.service';
import { HttpResponse } from 'selenium-webdriver/http';
import { User } from '../login/user';
moment.locale('fr');


const apiOpusBeaute: String = "http://192.168.1.100:8080/opusbeaute-0/obws";
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded' })
};

@Injectable()
export class LoginService {

  constructor(private httpCli: HttpClient,
              private _toasterService: ToasterService,
              private user: User) {
                this.user = user;
               }

  login(user: User): boolean {

    //check si le token de l utilisateur est dans le LocalStorage
    if (this.checkIfTokenExistInLocalStorage(user.email) == true) {
      let token = this.getTokenFromLocalStorage(user.email);
      // recupere la date de validite du token
      let isDateIsExpired: Date = this.getTokenExpirationDate(token);
      let isTokenDateValid = this.isTokenDateIsExpired(isDateIsExpired);

      // verifie si la date de validite du token est non valide
      if (isTokenDateValid === false) {
        // supprime le token dans le LC
        this.removeUserTokenFromLocalStorage(user);
        // recupere le token avec les credetiels depuis le MidleWare
        this.getTokenFromMiddleware(user);
        let preprenom = this.getPrenomFromLocalStorage();
        console.log("recup userconnected : " + preprenom);

        return true;
      }

    } else {
      this.getTokenFromMiddleware(user);
      return true;

    }
    return false;
  }

  checkIfTokenExistInLocalStorage(email: string): boolean {

    let getLocalToken = localStorage.getItem(email);
    if (getLocalToken != null) {
      console.log("checkIfTokenExistInLocalStorage : il y a bien un Token dans le local Storage.");
      return true;

    } else {
      console.log("checkIfTokenExistInLocalStorage : il y a pas de Token dans le local Storage.");
      return false;
    }

  }

  getTokenFromLocalStorage(userEmail: string) {
    let locStok = localStorage.getItem(userEmail);
    console.log("getTokenFromLocalStorage : Le token du Local storage est recupere.")
    return locStok;
  }

  getTokenFromMiddleware(user: User) {

    let body = `email=${user.email}&pwd=${user.pwd}`;
    let url = `${apiOpusBeaute}/login`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    console.log("getTokenFromMiddleware : credetiels : " + "login : " + user.email + " " + "Pwd : " + user.pwd)
    console.log("getTokenFromMiddleware : recuperation du token depuis le MW et depot dans le localStrorage");

    // recupere le token depuis le MW
    let token = this.httpCli.post(url, body, { headers, withCredentials: true, responseType: 'text' })
      .subscribe(resultat => { this.tokenToLocalStorage(user, resultat),
                                this.messageToaster('Authetification avec succès !', 'snackbarInfo', 3000) },
      (error: HttpErrorResponse) => { if (error.status == 401) { 
                                      this.messageToaster("Veuillez vérifier vos crédentiels",'snackbarWarning', 2000)
                                    }});

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

  removeUserTokenFromLocalStorage(user: User) {
    console.log("removeUserTokenFromLocalStorage : Suppression du Token.")
    localStorage.removeItem(user.email);
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

  logout(user: User) {
    console.log("logout : Token supprime du LocalStorage.")
    localStorage.removeItem(user.email);
    console.log("logout : userConnected prenom supprime du LocalStorage.")
    localStorage.removeItem('connectedUser');
    console.log("logout : userConnected email supprime du LocalStorage.")
    localStorage.removeItem('userEmail');
  }

  tokenToLocalStorage(user: User, resultat: string) {
    console.log("tokenToLocalStorage : token persiste dans le localStorage")
    localStorage.setItem(user.email, resultat);
    let prenom: string = this.getPrenomFromToken(resultat);
    this.prenomToLocalStorage(user);
    this.emailToLocalStorage(user);

  }

  emailToLocalStorage(user: User) {
    console.log("emailToLocalStorage : userEmail persiste dans le localStorage");
    localStorage.setItem('userEmail', user.email);
  }

  getEmailFromLocalStorage(): User {
    let user: User;
    console.log("getEmailFromLocalStorage : userEmail persiste dans le localStorage");
    user.email = localStorage.getItem('userEmail');
    return user;
  }

  prenomToLocalStorage(user: User) {
    console.log("prenomToLocalStorage : Prenom persiste dans le localStorage")
    localStorage.setItem('connectedUser', user.prenom);
  }

  // snackbarWarning
  // snackbarInfo
  // timer en ms
  messageToaster(message, style, timer) {
        this._toasterService.showToaster(message, style, timer);

  }

  resetPwd(emailToResetPwd: String) {
  
    let url = `${apiOpusBeaute}/renewpwd/${emailToResetPwd}`;
    this.httpCli.post(url,httpOptions)
            .subscribe( resp => { this.messageToaster('Vous allez reçevoir un mail avec votre mot de passe.','snackbarInfo',6000)},
                          err => { if (err.status == 403) {
                            this.messageToaster('Il y a un problème, le mail n est pas connu !','snackbarWarning',6000)}                  
                          } )
     
  }
      
}
