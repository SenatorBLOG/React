import { Play, Pause, SkipBack, SkipForward, List, Settings, Disc } from 'lucide-react';
import { Track, ControlMode, GestureEvent } from '../types';
import { ControlButton } from '../components/ControlButton';
import { ProgressBar } from '../components/ProgressBar';
import { ModeIndicator } from '../components/ModeIndicator';
import { GestureOverlay } from '../components/GestureOverlay';
import { toast } from 'sonner@2.0.3';

interface HomeProps {
  currentTrack: Track | null;
  isPlaying: boolean;
  position: number;
  duration: number;
  controlMode: ControlMode;
  gestureSensitivity: number;
  visualFeedback: boolean;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSeek: (position: number) => void;
  onNavigate: (screen: string) => void;
}

export function Home({
  currentTrack,
  isPlaying,
  position,
  duration,
  controlMode,
  gestureSensitivity,
  visualFeedback,
  onPlay,
  onPause,
  onNext,
  onPrevious,
  onSeek,
  onNavigate,
}: HomeProps) {
  
  const handleGesture = (gesture: GestureEvent) => {
    if (visualFeedback) {
      const messages = {
        'swipe-left': 'Next track',
        'swipe-right': 'Previous track',
        'swipe-up': 'Volume up',
        'swipe-down': 'Volume down',
        'tap': 'Tap detected',
        'double-tap': 'Play/Pause',
        'long-press': 'Long press detected',
      };
      toast(messages[gesture.type] || 'Gesture detected');
    }

    switch (gesture.type) {
      case 'swipe-left':
        onNext();
        break;
      case 'swipe-right':
        onPrevious();
        break;
      case 'double-tap':
        isPlaying ? onPause() : onPlay();
        break;
    }
  };

  const handleCoverClick = () => {
    if (controlMode === 'touch' || controlMode === 'both') {
      onNavigate('now-playing');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-zinc-800">
        <h1 className="text-xl">Audio Player</h1>
        <div className="flex items-center gap-2">
          <ModeIndicator mode={controlMode} />
          <ControlButton
            icon={Settings}
            onClick={() => onNavigate('settings')}
            size="sm"
            label="Settings"
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-8">
        <GestureOverlay
          mode={controlMode}
          sensitivity={gestureSensitivity}
          onGesture={handleGesture}
          className="w-full max-w-md"
        >
          {/* Album Art */}
          <div
            className="w-full aspect-square bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-2xl mb-8 flex items-center justify-center cursor-pointer overflow-hidden group relative"
            onClick={handleCoverClick}
          >
            {currentTrack?.artworkUri ? (
              <img
                src={currentTrack.artworkUri}
                alt={currentTrack.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <Disc size={96} className="text-zinc-700 group-hover:text-zinc-600 transition-colors" />
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
          </div>

          {/* Track Info */}
          <div className="text-center mb-6">
            <h2 className="text-2xl mb-2 truncate">
              {currentTrack?.title || 'No track selected'}
            </h2>
            {currentTrack?.artist && (
              <p className="text-zinc-400 truncate">{currentTrack.artist}</p>
            )}
          </div>

          {/* Progress Bar */}
          <ProgressBar
            current={position}
            total={duration}
            onSeek={onSeek}
            className="mb-8"
          />

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <ControlButton
              icon={SkipBack}
              onClick={onPrevious}
              disabled={!currentTrack}
              label="Previous"
            />
            <ControlButton
              icon={isPlaying ? Pause : Play}
              onClick={isPlaying ? onPause : onPlay}
              disabled={!currentTrack}
              size="lg"
              className="bg-blue-500 hover:bg-blue-600 text-white"
              variant="default"
              label={isPlaying ? 'Pause' : 'Play'}
            />
            <ControlButton
              icon={SkipForward}
              onClick={onNext}
              disabled={!currentTrack}
              label="Next"
            />
          </div>

          {/* Quick Actions */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('playlist')}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
            >
              <List size={20} />
              <span>Playlist</span>
            </button>
          </div>
        </GestureOverlay>
      </main>

      {/* Hint */}
      {(controlMode === 'gestures' || controlMode === 'both') && (
        <div className="p-4 text-center text-sm text-zinc-500">
          Swipe left/right to change tracks
        </div>
      )}
    </div>
  );
}
