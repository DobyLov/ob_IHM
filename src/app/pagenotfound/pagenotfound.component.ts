import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pagenotfound',
  templateUrl: './pagenotfound.component.html',
  styleUrls: ['./pagenotfound.component.scss']
})

export class PagenotfoundComponent implements OnInit, AfterViewInit {

  constructor(private router: Router) { }

  ngOnInit() {}

  ngAfterViewInit() {
    setTimeout(() => {
      // console.log("re-route");
      // this.router.navigate(['./welcome']);
      this.router.navigateByUrl('');
    }, 10000);
  }
}
