import { Injectable } from "../../../../node_modules/@angular/core";
import { NGXLogger } from "../../../../node_modules/ngx-logger";
import { MatMenu } from "../../../../node_modules/@angular/material";

@Injectable(
    { providedIn: 'root' }
)
export class Dateservice {


    constructor( private logger: NGXLogger) {}

    /**
     * Retourne la date fournie au format string
     * YYYY-MM-DD
     * @param date 
     * @returns string
     */
    public setDateToStringYYYYMMDD(date: Date): string {

        this.logger.info("Dateservice Log : date a convertir : " + date);
        let dateFormatee: string;

        let yyyy = date.getUTCFullYear();
        let mm = date.getUTCMonth() + 1;
        let dd = date.getDate();

        dateFormatee = `${yyyy}-`;

        if ( mm < 10 ) {

            dateFormatee += `0${mm}-`;

        } else {

            dateFormatee += `${mm}-`;

        } 
        
        if ( dd < 10 ) {

            dateFormatee += `0${dd}`;

        } else {

            dateFormatee += `${dd}`;

        }

        this.logger.info("Dateservice Log : date a convertir : " + dateFormatee);

        return dateFormatee.toString();

    }

}