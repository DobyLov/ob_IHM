import { OnInit, Component, ViewChild, ChangeDetectorRef } from "@angular/core";
import { AuthRgpdService } from "./authRgpd.service";
import { Validators, FormControl} from '@angular/forms';
import { PerfectScrollbarComponent } from "ngx-perfect-scrollbar";
import { NGXLogger } from 'ngx-logger';
import { Rgpd } from "./rgpd";
import { RgpdService } from "./rgpd.service";
import * as moment from 'moment';
import { Router } from '@angular/router';
import { BottomSheetService } from "../service/bottomsheet.service";
import { ClientService } from "../client/client.service";
import { Client } from "../client/client";

moment.locale('fr');


export interface RgpdInfoText {

    titleArticle: string;
    bodyArticle: string;

};

@Component({
    selector: 'app-rgpd',
    templateUrl: '../rgpd/rgpd.component.html',
    styleUrls: ['../rgpd/rgpd.component.scss'],
    providers: [NGXLogger]
})

export class RgpdComponent implements OnInit {
    @ViewChild(PerfectScrollbarComponent) componentRef: PerfectScrollbarComponent;
   
    client: Client;
    requestComplete: boolean = false;
    // Rgpd
    rgpd: Rgpd;

    // scrollbar status
    isScrolledToBottom: boolean = false;

    // Informations initiales extraites depuis de token
    emailClient: string;
    rgpdPrenomClient: string;
    idClient: number;
    token: string;
    
    // Parametre sert a afficher  le message pour demander un nouveau lien
    displaySendRgpdOptions: boolean = true;

    // Forms Control
    stepperFormReadRgpd: FormControl;

    // checkBoxs
    cb_color: string = 'primary';
    labelPoz = 'after';

    // cbReadRgpd
    checkBox_Checked: boolean = false;
    checkBox_Disabled: boolean = true;

    // cbValidinfoPerso
    checkBox_InfoPerso_Checked: boolean = false;

    // sliders
    ts_Color: string = 'primary';    
    ts_Commercials_Checked = false;
    ts_Commercials_hasMoved = false;
    ts_NewsLetter_Checked = false;
    ts_NewsLetter_hasMoved = false;
    ts_SmsRdvRemider_Checked = false;
    ts_SmsRdvRemider_hasMoved = false;
    ts_MailRdvReminder_Checked = false;
    ts_MailRdvReminder_hasMoved = false;

    disable_SendRgpdButton: boolean = true;
    is_SendRgpdButtonPressed: boolean = false; 

    rgpdArticles = [
        {
            "titleArticle": "1 Identification des données",        
            "bodyArticle": 'Les informations permettant d identifier le ' 
            + 'client Nom, prenom, date anniversaire, genre adresse postale, ' 
            + 'tel fixe, tel mobile, adresse mail.'
        },
        {  
            "titleArticle": "2 Objectif de la collecte",        
            "bodyArticle": 'Cela permet une qualité de service élévée, le système '
            + 'permet de prendre des rendez-vous, de les modifier, de les supprimer.'
            + ' Le système analyse les rendez-vous plannifiés pour le jour suivant'
            + ' et est en mesure d\'envoyer un Email et ou un SMS de rappel de rdv.'
            + ' Pour réaliser ces fonctions bien définies le système nécessite les informations'
            + ' de prénom, Email et ou numéro de téléphone portable.'
            + ' Le contenu du message envoyé est à charactère informatif et contient les'
            + ' informations suivantes : Prenom du client , indiquer l\'adresse du lieu de RDV la'
            + ' le soin qui sera pratiqué ainsi que l heure.'
        },
        {  
            "titleArticle": "3 La durée de conservation ",        
            "bodyArticle": 'Les données sont conservées à minima le temps de vie du logiciel mais celles-ci peuvent néanmoins être supprimées / modifiées à la demande du client.'
        },
        {  
            "titleArticle": "4  Responsable traitement",        
            "bodyArticle": 'Le responsable du traitement des données : Frédéric BEAUDEAU frederic.beaudeau@outlook.com.'
        },
        {  
            "titleArticle": "5  Protection des données",        
            "bodyArticle": 'Le responsable de la protection des données : Frédéric BEAUDEAU frederic.beaudeau@outlook.com.'
        },
        {  
            "titleArticle": "6 Finalité des traitements ",        
            "bodyArticle": 'Les données collectées permettent d\'assurer le fonctionnement du logiciel de gestion clientelle.'
        },
        {  
            "titleArticle": "7 Localisation des données ",        
            "bodyArticle": 'Celles-ci sont hebergées dans un cloud privé respectant la reglementation Rgpd.'
        },
        {  
            "titleArticle": "8 Exploitation commerciale ",        
            "bodyArticle": 'Le données sont structurées dans une base de donnée et font l\'objet de traitement uniquement dédiés à l\'activité professionnelle, Les données sont ni revendues, ni cédées, ni louées sous quelques forme que ce soit au près d\'un quelconque organisme.'
        }
    ];

