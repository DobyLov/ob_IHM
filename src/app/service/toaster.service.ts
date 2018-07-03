import { Injectable, Component, Inject } from '@angular/core';
import { MatSnackBar, MAT_SNACK_BAR_DATA } from '@angular/material';


@Injectable()
export class ToasterService {

  constructor(private snackBar: MatSnackBar)  {  }


  // snackStyle defini dans le custom-theme.scss => 
  // error (snackbarWarning)
  // info (snackbarInfo)
  showToaster(snackMessage: string, snackStyle: string, snackTimer: number) {
      this.snackBar.openFromComponent(SnackBarComponent, { 
        data: snackMessage,
        duration: snackTimer,
        extraClasses: [snackStyle]
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
