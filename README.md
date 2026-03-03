# Chrome Recorder Extension

A Chrome extension that simultaneously records both tab audio and microphone input, with advanced audio processing capabilities.

## Overview

This extension allows you to record audio from both the current browser tab and your microphone simultaneously. It's perfect for:

- Creating voiceovers for web content
- Recording commentary while browsing
- Capturing both system audio and voice input

## Features

- ✅ Simultaneous recording of tab audio and microphone input
- 🎚️ Advanced audio processing:
  - Noise suppression for microphone input
  - Echo cancellation
  - Auto gain control
  - Customizable gain levels (1.0x for tab audio, 8.0x for microphone boost)
- 🎤 Real-time microphone level monitoring
- 🔊 Live audio mixing using Web Audio API
- 📦 Background recording capability using service workers
- 🔴 Visual recording status indicator
- 💾 Automatic file download upon completion (WebM format)
- 🛡️ Protection against recording Chrome system pages

---

## 🚀 Tech Stack & Libraries

### Core Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **Chrome Extension Manifest V3** | v3 | Modern extension architecture |
| **TypeScript** | ^5.3.0 | Type-safe development |
| **Web Audio API** | Native | Audio mixing, gain control, and processing |
| **MediaRecorder API** | Native | Audio recording |
| **MediaDevices API** | Native | Microphone and tab audio capture |

### Chrome APIs Used

```javascript
// Extension APIs
chrome.runtime.*        // Message passing, context management
chrome.tabCapture.*     // Tab audio capture
chrome.offscreen.*      // Background document for recording
chrome.action.*         // Extension icon and popup

// Web APIs
navigator.mediaDevices.getUserMedia()  // Audio stream capture
AudioContext()                          // Audio processing
MediaRecorder()                         // Recording
MediaStreamAudioSourceNode()           // Audio source nodes
GainNode()                             // Volume control
AnalyserNode()                         // Real-time audio analysis
```

### Development & Build Tools

| Tool | Version | Purpose |
|------|---------|---------|
| **Node.js** | - | JavaScript runtime |
| **npm** | - | Package management |
| **TypeScript Compiler (tsc)** | ^5.3.0 | Compile TS to JS |
| **Vitest** | ^4.0.18 | Unit testing framework |
| **@vitest/ui** | ^4.0.18 | Test UI dashboard |
| **jsdom** | ^28.0.0 | DOM testing environment |
| **fast-check** | ^4.5.3 | Property-based testing |
| **rimraf** | ^5.0.0 | Cross-platform file deletion |

### Type Definitions

| Package | Version | Purpose |
|---------|---------|---------|
| **@types/chrome** | ^0.0.268 | Chrome Extension API types |
| **@types/jsdom** | ^27.0.0 | jsdom types |

---

## 📁 Project Architecture

### Directory Structure

```
chrome-recorder-extension/
├── src/                          # TypeScript source code
│   ├── core/                     # Core recording modules
│   │   ├── AudioCaptureManager.ts    # Manages audio stream capture
│   │   ├── AudioMixer.ts             # Web Audio API mixing logic
│   │   ├── ErrorHandler.ts           # Centralized error handling
│   │   ├── MediaRecorderManager.ts   # Recording lifecycle management
│   │   ├── PermissionManager.ts      # Permission checks
│   │   └── RecordingController.ts    # Main recording controller
│   ├── extension/                # Extension-specific code
│   ├── ui/                       # UI components
│   ├── types/                    # TypeScript type definitions
│   ├── test/                     # Test files and setup
│   ├── offscreen.ts              # Offscreen document handler
│   ├── popup.ts                  # Popup UI logic
│   └── service-worker.ts         # Background service worker
├── dist/                         # Compiled output (generated)
├── icons/                        # Extension icons
│   ├── recording.png
│   └── not-recording.png
├── manifest.json                 # Extension manifest
├── popup.html                    # Popup UI
├── offscreen.html                # Offscreen document
├── permission.html               # Permission request page
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
├── vitest.config.ts              # Test configuration
└── build.js                      # Build script
```

### Key Components

