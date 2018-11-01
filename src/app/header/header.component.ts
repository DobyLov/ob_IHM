import { Component, OnInit, Input, Inject, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogConfig } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { AuthService } from '../login/auth.service';
import { UtilisateurService } from '../utilisateur/utilisateur.service';
import { SideBarService } from '../service/sidebar.service';
import { ResponsiveAppMediaService } from '../service/responsiveAppMedia.service';
import { BreakpointObserver } from '../../../node_modules/@angular/cdk/layout';
import { ToasterService } from '../service/toaster.service';
import { ReachServerService } from '../service/reachServer.service';
import { InternalFormsSharedModule } from '@angular/forms/src/directives';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  providers: [NGXLogger]
})

export class HeaderComponent implements OnInit, AfterViewInit {

  // @ViewChild('matMenu') cdr: ChangeDetectorRef;
  @Input() isUserIsConnected$: boolean = true;
  @Input() isSrvIsOnLine$: boolean = true;
  sideNavToggle$: Boolean;

  // Taille du Modal de Confirmation de l utilisateur
  modalWidth: number = 430;
  modalHeight: number = 400; 
  // infos pour definir le modal
  isDeviceIsMobile: boolean;
  isMobileOrientationLandscape: boolean;

  userMailFromTkn: string;
  prenom: string;
  dateBrute: Date = new Date();
  btnLoginState = false;
  btnLogoutState = true;
  btnSideBarState = true;
  btnParametersState = false;
  url: string;
  openAppFromRgpdUrl: boolean = false;

  constructor(  private logger: NGXLogger,
                private location: Location,
                private _authService: AuthService,
                private _toasterService: ToasterService,
                public _utilisateurservice: UtilisateurService,
                public _sidebarservice: SideBarService,
                public _reachServerService: ReachServerService,
                private router: Router,
                public dialog: MatDialog,
                private _responsivappmediaservice: ResponsiveAppMediaService,
                private cd: ChangeDetectorRef,
                public _breakpointobserver: BreakpointObserver
                ) {  

                    //souscription pour verifier si le serveur est en ligne
                    this._reachServerService.isServerOnLine$.subscribe( isSrvIsOnLine => {
                      this.isSrvIsOnLine$ = isSrvIsOnLine.valueOf();
                      // 
                      // this.logger.info("HeaderComponent Log : Constructor Etat du serveur Online : " + this.isSrvIsOnLine$.valueOf())
                    }) 

                      this.url = this.location.path();

                      // si rgpd dans url supprime le token de l utilisateur si il y en a un
                      if(this.searchRgpdMgmtInsideUrl()) {        
                        let userMail = this._authService.getMailFromToken()
                        this._authService.removeGivenTokenFromLS(this._authService.getMailFromToken());
                        this.openAppFromRgpdUrl = true;
                      } else {
                        this.openAppFromRgpdUrl = false;
                      }


                      
                }

