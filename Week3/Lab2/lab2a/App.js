import React, { useState } from 'react';
import {
  SafeAreaView,
  Text,
  View,
  Button,
  Switch,
  StyleSheet,
} from 'react-native';

export default function App() {
  const [enabled, setEnabled] = useState(false); // state of the switch
  const [isDarkMode, setIsDarkMode] = useState(false); // actual applied theme

  const handlePress = () => {
    setIsDarkMode(enabled); // apply theme based on switch value
  };

  const backColor = {
    backgroundColor: isDarkMode ? '#333' : 'white',
  };

  const textColor = {
    color: isDarkMode ? 'white' : 'black',
  };

  return (
    <SafeAreaView style={[styles.container, backColor]}>
      <Text style={[styles.title, textColor]}>Dark mode</Text>

      <View style={styles.section}>
        <Text style={textColor}>Enable action</Text>
        <Switch
          value={enabled}
          onValueChange={setEnabled}
          accessibilityLabel="Toggle dark mode"
        />
      </View>

      <View style={styles.section}>
        <Button
          title={'Apply Theme'}
          onPress={handlePress}
          accessibilityLabel="Apply selected theme"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  section: {
    marginTop: 16,
    alignItems: 'center',
  },
});
