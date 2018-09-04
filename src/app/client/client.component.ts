import { Component, OnInit } from '@angular/core';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss'],
  providers: [ NGXLogger ]
})
export class ClientComponent implements OnInit {

  constructor( private logger: NGXLogger) { }

  ngOnInit() {
  }

}
