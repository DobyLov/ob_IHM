import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'WishProOrNotPipe' })
export class WishProOrNotPipe implements PipeTransform { 

    
    transform(value: string):string {

        if ( value != null) {
            if ( value.toLowerCase() == 'wish pro' ) {
                return '';
    
            } else {
    
                return value;
            }
        } else {
            return '';
        }
    
    }

}