import React, { useEffect } from 'react';
import { SafeAreaView, View, Text, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { splashStyles as styles } from '../styles/globalStyles';

interface SplashProps {
  onComplete: () => void;
}

export function Splash({ onComplete }: SplashProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 1300);
    return () => clearTimeout(timer);
  }, []);

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
          <View style={styles.progressInner} />
        </View>

        <Text style={styles.subtitle}>Loading your music...</Text>
      </View>
    </SafeAreaView>
  );
}
