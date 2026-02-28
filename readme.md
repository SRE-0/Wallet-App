


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

Project Structure
- components
- assets
- constants
- hooks
- screens
    - main.tsx   
- features
    - auth
        - hooks
        - screens
        - services
    - transaction
        - screens
    - wallet
        - hooks
        - screens
        - services
        - repositories
        - validators
        - models


para usar una compilacion web de github, debes usar "/Wallet-App/index.js"

despues de ejecutar 
    npm run build  

luego ejecuta 
    npm run deploy  