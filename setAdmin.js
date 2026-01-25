/**
 * Set Admin Claim Script
 * Use this script to set admin claim without deploying Cloud Functions
 *
 * Usage: node setAdmin.js <USER_UID> <true|false>
 */

const admin = require('firebase-admin');
const serviceAccount = require('./service-account-key.json'); // You'll need to provide this

try {
  // Initialize with service account
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

  // Get UID from command line
  const uid = process.argv[2];
  const isAdmin = process.argv[3] === 'true';

  if (!uid) {
    console.error('Please provide user UID as second argument');
    process.exit(1);
  }

  // Set custom claims
  const claims = { admin: isAdmin };
  await admin.auth().setCustomUserClaims(uid, claims);

  console.log(`✅ Success! ${isAdmin ? 'Granted' : 'Revoked'} admin claim for user ${uid}`);
  console.log('User must log out and log back in to refresh token.');
} catch (error) {
  console.error('❌ Error setting admin claim:', error);
  process.exit(1);
}
