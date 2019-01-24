import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'SingulierPlurielNbSeancePipe' })
export class SingulierPlurielNbSeancePipe implements PipeTransform { 

    
    transform(value: string):string {

        if (value == "1") {

            return value + " séance"

        } else {

            return value + " séances"  
        }
    
    }

}