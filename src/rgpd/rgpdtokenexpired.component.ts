import { Component, OnInit } from "@angular/core";
import { AuthRgpdService } from "./authRgpd.service";
import { BottomSheetService } from '../app/service/bottomsheet.service';
import { Router } from "@angular/router";

@Component ({
    selector: 'app-rgpdtokenexpired',
    templateUrl: '../rgpd/rgpdtokenexpired.component.html',
    styleUrls: ['../rgpd/rgpdtokenexpired.component.scss']

})
export class RgpdTokenExpiredComponent implements OnInit {

    rgpdPrenomClient$: string;
    rgpdUrl$: string;
    rgpdToken: string;
    mailBtnOnOff: boolean = true;
    isRgpdUrlNotNull: boolean = false;
    displayRgpdMailRenewalPurposal: boolean = true;

    constructor(private _authrgpdservice: AuthRgpdService,
                private _bottomsheetservice: BottomSheetService,
                private router: Router) {
        this._authrgpdservice.getUrl.subscribe(url => {
            this.rgpdUrl$ = url.valueOf() })
            // console.log("rgdpdTokenExpiredComponent : url => " + this.rgpdUrl$);

            this.rgpdToken = this._authrgpdservice.urlTokenExtractor(this.rgpdUrl$);

            // console.log("rgdpdTokenExpiredComponent : tokenExtracted => " + this.rgpdToken);

        // this.rgpdPrenomClient$ = this._authrgpdservice.getPrenomClientFromToken(this.rgpdToken$);
        
    }

    ngOnInit(){
        this.checkIfTokenUrlIsPresent();
    }

    checkIfTokenUrlIsPresent() {

        // console.log("rgdpdTokenExpiredComponent : verifie su Url is present");
        if (this.rgpdUrl$.valueOf() != "" ) {
            // console.log("afficher le msg RGPD lien Expire");
            this.displayRgpdMailRenewalPurposal = true; 

        } else {
            // console.log("Ne pas afficher le msg RGPD lien Expire");
            this.displayRgpdMailRenewalPurposal = false;
        }
    }

    private askForNewRgpdUrl() {

        // console.log("rgdpdTokenExpiredComponent : button clicked");
        this._authrgpdservice.askANewRgpdTokenByEmail(this.rgpdToken);
        this.mailBtnOnOff = false;
        // this.openBottomSheet(): void {
        //     // this.bottomSheet.open(BottomSheetOverviewExampleSheet);
        //   }
        this.openBottomSheet("Un email vous a été envoyé.");
    }

    private openBottomSheet(msg: string) {
        this._bottomsheetservice.openBottomSheet(msg);
    }


}