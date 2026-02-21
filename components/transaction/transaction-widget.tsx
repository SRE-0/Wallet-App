/**
 * TransactionsListWidget Component
 *
 * This widget fetches and renders a list of transactions for a
 * specific user's card. It handles loading state and provides
 * optional header/footer and a development seed button.
 *
 * Props:
 * - userId: string - Authenticated user id used to fetch documents
 * - cardId: string - Card id to scope transactions
 * - showSeedButton?: boolean - When true shows a button to insert test data
 * - HeaderComponent?: ReactNode - Optional React node to render above the list
 * - FooterComponent?: ReactNode - Optional React node to render below the list
 */

import React from 'react';
import {
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
} from 'react-native';

import { useThemeColors } from '../../hooks/use-theme-color';
import { useTransactions } from '../../hooks/useTransactions';
import { TransactionItem } from './TransactionItem';
import { createListStyles } from './styles';

interface TransactionsListWidgetProps {
  userId: string;
  cardId: string;
  showSeedButton?: boolean;
  HeaderComponent?: React.ReactNode;
  FooterComponent?: React.ReactNode;
}

export function TransactionsListWidget({
  userId,
  cardId,
  showSeedButton = false,
  HeaderComponent,
  FooterComponent,
}: TransactionsListWidgetProps) {
  const colors = useThemeColors();
  const styles = createListStyles(colors);

  /**
   * Fetch transactions using custom hook
   */
  const { transactions, loading, seedTransactions } =
    useTransactions(userId, cardId);

  /**
   * Show loading indicator while fetching data
   */
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <FlatList
      contentContainerStyle={styles.contentContainer}
      data={transactions}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TransactionItem transaction={item} />
      )}
      
      ListHeaderComponent={
        <>
          {HeaderComponent}

          {showSeedButton && (
            <TouchableOpacity
              style={styles.button}
              onPress={seedTransactions}
            >
              <Text style={styles.buttonText}>
                Insert Test Transactions
              </Text>
            </TouchableOpacity>
          )}
        </>
      }
      ListFooterComponent={FooterComponent}
    />
  );
}

// Styles moved to components/transaction/styles.ts as `createListStyles`
