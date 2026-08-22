/**
 * Lightweight, privacy-friendly analytics tracker.
 *
 * What it records (no PII beyond what the user already gave us):
 *  - one `analytics_visits` doc per page load (route, referrer, screen, lang)
 *  - one `analytics_sessions` doc per browser session, updated via heartbeat
 *    with dwell / active / idle seconds. Heartbeat is throttled and uses a
 *    single doc per session so read costs stay minimal.
 *
 * Implementation notes:
 *  - Requires no backend beyond Firestore. Collection rules are: anyone can
 *    create visits/sessions, only the same userId/anonymousId can update
 *    their own session, only admin can read. So existing traffic starts
 *    counting immediately.
 *  - Uses sessionStorage for visit/session IDs and localStorage for a
 *    stable anonymousId for unauthenticated visitors.
 *  - Tracks active time via Page Visibility + focus/blur + idle detection.
 *  - `trackEvent()` can be called manually; core code auto-tracks page views.
 */
import {
  addDoc, doc, updateDoc, collection, serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { auth } from '../config/firebase';

const VISITS_COLL = 'analytics_visits';
const SESSIONS_COLL = 'analytics_sessions';

const SESSION_KEY = 'pr_session_id';
const VISITED_KEY = 'pr_session_visited';
const ANON_KEY = 'pr_anon_id';
const START_KEY = 'pr_session_start';

const HEARTBEAT_MS = 25_000;
const IDLE_AFTER_MS = 60_000;

function anonId(): string {
  let id = localStorage.getItem(ANON_KEY);
  if (!id) {
    id = 'anon_' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
    localStorage.setItem(ANON_KEY, id);
  }
  return id;
}

function sessionId(): string {
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = 's_' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
    sessionStorage.setItem(SESSION_KEY, id);
    sessionStorage.setItem(START_KEY, String(Date.now()));
  }
  return id;
}

function sessionStart(): number {
  const v = Number(sessionStorage.getItem(START_KEY));
  return Number.isFinite(v) && v > 0 ? v : Date.now();
}

function safePath(): string {
  try { return window.location.pathname + window.location.search; } catch { return '/'; }
}

function referrer(): string {
  try { return document.referrer || ''; } catch { return ''; }
}

let heartbeatTimer: number | null = null;
let activeMs = 0;
let idleMs = 0;
let totalMs = 0;
let lastTick = Date.now();
let isVisible = true;
let hasFocus = true;
let lastInteraction = Date.now();
let currentUserId: string | null = null;
let currentSessionDocId: string | null = null;
let flushInProgress = false;
let trackedThisSession = false;

function nowUserId(): string | null {
  try { return auth.currentUser?.uid ?? null; } catch { return null; }
}

function buildSessionPayload(extra?: Record<string, unknown>) {
  return {
    sessionId: sessionId(),
    startedAt: new Date(sessionStart()),
    lastHeartbeatAt: serverTimestamp(),
    path: safePath(),
    referrer: referrer(),
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent.slice(0, 280) : '',
    language: typeof navigator !== 'undefined' ? navigator.language : '',
    screenW: typeof window !== 'undefined' ? window.innerWidth : 0,
    screenH: typeof window !== 'undefined' ? window.innerHeight : 0,
    userId: currentUserId,
    anonId: anonId(),
    totalMs,
    activeMs,
    idleMs,
    heartbeatCount: extra?.heartbeatCount,
    ...extra
  };
}

let heartbeatCount = 0;

