// firebase/config.ts

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { Platform } from "react-native";
import {
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID,
  FIREBASE_MEASUREMENT_ID,
  validateSecrets,
} from "./secrets";

// Validación en desarrollo para recordar configurar variables de entorno
validateSecrets();

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

/*
 * Note on persistence:
 * Calling `getAuth()` without additional persistence configuration
 * works for both web and native environments:
 * - Web: uses localStorage automatically
 * - Native: uses in-memory persistence (session lasts while app is open)
 *
 * If you require persistence across native app restarts, install
 * `@react-native-async-storage/async-storage` and configure Firebase
 * persistence accordingly when supported by your Firebase SDK.
 */
export const auth = getAuth(app);
export const db = getFirestore(app);