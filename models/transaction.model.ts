/**
 * Represents a financial transaction inside a card.
 * 
 * Each transaction belongs to:
 * users/{userId}/cards/{cardId}/transactions/{transactionId}
 * 
 * This model is shared across the application to ensure
 * consistent typing and predictable data structure.
 */
export interface Transaction {
  id: string;        // Firestore document ID
  amount: number;    // Transaction amount (positive for income, negative for expense)
  date: Date;        // Transaction date
  name: string;      // Description of the transaction
  category: string;  // Category label (Food, Salary, etc.)
  tax: number;       // Tax amount applied to the transaction
}
