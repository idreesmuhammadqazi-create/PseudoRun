/**
 * User Profile Service
 * Persists a lightweight user profile to Firestore so admin can resolve emails/names.
 * Called automatically from AuthContext - no user action needed.
 */
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import type { User } from 'firebase/auth';
import { db } from '../config/firebase';

export async function ensureUserProfile(user: User): Promise<void> {
  try {
    await setDoc(
      doc(db, 'users', user.uid),
      {
        uid: user.uid,
        email: user.email ?? null,
        displayName: user.displayName ?? null,
        photoURL: user.photoURL ?? null,
        emailVerified: user.emailVerified,
        providerId: user.providerData[0]?.providerId ?? 'unknown',
        lastLoginAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      },
      { merge: true }
    );
  } catch (e) {
    // non-blocking - log but don't break auth flow
    console.warn('ensureUserProfile failed', e);
  }
}
