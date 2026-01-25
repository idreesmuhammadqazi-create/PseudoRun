/**
 * Firebase Cloud Functions
 */

import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

admin.initializeApp();

/**
 * Set admin claim on a user
 * This function can be called to grant admin privileges to a user
 *
 * Request body: { uid: string, admin: boolean }
 * Returns: { success: boolean, message: string }
 */
export const setAdminClaim = functions.https.onCall(async (data, context) => {
  // Check if the caller is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'You must be authenticated to set admin claims'
    );
  }

  const { uid, admin: isAdmin } = data;

  // Validate input
  if (!uid || typeof isAdmin !== 'boolean') {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Invalid arguments: uid and admin boolean are required'
    );
  }

  try {
    // Set the custom claim
    const claims = { admin: isAdmin };
    await admin.auth().setCustomUserClaims(uid, claims);

    return {
      success: true,
      message: isAdmin
        ? `Admin claim granted to user ${uid}`
        : `Admin claim revoked from user ${uid}`
    };
  } catch (error: any) {
    console.error('Error setting admin claim:', error);
    throw new functions.https.HttpsError(
      'internal',
      `Failed to set admin claim: ${error.message}`
    );
  }
});
