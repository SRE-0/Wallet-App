// features/wallet/repositories/card.repository.ts

/**
 * CardRepository
 *
 * Handles all Firestore read and write operations for card documents.
 * This module has no React state — it is consumed by hooks and screens.
 *
 * Firestore path: users/{userId}/cards/{cardId}
 */

import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../../auth/firebase/config";
import { Card, CreateCardPayload } from "../models/card.model";
import { validateCard, validateFirestoreId } from "../validators/wallet.validators";

// ─── Mapping ──────────────────────────────────────────────────────────────────

/**
 * mapDocToCard
 *
 * Converts a raw Firestore document snapshot into a typed Card model.
 *
 * @param id   - Firestore document id
 * @param data - Raw document fields
 */
const mapDocToCard = (id: string, data: Record<string, any>): Card => ({
  id,
  name: data.name ?? "Unnamed Card",
  balance: data.balance ?? 0,
  totalExpend: data.totalExpend ?? 0,
  totalIncomed: data.totalIncomed ?? 0,
  currency: data.currency ?? "USD",
  createdAt: data.createdAt?.toDate?.() ?? new Date(),
});

// ─── Write operations ─────────────────────────────────────────────────────────

/**
 * createCard
 *
 * Creates a new card document under the given user.
 * Generates a timestamp-based id for predictable ordering.
 *
 * @param userId  - Authenticated Firebase user id
 * @param payload - Card name and currency (CreateCardPayload)
 * @returns The generated cardId string
 */
export const createCard = async (
  userId: string,
  payload: CreateCardPayload
): Promise<string> => {
  validateFirestoreId(userId, "userId");
  validateCard(payload);

  const cardId = `card_${Date.now()}`;
  const ref = doc(db, "users", userId, "cards", cardId);

  await setDoc(ref, {
    name: payload.name.trim(),
    currency: payload.currency.toUpperCase(),
    balance: 0,
    totalIncomed: 0,
    totalExpend: 0,
    createdAt: serverTimestamp(),
  });

  return cardId;
};

// ─── Read operations ──────────────────────────────────────────────────────────

/**
 * getCard
 *
 * Fetches a single card document once (non-reactive).
 * Returns null if the document does not exist.
 *
 * @param userId - Authenticated Firebase user id
 * @param cardId - Target card id
 */
export const getCard = async (
  userId: string,
  cardId: string
): Promise<Card | null> => {
  validateFirestoreId(userId, "userId");
  validateFirestoreId(cardId, "cardId");

  const snap = await getDoc(doc(db, "users", userId, "cards", cardId));
  return snap.exists() ? mapDocToCard(snap.id, snap.data()) : null;
};

/**
 * getAllCards
 *
 * Fetches all cards for a user ordered by creation date ascending.
 *
 * @param userId - Authenticated Firebase user id
 */
export const getAllCards = async (userId: string): Promise<Card[]> => {
  validateFirestoreId(userId, "userId");

  const ref = collection(db, "users", userId, "cards");
  const q = query(ref, orderBy("createdAt", "asc"));
  const snap = await getDocs(q);

  return snap.docs.map((d) => mapDocToCard(d.id, d.data()));
};

// ─── Real-time subscriptions ──────────────────────────────────────────────────

/**
 * subscribeToCard
 *
 * Subscribes to real-time updates for a specific card document.
 * Calls callback with the typed Card or null if the document is missing.
 *
 * @param userId   - Authenticated Firebase user id
 * @param cardId   - Target card id
 * @param callback - Receives Card | null on every Firestore update
 * @returns Unsubscribe function — call it on component unmount
 */
export const subscribeToCard = (
  userId: string,
  cardId: string,
  callback: (card: Card | null) => void
): (() => void) => {
  validateFirestoreId(userId, "userId");
  validateFirestoreId(cardId, "cardId");

  const ref = doc(db, "users", userId, "cards", cardId);

  return onSnapshot(ref, (snap) => {
    callback(snap.exists() ? mapDocToCard(snap.id, snap.data()) : null);
  });
};

/**
 * subscribeToAllCards
 *
 * Subscribes to real-time updates for all cards of a user,
 * ordered by creation date ascending.
 *
 * @param userId   - Authenticated Firebase user id
 * @param callback - Receives Card[] on every Firestore update
 * @returns Unsubscribe function — call it on component unmount
 */
export const subscribeToAllCards = (
  userId: string,
  callback: (cards: Card[]) => void
): (() => void) => {
  validateFirestoreId(userId, "userId");

  const ref = collection(db, "users", userId, "cards");
  const q = query(ref, orderBy("createdAt", "asc"));

  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => mapDocToCard(d.id, d.data())));
  });
};