import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';

const MapScreen = ({ route }: any) => {
  const { latitude, longitude, markers, radius } = route.params;
  const [coords, setCoords] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  useEffect(() => {
    if (latitude && longitude) {
      setCoords({ latitude, longitude });
    }
  }, [latitude, longitude]);

  if (!coords) {
    return (
      <View style={styles.container}>
        <Text>Loading map...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {markers.map((marker: any, index: number) => (
          <Marker
            key={index}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            title={marker.title}
            description={`Price: ${marker.price} RON`}
            image={{ uri: marker.logo }}
          />
        ))}
        <Circle
          center={coords}
          radius={radius * 1000}
          strokeColor="rgba(0, 145, 255, 0.5)"
          fillColor="rgba(255, 0, 0, 0.2)"
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
});

export default MapScreen;
