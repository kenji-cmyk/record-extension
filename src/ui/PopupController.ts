import {
  PopupController as IPopupController,
  RecordingState,
  AudioSource,
  UIState,
  ExtensionMessage,
  RecordingStatusSnapshot
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
  private statusElement?: HTMLElement;
  private durationElement?: HTMLElement;
  private errorElement?: HTMLElement;
  private timerId: number | undefined;
  private recordingStartedAt: number | undefined;

  constructor() {
    this.initializeElements();
    this.setupEventListeners();
  }

  updateRecordingState(state: RecordingState): void {
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
    } else {
      this.stopTimer();
    }
  }

  updateRecordingDuration(duration: number): void {
    this.uiState.duration = duration;
    if (this.durationElement) {
      this.durationElement.textContent = this.formatDuration(duration);
    }
  }

  showError(message: string): void {
    this.uiState.error = message;
    if (this.errorElement) {
      this.errorElement.textContent = message;
      this.errorElement.removeAttribute('hidden');
    }
  }

  hideError(): void {
    delete this.uiState.error;
    this.errorElement?.setAttribute('hidden', '');
  }

  async handleStartRecording(): Promise<void> {
    this.hideError();
    this.updateRecordingState(RecordingState.STARTING);
    chrome.runtime.sendMessage({
      type: 'request-recording',
      target: 'service-worker'
    });
  }

  async handleStopRecording(): Promise<void> {
    this.updateRecordingState(RecordingState.STOPPING);
    chrome.runtime.sendMessage({
      type: 'stop-recording',
      target: 'service-worker'
    });
  }

  async handlePauseRecording(): Promise<void> {
    await Promise.resolve();
  }

  async handleResumeRecording(): Promise<void> {
    await Promise.resolve();
  }

  private initializeElements(): void {
    this.startButton = document.getElementById('startRecord') as HTMLButtonElement;
    this.stopButton = document.getElementById('stopRecord') as HTMLButtonElement;
    this.statusElement = document.getElementById('recordingStatus') as HTMLElement;
    this.durationElement = document.getElementById('recordingDuration') as HTMLElement;
    this.errorElement = document.getElementById('errorMessage') as HTMLElement;
  }

  private setupEventListeners(): void {
    this.startButton?.addEventListener('click', () => this.handleStartRecording());
    this.stopButton?.addEventListener('click', () => this.handleStopRecording());

    // Listen for messages from service worker and offscreen document
    chrome.runtime.onMessage.addListener((message: ExtensionMessage) => {
      if (message.target === 'popup') {
        this.handleMessage(message);
      }
    });

    this.syncRecordingState().catch((error) => {
      this.showError(error instanceof Error ? error.message : 'Unable to read recording state.');
    });
  }

  private handleMessage(message: ExtensionMessage): void {
    switch (message.type) {
      case 'recording-started':
        this.applyRecordingStatus(this.parseRecordingStatus(message.data));
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

  private async syncRecordingState(): Promise<void> {
    const liveStatus = await this.requestRecordingStatus();
    if (liveStatus) {
      this.applyRecordingStatus(liveStatus);
      this.updateRecordingState(liveStatus.state);
      return;
    }

    const runtimeWithContexts = chrome.runtime as typeof chrome.runtime & {
      getContexts?: (filter: Record<string, unknown>) => Promise<Array<{ contextType: string; documentUrl: string }>>;
    };

    if (!runtimeWithContexts.getContexts) {
      this.updateRecordingState(RecordingState.IDLE);
      return;
    }

    const contexts = await runtimeWithContexts.getContexts({});
    const isRecording = contexts.some((context) =>
      context.contextType === 'OFFSCREEN_DOCUMENT' && Boolean(context.documentUrl?.endsWith('#recording'))
    );

    if (isRecording) {
      this.updateRecordingState(RecordingState.RECORDING);
      return;
    }

    this.updateRecordingState(RecordingState.IDLE);
  }

  private async requestRecordingStatus(): Promise<RecordingStatusSnapshot | undefined> {
    try {
      const response = await chrome.runtime.sendMessage({
        type: 'get-recording-status',
        target: 'offscreen'
      });

      return this.parseRecordingStatus(response);
    } catch {
      return undefined;
    }
  }

  private parseRecordingStatus(data: unknown): RecordingStatusSnapshot | undefined {
    if (!data || typeof data !== 'object') return undefined;

    const snapshot = data as Partial<RecordingStatusSnapshot>;
    if (!snapshot.state || typeof snapshot.duration !== 'number') return undefined;

    return {
      state: snapshot.state,
      isRecording: Boolean(snapshot.isRecording),
      ...(typeof snapshot.startedAt === 'number' ? { startedAt: snapshot.startedAt } : {}),
      duration: snapshot.duration
    };
  }

  private applyRecordingStatus(snapshot: RecordingStatusSnapshot | undefined): void {
    if (!snapshot) {
      this.recordingStartedAt = Date.now();
      return;
    }

    this.recordingStartedAt = snapshot.startedAt;
    this.updateRecordingDuration(snapshot.duration);
  }

  private startTimer(): void {
    if (!this.recordingStartedAt) {
      this.recordingStartedAt = Date.now();
    }

    window.clearInterval(this.timerId);
    this.timerId = window.setInterval(() => {
      this.updateRecordingDuration(Date.now() - (this.recordingStartedAt ?? Date.now()));
    }, 1000);
  }

  private stopTimer(): void {
    window.clearInterval(this.timerId);
  }

  private getStatusText(state: RecordingState): string {
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

  private formatDuration(milliseconds: number): string {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
}
