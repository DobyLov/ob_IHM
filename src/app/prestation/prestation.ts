import { Genre } from '../genre/genre';

export class Prestation {

    public idPrestation: number;
    public activite: string;
    public soin: string;
    public genre: Genre;
    public forfait: string;
    public nbSeance: number;
    public dureeSeance: number;
    public prix: Float32Array;
    public description: string;
}