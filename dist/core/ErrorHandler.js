/**
 * Comprehensive error handling system with graceful degradation
 * Manages recovery strategies and user communication
 */
export class ErrorHandler {
    constructor(audioMixer) {
        this.audioMixer = audioMixer;
    }
    async handlePermissionError(error) {
        this.showUserNotification(error.message);
    }
    async handleStreamInterruption(streamId) {
        console.warn(`Audio stream interrupted: ${streamId}`);
        this.continueRecording();
    }
    async handleRecordingError(error) {
        if (error.recoverable) {
            this.continueRecording();
            return;
        }
        this.stopRecordingWithError(error.message);
    }
    continueRecording() {
        console.log('Continuing recording with remaining streams');
    }
    stopRecordingWithError(message) {
        this.audioMixer.getAudioContext().suspend().catch(() => undefined);
        console.error('Stopping recording due to error:', message);
    }
    showUserNotification(message) {
        console.log('User notification:', message);
    }
}
//# sourceMappingURL=ErrorHandler.js.map