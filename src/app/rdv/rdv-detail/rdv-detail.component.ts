import { Component, OnInit, ChangeDetectorRef, OnDestroy, AfterViewChecked, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { Rdv } from '../rdv';
import { RdvService } from '../rdv.service';
// import { AuthService } from 'src/app/login/auth.service';

@Component({
  selector: 'app-rdv-detail',
  templateUrl: './rdv-detail.component.html',
  styleUrls: ['./rdv-detail.component.scss']
})
export class RdvDetailComponent implements OnInit, OnDestroy, AfterViewChecked{

  @Input() isUserIsConnected$: boolean = false;

  idRdv: number;
  rdvExistant: boolean = true;
  rdvRecupere: boolean = false;
  rdv: Rdv = null;

  constructor(private logger: NGXLogger,
              private route: ActivatedRoute,
              private _rdvService: RdvService,
              // private _authService: AuthService,
              private _cd: ChangeDetectorRef) {

                // this.getIsUserIsConnected();
                this.getRdv(this.getUrlParamId());
               }

  ngOnInit() {
  }

  /**
   * Extrait le parametre idRdv de l url
   * @returns number
   */
  private getUrlParamId(): number {

    let getIdString = this.route.snapshot.paramMap.get('idRdv');
    this.logger.info("Rdv-DetailComponent Log : Recuperation depuis l'url: le Paramametr idRdv : " + getIdString);
    this.idRdv = this.idStringConvertToNumber(getIdString);     

    return this.idRdv;
  }

  ngOnDestroy() {

    this._cd.detach();
    
  }

  ngAfterViewChecked() {
    this._cd.detectChanges();
  }



  /**
   * Converti un nombre(String) en Number
   * @param idString 
   * @returns number
   */
  private idStringConvertToNumber(idString: string): number {

      this.logger.info("Rdv-DetailComponent Log : Conversion du type String en Number de isRdv : " + idString);
      this.logger.info("Rdv-DetailComponent Log : Type initial de idRdv : " + typeof(idString));
      this.idRdv = parseInt(idString);      
      this.logger.info("Rdv-DetailComponent Log : Type apres conversion de idRdv : " + typeof(this.idRdv));

      return this.idRdv;
  }

  /**
   * Recupere le detail du Rdv par son Id
   * @param id 
   * 
   */
  private getRdv(id) {

    this.logger.info("Rdv-DetailComponent log: Demande le detail du Rdv id : " + id );
    this._rdvService.getRdvById(id)
      .subscribe( 
        ( res : Rdv) => { 
          this.rdvExistant = true;
          this.rdv = res;
          this.rdvRecupere = true;
          this.logger.info("Rdv-DetailComponenet log : Rdv id: " + id + " trouvé dans la Bdd"); 
          this._cd.markForCheck();
          this._cd.detectChanges();
        },

        (err) => { 
          this.rdvExistant = false;
          this.logger.info("Rdv-DetailComponent log : Rdv id: " + id + " non trouvé dans la Bdd");
          this._cd.markForCheck();
          this._cd.detectChanges();
          }
      )
  }

   /**
   * Souscription a l orbservable isconnected
   */
  private getIsUserIsConnected(){

    // Souscription a l orbservable isconnected
    // this._authService.statusOfIsUserIsLogged.subscribe(isLoggedIn => {
    //   this.isUserIsConnected$ = isLoggedIn.valueOf() 
    // });

  }

}
