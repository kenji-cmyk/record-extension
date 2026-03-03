# 🛠️ Technical Stack & Integration Guide

Complete technical documentation for developers who want to reuse or integrate this Chrome Audio Recorder into larger projects.

---

## 📦 Complete Dependency List

### Production Dependencies

**None** - This project uses only native Web APIs and Chrome Extension APIs. No external runtime dependencies required!

### Development Dependencies

```json
{
  "@types/chrome": "^0.0.268",      // TypeScript types for Chrome APIs
  "@types/jsdom": "^27.0.0",        // TypeScript types for jsdom
  "@vitest/ui": "^4.0.18",          // Visual test UI
  "fast-check": "^4.5.3",           // Property-based testing
  "jsdom": "^28.0.0",               // DOM environment for testing
  "rimraf": "^5.0.0",               // Cross-platform rm -rf
  "typescript": "^5.3.0",           // TypeScript compiler
  "vitest": "^4.0.18"               // Testing framework
}
```

---

## 🏗️ Architecture Patterns

### 1. **Service Worker Pattern** (Manifest V3)

```javascript
// service-worker.js - Background script
chrome.runtime.onMessage.addListener((message) => {
  // Central message router
  // Handles communication between popup, offscreen, and content scripts
});
```

**Why**: Manifest V3 requires service workers instead of background pages.

**Benefits**:
- Event-driven (wakes up when needed)
- Better resource management
- Required for Chrome Web Store submission

### 2. **Offscreen Document Pattern**

```javascript
// Create persistent context for Web Audio API
await chrome.offscreen.createDocument({
  url: 'offscreen.html',
  reasons: ['USER_MEDIA'],
  justification: 'Recording audio'
});
```

**Why**: Web Audio API requires a document context that persists during recording.

**Benefits**:
- Keeps recording active when popup closes
- Access to DOM APIs
- Proper audio context lifecycle

### 3. **Message-Based Communication**

```javascript
// Structured message format
{
  type: 'start-recording' | 'stop-recording' | 'update-icon',
  target: 'offscreen' | 'service-worker' | 'popup',
  data: any
}
```

**Why**: Components run in different contexts and can't directly call each other.

**Benefits**:
- Decoupled architecture
- Type-safe with TypeScript
- Easy to debug with logging

---

## 🎨 Web Audio API - Deep Dive

### Audio Node Types Used

| Node Type | Purpose | Configuration |
|-----------|---------|---------------|
| `AudioContext` | Main audio processing context | `sampleRate: 48000` (default) |
| `MediaStreamSourceNode` | Input from MediaStream | Created from tab/mic streams |
| `GainNode` | Volume control | `gain.value: 0.0 - 10.0` |
| `AnalyserNode` | Real-time frequency analysis | `fftSize: 256` |
| `MediaStreamDestinationNode` | Output to MediaRecorder | Auto-configured |

### Signal Flow Implementation

```typescript
// 1. Create context
const audioContext = new AudioContext();

// 2. Create input sources
const tabSource = audioContext.createMediaStreamSource(tabStream);
const micSource = audioContext.createMediaStreamSource(micStream);

// 3. Create processing nodes
const tabGain = audioContext.createGain();
const micGain = audioContext.createGain();
const analyser = audioContext.createAnalyser();

// 4. Create output destination
const destination = audioContext.createMediaStreamDestination();

// 5. Connect the graph
tabSource.connect(tabGain);
tabGain.connect(destination);                    // To recorder
tabGain.connect(audioContext.destination);       // To speakers

micSource.connect(micGain);
micGain.connect(analyser);                       // To analyser
micGain.connect(destination);                    // To recorder

// 6. Start recording
const recorder = new MediaRecorder(destination.stream);
```

### Why This Graph Structure?

1. **Tab audio goes to both speakers and recorder**
   - User needs to hear what they're recording
   - Prevents silent recording experience

2. **Microphone goes ONLY to recorder**
   - Prevents echo/feedback loop
   - User hears themselves naturally, not through speakers

