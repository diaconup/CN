import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';

const MapScreen = ({ route }: any) => {
  const { latitude, longitude, itemName } = route.params;

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker coordinate={{ latitude, longitude }} title={itemName} />

        <Circle
          center={{ latitude, longitude }}
          radius={5000}
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