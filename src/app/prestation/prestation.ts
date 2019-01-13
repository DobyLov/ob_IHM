import { Genre } from '../genre/genre';
import { Activite } from '../activite/activite';

export class Prestation {

    public idPrestation: number;
    public activite: Activite;
    public soin: string;
    public genre: Genre;
    public forfait: boolean;
    public nbSeance: number;
    public dureeSeance: number;
    public prix: Float32Array;
    public description: string;
}