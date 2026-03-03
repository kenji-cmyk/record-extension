import { RecordingState } from '../types/index.js';
/**
 * Main controller that orchestrates the entire recording process
 * Integrates all components: permissions, audio capture, mixing, and recording
 */
export class RecordingController {
    constructor(permissionManager, audioCaptureManager, audioMixer, mediaRecorderManager, errorHandler) {
        this.currentState = RecordingState.IDLE;
        this.pausedDuration = 0;
        this.permissionManager = permissionManager;
        this.audioCaptureManager = audioCaptureManager;
        this.audioMixer = audioMixer;
        this.mediaRecorderManager = mediaRecorderManager;
        this.errorHandler = errorHandler;
    }
    async startRecording(options) {
        // Implementation will be added in subsequent tasks
        throw new Error('Not implemented yet');
    }
    async pauseRecording() {
        // Implementation will be added in subsequent tasks
        throw new Error('Not implemented yet');
    }
    async resumeRecording() {
        // Implementation will be added in subsequent tasks
        throw new Error('Not implemented yet');
    }
    async stopRecording() {
        // Implementation will be added in subsequent tasks
        throw new Error('Not implemented yet');
    }
    getRecordingState() {
        return this.currentState;
    }
    getRecordingDuration() {
        if (!this.startTime)
            return 0;
        const now = new Date();
        const elapsed = now.getTime() - this.startTime.getTime();
        return elapsed - this.pausedDuration;
    }
}
//# sourceMappingURL=RecordingController.js.map