import { View, Text, ActivityIndicator } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';

import { useThemeColors } from '../../hooks/use-theme-color';
import { createStyles } from './styles';
import { ActionButton } from './ActionButton';
import { formatTransactionDateSlim } from '../../utils/date';

// Hooks provided by the wallet feature
import { useCard } from '../../features/wallet/hooks/useCard';
import { useLastTransaction } from '../../features/wallet/hooks/useLastTransaction';

import { Link } from 'expo-router';
import { useRouter } from "expo-router";


interface BalanceWidgetProps {
  userId: string;
  cardId: string;
}

/**
 * BalanceWidget
 *
 * Renders the user's current card balance, the last transaction
 * date and quick action buttons.
 *
 * Props:
 * - `userId` (string): Firebase user id used to fetch card data.
 * - `cardId` (string): The id of the card to show the balance for.
 *
 * This component does not return values; it renders UI only.
 */
export function BalanceWidget({ userId, cardId }: BalanceWidgetProps) {
  const colors = useThemeColors();
  const styles = createStyles(colors);
  
  const { card, loading: cardLoading, error: cardError } = useCard(userId, cardId);
  const { lastTransaction, loading: txLoading } = useLastTransaction(userId, cardId);

  // Inside your component:
  const router = useRouter();

  // Loading / error states
  if (cardLoading || txLoading) {
    return <ActivityIndicator size="large" />;
  }

  if (cardError) {
    return <Text style={{ color: 'red' }}>{cardError}</Text>;
  }

  if (!card) {
    return <Text>No card data available</Text>;
  }

  /**
  * navigateToAddTransaction
  * Pushes the add-transaction modal passing userId and cardId as
  * search params so the screen knows which card to write to.
  */
  const navigateToAddTransaction = () => {
    router.push({
      pathname: "/(app)/add-transaction",
      params: { userId, cardId },
    });
  };

  /**
   * navigateToAddWallet
   * Pushes the add-wallet modal. No params needed.
   */
  const navigateToAddWallet = () => {
    router.push("/(app)/add-wallet");
  };

  return (
    <View style={styles.containerCard}>
      <Text style={styles.headerTitle}>My Balance</Text>

      <View style={styles.balanceSectionWrapper}>
        <View style={styles.otherCardsRow}>
          <FontAwesome6 style={styles.otherCardsIcon} name="money-bills" size={18} />
          <Text style={styles.otherCardsText}>Other Cards</Text>
        </View>

        <View style={styles.balanceCard}>
          <Text style={styles.metaLabel}>Balance</Text>

          <View style={styles.balanceRow}>
            <Text style={styles.balanceAmount} numberOfLines={1} ellipsizeMode="tail">
              {card.currency} {card.balance.toFixed(2)}
            </Text>

            <View>
              <Text style={styles.metaLabel}>Last Trx.</Text>
              <Text style={styles.metaValue}>
                {lastTransaction?.date
                  ? formatTransactionDateSlim(lastTransaction.date)
                  : 'No transactions'}
              </Text>
            </View>
          </View>

          <View style={styles.balanceRow_}>
            <View>
              <Text style={styles.metaLabel}>Name</Text>
              <Text style={styles.metaValue}>{card.name}</Text>
            </View>
            <ActionButton variant="row" name="circle-plus" label="Add Card" 
              onPress={navigateToAddWallet}
            />
          </View>
        </View>
      </View>

      <View style={styles.actionsRow}>
        <ActionButton name="money-bills" label="Add Transaction" 
          onPress={navigateToAddTransaction} 
        />
        <ActionButton name="wallet" label="Wallet"
          onPress={navigateToAddWallet}
        />
        <ActionButton name="money-bill-transfer" label="Exchange" />
      </View>
    </View>
  );
}
