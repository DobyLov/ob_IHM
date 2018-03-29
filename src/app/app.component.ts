import { 
  Component, 
  ViewChild, 
  HostListener, 
  OnInit,
  OnDestroy,
  Inject } from '@angular/core';

import { 
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatMenuTrigger,
  MatSidenav, 
  MatSidenavContainer } from '@angular/material';

// import { MatFormFieldModule } from '@angular/material/form-field';

import { 
  FormControl, 
  Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { LoginService } from './login/login.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})


export class AppComponent implements OnInit {

      // control de la sidenav
      @ViewChild('mysidenav') private mysidenav: MatSidenav;
      // control du menu
      @ViewChild(MatMenuTrigger) private menutrigger: MatMenuTrigger;

      userNameConnected: String = '';

      title = 'app'

      sidenavlinks = [{
        rubrique: 'Rdv',
        liste1: 'Liste des rdv\'s',
        routingListe1: './rdv',
        ajout1: 'Ajouter un Rdv',
        routingAjout1: '[./rdvadd]'
      }]

      // Gestion de la date
      dateBrute: Date = new Date(); // date du jour
      // dateBrute: Date = new Date("11/4/2018");
      // dateFormatee: string;

      isValidBtnLogout: boolean = false;
      userIsConnected: boolean = false;
      toggleTextAccess: String = '';

      btnLoginState = false;
      btnLogoutState = true;

      btnSideBarState = false;
      btnParametersState = true;
      isDeconnectedState: boolean = true;

      ngOnInit() {
        // this.userIsConnected = true;
        this.btnLoginState = false;
        this.btnParametersState = true;
        this.btnSideBarState = true;
        this.btnLogoutState = true;
      }

      ngAfterViewInit() {

      }

      // router pour la navigation manuelle
      constructor(private router: Router,
                  public _loginService: LoginService) { }

      
      // Activation des menus de l applicaiton
      // bouton login simulation de connection
      isConected() {
        this.userIsConnected = !this.userIsConnected;
        // disable btn connexion
        this.btnLoginState = !this.btnLoginState;
        // enable btn param
        this.btnParametersState = !this.btnParametersState;
        // enable btn sidebar
        this.btnSideBarState = !this.btnSideBarState;
        // enable btn logout
        this.btnLogoutState = !this.btnLogoutState;
 
 
      }

      //boutton de logout pour simuler la deconnexion
    logout() {
      let userEmail: string = this._loginService.getEmailFromLocalStorage();
      this._loginService.logout(userEmail);
      
    }

    // une fois connecte envoi direc dur home qui liste les rdvs du jour
    goHome() {
      this.router.navigate(['./home']);
    }

    // a la deconection envoi direct sur Welcome
    goWelcome() {
      this.router.navigate(['./welcome']);
    }

    // ouvri la page d authentification
    openLoginPage() {
      this.router.navigate(['./login']);
    }
}