3. **Separate gain nodes**
   - Independent volume control
   - Compensate for hardware differences
   - Boost low microphone signals

---

## 🎙️ MediaRecorder API Configuration

### Optimal Settings

```javascript
new MediaRecorder(stream, {
  mimeType: 'audio/webm;codecs=opus',  // Best compression + quality
  audioBitsPerSecond: 128000,          // 128 kbps (good quality)
  videoBitsPerSecond: 0                // Audio only
});
```

### Format Comparison

| Format | Quality | Size | Browser Support | Notes |
|--------|---------|------|-----------------|-------|
| `audio/webm;codecs=opus` | ⭐⭐⭐⭐⭐ | Small | Chrome, Edge, Firefox | **Recommended** |
| `audio/webm;codecs=vp8` | ⭐⭐⭐⭐ | Medium | Chrome, Edge | Fallback |
| `audio/webm` | ⭐⭐⭐ | Varies | All | Browser default |
| `audio/mp4` | ⭐⭐⭐⭐ | Large | Safari only | Not in Chrome |

### Bitrate Guidelines

- **64 kbps**: Voice only, minimal quality
- **96 kbps**: Good for speech
- **128 kbps**: ✅ **Recommended** - Good quality, reasonable size
- **192 kbps**: High quality music
- **256 kbps**: Studio quality (overkill for most uses)

---

## 🔌 Chrome Extension APIs - Usage Examples

### 1. Tab Capture API

```typescript
// Get stream ID for specific tab
const streamId = await chrome.tabCapture.getMediaStreamId({
  targetTabId: tab.id
});

// Use with getUserMedia
const tabAudioStream = await navigator.mediaDevices.getUserMedia({
  audio: {
    mandatory: {
      chromeMediaSource: 'tab',
      chromeMediaSourceId: streamId
    }
  },
  video: false  // Audio only
});
```

**Limitations**:
- Only works in Chrome extensions
- Requires `tabCapture` permission
- Cannot capture chrome:// pages
- User must interact with extension first

### 2. Offscreen Documents API

```typescript
// Check if offscreen document exists
const contexts = await chrome.runtime.getContexts({
  contextTypes: ['OFFSCREEN_DOCUMENT']
});

if (contexts.length === 0) {
  // Create new offscreen document
  await chrome.offscreen.createDocument({
    url: 'offscreen.html',
    reasons: ['USER_MEDIA'],
    justification: 'Audio recording with Web Audio API'
  });
}

// Close offscreen document
await chrome.offscreen.closeDocument();
```

**Best Practices**:
- Check if document exists before creating
- Close when not needed (resource cleanup)
- Use specific reasons for better Chrome Store approval

### 3. Runtime Messaging

```typescript
// Send message
chrome.runtime.sendMessage({
  type: 'start-recording',
  target: 'offscreen',
  data: { streamId, settings }
});

// Listen for messages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.target === 'popup') {
    handlePopupMessage(message);
    sendResponse({ success: true });
  }
  return true;  // Keep channel open for async response
});
```

**Gotchas**:
- Must `return true` for async responses
- Message data is cloned (no functions/streams)
- Use `target` field to route messages

---

## 🧪 Testing Strategy

### Test Stack

```typescript
// vitest.config.ts
{
  test: {
    environment: 'jsdom',           // Browser-like DOM
    globals: true,                  // expect, describe, it
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html']
    }
  }
}
```

### Mock Chrome APIs

```typescript
// src/test/setup.ts
global.chrome = {
  runtime: {
    sendMessage: vi.fn(),
    onMessage: {
      addListener: vi.fn()
    }
  },
  tabCapture: {
    getMediaStreamId: vi.fn().mockResolvedValue('mock-stream-id')
  },
  offscreen: {
    createDocument: vi.fn().mockResolvedValue(undefined),
    closeDocument: vi.fn().mockResolvedValue(undefined)
  }
};
```

### Mock Web Audio API

