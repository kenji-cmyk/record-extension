# Tech Stack

- Chrome Manifest V3
- `chrome.tabCapture`
- Offscreen documents
- Web Audio API
- MediaRecorder API
- TypeScript
- Vitest

## Runtime Architecture

The popup controls recording state, the service worker owns Chrome extension lifecycle work, and the offscreen document performs long-lived media capture and recording.

The extension captures only the active tab audio stream. The Web Audio graph connects that stream to a `MediaStreamAudioDestinationNode` for recording and also back to `audioContext.destination` so playback continues while capture is active.

Recordings default to compact M4A/AAC at low bitrate when `MediaRecorder` supports MP4 audio, with WebM/Opus as the compatibility fallback.
