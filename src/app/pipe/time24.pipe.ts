import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'Time24Pipe' })
export class Time24Pipe implements PipeTransform { 

    
    transform(value: string) {
    
    // console.log("datPipe : TypeofValue : " + typeof(value));
    return this.addZeroIfUnderOrEqualsToNine( new Date(value).getHours().toString() ) 
        +  ":" + this.addZeroIfUnderOrEqualsToNine(new Date(value).getMinutes().toString() );

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