```typescript
// Mock AudioContext
class MockAudioContext {
  createMediaStreamSource = vi.fn(() => ({
    connect: vi.fn()
  }));
  
  createGain = vi.fn(() => ({
    gain: { value: 1.0 },
    connect: vi.fn()
  }));
  
  createMediaStreamDestination = vi.fn(() => ({
    stream: new MediaStream()
  }));
  
  destination = {};
}

global.AudioContext = MockAudioContext;
```

### Property-Based Testing with fast-check

```typescript
import fc from 'fast-check';

test('gain value always between 0 and 10', () => {
  fc.assert(
    fc.property(fc.float({ min: 0, max: 10 }), (gainValue) => {
      const gain = createGainNode();
      gain.gain.value = gainValue;
      expect(gain.gain.value).toBeGreaterThanOrEqual(0);
      expect(gain.gain.value).toBeLessThanOrEqual(10);
    })
  );
});
```

---

## 🔄 Integration Patterns

### Pattern 1: As a Library Module

```typescript
// Export core functionality
export { AudioMixer } from './src/core/AudioMixer';
export { MediaRecorderManager } from './src/core/MediaRecorderManager';
export { PermissionManager } from './src/core/PermissionManager';

// Usage in another project
import { AudioMixer } from '@yourorg/chrome-audio-recorder';

const mixer = new AudioMixer();
const mixedStream = await mixer.mixStreams([tabStream, micStream], {
  tabGain: 1.0,
  micGain: 8.0
});
```

### Pattern 2: As a Web Component

```typescript
// Create custom element
class AudioRecorderElement extends HTMLElement {
  private recorder: MediaRecorderManager;
  
  async startRecording() {
    const streams = await this.captureStreams();
    this.recorder.start(streams);
  }
  
  stopRecording() {
    return this.recorder.stop();
  }
}

customElements.define('audio-recorder', AudioRecorderElement);

// Usage in HTML
<audio-recorder id="recorder"></audio-recorder>
<button onclick="recorder.startRecording()">Record</button>
```

### Pattern 3: As a React Hook

```typescript
// useAudioRecorder.ts
export function useAudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  
  const startRecording = async () => {
    const mixer = new AudioMixer();
    const recorder = new MediaRecorderManager();
    
    mixer.onLevelChange((level) => setAudioLevel(level));
    await recorder.start(mixer.getStream());
    setIsRecording(true);
  };
  
  const stopRecording = async () => {
    const blob = await recorder.stop();
    setIsRecording(false);
    return blob;
  };
  
  return { isRecording, audioLevel, startRecording, stopRecording };
}

// Usage
function RecorderComponent() {
  const { isRecording, audioLevel, startRecording, stopRecording } = useAudioRecorder();
  
  return (
    <div>
      <button onClick={startRecording} disabled={isRecording}>
        Start Recording
      </button>
      <button onClick={stopRecording} disabled={!isRecording}>
        Stop Recording
      </button>
      <div>Level: {audioLevel}</div>
    </div>
  );
}
```

---

## 📊 Performance Considerations

### Memory Management

```typescript
// Always clean up resources
class AudioRecorder {
  private streams: MediaStream[] = [];
  private audioContext: AudioContext | null = null;
  
  async cleanup() {
    // Stop all tracks
    this.streams.forEach(stream => {
      stream.getTracks().forEach(track => track.stop());
    });
    
    // Close audio context
    if (this.audioContext?.state !== 'closed') {
      await this.audioContext?.close();
    }
    
    // Clear references
    this.streams = [];
    this.audioContext = null;
  }
}
```

### CPU Usage Optimization

```typescript
// Use larger FFT size for analyser (less CPU)
analyser.fftSize = 256;  // Good: 256, 512
// analyser.fftSize = 2048;  // High CPU usage

// Update analyser less frequently
setInterval(() => {
  updateAudioLevel();
}, 1000);  // Every second, not every frame
```

### File Size Optimization

