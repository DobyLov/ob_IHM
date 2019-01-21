import { Roles } from '../roles/roles';

export class Utilisateur {

    public idUtilisateur: number;
    public prenomUtilisateur: string;
    public nomUtilisateur: string;
    public adresseMailUtilisateur: string;
    public teleMobileUtilisateur: string;
    public motDePasse: string;
	public roles: Roles;
	public isLogged: string;
	public suscribedSmsReminder: boolean;
	public suscribedMailReminder: boolean;
    public pwdExpirationDateTime: boolean;

   

}