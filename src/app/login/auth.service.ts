import { Injectable } from '@angular/core';
import * as jwt_decode from 'jwt-decode';
import { NGXLogger } from 'ngx-logger';
import { appConfig } from '../constant/apiOpusBeauteUrl';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { ToasterService } from '../service/toaster.service';
import { BottomSheetService } from '../service/bottomsheet.service'
import { UtilisateurService } from '../utilisateur/utilisateur.service';
import { Credentials } from './credentials';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Router } from '@angular/router';


@Injectable()
export class AuthService {

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    })
  };

  // declaration du BehaviorSubject pour passer la valeur a plusieurs component
  public isUserIsLogged$ = new BehaviorSubject<boolean>(false);

  constructor( private logger: NGXLogger,
                private httpCli: HttpClient,
                private _toasterService: ToasterService,
                private router: Router,
                private _utilisateurservice: UtilisateurService) { }

  get statusOfIsUserIsLogged() {
    return this.isUserIsLogged$.asObservable();
  }

  /**
   * Modifie le status de l utilisateur 
   * Connecte ou deconnecte
   */
  changeStatusOfIsLogged(status: boolean): void {

    if (status === true) {

      this.isUserIsLogged$.next(true);
      this.logger.info("AuthService Log : Status Utilisateur Connecte");

    } else {

      this.isUserIsLogged$.next(false);
      this.logger.info("AuthService Log : Status Utilisateur Deconnecte");

    }

  }

  /**
   * Procedure de Loggin
   */
  // async pour pouvoir utiliser await
  async login(credz: Credentials) {
    this.logger.info("AuthService Log : Procedure d authentification");
    let loglog: boolean = false;
    let loginPromise = await new Promise(( resolve, reject ) => {
      this.getTokenFromMiddleware(credz)
        .then(res => {
          // get token from MW
          if (res != null) {
            loglog = true;
            this.changeStatusOfIsLogged(loglog);   
            this.logger.info("AuthService Log : Authentification avec succès");      
            this.messageToaster('Vous êtes connecté(e)', 'snackbarInfo', 3000);
            resolve();            
          }
        }
        )
        .then( res => { 
          this._utilisateurservice.setCurrentUtilisateur(credz.email);
          this.router.navigate(['./home']);
        })
        .catch((err:HttpErrorResponse) => {
          loglog = false;
          // console.log("AuthService log : " + err.status);
          // if (err.statusText === "Unknown Error") {
          //   this.messageToaster("Serveur HS",'snackbarWarning', 2000);
          // }
          this.changeStatusOfIsLogged(loglog);
          this.logger.info("AuthService Log : Authentification Echouee");   
          // this.messageToaster("Vérifiez vos informations",'snackbarWarning', 2000) 
        }
        
        )
    })      
    
  }

  /**
   * Recupere Un token depuis le Middleware
   */
  getTokenFromMiddleware = async function getTokenFromMiddleware(credz: Credentials) {

    this.logger.info("AuthService Log : envoie de la requete d authetification au MiddleWare");
    // Specifie la variable de retour en string
    let resultatToken: string;
    // let body = `email=${credz.email}&pwd=${credz.pwd}`;
    let body: HttpParams = new HttpParams();
    body = body.append("email", `${credz.email}`);
    body = body.append("pwd", `${credz.pwd}`);
    let url = `${appConfig.apiOpusBeauteUrl}/login`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    // Promesse  
    let laPromesseDuToken = await new Promise<string>((resolve, reject) => {
      this.httpCli.post(url, body, { headers, withCredentials: true, responseType: 'text' })
        .toPromise()
        .then(resultat => {
          this.logger.info("AuthService Log : Le Middleware a valide les credentiels");
          resultatToken = resultat;
          if (resultat != null) { 
            this.logger.info("AuthService Log : Le Token va etre persiste dans le LocalStorage");           
            this.setTokenToLocalStorage(credz, resultat);
            resolve();
          }
        })
        .catch( (err: HttpErrorResponse) => { 

            console.log("AuthService Log : erreur : " + err.statusText);  
            if ( err.statusText === "Unknown Error")  {
              this.logger.info("AuthService Log :  Le serveur ne repond pas");
              resultatToken = null;
              this.messageToaster("Probleme Serveur",'snackbarWarning', 2000);
              reject();

            } else {    

              this.logger.info("AuthService Log :  Le Middleware n a pas valide les credentiels");
              resultatToken = null;
              this.messageToaster("Vérifiez vos informations",'snackbarWarning', 2000);
              reject(); 
            }         
        })

        
    })

    return resultatToken;
  }

  /**
   * Perstance du token dans le LocalStorage
   * @param credz 
   * @param resultat 
   */
  private setTokenToLocalStorage(credz: Credentials, resultat: string):void {

    this.logger.info("AuthService Log : Persiste le Token Dans le LocalStorage");
    localStorage.setItem('ObTkn_' + credz.email, resultat);
  
  }

  /**
   * Recherche un Token dans le LocalStorage
   * @returns Array<string>
   */
  iterTokensOnLS = function iterTokenOnLS(): Array<string> {

    this.logger.info("AuthService Log : Recherche la presence de Token dans le LocalStorage");
    let listOfItems:Array<string> = [];
    let nbOfItemsInLS = localStorage.length;
    
    if (nbOfItemsInLS > 0) {
      for (let i = 0; i <= nbOfItemsInLS -1; i++) {
        listOfItems[i] = localStorage.key(i);
        // console.log("AuthService IterTokensOnLS : token ID : " + i + " = " + listOfItems[i])
      } 

      this.logger.info("AuthService Log : " + nbOfItemsInLS + " trouve(s) dans le LocalStorage");
    
    } else {
       
      this.logger.info("AuthService Log : Aucun Token n a ete trouve dans le LocalStorage");
      
    }

    return listOfItems;

  }

  /**
   * Cherche un Token commencant par ObTkn_
   * dans l array<string>
   * @returns string
   */
  public getMailFromToken(): string {

    this.logger.info("AuthSrvice Log : Extracton de l Email depuis le Token");
    let listOfItems: Array<string> = this.iterTokensOnLS();
    let tknMail: string = null;

    // Iteration su l array pleine de Token ...
    for (let j in listOfItems) {
      
      // Si la chaine(Token) commence par ObTkn_
      if (listOfItems[j].startsWith("ObTkn_")) {

        this.logger.info("AuthService Log : Token trouve avec la chaine ObTkn_");
        // Supprime ObTkn_ de la chaine et sort de la boucle
        tknMail = listOfItems[j].replace('ObTkn_', '');
        this.logger.info("AuthService Log : mail extrait ");
        break;

      }
    }

    return tknMail;
  }

  /**
   * Recupere Le ObTnk depuis le LocalStorage
   * @returns string
   */
  public getOBTokenFromLocalStorage(): string {

      this.logger.info("AuthService Log : Recuperation du ObTkn depuis le LocalStorage");
      let userMail = this.getMailFromToken();
      // let locStok = localStorage.getItem(credz.email);
      if (userMail != null) {

        let locStoToken = localStorage.getItem('ObTkn_' + userMail);
        this.logger.info("AuthService Log : ObTkn recupere depuis le LocalStorage");

        return locStoToken;

      } else {
        this.logger.info("AuthService Log : ObTkn non recupere depuis le LocalStorage");
        return null;
      }
  }

  /**
   * Recupere le token dans le LocalStorage 
   * en fournissant l email
   * @returns string
   */
  public getOBTokenViaMailFromLS(userMail: string): string {   

    this.logger.info("Authservice Log : Recuperation d un Token en fournissant l email");
    try {

      if (userMail != null) {

        let locStok = localStorage.getItem('ObTkn_' + userMail);
        this.logger.info("Authservice Log : Token trouve");
        return locStok;

      } else {

        this.logger.info("Authservice Log : token non trouve");
        return null;

      }
    } catch {

      return null;
    }
  }

  /**
   * Recuperation du Prenom depuis le token fourni
   * @param token 
   */
  public getPrenomFromGivedToken(token: string): string {

      this.logger.info("AuthService Log : Extraction du Prenom depuis le Token");

      return jwt_decode(token).prenom;

  }

  /**
   * Verifie si la date du token est expiree
   * @returns boolean
   */
  public isTokenDateIsNotExpired(): boolean {

    this.logger.info("AuthService Log : Verification de la validite de la date fourni dans le token");
    // console.log("auth.service isTokenDateIsExpired cherche le token dans le LS");
    let token = this.getOBTokenFromLocalStorage();
    if (token != null) {
      // console.log("auth.service isTokenDateIsExpired token trouve");
      // let decodedToken = jwt_decode(token); 
      if (new Date(jwt_decode(token).exp * 1000) > new Date()) {

        this.logger.info("AuthService Log : La date du token est valide");
        return false;

      } else {

        this.logger.info("AuthService Log : La date du token n est pas valide");
        return true;
      }

    } else {

      return true;

    }
  }

  /**
   * suppression du token dans le LocalStorage
   * @param userMail 
   */
  public removeGivenTokenFromLS(userMail: string):void {

    try {

      localStorage.removeItem('ObTkn_' + userMail);
      this.logger.info("AuthService Log :Le Token a ete supprime du LocalStorage");
      // console.log("AuthService : removetokenFromLsoken retire du LS !!!!")

    } catch (err) {

      this.logger.info("AuthService Log :Le Token n a pas ete supprime du LocalStorage");

    }
     
  
  }

  /**
   * Demande de reinitialisation de maot de passe
   * @param emailToResetPwd 
   */
  public resetPwd(emailToResetPwd: String): void {

    this.logger.info("AuthService Log : Procedure de reinitialisation de mot de passe");
    let url = `${appConfig.apiOpusBeauteUrl}/renewpwd/${emailToResetPwd}`;
    this.httpCli.post(url, this.httpOptions)
      .subscribe(
        () => { this.logger.info("AuthService Log : Mail connu de la Bdd");
                  this.messageToaster('E-mail envoyé.', 'snackbarInfo', 6000); },
        err => {
          if (err.status == 403) {
                    this.logger.info("AuthService Log : Mail non connu de la Bdd");
                    this.messageToaster('E-mail non reconnu !', 'snackbarWarning', 6000)
          }
      })
  }

  /**
   * Deconnextion de l utilisateur
   *  supprime le token
   * @param userMail 
   */
  public logOut(userMail): void {

    this.logger.info("AuthService Log : Deconexion de l utilisateur");
    this.changeStatusOfIsLogged(false);
    this.removeGivenTokenFromLS(userMail);
    // this.messageToaster('Vous êtes déconnecté(e)', 'snackbarInfo', 3000);

  }


  /**
   * Affiche les message a l utilisateur
   * @param message 
   * @param style 
   * @param timer 
   */
  // snackbarWarning, // snackbarInfo, // timer en ms  
  public messageToaster(message, style, timer) {

    this.logger.info("AuthService Log : Message a toaster : " + message);
    this._toasterService.showToaster(message, style, timer);

  } 
}
