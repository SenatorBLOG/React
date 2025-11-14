import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  FlatList,
  TouchableOpacity,
  Modal,
  Dimensions,
  Platform,
  Alert,
  ScrollView,
} from 'react-native';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';

export default function App() {
  const [location, setLocation] = useState(null);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [photoUri, setPhotoUri] = useState(null);
  const [logs, setLogs] = useState([]);
  const [selectedLog, setSelectedLog] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const windowWidth = Dimensions.get('window').width;

  useEffect(() => {
    (async () => {
      // Location permission (works on native & web; web may prompt in browser)
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        setHasLocationPermission(status === 'granted');
        if (status !== 'granted') {
          Alert.alert('No permission', 'Geolocation access required.');
        }
      } catch (e) {
        console.warn('Location permission error', e);
      }

      // ImagePicker / camera permission
      try {
        // On web, requestCameraPermissionsAsync may behave differently; this is safe.
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        setHasCameraPermission(status === 'granted');
        if (status !== 'granted') {
          // Not fatal — user can still pick from gallery on many platforms
          console.warn('Camera permission not granted');
        }
      } catch (e) {
        console.warn('ImagePicker permission error', e);
      }
    })();
  }, []);

  // fetch current position
  const getLocation = async () => {
    if (!hasLocationPermission) {
Alert.alert('Permission', 'There is no permission to get a location.');
      return;
    }
    try {
      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setLocation(pos.coords);
    } catch (e) {
      console.warn('getLocation error', e);
      Alert.alert('Error', 'Couldn't get location.');
    }
  };

  // open camera to take photo (expo-image-picker)
  const openCamera = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setPhotoUri(result.assets[0].uri);
      } else {
        // cancelled
      }
    } catch (e) {
      console.warn('openCamera error', e);
      Alert.alert('Error', 'Camera could not be opened.');
    }
  };

  // open gallery (optional)
  const openGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setPhotoUri(result.assets[0].uri);
      }
    } catch (e) {
      console.warn('openGallery error', e);
    }
  };

  const saveLog = () => {
    if (!location) {
      Alert.alert('No location', 'Get Location first'.');
      return;
    }
    const newLog = {
      id: Date.now().toString(),
      latitude: location.latitude,
      longitude: location.longitude,
      photoUri: photoUri || null,
      ts: new Date().toISOString(),
    };
    setLogs((p) => [newLog, ...p]);
    setPhotoUri(null);
    Alert.alert('Saved', 'Log successfully added.');
  };

  const renderLogItem = ({ item }) => (
    <TouchableOpacity style={styles.logItem} onPress={() => { setSelectedLog(item); setModalVisible(true); }}>
      {item.photoUri ? (
        <Image source={{ uri: item.photoUri }} style={styles.thumbnail} />
      ) : (
        <View style={[styles.thumbnail, styles.placeholder]}><Text>No Photo</Text></View>
      )}
      <View style={{ flex: 1 }}>
        <Text style={{ fontWeight: '600' }}>Lat: {item.latitude.toFixed(6)}</Text>
        <Text>Lon: {item.longitude.toFixed(6)}</Text>
        <Text style={{ fontSize: 12, color: '#666' }}>{new Date(item.ts).toLocaleString()}</Text>
      </View>
    </TouchableOpacity>
  );

  const osmStatic = (lat, lon, w = 400, h = 300, zoom = 14) =>
    `https://staticmap.openstreetmap.de/staticmap.php?center=${lat},${lon}&zoom=${zoom}&size=${Math.round(w)}x${Math.round(h)}&maptype=mapnik&markers=${lat},${lon},red-pushpin`;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Location & Image Logger</Text>

      <View style={styles.row}>
        <Button title="Get Location" onPress={getLocation} />
        <View style={{ width: 10 }} />
        <Button title="Open Camera" onPress={openCamera} disabled={!hasCameraPermission && Platform.OS === 'ios' /* ios/web may require permission */} />
        <View style={{ width: 10 }} />
        <Button title="Gallery" onPress={openGallery} />
      </View>

      <View style={styles.infoBox}>
        {location ? (
          <>
            <Text>Latitude: {location.latitude}</Text>
            <Text>Longitude: {location.longitude}</Text>
          </>
        ) : (
          <Text>Location not set. Tap Get Location.</Text>
        )}
      </View>

      {photoUri ? (
        <View style={styles.preview}>
          <Text style={{ fontWeight: '700' }}>Photo preview</Text>
          <Image source={{ uri: photoUri }} style={{ width: Math.min(windowWidth - 48, 400), height: 220, borderRadius: 8, marginTop: 8 }} />
        </View>
      ) : null}

      {location ? (
        <Image source={{ uri: osmStatic(location.latitude, location.longitude, Math.min(windowWidth - 48, 600), 300) }} style={styles.map} />
      ) : null}

      <View style={{ marginVertical: 8 }}>
        <Button title="Save Log" onPress={saveLog} disabled={!location} />
      </View>

      <Text style={styles.sectionTitle}>Logs</Text>
      {logs.length === 0 ? <Text style={{ color: '#666' }}>No logs yet</Text> : (
        <FlatList data={logs} keyExtractor={i => i.id} renderItem={renderLogItem} style={{ width: '100%' }} />
      )}

      <Modal visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContent}>
          <Button title="Close" onPress={() => setModalVisible(false)} />
          {selectedLog && (
            <>
              {selectedLog.photoUri ? <Image source={{ uri: selectedLog.photoUri }} style={styles.fullImage} /> : <Text>No photo</Text>}
              <Image source={{ uri: osmStatic(selectedLog.latitude, selectedLog.longitude, windowWidth - 20, 300) }} style={styles.fullMap} />
              <Text style={{ marginTop: 8 }}>Lat: {selectedLog.latitude.toFixed(6)}  Lon: {selectedLog.longitude.toFixed(6)}</Text>
            </>
          )}
        </View>
      </Modal>

      <View style={{ height: 60 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingTop:40, alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  row: { flexDirection: 'row', marginBottom: 12 },
  infoBox: { width: '100%', padding: 12, borderWidth: 1, borderColor: '#eee', borderRadius: 8, marginBottom: 12 },
  preview: { width: '100%', marginBottom: 12, alignItems: 'center' },
  map: { width: '100%', height: 200, borderRadius: 8, marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginTop: 12, marginBottom: 8 },
  logItem: { flexDirection: 'row', alignItems: 'center', padding: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
  thumbnail: { width: 60, height: 45, borderRadius: 4, marginRight: 10, backgroundColor: '#ddd' },
  placeholder: { justifyContent: 'center', alignItems: 'center' },
  modalContent: { flex: 1, padding: 16, alignItems: 'center', backgroundColor: '#fff' },
  fullImage: { width: Dimensions.get('window').width - 40, height: 300, marginVertical: 12 },
  fullMap: { width: Dimensions.get('window').width - 40, height: 300 },
});