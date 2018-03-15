import { Component, OnInit, Input } from '@angular/core';
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

  // heures
  heures = [
    {value: '08', viewValue: '08'},
    {value: '09', viewValue: '09'},
    {value: '10', viewValue: '10'},
    {value: '11', viewValue: '11'},
    {value: '12', viewValue: '12'},
    {value: '13', viewValue: '13'},
    {value: '14', viewValue: '14'},
    {value: '15', viewValue: '15'},
    {value: '16', viewValue: '16'},
    {value: '17', viewValue: '17'},
    {value: '18', viewValue: '18'},
    {value: '19', viewValue: '19'},
    {value: '20', viewValue: '20'},
    {value: '21', viewValue: '21'}
  ];
  minutes = [
    {value: '00', viewValue: '00'},
    {value: '15', viewValue: '15'},
    {value: '20', viewValue: '20'},
    {value: '25', viewValue: '25'},
    {value: '30', viewValue: '30'},
    {value: '35', viewValue: '35'},
    {value: '40', viewValue: '40'},
    {value: '45', viewValue: '45'},
    {value: '50', viewValue: '50'},
    {value: '55', viewValue: '55'}
  ];
  genres = [
    {value: '1', viewValue: 'FEMME'},
    {value: '2', viewValue: 'HOMME'}
  ];
  pretations = [
    {value: ''}
  ]


  constructor() { }

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
