/**
 * Programs Service
 * Handles all Firestore operations for saving/loading programs
 */

import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Program, ProgramCreate, ProgramUpdate } from '../types/program';

const PROGRAMS_COLLECTION = 'programs';

/**
 * Create a new program
 */
export async function createProgram(userId: string, data: ProgramCreate): Promise<string> {
  try {
    const programData = {
      ...data,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, PROGRAMS_COLLECTION), programData);
    return docRef.id;
  } catch (error) {
    console.error('Error creating program:', error);
    throw new Error('Failed to create program');
  }
}

/**
 * Get all programs for a user
 */
export async function getUserPrograms(userId: string): Promise<Program[]> {
  try {
    const q = query(
      collection(db, PROGRAMS_COLLECTION),
      where('userId', '==', userId)
    );

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

    // Sort by updatedAt in JavaScript (newest first)
    programs.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

    return programs;
  } catch (error) {
    console.error('Error getting programs:', error);
    throw new Error('Failed to load programs');
  }
}

/**
 * Get a single program by ID
 */
export async function getProgram(programId: string): Promise<Program | null> {
  try {
    const docRef = doc(db, PROGRAMS_COLLECTION, programId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    const data = docSnap.data();
    return {
      id: docSnap.id,
      name: data.name,
      code: data.code,
      userId: data.userId,
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
      updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date()
    };
  } catch (error) {
    console.error('Error getting program:', error);
    throw new Error('Failed to load program');
  }
}

/**
 * Update a program
 */
export async function updateProgram(
  programId: string,
  updates: ProgramUpdate
): Promise<void> {
  try {
    const docRef = doc(db, PROGRAMS_COLLECTION, programId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating program:', error);
    throw new Error('Failed to update program');
  }
}

/**
 * Delete a program
 */
export async function deleteProgram(programId: string): Promise<void> {
  try {
    const docRef = doc(db, PROGRAMS_COLLECTION, programId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting program:', error);
    throw new Error('Failed to delete program');
  }
}
