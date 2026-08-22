/**
 * Admin Dashboard - enriched
 * Shows full program code, owner email/displayName, per-user aggregates,
 * search/sort, expandable previews and a full-code modal.
 */
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getEnrichedPrograms, getStats, getUserSummaries, getAnalytics } from '../../services/adminService';
import { AdminStats, EnrichedProgram, UserSummary, CombinedAnalytics } from '../../types/admin';
import styles from './AdminDashboard.module.css';

type TabType = 'dashboard' | 'programs' | 'users' | 'analytics';
type SortKey = 'updated_desc' | 'updated_asc' | 'created_desc' | 'name_asc' | 'lines_desc' | 'chars_desc';

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  }).format(date);
}
function formatShortDate(d: Date | null): string {
  if (!d) return '—';
  return formatDate(d);
}
function truncate(s: string, n: number): string {
  if (s.length <= n) return s;
  return s.slice(0, n) + '…';
}
function shortId(id: string): string { return id.length > 12 ? id.slice(0, 8) + '…' + id.slice(-4) : id; }
function fmtDuration(ms: number): string {
  if (!ms || ms <= 0) return '—';
  const s = Math.round(ms / 1000);
  if (s < 60) return s + 's';
  const m = Math.floor(s / 60);
  const rem = s % 60;
  if (m < 60) return m + 'm ' + (rem ? rem + 's' : '');
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return h + 'h ' + (mm ? mm + 'm' : '');
}
function BarChart({ data, max, valueKey, color }: { data: Record<string, unknown>[]; max: number; valueKey: string; color: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'end', gap: 4, height: 92, paddingTop: 6 }}>
      {data.map((d, i) => {
        const v = Number((d as Record<string, unknown>)[valueKey] ?? 0);
        const h = max ? Math.max(4, Math.round((v / max) * 84)) : 4;
        return (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div title={String(v)} style={{ width: '100%', height: h, background: color, borderRadius: 6, opacity: v ? 0.9 : 0.2 }} />
            <span style={{ fontSize: 10, color: '#667085' }}>{String((d as Record<string, unknown>).date ?? '')}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function AdminDashboard() {
  const { currentUser, isAdmin } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [programs, setPrograms] = useState<EnrichedProgram[]>([]);
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [userFilter, setUserFilter] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('updated_desc');
  const [programsToShow, setProgramsToShow] = useState(20);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<EnrichedProgram | null>(null);
  const [usersSearch, setUsersSearch] = useState('');
  const [analytics, setAnalytics] = useState<CombinedAnalytics | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  useEffect(() => {
    async function check() {
      if (!currentUser) { setIsAuthorized(false); setLoading(false); return; }
      try {
        const ok = await isAdmin();
        setIsAuthorized(ok);
        if (ok) await loadData();
      } catch (e) { console.error(e); setIsAuthorized(false); }
      finally { setLoading(false); }
    }
    check();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  async function loadData() {
    try {
      setError('');
      const [s, progs, us] = await Promise.all([getStats(), getEnrichedPrograms(), getUserSummaries()]);
      setStats(s); setPrograms(progs); setUsers(us);
      // analytics is lazy - fetched on first open, but also refresh here
      try { const a = await getAnalytics(); setAnalytics(a); } catch { /* analytics may be empty before first visits */ }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load admin data';
      setError(msg);
    }
  }

  function handleCopyId(id: string) {
    navigator.clipboard.writeText(id);
    setCopiedId(id); setTimeout(() => setCopiedId(null), 1800);
  }
  function handleCopyCode(p: EnrichedProgram) {
    navigator.clipboard.writeText(p.code);
    setCopiedCodeId(p.id); setTimeout(() => setCopiedCodeId(null), 1800);
  }
  function toggleExpand(id: string) {
    setExpanded(prev => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id); else n.add(id);
      return n;
    });
  }

  const filteredSorted = useMemo(() => {
    let out = programs;
    const q = searchTerm.trim().toLowerCase();
    const uf = userFilter.trim().toLowerCase();
    if (q) {
      out = out.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q) ||
        p.userId.toLowerCase().includes(q) ||
        (p.userEmail && p.userEmail.toLowerCase().includes(q)) ||
        (p.userDisplayName && p.userDisplayName.toLowerCase().includes(q))
      );
    }
    if (uf) {
      out = out.filter(p =>
        p.userId.toLowerCase().includes(uf) ||
        (p.userEmail && p.userEmail.toLowerCase().includes(uf)) ||
        (p.userDisplayName && p.userDisplayName.toLowerCase().includes(uf))
      );
    }
    const sorted = [...out];
    switch (sortKey) {
      case 'updated_desc': sorted.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()); break;
      case 'updated_asc': sorted.sort((a, b) => a.updatedAt.getTime() - b.updatedAt.getTime()); break;
      case 'created_desc': sorted.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()); break;
      case 'name_asc': sorted.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'lines_desc': sorted.sort((a, b) => b.lineCount - a.lineCount); break;
      case 'chars_desc': sorted.sort((a, b) => b.charCount - a.charCount); break;
    }
    return sorted;
  }, [programs, searchTerm, userFilter, sortKey]);

  const displayed = useMemo(() => filteredSorted.slice(0, programsToShow), [filteredSorted, programsToShow]);

  const filteredUsers = useMemo(() => {
    const q = usersSearch.trim().toLowerCase();
    if (!q) return users;
    return users.filter(u =>
      u.userId.toLowerCase().includes(q) ||
      (u.email && u.email.toLowerCase().includes(q)) ||
      (u.displayName && u.displayName.toLowerCase().includes(q))
    );
  }, [users, usersSearch]);

  const topUsers = useMemo(() => users.slice(0, 5), [users]);

  if (loading) return <div className={styles.loading}>Loading admin dashboard…</div>;
  if (!isAuthorized) return (
    <div className={styles.accessDenied}>
      <h2>Access Denied</h2>
      <p>You don't have permission to access the admin dashboard.</p>
    </div>
  );

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <h2 className={styles.sidebarTitle}>Admin Panel</h2>
        <div className={styles.sidebarSub}>Signed in as {currentUser?.email ?? currentUser?.uid}</div>
        <nav className={styles.nav}>
          <button className={`${styles.navButton} ${activeTab === 'dashboard' ? styles.active : ''}`} onClick={() => setActiveTab('dashboard')}>📊 Dashboard</button>
          <button className={`${styles.navButton} ${activeTab === 'programs' ? styles.active : ''}`} onClick={() => setActiveTab('programs')}>📄 All Programs <span className={styles.badge}>{programs.length}</span></button>
          <button className={`${styles.navButton} ${activeTab === 'users' ? styles.active : ''}`} onClick={() => setActiveTab('users')}>👥 Users <span className={styles.badge}>{users.length}</span></button>
          <button className={`${styles.navButton} ${activeTab === 'analytics' ? styles.active : ''}`} onClick={async () => { setActiveTab('analytics'); if (!analytics && !analyticsLoading) { setAnalyticsLoading(true); try { setAnalytics(await getAnalytics()); } finally { setAnalyticsLoading(false); } } }}>📈 Analytics</button>
        </nav>
        <button className={styles.refreshBtn} onClick={loadData}>↻ Refresh</button>
        <div className={styles.sidebarHint}>Program code is read-only for admins.</div>
      </aside>

      <main className={styles.content}>
        {error && <div className={styles.error}>{error}</div>}

        {activeTab === 'dashboard' && stats && (
          <div>
            <div className={styles.pageHeader}>
              <h1>Dashboard</h1>
              <div className={styles.headerMeta}>{programs.length} programs • {stats.totalSharedLinks} shared links</div>
            </div>

            <div className={styles.statsGrid}>
              <div className={styles.statCard}><div className={styles.statIcon}>👥</div><div className={styles.statValue}>{stats.totalUsers}</div><div className={styles.statLabel}>Total Users</div><div className={styles.statSub}>{stats.avgProgramsPerUser} avg programs / user</div></div>
              <div className={styles.statCard}><div className={styles.statIcon}>📄</div><div className={styles.statValue}>{stats.totalPrograms}</div><div className={styles.statLabel}>Total Programs</div><div className={styles.statSub}>{stats.programsCreatedThisWeek} created this week</div></div>
              <div className={styles.statCard}><div className={styles.statIcon}>🟢</div><div className={styles.statValue}>{stats.activeUsersToday}</div><div className={styles.statLabel}>Active Today</div><div className={styles.statSub}>{stats.programsUpdatedToday} updated / {stats.programsCreatedToday} created today</div></div>
              <div className={styles.statCard}><div className={styles.statIcon}>🔗</div><div className={styles.statValue}>{stats.totalSharedLinks}</div><div className={styles.statLabel}>Shared Links</div><div className={styles.statSub}>sharedCode collection</div></div>
            </div>

            <h2>LearningAide Banner</h2>
            <div className={styles.statsGrid} style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
              <div className={styles.statCard}><div className={styles.statIcon}>🎬</div><div className={styles.statValue}>{(stats.adViews ?? 0).toLocaleString()}</div><div className={styles.statLabel}>Banner Views</div><div className={styles.statSub}><a href="https://recheck.learningaide.ai?ref=PseudoRun" target="_blank" rel="noopener noreferrer" style={{ color: '#0d47a1' }}>recheck.learningaide.ai</a></div></div>
              <div className={styles.statCard}><div className={styles.statIcon}>🖱️</div><div className={styles.statValue}>{(stats.adClicks ?? 0).toLocaleString()}</div><div className={styles.statLabel}>Banner Clicks</div></div>
              <div className={styles.statCard}><div className={styles.statIcon}>📈</div><div className={styles.statValue}>{stats.adCtr ?? 0}%</div><div className={styles.statLabel}>CTR</div></div>
            </div>

            {(stats.largestProgram || stats.newestProgram) && (
              <div className={styles.insightRow}>
                {stats.largestProgram && <div className={styles.insightCard}><div className={styles.insightLabel}>Largest program</div><div className={styles.insightValue}>{truncate(stats.largestProgram.name, 30)}</div><div className={styles.insightMeta}>{stats.largestProgram.chars.toLocaleString()} chars • owner {truncate(stats.largestProgram.userId, 18)}</div></div>}
                {stats.newestProgram && <div className={styles.insightCard}><div className={styles.insightLabel}>Most recently updated</div><div className={styles.insightValue}>{truncate(stats.newestProgram.name, 30)}</div><div className={styles.insightMeta}>{formatDate(stats.newestProgram.at)} • {truncate(stats.newestProgram.userId, 18)}</div></div>}
              </div>
            )}

            <div className={styles.twoCol}>
              <div>
                <h2>Recent Programs (last 10) — with code preview</h2>
                <div className={styles.programList}>
                  {programs.slice(0, 10).map(p => (
                    <div key={p.id} className={styles.programItem}>
                      <div className={styles.programInfo}>
                        <div className={styles.programNameRow}>
                          <span className={styles.programName}>{p.name}</span>
                          <span className={styles.miniBadge}>{p.lineCount} lines</span>
                          <span className={styles.miniBadgeMuted}>{p.charCount.toLocaleString()} chars</span>
                        </div>
                        <div className={styles.programUser}>
                          {p.userDisplayName ? <b>{p.userDisplayName}</b> : null}
                          {p.userEmail ? <span> {p.userEmail}</span> : <span className={styles.muted}> — email not synced yet — </span>}
                          <span className={styles.dot}>•</span>
                          <span className={styles.mono} title={p.userId}>{shortId(p.userId)}</span>
                        </div>
                        <div className={styles.codePreview}><pre>{p.codePreview}</pre></div>
                        <div className={styles.programDate}>{formatDate(p.updatedAt)} <span className={styles.muted}>created {formatDate(p.createdAt)}</span> <span className={styles.monoSm} title={p.id}>id {shortId(p.id)}</span></div>
                      </div>
                      <div className={styles.actionsCol}>
                        <button className={styles.viewButton} onClick={() => setSelected(p)}>View code</button>
                        <button className={styles.secondaryButton} onClick={() => handleCopyId(p.id)}>{copiedId === p.id ? 'Copied!' : 'Copy ID'}</button>
                      </div>
                    </div>
                  ))}
                  {programs.length === 0 && <div className={styles.noResults}>No programs found</div>}
                </div>
              </div>

              <div>
                <h2>Top Users by programs</h2>
                <div className={styles.topUsersList}>
                  {topUsers.map(u => (
                    <div key={u.userId} className={styles.topUserItem}>
                      <div className={styles.avatarPlaceholder}>{(u.displayName?.[0] ?? u.email?.[0] ?? u.userId[0] ?? '?').toUpperCase()}</div>
                      <div className={styles.topUserInfo}>
                        <div className={styles.topUserName}>{u.displayName || u.email || truncate(u.userId, 18)}</div>
                        <div className={styles.topUserEmail}>{u.email ?? <span className={styles.muted}>{truncate(u.userId, 22)}</span>} </div>
                      </div>
                      <div className={styles.topUserCount}>{u.programCount}</div>
                    </div>
                  ))}
                  {topUsers.length === 0 && <div className={styles.noResults}>No user data</div>}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'programs' && (
          <div>
            <div className={styles.pageHeader}>
              <h1>All Programs</h1>
              <div className={styles.headerMeta}>Showing {displayed.length} of {filteredSorted.length} (total {programs.length})</div>
            </div>

            <div className={styles.toolbar}>
              <input type="text" placeholder="Search name, code, email, id…" value={searchTerm} onChange={e => { setSearchTerm(e.target.value); setProgramsToShow(20); }} className={styles.searchInput} />
              <input type="text" placeholder="Filter by user (email / id)…" value={userFilter} onChange={e => { setUserFilter(e.target.value); setProgramsToShow(20); }} className={styles.searchInput} />
              <select value={sortKey} onChange={e => setSortKey(e.target.value as SortKey)} className={styles.selectInput}>
                <option value="updated_desc">Recently updated ↓</option>
                <option value="updated_asc">Oldest updated ↑</option>
                <option value="created_desc">Recently created ↓</option>
                <option value="name_asc">Name A → Z</option>
                <option value="lines_desc">Most lines ↓</option>
                <option value="chars_desc">Largest (chars) ↓</option>
              </select>
            </div>
            {(searchTerm || userFilter) && (
              <div className={styles.activeFilters}>
                Active filters: {searchTerm && <span className={styles.filterPill}>search: "{truncate(searchTerm, 20)}"</span>}
                {userFilter && <span className={styles.filterPill}>user: "{truncate(userFilter, 20)}"</span>}
                <button className={styles.clearBtn} onClick={() => { setSearchTerm(''); setUserFilter(''); }}>Clear</button>
                <span className={styles.muted}> • search scans name, full code, owner email and ID</span>
              </div>
            )}

            <div className={styles.programList}>
              {displayed.map(p => {
                const isExpanded = expanded.has(p.id);
                return (
                  <div key={p.id} className={`${styles.programItem} ${styles.programItemExpanded}`}>
                    <div className={styles.programInfo}>
                      <div className={styles.programNameRow}>
                        <span className={styles.programName}>{p.name}</span>
                        <span className={styles.miniBadge}>{p.lineCount} lines</span>
                        <span className={styles.miniBadgeMuted}>{p.charCount.toLocaleString()} chars</span>
                        {isExpanded && <span className={styles.miniBadgeBlue}>expanded</span>}
                      </div>
                      <div className={styles.programUser}>
                        {p.userDisplayName ? <b>{p.userDisplayName}</b> : null}
                        {p.userEmail ? <span> — {p.userEmail}</span> : <span className={styles.muted}> — email not synced — </span>}
                        <span className={styles.dot}>•</span>
                        <span className={styles.mono} title={p.userId}>{p.userId}</span>
                      </div>
                      <div className={styles.metaRow}>
                        <span className={styles.programDate}>Updated: {formatDate(p.updatedAt)}</span>
                        <span className={styles.programDate}>Created: {formatDate(p.createdAt)}</span>
                        <span className={styles.monoSm} title={p.id}>ID: {p.id}</span>
                      </div>
                      <div className={styles.codePreviewBlock}>
                        <pre className={isExpanded ? styles.preExpanded : undefined}>{isExpanded ? p.code || '— empty —' : p.codePreview}</pre>
                      </div>
                    </div>
                    <div className={styles.actionsCol}>
                      <button className={styles.viewButton} onClick={() => setSelected(p)}>🔍 Full code</button>
                      <button className={styles.secondaryButton} onClick={() => toggleExpand(p.id)}>{isExpanded ? 'Collapse' : 'Expand inline'}</button>
                      <button className={styles.secondaryButton} onClick={() => handleCopyCode(p)}>{copiedCodeId === p.id ? 'Copied code!' : 'Copy code'}</button>
                      <button className={styles.ghostButton} onClick={() => handleCopyId(p.id)}>{copiedId === p.id ? 'Copied ID!' : 'Copy ID'}</button>
                    </div>
                  </div>
                );
              })}
              {displayed.length === 0 && <div className={styles.noResults}>No programs match your filters.</div>}
            </div>

            {!searchTerm && !userFilter && filteredSorted.length > programsToShow && (
              <button className={styles.loadMoreButton} onClick={() => setProgramsToShow(v => v + 20)}>Load 20 more ({filteredSorted.length - programsToShow} remaining)</button>
            )}
            {(searchTerm || userFilter) && filteredSorted.length > programsToShow && (
              <button className={styles.loadMoreButton} onClick={() => setProgramsToShow(v => v + 20)}>Load more</button>
            )}
          </div>
        )}


        {activeTab === 'analytics' && (
          <div>
            <div className={styles.pageHeader}>
              <h1>Analytics</h1>
              <div className={styles.headerMeta}>Visits + time on site • auto-tracked from all visitors • {analytics ? analytics.visits.totalVisits + ' visits • ' + analytics.sessions.totalSessions + ' sessions' : 'loading…'}</div>
            </div>
            {!analytics ? (
              <div className={styles.loading} style={{ height: 220 }}>{analyticsLoading ? 'Loading analytics…' : 'No data yet — visits start counting as soon as users load the site.'}</div>
            ) : (
              <>
                <div className={styles.statsGrid}>
                  <div className={styles.statCard}><div className={styles.statIcon}>👁️</div><div className={styles.statValue}>{analytics.visits.totalVisits.toLocaleString()}</div><div className={styles.statLabel}>Total Page Loads</div><div className={styles.statSub}>{analytics.visits.visits7d.toLocaleString()} last 7 days • {analytics.visits.visitsToday} today</div></div>
                  <div className={styles.statCard}><div className={styles.statIcon}>🧑‍🤝‍🧑</div><div className={styles.statValue}>{analytics.visits.uniqueVisitors.toLocaleString()}</div><div className={styles.statLabel}>Unique Visitors</div><div className={styles.statSub}>{analytics.visits.uniqueVisitorsToday} today • {analytics.visits.uniqueLoggedInVisitors} logged-in</div></div>
                  <div className={styles.statCard}><div className={styles.statIcon}>⏱️</div><div className={styles.statValue}>{fmtDuration(analytics.sessions.avgActiveMs)}</div><div className={styles.statLabel}>Avg Active Time</div><div className={styles.statSub}>median {fmtDuration(analytics.sessions.medianDurationMs)} • total {fmtDuration(analytics.sessions.totalActiveMs)}</div></div>
                  <div className={styles.statCard}><div className={styles.statIcon}>📊</div><div className={styles.statValue}>{analytics.sessions.totalSessions.toLocaleString()}</div><div className={styles.statLabel}>Sessions</div><div className={styles.statSub}>{analytics.sessions.bounceRate}% bounce (&lt;10s)</div></div>
                </div>

                <div className={styles.twoCol}>
                  <div className={styles.chartCard}>
                    <div className={styles.chartTitle}>Visits — last 14 days</div>
                    <BarChart data={analytics.visits.visitsPerDay as unknown as Record<string, unknown>[]} max={Math.max(1, ...analytics.visits.visitsPerDay.map(d=>d.count))} valueKey="count" color="#0d47a1" />
                    <div className={styles.chartFoot}>{analytics.visits.visitsPerDay.map(d=>d.count).join(' · ')}</div>
                  </div>
                  <div className={styles.chartCard}>
                    <div className={styles.chartTitle}>Avg time on site — last 14 days</div>
                    <BarChart data={analytics.sessions.avgDurationPerDay as unknown as Record<string, unknown>[]} max={Math.max(1, ...analytics.sessions.avgDurationPerDay.map(d=>d.avgMs))} valueKey="avgMs" color="#16a34a" />
                    <div className={styles.chartFoot}>{analytics.sessions.avgDurationPerDay.map(d=>fmtDuration(d.avgMs)).join(' · ')}</div>
                  </div>
                </div>

                <div className={styles.twoCol} style={{ marginTop: 16 }}>
                  <div className={styles.chartCard}>
                    <div className={styles.chartTitle}>Sessions — last 14 days</div>
                    <BarChart data={analytics.sessions.sessionsPerDay as unknown as Record<string, unknown>[]} max={Math.max(1, ...analytics.sessions.sessionsPerDay.map(d=>d.count))} valueKey="count" color="#7c3aed" />
                    <div className={styles.chartFoot}>{analytics.sessions.sessionsPerDay.map(d=>d.count).join(' · ')}</div>
                  </div>
                  <div>
                    <div className={styles.miniTableWrap}>
                      <div className={styles.miniTableTitle}>Top pages</div>
                      <table className={styles.miniTable}>
                        <tbody>
                          {analytics.visits.visitsByPath.length ? analytics.visits.visitsByPath.map(r => (
                            <tr key={r.path}><td style={{ wordBreak: 'break-all' }}>{r.path}</td><td style={{ textAlign: 'right', fontWeight: 700 }}>{r.count}</td></tr>
                          )) : <tr><td className={styles.muted}>No data yet</td><td></td></tr>}
                        </tbody>
                      </table>
                    </div>
                    <div className={styles.miniTableWrap} style={{ marginTop: 12 }}>
                      <div className={styles.miniTableTitle}>Top referrers</div>
                      <table className={styles.miniTable}>
                        <tbody>
                          {analytics.visits.topReferrers.length ? analytics.visits.topReferrers.map(r => (
                            <tr key={r.referrer}><td style={{ wordBreak: 'break-all' }}>{r.referrer || '(direct)'}</td><td style={{ textAlign: 'right', fontWeight: 700 }}>{r.count}</td></tr>
                          )) : <tr><td className={styles.muted}>No data yet</td><td></td></tr>}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className={styles.muted} style={{ marginTop: 12, lineHeight: 1.5 }}>
                  Tracking: one anonymous <code>analytics_visits</code> doc per page load + one <code>analytics_sessions</code> doc per tab session with heartbeat (active vs idle via visibility/focus). Works for guests too (stable anon id in localStorage). Data is read-only for admins.
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'users' && (
          <div>
            <div className={styles.pageHeader}>
              <h1>Users</h1>
              <div className={styles.headerMeta}>{filteredUsers.length} users • {programs.length} total programs</div>
            </div>
            <div className={styles.toolbar}>
              <input type="text" placeholder="Search users by email, name or ID…" value={usersSearch} onChange={e => setUsersSearch(e.target.value)} className={styles.searchInput} style={{ flex: 1 }} />
              <div className={styles.muted} style={{ alignSelf: 'center' }}>Sorted by program count ↓</div>
            </div>

            <div className={styles.tableWrap}>
              <table className={styles.usersTable}>
                <thead>
                  <tr>
                    <th>User</th>
                    <th style={{ textAlign: 'center' }}>Programs</th>
                    <th>Last active</th>
                    <th>First created</th>
                    <th style={{ textAlign: 'right' }}>Code size</th>
                    <th style={{ textAlign: 'right' }}>Avg lines</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(u => (
                    <tr key={u.userId}>
                      <td>
                        <div className={styles.userCellName}>{u.displayName || <span className={styles.muted}>No name</span>}</div>
                        <div className={styles.userCellEmail}>{u.email ?? <span className={styles.muted}>— email not synced —</span>}</div>
                        <div className={styles.monoSm} title={u.userId}>{u.userId}</div>
                      </td>
                      <td style={{ textAlign: 'center' }}><span className={styles.countPill}>{u.programCount}</span></td>
                      <td className={styles.muted}>{formatShortDate(u.lastActive)}</td>
                      <td className={styles.muted}>{formatShortDate(u.firstCreated)}</td>
                      <td style={{ textAlign: 'right' }}>{u.totalChars.toLocaleString()} chars</td>
                      <td style={{ textAlign: 'right' }}>{u.avgLines}</td>
                      <td>
                        {u.programCount > 0 && (
                          <button className={styles.smallBtn} onClick={() => { setUserFilter(u.email ?? u.userId); setActiveTab('programs'); setProgramsToShow(20); window.scrollTo(0, 0); }}>View programs →</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredUsers.length === 0 && <div className={styles.noResults}>No users match "{usersSearch}"</div>}
            </div>
            <div className={styles.muted} style={{ marginTop: 12 }}>
              Emails/names come from the Firestore <code>users</code> collection. Users who signed up before this update will have their email synced on next login.
            </div>
          </div>
        )}
      </main>

      {selected && (
        <div className={styles.modalOverlay} onClick={() => setSelected(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <div className={styles.modalTitle}>{selected.name}</div>
                <div className={styles.modalSub}>
                  {selected.userDisplayName ? <b>{selected.userDisplayName}</b> : null}
                  {selected.userEmail ? ` — ${selected.userEmail}` : ' — email not synced —'}
                  <span className={styles.dot}>•</span>
                  <span className={styles.monoSm}>{selected.userId}</span>
                </div>
                <div className={styles.modalMeta}>
                  <span>{selected.lineCount} lines • {selected.charCount.toLocaleString()} chars</span>
                  <span> • Updated {formatDate(selected.updatedAt)}</span>
                  <span> • Created {formatDate(selected.createdAt)}</span>
                </div>
                <div className={styles.monoSm} style={{ wordBreak: 'break-all' }}>ID: {selected.id}</div>
              </div>
              <button className={styles.modalClose} onClick={() => setSelected(null)}>✕</button>
            </div>
            <div className={styles.modalActions}>
              <button className={styles.viewButton} onClick={() => handleCopyCode(selected)}>{copiedCodeId === selected.id ? 'Copied!' : 'Copy code'}</button>
              <button className={styles.secondaryButton} onClick={() => handleCopyId(selected.id)}>{copiedId === selected.id ? 'Copied ID!' : 'Copy ID'}</button>
            </div>
            <pre className={styles.modalCode}>{selected.code || '— empty —'}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
