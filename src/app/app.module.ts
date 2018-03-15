import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
// Animations
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Routing
import { AppRoutingModule } from './/app-routing.module';
import { AppComponent } from './app.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { RdvComponent } from './rdv/rdv.component';
import { RdvListComponent } from './rdv/rdv-list/rdv-list.component';
import { RdvAddComponent } from './rdv/rdv-add/rdv-add.component';
import { ClientComponent } from './client/client.component';
import { PrestationComponent } from './prestation/prestation.component';
import { UtilisateurComponent } from './utilisateur/utilisateur.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { DateFirstCharUpperPipe } from './pipe/datefirstcharupper.pipe';
import { LoginComponent } from './login/login.component';

import { ForgottenPwdModalComponent } from './login/login.component';

import { UsersettingsComponent } from './user/usersettings/usersettings.component';
//FontAwsome angular
import { AngularFontAwesomeModule } from 'angular-font-awesome';

//ng-datepicker
// import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
// Forms
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, 
        FormBuilder, 
        FormGroup,
        FormControl, 
        ReactiveFormsModule,
        Validators } from '@angular/forms';

        // import { MatMomentDateModule, } from '@angular/d';

// Materials!!
import { 
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule, 
  MatCheckboxModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule, 
  MatRadioModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatSelectModule,
  MatStepperModule,
  MatSidenavModule,
  MatToolbarModule } from '@angular/material';
  
// Import Locale_Fr
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
// the second parameter 'fr' is optional
registerLocaleData(localeFr, 'fr');
import localeFrExtra from '@angular/common/locales/extra/fr';
registerLocaleData(localeFr, 'fr-FR', localeFrExtra);



@NgModule({
  declarations: [
    AppComponent,
    ClientComponent,
    DateFirstCharUpperPipe,   
    FooterComponent,
    HomeComponent,
    RdvAddComponent,
    RdvComponent,
    RdvListComponent, 
    PagenotfoundComponent,   
    PrestationComponent,
    UtilisateurComponent,
    WelcomeComponent,
    LoginComponent,
    UsersettingsComponent,
    ForgottenPwdModalComponent
  ],
  imports: [
    
    AngularFontAwesomeModule,
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatRadioModule,
    MatSelectModule,
    MatStepperModule,
    MatSidenavModule,
    MatToolbarModule,
    
    FormsModule, ReactiveFormsModule
    // ,    OwlDateTimeModule, OwlNativeDateTimeModule

  ],

  // exports: [DateFirstCharUpperPipe],

  providers: [{ provide: LOCALE_ID, useValue: 'fr' }],

  bootstrap: [AppComponent]
})
export class AppModule { }
