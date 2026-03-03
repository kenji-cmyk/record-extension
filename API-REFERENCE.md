# 📖 API Reference - Core Modules

Complete API documentation for reusing core modules in your projects.

---

## 🎨 AudioMixer

Handles mixing multiple audio streams using Web Audio API.

### Class: `AudioMixer`

#### Constructor

```typescript
constructor(options?: AudioMixerOptions)

interface AudioMixerOptions {
  tabGain?: number;      // Default: 1.0
  micGain?: number;      // Default: 8.0
  sampleRate?: number;   // Default: 48000
}
```

#### Methods

##### `mixStreams(streams, options?)`

Mixes multiple audio streams into a single stream.

```typescript
async mixStreams(
  streams: {
    tab: MediaStream,
    mic: MediaStream
  },
  options?: {
    tabGain?: number,
    micGain?: number,
    routeTabToSpeakers?: boolean
  }
): Promise<MediaStream>
```

**Parameters:**
- `streams.tab` - Tab audio MediaStream
- `streams.mic` - Microphone MediaStream
- `options.tabGain` - Tab volume (0.0 - 10.0)
- `options.micGain` - Mic volume (0.0 - 10.0)
- `options.routeTabToSpeakers` - Play tab audio through speakers (default: true)

**Returns:** Mixed MediaStream ready for recording

**Example:**

```typescript
const mixer = new AudioMixer({ tabGain: 1.0, micGain: 8.0 });

const tabStream = await getTabAudio();
const micStream = await getMicAudio();

const mixedStream = await mixer.mixStreams(
  { tab: tabStream, mic: micStream },
  { routeTabToSpeakers: true }
);
```

##### `getAudioLevel(stream)`

Get real-time audio level from a stream.

```typescript
getAudioLevel(stream: MediaStream): number
```

**Parameters:**
- `stream` - Audio MediaStream to analyze

**Returns:** Audio level (0-255)

**Example:**

```typescript
const level = mixer.getAudioLevel(micStream);
console.log(`Mic level: ${level}`);
```

##### `cleanup()`

Clean up audio context and resources.

```typescript
async cleanup(): Promise<void>
```

**Example:**

```typescript
await mixer.cleanup();
```

---

## 🎙️ MediaRecorderManager

Manages MediaRecorder lifecycle and file generation.

### Class: `MediaRecorderManager`

#### Constructor

```typescript
constructor(options?: RecorderOptions)

interface RecorderOptions {
  mimeType?: string;              // Default: 'audio/webm;codecs=opus'
  audioBitsPerSecond?: number;    // Default: 128000
  onDataAvailable?: (chunk: Blob) => void;
  onStop?: (blob: Blob) => void;
}
```

#### Methods

##### `startRecording(stream)`

Start recording from a MediaStream.

```typescript
async startRecording(stream: MediaStream): Promise<void>
```

**Parameters:**
- `stream` - Audio MediaStream to record

**Throws:** Error if already recording

**Example:**

```typescript
const recorder = new MediaRecorderManager({
  audioBitsPerSecond: 128000,
  onStop: (blob) => downloadFile(blob)
});

await recorder.startRecording(mixedStream);
```

##### `stopRecording()`

Stop recording and get the recorded Blob.

```typescript
async stopRecording(): Promise<Blob>
```

**Returns:** Blob containing recorded audio

**Example:**

```typescript
const audioBlob = await recorder.stopRecording();
downloadBlob(audioBlob, 'recording.webm');
```

##### `isRecording()`

Check if currently recording.

```typescript
isRecording(): boolean
```

**Returns:** true if recording, false otherwise

##### `getRecordingDuration()`

Get current recording duration in milliseconds.

```typescript
getRecordingDuration(): number
```

**Returns:** Duration in milliseconds

**Example:**

```typescript
const duration = recorder.getRecordingDuration();
console.log(`Recorded: ${duration / 1000}s`);
```

---

## 🎤 AudioCaptureManager

