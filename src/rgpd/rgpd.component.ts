import { OnInit, Component } from "@angular/core";
import { AuthGuardRgpdService } from "./authGuardRgpd.service";
import { AuthRgpdService } from "./authRgpd.service";
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
// import { group } from "../../node_modules/@angular/animations";
// import { disableDebugTools } from "../../node_modules/@angular/platform-browser";
// import { DISABLED } from "../../node_modules/@angular/forms/src/model";



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
    rgpdFormGroup: FormGroup;
    // secondFormGroup: FormGroup;
    ts_Color = 'primary';
    ts_disabled = true;
    ts_Commercials_Checked = false;
    ts_NewsLetter_Checked = false;
    ts_SmsRdvRemider_Checked = false;
    ts_MailRdvReminder_Checked = false;
    cb_checked: boolean = false;
  

    constructor(private _authgardrgpdservice: AuthGuardRgpdService,
                private _authrgpdservice: AuthRgpdService,
                private _formBuilder: FormBuilder) {
                    try {
                        this.token = this._authrgpdservice.getRgpdTokenFromLS();
                        this.idClient = this._authrgpdservice.getIdClientFromToken(this.token);
                        this.rgpdPrenomClient = this._authrgpdservice.getPrenomClientFromToken(this.token);
                        this.emailClient = this._authrgpdservice.getEmailClientFromToken(this.token);
                    } catch (error) {
                        this.displaySendRgpdOptions = true;

                    }
                }

    ngOnInit() {
        this.rgpdFormGroup = this._formBuilder.group({
            // firstCtrl: new FormControl (''),
            // cbCtrl: new FormControl (''), cb_checked: true
            cbCtrl: new FormControl (this.cb_checked, Validators.requiredTrue)
          });
        //   this.secondFormGroup = this._formBuilder.group({
        //     secondCtrl: ['', Validators.required]
        //   })
    }
    

    public sendRgpdOptions(){
        console.log("Rgpdp options envoyées !");
        // this._authrgpdservice.removeRgpdTokenFromLS();
    }
    
}