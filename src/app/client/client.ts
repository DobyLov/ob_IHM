import { ClientAdresse } from '../client/clientAdresse';
import { Genre } from '../genre/genre';

export class Client {

    public idClient: number;
    public nomClient: string;
    public prenomClient: string;
    public telephoneClient: number
    public telMobileClient: number;
    public adresse: ClientAdresse;
    public genre: Genre; 
    public adresseMailClient: string;
    public dateAnniversaireClient: number;
    public suscribedCommercials: string;
    public suscribedNewsLetter: string;
    public suscribedMailReminder: string;
    public suscribedSmsReminder: string;
    public rgpdInfoClientValidation: string;
    public rgpdDateClientvalidation: string;
    public rgpdClientCanModifyRgpdSettings: string;

}