import { PopupController as IPopupController, RecordingState } from '../types/index.js';
/**
 * Popup UI controller for recording controls and status display
 * Manages user interactions and UI state updates
 */
export declare class PopupController implements IPopupController {
    private uiState;
    private startButton?;
    private stopButton?;
    private statusElement?;
    private durationElement?;
    private errorElement?;
    private timerId;
    private recordingStartedAt;
    constructor();
    updateRecordingState(state: RecordingState): void;
    updateRecordingDuration(duration: number): void;
    showError(message: string): void;
    hideError(): void;
    handleStartRecording(): Promise<void>;
    handleStopRecording(): Promise<void>;
    handlePauseRecording(): Promise<void>;
    handleResumeRecording(): Promise<void>;
    private initializeElements;
    private setupEventListeners;
    private handleMessage;
    private syncRecordingState;
    private requestRecordingStatus;
    private parseRecordingStatus;
    private applyRecordingStatus;
    private startTimer;
    private stopTimer;
    private getStatusText;
    private formatDuration;
}
//# sourceMappingURL=PopupController.d.ts.map