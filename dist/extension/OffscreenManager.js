import { AudioQuality } from '../types/index.js';
/**
 * Offscreen document manager for background audio processing
 * Handles audio capture and recording operations in offscreen context
 */
export class OffscreenManager {
    constructor(recordingController) {
        this.recordingController = recordingController;
    }
    async initializeAudioProcessing() {
        // Implementation will be added in subsequent tasks
        throw new Error('Not implemented yet');
    }
    async handleRecordingRequest(streamId) {
        // Implementation will be added in subsequent tasks
        throw new Error('Not implemented yet');
    }
    async cleanup() {
        // Implementation will be added in subsequent tasks
        throw new Error('Not implemented yet');
    }
    getDefaultRecordingOptions() {
        return {
            includeSystemAudio: true,
            includeMicrophone: true,
            audioQuality: AudioQuality.HIGH,
            outputFormat: 'webm'
        };
    }
    sendMessageToServiceWorker(type, data) {
        chrome.runtime.sendMessage({
            type,
            target: 'service-worker',
            data
        });
    }
    sendMessageToPopup(type, data, error) {
        chrome.runtime.sendMessage({
            type,
            target: 'popup',
            data,
            error
        });
    }
}
//# sourceMappingURL=OffscreenManager.js.map