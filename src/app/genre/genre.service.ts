import { Injectable } from "../../../node_modules/@angular/core";
import { NGXLogger } from "../../../node_modules/ngx-logger";
import { Observable } from "../../../node_modules/rxjs";
import { appConfig } from "../constant/apiOpusBeauteUrl";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Genre } from "./genre";

@Injectable()
export class GenreService {

    url: string = appConfig.apiOpusBeauteUrl + '/genre';

    constructor(private logger: NGXLogger,
        private _httpCli: HttpClient) {

    }

    /**
     * Recupere la liste des genres
     * @returns Observable<Genre[]>
     */
    public getGenreList(): Observable<Genre[]> {

        this.logger.info("GenreService Log : Recupere la liste totale des Genres");

        return this._httpCli
            .get<Genre[]>(this.url + '/list')
            .pipe(map(res => res));

    }

    /**
     * Recupere le Genre en fonction de l id Fourni
     * @param idGenre 
     */
    public getGenrebyId(idGenre: number): Observable<Genre> {

        this.logger.info("GenreService Log : Recupere un Genre par l id fourni");

        return this._httpCli
            .get<Genre>(this.url + idGenre)
            .pipe(map(res => res));
    }


    /**
     * Ajouter un Genre
     * @returns Observable<Genre>
     */
    public postGenre(genre: Genre): Observable<Genre> {

        this.logger.info("GenreService Log : Ajouter le  genre");
        this.logger.info("GenreService Log : genre a persister : " + JSON.stringify(genre));
        let myHeaders = new HttpHeaders().set('Content-Type', 'application/json');
        let option = { headers: myHeaders }

        return this._httpCli.post<Genre>(this.url + '/add', genre, option);

    }

    /**
     * Modifie un Genre
     * @param genre 
     */
    public putGenre(genre: Genre): Observable<Genre> {

        this.logger.info("GenreService Log : Modifie le  Genre  : " + genre.idGenre);
        this.logger.info("GenreService Log : Genre a persister : " + JSON.stringify(genre));
        let myHeaders = new HttpHeaders().set('Content-Type', 'application/json');
        let option = { headers: myHeaders }

        return this._httpCli.post<Genre>(this.url + '/mod', genre, option);

    }

    /**
     * Supprime un genre
     * @param idGenre 
     */
    public supprimeUnGenre(idGenre: number): Observable<Genre> {

        this.logger.info("GenreService Log : Modifie le  Genre idGenre : " + idGenre);
        // let myHeaders = new HttpHeaders().set('Content-Type', 'application/json');
        // let option = { headers: myHeaders }

        return this._httpCli
            .delete<Genre>(this.url + '/del/' + idGenre)
            .pipe(res => res);

    }
}