import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    ElementRef,
    Renderer2,
    Input,
    Output,
    EventEmitter,
    ViewEncapsulation
} from '@angular/core';

import { CLASS_NAME } from '../../constants';

@Component({
    selector: 'fdp-dynamic-page-header',
    templateUrl: './dynamic-page-header.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class DynamicPageHeaderComponent implements OnInit {
    @Input()
    collapsible: string;

    @Input()
    pinnable: string;

    @Input()
    collapsed: string;

    /** Selected radio button change event raised */
    @Output()
    collapseChange: EventEmitter<DynamicPageHeaderComponent> = new EventEmitter<DynamicPageHeaderComponent>();

    /** @hidden */
    constructor(private _elementRef: ElementRef<HTMLElement>, private _renderer: Renderer2) {}

    /** @hidden */
    ngOnInit(): void {
        // this._addClassNameToHostElement(CLASS_NAME.dynamicPageHeader); // not getting this to work right
        // this._addClassNameToHostElement(CLASS_NAME.dynamicPageHeaderExtraLarge);
    }

    /**@hidden */
    private _addClassNameToHostElement(className: string): void {
        this._renderer.addClass(this._elementRef.nativeElement, className);
    }
}
