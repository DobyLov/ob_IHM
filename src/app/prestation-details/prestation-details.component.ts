import { Component, OnInit, ChangeDetectorRef, Output, Inject, EventEmitter } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../login/auth.service';
import { RdvService } from '../rdv/rdv.service';
import { UtilisateurService } from '../utilisateur/utilisateur.service';
import { HistoryRoutingService } from '../service/historyRouting.service';
import { CurrentUtilisateur } from '../login/currentUtilisateur';
import { Subscription } from 'rxjs';
import { Utilisateur } from '../utilisateur/utilisateur';
import {
  MatDialog, MatDialogConfig,
  MatDialogRef, MAT_DIALOG_DATA, MatOptionSelectionChange,
} from '@angular/material';
import { ConfirmRdvDetailsModalcomponent } from '../rdv-details/rdv-details.component';
import { Activite } from '../activite/activite';
import { Genre } from '../genre/genre';
import { Prestation } from '../prestation/prestation';
import { dureeSeance, nbSeance } from '../prestation-add/prestation-add.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpResponse } from '@angular/common/http';
import { ToasterService } from '../service/toaster.service';
import { ActiviteService } from '../activite/activite.service';
import { GenreService } from '../genre/genre.service';
import { PrestationService } from '../prestation/prestation.service';

@Component({
  selector: 'app-prestation-details',
  templateUrl: './prestation-details.component.html',
  styleUrls: ['./prestation-details.component.scss']
})
export class PrestationDetailsComponent implements OnInit {

  // RouterHistory
  previousRoute: string;
  // Utilisateur
  @Output() isUserIsConnected$: boolean = false;
  currentUtilisateur$: CurrentUtilisateur;
  cUtilisateur = new Subscription();
  utilisateur: Utilisateur = new Utilisateur();
  // Utilisateur connecte
  emailUserConnected: string;

  // activite
  activitePrestation: Activite;
  activite: Activite = new Activite();
  activiteList: Activite[];
  // Nouvelle activite
  idOfNewActivite: number;
  // genre
  genrePrestation: Genre;
  genre: Genre = new Genre();
  genreList: Genre[];

  // prestation
  prestation: Prestation = new Prestation();

  // Slider
  ts_Color: string = 'primary';
  slider_Forfait: boolean = false;

  // Seances
  // duree Seance
  dureeSeanceList: dureeSeance[] = [
    { value: 15, viewValue: '15' },
    { value: 30, viewValue: '30' },
    { value: 45, viewValue: '45' },
    { value: 60, viewValue: '60' },
    { value: 75, viewValue: '75' },
    { value: 90, viewValue: '90' },
    { value: 105, viewValue: '105' },
    { value: 120, viewValue: '120' }
  ];

  // Nombre Seances
  nbSeanceList: nbSeance[] = [
    { value: 1, viewValue: '1' },
    { value: 2, viewValue: '2' },
    { value: 3, viewValue: '3' },
    { value: 4, viewValue: '4' },
    { value: 5, viewValue: '5' },
    { value: 6, viewValue: '6' },
    { value: 7, viewValue: '7' },
    { value: 8, viewValue: '8' },
    { value: 9, viewValue: '9' },
    { value: 10, viewValue: '10' },
    { value: 11, viewValue: '11' },
    { value: 12, viewValue: '12' }
  ];

  update_button_state: boolean = true;

  // FormGroup
  prestationFg: FormGroup;

  // Route Id
  idPrestationFromRoute: number;
  // parametre route observable
  idPrestationFromRouteObservable: any;
  // isRdvIsCancelled: boolean = false;

  // Confirm Suppression
  userConfimRdvSuppression: boolean = false;


  constructor(private logger: NGXLogger,
    public dialog: MatDialog,
    private _router: Router,
    private _route: ActivatedRoute,
    private _activiteService: ActiviteService,
    private _genreService: GenreService,
    private _prestationService: PrestationService,
    private _authService: AuthService,
    private _rdvService: RdvService,
    private _utilisateurService: UtilisateurService,
    private _toasterService: ToasterService,
    private _cd: ChangeDetectorRef,
    private _historyRouting: HistoryRoutingService) {
    
    this.emailUserConnected = this._authService.getMailFromToken();
    this._utilisateurService.setCurrentUtilisateur(this.emailUserConnected);

    this.idPrestationFromRouteObservable = this._route.params.subscribe(
      res => { this.idPrestationFromRoute = res['idPrestation'] }
    );
    
    this.getPrestationById(this.idPrestationFromRoute);
  }

