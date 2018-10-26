import { Injectable, Component, Inject } from '@angular/core';
import { MatSnackBar, MAT_SNACK_BAR_DATA, MatSnackBarConfig } from '@angular/material';


@Injectable()
export class ToasterService {

  constructor(private snackBar: MatSnackBar)  {  }


  // snackStyle defini dans le custom-theme.scss => 
  // error (snackbarWarning)
  // info (snackbarInfo)
  /**
   * SnackBar Pour afficher les messages a l utilisateur
   */
  showToaster(snackMessage: string, snackStyle: string, snackTimer: number) {

    const config: MatSnackBarConfig = new MatSnackBarConfig();
      config.data = snackMessage,
      config.duration = snackTimer,
      config.politeness = 'assertive',
      config.horizontalPosition = 'center',
      config.verticalPosition = 'bottom',
      config.panelClass = [snackStyle]     

      this.snackBar.openFromComponent( SnackBarComponent, config );      
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
