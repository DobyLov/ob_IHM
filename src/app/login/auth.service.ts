import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import * as jwt_decode from 'jwt-decode';
// a suppr
import { default as decode } from 'jwt-decode';

import { appConfig } from '../constant/apiOpusBeauteUrl';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { ToasterService } from '../service/toaster.service';
import { Utilisateur } from '../utilisateur/utilisateur';
import { UtilisateurService } from '../utilisateur/utilisateur.service';
import { Credentials } from './credentials';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


@Injectable()
export class AuthService {

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    })
  };

  // declaration du BehaviorSubject pour passer la valeur a plusieurs component
  public isUserIsLogged$ = new BehaviorSubject<boolean>(false);

  constructor(private httpCli: HttpClient,
    private _toasterService: ToasterService,
    private _utilisateurservice: UtilisateurService,
    private router: Router,
    private credz: Credentials,
    private user: Utilisateur) { }

  get statusOfIsUserIsLogged() {
    return this.isUserIsLogged$.asObservable();
  }

  changeStatusOfIsLogged(status: boolean) {
    if (status === true) {
      this.isUserIsLogged$.next(true);
    } else {
      this.isUserIsLogged$.next(false);
    }
  }

  // async pour pouvoir utiliser await
  async login(credz: Credentials) {
    let loglog: boolean = false;
    let loginPromise = await new Promise((resolve, reject) => {
      this.getTokenFromMiddleware(credz)
        .then(res => {
          // get token from MW
          if (res != null) {
            loglog = true;
            this.changeStatusOfIsLogged(loglog);            
            this.messageToaster('Authentification avec succès !', 'snackbarInfo', 3000);
            resolve();            
          }
        }
        )
        .then( res => this._utilisateurservice.setCurrentUtilisateur(credz.email) )
        // .then( res => this.router.navigate(['./home']) )
        .catch((err) => {
          loglog = false;
          this.changeStatusOfIsLogged(loglog);
          console.log("AuthService : Methode Login : login NOK : " + loglog);   
          this.messageToaster("Veuillez vérifier vos crédentiels",'snackbarWarning', 2000) }
        
        )
    })      
    
  }

  getTokenFromMiddleware = async function getTokenFromMiddleware(credz: Credentials) {
    // Specifie la variable de retour en string
    let resultatToken: string;
    let body = `email=${credz.email}&pwd=${credz.pwd}`;
    let url = `${appConfig.apiOpusBeauteUrl}/login`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    // Promesse  
    let laPromesseDuToken = await new Promise<string>((resolve, reject) => {
      this.httpCli.post(url, body, { headers, withCredentials: true, responseType: 'text' })
        .toPromise()
        .then(resultat => {
          resultatToken = resultat;
          if (resultat != null) {            
            this.setTokenToLocalStorage(credz, resultat);
            resolve();
          }
        })
        .catch((err) => {
          // console.log("Promesse erreur");
          resultatToken = null;
          reject();
        })
    })
    return resultatToken;
  }

  setTokenToLocalStorage(credz: Credentials, resultat: string) {
    // console.log("tokenToLocalStorage : token persiste dans le localStorage")      
    localStorage.setItem('ObTkn_' + credz.email, resultat);
  }

  iterTokensOnLS = function iterTokenOnLS(): Array<string> {
    let listOfItems:Array<string> = [];
    let nbOfItemsInLS = localStorage.length;
    // console.log("AuthService : IterTokensOnLS nombre d objets dansle LS : " + nbOfItemsInLS);
    if (nbOfItemsInLS > 0) {
      for (let i = 0; i <= nbOfItemsInLS -1; i++) {
        listOfItems[i] = localStorage.key(i);
        // console.log("AuthService IterTokensOnLS : token ID : " + i + " = " + listOfItems[i])
      }
    }
    return listOfItems;
  }

  getMailFromToken(): string {
    let listOfItems: Array<string> = this.iterTokensOnLS();
    let tknMail: string = null;
    // for ( let j in listOfItems ) {
    for (let j in listOfItems) {
      if (listOfItems[j].startsWith("ObTkn_")) {
        // console.log("AuthService : suppression de ObTkn_ sur la string : " + listOfItems[j])
        tknMail = listOfItems[j].replace('ObTkn_', '');
        break;
      }
    }
    // console.log("AuthService : GetMailFromToken : extraction du mail du token dans le LS : " + tknMail)
    return tknMail;
  }

  getOBTokenFromLocalStorage(): string {
      let userMail = this.getMailFromToken();
      // let locStok = localStorage.getItem(credz.email);
      if (userMail != null) {
        let locStoToken = localStorage.getItem('ObTkn_' + userMail);
        // console.log("authServivce : getTokenFromLocalStorage : Le token du Local Storage recupere." + locStok);
        return locStoToken;

      } else {
        // console.log("authServivce : getTokenFromLocalStorage : Il n y a pas de token a recuperer dans le LS");
        return null;
      }
  }

  getOBTokenViaMailFromLS(userMail: string): string {    
    try {

      if (userMail != null) {
        let locStok = localStorage.getItem('ObTkn_' + userMail);
        // console.log("authServivce : getTokenFromLocalStorage : Le token du Local Storage recupere." + locStok);
        return locStok;

      } else {
        // console.log("authServivce : getTokenFromLocalStorage : Il n y a pas de token a recuperer dans le LS");
        return null;
      }
    } catch {

      return null;
    }
  }

  getPrenomFromGivedToken(token: string): string {
      // return this.credz.prenom = jwt_decode(this.getTokenFromLocalStorage(credz)).prenom;
      // return jwt_decode(this.getOBTokenViaMailFromLS(token)).prenom;
      return jwt_decode(token).prenom;

  }

  isTokenDateIsExpired(): boolean {
    // console.log("auth.service isTokenDateIsExpired cherche le token dans le LS");
    let token = this.getOBTokenFromLocalStorage();
    if (token != null) {
      // console.log("auth.service isTokenDateIsExpired token trouve");
      // let decodedToken = jwt_decode(token); 
      if (new Date(jwt_decode(token).exp * 1000) > new Date()) {
        // console.log("auth.service isTokenDateIsExpired : token est valide :");
        // this.isUserIsLogged$.next(true);
        return false;
      } else {
        // console.log("auth.service isTokenDateIsExpired : token n es plus valide : ");
        // this.isUserIsLogged$.next(false);
        return true;
      }
    } else {
      // console.log("auth.service isTokenDateIsExpired : il ny pas de token dans le LS");
      return true;
    }
  }

  removeGivenTokenFromLS(userMail: string) {

      localStorage.removeItem('ObTkn_' + userMail);
      // console.log("AuthService : removetokenFromLsoken retire du LS !!!!")
  
  }

  resetPwd(emailToResetPwd: String) {
    let url = `${appConfig.apiOpusBeauteUrl}/renewpwd/${emailToResetPwd}`;
    this.httpCli.post(url, this.httpOptions)
      .subscribe(resp => { this.messageToaster('Vous allez reçevoir un e-mail avec votre mot de passe.', 'snackbarInfo', 6000) },
      err => {
        if (err.status == 403) {
          this.messageToaster('Il y a un problème, le mail n est pas connu !', 'snackbarWarning', 6000)
        }
      })
  }

  logOut(userMail) {
    this.changeStatusOfIsLogged(false);
    this.removeGivenTokenFromLS(userMail);
    this.messageToaster('Vous êtes déconnecté', 'snackbarInfo', 3000);
  }

  getCurrentUser() {

  }



  // snackbarWarning
  // snackbarInfo
  // timer en ms
  messageToaster(message, style, timer) {
    this._toasterService.showToaster(message, style, timer);

  } 
}
