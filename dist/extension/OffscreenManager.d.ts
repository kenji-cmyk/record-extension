import { OffscreenManager as IOffscreenManager, RecordingController, RecordingStatusSnapshot } from '../types/index.js';
/**
 * Offscreen document manager for background audio processing
 * Handles audio capture and recording operations in offscreen context
 */
export declare class OffscreenManager implements IOffscreenManager {
    private recordingController;
    private recordingStartedAt;
    constructor(recordingController: RecordingController | undefined);
    initializeAudioProcessing(): Promise<void>;
    handleRecordingRequest(streamId: string): Promise<void>;
    stopRecording(): Promise<void>;
    getRecordingStatus(): RecordingStatusSnapshot;
    cleanup(): Promise<void>;
    private getDefaultRecordingOptions;
    private downloadRecording;
    private sendMessageToServiceWorker;
    private sendMessageToPopup;
}
//# sourceMappingURL=OffscreenManager.d.ts.map