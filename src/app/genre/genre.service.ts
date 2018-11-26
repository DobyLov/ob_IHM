import { Injectable } from "../../../node_modules/@angular/core";
import { NGXLogger } from "../../../node_modules/ngx-logger";
import { Observable } from "../../../node_modules/rxjs";
import { appConfig } from "../constant/apiOpusBeauteUrl";
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Genre } from "./genre";

@Injectable()
export class GenreService {

    url: string = appConfig.apiOpusBeauteUrl + '/genre';

    constructor(private logger: NGXLogger,
                private _httpCli: HttpClient) {

                }


    public getGenreList(): Observable<Genre[]> {

        this.logger.info("GenreService Log : Recupere la liste totale des Genres");

        return this._httpCli
          .get<Genre[]>(this.url + '/list')
          .pipe(map  (res  => res));

    }
}