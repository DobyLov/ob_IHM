import { Component, OnInit, Input, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
// import { FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-rdv',
  templateUrl: './rdv.component.html',
  styleUrls: ['./rdv.component.scss']
})

export class RdvComponent implements OnInit {
 
  dateSearchPanelOpenState: boolean = false;
  rdvInfoPanelOpenState: boolean = true;
  dateSelectionnee: Date = new Date();
  dateSelectionneeA: Date = new Date();
  dateSelectionneeB: Date = new Date();
  showSimpleDateOrRangeDate: boolean = true;
  startDate = new Date(this.dateSelectionnee);
  minDate = new Date();

  genres = [
    {value: '1', viewValue: 'FEMME'},
    {value: '2', viewValue: 'HOMME'}
  ];
  pretations = [
    {value: '1', viewValue: 'epilation'}
  ]
  lieux = [
    {value: '1', viewValue: 'adresse client'},
    {value: '2', viewValue: 'la bomboniere'}
  ]
  // time  
  qqchoz: String;
  public timeClockDebut = { hour: 0, minute: 0, meriden: 'PM', format: 24 };
  public timeClockFin = { hour: '10', minute: '10', meriden: 'PM', format: 24 };
  // hour: string = this.timeClockDebut.hour;
  // minute: string = this.timeClockDebut.minute;
  constructor(public dialog: MatDialog
              // ,public dialogclockFin: MatDialog
            ) { }

   openDialogClockDebut(): void {
    let dialogRef = this.dialog.open(DialogClockDebutComponent, {
      data: { timeclockDebut: this.timeClockDebut, qqchoz: this.qqchoz }
      // data: { qqchoz: this.qqchoz }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      this.timeClockDebut = result;
    });
  }

  ngOnInit() { }

  rechercherSimpleDate() {
    this.showSimpleDateOrRangeDate = true;
  }

  rechercherRangeDate() {
    this.compare(this.dateSelectionneeA.getTime(), this.dateSelectionneeB.getTime());
  }


  compare(dateA, dateB) {
    console.log("Comparateur de dates");
    
    if ( dateA == dateB ) {
      this.showSimpleDateOrRangeDate = true;
      // this.showSimpleDateOrRangeDate = true;
      this.dateSelectionnee = this.dateSelectionneeA;
      console.log("Les dates sont egales !");
      console.log("val de dateSelectioneeA : " + dateA);
      console.log("val de dateSelectioneeB : " + dateB);

    } if ( dateA > dateB ) { 
      console.log("La date A et superieur a B "); 
      console.log("Force date A a etre egale a B")
      console.log("val de dateSelectioneeA : " + dateA);
      console.log("val de dateSelectioneeB : " + dateB);
      this.dateSelectionneeA = this.dateSelectionneeB;
      console.log("val de dateSelectioneeA : " + dateA);
      console.log("val de dateSelectioneeB : " + dateB);
      // this.dateSelectionneeA = this.dateSelectionnee;
      this.showSimpleDateOrRangeDate = false;
    
    } if ( dateA < dateB) {
      this.showSimpleDateOrRangeDate = false;
      console.log("La date A est inferieure a B");
      console.log("val de dateSelectioneeA : " + dateA);
      console.log("val de dateSelectioneeB : " + dateB);
    }    
  }
}

@Component({
  selector: 'dialog-clock-debut.component',
  templateUrl: './dialog-clock-debut/dialog-clock-debut.component.html'

})

export class DialogClockDebutComponent {

  

  constructor(
    public dialogRef: MatDialogRef<DialogClockDebutComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { 

      this.data.timeClockDebut = { hour: '0', minute: '0', meriden: 'PM', format: 24 };
     }


  onNoClick(): void {
    this.dialogRef.close();
  }

  onRevert() {
    // this.exportTime =  { hour: 7, minute: 15, meriden: 'PM', format: 12 };
    console.log("btn Annuler Heure de début séléctionnée : " 
    + this.data.timeClockDebut.hour + " : " + this.data.timeClockDebut.minute);
    this.dialogRef.close();
  }

  onSubmit() {    
    console.log("btn valider Heure de début séléctionnée : " 
    + this.data.timeClockDebut.hour + " : " + this.data.timeClockDebut.minute);
    this.dialogRef.close(this.data.timeClockDebut);
  }

}
