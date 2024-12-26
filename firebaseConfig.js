// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyD64h1yLnUX1kYJ_JvltzCtA2HvVncjZAA',
  authDomain: 'computernetwork-eaf08.firebaseapp.com',
  projectId: 'computernetwork-eaf08',
  storageBucket: 'computernetwork-eaf08.firebasestorage.app',
  messagingSenderId: '337897437662',
  appId: '1:337897437662:web:982f948a081c1fcf99c54f',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export { auth };
