import { Injectable } from '@angular/core';
import { Rgpd } from './rgpd';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { appConfig } from '../constant/apiOpusBeauteUrl';
import { Observable } from 'rxjs';
import { BottomSheetService } from '../service/bottomsheet.service';
import { NGXLogger } from 'ngx-logger';
import { Client } from '../client/client';
import { ClientService } from '../client/client.service';
import { AuthRgpdService } from './authRgpd.service';

@Injectable(
  { providedIn: 'root' }
)
export class RgpdService {

  url: string = appConfig.apiOpusBeauteUrl + '/rgpd';
  constructor(  private logger: NGXLogger,
                private httpCli: HttpClient,
                private _clientservice: ClientService,
                private _authrgpdservice: AuthRgpdService,
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
    
    if(this._authrgpdservice.isRgpdTokenDateIsValid(this._authrgpdservice.getRgpdTokenFromLS())) {

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
    
    } else {

          this.openBottomSheet("Votre Lien n'est plus valide, vos préférences ne sont pas enregistrées");

    }

  }

  /**
   * Retourne le Client cherché par son Id
   * 
   * @param idClient
   * @returns Observable<Client>
   */
  public getClientById(idClient: number): Observable<Client> {

    return this._clientservice.getClientByID(idClient);
  }


  /**
   * Recuepere le Client cherche par son AdresseEmail
   * 
   * @param adresseClient 
   * @returns Observable<Client>
   */
  public getClientByEmail(adresseClient: string): Observable<Client> {

    return this._clientservice.getClientByEmail(adresseClient);
  }

  openBottomSheet(msg: string): void {
    this._bottomsheetservice.openBottomSheet(msg);
  }

}
