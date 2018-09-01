import { Injectable } from '@angular/core';
import { Rgpd } from './rgpd';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { appConfig } from '../constant/apiOpusBeauteUrl';
import { Observable } from '../../../node_modules/rxjs';
import { BottomSheetService } from '../service/bottomsheet.service';
import { NGXLogger } from '../../../node_modules/ngx-logger';

@Injectable(
  { providedIn: 'root' }
)
export class RgpdService {

  url: string = appConfig.apiOpusBeauteUrl + '/rgpd';
  constructor(  private logger: NGXLogger,
                private httpCli: HttpClient,
                private _bottomsheetservice: BottomSheetService) { }

  /**
   * Recupere les Settings Rgpd du Client
   * depuis la Bdd
   * @param emailClient 
   */
  public getRgpdClientSettings(emailClient: string): Observable<Rgpd> {

    let rgpdHeaders: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    let rgpdHttpParams = new HttpParams().set("rgpdEmailClient", emailClient);

    return this.httpCli.get<Rgpd>( this.url, {headers: rgpdHeaders, params: rgpdHttpParams });
    
  }

  /**
   * Persiste les nouveaux Settings Rgpd du Client dans la Bdd
   * @param rgpd 
   */
  public setRgpdClientSettings(rgpd: Rgpd): void {
    
    let body: Rgpd = rgpd;
    this.httpCli.put(this.url + "/updatesettings/", body, { responseType: 'json' })
      .subscribe(
        (res: Rgpd)  => 
        { 
          this.openBottomSheet("Vos préférence sont enregistrées");
          this.logger.info("rgpdService Log : Les Nouveaux Settings sont persistes");
        },
        err => {
          this.openBottomSheet("Il y a eu un problème, vos préférences ne sont pas enregistrées");
          this.logger.error("rgpdService Log : Les Nouveaux Settings n ont pas etes persistes");
        })
  }

  openBottomSheet(msg: string): void {
    this._bottomsheetservice.openBottomSheet(msg);
  }

}
