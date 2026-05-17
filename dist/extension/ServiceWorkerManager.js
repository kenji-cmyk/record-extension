/**
 * Service worker manager for Chrome extension lifecycle
 * Handles extension installation, offscreen document management, and message routing
 */
export class ServiceWorkerManager {
    async handleExtensionInstall() {
        await this.updateExtensionIcon(false);
    }
    async createOffscreenDocument() {
        if (await this.hasOffscreenDocument()) {
            return;
        }
        await chrome.offscreen.createDocument({
            url: 'offscreen.html',
            reasons: [chrome.offscreen.Reason.USER_MEDIA],
            justification: 'Capture and record audio from the active browser tab.'
        });
    }
    async handleMessage(message) {
        switch (message.type) {
            case 'request-recording':
                await this.startTabRecording();
                break;
            case 'stop-recording':
                chrome.runtime.sendMessage({
                    type: 'stop-recording',
                    target: 'offscreen'
                });
                break;
            case 'recording-stopped':
                await this.updateExtensionIcon(false);
                break;
            case 'update-icon':
                await this.updateExtensionIcon(Boolean(message.recording));
                break;
            default:
                console.warn('Unrecognized service worker message:', message.type);
        }
    }
    async startTabRecording() {
        const tab = await this.getCurrentTab();
        if (!tab || !tab.id || !this.canRecordTab(tab)) {
            this.sendPopupError('Cannot record this page. Open a regular web page and try again.');
            return;
        }
        try {
            await this.createOffscreenDocument();
            const streamId = await this.getTabCaptureStreamId(tab.id);
            chrome.runtime.sendMessage({
                type: 'start-recording',
                target: 'offscreen',
                data: streamId
            });
        }
        catch (error) {
            this.sendPopupError(error instanceof Error ? error.message : 'Unable to start tab recording.');
            await this.updateExtensionIcon(false);
        }
    }
    async hasOffscreenDocument() {
        const runtimeWithContexts = chrome.runtime;
        if (!runtimeWithContexts.getContexts) {
            return false;
        }
        const contexts = await runtimeWithContexts.getContexts({});
        return contexts.some((context) => context.contextType === 'OFFSCREEN_DOCUMENT');
    }
    sendPopupError(error) {
        chrome.runtime.sendMessage({
            type: 'recording-error',
            target: 'popup',
            error
        });
    }
    getTabCaptureStreamId(tabId) {
        return new Promise((resolve, reject) => {
            chrome.tabCapture.getMediaStreamId({ targetTabId: tabId }, (streamId) => {
                const runtimeError = chrome.runtime.lastError;
                if (runtimeError) {
                    reject(new Error(runtimeError.message ?? 'Unable to create tab capture stream.'));
                    return;
                }
                resolve(streamId);
            });
        });
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