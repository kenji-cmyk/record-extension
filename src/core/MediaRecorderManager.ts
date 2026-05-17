import {
  MediaRecorderManager as IMediaRecorderManager,
  RecordingOptions,
  AudioQuality
} from '../types/index.js';

/**
 * Manages MediaRecorder API for recording and exporting audio files
 * Supports WebM and MP3 formats with configurable quality settings
 */
export class WebMRecorderManager implements IMediaRecorderManager {
  private mediaRecorder: MediaRecorder | undefined;
  private recordedChunks: Blob[] = [];
  private stopPromise: Promise<Blob> | undefined;
  private resolveStop: ((blob: Blob) => void) | undefined;
  private rejectStop: ((error: Error) => void) | undefined;

  startRecording(stream: MediaStream, options: RecordingOptions): void {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      throw new Error('Recording is already in progress.');
    }

    this.recordedChunks = [];
    const mimeType = this.getMimeType(options.outputFormat);
    const recorderOptions: MediaRecorderOptions = {
      audioBitsPerSecond: this.getAudioBitrate(options.audioQuality)
    };

    if (MediaRecorder.isTypeSupported(mimeType)) {
      recorderOptions.mimeType = mimeType;
    }

    this.mediaRecorder = new MediaRecorder(stream, recorderOptions);
    this.stopPromise = new Promise<Blob>((resolve, reject) => {
      this.resolveStop = resolve;
      this.rejectStop = reject;
    });

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.recordedChunks.push(event.data);
      }
    };

    this.mediaRecorder.onerror = () => {
      this.rejectStop?.(new Error('MediaRecorder failed while recording.'));
    };

    this.mediaRecorder.onstop = () => {
      const blob = new Blob(this.recordedChunks, { type: 'audio/webm' });
      this.resolveStop?.(blob);
    };

    this.mediaRecorder.start(1000);
  }

  pauseRecording(): void {
    if (this.mediaRecorder?.state === 'recording') {
      this.mediaRecorder.pause();
    }
  }

  resumeRecording(): void {
    if (this.mediaRecorder?.state === 'paused') {
      this.mediaRecorder.resume();
    }
  }

  async stopRecording(): Promise<Blob> {
    if (!this.mediaRecorder || this.mediaRecorder.state === 'inactive') {
      return new Blob(this.recordedChunks, { type: 'audio/webm' });
    }

    const result = this.stopPromise;
    if (!result) {
      return new Blob(this.recordedChunks, { type: 'audio/webm' });
    }
    this.mediaRecorder.stop();
    const blob = await result;
    this.mediaRecorder = undefined;
    this.stopPromise = undefined;
    this.resolveStop = undefined;
    this.rejectStop = undefined;
    return blob;
  }

  getRecordedData(): Blob[] {
    return [...this.recordedChunks];
  }

  private getAudioBitrate(quality: AudioQuality): number {
    switch (quality) {
      case AudioQuality.LOW:
        return 64000;
      case AudioQuality.MEDIUM:
        return 128000;
      case AudioQuality.HIGH:
        return 256000;
      case AudioQuality.LOSSLESS:
        return 320000;
      default:
        return 128000;
    }
  }

  private getMimeType(format: 'webm'): string {
    return format === 'webm' ? 'audio/webm;codecs=opus' : 'audio/webm';
  }
}
