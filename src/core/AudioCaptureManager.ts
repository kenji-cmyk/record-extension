import {
  AudioCaptureManager as IAudioCaptureManager,
  AudioSource
} from '../types/index.js';

/**
 * Captures audio from the active browser tab only.
 */
export class AudioCaptureManager implements IAudioCaptureManager {
  private audioSources: Map<string, AudioSource> = new Map();

  async initializeTabCapture(streamId: string): Promise<MediaStream> {
    if (!streamId) {
      throw new Error('Missing tab capture stream id.');
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        mandatory: {
          chromeMediaSource: 'tab',
          chromeMediaSourceId: streamId
        }
      },
      video: false
    } as MediaStreamConstraints);

    const source: AudioSource = {
      id: this.generateSourceId(),
      type: 'tab',
      name: 'Current tab',
      stream,
      isActive: true
    };

    this.audioSources.set(source.id, source);
    return stream;
  }

  releaseAllStreams(): void {
    this.audioSources.forEach((source) => {
      source.stream.getTracks().forEach((track) => track.stop());
    });
    this.audioSources.clear();
  }

  getAvailableAudioSources(): AudioSource[] {
    return Array.from(this.audioSources.values());
  }

  private generateSourceId(): string {
    return `source_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
