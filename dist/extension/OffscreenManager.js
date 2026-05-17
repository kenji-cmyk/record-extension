import { AudioQuality, RecordingState } from '../types/index.js';
/**
 * Offscreen document manager for background audio processing
 * Handles audio capture and recording operations in offscreen context
 */
export class OffscreenManager {
    constructor(recordingController) {
        this.recordingController = recordingController;
    }
    async initializeAudioProcessing() {
        await Promise.resolve();
    }
    async handleRecordingRequest(streamId) {
        if (!this.recordingController) {
            throw new Error('Recording controller is not available.');
        }
        try {
            await this.recordingController.startRecording(this.getDefaultRecordingOptions(streamId));
            this.recordingStartedAt = Date.now();
            window.location.hash = 'recording';
            this.sendMessageToServiceWorker('update-icon', { recording: true });
            this.sendMessageToPopup('recording-started', this.getRecordingStatus());
        }
        catch (error) {
            this.recordingStartedAt = undefined;
            const message = error instanceof Error ? error.message : 'Unable to start recording.';
            this.sendMessageToPopup('recording-error', undefined, message);
            this.sendMessageToServiceWorker('update-icon', { recording: false });
        }
    }
    async stopRecording() {
        if (!this.recordingController)
            return;
        try {
            const blob = await this.recordingController.stopRecording();
            this.downloadRecording(blob);
            this.recordingStartedAt = undefined;
            window.location.hash = '';
            this.sendMessageToServiceWorker('recording-stopped');
            this.sendMessageToPopup('recording-stopped');
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Unable to stop recording.';
            this.sendMessageToPopup('recording-error', undefined, message);
        }
    }
    getRecordingStatus() {
        const state = this.recordingController?.getRecordingState() ?? RecordingState.IDLE;
        const isRecording = state === RecordingState.RECORDING || state === RecordingState.PAUSED || state === RecordingState.STARTING;
        const duration = this.recordingStartedAt ? Date.now() - this.recordingStartedAt : 0;
        return {
            state,
            isRecording,
            ...(this.recordingStartedAt ? { startedAt: this.recordingStartedAt } : {}),
            duration
        };
    }
    async cleanup() {
        if (this.recordingController?.getRecordingState() !== 'idle') {
            await this.recordingController?.stopRecording();
        }
        this.recordingStartedAt = undefined;
    }
    getDefaultRecordingOptions(streamId) {
        return {
            streamId,
            audioQuality: AudioQuality.HIGH,
            outputFormat: 'webm'
        };
    }
    downloadRecording(blob) {
        if (blob.size === 0)
            return;
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `tab-recording-${new Date().toISOString().replace(/[:.]/g, '-')}.webm`;
        link.click();
        URL.revokeObjectURL(url);
    }
    sendMessageToServiceWorker(type, data) {
        chrome.runtime.sendMessage({
            type,
            target: 'service-worker',
            ...(typeof data === 'object' && data !== null ? data : { data })
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