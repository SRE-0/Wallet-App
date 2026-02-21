import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";
import { Card } from "../models/card.model";
import { ensureCardExists } from "../services/card.service";

/**
 * useCard Hook
 *
 * - Ensures card existence
 * - Subscribes in real-time to the card document
 * - Single source of truth for balance and totals
 *
 * @param userId Authenticated user ID
 * @param cardId Card ID
 */
export const useCard = (userId: string, cardId: string) => {
  const [card, setCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId || !cardId) return;

    let unsubscribe: (() => void) | undefined;

    const init = async () => {
      setLoading(true);

      // 🔥 CRITICAL FIX: Ensure card exists
      await ensureCardExists(userId, cardId);

      const ref = doc(db, "users", userId, "cards", cardId);

      unsubscribe = onSnapshot(ref, (snap) => {
        if (snap.exists()) {
          setCard({ id: snap.id, ...snap.data() } as Card);
        } else {
          setCard(null);
        }
        setLoading(false);
      });
    };

    init();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [userId, cardId]);

  return { card, loading };
};
