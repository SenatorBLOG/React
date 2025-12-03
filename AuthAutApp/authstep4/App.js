// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import AuthScreen from './AuthScreen';
import ProfileScreen from './ProfileScreen';

const Stack = createNativeStackNavigator();

// Custom Header Component
const CustomHeader = ({ navigation }) => {
  return (
    <View style={headerStyles.headerContainer}>
      <TouchableOpacity onPress={() => navigation.navigate('Auth')}>
        <Text style={headerStyles.headerLink}>Login/Signup</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
        <Text style={headerStyles.headerLink}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Auth" // Still start on Auth page
      >
        <Stack.Screen
          name="Auth"
          component={AuthScreen}
          options={{
            header: ({ navigation }) => <CustomHeader navigation={navigation} />,
            headerTitle: '', // Hide default title if any
          }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            header: ({ navigation }) => <CustomHeader navigation={navigation} />,
            headerTitle: '', // Hide default title if any
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const headerStyles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end', // Aligns items to the bottom of the header area
    backgroundColor: '#007bff',
    height: 90, // Increased height to accommodate status bar and padding
    paddingBottom: 10, // Padding at the bottom
    paddingTop: 30, // Padding for status bar on iOS/Android
    width: '100%',
    borderBottomWidth: 1, // Add a subtle border
    borderBottomColor: '#0056b3', // Darker blue
  },
  headerLink: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
});