    tableauArticles: RgpdInfoText[];

    constructor(private logger: NGXLogger,
                private router: Router,
                private _bottomsheet: BottomSheetService,
                private _authrgpdservice: AuthRgpdService,
                private _rgpdservice: RgpdService,
                private _clientservice: ClientService,
                private cd: ChangeDetectorRef
            ) {

                    try {

                        this.client = new Client();
                        this.token = this._authrgpdservice.getRgpdTokenFromLS();                        
                        
                        this.emailClient = this._authrgpdservice.getEmailClientFromToken(this.token); 
                        this.getClientByEmail(this.emailClient);
                        console.log("RgpdComponent Log : CONSTRUCTOR => valeur de client.nom : " + this.client.nomClient);
                        this.rgpdPrenomClient = this._authrgpdservice.getPrenomClientFromToken(this.token);

                        this.rgpd = new Rgpd();
                        this.getRgpdClientSettings(this.emailClient); 
                        
                    } catch (error) { 
                        this.displaySendRgpdOptions = true 
                    }
                    
                }

    ngOnInit() { 
        
        this.stepperFormReadRgpd = new FormControl( this.isScrolledToBottom, Validators.requiredTrue);
        this.stepperFormReadRgpd.setValue(false);
        this.cd.detectChanges();
    }

    /**
     * Initialise les parametres des SlidersToggle
     * afin de detecter si ils ont ete modifies
     */
    public goToRgpdSettings() {

        this.ts_Commercials_hasMoved = false;
        this.ts_NewsLetter_hasMoved = false;
        this.ts_SmsRdvRemider_hasMoved = false;
        this.ts_MailRdvReminder_hasMoved = false;        
        this.disable_SendRgpdButton = true;
    }

    /**
     * Recupere les sttings Rgpd du Client
     * depuis la BDD lors d une navigation "Retour"
     * dans le steper
     */
    public stepperNavigationRetourArriere() {
        this.getRgpdClientSettings(this.emailClient);
        this.is_SendRgpdButtonPressed = false;
    }

    /**
     * Si la scrollBar est descendue completement en bas et 
     * que la checkbox est cochée :     * 
     * assigner le parametre isScrolledToBottom a true, desactive la checkBox
     * et forcer le statut de steperForm a VALID.
     * Sinon attribue le statut True au parametre isScrolledToBottom.
     * Ceci pour authoriser l acces a la page suivante du steper
     */
    public bottomScrolled (): void { 
        this.cd.detectChanges();
        this.checkBox_Disabled = false;
        this.logger.info("RgpdComponent Log : ScrollBar => scrolled to Bottom");
        if (this.isScrolledToBottom.valueOf() == false) {
            this.isScrolledToBottom = true;
            this.logger.info("RgpdComponent Log : bottom set to : " + this.isScrolledToBottom.valueOf());
            this.cd.detectChanges();
        }
        
        if (this.checkBox_Checked == true && this.isScrolledToBottom == true) {
            this.logger.info("RgpdComponent Log : Validation du form par scrollbar");
            this.checkBox_Disabled = true;
            this.stepperFormReadRgpd.setValue(true);
            this.cd.detectChanges();
        } 
        
    }

    /**
     * change la valeur boolean de la checkbox a true,
     * puis desactive la checkBox.
     * Et si le parametre isScrolledToBottom est a true
     * valide le steperForm
     */
    public checkBox_ReadRgpd_Switcher(): void {
        this.logger.info("RgpdComponent Log : CheckBox Checked");
        this.checkBox_Checked = !this.checkBox_Checked;
        this.checkBox_Disabled = ! this.checkBox_Disabled;
        if (this.isScrolledToBottom == true && this.checkBox_Checked == true) {
            this.logger.info("RgpdComponent Log : Validation du form par checkbox ");
            this.stepperFormReadRgpd.setValue(true);

        } 
    }

