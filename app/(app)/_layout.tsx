/**
 * AppLayout
 *
 * Protected stack layout for authenticated screens.
 * Reads auth state via useAuth on every render — when user becomes
 * null (logout or expired session) it immediately redirects to login.
 *
 * Any screen added under (app)/ is automatically protected by this guard.
 */

import { Redirect, Stack } from "expo-router";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import { useAuth } from "@/features/auth/hooks/useAuth";

export default function AppLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );
  }

  // Redirect to login if session is gone
  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});