import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import * as Location from 'expo-location';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/constants/types';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Slider from '@react-native-community/slider';

type FilterScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Filter'
>;

type Props = {
  navigation: FilterScreenNavigationProp;
};

const FilterScreen: React.FC<Props> = ({ route }: any) => {
  const { itemId } = route.params;
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const options = ['Poziție curentă', 'Pin pe hartă', 'Oraș'];
  const [hasPermission, setHasPermission] = useState(false);
  const navigation = useNavigation();
  const [radius, setRadius] = useState(1);
  const [cityName, setCityName] = useState<string>('');

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      setSelectedOption(null);
      setCityName('');
    }, [])
  );

  const getCurrentLocation = async () => {
    if (!hasPermission) {
      Alert.alert(
        'Permission Denied',
        'Location permission is required to fetch your location.'
      );
      return;
    }

    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      const { latitude, longitude } = location.coords;

      if (latitude && longitude) {
        console.log('Current location:', latitude, longitude, radius);

        const url = `https://monitorulpreturilor.info/pmonsvc/Gas/GetGasItemsByLatLon?lon=${longitude}&lat=${latitude}&buffer=${
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

          console.log('Markers Data:', markers);

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

  const getCurrentTown = async () => {
    if (!cityName.trim()) {
      Alert.alert('No City Entered', 'Please enter a city name.');
      return;
    }

    try {
      const uatUrl = `https://monitorulpreturilor.info/pmonsvc/Gas/GetUATByName?uatname=${encodeURIComponent(
        cityName
      )}`;
      const uatResponse = await fetch(uatUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!uatResponse.ok) {
        console.error(
          'Failed to fetch UAT data:',
          uatResponse.status,
          uatResponse.statusText
        );
        Alert.alert('Error', 'Failed to fetch data for the city.');
        return;
      }

      const uatData = await uatResponse.json();
      const uatItem = uatData.Items?.[0];

      if (!uatItem || !uatItem.id) {
        Alert.alert(
          'City Not Found',
          'Could not find data for the entered city.'
        );
        return;
      }

      const uatId = uatItem.id;

      const gasUrl = `https://monitorulpreturilor.info/pmonsvc/Gas/GetGasItemsByUat?UatId=${uatId}&CSVGasCatalogProductIds=${itemId}&OrderBy=dist`;
      const gasResponse = await fetch(gasUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!gasResponse.ok) {
        console.error(
          'Failed to fetch gas station data:',
          gasResponse.status,
          gasResponse.statusText
        );
        Alert.alert('Error', 'Failed to fetch gas station data.');
        return;
      }

      const gasData = await gasResponse.json();

      const markers = (gasData.Stations || []).map((station) => {
        const { Lat, Lon } = station.addr.location;
        const stationName = station.network.name;
        const product = (gasData.Products || []).find(
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

      console.log('Markers Data:', markers);

      navigation.navigate('Map', {
        latitude: markers[0]?.latitude || 0,
        longitude: markers[0]?.longitude || 0,
        markers,
        radius,
      });
    } catch (error) {
      console.log('Error fetching data:', error);
      Alert.alert('Error', `Failed to fetch data: ${error.message}`);
    }
  };

  const handleSelectOption = (option: string) => {
    setSelectedOption(option);
    if (option !== 'Oraș') {
      setCityName('');
    }
  };

  const handleFilterButtonPress = () => {
    if (!selectedOption) {
      Alert.alert('No option selected', 'Please select an option first.');
      return;
    }

    if (selectedOption === 'Poziție curentă') {
      getCurrentLocation();
    } else if (selectedOption === 'Pin pe hartă') {
      navigation.navigate('PinMap', { radius, itemId, reset: true });
    } else if (selectedOption === 'Oraș') {
      getCurrentTown();
    } else {
      alert(`Selected option: ${selectedOption}`);
      setSelectedOption(null);
    }
  };

  const renderItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={styles.optionItem}
      onPress={() => handleSelectOption(item)}
    >
      <View style={styles.radioButtonContainer}>
        <View
          style={[
            styles.radioButton,
            item === selectedOption && styles.selectedRadioButton,
          ]}
        />
      </View>
      <Text
        style={[
          styles.optionText,
          item === selectedOption && styles.selectedOptionText,
        ]}
      >
        {item}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Filtreaza locația</Text>
      </View>
      <FlatList
        data={options}
        renderItem={renderItem}
        keyExtractor={(item) => item}
      />
      {selectedOption === 'Oraș' && (
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Enter city name:</Text>
          <TextInput
            style={styles.textInput}
            value={cityName}
            onChangeText={setCityName}
            placeholder="Type city name..."
          />
        </View>
      )}
      <View style={styles.sliderContainer}>
        <Text style={styles.sliderLabel}>Radius: {radius} km</Text>
        <Slider
          style={styles.slider}
          minimumValue={1}
          maximumValue={5}
          step={1}
          onValueChange={(value) => setRadius(value)}
          minimumTrackTintColor="#13476c"
          maximumTrackTintColor="#ccc"
          thumbTintColor="#13476c"
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={handleFilterButtonPress}
        >
          <Text style={styles.filterButtonText}>Filtreaza</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'flex-start' },
  header: {
    paddingVertical: 15,
    backgroundColor: '#13476c',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  headerText: { fontSize: 20, color: '#fff' },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  radioButtonContainer: { marginRight: 10 },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#13476c',
    backgroundColor: 'transparent',
  },
  selectedRadioButton: { backgroundColor: '#13476c' },
  optionText: { fontSize: 16 },
  selectedOptionText: { fontWeight: 'bold', color: '#13476c' },
  sliderContainer: {
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  sliderLabel: {
    fontSize: 16,
    marginBottom: 10,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  filterButton: {
    backgroundColor: '#13476c',
    paddingVertical: 15,
    paddingHorizontal: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  filterButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  inputContainer: {
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
});

export default FilterScreen;
