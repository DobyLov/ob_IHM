import { Injectable } from "../../../node_modules/@angular/core";
import { NGXLogger } from "../../../node_modules/ngx-logger";
import { Observable } from "../../../node_modules/rxjs";
import { appConfig } from "../constant/apiOpusBeauteUrl";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { LieuRdv } from "./lieuRdv";

@Injectable({
  providedIn: 'root'
})
export class LieuRdvService {

  url: string = appConfig.apiOpusBeauteUrl + '/lieurdv';

  constructor(private logger: NGXLogger,
              private _httpCli: HttpClient) {

              }


  public getLieuRdvList(): Observable<LieuRdv[]> {

      this.logger.info("LieuRdvService Log : Recupere la liste totale des LieuRdv");

      return this._httpCli
        .get<LieuRdv[]>(this.url + '/list')
        .pipe(map  (res  => res));

  }

  /**
   * Recupere le LieuRdv via son Id
   * @param idLieuRdv 
   */
  public getLieuRdvById(idLieuRdv: number): Observable<LieuRdv> {

    this.logger.info("LieuRdvService Log : Recuperation du LieuRdv via son Id");
    return this._httpCli
    .get<LieuRdv>(this.url + idLieuRdv)
    .pipe(map  (res  => res));

  }

  /**
   * Ajouter un  LieuRdv
   * @param lieuRdv 
   */
  public postLieuRdv(lieuRdv: LieuRdv): Observable<LieuRdv> {

    this.logger.info("LieuRdvService Log : Ajouter le  LieuRdv");
    this.logger.info("LieuRdvService Log : LieuRdv a persister : " + JSON.stringify(lieuRdv));
    let myHeaders = new HttpHeaders().set('Content-Type', 'application/json');
    let option = { headers: myHeaders }


    return this._httpCli.post<LieuRdv>(this.url + '/add', lieuRdv, option);     

  }

  /**
   * Modifie un LieuRdv
   * @param lieuRdv 
   */
  public putLieuRdv(lieuRdv: LieuRdv): Observable<LieuRdv> {

    this.logger.info("LieuRdvService Log : Modifie le  LieuRdv idLieuRdv : " + lieuRdv.idLieuRdv);
    this.logger.info("LieuRdvService Log : LieuRdvRdv a persister : " + JSON.stringify(lieuRdv));
    let myHeaders = new HttpHeaders().set('Content-Type', 'application/json');
    let option = { headers: myHeaders }

    return this._httpCli.post<LieuRdv>(this.url + '/mod', lieuRdv, option);     

  }

  /**
   * Supprime un LieuRdv
   * @param idLieuRdv 
   */
  public supprimeUnLieuRdv(idLieuRdv: number): Observable<LieuRdv> {

    this.logger.info("LieuRdvService Log : Modifie le  Rdv idRdv : " + idLieuRdv);
    // let myHeaders = new HttpHeaders().set('Content-Type', 'application/json');
    // let option = { headers: myHeaders }

    return this._httpCli
      .delete<LieuRdv>(this.url + '/del/' + idLieuRdv)
      .pipe(res => res);

  }
}
