// services/auth.service.ts
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithCredential,
  updateProfile,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase/config";

// ─────────────────────────────────────────────
// Internal helpers
// ─────────────────────────────────────────────

/**
 * ensureUserDocument
 *
 * Creates the Firestore user document if it does not exist yet.
 * This runs after any successful login method to ensure user data
 * is available in the database.
 */
const ensureUserDocument = async (user: User) => {
  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);

  // Solo crea el doc si es la primera vez que inicia sesión
  if (!snap.exists()) {
    await setDoc(ref, {
      displayName: user.displayName ?? "Usuario",
      email: user.email,
      photoURL: user.photoURL ?? null,
      createdAt: serverTimestamp(),
    });
  }
};

// ─────────────────────────────────────────────
// Email / Password
// ─────────────────────────────────────────────

/**
 * registerWithEmail
 *
 * Registers a new user using email and password, updates the
 * Firebase Auth profile with `displayName`, and creates the
 * related Firestore user document.
 *
 * Parameters:
 * - `email`: user email
 * - `password`: user password
 * - `displayName`: name to set on the user profile
 */
export const registerWithEmail = async (
  email: string,
  password: string,
  displayName: string
) => {
  const credential = await createUserWithEmailAndPassword(auth, email, password);

  // Actualiza el perfil en Firebase Auth con el nombre
  await updateProfile(credential.user, { displayName });

  // Crea el documento en Firestore
  await ensureUserDocument(credential.user);

  return credential.user;
};

/**
 * loginWithEmail
 *
 * Signs in a user using email and password.
 *
 * Returns the authenticated `User`.
 */
export const loginWithEmail = async (email: string, password: string) => {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
};

// ─────────────────────────────────────────────
// Google Sign-In (Expo)
// ─────────────────────────────────────────────

/**
 * loginWithGoogle
 *
 * Signs in a user with a Google `idToken` obtained via
 * `expo-auth-session`. The function exchanges the token for
 * Firebase credentials and ensures the Firestore user doc exists.
 *
 * Parameters:
 * - `idToken`: Google ID token from the client auth flow
 */
export const loginWithGoogle = async (idToken: string) => {
  const credential = GoogleAuthProvider.credential(idToken);
  const result = await signInWithCredential(auth, credential);

  // Crea el doc en Firestore si es la primera vez
  await ensureUserDocument(result.user);

  return result.user;
};

// ─────────────────────────────────────────────
// Sign out
// ─────────────────────────────────────────────

export const logout = async () => {
  await signOut(auth);
};

// ─────────────────────────────────────────────
// Authentication state observer
// ─────────────────────────────────────────────

/**
 * subscribeToAuthState
 *
 * Subscribes to Firebase authentication state changes. Returns the
 * unsubscribe function.
 *
 * Example:
 * const unsub = subscribeToAuthState((user) => setUser(user));
 * // In cleanup: unsub()
 */
export const subscribeToAuthState = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};