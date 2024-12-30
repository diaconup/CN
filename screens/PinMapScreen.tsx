import { useFocusEffect } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import MapView, { Marker, MapPressEvent } from 'react-native-maps';

type PinMapScreenProps = {
  route: any;
  navigation: any;
};

const PinMapScreen: React.FC<PinMapScreenProps> = ({ route, navigation }) => {
  const { radius, itemId } = route.params;
  const [pinLocation, setPinLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      setPinLocation(null);
    }, [])
  );

  const handleMapPress = (event: MapPressEvent) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    console.log('Map pressed at:', latitude, longitude);
    setPinLocation({ latitude, longitude });
  };

  const handleChooseLocation = async () => {
    if (!pinLocation) {
      Alert.alert(
        'No location selected',
        'Please place a pin on the map first.'
      );
      return;
    }

    try {
      if (pinLocation.latitude && pinLocation.longitude) {
        const { latitude, longitude } = pinLocation;

        const url = `https://monitorulpreturilor.info/pmonsvc/Gas/GetGasItemsByLatLon?lon=${
          pinLocation.longitude
        }&lat=${pinLocation.latitude}&buffer=${
          radius * 1000
        }&CSVGasCatalogProductIds=${itemId}&OrderBy=dist`;

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();

          const markers = (data.Stations || []).map((station) => {
            const { Lat, Lon } = station.addr.location;
            const stationName = station.network.name;
            const product = (data.Products || []).find(
              (p) => p.stationid === station.id
            );
            const price = product ? product.price : 'N/A';
            const logo = station.network.logo.logouri;

            return {
              latitude: Lat,
              longitude: Lon,
              title: stationName,
              price,
              logo,
            };
          });

          navigation.navigate('Map', { latitude, longitude, markers, radius });
        } else {
          console.error(
            'Failed to fetch data:',
            response.status,
            response.statusText
          );
          Alert.alert('Error', 'Failed to fetch data from the server.');
        }
      } else {
        Alert.alert('Location Error', 'Failed to retrieve valid coordinates.');
      }
    } catch (error) {
      console.log('Error getting location:', error);
      Alert.alert('Error', `Failed to get location: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        key={pinLocation ? 'map-with-pin' : 'map'}
        style={styles.map}
        onPress={handleMapPress}
        initialRegion={{
          latitude: 46.756553,
          longitude: 23.594549,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {pinLocation && <Marker coordinate={pinLocation} />}
      </MapView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleChooseLocation}>
          <Text style={styles.buttonText}>Alege locația</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },
  button: {
    backgroundColor: '#13476c',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default PinMapScreen;
