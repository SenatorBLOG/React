import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ControlButton } from '../components/ControlButton';
import DocumentPicker, {
  DocumentPickerResponse,
} from 'react-native-document-picker';

import { Track } from '../types';
import { createTestTracks } from '../utils/test-tracks';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

// helpers to extract navigation/route types
type NavigationProp = NativeStackScreenProps<RootStackParamList, 'FileBrowser'>['navigation'];
type RouteProp = NativeStackScreenProps<RootStackParamList, 'FileBrowser'>['route'];
type FileBrowserProps = {
  navigation: NavigationProp;
  route: RouteProp;
  onAddTracks: (tracks: Track[]) => void;
  onNavigate: (screen: keyof RootStackParamList) => void;
};

export function FileBrowser({ navigation, route, onAddTracks, onNavigate }: FileBrowserProps) {
  const [selectedFiles, setSelectedFiles] = useState<DocumentPickerResponse[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileSelect = async () => {
    try {
      const files = await DocumentPicker.pick({
        type: [DocumentPicker.types.audio],
        allowMultiSelection: true,
      });
      setSelectedFiles(files);
    } catch (error) {
      if (!DocumentPicker.isCancel(error)) {
        console.error('File picker error:', error);
      }
    }
  };

  const handleAddSelected = async () => {
    if (selectedFiles.length === 0) return;

    setIsProcessing(true);
    const tracks: Track[] = [];

    for (const file of selectedFiles) {
      const track: Track = {
        id: `file-${Date.now()}-${Math.random()}`,
        title: file.name?.replace(/\.[^/.]+$/, '') || 'Unknown Track',
        artist: 'Unknown Artist',
        duration: 0, // Note: Duration requires expo-av to fetch metadata
        uri: file.uri,
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
      {/* Header */}
      <View style={styles.header}>
        <ControlButton
          icon="arrow-back"
          onClick={() => navigation.navigate('Playlist')}
          label="Back"
        />
        <Text style={styles.headerTitle}>Import Audio Files</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* File Upload */}
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

        {/* Selected Files */}
        {selectedFiles.length > 0 && (
          <View style={styles.selectedFilesSection}>
            <Text style={styles.sectionTitle}>Selected Files ({selectedFiles.length})</Text>
            <FlatList
              data={selectedFiles}
              renderItem={({ item, index }) => (
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
              keyExtractor={(_, index) => index.toString()}
              style={styles.fileList}
            />
            <TouchableOpacity
              style={[styles.addButton, isProcessing && styles.addButtonDisabled]}
              onPress={handleAddSelected}
              disabled={isProcessing}
            >
              <Text style={styles.addButtonText}>
                {isProcessing ? 'Processing...' : 'Add to Playlist'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Test Tracks */}
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

        {/* Info */}
        <View style={styles.infoSection}>
          <Text style={styles.infoText}>Supported formats: MP3, WAV, OGG, M4A</Text>
          <Text style={styles.infoText}>Files are stored locally on your device</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#27272a',
  },
  headerTitle: {
    fontSize: 20,
    color: '#fff',
    marginLeft: 12,
  },
  content: {
    flex: 1,
    padding: 24,
    gap: 24,
  },
  uploadSection: {
    backgroundColor: '#18181b',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#3f3f46',
    borderRadius: 8,
    padding: 32,
  },
  uploadContent: {
    alignItems: 'center',
  },
  uploadIcon: {
    marginBottom: 16,
  },
  uploadTitle: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 8,
  },
  uploadSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
    textAlign: 'center',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3b82f6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  uploadButtonText: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 8,
  },
  selectedFilesSection: {
    backgroundColor: '#18181b',
    borderRadius: 8,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 16,
  },
  fileList: {
    maxHeight: 256,
    marginBottom: 16,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#27272a',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  fileInfo: {
    flex: 1,
    marginLeft: 12,
  },
  fileName: {
    fontSize: 14,
    color: '#fff',
  },
  fileSize: {
    fontSize: 12,
    color: '#6b7280',
  },
  addButton: {
    backgroundColor: '#3b82f6',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonDisabled: {
    backgroundColor: '#6b7280',
  },
  addButtonText: {
    fontSize: 16,
    color: '#fff',
  },
  testTracksSection: {
    backgroundColor: '#18181b',
    borderRadius: 8,
    padding: 16,
  },
  testTracksContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  testTracksIcon: {
    marginTop: 4,
    marginRight: 16,
  },
  testTracksInfo: {
    flex: 1,
  },
  testTracksSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  testTracksButton: {
    borderWidth: 1,
    borderColor: '#3f3f46',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  testTracksButtonText: {
    fontSize: 16,
    color: '#fff',
  },
  infoSection: {
    padding: 16,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
});