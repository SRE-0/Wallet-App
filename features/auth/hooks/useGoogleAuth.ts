// hooks/useGoogleAuth.ts

import { useState } from "react";
import { Platform } from "react-native";
import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import * as AuthSession from "expo-auth-session";
import { EXPO_WEB_CLIENT_ID } from "../firebase/secrets";

/**
 * Required by expo-auth-session on web to complete the OAuth redirect
 * loop when the browser returns to the app after Google authentication.
 * Safe to call on all platforms — it is a no-op on native.
 */
WebBrowser.maybeCompleteAuthSession();

/**
 * Configure the native Google Sign-In SDK.
 * Only has effect on Android and iOS — ignored on web.
 * Must be called once at module level before any sign-in attempt.
 */
if (Platform.OS !== "web") {
  GoogleSignin.configure({
    webClientId: EXPO_WEB_CLIENT_ID,
    offlineAccess: false,
  });
}

/**
 * WEB_REDIRECT_URI
 *
 * The URI Google redirects to after the user completes authentication.
 * On web this must match exactly one of the authorized redirect URIs
 * registered in Google Cloud Console under the Web application OAuth client.
 *
 * Use AuthSession.makeRedirectUri() so it resolves correctly both in
 * local development (http://localhost:8081) and in production
 * (https://sre-0.github.io/Wallet-App/).
 */
const WEB_REDIRECT_URI = AuthSession.makeRedirectUri({});

/**
 * useGoogleAuth
 *
 * Unified Google Sign-In hook that selects the correct implementation
 * depending on the current platform:
 *
 * - Android / iOS: uses @react-native-google-signin/google-signin which
 *   triggers the native Google account picker popup.
 *
 * - Web: uses expo-auth-session which opens a Google OAuth popup in the
 *   browser. Requires the redirectUri to be registered in Google Cloud
 *   Console under the Web application OAuth 2.0 client.
 *
 * Returns:
 * - signIn:   async function that triggers the sign-in flow and resolves
 *             with the Google ID token string on success, or null on cancel
 * - loading:  true while the sign-in flow is in progress
 * - error:    error message string if the flow failed, null otherwise
 *
 * Example:
 * const { signIn, loading } = useGoogleAuth();
 * const idToken = await signIn();
 * if (idToken) await loginWithGoogle(idToken);
 */
export const useGoogleAuth = () => {
  // ─── Web-only: expo-auth-session setup ───────────────────────────────────
  // useIdTokenAuthRequest must be called unconditionally (Rules of Hooks).
  // On native platforms this hook is initialized but its promptAsync is
  // never called — the native SDK is used instead.
  const [webRequest, webResponse, webPromptAsync] = Google.useIdTokenAuthRequest({
    clientId: EXPO_WEB_CLIENT_ID,
    // Must match exactly one of the authorized redirect URIs registered
    // in Google Cloud Console → OAuth 2.0 client → Web application.
    // Add both http://localhost:8081 (dev) and your production URL.
    redirectUri: WEB_REDIRECT_URI,
  });

  console.log("Google Auth - WEB_REDIRECT_URI:", WEB_REDIRECT_URI);

  // ─── Shared state ─────────────────────────────────────────────────────────
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ─── Native sign-in (Android / iOS) ──────────────────────────────────────

  /**
   * signInNative
   *
   * Opens the native Google account picker on Android and iOS.
   * Returns the ID token on success or null if cancelled / failed.
   */
  const signInNative = async (): Promise<string | null> => {
    setError(null);
    setLoading(true);

    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const userInfo = await GoogleSignin.signIn();
      return userInfo.data?.idToken ?? null;

    } catch (err: any) {
      if (err.code === statusCodes.SIGN_IN_CANCELLED) return null;
      if (err.code === statusCodes.IN_PROGRESS) return null;
      if (err.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        setError("Google Play Services is not available on this device");
      } else {
        setError(err.message ?? "Unexpected error during Google Sign-In");
      }
      return null;

    } finally {
      setLoading(false);
    }
  };

  // ─── Web sign-in (browser) ────────────────────────────────────────────────

  /**
   * signInWeb
   *
   * Opens a Google OAuth popup in the browser using expo-auth-session.
   * Returns the ID token on success or null if cancelled / failed.
   */
  const signInWeb = (): Promise<string | null> => {
    return new Promise((resolve) => {
      setError(null);
      setLoading(true);

      webPromptAsync().then((result) => {
        if (result?.type === "success") {
          resolve(result.params.id_token ?? null);
        } else {
          resolve(null);
        }
      }).catch((err: any) => {
        setError(err.message ?? "Unexpected error during Google Sign-In");
        resolve(null);
      }).finally(() => {
        setLoading(false);
      });
    });
  };

  // ─── Unified entry point ──────────────────────────────────────────────────

  /**
   * signIn
   *
   * Platform-aware sign-in function. Delegates to the native SDK on
   * Android/iOS and to expo-auth-session on web.
   */
  const signIn = (): Promise<string | null> => {
    if (Platform.OS === "web") {
      return signInWeb();
    }
    return signInNative();
  };

  return { signIn, loading, error };
};