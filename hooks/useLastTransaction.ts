import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { Transaction } from "../models/transaction.model";

/**
 * useLastTransaction Hook
 *
 * Subscribes in real-time to the most recent transaction
 * of a specific card.
 *
 * This hook listens to ONLY ONE document using limit(1),
 * making it lightweight and safe to use in UI widgets.
 *
 * @param userId Authenticated user ID
 * @param cardId Card ID
 */
/**
 * useLastTransaction
 *
 * Subscribes to the most recent transaction for a card (limit=1) and
 * returns it along with a loading flag. Useful for compact UI widgets.
 *
 * Usage:
 * const { lastTransaction, loading } = useLastTransaction(userId, cardId)
 *
 * @param userId - Authenticated user ID
 * @param cardId - Card ID
 * @returns Object with `lastTransaction` (Transaction | null) and `loading` (boolean)
 */
export const useLastTransaction = (
  userId: string,
  cardId: string
) => {
  const [lastTransaction, setLastTransaction] =
    useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId || !cardId) return;

    const ref = collection(
      db,
      "users",
      userId,
      "cards",
      cardId,
      "transactions"
    );

    const q = query(ref, orderBy("date", "desc"), limit(1));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        setLastTransaction({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date.toDate(),
        } as Transaction);
      } else {
        setLastTransaction(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId, cardId]);

  return { lastTransaction, loading };
};
