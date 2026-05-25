# Tab Recorder

Chrome extension for recording audio from the active browser tab.

## What It Does

- Records audio from the current tab only.
- Saves compact M4A/AAC recordings when supported, with WebM/Opus fallback.
- Keeps captured tab audio audible by routing it back to the output device.
- Uses a Manifest V3 offscreen document for background recording.

## What It Does Not Do

- It does not request or record microphone input.
- It does not capture Chrome internal pages such as `chrome://` URLs.

## Development

```bash
npm install
npm run build
npm test
```

Load the generated `dist` folder as an unpacked extension in Chrome.

## Structure

- `public` contains extension static assets copied into `dist`.
- `src/core` contains capture, mixing, recorder, and orchestration logic.
- `src/extension` contains service worker and offscreen document managers.
- `src/ui` contains popup UI state and interactions.
- `docs` contains architecture and API notes.
- `dist` contains the compiled extension bundle.
