import { Injectable } from '@angular/core';
import { appConfig } from '../constant/apiOpusBeauteUrl';
import { NGXLogger } from 'ngx-logger';
import { HttpClient } from '@angular/common/http';
import { Rdv } from './rdv';


@Injectable(
  { providedIn: 'root' }
)
export class RdvService {

  url: string = appConfig.apiOpusBeauteUrl + '/rdv';

  constructor( private logger: NGXLogger,
               private httpCli: HttpClient) { 

  }

  public getRdvList() {

    this.logger.info("RdvService Log : Recupere la liste totale de Rdv");
    this.httpCli.get<Rdv>(this.url + '/list').subscribe(res =>  { JSON.stringify(res)
      //  { 
        console.log("listerdv : res" + res);
      // console.log("listerdv : res" + res.client.nomClient);
      // console.log("listerdv : res" + res.client.prenomClient);
      // console.log("listerdv : res" + res.prestation.activite);
      // console.log("listerdv : res" + res.prestation.soin);
      // console.log("listerdv : res" + res.dateHeureDebut);
      // console.log("listerdv : res" + res.dateHeureFin);
      // console.log("listerdv : res" + res.praticien.prenomPraticien);
      // console.log("listerdv : res" + res.lieuRdv.lieuRdv);
      // console.log("listerdv : res" + res.lieuRdv.adresseLieuRdv.numero);
      // console.log("listerdv : res" + res.lieuRdv.adresseLieuRdv.rue);
      // console.log("listerdv : res" + res.lieuRdv.adresseLieuRdv.ville);
      // console.log("listerdv : res" + res.lieuRdv.adresseLieuRdv.zipCode);
    } 
    );

  }

  public getRdvById() {

  }

  public getRdvListByDate() {

  }

  public getRdvListByRangOfDate() {

  }

  public getRdvListByClientName() {

  }

  public getRdvListByPraticien() {

  }

  public getRdvListByPrestation() {

  }

  public getRdvListBySoin() {

  }
}
