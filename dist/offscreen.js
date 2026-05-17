import { OffscreenManager } from './extension/OffscreenManager.js';
import { RecordingController } from './core/RecordingController.js';
import { AudioCaptureManager } from './core/AudioCaptureManager.js';
import { WebAudioMixer } from './core/AudioMixer.js';
import { WebMRecorderManager } from './core/MediaRecorderManager.js';
import { PermissionManager } from './core/PermissionManager.js';
import { ErrorHandler } from './core/ErrorHandler.js';
/**
 * Offscreen document entry point for audio processing
 * Initializes audio capture and recording components
 */
// Initialize core components
const permissionManager = new PermissionManager();
const audioCaptureManager = new AudioCaptureManager();
const audioMixer = new WebAudioMixer();
const mediaRecorderManager = new WebMRecorderManager();
const errorHandler = new ErrorHandler(audioMixer);
const recordingController = new RecordingController(permissionManager, audioCaptureManager, audioMixer, mediaRecorderManager, errorHandler);
const offscreenManager = new OffscreenManager(recordingController);
// Initialize audio processing
offscreenManager.initializeAudioProcessing().catch(error => {
    console.error('Failed to initialize audio processing:', error);
});
// Handle messages from service worker and popup
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.target !== 'offscreen') {
        return false;
    }
    if (message.type === 'get-recording-status') {
        sendResponse(offscreenManager.getRecordingStatus());
        return false;
    }
    void (async () => {
        try {
            switch (message.type) {
                case 'start-recording':
                    if (typeof message.data !== 'string') {
                        throw new Error('Invalid tab capture stream id.');
                    }
                    await offscreenManager.handleRecordingRequest(message.data);
                    break;
                case 'stop-recording':
                    await offscreenManager.stopRecording();
                    break;
                default:
                    console.warn('Unrecognized message type:', message.type);
            }
        }
        catch (error) {
            console.error('Offscreen message handling failed:', error);
        }
    })();
    return true;
});
//# sourceMappingURL=offscreen.js.map