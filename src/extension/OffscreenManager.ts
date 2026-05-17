import {
  OffscreenManager as IOffscreenManager,
  RecordingController,
  RecordingOptions,
  AudioQuality,
  RecordingState,
  RecordingStatusSnapshot
} from '../types/index.js';

/**
 * Offscreen document manager for background audio processing
 * Handles audio capture and recording operations in offscreen context
 */
export class OffscreenManager implements IOffscreenManager {
  private recordingController: RecordingController | undefined;
  private recordingStartedAt: number | undefined;

  constructor(recordingController: RecordingController | undefined) {
    this.recordingController = recordingController;
  }

  async initializeAudioProcessing(): Promise<void> {
    await Promise.resolve();
  }

  async handleRecordingRequest(streamId: string): Promise<void> {
    if (!this.recordingController) {
      throw new Error('Recording controller is not available.');
    }

    try {
      await this.recordingController.startRecording(this.getDefaultRecordingOptions(streamId));
      this.recordingStartedAt = Date.now();
      window.location.hash = 'recording';
      this.sendMessageToServiceWorker('update-icon', { recording: true });
      this.sendMessageToPopup('recording-started', this.getRecordingStatus());
    } catch (error) {
      this.recordingStartedAt = undefined;
      const message = error instanceof Error ? error.message : 'Unable to start recording.';
      this.sendMessageToPopup('recording-error', undefined, message);
      this.sendMessageToServiceWorker('update-icon', { recording: false });
    }
  }

  async stopRecording(): Promise<void> {
    if (!this.recordingController) return;

    try {
      const blob = await this.recordingController.stopRecording();
      this.downloadRecording(blob);
      this.recordingStartedAt = undefined;
      window.location.hash = '';
      this.sendMessageToServiceWorker('recording-stopped');
      this.sendMessageToPopup('recording-stopped');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to stop recording.';
      this.sendMessageToPopup('recording-error', undefined, message);
    }
  }

  getRecordingStatus(): RecordingStatusSnapshot {
    const state = this.recordingController?.getRecordingState() ?? RecordingState.IDLE;
    const isRecording = state === RecordingState.RECORDING || state === RecordingState.PAUSED || state === RecordingState.STARTING;
    const duration = this.recordingStartedAt ? Date.now() - this.recordingStartedAt : 0;

    return {
      state,
      isRecording,
      ...(this.recordingStartedAt ? { startedAt: this.recordingStartedAt } : {}),
      duration
    };
  }

  async cleanup(): Promise<void> {
    if (this.recordingController?.getRecordingState() !== 'idle') {
      await this.recordingController?.stopRecording();
    }
    this.recordingStartedAt = undefined;
  }

  private getDefaultRecordingOptions(streamId: string): RecordingOptions {
    return {
      streamId,
      audioQuality: AudioQuality.HIGH,
      outputFormat: 'webm'
    };
  }

  private downloadRecording(blob: Blob): void {
    if (blob.size === 0) return;

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tab-recording-${new Date().toISOString().replace(/[:.]/g, '-')}.webm`;
    link.click();
    URL.revokeObjectURL(url);
  }

  private sendMessageToServiceWorker(type: string, data?: unknown): void {
    chrome.runtime.sendMessage({
      type,
      target: 'service-worker',
      ...(typeof data === 'object' && data !== null ? data : { data })
    });
  }

  private sendMessageToPopup(type: string, data?: unknown, error?: string): void {
    chrome.runtime.sendMessage({
      type,
      target: 'popup',
      data,
      error
    });
  }
}
