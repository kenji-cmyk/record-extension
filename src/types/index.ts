// Core Types and Interfaces for Tab Audio Recording Extension

// ============================================================================
// Recording Controller Interfaces
// ============================================================================

export interface RecordingController {
  startRecording(options: RecordingOptions): Promise<void>;
  pauseRecording(): Promise<void>;
  resumeRecording(): Promise<void>;
  stopRecording(): Promise<Blob>;
  getRecordingState(): RecordingState;
  getRecordingDuration(): number;
}

export interface RecordingOptions {
  streamId: string;
  audioQuality: AudioQuality;
  outputFormat: 'webm';
}

export enum RecordingState {
  IDLE = 'idle',
  STARTING = 'starting',
  RECORDING = 'recording',
  PAUSED = 'paused',
  STOPPING = 'stopping',
  ERROR = 'error'
}

// ============================================================================
// Audio Capture Manager Interfaces
// ============================================================================

export interface AudioCaptureManager {
  initializeTabCapture(streamId: string): Promise<MediaStream>;
  releaseAllStreams(): void;
  getAvailableAudioSources(): AudioSource[];
}

export interface AudioSource {
  id: string;
  type: 'tab';
  name: string;
  stream: MediaStream;
  isActive: boolean;
}

// ============================================================================
// Audio Mixer Interfaces
// ============================================================================

export interface AudioMixer {
  addAudioSource(source: AudioSource): void;
  removeAudioSource(sourceId: string): void;
  setSourceVolume(sourceId: string, volume: number): void;
  getMixedStream(): MediaStream;
  getAudioContext(): AudioContext;
}

export interface AudioSourceNode {
  sourceNode: MediaStreamAudioSourceNode;
  gainNode: GainNode;
  source: AudioSource;
}

// ============================================================================
// Media Recorder Manager Interfaces
// ============================================================================

export interface MediaRecorderManager {
  startRecording(stream: MediaStream, options: RecordingOptions): void;
  pauseRecording(): void;
  resumeRecording(): void;
  stopRecording(): Promise<Blob>;
  getRecordedData(): Blob[];
}

// ============================================================================
// Permission Manager Interfaces
// ============================================================================

export interface PermissionManager {
  checkTabCapturePermission(): Promise<boolean>;
  getPermissionStatus(): PermissionStatus;
}

export interface PermissionStatus {
  tabCapture: 'granted' | 'denied';
}

// ============================================================================
// Data Models
// ============================================================================

export interface RecordingSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  duration: number;
  audioSources: AudioSource[];
  options: RecordingOptions;
  state: RecordingState;
  outputFile?: Blob;
  metadata: RecordingMetadata;
}

export interface RecordingMetadata {
  sampleRate: number;
  bitRate: number;
  channels: number;
  format: string;
  size: number;
}

export interface AudioConfiguration {
  tabAudio: {
    enabled: boolean;
    volume: number;
    sampleRate: number;
  };
  output: {
    format: 'webm';
    quality: AudioQuality;
    bitRate: number;
  };
}

export enum AudioQuality {
  LOW = 'low',      // 64 kbps
  MEDIUM = 'medium', // 128 kbps
  HIGH = 'high',     // 256 kbps
  LOSSLESS = 'lossless' // 320 kbps
}

// ============================================================================
// Error Handling Interfaces
// ============================================================================

export interface ErrorHandler {
  handlePermissionError(error: PermissionError): Promise<void>;
  handleStreamInterruption(streamId: string): Promise<void>;
  handleRecordingError(error: RecordingError): Promise<void>;
}

export interface PermissionError extends Error {
  type: 'tab-capture-denied';
  code: string;
}

export interface RecordingError extends Error {
  type: 'stream-interruption' | 'recording-failed' | 'export-failed';
  code: string;
  recoverable: boolean;
}

// ============================================================================
// Extension Infrastructure Interfaces
// ============================================================================

export interface ExtensionMessage {
  type: string;
  target: 'service-worker' | 'offscreen' | 'popup';
  data?: unknown;
  error?: string;
  recording?: boolean;
  state?: RecordingState;
  duration?: number;
}

export interface RecordingStatusSnapshot {
  state: RecordingState;
  isRecording: boolean;
  startedAt?: number;
  duration: number;
}

export interface ServiceWorkerManager {
  handleExtensionInstall(): Promise<void>;
  createOffscreenDocument(): Promise<void>;
  handleMessage(message: ExtensionMessage): Promise<void>;
}

export interface OffscreenManager {
  initializeAudioProcessing(): Promise<void>;
  handleRecordingRequest(streamId: string): Promise<void>;
  stopRecording(): Promise<void>;
  getRecordingStatus(): RecordingStatusSnapshot;
  cleanup(): Promise<void>;
}

// ============================================================================
// UI Interfaces
// ============================================================================

export interface PopupController {
  updateRecordingState(state: RecordingState): void;
  updateRecordingDuration(duration: number): void;
  showError(message: string): void;
  hideError(): void;
  handleStartRecording(): Promise<void>;
  handleStopRecording(): Promise<void>;
  handlePauseRecording(): Promise<void>;
  handleResumeRecording(): Promise<void>;
}

export interface UIState {
  isRecording: boolean;
  isPaused: boolean;
  duration: number;
  audioSources: AudioSource[];
  error?: string;
}

// ============================================================================
// Utility Types
// ============================================================================

export type EventCallback<T = any> = (data: T) => void;

export interface EventEmitter {
  on<T>(event: string, callback: EventCallback<T>): void;
  off<T>(event: string, callback: EventCallback<T>): void;
  emit<T>(event: string, data?: T): void;
}

// ============================================================================
// Chrome Extension Specific Types
// ============================================================================

export interface ChromeTabInfo {
  id: number;
  url: string;
  title: string;
  audible: boolean;
  active: boolean;
}

export interface StreamConfiguration {
  audio: {
    mandatory?: {
      chromeMediaSource?: string;
      chromeMediaSourceId?: string;
    };
  };
  video?: boolean;
}
