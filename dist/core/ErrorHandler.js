/**
 * Comprehensive error handling system with graceful degradation
 * Manages recovery strategies and user communication
 */
export class ErrorHandler {
    constructor(audioMixer) {
        this.audioMixer = audioMixer;
    }
    async handlePermissionError(error) {
        // Implementation will be added in subsequent tasks
        throw new Error('Not implemented yet');
    }
    async handleStreamInterruption(streamId) {
        // Implementation will be added in subsequent tasks
        throw new Error('Not implemented yet');
    }
    async handleRecordingError(error) {
        // Implementation will be added in subsequent tasks
        throw new Error('Not implemented yet');
    }
    async continueWithSystemAudioOnly() {
        // Implementation will be added in subsequent tasks
        console.log('Continuing with system audio only');
    }
    async fallbackToTabCapture() {
        // Implementation will be added in subsequent tasks
        console.log('Falling back to tab capture');
    }
    continueRecording() {
        // Implementation will be added in subsequent tasks
        console.log('Continuing recording with remaining streams');
    }
    stopRecordingWithError(message) {
        // Implementation will be added in subsequent tasks
        console.error('Stopping recording due to error:', message);
    }
    showUserNotification(message) {
        // Implementation will be added in subsequent tasks
        console.log('User notification:', message);
    }
}
//# sourceMappingURL=ErrorHandler.js.map