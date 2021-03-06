import { Directive, ElementRef, HostBinding, HostListener, Input, OnChanges, OnInit } from '@angular/core';
import { NestedItemService } from './nested-item/nested-item.service';
import { applyCssClass } from '../utils/decorators/apply-css-class.decorator';
import { CssClassBuilder } from '../utils/interfaces/css-class-builder.interface';

@Directive({
    selector: '[fdNestedDirectivesHeader], [fd-nested-list-header]'
})
export class NestedListHeaderDirective {

    /** @hidden */
    @HostBinding('class.fd-nested-list__group-header')
    fdNestedListHeaderClass = true;

}

@Directive({
    selector: '[fdNestedDirectivesIcon], [fd-nested-list-icon]'
})
export class NestedListIconDirective implements CssClassBuilder, OnChanges, OnInit {

    /** The property allows user to pass additional css classes */
    @Input()
    class = '';

    /**
     * The icon name to display. See the icon page for the list of icons
     * here: https://sap.github.io/fundamental-ngx/icon
     */
    @Input() glyph: string;

    /** Role attribute */
    @Input()
    @HostBinding('attr.role')
    role = 'presentation';

    /** @hidden */
    @HostBinding('class.fd-nested-list__icon')
    fdNestedListIconClass = true;

    /** @hidden */
    constructor(private _elementRef: ElementRef) {}

    /** @hidden */
    ngOnChanges(): void {
        this.buildComponentCssClass();
    }

    /** @hidden */
    ngOnInit(): void {
        this.buildComponentCssClass();
    }

    @applyCssClass
    /** CssClassBuilder interface implementation */
    buildComponentCssClass(): string[] {
        return [
            'fd-nested-list__icon',
            this.glyph ? `sap-icon--${this.glyph}` : '',
            this.class
        ];
    }

    /** HasElementRef interface implementation */
    elementRef(): ElementRef<any> {
        return this._elementRef;
    }

}

@Directive({
    selector: '[fdNestedDirectivesTitle], [fd-nested-list-title]'
})
export class NestedListTitleDirective {

    /** @hidden */
    @HostBinding('class.fd-nested-list__title')
    fdNestedListTitleClass = true;

    /** @hidden */
    constructor(
        private elementRef: ElementRef
    ) {}

    /** Returns element's InnerText */
    getInnerText(): string {
        return this.elementRef && this.elementRef.nativeElement.innerText;
    }
}

@Directive({
    selector: '[fdNestedListExpandIcon], [fd-nested-list-expand-icon]',
    host: {
        'aria-haspopup': 'true',
        'tabindex': '-1'
    }
})
export class NestedListExpandIconDirective {

    /** @hidden */
    @HostBinding('class.fd-nested-list__button')
    fdNestedListTitleClass = true;

    /** @hidden */
    @HostBinding('class.fd-button')
    fdButtonClass = true;

    /**
     * @hidden
     * Attribute controlled by the parent `NestedItemDirective`
     */
    @HostBinding('class.is-expanded')
    @HostBinding('attr.aria-expanded')
    expanded = false;

    constructor (
        private _itemService: NestedItemService
    ) {}

    /** Mouse event handler */
    @HostListener('click', ['$event'])
    onClick(event: MouseEvent): void {
        this.expanded = !this.expanded;
        this._itemService.toggle.next(this.expanded);
        event.stopPropagation();
    }

    /** Handler for focus events */
    @HostListener('focus')
    onFocus(): void {
        this._itemService.focus.next();
    }
}
