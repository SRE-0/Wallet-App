/**
 * AppLayout
 *
 * Protected stack layout for authenticated screens.
 * Configures native animations per platform and modal presentations
 * for add-wallet and add-transaction screens so that main screen
 * state is preserved when navigating to and from them.
 *
 * Screen options:
 * - main:            full screen, no header, no animation
 * - add-wallet:      modal presentation with native slide-up animation
 * - add-transaction: modal presentation with native slide-up animation
 */

import { Redirect, Stack } from "expo-router";
import { ActivityIndicator, View, StyleSheet, Platform } from "react-native";
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

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* Main dashboard — no animation on first load */}
      <Stack.Screen
        name="main"
        options={{
          animation: "none",
        }}
      />

      {/*
       * add-wallet modal — main stays mounted underneath.
       * iOS: native sheet slide-up / Android: slide from bottom
       */}
      <Stack.Screen
        name="add-wallet"
        options={{
          presentation: "modal",
        }}
      />

      {/*
       * add-transaction modal — receives userId and cardId as search params.
       * main stays mounted underneath, state is fully preserved.
       * iOS: native sheet slide-up / Android: slide from bottom
       */}
      <Stack.Screen
        name="add-transaction"
        options={{
          presentation: "modal",
        }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});