/**
 * Set Admin Claim Script
 * Run this from inside the functions/ directory:
 *
 *   cd functions
 *   node setAdmin.js <USER_UID> <true|false>
 *
 * Requires service-account-key.json in the functions/ directory.
 * Download from: Firebase Console > Project Settings > Service Accounts > Generate new private key
 */

const admin = require('firebase-admin');
const serviceAccount = require('./service-account-key.json');

const uid = process.argv[2];
const isAdmin = process.argv[3] === 'true';

if (!uid) {
  console.error('Please provide user UID as second argument');
  process.exit(1);
}

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

admin.auth().setCustomUserClaims(uid, { admin: isAdmin })
  .then(() => {
    console.log(`✅ Success! ${isAdmin ? 'Granted' : 'Revoked'} admin claim for user ${uid}`);
    console.log('User must log out and log back in to refresh token.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error setting admin claim:', error);
    process.exit(1);
  });
