import { ClientAdresse } from './clientAdresse';
import { Genre } from '../genre/genre';

export class Client {

    public idClient: number;
    public nomClient: string;
    public prenomClient: string;
    public telephoneClient: number
    public telMobileClient: number;
    public adresse: ClientAdresse;
    public genreClient: Genre; 
    public adresseMailClient: string;
    public dateAnniversaireClient: number;
    public suscribedCommercials: boolean;
    public suscribedNewsLetter: boolean;
    public suscribedMailReminder: boolean;
    public suscribedSmsReminder: boolean;
    public rgpdInfoClientValidation: boolean;
    public rgpdDateClientvalidation: boolean;
    public rgpdClientCanModifyRgpdSettings: boolean;

    constructor(){}

}