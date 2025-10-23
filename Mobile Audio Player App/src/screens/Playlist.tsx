import { useState } from 'react';
import { ArrowLeft, Plus, Trash2, Info } from 'lucide-react';
import { Track } from '../types';
import { TrackListItem } from '../components/TrackListItem';
import { ControlButton } from '../components/ControlButton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';

interface PlaylistProps {
  tracks: Track[];
  currentTrackId: string | null;
  isPlaying: boolean;
  onTrackSelect: (track: Track) => void;
  onAddTracks: () => void;
  onRemoveTrack: (trackId: string) => void;
  onNavigate: (screen: string) => void;
}

export function Playlist({
  tracks,
  currentTrackId,
  isPlaying,
  onTrackSelect,
  onAddTracks,
  onRemoveTrack,
  onNavigate,
}: PlaylistProps) {
  const [trackToDelete, setTrackToDelete] = useState<Track | null>(null);

  const handleLongPress = (track: Track) => {
    setTrackToDelete(track);
  };

  const confirmDelete = () => {
    if (trackToDelete) {
      onRemoveTrack(trackToDelete.id);
      setTrackToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <ControlButton
            icon={ArrowLeft}
            onClick={() => onNavigate('home')}
            size="sm"
            label="Back"
          />
          <h1 className="text-xl">Playlist</h1>
        </div>
        <ControlButton
          icon={Plus}
          onClick={onAddTracks}
          size="sm"
          label="Add tracks"
        />
      </header>

      {/* Content */}
      <main className="flex-1 overflow-auto">
        {tracks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <Info size={48} className="text-zinc-600 mb-4" />
            <h2 className="text-xl mb-2">No tracks yet</h2>
            <p className="text-zinc-400 mb-6">
              Add some tracks to get started
            </p>
            <button
              onClick={onAddTracks}
              className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
            >
              <Plus size={20} />
              <span>Add Tracks</span>
            </button>
          </div>
        ) : (
          <div className="p-4 space-y-2">
            <div className="text-sm text-zinc-400 mb-4">
              {tracks.length} track{tracks.length !== 1 ? 's' : ''}
            </div>
            {tracks.map((track) => (
              <TrackListItem
                key={track.id}
                track={track}
                isPlaying={isPlaying}
                isCurrent={track.id === currentTrackId}
                onClick={() => onTrackSelect(track)}
                onLongPress={() => handleLongPress(track)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!trackToDelete} onOpenChange={() => setTrackToDelete(null)}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-800">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete track?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove "{trackToDelete?.title}" from the playlist?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-zinc-800 hover:bg-zinc-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              <Trash2 size={16} className="mr-2" />
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
