import { AudioQuality } from '../types/index.js';
/**
 * Manages MediaRecorder API for recording and exporting audio files
 * Supports compact M4A/AAC output with WebM/Opus fallback.
 */
export class WebMRecorderManager {
    constructor() {
        this.recordedChunks = [];
        this.activeMimeType = 'audio/webm';
    }
    startRecording(stream, options) {
        if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
            throw new Error('Recording is already in progress.');
        }
        this.recordedChunks = [];
        const mimeType = this.selectSupportedMimeType(options.outputFormat);
        const recorderOptions = {
            audioBitsPerSecond: this.getAudioBitrate(options.audioQuality)
        };
        if (this.isMimeTypeSupported(mimeType)) {
            recorderOptions.mimeType = mimeType;
        }
        this.mediaRecorder = new MediaRecorder(stream, recorderOptions);
        this.activeMimeType = this.mediaRecorder.mimeType || mimeType;
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
            const blob = new Blob(this.recordedChunks, { type: this.activeMimeType });
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
            return new Blob(this.recordedChunks, { type: this.activeMimeType });
        }
        const result = this.stopPromise;
        if (!result) {
            return new Blob(this.recordedChunks, { type: this.activeMimeType });
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
                return 48000;
            case AudioQuality.MEDIUM:
                return 96000;
            case AudioQuality.HIGH:
                return 128000;
            case AudioQuality.LOSSLESS:
                return 192000;
            default:
                return 96000;
        }
    }
    selectSupportedMimeType(format) {
        const preferredMimeTypes = this.getMimeTypeCandidates(format);
        const fallbackMimeTypes = this.getMimeTypeCandidates('webm');
        const candidate = [...preferredMimeTypes, ...fallbackMimeTypes]
            .find((mimeType) => this.isMimeTypeSupported(mimeType));
        return candidate ?? preferredMimeTypes[preferredMimeTypes.length - 1] ?? 'audio/webm';
    }
    getMimeTypeCandidates(format) {
        if (format === 'm4a') {
            return ['audio/mp4;codecs=mp4a.40.2', 'audio/mp4'];
        }
        return ['audio/webm;codecs=opus', 'audio/webm'];
    }
    isMimeTypeSupported(mimeType) {
        return typeof MediaRecorder.isTypeSupported === 'function' && MediaRecorder.isTypeSupported(mimeType);
    }
}
//# sourceMappingURL=MediaRecorderManager.js.map