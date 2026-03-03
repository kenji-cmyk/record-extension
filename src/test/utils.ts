/**
 * Test utilities and helpers
 */

import { vi } from 'vitest'
import { setupChromeMocks } from './mocks/chrome-mocks'
import { setupWebAPIMocks } from './mocks/web-api-mocks'

/**
 * Setup all mocks for testing
 */
export function setupAllMocks() {
  setupChromeMocks()
  setupWebAPIMocks()
}

/**
 * Wait for a specified amount of time
 */
export function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Wait for next tick
 */
export function nextTick(): Promise<void> {
  return new Promise(resolve => process.nextTick(resolve))
}

/**
 * Create a promise that resolves after a delay
 */
export function delay<T>(ms: number, value?: T): Promise<T> {
  return new Promise(resolve => setTimeout(() => resolve(value as T), ms))
}

/**
 * Create a promise that rejects after a delay
 */
export function delayReject(ms: number, error: Error): Promise<never> {
  return new Promise((_, reject) => setTimeout(() => reject(error), ms))
}

/**
 * Mock timer utilities
 */
export const mockTimers = {
  setup: () => {
    vi.useFakeTimers()
  },
  
  cleanup: () => {
    vi.useRealTimers()
  },
  
  advance: (ms: number) => {
    vi.advanceTimersByTime(ms)
  },
  
  advanceToNext: () => {
    vi.advanceTimersToNextTimer()
  },
  
  runAll: () => {
    vi.runAllTimers()
  }
}

/**
 * Assert that a function throws with a specific error
 */
export async function expectToThrow(
  fn: () => Promise<any> | any,
  expectedError?: string | RegExp | Error
): Promise<Error> {
  try {
    await fn()
    throw new Error('Expected function to throw, but it did not')
  } catch (error) {
    if (expectedError) {
      if (typeof expectedError === 'string') {
        expect(error.message).toContain(expectedError)
      } else if (expectedError instanceof RegExp) {
        expect(error.message).toMatch(expectedError)
      } else if (expectedError instanceof Error) {
        expect(error.message).toBe(expectedError.message)
      }
    }
    return error as Error
  }
}

/**
 * Assert that a promise resolves within a timeout
 */
export async function expectToResolveWithin<T>(
  promise: Promise<T>,
  timeoutMs: number
): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error(`Promise did not resolve within ${timeoutMs}ms`)), timeoutMs)
  })
  
  return Promise.race([promise, timeoutPromise])
}

/**
 * Assert that a promise rejects within a timeout
 */
export async function expectToRejectWithin(
  promise: Promise<any>,
  timeoutMs: number
): Promise<Error> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error(`Promise did not reject within ${timeoutMs}ms`)), timeoutMs)
  })
  
  try {
    await Promise.race([promise, timeoutPromise])
    throw new Error('Expected promise to reject, but it resolved')
  } catch (error) {
    if (error.message.includes('did not reject within')) {
      throw error
    }
    return error as Error
  }
}

/**
 * Create a spy that tracks calls and arguments
 */
export function createSpy<T extends (...args: any[]) => any>(
  implementation?: T
): T & { calls: Parameters<T>[], results: ReturnType<T>[] } {
  const calls: Parameters<T>[] = []
  const results: ReturnType<T>[] = []
  
  const spy = vi.fn((...args: Parameters<T>) => {
    calls.push(args)
    const result = implementation ? implementation(...args) : undefined
    results.push(result)
    return result
  }) as any
  
  spy.calls = calls
  spy.results = results
  
  return spy
}

/**
 * Create a mock event listener
 */
export function createMockEventListener() {
  const listeners = new Map<string, Function[]>()
  
  return {
    addEventListener: vi.fn((event: string, listener: Function) => {
      if (!listeners.has(event)) {
        listeners.set(event, [])
      }
      listeners.get(event)!.push(listener)
    }),
    
    removeEventListener: vi.fn((event: string, listener: Function) => {
      const eventListeners = listeners.get(event)
      if (eventListeners) {
        const index = eventListeners.indexOf(listener)
        if (index > -1) {
          eventListeners.splice(index, 1)
        }
      }
    }),
    
    dispatchEvent: vi.fn((event: Event) => {
      const eventListeners = listeners.get(event.type)
      if (eventListeners) {
        eventListeners.forEach(listener => listener(event))
      }
      return true
    }),
    
    getListeners: (event: string) => listeners.get(event) || [],
    getAllListeners: () => listeners,
    clearListeners: () => listeners.clear()
  }
}

/**
 * Property-based testing utilities
 */
export const pbtUtils = {
  /**
   * Run a property test with custom configuration
   */
  runProperty: async (
    property: any,
    options: {
      numRuns?: number
      seed?: number
      timeout?: number
    } = {}
  ) => {
    const { numRuns = 100, seed, timeout = 5000 } = options
    
    const config = { numRuns, ...(seed && { seed }) }
    
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`Property test timed out after ${timeout}ms`))
      }, timeout)
      
      try {
        const result = property.check(config)
        clearTimeout(timer)
        resolve(result)
      } catch (error) {
        clearTimeout(timer)
        reject(error)
      }
    })
  },
  
  /**
   * Create a property test wrapper with standard configuration
   */
  createProperty: (name: string, property: any) => {
    return {
      name,
      property,
      run: (options?: any) => pbtUtils.runProperty(property, options)
    }
  }
}

/**
 * Audio testing utilities
 */
export const audioTestUtils = {
  /**
   * Verify audio stream properties
   */
  verifyAudioStream: (stream: MediaStream, expectedTracks: number = 1) => {
    expect(stream).toBeDefined()
    expect(stream.getAudioTracks()).toHaveLength(expectedTracks)
    expect(stream.active).toBe(true)
  },
  
  /**
   * Verify audio track properties
   */
  verifyAudioTrack: (track: MediaStreamTrack) => {
    expect(track).toBeDefined()
    expect(track.kind).toBe('audio')
    expect(track.readyState).toBe('live')
    expect(track.enabled).toBe(true)
  },
  
  /**
   * Create a test audio context
   */
  createTestAudioContext: () => {
    const context = new (global as any).AudioContext()
    return context
  }
}

/**
 * Extension testing utilities
 */
export const extensionTestUtils = {
  /**
   * Simulate extension installation
   */
  simulateInstall: () => {
    const installEvent = new Event('install')
    global.chrome.runtime.onInstalled.addListener.mock.calls.forEach(([listener]) => {
      listener({ reason: 'install' })
    })
  },
  
  /**
   * Simulate message passing
   */
  simulateMessage: (message: any, sender?: any) => {
    global.chrome.runtime.onMessage.addListener.mock.calls.forEach(([listener]) => {
      listener(message, sender || {}, vi.fn())
    })
  },
  
  /**
   * Simulate tab updates
   */
  simulateTabUpdate: (tabId: number, changeInfo: any, tab: any) => {
    global.chrome.tabs.onUpdated.addListener.mock.calls.forEach(([listener]) => {
      listener(tabId, changeInfo, tab)
    })
  }
}