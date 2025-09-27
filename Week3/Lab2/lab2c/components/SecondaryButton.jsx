import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function SecondaryButton({ title, onPress }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#f0f',       // pink neon
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginVertical: 10,
    shadowColor: '#f0f',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 10,
    elevation: 10,
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: '#f0f',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
});
