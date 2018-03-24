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
import { DialogClockDebutComponent } from './rdv/rdv.component';
import { DialogClockFinComponent } from './rdv/rdv.component';

const routes: Routes = [

  { path: '', component: WelcomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'welcome', component: WelcomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'forgottenpwdmodal', component: ForgottenPwdModalComponent},
  { path: 'rdv', component: RdvComponent },
  { path: 'client', component: ClientComponent },
  { path: 'prestation', component: PrestationComponent },
  { path: 'utilisateur', component: UtilisateurComponent },
  { path: 'rdvlist', component: RdvListComponent },
  { path: 'rdvadd', component: RdvAddComponent },
  { path: 'rdvclockdebut', component: DialogClockDebutComponent },
  { path: 'rdvclockfin', component: DialogClockFinComponent },
  { path: '**', component: PagenotfoundComponent },
  { path: '', redirectTo: '/WelcomeComponent', pathMatch: 'full' }

];

@NgModule({

  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ],

})
export class AppRoutingModule { }