  ngOnInit() {


    this.getActiviteList();
    this.getGenreList();


    this.prestationFg = new FormGroup({
      prestationSoinFc: new FormControl('', [Validators.pattern('^[a-zA-Z-éèçà ]+$'), Validators.required, Validators.maxLength(50)]),
      prestationActiviteFc: new FormControl({ value: '' }),
      prestationNouvActFc: new FormControl('', [Validators.pattern('^[a-zA-Z-éèàç]+$'), Validators.maxLength(50)]),
      prestationNbSeanceFc: new FormControl([Validators.required]),
      prestationDureeSeanceFc: new FormControl({ value: '', disabled: false }, [Validators.required]),
      prestationPrixFc: new FormControl('', [Validators.pattern('^[0-9.,]+$'), Validators.required, Validators.maxLength(4)]),
      prestationGenreFc: new FormControl({ value: '' }, [Validators.required]),
      prestationForfaitFc: new FormControl(),
      prestationDescriptionFc: new FormControl('', [Validators.pattern('^[a-zA-Z-éèàç ]+$'), Validators.maxLength(500)])


    })

    this.previousRoute = this._historyRouting.getPreviousUrl();
    this.getCurrentUtilisateur();

  }

  // =====================================================================================
  // Recuperation des donnees depuis la BDD
  // =====================================================================================
  /**
  * Recupere l utilisateur loggé
  */
  private async getCurrentUtilisateur() {

    this.logger.info("RdvDetailComponent log : Recuperation du currentuser ");
    this.cUtilisateur = await this._utilisateurService.getObjCurrentUtilisateur
      .subscribe((cUtilisateur: CurrentUtilisateur) => { this.currentUtilisateur$ = cUtilisateur },
        () => {
          this.logger.error("RdvDetailComponent log : La requete n a pas fonctionnée");
        });
  }

  /**
 * Recupere la liste des Activites
 */
  private getActiviteList() {
    this.logger.info("PrestationAddComponent log : Recuperation de la liste des Activites.");
    this._activiteService.getActiviteList().subscribe(
      ((activiteList: Activite[]) => {
        this.activiteList = activiteList;
      }
      )
    )
  }

  /**
   * Recupere la liste des Genres
   */
  private getGenreList() {
    this.logger.info("PrestationAddComponent log : Recuperation de la liste des Genres.");
    this._genreService.getGenreList().subscribe(
      ((genreList: Genre[]) => {
        this.genreList = genreList;
      }
      )
    )
  }

    /**
   * Ouvrir le popup de confirmation de suppression de Rdv 
   */
  public erase() {

    this.openDialog();

  }

  /**
 * Ne pas modifier le Rdv en retournant a la page Home
 */
  public annulerLesModificationsRdv() {
    this.logger.info("RdvDetailsComponent log : Retour à la page home.")
    this._router.navigate(['./home']);
  }

  /**
   * aller à la page hom
   */
  private goHomePage() {

    this._router.navigate(['./home']);
  }

  /**
     * Ouvrir le Modal de Login
     */
  openDialog(): void {

    const modalConf: MatDialogConfig = {
      hasBackdrop: true,
      disableClose: true,
      data: {
        userConfimRdvSuppression: this.userConfimRdvSuppression,
        idPrestation: this.prestation.idPrestation
      }
    };

    this.logger.info("PrestationDetailComponent Log : Valeur de userConfimRdvSuppression : " + this.userConfimRdvSuppression);
    this.logger.info("PrestationDetailComponent Log : Ouverture du Modal ( Confimation suppression )");
    // let dialogRef = this.dialog.open(ConfirmRdvDetailsModalcomponent, modalLogin );
    let dialogRef = this.dialog.open(ConfirmRdvDetailsModalcomponent, modalConf);

    dialogRef.afterClosed().subscribe(resultFromModal => {

      this.logger.info("RdvDetailComponent Log : Fermeture du Modal ( ConfirmAtion suppression )");
      this.logger.info("RdvDetailComponent Log : Valeur de userConfimRdvSuppression : " + resultFromModal.userConfimRdvSuppression);
      this.userConfimRdvSuppression = resultFromModal.userConfimRdvSuppression;

      if (this.userConfimRdvSuppression) {

        this.deleteAfterConfirmation(resultFromModal.idPrestation);

      } else {

        this.logger.info("PrestationDetailComponent Log : Annulation de la deletion de la prestation id: " + resultFromModal.idPrestation);
      }

    });

  }


  // Attribuer les Valeur de la prestation IDXXX
  private attribuerLesValeurs(): void {


  }


