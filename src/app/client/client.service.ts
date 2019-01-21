import { Injectable } from "../../../node_modules/@angular/core";
import { NGXLogger } from "../../../node_modules/ngx-logger";
import { Observable } from "../../../node_modules/rxjs";
import { appConfig } from "../constant/apiOpusBeauteUrl";
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Client } from "./client";

@Injectable(
    { providedIn: 'root' }
)
export class ClientService {


    url: string = appConfig.apiOpusBeauteUrl + '/client';

    constructor( private logger: NGXLogger,
                 private httpCli: HttpClient) { }


    /**
     * Retourne le Client Recherché par son ID
     * 
     * @param idClient number
     * @return Observable<Client>
     */
    public getClientByID(idClient: number): Observable<Client> {
        this.logger.info("ClientService: Log : Demande Client Id a la Bdd : " + idClient)
        let rgpdHeaders: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

        return this.httpCli.get<Client>(this.url + "/" + idClient, { headers: rgpdHeaders });
    }

    /**
     * Retourne le Client Recherché par son Email
     * 
     * @param adresseMailClient string
     * @returns Observable<Client>
     */
    public getClientByEmail(adresseMailClient: string): Observable<Client> {

        this.logger.info("ClientService: Log : Demande Client par son Email : " + adresseMailClient);
        let rgpdHeaders: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
        let rgpdHttpParams = new HttpParams().set("adresseMailClient", adresseMailClient);

        return this.httpCli.get<Client>(this.url, { headers: rgpdHeaders, params: rgpdHttpParams });
    }

    // recupereer la liste des clients
    /**
     * Recupere la liste complete de client
     */
    public getClientList(): Observable<Client[]> {

        this.logger.info("CleintService Log : Recupere la liste totale des Clients");

        return this.httpCli
            .get<Client[]>(this.url + '/list')
            .pipe(map(res => res));

    }


    /**
   * Ajouter un Client
   * @param client 
   */
    public postClient(client: Client): Observable<Client> {

        this.logger.info("ClientService Log : Ajouter le  Client");
        this.logger.info("ClientService Log : Client a persister : " + JSON.stringify(client));

        let myHeaders = new HttpHeaders().set('Content-Type', 'application/json');
        let option = { headers: myHeaders }
        return this.httpCli.post<Client>(this.url + '/add', client, option);

    }

    /**
     * Modifier un Client
     * @param client 
     */
    public putClient(client: Client): Observable<string> {

        this.logger.info("ClientService Log : Modifie le  Client idClient : " + client.idClient);
        this.logger.info("ClientService Log : Cleint a modifier : " + JSON.stringify(client));

        let myHeaders = new HttpHeaders()
            .set('Content-Type', 'text/plain')
            .set('Response', 'text');

        let option = { headers: myHeaders }

        return this.httpCli.put<string>(this.url + '/mod', client, option);

    }


      /**
   * Supprime un Client
   * @param idcleint
   * @returns Observable<string>
   */
  public delClient(idClient: number): Observable<string> {

    this.logger.info("CleintService Log : Suppression du Client id: " + idClient); 

    let myHeaders = new HttpHeaders().set('Content-Type', 'application/json');
    let option = { headers: myHeaders }    
    return this.httpCli
      .delete<string>( this.url + '/del/' + idClient,  option )
      .pipe(res => res);

  }



}