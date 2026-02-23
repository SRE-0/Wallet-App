// features/wallet/models/transaction.model.ts

export interface Transaction {
  id: string;
  amount: number;
  date: Date;
  name: string;
  category: string;
  tax: number;
  createdAt: Date;
}

/**
 * CreateTransactionPayload
 *
 * Payload used to create a new `Transaction`.
 * Does not include `id` or `createdAt` fields which are generated
 * by the server when the document is created.
 *
 * Fields:
 * - `amount`: number - Positive for income, negative for expense
 * - `date`: Date - When the transaction occurred
 * - `name`: string - Short description
 * - `category`: string - Transaction category
 * - `tax`: number - Tax percentage or fixed amount depending on app logic
 */
export type CreateTransactionPayload = Omit<Transaction, "id" | "createdAt">;