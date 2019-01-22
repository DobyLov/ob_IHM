import { Injectable } from "@angular/core";
import { NGXLogger } from "ngx-logger";
import { Observable } from "rxjs";
import { appConfig } from "../constant/apiOpusBeauteUrl";
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { RolesUtilisateur } from "./rolesUtilisateur";

@Injectable()
export class RolesUtilisateurService {


  url: string = appConfig.apiOpusBeauteUrl + '/roles';

  constructor(private logger: NGXLogger,
    private httpCli: HttpClient) { }


  /**
  * Retourne la liste complete de Prestations 
  */
  public getRolesList(): Observable<RolesUtilisateur[]> {

    this.logger.info("PrestationService Log : Recupere la liste totale des Prestations");

    return this.httpCli
      .get<RolesUtilisateur[]>(this.url + '/list')
      .pipe(map(res => res));

  }

  public getRolesById(idRoles: number): Observable<RolesUtilisateur> {

    this.logger.info("PrestationService Log : Récupère la prestation par son Id");

    return this.httpCli
      .get<RolesUtilisateur>(this.url + "/" + idRoles )
      .pipe(map(res => res));

  }
}
