/**
 * Admin Service using Firebase Admin SDK
 * Uses Firebase Admin SDK with API key for full access
 * Bypasses Firestore rules and works without Cloud Functions deployment
 */

import * as admin from 'firebase-admin';
import { Program } from '../types/program';
import { AdminStats } from '../types/admin';

const adminApp = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = adminApp.firestore();
const auth = adminApp.auth();

const PROGRAMS_COLLECTION = 'programs';
const SHARED_CODE_COLLECTION = 'sharedCode';

/**
 * Get all programs (admin only)
 * Uses Firebase Admin SDK - bypasses Firestore rules
 * @returns Promise<Program[]> - Array of all programs sorted by updatedAt descending
 */
export async function getAllProgramsSDK(): Promise<Program[]> {
  try {
    const snapshot = await db.collection(PROGRAMS_COLLECTION).get();

    const programs: Program[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      programs.push({
        id: doc.id,
        name: data.name,
        code: data.code,
        userId: data.userId,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date()
      });
    });

    // Sort by updatedAt descending (newest first)
    programs.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

    return programs;
  } catch (error) {
    console.error('Error getting all programs:', error);
    throw new Error('Failed to load programs');
  }
}

/**
 * Get admin statistics
 * Uses Firebase Admin SDK - bypasses Firestore rules
 * @returns Promise<AdminStats> - Object containing various statistics
 */
export async function getStatsSDK(): Promise<AdminStats> {
  try {
    // Get all programs
    const programsSnapshot = await db.collection(PROGRAMS_COLLECTION).get();

    // Get all shared code links
    const sharedLinksSnapshot = await db.collection(SHARED_CODE_COLLECTION).get();

    // Calculate total users (unique userIds)
    const uniqueUserIds = new Set<string>();
    const usersActiveToday = new Set<string>();
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    programsSnapshot.forEach((doc) => {
      const data = doc.data();
      const userId = data.userId;

      // Add to unique users
      uniqueUserIds.add(userId);

      // Check if active today (updated in last 24 hours)
      const updatedAt = data.updatedAt?.toDate() || new Date();
      if (updatedAt > twentyFourHoursAgo) {
        usersActiveToday.add(userId);
      }
    });

    const stats: AdminStats = {
      totalUsers: uniqueUserIds.size,
      totalPrograms: programsSnapshot.size,
      activeUsersToday: usersActiveToday.size,
      totalSharedLinks: sharedLinksSnapshot.size
    };

    return stats;
  } catch (error) {
    console.error('Error getting admin stats:', error);
    throw new Error('Failed to load statistics');
  }
}

/**
 * Get user email by UID (uses Firebase Admin SDK)
 * @param uid - User ID
 * @returns Promise<string | null> - User email or null
 */
export async function getUserEmail(uid: string): Promise<string | null> {
  try {
    const userRecord = await auth.getUser(uid);
    return userRecord.email || null;
  } catch (error) {
    console.error('Error getting user email:', error);
    return null;
  }
}
