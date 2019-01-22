import { RolesUtilisateur } from '../roles/rolesUtilisateur';

export class Utilisateur {

    public idUtilisateur: number;
    public prenomUtilisateur: string;
    public nomUtilisateur: string;
    public adresseMailUtilisateur: string;
    public teleMobileUtilisateur: string;
    public rolesUtilisateur: RolesUtilisateur;
    public motDePasse: string;
    public pwdExpirationDateTime: boolean;
    public compteEffacable: boolean
	public isLogged: boolean;
	public suscribedSmsReminder: boolean;
	public suscribedMailReminder: boolean;   

}