import { Prestation } from "../prestation/prestation";
import { Praticien } from "../praticien/praticien";
import { Client } from "../client/client";
import { Utilisateur } from "../utilisateur/utilisateur";
import { LieuRdv } from "../lieuRdv/lieuRdv";

export class Rdv {

    public idRdv: number;
    public dateHeureDebut: number;
    public dateDeSaisie: number;
    public dateHeureFin: number;
    public prestation: Prestation;
    public praticien: Praticien;
    public client: Client;
    public lieuRdv: LieuRdv;
    public utilisateur: Utilisateur;
}