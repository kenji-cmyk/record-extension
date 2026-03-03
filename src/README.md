# TypeScript Source Structure

This directory contains the TypeScript source code for the Browser-Wide Audio Recording Chrome extension.

## Directory Structure

```
src/
├── types/
│   └── index.ts              # Core TypeScript interfaces and types
├── core/
│   ├── RecordingController.ts # Main recording orchestrator
│   ├── AudioCaptureManager.ts # Audio capture from multiple sources
│   ├── AudioMixer.ts         # Web Audio API mixer
│   ├── MediaRecorderManager.ts # Recording and file export
│   ├── PermissionManager.ts  # Chrome extension permissions
│   └── ErrorHandler.ts       # Error handling and recovery
├── extension/
│   ├── ServiceWorkerManager.ts # Service worker lifecycle
│   └── OffscreenManager.ts   # Offscreen document management
├── ui/
│   └── PopupController.ts    # Popup UI controller
├── service-worker.ts         # Service worker entry point
├── offscreen.ts             # Offscreen document entry point
├── popup.ts                 # Popup entry point
└── README.md               # This file
```

## Key Components

### Core Components
- **RecordingController**: Orchestrates the entire recording process
- **AudioCaptureManager**: Manages audio capture from system, microphone, and tabs
- **AudioMixer**: Combines multiple audio streams using Web Audio API
- **MediaRecorderManager**: Handles recording and file export
- **PermissionManager**: Manages Chrome extension permissions
- **ErrorHandler**: Provides graceful error handling and recovery

### Extension Infrastructure
- **ServiceWorkerManager**: Manages extension lifecycle and message routing
- **OffscreenManager**: Handles background audio processing
- **PopupController**: Controls the popup UI and user interactions

## Build Process

1. **TypeScript Compilation**: `npm run build:ts`
   - Compiles TypeScript files to JavaScript in the `dist/` directory
   - Generates source maps and declaration files

2. **Static File Copying**: `npm run build:copy`
   - Copies HTML, CSS, icons, and other static files to `dist/`
   - Updates manifest.json with correct file paths

3. **Complete Build**: `npm run build`
   - Runs both TypeScript compilation and static file copying

## Development

- Use `npm run watch` for continuous TypeScript compilation during development
- All implementations are currently stubs - actual functionality will be added in subsequent tasks
- Each component follows the interfaces defined in `types/index.ts`

## Requirements Mapping

This structure addresses the following requirements:
- **Requirement 6.1**: Extension permissions management
- **Requirement 6.4**: TypeScript type safety and build configuration