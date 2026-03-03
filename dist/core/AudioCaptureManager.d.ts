import { AudioCaptureManager as IAudioCaptureManager, AudioSource } from '../types/index.js';
/**
 * Manages audio capture from multiple sources: system audio, microphone, and tab capture
 * Implements primary getDisplayMedia approach with tabCapture fallback
 */
export declare class AudioCaptureManager implements IAudioCaptureManager {
    private audioSources;
    initializeSystemAudio(): Promise<MediaStream>;
    initializeMicrophone(): Promise<MediaStream>;
    initializeTabCapture(): Promise<MediaStream[]>;
    releaseAllStreams(): void;
    getAvailableAudioSources(): AudioSource[];
    private generateSourceId;
}
//# sourceMappingURL=AudioCaptureManager.d.ts.map