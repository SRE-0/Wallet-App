// hooks/useAuth.ts
import { useEffect, useState } from "react";
import { User } from "firebase/auth";
import { subscribeToAuthState } from "../services/auth.service";

/**
 * useAuth
 *
 * Hook that exposes the currently authenticated Firebase `User`.
 * Use this hook from top-level components to read authentication
 * state and react to changes.
 *
 * Returns an object with:
 * - `user`: `User | null` — the current Firebase user or `null` if unauthenticated
 * - `loading`: `boolean` — true while the hook is resolving the saved session
 */
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscribe to Firebase auth state changes. The service handles
    // reading persisted session data on startup.
    const unsubscribe = subscribeToAuthState((firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { user, loading };
};