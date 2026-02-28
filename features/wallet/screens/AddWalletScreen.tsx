// features/wallet/screens/AddWalletScreen.tsx

/**
 * AddWalletScreen
 *
 * Screen that allows the user to create a new card/wallet.
 * Uses useAddCard to handle the Firestore write and navigation
 * is handled by the caller after a successful card creation.
 *
 * Props:
 * - userId:     Authenticated Firebase user id
 * - onSuccess:  Called with the new cardId after successful creation
 * - onCancel:   Called when the user dismisses the screen
 */

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Alert,
  Platform,
} from "react-native";

import { useThemeColors } from "@/hooks/use-theme-color";
import { FontAwesome6 } from "@expo/vector-icons";
import { createStyles } from "./add_wallet.styles";
import { width } from "@/constants/width";
import { CustomInput } from "@/components/custom-input/CustomInput";
import { BackgroundWidget } from "@/components/background-widget/background-widget";
import { useAddCard } from "../hooks/useAddCard";

// Supported currency options shown in the picker
const CURRENCY_OPTIONS = ["USD", "EUR", "GBP", "COP", "MXN"];

interface AddWalletScreenProps {
  userId: string;
  onSuccess?: (cardId: string) => void;
  onCancel?: () => void;
}

export const AddWalletScreen = ({
  userId,
  onSuccess,
  onCancel,
}: AddWalletScreenProps) => {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  const [name, setName] = useState("");
  const [currency, setCurrency] = useState("USD");

  const { addCard, loading, error } = useAddCard(userId);

  /**
   * handleAddCard
   *
   * Validates local fields and calls addCard from the hook.
   * Alerts the user on validation or Firestore errors.
   * Calls onSuccess with the new cardId on a successful write.
   */
  const handleAddCard = async () => {
    if (!name.trim()) {
      Alert.alert("Missing name", "Please enter a card name");
      return;
    }

    const cardId = await addCard({ name, currency });

    if (cardId) {
      onSuccess?.(cardId);
    } else if (error) {
      Alert.alert("Error", error);
    }
  };

  return (
    <BackgroundWidget>
      <View style={styles.container}>
        <KeyboardAvoidingView
          style={styles.containerCard}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <Text style={styles.headerTitle}>Add New Wallet</Text>
          <Text style={styles.headerSubTitle}>
            Enter your wallet details to get started
          </Text>

          <CustomInput
            iconName="credit-card"
            placeholder="Name of card"
            keyboardType="default"
            maxLength={50}
            value={name}
            onChangeText={setName}
          />

          {/* Currency selector — cycles through CURRENCY_OPTIONS on press */}
          <TouchableOpacity
            style={styles.settingButton}
            onPress={() => {
              const currentIndex = CURRENCY_OPTIONS.indexOf(currency);
              const nextIndex = (currentIndex + 1) % CURRENCY_OPTIONS.length;
              setCurrency(CURRENCY_OPTIONS[nextIndex]);
            }}
          >
            <View style={styles.contentIcon}>
              <FontAwesome6
                style={styles.otherCardsIcon}
                name="dollar-sign"
                size={width.icon_md}
              />
            </View>
            <View style={styles.settingContainer}>
              <Text style={styles.settingTitle}>Currency</Text>
              <Text style={styles.settingSubTitle}>{currency}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleAddCard}
            disabled={loading}
          >
            <FontAwesome6
              style={styles.actionIcon}
              name="circle-plus"
              size={width.icon_md}
            />
            <Text style={styles.actionButtonText}>
              {loading ? "Creating..." : "Add Card"}
            </Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
    </BackgroundWidget>
  );
};