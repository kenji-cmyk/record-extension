import { RecordingState } from '../types/index.js';
/**
 * Popup UI controller for recording controls and status display
 * Manages user interactions and UI state updates
 */
export class PopupController {
    constructor() {
        this.uiState = {
            isRecording: false,
            isPaused: false,
            duration: 0,
            audioSources: []
        };
        this.initializeElements();
        this.setupEventListeners();
    }
    updateRecordingState(state) {
        this.uiState.isRecording = state === RecordingState.RECORDING;
        this.uiState.isPaused = state === RecordingState.PAUSED;
        this.startButton?.toggleAttribute('hidden', this.uiState.isRecording);
        this.stopButton?.toggleAttribute('hidden', !this.uiState.isRecording);
        if (this.statusElement) {
            this.statusElement.textContent = this.getStatusText(state);
            this.statusElement.dataset.state = state;
        }
        if (state === RecordingState.RECORDING) {
            this.startTimer();
        }
        else {
            this.stopTimer();
        }
    }
    updateRecordingDuration(duration) {
        this.uiState.duration = duration;
        if (this.durationElement) {
            this.durationElement.textContent = this.formatDuration(duration);
        }
    }
    showError(message) {
        this.uiState.error = message;
        if (this.errorElement) {
            this.errorElement.textContent = message;
            this.errorElement.removeAttribute('hidden');
        }
    }
    hideError() {
        delete this.uiState.error;
        this.errorElement?.setAttribute('hidden', '');
    }
    async handleStartRecording() {
        this.hideError();
        this.updateRecordingState(RecordingState.STARTING);
        chrome.runtime.sendMessage({
            type: 'request-recording',
            target: 'service-worker'
        });
    }
    async handleStopRecording() {
        this.updateRecordingState(RecordingState.STOPPING);
        chrome.runtime.sendMessage({
            type: 'stop-recording',
            target: 'service-worker'
        });
    }
    async handlePauseRecording() {
        await Promise.resolve();
    }
    async handleResumeRecording() {
        await Promise.resolve();
    }
    initializeElements() {
        this.startButton = document.getElementById('startRecord');
        this.stopButton = document.getElementById('stopRecord');
        this.statusElement = document.getElementById('recordingStatus');
        this.durationElement = document.getElementById('recordingDuration');
        this.errorElement = document.getElementById('errorMessage');
    }
    setupEventListeners() {
        this.startButton?.addEventListener('click', () => this.handleStartRecording());
        this.stopButton?.addEventListener('click', () => this.handleStopRecording());
        // Listen for messages from service worker and offscreen document
        chrome.runtime.onMessage.addListener((message) => {
            if (message.target === 'popup') {
                this.handleMessage(message);
            }
        });
        this.syncRecordingState().catch((error) => {
            this.showError(error instanceof Error ? error.message : 'Unable to read recording state.');
        });
    }
    handleMessage(message) {
        switch (message.type) {
            case 'recording-started':
                this.recordingStartedAt = Date.now();
                this.updateRecordingState(RecordingState.RECORDING);
                break;
            case 'recording-stopped':
                this.recordingStartedAt = undefined;
                this.updateRecordingDuration(0);
                this.updateRecordingState(RecordingState.IDLE);
                break;
            case 'recording-error':
                this.recordingStartedAt = undefined;
                this.updateRecordingState(RecordingState.IDLE);
                this.showError(message.error ?? 'Recording failed.');
                break;
            default:
                console.warn('Received unknown popup message:', message.type);
        }
    }
    async syncRecordingState() {
        const runtimeWithContexts = chrome.runtime;
        if (!runtimeWithContexts.getContexts) {
            this.updateRecordingState(RecordingState.IDLE);
            return;
        }
        const contexts = await runtimeWithContexts.getContexts({});
        const isRecording = contexts.some((context) => context.contextType === 'OFFSCREEN_DOCUMENT' && Boolean(context.documentUrl?.endsWith('#recording')));
        if (isRecording) {
            this.recordingStartedAt = Date.now();
            this.updateRecordingState(RecordingState.RECORDING);
            return;
        }
        this.updateRecordingState(RecordingState.IDLE);
    }
    startTimer() {
        if (!this.recordingStartedAt) {
            this.recordingStartedAt = Date.now();
        }
        window.clearInterval(this.timerId);
        this.timerId = window.setInterval(() => {
            this.updateRecordingDuration(Date.now() - (this.recordingStartedAt ?? Date.now()));
        }, 1000);
    }
    stopTimer() {
        window.clearInterval(this.timerId);
    }
    getStatusText(state) {
        switch (state) {
            case RecordingState.STARTING:
                return 'Preparing tab capture';
            case RecordingState.RECORDING:
                return 'Recording tab audio';
            case RecordingState.STOPPING:
                return 'Saving recording';
            case RecordingState.ERROR:
                return 'Recording failed';
            default:
                return 'Ready to record this tab';
        }
    }
    formatDuration(milliseconds) {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
}
//# sourceMappingURL=PopupController.js.map