/**
 * RootLayout
 *
 * Root entry point for Expo Router.
 * Renders the Slot that Expo Router uses to mount each child route.
 * No providers needed here since useAuth is standalone and reads
 * Firebase state directly via subscribeToAuthState.
 */

import { Slot } from "expo-router";

export default function RootLayout() {
  return <Slot />;
}