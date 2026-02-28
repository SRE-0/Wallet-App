// features/wallet/repositories/transaction.repository.ts

/**
 * TransactionRepository
 *
 * Handles all Firestore read and write operations for transaction documents.
 * This module has no React state — it is consumed by hooks and screens.
 *
 * Firestore path: users/{userId}/cards/{cardId}/transactions/{transactionId}
 */

import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
  Timestamp,
  doc,
  updateDoc,
  increment,
} from "firebase/firestore";
import { db } from "../../auth/firebase/config";
import { Transaction, CreateTransactionPayload } from "../models/transaction.model";
import { validateTransaction, validateFirestoreId } from "../validators/wallet.validators";

// ─── Mapping ──────────────────────────────────────────────────────────────────

/**
 * mapDocToTransaction
 *
 * Converts a raw Firestore document snapshot into a typed Transaction model.
 *
 * @param id   - Firestore document id
 * @param data - Raw document fields
 */
const mapDocToTransaction = (
  id: string,
  data: Record<string, any>
): Transaction => ({
  id,
  amount: data.amount,
  date: data.date?.toDate?.() ?? new Date(),
  name: data.name ?? "",
  category: data.category ?? "",
  tax: data.tax ?? 0,
  createdAt: data.createdAt?.toDate?.() ?? new Date(),
});

// ─── Write operations ─────────────────────────────────────────────────────────

/**
 * addTransaction
 *
 * Validates and writes a new transaction to Firestore. Also performs
 * an atomic increment on the related card totals (balance, totalIncomed
 * or totalExpend depending on the sign of the amount).
 *
 * @param userId  - Authenticated Firebase user id
 * @param cardId  - Target card id
 * @param payload - Transaction data (CreateTransactionPayload)
 * @returns The created Firestore document id
 */
export const addTransaction = async (
  userId: string,
  cardId: string,
  payload: CreateTransactionPayload
): Promise<string> => {
  validateFirestoreId(userId, "userId");
  validateFirestoreId(cardId, "cardId");
  validateTransaction(payload);

  const sanitized = {
    ...payload,
    name: payload.name.trim(),
    category: payload.category.trim(),
  };

  const transactionsRef = collection(
    db,
    "users",
    userId,
    "cards",
    cardId,
    "transactions"
  );

  const docRef = await addDoc(transactionsRef, {
    ...sanitized,
    date: Timestamp.fromDate(sanitized.date),
    createdAt: Timestamp.now(),
  });

  // Atomically update card totals after writing the transaction
  const cardRef = doc(db, "users", userId, "cards", cardId);
  const isIncome = sanitized.amount > 0;

  await updateDoc(cardRef, {
    balance: increment(sanitized.amount),
    ...(isIncome
      ? { totalIncomed: increment(sanitized.amount) }
      : { totalExpend: increment(Math.abs(sanitized.amount)) }),
  });

  return docRef.id;
};

// ─── Real-time subscriptions ──────────────────────────────────────────────────

/**
 * subscribeToTransactions
 *
 * Subscribes to real-time updates for all transactions of a card,
 * ordered by date descending.
 *
 * @param userId     - Authenticated Firebase user id
 * @param cardId     - Target card id
 * @param callback   - Receives Transaction[] on every Firestore update
 * @param maxResults - Maximum number of documents to fetch (default 50)
 * @returns Unsubscribe function — call it on component unmount
 */
export const subscribeToTransactions = (
  userId: string,
  cardId: string,
  callback: (transactions: Transaction[]) => void,
  maxResults = 50
): (() => void) => {
  validateFirestoreId(userId, "userId");
  validateFirestoreId(cardId, "cardId");

  const ref = collection(db, "users", userId, "cards", cardId, "transactions");
  const q = query(ref, orderBy("date", "desc"), limit(maxResults));

  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => mapDocToTransaction(d.id, d.data())));
  });
};

/**
 * subscribeToLastTransaction
 *
 * Subscribes to real-time updates for only the most recent transaction.
 * Use this when the UI only needs the last movement to reduce reads.
 *
 * @param userId   - Authenticated Firebase user id
 * @param cardId   - Target card id
 * @param callback - Receives Transaction | null on every Firestore update
 * @returns Unsubscribe function — call it on component unmount
 */
export const subscribeToLastTransaction = (
  userId: string,
  cardId: string,
  callback: (transaction: Transaction | null) => void
): (() => void) => {
  validateFirestoreId(userId, "userId");
  validateFirestoreId(cardId, "cardId");

  const ref = collection(db, "users", userId, "cards", cardId, "transactions");
  const q = query(ref, orderBy("date", "desc"), limit(1));

  return onSnapshot(q, (snap) => {
    if (snap.empty) {
      callback(null);
      return;
    }
    const d = snap.docs[0];
    callback(mapDocToTransaction(d.id, d.data()));
  });
};