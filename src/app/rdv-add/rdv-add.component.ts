import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { Praticien } from '../praticien/praticien';
import { CurrentUtilisateur } from '../login/currentUtilisateur';
import { Subscription, Subscriber } from 'rxjs';
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
moment.locale('fr');

@Component({
  selector: 'app-rdvadd',
  templateUrl: './rdv-add.component.html',
  styleUrls: ['./rdv-add.component.scss'],

})
export class RdvAddComponent implements OnInit {

  // Dates
  // dateJj = new Date();
  dateSelectionneeA = moment(new Date());
  dateSelectionneeB;
  showSimpleDateOrRangeDate: boolean = true;

  activeTabIndex: number = 0;
  // @Input() id: string
  selectedSimpleDateTab: boolean;
  selectedRangeOfDateTab: boolean;

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

  // Praticien;
  praticienSelected: Praticien;
  praticienList: Praticien[];
  praticien: Praticien;

  // Parametres pour Rdv
  listRdv: any;
  rdvList: Rdv[] = null;
  nbRdv: number = 0;
  indexRdv: number = 1;

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
    private _cd: ChangeDetectorRef) {

    this.emailUserConnected = this._authService.getMailFromToken();
    this._utilisateurService.setCurrentUtilisateur(this.emailUserConnected);

  }


  ngOnInit() {

    this.getCurrentUtilisateur();
    this.getPraticienList();

  }


  public toggleTab() {

    this.logger.info("RdvAddComponent log : toggling tab ");
    this.selectedSimpleDateTab = !this.selectedRangeOfDateTab;
    this.logger.info("RdvAddComponent log : toggling tab " + this.selectedSimpleDateTab);

    this._cd.detectChanges();
  }


  /**
   * Recupere l utilisateur loggé
   */
  private async getCurrentUtilisateur() {

    this.logger.info("RdvAddComponent log : Recuperation du currentuser ");
    this.cUtilisateur = await this._utilisateurService.getObjCurrentUtilisateur
      .subscribe((cUtilisateur: CurrentUtilisateur) => { this.currentUtilisateur$ = cUtilisateur },
        () => {
          this.logger.error("RdvAddComponent log : La requete n a pas fonctionnée");
        });
  }



  /**
   * recupere la liste des RDv par dDte et par Praticien
   */
  public getRdvListParDateParIdPraticien(dateSelectionneeA, idPraticien: number) {

    this.rdvList = null;
    this.indexRdv = null;
    this.nbRdv = 0;
    this.listRdv = this._rdvService.getRdvListByByDateAndByPraticien(
      this._dateService.setSerialDateToStringYYYYMMDD(dateSelectionneeA), idPraticien)
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
  }

  /**
   * Recupere la liste de Rdv par plage de dates serialisee et par praticien
   * @param dateA 
   * @param dateB 
   * @param idPraticien 
   */
  public getRdvListParPlageDeDateParIdPraticien(dateA, dateB, idPraticien: number) {

    this.rdvList = null;
    this.indexRdv = null;
    this.nbRdv = 0;
    this.listRdv = this._rdvService.getRdvListRangeOfDateADateBAndByPraticien(
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
  }

  /**
   * Récupere la liste de praticien
   */
  private getPraticienList() {

    this.logger.info("RdvAddComponent log : Recuperation de la liste des praticiens.");
    this._praticienService.getPraticienListe().subscribe(
      ((pratList: Praticien[]) => {
        this.praticienList = pratList
      }
      )
    )

  }

  /**
   * Ouvre le detail du Rdv selectionné
   * @param $rdvList 
   * @param idRdv 
   */
  public openRdvDetails(idRdv: number): void {

    this.logger.info("RdvAddComponent Log : ouverture du detail idRdv: " + idRdv);
    this.router.navigate(['./rdvdetails', idRdv]);
  }

}
