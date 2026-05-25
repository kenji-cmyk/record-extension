import { MediaRecorderManager as IMediaRecorderManager, RecordingOptions } from '../types/index.js';
/**
 * Manages MediaRecorder API for recording and exporting audio files
 * Supports compact M4A/AAC output with WebM/Opus fallback.
 */
export declare class WebMRecorderManager implements IMediaRecorderManager {
    private mediaRecorder;
    private recordedChunks;
    private stopPromise;
    private resolveStop;
    private rejectStop;
    private activeMimeType;
    startRecording(stream: MediaStream, options: RecordingOptions): void;
    pauseRecording(): void;
    resumeRecording(): void;
    stopRecording(): Promise<Blob>;
    getRecordedData(): Blob[];
    private getAudioBitrate;
    private selectSupportedMimeType;
    private getMimeTypeCandidates;
    private isMimeTypeSupported;
}
//# sourceMappingURL=MediaRecorderManager.d.ts.map