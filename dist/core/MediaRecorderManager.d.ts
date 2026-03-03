import { MediaRecorderManager as IMediaRecorderManager, RecordingOptions } from '../types/index.js';
/**
 * Manages MediaRecorder API for recording and exporting audio files
 * Supports WebM and MP3 formats with configurable quality settings
 */
export declare class WebMRecorderManager implements IMediaRecorderManager {
    private mediaRecorder?;
    private recordedChunks;
    startRecording(stream: MediaStream, options: RecordingOptions): void;
    pauseRecording(): void;
    resumeRecording(): void;
    stopRecording(): Promise<Blob>;
    getRecordedData(): Blob[];
    private getAudioBitrate;
    private getMimeType;
}
//# sourceMappingURL=MediaRecorderManager.d.ts.map