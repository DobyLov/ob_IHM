import { Injectable } from '@angular/core';
import { Utilisateur } from './utilisateur';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { appConfig } from '../constant/apiOpusBeauteUrl';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { CurrentUtilisateur } from '../login/currentUtilisateur';
import { Observable } from '../../../node_modules/rxjs';
import { NGXLogger } from '../../../node_modules/ngx-logger';
import { map } from 'rxjs/internal/operators/map';

@Injectable()
export class UtilisateurService {

  url: string = appConfig.apiOpusBeauteUrl + '/utilisateur';

  constructor(private logger: NGXLogger, 
              private httpCli: HttpClient,
              public utilisateur: Utilisateur) { }

  public cUtilisateur$ = new BehaviorSubject<CurrentUtilisateur>(null);

  get getObjCurrentUtilisateur(): Observable<CurrentUtilisateur> {
    return this.cUtilisateur$.asObservable();
  }

  /**
   * Change le status de l observable cutilisateur$
   * @param cUtilisateur 
   */
  private changeObsStatusOfCurrentUser(cUtilisateur: CurrentUtilisateur): void {

    this.logger.info("Utilisateurservice Log : Change le status de CurrentUser.")
    if (cUtilisateur === null) {

      this.cUtilisateur$.next(null);
      this.logger.info("Utilisateurservice Log : CurrentUtilisateur purge a : null");

    } else {

      this.cUtilisateur$.next(cUtilisateur);
      this.logger.info("Utilisateurservice Log : CurrentUtilisateur Email : " + cUtilisateur.adresseMailUtilisateur);

    }
  }

  /**
   * Recherche un utilisateur via son Email
   * et l assigne comme CurrentUtilsateur
   * @param email 
   */
  public async setCurrentUtilisateur(email: string) {
    // let urlAsked = this.router.url;
    this.logger.info("Utilisateurservice Log : Demande au MW l utilisateur : " + email); 
    let promise = await new Promise<Utilisateur>((resolve, reject) => {      
      this.httpCli.get<Utilisateur>(this.url + '/finduserbymail/' + email)
        .toPromise()
        .then(resultaUtilisateur => {
          this.logger.info("UtilisateurService Log : utilisateur trouve");
          let cUz = this.mapUtilisateurToCurrentUtilisateur(resultaUtilisateur);
          this.changeObsStatusOfCurrentUser(cUz);
          // resolve(); // ajouté le 03/11
        })
        .catch((err) => {
          this.logger.info("UtilisateurService Log : Erreure de la promesse");
          // reject();// ajouté le 03/11
        })

    })
  }

  /**
   * Map un objet Utilisateur vers un Objet CUtilisateur
   * @param utilisateur 
   * @returns CurrentUser
   */
  private mapUtilisateurToCurrentUtilisateur(utilisateur: Utilisateur): CurrentUtilisateur {

    this.logger.info("Utilisateurservice Log : Map de l objet Utilisateur vers un Objet CUtilisateur");
    let currentUtilisateur = new CurrentUtilisateur()
    currentUtilisateur.idUtilisateur = utilisateur.idUtilisateur;
    currentUtilisateur.prenomUtilisateur = utilisateur.prenomUtilisateur;
    currentUtilisateur.nomUtilisateur = utilisateur.nomUtilisateur;
    currentUtilisateur.adresseMailUtilisateur = utilisateur.adresseMailUtilisateur;
    currentUtilisateur.rolesUtilisateur = utilisateur.rolesUtilisateur;

    return currentUtilisateur;
  }

  /**
   * Callback pour definir l objet CurrentUtilisateur en Observable
   */
  private setCuToObservable = function setCuToObservable(cU: CurrentUtilisateur) {

    this.logger.info("Utilisateurservice Log : Set de l Objet CurrentUtilisateur en Observable.");
    this.cUtilisateur$.next(cU);

  }

  /**
   * Recupere la liste des utilisateurs 
   */
  public getUserList(): Observable<Utilisateur[]> {

    this.logger.info("PrestationService Log : Recupere la liste totale des Prestations");

    return this.httpCli
      .get<Utilisateur[]>(this.url + '/list')
      .pipe(map(res => res));
      
    // return this.httpCli.get<Utilisateur>(this.url + '/list')
    //   .subscribe( uList  => { console.log("UtilisateurService : ListeUser : " + JSON.stringify(uList)) })

  }

  /**
   * Recupere un Utilisateur par son Id
   * @param idUser 
   * @returns Observable<Utilisateur>
   */
  private getUserById(idUser: number) {

    return this.httpCli.get<Utilisateur>(this.url + '/idUtilisateur/' + idUser)
      .subscribe( data => { console.log("utilisateur connecte :" + data) } );
  }


      /**
   * Ajouter un utilisateur
   * @param utilisateur 
   */
  public post(user: Utilisateur): Observable<Utilisateur> {

    this.logger.info("UtilisateurService Log : Ajouter le  Utilisateur");
    this.logger.info("UtilisateurService Log : Utilisateur a persister : " + JSON.stringify(user));

    let myHeaders = new HttpHeaders().set('Content-Type', 'application/json');
    let option = { headers: myHeaders }
    return this.httpCli.post<Utilisateur>(this.url + '/add', user, option);

}

}