// screens/Main.tsx

/**
 * Main screen component.
 *
 * This screen composes the main application view and shows the
 * `BalanceWidget` as the header for the transactions list. It
 * reads the authenticated user from `useAuth` and uses the
 * `TransactionsListWidget` to display recent transactions.
 *
 * Usage: <Main /> — no props required. The component expects an
 * authenticated user to be available from the auth hook; if no
 * user exists it returns null (renders nothing).
 */
import { StatusBar } from 'expo-status-bar';
import { View, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useThemeColors } from '../hooks/use-theme-color';
import { createMainStyles } from './main.styles';
import { BalanceWidget } from '../components/balance-widget/balance-widget';
import { TransactionsListWidget } from '../components/transaction/transaction-widget';

// The authenticated user is provided by the auth feature hook
import { useAuth } from '../features/auth/hooks/useAuth';

const CARD_ID = "main"; // Fixed id used for the main/default card view

export function Main() {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const styles = createMainStyles(colors);

  // Get the current authenticated user from the global auth hook
  const { user } = useAuth();

  // If there's no authenticated user, render nothing
  if (!user) return null;

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.card_background}>
        <TransactionsListWidget
          userId={user.uid}
          cardId={CARD_ID}
          showSeedButton={true} // The widget itself only shows the seed button in dev
          HeaderComponent={
            <BalanceWidget userId={user.uid} cardId={CARD_ID} />
          }
          FooterComponent={
            <Image
              source={{ uri: 'https://www.gstatic.com/mobilesdk/240501_mobilesdk/firebase_28dp.png' }}
              style={styles.image}
            />
          }
        />
      </View>
    </View>
  );
}