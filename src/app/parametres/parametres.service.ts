import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { appConfig } from '../constant/apiOpusBeauteUrl';
import { map } from 'rxjs/internal/operators/map';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ParametresService {

  url: string = appConfig.apiOpusBeauteUrl + '/';

  // sms/sendpraticiens
  // sms/sendclients
  // email/sendpraticiens
  // email/sendclients
  constructor(private logger: NGXLogger,
              private httpCli: HttpClient) { }

  /**
   * envoyer SMS au Client
   */
  public forcerEnvoiSmSClientsRemider() {

    this.logger.info("Parametres Log : Procédure d'envoi de SMS au CliClients");

    this.httpCli
      .get( this.url + '/sms/sendclients')
      .subscribe(
        res => res
      )
  }

  /**
 * envoyer SMS au Praiciens
 */
  public forcerEnvoiSmSPraticiensRemider(): void {

    this.logger.info("Parametres Log : Procédure d'envoi de SMS au Praticiens");
    
    this.httpCli.get(this.url + 'sms/sendpraticiens')
    .subscribe(
      res => res
    );
  }

  /**
 * Envoyer Emails au Client
 */
  public forcerEnvoiEmailClientsRemider(): void {

    this.logger.info("Parametres Log : Procédure d'envoi d'Email au CLients");

    this.httpCli
      .get(this.url + 'email/sendclients')
      .subscribe(
        res => res
      );

  }

/**
* Envoyer Emails au Client
*/
public forcerEnvoiEmailPraticiensRemider(): void {

  this.logger.info("Parametres Log : Procédure d'envoi d'Email au Praticiens");

  this.httpCli
    .get(this.url + 'email/sendpraticiens')
    .subscribe(
      res => res
    );

}

}
