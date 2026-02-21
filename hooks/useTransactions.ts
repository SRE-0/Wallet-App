/**
 * Custom hook that manages transaction state for a specific card.
 * 
 * It handles:
 * - Real-time subscription
 * - Loading state
 * - Adding transactions
 * - Seeding test data
 * 
 * @param userId - Authenticated user ID
 * @param cardId - Card ID to fetch transactions from
 */

import { useEffect, useState } from "react";
import { Transaction } from "../models/transaction.model";
import {
  addTransaction,
  subscribeToTransactions,
  seedTransactions,
} from "../services/transaction.service";

export const useTransactions = (
  userId: string,
  cardId: string
) => {

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    if (!cardId) return;

    const unsubscribe = subscribeToTransactions(
      userId,
      cardId,
      (data) => {
        setTransactions(data);
        setLoading(false);
      }
    );

    return () => unsubscribe();

  }, [userId, cardId]);

  return {
    transactions,
    loading,
    addTransaction: (transaction: Omit<Transaction, "id">) =>
      addTransaction(userId, cardId, transaction),
    seedTransactions: () =>
      seedTransactions(userId, cardId),
  };
};
