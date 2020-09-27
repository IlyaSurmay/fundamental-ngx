import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    Input,
    OnInit,
    Renderer2,
    ViewEncapsulation
} from '@angular/core';
import { BACKGROUND_TYPE, CLASS_NAME, RESPONSIVE_SIZE } from '../../constants';
import { FocusableOption } from '@angular/cdk/a11y';

@Component({
    selector: 'fdp-dynamic-page-title',
    templateUrl: './dynamic-page-title.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class DynamicPageTitleComponent implements OnInit, FocusableOption {
    @Input()
    set background(backgroundType: BACKGROUND_TYPE) {
        if (backgroundType) {
            this._background = backgroundType;
            this._setBackgroundStyles(backgroundType);
        }
    }

    get background(): BACKGROUND_TYPE {
        return this._background;
    }

    @Input()
    set size(sizeType: RESPONSIVE_SIZE) {
        if (sizeType) {
            this._size = sizeType;
            this._setSize(sizeType);
        }
    }

    get size(): RESPONSIVE_SIZE {
        return this._size;
    }
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
    disabled?: boolean;
    @Input()
    title: string;

    @Input()
    subtitle: string;

    _background: BACKGROUND_TYPE;

    _size: RESPONSIVE_SIZE;
    getLabel?(): string {
        throw new Error('Method not implemented.');
    }

    focus(): void {
        this._elementRef.nativeElement.focus();
        console.log('focused, do somethiing here like opening header');
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
        this._setAttributeToHostElement('tabindex', 0);
        if (this.background) {
            this._setBackgroundStyles(this.background);
        }

        if (this.size) {
            this._setSize(this.size);
        }
    }

    _setBackgroundStyles(background: BACKGROUND_TYPE): any {
        switch (background) {
            case 'transparent':
                this._addClassNameToHostElement(CLASS_NAME.dynamicPageTitleAreaTransparentBg);
                break;
            case 'list':
            case 'solid':
            default:
                this._removeClassNameToHostElement(CLASS_NAME.dynamicPageTitleAreaTransparentBg);
                break;
        }
    }

    _setSize(sizeType: RESPONSIVE_SIZE): any {
        switch (sizeType) {
            case 'small':
                this._addClassNameToHostElement(CLASS_NAME.dynamicPageTitleAreaSmall);
                break;
            case 'medium':
                this._addClassNameToHostElement(CLASS_NAME.dynamicPageTitleAreaMedium);
                break;
            case 'large':
                this._addClassNameToHostElement(CLASS_NAME.dynamicPageTitleAreaLarge);
                break;
            case 'extra-large':
            default:
                this._addClassNameToHostElement(CLASS_NAME.dynamicPageTitleAreaExtraLarge);
                break;
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
    /**@hidden */
    private _setAttributeToHostElement(attribute: string, value: any): void {
        this._renderer.setAttribute(this._elementRef.nativeElement, attribute, value);
    }
}
