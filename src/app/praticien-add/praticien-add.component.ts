import { Component, OnInit } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { HistoryRoutingService } from '../service/historyRouting.service';
import { Praticien } from '../praticien/praticien';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-praticien-add',
  templateUrl: './praticien-add.component.html',
  styleUrls: ['./praticien-add.component.scss']
})
export class PraticienAddComponent implements OnInit {

   // RouterHistory
   previousRoute: string;

   praticien: Praticien = new Praticien();

   praticienFb: FormBuilder = new FormBuilder();
  
   constructor(private logger: NGXLogger,
               private _historyRouting: HistoryRoutingService
               ) { }
 
   ngOnInit() {
 
         // Historique de navigation stocke la route precedent afin de faire un BackPage
         this.previousRoute = this._historyRouting.getPreviousUrl();
   }



}
