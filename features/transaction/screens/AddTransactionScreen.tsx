/**
 * AddTransactionScreen
 *
 * Screen that allows the user to add a new transaction to a specific card.
 * Uses useAddTransaction to handle the Firestore write and atomic card
 * balance update. Navigation is handled by the caller via onSuccess.
 *
 * Transaction type toggle:
 * - "expense" → amount is stored as negative value
 * - "income"  → amount is stored as positive value
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
  StyleSheet,
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

// Transaction direction — determines the sign applied to the amount
type TransactionType = "expense" | "income";

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

  // Default to expense since it is the most common operation
  const [transactionType, setTransactionType] =
    useState<TransactionType>("expense");

  const { addTransaction, loading, error } = useAddTransaction(userId, cardId);

  /**
   * handleToggleType
   * Switches between expense and income.
   * The sign is not stored in the text field — it is applied at submit time.
   */
  const handleToggleType = () => {
    setTransactionType((prev) => (prev === "expense" ? "income" : "expense"));
  };

  /**
   * handleAddTransaction
   *
   * Parses and validates local form fields before calling addTransaction.
   * Applies a negative sign automatically when transactionType is "expense".
   * The validator in the repository will catch out-of-range values.
   */
  const handleAddTransaction = async () => {
    // Always parse the raw absolute value the user typed
    const rawAmount = parseFloat(amountText);
    const tax = parseFloat(taxText);

    if (!name.trim()) {
      Alert.alert("Missing name", "Please enter a transaction name");
      return;
    }

    if (isNaN(rawAmount) || rawAmount <= 0) {
      Alert.alert("Invalid amount", "Please enter a valid positive amount");
      return;
    }

    if (isNaN(tax) || tax < 0 || tax > 100) {
      Alert.alert("Invalid tax", "Tax must be between 0 and 100");
      return;
    }

    // Apply the sign based on the selected transaction type
    const signedAmount =
      transactionType === "expense" ? -Math.abs(rawAmount) : Math.abs(rawAmount);

    const txId = await addTransaction({
      name,
      amount: signedAmount,
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

  const isExpense = transactionType === "expense";

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

          {/*
           * Type toggle — switches between expense (negative) and income (positive).
           * The user only types the absolute value; sign is applied on submit.
           */}
          <TouchableOpacity
            style={styles.settingButton}
            onPress={handleToggleType}
          >
            <View style={styles.contentIcon}>
              <FontAwesome6
                style={styles.otherCardsIcon}
                name={isExpense ? "arrow-trend-down" : "arrow-trend-up"}
                size={width.icon_md}
              />
            </View>
            <View style={styles.settingContainer}>
              <Text style={styles.settingTitle}>Type</Text>
              <Text style={styles.settingSubTitle}>
                {isExpense ? "Expense (−)" : "Income (+)"}
              </Text>
            </View>
          </TouchableOpacity>

          {/* User types only the absolute value — sign is auto-applied */}
          <CustomInput
            iconName="money-bills"
            placeholder="Amount"
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