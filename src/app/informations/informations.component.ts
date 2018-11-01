import { Component, OnInit } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-informations',
  templateUrl: './informations.component.html',
  styleUrls: ['./informations.component.scss']
})
export class InformationsComponent implements OnInit {

  constructor( private logger: NGXLogger,
              public route: ActivatedRoute) { }

  ngOnInit() {
    
    this.logger.info("InformationsComponent Log : ")

    this.route.fragment.subscribe((fragment: string) => { 
      if (fragment && document.getElementById(fragment) != null) {
        document.getElementById(fragment).scrollIntoView({ behavior: "auto" });
        this.logger.info("InformationsComponent log : navigation fragment : " + fragment);
      }
    });

   }

}