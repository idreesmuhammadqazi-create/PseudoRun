/**
 * Share Service
 * Handles creating and retrieving shareable code links
 */

import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';

const SHARED_CODE_COLLECTION = 'sharedCode';

export interface SharedCode {
  id: string;
  code: string;
  title: string;
  createdAt: Timestamp;
  expiresAt?: Timestamp;
}

/**
 * Generate a short unique ID for sharing
 */
function generateShareId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Create a shareable link for code
 */
export async function shareCode(code: string, title: string = 'Untitled'): Promise<string> {
  try {
    const shareId = generateShareId();

    // Set expiration to 90 days from now
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 90);

    const shareData = {
      code,
      title,
      createdAt: serverTimestamp(),
      expiresAt: Timestamp.fromDate(expirationDate)
    };

    // Use the generated ID as the document ID
    await addDoc(collection(db, SHARED_CODE_COLLECTION), {
      ...shareData,
      shareId
    });

    return shareId;
  } catch (error) {
    console.error('Error creating share link:', error);
    throw new Error('Failed to create share link');
  }
}

/**
 * Get shared code by share ID
 */
export async function getSharedCode(shareId: string): Promise<SharedCode | null> {
  try {
    // Query by shareId field
    const snapshot = await getDocs(
      query(
        collection(db, SHARED_CODE_COLLECTION),
        where('shareId', '==', shareId)
      )
    );

    if (snapshot.empty) {
      return null;
    }

    const docSnap = snapshot.docs[0];
    const data = docSnap.data();

    // Check if expired
    if (data.expiresAt && data.expiresAt.toDate() < new Date()) {
      return null;
    }

    return {
      id: docSnap.id,
      code: data.code,
      title: data.title,
      createdAt: data.createdAt,
      expiresAt: data.expiresAt
    };
  } catch (error) {
    console.error('Error getting shared code:', error);
    return null;
  }
}

/**
 * Get the full shareable URL
 */
export function getShareURL(shareId: string): string {
  const baseUrl = window.location.origin + window.location.pathname;
  return `${baseUrl}?share=${shareId}`;
}
