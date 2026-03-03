import { AudioMixer as IAudioMixer, AudioSource } from '../types/index.js';
/**
 * Web Audio API-based mixer for combining multiple audio streams
 * Handles volume control and real-time audio processing
 */
export declare class WebAudioMixer implements IAudioMixer {
    private audioContext;
    private destination;
    private sources;
    constructor();
    addAudioSource(source: AudioSource): void;
    removeAudioSource(sourceId: string): void;
    setSourceVolume(sourceId: string, volume: number): void;
    getMixedStream(): MediaStream;
    getAudioContext(): AudioContext;
    dispose(): void;
}
//# sourceMappingURL=AudioMixer.d.ts.map