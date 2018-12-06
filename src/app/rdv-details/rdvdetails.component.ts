import { Component, OnInit, Output } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { RdvService } from '../rdv/rdv.service';
import { UtilisateurService } from '../utilisateur/utilisateur.service';
import { Rdv } from '../rdv/rdv';
import { AuthService } from '../login/auth.service';
import { HistoryRoutingService } from '../service/historyRouting.service';
import { CurrentUtilisateur } from '../login/currentUtilisateur';
import { Subscription, Observable } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { Client } from '../client/client';
import { Prestation } from '../prestation/prestation';
import { Genre } from '../genre/genre';
import { Praticien } from '../praticien/praticien';
import { LieuRdv } from '../lieuRdv/lieuRdv';
import { GenreService } from '../genre/genre.service';
import { ClientService } from '../client/client.service';
import { PrestationService } from '../prestation/prestation.service';
import { PraticienService } from '../praticien/praticien.service';
import { LieuRdvService } from '../lieuRdv/lieurdv.service';
import { DateService } from '../service/dateservice.service';
import { startWith, map } from 'rxjs/operators';
import { MatOptionSelectionChange } from '@angular/material';
import { ToasterService } from '../service/toaster.service';
import { Utilisateur } from '../utilisateur/utilisateur';

import * as moment from 'moment';

@Component({
  selector: 'app-rdvdetails',
  templateUrl: './rdvdetails.component.html',
  styleUrls: ['./rdvdetails.component.scss']
})
export class RdvDetailsComponent implements OnInit {

  // RouterHistory
  previousRoute: string;
  // Utilisateur
  @Output() isUserIsConnected$: boolean = false;
  currentUtilisateur$: CurrentUtilisateur;
  cUtilisateur = new Subscription();
  utilisateur: Utilisateur = new Utilisateur();
  // Utilisateur connecte
  emailUserConnected: string;
  // AUtocomplete Clients
  clientCtrl = new FormControl();
  filteredClients: Observable<Client[]>;
  // Activation des champs
  timeA_state: boolean = true;
  timeB_state: boolean = true;
  activite_state: boolean = true;
  forfait_state: boolean = true;
  clientele_state: boolean = true;
  soin_state: boolean = true;
  praticien_state: boolean = true;
  lieuRdv_state: boolean = true;
  save_button_state: boolean = true;
  // AUtocomplete Soin depuis Prestation
  soinCtrl = new FormControl();
  filteredSoins: Observable<Prestation[]>;
  // Rdv
  rdv = new Rdv();
  rdvAnnuleColor:string = "warn"
  // Genre
  selectedGenre: string = "FEMME";
  genre: Genre = new Genre();
  genreList: Genre[];
  //client
  client = new Client();
  clientList: Client[];
  selectedClientFromList: Client;
  // Prestation
  prestation = new Prestation();
  prestationList: Prestation[];
  selectedPrestationFromList: Prestation;
  prestationSliderColor: string = "primary";
  // isPrestationsIsAForfait: string;
  // Activite
  activiteList: string[];
  selectedActivite: string;
  filterActivite: string;
  // Praticien
  praticien = new Praticien();
  praticienList: Praticien[];
  selectedPraticienFromlist: Praticien;
  // LieuRdv
  lieurRdv = new LieuRdv();
  lieuRdvList: LieuRdv[];
  selectedLieuRdvFromList: LieuRdv;
  // Date
  datePicker_color = "primary"
  dateSel: Date;
  // TIme
  tpA_selected_value: string;
  tpB_selected_value: string;
  timePickerA_initial_value: string = "08:00"
  timePickerB_initial_value: string = "09:00";
  // Forfait  
  isItAForfait: boolean = false;
  isPrestaIsAForfait: string = "F";
  // Soin
  soinList: Prestation[];
  filterSoin: string;

