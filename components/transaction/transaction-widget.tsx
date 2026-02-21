/**
 * TransactionsListWidget Component
 *
 * This widget encapsulates:
 * - Transactions fetching logic
 * - Loading state handling
 * - FlatList rendering
 * - Optional header and footer components
 * - Optional seed button
 *
 * Props:
 * - userId: string -> ID used to fetch transactions
 * - showSeedButton?: boolean -> Enables the test data button
 * - HeaderComponent?: ReactNode -> Optional custom header
 * - FooterComponent?: ReactNode -> Optional custom footer
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
  const styles = createStyles(colors);

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

/**
 * Creates themed styles for the widget.
 *
 * @param colors - Theme color palette
 */
const createStyles = (colors: any) =>
  StyleSheet.create({
    contentContainer: {
      paddingHorizontal: 24,
    },

    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },

    button: {
      backgroundColor: colors.primary,
      padding: 12,
      borderRadius: 12,
      marginVertical: 16,
      alignItems: 'center',
    },

    buttonText: {
      color: colors.onPrimary,
      fontWeight: '600',
    },
  });
