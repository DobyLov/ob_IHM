import { Injectable } from '@angular/core';
import { appConfig } from '../constant/apiOpusBeauteUrl';
import { NGXLogger } from 'ngx-logger';
import { HttpClient, HttpParams, HttpHeaderResponse } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Rdv } from './rdv';
import { Observable, throwError } from 'rxjs';


@Injectable(
  { providedIn: 'root' }
)
export class RdvService {

  url: string = appConfig.apiOpusBeauteUrl + '/rdv';

  constructor( private logger: NGXLogger,
               private httpCli: HttpClient) { 

  }

/**
 * recupere la liste totale de rdv
 */
  public getRdvListTotale(): Observable<Rdv[]> {

    this.logger.info("RdvService Log : Recupere la liste totale de Rdv");

    return this.httpCli
      .get<Rdv[]>(this.url + '/liste')
      .pipe(map  (res  => res));
       
  }

  /**
   * Recupere un rdv par son id
   * @param idRdv 
   * @returns Observble<Rdv>
   */
  public getRdvById(idRdv: number): Observable<Rdv> {

    this.logger.info("RdvService Log : Recupere le Rdv par son id");

    return this.httpCli
      .get<Rdv>(this.url + '/' + idRdv)
      .pipe(map  (res  => res));
  }

  /**
   * Recupere la liste totale de rdv via une date fournie
   * @param dateFournie 
   * @returns Observable<Rdv[]>
   */
  public getRdvListeTotaleParDate(dateFournie: string): Observable<Rdv[]> {

    this.logger.info("RdvService Log : Recupere la liste totale par Date");

    let myHttpParams= new HttpParams();
    myHttpParams.append("date", `${dateFournie}`);

    return this.httpCli
      .get<Rdv[]>(this.url + '/listepardate' , { params: myHttpParams })
      .pipe(map  (res  => res));

  }


/**
 * Recupere la liste de Rdv par Date fournie et par idpraticien 
 * @param dateFournie 
 * @param idPraticien 
 * @returns Observable<Rdv[]>
 */
  public getRdvListByByDateAndByPraticien( dateFournie: string, idPraticien: number ): Observable<Rdv[]> {

    this.logger.info("RdvService Log : Recupere la liste par Date par praticien selectionne");

    // let myHttpParams = new HttpParams()
    // .append("date", `${dateFournie}`);
    // .append("idPraticien", `${idPraticien}`);

    return this.httpCli

      .get<Rdv[]>(this.url + '/listepardateparpraticien' , { params: new HttpParams().append("date", `${dateFournie}`).append("idPraticien", `${idPraticien}`) })
      .pipe(map  (res => res), catchError ( (e:HttpHeaderResponse) => throwError(e) ) );

  }

  /**
   * Recupere la liste de Rdv par plage de dates fournies et par idPratien
   * @param dateA 
   * @param dateB 
   * @param idPraticien 
   * @returns Observable<Rdv[]>
   */
  public getRdvListRangeOfDateADateBAndByPraticien( dateA: string, dateB: string, idPraticien: number, ): Observable<Rdv[]> {

    this.logger.info("RdvService Log : Recupere la liste par plage de date et par praticien");

    let myHttpParams = new HttpParams();
    myHttpParams.append("dateA", `${dateA}`);
    myHttpParams.append("dateB", `${dateB}`);
    myHttpParams.append("idPraticien", `${idPraticien}`);

    return this.httpCli
      .get<Rdv[]>(this.url + '/listeparplagedateparpraticien' , { params: myHttpParams })
      .pipe(map  (res  => res));

  }

  /**
   * Recupere la liste de rdv par l id client
   * @param idClient 
   * @returns Observable<Rdv[]>
   */
  public getRdvListByClientName( idClient: number ): Observable<Rdv[]> {

    this.logger.info("RdvService Log : Recupere la liste par l id du client");

    let myHttpParams = new HttpParams();
    myHttpParams.append("idClient", `${idClient}`);

    return this.httpCli
      .get<Rdv[]>(this.url + '/listeparplagedateparpraticien' , { params: myHttpParams })
      .pipe(map  (res  => res));    

  }


}
