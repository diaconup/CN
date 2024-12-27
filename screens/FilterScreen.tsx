import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import * as Location from 'expo-location';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/constants/types';
import { useNavigation } from '@react-navigation/native';

type FilterScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Filter'
>;

type Props = {
  navigation: FilterScreenNavigationProp;
};

const FilterScreen: React.FC<Props> = ({ route }: any) => {
  const { itemName } = route.params;
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const options = ['Current Position', 'Pin on Map', 'City'];
  const [hasPermission, setHasPermission] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

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
        console.log('Current location:', latitude, longitude);

        navigation.navigate('Map', { latitude, longitude, itemName });
      } else {
        Alert.alert('Location Error', 'Failed to retrieve valid coordinates.');
      }
    } catch (error) {
      console.log('Error getting location:', error);
      Alert.alert('Error', `Failed to get location: ${error.message}`);
    }
  };

  const handleSelectOption = (option: string) => {
    setSelectedOption(option);
  };

  const handleFilterButtonPress = () => {
    if (!selectedOption) {
      Alert.alert('No option selected', 'Please select an option first.');
      return;
    }
    if (selectedOption === 'Current Position') {
      getCurrentLocation();
    } else {
      alert(`Selected option: ${selectedOption}`);
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
});

export default FilterScreen;
