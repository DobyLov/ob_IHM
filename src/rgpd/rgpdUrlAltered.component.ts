import { OnInit, Component, AfterViewInit } from "@angular/core";
import { Router } from "../../node_modules/@angular/router";

@Component({
    selector: 'app-rgpdurlaltered',
    templateUrl: '../rgpd/rgpdurlaltered.component.html',
    styleUrls: ['../rgpd/rgpdurlaltered.component.scss']
})
export class RgpdUrlAlteredComponent implements OnInit, AfterViewInit {

    constructor(private router: Router){}

    ngOnInit(){}

    ngAfterViewInit() {
        setTimeout(() => {
            this.router.navigateByUrl(''); 
        }, 10000);
    }

}