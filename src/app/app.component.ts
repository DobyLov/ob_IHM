import { 
  Component, 
  ViewChild, 
  HostListener, 
  OnInit,
  OnDestroy,
  Inject, 
  ChangeDetectionStrategy,
  Input, 
  AfterContentInit } from '@angular/core';
  
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import {
  MatMenuTrigger,
  MatSidenav, 
  MatSidenavContainer } from '@angular/material';

import { 
  MatDialog, 
  MatDialogRef, 
  MAT_DIALOG_DATA } from '@angular/material';

import { Utilisateur } from './utilisateur/utilisateur'
import { AuthService } from './login/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./app.component.scss']
})


export class AppComponent implements OnInit {


    // control de la sidenav
    @ViewChild('mysidenav') private mysidenav: MatSidenav;
    // control du menu
    @ViewChild(MatMenuTrigger) private menutrigger: MatMenuTrigger;

    userNameConnected: String = '';


    title = 'OOPPusbeaute'

    sidenavlinks = [{
      rubrique: 'Rdv',
      liste1: 'Liste des rdv\'s',
      routingListe1: './rdv',
      ajout1: 'Ajouter un Rdv',
      routingAjout1: '[./rdvadd]'
    }]

    ngOnInit() { 
    }
    
    constructor() {
    }

  
}


    