  ngOnInit() {  

      
      this.checkIfUrlIsAKnewRoute();
      // Souscription de l observable Boolean du bouton de la navBar
      this._sidebarservice.statusOfSideNavToggle.subscribe(isSideBarOpen => {
        this.sideNavToggle$ = isSideBarOpen.valueOf();
      })

      // souscription a l orbservable isconnected
      this._authService.statusOfIsUserIsLogged.subscribe(isLoggedIn => {
      this.isUserIsConnected$ = isLoggedIn.valueOf();

      if (this.isUserIsConnected$.valueOf() == true) {

        this.btnLoginState = !this.btnLoginState;
        this.btnParametersState = !this.btnParametersState;
        this.btnSideBarState = !this.btnSideBarState;
        this.btnLogoutState = !this.btnLogoutState;

      };

      if (this.isUserIsConnected$.valueOf() == false) {

        this.btnLoginState = false;
        this.btnParametersState = true;
        this.btnSideBarState = true;
        this.btnLogoutState = true;

      }

    })

    this._reachServerService.getStatusofServerOnLine().subscribe(res => {  
      this.logger.info("HeaderComponent log : avant le vrai etat de isSrvIsOnLine : " + this.isSrvIsOnLine$.valueOf());      
      this.isSrvIsOnLine$ = res.valueOf();
      this.logger.info("HeaderComponent log : Le vrai etat de isSrvIsOnLine : " + this.isSrvIsOnLine$.valueOf());
    

      this.cd.detectChanges();
    })

  

    // this.checkIfATokenIsPresentInLS();
    this._responsivappmediaservice.isAMobilePlatform$
    .subscribe(res => { this.isDeviceIsMobile = res.valueOf()})            

    const layoutChanges = this._breakpointobserver.observe(
      '(orientation: portrait)'
    );
    
    layoutChanges.subscribe(result => {
      this.logger.info("Logincomponent log : mode " + result.matches)
    });
    
    this.setModalMobilResolution();

    if ( this.isSrvIsOnLine$.valueOf() === true ) {
      
      this.btnLoginState = true;
      this.logger.info("changement de l état du btn connexion ");
      // this._toasterService.showToaster('Serveur Ok','snackbarInfo',2000);  
    } else {
      this.btnLoginState = false;
      this.logger.info("ReachServer log : Serveur non joignable");
      this.logger.info("Etat du btn connexion : " + this.btnLoginState); 
      // this._toasterService.showToaster('Serveur Injoignable , appelez le support','snackbarWarning',5000);
    }

  }

  ngAfterViewInit() {

    this.logger.info("HeaderComponent Log : Detection du point d entree de L application");
    if ( !this.openAppFromRgpdUrl ) {

      if (this.checkIfUrlIsAKnewRoute() === true ) {
        this.checkIfATokenIsPresentInLS();
      }      
      this.logger.info("HeaderComponent Log : APP ouverture par la racine (entree standard)");   

    } else {
          
      this.logger.info("HeaderComponent Log : APP ouverture par la page Rgpd");
   
    }

  }


  /**
   * detection de la partie RGPD dans l URL de la page 
   * @returns boolean   * 
   */
  public searchRgpdMgmtInsideUrl(): Boolean {

    this.logger.info("HeaderComponent Log : Recherche la String Rgpd dans l Url");
    let isRgpdMgmtInTheString: Boolean = false;
    // brochette de regex
    let regexTkn = new RegExp(`rgpd` + `\\?` + `tkn=`);
    let regexRgpdUrlAltered = new RegExp('rgpdurlaltered');
    let regexRgpdTokenExpired = new RegExp('rgpdtokenexpired');
    let regexRgpdPageNotFounded = new RegExp('rgpdpagenotfound');

    if ( this.url.search(regexTkn) !=-1 || 
          this.url.search('rgpd') !=-1 ||
          this.url.search(regexRgpdUrlAltered) !=-1 || 
          this.url.search(regexRgpdPageNotFounded) !=-1 || 
          this.url.search(regexRgpdTokenExpired) !=-1 ) {
      
      isRgpdMgmtInTheString = true;
      this.logger.info("HeaderComponent Log : Point d entree RGPD car URL taguee avec Rgpd");  

    } else {

      isRgpdMgmtInTheString = false;
      this.logger.info("HeaderComponent Log : Point d entree standard car URL sans Tag Rgpd");

    }

    return isRgpdMgmtInTheString;

  }

  /**
   * Defini les dimensions du modal
   * en fonction du Device detecte
   */
  private setModalMobilResolution() {

    if (this.isDeviceIsMobile == true ) {
      this.logger.info("LoginComponent Log : UI sur Terminal mobile");
      this.modalWidth = 330;
      this.modalHeight = 300;
   } else {
      this.logger.info("LoginComponent Log : Ui sur Desktop ");
   }
  }

