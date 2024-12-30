import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import RegisterScreen from '../screens/RegisterScreen';
import LoginScreen from '../screens/LoginScreen';
import { RootStackParamList } from '../constants/types';
import HomeScreen from '@/screens/HomeScreen';
import FilterScreen from '@/screens/FilterScreen';
import MapScreen from '@/screens/MapScreen';
import PinMapScreen from '@/screens/PinMapScreen';
import SettingsScreen from '@/screens/SettingsScreen';
import { auth } from '../firebaseConfig';

const Stack = createStackNavigator<RootStackParamList>();

const Index: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoggedIn(!!user);
    });

    return () => unsubscribe();
  }, []);

  if (isLoggedIn === null) {
    return null;
  }

  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="Filter"
        component={FilterScreen}
        options={{
          headerShown: false,
          headerTitle: 'Filtre locatie',
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#13476c',
            height: '45%',
          },
          headerTintColor: '#fff',
        }}
      />
      <Stack.Screen
        name="Map"
        component={MapScreen}
        options={{
          headerShown: false,
          headerTitle: 'Filtre locatie',
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#13476c',
            height: '45%',
          },
          headerTintColor: '#fff',
        }}
      />
      <Stack.Screen
        name="PinMap"
        component={PinMapScreen}
        options={{
          headerShown: false,
          headerTitle: 'Filtre locatie',
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#13476c',
            height: '45%',
          },
          headerTintColor: '#fff',
        }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          headerShown: false,
          headerTitle: 'Setari',
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#13476c',
            height: '45%',
          },
          headerTintColor: '#fff',
        }}
      />
    </Stack.Navigator>
  );
};

export default Index;
