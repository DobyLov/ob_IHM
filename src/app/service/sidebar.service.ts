import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";



@Injectable()
export class SideBarService {


    sideNavToggle$ = new BehaviorSubject<Boolean>(false);
    sideNavStatus$ = new BehaviorSubject<Boolean>(true);

    constructor() { }

    get statusOfSideNavToggle() {
        return this.sideNavToggle$.asObservable();
    }

    sideNavToggle() {
        if (this.sideNavToggle$.getValue() == true) {
            this.sideNavToggle$.next(false);
        } else {
            this.sideNavToggle$.next(true);
        }
    }

    changeStatusOfSideNavToggle(status) {
        if (status == true) {
            this.sideNavToggle$.next(true);
        } else {
            this.sideNavToggle$.next(false);
        }
    }

    get statusOfSideNavState() {
        return this.sideNavStatus$.asObservable();
    }

    changeStatusOfSideNavState(status) {
        if (status == true) {
            this.sideNavStatus$.next(true);
        } else {
            this.sideNavStatus$.next(false);
        }
    }
}

