// features/wallet/hooks/useCard.ts

import { useEffect, useState } from "react";
import { Card } from "../models/card.model";
import { getOrCreateCard, subscribeToCard } from "../services/card.service";

interface UseCardResult {
  card: Card | null;
  loading: boolean;
  error: string | null;
}

/**
 * useCard
 *
 * Ensures a card exists for the given `userId` / `cardId` and
 * subscribes to its real-time updates.
 *
 * Parameters:
 * - `userId` (string): Firebase user id
 * - `cardId` (string): Card id to observe
 *
 * Returns:
 * - `card`: `Card | null` — current card data or null
 * - `loading`: boolean — true while initializing or subscribing
 * - `error`: string | null — error message when initialization fails
 */
export const useCard = (userId: string, cardId: string): UseCardResult => {
  const [card, setCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId || !cardId) return;

    let unsubscribe: (() => void) | undefined;

    const init = async () => {
      setLoading(true);
      setError(null);

      try {
        // Garantiza que el doc exista antes de suscribirse
        await getOrCreateCard(userId, cardId);

        unsubscribe = subscribeToCard(userId, cardId, (updatedCard) => {
          setCard(updatedCard);
          setLoading(false);
        });
      } catch (err: any) {
        setError(err.message ?? "Failed to load card");
        setLoading(false);
      }
    };

    init();
    return () => unsubscribe?.();
  }, [userId, cardId]);

  return { card, loading, error };
};