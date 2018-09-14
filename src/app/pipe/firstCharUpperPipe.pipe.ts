import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'FirstCharUpperPipe' })
export class FirstCharUpperPipe implements PipeTransform { 

    
    transform(value: string){

        return value.replace(/\w\S*/g, function(value) {
            return value.charAt(0).toUpperCase() + value.substr(1).toLowerCase();
        });
    
    }

}
