// screens/Playlist.tsx
import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Track, RootStackParamList } from '../types';
import { TrackListItem } from '../components/TrackListItem';
import { ControlButton } from '../components/ControlButton';

// Import styles
import { playlistStyles as styles } from '../styles/globalStyles';

type PlaylistProps = {
  tracks: Track[];
  currentTrackId: string | null;
  isPlaying: boolean;
  onTrackSelect: (track: Track) => void;
  onAddTracks: () => void;
  onRemoveTrack: (trackId: string) => void;
  onNavigate: (screen: keyof RootStackParamList) => void;
};

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
  const [confirmVisible, setConfirmVisible] = useState(false);

  const handleLongPress = (track: Track) => {
    setTrackToDelete(track);
    setConfirmVisible(true);
  };

  const confirmDelete = () => {
    if (trackToDelete) {
      onRemoveTrack(trackToDelete.id);
      setTrackToDelete(null);
      setConfirmVisible(false);
    }
  };

  const cancelDelete = () => {
    setTrackToDelete(null);
    setConfirmVisible(false);
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <ControlButton
            icon="arrow-back"
            onClick={() => onNavigate('Home')}
            size="sm"
            label="Back"
          />
          <Text style={styles.title}>Playlist</Text>
        </View>

        <ControlButton
          icon="add"
          onClick={onAddTracks}
          size="sm"
          label="Add tracks"
        />
      </View>

      {/* Content */}
      {tracks.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="information-circle-outline" size={56} color="#4b5563" />
          <Text style={styles.emptyTitle}>No tracks yet</Text>
          <Text style={styles.emptySubtitle}>Add some tracks to get started</Text>
          <TouchableOpacity style={styles.addButton} onPress={onAddTracks}>
            <Ionicons name="add" size={18} color="#fff" />
            <Text style={styles.addButtonText}>Add Tracks</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={tracks}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TrackListItem
              track={item}
              isPlaying={isPlaying}
              isCurrent={item.id === currentTrackId}
              onClick={() => onTrackSelect(item)}
              onLongPress={() => handleLongPress(item)}
            />
          )}
        />
      )}

      {/* Delete confirmation modal */}
      <Modal
        visible={confirmVisible}
        transparent
        animationType="fade"
        onRequestClose={cancelDelete}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Delete track?</Text>
            <Text style={styles.modalBody}>
              Are you sure you want to remove "{trackToDelete?.title}" from the playlist?
            </Text>

            <View style={styles.modalActions}>
              <Pressable style={[styles.modalBtn, styles.cancelBtn]} onPress={cancelDelete}>
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>

              <Pressable style={[styles.modalBtn, styles.deleteBtn]} onPress={confirmDelete}>
                <Ionicons name="trash-outline" size={16} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.deleteText}>Delete</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}