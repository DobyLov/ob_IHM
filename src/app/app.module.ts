// core
import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

// ResponsiveApp
import { ResponsiveAppMediaService } from './service/responsiveAppMedia.service';

//CDK
import { LayoutModule } from '@angular/cdk/layout';

// FlexLayout
import { FlexLayoutModule } from '@angular/flex-layout'

// Animations
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Forms
import { MatFormFieldModule } from '@angular/material/form-field';

// AutoComplete
import {MatAutocompleteModule} from '@angular/material/autocomplete';

// Routing
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Fragment Routing
import { SmoothScrollDirective } from './directives/smooth-scroll.directive';

// Device Detector
import { DeviceDetectorModule } from 'ngx-device-detector';

// Components OpusBeaute
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { HomeComponent } from './home/home.component';

// Rdv
import { RdvComponent } from './rdv/rdv.component';
import { RdvDetailsComponent } from './rdv-details/rdvdetails.component';
import { RdvAddComponent } from './rdv-add/rdv-add.component';
import { RdvSearchComponent } from './rdv-search/rdv-search.component';
import { RdvService } from './rdv/rdv.service';

// Client
import { ClientComponent } from './client/client.component';
import { PrestationComponent } from './prestation/prestation.component';
import { ClientService } from './client/client.service';

// Utilisateur
import { Utilisateur } from './utilisateur/utilisateur';
import { UtilisateurComponent } from './utilisateur/utilisateur.component';
import { UtilisateurService } from './utilisateur/utilisateur.service';

// Praticien
import { PraticienService } from './praticien/praticien.service';

// Prestation
import { PrestationService } from './prestation/prestation.service';

// divers
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { SupportComponent } from './support/support.component';
import { InformationsComponent } from './informations/informations.component';
import { SuiviActiviteComponent } from './suivi-activite/suivi-activite.component';
import { ErrorHandlerService } from './service/errorHandler.service';

// Autentification
import { Credentials } from './login/credentials';
import { AuthService } from './login/auth.service';
import { AuthGuardService } from './login/authGuard.service';
import { SideBarService } from './service/sidebar.service';
import { LoginComponent } from './login/login.component';
import { LoginModalComponent } from './login/login.component';
import { ForgottenPwdComponent } from './login/forgotten-pwd/forgotten-pwd.component';
import { ForgottenPwdModalComponent } from './login/forgotten-pwd/forgotten-pwd.component';
import { ConfimrUserFromTokenModalComponent } from './header/header.component';

// Services 
// Genre
import { GenreService } from './genre/genre.service';

// LieuRdv
import { LieuRdvService } from './lieuRdv/lieurdv.service';

// Rgpd
import { RgpdComponent } from './rgpd/rgpd.component';
import { RgpdPageNotFoundComponent } from './rgpd/rgpdpagenotfound.component';
import { RgpdTokenExpiredComponent } from './rgpd/rgpdtokenexpired.component';
import { RgpdUrlAlteredComponent } from './rgpd/rgpdUrlAltered.component';
import { AuthRgpdService } from './rgpd/authRgpd.service';
import { AuthGuardRgpdService } from './rgpd/authGuardRgpd.service';

// FontAwsome angular
import { Angular2FontawesomeModule } from 'angular2-fontawesome'

// Autentification
import { AuthRequestOptions } from './login/authRequestOptions';
import { AuthErrorHandlerService } from './login/authErrorHandler.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// Modal / bottom pour passer les infos visuellement a l'utilisateur
import { ToasterService } from './service/toaster.service';
import { SnackBarComponent } from './service/toaster.service';
import { BottomSheetService } from './service/bottomsheet.service';
import { BottomSheetComponent } from './service/bottomsheet.service';

// Verification si serveur est en ligne
import { ReachServerService } from './service/reachServer.service';

// Date
import { DateService } from './service/dateservice.service';

// Import Locale_Fr
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

// the second parameter 'fr' is optional
registerLocaleData(localeFr, 'fr');
import localeFrExtra from '@angular/common/locales/extra/fr';
registerLocaleData( localeFr, 'fr-FR', localeFrExtra );

