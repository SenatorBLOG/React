// screens/Splash.tsx
import React, { useEffect, useRef } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SplashProps {
  onComplete: () => void;
}

export function Splash({ onComplete }: SplashProps) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate from 0 -> 100 over 1000ms (matches original +10 every 100ms)
    Animated.timing(progress, {
      toValue: 100,
      duration: 1000,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false, // width uses layout, so false
    }).start(() => {
      // wait a bit like original setTimeout(onComplete, 300)
      setTimeout(onComplete, 300);
    });
  }, [progress, onComplete]);

  const widthInterpolated = progress.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  const screenWidth = Dimensions.get('window').width;
  const barWidth = Math.min(320, screenWidth - 48);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.logoWrap}>
          <View style={styles.glow} />
          <View style={styles.logoBox}>
            <Ionicons name="musical-notes" size={56} color="#fff" />
          </View>
        </View>

        <Text style={styles.title}>Audio Player</Text>

        <View style={[styles.progressOuter, { width: barWidth }]}>
          <Animated.View
            style={[
              styles.progressInner,
              {
                width: widthInterpolated,
              },
            ]}
          />
        </View>

        <Text style={styles.subtitle}>Loading your music...</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#000' },
  container: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWrap: {
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 100,
    backgroundColor: '#2563eb',
    opacity: 0.12,
    // subtle pulse-like effect could be added later with Animated
  },
  logoBox: {
    width: 120,
    height: 120,
    borderRadius: 28,
    backgroundColor: '#1f2937',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#2563eb',
    shadowOpacity: 0.12,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 6 },
  },
  title: {
    marginTop: 8,
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
  progressOuter: {
    height: 8,
    backgroundColor: '#111827',
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 20,
  },
  progressInner: {
    height: '100%',
    backgroundColor: '#2563eb',
  },
  subtitle: {
    marginTop: 12,
    color: '#9ca3af',
    fontSize: 13,
  },
});
