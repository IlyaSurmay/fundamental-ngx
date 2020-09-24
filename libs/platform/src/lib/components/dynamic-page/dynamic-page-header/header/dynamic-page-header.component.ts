import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    ElementRef,
    Renderer2,
    Input,
    Output,
    EventEmitter,
    ViewEncapsulation,
    ContentChild,
    TemplateRef
} from '@angular/core';

import { CLASS_NAME } from '../../constants';
import { DynamicPageConfig } from '../../dynamic-page.config';
import { DynamicPageService } from '../../dynamic-page.service';

/** Dynamic Page collapse change event */
export class DynamicPageCollapseChangeEvent {
    constructor(public source: DynamicPageHeaderComponent, public payload: boolean) {}
}

@Component({
    selector: 'fdp-dynamic-page-header',
    templateUrl: './dynamic-page-header.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class DynamicPageHeaderComponent implements OnInit {
    @Input()
    collapsible = true;

    @Input()
    pinnable = false;

    @Input()
    collapsed = false;

    /**
     * ARIA label for button when the header is collapsed
     */
    @Input()
    expandLabel: string = this._dynamicPageConfig.expandLabel;

    /**
     * ARIA label for button when the header is expanded
     */
    @Input()
    collapseLabel: string = this._dynamicPageConfig.collapseLabel;

    /** Reference to panel content */
    @ContentChild('headerContent')
    headerContent: TemplateRef<any>;

    /** Collapse/Expand change event raised */
    @Output()
    collapseChange: EventEmitter<DynamicPageCollapseChangeEvent> = new EventEmitter<DynamicPageCollapseChangeEvent>();

    /** @hidden */
    constructor(
        private _elementRef: ElementRef<HTMLElement>,
        private _renderer: Renderer2,
        protected _dynamicPageConfig: DynamicPageConfig,
        private _dynamicPageService: DynamicPageService
    ) {
        this._dynamicPageService.$toggle.subscribe((val) => {
            console.log('subscriibied to dyn page serviicee header' + val);
            this.toggleCollapse();
        });
    }

    /** @hidden */
    ngOnInit(): void {
        // this._addClassNameToHostElement(CLASS_NAME.dynamicPageHeader); // not getting this to work right
        // this._addClassNameToHostElement(CLASS_NAME.dynamicPageHeaderExtraLarge);
        if (this.collapsed) {
            this._setStyleToHostElement('z-index', 1);
        }
    }

    /** Handles expanded/collapsed event */
    public toggleCollapse(): void {
        this.collapsed = !this.collapsed;
        if (this.collapsed) {
            this._setStyleToHostElement('z-index', 1);
        } else {
            this._removeStyleFromHostElement('z-index');
        }
        const event = new DynamicPageCollapseChangeEvent(this, this.collapsed);
        // this._dynamicPageService.toggleHeader(this.collapsed);
        this.collapseChange.emit(event);
        // this._calculateExpandAriaLabel();
    }

    /**@hidden */
    private _addClassNameToHostElement(className: string): void {
        this._renderer.addClass(this._elementRef.nativeElement, className);
    }

    /**@hidden */
    private _setStyleToHostElement(attribute: string, value: any): void {
        this._renderer.setStyle(this._elementRef.nativeElement, attribute, value);
    }
    /**@hidden */
    private _removeStyleFromHostElement(styleName: string): void {
        this._renderer.removeStyle(this._elementRef.nativeElement, styleName);
    }
}
