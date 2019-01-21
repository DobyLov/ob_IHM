import { Component, OnInit, ChangeDetectorRef, Input, OnDestroy } from '@angular/core';
import { Praticien } from '../praticien/praticien';
import { CurrentUtilisateur } from '../login/currentUtilisateur';
import { Subscription, Observable } from 'rxjs';
import { Rdv } from '../rdv/rdv';
import { NGXLogger } from 'ngx-logger';
import { AuthService } from '../login/auth.service';
import { UtilisateurService } from '../utilisateur/utilisateur.service';
import { Router } from '@angular/router';
import { PraticienService } from '../praticien/praticien.service';
import { DateService } from '../service/dateservice.service';
import { ErrorHandlerService } from '../service/errorHandler.service';
import { RdvService } from '../rdv/rdv.service';
import * as moment from 'moment';
import { HistoryRoutingService } from '../service/historyRouting.service';
import { Client } from '../client/client';
import { ClientService } from '../client/client.service';
import { FormControl } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { MatOptionSelectionChange } from '@angular/material';
moment.locale('fr');

@Component({
  selector: 'app-rdv-search',
  templateUrl: './rdv-search.component.html',
  styleUrls: ['./rdv-search.component.scss']
})
export class RdvSearchComponent implements OnInit, OnDestroy {

  // SearchGroup
  praticienCtrl = new FormControl();

  // Dates
  // dateJj = new Date();
  dateSelectionneeA = moment(new Date());
  dateSelectionneeB;
  showSimpleDateOrRangeDate: boolean = true;

  activeTabIndex: number = 0;
  // @Input() id: string
  SimpleDateTab: boolean;
  RangeOfDateTab: boolean;

  // Utilisateur
  @Input() isUserIsConnected$: boolean = false;
  currentUtilisateur$: CurrentUtilisateur;
  cUtilisateur = new Subscription();

  // timer de rafraichissement
  refreshTimer: any;
  timerSubscription: any;
  // 5 minutes => 5*60*10000
  timeToWaitToStartTimer: number = (5 * 60 * 1000);
  tickTimerFrequency: number = (5 * 60 * 1000);

  // Paramètres pour recuperer le sinfos utilisateu praticien
  emailUserConnected: string;

  // AUtocomplete Clients
  clientCtrl = new FormControl();
  filteredClients: Observable<Client[]>;

  // Praticien;
  cleanPraticienValuefield:string='';
  praticienSelected: boolean = false;
  praticien: Praticien;
  praticienList: Praticien[];
  // Client
  // clientFieldActivated: boolean = false;
  clientSelected: boolean = false;
  client: Client;
  clientList: Client[];
  // Parametres pour Rdv
  listRdvSubscription: Subscription;
  rdvList: Rdv[] = null;
  nbRdv: number = 0;
  indexRdv: number = 0;

  // Table
  // Datasource
  dataSource: Rdv[];
  // clolonnes
  tabNomsColonnes: string[] = ['numeroRdv', 'dateHeureDebut', 'separation', 'dateHeureFin',
    'lieuRdv', 'activite', 'prestation', 'nomClient', 'prenomClient', 'nomPraticien', 'idRdv'];


  constructor(private logger: NGXLogger,
              private router: Router,
              private _praticienService: PraticienService,
              private _dateService: DateService,
              private _authService: AuthService,
              private _rdvService: RdvService,
              private _utilisateurService: UtilisateurService,
              private _errorHandlerService: ErrorHandlerService,
              private _cd: ChangeDetectorRef,
              private _clientService: ClientService,
              private _historyRouting: HistoryRoutingService) {

    this.emailUserConnected = this._authService.getMailFromToken();
    this._utilisateurService.setCurrentUtilisateur(this.emailUserConnected);

  }


  ngOnInit() {

    this.getCurrentUtilisateur();
    this.getPraticienList();
    this.getClientList();
    this.refreshFilteredClients();

  }

  ngOnDestroy() {

    if ( this.listRdvSubscription ) { this.listRdvSubscription.unsubscribe };
  }


  public toggleTab() {

    this.logger.info("RdvSearchComponent log : toggling tab ");
    this.SimpleDateTab = !this.RangeOfDateTab;
    this.logger.info("RdvSearchComponent log : toggling tab " + this.SimpleDateTab);

    this._cd.detectChanges();
  }

    /**
   * Filtre la liste en fonction de ce qui est saisi an l input (autocomplete)
   * @param value 
   */
  private _filteredClients(value: string): Client[] {

    const filterClientValue = value.toLowerCase();

    return this.clientList.filter(client => client.nomClient.toLowerCase().indexOf(filterClientValue) === 0);
  }

    /**
   * Rafraichissement de la liste des Clients
   */
  private refreshFilteredClients() {

    setTimeout(() => {
      this.filteredClients = this.clientCtrl.valueChanges
        .pipe(
          startWith(''),
          map(client => client ? this._filteredClients(client) : this.clientList.slice())
        );
    }, 2000);

  }


