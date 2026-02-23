// App.tsx

/**
 * Root application entry component.
 *
 * This file mounts the top-level navigator and is the starting
 * point for the React Native app. It should not contain heavy
 * logic — navigation and feature-level logic live in dedicated
 * modules and hooks.
 *
 * Usage: The default export `App` is used by the native runtime
 * to bootstrap the React tree.
 */
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from './features/auth/hooks/useAuth';
import { LoginScreen } from './features/auth/screens/LoginScreen';
import { Main } from '../Wallet-app/screens/main';
import { RootNavigator } from './navigation/RootNavigator';

export default function App() {
  return <RootNavigator />;
}