import { Component, OnInit, Output, ChangeDetectorRef, Inject } from '@angular/core';
import { MatOptionSelectionChange, MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA, MatDatepickerInputEvent } from '@angular/material';
import { NGXLogger } from 'ngx-logger';
import { RdvService } from '../rdv/rdv.service';
import { UtilisateurService } from '../utilisateur/utilisateur.service';
import { Rdv } from '../rdv/rdv';
import { AuthService } from '../login/auth.service';
import { HistoryRoutingService } from '../service/historyRouting.service';
import { CurrentUtilisateur } from '../login/currentUtilisateur';
import { FormControl, FormGroup } from '@angular/forms';
import { Client } from '../client/client';
import { Prestation } from '../prestation/prestation';
import { Genre } from '../genre/genre';
import { Praticien } from '../praticien/praticien';
import { LieuRdv } from '../lieuRdv/lieuRdv';
import { ClientService } from '../client/client.service';
import { PrestationService } from '../prestation/prestation.service';
import { PraticienService } from '../praticien/praticien.service';
import { LieuRdvService } from '../lieuRdv/lieurdv.service';
import { DateService } from '../service/dateservice.service';
import { startWith, map } from 'rxjs/operators';
import { ToasterService } from '../service/toaster.service';
import { Utilisateur } from '../utilisateur/utilisateur';
import { ActivatedRoute, Router } from '@angular/router';
import { ActiviteService } from '../activite/activite.service';
import { Activite } from '../activite/activite';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subscription, Observable } from 'rxjs';

// import * as moment from 'moment';
import * as moment from 'moment-timezone'

@Component({
  selector: 'app-rdvdetails',
  templateUrl: './rdv-details.component.html',
  styleUrls: ['./rdv-details.component.scss']
})
export class RdvDetailsComponent implements OnInit {

  // @ViewChild(mat-Select)selectComponent:MatSelect;

  // RouterHistory
  previousRoute: string;
  // Utilisateur
  @Output() isUserIsConnected$: boolean = false;
  currentUtilisateur$: CurrentUtilisateur;
  cUtilisateur = new Subscription();
  utilisateur: Utilisateur = new Utilisateur();
  // Utilisateur connecte
  emailUserConnected: string;
  // AUtocomplete
  // clientCtrl = new FormControl(); -----------------------------------------------------
  filteredClients: Observable<Client[]>;
  // prestationCtrl = new FormControl(); -----------------------------------------------------
  filteredPrestations: Observable<Prestation[]>;

  // Activation des champs
  date_changed: boolean = false;
  datePickerSelected: Date;

  timeA_state: boolean = false;
  timeA_changed: boolean = false;
  timeB_state: boolean = false;
  timeB_changed: boolean = false;
  // activite_state: boolean = false;
  // activite_changed: boolean = false;
  forfait_state: boolean = false;
  // forfait_changed: boolean = false;
  clientele_state: boolean = false;
  // soin_state: boolean = false;
  // soin_changed: boolean = false;
  praticien_state: boolean = false;
  praticien_changed: boolean = false;
  lieuRdv_state: boolean = false;
  lieuRdv_changed: boolean = false;
  update_button_state: boolean = true;
  // AUtocomplete Soin depuis Prestation
  soinCtrl = new FormControl();
  filteredSoins: Observable<Prestation[]>;
  // Rdv
  rdv = new Rdv();
  rdvAnnuleColor: string = "warn"
  rdvRecupere: boolean = false;
  // Genre
  // selectedGenre: string = "FEMME";
  genre: Genre = new Genre();
  genreList: Genre[];
  //client
  client = new Client();
  clientList: Client[];
  selectedClientFromList: Client;
  clientFromBdd: string;
  // Prestation
  prestation = new Prestation();
  prestationList: Prestation[];
  selectedPrestationFromList: Prestation;
  filteredPrestationByGenderAndForfait: Prestation[];
  prestationFromBdd: string;
  prestationSliderColor: string = "primary";
  // isPrestationsIsAForfait: string;
  // Activite
  activiteList: Activite[];
  activiteFromBdd: string;
  filterActivite: string;
  // Praticien
  praticien = new Praticien();
  praticienList: Praticien[];
  praticienFromBdd: string;
  selectedPraticienFromlist: Praticien;
  // LieuRdv
  lieurRdv = new LieuRdv();
  lieuRdvList: LieuRdv[];
  lieuRdvFromBdd: string;
  selectedLieuRdvFromList: LieuRdv;
  // Date
  datePicker_color = "primary"
  dateFromBdd: Date;
  // datePickerDateSelectionne: Date;
  // TIme
  tpA_selected_value: string = "08:00";
  tpB_selected_value: string;
  timePickerA_initial_value: string = "08:00";
  timePickerB_initial_value: string = "09:00";
  // Forfait  
  isItAForfait: boolean = false;
  isPrestaIsAForfait: boolean = false;
  soinFromBdd: string;
  // Route Id
  idRdvFromRoute: number;
  // parametre route observable
  idRdvFromRouteObservable: any;
  isRdvIsCancelled: boolean = false;

