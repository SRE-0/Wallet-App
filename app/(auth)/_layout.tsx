/**
 * AuthLayout
 *
 * Stack layout for unauthenticated screens.
 * Stays mounted while the user is in the auth flow, so it can
 * react to auth state changes and redirect to the app once login succeeds.
 *
 * The useEffect re-runs every time user or loading changes — when Firebase
 * confirms a successful login and user goes from null to a User object,
 * the redirect to /(app)/main fires automatically.
 */

import { useEffect } from "react";
import { Stack, useRouter } from "expo-router";
import { useAuth } from "@/features/auth/hooks/useAuth";

export default function AuthLayout() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait until Firebase resolves the persisted session
    if (loading) return;

    // User just logged in — redirect to the protected stack
    if (user) {
      router.replace("/(app)/main");
    }
  }, [user, loading]);

  return <Stack screenOptions={{ headerShown: false }} />;
}