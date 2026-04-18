# Firestore Security Rules Setup

The code sharing feature requires updating Firestore security rules to allow authenticated users to create shared links.

## Option 1: Manual Update via Firebase Console (Easiest)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: **pseudorun-2eb3f**
3. Click **Firestore Database** in left sidebar
4. Click **Rules** tab at the top
5. Replace existing rules with the following:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Programs collection - only authenticated users can read/write their own
    match /programs/{programId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }

    // Shared code collection - authenticated users can create, anyone can read
    match /sharedCode/{shareId} {
      // Anyone can read shared code (for viewing shared links)
      allow read: if true;

      // Authenticated users can create shares
      allow create: if request.auth != null;

      // No updates or deletes allowed
      allow update, delete: if false;
    }
  }
}
```

6. Click **Publish** button
7. That's it! The share feature will now work.

## Option 2: Deploy via Firebase CLI

If you have Firebase CLI configured and authenticated:

```bash
cd test
firebase deploy --only firestore:rules
```

## What These Rules Do

- **programs collection**: Users can only access their own saved programs
- **sharedCode collection**:
  - ✅ Anyone can READ shared code (no auth required for viewing shares)
  - ✅ Authenticated users can CREATE shares
  - ❌ No one can UPDATE or DELETE shares (immutable)

This allows students to share code links while keeping the system secure.