async function upsertSession() {
  if (flushInProgress) return;
  flushInProgress = true;
  try {
    heartbeatCount += 1;
    const payload = buildSessionPayload({ heartbeatCount });
    if (!currentSessionDocId) {
      const ref = await addDoc(collection(db, SESSIONS_COLL), {
        ...payload,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      currentSessionDocId = ref.id;
      sessionStorage.setItem(VISITED_KEY + '_doc', ref.id);
    } else {
      await updateDoc(doc(db, SESSIONS_COLL, currentSessionDocId), {
        lastHeartbeatAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        path: safePath(),
        totalMs,
        activeMs,
        idleMs,
        heartbeatCount,
        userId: currentUserId
      });
    }
  } catch (e) {
    // never break the app for analytics
    console.debug('analytics heartbeat failed', e);
  } finally {
    flushInProgress = false;
  }
}

function tick() {
  const now = Date.now();
  const dt = now - lastTick;
  lastTick = now;
  totalMs += dt;
  const idle = (now - lastInteraction) > IDLE_AFTER_MS;
  const active = isVisible && hasFocus && !idle && document.hasFocus?.() !== false;
  // Some browsers report hasFocus false during load; be lenient initially
  const shouldCountActive = active || (totalMs < 5000 && isVisible);
  if (shouldCountActive) activeMs += dt; else idleMs += dt;
}

function installListeners() {
  const bump = () => { lastInteraction = Date.now(); };
  ['mousemove','keydown','scroll','click','touchstart'].forEach(ev =>
    window.addEventListener(ev, bump, { passive: true } as AddEventListenerOptions)
  );
  document.addEventListener('visibilitychange', () => {
    isVisible = document.visibilityState === 'visible';
    bump();
    if (!isVisible) {
      // flush last counters immediately on hide
      tick();
      void upsertSession();
    }
  });
  window.addEventListener('focus', () => { hasFocus = true; bump(); });
  window.addEventListener('blur', () => { hasFocus = false; });
  window.addEventListener('beforeunload', () => {
    tick();
    void upsertSession();
  });
}

export async function initAnalytics() {
  if (typeof window === 'undefined') return;
  // restore doc id if any
  currentSessionDocId = sessionStorage.getItem(VISITED_KEY + '_doc');
  currentUserId = nowUserId();
  try {
    const { onAuthStateChanged } = await import('firebase/auth');
    onAuthStateChanged(auth, (u) => { currentUserId = u?.uid ?? null; });
  } catch { /* ignore */ }

  installListeners();

  // One visit doc per page load (cheap aggregate). Throttle: one per session path+minute
  const visitKey = `pr_visit_${safePath()}_${Math.floor(Date.now()/60000)}`;
  if (!sessionStorage.getItem(visitKey)) {
    sessionStorage.setItem(visitKey, '1');
    try {
      await addDoc(collection(db, VISITS_COLL), {
        at: serverTimestamp(),
        path: safePath(),
        referrer: referrer(),
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent.slice(0, 280) : '',
        language: typeof navigator !== 'undefined' ? navigator.language : '',
        userId: currentUserId,
        anonId: anonId(),
        sessionId: sessionId(),
        screenW: window.innerWidth,
        screenH: window.innerHeight
      });
    } catch (e) { console.debug('visit track failed', e); }
  }

  if (trackedThisSession) return;
  trackedThisSession = true;

  // prime session doc
  await upsertSession();

  if (heartbeatTimer) window.clearInterval(heartbeatTimer);
  lastTick = Date.now();
  heartbeatTimer = window.setInterval(() => {
    tick();
    void upsertSession();
  }, HEARTBEAT_MS) as unknown as number;

  // initial tick loop for active/idle accounting
  window.setInterval(tick, 1000);
}

/** Optional: manually log a named event (kept minimal). */
export async function trackEvent(name: string, params: Record<string, unknown> = {}) {
  try {
    await addDoc(collection(db, 'analytics_events'), {
      name,
      params,
      at: serverTimestamp(),
      path: safePath(),
      userId: nowUserId(),
      anonId: anonId(),
      sessionId: sessionId()
    });
  } catch (e) { console.debug('trackEvent failed', e); }
}

// keep session doc stable across SPA navigations
export function notifyRouteChange() {
  // force a visit doc for new path (throttled)
  const visitKey = `pr_visit_${safePath()}_${Math.floor(Date.now()/60000)}`;
  if (!sessionStorage.getItem(visitKey)) {
    sessionStorage.setItem(visitKey, '1');
    void addDoc(collection(db, VISITS_COLL), {
      at: serverTimestamp(),
      path: safePath(),
      referrer: referrer(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent.slice(0, 280) : '',
      language: typeof navigator !== 'undefined' ? navigator.language : '',
      userId: nowUserId(),
      anonId: anonId(),
      sessionId: sessionId(),
      screenW: window.innerWidth,
      screenH: window.innerHeight
    }).catch(e => console.debug('route visit failed', e));
  }
  void upsertSession();
}
