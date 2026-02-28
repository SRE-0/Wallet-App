/**
 * LoginScreen
 *
 * Authentication screen that allows users to:
 * - Login with email and password
 * - Register a new account
 * - Authenticate using the native Google Sign-In popup
 *
 * Navigation is handled automatically by Expo Router, which listens
 * to Firebase auth state via useAuth. When login succeeds Firebase updates
 * the auth state and app/index.tsx redirects to the authenticated stack.
 *
 * This screen is theme-aware and adapts its colors dynamically
 * using the global application theme.
 */

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { loginWithEmail, registerWithEmail, loginWithGoogle } from "../services/auth.service";
import { useGoogleAuth } from "../hooks/useGoogleAuth";
import { useThemeColors } from "@/hooks/use-theme-color";
import { createStyles } from "./login.styles";
import { BackgroundWidget } from "@/components/background-widget/background-widget";

export const LoginScreen = () => {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);

  const { signIn: googleSignIn, loading: googleLoading } = useGoogleAuth();

  /**
   * handleGoogleAuth
   *
   * Triggers the native Google account picker popup and exchanges
   * the resulting ID token for a Firebase session.
   * Returns early and shows no error if the user cancelled the picker.
   */
  const handleGoogleAuth = async () => {
    const idToken = await googleSignIn();

    // null means the user cancelled — no error needed
    if (!idToken) return;

    setLoading(true);
    try {
      await loginWithGoogle(idToken);
      // Navigation is handled automatically by app/index.tsx via useAuth
    } catch (error: any) {
      Alert.alert("Google login error", error.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * handleEmailAuth
   *
   * Handles authentication using email and password.
   * Depending on the isRegistering flag, either logs in or creates
   * a new account. Navigation is handled by app/index.tsx automatically.
   */
  const handleEmailAuth = async () => {
    if (!email || !password) {
      Alert.alert("Missing data", "Please complete all required fields");
      return;
    }

    if (isRegistering && !displayName) {
      Alert.alert("Missing name", "Please enter your name");
      return;
    }

    setLoading(true);

    try {
      if (isRegistering) {
        await registerWithEmail(email, password, displayName);
      } else {
        await loginWithEmail(email, password);
      }
    } catch (error: any) {
      Alert.alert("Authentication error", getFriendlyError(error.code));
    } finally {
      setLoading(false);
    }
  };

  // True when either email auth or Google auth is in progress
  const isLoading = loading || googleLoading;

  return (
    <BackgroundWidget>
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.card}>

          <Text style={styles.title}>
            {isRegistering ? "Create account" : "Welcome back"}
          </Text>

          <Text style={styles.subtitle}>
            {isRegistering
              ? "Create a new account to continue"
              : "Log in to manage your finances"}
          </Text>

          {isRegistering && (
            <TextInput
              style={styles.input}
              placeholder="Full name"
              placeholderTextColor={colors.onBackground}
              value={displayName}
              onChangeText={setDisplayName}
              autoCapitalize="words"
            />
          )}

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={colors.onBackground}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={colors.onBackground}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleEmailAuth}
            disabled={isLoading}
          >
            {loading ? (
              <ActivityIndicator color={colors.background} />
            ) : (
              <Text style={styles.primaryButtonText}>
                {isRegistering ? "Create account" : "Sign in"}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.googleButton}
            onPress={handleGoogleAuth}
            disabled={isLoading}
          >
            {googleLoading ? (
              <ActivityIndicator color={colors.background} />
            ) : (
              <Text style={styles.googleButtonText}>
                Continue with Google
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setIsRegistering(!isRegistering)}
          >
            <Text style={styles.toggleText}>
              {isRegistering
                ? "Already have an account? Sign in"
                : "Don't have an account? Create one"}
            </Text>
          </TouchableOpacity>

        </View>
      </KeyboardAvoidingView>
    </BackgroundWidget>
  );
};

/**
 * getFriendlyError
 *
 * Maps Firebase authentication error codes to user-friendly messages.
 *
 * @param code - Firebase error code (e.g. "auth/wrong-password")
 * @returns Human-readable error string
 */
const getFriendlyError = (code: string): string => {
  const errors: Record<string, string> = {
    "auth/invalid-email": "Invalid email address",
    "auth/user-not-found": "Account not found",
    "auth/wrong-password": "Incorrect password",
    "auth/email-already-in-use": "Email already in use",
    "auth/weak-password": "Password must be at least 6 characters",
    "auth/invalid-credential": "Incorrect email or password",
    "auth/too-many-requests": "Too many attempts, please try again later",
    "auth/network-request-failed": "Network error, check your connection",
  };

  return errors[code] ?? "Unexpected error occurred";
};