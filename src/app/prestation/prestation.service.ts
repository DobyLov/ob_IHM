import { Injectable } from "../../../node_modules/@angular/core";
import { NGXLogger } from "../../../node_modules/ngx-logger";
import { Observable } from "../../../node_modules/rxjs";
import { appConfig } from "../constant/apiOpusBeauteUrl";
import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  public getPrestationById(idPrestation: number): Observable<Prestation> {

    this.logger.info("PrestationService Log : Récupère la prestation par son Id");

    return this.httpCli
      .get<Prestation>(this.url + "/" + idPrestation)
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

  /**
* Ajouter une prestation
* @param prestation 
*/
  public post(prestation: Prestation): Observable<Prestation> {

    this.logger.info("PraticienService Log : Ajouter le  Praticien");
    this.logger.info("PraticienService Log : Praticien a persister : " + JSON.stringify(prestation));

    let myHeaders = new HttpHeaders().set('Content-Type', 'application/json');
    let option = { headers: myHeaders }
    return this.httpCli.post<Prestation>(this.url + '/add', prestation, option);

  }
}
