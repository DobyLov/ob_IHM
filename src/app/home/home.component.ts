import { Component, OnInit, ChangeDetectorRef, AfterViewChecked, AfterViewInit, AfterContentInit, OnDestroy, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { UtilisateurService } from '../utilisateur/utilisateur.service';
import { CurrentUtilisateur } from '../login/currentUtilisateur';
import { RdvService } from '../rdv/rdv.service';
import { Rdv } from '../rdv/rdv';
import { Praticien } from '../praticien/praticien';
import { PraticienService } from '../praticien/praticien.service';
import { Dateservice } from '../client/date/date.service';
import { Observable } from '../../../node_modules/rxjs/Observable';
import { map } from 'rxjs/operators';
import { Subscription } from '../../../node_modules/rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers : [ NGXLogger]
})
export class HomeComponent implements OnInit, OnDestroy {

  // @Input() isScreenIsMobile$: boolean;
  currentUtilisateur$: CurrentUtilisateur;
  rdvList: Rdv[];
  tabNomsColonnes: string[] = ['numeroRdv','dateHeureDebut','separation', 'dateHeureFin', 
                'lieuRdv', 'activite', 'prestation', 'nomClient', 'prenomClient', 'idRdv' ];
  dataSource;
  praticien: Praticien;
  nbRdv: number;
  cUtilisateur = new Subscription();
  

  constructor( private logger: NGXLogger,
               private _utilisateurservice: UtilisateurService,
               private _rdvservice: RdvService,
               private _cd: ChangeDetectorRef,
               private _praticienservice: PraticienService,
               private _dateservice: Dateservice,
               private router: Router ) 
               {
                          
                  this.cUtilisateur = this._utilisateurservice.getObsCurrentUtilisateur
                            .subscribe( (cUtilisateur: CurrentUtilisateur) => 
                            { this.currentUtilisateur$ = cUtilisateur;
                              this._praticienservice.getPraticienByEmail(this.currentUtilisateur$.adresseMailUtilisateur) 
                              .subscribe( (res: Praticien) => 
                              { this.praticien = res;
                                this.getRdvListParDateParIdPraticien(this._dateservice.setDateToStringYYYYMMDD(new Date()), this.praticien.idPraticien);
                                 } ) ;                    
                    }) ;
                  
              }

  ngOnInit() {  }

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
    this._rdvservice.getRdvListByByDateAndByPraticien(dateJj, idPraticien)
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
