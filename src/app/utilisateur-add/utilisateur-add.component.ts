import { Component, OnInit } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { HistoryRoutingService } from '../service/historyRouting.service';

@Component({
  selector: 'app-utilisateur-add',
  templateUrl: './utilisateur-add.component.html',
  styleUrls: ['./utilisateur-add.component.scss']
})
export class UtilisateurAddComponent implements OnInit {

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