  // FormGroup
  rdvFg: FormGroup;

  // Confirm Suppression
  userConfimRdvSuppression: boolean = false;

  constructor(private logger: NGXLogger,
    private _rdvService: RdvService,
    public dialog: MatDialog,
    private _activiteService: ActiviteService,
    private _clientService: ClientService,
    private _prestationService: PrestationService,
    private _praticienService: PraticienService,
    private _lieuRdvService: LieuRdvService,
    private _dateService: DateService,
    private _authService: AuthService,
    private _utilisateurService: UtilisateurService,
    private _historyRouting: HistoryRoutingService,
    private _toasterService: ToasterService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _cd: ChangeDetectorRef) {

    this.idRdvFromRouteObservable = this._route.params.subscribe(
      res => { this.idRdvFromRoute = res['idRdv'] }
    )
    this.getRdvFromId(this.idRdvFromRoute);
    this.getClientList();
    this.getPrestationList();
    this.getPraticienList();
    this.getLieurRdvList();    

    this.emailUserConnected = this._authService.getMailFromToken();
    this._utilisateurService.setCurrentUtilisateur(this.emailUserConnected);

    this.refreshFilteredClients();
    // this.refreshFilteredPrestations();

  }

  ngOnInit() {

    this.rdvFg = new FormGroup({
      dateFc: new FormControl(this.dateFromBdd),
      timerAFc: new FormControl({ value: '' }),
      timerBFc: new FormControl({ value: '', disabled: false }),
      clientFc: new FormControl({ disable: false }),
      prestationFc: new FormControl({value: '' }),
      forfaitFc: new FormControl({ value: '', disable: false }),    
      praticienFc: new FormControl({ value: '', disable: false}),
      lieuRdvFc: new FormControl({ value: '', disable: false }),
      rdvCancelledFc: new FormControl({ value: '', disable: false })
      // modifyRdvFc: new FormControl({ value: '', disable: true })  
    });


    // verifier si le token est encore valide
    // this._authService
    // Historique de navigation stocke la route precedent afin de faire un BackPage
    this.previousRoute = this._historyRouting.getPreviousUrl();
    this.getCurrentUtilisateur(); 

  }

  ngOnChanges() {

    // this.refreshFilteredPrestations();
    
  }

  // public compareFc() {
    
  //   this._cd.checkNoChanges();
  //   return true;
  // }


  /**
   * Ouvrir le Modal de Login
   */
  openDialog(): void {

      const modalConf: MatDialogConfig = {
        hasBackdrop: true,
        disableClose:  true,
        data: { userConfimRdvSuppression: this.userConfimRdvSuppression,
                idRdv: this.rdv.idRdv }
      };

      this.logger.info("RdvDetailComponent Log : Valeur de userConfimRdvSuppression : " + this.userConfimRdvSuppression);
      this.logger.info("RdvDetailComponent Log : Ouverture du Modal ( Confimation suppression )");
      // let dialogRef = this.dialog.open(ConfirmRdvDetailsModalcomponent, modalLogin );
      let dialogRef = this.dialog.open(ConfirmRdvDetailsModalcomponent,  modalConf);

      dialogRef.afterClosed().subscribe( resultFromModal => {

        this.logger.info("RdvDetailComponent Log : Fermeture du Modal ( ConfirmAtion suppression )");
        this.logger.info("RdvDetailComponent Log : Valeur de userConfimRdvSuppression : " + resultFromModal.userConfimRdvSuppression);
        this.userConfimRdvSuppression = resultFromModal.userConfimRdvSuppression;

        if (this.userConfimRdvSuppression) {

          this.deleteRdvAfterConfirmation(resultFromModal.idRdv);

        } else {
          
          this.logger.info("RdvDetailComponent Log : Annulation de la deletion du rdv id: " + resultFromModal.idRdv);
        }

      });
    
  }

