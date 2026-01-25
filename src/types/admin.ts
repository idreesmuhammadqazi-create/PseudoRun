/**
 * Admin Type Definitions
 * Types for admin functionality and statistics
 */

import { Program } from './program';

export interface AdminStats {
  totalUsers: number;
  totalPrograms: number;
  activeUsersToday: number;
  totalSharedLinks: number;
}

export interface AdminProgram extends Program {
  userEmail?: string; // Optional: email of program owner
}
