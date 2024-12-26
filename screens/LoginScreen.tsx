import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
  StatusBar,
} from 'react-native';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../constants/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Checkbox from 'expo-checkbox';
type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Login'
>;

type Props = {
  navigation: LoginScreenNavigationProp;
};

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [rememberMe, setRememberMe] = useState<boolean>(false);

  useEffect(() => {
    const checkRememberedUser = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem('email');
        const storedPassword = await AsyncStorage.getItem('password');
        const storedRememberMe = await AsyncStorage.getItem('rememberMe');

        if (storedRememberMe === 'true' && storedEmail && storedPassword) {
          setEmail(storedEmail);
          setPassword(storedPassword);
          setRememberMe(true);
          handleLogin(storedEmail, storedPassword);
        } else {
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
      }
    };

    checkRememberedUser();
  }, []);

  const handleLogin = async (emailToUse?: string, passwordToUse?: string) => {
    const emailToLogin = emailToUse || email;
    const passwordToLogin = passwordToUse || password;

    if (!emailToLogin || !passwordToLogin) {
      setErrorMessage('Please provide both email and password');
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, emailToLogin, passwordToLogin);
      if (rememberMe) {
        await AsyncStorage.setItem('email', emailToLogin);
        await AsyncStorage.setItem('password', passwordToLogin);
        await AsyncStorage.setItem('rememberMe', 'true');
      } else {
        await AsyncStorage.removeItem('email');
        await AsyncStorage.removeItem('password');
        await AsyncStorage.setItem('rememberMe', 'false');
      }

      navigation.replace('Home');
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };

  const handleRegisterRedirect = () => {
    navigation.navigate('Register');
  };

  if (loading) {
    return null;
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar
        barStyle="light-content"
        translucent={true}
        backgroundColor="#2280c2"
      />

      <ImageBackground
        source={require('../assets/images/background.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <Text style={styles.smallDropletText}>Welcome back,</Text>
        <Text style={styles.dropletText}>Log in!</Text>
        <View style={styles.inputsContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {errorMessage ? (
            <Text style={styles.error}>{errorMessage}</Text>
          ) : null}

          <View style={styles.checkboxContainer}>
            <Checkbox value={rememberMe} onValueChange={setRememberMe} />
            <Text style={styles.checkboxLabel}>Remember me</Text>
          </View>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => handleLogin()}
          >
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Don't have an account?</Text>

            <TouchableOpacity onPress={handleRegisterRedirect}>
              <Text style={styles.registerButton}>Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  dropletText: {
    color: 'white',
    fontSize: 40,
    fontWeight: 'bold',
  },
  smallDropletText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  inputsContainer: {
    marginTop: 120,
    marginBottom: 20,
    padding: 20,
    borderRadius: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  loginButton: {
    backgroundColor: '#2280c2',
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  registerText: {
    fontSize: 14,
    marginBottom: 10,
  },
  registerButton: {
    fontSize: 16,
    color: '#2280c2',
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkboxLabel: {
    fontSize: 14,
    color: 'black',
    marginLeft: 10,
  },
});

export default LoginScreen;
