import {
  ErrorHandler as IErrorHandler,
  PermissionError,
  RecordingError,
  AudioMixer
} from '../types/index.js';

/**
 * Comprehensive error handling system with graceful degradation
 * Manages recovery strategies and user communication
 */
export class ErrorHandler implements IErrorHandler {
  private audioMixer: AudioMixer;

  constructor(audioMixer: AudioMixer) {
    this.audioMixer = audioMixer;
  }

  async handlePermissionError(error: PermissionError): Promise<void> {
    this.showUserNotification(error.message);
  }

  async handleStreamInterruption(streamId: string): Promise<void> {
    console.warn(`Audio stream interrupted: ${streamId}`);
    this.continueRecording();
  }

  async handleRecordingError(error: RecordingError): Promise<void> {
    if (error.recoverable) {
      this.continueRecording();
      return;
    }

    this.stopRecordingWithError(error.message);
  }

  private continueRecording(): void {
    console.log('Continuing recording with remaining streams');
  }

  private stopRecordingWithError(message: string): void {
    this.audioMixer.getAudioContext().suspend().catch(() => undefined);
    console.error('Stopping recording due to error:', message);
  }

  private showUserNotification(message: string): void {
    console.log('User notification:', message);
  }
}
