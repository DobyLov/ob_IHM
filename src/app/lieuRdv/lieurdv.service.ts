import { Injectable } from "../../../node_modules/@angular/core";
import { NGXLogger } from "../../../node_modules/ngx-logger";
import { Observable } from "../../../node_modules/rxjs";
import { appConfig } from "../constant/apiOpusBeauteUrl";
import { HttpClient } from '@angular/common/http';
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
}
