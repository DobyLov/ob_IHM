import { Component, OnInit, ChangeDetectorRef, Input, EventEmitter, Output } from '@angular/core';
import { Praticien } from '../praticien/praticien';
import { CurrentUtilisateur } from '../login/currentUtilisateur';
import { Subscription, Observable } from 'rxjs';
import { Rdv } from '../rdv/rdv';
import { NGXLogger } from 'ngx-logger';
import { AuthService } from '../login/auth.service';
import { UtilisateurService } from '../utilisateur/utilisateur.service';
import { PraticienService } from '../praticien/praticien.service';
import { DateService } from '../service/dateservice.service';
import { ErrorHandlerService } from '../service/errorHandler.service';
import { RdvService } from '../rdv/rdv.service';
import * as moment from 'moment';
import { HistoryRoutingService } from '../service/historyRouting.service';
import { Genre } from '../genre/genre';
import { GenreService } from '../genre/genre.service';
import { Client } from '../client/client';
import { Prestation } from '../prestation/prestation';
import { LieuRdv } from '../lieuRdv/lieuRdv';
import { ClientService } from '../client/client.service';
import { PrestationService } from '../prestation/prestation.service';
import { LieuRdvService } from '../lieuRdv/lieurdv.service';
import { FormControl } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
// import { ArgumentType } from '@angular/compiler/src/core';
// import { ActivatedRoute, Router } from '@angular/router';

moment.locale('fr');

@Component({
  selector: 'app-rdvadd',
  templateUrl: './rdv-add.component.html',
  styleUrls: ['./rdv-add.component.scss'],

})
export class RdvAddComponent implements OnInit {

  // RouterHistory
  previousRoute: string;
  // Utilisateur
  @Output() isUserIsConnected$: boolean = false;
  currentUtilisateur$: CurrentUtilisateur;
  cUtilisateur = new Subscription();
  // Utilisateur connecte
  emailUserConnected: string;

  // AUtocomplete Clients
  clientCtrl = new FormControl();
  filteredClients: Observable<Client[]>;
  // AUtocomplete Prestations
  prestationCtrl = new FormControl();
  filteredPrestations: Observable<Prestation[]>;

  // Activation des champs
  timeA_state: boolean = true;
  timeB_state: boolean = true;
  activite_state: boolean = false;
  forfait_state: boolean = true;
  isItAForfait: boolean = true;
  clientele_state: boolean = false;
  prestation_state: boolean = false;
  praticien_state: boolean = true;
  lieuRdv_state: boolean = true;
  save_button_state: boolean = true;

  // Generic
  oki;

  // Rdv
  rdv: Rdv;
  // Genre
  valueGenre;
  genre: Genre;
  genreList: Genre[];
  //client
  client: Client;
  clientList: Client[];
  selectedClientFromList: Client;
  // Prestation
  prestation: Prestation;
  prestationList: Prestation[];
  selectedPrestationFromList: Prestation;
  prestationSliderColor: string = "primary";
  isPrestationsIsAForfait: boolean = false;
  // Activite
  activiteList = [];
  // Praticien
  praticien: Praticien;
  praticienList: Praticien[];
  // LieuRdv
  lieurRdv: LieuRdv;
  lieuRdvList: LieuRdv[];
  // Date
  dateSelectionnee;
  // TIme
  @Input('timeSet') tpA = new EventEmitter<string>();
  timePickerB;


  constructor(private logger: NGXLogger,
    private _rdvService: RdvService,
    private _genreService: GenreService,
    private _clientService: ClientService,
    private _prestationService: PrestationService,
    private _praticienService: PraticienService,
    private _lieuRdvService: LieuRdvService,
    private _dateService: DateService,
    private _authService: AuthService,
    private _utilisateurService: UtilisateurService,
    private _errorHandlerService: ErrorHandlerService,
    private _cd: ChangeDetectorRef,
    private _historyRouting: HistoryRoutingService) {

    this.getClientList();
    this.emailUserConnected = this._authService.getMailFromToken();
    this._utilisateurService.setCurrentUtilisateur(this.emailUserConnected);

    setTimeout(() => {

      this.filteredClients = this.clientCtrl.valueChanges
        .pipe(
          startWith(''),
          map(client => client ? this._filterClients(client) : this.clientList.slice())
        );

    }, 2000);
    setTimeout(() => {
      this.filteredPrestations = this.prestationCtrl.valueChanges
        .pipe(
          startWith(''),
          map(prestation => prestation ? this._filterPrestations(prestation) : this.prestationList.slice())
        );

    }, 3000);



  }


  private _filterClients(value: string): Client[] {

    const filterClientValue = value.toLowerCase();

    return this.clientList.filter(client => client.nomClient.toLowerCase().indexOf(filterClientValue) === 0);
  }

  private _filterPrestations(value: string): Prestation[] {

    const filterPrestationValue = value.toLowerCase();

    return this.prestationList.filter(prestation => prestation.soin.toLowerCase().indexOf(filterPrestationValue) === 0);
  }

