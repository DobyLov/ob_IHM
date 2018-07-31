import { Component, OnInit } from "@angular/core";
import { AuthRgpdService } from "./authRgpd.service";
import { BottomSheetService } from '../app/service/bottomsheet.service';
import { Router } from "@angular/router";
import { error } from "../../node_modules/@angular/compiler/src/util";
import { throwError } from "../../node_modules/rxjs";

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

    constructor(private _authrgpdservice: AuthRgpdService,
                private _bottomsheetservice: BottomSheetService,
                private router: Router) {
                    this.firstThingsToDo();
                }

    ngOnInit(){

        // this.checkIfTokenUrlIsPresent();
    }

    private firstThingsToDo() {

        try {  

            this._authrgpdservice.getUrl.subscribe(url => { this.rgpdUrl$ = url.valueOf() });
            
            console.log("RgpdTokenExpiredcomponent : url : " + this.rgpdUrl$);
            this.rgpdToken = this._authrgpdservice.urlRgpdTokenExtractor(this.rgpdUrl$);
            console.log("RgpdTokenExpiredcomponent : token : " + this.rgpdToken);
            this.rgpdPrenomClient = this._authrgpdservice.getPrenomClientFromToken(this.rgpdToken);
            console.log("RgpdTokenExpiredcomponent : prenom : " + this.rgpdPrenomClient);
            this.rgpdEmailClient = this._authrgpdservice.getEmailClientFromToken(this.rgpdToken);
            console.log("RgpdTokenExpiredcomponent : rgpdEmailClient : " + this.rgpdEmailClient);
                
    
        } catch (error) {
            console.log("RgpdTokenExpiredcomponent : error catched");
            this.displayRgpdMailRenewalPurposal = false;
            console.log("RgpdTokenExpiredcomponent : affichera le message principal : " + this.displayRgpdMailRenewalPurposal);

        }
        
    }

    private checkIfTokenUrlIsPresent() {

        // console.log("rgdpdTokenExpiredComponent : verifie su Url is present");
        if (this.rgpdUrl$.valueOf() != "" ) {
            // console.log("afficher le msg RGPD lien Expire");
            this.displayRgpdMailRenewalPurposal = true; 

        } else {
            // console.log("Ne pas afficher le msg RGPD lien Expire");
            this.displayRgpdMailRenewalPurposal = false;
            setTimeout(() => {
               this.router.navigateByUrl(''); 
            }, 10000);

        }
    }

    private askForNewRgpdUrl() {

            this.mailBtnOnOff = false;
            this._authrgpdservice.askANewRgpdTokenByEmail(this.rgpdToken);

        try {
            console.log("RgpdTokenExpired : Suppression du rgpdToken dans le  LS");
            this._authrgpdservice.removeRgpdTokenFromLS();  

        } catch (err) {
            console.log("RgpdTokenExpired : Le rgpdToken n a pas ete supprime du LS");
        }
        
        
    }

    private openBottomSheet(msg: string) {

        this._bottomsheetservice.openBottomSheet(msg);

    }
}