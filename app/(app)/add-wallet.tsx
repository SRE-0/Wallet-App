/**
 * AddWalletRoute
 *
 * Route file for the add wallet modal screen.
 * Reads userId from the authenticated session and wires
 * onSuccess / onCancel to expo-router navigation.
 *
 * Presented as a modal over main — main screen state is preserved.
 */

import { useRouter } from "expo-router";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { AddWalletScreen } from "@/features/wallet/screens/AddWalletScreen";
import { ActivityIndicator, View, StyleSheet } from "react-native";

export default function AddWalletRoute() {
  const router = useRouter();
  const { user, loading } = useAuth();

  if (loading || !user) {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );
  }

  /**
   * handleSuccess
   * Called after card is created in Firestore.
   * Dismisses the modal — main screen stays intact with its state.
   *
   * @param cardId - The newly created card id from Firestore
   */
  const handleSuccess = (cardId: string) => {
    router.back();
    // Optionally: pass cardId back via router.setParams or a state manager
    // so main can react to the new card without a reload.
  };

  /**
   * handleCancel
   * User dismissed without creating a card.
   */
  const handleCancel = () => {
    router.back();
  };

  return (
    <AddWalletScreen
      userId={user.uid}
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
});