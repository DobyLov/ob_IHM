import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Landing Page
import { WelcomeComponent } from './welcome/welcome.component';

// 404
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';

// Rdv
import { RdvComponent } from './rdv/rdv.component';
import { RdvDetailsComponent, ConfirmRdvDetailsModalcomponent } from './rdv-details/rdv-details.component';
import { RdvAddComponent } from './rdv-add/rdv-add.component';
import { RdvSearchComponent } from './rdv-search/rdv-search.component';

// Client
import { ClientDetailsComponent } from './client-details/client-details.component';
import { ClientSearchComponent } from './client-search/client-search.component';
import { ClientAddComponent } from './client-add/client-add.component';

// Utilisateur
import { HomeComponent } from './home/home.component';


// Login & co
import { ForgottenPwdComponent } from './login/forgotten-pwd/forgotten-pwd.component';
import { ForgottenPwdModalComponent } from './login/forgotten-pwd/forgotten-pwd.component';
import { AuthGuardService } from './login/authGuard.service';
import { SnackBarComponent } from './service/toaster.service';

//Rgpd
import { RgpdComponent } from './rgpd/rgpd.component'
import { AuthGuardRgpdService } from './rgpd/authGuardRgpd.service';
import { RgpdPageNotFoundComponent } from './rgpd/rgpdpagenotfound.component';
import { RgpdTokenExpiredComponent } from './rgpd/rgpdtokenexpired.component';
import { RgpdUrlAlteredComponent } from './rgpd/rgpdUrlAltered.component';

// menu Login
import { LoginModalComponent } from './login/login.component';
import { LoginComponent } from './login/login.component';
import { ConfimrUserFromTokenModalComponent } from './header/header.component';
import { SupportComponent } from './support/support.component';
import { InformationsComponent } from './informations/informations.component';
import { SuiviActiviteComponent } from './suivi-activite/suivi-activite.component';
import { UtilisateurAddComponent } from './utilisateur-add/utilisateur-add.component';
import { UtilisateurSearchComponent } from './utilisateur-search/utilisateur-search.component';
import { UtilisateurDetailsComponent } from './utilisateur-details/utilisateur-details.component';
import { PraticienAddComponent } from './praticien-add/praticien-add.component';
import { PraticienSearchComponent } from './praticien-search/praticien-search.component';
import { PraticienDetailsComponent } from './praticien-details/praticien-details.component';
import { PrestationAddComponent } from './prestation-add/prestation-add.component';
import { PrestationSearchComponent } from './prestation-search/prestation-search.component';
import { PrestationDetailsComponent } from './prestation-details/prestation-details.component';
import { LieurdvAddComponent } from './lieurdv-add/lieurdv-add.component';
import { LieurdvSearchComponent } from './lieurdv-search/lieurdv-search.component';
import { LieurdvDetailsComponent } from './lieurdv-details/lieurdv-details.component';
import { GenreAddComponent } from './genre-add/genre-add.component';
import { GenreSearchComponent } from './genre-search/genre-search.component';
import { GenreDetailsComponent } from './genre-details/genre-details.component';



const routes: Routes = [

  { path: '', component: WelcomeComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuardService]},
  { path: 'rdv', component: RdvComponent, canActivate: [AuthGuardService] },
  { path: 'clientadd', component: ClientAddComponent, canActivate: [AuthGuardService] },
  { path: 'clientdetails/:idClient', component: ClientDetailsComponent, canActivate: [AuthGuardService] },
  { path: 'clientsearch', component: ClientSearchComponent, canActivate: [AuthGuardService] },
  { path: 'utilisateuradd', component: UtilisateurAddComponent, canActivate: [AuthGuardService] },
  { path: 'utilisateursearch', component: UtilisateurSearchComponent, canActivate: [AuthGuardService] },
  { path: 'utilisateurdetails/:idUtilisateur', component: UtilisateurDetailsComponent, canActivate: [AuthGuardService] },
  { path: 'praticienadd', component: PraticienAddComponent, canActivate: [AuthGuardService] },
  { path: 'praticiensearch', component: PraticienSearchComponent, canActivate: [AuthGuardService] },
  { path: 'praticiendetails/:idpraticien', component: PraticienDetailsComponent, canActivate: [AuthGuardService] },
  { path: 'prestationadd', component: PrestationAddComponent, canActivate: [AuthGuardService] },
  { path: 'prestationsearch', component: PrestationSearchComponent, canActivate: [AuthGuardService] },
  { path: 'prestationdetails/:idPrestation', component: PrestationDetailsComponent, canActivate: [AuthGuardService] },
  { path: 'lieurdadd', component: LieurdvAddComponent, canActivate: [AuthGuardService] },
  { path: 'lieurdsearch', component: LieurdvSearchComponent, canActivate: [AuthGuardService] },
  { path: 'lieurddeatils:/idLieurdv', component: LieurdvDetailsComponent, canActivate: [AuthGuardService] },
  { path: 'rdvadd', component: RdvAddComponent, canActivate: [AuthGuardService] },
  { path: 'rdvsearch', component: RdvSearchComponent, canActivate: [AuthGuardService] },
  { path: 'rdvdetails/:idRdv', component: RdvDetailsComponent, canActivate: [AuthGuardService] },
  { path: 'confirmrdvdetailsmodal', component: ConfirmRdvDetailsModalcomponent, canActivate: [AuthGuardService] },
  { path: 'genreadd', component: GenreAddComponent, canActivate: [AuthGuardService] },
  { path: 'genresearch', component: GenreSearchComponent, canActivate: [AuthGuardService] },
  { path: 'genredetails/:idGenre', component: GenreDetailsComponent, canActivate: [AuthGuardService] },
  { path: 'confirmusermodal', component: ConfimrUserFromTokenModalComponent, canActivate: [AuthGuardService] },
  { path: 'suivi-activite', component: SuiviActiviteComponent, canActivate: [AuthGuardService] },
  { path: '', redirectTo: '/WelcomeComponent', pathMatch: 'full' },
  { path: 'welcome', component: WelcomeComponent },
  { path: 'snackbar', component: SnackBarComponent},
  { path: 'login', component: LoginComponent },
  { path: 'loginmodal', component: LoginModalComponent },
  { path: 'forgottenpwd', component: ForgottenPwdComponent },
  { path: 'forgottenpwdmodal', component: ForgottenPwdModalComponent },
  { path: 'support', component: SupportComponent },
  { path: 'informations', component: InformationsComponent },
  { path: 'rgpd', component: RgpdComponent, canActivate: [AuthGuardRgpdService] },
  { path: 'rgpdpagenotfound', component: RgpdPageNotFoundComponent },
  { path: 'rgpdtokenexpired', component: RgpdTokenExpiredComponent},
  { path: 'rgpdurlaltered', component: RgpdUrlAlteredComponent },
  { path: '**', component: PagenotfoundComponent }
 
];

@NgModule({

  imports: [ RouterModule.forRoot(routes, {anchorScrolling: 'enabled'}) ],
  exports: [ RouterModule ],

})

export class AppRoutingModule { }
