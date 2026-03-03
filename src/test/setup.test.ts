/**
 * Test to verify testing framework setup
 */

import { describe, it, expect, vi } from 'vitest'
import { fc } from './setup'
import { setupAllMocks, audioTestUtils } from './utils'
import { createMockAudioStream } from './mocks/audio-mocks'
import { mockChrome } from './mocks/chrome-mocks'

describe('Testing Framework Setup', () => {
  it('should have Vitest configured correctly', () => {
    expect(vi).toBeDefined()
    expect(describe).toBeDefined()
    expect(it).toBeDefined()
    expect(expect).toBeDefined()
  })

  it('should have fast-check configured correctly', () => {
    expect(fc).toBeDefined()
    expect(fc.integer).toBeDefined()
    expect(fc.string).toBeDefined()
  })

  it('should have Chrome API mocks available', () => {
    expect(global.chrome).toBeDefined()
    expect(global.chrome.runtime).toBeDefined()
    expect(global.chrome.tabs).toBeDefined()
    expect(global.chrome.tabCapture).toBeDefined()
    expect(global.chrome.permissions).toBeDefined()
  })

  it('should have Web API mocks available', () => {
    expect(global.navigator).toBeDefined()
    expect(global.navigator.mediaDevices).toBeDefined()
    expect(global.MediaStream).toBeDefined()
    expect(global.MediaRecorder).toBeDefined()
    expect(global.AudioContext).toBeDefined()
  })

  it('should be able to create mock audio streams', () => {
    const stream = createMockAudioStream({ trackCount: 2 })
    audioTestUtils.verifyAudioStream(stream, 2)
  })

  it('should run a simple property-based test', () => {
    fc.assert(
      fc.property(fc.integer(), (n) => {
        return n + 0 === n
      })
    )
  })

  it('should mock Chrome API calls', async () => {
    const mockTabs = [
      { id: 1, url: 'https://example.com', audible: true }
    ]
    
    mockChrome.tabs.query.mockResolvedValue(mockTabs)
    
    const result = await global.chrome.tabs.query({ audible: true })
    expect(result).toEqual(mockTabs)
    expect(mockChrome.tabs.query).toHaveBeenCalledWith({ audible: true })
  })
})