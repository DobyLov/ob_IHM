import { Component, OnInit } from "@angular/core";
import { AuthRgpdService } from "./authRgpd.service";
import { BottomSheetService } from '../service/bottomsheet.service';
import { Router } from "@angular/router";
import { NGXLogger } from "ngx-logger";


@Component ({
    selector: 'app-rgpdtokenexpired',
    templateUrl: '../rgpd/rgpdtokenexpired.component.html',
    styleUrls: ['../rgpd/rgpdtokenexpired.component.scss']

})
export class RgpdTokenExpiredComponent implements OnInit {

    rgpdPrenomClient: string;
    rgpdEmailClient: string;
    rgpdUrl$: string;
    rgpdToken: string;
    mailBtnOnOff: boolean = true;
    isRgpdUrlNotNull: boolean = false;
    displayRgpdMailRenewalPurposal: boolean = true;

    constructor( private logger: NGXLogger,
                 private _authrgpdservice: AuthRgpdService,) {
                    this.GetInfos();
                }

    ngOnInit() { }

    /**
     * Extraire le Token depuis l URL
     *  Recupere Le Prenom et EMail du Client depuis le Token
     */
    private GetInfos(): void {

        try {  

            this.logger.info("RgpdTokenExpiredComponent Log : Recuperation de L Url");
            this._authrgpdservice.getUrl.subscribe(url => { this.rgpdUrl$ = url.valueOf() });

            this.logger.info("RgpdTokenExpiredComponent Log : Extraction du Token de L Url");
            this.rgpdToken = this._authrgpdservice.urlRgpdTokenExtractor(this.rgpdUrl$);

            this.logger.info("RgpdTokenExpiredComponent Log : Recuperation du Prenom/Client depuis le Token");
            this.rgpdPrenomClient = this._authrgpdservice.getPrenomClientFromToken(this.rgpdToken);

            this.logger.info("RgpdTokenExpiredComponent Log : Recuperation de L Email/Client depuis le TOken");
            this.rgpdEmailClient = this._authrgpdservice.getEmailClientFromToken(this.rgpdToken);
    
        } catch (error) {

            this.logger.info("RgpdTokenExpiredComponent Log : Le Token n est pas valide");
            this.displayRgpdMailRenewalPurposal = false;
            this.logger.info("RgpdTokenExpiredComponent Log : Pas d affichage de la proposition d email de renouvellement ");

        }
        
    }

    // /**
    //  * 
    //  */
    // private checkIfTokenUrlIsPresent(): void {

    //     // console.log("rgdpdTokenExpiredComponent : verifie su Url is present");
    //     if (this.rgpdUrl$.valueOf() != "" ) {
    //         // console.log("afficher le msg RGPD lien Expire");
    //         this.displayRgpdMailRenewalPurposal = true; 

    //     } else {
    //         // console.log("Ne pas afficher le msg RGPD lien Expire");
    //         this.displayRgpdMailRenewalPurposal = false;
    //         setTimeout(() => {
    //            this.router.navigateByUrl(''); 
    //         }, 10000);

    //     }
    // }

    /**
     * Demande d un nouvel Email avec le Lien Rgpd au MiddleWare
     */
    private askForNewRgpdUrl(): void {

            this.logger.info("RgpdTokenExpiredComponent Log : Envoi de la demande de nouveau Email de renouvellement lien Rgpd");
            this.mailBtnOnOff = false;
            this._authrgpdservice.askANewRgpdTokenByEmail(this.rgpdToken);

        try {

            this.logger.info("RgpdTokenExpiredComponent Log : Supression du Token dans le LocalStorage.");
            this._authrgpdservice.removeRgpdTokenFromLS();  

        } catch (err) {
           
            this.logger.info("RgpdTokenExpiredComponent Log : Pas de Token supprime du LocalStorage.");

        }
        
        
    }

    // /**
    //  * Affiche le message d information
    //  */
    // private openBottomSheet(msg: string): void {

    //     this._bottomsheetservice.openBottomSheet(msg);

    // }
}