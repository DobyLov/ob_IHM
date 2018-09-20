import { Injectable } from "../../../node_modules/@angular/core";
import { NGXLogger } from "../../../node_modules/ngx-logger";
import { Observable } from "../../../node_modules/rxjs";
import { Praticien } from "./praticien";
import { appConfig } from "../constant/apiOpusBeauteUrl";
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable(
    { providedIn: 'root' }
)
export class PraticienService {

    url: string = appConfig.apiOpusBeauteUrl + '/praticien';

    constructor( private logger: NGXLogger,
                 private httpCli: HttpClient){}


    /**
     * Retourne la liste complete de Praticien 
     */
    public getPraticienListe(): Observable<Praticien[]> {

        this.logger.info("PraticienService Log : Recupere la liste totale des Praticiens");

        return this.httpCli
          .get<Praticien[]>(this.url + '/liste')
          .pipe(map  (res  => res));

    }

    /**
     * Recupere un Praticien par son Id
     * @param idPratcien 
     */
    public getPraticienById( idPratcien: number): Observable<Praticien> {

        this.logger.info("PraticienService Log : Recupere un Praticien par son Id");

        return this.httpCli
          .get<Praticien>(this.url + '/' + idPratcien)
          .pipe(map  (res  => res));

    }

    public getPraticienByEmail( email: string): Observable<Praticien> {

        this.logger.info("PraticienService Log : Recupere un Praticien par son email : " + email);

        let myHttpParams = new HttpParams().append('email', `${email}`);

        return this.httpCli
          .get<Praticien>(this.url , { params: myHttpParams })
          .pipe(map  (res  => res));

    }

}