  /**
   * Recupere l utilisateur loggé
   */
  private async getCurrentUtilisateur() {

    this.logger.info("RdvSearchComponent log : Recuperation du currentuser ");
    this.cUtilisateur = await this._utilisateurService.getObjCurrentUtilisateur
      .subscribe((cUtilisateur: CurrentUtilisateur) => { this.currentUtilisateur$ = cUtilisateur },
        () => {
          this.logger.error("RdvSearchComponent log : La requete n a pas fonctionnée");
        });
  }

  /**
   * Recherche Rdv par simple Date et selon si le critere est par Praticien ou par client
   * @param dateSelectionneeA 
   */
  public async getRdvListParDate(dateSelectionneeA) {

    this.logger.info("RdvSearchComponent log : Recherche par date :");
    this.logger.info("RdvSearchComponent log : Affiche la valeur de this.praticienSelected : " + this.praticienSelected);
    this.logger.info("RdvSearchComponent log : Affiche la valeur de this.clientSelected : " + this.clientSelected);

    // recherche par Praticien
    if ( this.praticienSelected == true ) {
      this.logger.info("RdvSearchComponent log : Recherche par date / Praticien :");
      await this.getRdvListParDateParIdPraticien(dateSelectionneeA, this.praticien.idPraticien );
    }

    // Recherche par client
    if (this.clientSelected == true) {
      this.logger.info("RdvSearchComponent log : Recherche par date / Client :");
      await this.getRdvListParDateParIdClient(dateSelectionneeA, this.client.idClient );
    }

  }

  /**
   * Recherche Rdv par plage de Dates et selon si le critere est par Praticien ou par client
   * @param dateSelectionneeA 
   */
  public async getRdvListParPlageDeDates(dateSelectionneeA, dateSelectionneeB) {
    this.logger.info("RdvSearchComponent log : Recherche par plage de dates :");
    
    // recherche par Praticien
    if (this.praticienSelected == true) {
      this.logger.info("RdvSearchComponent log : Recherche par plage de dates / Praticien :");
      await this.getRdvListParPlageDeDateParIdPraticien(dateSelectionneeA, dateSelectionneeB, this.praticien.idPraticien );
    }

    // Recherche par client
    if (this.clientSelected == true) {
      this.logger.info("RdvSearchComponent log : Recherche par plage de dates / Client :");
      await this.getRdvListParPlageDeDateParIdClient(dateSelectionneeA, dateSelectionneeB, this.client.idClient );
    }

  }


  /**
   * recupere la liste des RDv par dDte et par Praticien selectionne
   */
  public getRdvListParDateParIdPraticien(dateSelectionneeA, idPraticien: number) {

    // this.logger.info("RdvSearchComponent log : Recup list praticien : " + this.praticienList);
    this.logger.info("RdvSearchComponent log : iDPraticien selectionne : " + idPraticien );
    // ----------------
    this.rdvList = null;
    this.indexRdv = null;
    this.nbRdv = 0;
    // ----------------
    this.listRdvSubscription = this._rdvService.getRdvListByByDateAndByPraticien(
      this._dateService.setSerialDateToStringYYYYMMDD(dateSelectionneeA), idPraticien)
      .subscribe(res => {
        this.rdvList = res;
        this.dataSource = this.rdvList;
        this.nbRdv = this.rdvList.length;
        this.indexRdv = this.rdvList.length;

        this._cd.detectChanges();
      },
        ((e) => {
          // => vers le Gestionnaire d'érreur
          this._errorHandlerService.handleError(e);
        }
        )
      );
      
  }

    /**
   * recupere la liste des RDv par date et par Client selectionne
   */
  public getRdvListParDateParIdClient(dateSelectionneeA, idClient: number) {

    // this.logger.info("RdvSearchComponent log : Recup list Client : " + this.clientList);
    this.logger.info("RdvSearchComponent log : idClient selectionne : " + idClient );
    this.rdvList = null;
    this.indexRdv = null;
    this.nbRdv = 0;
    this.listRdvSubscription = this._rdvService.getRdvListByByDateAndByClient(
      this._dateService.setSerialDateToStringYYYYMMDD(dateSelectionneeA), idClient)
      .subscribe(res => {
      this.rdvList = res;
        this.dataSource = this.rdvList;
        this.nbRdv = this.rdvList.length;
        this.indexRdv = this.rdvList.length;
        this._cd.markForCheck();
      },
        ((e) => {
          // => vers le Gestionnaire d'érreur
          this._errorHandlerService.handleError(e);
        }
        )
      );
      this.logger.info("RdvSearchComponent log : Rdv Par date par idClient Liste : " + this.rdvList);


  }

