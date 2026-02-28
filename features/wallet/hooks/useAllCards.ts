// features/wallet/hooks/useAllCards.ts

import { useEffect, useState } from "react";
import { Card } from "../models/card.model";
import { subscribeToAllCards } from "../repositories/card.repository";

interface UseAllCardsResult {
  cards: Card[];
  loading: boolean;
  error: string | null;
}

/**
 * useAllCards
 *
 * Subscribes to real-time updates for all cards belonging to a user,
 * ordered by creation date ascending.
 *
 * @param userId - Authenticated Firebase user id
 *
 * Returns:
 * - cards:   Card[] — list of all user cards
 * - loading: boolean — true while the subscription is initializing
 * - error:   string | null — error message on failure
 */
export const useAllCards = (userId: string): UseAllCardsResult => {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const unsubscribe = subscribeToAllCards(userId, (updatedCards) => {
        setCards(updatedCards);
        setLoading(false);
      });

      return unsubscribe;
    } catch (err: any) {
      setError(err.message ?? "Failed to load cards");
      setLoading(false);
    }
  }, [userId]);

  return { cards, loading, error };
};