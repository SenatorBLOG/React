// components/TrackListItem.tsx (fix gesture handler error)
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LongPressGestureHandler, State, TapGestureHandler } from 'react-native-gesture-handler';
import { Track } from '../types';

import { trackListItemStyles as styles } from '../styles/globalStyles';

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
      minDurationMs={500}
    >
      <TapGestureHandler onActivated={onClick}>
        <View
          style={[styles.container, isCurrent ? styles.current : undefined]}
          accessibilityLabel={`${track.title} by ${track.artist || 'Unknown'}, duration ${formatDuration(track.duration)}`}
        >
          <View style={styles.artwork}>
            {track.artworkUri ? (
              <Image source={{ uri: track.artworkUri }} style={styles.artworkImage} />
            ) : (
              <Ionicons name="musical-notes-outline" size={28} color="#4b5563" />
            )}
          </View>
          <View style={styles.info}>
            <View style={styles.titleContainer}>
              {isCurrent && isPlaying && <Ionicons name="play" size={14} color="#3b82f6" style={styles.playIcon} />}
              <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
                {track.title}
              </Text>
            </View>
            {track.artist && <Text style={styles.artist} numberOfLines={1} ellipsizeMode="tail">{track.artist}</Text>}
          </View>
          <Text style={styles.duration}>{formatDuration(track.duration)}</Text>
        </View>
      </TapGestureHandler>
    </LongPressGestureHandler>
  );
}