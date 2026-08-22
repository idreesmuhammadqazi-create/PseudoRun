/**
 * Admin Service
 * Handles admin-specific data fetching operations with enriched program/user data
 */

import {
  collection,
  getDocs,
  Timestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Program } from '../types/program';
import { AdminStats, EnrichedProgram, UserSummary, CombinedAnalytics, VisitAnalytics, SessionAnalytics } from '../types/admin';
import { getAdBannerStats } from './adAnalyticsService';

const PROGRAMS_COLLECTION = 'programs';
const SHARED_CODE_COLLECTION = 'sharedCode';
const USERS_COLLECTION = 'users';

interface UserProfile {
  email?: string | null;
  displayName?: string | null;
  photoURL?: string | null;
}

function toDate(v: unknown): Date {
  if (v instanceof Timestamp) return v.toDate();
  if (v instanceof Date) return v;
  if (typeof v === 'string' || typeof v === 'number') {
    const d = new Date(v);
    return isNaN(d.getTime()) ? new Date() : d;
  }
  return new Date();
}

function codeMetrics(code: string) {
  const safe = code || '';
  const charCount = safe.length;
  const lineCount = safe ? safe.split('\n').length : 0;
  const lines = safe.split('\n').slice(0, 5).join('\n');
  const preview = lines.length > 240 ? lines.slice(0, 240) + '…' : lines;
  const codePreview = safe.length > preview.length && safe.split('\n').length <= 5
    ? safe.slice(0, 240) + '…'
    : preview + (safe.split('\n').length > 5 ? '\n…' : '');
  return { charCount, lineCount, codePreview: safe ? codePreview : '— empty —' };
}

async function getUserMap(): Promise<Map<string, UserProfile>> {
  const map = new Map<string, UserProfile>();
  try {
    const snap = await getDocs(collection(db, USERS_COLLECTION));
    snap.forEach(docSnap => {
      const data = docSnap.data() as UserProfile & { uid?: string };
      const uid = (data as Record<string, unknown>).uid as string | undefined || docSnap.id;
      map.set(uid, {
        email: data.email ?? null,
        displayName: data.displayName ?? null,
        photoURL: data.photoURL ?? null
      });
    });
  } catch {
    // users collection may not exist or admin cannot read it - degrade gracefully
  }
  return map;
}

/**
 * Get all programs (admin only) - plain Program shape, backwards compatible
 */
export async function getAllPrograms(): Promise<Program[]> {
  try {
    const q = collection(db, PROGRAMS_COLLECTION);
    const querySnapshot = await getDocs(q);

    const programs: Program[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      programs.push({
        id: docSnap.id,
        name: data.name ?? 'Untitled',
        code: data.code ?? '',
        userId: data.userId ?? 'unknown',
        createdAt: toDate(data.createdAt),
        updatedAt: toDate(data.updatedAt)
      });
    });

    programs.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
    return programs;
  } catch (error) {
    console.error('Error getting all programs:', error);
    throw new Error('Failed to load programs');
  }
}

/**
 * Get enriched programs with owner email, displayName, line/char counts and preview
 */
export async function getEnrichedPrograms(): Promise<EnrichedProgram[]> {
  try {
    const [programsSnap, userMap] = await Promise.all([
      getDocs(collection(db, PROGRAMS_COLLECTION)),
      getUserMap()
    ]);

    const enriched: EnrichedProgram[] = [];
    programsSnap.forEach(docSnap => {
      const data = docSnap.data();
      const code: string = data.code ?? '';
      const { charCount, lineCount, codePreview } = codeMetrics(code);
      const userId: string = data.userId ?? 'unknown';
      const profile = userMap.get(userId);
      enriched.push({
        id: docSnap.id,
        name: data.name ?? 'Untitled',
        code,
        userId,
        userEmail: profile?.email ?? null,
        userDisplayName: profile?.displayName ?? null,
        createdAt: toDate(data.createdAt),
        updatedAt: toDate(data.updatedAt),
        charCount,
        lineCount,
        codePreview
      });
    });

    enriched.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
    return enriched;
  } catch (error) {
    console.error('Error getting enriched programs:', error);
    throw new Error('Failed to load programs');
  }
}

