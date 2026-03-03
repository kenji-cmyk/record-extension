/**
 * Service worker manager for Chrome extension lifecycle
 * Handles extension installation, offscreen document management, and message routing
 */
export class ServiceWorkerManager {
    async handleExtensionInstall() {
        // Implementation will be added in subsequent tasks
        throw new Error('Not implemented yet');
    }
    async createOffscreenDocument() {
        // Implementation will be added in subsequent tasks
        throw new Error('Not implemented yet');
    }
    async handleMessage(message) {
        // Implementation will be added in subsequent tasks
        throw new Error('Not implemented yet');
    }
    async updateExtensionIcon(recording) {
        const iconPath = recording ? '/icons/recording.png' : '/icons/not-recording.png';
        await chrome.action.setIcon({ path: iconPath });
    }
    async getCurrentTab() {
        const [tab] = await chrome.tabs.query({
            active: true,
            currentWindow: true,
        });
        return tab;
    }
    canRecordTab(tab) {
        if (!tab || !tab.url)
            return false;
        return !tab.url.startsWith('chrome://') &&
            !tab.url.startsWith('chrome-extension://');
    }
}
//# sourceMappingURL=ServiceWorkerManager.js.map