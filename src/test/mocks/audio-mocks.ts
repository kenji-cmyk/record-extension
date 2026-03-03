import { vi } from 'vitest'

/**
 * Mock MediaStream for testing
 */
export class MockMediaStream {
  id: string
  active: boolean
  tracks: MediaStreamTrack[]

  constructor(tracks: MediaStreamTrack[] = []) {
    this.id = `mock-stream-${Math.random().toString(36).substr(2, 9)}`
    this.active = true
    this.tracks = tracks
  }

  getAudioTracks(): MediaStreamTrack[] {
    return this.tracks.filter(track => track.kind === 'audio')
  }

  getVideoTracks(): MediaStreamTrack[] {
    return this.tracks.filter(track => track.kind === 'video')
  }

  getTracks(): MediaStreamTrack[] {
    return this.tracks
  }

  addTrack(track: MediaStreamTrack): void {
    this.tracks.push(track)
  }

  removeTrack(track: MediaStreamTrack): void {
    const index = this.tracks.indexOf(track)
    if (index > -1) {
      this.tracks.splice(index, 1)
    }
  }

  clone(): MediaStream {
    return new MockMediaStream([...this.tracks]) as any
  }

  addEventListener = vi.fn()
  removeEventListener = vi.fn()
  dispatchEvent = vi.fn()
}

/**
 * Mock MediaStreamTrack for testing
 */
export class MockMediaStreamTrack {
  id: string
  kind: string
  label: string
  enabled: boolean
  muted: boolean
  readyState: MediaStreamTrackState

  constructor(kind: 'audio' | 'video' = 'audio') {
    this.id = `mock-track-${Math.random().toString(36).substr(2, 9)}`
    this.kind = kind
    this.label = `Mock ${kind} track`
    this.enabled = true
    this.muted = false
    this.readyState = 'live'
  }

  stop(): void {
    this.readyState = 'ended'
  }

  clone(): MediaStreamTrack {
    const cloned = new MockMediaStreamTrack(this.kind as 'audio' | 'video')
    cloned.enabled = this.enabled
    cloned.muted = this.muted
    return cloned as any
  }

  getCapabilities = vi.fn(() => ({}))
  getConstraints = vi.fn(() => ({}))
  getSettings = vi.fn(() => ({}))
  applyConstraints = vi.fn()
  addEventListener = vi.fn()
  removeEventListener = vi.fn()
  dispatchEvent = vi.fn()
}

/**
 * Mock AudioContext for testing
 */
export class MockAudioContext {
  state: AudioContextState = 'running'
  sampleRate: number = 44100
  currentTime: number = 0
  destination: any
  listener: any

  constructor() {
    this.destination = {
      channelCount: 2,
      channelCountMode: 'explicit',
      channelInterpretation: 'speakers'
    }
    this.listener = {}
  }

  createMediaStreamSource = vi.fn(() => ({
    connect: vi.fn(),
    disconnect: vi.fn(),
    mediaStream: new MockMediaStream()
  }))

  createMediaStreamDestination = vi.fn(() => ({
    stream: new MockMediaStream(),
    channelCount: 2,
    connect: vi.fn(),
    disconnect: vi.fn()
  }))

  createGain = vi.fn(() => ({
    gain: { value: 1.0 },
    connect: vi.fn(),
    disconnect: vi.fn()
  }))

  createAnalyser = vi.fn(() => ({
    fftSize: 2048,
    frequencyBinCount: 1024,
    connect: vi.fn(),
    disconnect: vi.fn(),
    getByteFrequencyData: vi.fn(),
    getByteTimeDomainData: vi.fn()
  }))

  suspend = vi.fn()
  resume = vi.fn()
  close = vi.fn()
  addEventListener = vi.fn()
  removeEventListener = vi.fn()
}

/**
 * Mock MediaRecorder for testing
 */
export class MockMediaRecorder {
  stream: MediaStream
  state: RecordingState = 'inactive'
  mimeType: string
  videoBitsPerSecond?: number
  audioBitsPerSecond?: number

  ondataavailable: ((event: BlobEvent) => void) | null = null
  onstart: ((event: Event) => void) | null = null
  onstop: ((event: Event) => void) | null = null
  onpause: ((event: Event) => void) | null = null
  onresume: ((event: Event) => void) | null = null
  onerror: ((event: MediaRecorderErrorEvent) => void) | null = null

  constructor(stream: MediaStream, options?: MediaRecorderOptions) {
    this.stream = stream
    this.mimeType = options?.mimeType || 'audio/webm'
    this.audioBitsPerSecond = options?.audioBitsPerSecond
    this.videoBitsPerSecond = options?.videoBitsPerSecond
  }

  start(timeslice?: number): void {
    this.state = 'recording'
    if (this.onstart) {
      this.onstart(new Event('start'))
    }
    
    // Simulate data available events
    if (timeslice && this.ondataavailable) {
      const interval = setInterval(() => {
        if (this.state === 'recording' && this.ondataavailable) {
          const mockBlob = new Blob(['mock audio data'], { type: this.mimeType })
          this.ondataavailable({ data: mockBlob } as BlobEvent)
        } else {
          clearInterval(interval)
        }
      }, timeslice)
    }
  }

  stop(): void {
    this.state = 'inactive'
    if (this.onstop) {
      this.onstop(new Event('stop'))
    }
  }

  pause(): void {
    this.state = 'paused'
    if (this.onpause) {
      this.onpause(new Event('pause'))
    }
  }

  resume(): void {
    this.state = 'recording'
    if (this.onresume) {
      this.onresume(new Event('resume'))
    }
  }

  requestData(): void {
    if (this.ondataavailable) {
      const mockBlob = new Blob(['mock audio data'], { type: this.mimeType })
      this.ondataavailable({ data: mockBlob } as BlobEvent)
    }
  }

  static isTypeSupported = vi.fn(() => true)
  addEventListener = vi.fn()
  removeEventListener = vi.fn()
  dispatchEvent = vi.fn()
}

/**
 * Create a mock audio stream with specified properties
 */
export function createMockAudioStream(options: {
  trackCount?: number
  active?: boolean
  id?: string
} = {}): MockMediaStream {
  const { trackCount = 1, active = true, id } = options
  
  const tracks = Array.from({ length: trackCount }, () => 
    new MockMediaStreamTrack('audio')
  )
  
  const stream = new MockMediaStream(tracks as any)
  stream.active = active
  if (id) stream.id = id
  
  return stream
}

/**
 * Create multiple mock audio streams
 */
export function createMockAudioStreams(count: number): MockMediaStream[] {
  return Array.from({ length: count }, (_, i) => 
    createMockAudioStream({ id: `stream-${i}` })
  )
}

/**
 * Mock Blob for testing file operations
 */
export function createMockAudioBlob(size: number = 1024, type: string = 'audio/webm'): Blob {
  const data = new Uint8Array(size).fill(0)
  return new Blob([data], { type })
}