Handles capturing audio from tab and microphone.

### Class: `AudioCaptureManager`

#### Constructor

```typescript
constructor()
```

#### Methods

##### `captureTabAudio(tabId)`

Capture audio from a specific browser tab.

```typescript
async captureTabAudio(tabId: number): Promise<MediaStream>
```

**Parameters:**
- `tabId` - Chrome tab ID to capture

**Returns:** MediaStream with tab audio

**Throws:** Error if tab cannot be captured

**Example:**

```typescript
const captureManager = new AudioCaptureManager();
const tabStream = await captureManager.captureTabAudio(123);
```

##### `captureMicrophone(constraints?)`

Capture audio from user's microphone.

```typescript
async captureMicrophone(
  constraints?: MediaTrackConstraints
): Promise<MediaStream>
```

**Parameters:**
- `constraints` - Optional audio constraints

```typescript
interface MediaTrackConstraints {
  echoCancellation?: boolean;    // Default: true
  noiseSuppression?: boolean;    // Default: true
  autoGainControl?: boolean;     // Default: true
  deviceId?: string;             // Specific device
}
```

**Returns:** MediaStream with microphone audio

**Example:**

```typescript
// Basic usage
const micStream = await captureManager.captureMicrophone();

// With specific device
const micStream = await captureManager.captureMicrophone({
  deviceId: 'specific-device-id',
  echoCancellation: true,
  noiseSuppression: true
});
```

##### `listAudioDevices()`

List all available audio input devices.

```typescript
async listAudioDevices(): Promise<MediaDeviceInfo[]>
```

**Returns:** Array of audio input devices

**Example:**

```typescript
const devices = await captureManager.listAudioDevices();
devices.forEach(device => {
  console.log(`${device.label}: ${device.deviceId}`);
});
```

##### `stopAllStreams()`

Stop all active audio streams.

```typescript
stopAllStreams(): void
```

**Example:**

```typescript
captureManager.stopAllStreams();
```

---

## 🔐 PermissionManager

Manages microphone permissions and checks.

### Class: `PermissionManager`

#### Static Methods

##### `checkMicrophonePermission()`

Check if microphone permission is granted.

```typescript
static async checkMicrophonePermission(): Promise<boolean>
```

**Returns:** true if permission granted, false otherwise

**Example:**

```typescript
const hasPermission = await PermissionManager.checkMicrophonePermission();
if (!hasPermission) {
  console.log('Please allow microphone access');
}
```

##### `requestMicrophonePermission()`

Request microphone permission from user.

```typescript
static async requestMicrophonePermission(): Promise<boolean>
```

**Returns:** true if permission granted, false if denied

**Example:**

```typescript
const granted = await PermissionManager.requestMicrophonePermission();
if (granted) {
  startRecording();
}
```

##### `openPermissionPage()`

Open dedicated permission request page (for Chrome extensions).

```typescript
static openPermissionPage(): void
```

**Example:**

```typescript
if (!hasPermission) {
  PermissionManager.openPermissionPage();
}
```

---

## ⚠️ ErrorHandler

Centralized error handling and user-friendly messages.

### Class: `ErrorHandler`

#### Static Methods

##### `handleRecordingError(error)`

Handle recording-related errors.

```typescript
static handleRecordingError(error: Error): string
```

**Parameters:**
- `error` - Error object

**Returns:** User-friendly error message

**Example:**

```typescript
try {
  await startRecording();
} catch (error) {
  const message = ErrorHandler.handleRecordingError(error);
  alert(message);
}
```

##### `handlePermissionError(error)`

Handle permission-related errors.

```typescript
static handlePermissionError(error: Error): {
  message: string;
  solution: string;
}
```

**Returns:** Object with error message and solution

**Example:**

```typescript
catch (error) {
  const { message, solution } = ErrorHandler.handlePermissionError(error);
  console.error(message);
  console.info('Solution:', solution);
}
```

---

## 🎮 RecordingController

