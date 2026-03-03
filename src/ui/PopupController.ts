import {
  PopupController as IPopupController,
  RecordingState,
  AudioSource,
  UIState,
  ExtensionMessage
} from '../types/index.js';

/**
 * Popup UI controller for recording controls and status display
 * Manages user interactions and UI state updates
 */
export class PopupController implements IPopupController {
  private uiState: UIState = {
    isRecording: false,
    isPaused: false,
    duration: 0,
    audioSources: []
  };

  private startButton?: HTMLButtonElement;
  private stopButton?: HTMLButtonElement;
  private pauseButton?: HTMLButtonElement;
  private resumeButton?: HTMLButtonElement;
  private statusElement?: HTMLElement;
  private durationElement?: HTMLElement;
  private errorElement?: HTMLElement;

  constructor() {
    this.initializeElements();
    this.setupEventListeners();
  }

  updateRecordingState(state: RecordingState): void {
    // Implementation will be added in subsequent tasks
    throw new Error('Not implemented yet');
  }

  updateRecordingDuration(duration: number): void {
    // Implementation will be added in subsequent tasks
    throw new Error('Not implemented yet');
  }

  showError(message: string): void {
    // Implementation will be added in subsequent tasks
    throw new Error('Not implemented yet');
  }

  hideError(): void {
    // Implementation will be added in subsequent tasks
    throw new Error('Not implemented yet');
  }

  async handleStartRecording(): Promise<void> {
    // Implementation will be added in subsequent tasks
    throw new Error('Not implemented yet');
  }

  async handleStopRecording(): Promise<void> {
    // Implementation will be added in subsequent tasks
    throw new Error('Not implemented yet');
  }

  async handlePauseRecording(): Promise<void> {
    // Implementation will be added in subsequent tasks
    throw new Error('Not implemented yet');
  }

  async handleResumeRecording(): Promise<void> {
    // Implementation will be added in subsequent tasks
    throw new Error('Not implemented yet');
  }

  private initializeElements(): void {
    this.startButton = document.getElementById('startRecord') as HTMLButtonElement;
    this.stopButton = document.getElementById('stopRecord') as HTMLButtonElement;
    this.pauseButton = document.getElementById('pauseRecord') as HTMLButtonElement;
    this.resumeButton = document.getElementById('resumeRecord') as HTMLButtonElement;
    this.statusElement = document.getElementById('recordingStatus') as HTMLElement;
    this.durationElement = document.getElementById('recordingDuration') as HTMLElement;
    this.errorElement = document.getElementById('errorMessage') as HTMLElement;
  }

  private setupEventListeners(): void {
    this.startButton?.addEventListener('click', () => this.handleStartRecording());
    this.stopButton?.addEventListener('click', () => this.handleStopRecording());
    this.pauseButton?.addEventListener('click', () => this.handlePauseRecording());
    this.resumeButton?.addEventListener('click', () => this.handleResumeRecording());

    // Listen for messages from service worker and offscreen document
    chrome.runtime.onMessage.addListener((message: ExtensionMessage) => {
      if (message.target === 'popup') {
        this.handleMessage(message);
      }
    });
  }

  private handleMessage(message: ExtensionMessage): void {
    // Implementation will be added in subsequent tasks
    console.log('Received message:', message);
  }

  private formatDuration(milliseconds: number): string {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
}