#### 1. **Audio Capture Manager** (`AudioCaptureManager.ts`)
- Handles `navigator.mediaDevices.getUserMedia()` calls
- Captures tab audio via `chrome.tabCapture.getMediaStreamId()`
- Captures microphone input
- Manages stream lifecycle

#### 2. **Audio Mixer** (`AudioMixer.ts`)
- Creates `AudioContext` for mixing
- Implements gain nodes for volume control
- Connects multiple audio sources
- Routes audio to speakers and recorder

```javascript
// Audio Mixing Flow
Tab Audio Stream → GainNode (1.0x) → [Destination, Speakers]
Microphone Stream → GainNode (8.0x) → [Destination]
                                    ↓
                              MediaRecorder
```

#### 3. **Media Recorder Manager** (`MediaRecorderManager.ts`)
- Creates `MediaRecorder` with WebM/Opus codec
- Handles `ondataavailable` events
- Manages blob creation and download
- 128kbps bitrate for quality audio

#### 4. **Service Worker** (`service-worker.ts`)
- Background script (Manifest V3)
- Manages extension lifecycle
- Handles icon state updates
- Routes messages between components

#### 5. **Offscreen Document** (`offscreen.ts`)
- Persistent background context for recording
- Required for continuous audio capture
- Implements Web Audio API processing
- Handles recording even when popup is closed

---

## 🛠️ Build System

### TypeScript Configuration

```json
{
  "target": "ES2020",
  "module": "ES2020",
  "lib": ["ES2020", "DOM", "DOM.Iterable"],
  "strict": true,
  "outDir": "./dist",
  "rootDir": "./src"
}
```

### Build Process

```bash
# 1. Compile TypeScript
tsc

# 2. Copy static files (manifest, HTML, icons)
node build.js

# Output: dist/ directory ready for Chrome
```

### NPM Scripts

```bash
npm run build          # Full build (TS + copy files)
npm run build:ts       # TypeScript compilation only
npm run watch          # Watch mode for development
npm run test           # Run tests once
npm run test:watch     # Watch mode for tests
npm run test:ui        # Test UI dashboard
npm run test:coverage  # Generate coverage report
npm run clean          # Remove dist directory
```

---

## 🧪 Testing Setup

### Test Framework: Vitest

```typescript
// vitest.config.ts
{
  environment: 'jsdom',        // Browser-like environment
  globals: true,               // Global test functions
  coverage: {
    provider: 'v8',
    reporter: ['text', 'json', 'html']
  }
}
```

### Testing Tools
- **Vitest**: Modern, fast unit testing
- **jsdom**: Simulates browser DOM
- **fast-check**: Property-based testing for edge cases
- **@vitest/ui**: Visual test dashboard

---

## 🔌 Chrome Extension APIs Deep Dive

### 1. Tab Capture API

```javascript
// Get stream ID for current tab
const streamId = await chrome.tabCapture.getMediaStreamId({
  targetTabId: tab.id
});

// Use stream ID with getUserMedia
const stream = await navigator.mediaDevices.getUserMedia({
  audio: {
    mandatory: {
      chromeMediaSource: "tab",
      chromeMediaSourceId: streamId
    }
  }
});
```

### 2. Offscreen Documents API

```javascript
// Create offscreen document for background recording
await chrome.offscreen.createDocument({
  url: 'offscreen.html',
  reasons: ['USER_MEDIA'],
  justification: 'Recording from chrome.tabCapture API'
});
```

### 3. Message Passing

```javascript
// Send message to offscreen document
chrome.runtime.sendMessage({
  type: 'start-recording',
  target: 'offscreen',
  data: streamId
});

// Listen for messages
chrome.runtime.onMessage.addListener((message) => {
  if (message.target === 'offscreen') {
    // Handle message
  }
});
```

---

## 🎨 Web Audio API Implementation

### Audio Graph Architecture

