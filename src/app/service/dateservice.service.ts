import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import * as moment from 'moment';
import { timeInterval } from 'rxjs/operators';

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


    /**
   * Construit une date avec une heure
   * @param date
   * @param string 
   * @returns Date
   */
  public dateTimeConstructor(date: Date, time: string): Date {
    // this.logger.info("DateService Log : DateTimeConstructor Date : " + date);
    // this.logger.info("DateService Log : DateTimeConstructor TimeString : " + time);
    let heures: number = this.extracHoursFromGivenTime(time);
    // this.logger.info("DateService Log : DateTimeConstructor Extract Heures : " + heures); 
    let minutes: number = this.extracMinutesFromGivenTime(time);
    // this.logger.info("DateService Log : DateTimeConstructor Extract Minutes : " + minutes);
    let dateTimeConstruite: Date = new Date (new Date(date).setHours(heures, minutes));
    // this.logger.info("DateService Log : DateTimeConstructor DateTime : " + dateTimeConstruite);
    
    return dateTimeConstruite;
  
  };

/**
 * Retourne l heure du timestamp au format 24H
 */
  public extracTimeFromGivenTs(ts: number): string {

    this.logger.info("DateService Log : Extraction du temps depusi le ts fourni : " + ts)
    let extractedTime: string = moment(ts).hour().toString() + ":" + moment(ts).minute().toString();
    let format24HTime: string  = this.modStringTime(extractedTime,0,0);
    this.logger.info("DateService Log : Time : " + format24HTime);

    return format24HTime;
  }

/**
 * Compare si heureA et inferieur à heureB
 * Methode dédie aux timePicker de modification de Rdv 
 * @returns boolean
 */
  public compareTimeATimeB(timeA: string, timeB: string): boolean {
    console.log("DateService Log : value timeA: " + timeA);
    this.logger.info("DateService Log : value timeA: " + timeA);
    console.log("DateService Log : value timeB: " + timeB);
    this.logger.info("DateService Log : value timeB: " + timeB);
    let timeAIsBeforeTimeB: boolean = false;
    const dateDuJour: Date = new Date();
    let dateDuJourPourTimeA: number = dateDuJour.setHours(this.extracHoursFromGivenTime(timeA),this.extracMinutesFromGivenTime(timeA));
    let dateDuJourPourTimeB: number = dateDuJour.setHours(this.extracHoursFromGivenTime(timeB),this.extracMinutesFromGivenTime(timeB));
    
    // Comparaison des dates
    if ( dateDuJourPourTimeA < dateDuJourPourTimeB ) {
      this.logger.info("DateService Log : timeA: " + dateDuJourPourTimeA + " < " + " timeB: " + dateDuJourPourTimeB );
      console.log("DateService Log : timeA: " + dateDuJourPourTimeA + " < " + " timeB: " + dateDuJourPourTimeB );
      timeAIsBeforeTimeB = true; 

    } 
    
    if ( dateDuJourPourTimeA == dateDuJourPourTimeB ) {
      this.logger.info("DateService Log : timeA: " + dateDuJourPourTimeA + " == " + " timeB: " + dateDuJourPourTimeB );
      console.log("DateService Log : timeA: " + dateDuJourPourTimeA + " == " + " timeB: " + dateDuJourPourTimeB );
      timeAIsBeforeTimeB = false;

    } 
    
    if ( dateDuJourPourTimeA > dateDuJourPourTimeB ) {
      this.logger.info("DateService Log : timeA: " + dateDuJourPourTimeA + " > " + " timeB: " + dateDuJourPourTimeB );
      console.log("DateService Log : timeA: " + dateDuJourPourTimeA + " > " + " timeB: " + dateDuJourPourTimeB );
      timeAIsBeforeTimeB = false;
    }

    return timeAIsBeforeTimeB;
  }


}
