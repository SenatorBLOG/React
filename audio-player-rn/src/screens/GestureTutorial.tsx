// screens/GestureTutorial.tsx
import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, GestureEvent } from '../types';
import { gestureTutorialStyles as styles } from '../styles/globalStyles';
import { useGestures } from '../hooks/useGestures';

type TutorialStep = {
  id: string;
  title: string;
  description: string;
  targetGesture: 'swipe-left' | 'swipe-right' | 'double-tap' | 'swipe-up' | 'swipe-down';
  icon: keyof typeof Ionicons.glyphMap;
};

const steps: TutorialStep[] = [
  { id: 'swipe-left', title: 'Swipe Left', description: 'Swipe from right to left to go to next track', targetGesture: 'swipe-left', icon: 'arrow-back' },
  { id: 'swipe-right', title: 'Swipe Right', description: 'Swipe from left to right to go to previous track', targetGesture: 'swipe-right', icon: 'arrow-forward' },
  { id: 'double-tap', title: 'Double Tap', description: 'Quickly tap twice to play/pause', targetGesture: 'double-tap', icon: 'hand-left-outline' },
  { id: 'swipe-up', title: 'Swipe Up', description: 'Swipe up to increase volume', targetGesture: 'swipe-up', icon: 'arrow-up' },
  { id: 'swipe-down', title: 'Swipe Down', description: 'Swipe down to decrease volume', targetGesture: 'swipe-down', icon: 'arrow-down' },
];

type Props = NativeStackScreenProps<RootStackParamList, 'GestureTutorial'>;

export function GestureTutorial({ navigation }: Props) {
  const [currentStep, setCurrentStep] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const step = steps[currentStep];

  // now accepts full GestureEvent
  const handleGesture = useCallback(
    (gesture: GestureEvent) => {
      const correct = gesture.type === step.targetGesture;
      setIsSuccess(correct);
      setAttempts((a) => a + 1);
      setShowFeedback(true);

      setTimeout(() => {
        setShowFeedback(false);
        if (correct && currentStep < steps.length - 1) {
          setCurrentStep((s) => s + 1);
          setAttempts(0);
        }
      }, 800);
    },
    [step.targetGesture, currentStep]
  );

  // use single wrapper from hook
  const { GestureWrapper } = useGestures({
    enabled: true,
    sensitivity: 60,
    onGesture: handleGesture,
  });

  const handleSkip = () => {
    if (currentStep === steps.length - 1) {
      navigation.navigate('Settings');
    } else {
      setCurrentStep((s) => s + 1);
      setAttempts(0);
      setShowFeedback(false);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
      setAttempts(0);
      setShowFeedback(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gesture Tutorial</Text>
      </View>

      {/* Progress */}
      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressText}>
            Step {currentStep + 1} of {steps.length}
          </Text>
          <Text style={styles.progressText}>
            {Math.round(((currentStep + 1) / steps.length) * 100)}%
          </Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${((currentStep + 1) / steps.length) * 100}%` }]} />
        </View>
      </View>

      {/* Instruction */}
      <View style={styles.instructionContainer}>
        <View style={styles.iconContainer}>
          <Ionicons name={step.icon} size={48} color="#3b82f6" />
        </View>
        <Text style={styles.instructionTitle}>{step.title}</Text>
        <Text style={styles.instructionDescription}>{step.description}</Text>
      </View>

      {/* Practice Area (single GestureWrapper) */}
      <GestureWrapper style={styles.practiceArea}>
        {showFeedback && (
          <View style={styles.feedbackOverlay}>
            <Ionicons
              name={isSuccess ? 'checkmark-circle' : 'close-circle'}
              size={72}
              color={isSuccess ? '#22c55e' : '#ef4444'}
            />
            <Text style={[styles.feedbackText, isSuccess ? styles.successText : styles.errorText]}>
              {isSuccess ? 'Perfect!' : 'Try Again'}
            </Text>
          </View>
        )}
        <Ionicons name="hand-left-outline" size={64} color="#9ca3af" />
        <Text style={styles.practiceText}>Practice here</Text>
        {attempts > 0 && <Text style={styles.attemptsText}>Attempts: {attempts}</Text>}
      </GestureWrapper>

      {/* Actions */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipButtonText}>{currentStep === steps.length - 1 ? 'Finish' : 'Skip'}</Text>
        </TouchableOpacity>
        {currentStep > 0 && (
          <TouchableOpacity style={styles.previousButton} onPress={handlePrevious}>
            <Text style={styles.previousButtonText}>Previous</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
