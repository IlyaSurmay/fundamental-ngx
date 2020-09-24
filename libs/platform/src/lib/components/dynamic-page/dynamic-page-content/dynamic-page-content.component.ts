import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    ElementRef,
    Renderer2,
    forwardRef,
    Input,
    ViewChild,
    AfterViewInit,
    NgZone,
    ContentChild,
    TemplateRef,
    HostBinding,
    HostListener
} from '@angular/core';

import { CLASS_NAME, DYNAMIC_PAGE_CHILD_TOKEN } from '../constants';
import { ScrollDispatcher, CdkScrollable } from '@angular/cdk/scrolling';
import { DynamicPageService } from '../dynamic-page.service';
import { fromEvent } from 'rxjs';
import { throttleTime, map, pairwise, distinctUntilChanged, share, filter } from 'rxjs/operators';
import { trigger, state, style, transition, animate } from '@angular/animations';
enum VisibilityState {
    Visible = 'visible',
    Hidden = 'hidden'
}

enum Direction {
    Up = 'Up',
    Down = 'Down'
}
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
    // animations: [
    //     trigger('toggle', [
    //         state(VisibilityState.Hidden, style({ opacity: 0, transform: 'translateY(-100%)' })),
    //         state(VisibilityState.Visible, style({ opacity: 1, transform: 'translateY(0)' })),
    //         transition('* => *', animate('200ms ease-in'))
    //     ])
    // ]
})
export class DynamicPageContentComponent extends CdkScrollable implements OnInit, AfterViewInit {
    @Input()
    tabLabel: string;

    @ViewChild(CdkScrollable)
    cdkScrollable: CdkScrollable;

    toggledVal = false;

    @ViewChild('dynPage')
    dynPage: ElementRef;
    isVisible = true;

    /** @hidden */
    @ViewChild(TemplateRef)
    contentTemplateRef: TemplateRef<any>;

    constructor(
        private _elementRef: ElementRef<HTMLElement>,
        private _renderer: Renderer2,
        public scrollDispatcher: ScrollDispatcher,
        private zone: NgZone,
        private _dynamicPageService: DynamicPageService
    ) {
        super(_elementRef, scrollDispatcher, zone);
        // this._setAttributeToHostElement('cdkScrollable', '');
        // this.scrollDispatcher.register(this.scrollable);
        this._dynamicPageService.$toggle.subscribe((val) => {
            console.log('subscriibied to dyn page serviicee in content' + val);
            this.toggledVal = val;
        });
        // this.scrollDispatcher.scrolled().subscribe((cdk: CdkScrollable) => {
        //     this.zone.run(() => {
        //         // Your update here!
        //         console.log('scrolled from ' + cdk.getElementRef().nativeElement.innerHTML);
        //         // improperly used, currently detecting doc scroll.
        //         // this._dynamicPageService.toggleHeader(!this.toggledVal);
        //     });
        // });
    }

    ngOnInit(): void {
        this._addClassNameToHostElement(CLASS_NAME.dynamicPageContent);
        this._addClassNameToHostElement(CLASS_NAME.dynamicPageContentExtraLarge);
        if (this.tabLabel) {
            // add tabbed content
            // todo add to the fd-tab class properly
            // this._addClassNameToHostElement(CLASS_NAME.dynamicPageTabs);
            this._removeClassNameToHostElement(CLASS_NAME.dynamicPageContent);
            // this._addClassNameToHostElement(CLASS_NAME.dynamicPageTabsExtraLarge);
            // this._removeClassNameToHostElement(CLASS_NAME.dynamicPageContentExtraLarge);

            // this._setStyleToHostElement('overflow', 'scroll');
        }
    }

    ngAfterViewInit(): void {
        // this.scrollDispatcher.register(this.cdkScrollable);
        // console.log('has?' + this.scrollDispatcher.scrollContainers.has(this.cdkScrollable));
        // this.scrollDispatcher.scrolled(100).subscribe((cdk: CdkScrollable) => {
        //     this.zone.run(() => {
        //         // Your update here!
        //         console.log('scrolled' + cdk);
        //         // improperly used, currently detecting doc scroll.
        //         const scrollPosition = cdk.getElementRef().nativeElement.scrollTop;
        //         console.log(scrollPosition);
        //         this._dynamicPageService.toggleHeader(!this.toggledVal);
        //     });
        // });
        // this.scrollDispatcher.
        // this.scrollDispatcher.scrolled().subscribe((cdk: CdkScrollable) => {
        //     this.zone.run(() => {
        //         // Your update here!
        //         console.log('scrolled');
        //     });
        // });
        // this.scrollable.elementScrolled().subscribe((scrolled) => console.log('scrolled', scrolled));
        // this.scrollable.elementScrolled().subscribe((scrolled) => {
        //     this.zone.run(() => {
        //         // Your update here!
        //         console.log('scrolled');
        //         // improperly used, currently detecting doc scroll.
        //     });
        // });
        console.log('in after viieiw');
        // const scroll$ = fromEvent(window, 'scroll').pipe(
        //     throttleTime(10),
        //     map(() => window.pageYOffset),
        //     pairwise(),
        //     map(([y1, y2]): Direction => (y2 < y1 ? Direction.Up : Direction.Down)),
        //     distinctUntilChanged(),
        //     share()
        // );

        // const scrollUp$ = scroll$.pipe(filter((direction) => direction === Direction.Up));

        // const scrollDown = scroll$.pipe(filter((direction) => direction === Direction.Down));

        // scrollUp$.subscribe(() => {
        //     console.log('UPPPP');
        //     this.isVisible = true;
        //     this._dynamicPageService.toggleHeader(!this.toggledVal);
        // });
        // scrollDown.subscribe(() => (this.isVisible = false));

        // this works in parent scroll
        // this.zone.run(() => {
        //     const content = document.querySelector('.fd-dynamic-page__content');

        //     const scroll$ = fromEvent(content, 'scroll').pipe(
        //         throttleTime(10),
        //         map(() => content.scrollTop),
        //         pairwise(),
        //         map(([y1, y2]): Direction => (y2 < y1 ? Direction.Up : Direction.Down)),
        //         distinctUntilChanged(),
        //         share()
        //     );
        //     const scrollUp$ = scroll$.pipe(filter((direction) => direction === Direction.Up));
        //     const scrollDown$ = scroll$.pipe(filter((direction) => direction === Direction.Down));
        //     scrollUp$.subscribe(() => {
        //         console.log('UPPPP');
        //         this.isVisible = true;
        //         this._dynamicPageService.toggleHeader(!this.toggledVal);
        //     });
        //     scrollDown$.subscribe(() => (this.isVisible = false));
        //     console.log(scroll$);
        // });
    }
    // @HostBinding('@toggle')
    // get toggle(): VisibilityState {
    //     return this.isVisible ? VisibilityState.Visible : VisibilityState.Hidden;
    // }

    // @HostListener('scroll', ['$event'])
    // onElementScroll($event): void {
    //     console.log('scrollinig');
    // }

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
    /**@hidden */
    private _setStyleToHostElement(attribute: string, value: any): void {
        this._renderer.setStyle(this._elementRef.nativeElement, attribute, value);
    }
}
