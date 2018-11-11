import { Injectable, ChangeDetectorRef } from '@angular/core';
import { appConfig } from '../constant/apiOpusBeauteUrl';
import { BehaviorSubject, Observable } from 'rxjs';
import { ToasterService } from './toaster.service';
import { NGXLogger } from 'ngx-logger';
import { reject } from 'q';

@Injectable()
export class ReachServerService  {

    url: string = appConfig.apiOpusBeauteUrl + '/wadl';
    isServerOnLine$ = new BehaviorSubject<boolean>(true); 

    srvOnLine: boolean;
    nbDisplaySrvOneLine: number = 0;

    constructor( private logger: NGXLogger,
                 private _toasterService: ToasterService) { }

    // /**
    //  * Detection si le MiddleWare est accessible retourne un Observable
    //  * @returns Observable
    //  */
    // public checkSrvOnLine() {

    //     this.logger.info("ReachServerService log : Verification de la disponnibilite du serveur"); 
    //     let xhr = new XMLHttpRequest();
          
    //     return new Promise((resolve,reject)=>{   
          
    //       xhr.open('GET', this.url );
    //       xhr.send();    
          
    //       xhr.onload = ( () => {
                   
    //           resolve();
    //       })
    //       xhr.onerror = ( () => {
              
    //           reject();    
    //       })  
                   
    //     })
    //     .then( ()  => {

    //         this.isServerOnLine$.next(true);

    //         this.logger.info("ReachServerService log : Serveur en ligne");
            
    //         // Cette boucle sert a n afficher qu une seule fois le message
    //         // informantque le serveur est bien OnLine
    //         if ( this.nbDisplaySrvOneLine === 0) {

    //             this._toasterService.showToaster('Serveur Ok', 'snackbarInfo', 1000);
    //             this.nbDisplaySrvOneLine++;

    //         }
               
    //         // resolve();
    //     })
    //     .catch( () => {

    //         this.isServerOnLine$.next(false);   

    //         this.logger.error("ReachServerService log : Serveur non joignable "); 
    //         // Sert à faire le reset de la boucle d affichage afin d afficher le message
    //         // d information que le serveur est bien en ligne
    //         this.nbDisplaySrvOneLine = 0;
    //         this._toasterService.showToaster('Serveur Injoignable , appelez le support','snackbarWarning',5000);
    //         reject();
    //     })
        
    // }

    /**
     * Detection si le MiddleWare est accessible retourne un Observable
     * @returns boolean
     */
    public srvJoignableOuPas() :boolean {

        this.logger.info("ReachServerService log : Verification de la disponnibilite du serveur"); 
        let xhr = new XMLHttpRequest();
          
        let join = new Promise((resolve,reject)=>{   
          
          xhr.open('GET', this.url );
          xhr.send();    
          
          xhr.onload = ( () => {      
              resolve();
          })
          xhr.onerror = ( () => {
              reject();    
          })  
                   
        })
        .then( ()  => {

            this.isServerOnLine$.next(true); 
            this.srvOnLine = true;
            this.logger.info("ReachServerService log : Serveur en ligne");
            
            if ( this.nbDisplaySrvOneLine === 0) {

                this._toasterService.showToaster('Serveur Ok', 'snackbarInfo', 1000);
                this.nbDisplaySrvOneLine++;

            }            

        })

        .catch( () => {

            this.isServerOnLine$.next(false);
            this.srvOnLine = false;        
            this.logger.error("ReachServerService log : Serveur non joignable ");
            this.nbDisplaySrvOneLine = 0;
            this._toasterService.showToaster('Serveur Injoignable , appelez le support','snackbarWarning',5000);

        })

        return this.srvOnLine;
    }

    
    /**
     * Retourne le status du serveur Middleware,
     * si il est joignable.
     * @returns Observable
     */
    public getStatusofServerOnLine() {
        return this.isServerOnLine$.asObservable();
    } 
  
   

}