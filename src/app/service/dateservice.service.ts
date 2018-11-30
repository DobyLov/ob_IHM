import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class DateService {

  constructor(private logger: NGXLogger) { }

  /**
   * Comparateur de dates
   * Retourne -1 si Date1 est inferieur à Date2
   * Retourne 0  si les dates sont égales
   * Retourne 1 si Date1 est supperieur à Date 2
   * @param date1 
   * @param date2 
   * @return number
   */
  public compareDates(date1: Date, date2: Date): number {

    this.logger.info("DateService log : Comparaison des dates : ");
    this.logger.info("DateService log : Date1 : " + date1);
    this.logger.info("DateService log : Date2 : " + date2);
    let comparator: number;
    if (date1 < date2) comparator = -1;
    if (date1 === date2) comparator = 0;
    if (date1 > date2) comparator = 1;

    this.logger.info("DateService log : Resultat : " + comparator);

    if (comparator == -1) {

      this.logger.info("DateService log : " + date1 + " < " + date2);
    } if (comparator == 0) {

      this.logger.info("DateService log : " + date1 + " == " + date2);
    } if (comparator == 1) {

      this.logger.info("DateService log : " + date1 + " > " + date2);
    }

    return comparator;

  }

  /**
     * Retourne la date fournie au format string
     * YYYY-MM-DD
     * @param date 
     * @returns string
     */
  public setDateToStringYYYYMMDD(date: Date): string {

    this.logger.info("DateService Log : Convertir Date: " + date);
    let dateFormatee: string;

    let yyyy = date.getUTCFullYear();
    let mm = date.getUTCMonth() + 1;
    let dd = date.getDate();

    dateFormatee = `${yyyy}-`;

    if (mm < 10) {

      dateFormatee += `0${mm}-`;

    } else {

      dateFormatee += `${mm}-`;

    }

    if (dd < 10) {

      dateFormatee += `0${dd}`;

    } else {

      dateFormatee += `${dd}`;

    }

    this.logger.info("DateService Log : date convertie au format YYYY-MM-DD : " + dateFormatee);

    return dateFormatee.toString();

  }

  /**
   * Convertir Date serialisee en string
   * @param date
   * @returns String
   */
  public setSerialDateToStringYYYYMMDD(date: any): string {

    this.logger.info("Dateservice log : Date serialisée typeOf: " + typeof (date));
    this.logger.info("Dateservice log : Date serialisée : " + date);

    let dateFormatee = this.setDateToStringYYYYMMDD(new Date(date));


    this.logger.info("DateService log : conversion de la Date serialisée en string : " + dateFormatee);

    return dateFormatee;

  }

  /**
   * modifier l'heure fournie selon le nombre d heures et minutes a ajouter
   * 
   */
  public modStringTime(timeStr: string, increaseDecreseHour: number, increaseDecreseMinute: number): string {

    let nouvelleHeure: string = '';
    this.logger.info("DateService log :  Heure à modifier : " + timeStr);
    let searchTimeSeparator: number = timeStr.indexOf(":");
    let getHours = Number(timeStr.substring(searchTimeSeparator - 2, searchTimeSeparator))+(increaseDecreseHour);
    let getMinutes = Number(timeStr.substring(searchTimeSeparator + 1, searchTimeSeparator + 3))+(increaseDecreseMinute);

    if (getHours < 10) {

      nouvelleHeure += `0${getHours}:`;

    } else if (getHours > 24) {

      nouvelleHeure += `00:`;

    } else {

      nouvelleHeure +=`${getHours}:`

    }

    if (getMinutes < 10) {

      nouvelleHeure += `0${getMinutes}`;

    } else if (getMinutes > 59) {

      nouvelleHeure += `00`;

    } else {

      nouvelleHeure += `${getMinutes}`;

    }

    this.logger.info("Dateservice log :  Recomposition du temps : " + nouvelleHeure);

    return nouvelleHeure;
  }

  /**
   * Retourne l heure et uniquement l heure sous forme de nombre
   * @param timeStr 
   * @returns number
   */
  public extracHoursFromGivenTime(timeStr: string): number {
    
    this.logger.info("Dateservice log :  Exctarction de l heure depuis la string : " + timeStr);
    let numberHour: number = Number(timeStr.substring(timeStr.indexOf(":") - 2, timeStr.indexOf(":"))); 
    this.logger.info("Dateservice log :  Heure extrait : " + numberHour);
    
    return numberHour;

  }

  /**
   * Retourne les minutes et uniquement les minutes sous forme de nombre
   * @param timeStr 
   */
  public extracMinutesFromGivenTime(timeStr: string): number {

    return Number(timeStr.substring(timeStr.indexOf(":") + 1, timeStr.indexOf(":") + 3));

  }


}