  /**
   * Ouverture du Modal ( confirmation utilisateur )
   */
  public openDialog(): void {

    let modalConfFPwd = new MatDialogConfig(); 
    
    // methode #1 de declaration de MatDialogConfig
    modalConfFPwd.id ='2';
    modalConfFPwd.hasBackdrop = true;
    modalConfFPwd.disableClose = true;
    modalConfFPwd.maxWidth = this.modalWidth + 'px';
    modalConfFPwd.maxHeight = this.modalHeight + 'px';
    modalConfFPwd.data = { userMail: this.userMailFromTkn, url: this.url };
    modalConfFPwd.backdropClass = 'modalConfUser';
    
    // methode #1 de declaration de MatDialogConfig
    // modalConfFPwd = {
    //   id: '2',
    //   hasBackdrop: true,
    //   disableClose:  true,
    //   maxWidth: this.modalWidth + 'px',
    //   maxHeight: this.modalHeight + 'px',
    //   data: { userMail: this.userMailFromTkn }
    // };


    this.logger.info("HeaderComponent Log : Ouverture du Modal ( Confirmation utilisateur )");
    let dialogRef = this.dialog.open( ConfimrUserFromTokenModalComponent, modalConfFPwd);

    dialogRef.afterClosed().subscribe(result => {
      this.logger.info("HeaderComponent Log : Fermeture du Modal de Login");
      this.ngOnInit();
    });

  }

  /**
   * Detection d un token dans le LocalStorage
   */
  private checkIfATokenIsPresentInLS():void {

    this.logger.info("HeaderComponent Log : Verification si un Token est deja present dans le Localstorage");
    if (this._authService.isTokenDateIsNotExpired() == false) {

        this.logger.info("HeaderComponent Log : le token dans le LS n est pas bon");
        // this.logOut();
        this.logger.info("HeaderComponent Log : Deconnexion de l application");
        this._authService.changeStatusOfIsLogged(false);
        this._authService.removeGivenTokenFromLS(this.userMailFromTkn);
        // this._authService.messageToaster('Vous êtes déconnecté(e).', 'snackbarInfo', 3000);
        
        if (this.isUserIsConnected$ == false)
          this.userMailFromTkn = this._authService.getMailFromToken();

        setTimeout(() => {
          this.logger.info("HeaderComponent Log : Un Token valide a ete trouve dans le LocalStorage"); 
          this.openDialog()
        })
        
      }

      this.logger.info("HeaderComponent Log : Il n y a pas de token Valide dans  le LocalStorage");
  }

  /**
   * Deconnexion de l application depuis le menuheader
   * 
   */
  public logOut(): void {
    
    this.logger.info("HeaderComponent Log : Deconnexion de l application");
    this._authService.changeStatusOfIsLogged(false);
    this._authService.removeGivenTokenFromLS(this.userMailFromTkn);
    this._authService.messageToaster('Vous êtes déconnecté(e).', 'snackbarInfo', 3000);
    this.router.navigate(['./welcome'])

  }

  /**
   * Ouverture de la page Login
   */
  public openLogin(): void {

    this.logger.info("HeaderComponent Log : Ouverture du Modal de Login");
    this.router.navigate(['./login']);

  }

  /**
   * Toggle du sideNav
   * 
   */
  private sideBarNavToggle(): void {

    this.logger.info("HeaderComponent Log : Toggle du SideNav Menu");
    this._sidebarservice.sideNavToggle();

  }

  /**
   * Forcer le SideNav a se fermer
   */
  public forceCloseSideMenuBar(): void {

    this.logger.info("HeaderComponent Log : Bouton Menu click & force la fermeture du SideBarMenu");
    this._sidebarservice.changeStatusOfSideNavState(true);

  }

  

  /**
   * Cherche si l url est connue par la route
   */
  private checkIfUrlIsAKnewRoute():boolean {

    let urlWithoutSlash: string = this.url.replace('/', '');
    let routeKnewed: boolean = false;

    for ( let j = 0; j < this.router.config.length; j++ ) {

      if (this.router.config[j].path === urlWithoutSlash) {

        this.logger.info("HeaderComponent log : Route: "  + this.router.config[j].path  + " detectee en position: " + j +" du router.");
        routeKnewed = true;
        break;

      } else {
        
        routeKnewed = false;

      }

    }

    if (routeKnewed === false) {
      this.logger.info("header log : Route: "  + urlWithoutSlash  + " non detectee dans le router");
    } 

    return routeKnewed;

  }

