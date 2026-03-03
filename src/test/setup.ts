// Test setup file for Vitest
import { vi } from 'vitest'
import { setupAllMocks } from './utils'

// Global test configuration
beforeEach(() => {
  // Clear all mocks before each test
  vi.clearAllMocks()
  
  // Setup all mocks for each test
  setupAllMocks()
})

// Configure fast-check for property-based testing
import fc from 'fast-check'

// Set default number of runs for property tests (minimum 100 as per spec)
fc.configureGlobal({
  numRuns: 100,
  verbose: true
})

// Export configured fast-check for use in tests
export { fc }