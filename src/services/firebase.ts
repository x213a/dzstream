import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import {
  getAuth,
  // Export spécifique à React Native (condition « react-native » du package).
  getReactNativePersistence,
  initializeAuth,
  type Auth,
} from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { Platform } from 'react-native';

const config = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

/** Sans configuration, l'app tourne en mode démo (catalogue local, pas de comptes). */
export const isFirebaseConfigured = Boolean(config.apiKey && config.projectId && config.appId);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

if (isFirebaseConfigured) {
  const isNew = getApps().length === 0;
  app = isNew ? initializeApp(config) : getApp();
  auth =
    isNew && Platform.OS !== 'web'
      ? initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) })
      : getAuth(app);
  db = getFirestore(app);
}

export { app, auth, db };

/** Collections Firestore. */
export const COLLECTIONS = {
  channels: 'channels',
  categories: 'categories',
  users: 'users',
} as const;
