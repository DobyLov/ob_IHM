import { ChangeDetectorRef, Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { RdvService } from '../rdv/rdv.service';
import { UtilisateurService } from '../utilisateur/utilisateur.service';
import { Rdv } from '../rdv/rdv';
import { AuthService } from '../login/auth.service';
import { Location } from '@angular/common';
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
import { ErrorHandlerService } from '../service/errorHandler.service';
import { startWith, map } from 'rxjs/operators';
import { MatSlideToggleChange } from '@angular/material';

@Component({
    selector: 'app-rdvdetails',
    templateUrl: './rdvdetails.component.html',
    styleUrls: ['./rdvdetails.component.scss']
})
export class RdvDetailsComponent implements OnInit {

  // Route history
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

  // Rdv
  rdv: Rdv;
  // Rdv annule
  isRdvIsCancelled: boolean = false;
  rdvAnnuleColor:string = "warn"
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
  activiteList= [];
  // Praticien
  praticien: Praticien;
  praticienList: Praticien[];
  // LieuRdv
  lieurRdv: LieuRdv;
  lieuRdvList: LieuRdv[];
  // Forfait
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
              private _historyRouting: HistoryRoutingService){

                // this.getClientList();
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

  ngOnInit(){

    this.getPrestationList()
    this.getCurrentUtilisateur();
    this.getPraticienList();
    this.getLieurRdv();

    setTimeout(() => {
      this.activiteExtractor();
    }, 2000);

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
        const prestafilterd = prestaList.filter( res => res.forfait == 'F' || res.forfait == 'f')
        this.prestationList = prestafilterd;
      }
      )
    )
  }

  private activiteExtractor() {
    this.activiteList = this.prestationList
                      .map( activite => activite.activite )
                      .filter((el, i, a) => i === a.indexOf(el))
    console.log("activiteExtractor : " + this.activiteList)
  }

  public clientSelection(client: Client) {

    this.selectedClientFromList = null;
    this.selectedClientFromList = client;
    this._cd.markForCheck;
    if (!client == null)
    console.log("client selectionné Id : " + this.selectedClientFromList.idClient);
  }


  public prestationSelection(prestation: Prestation) {

    this.selectedPrestationFromList = null;
    this.selectedPrestationFromList = prestation;
    this._cd.markForCheck;
    if (!prestation == null)
    console.log("client selectionné Id : " + this.selectedPrestationFromList);
  }

  public cancelClientSelection() {
    this.selectedClientFromList = null;
  }

  /**
   * Enregistrer un Rdv
   */
  public saveRdv() {
    console.log("Rdv saved :)")
  }

  public toggleForfait() {

    this.isPrestationsIsAForfait = !this.isPrestationsIsAForfait;
    this.logger.info("RdvDetailscomponent log : etat de isPrestationsIsAForfait : " + this.isPrestationsIsAForfait);
  }

  /**
   * toggle le status de isRdvIsCancelled
   */
  public changeStatusOfRdvCancelled() {

    this.isRdvIsCancelled = !this.isRdvIsCancelled;
    this.logger.info("RdvDetailscomponent log : etat de isRdvIsCancelled : " + this.isRdvIsCancelled);
  }


}



  //   @Input() isUserIsConnected$: boolean = false;
  //   previousRoute: string;
  //   idRdv: number;
  //   rdvExistant: boolean = true;
  //   rdvRecupere: boolean = false;
  //   rdv: Rdv = null;  
  //   emailUserConnected: string;
  
  
  //   constructor(private logger: NGXLogger,
  //               private route: ActivatedRoute,
  //               private _rdvService: RdvService,
  //               private _utilisateurService: UtilisateurService,
  //               private _authService: AuthService,
  //               private _cd: ChangeDetectorRef,
  //               private _historyRouting: HistoryRoutingService) {
  
  //                   this.getRdv(this.getUrlParamId());
  
  //                   this.emailUserConnected = this._authService.getMailFromToken();
  //                   this._utilisateurService.setCurrentUtilisateur(this.emailUserConnected);
                    
  
  //   }
  
  //   ngOnInit() {

  //       this.previousRoute = this._historyRouting.getPreviousUrl();

  //       this.logger.info("rdvdetailComponent log : etat du previusRoute : " + this.previousRoute)
  //    }
  
  //   /**
  //    * Extrait le parametre idRdv de l url
  //    * @returns number
  //    */
  //   private getUrlParamId(): number {
  
  //     let getIdString = this.route.snapshot.paramMap.get('idRdv');
  //     this.logger.info("Rdv-DetailComponent Log : Recuperation depuis l'url: le Paramametr idRdv : " + getIdString);
  //     this.idRdv = this.idStringConvertToNumber(getIdString);
  
  //     return this.idRdv;
  //   }
  
  //   ngOnDestroy() {

  //     this._cd.detach();   
  //   }
  
  //   ngAfterViewChecked() {
  //     // this._cd.detectChanges();
  //   }
  
  
  
  //   /**
  //    * Converti un nombre(String) en Number
  //    * @param idString 
  //    * @returns number
  //    */
  //   private idStringConvertToNumber(idString: string): number {
  
  //     this.logger.info("Rdv-DetailComponent Log : Conversion du type String en Number de isRdv : " + idString);
  //     this.logger.info("Rdv-DetailComponent Log : Type initial de idRdv : " + typeof (idString));
  //     this.idRdv = parseInt(idString);
  //     this.logger.info("Rdv-DetailComponent Log : Type apres conversion de idRdv : " + typeof (this.idRdv));
  
  //     return this.idRdv;
  //   }
  
  //   /**
  //    * Recupere le detail du Rdv par son Id
  //    * @param id 
  //    */
  //   private getRdv(id) {
  
  //     this.logger.info("Rdv-DetailComponent log: Demande le detail du Rdv id : " + id);
  //     this._rdvService.getRdvById(id)
  //       .subscribe(
  //         (res: Rdv) => {
  //           this.rdvExistant = true;
  //           this.rdv = res;
  //           this.rdvRecupere = true;
  //           this.logger.info("Rdv-DetailComponenet log : Rdv id: " + id + " trouvé dans la Bdd");
  //           this._cd.markForCheck();
  //           // this._cd.detectChanges();
  //         },
  
  //         (err) => {
  //           this.rdvExistant = false;
  //           this.logger.info("Rdv-DetailComponent log : Rdv id: " + id + " non trouvé dans la Bdd");
  //           this._cd.markForCheck();
  //           // this._cd.detectChanges();
  //         }
  //       )
  //   }
  
  //   /**
  //   * Souscription a l orbservable isconnected
  //   */
  //   private getIsUserIsConnected() {
  
  //     // Souscription a l orbservable isconnected
  //     this._authService.statusOfIsUserIsLogged.subscribe(isLoggedIn => {
  //       this.isUserIsConnected$ = isLoggedIn.valueOf();
  //     });
  
  //   }
  
  // }
  