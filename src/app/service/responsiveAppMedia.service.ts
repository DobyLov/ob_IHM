import { Injectable } from "../../../node_modules/@angular/core";
import { NGXLogger } from "../../../node_modules/ngx-logger";
import { BreakpointObserver, Breakpoints } from "../../../node_modules/@angular/cdk/layout";
import { BehaviorSubject } from "../../../node_modules/rxjs/BehaviorSubject";
import { DeviceDetectorService } from 'ngx-device-detector';
import { Observable } from "../../../node_modules/rxjs/Observable";


Injectable()
export class ResponsiveAppMediaService {

    public isAMobilePlatform$ = new BehaviorSubject<boolean>(false);    
    public isMobileLandscape$ = new BehaviorSubject<boolean>(false);


    constructor(private logger: NGXLogger,
                private _devicedetectorservice: DeviceDetectorService,
                private _breakpointObserver: BreakpointObserver) {

                this.isDeviceIsMobile();
                this.isMobileOrientationLandscape();

                }


        
    private isDeviceIsMobile() {

        this.logger.info("ResponsiveAppMedia Log : Terminal mobile : " + this._devicedetectorservice.isMobile().valueOf());
        this.isAMobilePlatform$.next( this._devicedetectorservice.isMobile().valueOf())      
    }

    public getIsDeviceIsMobileStatus() {
        this.logger.info("ResponsiveAppMedia Log : Terminal mobile : " + this.isAMobilePlatform$.getValue());
        return this.isAMobilePlatform$.asObservable()
    }

    public isMobileOrientationLandscape() {
        return this._breakpointObserver.observe(Breakpoints.HandsetLandscape)
        .subscribe( orientationL => {
            this.logger.info("ResponsiveAppMediaService Log : Orientation Landscape : " + orientationL.matches)
            this.isMobileLandscape$.next(orientationL.matches) })

    }

    public getisMobileorientationLandscapeStatus() {
        this.logger.info("ResponsiveAppMediaService Log : Orientation Landscape : " + this.isMobileLandscape$);
        return this.isMobileLandscape$.asObservable();
    }

    



    

    // private detectIfSreenIsBiggerThan500px() {

    //         // Permet de detetcter de basculer en 
    //     this.breakpointObserver
    //             .observe(['(min-width: 500px)'])
    //             .subscribe((state: BreakpointState) => {

    //                 if (state.matches) {

    //                 this.logger.info("ResponsiveAppMediaService Log : Ecran > 500px = Desktop Mode");
    //                 this.isScreenIsMobile$.next(false);
    //                 this.statusOFIsMobile;

    //                 } else {

    //                 this.logger.info("ResponsiveAppMediaService Log : Ecran < 500px = Mobile Mode");
    //                 this.isScreenIsMobile$.next(true);
    //                 this.statusOFIsMobile;
    //                 }
    //     });
      
    // }
    
    // private get statusOFIsMobile() {

    //     this.logger.info("ResponsiveAppMediaService Log : Mobile Mode : " + this.isScreenIsMobile$.getValue());
    //     return this.isScreenIsMobile$.asObservable();
    // }

}