  /**
   * Recupere la liste de Rdv par plage de dates serialisee et par praticien
   * @param dateA 
   * @param dateB 
   * @param idPraticien 
   */
  public getRdvListParPlageDeDateParIdPraticien(dateA, dateB, idPraticien: number) {
    // this.logger.info("RdvSearchComponent log : Recup list praticien : " + this.praticienList);
    this.logger.info("RdvSearchComponent log : iDPraticien selectionne : " + idPraticien );

    this.rdvList = null;
    this.indexRdv = null;
    this.nbRdv = 0;
    this.listRdvSubscription = this._rdvService.getRdvListRangeOfDateADateBAndByPraticien(
      this._dateService.setSerialDateToStringYYYYMMDD(dateA),
      this._dateService.setSerialDateToStringYYYYMMDD(dateB), idPraticien)
      .subscribe(res => {
      this.rdvList = res;
        this.dataSource = this.rdvList;
        this.nbRdv = this.rdvList.length;
        this.indexRdv = this.rdvList.length;
        this._cd.markForCheck();
      },
        ((e) => {
          // => vers le Gestionnaire d'érreur
          this._errorHandlerService.handleError(e);
        }
        )
      );

      this.logger.info("RdvSearchComponent log : Rdv Par date par idPrat Liste : " + this.rdvList);
  }

  /**
   * Recupere la liste de Rdv par plage de dates serialisee et par Client
   * @param dateA 
   * @param dateB 
   * @param idPraticien 
   */
  public getRdvListParPlageDeDateParIdClient(dateA, dateB, idClient: number) {
    // this.logger.info("RdvSearchComponent log : Recup list Client : " + this.clientList);
    this.logger.info("RdvSearchComponent log : idPClient selectionne : " + idClient );

    this.rdvList = null;
    this.indexRdv = null;
    this.nbRdv = 0;
    this.listRdvSubscription = this._rdvService.getRdvListRangeOfDateADateBAndByClient(
      this._dateService.setSerialDateToStringYYYYMMDD(dateA),
      this._dateService.setSerialDateToStringYYYYMMDD(dateB), idClient)
      .subscribe(res => {
      this.rdvList = res;
        this.dataSource = this.rdvList;
        this.nbRdv = this.rdvList.length;
        this.indexRdv = this.rdvList.length;
        this._cd.markForCheck();
      },
        ((e) => {
          // => vers le Gestionnaire d'érreur
          this._errorHandlerService.handleError(e);
        }
        )
      );

      this.logger.info("RdvSearchComponent log : Rdv Par date par idPrat Liste : " + this.rdvList);
  }

  

  /**
   * Récupere la liste de praticien
   */
  private getPraticienList() {

    this.logger.info("RdvSearchComponent log : Recuperation de la liste des praticiens.");
    this._praticienService.getPraticienList().subscribe(
      ((pratList: Praticien[]) => {
        this.praticienList = pratList
      }
      )
    )    
  }

    /**
   * Recupere la liste de Clients
   */
  private getClientList(): void {

    this.logger.info("RdvSearchComponent log : Recuperation de la liste des clients.");
    this._clientService.getClientList().subscribe(
      ((cliList: Client[]) => {
        this.clientList = cliList;
      }
      )
    )
  }


  public praticienSelectionne(event: MatOptionSelectionChange, praticien){

    if (event.source.selected) {
      this.praticien = praticien;
      this.logger.info("rdvSearchComponent log : Praticien selectionne id : " + this.praticien.idPraticien);
    }

      if (this.praticienSelected == false) {
        this.praticienSelected = !this.praticienSelected;
        this.logger.info("rdvSearchComponent log : Etat de PraticienSelected : " + this.praticienSelected);
  
        this.clientSelected = false;
        this.clientCtrl.reset();
      }
  
      this.logger.info("RdvSearchComponent log : Client forcé sur : " + this.clientSelected.valueOf());
    
  }

  public clientSelectionne(event: MatOptionSelectionChange, client) {

    if (event.source.selected) {
      this.client = client;
      this.logger.info("rdvSearchComponent log : Client selectionne id :" + this.client.idClient);
    }

      if (this.clientSelected == false) {
        this.clientSelected = !this.clientSelected;
        this.logger.info("rdvSearchComponent log : etat de ClientSelected : " + this.clientSelected.valueOf());
        this.praticienSelected = false;

      }
      this.logger.info("RdvSearchComponent log : Praticien forcé sur : " + this.praticienSelected.valueOf());
    
  }

  public togglePratCliTab() {
    this.logger.info("RdvSearchComponent log : toggle du PratCliTab");

      this.clientSelected = false
      this.praticienSelected = false;
      this.clientCtrl.reset();
      this.cleanPraticienValuefield = '';
  }

  // public clientFieldIsSelcted() {
  //   this.logger.info("rdvSearchComponent log : Praticien doit etre deselectionne ");
  // }




  /**
   * Ouvre le detail du Rdv selectionné
   * @param $rdvList 
   * @param idRdv 
   */
  public openRdvDetails(idRdv: number): void {

    this.logger.info("RdvSearchComponent Log : ouverture du detail idRdv: " + idRdv);
    this.router.navigate(['./rdvdetails', idRdv]);
  }

}

