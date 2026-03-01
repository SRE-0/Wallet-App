/**
 * AddTransactionRoute
 *
 * Route file for the add-transaction modal screen.
 * Reads userId and cardId from the URL search params passed by the caller.
 * Wires onSuccess / onCancel to expo-router navigation.
 *
 * Expected params (passed via router.push):
 * - userId: string — Firebase authenticated user id
 * - cardId: string — Target card id where the transaction will be stored
 *
 * Presented as a modal over main — main screen state is preserved.
 */

import { useRouter, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, View, StyleSheet, Text } from "react-native";
import { AddTransactionScreen } from "@/features/transaction/screens/AddTransactionScreen";

export default function AddTransactionRoute() {
  const router = useRouter();

  /**
   * useLocalSearchParams reads the query params passed via router.push.
   * Both userId and cardId are required for this screen to function.
   */
  const { userId, cardId } = useLocalSearchParams<{
    userId: string;
    cardId: string;
  }>();

  // Guard against missing params — should never happen in normal flow
  if (!userId || !cardId) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          Missing required params: userId and cardId
        </Text>
      </View>
    );
  }

  /**
   * handleSuccess
   * Called after transaction is written to Firestore.
   * Dismisses the modal — main screen stays intact with its state.
   */
  const handleSuccess = () => {
    router.back();
  };

  /**
   * handleCancel
   * User dismissed without creating a transaction.
   */
  const handleCancel = () => {
    router.back();
  };

  return (
    <AddTransactionScreen
      userId={userId}
      cardId={cardId}
      onSuccess={handleSuccess}
      onCancel={handleCancel}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 14,
  },
});