High-level controller that orchestrates all recording operations.

### Class: `RecordingController`

#### Constructor

```typescript
constructor(options?: ControllerOptions)

interface ControllerOptions {
  tabGain?: number;
  micGain?: number;
  audioBitsPerSecond?: number;
  onStateChange?: (state: RecordingState) => void;
  onError?: (error: Error) => void;
  onLevelChange?: (levels: AudioLevels) => void;
}

type RecordingState = 'idle' | 'starting' | 'recording' | 'stopping';

interface AudioLevels {
  tab: number;    // 0-255
  mic: number;    // 0-255
}
```

#### Methods

##### `startRecording(tabId)`

Start recording from tab and microphone.

```typescript
async startRecording(tabId: number): Promise<void>
```

**Parameters:**
- `tabId` - Chrome tab ID to record

**Example:**

```typescript
const controller = new RecordingController({
  tabGain: 1.0,
  micGain: 8.0,
  onStateChange: (state) => console.log('State:', state),
  onLevelChange: (levels) => updateUI(levels)
});

await controller.startRecording(currentTabId);
```

##### `stopRecording()`

Stop recording and download file.

```typescript
async stopRecording(): Promise<Blob>
```

**Returns:** Recorded audio Blob

**Example:**

```typescript
const blob = await controller.stopRecording();
downloadFile(blob, 'recording.webm');
```

##### `getState()`

Get current recording state.

```typescript
getState(): RecordingState
```

**Returns:** Current state

##### `cleanup()`

Clean up all resources.

```typescript
async cleanup(): Promise<void>
```

---

## 🔧 Utility Functions

### `downloadBlob(blob, filename)`

Download a Blob as a file.

```typescript
function downloadBlob(blob: Blob, filename: string): void
```

**Example:**

```typescript
downloadBlob(audioBlob, 'my-recording.webm');
```

### `formatDuration(ms)`

Format milliseconds as MM:SS.

```typescript
function formatDuration(ms: number): string
```

**Example:**

```typescript
const formatted = formatDuration(125000);  // "02:05"
```

### `getBrowserInfo()`

Get browser name and version.

```typescript
function getBrowserInfo(): { name: string; version: string }
```

**Example:**

```typescript
const { name, version } = getBrowserInfo();
console.log(`${name} ${version}`);
```

---

## 🎯 Complete Usage Example

```typescript
import {
  RecordingController,
  PermissionManager,
  ErrorHandler
} from '@yourorg/chrome-audio-recorder';

class MyRecorder {
  private controller: RecordingController;
  
  constructor() {
    this.controller = new RecordingController({
      tabGain: 1.0,
      micGain: 8.0,
      audioBitsPerSecond: 128000,
      onStateChange: this.handleStateChange.bind(this),
      onLevelChange: this.handleLevelChange.bind(this),
      onError: this.handleError.bind(this)
    });
  }
  
  async start(tabId: number) {
    // Check permissions first
    const hasPermission = await PermissionManager.checkMicrophonePermission();
    if (!hasPermission) {
      const granted = await PermissionManager.requestMicrophonePermission();
      if (!granted) {
        alert('Microphone permission required');
        return;
      }
    }
    
    // Start recording
    try {
      await this.controller.startRecording(tabId);
      console.log('Recording started');
    } catch (error) {
      const message = ErrorHandler.handleRecordingError(error);
      alert(message);
    }
  }
  
  async stop() {
    try {
      const blob = await this.controller.stopRecording();
      this.downloadRecording(blob);
    } catch (error) {
      console.error('Stop failed:', error);
    }
  }
  
  private handleStateChange(state: RecordingState) {
    console.log('State changed:', state);
    // Update UI based on state
  }
  
  private handleLevelChange(levels: AudioLevels) {
    // Update volume meters
    this.updateMeter('tab', levels.tab);
    this.updateMeter('mic', levels.mic);
  }
  
  private handleError(error: Error) {
    const message = ErrorHandler.handleRecordingError(error);
    this.showError(message);
  }
  
  private downloadRecording(blob: Blob) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `recording-${Date.now()}.webm`;
    a.click();
    URL.revokeObjectURL(url);
  }
  
  private updateMeter(type: 'tab' | 'mic', level: number) {
    const percentage = (level / 255) * 100;
    // Update UI meter
  }
  
  private showError(message: string) {
    // Show error to user
  }
}

// Usage
const recorder = new MyRecorder();
await recorder.start(123);  // Start recording tab 123
await recorder.stop();      // Stop and download
```

