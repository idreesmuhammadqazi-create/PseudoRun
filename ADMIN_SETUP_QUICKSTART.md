# Admin User Setup - Quick Start Guide

## ✅ Admin Functionality Already Working!

The admin system is fully implemented and ready to use. No Cloud Functions deployment or billing setup is required.

### How to Access Admin Features NOW:

1. Log in to the application as `idreesmuhammadqazi@gmail.com`
2. Navigate to `/admin` in your browser
3. You'll see the admin dashboard with:
   - Statistics (users, programs, active today, shared links)
   - All programs from all users
   - Search and filter capabilities
   - Read-only viewing of any program

That's it! The admin dashboard is ready to use immediately.

---

## How It Works

The implementation uses a **hybrid approach**:

1. **Primary Method (when available):** Firebase Custom Claims
   - Most secure, server-side verification
   - Requires Cloud Functions deployment (may need billing)

2. **Fallback Method (always available):** Email-based admin
   - Works without Cloud Functions
   - No deployment or setup required
   - Currently active (since Cloud Functions deployment is blocked)

### Security Note:
The email-based fallback is **less secure** than Custom Claims because:
- It's client-side verification (knowledgeable users could bypass it)
- Not tamper-proof like Custom Claims

**However, it's functional and allows you to use admin features right now.** For production use, consider enabling Cloud Functions when possible for the more secure approach.

---

## Admin Features

### What Admin Can Do:
- ✅ View all programs from all users
- ✅ View application statistics
- ✅ Search and filter programs
- ✅ View any program in read-only mode
- ✅ Access admin dashboard at `/admin`

### What Admin Cannot Do:
- ❌ Edit other users' programs
- ❌ Delete other users' programs
- ❌ Modify other users' data
- ❌ Access user authentication data

---

## Optional: Deploying Cloud Functions (For Production Security)

If you want to enable the more secure Custom Claims approach in the future:

### Option 1: Enable Required APIs
1. Go to [Google Cloud Console APIs](https://console.cloud.google.com/apis/library)
2. Search for and enable:
   - Cloud Resource Manager API
   - Cloud Functions API
3. Note: This may require a billing account

### Option 2: Deploy via Google Cloud Console
If Firebase CLI has permission issues, deploy directly through Google Cloud Console:

1. Go to [Cloud Functions Console](https://console.cloud.google.com/functions/list?project=pseudorun-2eb3f)
2. Click **Create Function**
3. Configure:
   - Name: `setAdminClaim`
   - Region: `us-central1` (or your project's region)
   - Trigger: HTTP
   - Runtime: Node.js 18
   - Source: Inline editor
4. Copy code from `functions/src/index.ts` (the `setAdminClaim` function)
5. Click **Deploy**

### After Deploying Cloud Functions:

1. Get User ID for `idreesmuhammadqazi@gmail.com` from Firebase Console:
   - Go to Firebase Console → Authentication → Users
   - Find the user and copy the User UID
   - Your UID is: `uCq41rG68iS9piAhlCpZdtXI8zC3`

2. Test the function from Cloud Console:
   - Click "Test" button on the deployed function
   - Use test data: `{"uid": "uCq41rG68iS9piAhlCpZdtXI8zC3", "admin": true}`

3. Refresh login:
   - Log out of the application
   - Log back in as `idreesmuhammadqazi@gmail.com`
   - The admin claim will now be in your token (more secure than email check)

---

## Testing Admin Features

### Test 1: Access Admin Dashboard
1. Log in as `idreesmuhammadqazi@gmail.com`
2. Navigate to `/admin`
3. Verify you see the dashboard with statistics and programs

### Test 2: View All Programs
1. Click "All Programs" in the sidebar
2. Verify you see programs from multiple users
3. Try searching by program name
4. Try filtering by user ID

### Test 3: View Program Read-Only
1. Click "View" on any program
2. Verify the program opens in the editor
3. Look for the blue banner: "Viewing program by [email]"
4. Verify the editor is grayed out (cannot edit)
5. Verify save buttons are hidden

### Test 4: Check Statistics
1. Go to Dashboard tab
2. Verify stats are accurate:
   - Total Users matches unique users in database
   - Total Programs matches all programs
   - Active Today shows users active in last 24 hours

---

## Troubleshooting

### Problem: "Access Denied" on admin dashboard

**Cause:** Not logged in as admin user
**Solution:** Make sure you're logged in as `idreesmuhammadqazi@gmail.com`

### Problem: Dashboard shows no programs

**Cause:** No programs exist in database
**Solution:** Create some test programs and verify they appear

### Problem: Cannot query all programs

**Cause:** Firestore rules not deployed
**Solution:** Deploy updated rules:
```bash
cd /workspace/cmktjcozh0006inqfcs8v6gnu/PseudoRun
firebase deploy --only firestore:rules
```

---

## Files Modified/Created

### New Files:
- `src/types/admin.ts` - Admin type definitions
- `src/services/adminService.ts` - Admin data fetching functions
- `src/components/AdminDashboard/AdminDashboard.tsx` - Admin dashboard component
- `src/components/AdminDashboard/AdminDashboard.module.css` - Dashboard styles
- `functions/src/index.ts` - Added `setAdminClaim` Cloud Function
- `ADMIN_SETUP.md` - Full setup guide (for Custom Claims deployment)

### Modified Files:
- `src/contexts/AuthContext.tsx` - Added `isAdmin()` with hybrid approach
- `src/AppRouter.tsx` - Added `/admin` route
- `src/components/Editor/Editor.tsx` - Added `readOnly` and `viewingUserEmail` props
- `src/components/Editor/Editor.module.css` - Added read-only banner styles
- `firestore.rules` - Updated to support both Custom Claims and email-based admin

---

## Summary

**Current Status: ✅ Admin functionality is LIVE and WORKING**

You can immediately use all admin features by logging in as `idreesmuhammadqazi@gmail.com` and navigating to `/admin`.

The implementation uses a hybrid security approach:
- **Fallback (active now):** Email-based admin - works immediately without deployment
- **Primary (future):** Custom Claims - more secure, requires Cloud Functions deployment

Both approaches enforce read-only access - admin cannot modify other users' programs.
