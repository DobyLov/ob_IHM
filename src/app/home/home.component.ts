import { Component, OnInit, ChangeDetectorRef, OnDestroy, Input } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { UtilisateurService } from '../utilisateur/utilisateur.service';
import { CurrentUtilisateur } from '../login/currentUtilisateur';
import { RdvService } from '../rdv/rdv.service';
import { Rdv } from '../rdv/rdv';
import { Praticien } from '../praticien/praticien';
import { PraticienService } from '../praticien/praticien.service';
import { Dateservice } from '../client/date/date.service';
import { Subscription } from '../../../node_modules/rxjs';
import { AuthService } from '../login/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers : [ NGXLogger]
})
export class HomeComponent implements OnInit, OnDestroy {

  @Input() isScreenIsMobile$: boolean;
  @Input() isUserIsConnected$: boolean = false;

  currentUtilisateur$: CurrentUtilisateur;
  rdvList: Rdv[];
  tabNomsColonnes: string[] = ['numeroRdv','dateHeureDebut','separation', 'dateHeureFin', 
                'lieuRdv', 'activite', 'prestation', 'nomClient', 'prenomClient', 'idRdv' ];
  dataSource;
  praticien: Praticien;
  nbRdv: number;
  cUtilisateur = new Subscription();  

  constructor( private logger: NGXLogger,
               private _utilisateurService: UtilisateurService,
               private _rdvService: RdvService,
               private _authService: AuthService,
               private _cd: ChangeDetectorRef,
               private _praticienService: PraticienService,
               private _dateService: Dateservice) 
               {
                this.getIsUserIsConnected();
                this.detectIfPageFromF5OrNavigation();            
                }

  ngOnInit() {  

      
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
   * recupere les infos de l utilisateur en fonction
   * de la navigation ou adresse depuis la barre de recherche
   */
  private detectIfPageFromF5OrNavigation() {
    // this._cd.detectChanges();
    this.logger.info("***********************************************");
    this.logger.info("***********************************************");
    this.logger.info("***********************************************");
    this.logger.info("***********************************************");

    this.logger.info("homeComponent Log : etat de isUserIsConnected : " + this.isUserIsConnected$.valueOf());

    if ( this.isUserIsConnected$.valueOf() == true ) {

      this.logger.info("homeComponent Log : etat de isUserIsConnected(true) : " + this.isUserIsConnected$.valueOf());
      this.getCurrentUtilisateur();

    } else {

      this.logger.info("homeComponent Log : etat de isUserIsConnected(false) : " + this.isUserIsConnected$.valueOf());
      // this._authService.getMailFromToken();
      // this._utilisateurService.setCurrentUtilisateur(this.currentUtilisateur$.adresseMailUtilisateur);
      this._utilisateurService.setCurrentUtilisateur(this._authService.getMailFromToken());
    }

  }

  /**
   * Recupere l utilisateur loggé
   */
  private getCurrentUtilisateur() {

    this.cUtilisateur = this._utilisateurService.getObsCurrentUtilisateur
    .subscribe( (cUtilisateur: CurrentUtilisateur) => 
    { this.currentUtilisateur$ = cUtilisateur;
            this._praticienService.getPraticienByEmail( this.currentUtilisateur$.adresseMailUtilisateur ) 
            .subscribe( (res: Praticien) => 
            { this.praticien = res;
              this.getRdvListParDateParIdPraticien(this._dateService.setDateToStringYYYYMMDD(new Date()), this.praticien.idPraticien);
              }); 
    } ); 

  }

  ngOnDestroy() {  
    
    this.cUtilisateur.unsubscribe(); 
    
  }  

/**
 * recupere la liste totale de Rdv
 */
  private getRdvListParDateParIdPraticien(dateJj: string, idPraticien: number) {
    
    this.logger.info("HomeComponent Log: Recuperation de la liste de Rdv du JourJ et par Id Praticien");
    this.currentUtilisateur$;
    this.rdvList = null;
    this.logger.info("HomeComponent Log : Recuperation dela liste totale des Rdv's");
    this._rdvService.getRdvListByByDateAndByPraticien(dateJj, idPraticien)
      .subscribe( res => {  this.rdvList = res;
                            this.dataSource = this.rdvList;  
                            this.nbRdv = this.rdvList.length;                               
                            this._cd.detectChanges();
                          } );

  }

  /**
   * Ouvre le detail du Rdv selectionné
   * @param $rdvList 
   * @param idRdv 
   */
  public openRdvDetails(idRdv: number): void {

    this.logger.info("HomeComponenet Log : ouverture du detail idRdv: " + idRdv);

  }

}
