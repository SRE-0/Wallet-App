/**
 * IndexRoute
 *
 * Entry gate — only runs on cold start.
 * Reads the persisted Firebase session and redirects to the correct stack.
 * Post-login redirects are handled by (auth)/_layout.tsx, not here.
 *
 * - Authenticated   → /(app)/main
 * - Unauthenticated → /(auth)/login
 */

import { useEffect } from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/features/auth/hooks/useAuth";

export default function IndexRoute() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (user) {
      router.replace("/(app)/main");
    } else {
      router.replace("/(auth)/login");
    }
  }, [user, loading]);

  return (
    <View style={styles.container}>
      <ActivityIndicator />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});