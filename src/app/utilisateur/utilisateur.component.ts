import { Component, OnInit } from '@angular/core';
import { NGXLogger } from '../../../node_modules/ngx-logger';

@Component({
  selector: 'app-utilisateur',
  templateUrl: './utilisateur.component.html',
  styleUrls: ['./utilisateur.component.scss'],
  providers: [NGXLogger]
})
export class UtilisateurComponent implements OnInit {

  constructor( private logger: NGXLogger) { }

  ngOnInit() {
  }

}
