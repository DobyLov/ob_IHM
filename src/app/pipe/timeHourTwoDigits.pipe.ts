import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'timeHourTwoDigits' })
export class TimeHourTwoDigitsPipe implements PipeTransform { 

    transform(value: any){
        // console.log("vale value : " + value)

        if ( 9 < value  && value < 24 ) {
            return value.toString();

        } if (value == 24 || value == 0) {
            return "00";
            
        } else {
            // console.log("OneDigit : value : " + value);
            let valueToString = value.toString();
            let addZeroToValueToString = "0" + valueToString;
            // console.log("OneDigit" + addZeroToValueToString);
            return addZeroToValueToString;                
        }
    
    
    }

}