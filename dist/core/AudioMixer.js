/**
 * Web Audio API-based mixer for combining multiple audio streams
 * Handles volume control and real-time audio processing
 */
export class WebAudioMixer {
    constructor() {
        this.sources = new Map();
        this.audioContext = new AudioContext();
        this.destination = this.audioContext.createMediaStreamDestination();
    }
    addAudioSource(source) {
        if (this.sources.has(source.id)) {
            return;
        }
        const sourceNode = this.audioContext.createMediaStreamSource(source.stream);
        const gainNode = this.audioContext.createGain();
        gainNode.gain.value = 1;
        sourceNode.connect(gainNode);
        gainNode.connect(this.destination);
        // chrome.tabCapture mutes the captured tab unless the stream is routed back.
        gainNode.connect(this.audioContext.destination);
        this.sources.set(source.id, { sourceNode, gainNode, source });
    }
    removeAudioSource(sourceId) {
        const sourceNode = this.sources.get(sourceId);
        if (!sourceNode)
            return;
        sourceNode.sourceNode.disconnect();
        sourceNode.gainNode.disconnect();
        this.sources.delete(sourceId);
    }
    setSourceVolume(sourceId, volume) {
        const sourceNode = this.sources.get(sourceId);
        if (!sourceNode)
            return;
        sourceNode.gainNode.gain.value = Math.min(Math.max(volume, 0), 1);
    }
    getMixedStream() {
        return this.destination.stream;
    }
    getAudioContext() {
        return this.audioContext;
    }
    dispose() {
        // Clean up audio context and nodes
        this.sources.forEach((sourceNode) => {
            sourceNode.sourceNode.disconnect();
            sourceNode.gainNode.disconnect();
        });
        this.sources.clear();
        if (this.audioContext.state !== 'closed') {
            this.audioContext.close();
        }
    }
}
//# sourceMappingURL=AudioMixer.js.map