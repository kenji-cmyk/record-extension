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
        // Implementation will be added in subsequent tasks
        throw new Error('Not implemented yet');
    }
    updateRecordingDuration(duration) {
        // Implementation will be added in subsequent tasks
        throw new Error('Not implemented yet');
    }
    showError(message) {
        // Implementation will be added in subsequent tasks
        throw new Error('Not implemented yet');
    }
    hideError() {
        // Implementation will be added in subsequent tasks
        throw new Error('Not implemented yet');
    }
    async handleStartRecording() {
        // Implementation will be added in subsequent tasks
        throw new Error('Not implemented yet');
    }
    async handleStopRecording() {
        // Implementation will be added in subsequent tasks
        throw new Error('Not implemented yet');
    }
    async handlePauseRecording() {
        // Implementation will be added in subsequent tasks
        throw new Error('Not implemented yet');
    }
    async handleResumeRecording() {
        // Implementation will be added in subsequent tasks
        throw new Error('Not implemented yet');
    }
    initializeElements() {
        this.startButton = document.getElementById('startRecord');
        this.stopButton = document.getElementById('stopRecord');
        this.pauseButton = document.getElementById('pauseRecord');
        this.resumeButton = document.getElementById('resumeRecord');
        this.statusElement = document.getElementById('recordingStatus');
        this.durationElement = document.getElementById('recordingDuration');
        this.errorElement = document.getElementById('errorMessage');
    }
    setupEventListeners() {
        this.startButton?.addEventListener('click', () => this.handleStartRecording());
        this.stopButton?.addEventListener('click', () => this.handleStopRecording());
        this.pauseButton?.addEventListener('click', () => this.handlePauseRecording());
        this.resumeButton?.addEventListener('click', () => this.handleResumeRecording());
        // Listen for messages from service worker and offscreen document
        chrome.runtime.onMessage.addListener((message) => {
            if (message.target === 'popup') {
                this.handleMessage(message);
            }
        });
    }
    handleMessage(message) {
        // Implementation will be added in subsequent tasks
        console.log('Received message:', message);
    }
    formatDuration(milliseconds) {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
}
//# sourceMappingURL=PopupController.js.map