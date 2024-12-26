import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import RegisterScreen from '../screens/RegisterScreen';
import LoginScreen from '../screens/LoginScreen';
import { RootStackParamList } from '../constants/types';
import HomeScreen from '@/screens/HomeScreen';
import FilterScreen from '@/screens/FilterScreen';

const Stack = createStackNavigator<RootStackParamList>();

const Index: React.FC = () => {
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
    </Stack.Navigator>
  );
};

export default Index;