// features/wallet/hooks/useAddCard.ts

import { useState } from "react";
import { CreateCardPayload } from "../models/card.model";
import { createCard } from "../repositories/card.repository";

interface UseAddCardResult {
  addCard: (payload: CreateCardPayload) => Promise<string | null>;
  loading: boolean;
  error: string | null;
}

/**
 * useAddCard
 *
 * Exposes a function to create a new card for the given user.
 * Handles loading and error state so the screen only needs to
 * call addCard() and react to the result.
 *
 * @param userId - Authenticated Firebase user id
 *
 * Returns:
 * - addCard:  async function — receives CreateCardPayload, returns
 *             the new cardId on success or null on failure
 * - loading:  boolean — true while the write is in progress
 * - error:    string | null — validation or Firestore error message
 *
 * Example:
 * const { addCard, loading, error } = useAddCard(userId);
 * const cardId = await addCard({ name: "My Wallet", currency: "USD" });
 */
export const useAddCard = (userId: string): UseAddCardResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addCard = async (payload: CreateCardPayload): Promise<string | null> => {
    setLoading(true);
    setError(null);

    try {
      const cardId = await createCard(userId, payload);
      return cardId;
    } catch (err: any) {
      setError(err.message ?? "Failed to create card");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { addCard, loading, error };
};