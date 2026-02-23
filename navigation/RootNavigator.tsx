// navigation/RootNavigator.tsx

/**
 * RootNavigator
 *
 * Top-level navigation container that selects the authenticated
 * or unauthenticated stack depending on the current auth state.
 *
 * It uses `useAuth` to read the `user` and shows a loading
 * indicator while the auth state is being resolved.
 */
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';

import { useAuth } from '../features/auth/hooks/useAuth';
import { LoginScreen } from '../features/auth/screens/LoginScreen';
import { Main } from '../../Wallet-app/screens/main';
import { AddWalletScreen } from '@/features/wallet/screens/AddWalletScreen';

// Define route types for improved TypeScript autocomplete
export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          // Authenticated: show main app routes
          <Stack.Screen name="Main" component={AddWalletScreen} />
        ) : (
          // Not authenticated: show login flow
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}