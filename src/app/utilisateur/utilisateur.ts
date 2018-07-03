import { Roles } from './roles';

export class Utilisateur {

    public idUtilisateur: number;
    public prenomUtilisateur: string;
    public nomUtilisateur: string;
    public adresseMailUtilisateur: string;
    public teleMobileUtilisateur: string;
    public motDePasse: string;
	public roles: Roles;
	public isLogged: string;
	public suscribedSmsReminder: string;
	public suscribedMailReminder: string;
    public pwdExpirationDateTime: string;

   

}