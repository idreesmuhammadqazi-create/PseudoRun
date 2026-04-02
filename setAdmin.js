/**
 * Set Admin Claim Script
 * Use this script to set admin claim without deploying Cloud Functions
 *
 * Usage: node setAdmin.js <USER_UID> <true|false>
 */

import { createRequire } from 'module';
import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const require = createRequire(import.meta.url);
const serviceAccount = require('./service-account-key.json');

const uid = process.argv[2];
const isAdmin = process.argv[3] === 'true';

if (!uid) {
  console.error('Please provide user UID as second argument');
  process.exit(1);
}

initializeApp({ credential: cert(serviceAccount) });

try {
  await getAuth().setCustomUserClaims(uid, { admin: isAdmin });
  console.log(`✅ Success! ${isAdmin ? 'Granted' : 'Revoked'} admin claim for user ${uid}`);
  console.log('User must log out and log back in to refresh token.');
} catch (error) {
  console.error('❌ Error setting admin claim:', error);
  process.exit(1);
}
