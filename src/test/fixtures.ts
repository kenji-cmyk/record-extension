/**
 * Test fixtures for consistent test data
 */

import type { 
  RecordingOptions, 
  AudioSource, 
  RecordingMetadata, 
  AudioConfiguration,
  PermissionStatus,
  RecordingState
} from '../types'

/**
 * Default recording options for testing
 */
export const defaultRecordingOptions: RecordingOptions = {
  streamId: 'test-stream-id',
  audioQuality: 'high',
  outputFormat: 'webm'
}

/**
 * Sample audio sources for testing
 */
export const sampleAudioSources: AudioSource[] = [
  {
    id: 'tab-1',
    type: 'tab',
    name: 'YouTube - Tab 1',
    stream: new MediaStream(),
    isActive: true
  },
  {
    id: 'tab-2',
    type: 'tab',
    name: 'Spotify - Tab 2',
    stream: new MediaStream(),
    isActive: false
  }
]

/**
 * Sample recording metadata
 */
export const sampleRecordingMetadata: RecordingMetadata = {
  sampleRate: 44100,
  bitRate: 256,
  channels: 2,
  format: 'webm',
  size: 1024000
}

/**
 * Sample audio configuration
 */
export const sampleAudioConfiguration: AudioConfiguration = {
  tabAudio: {
    enabled: true,
    volume: 0.8,
    sampleRate: 44100
  },
  output: {
    format: 'webm',
    quality: 'high',
    bitRate: 256
  }
}

/**
 * Sample permission status
 */
export const samplePermissionStatus: PermissionStatus = {
  tabCapture: 'granted'
}

/**
 * Recording state transitions for testing
 */
export const recordingStateTransitions: { from: RecordingState; to: RecordingState; valid: boolean }[] = [
  { from: 'idle', to: 'starting', valid: true },
  { from: 'starting', to: 'recording', valid: true },
  { from: 'starting', to: 'error', valid: true },
  { from: 'recording', to: 'paused', valid: true },
  { from: 'recording', to: 'stopping', valid: true },
  { from: 'recording', to: 'error', valid: true },
  { from: 'paused', to: 'recording', valid: true },
  { from: 'paused', to: 'stopping', valid: true },
  { from: 'stopping', to: 'idle', valid: true },
  { from: 'error', to: 'idle', valid: true },
  // Invalid transitions
  { from: 'idle', to: 'recording', valid: false },
  { from: 'idle', to: 'paused', valid: false },
  { from: 'recording', to: 'starting', valid: false },
  { from: 'paused', to: 'starting', valid: false }
]

/**
 * Sample Chrome tabs for testing
 */
export const sampleChromeTabs = [
  {
    id: 1,
    url: 'https://www.youtube.com/watch?v=example',
    title: 'YouTube Video',
    audible: true,
    active: true,
    windowId: 1,
    index: 0
  },
  {
    id: 2,
    url: 'https://open.spotify.com/playlist/example',
    title: 'Spotify Playlist',
    audible: true,
    active: false,
    windowId: 1,
    index: 1
  },
  {
    id: 3,
    url: 'https://example.com',
    title: 'Silent Tab',
    audible: false,
    active: false,
    windowId: 1,
    index: 2
  }
]

/**
 * Sample error scenarios for testing
 */
export const sampleErrors = {
  permissionDenied: new DOMException('Permission denied', 'NotAllowedError'),
  deviceNotFound: new DOMException('Device not found', 'NotFoundError'),
  streamInterrupted: new DOMException('Stream interrupted', 'AbortError'),
  apiNotSupported: new DOMException('API not supported', 'NotSupportedError'),
  networkError: new DOMException('Network error', 'NetworkError')
}

/**
 * Sample MIME types and their support status
 */
export const sampleMimeTypeSupport = {
  'audio/webm': true,
  'audio/webm;codecs=opus': true,
  'audio/mp4': true,
  'audio/mpeg': false,
  'audio/wav': false
}

/**
 * Sample audio quality configurations
 */
export const audioQualityConfigs = {
  low: { bitRate: 64, sampleRate: 22050 },
  medium: { bitRate: 128, sampleRate: 44100 },
  high: { bitRate: 256, sampleRate: 44100 },
  lossless: { bitRate: 320, sampleRate: 48000 }
}

/**
 * Helper to create test recording session
 */
export function createTestRecordingSession(overrides: Partial<any> = {}) {
  return {
    id: 'test-session-1',
    startTime: new Date('2024-01-01T10:00:00Z'),
    endTime: new Date('2024-01-01T10:05:00Z'),
    duration: 300000, // 5 minutes
    audioSources: sampleAudioSources,
    options: defaultRecordingOptions,
    state: 'idle' as RecordingState,
    metadata: sampleRecordingMetadata,
    ...overrides
  }
}

/**
 * Helper to create test blob
 */
export function createTestBlob(size: number = 1024, type: string = 'audio/webm'): Blob {
  const data = new Uint8Array(size).fill(65) // Fill with 'A' character
  return new Blob([data], { type })
}

/**
 * Time-related test utilities
 */
export const timeUtils = {
  // Common durations in milliseconds
  durations: {
    short: 1000,      // 1 second
    medium: 30000,    // 30 seconds
    long: 300000,     // 5 minutes
    veryLong: 3600000 // 1 hour
  },
  
  // Create a date offset from now
  offsetFromNow: (offsetMs: number) => new Date(Date.now() + offsetMs),
  
  // Create a duration between two dates
  duration: (start: Date, end: Date) => end.getTime() - start.getTime()
}
