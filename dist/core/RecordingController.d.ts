import { RecordingController as IRecordingController, RecordingOptions, RecordingState, AudioCaptureManager, AudioMixer, MediaRecorderManager, PermissionManager, ErrorHandler } from '../types/index.js';
/**
 * Main controller that orchestrates the entire recording process
 * Integrates all components: permissions, audio capture, mixing, and recording
 */
export declare class RecordingController implements IRecordingController {
    private audioCaptureManager;
    private audioMixer;
    private mediaRecorderManager;
    private errorHandler;
    private currentState;
    private startTime;
    private pausedDuration;
    constructor(permissionManager: PermissionManager, audioCaptureManager: AudioCaptureManager, audioMixer: AudioMixer, mediaRecorderManager: MediaRecorderManager, errorHandler: ErrorHandler);
    startRecording(options: RecordingOptions): Promise<void>;
    pauseRecording(): Promise<void>;
    resumeRecording(): Promise<void>;
    stopRecording(): Promise<Blob>;
    getRecordingState(): RecordingState;
    getRecordingDuration(): number;
}
//# sourceMappingURL=RecordingController.d.ts.map