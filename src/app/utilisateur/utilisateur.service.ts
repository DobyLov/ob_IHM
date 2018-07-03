import { Injectable } from '@angular/core';
import { Utilisateur } from '../utilisateur/utilisateur';
import { Roles } from '../utilisateur/roles';
import { HttpClient } from '@angular/common/http';
import { appConfig } from '../constant/apiOpusBeauteUrl';
import { RequestOptions } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Credentials } from '../login/credentials';
import { CurrentUtilisateur } from '../login/currentUtilisateur';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';



@Injectable()
export class UtilisateurService {

  url: string = appConfig.apiOpusBeauteUrl + '/utilisateur';

  constructor(private HttpCli: HttpClient,
    private router: Router,
    public utilisateur: Utilisateur) { }

  public cUtilisateur$ = new BehaviorSubject<CurrentUtilisateur>(null);

  get getObsCurrentUtilisateur() {
    return this.cUtilisateur$.asObservable();
  }

  changeObsStatusOfCurrentUser(cUtilisateur: CurrentUtilisateur) {
    if (cUtilisateur === null) {
      this.cUtilisateur$.next(null);
      // console.log("Utilisateurservice : changeObsStatusOfCU : null")
    } else {
      this.cUtilisateur$.next(cUtilisateur);
      // console.log("Utilisateurservice : changeObsStatusOfCU : " + this.cUtilisateur$.value.nomUtilisateur)
    }
  }

  setCurrentUtilisateur(email) {

    let promise = new Promise<Utilisateur>((resolve, reject) => {
      this.HttpCli.get<Utilisateur>(this.url + '/finduserbymail/' + email)
        .toPromise()
        .then(resultaUtilisateur => {
          let cUz = this.mapUtilisateurToCurrentUtilisateur(resultaUtilisateur);
          // this.setCuToObservable(cUz);
          this.changeObsStatusOfCurrentUser(cUz);
        })
        .then(res => this.router.navigate(['./home']))
        .catch((err) => {
          console.log("erreur de la promesse");
        })

    })
  }


  mapUtilisateurToCurrentUtilisateur(utilisateur: Utilisateur): CurrentUtilisateur {
    let currentUtilisateur = new CurrentUtilisateur()
    currentUtilisateur.idUtilisateur = utilisateur.idUtilisateur;
    currentUtilisateur.prenomUtilisateur = utilisateur.prenomUtilisateur;
    currentUtilisateur.nomUtilisateur = utilisateur.nomUtilisateur;
    currentUtilisateur.adresseMailUtilisateur = utilisateur.adresseMailUtilisateur;
    currentUtilisateur.roles = utilisateur.roles;
    // console.log("UtilisateurService : setCu : utilisateur : " + utilisateur.nomUtilisateur);
    // console.log("UtilisateurService : setCu : currentUtilisateur : " + currentUtilisateur.nomUtilisateur);

    return currentUtilisateur;
  }

  setCuToObservable = function setCuToObservable(cU: CurrentUtilisateur) {
    this.cUtilisateur$.next(cU);
    console.log("Utilisateurservice : setCuToObs : " + this.cUtilisateur$);
  }

  getUserList() {
    return this.HttpCli.get<Utilisateur>(this.url + '/list')
      .subscribe(uList => { console.log("UtilisateurService : ListeUser : " + JSON.stringify(uList)) })

  }
  getUserById(idUser: number) {

    let utilisateur = this.HttpCli.get<Utilisateur>(this.url + '/idUtilisateur/' + idUser)
      .subscribe(data => { console.log("utilisateur connecte :" + data) });
  }

}