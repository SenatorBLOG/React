// screens/Settings.tsx
import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
  StyleSheet,
  Switch as RNSwitch,
  ScrollView,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';

import { ControlMode, AppSettings, RootStackParamList } from '../types';
import { ControlButton } from '../components/ControlButton';

type SettingsProps = {
  settings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => void;
  onResetData: () => void;
  onNavigate: (screen: keyof RootStackParamList) => void;
};

export function Settings({ settings, onUpdateSettings, onResetData, onNavigate }: SettingsProps) {
  const [showResetDialog, setShowResetDialog] = useState(false);

  const controlModes: { value: ControlMode; label: string; icon: string; description: string }[] = [
    { value: 'touch' as ControlMode, label: 'Touch Only', icon: 'hand-left-outline', description: 'Use buttons and taps' },
    { value: 'gestures' as ControlMode, label: 'Gestures Only', icon: 'move-outline', description: 'Swipe and gesture controls' },
    { value: 'both' as ControlMode, label: 'Both', icon: 'layers-outline', description: 'Touch and gestures' },
    { value: 'disabled' as ControlMode, label: 'Disabled', icon: 'ban-outline', description: 'No controls' },
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
                  name={m.icon as any}
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
            <RNSwitch
              value={!!settings.visualFeedback}
              onValueChange={(v) => handleFeedbackChange(v)}
              trackColor={{ false: '#374151', true: '#60a5fa' }}
              thumbColor={settings.visualFeedback ? '#fff' : '#fff'}
            />
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={{ marginTop: 8 }}>
            <TouchableOpacity
              style={[styles.actionBtn]}
              onPress={() => onNavigate('GestureTutorial')}
            >
              <Ionicons name="help-circle-outline" size={18} color="#9ca3af" />
              <Text style={styles.actionBtnText}>Gesture Tutorial</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionBtn]}
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
            style={[styles.resetBtn]}
          >
            <Text style={styles.resetBtnText}>Reset All Data</Text>
          </TouchableOpacity>
          <Text style={[styles.helperText, { textAlign: 'center', marginTop: 8 }]}>
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

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#000' },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#27272a',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: { color: '#fff', fontSize: 18, marginLeft: 12 },

  container: {
    padding: 16,
    paddingBottom: 40,
  },

  section: {
    marginBottom: 22,
  },

  sectionTitle: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 8,
  },

  modeList: {
    flexDirection: 'column',
    gap: 8 as any,
  },

  modeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  modeItemActive: {
    borderColor: '#2563eb',
    backgroundColor: 'rgba(37,99,235,0.06)',
  },
  modeItemInactive: {
    borderColor: '#27272a',
    backgroundColor: '#0b0b0b',
  },

  modeText: {
    marginLeft: 12,
    flex: 1,
  },
  modeLabel: {
    color: '#fff',
    fontSize: 15,
  },
  modeDesc: {
    color: '#9ca3af',
    fontSize: 13,
    marginTop: 2,
  },

  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  smallText: {
    color: '#9ca3af',
  },

  helperText: {
    color: '#9ca3af',
    fontSize: 13,
    marginTop: 6,
  },

  feedbackRow: {
    padding: 8,
    backgroundColor: '#0b0b0b',
    borderRadius: 10,
  },

  actionBtn: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#27272a',
    backgroundColor: '#0b0b0b',
    gap: 12 as any,
  },
  actionBtnText: {
    color: '#fff',
    marginLeft: 12,
    fontSize: 15,
  },

  resetBtn: {
    marginTop: 10,
    backgroundColor: '#ef4444',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  resetBtnText: { color: '#fff', fontWeight: '600' },

  /* Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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

  modalActions: { flexDirection: 'row', justifyContent: 'flex-end' },
  modalBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    marginLeft: 8,
  },
  modalCancel: { backgroundColor: '#1f2937' },
  modalDanger: { backgroundColor: '#ef4444' },
  modalCancelText: { color: '#fff' },
  modalDangerText: { color: '#fff', fontWeight: '600' },
});
