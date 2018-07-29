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
    prenomClient: string;
    idClient: number;
    token: string;

    constructor(private _authgardrgpdservice: AuthGuardRgpdService,
                private _authrgpdservice: AuthRgpdService) {
                    // this.token = this._authrgpdservice.getToken();
                    this.idClient = this._authrgpdservice.getIdClientFromToken(this.token);
                    this.prenomClient = this._authrgpdservice.getPrenomClientFromToken(this.token);
                    this.emailClient = this._authrgpdservice.getEmailClientFromToken(this.token);
                }

    ngOnInit() {}

    
}