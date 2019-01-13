import { Component, OnInit } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { HistoryRoutingService } from '../service/historyRouting.service';

@Component({
  selector: 'app-prestation-add',
  templateUrl: './prestation-add.component.html',
  styleUrls: ['./prestation-add.component.scss']
})
export class PrestationAddComponent implements OnInit {

  // RouterHistory
  previousRoute: string;
  
  constructor(private logger: NGXLogger,
              private _historyRouting: HistoryRoutingService
              ) { }

  ngOnInit() {

        // Historique de navigation stocke la route precedent afin de faire un BackPage
        this.previousRoute = this._historyRouting.getPreviousUrl();
  }

}