```
Input Sources:
┌─────────────────┐      ┌──────────────────┐
│  Tab Audio      │      │  Microphone      │
│  MediaStream    │      │  MediaStream     │
└────────┬────────┘      └────────┬─────────┘
         │                        │
         ↓                        ↓
┌─────────────────┐      ┌──────────────────┐
│ MediaStream     │      │ MediaStream      │
│ SourceNode      │      │ SourceNode       │
└────────┬────────┘      └────────┬─────────┘
         │                        │
         ↓                        ↓
┌─────────────────┐      ┌──────────────────┐
│  GainNode       │      │  GainNode        │
│  gain: 1.0      │      │  gain: 8.0       │
└────┬────────┬───┘      └────────┬─────────┘
     │        │                   │
     │        │                   │
     │        └───────┬───────────┘
     │                │
     ↓                ↓
┌─────────┐   ┌──────────────────┐
│ Audio   │   │ MediaStream      │
│ Dest    │   │ Destination      │
│(Spkrs)  │   └────────┬─────────┘
└─────────┘            │
                       ↓
              ┌──────────────────┐
              │  MediaRecorder   │
              │  (WebM/Opus)     │
              └────────┬─────────┘
                       │
                       ↓
                  [File.webm]
```

### Code Implementation

```javascript
// Create audio context
const audioContext = new AudioContext();
const destination = audioContext.createMediaStreamDestination();

// Tab audio: Connect to both speakers and recorder
const tabSource = audioContext.createMediaStreamSource(tabStream);
const tabGain = audioContext.createGain();
tabGain.gain.value = 1.0;
tabSource.connect(tabGain);
tabGain.connect(audioContext.destination);  // Speakers
tabGain.connect(destination);                // Recorder

// Microphone: Connect to recorder only (prevents echo)
const micSource = audioContext.createMediaStreamSource(micStream);
const micGain = audioContext.createGain();
micGain.gain.value = 8.0;  // Boost for low volume mics
micSource.connect(micGain);
micGain.connect(destination);  // Recorder only

// Record mixed stream
const recorder = new MediaRecorder(destination.stream, {
  mimeType: 'audio/webm;codecs=opus',
  audioBitsPerSecond: 128000
});
```

---

## 🎤 Real-time Audio Monitoring

### Analyser Node for Level Monitoring

```javascript
// Create analyser for mic level monitoring
const analyser = audioContext.createAnalyser();
analyser.fftSize = 256;
micGain.connect(analyser);

// Monitor levels in real-time
const dataArray = new Uint8Array(analyser.frequencyBinCount);
setInterval(() => {
  analyser.getByteFrequencyData(dataArray);
  const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
  console.log(`🎤 Mic Level: ${average.toFixed(1)}`);
}, 1000);
```

---

## 📦 Reusing This Project in Larger Applications

### Integration Approaches

#### 1. **As a Chrome Extension Module**

```javascript
// Import core modules
import { AudioCaptureManager } from './src/core/AudioCaptureManager';
import { AudioMixer } from './src/core/AudioMixer';
import { MediaRecorderManager } from './src/core/MediaRecorderManager';

// Use in your extension
const captureManager = new AudioCaptureManager();
const mixer = new AudioMixer();
const recorder = new MediaRecorderManager();
```

#### 2. **As a Web Application Feature**

```javascript
// Copy core audio logic
// Note: chrome.tabCapture only works in extensions
// Use screen capture API instead for web apps

const stream = await navigator.mediaDevices.getDisplayMedia({
  video: true,
  audio: true  // Capture tab audio
});

const micStream = await navigator.mediaDevices.getUserMedia({
  audio: true
});

// Use same AudioMixer logic
```

#### 3. **As an NPM Package** (Recommended for large projects)

```bash
# Package the core modules
npm init
npm publish

# Then use in other projects
npm install @yourorg/chrome-audio-recorder
```

### Key Modules to Extract

| Module | Reusability | Dependencies |
|--------|-------------|--------------|
| `AudioMixer.ts` | ⭐⭐⭐⭐⭐ High | Web Audio API only |
| `MediaRecorderManager.ts` | ⭐⭐⭐⭐⭐ High | MediaRecorder API |
| `AudioCaptureManager.ts` | ⭐⭐⭐ Medium | Chrome APIs (extensible) |
| `PermissionManager.ts` | ⭐⭐⭐⭐ High | Generic |
| `ErrorHandler.ts` | ⭐⭐⭐⭐⭐ High | Fully generic |

