// hooks/useGoogleAuth.ts
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { Platform } from "react-native";
import { EXPO_CLIENT_ID, validateSecrets } from "../firebase/secrets";

// Ensure the browser auth session is completed on Android
WebBrowser.maybeCompleteAuthSession();

/**
 * useGoogleAuth
 *
 * Encapsulates the Expo Google Sign-In flow. Returns:
 * - `promptAsync`: function to open the Google auth UI
 * - `idToken`: the resulting Google ID token after a successful login
 * - `request`: internal request object from Expo's auth session
 *
 * Example:
 * const { promptAsync, idToken } = useGoogleAuth();
 * await promptAsync(); // opens Google sign-in UI
 * // idToken will be populated after successful authentication
 */
export const useGoogleAuth = () => {
  // Validate required secrets in development
  validateSecrets();

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: EXPO_CLIENT_ID,

    redirectUri: Platform.select({
      web: "https://sre-0.github.io/Wallet-App/", // adjust as needed for web
      default: "https://sre-0.github.io/Wallet-App/", // Expo generates a native redirect automatically
    }),
  });

  // Extract the idToken when the response is successful
  const idToken =
    response?.type === "success"
      ? response.params.id_token
      : null;

  return { promptAsync, idToken, request };
};