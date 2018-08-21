import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient, HttpParams } from "@angular/common/http";
import { BehaviorSubject } from "rxjs";
import { Router } from "@angular/router";
import { BottomSheetService } from "../service/bottomsheet.service";
import { appConfig } from "../constant/apiOpusBeauteUrl";
import * as jwt_decode from 'jwt-decode';

@Injectable()
export class AuthRgpdService {

    public url$ = new BehaviorSubject("");
    public tokenExtractedFromUrl$ = new BehaviorSubject("");
    public isTokenStructureIsIntegre$ = new BehaviorSubject<boolean>(false);

    constructor(private httpCli: HttpClient,
                private _bottomsheetservice: BottomSheetService,
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
     * Verifie si le token est valide
     * @param token string
     */
    public isRgpdTokenIsvalid(token: string): boolean {
        console.log("AuthRgpdService : Verification de la validite du RgpdToken.");
        
        try {

            this.rgpdTokenIntegrityChecker(token);
            this.isRgpdTokenDateIsValid(token);
            this.setRgpdTokenToLS(token);
            console.log("AuthRgpdService : Le RgpdToken est valide");
            return true;

        } catch (erro) {

            console.log("AuthRgpdService : Le rgpdtoken n est pas valide.");
            return false;
        }
    }

    /**
     * Test de l integrite du token
     * @param token 
     */
    public rgpdTokenIntegrityChecker(token: string): boolean {
        
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
  public searchRgpdTknStringInsideRgpdUrl(rgpdUrl: string): Boolean {
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
  public urlRgpdTokenExtractor(url: string): string {

    let tokenExtracted = url.substr(url.search(new RegExp(`rgpd` + `\\?` + `tkn=`)), url.length).replace(new RegExp(`rgpd` + `\\?` + `tkn=`),"");
    return tokenExtracted;

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
    get getTokenFromURL(): string {
        return this.tokenExtractedFromUrl$.getValue();
    }

    /**
     * Verifie la date de validite du Token
     * @param token string
     */
    public isRgpdTokenDateIsValid(token: string): Boolean {
        console.log("authRgpdService : verification de la date du token");
        let dateNow = new Date();
        let isJwtIsValid: Boolean;
              
        if (new Date(jwt_decode(token).exp * 1000) > dateNow) {
            isJwtIsValid = true;
            console.log("authRgpdService : La date du token est valide");
        } else {
            isJwtIsValid = false;
            console.log("authRgpdService : La date du token n est pas valide");
        }
            
        return isJwtIsValid;

    }

    /**
     * Fait une demande d une URL construite
     * avec un token valide au MidleWare
     * @param token 
     */
    public askANewRgpdTokenByEmail(token: string) {
        
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
  
        // Observable 
        this.httpCli.get(url, { headers: headers, params: httpParams })
            .subscribe(            
                res => {this._bottomsheetservice.openBottomSheet("E-mail envoyé")},
                err => {this._bottomsheetservice.openBottomSheet("E-mail non envoye")}
            )  
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
        console.log("AuthRgpdService : Recuperation du token dans le LS");
        try {
            let tokenFLs = localStorage.getItem("rgpd_tkn");
            console.log("AuthRgpdService : Token trouve dans le LS");
            return tokenFLs;

        } catch (err) {
            console.log("AuthRgpdService : il n y a pas de token dans le LS : ");
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