  ngOnInit() {

    this.getPrestationList()
    this.getCurrentUtilisateur();
    this.getPraticienList();
    this.getLieurRdv();

    this.previousRoute = this._historyRouting.getPreviousUrl();

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
 * Récupere la liste de praticien
 */
  private getPraticienList() {

    this.logger.info("RdvAddComponent log : Recuperation de la liste des praticiens.");
    this._praticienService.getPraticienListe().subscribe(
      ((pratList: Praticien[]) => {
        this.praticienList = pratList;
      }
      )
    )

  }

  private getLieurRdv() {
    this.logger.info("RdvAddComponent log : Recuperation de la liste des LieuRdv.");
    this._lieuRdvService.getLieuRdvList().subscribe(
      ((lieuRdvList: LieuRdv[]) => {
        this.lieuRdvList = lieuRdvList;
      }
      )
    )
  }

  /**
   * Recupere la liste de Clients
   */
  private getClientList() {

    this.logger.info("RdvAddComponent log : Recuperation de la liste des clients.");
    this._clientService.getClientList().subscribe(
      ((cliList: Client[]) => {
        this.clientList = cliList;
      }
      )
    )
  }

  /**
   * Recupere la liste de prestation
   */
  private getPrestationList() {

    // si client est un homme
    // choix si forfait
    this.logger.info("RdvAddComponent log : Recuperation de la liste des Prestations.");
    this._prestationService.getPrestationList().subscribe(
      ((prestaList: Prestation[]) => {
        const prestafilterd = prestaList.filter(res => res.forfait == 'F' || res.forfait == 'f')
        this.prestationList = prestafilterd;
      }
      )
    )
  }

  /**
   * 
   */
  public activiteExtractWithFilters() {

    let isPrestaIsAForfait: string;
    if (this.isItAForfait == true) {
      this.logger.info("RdvAddComponent log : Btn_Forfait_state : " + this.forfait_state + " = T");
      isPrestaIsAForfait = 'T';

    } else {
      this.logger.info("RdvAddComponent log : Btn_Forfait_state : " + this.forfait_state + " = F");
      isPrestaIsAForfait = 'F';

    }

    let idGenre: number = this.selectedClientFromList.genreClient.idGenre.valueOf();

    this.activiteList = this.prestationList
      .map(activite => activite)
      .filter(function (activ) {
        return activ.activite
          && activ.genre.idGenre.valueOf() == idGenre
        && activ.forfait == isPrestaIsAForfait
      })
      .map(act => act.activite && act.soin && act.genre.genreHum && act.forfait)
    // .filter(activite => activite.activite)
    // .map(activite => activite.activite)

    // .filter((el, i, a) => i === a.indexOf(el));

    console.log("activiteExtractor : " + this.activiteList);

    for (let z = 0; z < this.activiteList.length; z++) {

      console.log("activiteExtractor : " + this.activiteList[z]);

    }

  }

  public clientSelection(client: Client) {
    this.selectedClientFromList = null;
    this.selectedClientFromList = client;
    this.logger.info("RdvAddComponent log : Clientselction")
    // this.activForfait()
    this.forfait_state = false;

    this._cd.markForCheck;

    // this.changeForfait_stateStatus();

    this.changeActivite_stateStatus();

  }

  public prestationSelection(prestation: Prestation) {

    this.selectedPrestationFromList = null;
    this.selectedPrestationFromList = prestation;
    this._cd.markForCheck;
    this.changePraticien_stateStatus()

  }

  public cancelClientSelection() {
    this.selectedClientFromList = null;
  }

  // -------------------- Chanager les booleans

  /**
   * Changer la valeur du boolean
   */
  public changeTimeA_stateStatus() {
    console.log("Methode activee : changeTimeA_stateStatus");
    if (this.timeA_state == true)
      this.timeA_state = !this.timeA_state;

  }

  public changeTimeB_stateStatus() {
    console.log("Methode activee : changeTimeB_stateStatus");
    if (this.timeB_state == true)
      this.timeB_state = !this.timeB_state;

  }

  /**
 * Changer la valeur du boolean
 */
  public changeActivite_stateStatus() {
    console.log("Methode activee : changeActivite_stateStatus");

    if (this.activite_state == true) {
      this.activite_state = !this.activite_state;
    }

    this.activiteExtractWithFilters();

  }

  /**
* Changer la valeur du boolean
*/
  public changeForfait_stateStatus() {
    console.log("Methode activee : changeForfait_stateStatus");

    this.isItAForfait = !this.isItAForfait;

    this.activiteExtractWithFilters();


  }

  //     /**
  // * Changer la valeur du boolean
  // */
  // public activForfait() {
  //   console.log("Methode activee : activeForfait_stateStatus");

  //   this.forfait_state == false;

  //   this._cd.markForCheck();
  //   this.activiteExtractWithFilters();

  // }

  /**
* Changer la valeur du boolean
*/
  public changeClientele_stateStatus() {
    console.log("Methode activee : changeClientele_stateStatus");
    if (this.clientele_state == true)
      this.clientele_state = !this.clientele_state;

  }

  /**
* Changer la valeur du boolean
*/
  public changePrestation_stateStatus() {
    console.log("Methode activee : changePrestation_stateStatus");
    if (this.prestation_state == true)
      this.prestation_state = !this.prestation_state;

  }

  /**
* Changer la valeur du boolean
*/
  public changePraticien_stateStatus() {
    console.log("Methode activee : changePraticien_stateStatus");
    if (this.praticien_state == true)
      this.praticien_state = !this.praticien_state;

  }

  /**
* Changer la valeur du boolean
*/
  public changeLieuRdv_stateStatus() {
    console.log("Methode activee : changelieuRdv_state");
    if (this.lieuRdv_state == true)
      this.lieuRdv_state = !this.lieuRdv_state;

  }

  /**
* Changer la valeur du boolean
*/
  public changeSaveButton_stateStatus() {
    console.log("Methode activee : changelieuRdv_state");
    if (this.save_button_state == true)
      this.save_button_state = !this.save_button_state;

  }

  /**
   * Enregistrer un Rdv
   */
  public saveRdv() {
    console.log("Rdv saved :)")
  }



}

