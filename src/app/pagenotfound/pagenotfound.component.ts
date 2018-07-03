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
      this.router.navigate(['./welcome'])
    }, 5000);
  }
}