---

## 🔗 Type Definitions

### Core Types

```typescript
// Recording state
type RecordingState = 'idle' | 'starting' | 'recording' | 'stopping';

// Audio levels
interface AudioLevels {
  tab: number;    // 0-255
  mic: number;    // 0-255
}

// Recording options
interface RecordingOptions {
  tabGain: number;              // 0.0 - 10.0
  micGain: number;              // 0.0 - 10.0
  audioBitsPerSecond: number;   // Bitrate in bps
  mimeType: string;             // MIME type for recording
}

// Audio constraints
interface AudioConstraints {
  echoCancellation: boolean;
  noiseSuppression: boolean;
  autoGainControl: boolean;
  deviceId?: string;
  sampleRate?: number;
}

// Error types
type ErrorType = 
  | 'PermissionDenied'
  | 'DeviceNotFound'
  | 'DeviceInUse'
  | 'NotSupported'
  | 'RecordingFailed';

interface RecordingError extends Error {
  type: ErrorType;
  solution: string;
}
```

---

## 📊 Events

### AudioMixer Events

```typescript
mixer.on('levelChange', (levels: AudioLevels) => {
  console.log(`Tab: ${levels.tab}, Mic: ${levels.mic}`);
});

mixer.on('error', (error: Error) => {
  console.error('Mixer error:', error);
});
```

### MediaRecorderManager Events

```typescript
recorder.on('dataavailable', (chunk: Blob) => {
  console.log(`Chunk size: ${chunk.size} bytes`);
});

recorder.on('start', () => {
  console.log('Recording started');
});

recorder.on('stop', (blob: Blob) => {
  console.log(`Recording complete: ${blob.size} bytes`);
});

recorder.on('error', (error: Error) => {
  console.error('Recorder error:', error);
});
```

### RecordingController Events

```typescript
controller.on('stateChange', (state: RecordingState) => {
  console.log('State:', state);
});

controller.on('levelChange', (levels: AudioLevels) => {
  updateMeters(levels);
});

controller.on('error', (error: RecordingError) => {
  showError(error.message, error.solution);
});
```

---

## 🎨 CSS Classes for UI

```css
/* Recording state indicators */
.recorder-idle { }
.recorder-starting { }
.recorder-recording { }
.recorder-stopping { }

/* Audio level meters */
.audio-meter {
  width: 100%;
  height: 20px;
  background: #eee;
}

.audio-meter-bar {
  height: 100%;
  background: linear-gradient(to right, green, yellow, red);
  transition: width 0.1s;
}

/* Button states */
.btn-record { }
.btn-record:disabled { }
.btn-stop { }
```

---

## 🚀 Quick Reference

### Start Recording

```typescript
const controller = new RecordingController();
await controller.startRecording(tabId);
```

### Stop Recording

```typescript
const blob = await controller.stopRecording();
```

### Check Permission

```typescript
const allowed = await PermissionManager.checkMicrophonePermission();
```

### Mix Audio

```typescript
const mixer = new AudioMixer();
const mixed = await mixer.mixStreams({ tab, mic });
```

### Get Audio Level

```typescript
const level = mixer.getAudioLevel(stream);
```

### Handle Errors

```typescript
try {
  await startRecording();
} catch (error) {
  const message = ErrorHandler.handleRecordingError(error);
  alert(message);
}
```

---

**Complete API documentation for Chrome Audio Recorder** 🎙️
