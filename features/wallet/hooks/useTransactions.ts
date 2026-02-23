// features/wallet/hooks/useTransactions.ts

import { useCallback, useEffect, useState } from "react";
import { Transaction } from "../models/transaction.model";
import {
  subscribeToTransactions,
  seedTransactions,
} from "../services/transaction.service";

interface UseTransactionsResult {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  seed: () => Promise<void>;
}

/**
 * useTransactions
 *
 * Subscribes to real-time transactions for a specific user and card.
 *
 * Parameters:
 * - `userId` (string): Firebase user id used to scope data.
 * - `cardId` (string): Card id to filter transactions for the selected card.
 *
 * Returns an object with:
 * - `transactions`: array of `Transaction` objects
 * - `loading`: boolean indicating subscription loading state
 * - `error`: optional error message
 * - `seed`: function to insert test transactions (useful in development)
 */
export const useTransactions = (
  userId: string,
  cardId: string
): UseTransactionsResult => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId || !cardId) return;

    setLoading(true);
    setError(null);

    const unsubscribe = subscribeToTransactions(
      userId,
      cardId,
      (updated) => {
        setTransactions(updated);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [userId, cardId]);

  const seed = useCallback(async () => {
    try {
      await seedTransactions(userId, cardId);
    } catch (err: any) {
      setError(err.message);
    }
  }, [userId, cardId]);

  return { transactions, loading, error, seed };
};