// Pipe
import { TimeMinuteTwoDigitsPipe } from './pipe/timeMinuteTwoDigits.pipe';
import { TimeHourTwoDigitsPipe } from './pipe/timeHourTwoDigits.pipe';
import { FirstCharUpperPipe } from './pipe/firstCharUpperPipe.pipe';
import { IfIsNullSetToNonRenseignePipe } from './pipe/ifIsNullSetToNonRenseigne.pipe';
import { DateAndTime24Pipe } from './pipe/dateAndTime24.pipe';
import { Time24Pipe } from './pipe/time24.pipe';

// Perfect ScrollBar
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

// TimePicker
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

//logger
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

import { 
  FormsModule, 
  ReactiveFormsModule } from '@angular/forms';

// Materials!!
import {
  MatButtonModule,
  MatButtonToggleModule,
  MatBottomSheetModule,
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
  MatSlideToggleModule,
  MatStepperModule,
  MatSidenavModule,
  MatSnackBarModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule } from '@angular/material';






@NgModule({
  declarations: [
    AppComponent,
    BottomSheetComponent,
    ClientComponent,
    ConfimrUserFromTokenModalComponent,
    DateAndTime24Pipe,
    FirstCharUpperPipe, 
    FooterComponent,
    ForgottenPwdComponent,
    ForgottenPwdModalComponent,
    HeaderComponent,
    HomeComponent,
    IfIsNullSetToNonRenseignePipe,
    InformationsComponent,
    LoginComponent,
    LoginModalComponent,
    PagenotfoundComponent,   
    PrestationComponent,
    RdvAddComponent,
    RdvComponent,
    RdvDetailsComponent,
    RdvSearchComponent,
    RgpdComponent,
    RgpdPageNotFoundComponent, 
    RgpdTokenExpiredComponent,
    RgpdUrlAlteredComponent,
    SnackBarComponent,
    SupportComponent,
    Time24Pipe,
    TimeMinuteTwoDigitsPipe,
    TimeHourTwoDigitsPipe,
    UtilisateurComponent,
    WelcomeComponent,
    SmoothScrollDirective,
    SuiviActiviteComponent
  ],

  imports: [    
    Angular2FontawesomeModule,
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    DeviceDetectorModule.forRoot(),
    FormsModule,
    FlexLayoutModule,
    LayoutModule,
    LoggerModule.forRoot({level: NgxLoggerLevel.INFO}), // TRACE|DEBUG|INFO|LOG|WARN|ERROR|OFF
    MatAutocompleteModule,
    MatBottomSheetModule,
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
    MatSlideToggleModule,
    MatStepperModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTableModule,
    MatTabsModule,  
    NgxMaterialTimepickerModule.forRoot(),
    PerfectScrollbarModule,
    ReactiveFormsModule,
    HttpClientModule   

  ],
  entryComponents: [BottomSheetComponent],
  providers: [{ provide: LOCALE_ID, useValue: 'fr' },
              { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
              { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
              { provide: HTTP_INTERCEPTORS, useClass: AuthRequestOptions, multi : true },
              { provide: AuthErrorHandlerService, useClass: AuthErrorHandlerService },
              { provide: ErrorHandlerService, useClass: ErrorHandlerService },
              { provide: DateService, useClass: DateService },
              { provide: ResponsiveAppMediaService, useClass: ResponsiveAppMediaService },
              { provide: UtilisateurService, useClass: UtilisateurService },
              { provide: GenreService, useClass: GenreService },
              { provide: PraticienService, useClass: PraticienService },
              { provide: ClientService, useClass: ClientService },
              { provide: RdvService, useClass: RdvService },
              { provide: PrestationService, useClass: PrestationService },
              { provide: LieuRdvService, useClass: LieuRdvService },
              { provide: SideBarService, useClass: SideBarService },
              { provide: AuthService, useClass: AuthService },
              { provide: AuthRgpdService, useClass: AuthRgpdService },
              { provide: AuthGuardRgpdService, useClass: AuthGuardRgpdService },
              { provide: AuthGuardService, useClass: AuthGuardService },
              { provide: ToasterService, useClass: ToasterService },
              { provide: BottomSheetService, useClass: BottomSheetService },
              { provide: ReachServerService, useClass: ReachServerService },
              { provide: Credentials, useClass: Credentials },
              { provide: Utilisateur, useClass: Utilisateur },
              { provide: PERFECT_SCROLLBAR_CONFIG, useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG }
              ],

  bootstrap: [AppComponent]
})
export class AppModule { }
