import { Component, Injectable, Inject } from '@angular/core';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material';
import { Router } from '@angular/router';


@Injectable()
export class BottomSheetService {

    constructor(private mBS: MatBottomSheet){}

    public openBottomSheet(message: string): void {
        this.mBS.open(BottomSheetComponent
            , { data: message } 
        );
    }
}


@Component({
    selector: 'bottomsheet',
    templateUrl: '../service/bottomsheet/bottomsheet.component.html'
})

export class BottomSheetComponent {

    message: string;
    constructor(private bottomSheetRef: MatBottomSheetRef<BottomSheetComponent>,
                private router: Router,
                @Inject(MAT_BOTTOM_SHEET_DATA) public data: any) {
                    this.message = data;
                    this.bottomSheetRef.afterDismissed()
                        .subscribe(res => { 
                                console.log("fermeture du bottomsheet");
                                this.router.navigateByUrl('');                                
                            });
                }

    private openLink(event: MouseEvent): void {
        this.bottomSheetRef.dismiss();
        event.preventDefault();
    }

    closeBottomSheet() {
        this.bottomSheetRef.dismiss();
    }

}