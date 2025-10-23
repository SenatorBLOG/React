// components/TrackListItem.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LongPressGestureHandler, State } from 'react-native-gesture-handler';
import { Track } from '../types';

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
  const formatDuration = (seconds?: number) => {
    if (!seconds || !isFinite(seconds)) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <LongPressGestureHandler
      onHandlerStateChange={({ nativeEvent }) => {
        if (nativeEvent.state === State.ACTIVE) onLongPress?.();
      }}
    >
      <TouchableOpacity
        style={[styles.container, isCurrent ? styles.current : undefined]}
        onPress={onClick}
      >
        <View style={styles.artwork}>
          {track.artworkUri ? (
            <Image source={{ uri: track.artworkUri }} style={styles.artworkImage} />
          ) : (
            <Ionicons name="musical-notes" size={20} color="#4b5563" />
          )}
        </View>
        <View style={styles.info}>
          <View style={styles.titleContainer}>
            {isCurrent && isPlaying && <Ionicons name="play" size={12} color="#3b82f6" />}
            <Text style={styles.title} numberOfLines={1}>
              {track.title}
            </Text>
          </View>
          {track.artist && <Text style={styles.artist} numberOfLines={1}>{track.artist}</Text>}
        </View>
        <Text style={styles.duration}>{formatDuration(track.duration)}</Text>
      </TouchableOpacity>
    </LongPressGestureHandler>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  current: {
    backgroundColor: '#3b82f61a',
    borderWidth: 1,
    borderColor: '#3b82f64d',
  },
  artwork: {
    width: 48,
    height: 48,
    backgroundColor: '#1f2937',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  artworkImage: {
    width: '100%',
    height: '100%',
  },
  info: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
    flexShrink: 1,
  },
  artist: {
    color: '#9ca3af',
    fontSize: 14,
    marginTop: 2,
  },
  duration: {
    color: '#6b7280',
    fontSize: 14,
    marginLeft: 8,
  },
});
