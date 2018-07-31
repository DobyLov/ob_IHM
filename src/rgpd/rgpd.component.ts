import { OnInit, Component } from "@angular/core";
import { AuthGuardRgpdService } from "./authGuardRgpd.service";
import { AuthRgpdService } from "./authRgpd.service";


@Component({
    selector: 'app-rgpd',
    templateUrl: '../rgpd/rgpd.component.html',
    styleUrls: ['../rgpd/rgpd.component.scss']
})
export class RgpdComponent implements OnInit {


    emailClient: string;
    rgpdPrenomClient: string;
    idClient: number;
    token: string;
    displaySendRgpdOptions: boolean = true;

    constructor(private _authgardrgpdservice: AuthGuardRgpdService,
                private _authrgpdservice: AuthRgpdService) {
                    try {
                        this.token = this._authrgpdservice.getRgpdTokenFromLS();
                        this.idClient = this._authrgpdservice.getIdClientFromToken(this.token);
                        this.rgpdPrenomClient = this._authrgpdservice.getPrenomClientFromToken(this.token);
                        this.emailClient = this._authrgpdservice.getEmailClientFromToken(this.token);
                    } catch (error) {
                        this.displaySendRgpdOptions = true;

                    }
                }

    ngOnInit() {}

    private sendRgpdOptions(){
        this._authrgpdservice.removeRgpdTokenFromLS();
    }
    
}