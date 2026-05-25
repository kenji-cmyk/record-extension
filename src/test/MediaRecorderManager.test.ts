import { describe, expect, it } from 'vitest'
import { WebMRecorderManager } from '../core/MediaRecorderManager'
import { AudioQuality } from '../types'
import { createMockAudioStream } from './mocks/audio-mocks'
import { mockMediaRecorderSupport } from './mocks/web-api-mocks'

describe('WebMRecorderManager compact output', () => {
  it('records M4A/AAC when compact output is supported', async () => {
    mockMediaRecorderSupport({
      'audio/mp4;codecs=mp4a.40.2': true,
      'audio/mp4': true
    })

    const manager = new WebMRecorderManager()
    manager.startRecording(createMockAudioStream() as unknown as MediaStream, {
      streamId: 'stream-id',
      audioQuality: AudioQuality.LOW,
      outputFormat: 'm4a'
    })

    const blob = await manager.stopRecording()

    expect(blob.type).toBe('audio/mp4;codecs=mp4a.40.2')
  })

  it('falls back to WebM/Opus when M4A/AAC is not supported', async () => {
    mockMediaRecorderSupport({
      'audio/mp4;codecs=mp4a.40.2': false,
      'audio/mp4': false,
      'audio/webm;codecs=opus': true
    })

    const manager = new WebMRecorderManager()
    manager.startRecording(createMockAudioStream() as unknown as MediaStream, {
      streamId: 'stream-id',
      audioQuality: AudioQuality.LOW,
      outputFormat: 'm4a'
    })

    const blob = await manager.stopRecording()

    expect(blob.type).toBe('audio/webm;codecs=opus')
  })
})
