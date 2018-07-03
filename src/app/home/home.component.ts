import { Component, OnInit } from '@angular/core';
import { UtilisateurService } from '../utilisateur/utilisateur.service';
import { Utilisateur } from '../utilisateur/utilisateur';
import { Router } from '@angular/router';
import { CurrentUtilisateur } from '../login/currentUtilisateur';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  // userlogged: string = localStorage.getItem('connectedUser');
  currentUtilisateur$: CurrentUtilisateur;

  constructor( private _utilisateurservice: UtilisateurService,
               private router: Router ) {

              this._utilisateurservice.getObsCurrentUtilisateur
                .subscribe((cUtilisateur: CurrentUtilisateur) => {
                    this.currentUtilisateur$ = cUtilisateur}
              );    
              }

  ngOnInit() {
    // console.log("HomeComponent : ngOnInit : NomUtilisateur" + this.currentUtilisateur$.nomUtilisateur);
   }
 
  getInfo() { }

  goWelcome() {
    this.router.navigate(['./welcome'])
  }

  goUnknowPage() {
    this.router.navigate(['./welcomee'])

  }

}
