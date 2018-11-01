import { Component, OnInit } from '@angular/core';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss']
})
export class SupportComponent implements OnInit {

  constructor( private logger: NGXLogger) { }

  ngOnInit() {
    this.logger.info("SupportComponent Log :");
  }

}
