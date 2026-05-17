import fc from 'fast-check'

// Audio-related generators for property-based testing

/**
 * Generator for audio sample rates
 */
export const audioSampleRateArb = fc.constantFrom(
  8000, 16000, 22050, 44100, 48000, 96000
)

/**
 * Generator for audio bit rates (in kbps)
 */
export const audioBitRateArb = fc.constantFrom(
  64, 128, 192, 256, 320
)

/**
 * Generator for audio quality levels
 */
export const audioQualityArb = fc.constantFrom(
  'low', 'medium', 'high', 'lossless'
)

/**
 * Generator for audio formats
 */
export const audioFormatArb = fc.constantFrom('webm', 'mp3')

/**
 * Generator for recording states
 */
export const recordingStateArb = fc.constantFrom(
  'idle', 'starting', 'recording', 'paused', 'stopping', 'error'
)

/**
 * Generator for audio source types
 */
export const audioSourceTypeArb = fc.constantFrom(
  'tab'
)

/**
 * Generator for volume levels (0.0 to 1.0)
 */
export const volumeArb = fc.float({ min: 0.0, max: 1.0 })

/**
 * Generator for recording options
 */
export const recordingOptionsArb = fc.record({
  streamId: fc.string({ minLength: 1 }),
  audioQuality: audioQualityArb,
  outputFormat: fc.constant('webm')
})

/**
 * Generator for audio source objects
 */
export const audioSourceArb = fc.record({
  id: fc.uuid(),
  type: audioSourceTypeArb,
  name: fc.string({ minLength: 1, maxLength: 50 }),
  isActive: fc.boolean()
})

/**
 * Generator for recording metadata
 */
export const recordingMetadataArb = fc.record({
  sampleRate: audioSampleRateArb,
  bitRate: audioBitRateArb,
  channels: fc.constantFrom(1, 2),
  format: fc.string({ minLength: 3, maxLength: 10 }),
  size: fc.nat({ max: 1000000 }) // Max 1MB for testing
})

/**
 * Generator for permission status
 */
export const permissionStatusArb = fc.record({
  tabCapture: fc.constantFrom('granted', 'denied')
})

/**
 * Generator for audio configuration
 */
export const audioConfigurationArb = fc.record({
  tabAudio: fc.record({
    enabled: fc.boolean(),
    volume: volumeArb,
    sampleRate: audioSampleRateArb
  }),
  output: fc.record({
    format: fc.constant('webm'),
    quality: audioQualityArb,
    bitRate: audioBitRateArb
  })
})

/**
 * Generator for time durations in milliseconds
 */
export const durationArb = fc.nat({ max: 3600000 }) // Max 1 hour

/**
 * Generator for arrays of audio sources
 */
export const audioSourceArrayArb = fc.array(audioSourceArb, { minLength: 0, maxLength: 10 })

/**
 * Generator for error types
 */
export const errorTypeArb = fc.constantFrom(
  'permission-denied',
  'stream-interrupted',
  'recording-failed',
  'export-failed',
  'api-unavailable'
)
