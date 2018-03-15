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
        // this.transformdate(this.dateBrute);
      }

      ngAfterViewInit() {
        // this.openLoginPage();
        this.router.navigate(['./rdv']);
      }

      // router pour la navigation manuelle
      constructor(private router: Router) { }

      
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
        // user name Trick 
        this.userNameConnected = "Audrey";
        this.goHome();   
      }

      //boutton de logout pour simuler la deconnexion
    logout() {
      if (this.userIsConnected === true) {
        this.userIsConnected = !this.userIsConnected;   
        // enable btn logon 
        this.btnLogoutState = !this.btnLogoutState;
        // disable btn param
        this.btnParametersState = !this.btnParametersState;
        // disable sidebar
        this.btnSideBarState = !this.btnSideBarState;
        // enable btn logon
        this.btnLoginState = !this.btnLoginState;
        // retour page welcome
        this.goWelcome();
      } else {
        console.log("Pas de deconnextion possible !!!");

      }
    }

    // une fois connecte envoi direc dur home qui liste les rdvs du jour
    goHome() {
      this.router.navigate(['./home']);
      console.log("Acces au Home");
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


