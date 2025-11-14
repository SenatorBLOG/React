// App.js
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Image, FlatList, TouchableOpacity, Modal, Dimensions } from 'react-native';
import * as Location from 'expo-location';
import { Camera } from 'expo-camera';
import MapView, { Marker } from 'react-native-maps';

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [logs, setLogs] = useState([]);
  const [selectedLog, setSelectedLog] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [cameraRef, setCameraRef] = useState(null);
  const [showCamera, setShowCamera] = useState(false);

  useEffect(() => {
    (async () => {
      // Request location permissions
      let { status } = await Location.requestForegroundPermissionsAsync();
      setHasLocationPermission(status === 'granted');
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
      }

      // Request camera permissions
      let cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === 'granted');
    })();
  }, []);

  const getLocation = async () => {
    if (!hasLocationPermission) {
      setErrorMsg('No location permission');
      return;
    }
    let loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
    setLocation(loc.coords);
  };

  const takePhoto = async () => {
    if (cameraRef && hasCameraPermission) {
      let photoData = await cameraRef.takePictureAsync({ quality: 0.5 });
      setPhoto(photoData.uri);
      setShowCamera(false);
    }
  };

  const saveLog = () => {
    if (location) {
      const newLog = {
        id: Date.now().toString(),
        latitude: location.latitude,
        longitude: location.longitude,
        photoUri: photo,
      };
      setLogs([...logs, newLog]);
      setPhoto(null); // Reset photo after saving
    } else {
      setErrorMsg('No location available to log');
    }
  };

  const viewLog = (log) => {
    setSelectedLog(log);
    setModalVisible(true);
  };

  const renderLogItem = ({ item }) => (
    <TouchableOpacity style={styles.logItem} onPress={() => viewLog(item)}>
      {item.photoUri && <Image source={{ uri: item.photoUri }} style={styles.thumbnail} />}
      <Text>Lat: {item.latitude.toFixed(4)}, Lon: {item.longitude.toFixed(4)}</Text>
    </TouchableOpacity>
  );

  let text = 'Waiting...';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = `Latitude: ${location.latitude}, Longitude: ${location.longitude}`;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>{text}</Text>

      <Button title="Get Location" onPress={getLocation} />

      {!showCamera ? (
        <Button title="Take Photo" onPress={() => setShowCamera(true)} disabled={!hasCameraPermission} />
      ) : (
        <Camera
          style={styles.camera}
          type={Camera.Constants.Type.back}
          ref={(ref) => setCameraRef(ref)}
        >
          <View style={styles.cameraButtonContainer}>
            <Button title="Capture" onPress={takePhoto} />
            <Button title="Cancel" onPress={() => setShowCamera(false)} />
          </View>
        </Camera>
      )}

      {photo && <Image source={{ uri: photo }} style={styles.photo} />}

      {location && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker coordinate={location} />
        </MapView>
      )}

      <Button title="Save Log" onPress={saveLog} disabled={!location} />

      <Text style={styles.sectionTitle}>Logs</Text>
      <FlatList
        data={logs}
        renderItem={renderLogItem}
        keyExtractor={(item) => item.id}
      />

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          {selectedLog && (
            <>
              {selectedLog.photoUri && (
                <Image source={{ uri: selectedLog.photoUri }} style={styles.fullImage} />
              )}
              <MapView
                style={styles.fullMap}
                initialRegion={{
                  latitude: selectedLog.latitude,
                  longitude: selectedLog.longitude,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
              >
                <Marker coordinate={{ latitude: selectedLog.latitude, longitude: selectedLog.longitude }} />
              </MapView>
              <Text>Lat: {selectedLog.latitude}, Lon: {selectedLog.longitude}</Text>
              <Button title="Close" onPress={() => setModalVisible(false)} />
            </>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  paragraph: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  camera: {
    height: 300,
    width: '100%',
    marginVertical: 20,
  },
  cameraButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    position: 'absolute',
    bottom: 20,
    width: '100%',
  },
  photo: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginVertical: 20,
  },
  map: {
    width: '100%',
    height: 200,
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  logItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  thumbnail: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  fullImage: {
    width: Dimensions.get('window').width - 40,
    height: 300,
    marginBottom: 20,
  },
  fullMap: {
    width: Dimensions.get('window').width - 40,
    height: 300,
    marginBottom: 20,
  },
});