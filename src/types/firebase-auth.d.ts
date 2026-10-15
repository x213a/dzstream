import type { Persistence, ReactNativeAsyncStorage } from 'firebase/auth';

// `getReactNativePersistence` est bien exporté à l'exécution (condition « react-native »
// de @firebase/auth, résolue par Metro), mais absent des types publics du package.
declare module 'firebase/auth' {
  export function getReactNativePersistence(storage: ReactNativeAsyncStorage): Persistence;
}
