import {
  OffscreenManager as IOffscreenManager,
  RecordingController,
  RecordingOptions,
  AudioQuality
} from '../types/index.js';

/**
 * Offscreen document manager for background audio processing
 * Handles audio capture and recording operations in offscreen context
 */
export class OffscreenManager implements IOffscreenManager {
  private recordingController: RecordingController | undefined;

  constructor(recordingController: RecordingController | undefined) {
    this.recordingController = recordingController;
  }

  async initializeAudioProcessing(): Promise<void> {
    // Implementation will be added in subsequent tasks
    throw new Error('Not implemented yet');
  }

  async handleRecordingRequest(streamId: string): Promise<void> {
    // Implementation will be added in subsequent tasks
    throw new Error('Not implemented yet');
  }

  async cleanup(): Promise<void> {
    // Implementation will be added in subsequent tasks
    throw new Error('Not implemented yet');
  }

  private getDefaultRecordingOptions(): RecordingOptions {
    return {
      includeSystemAudio: true,
      includeMicrophone: true,
      audioQuality: AudioQuality.HIGH,
      outputFormat: 'webm'
    };
  }

  private sendMessageToServiceWorker(type: string, data?: any): void {
    chrome.runtime.sendMessage({
      type,
      target: 'service-worker',
      data
    });
  }

  private sendMessageToPopup(type: string, data?: any, error?: string): void {
    chrome.runtime.sendMessage({
      type,
      target: 'popup',
      data,
      error
    });
  }
}