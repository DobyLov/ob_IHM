import { Component, OnInit, Output, ChangeDetectorRef } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { HistoryRoutingService } from '../service/historyRouting.service';
import { Router } from '@angular/router';
import { ToasterService } from '../service/toaster.service';
import { Client } from '../client/client';
import { ClientService } from '../client/client.service';
import { CurrentUtilisateur } from '../login/currentUtilisateur';
import { Subscription } from 'rxjs';
import { Utilisateur } from '../utilisateur/utilisateur';
import { UtilisateurService } from '../utilisateur/utilisateur.service';

@Component({
  selector: 'app-client-search',
  templateUrl: './client-search.component.html',
  styleUrls: ['./client-search.component.scss']
})
export class ClientSearchComponent implements OnInit {

  // RouterHistory
  previousRoute: string;
  // Utilisateur
  @Output() isUserIsConnected$: boolean = false;
  currentUtilisateur$: CurrentUtilisateur;
  cUtilisateur = new Subscription();
  utilisateur: Utilisateur = new Utilisateur();
  // Client
  client: Client = new Client();
  clientList: Client[];
  clientIndex: number = 0;
  // Table
  // Datasource
  dataSource: Client[];
  // clolonnes
  // tabNomsColonnes: string[] = ['numeroCli'];
  tabNomsColonnes: string[] = ['nomCli', 'prenomCli', 'adresseMailCli', 'idCli'];

  constructor(private logger: NGXLogger,
    private _historyRouting: HistoryRoutingService,
    private _clientService: ClientService,
    private _utilisateurService: UtilisateurService,
    private _cd: ChangeDetectorRef,
    private _route: Router,
    private _router: Router,
    private _toasterService: ToasterService) { }

  ngOnInit() {

    // Historique de navigation stocke la route precedent afin de faire un BackPage
    this.previousRoute = this._historyRouting.getPreviousUrl();

    this.getCurrentUtilisateur();
    this.getClientList();

    // setTimeout(() => {
    //   this.test()
    // }, 5000);
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
  private getClientList() {

    this._clientService.getClientList().subscribe(
      clientL => {
        this.clientList = clientL;        
        this.clientIndex = this.clientList.length;  
        this.dataSource = this.clientList;
        this._cd.detectChanges();
        
        }
    )

    
  };
  
  private test() {
    this.logger.info("ClientSearchComponent Log : Nombre de Client dans la Bdd : " + this.clientIndex );
    for (var i = 0; i < this.clientIndex; i++ ) {
      this.logger.info("ClientSearchComponent Log : " + this.dataSource[i].idClient);
      this.logger.info("ClientSearchComponent Log : " + this.dataSource[i].nomClient);
      this.logger.info("ClientSearchComponent Log : " + this.dataSource[i].prenomClient);
      this.logger.info("ClientSearchComponent Log : " + this.dataSource[i].adresse.ville);
    }
  }
}
