/**
 * Main screen component.
 * Displays transactions and allows seeding test data.
 */

import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  View,
  Image,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Text,
} from 'react-native';
import { BalanceWidget } from './balance-widget/balance-widget';
import { useThemeColors } from '../hooks/use-theme-color';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTransactions } from '../hooks/useTransactions';
import { TransactionItem } from './transaction/TransactionItem';
import { TransactionsListWidget } from './transaction/transaction-widget';
import { createMainStyles } from './main.styles';

export function Main() {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const styles = createMainStyles(colors);

  const userId = "demoUser";
  const cardId = "demoCard_sexo1"; // Example card ID for fetching transactions

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.card_background}>
        <TransactionsListWidget
          userId={userId}
          cardId={cardId}
          showSeedButton={true} //showSeedButton is only for testing, hide it in production.

          HeaderComponent={ 
            <BalanceWidget userId={userId} cardId={cardId} /> 
          }
          FooterComponent={
            <Image
              source={{
                uri: 'http://www.alciro.org/images/alciro/585_conexion-patillas-conector-HDMI.png',
              }}
              style={styles.image}
            />
          }
        />
      </View>
    </View>
  );
}

// Styles moved to components/main.styles.ts as `createMainStyles`
