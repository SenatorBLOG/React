// Generate test audio tracks (sine wave beeps at different frequencies)
import { Track } from '../types';

export function generateTestAudio(frequency: number, duration: number): string {
  const sampleRate = 44100;
  const numSamples = sampleRate * duration;
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const buffer = audioContext.createBuffer(1, numSamples, sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < numSamples; i++) {
    data[i] = Math.sin(2 * Math.PI * frequency * i / sampleRate);
  }

  // Convert to WAV
  const wav = encodeWAV(buffer);
  const blob = new Blob([wav], { type: 'audio/wav' });
  const url = URL.createObjectURL(blob);
  return url;
}

function encodeWAV(buffer: AudioBuffer): ArrayBuffer {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;
  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;

  const data = buffer.getChannelData(0);
  const dataLength = data.length * bytesPerSample;
  const bufferLength = 44 + dataLength;

  const arrayBuffer = new ArrayBuffer(bufferLength);
  const view = new DataView(arrayBuffer);

  // WAV header - RIFF chunk
  writeString(view, 0, 'RIFF');
  view.setUint32(4, bufferLength - 8, true); // File size - 8
  writeString(view, 8, 'WAVE');

  // fmt subchunk
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
  view.setUint16(20, format, true); // Audio format (1 = PCM)
  view.setUint16(22, numChannels, true); // Number of channels
  view.setUint32(24, sampleRate, true); // Sample rate
  view.setUint32(28, sampleRate * blockAlign, true); // Byte rate
  view.setUint16(32, blockAlign, true); // Block align
  view.setUint16(34, bitDepth, true); // Bits per sample

  // data subchunk
  writeString(view, 36, 'data');
  view.setUint32(40, dataLength, true); // Subchunk2Size (data size)

  // Write PCM samples
  let offset = 44;
  const volume = 0.3;
  for (let i = 0; i < data.length; i++) {
    const sample = Math.max(-1, Math.min(1, data[i] * volume));
    view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
    offset += 2;
  }

  return arrayBuffer;
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

export function createTestTracks(): Track[] {
  return [
    {
      id: 'test-1',
      title: 'Test Track 1 - A440',
      artist: 'Test Artist',
      album: 'Test Album',
      duration: 5,
      uri: generateTestAudio(440, 5), // A4 note
      artworkUri: undefined,
    },
    {
      id: 'test-2',
      title: 'Test Track 2 - C523',
      artist: 'Test Artist',
      album: 'Test Album',
      duration: 5,
      uri: generateTestAudio(523.25, 5), // C5 note
      artworkUri: undefined,
    },
    {
      id: 'test-3',
      title: 'Test Track 3 - E659',
      artist: 'Test Artist',
      album: 'Test Album',
      duration: 5,
      uri: generateTestAudio(659.25, 5), // E5 note
      artworkUri: undefined,
    },
  ];
}
