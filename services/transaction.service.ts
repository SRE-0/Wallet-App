/**
 * Handles all Firestore operations related to card transactions.
 * 
 * New structure:
 * users/{userId}/cards/{cardId}/transactions/{transactionId}
 * 
 * This file abstracts all database logic from UI components.
 */

import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  Timestamp,
  doc,
  updateDoc,
  increment
} from "firebase/firestore";

import { db } from "../firebase/config";
import { Transaction } from "../models/transaction.model";

/**
 * Adds a transaction to a specific card.
 * 
 * Automatically updates:
 * - card balance
 * - totalExpend
 * - totalIncomed
 * 
 * @param userId - Authenticated user ID
 * @param cardId - Card where transaction will be stored
 * @param transaction - Transaction data without ID
 */
export const addTransaction = async (
  userId: string,
  cardId: string,
  transaction: Omit<Transaction, "id">
) => {

  const transactionRef = collection(
    db,
    "users",
    userId,
    "cards",
    cardId,
    "transactions"
  );

  // Add transaction document
  await addDoc(transactionRef, {
    ...transaction,
    date: Timestamp.fromDate(transaction.date),
    createdAt: Timestamp.now(),
  });

  const cardRef = doc(db, "users", userId, "cards", cardId);

  const isIncome = transaction.amount > 0;

  // Update card totals atomically
  await updateDoc(cardRef, {
    balance: increment(transaction.amount),
    totalIncomed: isIncome ? increment(transaction.amount) : increment(0),
    totalExpend: !isIncome ? increment(Math.abs(transaction.amount)) : increment(0),
  });
};

/**
 * Subscribes to real-time transaction updates of a specific card.
 * 
 * @param userId - Authenticated user ID
 * @param cardId - Card ID
 * @param callback - Triggered whenever data changes
 * @returns Unsubscribe function
 */
export const subscribeToTransactions = (
  userId: string,
  cardId: string,
  callback: (transactions: Transaction[]) => void
) => {

  const ref = collection(
    db,
    "users",
    userId,
    "cards",
    cardId,
    "transactions"
  );

  const q = query(ref, orderBy("date", "desc"));

  return onSnapshot(q, (snapshot) => {
    const transactions = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date.toDate(),
    })) as Transaction[];

    callback(transactions);
  });
};

/**
 * Seeds sample transactions inside a specific card.
 * Used only for development testing.
 * 
 * @param userId - Authenticated user ID
 * @param cardId - Card ID
 */
export const seedTransactions = async (
  userId: string,
  cardId: string
) => {

  const sampleTransactions = [
    {
      amount: 1500,
      date: new Date("2026-02-01"),
      name: "Salary",
      category: "Income",
      tax: 0,
    },
    {
      amount: -120,
      date: new Date("2026-02-05"),
      name: "Groceries",
      category: "Food",
      tax: 0,
    },
    {
      amount: -60,
      date: new Date("2026-02-10"),
      name: "Internet",
      category: "Utilities",
      tax: 0,
    },
  ];

  for (const trx of sampleTransactions) {
    await addTransaction(userId, cardId, trx);
  }
};
