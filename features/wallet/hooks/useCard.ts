// features/wallet/hooks/useCard.ts

import { useEffect, useState } from "react";
import { Card } from "../models/card.model";
import { subscribeToCard } from "../repositories/card.repository";

interface UseCardResult {
  card: Card | null;
  loading: boolean;
  error: string | null;
}

/**
 * useCard
 *
 * Subscribes to real-time updates for a specific card document.
 * Unlike the previous version this hook no longer calls getOrCreateCard —
 * card creation is now an explicit user action handled by useAddCard.
 *
 * @param userId - Authenticated Firebase user id
 * @param cardId - Target card id to observe
 *
 * Returns:
 * - card:    Card | null — current card data, null if not found
 * - loading: boolean — true while the subscription is initializing
 * - error:   string | null — error message on failure
 */
export const useCard = (userId: string, cardId: string): UseCardResult => {
  const [card, setCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId || !cardId) return;

    setLoading(true);
    setError(null);

    try {
      const unsubscribe = subscribeToCard(userId, cardId, (updatedCard) => {
        setCard(updatedCard);
        setLoading(false);
      });

      return unsubscribe;
    } catch (err: any) {
      setError(err.message ?? "Failed to subscribe to card");
      setLoading(false);
    }
  }, [userId, cardId]);

  return { card, loading, error };
};