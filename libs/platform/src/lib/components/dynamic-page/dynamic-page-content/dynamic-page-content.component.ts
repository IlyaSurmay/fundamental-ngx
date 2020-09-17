import { Component, OnInit, ChangeDetectionStrategy, ElementRef, Renderer2, forwardRef, Input } from '@angular/core';

import { CLASS_NAME, DYNAMIC_PAGE_CHILD_TOKEN } from '../constants';

@Component({
    selector: 'fdp-dynamic-page-content',
    templateUrl: './dynamic-page-content.component.html',
    styleUrls: ['./dynamic-page-content.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: DYNAMIC_PAGE_CHILD_TOKEN,
            useExisting: forwardRef(() => DynamicPageContentComponent)
        }
    ]
})
export class DynamicPageContentComponent implements OnInit {
    @Input()
    tabLabel: string;

    constructor(private _elementRef: ElementRef<HTMLElement>, private _renderer: Renderer2) {}

    ngOnInit(): void {
        this._addClassNameToHostElement(CLASS_NAME.dynamicPageContent);
        this._addClassNameToHostElement(CLASS_NAME.dynamicPageContentExtraLarge);
        if (this.tabLabel) {
            // add tabbed content
            this._addClassNameToHostElement(CLASS_NAME.dynamicPageTabs);
            this._removeClassNameToHostElement(CLASS_NAME.dynamicPageContent);
            this._removeClassNameToHostElement(CLASS_NAME.dynamicPageContentExtraLarge);
        }
    }

    /**@hidden */
    private _addClassNameToHostElement(className: string): void {
        this._renderer.addClass(this._elementRef.nativeElement, className);
    }
    /**@hidden */
    private _removeClassNameToHostElement(className: string): void {
        this._renderer.removeClass(this._elementRef.nativeElement, className);
    }
}
