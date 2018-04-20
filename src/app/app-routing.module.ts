import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
import { HomeComponent } from './home/home.component';
import { RdvComponent } from './rdv/rdv.component';
import { ClientComponent } from './client/client.component';
import { PrestationComponent } from './prestation/prestation.component';
import { UtilisateurComponent } from './utilisateur/utilisateur.component';
import { RdvListComponent } from './rdv/rdv-list/rdv-list.component';
import { RdvAddComponent } from './rdv/rdv-add/rdv-add.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { LoginModalComponent } from './login/login.component';
import { LoginComponent } from './login/login.component';
import { ForgottenPwdComponent } from './login/forgotten-pwd/forgotten-pwd.component';
import { ForgottenPwdModalComponent } from './login/forgotten-pwd/forgotten-pwd.component';
import { AuthGardService } from './login/authGard.service';
import { SnackBarComponent } from './service/toaster.service';


const routes: Routes = [

  { path: '', component: WelcomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'rdv', component: RdvComponent, canActivate: [AuthGardService] },
  { path: 'client', component: ClientComponent, canActivate: [AuthGardService] },
  { path: 'prestation', component: PrestationComponent, canActivate: [AuthGardService] },
  { path: 'utilisateur', component: UtilisateurComponent, canActivate: [AuthGardService] },
  { path: 'rdvlist', component: RdvListComponent, canActivate: [AuthGardService] },
  { path: 'rdvadd', component: RdvAddComponent, canActivate: [AuthGardService] },
  { path: '', redirectTo: '/WelcomeComponent', pathMatch: 'full' },
  { path: 'welcome', component: WelcomeComponent },
  { path: 'snackbar', component: SnackBarComponent},
  { path: 'login', component: LoginComponent },
  { path: 'loginmodal', component: LoginModalComponent },
  { path: 'forgottenpwd', component: ForgottenPwdComponent },
  { path: 'forgottenpwdmodal', component: ForgottenPwdModalComponent},

  { path: '**', component: PagenotfoundComponent }
 
];

@NgModule({

  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ],

})

export class AppRoutingModule { }
