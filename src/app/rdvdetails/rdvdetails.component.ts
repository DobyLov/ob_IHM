import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { RdvService } from '../rdv/rdv.service';
import { UtilisateurService } from '../utilisateur/utilisateur.service';
import { Rdv } from '../rdv/rdv';
import { AuthService } from '../login/auth.service';
import { Location } from '@angular/common';
import { HistoryRoutingService } from '../service/historyRouting.service';

@Component({
    selector: 'app-rdvdetails',
    templateUrl: './rdvdetails.component.html',
    styleUrls: ['./rdvdetails.component.scss']
})
export class RdvDetailsComponent implements OnInit {

    @Input() isUserIsConnected$: boolean = false;
    previousRoute: string;
    idRdv: number;
    rdvExistant: boolean = true;
    rdvRecupere: boolean = false;
    rdv: Rdv = null;  
    emailUserConnected: string;
  
  
    constructor(private logger: NGXLogger,
                private route: ActivatedRoute,
                private _rdvService: RdvService,
                private _utilisateurService: UtilisateurService,
                private _authService: AuthService,
                private _cd: ChangeDetectorRef,
                private _historyRouting: HistoryRoutingService) {
  
                    this.getRdv(this.getUrlParamId());
  
                    this.emailUserConnected = this._authService.getMailFromToken();
                    this._utilisateurService.setCurrentUtilisateur(this.emailUserConnected);
                    
  
    }
  
    ngOnInit() {

        this.previousRoute = this._historyRouting.getPreviousUrl();

        this.logger.info("rdvdetailComponent log : etat du previusRoute : " + this.previousRoute)
     }
  
    /**
     * Extrait le parametre idRdv de l url
     * @returns number
     */
    private getUrlParamId(): number {
  
      let getIdString = this.route.snapshot.paramMap.get('idRdv');
      this.logger.info("Rdv-DetailComponent Log : Recuperation depuis l'url: le Paramametr idRdv : " + getIdString);
      this.idRdv = this.idStringConvertToNumber(getIdString);
  
      return this.idRdv;
    }
  
    ngOnDestroy() {

      this._cd.detach();   
    }
  
    ngAfterViewChecked() {
      // this._cd.detectChanges();
    }
  
  
  
    /**
     * Converti un nombre(String) en Number
     * @param idString 
     * @returns number
     */
    private idStringConvertToNumber(idString: string): number {
  
      this.logger.info("Rdv-DetailComponent Log : Conversion du type String en Number de isRdv : " + idString);
      this.logger.info("Rdv-DetailComponent Log : Type initial de idRdv : " + typeof (idString));
      this.idRdv = parseInt(idString);
      this.logger.info("Rdv-DetailComponent Log : Type apres conversion de idRdv : " + typeof (this.idRdv));
  
      return this.idRdv;
    }
  
    /**
     * Recupere le detail du Rdv par son Id
     * @param id 
     */
    private getRdv(id) {
  
      this.logger.info("Rdv-DetailComponent log: Demande le detail du Rdv id : " + id);
      this._rdvService.getRdvById(id)
        .subscribe(
          (res: Rdv) => {
            this.rdvExistant = true;
            this.rdv = res;
            this.rdvRecupere = true;
            this.logger.info("Rdv-DetailComponenet log : Rdv id: " + id + " trouvé dans la Bdd");
            this._cd.markForCheck();
            // this._cd.detectChanges();
          },
  
          (err) => {
            this.rdvExistant = false;
            this.logger.info("Rdv-DetailComponent log : Rdv id: " + id + " non trouvé dans la Bdd");
            this._cd.markForCheck();
            // this._cd.detectChanges();
          }
        )
    }
  
    /**
    * Souscription a l orbservable isconnected
    */
    private getIsUserIsConnected() {
  
      // Souscription a l orbservable isconnected
      this._authService.statusOfIsUserIsLogged.subscribe(isLoggedIn => {
        this.isUserIsConnected$ = isLoggedIn.valueOf();
      });
  
    }

    // /**
    //  * Retourne à la page precedente
    //  */
    // public returnPreviousPage() {
    //   this._router.navigate([this.previousRoute]);
    // }
  
  }
  