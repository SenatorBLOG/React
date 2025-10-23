import { useState } from 'react';
import { ArrowLeft, Upload, Music, CheckCircle2 } from 'lucide-react';
import { Track } from '../types';
import { ControlButton } from '../components/ControlButton';
import { createTestTracks } from '../utils/test-tracks';
import { Button } from '../components/ui/button';

interface FileBrowserProps {
  onAddTracks: (tracks: Track[]) => void;
  onNavigate: (screen: string) => void;
}

export function FileBrowser({ onAddTracks, onNavigate }: FileBrowserProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const audioFiles = files.filter(file => file.type.startsWith('audio/'));
    setSelectedFiles(audioFiles);
  };

  const handleAddSelected = async () => {
    if (selectedFiles.length === 0) return;

    setIsProcessing(true);
    const tracks: Track[] = [];

    for (const file of selectedFiles) {
      const url = URL.createObjectURL(file);
      
      // Get duration using audio element
      const audio = new Audio(url);
      await new Promise((resolve) => {
        audio.addEventListener('loadedmetadata', () => {
          const track: Track = {
            id: `file-${Date.now()}-${Math.random()}`,
            title: file.name.replace(/\.[^/.]+$/, ''),
            artist: 'Unknown Artist',
            duration: audio.duration,
            uri: url,
          };
          tracks.push(track);
          resolve(null);
        });
        audio.addEventListener('error', () => {
          resolve(null);
        });
      });
    }

    onAddTracks(tracks);
    setIsProcessing(false);
    setSelectedFiles([]);
    onNavigate('playlist');
  };

  const handleAddTestTracks = () => {
    const testTracks = createTestTracks();
    onAddTracks(testTracks);
    onNavigate('playlist');
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="flex items-center gap-3 p-4 border-b border-zinc-800">
        <ControlButton
          icon={ArrowLeft}
          onClick={() => onNavigate('playlist')}
          size="sm"
          label="Back"
        />
        <h1 className="text-xl">Import Audio Files</h1>
      </header>

      {/* Content */}
      <main className="flex-1 p-6 space-y-6">
        {/* File Upload */}
        <div className="bg-zinc-900 border-2 border-dashed border-zinc-700 rounded-lg p-8">
          <div className="text-center">
            <Upload size={48} className="mx-auto mb-4 text-zinc-600" />
            <h2 className="text-xl mb-2">Upload Audio Files</h2>
            <p className="text-sm text-zinc-400 mb-6">
              Select MP3, WAV, or other audio files from your device
            </p>
            <label className="inline-block">
              <input
                type="file"
                accept="audio/*"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
              <span className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg cursor-pointer transition-colors">
                <Upload size={20} />
                Select Files
              </span>
            </label>
          </div>
        </div>

        {/* Selected Files */}
        {selectedFiles.length > 0 && (
          <div className="bg-zinc-900 rounded-lg p-6">
            <h3 className="mb-4">Selected Files ({selectedFiles.length})</h3>
            <div className="space-y-2 mb-6 max-h-64 overflow-auto">
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-zinc-800 rounded-lg"
                >
                  <CheckCircle2 size={20} className="text-green-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="truncate">{file.name}</p>
                    <p className="text-sm text-zinc-400">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Button
              onClick={handleAddSelected}
              disabled={isProcessing}
              className="w-full bg-blue-500 hover:bg-blue-600"
            >
              {isProcessing ? 'Processing...' : 'Add to Playlist'}
            </Button>
          </div>
        )}

        {/* Test Tracks */}
        <div className="bg-zinc-900 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <Music size={24} className="text-blue-500 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="mb-2">Test Audio Tracks</h3>
              <p className="text-sm text-zinc-400 mb-4">
                Add 3 generated test tracks (sine wave beeps at different frequencies)
              </p>
              <Button
                onClick={handleAddTestTracks}
                variant="outline"
                className="border-zinc-700 hover:bg-zinc-800"
              >
                Add Test Tracks
              </Button>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="text-sm text-zinc-500 text-center p-4">
          <p>Supported formats: MP3, WAV, OGG, M4A</p>
          <p className="mt-1">Files are stored locally in your browser</p>
        </div>
      </main>
    </div>
  );
}
