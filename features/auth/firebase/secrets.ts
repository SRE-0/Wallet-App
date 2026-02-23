// features/auth/firebase/secrets.ts
// Centralizes reading environment variables to simplify management
export const FIREBASE_API_KEY = process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "";
export const FIREBASE_AUTH_DOMAIN = process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "";
export const FIREBASE_PROJECT_ID = process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "";
export const FIREBASE_STORAGE_BUCKET = process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "";
export const FIREBASE_MESSAGING_SENDER_ID = process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "";
export const FIREBASE_APP_ID = process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "";
export const FIREBASE_MEASUREMENT_ID = process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID || "";

// Client ID usado por Google Sign-In (expo-auth-session)
export const EXPO_CLIENT_ID = process.env.EXPO_CLIENT_ID || "";

// Helper para detectar si estamos en modo desarrollo
export const isDev = process.env.NODE_ENV !== "production";

export function validateSecrets() {
  if (isDev) {
    const missing: string[] = [];
    if (!FIREBASE_API_KEY) missing.push("EXPO_PUBLIC_FIREBASE_API_KEY");
    if (!EXPO_CLIENT_ID) missing.push("EXPO_CLIENT_ID");
    if (missing.length) {
      // Clear development warning to remind configuring .env
      // Do not throw in production to avoid runtime failures
      // eslint-disable-next-line no-console
      console.warn(
        `Missing environment variables: ${missing.join(", ")}. See .env.example`
      );
    }
  }
}
