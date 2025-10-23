import { Track } from '../types';
import { Music, Play } from 'lucide-react';

interface TrackListItemProps {
  track: Track;
  isPlaying?: boolean;
  isCurrent?: boolean;
  onClick?: () => void;
  onLongPress?: () => void;
}

export function TrackListItem({
  track,
  isPlaying = false,
  isCurrent = false,
  onClick,
  onLongPress,
}: TrackListItemProps) {
  let longPressTimer: number | null = null;

  const handleTouchStart = () => {
    longPressTimer = window.setTimeout(() => {
      onLongPress?.();
    }, 500);
  };

  const handleTouchEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      longPressTimer = null;
    }
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds || !isFinite(seconds)) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
        isCurrent ? 'bg-blue-500/10 border border-blue-500/30' : 'hover:bg-zinc-800'
      }`}
      onClick={onClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseLeave={handleTouchEnd}
    >
      <div className="w-12 h-12 bg-zinc-800 rounded flex items-center justify-center flex-shrink-0 overflow-hidden">
        {track.artworkUri ? (
          <img src={track.artworkUri} alt="" className="w-full h-full object-cover" />
        ) : (
          <Music size={20} className="text-zinc-600" />
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          {isCurrent && isPlaying && (
            <Play size={12} className="text-blue-500 fill-blue-500 flex-shrink-0" />
          )}
          <p className="truncate">{track.title}</p>
        </div>
        {track.artist && (
          <p className="text-sm text-zinc-400 truncate">{track.artist}</p>
        )}
      </div>

      <div className="text-sm text-zinc-500 flex-shrink-0">
        {formatDuration(track.duration)}
      </div>
    </div>
  );
}
