import { Injectable } from "../../../node_modules/@angular/core";
import { NGXLogger } from "../../../node_modules/ngx-logger";
import { BreakpointState, BreakpointObserver } from "../../../node_modules/@angular/cdk/layout";
import { BehaviorSubject } from "../../../node_modules/rxjs/BehaviorSubject";
import { Observable } from "../../../node_modules/rxjs/Observable";

Injectable()
export class ResponsiveAppMediaService {

    public isScreenIsMobile$ = new BehaviorSubject<boolean>(false);

    constructor(private logger: NGXLogger,
                public breakpointObserver: BreakpointObserver) {

                    this.detectIfSreenIsBiggerThan500px();
                }



    private detectIfSreenIsBiggerThan500px() {

            // Permet de detetcter de basculer en 
        this.breakpointObserver
                .observe(['(min-width: 500px)'])
                .subscribe((state: BreakpointState) => {

                    if (state.matches) {

                    this.logger.info("ResponsiveAppMediaService Log : Ecran > 500px = Desktop Mode");
                    this.isScreenIsMobile$.next(false);
                    this.statusOFIsMobile;

                    } else {

                    this.logger.info("ResponsiveAppMediaService Log : Ecran < 500px = Mobile Mode");
                    this.isScreenIsMobile$.next(true);
                    this.statusOFIsMobile;
                    }
        });
      
    }
    
    public get statusOFIsMobile() {

        this.logger.info("ResponsiveAppMediaService Log : Mobile Mode : " + this.isScreenIsMobile$.getValue());
        return this.isScreenIsMobile$.asObservable();
    }

}