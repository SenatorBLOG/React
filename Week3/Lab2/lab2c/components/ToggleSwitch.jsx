import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';

export default function ToggleSwitch({ label, value, onValueChange }) {
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [value]);

  const toggle = () => onValueChange(!value);

  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 22], 
  });

  const backgroundColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#555', '#0ff'], 
  });

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity onPress={toggle}>
        <Animated.View style={[styles.track, { backgroundColor }]}>
          <Animated.View style={[styles.thumb, { transform: [{ translateX }] }]} />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', marginVertical: 10 },
  label: { marginRight: 10, fontSize: 16, color: '#fff' },
  track: {
    width: 50,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    padding: 2,
    backgroundColor: '#555',
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#222',
    shadowColor: '#0ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 5,
  },
});