  /**
   * Effacer le rdv
   */
  private deleteAfterConfirmation(idPrestation: number) {

    this.logger.info("RdvDetailsComponent log : Effacer le rdv id:" + idPrestation);
    this._rdvService.delRdv(idPrestation).subscribe(

      res => { },

      (err: HttpResponse<number>) => {

        if (err.status != 200) {

          this.toasterMessage("La prestation id: " + idPrestation + " n'a pas été effacée", 'snackbarWarning', 3000);
          this.logger.error("PrestationDetailsComponent log : La prestation id: " + idPrestation + " non éffacée");

        } else {

          this.toasterMessage("Rendez-Vous id: " + idPrestation + " éffacée", 'snackbarInfo', 3000);
          this.logger.info("PresttaionDetailsComponent log : Le Rdv id: " + idPrestation + " éffacée");
          this._router.navigate(['./home']);

        }
      }
    )

  }

  // Retourne la Prestation depuis son Id
  private getPrestationById(idPrestation: number) {
    this.logger.info("PrestationDetailComponent log : Recuperation de la prestation.");
    this._prestationService.getPrestationById(idPrestation).subscribe(
      (presta => {
        this.prestation = presta
        // this._cd.markForCheck();
      })
    )
  }

  // ---------------------------------------------------------------------------------

  /**
 * Recupere le message d erreur du control sur le champs TelFix
 */
  public getSoinErrorMessage(): string {
    return this.prestationFg.get('prestationSoinFc').getError('required') ? 'Champ obligatoire' :
      this.prestationFg.get('prestationSoinFc').getError('pattern') ? 'Charactères spéciaux : tiret autorisé' :
        this.prestationFg.get('prestationSoinFc').getError('maxlength') ? '1 caractère maximum !' : '';
  }

  /**
  * Recupere le message d erreur du control sur le champs TelFix
  */
  public getActiviteErrorMessage(): string {
    return this.prestationFg.get('prestationActiviteFc').getError('pattern') ? 'Charactères spéciaux : tiret autorisé' :
      this.prestationFg.get('prestationActiviteFc').getError('maxlength') ? '50 caractères maximum !' : '';

  }

  /**
   * Recupere le message d erreur du control de la nouvelle activite
   */
  public getNouvActFcErrorMessage() {
    return this.prestationFg.get('prestationNouvActFc').getError('pattern') ? 'Charactères spéciaux : tiret autorisé' :
      this.prestationFg.get('prestationNouvActFc').getError('maxlength') ? '50 caractères maximum !' : '';
  }



  /**
  * Recupere le message d erreur du control sur le champs TelMobile
  */
  public getNbSeanceErrorMessage(): string {
    return this.prestationFg.get('prestationNbSeanceFc').getError('required') ? 'Champ obligatoire' :
      this.prestationFg.get('prestationNbSeanceFc').getError('maxlength') ? '2 chiffres max !' : '';
  }



  /**
  * Recupere le message d erreur du control sur le champs Genre
  */
  public getGenreErrorMessage(): string {
    return this.prestationFg.get('prestationGenreFc').getError('required') ? 'Champ obligatoire' : '';
  }

  public getDureeSeanceErrorMessage(): string {
    return this.prestationFg.get('prestationDureeSeanceFc').getError('required') ? 'Champ obligatoire' :
      this.prestationFg.get('prestationDureeSeanceFc').getError('maxlength') ? '3 chiffres max !' : '';
  }

  /**
  * Recupere le message d erreur du control sur le champs Email
  */
  public getDescriptionErrorMessage(): string {

    return this.prestationFg.get('prestationDescriptionFc').getError('email') ? 'Format d\'email non valide ( xyz@xyz.xyz)' :
      this.prestationFg.get('prestationDescriptionFc').getError('pattern') ? 'Lettre uniquement' :
        this.prestationFg.get('prestationDescriptionFc').getError('maxlength') ? '500 caractères maximum !' : '';

  }
  public getPrixErrorMessage() {
    return this.prestationFg.get('prestationPrixFc').getError('required') ? 'Champ obligatoire' :
      this.prestationFg.get('prestationPrixFc').getError('pattern') ? 'Chiffres uniquement' :
        this.prestationFg.get('prestationPrixFc').getError('maxlength') ? '5 caractères maximum !' : '';
  }


  public activiteSelectionne(event: MatOptionSelectionChange, activite: Activite) {

    if (event.source.selected) {
      this.logger.info("PrestationAddComponent Log : valeur de ActiviteSelectionne : " + " id: " + activite.idActivite + " nom : " + activite.activiteNom);

      if (activite != null) {
        this.prestationFg.get('prestationNouvActFc').setValue('');
        this.prestationFg.get('prestationNouvActFc').disable();
        this.logger.info("PrestationAddComponent Log : valeur de ActiviteSelectionne : " + " id: " + activite.idActivite);
        this.prestationFg.get('prestationActiviteFc').setValue(activite.idActivite);
      }
    }

    if (!event.source.selected) {

      this.prestationFg.get('prestationNouvActFc').enable();
    }

  }

