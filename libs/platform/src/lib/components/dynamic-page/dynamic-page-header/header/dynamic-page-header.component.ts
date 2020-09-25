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
import { Subscription } from 'rxjs';

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
export class DynamicPageHeaderComponent implements OnInit, OnDestroy {
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

    /** Reference to page header content */
    @ContentChild('headerContent')
    headerContent: TemplateRef<any>;

    /** Collapse/Expand change event raised */
    @Output()
    collapseChange: EventEmitter<DynamicPageCollapseChangeEvent> = new EventEmitter<DynamicPageCollapseChangeEvent>();

    toggleSubscription: Subscription;
    expandSubscription: Subscription;
    collapseSubscription: Subscription;

    /** @hidden */
    constructor(
        private _elementRef: ElementRef<HTMLElement>,
        private _renderer: Renderer2,
        protected _dynamicPageConfig: DynamicPageConfig,
        private _dynamicPageService: DynamicPageService
    ) {
        if (this.collapsible) {
            this.toggleSubscription = this._dynamicPageService.$toggle.subscribe((val) => {
                console.log('subscriibied to dyn page serviicee header' + val);
                this.toggleCollapse();
            });
            this.expandSubscription = this._dynamicPageService.$expand.subscribe(() => {
                console.log('subscriibied to expand');
                this.collapseHeader(false);
            });
            this.collapseSubscription = this._dynamicPageService.$collapse.subscribe(() => {
                console.log('subscriibied to collapse');
                this.collapseHeader(true);
            });
        }
    }

    /** @hidden */
    ngOnInit(): void {
        // this._addClassNameToHostElement(CLASS_NAME.dynamicPageHeader); // not getting this to work right
        // this._addClassNameToHostElement(CLASS_NAME.dynamicPageHeaderExtraLarge);
        if (this._isCollapsibleCollapsed()) {
            this._setStyleToHostElement('z-index', 1);
        }
    }
    collapseHeader(val: any): any {
        this.collapsed = val;
        this.expandCollapseActions();
    }
    /** Handles expanded/collapsed event */
    public toggleCollapse(): void {
        this.collapsed = !this.collapsed;
        this.expandCollapseActions();
        // this._calculateExpandAriaLabel();
    }
    private expandCollapseActions(): void {
        if (this._isCollapsibleCollapsed()) {
            this._setStyleToHostElement('z-index', 1);
        } else {
            this._removeStyleFromHostElement('z-index');
        }
        const event = new DynamicPageCollapseChangeEvent(this, this.collapsed);
        // this._dynamicPageService.toggleHeader(this.collapsed);
        this.collapseChange.emit(event);
    }

    private _isCollapsibleCollapsed(): boolean {
        return this.collapsible && this.collapsed;
    }

    elementRef(): ElementRef<any> {
        return this._elementRef;
    }

    ngOnDestroy(): void {
        this.toggleSubscription.unsubscribe();
        this.expandSubscription.unsubscribe();
        this.collapseSubscription.unsubscribe();
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
