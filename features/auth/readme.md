
Data structure (for user)

users/{userId}
  - displayName: string
  - email: string
  - photoURL: string | null
  - createdAt: Timestamp

  cards/{cardId}
    - name: string
    - balance: number
    - totalIncomed: number
    - totalExpend: number
    - currency: string
    - createdAt: Timestamp

    transactions/{transactionId}
      - amount: number
      - date: Timestamp
      - name: string
      - category: string
      - tax: number
      - createdAt: Timestamp