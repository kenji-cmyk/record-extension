import { AudioQuality } from '../types/index.js';
/**
 * Manages MediaRecorder API for recording and exporting audio files
 * Supports WebM and MP3 formats with configurable quality settings
 */
export class WebMRecorderManager {
    constructor() {
        this.recordedChunks = [];
    }
    startRecording(stream, options) {
        if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
            throw new Error('Recording is already in progress.');
        }
        this.recordedChunks = [];
        const mimeType = this.getMimeType(options.outputFormat);
        const recorderOptions = {
            audioBitsPerSecond: this.getAudioBitrate(options.audioQuality)
        };
        if (MediaRecorder.isTypeSupported(mimeType)) {
            recorderOptions.mimeType = mimeType;
        }
        this.mediaRecorder = new MediaRecorder(stream, recorderOptions);
        this.stopPromise = new Promise((resolve, reject) => {
            this.resolveStop = resolve;
            this.rejectStop = reject;
        });
        this.mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                this.recordedChunks.push(event.data);
            }
        };
        this.mediaRecorder.onerror = () => {
            this.rejectStop?.(new Error('MediaRecorder failed while recording.'));
        };
        this.mediaRecorder.onstop = () => {
            const blob = new Blob(this.recordedChunks, { type: 'audio/webm' });
            this.resolveStop?.(blob);
        };
        this.mediaRecorder.start(1000);
    }
    pauseRecording() {
        if (this.mediaRecorder?.state === 'recording') {
            this.mediaRecorder.pause();
        }
    }
    resumeRecording() {
        if (this.mediaRecorder?.state === 'paused') {
            this.mediaRecorder.resume();
        }
    }
    async stopRecording() {
        if (!this.mediaRecorder || this.mediaRecorder.state === 'inactive') {
            return new Blob(this.recordedChunks, { type: 'audio/webm' });
        }
        const result = this.stopPromise;
        if (!result) {
            return new Blob(this.recordedChunks, { type: 'audio/webm' });
        }
        this.mediaRecorder.stop();
        const blob = await result;
        this.mediaRecorder = undefined;
        this.stopPromise = undefined;
        this.resolveStop = undefined;
        this.rejectStop = undefined;
        return blob;
    }
    getRecordedData() {
        return [...this.recordedChunks];
    }
    getAudioBitrate(quality) {
        switch (quality) {
            case AudioQuality.LOW:
                return 64000;
            case AudioQuality.MEDIUM:
                return 128000;
            case AudioQuality.HIGH:
                return 256000;
            case AudioQuality.LOSSLESS:
                return 320000;
            default:
                return 128000;
        }
    }
    getMimeType(format) {
        return format === 'webm' ? 'audio/webm;codecs=opus' : 'audio/webm';
    }
}
//# sourceMappingURL=MediaRecorderManager.js.map