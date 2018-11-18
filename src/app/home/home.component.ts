import { Component, OnInit, ChangeDetectorRef, OnDestroy, Input, AfterViewInit } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { UtilisateurService } from '../utilisateur/utilisateur.service';
import { CurrentUtilisateur } from '../login/currentUtilisateur';
import { RdvService } from '../rdv/rdv.service';
import { Rdv } from '../rdv/rdv';
import { Praticien } from '../praticien/praticien';
import { PraticienService } from '../praticien/praticien.service';
import { Subscription, Observable } from '../../../node_modules/rxjs';
import { AuthService } from '../login/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { timer } from 'rxjs';
import { DateService } from '../service/dateservice.service';
import { ErrorHandlerService } from '../service/errorHandler.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers : [ NGXLogger]
})

export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() isScreenIsMobile$: boolean;
  @Input() isUserIsConnected$: boolean = false;

  // timer de rafraichissement
  refreshTimer: any;
  timerSubscription: any;
  // 5 minutes => 5*60*10000
  timeToWaitToStartTimer: number = (1*1000);
  tickTimerFrequency: number = (5*60*1000);

  // parametres pour recupererle sinfos utilisateu praticien
  emailUserConnected: string;
  praticien: Praticien;

  currentUtilisateur$: CurrentUtilisateur;
  cUtilisateur = new Subscription();  
  
  // paramtres pour Rdv
  listRdv: any;
  rdvList: Rdv[];

  // Formatage de la table
  tabNomsColonnes: string[] = ['numeroRdv','dateHeureDebut','separation', 'dateHeureFin', 
                'lieuRdv', 'activite', 'prestation', 'nomClient', 'prenomClient', 'idRdv' ];
  dataSource: Rdv[];

  nbRdv: number = -1;

  


  constructor( private logger: NGXLogger,
               private _utilisateurService: UtilisateurService,
               private _rdvService: RdvService,
               private _authService: AuthService,
               private router: Router,
               private _cd: ChangeDetectorRef,
               private _praticienService: PraticienService,
               private _dateService: DateService,
               private _errorHandlerService: ErrorHandlerService ) 
               {
                  
                
                this.emailUserConnected = this._authService.getMailFromToken();
                this._utilisateurService.setCurrentUtilisateur(this.emailUserConnected); 
                
                this.getIsUserIsConnected();
                }

  ngOnInit() {  

    this.getCurrentUtilisateur();

  }

  ngAfterViewInit(): void {

    this.logger.info("HomeComponent log : Fin d initialisation de la vue:");
    this.logger.info("HomeComponent log : Premier tick dans 30 puis toutes les 30s:");

    // timer(numberA, numberB)
    // numberA => Every t
    // numberB => start at
    // this.refreshTimer = timer(5*60*1000,5*60*10000);   
    this.refreshTimer = timer(this.tickTimerFrequency,this.timeToWaitToStartTimer); 
    this.timerSubscription = new Observable();  
    this.timerSubscription = this.refreshTimer.subscribe( t => {    
    this.logger.info("HomeComponent log : Timer => Recuperation des Rdv depuis la BDD : ");  
    this.getRdvListParDateParIdPraticien(this._dateService.setDateToStringYYYYMMDD(new Date()), this.praticien.idPraticien); 
    this.logger.info("HomeComponent log : Timer => Rdv récupérés :");
    });
  }

  ngOnDestroy() {

    if ( this.cUtilisateur ) { this.cUtilisateur };
    if ( this.listRdv ) { this.listRdv.unsubscribe };
    if (this.refreshTimer.unsubscribe) { this.refreshTimer.unsubscribe };
    this.timerSubscription.unsubscribe();
  
  }

    /**
   * Souscription a l orbservable isconnected
   */
  private getIsUserIsConnected(){

    // Souscription a l orbservable isconnected
    this._authService.statusOfIsUserIsLogged.subscribe(isLoggedIn => {
      this.isUserIsConnected$ = isLoggedIn.valueOf() 
    });

  }
  
  
  /**
   * Recupere l utilisateur loggé
   */
  private async getCurrentUtilisateur() {

    this.logger.info("HomeComponent log : Recuperation du currentuser ");
    this.cUtilisateur = await this._utilisateurService.getObjCurrentUtilisateur
    .subscribe( (cUtilisateur: CurrentUtilisateur) => 
    {
      this.currentUtilisateur$ = cUtilisateur;
      setTimeout( () => {
        this._praticienService.getPraticienByEmail( this.currentUtilisateur$.adresseMailUtilisateur ) 
      .subscribe( (res: Praticien) => 
      { this.praticien = res;
        this.getRdvListParDateParIdPraticien(this._dateService.setDateToStringYYYYMMDD(new Date()), this.praticien.idPraticien);
        },
        (err: Error ) => {
         this.logger.error("HomeComponent log : La requete n a pas fonctionnée");
        });
      }, 2000);             
    } ); 

  }  
  

/**
 * recupere la liste des RDv par dDte et par Praticien
 */
  private getRdvListParDateParIdPraticien(dateJj: string, idPraticien: number) {
    
    this.logger.info("HomeComponent Log: Recuperation de la liste de Rdv du JourJ et par Id Praticien");
    this.currentUtilisateur$;
    this.rdvList = null;
    this.logger.info("HomeComponent Log : Recuperation dela liste totale des Rdv's");
    this.listRdv = this._rdvService.getRdvListByByDateAndByPraticien(dateJj, idPraticien)
      .subscribe( res => {  this.rdvList = res;
                            this.dataSource = this.rdvList;  
                            this.nbRdv = this.rdvList.length;  
                            this._cd.markForCheck();
                          },
                          ( (e) => { 
                            // => vers le Gestionnaire d'érreur
                            this._errorHandlerService.handleError(e);
                            }
                          )
                  );    
  }


  /**
   * Ouvre le detail du Rdv selectionné
   * @param $rdvList 
   * @param idRdv 
   */
  public openRdvDetails(idRdv: number): void {

    this.logger.info("HomeComponenet Log : ouverture du detail idRdv: " + idRdv);
    this.router.navigate(['./rdvdetails',idRdv]);
  }

  

}
