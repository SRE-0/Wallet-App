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
 * This runs after any successful login method to guarantee user data
 * is available in the database regardless of which auth method was used.
 *
 * This also acts as a safety net for users whose document may have
 * failed to create during a previous registration attempt.
 *
 * @param user - Authenticated Firebase User object
 */
const ensureUserDocument = async (user: User): Promise<void> => {
  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);

  // Only creates the document on first login — never overwrites existing data
  if (!snap.exists()) {
    await setDoc(ref, {
      displayName: user.displayName ?? "User",
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
 * @param email - User email address
 * @param password - User password (minimum 6 characters)
 * @param displayName - Name to set on the Firebase Auth profile
 * @returns The authenticated Firebase User object
 */
export const registerWithEmail = async (
  email: string,
  password: string,
  displayName: string
): Promise<User> => {
  const credential = await createUserWithEmailAndPassword(auth, email, password);

  // Update Firebase Auth profile with the provided display name
  await updateProfile(credential.user, { displayName });

  // Create the Firestore user document after profile is updated
  await ensureUserDocument(credential.user);

  return credential.user;
};

/**
 * loginWithEmail
 *
 * Signs in an existing user using email and password.
 * Also ensures the Firestore user document exists as a safety net —
 * this handles users created via other auth methods or cases where
 * the document creation failed during a previous registration.
 *
 * Not calling ensureUserDocument here was the root cause of the
 * "unknown error" that appeared after login: the app was trying
 * to read a Firestore document that did not exist.
 *
 * @param email - User email address
 * @param password - User password
 * @returns The authenticated Firebase User object
 */
export const loginWithEmail = async (
  email: string,
  password: string
): Promise<User> => {
  const credential = await signInWithEmailAndPassword(auth, email, password);

  // Ensure the Firestore document exists — this was missing before and
  // caused downstream reads to fail silently after a successful login
  await ensureUserDocument(credential.user);

  return credential.user;
};

// ─────────────────────────────────────────────
// Google Sign-In (Expo)
// ─────────────────────────────────────────────

/**
 * loginWithGoogle
 *
 * Signs in a user with a Google `idToken` obtained via
 * `expo-auth-session`. Exchanges the token for Firebase credentials
 * and ensures the Firestore user document exists.
 *
 * @param idToken - Google ID token returned from the client auth flow
 * @returns The authenticated Firebase User object
 */
export const loginWithGoogle = async (idToken: string): Promise<User> => {
  const googleCredential = GoogleAuthProvider.credential(idToken);
  const result = await signInWithCredential(auth, googleCredential);

  // Create the Firestore doc if this is the user's first Google login
  await ensureUserDocument(result.user);

  return result.user;
};

// ─────────────────────────────────────────────
// Sign out
// ─────────────────────────────────────────────

/**
 * logout
 *
 * Signs out the currently authenticated user from Firebase Auth.
 * Clears the local auth session.
 */
export const logout = async (): Promise<void> => {
  await signOut(auth);
};

// ─────────────────────────────────────────────
// Authentication state observer
// ─────────────────────────────────────────────

/**
 * subscribeToAuthState
 *
 * Subscribes to Firebase authentication state changes.
 * Returns the unsubscribe function to be called on cleanup.
 *
 * @param callback - Function called with the current User or null
 * @returns Unsubscribe function
 *
 * Example:
 * const unsub = subscribeToAuthState((user) => setUser(user));
 * // On cleanup: unsub()
 */
export const subscribeToAuthState = (
  callback: (user: User | null) => void
): (() => void) => {
  return onAuthStateChanged(auth, callback);
};