  /**
   * defini la valeur des chmaps selon le rdv importé depuis la Bdd
   */
  private attribuerLesValeursDuRdvFromBddAuFormulaire(): void {

    let stringForfait;

    // appel bdd ---------------------------------------------------------------------------------
    this.getPrestationById(this.rdv.prestation.idPrestation.valueOf());
    this.getClientById(this.rdv.client.idClient.valueOf());
    this.getPraticienById(this.rdv.praticien.idPraticien.valueOf());

    // setup de la Date ---------------------------------------------------------------------------------
    this.rdvFg.get('dateFc').setValue(new Date(this.rdv.dateHeureDebut));
    this.datePickerSelected = this.rdvFg.get('dateFc').value;

    // setup du timer A ---------------------------------------------------------------------------------
    this.rdvFg.get('timerAFc').setValue(this._dateService.extracTimeFromGivenTs(this.rdv.dateHeureDebut));
    this.timePickerA_initial_value = this._dateService.extracTimeFromGivenTs(this.rdv.dateHeureDebut);
    this.tpA_selected_value = this._dateService.extracTimeFromGivenTs(this.rdv.dateHeureDebut);

    // setup du timer B ---------------------------------------------------------------------------------
    this.rdvFg.get('timerBFc').setValue(this._dateService.extracTimeFromGivenTs(this.rdv.dateHeureFin));
    this.timePickerB_initial_value = this._dateService.extracTimeFromGivenTs(this.rdv.dateHeureFin);

    // setup du client ---------------------------------------------------------------------------------
    this.clientFromBdd = this.rdv.client.nomClient.toString() + " " + this.rdv.client.prenomClient.toString();
    this.rdvFg.get('clientFc').setValue(this.clientFromBdd);
    
    // setup forfait ---------------------------------------------------------------------------------
    this.isItAForfait = this.rdv.prestation.forfait.valueOf();
    this.rdvFg.get('forfaitFc').setValue(this.isItAForfait);

    // setup Praticien ---------------------------------------------------------------------------------
    this.praticienFromBdd = this.rdv.praticien.nomPraticien.toString() + " " + this.rdv.praticien.prenomPraticien.toString();
    this.rdvFg.get('praticienFc').setValue(this.rdv.praticien.nomPraticien.toString() + " " + this.rdv.praticien.prenomPraticien.toString());

    // setup LieuRdv ---------------------------------------------------------------------------------
    this.lieuRdvFromBdd = this.rdv.lieuRdv.lieuRdv.valueOf();
    this.rdvFg.get('lieuRdvFc').setValue(this.rdv.lieuRdv.lieuRdv.toString());

    // setup Prestation ---------------------------------------------------------------------------------
    this.rdvFg.get('prestationFc').setValue(this.prestation.activite.activiteNom.toString() 
    + " " + this.prestation.soin.toString() 
    + " " + this.prestation.genre.genreHum.toString());

    // setup RdvCanceled ---------------------------------------------------------------------------------
    this.isRdvIsCancelled = this.rdv.isCancelled;
    this.rdvFg.get('rdvCancelledFc').setValue('');

    // apres reception du rdv maj des listes
    setTimeout(() => {
      this.prestationExtractWithFilters();
    }, 2000);
    // this.prestationExtractWithFilters();
  }


  // =====================================================================================
  // Recuperation des donnees depuis la BDD
  // =====================================================================================
  /**
  * Recupere l utilisateur loggé
  */
  private async getCurrentUtilisateur() {

    this.logger.info("RdvDetailComponent log : Recuperation du currentuser ");
    this.cUtilisateur = await this._utilisateurService.getObjCurrentUtilisateur
      .subscribe((cUtilisateur: CurrentUtilisateur) => { this.currentUtilisateur$ = cUtilisateur },
        () => {
          this.logger.error("RdvDetailComponent log : La requete n a pas fonctionnée");
        });
  }

