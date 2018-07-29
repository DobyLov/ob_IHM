import { Component, Injectable, Inject } from '@angular/core';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material';


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
    templateUrl: '../service/bottomsheet/bottomsheet.component.html',
    styles: ['../service/bottomsheet/bottomsheet.component.scss']
})

export class BottomSheetComponent {

    constructor(private bottomSheetRef: MatBottomSheetRef<BottomSheetComponent>,
                @Inject(MAT_BOTTOM_SHEET_DATA) public data: any) {}

    openLink(event: MouseEvent): void {
        this.bottomSheetRef.dismiss();
        event.preventDefault();
    }
}