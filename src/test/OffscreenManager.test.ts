import { describe, expect, it, vi } from 'vitest'
import { OffscreenManager } from '../extension/OffscreenManager'
import { AudioQuality, RecordingController, RecordingState } from '../types'

function createRecordingController(): RecordingController {
  return {
    startRecording: vi.fn().mockResolvedValue(undefined),
    pauseRecording: vi.fn().mockResolvedValue(undefined),
    resumeRecording: vi.fn().mockResolvedValue(undefined),
    stopRecording: vi.fn().mockResolvedValue(new Blob([], { type: 'audio/mp4;codecs=mp4a.40.2' })),
    getRecordingState: vi.fn(() => RecordingState.IDLE),
    getRecordingDuration: vi.fn(() => 0)
  }
}

describe('OffscreenManager compact output defaults', () => {
  it('starts recordings with compact M4A output and low bitrate quality', async () => {
    const recordingController = createRecordingController()
    const manager = new OffscreenManager(recordingController)

    await manager.handleRecordingRequest('stream-id')

    expect(recordingController.startRecording).toHaveBeenCalledWith({
      streamId: 'stream-id',
      audioQuality: AudioQuality.LOW,
      outputFormat: 'm4a'
    })
  })

  it('uses an M4A extension for MP4 audio blobs', () => {
    const manager = new OffscreenManager(createRecordingController())

    expect((manager as unknown as { getFileExtension: (mimeType: string) => string }).getFileExtension('audio/mp4;codecs=mp4a.40.2')).toBe('m4a')
  })
})
