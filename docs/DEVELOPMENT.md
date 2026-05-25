# Development Guide

## Build

```bash
npm run build
```

The build compiles TypeScript from `src` and copies static extension files into `dist`.

## Test

```bash
npm test
```

## Recording Lifecycle

1. Popup sends `request-recording`.
2. Service worker validates the active tab and creates the offscreen document.
3. Service worker requests a tab capture stream id.
4. Offscreen document captures tab audio and starts `MediaRecorder`.
5. Stop sends the recorded M4A/AAC Blob to a browser download, or WebM/Opus if the compact MIME type is unavailable.
