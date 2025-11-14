// screens/FileBrowser.tsx
import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ControlButton } from '../components/ControlButton';
import * as DocumentPicker from 'expo-document-picker';
import { Audio } from 'expo-av';

import { Track } from '../types';
import { createTestTracks } from '../utils/test-tracks';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { fileBrowserStyles as styles } from '../styles/globalStyles';

type FileBrowserProps = NativeStackScreenProps<RootStackParamList, 'FileBrowser'> & {
  onAddTracks: (tracks: Track[]) => void;
  onNavigate: (screen: keyof RootStackParamList) => void;
};

type PickedFile = DocumentPicker.DocumentPickerAsset; // Используй built-in type из expo

const getTrackMetadata = async (uri: string): Promise<{ duration: number; title?: string; artist?: string }> => {
  const sound = new Audio.Sound();
  try {
    await sound.loadAsync({ uri });
    const status = await sound.getStatusAsync();
    if (status.isLoaded) {
      return {
        duration: (status.durationMillis || 0) / 1000,
        title: undefined, // expo-av не даёт tags, только duration
        artist: undefined,
      };
    }
    return { duration: 0 };
  } catch (error) {
    console.error('Metadata error:', error);
    return { duration: 0 };
  } finally {
    await sound.unloadAsync();
  }
};

export function FileBrowser({ navigation, onAddTracks }: FileBrowserProps) {
  const [selectedFiles, setSelectedFiles] = useState<PickedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileSelect = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
        multiple: true,
      });

      if (!result.canceled) {
        // Filter only audio
        const audioFiles = result.assets.filter((asset) => asset.mimeType?.startsWith('audio/'));
        setSelectedFiles(audioFiles);
      }
    } catch (error) {
      console.error('File picker error:', error);
    }
  };

  const handleAddSelected = async () => {
    if (selectedFiles.length === 0) return;

    setIsProcessing(true);
    const tracks: Track[] = [];

    for (const file of selectedFiles) {
      const metadata = await getTrackMetadata(file.uri);
      const track: Track = {
        id: `file-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        title: file.name?.replace(/\.[^/.]+$/, '') || 'Unknown Track',
        artist: 'Unknown Artist',
        duration: metadata.duration,
        uri: file.uri,
        artworkUri: undefined, // Если есть, можно добавить
      };
      tracks.push(track);
    }

    onAddTracks(tracks);
    setIsProcessing(false);
    setSelectedFiles([]);
    navigation.navigate('Playlist');
  };

  const handleAddTestTracks = () => {
    const testTracks = createTestTracks();
    onAddTracks(testTracks);
    navigation.navigate('Playlist');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ControlButton
          icon="arrow-back"
          onClick={() => navigation.navigate('Playlist')}
          label="Back"
        />
        <Text style={styles.headerTitle}>Import Audio Files</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.uploadSection}>
          <View style={styles.uploadContent}>
            <Ionicons name="cloud-upload-outline" size={48} color="#6b7280" style={styles.uploadIcon} />
            <Text style={styles.uploadTitle}>Upload Audio Files</Text>
            <Text style={styles.uploadSubtitle}>
              Select MP3, WAV, or other audio files from your device
            </Text>
            <TouchableOpacity style={styles.uploadButton} onPress={handleFileSelect}>
              <Ionicons name="cloud-upload-outline" size={20} color="#fff" />
              <Text style={styles.uploadButtonText}>Select Files</Text>
            </TouchableOpacity>
          </View>
        </View>

        {selectedFiles.length > 0 && (
          <View style={styles.selectedFilesSection}>
            <Text style={styles.sectionTitle}>Selected Files ({selectedFiles.length})</Text>
            <FlatList
              data={selectedFiles}
              renderItem={({ item }) => (
                <View style={styles.fileItem}>
                  <Ionicons name="checkmark-circle-outline" size={20} color="#22c55e" />
                  <View style={styles.fileInfo}>
                    <Text style={styles.fileName} numberOfLines={1}>
                      {item.name || 'Unknown File'}
                    </Text>
                    <Text style={styles.fileSize}>
                      {(item.size ? item.size / 1024 / 1024 : 0).toFixed(2)} MB
                    </Text>
                  </View>
                </View>
              )}
              keyExtractor={(item) => item.uri}
              style={styles.fileList}
            />
            <TouchableOpacity
              style={[styles.addButton, isProcessing && styles.addButtonDisabled]}
              onPress={handleAddSelected}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.addButtonText}>Add to Playlist</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.testTracksSection}>
          <View style={styles.testTracksContent}>
            <Ionicons name="musical-notes-outline" size={24} color="#3b82f6" style={styles.testTracksIcon} />
            <View style={styles.testTracksInfo}>
              <Text style={styles.sectionTitle}>Test Audio Tracks</Text>
              <Text style={styles.testTracksSubtitle}>
                Add 3 generated test tracks (sine wave beeps at different frequencies)
              </Text>
              <TouchableOpacity style={styles.testTracksButton} onPress={handleAddTestTracks}>
                <Text style={styles.testTracksButtonText}>Add Test Tracks</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoText}>Supported formats: MP3, WAV, OGG, M4A</Text>
          <Text style={styles.infoText}>Files are stored locally on your device</Text>
        </View>
      </View>
    </View>
  );
}
