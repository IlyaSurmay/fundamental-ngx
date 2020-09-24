import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class DynamicPageService {
    private toggle = new Subject<boolean>();

    public $toggle = this.toggle.asObservable();

    public toggleHeader(val: boolean): any {
        this.toggle.next(val);
    }
}
