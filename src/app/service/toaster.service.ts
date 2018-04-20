import { Injectable, Component, Inject } from '@angular/core';
import { MatSnackBar, MAT_SNACK_BAR_DATA } from '@angular/material';


@Injectable()
export class ToasterService {

  constructor(private snackBar: MatSnackBar)  {  }

  showToaster(message: string, snackbarWarning: string, timer: number) {
      this.snackBar.openFromComponent(SnackBarComponent, { 
        data: message,
        duration: timer,
        extraClasses: ['snackbarWarning']
      });      
  }  

}

@Component({
  selector: 'snackbar',
  templateUrl: '../service/snackbar/snackbar.html'
  // styles: [`  `]
  // styles: ['../service/snackbar/snackbar.scss']
})
export class SnackBarComponent {
constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {}
 }
