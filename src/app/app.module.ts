import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
// Animations
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// Routing
import { AppRoutingModule } from './/app-routing.module';
import { AppComponent } from './app.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { RdvComponent } from './rdv/rdv.component';
import { RdvListComponent } from './rdv/rdv-list/rdv-list.component';
import { RdvAddComponent } from './rdv/rdv-add/rdv-add.component';
import { ClientComponent } from './client/client.component';
import { PrestationComponent } from './prestation/prestation.component';
import { Utilisateur } from './utilisateur/utilisateur';
import { UtilisateurService } from './utilisateur/utilisateur.service';
import { UtilisateurComponent } from './utilisateur/utilisateur.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';

// import { UsersettingsComponent } from './user/usersettings/usersettings.component';
import { Credentials } from './login/credentials';
import { AuthService } from './login/auth.service';
import { RequestOptions } from '@angular/http';
import { AuthGardService } from './login/authGard.service';
import { LoginComponent } from './login/login.component';
import { LoginModalComponent } from './login/login.component';
import { ForgottenPwdComponent } from './login/forgotten-pwd/forgotten-pwd.component';
import { ForgottenPwdModalComponent } from './login/forgotten-pwd/forgotten-pwd.component';
import { ConfimrUserFromTokenModalComponent } from './header/header.component';
// FontAwsome angular
import { AngularFontAwesomeModule } from 'angular-font-awesome';
// authentification
import { AuthRequestOptions } from './login/authRequestOptions';
import { AuthErrorHandlerService } from './login/authErrorHandler.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
// Forms
import { MatFormFieldModule } from '@angular/material/form-field';
import { ToasterService } from './service/toaster.service';
import { SnackBarComponent } from './service/toaster.service';

// Import Locale_Fr
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';

// the second parameter 'fr' is optional
registerLocaleData(localeFr, 'fr');
import localeFrExtra from '@angular/common/locales/extra/fr';
registerLocaleData( localeFr, 'fr-FR', localeFrExtra );
// Pipe
import { TimeMinuteTwoDigitsPipe } from './pipe/timeMinuteTwoDigits.pipe';
import { TimeHourTwoDigitsPipe } from './pipe/timeHourTwoDigits.pipe';
import { DateFirstCharUpperPipe } from './pipe/datefirstcharupper.pipe';

import { FormsModule, 
        FormBuilder, 
        FormGroup,
        FormControl, 
        ReactiveFormsModule,
        Validators } from '@angular/forms';

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
  MatSnackBarModule,
  MatTabsModule,
  MatToolbarModule } from '@angular/material';



@NgModule({
  declarations: [
    AppComponent,
    ClientComponent,
    ConfimrUserFromTokenModalComponent,
    DateFirstCharUpperPipe, 
    FooterComponent,
    ForgottenPwdComponent,
    ForgottenPwdModalComponent,
    HeaderComponent,
    HomeComponent,
    LoginComponent,
    LoginModalComponent,
    PagenotfoundComponent,   
    PrestationComponent,
    RdvAddComponent,
    RdvComponent,
    RdvListComponent, 
    SnackBarComponent,
    TimeMinuteTwoDigitsPipe,
    TimeHourTwoDigitsPipe,
    UtilisateurComponent,
    WelcomeComponent
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
    MatSnackBarModule,
    MatToolbarModule,
    MatTabsModule,  
    FormsModule, 
    ReactiveFormsModule,
    HttpClientModule   

  ],

  providers: [{ provide: LOCALE_ID, useValue: 'fr' },
              { provide: HTTP_INTERCEPTORS, useClass: AuthRequestOptions, multi : true },
              { provide: AuthErrorHandlerService, useClass: AuthErrorHandlerService },
              { provide: UtilisateurService, useClass: UtilisateurService},
              { provide: AuthService, useClass: AuthService},
              { provide: AuthGardService, useClass: AuthGardService},
              { provide: ToasterService, useClass: ToasterService },
              { provide: Credentials, useClass: Credentials},
              { provide: Utilisateur, useClass: Utilisateur}
              ],

  bootstrap: [AppComponent]
})
export class AppModule { }
