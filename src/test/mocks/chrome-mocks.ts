import { vi } from 'vitest'

/**
 * Mock Chrome APIs for testing
 */

// Mock chrome.runtime
export const mockChromeRuntime = {
  id: 'mock-extension-id',
  onMessage: {
    addListener: vi.fn(),
    removeListener: vi.fn(),
    hasListener: vi.fn()
  },
  onConnect: {
    addListener: vi.fn(),
    removeListener: vi.fn(),
    hasListener: vi.fn()
  },
  onInstalled: {
    addListener: vi.fn(),
    removeListener: vi.fn(),
    hasListener: vi.fn()
  },
  sendMessage: vi.fn(),
  connect: vi.fn(),
  getURL: vi.fn((path: string) => `chrome-extension://mock-extension-id/${path}`),
  getManifest: vi.fn(() => ({
    name: 'Mock Extension',
    version: '1.0.0',
    manifest_version: 3
  })),
  lastError: null
}

// Mock chrome.tabs
export const mockChromeTabs = {
  query: vi.fn(),
  get: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  remove: vi.fn(),
  onCreated: {
    addListener: vi.fn(),
    removeListener: vi.fn(),
    hasListener: vi.fn()
  },
  onUpdated: {
    addListener: vi.fn(),
    removeListener: vi.fn(),
    hasListener: vi.fn()
  },
  onRemoved: {
    addListener: vi.fn(),
    removeListener: vi.fn(),
    hasListener: vi.fn()
  }
}

// Mock chrome.tabCapture
export const mockChromeTabCapture = {
  capture: vi.fn(),
  getCapturedTabs: vi.fn(),
  getMediaStreamId: vi.fn(),
  onStatusChanged: {
    addListener: vi.fn(),
    removeListener: vi.fn(),
    hasListener: vi.fn()
  }
}

// Mock chrome.permissions
export const mockChromePermissions = {
  contains: vi.fn(),
  request: vi.fn(),
  remove: vi.fn(),
  getAll: vi.fn(),
  onAdded: {
    addListener: vi.fn(),
    removeListener: vi.fn(),
    hasListener: vi.fn()
  },
  onRemoved: {
    addListener: vi.fn(),
    removeListener: vi.fn(),
    hasListener: vi.fn()
  }
}

// Mock chrome.offscreen
export const mockChromeOffscreen = {
  createDocument: vi.fn(),
  closeDocument: vi.fn(),
  hasDocument: vi.fn()
}

// Mock chrome.storage
export const mockChromeStorage = {
  local: {
    get: vi.fn(),
    set: vi.fn(),
    remove: vi.fn(),
    clear: vi.fn(),
    getBytesInUse: vi.fn(),
    onChanged: {
      addListener: vi.fn(),
      removeListener: vi.fn(),
      hasListener: vi.fn()
    }
  },
  sync: {
    get: vi.fn(),
    set: vi.fn(),
    remove: vi.fn(),
    clear: vi.fn(),
    getBytesInUse: vi.fn(),
    onChanged: {
      addListener: vi.fn(),
      removeListener: vi.fn(),
      hasListener: vi.fn()
    }
  }
}

// Mock chrome.action (for Manifest V3)
export const mockChromeAction = {
  setIcon: vi.fn(),
  setTitle: vi.fn(),
  setBadgeText: vi.fn(),
  setBadgeBackgroundColor: vi.fn(),
  setPopup: vi.fn(),
  getTitle: vi.fn(),
  getPopup: vi.fn(),
  getBadgeText: vi.fn(),
  getBadgeBackgroundColor: vi.fn(),
  onClicked: {
    addListener: vi.fn(),
    removeListener: vi.fn(),
    hasListener: vi.fn()
  }
}

// Complete Chrome API mock
export const mockChrome = {
  runtime: mockChromeRuntime,
  tabs: mockChromeTabs,
  tabCapture: mockChromeTabCapture,
  permissions: mockChromePermissions,
  offscreen: mockChromeOffscreen,
  storage: mockChromeStorage,
  action: mockChromeAction
}

/**
 * Setup Chrome API mocks for testing
 */
export function setupChromeMocks() {
  // @ts-ignore - Global chrome object for testing
  global.chrome = mockChrome
  
  // Reset all mocks
  Object.values(mockChrome).forEach(api => {
    if (typeof api === 'object' && api !== null) {
      Object.values(api).forEach(method => {
        if (typeof method === 'function' && method.mockReset) {
          method.mockReset()
        } else if (typeof method === 'object' && method !== null) {
          Object.values(method).forEach(subMethod => {
            if (typeof subMethod === 'function' && subMethod.mockReset) {
              subMethod.mockReset()
            }
          })
        }
      })
    }
  })
}

/**
 * Mock successful tab query response
 */
export function mockAudibleTabs(count: number = 3) {
  const tabs = Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    url: `https://example${i + 1}.com`,
    title: `Tab ${i + 1}`,
    audible: true,
    active: i === 0,
    windowId: 1,
    index: i
  }))
  
  mockChromeTabs.query.mockResolvedValue(tabs)
  return tabs
}

/**
 * Mock tab capture stream ID generation
 */
export function mockTabCaptureStreamId(tabId: number, streamId?: string) {
  const id = streamId || `stream-${tabId}-${Date.now()}`
  mockChromeTabCapture.getMediaStreamId.mockResolvedValue(id)
  return id
}

/**
 * Mock permission responses
 */
export function mockPermissions(permissions: { [key: string]: boolean }) {
  mockChromePermissions.contains.mockImplementation((permission) => {
    return Promise.resolve(permissions[permission.permissions?.[0] || ''] || false)
  })
  
  mockChromePermissions.request.mockImplementation((permission) => {
    const permName = permission.permissions?.[0] || ''
    return Promise.resolve(permissions[permName] || false)
  })
}

/**
 * Mock offscreen document operations
 */
export function mockOffscreenDocument(exists: boolean = false) {
  mockChromeOffscreen.hasDocument.mockResolvedValue(exists)
  mockChromeOffscreen.createDocument.mockResolvedValue(undefined)
  mockChromeOffscreen.closeDocument.mockResolvedValue(undefined)
} 