import { Component, OnInit, Input, Inject, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { AuthService } from '../login/auth.service';
import { UtilisateurService } from '../utilisateur/utilisateur.service';
import { SideBarService } from '../service/sidebar.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  providers: [NGXLogger]
})

export class HeaderComponent implements OnInit, AfterViewInit {

  // @ViewChild('matMenu') cdr: ChangeDetectorRef;
  @Input() isUserIsConnected$: boolean;
  sideNavToggle$: Boolean;

  userMail: string;
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
                public _utilisateurservice: UtilisateurService,
                public _sidebarservice: SideBarService,
                private router: Router,
                public dialog: MatDialog,
                private cd: ChangeDetectorRef) { 

                      this.url = this.location.path();
                    }

  ngOnInit() {

    // rsouscription de l observable Boolean du bouton de la navBar
    this._sidebarservice.statusOfSideNavToggle.subscribe(isSideBarOpen => {
      this.sideNavToggle$ = isSideBarOpen.valueOf();
    })

      // souscription a l orbservable isconnected
      this._authService.statusOfIsUserIsLogged.subscribe(isLoggedIn => {
      this.isUserIsConnected$ = isLoggedIn.valueOf();

      // Utilise le changeDetector
      this.cd.detectChanges();

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

  }

  ngAfterViewInit() {

    this.logger.info("HeaderComponent Log : Detection du point d entree de L application");
    if (!this.searchRgpdMgmtInsideUrl()) {

      this.checkIfATokenIsPresentInLS();
      this.openAppFromRgpdUrl = false;
      this.logger.info("HeaderComponent Log : APP ouverture par la racine (entree standard)");      
    
    } else {

      this.openAppFromRgpdUrl = true;
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
   * Ouverture du Modal ( confirmation utilisateur )
   */
  openDialog(): void {

    this.logger.info("HeaderComponent Log : Ouverture du Modal ( Confirmation utilisateur )");
    let dialogRef = this.dialog.open( ConfimrUserFromTokenModalComponent, {
      width: '450px',
      data: { userMail: this.userMail }
    });

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
    if (this._authService.isTokenDateIsExpired() == false) {

        this.logOut();
        
        if (this.isUserIsConnected$.valueOf() == false)
          this.userMail = this._authService.getMailFromToken();

        setTimeout(() => {
          this.logger.info("HeaderComponent Log : Un Token valide a ete trouve dans le LocalStorage"); 
          this.openDialog()
        })
        
      }

      this.logger.info("HeaderComponent Log : Il n y a pas de token Valide dans  le LocalStorage");
  }

  /**
   * Deconnexion de l application
   * 
   */
  logOut(): void {

    this.logger.info("HeaderComponent Log : Deconnexion de l application");
    this._authService.changeStatusOfIsLogged(false);
    this._authService.removeGivenTokenFromLS(this.userMail);
    this.router.navigate(['./welcome'])

  }

  /**
   * Ouverture de la page Login
   */
  public openLogin(): void {

    this.logger.info("HeaderComponent Log : Ouverture du Modal de Login");
    this.router.navigate(['/login']);

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

}

@Component({
  selector: 'app-confirmUserFromToken',
  templateUrl: '../login/confirmUserFromToken_modal/confirm-user-from-token.modal.html',
  styleUrls: ['../login/confirmUserFromToken_modal/confirm-user-from-token.modal.scss'],
  providers: [ NGXLogger ]
})

export class ConfimrUserFromTokenModalComponent implements OnInit {

  userMail: string = "ricodoby@hotmail.com";
  prenom: string;
  token: string;
  isUserIsLogged$: Observable<boolean>;

  constructor( private logger: NGXLogger,
               private router: Router,
               private _authService: AuthService,
               public dialogRef: MatDialogRef<ConfimrUserFromTokenModalComponent>,
               private _utilisateurService: UtilisateurService,
               @Inject(MAT_DIALOG_DATA) public data: any) {

      this.token = this._authService.getOBTokenViaMailFromLS(this.userMail);
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
    this._authService.changeStatusOfIsLogged(true);
    this.dialogRef.close();
    this._authService.messageToaster('Bienvenue ' + this.prenom, 'snackbarInfo', 3000);
    this._utilisateurService.setCurrentUtilisateur(this.userMail);
    
    setTimeout(() => {
      this.router.navigate(['./home']);
    }, 2000);
  }

  /**
   * Fermeture du Modal ( Confirmation Utilisateur )
   */
  private onNoClick() {
		this.logger.info("ConfimrUserFromTokenModalComponent Log : Fermeture du Modal ( Confirmeation Utilisateur )");
    this.router.navigate(['./welcome']);
    this.dialogRef.close();
  }

  /**
   * Confirmation de l utilisateur n est pas le 
   * proprietaire du token valide dans le Localstorage
   * @param userMail 
   */
  public userNotConfirmed(userMail): void {
    this.logger.info("ConfimrUserFromTokenModalComponent Log : L Utilisateur ne Confime pas le token");
    this._authService.changeStatusOfIsLogged(false);
    this._authService.removeGivenTokenFromLS(this.userMail);
    this.dialogRef.close();
    
    setTimeout(() => {
      this._authService.messageToaster('Merci de vous connecter avec vos crédentiels', 'snackbarInfo', 3000);
    }, 1000);
    
    setTimeout(() => {

      this.router.navigate(['/login']);
    }, 1000);
  }
}