/**
 * Get admin statistics with extended insights
 */
export async function getStats(): Promise<AdminStats> {
  try {
    const [programsSnapshot, sharedLinksSnapshot] = await Promise.all([
      getDocs(collection(db, PROGRAMS_COLLECTION)),
      getDocs(collection(db, SHARED_CODE_COLLECTION))
    ]);

    const uniqueUserIds = new Set<string>();
    const usersActiveToday = new Set<string>();
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    let programsCreatedToday = 0;
    let programsUpdatedToday = 0;
    let programsCreatedThisWeek = 0;
    let largest: { name: string; userId: string; chars: number } | null = null;
    let newest: { name: string; userId: string; at: Date } | null = null;
    let newestTime = 0;

    programsSnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const userId: string = data.userId ?? 'unknown';
      uniqueUserIds.add(userId);

      const updatedAt = toDate(data.updatedAt);
      const createdAt = toDate(data.createdAt);
      const code: string = data.code ?? '';

      if (updatedAt > twentyFourHoursAgo) {
        usersActiveToday.add(userId);
        programsUpdatedToday++;
      }
      if (createdAt > twentyFourHoursAgo) programsCreatedToday++;
      if (createdAt > sevenDaysAgo) programsCreatedThisWeek++;

      const chars = code.length;
      if (!largest || chars > largest.chars) {
        largest = { name: data.name ?? 'Untitled', userId, chars };
      }
      const t = updatedAt.getTime();
      if (t > newestTime) {
        newestTime = t;
        newest = { name: data.name ?? 'Untitled', userId, at: updatedAt };
      }
    });

    const totalUsers = uniqueUserIds.size;
    const totalPrograms = programsSnapshot.size;

    let adViews = 0;
    let adClicks = 0;
    try {
      const ad = await getAdBannerStats();
      adViews = ad.views;
      adClicks = ad.clicks;
    } catch { /* ad stats optional */ }

    const stats: AdminStats = {
      totalUsers,
      totalPrograms,
      activeUsersToday: usersActiveToday.size,
      totalSharedLinks: sharedLinksSnapshot.size,
      avgProgramsPerUser: totalUsers ? Number((totalPrograms / totalUsers).toFixed(1)) : 0,
      programsCreatedToday,
      programsUpdatedToday,
      programsCreatedThisWeek,
      largestProgram: largest,
      newestProgram: newest,
      adViews,
      adClicks,
      adCtr: adViews > 0 ? Number(((adClicks / adViews) * 100).toFixed(1)) : 0
    };

    return stats;
  } catch (error) {
    console.error('Error getting admin stats:', error);
    throw new Error('Failed to load statistics');
  }
}

/**
 * Aggregate per-user summary table for admin -> powers Users tab
 */