    /**
     * Permute l etat de la checkbox Validt donnee perso
     * 
     */
    public checkBox_InfoPerso_Switcher(): void {
        this.checkBox_InfoPerso_Checked = !this.checkBox_InfoPerso_Checked;
        if ( this.checkBox_InfoPerso_Checked.valueOf() == true ) {
            this._bottomsheet.openBottomSheet("Votre demande sera notifiée");
        }

        if ( this.checkBox_InfoPerso_Checked.valueOf() == false ) {
            this._bottomsheet.openBottomSheet("Notification annulée");
        } 
        // this.stepperFormInfoPersoValidation.setValue(true);
    }

    /**
     * Recupere les settinge Rdgp du client depuis la Bdd 
     * @param emailClient
     */
    private getRgpdClientSettings(emailClient: string): Rgpd {

        this.logger.info("RgpdComponent Log : Recuperation des Settings de l utilisateur depuis la bdd");
        this._rgpdservice.getRgpdClientSettings(emailClient)       
            .subscribe(
                ( (res: Rgpd ) => {  
                    this.rgpd = res;
                    this.logger.info("RgpdComponent Log : La recuperation des settings s est deroulee correctement");
                    this.configSlidersFromClientBddSettings(this.rgpd);
                    }
                ),
                err => {
                    this.logger.info("RgpdComponent Log : La recuperation des settings ne s est pas deroulee correctement")
                }
            
            );

        return this.rgpd;   
    }

        /**
     * Recupere le Client depuis la Bdd via son Email
     * @param emailClient
     */
    private getClientByEmail(emailClient: string): Client {
        
        this.logger.info("RgpdComponent Log : Recuperation du Client depuis la bdd");
        this._clientservice.getClientByEmail(emailClient)       
            .subscribe(
                ( (res: Client ) => {  
                    this.client = res;                    
                    this.logger.info("RgpdComponent Log : La recuperation du client s est deroulee correctement");
                    this.requestComplete = true;
                    }
                ),
                err => {
                    this._bottomsheet.openBottomSheet("Il y a un problème avec vos informations !")
                    this.logger.info("RgpdComponent Log : La recuperation du client ne s est pas deroulee correctement")
                }
            
            );
            
        return this.client;   
    }

    /**
     * Assigne les valeurs des Settings Rgpd depuis la bdd
     * aux sliderToggle
     * @param rgpd 
     */
    private configSlidersFromClientBddSettings(rgpd: Rgpd): void {
        this.ts_Commercials_Checked = this.stringValueToBooleanValueChanger(rgpd.rgpdSubsComm.valueOf());
        this.ts_MailRdvReminder_Checked = this.stringValueToBooleanValueChanger(rgpd.rgpdSubsMailRem.valueOf());
        this.ts_SmsRdvRemider_Checked = this.stringValueToBooleanValueChanger(rgpd.rgpdSubsSmsRem.valueOf());
        this.ts_NewsLetter_Checked = this.stringValueToBooleanValueChanger(rgpd.rgpdSubsNLetter.valueOf());
    }

    /**
     * Converti les Valeurs (F ou f)False / (T)True du format String (depuis la Bdd)
     * en Booleen (True / False)
     * @param stringValue 
     */
    private stringValueToBooleanValueChanger(stringValue: string): boolean {
        let boolToReturn: boolean;
        if ( stringValue.valueOf() == "F" || stringValue.valueOf() == "f" ) {
            boolToReturn = false;
        } else {
            boolToReturn = true;
        }
        return boolToReturn;
    }

    /**
     * Converti les Booleens (True / False) en String (F)False / (T)True
     * @param booleanValue 
     */
    private booleanValueToStringValueChanger(booleanValue: boolean): string {
        let stringToReturn: string;
        if ( booleanValue == false ) {
            stringToReturn = "F";
        } else {
            stringToReturn = "T";
        }
        return stringToReturn;
    }

    /**
     * Persister les nouveaux reglage Rgpd Client,
     * Assigne la date du jour aux nouveaux Settings
     * Assigne les nouveaux settings a l objet rgpd: Rgpd instancie
     */
    public sendRgpdOptions(): void {
        this.logger.info("RgpdComponent Log : Persistance des settings");
        this.rgpdDateModifierUpdater(this.rgpd);
        this.rgpdSettingsModifier(this.rgpd);
        this._rgpdservice.setRgpdClientSettings(this.rgpd);
        this.logger.info("RgpdComponent Log : La persistance des settings effectuee");
        this.disable_SendRgpdButton = true;
        setTimeout(() => {
            this.exitRgpdSettings();
        }, 9000);

    }

