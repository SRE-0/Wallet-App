// features/wallet/models/card.model.ts

export interface Card {
  id: string;
  name: string;
  balance: number;
  totalExpend: number;
  totalIncomed: number;
  currency: string;
  createdAt: Date;
}

/**
 * CreateCardPayload
 *
 * Payload used to create a new `Card`.
 * Does not include `id` or server-generated fields.
 *
 * Fields:
 * - `name`: string - Display name for the card
 * - `currency`: string - ISO currency code (e.g. USD)
 */
export type CreateCardPayload = Pick<Card, "name" | "currency">;