  /**
   * Ouvre la page Informations
   */
  public openInformations() {

    this.router.navigate(['./informations', { fragment: 'description' } ]);
  }

  /**
   * Ouvre la page support
   */
  public openSupport() {

    this.router.navigate(['./support'])
  }


    /**
   * Affiche les message a l utilisateur
   * @param message 
   * @param style 
   * @param timer 
   */
  // snackbarWarning, // snackbarInfo, // timer en ms  
  public messageToaster(message, style, timer) {

    this.logger.info("AuthService Log : Message a toaster : " + message);
    this._toasterService.showToaster(message, style, timer);

  } 


}

@Component({
  selector: 'app-confirmUserFromToken',
  templateUrl: '../login/confirmUserFromToken_modal/confirm-user-from-token.modal.html',
  styleUrls: ['../login/confirmUserFromToken_modal/confirm-user-from-token.modal.scss'],
  providers: [ NGXLogger ]
})

export class ConfimrUserFromTokenModalComponent implements OnInit {

  // userMail: string; 
  prenom: string;
  token: string;
  isUserIsLogged$: Observable<boolean>;

  constructor( private logger: NGXLogger,
               private router: Router,
               private _authService: AuthService,
               public dialogRef: MatDialogRef<ConfimrUserFromTokenModalComponent>,
               private _utilisateurService: UtilisateurService,
               @Inject(MAT_DIALOG_DATA) public data) {
                this.token = this._authService.getOBTokenViaMailFromLS(this.data.userMail);
                this.prenom = this._authService.getPrenomFromGivedToken(this.token);

  }

  ngOnInit() {
    this.logger.info("ConfimrUserFromTokenModalComponent Log : Ouverture du Modal ( Confirmation Utilisateur )");
   }

  /**
   * Confirmation que l utilisateur est bien
   * propretaire du token en cours de validite
   */
  public userConfirmed(): void {
    this.logger.info("ConfimrUserFromTokenModalComponent Log : L Utilisateur Confime le token");
    
    this.dialogRef.close();
    this._authService.changeStatusOfIsLogged(true);
    this._authService.messageToaster('Bienvenue ' + this.prenom, 'snackbarInfo', 3000);
    this._utilisateurService.setCurrentUtilisateur(this.data.userMail);
    this.router.navigate(['./']);
    
    setTimeout(() => {
      console.log("le modal renvoie sur la route " + this.data.url);
      this.router.navigate(['./' + this.data.url])
      // this.router.navigate(['./home']);
    }, 2000);
  }

  /**
   * Fermeture du Modal ( Confirmation Utilisateur )
   */
  onNoClick() {
		this.logger.info("ConfimrUserFromTokenModalComponent Log : onNoclick Fermeture du Modal ( Confirmation Utilisateur )");
    // this.router.navigate(['./welcome']);
    this.userNotConfirmed();  
    this.dialogRef.close();
  }

  /**
   * Confirmation de l utilisateur n est pas le 
   * proprietaire du token valide dans le Localstorage
   * @param userMail 
   */
  public userNotConfirmed(): void {
    this.logger.info("ConfimrUserFromTokenModalComponent Log : L Utilisateur ne Confime pas le token");
    this._authService.changeStatusOfIsLogged(false);
    this._authService.removeGivenTokenFromLS(this.data.userMail);
    this.dialogRef.close();
    
    setTimeout(() => {
      this._authService.messageToaster('Connectez vous.', 'snackbarInfo', 3000);
    }, 1000);
    
    setTimeout(() => {

      this.router.navigate(['/login']);
    }, 1000);
  }

}
