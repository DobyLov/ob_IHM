import { Component, ViewChild, OnInit, ChangeDetectionStrategy, Output } from '@angular/core';

// CDK_BreakPoint
// import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';

// Material
import { MatSidenav, MatAccordion } from '@angular/material';

import { SideBarService } from './service/sidebar.service';
import { CurrentUtilisateur } from './login/currentUtilisateur';
import { UtilisateurService } from './utilisateur/utilisateur.service';

// Logger
import { NGXLogger } from '../../node_modules/ngx-logger';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  
  styleUrls: ['./app.component.scss'],
  providers: [NGXLogger],
  changeDetection: ChangeDetectionStrategy.OnPush
})


export class AppComponent implements OnInit {

  // control de la sidenav
  @ViewChild('mysidenav') public mysidenav: MatSidenav;
  // controle de l accordeon / expand
  @ViewChild('navAccordion') myPanels: MatAccordion;
  cUtilisateur: CurrentUtilisateur;
  userNameConnected$ = '';
  sideNavToggle: Boolean = false;


  constructor(
              private logger: NGXLogger,
              private _sidebarservice: SideBarService,
              public _utilisateurservice: UtilisateurService  
              ) {  }

  ngOnInit() {

    // observable pour fermer la sidebar des le clic sur le btn menu Login dans le header
    this._sidebarservice.statusOfSideNavState.subscribe(forceCloseSideBar => {
      if (forceCloseSideBar.valueOf() == true) {
        this.mysidenav.close()
        this.myPanels.closeAll();
      }
    })

    // Observable pour ouvrir ou fermer la sideBar depuis le btn du header
    this._sidebarservice.statusOfSideNavToggle.subscribe(sideBarButton => {
      this.sideNavToggle = sideBarButton.valueOf();

      if (sideBarButton.valueOf() == true) {

        if (sideBarButton.valueOf() == true && this.mysidenav.opened.valueOf() == true) { 
          this.logger.info("AppComponent Log : Fermeture de SideNav");      
          this.myPanels.closeAll();   
          this.mysidenav.close();
          
        } else {
          this.logger.info("AppComponent Log : Overture de SideNav");  
          this.myPanels.closeAll();       
          this.mysidenav.open();
          
        }

      } else {

        if (sideBarButton.valueOf() == false && this.mysidenav.opened.valueOf() == false) {
          this.logger.info("AppComponent Log : Fermeture de SideNav");   
          this.myPanels.closeAll();      
          this.mysidenav.open();
          
        } else {
          this.logger.info("AppComponent Log : Fermeture de SideNav"); 
          this.myPanels.closeAll();        
          this.mysidenav.close();
        }
      }
      
    })

    // Observable pour recuperer le Current Utilisateur
    this._utilisateurservice.getObjCurrentUtilisateur.subscribe((cu: CurrentUtilisateur) => {
      this.logger.info("AppComponent Log : Recuperation du CurrentUser");
      if (cu == null) {

        this.logger.info("AppComponent Log : Utilisateur non connecte");
        this.userNameConnected$ = null;

      } else {

        this.logger.info("AppComponent Log : Utilisateur connecte");
        this.userNameConnected$ = cu.prenomUtilisateur;
      
    }
    })
    
  }

  /**
   * Fermeture du sideNav
   */
  public closeSideNav(): void {
    this.logger.info("AppComponent Log : Fermeture du sideNav");
    this.myPanels.closeAll();
    this.mysidenav.close();
  }

  /**
   * Activation depuis le backdrop du SideNav
   * -Refermer les accordeons du menu sideBar
   */
  public close() {
    console.log("fermeture du SideNav depuis le backdrop");
    this.myPanels.multi = true;
    this.myPanels.closeAll();
    this.myPanels.multi = false;

    
    console.log("myPanelList: " );
  }


}