  /**
  * Récupere la liste de praticien
  */
  private getPraticienList() {

    this.logger.info("RdvDetailComponent log : Recuperation de la liste des praticiens.");
    this._praticienService.getPraticienList().subscribe(
      ((pratList: Praticien[]) => {
        this.praticienList = pratList;
      }
      )
    )
    // this.logger.info("RdvDetailComponent log : Liste des Praticiens nb entrees : " + this.praticienList.length); 
  }

  /**
   * Recupere la liste de prestation
   */
  private getPrestationList() {

    // si client est un homme
    // choix si forfait
    this.logger.info("RdvDetailComponent log : Recuperation de la liste des Prestations.");
    this._prestationService.getPrestationList().subscribe(
      ((prestaList: Prestation[]) => this.prestationList = prestaList
      )
    )
    // this.logger.info("RdvDetailComponent log : Liste des Prestations nb entrees : " + this.prestationList.length);
  }

  private getPrestationById(idPrestation: number) {
    this.logger.info("RdvDetailComponent log : Recuperation de la prestation.");
    this._prestationService.getPrestationById(idPrestation).subscribe(
      (presta => {
        this.prestation = presta
      })
    )
  }

  /**
  * Recupere la liste de lieuRdv
  */
  private getLieurRdvList(): void {
    this.logger.info("RdvDetailComponent log : Recuperation de la liste des LieuRdv.");
    this._lieuRdvService.getLieuRdvList().subscribe(
      ((lieuRdvList: LieuRdv[]) => {
        this.lieuRdvList = lieuRdvList})
    )
  }

  /**
   * Recupere la liste de Clients
   */
  private getClientList(): void {

    this.logger.info("RdvDetailComponent log : Recuperation de la liste des clients.");
    this._clientService.getClientList().subscribe(
      ((cliList: Client[]) => {
        this.clientList = cliList})
    )

  }

    /**
   * Recupere la liste des activites
   */
  private getActiviteList() {
    this.logger.info("RdvDetailComponent log : Recuperation de la liste des Activites.");
    this._activiteService.getActiviteList().subscribe(
      ((activiteList: Activite[]) => {
        this.activiteList = activiteList})
    )
  }

