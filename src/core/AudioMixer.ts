import {
  AudioMixer as IAudioMixer,
  AudioSource,
  AudioSourceNode
} from '../types/index.js';

/**
 * Web Audio API-based mixer for combining multiple audio streams
 * Handles volume control and real-time audio processing
 */
export class WebAudioMixer implements IAudioMixer {
  private audioContext: AudioContext;
  private destination: MediaStreamAudioDestinationNode;
  private sources: Map<string, AudioSourceNode> = new Map();

  constructor() {
    this.audioContext = new AudioContext();
    this.destination = this.audioContext.createMediaStreamDestination();
  }

  addAudioSource(source: AudioSource): void {
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

  removeAudioSource(sourceId: string): void {
    const sourceNode = this.sources.get(sourceId);
    if (!sourceNode) return;

    sourceNode.sourceNode.disconnect();
    sourceNode.gainNode.disconnect();
    this.sources.delete(sourceId);
  }

  setSourceVolume(sourceId: string, volume: number): void {
    const sourceNode = this.sources.get(sourceId);
    if (!sourceNode) return;

    sourceNode.gainNode.gain.value = Math.min(Math.max(volume, 0), 1);
  }

  getMixedStream(): MediaStream {
    return this.destination.stream;
  }

  getAudioContext(): AudioContext {
    return this.audioContext;
  }

  dispose(): void {
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
