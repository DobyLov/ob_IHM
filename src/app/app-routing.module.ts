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
import { LoginComponent } from './login/login.component';
import { ForgottenPwdModalComponent } from './login/login.component';
import { AuthGardService } from './login/authGard.service';

const routes: Routes = [

  { path: '', component: WelcomeComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGardService] },
  { path: 'rdv', component: RdvComponent, canActivate: [AuthGardService] },
  { path: 'client', component: ClientComponent, canActivate: [AuthGardService] },
  { path: 'prestation', component: PrestationComponent, canActivate: [AuthGardService] },
  { path: 'utilisateur', component: UtilisateurComponent, canActivate: [AuthGardService] },
  { path: 'rdvlist', component: RdvListComponent, canActivate: [AuthGardService] },
  { path: 'rdvadd', component: RdvAddComponent, canActivate: [AuthGardService] },
  { path: '', redirectTo: '/WelcomeComponent', pathMatch: 'full' },
  { path: 'welcome', component: WelcomeComponent },
  { path: 'forgottenpwdmodal', component: ForgottenPwdModalComponent},
  { path: 'login', component: LoginComponent },
  { path: '**', component: PagenotfoundComponent }
 
];

@NgModule({

  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ],

})

export class AppRoutingModule { }
