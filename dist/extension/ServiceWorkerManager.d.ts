import { ServiceWorkerManager as IServiceWorkerManager, ExtensionMessage } from '../types/index.js';
/**
 * Service worker manager for Chrome extension lifecycle
 * Handles extension installation, offscreen document management, and message routing
 */
export declare class ServiceWorkerManager implements IServiceWorkerManager {
    handleExtensionInstall(): Promise<void>;
    createOffscreenDocument(): Promise<void>;
    handleMessage(message: ExtensionMessage): Promise<void>;
    private updateExtensionIcon;
    private getCurrentTab;
    private canRecordTab;
}
//# sourceMappingURL=ServiceWorkerManager.d.ts.map