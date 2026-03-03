/**
 * Manages audio capture from multiple sources: system audio, microphone, and tab capture
 * Implements primary getDisplayMedia approach with tabCapture fallback
 */
export class AudioCaptureManager {
    constructor() {
        this.audioSources = new Map();
    }
    async initializeSystemAudio() {
        // Implementation will be added in subsequent tasks
        throw new Error('Not implemented yet');
    }
    async initializeMicrophone() {
        // Implementation will be added in subsequent tasks
        throw new Error('Not implemented yet');
    }
    async initializeTabCapture() {
        // Implementation will be added in subsequent tasks
        throw new Error('Not implemented yet');
    }
    releaseAllStreams() {
        // Implementation will be added in subsequent tasks
        throw new Error('Not implemented yet');
    }
    getAvailableAudioSources() {
        return Array.from(this.audioSources.values());
    }
    generateSourceId() {
        return `source_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
}
//# sourceMappingURL=AudioCaptureManager.js.map