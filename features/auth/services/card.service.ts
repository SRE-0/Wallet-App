import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase/config";

/**
 * Ensures that a card document exists.
 * If it does not exist, it will be created with default values.
 *
 * @param userId Authenticated user ID
 * @param cardId Card ID
 * @param cardName Display name of the card
 */
/**
 * ensureCardExists
 *
 * Verifies that the card document exists for a given user. If the document
 * does not exist it will be created with sensible default values.
 *
 * Usage:
 * await ensureCardExists(userId, cardId, 'My Card')
 *
 * @param userId - Authenticated user ID
 * @param cardId - Card document ID
 * @param cardName - Optional display name used when creating the card
 * @returns Promise<void>
 */
export const ensureCardExists = async (
  userId: string,
  cardId: string,
  cardName = "Default Card"
) => {
  const ref = doc(db, "users", userId, "cards", cardId);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    await setDoc(ref, {
      name: cardName,
      balance: 0,
      totalIncomed: 0,
      totalExpend: 0,
      createdAt: new Date(),
    });
  }
};
