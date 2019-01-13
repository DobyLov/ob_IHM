import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { appConfig } from '../constant/apiOpusBeauteUrl';
import { Observable } from 'rxjs';
import { Activite } from './activite';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ActiviteService {

  url: string = appConfig.apiOpusBeauteUrl + '/activite';

  constructor(private logger: NGXLogger,
    private _httpCli: HttpClient) {

  }

  /**
   * Recuperer la liste de activites
   * @Returns Observable<Activite[]>
   */
  public getActiviteList(): Observable<Activite[]> {

    this.logger.info("ActiviteService Log : Recupere la liste totale des Activites");

    return this._httpCli
      .get<Activite[]>(this.url + '/list')
      .pipe(map(res => res));

  }

  /**
   * Recuperer l activite par son Id
   * @param idActivite 
   */
  public getActiviteById(idActivite: number): Observable<Activite> {

    this.logger.info("ActiviteService Log : Recupere l Activite par son id");

    return this._httpCli
      .get<Activite>(this.url + '/' + idActivite)
      .pipe(map(res => res));
  }

  /**
   * Ajouter une activite
   * @param activite 
   */
  public postActivite(activite: Activite): Observable<Activite> {

    this.logger.info("ActiviteService Log : Ajouter le  Activite");
    this.logger.info("ActiviteService Log : Activite a persister : " + JSON.stringify(activite));
    let myHeaders = new HttpHeaders().set('Content-Type', 'application/json');
    let option = { headers: myHeaders }

    return this._httpCli.post<Activite>(this.url + '/add', activite, option);

  }
  /**
   * Modifier une activite
   * @param activite 
   */
  public putActivite(activite: Activite): Observable<Activite> {

    this.logger.info("ActiviteService Log : Modifie l Activite  : " + activite.idActivite);
    this.logger.info("ActiviteService Log : Activite a persister : " + JSON.stringify(activite));
    let myHeaders = new HttpHeaders().set('Content-Type', 'application/json');
    let option = { headers: myHeaders }

    return this._httpCli.post<Activite>(this.url + '/mod', activite, option);

  }

  /**
   * Supprimer une activite
   * @param idActivite 
   */
  public supprimeUneActivite(idActivite: number): Observable<Activite> {

    this.logger.info("ActiviteService Log : Supprime l Activite idActivite : " + idActivite);
    // let myHeaders = new HttpHeaders().set('Content-Type', 'application/json');
    // let option = { headers: myHeaders }

    return this._httpCli
        .delete<Activite>(this.url + '/del/' + idActivite)
        .pipe(res => res);

}

}