  public inputFieldNouvelleActivite(inputNouvelleActivite: string) {

    this.logger.info("PrestationAddComponent Log : Nouvelle activiete touched value: " + inputNouvelleActivite);

    if (inputNouvelleActivite != null || inputNouvelleActivite != '') {

      this.prestationFg.get('prestationActiviteFc').disable();

    } else {

      this.prestationFg.get('prestationActiviteFc').enable();

    }

    if (inputNouvelleActivite.length == 0) {
      this.logger.info("PrestationAddComponent Log : field null");
      this.prestationFg.get('prestationActiviteFc').enable();
    }
  }

  /**
   * Assigne le parametre nombre de seance au Formcontrol
   * @param event 
   * @param nombreSeance 
   */
  public nombreSeanceSelectionnee(event: EventEmitter<MatOptionSelectionChange>, nbS: nbSeance) {

    this.logger.info("PrestationAddComponent log : valeur de nombreSeance :" + nbS.value);
    this.prestationFg.get('prestationNbSeanceFc').setValue('');
    this.prestationFg.get('prestationNbSeanceFc').setValue(nbS.value.valueOf());

  }

  /**
   * Assigne le parametre dureeSeance au formcontrol
   * @param event 
   * @param dureeSeance 
   */
  public dureeSeanceSelectionnee(event: EventEmitter<MatOptionSelectionChange>, dureeS: dureeSeance) {

    this.logger.info("PrestationAddComponent log : valeur de nombreSeance :" + dureeS.value);
    this.prestationFg.get('prestationDureeSeanceFc').setValue('')
    this.prestationFg.get('prestationDureeSeanceFc').setValue(dureeS.value.valueOf());

  }

  /**
   * Assigne le paramatre genre selectionne par l utilisateur au formControl
   */
  public genreSelectionne(event: EventEmitter<MatOptionSelectionChange>, genre: Genre) {

    this.logger.info("PrestationAddComponent Log : Valeur de genre selectionné : " + genre.idGenre)
    this.prestationFg.get('prestationGenreFc').setValue('');
    this.prestationFg.get('prestationGenreFc').setValue(genre.idGenre.valueOf());

  }


  /**
   * Change la valeur du slider de rappel de Rdv par Sms
   */
  public onChangeTs_forfait_Checked() {

    this.slider_Forfait = !this.slider_Forfait;
    this.logger.info("PrestationAddComponent log : Valeur de Forfait : " + this.slider_Forfait);
    this.prestationFg.get('prestationForfaitFc').setValue(this.slider_Forfait);

  }


  /**
 * Ne pas modifier le Rdv en retournant a la page Home
 */
  public annulerLesModifications() {
    this.logger.info("PrestationDetailsComponent log : Retour à la page home.")
    this._router.navigate(['./home']);
  }

  public update() {

  }

  /**
   * pupup
   * @param snackMessage 
   * @param snackStyle 
   * @param snackTimer 
   */
  private toasterMessage(snackMessage: string, snackStyle: string, snackTimer: number): void {
    this._toasterService.showToaster(snackMessage, snackStyle, snackTimer)
  }

}


@Component({
  selector: 'app-confirmPrestationDetailsModal',
  templateUrl: '../confirm-prestationDetails-modal/confirm-prestationDetails-modal.component.html',
  styleUrls: ['../confirm-prestationDetails-modal/confirm-prestationDetails-modal.component.scss'],
  providers: [NGXLogger]
})

export class ConfirmPrestationDetailsModalcomponent implements OnInit {


  constructor(private logger: NGXLogger,
    public _authService: AuthService,
    public dialogRef: MatDialogRef<ConfirmPrestationDetailsModalcomponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

  }

  ngOnInit() {

    this.logger.info("ConfirmDetailsModalComponent Log : Valeur d'origine de userConfimSuppression : "
      + this.data.userConfimRdvSuppression);

  }

  /**
   * mettre a true le boolean qui servira a confirmer la suppression du Rdv,
   * Fermer le Modal / Dialog
   */
  public okDelete() {
    this.data.userConfimRdvSuppression = true;
    this.logger.info("ConfirmDetailsModalComponent Log : Nouvelle valeur de userConfimRdvSuppression : "
      + this.data.userConfimRdvSuppression);
    this.dialogRef.close(this.data);
  }

  /**
   * Mettre a False le boolean qui servira a annuler la suppression du Rdv,
   * Fermer le Modal / Dialog
   */
  public cancelDeletion() {
    this.data.userConfimRdvSuppression = false;
    this.logger.info("ConfirmDetailsModalComponent Log : Maintient de la Valeur de userConfimRdvSuppression : "
      + this.data.userConfimRdvSuppression);
    this.dialogRef.close(this.data);

  }

}