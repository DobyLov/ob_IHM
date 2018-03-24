import { Component, OnInit, Input, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

// moment pour le formatage des dates
import * as moment from 'moment/moment';
moment.locale('fr');

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
  prestations = [
    {value: '1', viewValue: 'epilation'}
  ]
  soins = [
    {value: '1', viewValue: 'aisselle'},
    {value: '2', viewValue: 'sourcils'}
  ]
  lieux = [
    {value: '1', viewValue: 'adresse client'},
    {value: '2', viewValue: 'la bomboniere'}
  ]
  clients = [
    {value: "1", viewValue: 'toto'},
    {value: "2", viewValue: 'tata'}
  ]

  // time  
  timeClockDebut = { hour: 0, minute: 0, meriden: 'PM', format: 24 };
  timeClockFin = { hour: 0, minute: 0, meriden: 'PM', format: 24 };
  userTime: any;
  exportTime: any;
  // myDateFormatee: Date;
  dateReservationRdv: Date = new Date();
  dateReservationRdvD: Date;
  dateReservationRdvF: Date;

  constructor(public dialogClockDebut: MatDialog,
              public dialogClockFin: MatDialog
            ) { }

   openDialogClockDebut(): void {
    let dialogRefRefClockDebut = this.dialogClockDebut.open(DialogClockDebutComponent, {
      data: { timeClockDebut: this.timeClockDebut, timeClockFin: this.timeClockFin }

    });

    dialogRefRefClockDebut.afterClosed().subscribe(resultDebut => {
      console.log('The dialog was closed', resultDebut);
      this.timeClockDebut = resultDebut;
    });
  }

  openDialogClockFin(): void {
    let dialogRefRefClockFin = this.dialogClockFin.open(DialogClockFinComponent, {
      data: { timeClockDebut: this.timeClockDebut, timeClockFin: this.timeClockFin }

    });

    dialogRefRefClockFin.afterClosed().subscribe(resultFin => {
      console.log('The dialog was closed', resultFin);
      this.timeClockFin = resultFin;
    });
  }

  ngOnInit() {
  }

  calculDate() {
  }

  rechercherSimpleDate() {
    this.showSimpleDateOrRangeDate = true;
  }

  rechercherRangeDate() {
    this.compare(this.dateSelectionneeA.getTime(), this.dateSelectionneeB.getTime());
    let toto: Date = new Date();

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


dateTimeValider(dateReservationRdv: Date) {
  
  this.dateReservationRdvD = this.formatTime24H(dateReservationRdv, this.timeClockDebut.hour, this.timeClockDebut.minute)
  this.dateReservationRdvF = this.formatTime24H(dateReservationRdv, this.timeClockFin.hour, this.timeClockFin.minute)

}

formatTime24H(date: Date, heure: number, minute: number) {
  let dateCompleteHeureRdv = date.setHours(heure);
  dateCompleteHeureRdv = date.setMinutes(minute);
  dateCompleteHeureRdv = date.setSeconds(0);
  let dateFormateeD: Date = new Date(dateCompleteHeureRdv);   

  return dateFormateeD;
}

}


// ********************************************************************
// Clock Debut
// ********************************************************************
@Component({
  selector: 'dialog-clock-debut.component',
  templateUrl: './dialog-clock-debut/dialog-clock-debut.component.html'

})

export class DialogClockDebutComponent {

  constructor(
    public dialogRefClockDebut: MatDialogRef<DialogClockDebutComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { 

      this.data.timeClockDebut = { hour: 1, minute: 0, meriden: 'PM', format: 24 };
      this.data.timeClockFin = { hour: 0, minute: 0, meriden: 'PM', format: 24 };
     }

  onNoClickClockDebut(): void {
    this.dialogRefClockDebut.close(this.data.timeClockDebut);
  }

  onRevertClockDebut() {
    // this.exportTime =  { hour: 7, minute: 15, meriden: 'PM', format: 12 };
    console.log("btn Annuler Heure de début séléctionnée : " 
    + this.data.timeClockDebut.hour + " : " + this.data.timeClockDebut.minute);
    this.dialogRefClockDebut.close(this.data.timeClockDebut);
  }

  onSubmitClockDebut() {    
    console.log("btn valider Heure de début séléctionnée : " 
    + this.data.timeClockDebut.hour + " : " + this.data.timeClockDebut.minute);
    this.dialogRefClockDebut.close(this.data.timeClockDebut);
  }

}

// ********************************************************************
// Clock Fin
// ********************************************************************
@Component({
  selector: 'dialog-clock-fin.component',
  templateUrl: './dialog-clock-fin/dialog-clock-fin.component.html'

})

export class DialogClockFinComponent {

  constructor(
    public dialogRefClockFin: MatDialogRef<DialogClockDebutComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { 

      this.data.timeClockDebut = { hour: 0, minute: 0, meriden: 'PM', format: 24 };
      this.data.timeClockFin = { hour: 0, minute: 0, meriden: 'PM', format: 24 };
     }

  onNoClick(): void {
    console.log("dialog fin no clic")
    this.dialogRefClockFin.close(this.data.timeClockFin);
  }

  onRevertClockFin() {
    // this.exportTime =  { hour: 7, minute: 15, meriden: 'PM', format: 12 };
    console.log("btn Annuler Heure de début séléctionnée : " 
    + this.data.timeClockFin.hour + " : " + this.data.timeClockFin.minute);
    this.dialogRefClockFin.close(this.data.timeClockFin);
  }

  onSubmitClockFin() {    
    console.log("btn valider Heure de début séléctionnée : " 
    + this.data.timeClockFin.hour + " : " + this.data.timeClockFin.minute);
    this.dialogRefClockFin.close(this.data.timeClockFin);
  }

}
