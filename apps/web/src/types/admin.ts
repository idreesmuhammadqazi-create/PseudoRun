/**
 * Admin Type Definitions
 * Types for admin functionality and statistics
 */

export interface AdminStats {
  totalUsers: number;
  totalPrograms: number;
  activeUsersToday: number;
  totalSharedLinks: number;
  adViews?: number;
  adClicks?: number;
  adCtr?: number;
}
