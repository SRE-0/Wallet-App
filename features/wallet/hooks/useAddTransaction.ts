// features/wallet/hooks/useAddTransaction.ts

import { useState } from "react";
import { CreateTransactionPayload } from "../models/transaction.model";
import { addTransaction } from "../repositories/transaction.repository";

interface UseAddTransactionResult {
  addTransaction: (payload: CreateTransactionPayload) => Promise<string | null>;
  loading: boolean;
  error: string | null;
}

/**
 * useAddTransaction
 *
 * Exposes a function to add a new transaction to a specific card.
 * Also updates the card balance and totals atomically via the repository.
 * Handles loading and error state so the screen only needs to call
 * addTransaction() and react to the result.
 *
 * @param userId - Authenticated Firebase user id
 * @param cardId - Target card id where the transaction will be stored
 *
 * Returns:
 * - addTransaction: async function — receives CreateTransactionPayload,
 *                   returns the new transaction id on success or null on failure
 * - loading:        boolean — true while the write is in progress
 * - error:          string | null — validation or Firestore error message
 *
 * Example:
 * const { addTransaction, loading, error } = useAddTransaction(userId, cardId);
 * const txId = await addTransaction({ amount: -50, name: "Coffee", ... });
 */
export const useAddTransaction = (
  userId: string,
  cardId: string
): UseAddTransactionResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const add = async (payload: CreateTransactionPayload): Promise<string | null> => {
    setLoading(true);
    setError(null);

    try {
      const txId = await addTransaction(userId, cardId, payload);
      return txId;
    } catch (err: any) {
      setError(err.message ?? "Failed to add transaction");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { addTransaction: add, loading, error };
};