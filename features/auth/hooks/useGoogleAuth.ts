// hooks/useGoogleAuth.ts — versión con logs de diagnóstico

import { useState } from "react";
import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin";
import { EXPO_WEB_CLIENT_ID } from "../firebase/secrets";

GoogleSignin.configure({
  webClientId: EXPO_WEB_CLIENT_ID,
  offlineAccess: false,
});

export const useGoogleAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signIn = async (): Promise<string | null> => {
    setError(null);
    setLoading(true);

    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

      const userInfo = await GoogleSignin.signIn();

      // ─── DIAGNOSTIC LOGS — remove after fixing ───
      console.log("userInfo completo:", JSON.stringify(userInfo, null, 2));
      console.log("idToken:", userInfo.data?.idToken);
      // ─────────────────────────────────────────────

      return userInfo.data?.idToken ?? null;

    } catch (err: any) {
      // ─── DIAGNOSTIC LOGS — remove after fixing ───
      console.log("Google Sign-In error completo:", JSON.stringify(err, null, 2));
      console.log("error.code:", err.code);
      console.log("error.message:", err.message);
      // ─────────────────────────────────────────────

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

  return { signIn, loading, error };
};