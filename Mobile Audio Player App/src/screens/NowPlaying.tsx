import { ArrowLeft, Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, RotateCcw, RotateCw, Disc } from 'lucide-react';
import { Track, GestureEvent } from '../types';
import { ControlButton } from '../components/ControlButton';
import { ProgressBar } from '../components/ProgressBar';
import { GestureOverlay } from '../components/GestureOverlay';
import { toast } from 'sonner@2.0.3';

interface NowPlayingProps {
  currentTrack: Track | null;
  isPlaying: boolean;
  position: number;
  duration: number;
  controlMode: 'touch' | 'gestures' | 'both' | 'disabled';
  gestureSensitivity: number;
  visualFeedback: boolean;
  shuffle: boolean;
  repeat: 'off' | 'one' | 'all';
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSeek: (position: number) => void;
  onSeekRelative: (seconds: number) => void;
  onToggleShuffle: () => void;
  onToggleRepeat: () => void;
  onNavigate: (screen: string) => void;
}

export function NowPlaying({
  currentTrack,
  isPlaying,
  position,
  duration,
  controlMode,
  gestureSensitivity,
  visualFeedback,
  shuffle,
  repeat,
  onPlay,
  onPause,
  onNext,
  onPrevious,
  onSeek,
  onSeekRelative,
  onToggleShuffle,
  onToggleRepeat,
  onNavigate,
}: NowPlayingProps) {
  
  const handleGesture = (gesture: GestureEvent) => {
    if (visualFeedback) {
      const messages = {
        'swipe-left': 'Next track',
        'swipe-right': 'Previous track',
        'tap': 'Tap detected',
        'double-tap': 'Play/Pause',
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-4">
        <ControlButton
          icon={ArrowLeft}
          onClick={() => onNavigate('home')}
          size="sm"
          label="Back"
        />
        <h1 className="text-sm">Now Playing</h1>
        <div className="w-8" /> {/* Spacer for alignment */}
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-8">
        <GestureOverlay
          mode={controlMode}
          sensitivity={gestureSensitivity}
          onGesture={handleGesture}
          className="w-full max-w-md flex flex-col"
        >
          {/* Large Album Art */}
          <div className="w-full aspect-square bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-3xl mb-8 flex items-center justify-center overflow-hidden shadow-2xl">
            {currentTrack?.artworkUri ? (
              <img
                src={currentTrack.artworkUri}
                alt={currentTrack.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <Disc size={128} className="text-zinc-700" />
            )}
          </div>

          {/* Track Info */}
          <div className="mb-8">
            <h2 className="text-3xl mb-2">
              {currentTrack?.title || 'No track selected'}
            </h2>
            {currentTrack?.artist && (
              <p className="text-xl text-zinc-400">{currentTrack.artist}</p>
            )}
            {currentTrack?.album && (
              <p className="text-sm text-zinc-500 mt-1">{currentTrack.album}</p>
            )}
          </div>

          {/* Progress Bar */}
          <ProgressBar
            current={position}
            total={duration}
            onSeek={onSeek}
            className="mb-8"
          />

          {/* Main Controls */}
          <div className="flex items-center justify-center gap-6 mb-8">
            <ControlButton
              icon={SkipBack}
              onClick={onPrevious}
              disabled={!currentTrack}
              size="default"
              label="Previous"
            />
            <ControlButton
              icon={isPlaying ? Pause : Play}
              onClick={isPlaying ? onPause : onPlay}
              disabled={!currentTrack}
              size="lg"
              className="bg-white hover:bg-zinc-200 text-black"
              variant="default"
              label={isPlaying ? 'Pause' : 'Play'}
            />
            <ControlButton
              icon={SkipForward}
              onClick={onNext}
              disabled={!currentTrack}
              size="default"
              label="Next"
            />
          </div>

          {/* Secondary Controls */}
          <div className="flex items-center justify-between">
            <ControlButton
              icon={Shuffle}
              onClick={onToggleShuffle}
              className={shuffle ? 'text-blue-500' : 'text-zinc-400'}
              label="Shuffle"
            />
            <ControlButton
              icon={RotateCcw}
              onClick={() => onSeekRelative(-15)}
              disabled={!currentTrack}
              label="Back 15s"
            />
            <ControlButton
              icon={Repeat}
              onClick={onToggleRepeat}
              className={repeat !== 'off' ? 'text-blue-500' : 'text-zinc-400'}
              label={`Repeat ${repeat}`}
            />
            <ControlButton
              icon={RotateCw}
              onClick={() => onSeekRelative(15)}
              disabled={!currentTrack}
              label="Forward 15s"
            />
          </div>

          {/* Lyrics Placeholder */}
          <div className="mt-8 p-4 bg-zinc-900/50 rounded-lg text-center text-sm text-zinc-500">
            Lyrics not available
          </div>
        </GestureOverlay>
      </main>

      {/* Gesture Hint */}
      {(controlMode === 'gestures' || controlMode === 'both') && (
        <div className="p-4 text-center text-sm text-zinc-500">
          Swipe left/right to change tracks • Double tap to play/pause
        </div>
      )}
    </div>
  );
}
