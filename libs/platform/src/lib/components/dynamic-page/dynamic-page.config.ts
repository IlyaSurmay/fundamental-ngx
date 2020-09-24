import { Injectable } from '@angular/core';

import { PlatformConfig } from '../../platform.config';
import { ContentDensity } from '../form/form-control';

/**
 * Default options for platform dynamic-page
 */
@Injectable({ providedIn: 'root' })
export class DynamicPageConfig {
    /**
     * ARIA label for button when the Dynamic Page is collapsed
     */
    expandLabel = 'Expand Header';

    /**
     * ARIA label for button when the Panel is expanded
     */
    collapseLabel = 'Collapse Header';

    /**
     * Content Density of element. 'cozy' | 'compact'
     */
    // contentDensity: ContentDensity;

    /**
     * Create Provider factory function
     */
    static createProviderFactory(
        obj: Partial<DynamicPageConfig>
    ): (platformConfig: PlatformConfig) => DynamicPageConfig {
        const useFactory = (platformConfig: PlatformConfig): DynamicPageConfig => {
            return Object.assign(new DynamicPageConfig(platformConfig), obj);
        };
        return useFactory;
    }

    constructor(platformConfig: PlatformConfig) {
        // this.contentDensity = platformConfig.contentDensity;
    }
}
