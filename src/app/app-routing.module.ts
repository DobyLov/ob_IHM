import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Landing Page
import { WelcomeComponent } from './welcome/welcome.component';

// 404
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';

// Rdv
import { RdvComponent } from './rdv/rdv.component';
import { RdvDetailsComponent } from './rdv-details/rdvdetails.component';
import { RdvAddComponent } from './rdv-add/rdv-add.component';
import { RdvSearchComponent } from './rdv-search/rdv-search.component';

// Client
import { ClientComponent } from './client/client.component';
import { PrestationComponent } from './prestation/prestation.component';

// Utilisateur
import { HomeComponent } from './home/home.component';
import { UtilisateurComponent } from './utilisateur/utilisateur.component';


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


const routes: Routes = [

  { path: '', component: WelcomeComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuardService]},
  { path: 'rdv', component: RdvComponent, canActivate: [AuthGuardService] },
  { path: 'client', component: ClientComponent, canActivate: [AuthGuardService] },
  { path: 'prestation', component: PrestationComponent, canActivate: [AuthGuardService] },
  { path: 'utilisateur', component: UtilisateurComponent, canActivate: [AuthGuardService] },
  { path: 'rdvdetails/:idRdv', component: RdvDetailsComponent, canActivate: [AuthGuardService] },
  { path: 'rdvadd', component: RdvAddComponent, canActivate: [AuthGuardService] },
  { path: 'rdvsearch', component: RdvSearchComponent, canActivate: [AuthGuardService] },
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
