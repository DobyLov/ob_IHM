import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'HommeFemmePipe' })
export class HommeFemmePipe implements PipeTransform { 

    
    transform(value: string): string {

        if (value != null) {
            if ( value.toLowerCase() == "homme" ) {
                return 'H';
            } else {
                return 'F';
            }
        } 
    
    }

}