import { AbstractControl, Validator } from '@angular/forms';


export function PhoneNumberEmptyValidator(control: AbstractControl): { [key: string]: any } | null {

  let valid = control.value;

  if (control.value == '') {
    
    valid = false;
  } else {

    valid = null
  }

  return valid ? null : { invalidNumber: { valid: false, value: control.value } };

}



