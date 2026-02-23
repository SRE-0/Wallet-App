// features/wallet/hooks/useLastTransaction.ts

import { useEffect, useState } from "react";
import { Transaction } from "../models/transaction.model";
import { subscribeToLastTransaction } from "../services/transaction.service";

interface UseLastTransactionResult {
  lastTransaction: Transaction | null;
  loading: boolean;
}

/**
 * useLastTransaction
 *
 * Subscribes only to the most recent transaction for a card.
 * Use this hook when the UI only needs the last movement — it
 * reduces reads compared to subscribing to the full list.
 *
 * Parameters:
 * - `userId` (string): Firebase user id
 * - `cardId` (string): Card id to observe
 *
 * Returns an object with:
 * - `lastTransaction`: Transaction | null
 * - `loading`: boolean
 */
export const useLastTransaction = (
  userId: string,
  cardId: string
): UseLastTransactionResult => {
  const [lastTransaction, setLastTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId || !cardId) return;

    const unsubscribe = subscribeToLastTransaction(
      userId,
      cardId,
      (transaction) => {
        setLastTransaction(transaction);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [userId, cardId]);

  return { lastTransaction, loading };
};