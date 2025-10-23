import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ControlButton } from '../components/ControlButton';
import { useGestures } from '../hooks/useGestures';
import { GestureEvent } from '../types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

type TutorialStep = {
  id: string;
  title: string;
  description: string;
  targetGesture: GestureEvent['type'];
  icon: keyof typeof Ionicons.glyphMap;
};

type GestureTutorialProps = {
  onNavigate: (screen: keyof RootStackParamList) => void;
  navigation: any; // in case
  route: any;
};

const steps: TutorialStep[] = [
  {
    id: 'swipe-left',
    title: 'Swipe Left',
    description: 'Swipe from right to left to go to next track',
    targetGesture: 'swipe-left',
    icon: 'arrow-back',
  },
  {
    id: 'swipe-right',
    title: 'Swipe Right',
    description: 'Swipe from left to right to go to previous track',
    targetGesture: 'swipe-right',
    icon: 'arrow-forward',
  },
  {
    id: 'double-tap',
    title: 'Double Tap',
    description: 'Quickly tap twice to play/pause',
    targetGesture: 'double-tap',
    icon: 'hand-left-outline',
  },
  {
    id: 'swipe-up',
    title: 'Swipe Up',
    description: 'Swipe up to increase volume',
    targetGesture: 'swipe-up',
    icon: 'arrow-up',
  },
  {
    id: 'swipe-down',
    title: 'Swipe Down',
    description: 'Swipe down to decrease volume',
    targetGesture: 'swipe-down',
    icon: 'arrow-down',
  },
];

export function GestureTutorial({ navigation }: GestureTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [success, setSuccess] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];

  const step = steps[currentStep];

  const handleGesture = (gesture: GestureEvent) => {
    setAttempts((prev) => prev + 1);

    if (gesture.type === step.targetGesture) {
      setSuccess(true);
      setShowFeedback(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start();
        setShowFeedback(false);
        if (currentStep < steps.length - 1) {
          setCurrentStep((prev) => prev + 1);
          setAttempts(0);
          setSuccess(false);
        }
      }, 1000);
    } else {
      setSuccess(false);
      setShowFeedback(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start();
        setShowFeedback(false);
      }, 1000);
    }
  };

  const { PanGesture, TapGesture } = useGestures({
    enabled: true,
    sensitivity: 50,
    onGesture: handleGesture,
  });

  const handleSkip = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
      setAttempts(0);
      setSuccess(false);
      setShowFeedback(false);
    } else {
      navigation.navigate('Settings');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <ControlButton
          icon="arrow-back"
          onClick={() => navigation.navigate('Settings')}
          label="Back"
        />
        <Text style={styles.headerTitle}>Gesture Tutorial</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Progress */}
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressText}>Step {currentStep + 1} of {steps.length}</Text>
            <Text style={styles.progressText}>{Math.round((currentStep / steps.length) * 100)}%</Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${((currentStep + 1) / steps.length) * 100}%` },
              ]}
            />
          </View>
        </View>

        {/* Instruction */}
        <View style={styles.instructionContainer}>
          <View style={styles.iconContainer}>
            <Ionicons name={step.icon} size={40} color="#3b82f6" />
          </View>
          <Text style={styles.instructionTitle}>{step.title}</Text>
          <Text style={styles.instructionDescription}>{step.description}</Text>
        </View>

        {/* Practice Area */}
        <PanGesture>
          <TapGesture>
            <View style={styles.practiceArea}>
              {showFeedback && (
                <Animated.View style={[styles.feedbackOverlay, { opacity: fadeAnim }]}>
                  {success ? (
                    <View style={styles.feedbackContent}>
                      <Ionicons name="checkmark-circle-outline" size={64} color="#22c55e" />
                      <Text style={styles.feedbackText}>Perfect!</Text>
                    </View>
                  ) : (
                    <View style={styles.feedbackContent}>
                      <Ionicons name="close-circle-outline" size={64} color="#ef4444" />
                      <Text style={styles.feedbackText}>Try Again</Text>
                    </View>
                  )}
                </Animated.View>
              )}
              <Ionicons name="hand-left-outline" size={64} color="#6b7280" style={styles.practiceIcon} />
              <Text style={styles.practiceText}>Try the gesture here</Text>
              {attempts > 0 && (
                <Text style={styles.attemptsText}>Attempts: {attempts}</Text>
              )}
            </View>
          </TapGesture>
        </PanGesture>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipButtonText}>
              {currentStep === steps.length - 1 ? 'Finish Tutorial' : 'Skip Step'}
            </Text>
          </TouchableOpacity>
          {currentStep > 0 && (
            <TouchableOpacity
              style={styles.previousButton}
              onPress={() => {
                setCurrentStep((prev) => prev - 1);
                setAttempts(0);
                setSuccess(false);
                setShowFeedback(false);
              }}
            >
              <Text style={styles.previousButtonText}>Previous Step</Text>
            </TouchableOpacity>
          )}
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
  progressContainer: {
    marginBottom: 32,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    color: '#6b7280',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#27272a',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
  },
  instructionContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#1e3a8a20',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  instructionTitle: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 8,
  },
  instructionDescription: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  practiceArea: {
    flex: 1,
    backgroundColor: '#18181b',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    position: 'relative',
    overflow: 'hidden',
  },
  feedbackOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#00000080',
    justifyContent: 'center',
    alignItems: 'center',
  },
  feedbackContent: {
    alignItems: 'center',
    gap: 16,
  },
  feedbackText: {
    fontSize: 24,
    color: '#fff',
  },
  practiceIcon: {
    marginBottom: 16,
  },
  practiceText: {
    fontSize: 20,
    color: '#6b7280',
    marginBottom: 8,
  },
  attemptsText: {
    fontSize: 14,
    color: '#6b7280',
  },
  actionsContainer: {
    gap: 12,
  },
  skipButton: {
    backgroundColor: '#3b82f6',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: 16,
    color: '#fff',
  },
  previousButton: {
    borderWidth: 1,
    borderColor: '#3f3f46',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  previousButtonText: {
    fontSize: 16,
    color: '#fff',
  },
});