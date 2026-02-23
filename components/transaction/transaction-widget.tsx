// components/transaction/TransactionsListWidget.tsx

import React from 'react';
import { FlatList, ActivityIndicator, TouchableOpacity, Text, View } from 'react-native';

import { useThemeColors } from '../../hooks/use-theme-color';
import { createListStyles } from './styles';
import { TransactionItem } from './TransactionItem';

// Transactions hook from the wallet feature
import { useTransactions } from '../../features/wallet/hooks/useTransactions';

interface TransactionsListWidgetProps {
  userId: string;
  cardId: string;
  showSeedButton?: boolean;       // Only visible in __DEV__
  HeaderComponent?: React.ReactNode;
  FooterComponent?: React.ReactNode;
}

/**
 * TransactionsListWidget
 *
 * Presents a scrollable list of transactions for the provided
 * `userId` / `cardId`. It handles loading and error states and
 * exposes an optional `seed` button (development only) to insert
 * test transactions.
 *
 * Props:
 * - `userId`: Firebase user id
 * - `cardId`: card id to filter transactions
 * - `showSeedButton`: boolean to render the test-data button
 * - `HeaderComponent` / `FooterComponent`: optional elements to render
 */
export function TransactionsListWidget({
  userId,
  cardId,
  showSeedButton = false,
  HeaderComponent,
  FooterComponent,
}: TransactionsListWidgetProps) {
  const colors = useThemeColors();
  const styles = createListStyles(colors);

  const { transactions, loading, error, seed } = useTransactions(userId, cardId);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: 'red' }}>{error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      contentContainerStyle={styles.contentContainer}
      data={transactions}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <TransactionItem transaction={item} />}
      ListHeaderComponent={
        <>
          {HeaderComponent}
          {/* Seed button is only shown in development builds */}
          {showSeedButton && __DEV__ && (
            <TouchableOpacity style={styles.button} onPress={seed}>
              <Text style={styles.buttonText}>Insert Test Transactions</Text>
            </TouchableOpacity>
          )}
        </>
      }
      ListFooterComponent={FooterComponent}
    />
  );
}