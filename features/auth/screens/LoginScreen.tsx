/**
 * LoginScreen
 *
 * Authentication screen that allows users to:
 * - Login with email and password
 * - Register a new account
 * - Authenticate using Google Sign-In
 *
 * This screen is theme-aware and adapts its colors dynamically
 * using the global application theme.
 *
 * Props:
 * - onLoginSuccess: () => void
 *   Callback executed after a successful authentication,
 *   usually used to navigate to the main app.
 */

import React, { useEffect, useState } from "react";
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
import { useThemeColors } from "../../../hooks/use-theme-color";
import { createStyles } from "./login.styles";

import { BackgroundWidget } from "@/components/background/background-widget";


interface Props {
  onLoginSuccess: () => void;
}

export const LoginScreen = ({ onLoginSuccess }: Props) => {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);

  const { promptAsync, idToken } = useGoogleAuth();

  /**
   * Effect triggered when Google authentication
   * returns a valid ID token.
   *
   * Automatically performs login using Firebase.
   */
  useEffect(() => {
    if (!idToken) return;

    const handleGoogleLogin = async () => {
      setLoading(true);
      try {
        await loginWithGoogle(idToken);
        onLoginSuccess();
      } catch (error: any) {
        Alert.alert("Google login error", error.message);
      } finally {
        setLoading(false);
      }
    };

    handleGoogleLogin();
  }, [idToken]);

  /**
   * Handles authentication using email and password.
   *
   * Depending on the `isRegistering` flag, this function
   * either logs in the user or creates a new account.
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

      onLoginSuccess();
    } catch (error: any) {
      Alert.alert("Authentication error", getFriendlyError(error.code));
    } finally {
      setLoading(false);
    }
  };

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
            disabled={loading}
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
            onPress={() => promptAsync()}
            disabled={loading}
          >
            <Text style={styles.googleButtonText}>
              Continue with Google
            </Text>
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
 * Maps Firebase authentication error codes
 * to user-friendly messages.
 */
const getFriendlyError = (code: string): string => {
  const errors: Record<string, string> = {
    "auth/invalid-email": "Invalid email address",
    "auth/user-not-found": "Account not found",
    "auth/wrong-password": "Incorrect password",
    "auth/email-already-in-use": "Email already in use",
    "auth/weak-password": "Password must be at least 6 characters",
  };

  return errors[code] ?? "Unexpected error occurred";
};