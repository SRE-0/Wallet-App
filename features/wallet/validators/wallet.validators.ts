// features/wallet/validators/wallet.validators.ts

import { CreateCardPayload } from "../models/card.model";
import { CreateTransactionPayload } from "../models/transaction.model";

// ─── Limit constants ──────────────────────────────────────────────────────

const LIMITS = {
  MAX_TRANSACTION_AMOUNT: 1_000_000,
  MIN_TRANSACTION_AMOUNT: -1_000_000,
  MAX_NAME_LENGTH: 100,
  MAX_CATEGORY_LENGTH: 50,
  MAX_CARD_NAME_LENGTH: 60,
  MAX_TAX: 100,    // porcentaje máximo
  MIN_TAX: 0,
} as const;

// ─── Internal helpers ────────────────────────────────────────────────────

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === "number" && isFinite(value) && !isNaN(value);

// ─── Firestore ID validator ───────────────────────────────────────────────

/**
 * validateFirestoreId
 *
 * Ensures a Firestore id is a non-empty string and does not contain
 * characters that would break document paths.
 */
export const validateFirestoreId = (id: string, fieldName = "id"): void => {
  if (!isNonEmptyString(id)) {
    throw new Error(`${fieldName} must be a non-empty string`);
  }
  // Previene path traversal: el ID no puede contener barras
  if (id.includes("/")) {
    throw new Error(`${fieldName} contains invalid characters`);
  }
  if (id.length > 128) {
    throw new Error(`${fieldName} exceeds maximum length`);
  }
};

// ─── Transaction validator ───────────────────────────────────────────────

/**
 * validateTransaction
 *
 * Throws descriptive errors when the transaction payload contains
 * out-of-range or malformed values.
 *
 * Parameters:
 * - `payload`: CreateTransactionPayload
 */
export const validateTransaction = (
  payload: CreateTransactionPayload
): void => {
  if (!isFiniteNumber(payload.amount)) {
    throw new Error("Transaction amount must be a finite number");
  }

  if (
    payload.amount > LIMITS.MAX_TRANSACTION_AMOUNT ||
    payload.amount < LIMITS.MIN_TRANSACTION_AMOUNT
  ) {
    throw new Error(
      `Transaction amount must be between ${LIMITS.MIN_TRANSACTION_AMOUNT} and ${LIMITS.MAX_TRANSACTION_AMOUNT}`
    );
  }

  if (payload.amount === 0) {
    throw new Error("Transaction amount cannot be zero");
  }

  if (!isNonEmptyString(payload.name)) {
    throw new Error("Transaction name is required");
  }

  if (payload.name.length > LIMITS.MAX_NAME_LENGTH) {
    throw new Error(`Transaction name cannot exceed ${LIMITS.MAX_NAME_LENGTH} characters`);
  }

  if (!isNonEmptyString(payload.category)) {
    throw new Error("Transaction category is required");
  }

  if (payload.category.length > LIMITS.MAX_CATEGORY_LENGTH) {
    throw new Error(`Category cannot exceed ${LIMITS.MAX_CATEGORY_LENGTH} characters`);
  }

  if (!isFiniteNumber(payload.tax)) {
    throw new Error("Tax must be a finite number");
  }

  if (payload.tax < LIMITS.MIN_TAX || payload.tax > LIMITS.MAX_TAX) {
    throw new Error(`Tax must be between ${LIMITS.MIN_TAX} and ${LIMITS.MAX_TAX}`);
  }

  if (!(payload.date instanceof Date) || isNaN(payload.date.getTime())) {
    throw new Error("Transaction date must be a valid Date");
  }

  // No permite fechas en el futuro (más de 1 día de margen)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (payload.date > tomorrow) {
    throw new Error("Transaction date cannot be in the future");
  }
};

// ─── Card validator ─────────────────────────────────────────────────────

/**
 * validateCard
 *
 * Validates the payload used to create or update a card.
 * Throws an error when required fields are missing or malformed.
 */
export const validateCard = (payload: CreateCardPayload): void => {
  if (!isNonEmptyString(payload.name)) {
    throw new Error("Card name is required");
  }

  if (payload.name.length > LIMITS.MAX_CARD_NAME_LENGTH) {
    throw new Error(
      `Card name cannot exceed ${LIMITS.MAX_CARD_NAME_LENGTH} characters`
    );
  }

  if (!isNonEmptyString(payload.currency)) {
    throw new Error("Card currency is required");
  }

  // ISO 4217: exactamente 3 letras mayúsculas
  if (!/^[A-Z]{3}$/.test(payload.currency)) {
    throw new Error("Currency must be a valid ISO 4217 code (e.g. USD, EUR)");
  }
};