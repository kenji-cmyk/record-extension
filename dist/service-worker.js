import { ServiceWorkerManager } from './extension/ServiceWorkerManager.js';
/**
 * Service worker entry point for Chrome extension
 * Handles extension lifecycle and message routing
 */
const serviceWorkerManager = new ServiceWorkerManager();
// Handle extension installation
chrome.runtime.onInstalled.addListener(async () => {
    try {
        await serviceWorkerManager.handleExtensionInstall();
    }
    catch (error) {
        console.error('Extension installation failed:', error);
    }
});
// Handle messages from popup and offscreen document
chrome.runtime.onMessage.addListener(async (message) => {
    if (message.target === 'service-worker') {
        try {
            await serviceWorkerManager.handleMessage(message);
        }
        catch (error) {
            console.error('Service worker message handling failed:', error);
        }
    }
});
//# sourceMappingURL=service-worker.js.map