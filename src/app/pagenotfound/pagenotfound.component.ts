import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'app-pagenotfound',
  templateUrl: './pagenotfound.component.html',
  styleUrls: ['./pagenotfound.component.scss']
})

export class PagenotfoundComponent implements OnInit, AfterViewInit {

  constructor(private router: Router,
              private logger: NGXLogger) { }

  ngOnInit() {
    this.logger.info("PagenotFound log : Ouverture de la PageNotFound");
  }

  ngAfterViewInit() {
    
    setTimeout(() => {
      this.logger.info("PagenotFound log : re-route to Welcome page");
      this.router.navigateByUrl('');
    }, 6000);
  }
}
