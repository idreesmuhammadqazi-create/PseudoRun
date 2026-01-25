# Admin User Setup Guide

This guide explains how to configure `idreesmuhammadqazi@gmail.com` as an admin user who can view all programs and access the admin dashboard.

## Prerequisites

- Firebase project access with Admin privileges
- Node.js and npm installed
- Firebase CLI installed (`npm install -g firebase-tools`)
- User `idreesmuhammadqazi@gmail.com` must have already created an account in the application

## Overview

The admin system uses Firebase Custom Claims to grant elevated privileges. This is a secure, server-side method that cannot be manipulated from the client.

### What the admin can do:
- View all programs from all users
- View application statistics (total users, programs, active users, shared links)
- Search and filter programs
- View programs in read-only mode

### What the admin cannot do:
- Edit or delete other users' programs
- Modify other users' data
- Access other users' authentication information

## Step 1: Deploy Cloud Functions

The Cloud Function `setAdminClaim` is needed to set admin privileges on user accounts.

```bash
# Navigate to the functions directory
cd /workspace/cmktjcozh0006inqfcs8v6gnu/PseudoRun

# Install dependencies (if not already installed)
cd functions
npm install
cd ..

# Deploy the Cloud Functions
firebase deploy --only functions
```

Expected output:
```
✔ functions: Finished running predeploy script.
✔ functions: setAdminClaim(iam-admin-us-central1) successful [3.452s]
```

## Step 2: Get User ID

You need the Firebase User ID (UID) for `idreesmuhammadqazi@gmail.com`.

### Option A: Via Firebase Console (Recommended)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Authentication** → **Users**
4. Find the user with email `idreesmuhammadqazi@gmail.com`
5. Click on the user to view details
6. Copy the **User UID** (it looks like: `abc123xyz789def456...`)

### Option B: Via Firebase CLI

```bash
firebase auth:list
```

Find the user with the target email and copy their UID.

## Step 3: Set Admin Claim

Now call the Cloud Function to grant admin privileges to the user.

### Using Firebase Functions Shell (Recommended for Testing)

```bash
firebase functions:shell
```

Once in the shell, run:

```javascript
setAdminClaim({ uid: 'USER_UID_FROM_STEP_2', admin: true })
```

Replace `USER_UID_FROM_STEP_2` with the actual UID you copied.

Expected response:
```json
{
  "success": true,
  "message": "Admin claim granted to user abc123xyz789..."
}
```

Type `exit` to leave the shell.

---

## Alternative: If Cloud Function Deployment Fails

If you encounter deployment permission errors (like HTTP 403), try these solutions:

### Fix 1: Enable Required APIs

1. Go to [Google Cloud Console APIs](https://console.cloud.google.com/apis/library)
2. Search for and enable:
   - Cloud Resource Manager API
   - Cloud Functions API
3. Retry deployment with `firebase deploy --only functions`

### Fix 2: Re-authenticate with Firebase

```bash
firebase logout
firebase login
```

Make sure you're logging in with the Google account that has project ownership.

### Fix 3: Use Google Cloud Console Directly

If Cloud Functions deployment continues to fail, you can set admin claim manually:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **Cloud Functions** → **Overview**
3. Click **Create Function** (or use existing if deployed)
4. Configure:
   - Name: `setAdminClaim`
   - Trigger: HTTP
   - Runtime: Node.js 18
   - Source: Upload the code from `functions/src/index.ts`
5. In the code tab, paste the `setAdminClaim` function code
6. Deploy

Then test the function via the Cloud Console test button.

### Using HTTPS Call (Production)

You can also call the function via HTTP:

```bash
curl -X POST \
  https://YOUR_REGION-YOUR_PROJECT_ID.cloudfunctions.net/setAdminClaim \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ID_TOKEN" \
  -d '{"uid": "USER_UID", "admin": true}'
```

Replace:
- `YOUR_REGION`: The region where your functions are deployed (e.g., `us-central1`)
- `YOUR_PROJECT_ID`: Your Firebase project ID
- `YOUR_ID_TOKEN`: A valid Firebase ID token for an authenticated user
- `USER_UID`: The user's UID from Step 2

## Step 4: User Login

After setting the admin claim, the user must log out and log back in to receive a new token with the admin claim.

1. Have the user log out of the application
2. Have the user log back in with their email and password or Google sign-in
3. The new token will include the admin claim

## Step 5: Verify Admin Access

### Verify in Application

1. Log in as `idreesmuhammadqazi@gmail.com`
2. Navigate to `/admin` in your browser
3. You should see the Admin Dashboard with:
   - Stats cards showing user and program counts
   - Recent programs list
   - Navigation sidebar

If you see "Access Denied", the admin claim was not properly set or the token hasn't refreshed.

### Verify via Firebase Console

1. Go to Firebase Console → Authentication → Users
2. Click on `idreesmuhammadqazi@gmail.com`
3. You won't see custom claims in the console (they're only in tokens)
4. The admin claim is verified when the dashboard loads successfully

## Testing the Admin Features

### Test 1: View All Programs