export async function getUserSummaries(): Promise<UserSummary[]> {
  const [programsSnap, userMap] = await Promise.all([
    getDocs(collection(db, PROGRAMS_COLLECTION)),
    getUserMap()
  ]);

  const agg = new Map<string, {
    programCount: number;
    lastActive: Date | null;
    firstCreated: Date | null;
    totalChars: number;
    totalLines: number;
  }>();

  programsSnap.forEach(docSnap => {
    const data = docSnap.data();
    const userId: string = data.userId ?? 'unknown';
    const code: string = data.code ?? '';
    const updatedAt = toDate(data.updatedAt);
    const createdAt = toDate(data.createdAt);
    const lines = code ? code.split('\n').length : 0;

    const cur = agg.get(userId) ?? {
      programCount: 0,
      lastActive: null as Date | null,
      firstCreated: null as Date | null,
      totalChars: 0,
      totalLines: 0
    };
    cur.programCount += 1;
    cur.totalChars += code.length;
    cur.totalLines += lines;
    if (!cur.lastActive || updatedAt > cur.lastActive) cur.lastActive = updatedAt;
    if (!cur.firstCreated || createdAt < cur.firstCreated) cur.firstCreated = createdAt;
    agg.set(userId, cur);
  });

  // include users that exist but have 0 programs
  userMap.forEach((_profile, uid) => {
    if (!agg.has(uid)) {
      agg.set(uid, {
        programCount: 0,
        lastActive: null,
        firstCreated: null,
        totalChars: 0,
        totalLines: 0
      });
    }
  });

  const summaries: UserSummary[] = [];
  agg.forEach((v, userId) => {
    const profile = userMap.get(userId);
    summaries.push({
      userId,
      email: profile?.email ?? null,
      displayName: profile?.displayName ?? null,
      programCount: v.programCount,
      lastActive: v.lastActive,
      firstCreated: v.firstCreated,
      totalChars: v.totalChars,
      avgLines: v.programCount ? Math.round(v.totalLines / v.programCount) : 0
    });
  });

  summaries.sort((a, b) => b.programCount - a.programCount);
  return summaries;
}

// ---- Visitor analytics ----

function dayKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export async function getAnalytics(): Promise<CombinedAnalytics> {
  const VISITS_COLL = 'analytics_visits';
  const SESSIONS_COLL = 'analytics_sessions';

  let visitsDocs: { at: Date; anonId: string | null; userId: string | null; path: string; referrer: string }[] = [];
  let sessionsDocs: { startedAt: Date; lastHeartbeatAt: Date | null; totalMs: number; activeMs: number; idleMs: number; path: string }[] = [];

  // Firestore may be empty on first deploy - degrade to zeros
  try {
    const vs = await getDocs(collection(db, VISITS_COLL));
    vs.forEach(snap => {
      const d = snap.data() as Record<string, unknown>;
      visitsDocs.push({
        at: toDate(d.at ?? d.createdAt ?? d.timestamp),
        anonId: (d.anonId as string) ?? null,
        userId: (d.userId as string) ?? null,
        path: (d.path as string) ?? '/',
        referrer: (d.referrer as string) ?? ''
      });
    });
  } catch { /* no visits yet */ }

  try {
    const ss = await getDocs(collection(db, SESSIONS_COLL));
    ss.forEach(snap => {
      const d = snap.data() as Record<string, unknown>;
      const totalMs = Number(d.totalMs ?? 0);
      const activeMs = Number(d.activeMs ?? 0);
      const idleMs = Number(d.idleMs ?? 0);
      sessionsDocs.push({
        startedAt: toDate(d.startedAt ?? d.createdAt ?? d.at),
        lastHeartbeatAt: d.lastHeartbeatAt ? toDate(d.lastHeartbeatAt) : null,
        totalMs: Number.isFinite(totalMs) ? totalMs : 0,
        activeMs: Number.isFinite(activeMs) ? activeMs : 0,
        idleMs: Number.isFinite(idleMs) ? idleMs : 0,
        path: (d.path as string) ?? '/'
      });
    });
  } catch { /* no sessions yet */ }

  const now = new Date();
  const startOfToday = new Date(now); startOfToday.setHours(0,0,0,0);
  const sevenDaysAgo = new Date(now.getTime() - 7*24*60*60*1000);

  // Visits analytics
  const uniqueAnon = new Set<string>();
  const uniqueToday = new Set<string>();
  const uniqueLoggedIn = new Set<string>();
  const byDay = new Map<string, number>();
  const byPath = new Map<string, number>();
  const byRef = new Map<string, number>();
  let visitsToday = 0, visits7d = 0;

  for (const v of visitsDocs) {
    if (v.anonId) uniqueAnon.add(v.anonId);
    if (v.userId) uniqueLoggedIn.add(v.userId);
    const dk = dayKey(v.at);
    byDay.set(dk, (byDay.get(dk) ?? 0) + 1);
    byPath.set(v.path, (byPath.get(v.path) ?? 0) + 1);
    const refHost = (() => { try { return v.referrer ? new URL(v.referrer).hostname : '(direct)'; } catch { return v.referrer ? v.referrer.slice(0,40) : '(direct)'; }})();
    byRef.set(refHost, (byRef.get(refHost) ?? 0) + 1);
    if (v.at >= startOfToday) { visitsToday++; if (v.anonId) uniqueToday.add(v.anonId); }
    if (v.at >= sevenDaysAgo) visits7d++;
  }

  // last 14 days series
  const visitsPerDay: { date: string; count: number }[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now); d.setHours(0,0,0,0); d.setDate(d.getDate() - i);
    const k = dayKey(d);
    visitsPerDay.push({ date: k.slice(5), count: byDay.get(k) ?? 0 });
  }

  const visitsByPath = [...byPath.entries()].sort((a,b)=>b[1]-a[1]).slice(0,8).map(([path,count])=>({ path, count }));
  const topReferrers = [...byRef.entries()].sort((a,b)=>b[1]-a[1]).slice(0,8).map(([referrer,count])=>({ referrer, count }));

  const visits: VisitAnalytics = {
    totalVisits: visitsDocs.length,
    uniqueVisitors: uniqueAnon.size,
    uniqueVisitorsToday: uniqueToday.size,
    visitsToday,
    visits7d,
    visitsPerDay,
    visitsByPath,
    topReferrers,
    uniqueLoggedInVisitors: uniqueLoggedIn.size
  };

  // Sessions analytics (duration)
  // Use totalMs if present, else fallback to activeMs, and always prefer activeMs for "time actively spent"
  const durations = sessionsDocs.map(s => s.totalMs || s.activeMs || 0).filter(n => n > 0).sort((a,b)=>a-b);
  const sum = durations.reduce((a,b)=>a+b,0);
  const avg = durations.length ? Math.round(sum / durations.length) : 0;
  const median = durations.length ? durations[Math.floor(durations.length/2)] : 0;
  const activeSum = sessionsDocs.reduce((a,s)=>a+(s.activeMs||0),0);
  const avgActive = sessionsDocs.length ? Math.round(activeSum / Math.max(1, sessionsDocs.length)) : 0;
  const bounces = sessionsDocs.filter(s => (s.totalMs || s.activeMs) < 10_000).length;
  const bounceRate = sessionsDocs.length ? Math.round(bounces / sessionsDocs.length * 100) : 0;

  const sessByDay = new Map<string, number>();
  const sessDurByDay = new Map<string, { sum: number; count: number }>();
  for (const s of sessionsDocs) {
    const k = dayKey(s.startedAt);
    sessByDay.set(k, (sessByDay.get(k) ?? 0) + 1);
    const d = s.totalMs || s.activeMs || 0;
    const cur = sessDurByDay.get(k) ?? { sum: 0, count: 0 };
    cur.sum += d; cur.count += 1;
    sessDurByDay.set(k, cur);
  }
  const sessionsPerDay: { date: string; count: number }[] = [];
  const avgDurationPerDay: { date: string; avgMs: number }[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now); d.setHours(0,0,0,0); d.setDate(d.getDate() - i);
    const k = dayKey(d);
    const label = k.slice(5);
    sessionsPerDay.push({ date: label, count: sessByDay.get(k) ?? 0 });
    const v = sessDurByDay.get(k);
    avgDurationPerDay.push({ date: label, avgMs: v && v.count ? Math.round(v.sum / v.count) : 0 });
  }

  const sessions: SessionAnalytics = {
    totalSessions: sessionsDocs.length,
    avgDurationMs: avg,
    medianDurationMs: median,
    avgActiveMs: avgActive,
    totalActiveMs: activeSum,
    bounceRate,
    sessionsPerDay,
    avgDurationPerDay
  };

  return { visits, sessions };
}
