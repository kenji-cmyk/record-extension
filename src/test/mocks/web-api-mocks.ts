import { vi } from 'vitest'
import { MockMediaStream, MockMediaStreamTrack, MockAudioContext, MockMediaRecorder } from './audio-mocks'

/**
 * Mock Web APIs for testing
 */

// Mock navigator.mediaDevices
export const mockMediaDevices = {
  getUserMedia: vi.fn(),
  getDisplayMedia: vi.fn(),
  enumerateDevices: vi.fn(),
  getSupportedConstraints: vi.fn(),
  ondevicechange: null,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn()
}

// Mock navigator
export const mockNavigator = {
  mediaDevices: mockMediaDevices,
  userAgent: 'Mozilla/5.0 (Test Browser)',
  platform: 'Test Platform',
  language: 'en-US',
  languages: ['en-US', 'en'],
  onLine: true,
  permissions: {
    query: vi.fn()
  }
}

// Mock URL.createObjectURL and revokeObjectURL
export const mockURL = {
  createObjectURL: vi.fn((blob: Blob) => `blob:mock-url-${Math.random()}`),
  revokeObjectURL: vi.fn()
}

// Mock Blob constructor
export const mockBlob = vi.fn().mockImplementation(function (parts: any[], options: BlobPropertyBag = {}) {
  return {
    size: parts.reduce((acc, part) => acc + (part.length || part.byteLength || 0), 0),
    type: options.type || '',
    slice: vi.fn(),
    stream: vi.fn(),
    text: vi.fn(),
    arrayBuffer: vi.fn()
  }
})

/**
 * Setup Web API mocks for testing
 */
export function setupWebAPIMocks() {
  // @ts-ignore - Global objects for testing
  global.navigator = mockNavigator
  global.MediaStream = MockMediaStream
  global.MediaStreamTrack = MockMediaStreamTrack
  global.AudioContext = MockAudioContext
  global.MediaRecorder = MockMediaRecorder
  global.URL = mockURL
  global.Blob = mockBlob

  // Reset all mocks
  vi.clearAllMocks()
}

/**
 * Mock successful getUserMedia response
 */
export function mockGetUserMedia(options: {
  audio?: boolean
  video?: boolean
  trackCount?: number
} = {}) {
  const { audio = true, video = false, trackCount = 1 } = options
  
  const tracks: MockMediaStreamTrack[] = []
  
  if (audio) {
    for (let i = 0; i < trackCount; i++) {
      tracks.push(new MockMediaStreamTrack('audio'))
    }
  }
  
  if (video) {
    tracks.push(new MockMediaStreamTrack('video'))
  }
  
  const stream = new MockMediaStream(tracks as any)
  mockMediaDevices.getUserMedia.mockResolvedValue(stream)
  
  return stream
}

/**
 * Mock successful getDisplayMedia response
 */
export function mockGetDisplayMedia(options: {
  includeAudio?: boolean
  includeVideo?: boolean
} = {}) {
  const { includeAudio = true, includeVideo = false } = options
  
  const tracks: MockMediaStreamTrack[] = []
  
  if (includeAudio) {
    tracks.push(new MockMediaStreamTrack('audio'))
  }
  
  if (includeVideo) {
    tracks.push(new MockMediaStreamTrack('video'))
  }
  
  const stream = new MockMediaStream(tracks as any)
  mockMediaDevices.getDisplayMedia.mockResolvedValue(stream)
  
  return stream
}

/**
 * Mock permission query responses
 */
export function mockPermissionQuery(permission: string, state: PermissionState = 'granted') {
  const mockPermissionStatus = {
    state,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn()
  }
  
  mockNavigator.permissions.query.mockImplementation((descriptor) => {
    if (descriptor.name === permission) {
      return Promise.resolve(mockPermissionStatus)
    }
    return Promise.resolve({ ...mockPermissionStatus, state: 'denied' })
  })
  
  return mockPermissionStatus
}

/**
 * Mock device enumeration
 */
export function mockEnumerateDevices(devices: MediaDeviceInfo[] = []) {
  const defaultDevices: MediaDeviceInfo[] = [
    {
      deviceId: 'default-mic',
      kind: 'audioinput',
      label: 'Default Microphone',
      groupId: 'group-1'
    } as MediaDeviceInfo,
    {
      deviceId: 'default-speaker',
      kind: 'audiooutput', 
      label: 'Default Speaker',
      groupId: 'group-1'
    } as MediaDeviceInfo
  ]
  
  mockMediaDevices.enumerateDevices.mockResolvedValue(devices.length > 0 ? devices : defaultDevices)
  return devices.length > 0 ? devices : defaultDevices
}

/**
 * Mock MediaRecorder support check
 */
export function mockMediaRecorderSupport(mimeTypes: { [key: string]: boolean } = {}) {
  const defaultSupport = {
    'audio/webm': true,
    'audio/webm;codecs=opus': true,
    'audio/mp4;codecs=mp4a.40.2': true,
    'audio/mp4': true,
    'audio/mpeg': false
  }
  
  const support = { ...defaultSupport, ...mimeTypes }
  
  MockMediaRecorder.isTypeSupported.mockImplementation((mimeType: string) => {
    return support[mimeType] || false
  })
  
  return support
}

/**
 * Mock error responses for testing error handling
 */
export function mockWebAPIErrors() {
  return {
    getUserMediaError: (error: DOMException) => {
      mockMediaDevices.getUserMedia.mockRejectedValue(error)
    },
    getDisplayMediaError: (error: DOMException) => {
      mockMediaDevices.getDisplayMedia.mockRejectedValue(error)
    },
    permissionError: (error: DOMException) => {
      mockNavigator.permissions.query.mockRejectedValue(error)
    }
  }
}

/**
 * Create mock DOMException for testing
 */
export function createMockDOMException(name: string, message: string): DOMException {
  const error = new Error(message) as any
  error.name = name
  error.code = 0
  return error
}
