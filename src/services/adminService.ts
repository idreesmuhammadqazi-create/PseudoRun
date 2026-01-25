/**
 * Admin Service
 * Handles admin-specific data fetching operations
 */

import {
  collection,
  getDocs,
  Timestamp,
  query,
  where
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Program } from '../types/program';
import { AdminStats } from '../types/admin';

const PROGRAMS_COLLECTION = 'programs';
const SHARED_CODE_COLLECTION = 'sharedCode';

/**
 * Get all programs (admin only)
 * This function should only be called by admin users
 *
 * @returns Promise<Program[]> - Array of all programs sorted by updatedAt descending
 */
export async function getAllPrograms(): Promise<Program[]> {
  try {
    // Query all programs without userId filter
    const q = collection(db, PROGRAMS_COLLECTION);
    const querySnapshot = await getDocs(q);

    const programs: Program[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      programs.push({
        id: doc.id,
        name: data.name,
        code: data.code,
        userId: data.userId,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
        updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date()
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
 * This function should only be called by admin users
 *
 * @returns Promise<AdminStats> - Object containing various statistics
 */
export async function getStats(): Promise<AdminStats> {
  try {
    // Get all programs
    const programsSnapshot = await getDocs(collection(db, PROGRAMS_COLLECTION));

    // Get all shared code links
    const sharedLinksSnapshot = await getDocs(collection(db, SHARED_CODE_COLLECTION));

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
      const updatedAt = data.updatedAt instanceof Timestamp
        ? data.updatedAt.toDate()
        : new Date();

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
