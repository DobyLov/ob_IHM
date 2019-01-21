import { Roles } from '../roles/roles';
// import { Utilisateur } from '../utilisateur/utilisateur';

export class CurrentUtilisateur {

    public idUtilisateur: number; 
    public prenomUtilisateur: string;
    public nomUtilisateur: string;
    public adresseMailUtilisateur: string;
    public roles: Roles
}