import { OnInit, Component, AfterViewInit } from "@angular/core";
import { Router } from "@angular/router";
import { NGXLogger } from "ngx-logger";

@Component({
    selector: 'app-rgpdurlaltered',
    templateUrl: '../rgpd/rgpdurlaltered.component.html',
    styleUrls: ['../rgpd/rgpdurlaltered.component.scss']
})
export class RgpdUrlAlteredComponent implements OnInit, AfterViewInit {

    constructor( private logger: NGXLogger,
                 private router: Router){}

    ngOnInit(){}

    ngAfterViewInit() {
        
        this.logger.info("RgpdUrlAlteredComponent Log : URL RGPD ALteree");
        setTimeout(() => {
            this.router.navigateByUrl(''); 
        }, 10000);

    }

}