// screens/Settings.tsx
import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
  ScrollView,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import { Switch } from 'react-native'; // Use native Switch, not RNSwitch alias

import { ControlMode, AppSettings, RootStackParamList } from '../types';
import { ControlButton } from '../components/ControlButton';

// Import styles
import { settingsStyles as styles, theme } from '../styles/globalStyles';

type SettingsProps = {
  settings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => void;
  onResetData: () => void;
  onNavigate: (screen: keyof RootStackParamList) => void;
};

export function Settings({ settings, onUpdateSettings, onResetData, onNavigate }: SettingsProps) {
  const [showResetDialog, setShowResetDialog] = useState(false);

  const controlModes: { value: ControlMode; label: string; icon: keyof typeof Ionicons.glyphMap; description: string }[] = [
    { value: 'touch', label: 'Touch Only', icon: 'hand-left-outline', description: 'Use buttons and taps' },
    { value: 'gestures', label: 'Gestures Only', icon: 'hand-right-outline', description: 'Swipe and gesture controls' },
    { value: 'both', label: 'Both', icon: 'layers-outline', description: 'Touch and gestures' },
    { value: 'disabled', label: 'Disabled', icon: 'ban-outline', description: 'No controls' },
  ];

  const handleModeChange = (mode: ControlMode) => {
    onUpdateSettings({ ...settings, controlMode: mode });
  };

  const handleSensitivityChange = (value: number) => {
    onUpdateSettings({ ...settings, gestureSensitivity: Math.round(value) });
  };

  const handleFeedbackChange = (checked: boolean) => {
    onUpdateSettings({ ...settings, visualFeedback: checked });
  };

  const confirmReset = () => {
    onResetData();
    setShowResetDialog(false);
    onNavigate('Home');
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
          <Text style={styles.headerTitle}>Settings</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Control Mode */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Control Mode</Text>
          <View style={styles.modeList}>
            {controlModes.map((m) => (
              <TouchableOpacity
                key={m.value}
                activeOpacity={0.85}
                onPress={() => handleModeChange(m.value)}
                style={[
                  styles.modeItem,
                  settings.controlMode === m.value ? styles.modeItemActive : styles.modeItemInactive,
                ]}
              >
                <Ionicons
                  name={m.icon}
                  size={22}
                  color={settings.controlMode === m.value ? '#2563eb' : '#9ca3af'}
                />
                <View style={styles.modeText}>
                  <Text style={styles.modeLabel}>{m.label}</Text>
                  <Text style={styles.modeDesc}>{m.description}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Gesture Sensitivity */}
        <View style={styles.section}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Gesture Sensitivity</Text>
            <Text style={styles.smallText}>{settings.gestureSensitivity}%</Text>
          </View>
          <Slider
            style={{ width: '100%', height: 40 }}
            minimumValue={0}
            maximumValue={100}
            value={settings.gestureSensitivity}
            onValueChange={handleSensitivityChange}
            step={1}
            minimumTrackTintColor="#3b82f6"
            maximumTrackTintColor="#374151"
            thumbTintColor="#fff"
          />
          <Text style={styles.helperText}>Higher sensitivity = easier to trigger gestures</Text>
        </View>

        {/* Visual Feedback */}
        <View style={styles.section}>
          <View style={[styles.rowBetween, styles.feedbackRow]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.sectionTitle}>Visual Feedback</Text>
              <Text style={styles.helperText}>Show toast messages when gestures are detected</Text>
            </View>
            <Switch
              value={settings.visualFeedback}
              onValueChange={(v) => handleFeedbackChange(v)}
              trackColor={{ false: '#374151', true: '#60a5fa' }}
              thumbColor={settings.visualFeedback ? '#fff' : '#fff'}
            />
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => onNavigate('GestureTutorial')}
            >
              <Ionicons name="help-circle-outline" size={18} color="#9ca3af" />
              <Text style={styles.actionBtnText}>Gesture Tutorial</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => onNavigate('About')}
            >
              <Ionicons name="information-circle-outline" size={18} color="#9ca3af" />
              <Text style={styles.actionBtnText}>About & Debug</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Reset Data */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>
          <TouchableOpacity
            onPress={() => setShowResetDialog(true)}
            style={styles.resetBtn}
          >
            <Text style={styles.resetBtnText}>Reset All Data</Text>
          </TouchableOpacity>
          <Text style={[styles.helperText, { textAlign: 'center', marginTop: theme.spacing.sm }]}>
            This will delete all playlists and settings
          </Text>
        </View>
      </ScrollView>

      {/* Reset Confirmation Modal */}
      <Modal
        visible={showResetDialog}
        transparent
        animationType="fade"
        onRequestClose={() => setShowResetDialog(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Reset All Data?</Text>
            <Text style={styles.modalBody}>
              This will permanently delete all your playlists, tracks, and settings. This action cannot be undone.
            </Text>

            <View style={styles.modalActions}>
              <Pressable style={[styles.modalBtn, styles.modalCancel]} onPress={() => setShowResetDialog(false)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </Pressable>

              <Pressable style={[styles.modalBtn, styles.modalDanger]} onPress={confirmReset}>
                <Text style={styles.modalDangerText}>Reset Everything</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}