/**
 * Represents a financial card inside a user.
 * 
 * Path:
 * users/{userId}/cards/{cardId}
 * 
 * Each card maintains its own balance and transaction totals.
 */
export interface Card {
  id: string;            // Firestore document ID
  name: string;          // Card name (ex: "American 1")
  balance: number;       // Current balance of the card
  totalExpend: number;   // Total expenses accumulated
  totalIncomed: number;  // Total income accumulated
}
