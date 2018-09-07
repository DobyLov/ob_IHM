import { Injectable } from "@angular/core";
import { Client } from "./client";
import { appConfig } from "../constant/apiOpusBeauteUrl";
import { HttpHeaders, HttpParams, HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import { NGXLogger } from 'ngx-logger';

@Injectable(
    { providedIn: 'root' }
)
export class ClientService {


    url: string = appConfig.apiOpusBeauteUrl + '/client';

    constructor ( private logger: NGXLogger,
                  private httpCli: HttpClient){}


    /**
     * Retourne le Client Recherché par son ID
     * 
     * @param idClient number
     * @return Observable<Client>
     */
    public getClientByID(idClient: number): Observable<Client> {        
        this.logger.info("ClientService: Log : Demande Client Id a la Bdd : " + idClient)
        let rgpdHeaders: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

        return this.httpCli.get<Client>( this.url + "/" + idClient, { headers: rgpdHeaders });
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

        return this.httpCli.get<Client>( this.url, {headers: rgpdHeaders, params: rgpdHttpParams }); 
    }

    // recupereer la liste des clients
    // liste des clients par Genre


}