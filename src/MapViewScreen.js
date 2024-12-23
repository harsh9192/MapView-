import {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  FlatList,
  TouchableOpacity,
  Alert
} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import {Swipeable} from 'react-native-gesture-handler';
import Geolocation from '@react-native-community/geolocation';

const MapViewScreen = () => {
  const [markerCordinate, setMarkerCordinate] = useState([]);
  const [mapHeight, setMapHeight] = useState('100%');
  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert(
          'Permission Denied',
          'Location access is required to use this feature.',
        );
        return;
      }
    }
    getCurrentLocation();
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setCurrentLocation({latitude, longitude});
        console.log(`Current location: ${latitude}, ${longitude}`);
      },
      error => {
        console.error('Error getting location:', error.message);
        Alert.alert('Error', 'Failed to get your location. Please try again.');
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  const handleMarker = e => {
    const {latitude, longitude} = e.nativeEvent.coordinate;
    setMarkerCordinate(prev => [
      ...prev,
      {id: Date.now().toString(), latitude, longitude},
    ]);
    setMapHeight('80%');
  };

  const deleteMarker = id => {
    setMarkerCordinate(prev => {
      const updatedMarkers = prev.filter(marker => marker.id !== id);
      if (updatedMarkers.length === 0) {
        setMapHeight('100%');
      }
      return updatedMarkers;
    });
  };

  const renderRightActions = id => {
    return (
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteMarker(id)}>
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    );
  };

  const renderItem = ({item}) => (
    <Swipeable renderRightActions={() => renderRightActions(item.id)}>
      <View style={styles.listItem}>
        <Text style={{color:"#000"}}>{`Marker at Lat: ${item.latitude}, Lng: ${item.longitude}`}</Text>
      </View>
    </Swipeable>
  );

  return (
    <View style={styles.main}>
      <MapView
        style={[styles.map, {height: mapHeight}]}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        showsMyLocationButton={true}
        followsUserLocation={true}
        showsCompass={true}
        onMapReady={getCurrentLocation}
        initialRegion={{
          latitude: currentLocation?.latitude || 30.704649,
          longitude: currentLocation?.longitude || 76.717873,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}
        onPress={handleMarker}>
        {currentLocation && (
          <Marker
            coordinate={{
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
            }}
            title="Your Location"
          />
        )}
        {markerCordinate.map(marker => (
          <Marker
            key={marker.id}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            title="I am here"
            description="This is a saved marker"
            draggable>
            <Image
              source={require('../src/assets/images/location.png')}
              style={{height: 30, width: 30, resizeMode: 'contain'}}
            />
          </Marker>
        ))}
      </MapView>

      <FlatList
        data={markerCordinate}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  map: {
    // flex:1,
    width: '100%',
  },
  deleteButton: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: 80,
  },
  list: {
    height: '50%',
    padding: 10,
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#fff',
    color:"#000"
  },
  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
    paddingHorizontal: 10,
    fontSize: 16,
  },
  callOutStyle: {
    height: '80%',
    width: '60%',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  callOutText: {
    fontSize: 16,
  },
});

export default MapViewScreen;
