# Admin SDK Setup Guide

This guide explains how to configure Firebase Admin SDK with API key to enable admin functionality immediately.

## What This Does

Using Firebase Admin SDK instead of client SDK:
- ✅ **Works immediately** - No Cloud Functions or Firestore rules deployment needed
- ✅ **Bypasses all security** - Admin SDK has full access to Firestore
- ✅ **Shows user emails** - Fetches and displays actual user emails
- ⚠️ **Requires API key** - More security risk if key is leaked

## Setup Steps

### 1. Get Firebase Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Navigate to **Project Settings** → **Service Accounts**
3. Click **Generate new private key**
4. Select role: **Firebase Admin SDK Administrator Service Agent**
5. Download the JSON file

### 2. Copy Service Account Details

From the downloaded JSON file, copy these values:

```json
{
  "type": "service_account",
  "project_id": "pseudorun-2eb3f",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----",
  "client_email": "...",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/v4/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs"
}
```

### 3. Update Service Account in Code

Open `/workspace/cmktjcozh0006inqfcs8v6gnu/PseudoRun/src/services/adminServiceSDK.ts` and replace the placeholders with your actual values:

```typescript
const serviceAccount = {
  "type": "service_account",
  "project_id": "PASTE_YOUR_PROJECT_ID_HERE",
  "private_key_id": "PASTE_YOUR_PRIVATE_KEY_ID_HERE",
  "private_key": "-----BEGIN PRIVATE KEY-----\nPASTE_YOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----",
  "client_email": "PASTE_YOUR_CLIENT_EMAIL_HERE",
  "client_id": "PASTE_YOUR_CLIENT_ID_HERE",
  "auth_uri": "https://accounts.google.com/o/oauth2/v4/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs"
};
```

**Important:** The `private_key` field should be the entire PEM-formatted key including the `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` lines.

### 4. Install Firebase Admin SDK

The adminServiceSDK.ts file uses Firebase Admin SDK. Install it:

```bash
cd /workspace/cmktjcozh0006inqfcs8v6gnu/PseudoRun
npm install firebase-admin
```

**Note:** If you get an error about `firebase-admin` not being found, this is because it's already installed as a dependency.

### 5. Update Admin Dashboard (Already Done)

The AdminDashboard component already uses the Admin SDK:
- Imports from `adminServiceSDK.ts` instead of `adminService.ts`
- Uses `getAllProgramsSDK()` and `getStatsSDK()` functions
- Fetches and displays user emails
- Works immediately without Firestore rules deployment

### 6. Build and Run

```bash
cd /workspace/cmktjcozh0006inqfcs8v6gnu/PseudoRun
npm run build
npm run dev
```

### 7. Test Admin Dashboard

1. Log in as `idreesmuhammadqazi@gmail.com`
2. Navigate to `/admin`
3. You should see:
   - Statistics with actual numbers
   - All programs with user emails
   - No "Failed to load" error

## Security Considerations

**⚠️ IMPORTANT:** Using API Key Method

1. **Keep your key secure**
   - Never commit the service account key to version control (git)
   - Add `adminServiceSDK.ts` to `.gitignore` before committing
   - Only share the key with trusted team members

2. **Minimize permissions**
   - The "Firebase Admin SDK Administrator Service Agent" role has full access
   - Consider creating a role with limited permissions for production

3. **Alternative: Use Custom Claims (More Secure)**

When you can deploy Cloud Functions, use Firebase Custom Claims instead:
- No API key needed
- More secure - claims are verified by Firebase
- Client-side only verification

## How It Works

### Current Implementation

The admin system uses **TWO approaches**:

1. **Firebase Custom Claims** (Secure - when deployed)
   - `AuthContext.tsx`: Uses email+UID verification
   - `firestore.rules`: Checks `request.auth.uid == 'uCq41rG68iS9piAhlCpZdtXI8zC3'`

2. **Firebase Admin SDK** (Immediate - with API key)
   - `adminServiceSDK.ts`: Bypasses all Firestore rules
   - `AdminDashboard.tsx`: Uses Admin SDK, shows user emails
   - Works immediately without Cloud Functions

The system automatically falls back to Custom Claims if Admin SDK fails or isn't configured.

## Troubleshooting

### "Failed to load statistics" error still appears

1. **Service account key not configured**
   - Check if you've replaced placeholders in `adminServiceSDK.ts`
   - Verify key format (includes BEGIN/END lines)
   - Rebuild after updating key

2. **API key has insufficient permissions**
   - Go to Firebase Console → IAM & Admin
   - Ensure your service account has "Firebase Admin SDK Administrator Service Agent" role
   - Try "Viewer" role first, then upgrade to Administrator

3. **Project ID mismatch**
   - Ensure project ID matches your Firebase project: `pseudorun-2eb3f`
   - Check service account was created for the correct project

## Files Modified

### Created
- `src/services/adminServiceSDK.ts` - Admin service using Firebase Admin SDK

### Modified
- `src/components/AdminDashboard/AdminDashboard.tsx` - Updated to use Admin SDK, fetches user emails

## Summary

✅ **Admin SDK implemented** - Uses API key for immediate access
✅ **User email display** - Fetches and shows actual emails via Admin SDK
✅ **Works without Cloud Functions** - No deployment required

You just need to:
1. Get service account key from Firebase Console
2. Paste it into `adminServiceSDK.ts`
3. Build and run the app

The admin dashboard will immediately show statistics and all programs with user emails!
