import { Component, OnInit } from '@angular/core';
import { DeviceDetectorService } from '../../../node_modules/ngx-device-detector';
import { NGXLogger } from '../../../node_modules/ngx-logger';


@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  
  osIsMobile: boolean = false;
  isDeviceIsATablet: boolean;
  deviceBrand: string;

  constructor(private logger: NGXLogger,
              private _detectdeviceservice: DeviceDetectorService ) { }

  ngOnInit() {
    this.getInfoDevice();
  }

  private getInfoDevice() {
    this.logger.info("WelcomeComponent Log : detection du Device :");
    this.deviceBrand = this._detectdeviceservice.getDeviceInfo().device;
    this.logger.info("WelcomeComponent Log : Device detecte  :" + this.deviceBrand);    
    this.logger.info("WelcomeComponent Log : Device mobile  :" + this._detectdeviceservice.isMobile());  
    this.checkIfDeviceIsATablet();  
    
  }

  private checkIfDeviceIsATablet() {

    this.logger.info("WelcomeComponent Log : Check Device is a tablet  :"); 
    if ( this._detectdeviceservice.isTablet() )  {
      this.isDeviceIsATablet = true
      this.logger.info("WelcomeComponent Log : Check Device is a tablet  :" + this.isDeviceIsATablet);
    } 

    this.setIsMobile();
  }

  private setIsMobile() {

    if ( this._detectdeviceservice.isTablet() || this._detectdeviceservice.isMobile() ) {
      this.osIsMobile = true;
    }

  }
  

}
