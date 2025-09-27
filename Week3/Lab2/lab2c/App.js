import React, { useState } from 'react';
import { SafeAreaView, Text, StyleSheet } from 'react-native';
import PrimaryButton from './components/PrimaryButton';
import SecondaryButton from './components/SecondaryButton';
import ToggleSwitch from './components/ToggleSwitch';

export default function App() {
  const [switchOn, setSwitchOn] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Component Library Screen</Text>

      <PrimaryButton title="Primary Neon" onPress={() => alert('Primary clicked!')} />
      <SecondaryButton title="Secondary Neon" onPress={() => alert('Secondary clicked!')} />
      <ToggleSwitch
        label="Enable feature"
        value={switchOn}
        onValueChange={setSwitchOn}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#000', justifyContent: 'center' },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center', color: '#0ff', textShadowColor: '#0ff', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 10 },
});
