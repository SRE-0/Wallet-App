// firebase/config.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { Platform } from "react-native";
import {
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID,
  FIREBASE_MEASUREMENT_ID,
} from "./secrets";

const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
  measurementId: FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

/**
 * initializeAuthWithPersistence
 *
 * Initializes Firebase Auth with the correct persistence strategy
 * depending on the current platform:
 *
 * - Native (iOS / Android): uses AsyncStorage so the session survives
 *   app restarts. Requires @react-native-async-storage/async-storage.
 *
 * - Web: uses Firebase's default browserLocalPersistence (localStorage),
 *   which is applied automatically when no persistence is specified.
 *   getReactNativePersistence does not exist in the web build of Firebase,
 *   so calling it on web throws "is not a function".
 *
 * @returns Configured FirebaseAuth instance
 */
const initializeAuthWithPersistence = () => {
  if (Platform.OS === "web") {
    // On web, Firebase Auth defaults to browserLocalPersistence automatically.
    // No extra configuration needed — importing getAuth is sufficient.
    const { getAuth } = require("firebase/auth");
    return getAuth(app);
  }

  // On native, explicitly configure AsyncStorage persistence so the
  // authenticated session survives when the user closes and reopens the app.
  const { initializeAuth, getReactNativePersistence } = require("firebase/auth");
  const ReactNativeAsyncStorage = require("@react-native-async-storage/async-storage").default;

  return initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
};

export const auth = initializeAuthWithPersistence();
export const db = getFirestore(app);