import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'DateAndTime24Pipe'
})
export class DateAndTime24Pipe implements PipeTransform {

  transform(value): string {
    return this.composDate(value);

    }   

    /**
     * Compose la date / time au format dd/mm hh:mm
     * @param value 
     */
    private composDate(value: string): string {

        let day: string = new Date(value).getDate().toString();
        let months: number = new Date(value).getMonth();
        let monthsModified: string = months +1 < 10 ? ("0" + (months+1)) : (months+1).toString();
        let hours: string =  this.addZeroIfUnderOrEqualsToNine(new Date(value).getHours().toString());
        let minutes: string =  this.addZeroIfUnderOrEqualsToNine(new Date(value).getMinutes().toString());
       
        return day + '/' + monthsModified  + ' ' + hours + ':' + minutes;
    }

    /**
     * Retourne la string avec un Zero devant
     * si c est un chiffre inferieur ou egal a 9
     * @param valTim 
     * @returns valTime string 
     */
    private addZeroIfUnderOrEqualsToNine( valTim: string): string {

        if ((parseInt(valTim)) <= 9 ) {

            valTim = "0" + valTim; 

            return valTim;

        } else {

            return valTim;
        }
    }

}