    /**
     * Assigner les nouveau Settings Rgpd a l objet rgpd: Rgpd
     * @param rgpd 
     */
    private rgpdSettingsModifier(rgpd: Rgpd): Rgpd {
        rgpd.rgpdSubsComm = this.booleanValueToStringValueChanger(this.ts_Commercials_Checked);
        rgpd.rgpdSubsMailRem = this.booleanValueToStringValueChanger(this.ts_MailRdvReminder_Checked);
        rgpd.rgpdSubsNLetter = this.booleanValueToStringValueChanger(this.ts_NewsLetter_Checked);
        rgpd.rgpdSubsSmsRem = this.booleanValueToStringValueChanger(this.ts_SmsRdvRemider_Checked);

        return rgpd;
    }

    /**
     * Assigne la date du jour en Timestamp aux nouveaux settings
     * @param rgpd 
     */
    private rgpdDateModifierUpdater(rgpd: Rgpd): Rgpd {

        let dateNow = new Date();        
        // let dateMomentUnix = (moment(dateNow).utcOffset(200).unix());
        let dateNowtoUnix: number = (dateNow.getTime()*1000); 
        rgpd.rgpdDateCliVal = dateNowtoUnix;

        return rgpd;
    }

    /**
     * Modifie les parametres  Booleen (checked & hasMoved)
     * Lors d une modification de l etat d un sliderToggle
     */
    public onChangeTs_Commercials_Checked(): boolean {

        this.ts_Commercials_Checked = !this.ts_Commercials_Checked;
        this.ts_Commercials_hasMoved = !this.ts_Commercials_hasMoved;
        this.activateSendSettingsButton();

        return this.ts_Commercials_Checked;
    }

    /**
     * Modifie les parametres  Booleen (checked & hasMoved)
     * Lors d une modification de l etat d un sliderToggle
     */
    public onChangeTs_NewsLetter_Checked(): boolean {
        this.ts_NewsLetter_Checked = !this.ts_NewsLetter_Checked; 
        this.ts_NewsLetter_hasMoved = !this.ts_NewsLetter_hasMoved;
        this.activateSendSettingsButton();
        return this.ts_NewsLetter_Checked;
    }

    /**
     * Modifie les parametres  Booleen (checked & hasMoved)
     * Lors d une modification de l etat d un sliderToggle
     */
    public onChangeTs_SmsRdvRemider_Checked(): boolean {

        this.ts_SmsRdvRemider_Checked = !this.ts_SmsRdvRemider_Checked;
        this.ts_SmsRdvRemider_hasMoved = !this.ts_SmsRdvRemider_hasMoved;
        this.activateSendSettingsButton();

        return this.ts_SmsRdvRemider_Checked;
    }
    
    /**
     * Modifie les parametres  Booleen (checked & hasMoved)
     * Lors d une modification de l etat d un sliderToggle
     */
    public onChangeTs_MailRdvReminder_Checked(): boolean {

        this.ts_MailRdvReminder_Checked = !this.ts_MailRdvReminder_Checked;
        this.ts_MailRdvReminder_hasMoved = !this.ts_MailRdvReminder_hasMoved;
        this.activateSendSettingsButton();

        return this.ts_MailRdvReminder_Checked;
    }

    /**
     * Activer le bouton pour envoyer les nouveaux
     * Rgpd settings
     */
    public activateSendSettingsButton() {

        if (this.ts_Commercials_hasMoved == true ||
            this.ts_MailRdvReminder_hasMoved == true ||
            this.ts_NewsLetter_hasMoved == true ||
            this.ts_SmsRdvRemider_hasMoved == true) {

                this.disable_SendRgpdButton = false;

            } else if ( this.ts_Commercials_hasMoved == false ||
                this.ts_MailRdvReminder_hasMoved == false ||
                this.ts_NewsLetter_hasMoved == false ||
                this.ts_SmsRdvRemider_hasMoved == false) {

                this.disable_SendRgpdButton = true;
            }
    }



    /**
     * A la sortie de la page Rgpd :
     * Purge les objets Rgpd et Client
     * Puis affiche la page d accueil sans les boutons de menu et login
     */
    public exitRgpdSettings(): void {
        
        if (this.rgpd.rgpdCliEmail !=null) {
            this.rgpd = null;
            this.logger.info("RgpdComponent Log : object Rgpd instancie purje");
        }
        this.router.navigate(['./welcome']);
    }
    
}