// features/wallet/services/transaction.service.ts

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
import {
  validateTransaction,
  validateFirestoreId,
} from "../validators/wallet.validators";

// ─── Mapping helpers ─────────────────────────────────────────────────────

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

// ─── Operations ──────────────────────────────────────────────────────────

/**
 * addTransaction
 *
 * Validates and writes a new transaction to Firestore. Also performs
 * an atomic update on the related card totals (balance, totalIncomed,
 * totalExpend).
 *
 * @param userId - Firebase user id
 * @param cardId - Card id where the transaction will be stored
 * @param payload - Transaction payload to store
 * @returns The created document id
 */
export const addTransaction = async (
  userId: string,
  cardId: string,
  payload: CreateTransactionPayload
): Promise<string> => {
  // 1. Validate IDs
  validateFirestoreId(userId, "userId");
  validateFirestoreId(cardId, "cardId");

  // 2. Validate payload before writing to Firestore
  validateTransaction(payload);

  // 3. Sanitize text fields before saving
  const sanitized = {
    ...payload,
    name: payload.name.trim(),
    category: payload.category.trim(),
  };

  // 4. Write transaction document
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

  // 5. Atomically update card totals
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

/**
 * subscribeToTransactions
 *
 * Real-time subscription to card transactions, ordered by date DESC.
 *
 * @param userId - Firebase user id
 * @param cardId - Card id to scope the query
 * @param callback - Called with the array of transactions on updates
 * @param maxResults - Optional limit to avoid unbounded reads
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
    const transactions = snap.docs.map((d) =>
      mapDocToTransaction(d.id, d.data())
    );
    callback(transactions);
  });
};

/**
 * subscribeToLastTransaction
 *
 * Real-time subscription to only the most recent transaction. Useful
 * when the UI only needs the last movement, reducing the number of
 * documents read.
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

// ─── Development helpers ─────────────────────────────────────────────────

/**
 * seedTransactions
 *
 * Inserts example transactions for development purposes only.
 * This helper checks `__DEV__` to avoid running in production.
 */
export const seedTransactions = async (
  userId: string,
  cardId: string
): Promise<void> => {
  if (!__DEV__) {
    console.warn("seedTransactions is only available in development");
    return;
  }

  const samples: CreateTransactionPayload[] = [
    { amount: 1500, date: new Date("2026-02-01"), name: "Salary", category: "Income", tax: 0 },
    { amount: -120, date: new Date("2026-02-05"), name: "Groceries", category: "Food", tax: 0 },
    { amount: -60, date: new Date("2026-02-10"), name: "Internet", category: "Utilities", tax: 0 },
  ];

  for (const sample of samples) {
    await addTransaction(userId, cardId, sample);
  }
};