  /**
   * Recuperation du Client par Id
   */
  private getClientById(idClient: number): void {
    this.logger.info("RdvDetailComponent log : Recuperation du cleint par son Id.");
    this._clientService.getClientByID(idClient).subscribe(
      ((client: Client) => {
        this.selectedClientFromList = client})
    )
  }
  /**
   * Recuperation du Praticien par son Id
   */
  private getPraticienById(idPraticien: number): void {
    this.logger.info("RdvDetailComponent log : Recuperation du Praticien par son Id");
    this._praticienService.getPraticienById(idPraticien).subscribe(
      ((praticien: Praticien) => {
        this.praticien = praticien;
      }
      ))
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
  private _filteredPrestations(value: string): Prestation[] {

    const filterPrestationValue = value.toLowerCase();

    // return this.prestationList.filter(prestation => prestation.activite.activiteNom.toLowerCase().indexOf(filterPrestationValue) === 0);
    return this.prestationList.filter(prestation => prestation.activite.activiteNom.toLowerCase().indexOf(filterPrestationValue) === 0);
  }

  /**
   * Filtre les prestation pour recuperer les Activites
   * selon le genre du client
   * selon si la prestation est un forfait ou non
   */
  public prestationExtractWithFilters() {

    this.filteredPrestationByGenderAndForfait=[];
    // recupere l IdGenre du Client
    let idGenre: number = this.selectedClientFromList.genreClient.idGenre.valueOf();
    // Filtre la liste
    this.filteredPrestationByGenderAndForfait = this.prestationList
      .filter(presta => presta.forfait.valueOf() == this.isPrestaIsAForfait)
      .filter(presta => presta.genre.idGenre.valueOf() == idGenre)
      .map(presta => presta)
      // .filter(((presta, pos, arr) => 
      //    arr.indexOf(presta) === pos)) ;
      .filter((el, ind, arr) => 
      ind === arr.indexOf(el)); // supprime les doublons   
      
      this.logger.info(" nombre de prestation : " + this.filteredPrestationByGenderAndForfait.length);   

  }

  /**
   * Rafraichissement de la liste des Clients
   */
  private refreshFilteredClients() {

    setTimeout(() => {
      this.filteredClients = this.rdvFg.get('clientFc').valueChanges
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
  public dateSelectionnee(event: MatDatepickerInputEvent<Date>) {
    
    this.datePickerSelected = new Date(event.value); 
    this.logger.info("RdvDetailComponent log : Date sélectionnee Date: " + this.datePickerSelected);

    // Attibuer la nouvelle date
    // A la date de debut de rdv
    let test = moment(event.value)
    .tz('Europe/Paris')
    .hours(this._dateService.extracHoursFromGivenTime(this.rdvFg.get('timerAFc').value))
    .minutes(this._dateService.extracMinutesFromGivenTime(this.rdvFg.get('timerAFc').value))
    .format();
    this.logger.info("RdvDetailComponent log : DateHeureDebut tz : " + test.toString());

    this.rdv.dateHeureDebut = moment(event.value)
      .hours(this._dateService.extracHoursFromGivenTime(this.rdvFg.get('timerAFc').value))
      .minutes(this._dateService.extracMinutesFromGivenTime(this.rdvFg.get('timerAFc').value))
      .tz('Europe/Paris')
      .unix()*1000;
    this.logger.info("RdvDetailComponent log : DateHeureDebut : " + this.rdv.dateHeureDebut.toString());
    
    this.rdv.dateHeureFin = moment(this.datePickerSelected)
      .hours(this._dateService.extracHoursFromGivenTime(this.rdvFg.get('timerBFc').value))
      .minutes(this._dateService.extracMinutesFromGivenTime(this.rdvFg.get('timerBFc').value))
      .tz('Europe/Paris')
      .unix()*1000;
    this.logger.info("RdvDetailComponent log : DateHeureFin : " + this.rdv.dateHeureFin);
    
    this.toggleSaveButtonStatus();

  }

  /**
   * Heure de debut selectionnee
   * @param timePickerA
   */
  public timePickerASelectionne(timePickerA: string) {
    this.tpA_selected_value = this._dateService.modStringTime(timePickerA.valueOf(), 0, 0);
    // Attribution de l heure du selecteur_debut selectionnee au la variable  tpA_selected_value
    this.tpB_selected_value = timePickerA.valueOf();
 
    // Attribution du pickerA au pickerB avec 1 heure de plus
    this.timePickerB_initial_value = this._dateService.modStringTime(timePickerA.valueOf(), 1, 0);

    
    if (this.date_changed == true) {

      this.rdv.dateHeureDebut = moment(this.datePickerSelected)
        .hours(this._dateService.extracHoursFromGivenTime(timePickerA))
        .minutes(this._dateService.extracMinutesFromGivenTime(timePickerA))
        .tz('Europe/Paris')
        .unix()*1000;
        // Attribution du pickerA au pickerB avec 1 heure de plus
      this.timePickerB_initial_value = this._dateService.modStringTime(timePickerA.valueOf(), 1, 0);
      this.rdv.dateHeureFin = moment(this.datePickerSelected)
        .hours(this._dateService.extracHoursFromGivenTime(this.timePickerB_initial_value))
        .minutes(this._dateService.extracMinutesFromGivenTime(this.timePickerB_initial_value))
        .tz('Europe/Paris')
        .unix()*1000;

    } else {
      
      // this.rdv.dateHeureDebut = moment(this.dateFromBdd)
      this.rdv.dateHeureDebut = moment(this.rdvFg.get('dateFc').value)
        .hours(this._dateService.extracHoursFromGivenTime(timePickerA))
        .minutes(this._dateService.extracMinutesFromGivenTime(timePickerA))
        .tz('Europe/Paris')
        .unix()*1000;
        // Attribution du pickerA au pickerB avec 1 heure de plus
      this.timePickerB_initial_value = this._dateService.modStringTime(timePickerA.valueOf(), 1, 0);
      // this.rdv.dateHeureFin = moment(this.dateFromBdd)
      this.rdv.dateHeureFin = moment(this.rdvFg.get('dateFc').value)
        .hours(this._dateService.extracHoursFromGivenTime(this.timePickerB_initial_value))
        .minutes(this._dateService.extracMinutesFromGivenTime(this.timePickerB_initial_value))
        .tz('Europe/Paris')
        .unix()*1000;

    }

    this.toggleSaveButtonStatus();
  }


  /**
   * Heure de fin selectionne
   * @param selectedTimePickerB 
   */
  public timePickerBSelectionne(timePickerB: string) {
    // Attribution de l heure du selecteur_debut selectionnee au la variable  tpA_selected_value
    this.tpB_selected_value = timePickerB.valueOf();
    // Attribution du pickerA au pickerB avec 1 heure de plus
    if (this._dateService.compareTimeATimeB(this.timePickerA_initial_value, this.tpB_selected_value)){

      this.timePickerB_initial_value = this._dateService.modStringTime(timePickerB.valueOf(), 0, 0);

      if (this.date_changed == true) {

        this.rdv.dateHeureDebut = moment(this.datePickerSelected)
          .hours(this._dateService.extracHoursFromGivenTime(timePickerB))
          .minutes(this._dateService.extracMinutesFromGivenTime(timePickerB))
          .tz('Europe/Paris')
          .unix()*1000;
          // Attribution du pickerA au pickerB avec 1 heure de plus
        this.timePickerB_initial_value = this._dateService.modStringTime(this.tpA_selected_value.valueOf(), 1, 0);
        this.rdv.dateHeureFin = moment(this.datePickerSelected)
          .hours(this._dateService.extracHoursFromGivenTime(timePickerB))
          .minutes(this._dateService.extracMinutesFromGivenTime(timePickerB))
          .tz('Europe/Paris')
          .unix()*1000;
  
      } else {
        
        this.rdv.dateHeureDebut = moment(this.dateFromBdd)
          .hours(this._dateService.extracHoursFromGivenTime(timePickerB))
          .minutes(this._dateService.extracMinutesFromGivenTime(timePickerB))
          .tz('Europe/Paris')
          .unix()*1000;
          // Attribution du pickerA au pickerB avec 1 heure de plus
        this.timePickerB_initial_value = this._dateService.modStringTime(this.tpA_selected_value.valueOf(), 1, 0);
        this.rdv.dateHeureFin = moment(this.dateFromBdd)
          .hours(this._dateService.extracHoursFromGivenTime(timePickerB))
          .minutes(this._dateService.extracMinutesFromGivenTime(timePickerB))
          .tz('Europe/Paris')
          .unix()*1000;
  
      }

    }  else {

      console.log("Probleme d heure");
      this.timePickerB_initial_value = this._dateService.modStringTime(timePickerB.valueOf(), 0, 0);
    } 



    this.toggleSaveButtonStatus();

  }

  /**
   * Client selectionne
   * @param client
   */
  public clientSelectionne(event: MatOptionSelectionChange, client: Client) {

    if (event.source.selected) {
      this.logger.info("RdvDetailComponent log : Client séléctionné idclient: " + client.idClient + " " + client.nomClient);
      this.selectedClientFromList = client;
      this.rdv.client.idClient = client.idClient;
    }

    this.prestationExtractWithFilters();
    this.toggleSaveButtonStatus();
  }

  /**
   * Selectionne si forfait Boolean
   */
  public toggleForfaitByUser() {

    this.isItAForfait = !this.isItAForfait;
    this.toggleForfaitString(this.isItAForfait);
    this.logger.info("RdvDetailComponent log : Toggle Forfait value : " + this.isItAForfait);

    this.resetPrestations();
    this.prestationExtractWithFilters();

    this.toggleSaveButtonStatus();

  }

  /**
   * Bascule le boolean en String pour le filtre
   * @param forfaitValue 
   */
  private toggleForfaitString(forfaitValue: Boolean) {

    if (forfaitValue.valueOf() == true) {

      this.isPrestaIsAForfait = true;

    } else {

      this.isPrestaIsAForfait = false;
    }
    this.logger.info("RdvDetailComponent log : Toggle ForfaitString value : " + this.isPrestaIsAForfait);
    this.toggleSaveButtonStatus();
  }

  /**
   * trigger apres avoir selectionne l activite (soin)
   */
  public prestationSelectionnne(event: MatOptionSelectionChange, prestation: Prestation) {

    if (event.source.selected) {
      this.logger.info("RdvDetailComponent log : Soin selectionné id: " + prestation.idPrestation + "_" + prestation.soin);
      this.selectedPrestationFromList = null;
      this.selectedPrestationFromList = prestation;   
      
      this.rdv.prestation.idPrestation = prestation.idPrestation;

    }      

    this.toggleSaveButtonStatus();

  }

  /**
  * Attirbue le praticien selectionne
  */
  public praticienSelectionne(event: MatOptionSelectionChange, praticien: Praticien) {

    if (event.source.selected) {
      this.logger.info("RdvDetailComponent log : Praticien selectionne Id Priatien: " + praticien.idPraticien);
      this.selectedPraticienFromlist = praticien;
      this.logger.info("RdvDetailComponent log : Praticien idPraticien " + this.selectedPraticienFromlist.idPraticien);


      this.rdv.praticien.idPraticien = praticien.idPraticien;
    }

    this.toggleSaveButtonStatus();

  }

  /**
   * Attribue le lieuRdv selectionne
   * @param lieuRdv 
   */
  public lieuRdvSelectionne(event: MatOptionSelectionChange, lieuRdv: LieuRdv) {

    if (event.source.selected) {
      this.logger.info("RdvDetailComponent log : Praticien selectionne Id LieuRdv : " + lieuRdv.idLieuRdv);
      this.selectedLieuRdvFromList = lieuRdv;
      this.logger.info("RdvDetailComponent log : LieuRdv IsLieuRdv : " + this.selectedLieuRdvFromList.idLieuRdv);

      this.rdv.lieuRdv.idLieuRdv = lieuRdv.idLieuRdv;
      this.toggleSaveButtonStatus();
    }
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
    this.logger.info("RdvDetailComponent log : Methode activee : changeTimeA_stateStatus");

    if (this.timeA_state == true)
      this.timeA_state = !this.timeA_state;

  }

  /**
   * Active / Desactive TimePickerB
   * @param selectedTimePickerB 
   */
  private toggleTimePickerBStatus() {
    this.logger.info("RdvDetailComponent log : Methode activee : changeTimeB_stateStatus");

    if (this.timeB_state == true) {
      this.timeB_state = !this.timeB_state;
    }
  }

  /**
  * Active / Desactive Boutton Sauvegarder
  */
  private toggleSaveButtonStatus() {    

    if ( this.update_button_state == true ) {

      this.update_button_state = !this.update_button_state;
      this.logger.info("RdvDetailComponent log : Activation du bouton Update");
    }

  }

    /**
   * Mettre le status Annulé au Rdv. 
   * @param $event 
   */
  public changeStatusOfRdvCancelled() {
    
    this.isRdvIsCancelled = !this.isRdvIsCancelled;
    this.logger.info("RdvDetails Log: Etat de Forfait " + this.isRdvIsCancelled);

    this.rdv.isCancelled = this.isRdvIsCancelled;
    this.toggleSaveButtonStatus();   

  }

  // =====================================================================================
  // Reinitialise les champs et les listes Activite / Soins
  // =====================================================================================

  /**
   * Reinitialise les Activites
   */
  private resetPrestations() {

    this.rdvFg.get('prestationFc').setValue('');

  }

  /**
   * Recupere le rdv via son Id
   * @param idRdvFromRoute 
   */
  private getRdvFromId(idRdvFromRoute: number) {

    this.logger.info("RdvDetailscomponant log : récupereation du rdv id : " + idRdvFromRoute);

    this._rdvService.getRdvById(idRdvFromRoute).subscribe(
      res => {
      this.rdv = res;
        this.prestation = res.prestation;
        this.client = res.client;
        this.lieurRdv = res.lieuRdv;
        this.praticien = res.praticien;
        this.rdvRecupere = true;
        this.attribuerLesValeursDuRdvFromBddAuFormulaire();
        this._cd.markForCheck();
      },
      err => {
        err;
        let messageRdvNOk: string = "Recuperation idRdv: " + this.idRdvFromRoute + " échec";
        this.toasterMessage(messageRdvNOk, 'snackbarWarning', 5000);
        this.goHomePage();
        this.logger.error("rgpdService Log : Le rendez-vous n'a pas été Récupéré");
      }
    )

  }

  // =====================================================================================
  // Persistance du Rdv modifie
  // =====================================================================================

  /**
   * Enregistrer un Rdv
   */
  public updateRdv() {

    // Date de la modif du Rdv
    this.rdv.dateDeModif = moment().unix()*1000;    
    // Persiste le Rdv modifie
    this._rdvService.putRdv(this.rdv).subscribe(

        () => { 
            // this.logger.info("rgpdService Log : retour serveur : " + value.valueOf);
            // let messageRdvOk: string = "Rendez-vous enregistré / modifié :"
            // this.toasterMessage(messageRdvOk, 'snackbarInfo', 5000);
            // this.logger.info("rgpdService Log : Le rendez-vous modifié à été persiste");        
        },

        (response: HttpResponse<number>) => {

          if (response.status == 200) {
            let messageRdvOk: string = "Rendez-vous enregistré :"
            this.toasterMessage(messageRdvOk, 'snackbarInfo', 5000);
            this.logger.info("rgpdService Log : Le rendez-vous modifié à été persiste"); 
            // this._router.navigate(['./home']);
            
          } else {
            let messageRdvNOk: string = "Il y a eu un problème."
            this.toasterMessage(messageRdvNOk, 'snackbarWarning', 5000);
            this.logger.error("rgpdService Log : Le rendez-vous modifié n'a pas été persisté");
          }
        })

  }

  /**
   * Ouvrir le popup de confirmation de suppression de Rdv 
   */
  public eraseRdv() {

    this.openDialog();

  }


  /**
   * Effacer le rdv
   */
  private deleteRdvAfterConfirmation(idRdv: number) {  

    this.logger.info("RdvDetailsComponent log : Effacer le rdv id:" + idRdv);
    this._rdvService.delRdv(idRdv).subscribe(
      
      res => {},

      (err: HttpResponse<number>) => {

          if (err.status != 200) {

            this.toasterMessage("Le rendez-vous id: " + idRdv + " n'a pas été effacé", 'snackbarWarning', 3000);
            this.logger.error("RdvDetailsComponent log : Le Rdv id: " + idRdv + " non éffacé");
          
          } else {

            this.toasterMessage("Rendez-Vous id: " + idRdv+" éffacé",'snackbarInfo',3000);
            this.logger.info("RdvDetailsComponent log : Le Rdv id: " + idRdv + " éffacé");

          }
      }  
    );

  }

  /**
   * Ne pas modifier le Rdv en retournant a la page Home
   */
  public annulerLesModificationsRdv() {
    this.logger.info("RdvDetailsComponent log : Retour à la page home.")
    this._router.navigate(['./home']);
  }

  /**
   * aller à la page hom
   */
  private goHomePage() {

    this._router.navigate(['./home']);
  }

  /**
   * pupup
   * @param snackMessage 
   * @param snackStyle 
   * @param snackTimer 
   */
  private toasterMessage(snackMessage: string, snackStyle: string, snackTimer: number): void {
    this._toasterService.showToaster(snackMessage, snackStyle, snackTimer)
  }

}


@Component({
  selector: 'app-confirmRdvdetailsModal',
  templateUrl: '../confirm-rdvDetails-modal/confirm-rdvDetails-modal.component.html',
  styleUrls: ['../confirm-rdvDetails-modal/confirm-rdvDetails-modal.component.scss'],
  providers: [ NGXLogger]
})

export class ConfirmRdvDetailsModalcomponent implements OnInit {


  constructor( private logger: NGXLogger,
               public _authService: AuthService,
               public dialogRef: MatDialogRef<ConfirmRdvDetailsModalcomponent>,
               @Inject(MAT_DIALOG_DATA) public data: any) {

               } 
        
  ngOnInit() {

    this.logger.info("ConfirmRdvDetailsModalComponent Log : Valeur d'origine de userConfimRdvSuppression : " 
        + this.data.userConfimRdvSuppression);

  }
  
  /**
   * mettre a true le boolean qui servira a confirmer la suppression du Rdv,
   * Fermer le Modal / Dialog
   */
  public okDelete() {
    this.data.userConfimRdvSuppression = true;
    this.logger.info("ConfirmRdvDetailsModalComponent Log : Nouvelle valeur de userConfimRdvSuppression : " 
        + this.data.userConfimRdvSuppression);
    this.dialogRef.close(this.data);
  }

  /**
   * Mettre a False le boolean qui servira a annuler la suppression du Rdv,
   * Fermer le Modal / Dialog
   */
  public cancelDeletion() {
    this.data.userConfimRdvSuppression = false;
    this.logger.info("ConfirmRdvDetailsModalComponent Log : Maintient de la Valeur de userConfimRdvSuppression : " 
        + this.data.userConfimRdvSuppression);
    this.dialogRef.close(this.data);
    
  }
              
}
