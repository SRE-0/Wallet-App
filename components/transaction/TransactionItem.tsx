/**
 * Renders a single transaction item.
 * This component is reusable and focused only on presentation.
 */

import { View, Text } from "react-native";

import { FontAwesome6 } from "@expo/vector-icons";

import { Transaction } from "../../models/transaction.model";
import { createStyles } from './styles';
import { useThemeColors } from '../../hooks/use-theme-color';
import { formatTransactionDate } from '../../utils/date';

interface Props {
  transaction: Transaction;
}

export const TransactionItem = ({ transaction }: Props) => {
    const colors = useThemeColors();
    const styles = createStyles(colors);

  return (
    <View style={styles.containerCard}>

      <View style={styles.leftContainerCard}>
        
        <View style={styles.iconContainerCard}>
          <FontAwesome6
            style={styles.otherCardsIcon}
            name="money-bills"
            size={18}
          />
        </View>

        <View>
          <Text style={styles.nameTransaction}>{transaction.name}</Text>
          <Text style={styles.bodyText}>{transaction.category}</Text>
        </View>
      </View>
      
      <View>
        <Text style={styles.bodyText}>
          {formatTransactionDate(transaction.date)}
        </Text>
        <Text style={styles.nameTransaction}>${transaction.amount}</Text>
      </View>
    </View>
  );
};
