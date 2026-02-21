import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';

import { useThemeColors } from '../../hooks/use-theme-color';
import { createStyles } from './styles';
import { useCard } from "../../hooks/useCard";
import { useLastTransaction } from "../../hooks/useLastTransaction";
import { formatTransactionDateSlim } from '../../utils/date';

interface BalanceWidgetProps {
  userId: string;
  cardId: string;
}

/**
 * BalanceWidget
 *
 * Main widget that displays the user's current balance,
 * last transaction information, and quick action buttons.
 *
 * This component is purely presentational and relies on
 * theme-based styles generated at runtime.
 */
export function BalanceWidget({ userId, cardId }: BalanceWidgetProps) {
  const colors = useThemeColors();
  const styles = createStyles(colors);
  
  const { card, loading: cardLoading } =
    useCard(userId, cardId);

  const {
    lastTransaction,
    loading: transactionLoading,
  } = useLastTransaction(userId, cardId);

  if (cardLoading || transactionLoading) {
    return <ActivityIndicator size="large" />;
  }

  if (!card) {
    return <Text>No card data available</Text>;
  }

  return (
    <View style={styles.containerCard}>
      
      {/* Widget title */}
      <Text style={styles.headerTitle}>My Balance</Text>

      {/* Balance section wrapper */}
      <View style={styles.balanceSectionWrapper}>

        {/* Header row for secondary cards */}
        <View style={styles.otherCardsRow}>
          <FontAwesome6
            style={styles.otherCardsIcon}
            name="money-bills"
            size={18}
          />
          <Text style={styles.otherCardsText}>Other Cards</Text>
        </View>

        {/* Main balance card */}
        <View style={styles.balanceCard}>
          {/* Balance label */}
          <Text style={styles.metaLabel}>Balance</Text>

          {/* Balance value and last transaction */}
          <View style={styles.balanceRow}>
            {/* Main balance amount */}
            <Text
              style={styles.balanceAmount}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              ${card.balance.toFixed(2)}
            </Text>

            {/* Last transaction info */}
            <View>
              <Text style={styles.metaLabel}>Last Trx.</Text>
              <Text style={styles.metaValue}>
                {formatTransactionDateSlim(lastTransaction.date)}
              </Text>
            </View>
          </View>

          {/* Wallet name */}
          <View style={styles.balanceRow_}>
            <View>
              <Text style={styles.metaLabel}>Name</Text>
              <Text style={styles.metaValue}>American 1</Text>
            </View>

            <TouchableOpacity style={styles.actionButton_}>
              <FontAwesome6
                style={styles.actionIcon}
                name="circle-plus"
                size={20}
              />
              <Text style={styles.actionLabelRow}>Add Card</Text>
            </TouchableOpacity>
          </View>    
          
        </View>
      </View>


      {/* Action buttons */}
      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.actionButton}>
          <FontAwesome6
            style={styles.actionIcon}
            name="money-bills"
            size={24}
          />
          <Text style={styles.actionLabel}>Add Transaction</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <FontAwesome6
            style={styles.actionIcon}
            name="wallet"
            size={24}
          />
          <Text style={styles.actionLabel}>wallet</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <FontAwesome6
            style={styles.actionIcon}
            name="money-bill-transfer"
            size={24}
          />
          <Text style={styles.actionLabel}>exchange</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
