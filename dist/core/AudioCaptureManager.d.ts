import { AudioCaptureManager as IAudioCaptureManager, AudioSource } from '../types/index.js';
/**
 * Captures audio from the active browser tab only.
 */
export declare class AudioCaptureManager implements IAudioCaptureManager {
    private audioSources;
    initializeTabCapture(streamId: string): Promise<MediaStream>;
    releaseAllStreams(): void;
    getAvailableAudioSources(): AudioSource[];
    private generateSourceId;
}
//# sourceMappingURL=AudioCaptureManager.d.ts.map