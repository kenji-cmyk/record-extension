import { ErrorHandler as IErrorHandler, PermissionError, RecordingError, AudioMixer } from '../types/index.js';
/**
 * Comprehensive error handling system with graceful degradation
 * Manages recovery strategies and user communication
 */
export declare class ErrorHandler implements IErrorHandler {
    private audioMixer;
    constructor(audioMixer: AudioMixer);
    handlePermissionError(error: PermissionError): Promise<void>;
    handleStreamInterruption(streamId: string): Promise<void>;
    handleRecordingError(error: RecordingError): Promise<void>;
    private continueWithSystemAudioOnly;
    private fallbackToTabCapture;
    private continueRecording;
    private stopRecordingWithError;
    private showUserNotification;
}
//# sourceMappingURL=ErrorHandler.d.ts.map