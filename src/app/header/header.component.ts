import { Component, OnInit, Input, Inject, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../login/auth.service';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { Utilisateur } from '../utilisateur/utilisateur';
import { UtilisateurService } from '../utilisateur/utilisateur.service';
import { BehaviorSubject } from 'rxjs';
import { SideBarService } from '../service/sidebar.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit, AfterViewInit {

  // @ViewChild('matMenu') cdr: ChangeDetectorRef;
  @Input() isUserIsConnected$: boolean;
  sideNavToggle: Boolean;

  userMail: string;
  prenom: string;
  dateBrute: Date = new Date();
  btnLoginState = false;
  btnLogoutState = true;
  btnSideBarState = true;
  btnParametersState = true;

  constructor(private _authService: AuthService,
    public _utilisateurservice: UtilisateurService,
    public _sidebarservice: SideBarService,
    private router: Router,
    public dialog: MatDialog,
    private cd: ChangeDetectorRef) {


  }

  ngOnInit() {

    // rsouscription de l observable Boolean du bouton de la navBar
    this._sidebarservice.statusOfSideNavToggle.subscribe(isSideBarOpen => {
      this.sideNavToggle = isSideBarOpen.valueOf();
    })

    // souscription a l orbservable isconnected
    this._authService.statusOfIsUserIsLogged.subscribe(isLoggedIn => {
      // console.log("header Constructor :  connecte : " + isLoggedIn.valueOf())
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
    this.checkIfATokenIsPresentInLS();
  }

  openDialog(): void {

    let dialogRef = this.dialog.open(ConfimrUserFromTokenModalComponent, {
      width: '450px',
      data: { userMail: this.userMail }
    });
    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog confirmation was closed');
      this.ngOnInit();
    });
  }

  checkIfATokenIsPresentInLS() {
    if (this._authService.isTokenDateIsExpired() == false) {
      this.router.navigate(['./welcome']);
      // console.log("HeaderComponent : checkIfTokenIsPresent val de isUserIsconncted : " + this.isUserIsConnected$.valueOf())
      if (this.isUserIsConnected$.valueOf() == false)
        this.userMail = this._authService.getMailFromToken();
      setTimeout(() => {
        this.openDialog()
      })
    }
  }
  // mettre le parametre userMail recupere du service Utilisateur pour CurrenUtilisateur
  logOut() {
    this._authService.changeStatusOfIsLogged(false);
    // this._sidebarservice.changeStatusOfSideNavToggle(true);
    this._authService.removeGivenTokenFromLS(this.userMail);
    this.router.navigate(['./welcome'])

  }

  openLogin() {
    this.router.navigate(['/login']);
  }

  sideBarNavToggle() {

    this._sidebarservice.sideNavToggle();
  }

  forceCloseSideMenuBar() {
    console.log("headerComponent : forceCloseSideMenuBar : ");
    this._sidebarservice.changeStatusOfSideNavState(true);
  }

}

@Component({
  selector: 'app-confirmUserFromToken',
  templateUrl: '../login/confirmUserFromToken_modal/confirm-user-from-token.modal.html',
  styleUrls: ['../login/confirmUserFromToken_modal/confirm-user-from-token.modal.scss']
})

export class ConfimrUserFromTokenModalComponent implements OnInit {

  userMail: string = "ricodoby@hotmail.com";
  prenom: string;
  token: string;
  isUserIsLogged$: Observable<boolean>;

  constructor(private router: Router,
    public _authService: AuthService,
    public dialogRef: MatDialogRef<ConfimrUserFromTokenModalComponent>,
    public _utilisateurService: UtilisateurService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    // console.log("ConfimrUserFromTokenModal : constructor : userMail : " + this.userMail);
    this.token = this._authService.getOBTokenViaMailFromLS(this.userMail);
    // console.log("ConfimrUserFromTokenModal : constructor : token : " + this.token);
    this.prenom = this._authService.getPrenomFromGivedToken(this.token);
    // console.log("ConfimrUserFromTokenModal : constructor : prenom : " + this.prenom);
  }

  ngOnInit() { }

  userConfirmed() {
    this._authService.changeStatusOfIsLogged(true);
    this.dialogRef.close();
    this._authService.messageToaster('Bienvenue ' + this.prenom, 'snackbarInfo', 3000);
    this._utilisateurService.setCurrentUtilisateur(this.userMail);
    setTimeout(() => {
      this.router.navigate(['./home']);
    }, 2000);
  }

  onNoClick() {
    // console.log("Headercomponent: onnoclick : ");				
    this.router.navigate(['./welcome']);
    this.dialogRef.close();
  }

  userNotConfirmed(userMail) {
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
