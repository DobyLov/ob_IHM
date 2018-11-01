import { Directive, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { BrowserDetectorService } from '../service/browserdetector.service';

@Directive({
  selector: '[SmoothScroll]'
})
export class SmoothScrollDirective {

  constructor(private el: ElementRef, 
              private route: ActivatedRoute,
              private logger: NGXLogger,
              private _browserDetectorService: BrowserDetectorService) { }

  ngAfterViewInit() {

    this.route.fragment.subscribe((fragment: string) => { 
      
      this.logger.info("SmoothScrollDirective Log : Fragment : " + fragment);
      this.logger.info("SmoothScrollDirective Log : Elemntref : " + this.el.nativeElement.id);

      if (fragment && this.el.nativeElement && this.el.nativeElement.id === fragment)    
        {

        /* --- browser check --- */
          let browser = this._browserDetectorService.browserDetection();
          this.el.nativeElement.scrollIntoView({ behavior: "smooth" });          
        /* --- if no smooth scroll --- */
          // javascript animation
        }

      /* Browser check method */
    });
  }
}