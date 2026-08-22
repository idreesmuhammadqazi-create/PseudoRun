/**
 * Admin Type Definitions
 * Types for admin functionality and statistics
 */

export interface AdminStats {
  totalUsers: number;
  totalPrograms: number;
  activeUsersToday: number;
  totalSharedLinks: number;
  avgProgramsPerUser: number;
  programsCreatedToday: number;
  programsUpdatedToday: number;
  programsCreatedThisWeek: number;
  largestProgram: { name: string; userId: string; chars: number } | null;
  newestProgram: { name: string; userId: string; at: Date } | null;
  adViews?: number;
  adClicks?: number;
  adCtr?: number;
}

export interface EnrichedProgram {
  id: string;
  name: string;
  code: string;
  userId: string;
  userEmail: string | null;
  userDisplayName: string | null;
  createdAt: Date;
  updatedAt: Date;
  lineCount: number;
  charCount: number;
  codePreview: string;
}

export interface UserSummary {
  userId: string;
  email: string | null;
  displayName: string | null;
  programCount: number;
  lastActive: Date | null;
  firstCreated: Date | null;
  totalChars: number;
  avgLines: number;
}

export interface TopUser {
  userId: string;
  email: string | null;
  displayName: string | null;
  count: number;
}

export interface VisitAnalytics {
  totalVisits: number;
  uniqueVisitors: number; // by anonId
  uniqueVisitorsToday: number;
  visitsToday: number;
  visits7d: number;
  visitsPerDay: { date: string; count: number }[]; // last 14d
  visitsByPath: { path: string; count: number }[];
  topReferrers: { referrer: string; count: number }[];
  uniqueLoggedInVisitors: number;
}

export interface SessionAnalytics {
  totalSessions: number;
  avgDurationMs: number;
  medianDurationMs: number;
  avgActiveMs: number;
  totalActiveMs: number;
  bounceRate: number; // sessions < 10s and 1 visit path / total
  sessionsPerDay: { date: string; count: number }[];
  avgDurationPerDay: { date: string; avgMs: number }[];
}

export interface CombinedAnalytics {
  visits: VisitAnalytics;
  sessions: SessionAnalytics;
}
