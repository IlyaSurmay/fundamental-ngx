import { Injectable } from '@angular/core';
import { PlatformConfig } from '../../platform.config';

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
