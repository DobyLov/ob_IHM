import {
  Component,
  ViewChild,
  HostListener,
  OnInit,
  OnDestroy,
  Inject,
  ChangeDetectionStrategy,
  Input,
  AfterContentInit,
  ChangeDetectorRef,
  OnChanges
} from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import {
  MatMenuTrigger,
  MatSidenav,
  MatSidenavContainer
} from '@angular/material';

import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material';


import { SideBarService } from './service/sidebar.service';
import { CurrentUtilisateur } from './login/currentUtilisateur';
import { UtilisateurService } from './utilisateur/utilisateur.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./app.component.scss']
})


export class AppComponent implements OnInit {


  // control de la sidenav
  @ViewChild('mysidenav') private mysidenav: MatSidenav;
  // control du menu
  // @ViewChild(MatMenuTrigger) private menutrigger: MatMenuTrigger;

  cUtilisateur: CurrentUtilisateur;
  userNameConnected$ = 'toto';
  sideNavToggle: Boolean = false;

  title = 'OOPPusbeaute'

  sidenavlinks = [{
    rubrique: 'Rdv',
    liste1: 'Liste des rdv\'s',
    routingListe1: './rdv',
    ajout1: 'Ajouter un Rdv',
    routingAjout1: '[./rdvadd]'
  }]


  constructor(private _sidebarservice: SideBarService,
              public _utilisateurservice: UtilisateurService
             
  ) {}

  ngOnInit() {
    // observable pour fermer la sidebar des le clic sur le btn menu Login dans le header
    this._sidebarservice.statusOfSideNavState.subscribe(forceCloseSideBar => {
      if (forceCloseSideBar.valueOf() == true) {
        this.mysidenav.close()
      }
    })

    // Observable pour ouvrir ou fermer la sideBar depuis le btn du header
    this._sidebarservice.statusOfSideNavToggle.subscribe(sideBarButton => {
      this.sideNavToggle = sideBarButton.valueOf();

      if (sideBarButton.valueOf() == true) {

        if (sideBarButton.valueOf() == true && this.mysidenav.opened.valueOf() == true) {          
          this.mysidenav.close();
        } else {
          this.mysidenav.open();
        }

      } else {

        if (sideBarButton.valueOf() == false && this.mysidenav.opened.valueOf() == false) {
          this.mysidenav.open();
        } else {
          this.mysidenav.close();
        }
      }
      
    })

    // Observable pour recuperer le Current Utilisateur
    this._utilisateurservice.getObsCurrentUtilisateur.subscribe((cu: CurrentUtilisateur) => {
      if (cu == null) {
        this.userNameConnected$ = null;
      } else {
      this.userNameConnected$ = cu.prenomUtilisateur;
      }
    })
    
  }
}











