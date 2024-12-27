import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/constants/types';

type RegisterScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Home'
>;

type Props = {
  navigation: RegisterScreenNavigationProp;
};

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();

  const data = [
    {
      id: '11',
      name: 'Benzina Standard',
      logo: require('../assets/images/benzina.png'),
    },
    {
      id: '12',
      name: 'Benzina Premium',
      logo: require('../assets/images/benzina_premium.png'),
    },
    {
      id: '21',
      name: 'Motorina Standard',
      logo: require('../assets/images/motorina.png'),
    },
    {
      id: '22',
      name: 'Motorina Premium',
      logo: require('../assets/images/motorina_premium.png'),
    },
    { id: '31', name: 'GPL', logo: require('../assets/images//gpl.png') },
    {
      id: '41',
      name: 'Incarcare electrica',
      logo: require('../assets/images/incarcare_electrica.png'),
    },
  ];

  const handleItemClick = (itemName: string) => {
    navigation.navigate('Filter', { itemName });
  };

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => handleItemClick(item.name)}
    >
      <Image source={item.logo} style={styles.logo} />
      <Text style={styles.itemText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent={true}
        backgroundColor="#0b2b41"
      />
      <View style={styles.header}>
        <Text style={styles.headerText}>Alege carburantul</Text>
      </View>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
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
  item: {
    paddingTop: 20,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  logo: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  itemText: {
    fontSize: 16,
  },
});

export default HomeScreen;
