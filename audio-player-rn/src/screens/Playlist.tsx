// screens/Playlist.tsx
import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Track, RootStackParamList } from '../types';
import { TrackListItem } from '../components/TrackListItem';
import { ControlButton } from '../components/ControlButton';

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

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#000' },
  header: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#27272a',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  title: { color: '#fff', fontSize: 18, marginLeft: 12 },

  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyTitle: { color: '#fff', fontSize: 20, marginTop: 12 },
  emptySubtitle: { color: '#9ca3af', fontSize: 14, marginTop: 6, textAlign: 'center' },
  addButton: {
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  addButtonText: { color: '#fff', marginLeft: 8, fontSize: 14 },

  listContent: {
    padding: 12,
    paddingBottom: 24,
  },

  /* Modal styles */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 520,
    backgroundColor: '#0b0b0b',
    borderRadius: 12,
    padding: 18,
    borderWidth: 1,
    borderColor: '#27272a',
  },
  modalTitle: { color: '#fff', fontSize: 18, fontWeight: '600', marginBottom: 8 },
  modalBody: { color: '#9ca3af', fontSize: 14, marginBottom: 16 },

  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12 as any },
  modalBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
  },
  cancelBtn: { backgroundColor: '#1f2937', marginRight: 8 },
  deleteBtn: { backgroundColor: '#ef4444' },
  cancelText: { color: '#fff' },
  deleteText: { color: '#fff', fontWeight: '600' },
});
