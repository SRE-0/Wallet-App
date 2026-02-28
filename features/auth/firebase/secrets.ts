// firebase/secrets.ts

export const FIREBASE_API_KEY = process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "";
export const FIREBASE_AUTH_DOMAIN = process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "";
export const FIREBASE_PROJECT_ID = process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "";
export const FIREBASE_STORAGE_BUCKET = process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "";
export const FIREBASE_MESSAGING_SENDER_ID = process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "";
export const FIREBASE_APP_ID = process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "";
export const FIREBASE_MEASUREMENT_ID = process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID || "";

/**
 * Google Sign-In Web Client ID.
 * Used by Firebase to validate the Google token on all platforms.
 * Get this from Google Cloud Console — OAuth 2.0 Client ID of type "Web application".
 * This is also the "client_id" found inside google-services.json under
 * the entry with client_type: 3.
 */
export const EXPO_WEB_CLIENT_ID = process.env.EXPO_PUBLIC_EXPO_WEB_CLIENT_ID || "";

export const isDev = process.env.NODE_ENV !== "production";

/**
 * validateSecrets
 *
 * Warns in development if required environment variables are missing.
 * Called once at app startup — not inside hooks or components.
 */
export function validateSecrets(): void {
  if (isDev) {
    const missing: string[] = [];
    if (!FIREBASE_API_KEY) missing.push("EXPO_PUBLIC_FIREBASE_API_KEY");
    if (!EXPO_WEB_CLIENT_ID) missing.push("EXPO_PUBLIC_EXPO_WEB_CLIENT_ID");

    if (missing.length) {
      // eslint-disable-next-line no-console
      console.warn(
        `Missing environment variables: ${missing.join(", ")}. See .env.example`
      );
    }
  }
}