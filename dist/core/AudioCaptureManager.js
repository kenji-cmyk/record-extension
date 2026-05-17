/**
 * Captures audio from the active browser tab only.
 */
export class AudioCaptureManager {
    constructor() {
        this.audioSources = new Map();
    }
    async initializeTabCapture(streamId) {
        if (!streamId) {
            throw new Error('Missing tab capture stream id.');
        }
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: {
                mandatory: {
                    chromeMediaSource: 'tab',
                    chromeMediaSourceId: streamId
                }
            },
            video: false
        });
        const source = {
            id: this.generateSourceId(),
            type: 'tab',
            name: 'Current tab',
            stream,
            isActive: true
        };
        this.audioSources.set(source.id, source);
        return stream;
    }
    releaseAllStreams() {
        this.audioSources.forEach((source) => {
            source.stream.getTracks().forEach((track) => track.stop());
        });
        this.audioSources.clear();
    }
    getAvailableAudioSources() {
        return Array.from(this.audioSources.values());
    }
    generateSourceId() {
        return `source_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
}
//# sourceMappingURL=AudioCaptureManager.js.map