  isRdvIsCancelled:boolean= false;


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
    private _historyRouting: HistoryRoutingService,
    private _toasterService: ToasterService) {

    this.getClientList();
    this.getPrestationList();

    this.emailUserConnected = this._authService.getMailFromToken();
    this._utilisateurService.setCurrentUtilisateur(this.emailUserConnected);

    this.refreshFilteredClients();

  }

  ngOnInit() {

    // verifier si le token est encore valide
    this._authService

    // Historique de navigation stocke la route precedent afin de faire un BackPage
    this.previousRoute = this._historyRouting.getPreviousUrl();
    // Recuperer les Listes depuis la Bdd
    this.getCurrentUtilisateur();
    this.getPraticienList();
    this.getLieurRdvList();

  }

  ngOnChanges() {

    this.refreshFilterdeSoins();

  }

  // =====================================================================================
  // Recuperation des donnees depuis la BDD
  // =====================================================================================
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
    // this.logger.info("RdvAddComponent log : Liste des Praticiens nb entrees : " + this.praticienList.length); 
  }

  /**
   * Recupere la liste de prestation
   */
  private getPrestationList() {

    // si client est un homme
    // choix si forfait
    this.logger.info("RdvAddComponent log : Recuperation de la liste des Prestations.");
    this._prestationService.getPrestationList().subscribe(
      ((prestaList: Prestation[]) => this.prestationList = prestaList
      )
    )
    // this.logger.info("RdvAddComponent log : Liste des Prestations nb entrees : " + this.prestationList.length);
  }

  /**
  * Recupere la liste de lieuRdv
  */
  private getLieurRdvList() {
    this.logger.info("RdvAddComponent log : Recuperation de la liste des LieuRdv.");
    this._lieuRdvService.getLieuRdvList().subscribe(
      ((lieuRdvList: LieuRdv[]) => {
        this.lieuRdvList = lieuRdvList;
      }
      )
    )
    // this.logger.info("RdvAddComponent log : Liste des LieuRdv nb entres : " + this.lieuRdvList.length); 
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
    // this.logger.info("RdvAddComponent log : Liste des Clients nb entrees : " + this.clientList.length);
  }

  // =====================================================================================
  // Methodes de filtrage des donnees
  // =====================================================================================

  /**
   * Filtre la liste en fonction de ce qui est saisi an l input (autocomplete)
   * @param value 
   */
  private _filteredClients(value: string): Client[] {

    const filterClientValue = value.toLowerCase();

    return this.clientList.filter(client => client.nomClient.toLowerCase().indexOf(filterClientValue) === 0);
  }

  /**
   * Filtre la liste en fonction de ce qui est saisi an l input (autocomplete)
   * @param value 
   */
  private _filteredSoins(value: string): Prestation[] {

    const filterSoinValue = value.toLowerCase();

    return this.soinList.filter(soin => soin.soin.toLowerCase().indexOf(filterSoinValue) === 0);
  }

  /**
   * Filtre les prestation pour recuperer les Activites
   * selon le genre du client
   * selon si la prestation est un forfait ou non
   */
  public activiteExtractWithFilters() {
    // purge le tableau
    this.activiteList = [];
    this.filterActivite = '';
    this.filterSoin = '';
    this.soinCtrl.setValue('');

    // recupere l IdGenre du Client
    let idGenre: number = this.selectedClientFromList.genreClient.idGenre.valueOf();

    this.logger.info("RdvAddComponent log : Filtres selectionnes : "
      + "\nidClient : " + this.selectedClientFromList.idClient.valueOf()
      + "\nnomClient : " + this.selectedClientFromList.nomClient.valueOf()
      + "\nidGenre : " + idGenre
      + "\ngenreHum : " + this.selectedClientFromList.genreClient.genreHum.valueOf()
      + "\nsisForfaitString : " + this.isPrestaIsAForfait
    );

    // ----------------------
    // Filtre Activite
    // Filtre 1 Si forfait est False/ true
    // Filtre selon l Id du Genre du client selectionne
    // ----------------------
    this.activiteList = this.prestationList
      // .map(toto => toto)
      .filter(activ => activ.forfait.valueOf().toUpperCase() == this.isPrestaIsAForfait)
      .filter(activ => activ.genre.idGenre.valueOf() == idGenre)
      .map(activ => activ.activite)
      // supprime les doublons
      .filter((el, i, a) => i === a.indexOf(el));

    this.logger.info("RdvAddComponent log : Taille de le table Activite : " + this.activiteList.length);
    this.logger.info("RdvAddComponent log : Liste des Activites disponnible en (f) des filtres : " + this.activiteList);

  }

  /**
  * Genere la liste de soins en fonction des 
  * options choisies => filtres
  */
  private soinListFiltree() {

    this.soinList = null;
    this.soinList = this.prestationList
      // filtre par Genre
      .filter(soin => soin.genre.genreHum.valueOf().toLocaleUpperCase() == this.selectedClientFromList.genreClient.genreHum.valueOf().toLocaleUpperCase())
      // filtre par forfait
      .filter(soin => soin.forfait.valueOf().toLocaleUpperCase() == this.isPrestaIsAForfait.toLocaleUpperCase())
      // filtre par Activite
      .filter(soin => soin.activite.valueOf() == this.selectedActivite)
      // Map les prestations aya reussi le test
      .map(soin => soin)
    // .filter((el, i, a) => i === a.indexOf(el));    

    this.logger.info("RdvAddComponent log : nombre d entree dans le tableau Soins : " + this.soinList.length);
  }

  // =====================================================================================
  // Rafraichissement des listes filtrees
  // =====================================================================================
  /**
   * Rafraichissement la liste filtree des soins
   */
  private refreshFilterdeSoins() {

    this.filteredSoins = this.soinCtrl.valueChanges
      .pipe(
        startWith(''),
        map(soin => soin ? this._filteredSoins(soin) : this.soinList.slice())

      );
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

  // =====================================================================================
  // Methodes appelees depuis la vue
  // =====================================================================================

  /**
   * Dates selectionnee
   * @param date
   */
  public dateSelectionnee() {
    // la date selectionne est envoye via ngmodel su la ref this.dateSel
    this.logger.info("RdvAddComponent log : Date sélectionnee Date: " + new Date(this.dateSel));

    this.toggleTimePickerAStatus();

  }

  /**
   * Heure de debut selectionnee
   * @param timePickerA
   */
  public timePickerASelectionne(timePickerA: string) {
    this.tpA_selected_value = this._dateService.modStringTime(timePickerA.valueOf(), 0, 0);
    // Attribution de l heure du selecteur_debut selectionnee au la variable  tpA_selected_value
    this.tpB_selected_value = timePickerA.valueOf();
    // Attribution du picker a au picker avec 1 heure de plus
    this.timePickerB_initial_value = this._dateService.modStringTime(timePickerA.valueOf(), 1, 0);

    this.toggleTimePickerBStatus();
    this.toggleClienteleStatus();
  }

  /**
   * Heure de fin selectionne
   * @param selectedTimePickerB 
   */
  public timePickerBSelectionne(timePickerB: string) {
    // Attribution de l heure du selecteur_debut selectionnee au la variable  tpA_selected_value
    this.tpB_selected_value = timePickerB.valueOf();
    // Attribution du pickerA au pickerB avec 1 heure de plus
    this.timePickerB_initial_value = this._dateService.modStringTime(timePickerB.valueOf(), 0, 0);

  }

  /**
   * Client selectionne
   * @param client
   */
  public clientSelectionne(event: MatOptionSelectionChange, client: Client) {

    if (event.source.selected) {

      this.logger.info("RdvAddComponent log : Client séléctionné idclient: " + client.idClient + " " + client.nomClient);
      this.selectedClientFromList = client;

      // filtre les activites en fonction du genre et du forfait
      // Activation des modules Forfait et activite
      this.toggleForfaitStatus();
      this.toggleActiviteStatus();

      this.activiteExtractWithFilters();

    }
  }


  permutForfait = function togleToFalseForfait(calb) {
    this.isPrestaIsAForfait = false
    calb();
  }

  /**
   * Selectionne si forfait Boolean
   */
  public toggleForfaitByUser() {

    this.isItAForfait = !this.isItAForfait;
    this.toggleForfaitString(this.isItAForfait);
    this.logger.info("RdvAddComponent log : Toggle Forfait value : " + this.isItAForfait);
    this.filterActivite = '';
    this.filterSoin = '';
    this.soinCtrl.setValue('');
    this.activiteExtractWithFilters();

  }

  /**
   * Bascule le boolean en String pour le filtre
   * @param forfaitValue 
   */
  private toggleForfaitString(forfaitValue: Boolean) {

    if (forfaitValue.valueOf() == true) {

      this.isPrestaIsAForfait = "T";

    } else {

      this.isPrestaIsAForfait = "F";
    }
    this.logger.info("RdvAddComponent log : Toggle ForfaitString value : " + this.isPrestaIsAForfait);

  }

  /**
  * Active / Desactive Soin
  */
  public activiteSelectionnee(event: MatOptionSelectionChange, activite: string) {

    // Methode necessaire pour recuperer la valeur saisie par l utilisteur
    // cela evie le double clic pour avoir la donne selectionne immediatement
    // "probleme"du au detectionChange
    if (event.source.selected) {
      this.logger.info("RdvAddComponent log : Activite Selectionnée : " + activite);
      this.selectedActivite = activite;

      // Cumul de procedures pour purger et regenerer la liste
      // de soins lors de la selection del activite
      // recupere l activite selectionne par l utilisateur     
      this.resetSoins();
      this.soinListFiltree();
      this.refreshFilterdeSoins();

    }

  }

  /**
   * trigger apres avoir selectionne l activite (soin)
   */
  public soinSelectionnne(event: MatOptionSelectionChange, prestation: Prestation) {

    if (event.source.selected) {
      this.logger.info("RdvAddComponent log : Soin selectionné id: " + prestation.idPrestation + "_" + prestation.soin);
      this.selectedPrestationFromList = null;
      this.selectedPrestationFromList = prestation;

      this.togglePraticienStatus();
    }

  }

  /**
  * Attirbue le praticien selectionne
  */
  public praticienSelectionne(praticien: Praticien) {

    this.logger.info("RdvAddComponent log : Praticien selectionne Id Priatien: " + praticien.idPraticien);
    this.selectedPraticienFromlist = praticien;
    this.logger.info("RdvAddComponent log : Praticien idPraticien " + this.selectedPraticienFromlist.idPraticien);

    this.toggleLieuRdvStatus();

  }

  /**
   * Attribue le lieuRdv selectionne
   * @param lieuRdv 
   */
  public lieuRdvSelectionne(lieuRdv: LieuRdv) {
    this.logger.info("RdvAddComponent log : Praticien selectionne Id LieuRdv : " + lieuRdv.idLieuRdv);
    this.selectedLieuRdvFromList = lieuRdv;
    this.logger.info("RdvAddComponent log : LieuRdv IsLieuRdv : " + this.selectedLieuRdvFromList.idLieuRdv);

    this.toggleSaveButtonStatus();
  }

  /**
   * Annule la selection du client
   */
  public cancelClientSelection() {
    this.selectedClientFromList = null;
  }

  // =====================================================================================
  // Change les etats pour activer / desactiver les champs aussi des 
  // Methodes appelees par la vue
  // =====================================================================================

  /**
   * Active / Desactive TimePickerA
   */
  private toggleTimePickerAStatus() {
    this.logger.info("RdvAddComponent log : Methode activee : changeTimeA_stateStatus");

    if (this.timeA_state == true)
      this.timeA_state = !this.timeA_state;

  }

  /**
   * Active / Desactive TimePickerB
   * @param selectedTimePickerB 
   */
  private toggleTimePickerBStatus() {
    this.logger.info("RdvAddComponent log : Methode activee : changeTimeB_stateStatus");

    if (this.timeB_state == true) {
      this.timeB_state = !this.timeB_state;
    }
  }

  /**
  * Active / Desactive  Activite
  */
  public toggleActiviteStatus() {
    this.logger.info("RdvAddComponent log : Methode activee : changeActivite_stateStatus");

    if (this.activite_state == true) {
      this.activite_state = !this.activite_state;
    }

  }

  /**
  * Active / Desactive Clientele
  */
  public toggleClienteleStatus() {

    this.logger.info("RdvAddComponent log : Methode activee : changeClientele_stateStatus");

    if (this.clientele_state == true) {
      this.clientele_state = !this.clientele_state;
    }

  }

  /**
  * Active / Desactive Forfait
  */
  private toggleForfaitStatus() {
    this.logger.info("RdvAddComponent log : Methode activee : changeForfait_stateStatus");

    if (this.forfait_state == true) {
      this.forfait_state = !this.forfait_state;
    }
  }

  /**
  * Active / Desactive Praticien
  */
  public togglePraticienStatus() {

    this.logger.info("RdvAddComponent log : Methode activee : changePraticien_stateStatus");

    if (this.praticien_state == true) {
      this.praticien_state = !this.praticien_state;
    }

  }

  public toggleLieuRdvStatus() {

    this.logger.info("RdvAddComponent log : Methode activee : changelieuRdv_state");

    if (this.lieuRdv_state == true) {
      this.lieuRdv_state = !this.lieuRdv_state;
    }
  }

  /**
  * Active / Desactive Boutton Sauvegarder
  */
  public toggleSaveButtonStatus() {

    this.logger.info("RdvAddComponent log : Methode activee : changelieuRdv_state");

    if (this.save_button_state == true) {
      this.save_button_state = !this.save_button_state;
    }

  }

  // =====================================================================================
  // Reinitialise les champs et les listes Activite / Soins
  // =====================================================================================

  /**
   * Reinitialise les Activites
   */
  private resetActivites() {
    this.filterActivite = '';
    this.activiteList = [];
    this.filterSoin = '';
    this.soinCtrl.setValue('');
    this.soinList = [];

  }

  /**
   * Reinitialise les soins
   */
  private resetSoins() {
    this.filterSoin = '';
    this.soinCtrl.setValue('');
    this.soinList = [];
  }

  // =====================================================================================
  // Persistance de du nouveau Rdv
  // =====================================================================================

  /**
   * Enregistrer un Rdv
   */
  public saveRdv() {



    this.logger.info("RdvAddComponent log : Tentative de sauvegarde du Rdv:)")

    this.rdv.dateDeSaisie = moment().millisecond();
    this.rdv.dateHeureDebut = moment(this.dateSel)
      .hours(this._dateService.extracHoursFromGivenTime(this.tpA_selected_value))
      .minutes(this._dateService.extracMinutesFromGivenTime(this.tpA_selected_value)).millisecond();
    this.rdv.dateHeureFin = moment(this.dateSel)
      .hours(this._dateService.extracHoursFromGivenTime(this.tpA_selected_value))
      .minutes(this._dateService.extracMinutesFromGivenTime(this.tpB_selected_value)).millisecond();
    this.client.idClient = this.selectedClientFromList.idClient.valueOf();
    this.logger.info("RdvAddComponent log : Rdv idPrestation " + this.selectedPrestationFromList.idPrestation);
    this.prestation.idPrestation = this.selectedPrestationFromList.idPrestation.valueOf();
    this.praticien.idPraticien = this.selectedPraticienFromlist.idPraticien.valueOf();
    this.lieurRdv.idLieuRdv = this.selectedLieuRdvFromList.idLieuRdv.valueOf();
    this.utilisateur.idUtilisateur = this.currentUtilisateur$.idUtilisateur.valueOf();

    this.rdv.client = this.client;
    this.rdv.prestation = this.prestation;
    this.rdv.praticien = this.praticien;
    this.rdv.lieuRdv = this.lieurRdv;
    this.rdv.utilisateur = this.utilisateur;


    this._rdvService.postRdv(this.rdv)
      .subscribe(
        res => {
          res;
          let messageRdvOk: string = "Votre Rendez-vous est enregistré :"
            + "\nRdv Id: " + res.idRdv
            + "\nRdv Date début: " + new Date(res.dateHeureDebut)
            + "\nRdv Date Fin: " + new Date(res.dateHeureFin)
            + "\nRdv Client: " + res.client.prenomClient + " " + res.client.nomClient
            + "\nRdv Soin: " + res.prestation.activite + " " + res.prestation.soin
            + "\nRdv Praticien" + res.praticien.prenomPraticien
            + "\nRdv lieRdv: " + res.lieuRdv.lieuRdv;

          this.toasterMessage(messageRdvOk, 'snackbarInfo', 35000);
          this.logger.info("rgpdService Log : Nouveau rendez-vous persistes");
        },
        err => {
          let messageRdvNOk: string = "Il y a eu un problème,"
            + "\nle rendez-vous saisi n'a pas été enregistré"
            + "\nVérifiez les dates et heures ..."
          this.toasterMessage(messageRdvNOk, 'snackbarWarning', 5000);
          this.logger.error("rgpdService Log : Le rendez-vous n'a pas été enregistré");
        })

  }

  public changeStatusOfRdvCancelled($event) {
    
  }



  private toasterMessage(snackMessage: string, snackStyle: string, snackTimer: number): void {
    this._toasterService.showToaster(snackMessage, snackStyle, snackTimer)
  }




}