```typescript
// Adjust bitrate based on content type
const config = {
  speech: { audioBitsPerSecond: 64000 },   // 64 kbps
  mixed: { audioBitsPerSecond: 128000 },   // 128 kbps
  music: { audioBitsPerSecond: 192000 }    // 192 kbps
};

const recorder = new MediaRecorder(stream, config.mixed);
```

---

## 🔐 Security & Privacy

### Permission Handling

```typescript
// Check microphone permission before recording
async function checkMicPermission(): Promise<boolean> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach(track => track.stop());
    return true;
  } catch (error) {
    if (error.name === 'NotAllowedError') {
      // User denied permission
      return false;
    }
    throw error;
  }
}
```

### Content Security Policy

```html
<!-- manifest.json -->
{
  "content_security_policy": {
    "extension_pages": "script-src 'self'; object-src 'self'"
  }
}
```

### Data Privacy

- ❌ **Never send audio data to external servers** without explicit user consent
- ✅ **Process audio locally** using Web Audio API
- ✅ **Clear recorded data** after download
- ✅ **Revoke object URLs** to free memory

```typescript
// Good: Clean up after download
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'recording.webm';
a.click();
URL.revokeObjectURL(url);  // ✅ Clean up
```

---

## 🚀 Deployment Checklist

### Pre-Deployment

- [ ] Run `npm run test` - All tests pass
- [ ] Run `npm run build` - No TypeScript errors
- [ ] Test in Chrome (latest version)
- [ ] Test microphone permission flow
- [ ] Test on different tab types (YouTube, Spotify, etc.)
- [ ] Test file download works
- [ ] Check console for errors
- [ ] Verify file quality (listen to recording)

### Chrome Web Store Submission

- [ ] Update version in `manifest.json`
- [ ] Create 1280x800 promotional images
- [ ] Create 128x128 icon
- [ ] Write clear description
- [ ] Document required permissions
- [ ] Include privacy policy (if collecting data)
- [ ] Test on clean Chrome profile
- [ ] Create demo video (optional but recommended)

---

## 📚 Additional Resources

### Official Documentation
- [Chrome Extension Docs](https://developer.chrome.com/docs/extensions/)
- [Web Audio API Spec](https://www.w3.org/TR/webaudio/)
- [MediaRecorder API](https://w3c.github.io/mediacapture-record/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Useful Tools
- [Chrome Extension Samples](https://github.com/GoogleChrome/chrome-extensions-samples)
- [Web Audio API Examples](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API#examples)
- [Extension Manifest Generator](https://manifest.dev/)

### Communities
- [Stack Overflow - Chrome Extensions](https://stackoverflow.com/questions/tagged/google-chrome-extension)
- [Reddit - /r/chrome_extensions](https://www.reddit.com/r/chrome_extensions/)
- [Chrome Extensions Google Group](https://groups.google.com/a/chromium.org/g/chromium-extensions)

---

## 💡 Pro Tips

1. **Use TypeScript strict mode** - Catches bugs early
2. **Mock Chrome APIs in tests** - Enables unit testing
3. **Log everything during development** - Easier debugging
4. **Test with real hardware** - Virtual mics behave differently
5. **Monitor memory usage** - Audio contexts can leak
6. **Handle all error cases** - Permissions, hardware issues, etc.
7. **Provide user feedback** - Loading states, error messages
8. **Document your code** - Future you will thank you

---

## 🎯 Quick Start for Integration

```bash
# 1. Install dependencies
npm install

# 2. Build project
npm run build

# 3. Run tests
npm run test

# 4. Start development
npm run watch  # Auto-rebuild on changes

# 5. Load in Chrome
# Open chrome://extensions/
# Enable "Developer mode"
# Click "Load unpacked"
# Select the 'dist' folder
```

---

## 📧 Support

For questions or issues:
1. Check existing documentation
2. Review GitHub issues
3. Create new issue with:
   - Chrome version
   - Error messages
   - Steps to reproduce
   - Expected vs actual behavior

---

**Built with ❤️ using Web Standards and Chrome APIs**
