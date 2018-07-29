import { Injectable } from "@angular/core";
import * as jwt_decode from 'jwt-decode';
import { HttpHeaders, HttpClient, HttpParams } from "@angular/common/http";
import { appConfig } from "../app/constant/apiOpusBeauteUrl";
import { BehaviorSubject } from "rxjs";
import { Router } from "@angular/router";

@Injectable()
export class AuthRgpdService {

    public url$ = new BehaviorSubject("");
    public tokenExtractedFromUrl$ = new BehaviorSubject("");
    public isTokenStructureIsIntegre$ = new BehaviorSubject<boolean>(false);

    constructor(private httpCli: HttpClient,
                private router: Router){}

    public get IsTokenStructureIsIntegre() {
        return this.isTokenStructureIsIntegre$.asObservable();
    }

    public get getUrl() {
        return this.url$.asObservable();
    }

    public get getTokenFromUrl() {
        return this.tokenExtractedFromUrl$.asObservable();
    }

    /**
     * Test de l integrite du token
     * @param token 
     */
    public tokenIntegrityChecker(token: string): boolean {
        
        try {
            // test de l integrite du token
            jwt_decode(token);
            console.log("AuthRgpdService : la structure du token est bonne :)");
            this.isTokenStructureIsIntegre$.next(true);
            return true;
            

        } catch (err) {
            console.log("AuthRgpdService : Error catchee la structure du token est n est pas bonne :(")
            this.isTokenStructureIsIntegre$.next(false);
            this.router.navigate(['./rgpdurlaltered'])
            return false;
            
        }
    } 

  /**
   * Recherche une chaine specifique dans l URL de la page 
   * @param rgpdUrl
   */
  public searchTknStringInsideRgpdUrl(rgpdUrl: string): Boolean {
    let isTknIsPresentIntoTheString: Boolean = false;
    let regex = new RegExp(`rgpd` + `\\?` + `tkn=`);
    if (rgpdUrl.search(regex) != -1) {
      isTknIsPresentIntoTheString = true;
      // console.log("AuthGuardRgpdService : String present => rgpd?tkn=  : " + isTknIsPresentIntoTheString);    
    } else {
      isTknIsPresentIntoTheString = false;
      // console.log("AuthGuardRgpdService : String present => rgpd?tkn=  : " + isTknIsPresentIntoTheString);
    }
    this.setUrlAsObservable(rgpdUrl);
    return isTknIsPresentIntoTheString;
  }

  /**
   * Extrait le token de l URL
   * @param url 
   */
  public urlTokenExtractor(url: string): string {

    let tokenExtracted = url.substr(url.search(new RegExp(`rgpd` + `\\?` + `tkn=`)), url.length).replace(new RegExp(`rgpd` + `\\?` + `tkn=`),"");
    return tokenExtracted;

  }

    /**
     * Verifie la date de validite du token :
     * @param token 
     */
    public tokenDateValidator(token: string): Boolean {
        // console.log("AuthRgpdService : token => " + token);
        if (this.isRgpdTokenDateIsValid(token)) {
            this.setTokenAsObservable(token);
            this.setRgpdTokenToLS(token);
            return true;

        } else {
            console.log("AuthRgpdService : Le token fourni par l URL est perime.");
            return false;
        }
    }

    /**
     * Defini et Stock le token comme observable
     * @param token 
     */
    private setTokenAsObservable(token: string) {
        this.tokenExtractedFromUrl$.next(token);
    }

    /**
     * Defini et stock le token comme observable
     * @param token
     */
    private setUrlAsObservable(url: string) {
        this.url$.next(url)
    }

   /**
    * Retourne le token sous forme d observable
    */
    get getToken(): string {
        return this.tokenExtractedFromUrl$.getValue();
    }

    /**
     * Verifie la date de validite du Token
     * @param token string
     */
    public isRgpdTokenDateIsValid(token: string): Boolean {
        let dateNow = new Date();
        let isJwtIsValid: Boolean;
              
        if (new Date(jwt_decode(token).exp * 1000) > dateNow) {
            isJwtIsValid = true;
        } else {
            isJwtIsValid = false;
        }
            
        return isJwtIsValid;

    }

    /**
     * Verifie si la structure du Token est integre
     * @param token 
     */
    private isTokenStructureIsValid(token: string): Boolean {

        try {
            jwt_decode(token);
            console.log("AuthRgpdService : la structure du token est valide.");
            return true;

        } catch (error) {
            console.log("AuthRgpdService : la structure du token n est pas valide." + error);
            return false;
        }
        
    }

    /**
     * Fait une demande d une URL construite
     * avec un token valide au MidleWare
     * @param token 
     */
    public askANewRgpdTokenByEmail(token: string): void {

        let prenomClient: string = this.getPrenomClientFromToken(token);
        let idClient: number = this.getIdClientFromToken(token);
        let emailClient: string = this.getEmailClientFromToken(token);
        // requete =>
        let url: string = `${appConfig.apiOpusBeauteUrl}/rgpd/askvalidtoken?`;      
        let headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
        let httpParams: HttpParams =  new HttpParams()
            httpParams = httpParams.set("rgpdIdClient", `${idClient}`);
            httpParams = httpParams.set("rgpdPrenomClient", `${prenomClient}`);
            httpParams = httpParams.set("rgpdEmailClient", `${emailClient}`); 
        // promesse =>
        let promesse = new Promise (( resolve ) => {
            // this.httpCli.post(url, body, { headers, withCredentials: false, responseType: 'text' })
            return this.httpCli.get(url, { headers: headers, params: httpParams } )
            .toPromise()
            .then(res => {console.log("AuthRgpdService : promesse ok")})
            .catch(err => {console.log("AuthRgpdService : promesse error : " + err)})
        })
    }

    /**
     * Stocke le token dans le LocalStorage
     * @param token 
     */
    public setRgpdTokenToLS(token: string): void {
        localStorage.setItem("rgpd_tkn", token);
    }

    /**
     * Recupere le token depuis le LocalStorage
     */
    public getRgpdTokenFromLS(): string {
        try {
            let tokenFLs = localStorage.getItem("Rgpd_Tkn");
            return tokenFLs;
        } catch (err) {
            console.log("AuthRgpdService : il n y a pas de token dans le LS : " + err );
            return null;
        }
    }

    /**
     * Supprime le token du LocalStorage
     */
    public removeRgpdTokenFromLS(): boolean {

        try{
            localStorage.removeItem("Rgpd_Item");
            return true;
            
        } catch (err){
            console.log("AuthRgpdService : Ily a eu un probleme lors de la supression du token dans le LS");
            return false;
        }
    }

    /**
     * Recupere le prenom du cleint depuis le token
     * @param token 
     */
    public getPrenomClientFromToken(token): string {        
        return jwt_decode(token).prenom;
    }
    
    /**
     * Recupere le mail du client depuis le token
     * @param token 
     */
    public getEmailClientFromToken(token): string {
        return jwt_decode(token).email;
    }

    /**
     * Recupere l Id du client depuis le token
     * @param token 
     */
    public getIdClientFromToken(token): number {
        return jwt_decode(token).idClient;
    }

}