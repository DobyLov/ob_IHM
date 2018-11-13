import { Component, ViewChild, OnInit, ChangeDetectionStrategy, Output, AfterViewInit } from '@angular/core';

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


export class AppComponent implements OnInit, AfterViewInit {

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
        this.myPanels.multi = true;   
        this.myPanels.closeAll();
        this.myPanels.multi = false;
      }
    })

    // Observable pour ouvrir ou fermer la sideBar depuis le btn du header
    this._sidebarservice.statusOfSideNavToggle.subscribe(sideBarButton => {
      this.sideNavToggle = sideBarButton.valueOf();

      if (sideBarButton.valueOf() == true) {

        if (sideBarButton.valueOf() == true && this.mysidenav.opened.valueOf() == true) { 
          this.logger.info("AppComponent Log : Fermeture de SideNav");      
          this.myPanels.multi = true;   
          this.myPanels.closeAll();
          this.myPanels.multi = false;   
          this.mysidenav.close();
          
        } else {
          this.logger.info("AppComponent Log : Overture de SideNav");  
     
          this.mysidenav.open();
          this.myPanels.multi = true;   
          this.myPanels.closeAll();
          this.myPanels.multi = false; 
          
        }

      } else {

        if (sideBarButton.valueOf() == false && this.mysidenav.opened.valueOf() == false) {
          this.logger.info("AppComponent Log : Fermeture de SideNav");
      
          this.mysidenav.open();
          this.myPanels.multi = true;   
          this.myPanels.closeAll();
          this.myPanels.multi = false;
          
        } else {
          this.logger.info("AppComponent Log : Fermeture de SideNav"); 
          this.myPanels.multi = true;   
          this.myPanels.closeAll();
          this.myPanels.multi = false;       
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

  ngAfterViewInit(): void {
    //Called after every check of the component's view. Applies to components only.
    //Add 'implements AfterViewChecked' to the class.

    this.myPanels.multi = true;   
    this.myPanels.closeAll();
    this.myPanels.multi = false; 
    
  }

  /**
   * Fermeture du sideNav
   */
  public closeSideNav(): void {
    this.logger.info("AppComponent Log : Fermeture du sideNav");
    this.myPanels.multi = true;
    this.myPanels.closeAll();
    this.myPanels.multi = false;
    this.mysidenav.close();
  }

  /**
   * Activation depuis le backdrop du SideNav
   * -Refermer les accordeons du menu sideBar
   */
  public close() {
    
    this.logger.info("AppComponent log : Fermeture du SideNav depuis le backdrop");
    this.myPanels.multi = true;
    this.logger.info("AppComponent log : Collapse du MenuList dans la sideNav");
    this.myPanels.closeAll();
    this.myPanels.multi = false;
  }


}











