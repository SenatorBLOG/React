// screens/About.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ControlButton } from '../components/ControlButton';
import { StorageService } from '../services/storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types'; 
import { aboutStyles as styles } from '../styles/globalStyles';

type AboutProps = NativeStackScreenProps<RootStackParamList, 'About'>;

export function About({ navigation }: AboutProps) {
  const [logs, setLogs] = useState<string[]>([]);
  const [storageStatus, setStorageStatus] = useState({
    playlists: false,
    settings: false,
    state: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      const storedLogs = await StorageService.getLogs();
      setLogs(storedLogs); // Теперь array, без split

      const [playlists, settings, state] = await Promise.all([
        StorageService.getStorageStatus('playlists'),
        StorageService.getStorageStatus('settings'),
        StorageService.getStorageStatus('state'),
      ]);
      setStorageStatus({ playlists, settings, state });
    };
    fetchData();
  }, []);

  const handleClearLogs = async () => {
    await StorageService.clearLogs();
    setLogs([]);
  };

  const appInfo = {
    name: 'Audio Player',
    version: '1.0.0',
    buildDate: 'November 2025', // Обновил на текущую дату
  };

  const libraries = [
    'React Native 0.81',
    'Expo 54',
    'expo-av',
    'react-native-gesture-handler',
    'react-navigation',
    'AsyncStorage',
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <ControlButton
          icon="arrow-back"
          onClick={() => navigation.goBack()}
          label="Back"
        />
        <Text style={styles.headerTitle}>About & Debug</Text>
      </View>

      {/* Content */}
      <FlatList
        data={[
          {
            key: 'appInfo',
            render: () => (
              <View style={styles.section}>
                <View style={styles.appInfo}>
                  <View style={styles.appIcon}>
                    <Ionicons name="musical-notes" size={32} color="#fff" />
                  </View>
                  <View>
                    <Text style={styles.sectionTitle}>{appInfo.name}</Text>
                    <Text style={styles.sectionText}>Version {appInfo.version}</Text>
                  </View>
                </View>
                <View style={styles.sectionTextContainer}>
                  <Text style={styles.sectionText}>Build Date: {appInfo.buildDate}</Text>
                  <Text style={styles.sectionText}>Mobile App</Text>
                </View>
              </View>
            ),
          },
          {
            key: 'features',
            render: () => (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Features</Text>
                <View style={styles.list}>
                  {[
                    'Local audio file playback',
                    'Touch and gesture controls',
                    'Playlist management',
                    'Offline support',
                    'Customizable controls',
                  ].map((item) => (
                    <View key={item} style={styles.listItem}>
                      <Text style={styles.listBullet}>•</Text>
                      <Text style={styles.listText}>{item}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ),
          },
          {
            key: 'technologies',
            render: () => (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Built With</Text>
                <View style={styles.grid}>
                  {libraries.map((lib) => (
                    <View key={lib} style={styles.gridItem}>
                      <Text style={styles.gridText}>{lib}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ),
          },
          {
            key: 'debugLogs',
            render: () => (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Debug Logs</Text>
                  <TouchableOpacity style={styles.clearButton} onPress={handleClearLogs}>
                    <Ionicons name="trash-outline" size={16} color="#d1d5db" />
                    <Text style={styles.clearButtonText}>Clear</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.logContainer}>
                  {logs.length === 0 ? (
                    <Text style={styles.noLogsText}>No logs yet</Text>
                  ) : (
                    <FlatList
                      data={logs}
                      renderItem={({ item }) => <Text style={styles.logText}>{item}</Text>}
                      keyExtractor={(item, index) => index.toString()}
                    />
                  )}
                </View>
              </View>
            ),
          },
          {
            key: 'storageInfo',
            render: () => (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Storage</Text>
                <View style={styles.storageInfo}>
                  {[
                    { label: 'Playlists', key: 'playlists', value: storageStatus.playlists },
                    { label: 'Settings', key: 'settings', value: storageStatus.settings },
                    { label: 'Current State', key: 'state', value: storageStatus.state },
                  ].map(({ label, key, value }) => (
                    <View key={label} style={styles.storageRow}>
                      <Text style={styles.storageLabel}>{label}</Text>
                      <Text style={styles.storageValue}>{value ? 'Stored' : 'Empty'}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ),
          },
          {
            key: 'privacyNote',
            render: () => (
              <View style={styles.privacySection}>
                <Text style={styles.privacyTitle}>Privacy Note</Text>
                <Text style={styles.privacyText}>
                  All your audio files and data are stored locally on your device. Nothing is sent to any server. Your music stays private.
                </Text>
              </View>
            ),
          },
        ]}
        renderItem={({ item }) => item.render()}
        keyExtractor={(item) => item.key}
        contentContainerStyle={styles.contentContainer}
      />
    </View>
  );
}