---

## 🔧 Configuration & Customization

### Audio Settings

```javascript
// Adjust gain levels
tabGain.gain.value = 1.0;   // 0.0 - 10.0
micGain.gain.value = 8.0;   // 0.0 - 10.0

// Microphone processing
{
  echoCancellation: true,    // Remove echo
  noiseSuppression: true,    // Remove background noise
  autoGainControl: true      // Auto adjust volume
}

// Recording quality
{
  mimeType: 'audio/webm;codecs=opus',
  audioBitsPerSecond: 128000  // 128 kbps
}
```

### Supported Formats

- **Primary**: `audio/webm;codecs=opus` (best quality/size ratio)
- **Alternative**: `audio/webm;codecs=vp8` (wider support)
- **Fallback**: `audio/webm` (browser default)

---

## 📋 Permissions Required

```json
{
  "permissions": [
    "tabCapture",      // Tab audio capture
    "offscreen",       // Background recording
    "activeTab",       // Current tab info
    "displayCapture"   // Screen/tab selection
  ],
  "host_permissions": [
    "*://*/*"          // All URLs (for tab capture)
  ]
}
```

---

## 🚀 Running This Extension

### Development Setup

```bash
# 1. Clone repository
git clone <repository-url>
cd chrome-recorder-extension

# 2. Install dependencies
npm install

# 3. Build extension
npm run build

# 4. Load in Chrome
# - Open chrome://extensions/
# - Enable "Developer mode"
# - Click "Load unpacked"
# - Select the 'dist' folder
```

### Usage

1. Click the extension icon
2. Navigate to a webpage with audio
3. Click "Start Recording"
4. Chrome will ask for microphone permission (first time)
5. Speak and play audio
6. Click "Stop Recording"
7. File downloads automatically as `recording-[timestamp].webm`

---

## 🐛 Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| **No microphone audio** | 1. Check Windows mic volume (80-100%)<br>2. Allow mic in Chrome settings<br>3. Increase `micGain.gain.value` |
| **No tab audio** | 1. Ensure tab has audio playing<br>2. Check not on chrome:// page<br>3. Reload extension |
| **Recording not starting** | 1. Check Chrome version ≥ 116<br>2. Check console for errors<br>3. Ensure permissions granted |
| **File too quiet** | 1. Increase gain values<br>2. Check system audio levels<br>3. Increase bitrate |

---

## 📚 Additional Resources

- [Chrome Extension Manifest V3](https://developer.chrome.com/docs/extensions/mv3/)
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [MediaRecorder API](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder)
- [Chrome tabCapture API](https://developer.chrome.com/docs/extensions/reference/tabCapture/)
- [Offscreen Documents](https://developer.chrome.com/docs/extensions/reference/offscreen/)

---

## 🤝 Contributing

Feel free to submit issues and pull requests for:
- Bug fixes
- Feature enhancements
- Documentation improvements
- Test coverage

---

## 📄 License

See LICENSE file for details.

---

## 🎯 Use Cases for Integration

### 1. **Video Conferencing Apps**
- Record meeting audio with participant voices
- Capture screen share audio + commentary

### 2. **Educational Platforms**
- Create tutorial voiceovers
- Record lectures with annotations

### 3. **Content Creation Tools**
- Podcast recording
- Game commentary
- Video narration

### 4. **QA/Testing Tools**
- Bug reproduction with audio
- User testing sessions
- Demo recordings

---

## 💡 Best Practices

1. **Always request microphone permission explicitly**
2. **Stop all streams when recording ends** (prevents resource leaks)
3. **Use offscreen documents for background work** (don't rely on popup)
4. **Implement proper error handling** (permissions, device issues)
5. **Monitor audio levels** (ensure quality before recording)
6. **Clean up resources** (revoke object URLs, stop tracks)

---

**Happy Recording! 🎙️**
