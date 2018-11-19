import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NGXLogger } from 'ngx-logger';

@Injectable({
  providedIn: 'root'
})

export class HistoryRoutingService {

  private history = [];

  constructor(private logger: NGXLogger,
              private router: Router) {  }

  /**
   * Inscrit l'historique de navigation dans un tableau
   */
  public loadRouting(): void {

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(({urlAfterRedirects}: NavigationEnd) => {
        this.history = [...this.history, urlAfterRedirects];
      });

  }

  /**
   * Recupere l'historique de navigation stocké sous forme de tableau
   */
  public getHistory(): string[] {
    return this.history;
  }

  /**
   * Récupère la navigation précédente ( backButton )
   */
  public getPreviousUrl(): string {
    return this.history[this.history.length - 2] || '/index';
  }

}
