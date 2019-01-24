import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'EuroCurrencyShowPipe' })
export class EuroCurrencyShowPipe implements PipeTransform { 

    
    transform(value: string):string {

        if (value != null || value != '') {

            return value + " €";

        } else {

            return "€";  
        }
    
    }

}