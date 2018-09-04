import { Component, Injectable, Inject } from '@angular/core';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';

@Injectable()
export class BottomSheetService {

    constructor( private logger: NGXLogger,
                 private mBS: MatBottomSheet){}

    public openBottomSheet(message: string): void {
        this.mBS.open(BottomSheetComponent
            , { data: message } 
        );
    }
}


@Component({
    selector: 'bottomsheet',
    templateUrl: '../service/bottomsheet/bottomsheet.component.html',
    providers: [NGXLogger]

})

export class BottomSheetComponent {

    message: string;
    constructor( private logger: NGXLogger,
                 private bottomSheetRef: MatBottomSheetRef<BottomSheetComponent>,

                private router: Router,
                @Inject(MAT_BOTTOM_SHEET_DATA) public data: any) {
                    this.logger.info("BottomSheetService Log : Ouverture du BottomSheet avec message : " + data);
                    this.message = data;
                    setTimeout(() => {
                        this.bottomSheetRef.dismiss();
                    }, 7000);
                    this.bottomSheetRef.afterDismissed()
                        .subscribe(res => { this.logger.info("BottomSheetService Log : Fermeture du BottomSheet"); });
                }

    private openLink(event: MouseEvent): void {
        this.bottomSheetRef.dismiss();
        event.preventDefault();
    }

    closeBottomSheet() {
        this.bottomSheetRef.dismiss();
    }

}