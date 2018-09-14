import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { UtilisateurService } from '../utilisateur/utilisateur.service';
import { CurrentUtilisateur } from '../login/currentUtilisateur';
import { RdvService } from '../rdv/rdv.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers : [ NGXLogger]
})
export class HomeComponent implements OnInit {

  currentUtilisateur$: CurrentUtilisateur;

  constructor( private logger: NGXLogger,
               private _utilisateurservice: UtilisateurService,
               private _rdvservice: RdvService,
               private router: Router ) {

              this._utilisateurservice.getObsCurrentUtilisateur
                .subscribe((cUtilisateur: CurrentUtilisateur) => {
                    this.currentUtilisateur$ = cUtilisateur}
              );    
              }

  ngOnInit() { this._rdvservice.getRdvList() }
 
  getInfo() { }

  /**
   * Ouverture de la page Welcom
   */
  public goWelcome() {
    this.router.navigate(['./welcome'])
  }

    /**
   * Ouverture de la page Welcom
   */
  goUnknowPage() {
    this.router.navigate(['./welcomee'])

  }

}
