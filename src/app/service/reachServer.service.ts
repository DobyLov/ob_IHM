import { Injectable } from '@angular/core';
import { appConfig } from '../constant/apiOpusBeauteUrl';
import { BehaviorSubject } from 'rxjs';
import { ToasterService } from './toaster.service';
import { NGXLogger } from 'ngx-logger';

@Injectable()
export class ReachServerService  {

    url: string = appConfig.apiOpusBeauteUrl + '/wadl';
    isServerOnLine$ = new BehaviorSubject<boolean>(false); 

    constructor( private logger: NGXLogger,
                 private _toasterService: ToasterService)  
                    {
                         
                        this.checkSrvOnLine();
                    }

    /**
     * Detection si le MiddleWare est accessible
     */
    private checkSrvOnLine() {

        this.logger.info("ReachServer log : Verification de la disponnibilite du serveur"); 
        let xhr = new XMLHttpRequest();
          
        return new Promise((resolve, reject)=>{   
          
          xhr.open('GET', this.url );
          xhr.send();         
          xhr.onload = ( () => {
              this.isServerOnLine$.next(true);
              this.logger.info("ReachServer log : Serveur en ligne");
              this._toasterService.showToaster('Serveur Ok','snackbarInfo',2000);      
              resolve();
          })
          xhr.onerror = ( () => {
              this.isServerOnLine$.next(false);
              this.logger.info("ReachServer log : Serveur non joignable");    
              this._toasterService.showToaster('Serveur Injoignable , appelez le support','snackbarWarning',5000);
            //   reject();    
          })           
        })
    }

    
    /**
     * Retourne le status du serveur Middleware,
     * si il est joignable.
     * @returns Observable
     */
    public getStatusofServerOnLine() {
        return this.isServerOnLine$.asObservable();
    } 
  
    // private getSrvStatus() {
    //     this.checkSrvOnLine().then(() => {
    //         this.logger.info("HeaderComponent Log : Serveur en ligne");
    //     }).catch(() => {
    //       this.logger.error("HeaderComponent Log : Serveur non joignable catch");
    //         this._toasterService.openBottomSheet("Serveur non joignable");
    //     });
    // }

}