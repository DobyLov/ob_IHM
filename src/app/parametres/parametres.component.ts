import { Component, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ParametresService } from './parametres.service';
import { CurrentUtilisateur } from '../login/currentUtilisateur';
import { Subscription } from 'rxjs';
import { Utilisateur } from '../utilisateur/utilisateur';
import { HistoryRoutingService } from '../service/historyRouting.service';
import { NGXLogger } from 'ngx-logger';
import { UtilisateurService } from '../utilisateur/utilisateur.service';

@Component({
  selector: 'app-parametres',
  templateUrl: './parametres.component.html',
  styleUrls: ['./parametres.component.scss']
})
export class ParametresComponent implements OnInit {

    // RouterHistory
    previousRoute: string;
    // Utilisateur
    @Output() isUserIsConnected$: boolean = false;
    currentUtilisateur$: CurrentUtilisateur;
    cUtilisateur = new Subscription();
    utilisateur: Utilisateur = new Utilisateur();

  constructor( private logger: NGXLogger,
                private _router: Router,
                private _utilisateurService: UtilisateurService,
                private _historyRouting: HistoryRoutingService,
                private _parametresService: ParametresService ) { 
  }

  ngOnInit() {
            // Historique de navigation stocke la route precedent afin de faire un BackPage
            this.previousRoute = this._historyRouting.getPreviousUrl();

            this.getCurrentUtilisateur();
  }

    /**
* Recupere l utilisateur loggé
*/
 private async getCurrentUtilisateur() {

  this.logger.info("ParametreComponent log : Recuperation du currentuser ");
  this.cUtilisateur = await this._utilisateurService.getObjCurrentUtilisateur
    .subscribe((cUtilisateur: CurrentUtilisateur) => { this.currentUtilisateur$ = cUtilisateur },
      () => {
        this.logger.error("ParametreComponent log : La requete n a pas fonctionnée");
      });
}

  /**
   * Forcer l'envoi d'SMS
   */
  public forcerEnvoiSmsRemiderClients() {

    this._parametresService.forcerEnvoiSmSClientsRemider();

  }

  /**
   * Forcer l'envoi d'SMS
   */
  public forcerEnvoiSmsRemiderPraticiens() {
    
    this._parametresService.forcerEnvoiSmSPraticiensRemider();

  }

  /**
  * Forcer l'envoi d'Email
  */
  public forcerEnvoiEmailRemiderClients() {

    this._parametresService.forcerEnvoiEmailClientsRemider();

  }

  /**
  * Forcer l'envoi d'Email
  */
  public forcerEnvoiEmailRemiderPraticiens() {
    
    this._parametresService.forcerEnvoiEmailPraticiensRemider();

  }

  /**
   * Retourne au Menu
   */
  public backHome() {

      this._router.navigate(['./home']);

  }

}
