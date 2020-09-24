import { InjectionToken } from '@angular/core';

export const CLASS_NAME = {
    dynamicPage: 'fd-dynamic-page',
    dynamicPageTitleArea: 'fd-dynamic-page__title-area',
    dynamicPageTitleAreaSmall: 'fd-dynamic-page__title-area--s',
    dynamicPageTitleAreaMedium: 'fd-dynamic-page__title-area--m',
    dynamicPageTitleAreaLarge: 'fd-dynamic-page__title-area--l',
    dynamicPageTitleAreaExtraLarge: 'fd-dynamic-page__title-area--xl',
    dynamicPageTitleContainer: 'fd-dynamic-page__title-container',
    dynamicPageTitle: 'fd-dynamic-page__title',
    dynamicPageKeyInfo: 'fd-dynamic-page__title-content',
    dynamicPageSubtitle: 'fd-dynamic-page__header',
    dynamicPageGlobalActions: 'fd-dynamic-page__toolbar',
    dynamicPageLayoutActions: 'fd-dynamic-page__toolbar--actions',
    dynamicPageHeader: 'fd-dynamic-page__header',
    dynamicPageHeaderExtraLarge: 'fd-dynamic-page__header--xl',
    dynamicPageTabs: 'fd-dynamic-page__tabs',
    dynamicPageTabsAddShadow: 'fd-dynamic-page__tabs--add-shadow',
    dynamicPageTabsExtraLarge: 'fd-dynamic-page__tabs--xl',
    dynamicPageContent: 'fd-dynamic-page__content',
    dynamicPageContentExtraLarge: 'fd-dynamic-page__content--xl'
} as const;

export const DYNAMIC_PAGE_CHILD_TOKEN = new InjectionToken<string>('DYNAMIC_PAGE_CHILD_TOKEN');
