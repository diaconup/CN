import { RootStackParamList } from '@/constants/types';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

type RegisterScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Filter'
>;

type Props = {
  navigation: RegisterScreenNavigationProp;
};

const FilterScreen: React.FC = ({ route }: any) => {
  const { itemName } = route.params;

  // State to manage selected filter option
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // List of filter options
  const options = ['Current Position', 'Pin on Map', 'City'];

  const handleSelectOption = (option: string) => {
    setSelectedOption(option);
    alert(`Selected ${option}`);
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
        <Text style={styles.headerText}>Filtreaza locația </Text>
      </View>
      <FlatList
        data={options}
        renderItem={renderItem}
        keyExtractor={(item) => item}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingVertical: 15,
    backgroundColor: '#13476c',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  headerText: {
    fontSize: 20,
    color: '#fff',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  radioButtonContainer: {
    marginRight: 10,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#007BFF',
    backgroundColor: 'transparent',
  },
  selectedRadioButton: {
    backgroundColor: '#007BFF',
  },
  optionText: {
    fontSize: 16,
  },
  selectedOptionText: {
    fontWeight: 'bold',
    color: '#007BFF',
  },
});

export default FilterScreen;
