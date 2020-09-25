import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    ElementRef,
    Renderer2,
    Input,
    ViewEncapsulation
} from '@angular/core';

import { CLASS_NAME } from '../../constants';
import { DynamicPageService } from '../../dynamic-page.service';

@Component({
    selector: 'fdp-dynamic-page-title',
    templateUrl: './dynamic-page-title.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class DynamicPageTitleComponent implements OnInit {
    @Input()
    title: string;

    @Input()
    subtitle: string;

    // toggledVal = false;
    // @ViewChild(DynamicPageHeaderComponent)
    // private headerComponent: DynamicPageHeaderComponent;

    /** @hidden */
    constructor(private _elementRef: ElementRef<HTMLElement>, private _renderer: Renderer2) {
        // this._dynamicPageService.$toggle.subscribe((val) => {
        //     console.log('subscriibied to dyn page serviicee in content' + val);
        //     this.toggledVal = val;
        // });
    }

    // toggleCollapse(): any {
    //     console.log('ini tiitle');

    //     this.headerComponent.toggleCollapse();
    // }

    elementRef(): ElementRef<HTMLElement> {
        return this._elementRef;
    }
    /** @hidden */
    ngOnInit(): void {
        this._addClassNameToHostElement(CLASS_NAME.dynamicPageTitleArea); // not getting this to work right
    }

    /**@hidden */
    private _addClassNameToHostElement(className: string): void {
        this._renderer.addClass(this._elementRef.nativeElement, className);
    }
}
