import { Component } from '@angular/core';
import { ExampleFile } from '../../../documentation/core-helpers/code-example/example-file';

import * as basicVhdHtml from '!raw-loader!./platform-vhd-examples/platform-vhd-basic-example.component.html';
import * as basicVhdTs from '!raw-loader!./platform-vhd-examples/platform-vhd-basic-example.component.ts';

import * as tokenVhdHtml from '!raw-loader!./platform-vhd-examples/platform-vhd-token-example.component.html';
import * as tokenVhdTs from '!raw-loader!./platform-vhd-examples/platform-vhd-token-example.component.ts';

import * as filtersVhdHtml from '!raw-loader!./platform-vhd-examples/platform-vhd-filters-example.component.html';
import * as filtersVhdTs from '!raw-loader!./platform-vhd-examples/platform-vhd-filters-example.component.ts';

import * as inputVhdHtml from '!raw-loader!./platform-vhd-examples/platform-vhd-input-example.component.html';
import * as inputVhdTs from '!raw-loader!./platform-vhd-examples/platform-vhd-input-example.component.ts';

import * as multiInputVhdHtml from '!raw-loader!./platform-vhd-examples/platform-vhd-multi-input-example.component.html';
import * as multiInputVhdTs from '!raw-loader!./platform-vhd-examples/platform-vhd-multi-input-example.component.ts';

import * as mobileVhdHtml from '!raw-loader!./platform-vhd-examples/platform-vhd-mobile-example.component.html';
import * as mobileVhdTs from '!raw-loader!./platform-vhd-examples/platform-vhd-mobile-example.component.ts';

@Component({
    selector: 'app-platform-vhd',
    templateUrl: './platform-vhd.docs.component.html',

})
export class PlatformVhdDocsComponent {

    basicValueHelpDialog: ExampleFile[] = [
        {
            language: 'html',
            code: basicVhdHtml,
            fileName: 'platform-vhd-basic-example'
        },
        {
            language: 'typescript',
            component: 'PlatformVhdBasicExampleComponent',
            code: basicVhdTs,
            fileName: 'platform-vhd-basic-example'
        }
    ];

    strategyLabelValueHelpDialog: ExampleFile[] = [
        {
            language: 'html',
            code: basicVhdHtml,
            fileName: 'platform-vhd-strategy-label-example'
        },
        {
            language: 'typescript',
            component: 'PlatformVhdStrategyLabelExampleComponent',
            code: basicVhdTs,
            fileName: 'platform-vhd-strategy-label-example'
        }
    ];

    tokenValueHelpDialog: ExampleFile[] = [
        {
            language: 'html',
            code: tokenVhdHtml,
            fileName: 'platform-vhd-token-example'
        },
        {
            language: 'typescript',
            component: 'PlatformVhdTokenExampleComponent',
            code: tokenVhdTs,
            fileName: 'platform-vhd-token-example'
        }
    ];

    filtersValueHelpDialog: ExampleFile[] = [
        {
            language: 'html',
            code: filtersVhdHtml,
            fileName: 'platform-vhd-filters-example'
        },
        {
            language: 'typescript',
            component: 'PlatformVhdFiltersExampleComponent',
            code: filtersVhdTs,
            fileName: 'platform-vhd-filters-example'
        }
    ];

    inputValueHelpDialog: ExampleFile[] = [
        {
            language: 'html',
            code: inputVhdHtml,
            fileName: 'platform-vhd-multi-input-example'
        },
        {
            language: 'typescript',
            component: 'PlatformVhdMultiInputExampleComponent',
            code: inputVhdTs,
            fileName: 'platform-vhd-multi-input-example'
        }
    ];

    multiInputValueHelpDialog: ExampleFile[] = [
        {
            language: 'html',
            code: multiInputVhdHtml,
            fileName: 'platform-vhd-multi-input-example'
        },
        {
            language: 'typescript',
            component: 'PlatformVhdMultiInputExampleComponent',
            code: multiInputVhdTs,
            fileName: 'platform-vhd-multi-input-example'
        }
    ];

    mobileValueHelpDialog: ExampleFile[] = [
        {
            language: 'html',
            code: mobileVhdHtml,
            fileName: 'platform-vhd-multi-input-example'
        },
        {
            language: 'typescript',
            component: 'PlatformVhdMultiInputExampleComponent',
            code: mobileVhdTs,
            fileName: 'platform-vhd-multi-input-example'
        }
    ];
}
