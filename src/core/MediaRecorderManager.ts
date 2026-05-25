import {
  MediaRecorderManager as IMediaRecorderManager,
  RecordingOptions,
  AudioQuality,
  AudioOutputFormat
} from '../types/index.js';

/**
 * Manages MediaRecorder API for recording and exporting audio files
 * Supports compact M4A/AAC output with WebM/Opus fallback.
 */
export class WebMRecorderManager implements IMediaRecorderManager {
  private mediaRecorder: MediaRecorder | undefined;
  private recordedChunks: Blob[] = [];
  private stopPromise: Promise<Blob> | undefined;
  private resolveStop: ((blob: Blob) => void) | undefined;
  private rejectStop: ((error: Error) => void) | undefined;
  private activeMimeType = 'audio/webm';

  startRecording(stream: MediaStream, options: RecordingOptions): void {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      throw new Error('Recording is already in progress.');
    }

    this.recordedChunks = [];
    const mimeType = this.selectSupportedMimeType(options.outputFormat);
    const recorderOptions: MediaRecorderOptions = {
      audioBitsPerSecond: this.getAudioBitrate(options.audioQuality)
    };

    if (this.isMimeTypeSupported(mimeType)) {
      recorderOptions.mimeType = mimeType;
    }

    this.mediaRecorder = new MediaRecorder(stream, recorderOptions);
    this.activeMimeType = this.mediaRecorder.mimeType || mimeType;
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
      const blob = new Blob(this.recordedChunks, { type: this.activeMimeType });
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
      return new Blob(this.recordedChunks, { type: this.activeMimeType });
    }

    const result = this.stopPromise;
    if (!result) {
      return new Blob(this.recordedChunks, { type: this.activeMimeType });
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
        return 48000;
      case AudioQuality.MEDIUM:
        return 96000;
      case AudioQuality.HIGH:
        return 128000;
      case AudioQuality.LOSSLESS:
        return 192000;
      default:
        return 96000;
    }
  }

  private selectSupportedMimeType(format: AudioOutputFormat): string {
    const preferredMimeTypes = this.getMimeTypeCandidates(format);
    const fallbackMimeTypes = this.getMimeTypeCandidates('webm');
    const candidate = [...preferredMimeTypes, ...fallbackMimeTypes]
      .find((mimeType) => this.isMimeTypeSupported(mimeType));

    return candidate ?? preferredMimeTypes[preferredMimeTypes.length - 1] ?? 'audio/webm';
  }

  private getMimeTypeCandidates(format: AudioOutputFormat): string[] {
    if (format === 'm4a') {
      return ['audio/mp4;codecs=mp4a.40.2', 'audio/mp4'];
    }

    return ['audio/webm;codecs=opus', 'audio/webm'];
  }

  private isMimeTypeSupported(mimeType: string): boolean {
    return typeof MediaRecorder.isTypeSupported === 'function' && MediaRecorder.isTypeSupported(mimeType);
  }
}
