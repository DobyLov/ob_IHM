import { Injectable } from "../../../node_modules/@angular/core";
import { NGXLogger } from "../../../node_modules/ngx-logger";
import { Observable } from "../../../node_modules/rxjs";
import { appConfig } from "../constant/apiOpusBeauteUrl";
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Prestation } from "./prestation";

@Injectable({
  providedIn: 'root'
})
export class PrestationService {


  url: string = appConfig.apiOpusBeauteUrl + '/prestation';

  constructor(private logger: NGXLogger,
    private httpCli: HttpClient) { }


  /**
  * Retourne la liste complete de Prestations 
  */
  public getPrestationList(): Observable<Prestation[]> {

    this.logger.info("PrestationService Log : Recupere la liste totale des Prestations");

    return this.httpCli
      .get<Prestation[]>(this.url + '/list')
      .pipe(map(res => res));

  }

  /**
  * Retourne la liste activite filtree depuis la liste de prestation
  */
  public getPrestationListByActivity() {

  this.logger.info("PrestationService Log : Recupere la liste totale des Prestations");

  return this.httpCli
    .get<Prestation[]>(this.url + '/list')
    .pipe(map(res => res));

}
}