1. Navigate to the Admin Dashboard (`/admin`)
2. Click on "All Programs" in the sidebar
3. You should see programs from multiple users
4. Try searching by program name
5. Try filtering by user ID

### Test 2: View Program Read-Only

1. Click "View" on any program
2. The program should open in the editor
3. You should see a blue banner: "Viewing program by [user email]"
4. The editor should be grayed out (read-only mode)
5. You should NOT be able to edit the code
6. Save/Rename/Delete buttons should be hidden

### Test 3: Check Stats

1. Go to the Dashboard tab
2. Verify the stats numbers:
   - Total Users: Number of unique users with programs
   - Total Programs: Total number of programs created
   - Active Today: Users who updated programs in the last 24 hours
   - Shared Links: Total number of shared code links

## Troubleshooting

### Problem: "Access Denied" message

**Cause 1:** Admin claim not set
- **Solution:** Re-run the `setAdminClaim` function and verify the response

**Cause 2:** Token not refreshed
- **Solution:** User must log out and log back in to get a new token with the admin claim

**Cause 3:** Wrong user UID
- **Solution:** Double-check you're using the correct UID from Firebase Console

### Problem: Dashboard loads but shows no programs

**Cause 1:** No programs in database
- **Solution:** Create some test programs and verify they appear

**Cause 2:** Firestore rules not updated
- **Solution:** Deploy the updated Firestore rules:
  ```bash
  firebase deploy --only firestore:rules
  ```

### Problem: Can still edit other users' programs

**Cause:** Editor not properly configured for read-only mode
- **Solution:** Verify the `readOnly` prop is being passed to the Editor component when viewing other users' programs

### Problem: Cloud Function deployment fails

**Cause 1:** Functions not initialized
- **Solution:** Run `firebase init functions` and follow the prompts

**Cause 2:** Billing account not set up
- **Solution:** While Custom Claims are free, Cloud Functions require the Blaze plan. Firebase offers a free tier with generous limits.

**Cause 3:** Region issues
- **Solution:** Check your project region matches the function region in your project settings

## Security Notes

### Why Custom Claims?

Firebase Custom Claims are the recommended approach for RBAC because:
- **Server-side control:** Claims are set by Cloud Functions (server-side), not by client code
- **Token-based:** Claims are embedded in the user's ID token, making them tamper-proof
- **Firestore integration:** Security rules can directly check claims (`request.auth.token.admin`)
- **Automatic expiration:** Claims are refreshed when the user re-authenticates

### Current Implementation

The implementation includes:
- Admin check in `AuthContext.tsx` using `getIdTokenResult()`
- Firestore rules allowing admin read access via `request.auth.token.admin == true`
- Admin dashboard with read-only program viewing
- Cloud Function to set admin claims securely

### Security Limitations

The current implementation provides:
- ✅ Secure admin verification via Firebase Custom Claims
- ✅ Firestore rules enforce read-only access for admins
- ✅ Admin cannot modify other users' programs
- ✅ Admin cannot access user authentication data

## Removing Admin Privileges

To revoke admin privileges from a user:

```javascript
// In Firebase Functions Shell
setAdminClaim({ uid: 'USER_UID', admin: false })
```

The user must log out and log back in to refresh their token.

## Adding More Admins

To grant admin privileges to additional users:

1. Get the new user's UID from Firebase Console
2. Call the `setAdminClaim` function with their UID
3. Have them log out and log back in

## Next Steps

After setting up the admin:

1. **Customize the dashboard:** Add more stats or features as needed
2. **Add user email display:** Currently shows userId - consider using Firebase Admin SDK to fetch user emails
3. **Implement audit logging:** Track admin actions for compliance
4. **Add admin notifications:** Send alerts when suspicious activity occurs

## Support

If you encounter issues:

1. Check the Firebase Console Cloud Functions logs for errors
2. Verify Firestore rules are deployed: `firebase deploy --only firestore:rules`
3. Verify the user UID is correct
4. Ensure the user has re-authenticated after the claim was set
5. Check browser console for JavaScript errors

## Files Modified/Created

### New Files
- `src/types/admin.ts` - Admin type definitions
- `src/services/adminService.ts` - Admin data fetching functions
- `src/components/AdminDashboard/AdminDashboard.tsx` - Admin dashboard component
- `src/components/AdminDashboard/AdminDashboard.module.css` - Dashboard styles
- `functions/src/index.ts` - Added `setAdminClaim` Cloud Function
- `ADMIN_SETUP.md` - This setup guide

### Modified Files
- `src/contexts/AuthContext.tsx` - Added `isAdmin()` function
- `src/AppRouter.tsx` - Added `/admin` route
- `src/components/Editor/Editor.tsx` - Added `readOnly` and `viewingUserEmail` props
- `src/components/Editor/Editor.module.css` - Added read-only banner styles
- `firestore.rules` - Updated to allow admin read access

## Summary

After completing these steps, `idreesmuhammadqazi@gmail.com` will be able to:
- Access the admin dashboard at `/admin`
- View all programs from all users
- View application statistics
- View programs in read-only mode

The implementation uses Firebase Custom Claims for secure, server-side admin verification with Firestore rules enforcing read-only access.
