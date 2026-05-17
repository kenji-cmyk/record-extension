# API Reference

## Recording Flow

1. `PopupController` sends `request-recording` to the service worker.
2. `ServiceWorkerManager` validates the active tab, creates the offscreen document, and requests a tab capture stream id.
3. `OffscreenManager` starts `RecordingController` with that stream id.
4. `AudioCaptureManager` captures tab audio via `chromeMediaSource: "tab"`.
5. `WebAudioMixer` routes tab audio to the recorder and back to speakers.
6. `WebMRecorderManager` writes WebM/Opus data and returns a Blob when stopped.

## Core Classes

- `AudioCaptureManager.initializeTabCapture(streamId)` captures the active tab audio stream.
- `WebAudioMixer.addAudioSource(source)` connects a tab stream to the recording destination.
- `WebMRecorderManager.startRecording(stream, options)` starts `MediaRecorder`.
- `RecordingController.startRecording(options)` coordinates capture, mixing, and recording.
- `ServiceWorkerManager.handleMessage(message)` handles popup and offscreen messages.
- `PopupController` owns visible recording state, duration, and errors.

## Message Types

- `request-recording`: popup to service worker.
- `start-recording`: service worker to offscreen document.
- `stop-recording`: popup/service worker to offscreen document.
- `recording-started`: offscreen document to popup.
- `recording-stopped`: offscreen document to popup/service worker.
- `recording-error`: service worker/offscreen document to popup.

