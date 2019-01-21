import { Injectable } from "../../../node_modules/@angular/core";
import { NGXLogger } from "../../../node_modules/ngx-logger";
import { Observable } from "../../../node_modules/rxjs";
import { appConfig } from "../constant/apiOpusBeauteUrl";
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Roles } from "./roles";

@Injectable()
export class RolesService {


  url: string = appConfig.apiOpusBeauteUrl + '/roles';

  constructor(private logger: NGXLogger,
    private httpCli: HttpClient) { }


  /**
  * Retourne la liste complete de Prestations 
  */
  public getRolesList(): Observable<Roles[]> {

    this.logger.info("PrestationService Log : Recupere la liste totale des Prestations");

    return this.httpCli
      .get<Roles[]>(this.url + '/list')
      .pipe(map(res => res));

  }

  public getRolesById(idRoles: number): Observable<Roles> {

    this.logger.info("PrestationService Log : Récupère la prestation par son Id");

    return this.httpCli
      .get<Roles>(this.url + "/" + idRoles )
      .pipe(map(res => res));

  }
}
