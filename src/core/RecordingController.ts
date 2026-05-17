import {
  RecordingController as IRecordingController,
  RecordingOptions,
  RecordingState,
  AudioCaptureManager,
  AudioMixer,
  MediaRecorderManager,
  PermissionManager,
  ErrorHandler
} from '../types/index.js';

/**
 * Main controller that orchestrates the entire recording process
 * Integrates all components: permissions, audio capture, mixing, and recording
 */
export class RecordingController implements IRecordingController {
  private audioCaptureManager: AudioCaptureManager;
  private audioMixer: AudioMixer;
  private mediaRecorderManager: MediaRecorderManager;
  private errorHandler: ErrorHandler;
  
  private currentState: RecordingState = RecordingState.IDLE;
  private startTime: Date | undefined;
  private pausedDuration: number = 0;

  constructor(
    permissionManager: PermissionManager,
    audioCaptureManager: AudioCaptureManager,
    audioMixer: AudioMixer,
    mediaRecorderManager: MediaRecorderManager,
    errorHandler: ErrorHandler
  ) {
    void permissionManager;
    this.audioCaptureManager = audioCaptureManager;
    this.audioMixer = audioMixer;
    this.mediaRecorderManager = mediaRecorderManager;
    this.errorHandler = errorHandler;
  }

  async startRecording(options: RecordingOptions): Promise<void> {
    if (this.currentState === RecordingState.RECORDING || this.currentState === RecordingState.STARTING) {
      throw new Error('Recording is already in progress.');
    }

    this.currentState = RecordingState.STARTING;
    this.startTime = new Date();
    this.pausedDuration = 0;

    try {
      this.audioCaptureManager.releaseAllStreams();
      const tabStream = await this.audioCaptureManager.initializeTabCapture(options.streamId);
      const [source] = this.audioCaptureManager.getAvailableAudioSources()
        .filter((audioSource) => audioSource.stream === tabStream);

      if (!source) {
        throw new Error('Unable to register tab audio source.');
      }

      this.audioMixer.addAudioSource(source);
      this.mediaRecorderManager.startRecording(this.audioMixer.getMixedStream(), options);
      this.currentState = RecordingState.RECORDING;
    } catch (error) {
      this.currentState = RecordingState.ERROR;
      await this.errorHandler.handleRecordingError({
        name: 'RecordingError',
        message: error instanceof Error ? error.message : 'Unable to start recording.',
        type: 'recording-failed',
        code: 'START_FAILED',
        recoverable: false
      });
      this.audioCaptureManager.releaseAllStreams();
      throw error;
    }
  }

  async pauseRecording(): Promise<void> {
    if (this.currentState !== RecordingState.RECORDING) return;
    this.mediaRecorderManager.pauseRecording();
    this.currentState = RecordingState.PAUSED;
  }

  async resumeRecording(): Promise<void> {
    if (this.currentState !== RecordingState.PAUSED) return;
    this.mediaRecorderManager.resumeRecording();
    this.currentState = RecordingState.RECORDING;
  }

  async stopRecording(): Promise<Blob> {
    if (this.currentState === RecordingState.IDLE) {
      return new Blob([], { type: 'audio/webm' });
    }

    this.currentState = RecordingState.STOPPING;
    try {
      const blob = await this.mediaRecorderManager.stopRecording();
      this.audioCaptureManager.releaseAllStreams();
      this.currentState = RecordingState.IDLE;
      this.startTime = undefined;
      return blob;
    } catch (error) {
      this.currentState = RecordingState.ERROR;
      throw error;
    }
  }

  getRecordingState(): RecordingState {
    return this.currentState;
  }

  getRecordingDuration(): number {
    if (!this.startTime) return 0;
    
    const now = new Date();
    const elapsed = now.getTime() - this.startTime.getTime();
    return elapsed - this.pausedDuration;
  }
}
