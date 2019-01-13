import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'ifIsNullSetToNonRenseignePipe' })
export class IfIsNullSetToNonRenseignePipe implements PipeTransform { 

    
    transform(value: string): string {
        // console.log("Usage Pipe ifIsNullSetToNonRenseignePipe: value : " + value)

        if (value == null || value == "") {

            let newVal = "Non renseigné";
            console.log("Usage Pipe : value : " + newVal)
            
            return newVal;

        }   
        
        return value;
    
    }

}