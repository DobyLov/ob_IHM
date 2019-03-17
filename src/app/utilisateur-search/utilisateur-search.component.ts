import { Component, OnInit, Output, ChangeDetectorRef } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { HistoryRoutingService } from '../service/historyRouting.service';
import { Router } from '@angular/router';
import { ToasterService } from '../service/toaster.service';
import { CurrentUtilisateur } from '../login/currentUtilisateur';
import { Subscription } from 'rxjs';
import { Utilisateur } from '../utilisateur/utilisateur';
import { UtilisateurService } from '../utilisateur/utilisateur.service';


@Component({
  selector: 'app-utilisateur-search',
  templateUrl: './utilisateur-search.component.html',
  styleUrls: ['./utilisateur-search.component.scss']
})
export class UtilisateurSearchComponent implements OnInit {

  // RouterHistory
  previousRoute: string;
  // Utilisateur
  @Output() isUserIsConnected$: boolean = false;
  currentUtilisateur$: CurrentUtilisateur;
  cUtilisateur = new Subscription();
  utilisateur: Utilisateur = new Utilisateur();
  // Client
  user: Utilisateur = new Utilisateur();
  userList: Utilisateur[];
  userIndex: number = 0;
  // Table
  // Datasource
  dataSource: Utilisateur[];
  // clolonnes
  // tabNomsColonnes: string[] = ['numeroCli'];
  tabNomsColonnes: string[] = ['nomUtil', 'prenomUtil', 'rolesUtil', 'idUtil'];

  constructor(private logger: NGXLogger,
    private _historyRouting: HistoryRoutingService,
    private _utilisateurService: UtilisateurService,
    private _cd: ChangeDetectorRef,
    private _route: Router,
    private _router: Router,
    private _toasterService: ToasterService) { }

  ngOnInit() {

    // Historique de navigation stocke la route precedent afin de faire un BackPage
    this.previousRoute = this._historyRouting.getPreviousUrl();

    this.getCurrentUtilisateur();
    this.getUtilisateurList();

  }

  /**
  * Recupere l utilisateur loggé
  */
  private async getCurrentUtilisateur() {

    this.logger.info("ClientSearchComponent log : Recuperation du currentuser ");
    this.cUtilisateur = await this._utilisateurService.getObjCurrentUtilisateur
      .subscribe((cUtilisateur: CurrentUtilisateur) => { this.currentUtilisateur$ = cUtilisateur },
        () => {
          this.logger.error("ClientSearchComponent log : La requete n a pas fonctionnée");
        });
  }

  /**
   * Récuperation de la liste des genres Humain
   */
  private getUtilisateurList() {

    this._utilisateurService.getUserList().subscribe(
      utilisateurL => {
        this.userList = utilisateurL;        
        this.userIndex = this.userList.length;  
        this.dataSource = this.userList;
        this._cd.markForCheck();
        
        }
    )

  };
  
  private test() {
    this.logger.info("ClientSearchComponent Log : Nombre de Client dans la Bdd : " + this.userIndex );
    for (var i = 0; i < this.userIndex; i++ ) {
      this.logger.info("UtilisateurSearchComponent Log : " + this.dataSource[i].idUtilisateur);
      this.logger.info("UtilisateurSearchComponent Log : " + this.dataSource[i].nomUtilisateur);
      this.logger.info("UtilisateurSearchComponent Log : " + this.dataSource[i].prenomUtilisateur);
      this.logger.info("UtilisateurSearchComponent Log : " + this.dataSource[i].rolesUtilisateur.rolesName);
    }
  }
}
