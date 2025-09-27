import React, { useState } from 'react';
import { StyleSheet, Text, View, Switch, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-web';


export default function App() {
  const [enabledNotifications, setEnabledNotifications] = useState(false); // state of the switch
  const [enabledLocation, setEnabledLocation] = useState(false); // state of the switch
  const [enabledAnalytics, setEnabledAnalytics] = useState(false); // state of the switch

  const handlePress = () => {
    alert(`${enabledNotifications ? 'Notifications Enabled' : ''}
       ${enabledLocation ? 'Location Enabled' : ''}
        ${enabledAnalytics ? 'Analytics Enabled' : ''}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.libraryScreen}>
        <Text style={styles.settingTitle}>Notifications</Text>
        <Switch value={enabledNotifications} onValueChange={setEnabledNotifications} />
      </View>
      <View style={styles.libraryScreen}>
        <Text style={styles.settingTitle}>Location</Text>
        <Switch value={enabledLocation} onValueChange={setEnabledLocation} />
      </View>
      <View style={styles.libraryScreen}>
        <Text style={styles.settingTitle}>Analytics</Text>
        <Switch value={enabledAnalytics} onValueChange={setEnabledAnalytics} />
      </View>
      <Button 
        title="Save Settings" 
       onPress={handlePress} 
       disabled={!(enabledNotifications || enabledLocation || enabledAnalytics)}
       />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7acef7ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 10,
    borderRadius: 10,
    width: '90%',
    shadowColor: '#000',
    elevation: 3,
  },
  settingTitle: {
    flex: 1,
    fontSize: 18,
    color: '#333',
  },
});
