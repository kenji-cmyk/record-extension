# 📚 Source Code Documentation

This directory contains the TypeScript source code for the Chrome Audio Recorder extension.

## 📁 Directory Structure

```
src/
├── core/                          # Core recording functionality
│   ├── AudioCaptureManager.ts     # Audio stream capture
│   ├── AudioMixer.ts              # Web Audio API mixing
│   ├── ErrorHandler.ts            # Error handling
│   ├── MediaRecorderManager.ts    # Recording management
│   ├── PermissionManager.ts       # Permission checks
│   └── RecordingController.ts     # Main controller
├── extension/                     # Chrome extension specific code
├── ui/                           # UI components
├── types/                        # TypeScript type definitions
├── test/                         # Unit tests
├── offscreen.ts                  # Offscreen document handler
├── popup.ts                      # Popup UI logic
└── service-worker.ts             # Background service worker
```

## 🎯 Core Modules

### AudioCaptureManager
**Purpose:** Capture audio from browser tabs and microphone  
**APIs Used:** `chrome.tabCapture`, `navigator.mediaDevices`  
**Key Methods:**
- `captureTabAudio(tabId)` - Capture tab audio
- `captureMicrophone(constraints)` - Capture mic audio
- `listAudioDevices()` - List available devices

### AudioMixer
**Purpose:** Mix multiple audio streams using Web Audio API  
**APIs Used:** Web Audio API (`AudioContext`, `GainNode`, etc.)  
**Key Methods:**
- `mixStreams(streams)` - Mix tab + mic audio
- `getAudioLevel(stream)` - Get real-time audio level
- `cleanup()` - Release resources

### MediaRecorderManager
**Purpose:** Handle audio recording lifecycle  
**APIs Used:** MediaRecorder API  
**Key Methods:**
- `startRecording(stream)` - Start recording
- `stopRecording()` - Stop and get Blob
- `isRecording()` - Check recording state

### RecordingController
**Purpose:** High-level orchestration of recording process  
**Dependencies:** All core modules  
**Key Methods:**
- `startRecording(tabId)` - Start complete recording
- `stopRecording()` - Stop and download
- `getState()` - Get current state

## 🔧 Build Output

When compiled, TypeScript files are transpiled to JavaScript in the `dist/` directory:

```
src/core/AudioMixer.ts  →  dist/core/AudioMixer.js
src/popup.ts            →  dist/popup.js
```

## 🧪 Testing

Tests are located in `src/test/`:
- Unit tests for each module
- Integration tests
- Mock implementations for Chrome APIs

Run tests:
```bash
npm run test           # Run once
npm run test:watch     # Watch mode
npm run test:ui        # Visual UI
npm run test:coverage  # Coverage report
```

## 📖 Full Documentation

- **[README.md](../README.md)** - Project overview and setup
- **[TECH-STACK.md](../TECH-STACK.md)** - Complete technical documentation
- **[API-REFERENCE.md](../API-REFERENCE.md)** - API documentation for all modules

## 🚀 Development Workflow

1. **Edit source files** in `src/`
2. **Run watch mode**: `npm run watch`
3. **Reload extension** in Chrome
4. **Test changes**

## 💡 Code Style

- **TypeScript strict mode** enabled
- **ESLint** for code quality
- **Prettier** for formatting (if configured)
- **JSDoc comments** for public APIs

## 🎯 Module Dependencies

```
RecordingController
    ↓
    ├── AudioCaptureManager
    │       ↓
    │       └── PermissionManager
    ├── AudioMixer
    └── MediaRecorderManager
            ↓
            └── ErrorHandler
```

## 📝 Adding New Features

1. Create new module in appropriate directory
2. Add TypeScript types in `types/`
3. Write unit tests in `test/`
4. Update documentation
5. Export from main index (if library)

## 🔗 Integration Example

```typescript
// Import core modules
import { RecordingController } from './core/RecordingController';
import { AudioMixer } from './core/AudioMixer';

// Create controller
const controller = new RecordingController({
  tabGain: 1.0,
  micGain: 8.0
});

// Start recording
await controller.startRecording(tabId);

// Stop recording
const blob = await controller.stopRecording();
```

## 🛠️ TypeScript Configuration

See `tsconfig.json` for:
- Target: ES2020
- Module: ES2020
- Strict mode: enabled
- Source maps: enabled
- Declaration files: generated

## 📦 Reusability

All core modules are designed to be:
- **Framework-agnostic** (pure TypeScript)
- **Well-typed** (full TypeScript support)
- **Testable** (dependency injection ready)
- **Documented** (JSDoc comments)
- **Modular** (single responsibility)

Perfect for integration into larger projects!

---

**For complete technical details, see [TECH-STACK.md](../TECH-STACK.md)**
