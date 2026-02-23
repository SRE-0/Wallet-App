// features/wallet/services/card.service.ts

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

// ─── Mapping helpers ─────────────────────────────────────────────────────

/**
 * mapDocToCard
 *
 * Converts a raw Firestore document to a typed `Card` model.
 * Centralizing the mapping here avoids duplication and inconsistencies.
 */
const mapDocToCard = (id: string, data: Record<string, any>): Card => ({
  id,
  name: data.name ?? "Unnamed Card",
  balance: data.balance ?? 0,
  totalExpend: data.totalExpend ?? 0,
  totalIncomed: data.totalIncomed ?? 0,
  currency: data.currency ?? "$",
  createdAt: data.createdAt?.toDate?.() ?? new Date(),
});

// ─── Operations ──────────────────────────────────────────────────────────

/**
 * createCard
 *
 * Create a new card document for the specified user.
 * A predictable id is generated to allow client-side ordering.
 *
 * @param userId - Firebase user id
 * @param payload - CreateCardPayload with `name` and `currency`
 * @returns The created `cardId`
 */
export const createCard = async (
  userId: string,
  payload: CreateCardPayload
): Promise<string> => {
  validateFirestoreId(userId, "userId");
  validateCard(payload);

  // Use a timestamp-based id for predictable ordering
  const cardId = `card_${Date.now()}`;
  const ref = doc(db, "users", userId, "cards", cardId);

  await setDoc(ref, {
    name: payload.name.trim(),
    currency: payload.currency,
    balance: 0,
    totalIncomed: 0,
    totalExpend: 0,
    createdAt: serverTimestamp(),
  });

  return cardId;
};

/**
 * getOrCreateCard
 *
 * Retrieves a card by id, or creates it with `defaultPayload`
 * when it doesn't exist. Useful to ensure the card exists before
 * rendering components that depend on it.
 */
export const getOrCreateCard = async (
  userId: string,
  cardId: string,
  defaultPayload: CreateCardPayload = { name: "My Card", currency: "$" }
): Promise<Card> => {
  validateFirestoreId(userId, "userId");
  validateFirestoreId(cardId, "cardId");

  const ref = doc(db, "users", userId, "cards", cardId);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    return mapDocToCard(snap.id, snap.data());
  }

  // Card does not exist → create with defaults
  await setDoc(ref, {
    name: defaultPayload.name.trim(),
    currency: defaultPayload.currency,
    balance: 0,
    totalIncomed: 0,
    totalExpend: 0,
    createdAt: serverTimestamp(),
  });

  const created = await getDoc(ref);
  return mapDocToCard(created.id, created.data()!);
};

/**
 * getAllCards
 *
 * Returns all cards for a user ordered by creation date.
 */
export const getAllCards = async (userId: string): Promise<Card[]> => {
  validateFirestoreId(userId, "userId");

  const ref = collection(db, "users", userId, "cards");
  const q = query(ref, orderBy("createdAt", "asc"));
  const snap = await getDocs(q);

  return snap.docs.map((d) => mapDocToCard(d.id, d.data()));
};

/**
 * subscribeToCard
 *
 * Real-time subscription to a specific card document.
 * Calls `callback` with the typed `Card` or `null` when the
 * document does not exist.
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
    if (!snap.exists()) {
      callback(null);
      return;
    }
    callback(mapDocToCard(snap.id, snap.data()));
  });
};