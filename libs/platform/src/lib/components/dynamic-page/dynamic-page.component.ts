import { CdkScrollable, ScrollDispatcher } from '@angular/cdk/overlay';
import {
    AfterContentInit,
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ContentChild,
    ContentChildren,
    ElementRef,
    NgZone,
    OnInit,
    QueryList,
    Renderer2,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { TabListComponent } from '@fundamental-ngx/core';
import { startWith } from 'rxjs/operators';
import { BaseComponent } from '../base';
import { CLASS_NAME } from './constants';
import { DynamicPageContentComponent } from './dynamic-page-content/dynamic-page-content.component';
import { DynamicPageService } from './dynamic-page.service';

@Component({
    selector: 'fdp-dynamic-page',
    templateUrl: './dynamic-page.component.html',
    styleUrls: ['./dynamic-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [DynamicPageService]
})
export class DynamicPageComponent extends BaseComponent implements OnInit, AfterContentInit, AfterViewInit {
    @ContentChildren(DynamicPageContentComponent)
    pageContent: QueryList<DynamicPageContentComponent>;

    toggledVal = false;

    _tabs: DynamicPageContentComponent[] = [];
    _content: DynamicPageContentComponent[] = [];

    isTabbed = false;

    @ViewChild(DynamicPageContentComponent)
    _userContent: DynamicPageContentComponent;

    @ContentChild(DynamicPageContentComponent) _childcontent: DynamicPageContentComponent;

    /** Reference to the CdkScrollable instance that wraps the scrollable content. */
    get scrollable(): CdkScrollable {
        return this._userContent || this._childcontent;
    }
    @ViewChild('dynPage')
    childDiv: ElementRef;

    isVisible = true;

    /** @hidden */
    @ContentChild(TabListComponent)
    tabList: TabListComponent; // for adding shadow styles

    /** @hidden */
    @ContentChild(TabListComponent, { read: ElementRef })
    set tabListElementRef(tabListComponentElementRef: ElementRef<HTMLElement>) {
        this._setTabListElementClass(tabListComponentElementRef?.nativeElement);
    }

    /** @hidden */
    constructor(
        protected _cd: ChangeDetectorRef,
        private _elementRef: ElementRef<HTMLElement>,
        private _renderer: Renderer2,
        private _dynamicPageService: DynamicPageService,
        private scrollDispatcher: ScrollDispatcher,
        private zone: NgZone
    ) {
        super(_cd);
        this._dynamicPageService.$toggle.subscribe((val) => {
            console.log('subscriibied to dyn page serviicee' + val);
            this.toggledVal = val;
        });
    }

    /** @hidden */
    ngOnInit(): void {
        this._addClassNameToHostElement(CLASS_NAME.dynamicPage);
        if (this.isTabbed) {
            // this.scrollDispatcher.scrolled().subscribe((scrollable: CdkScrollable) => {
            //     if (scrollable) {
            //         console.log('Scroll occurred, from:');
            //         console.log(scrollable.getElementRef().nativeElement);
            //     }
            // });
        }
    }

    /** @hidden */
    ngAfterContentInit(): void {
        this._listenToChildrenQueryListChanges();
    }

    ngAfterViewInit(): void {
        // this.scrollDispatcher.ancestorScrolled(this.childDiv).subscribe((scrollable: CdkScrollable) => {
        //     if (scrollable) {
        //         console.log('The ancestor has scrolled, from:');
        //         console.log(scrollable.getElementRef().nativeElement);
        //     }
        // });

        if (this.isTabbed) {
            // Get all the information about the scrolling component registered in the ScrollDispatcher
            console.log('tabbed');

            console.log(this.scrollDispatcher.scrollContainers);
            const scrollContainers = this.scrollDispatcher.getAncestorScrollContainers(this.scrollable.getElementRef());
            // const scrollableElementIds = scrollContainers.map(
            const scrollableElements = scrollContainers.map(
                // (scrollable) => (scrollable === this.scrollable)? scrollable.getElementRef().nativeElement.id
                (scrollable) => (scrollable !== this.scrollable ? scrollable : undefined)
            );
            console.log('ancestor');
            // gettinig the iincorrect scrollable here.. what changed?
            console.log(scrollableElements);
            // scrollableElements.forEach((element) => {
            //     if (element !== this.scrollable) {
            //         console.log('deregisteerring ' + element.getElementRef().nativeElement.id);

            //         this.scrollDispatcher.deregister(element);
            //     }
            // });
            // this.zone.run(() => {
            //     const scroll$ = fromEvent(this.dynPage.nativeElement, 'scroll').pipe(
            //         throttleTime(10),
            //         map(() => this.dynPage.nativeElement.pageYOffset),
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
            // this.scrollDispatcher.register(this.scrollable);
            // console.log('has?' + this.scrollDispatcher.scrollContainers.has(this.scrollable));

            // console.log(this.scrollDispatcher.getAncestorScrollContainers(this.contentDyn));
            // this.scrollDispatcher.ancestorScrolled(this.contentDyn).subscribe((cdk: CdkScrollable) => {
            //     console.log(' parent scrolleed');
            // });
            // this.scrollable.elementScrolled().subscribe((scrolled) => {
            //     this.zone.run(() => {
            //         // Your update here!
            //         console.log('scrolled' + scrolled);
            //         // improperly used, currently detecting doc scroll.
            //     });
            // });
            // issue with scrolldispatcyer itself? read mat design

            this.scrollDispatcher.scrolled(10).subscribe((cdk: CdkScrollable) => {
                this.zone.run(() => {
                    // Your update here!
                    console.log('scrolled');
                    console.log(cdk);
                    // improperly used, currently detecting doc scroll.
                    const scrollPosition = cdk.getElementRef().nativeElement.scrollTop;
                    console.log(scrollPosition);
                    this._dynamicPageService.toggleHeader(!this.toggledVal);
                });
            });
            // fromEvent(this.dynPage.nativeElement, 'scroll')
            //     .pipe(
            //         throttleTime(10),
            //         map(() => window.pageYOffset),
            //         pairwise(),
            //         map(
            //             ([y1, y2]): Direction => {
            //                 return y2 < y1 ? Direction.Up : Direction.Down;
            //             }
            //         ),
            //         distinctUntilChanged(),
            //         share()
            //     )
            //     .subscribe((direction) => {
            //         this.isVisible = direction === Direction.Up;
            //         console.log('direction is ' + this.isVisible);
            //         this._cd.markForCheck();
            //     });
        }
    }

    toggleCollapse(): any {
        console.log('in parent to collapse title');
        this._dynamicPageService.toggleHeader(!this.toggledVal);
        // this.headerComponent.toggleCollapse();
    }

    /** @hidden */
    private _setTabListElementClass(tabListComponentElement: HTMLElement): void {
        if (!tabListComponentElement) {
            return;
        }
        const tabList = tabListComponentElement.querySelector('ul');
        this._renderer.addClass(tabList, CLASS_NAME.dynamicPageTabsAddShadow);
    }

    /** @hidden */
    private _listenToChildrenQueryListChanges(): void {
        this.pageContent.changes.pipe(startWith(this.pageContent)).subscribe(() => {
            this._createContent();
        });
    }

    /** @hidden */
    private _createContent(): void {
        const content = this.pageContent.toArray();

        // reset arrays
        this._tabs = [];
        this._content = [];

        if (content) {
            content.forEach((contentItem, index) => {
                if (!contentItem.tabLabel) {
                    // return;
                    this.isTabbed = false;
                    this._content.push(contentItem);
                } else {
                    this.isTabbed = true;
                    this._tabs.push(contentItem);
                }
            });
            console.log(this._tabs.length);
        }
    }

    /**@hidden */
    private _addClassNameToHostElement(className: string): void {
        this._renderer.addClass(this._elementRef.nativeElement, className);
    }
    /**@hidden */
    private _addClassNameToTabElement(className: string): void {
        this._renderer.addClass(this._elementRef.nativeElement, className);
    }
    /**@hidden */
    private _removeClassNameToHostElement(className: string): void {
        this._renderer.removeClass(this._elementRef.nativeElement, className);
    }
}

// add shadow to tabs
