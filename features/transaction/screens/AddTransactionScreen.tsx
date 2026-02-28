// features/wallet/screens/AddTransactionScreen.tsx

/**
 * AddTransactionScreen
 *
 * Screen that allows the user to add a new transaction to a specific card.
 * Uses useAddTransaction to handle the Firestore write and atomic card
 * balance update. Navigation is handled by the caller via onSuccess.
 *
 * Props:
 * - userId:    Authenticated Firebase user id
 * - cardId:    Target card id where the transaction will be stored
 * - onSuccess: Called after a successful transaction write
 * - onCancel:  Called when the user dismisses the screen
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
import { createStyles } from "./AddTransaction.styles";
import { width } from "@/constants/width";
import { CustomInput } from "@/components/custom-input/CustomInput";
import { BackgroundWidget } from "@/components/background-widget/background-widget";
import { useAddTransaction } from "../../wallet/hooks/useAddTransaction";

// Available transaction categories shown in the picker
const CATEGORY_OPTIONS = [
  "Food",
  "Transport",
  "Entertainment",
  "Health",
  "Utilities",
  "Income",
  "Other",
];

interface AddTransactionScreenProps {
  userId: string;
  cardId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const AddTransactionScreen = ({
  userId,
  cardId,
  onSuccess,
  onCancel,
}: AddTransactionScreenProps) => {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  const [name, setName] = useState("");
  const [amountText, setAmountText] = useState("");
  const [taxText, setTaxText] = useState("0");
  const [category, setCategory] = useState(CATEGORY_OPTIONS[0]);

  const { addTransaction, loading, error } = useAddTransaction(userId, cardId);

  /**
   * handleAddTransaction
   *
   * Parses and validates local form fields before calling addTransaction.
   * Amount accepts both positive (income) and negative (expense) values.
   * The validator in the repository will catch out-of-range values.
   */
  const handleAddTransaction = async () => {
    const amount = parseFloat(amountText);
    const tax = parseFloat(taxText);

    if (!name.trim()) {
      Alert.alert("Missing name", "Please enter a transaction name");
      return;
    }

    if (isNaN(amount) || amount === 0) {
      Alert.alert("Invalid amount", "Please enter a valid non-zero amount");
      return;
    }

    if (isNaN(tax) || tax < 0 || tax > 100) {
      Alert.alert("Invalid tax", "Tax must be between 0 and 100");
      return;
    }

    const txId = await addTransaction({
      name,
      amount,
      tax,
      category,
      date: new Date(),
    });

    if (txId) {
      onSuccess?.();
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
          <Text style={styles.headerTitle}>Add New Transaction</Text>
          <Text style={styles.headerSubTitle}>
            Enter your transaction details to get started
          </Text>

          <CustomInput
            iconName="arrow-up-a-z"
            placeholder="Name"
            keyboardType="default"
            maxLength={50}
            value={name}
            onChangeText={setName}
          />

          {/* Positive amount = income, negative = expense */}
          <CustomInput
            iconName="money-bills"
            placeholder="Amount (use - for expenses)"
            keyboardType="numeric"
            maxLength={20}
            value={amountText}
            onChangeText={setAmountText}
          />

          <CustomInput
            iconName="money-bill-trend-up"
            placeholder="Tax (max. 100%)"
            keyboardType="numeric"
            maxLength={6}
            value={taxText}
            onChangeText={setTaxText}
          />

          {/* Category selector — cycles through CATEGORY_OPTIONS on press */}
          <TouchableOpacity
            style={styles.settingButton}
            onPress={() => {
              const currentIndex = CATEGORY_OPTIONS.indexOf(category);
              const nextIndex = (currentIndex + 1) % CATEGORY_OPTIONS.length;
              setCategory(CATEGORY_OPTIONS[nextIndex]);
            }}
          >
            <View style={styles.contentIcon}>
              <FontAwesome6
                style={styles.otherCardsIcon}
                name="tag"
                size={width.icon_md}
              />
            </View>
            <View style={styles.settingContainer}>
              <Text style={styles.settingTitle}>Category</Text>
              <Text style={styles.settingSubTitle}>{category}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleAddTransaction}
            disabled={loading}
          >
            <FontAwesome6
              style={styles.actionIcon}
              name="circle-plus"
              size={width.icon_md}
            />
            <Text style={styles.actionButtonText}>
              {loading ? "Saving..." : "Add Transaction"}
            </Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
    </BackgroundWidget>
  );
};