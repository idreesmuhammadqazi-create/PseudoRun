/**
 * Admin Dashboard
 * Dedicated admin interface for viewing all programs and stats
 */

import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getAllProgramsSDK, getStatsSDK, getUserEmail } from '../../services/adminServiceSDK';
import { Program } from '../../types/program';
import { AdminStats } from '../../types/admin';
import styles from './AdminDashboard.module.css';

type TabType = 'dashboard' | 'programs';

export default function AdminDashboard() {
  const { currentUser, isAdmin } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [displayedPrograms, setDisplayedPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [userFilter, setUserFilter] = useState('');
  const [programsToShow, setProgramsToShow] = useState(20);
  const [userEmails, setUserEmails] = useState<Map<string, string>>(new Map());

  // Check admin authorization
  useEffect(() => {
    async function checkAdminStatus() {
      if (!currentUser) {
        setIsAuthorized(false);
        setLoading(false);
        return;
      }

      try {
        const adminStatus = await isAdmin();
        setIsAuthorized(adminStatus);
        if (adminStatus) {
          await loadData();
        }
      } catch (err) {
        console.error('Error checking admin status:', err);
        setIsAuthorized(false);
      } finally {
        setLoading(false);
      }
    }

    checkAdminStatus();
  }, [currentUser, isAdmin]);

  // Load stats and programs
  async function loadData() {
    try {
      setError('');

      const [statsData, programsData] = await Promise.all([
        getStatsSDK(),
        getAllProgramsSDK()
      ]);

      setStats(statsData);
      setPrograms(programsData);
      setDisplayedPrograms(programsData.slice(0, programsToShow));

      // Fetch user emails for all unique userIds
      const uniqueUserIds = new Set(programsData.map(p => p.userId));
      const emailMap = new Map<string, string>();

      for (const uid of uniqueUserIds) {
        const email = await getUserEmail(uid);
        if (email) {
          emailMap.set(uid, email);
        }
      }

      setUserEmails(emailMap);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Failed to load admin data');
      console.error('Error loading admin data:', err);
      setLoading(false);
    }
  }

  // Filter programs based on search term and user filter
  useEffect(() => {
    let filtered = programs;

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(program =>
        program.name.toLowerCase().includes(term)
      );
    }

    // Filter by user
    if (userFilter) {
      const term = userFilter.toLowerCase();
      filtered = filtered.filter(program =>
        program.userId.toLowerCase().includes(term)
      );
    }

    setDisplayedPrograms(filtered.slice(0, programsToShow));
  }, [searchTerm, userFilter, programs, programsToShow]);

  function handleLoadMore() {
    setProgramsToShow(prev => prev + 20);
  }

  function handleViewProgram(program: Program) {
    // For now, just log - will implement navigation in next step
    console.log('View program:', program.id, program.name);
    // TODO: Navigate to program with read-only mode
    window.location.href = `/?programId=${program.id}&readOnly=true`;
  }

  function formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }

  if (loading) {
    return (
      <div className={styles.loading}>
        Loading admin dashboard...
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className={styles.accessDenied}>
        <h2>Access Denied</h2>
        <p>You don't have permission to access the admin dashboard.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Sidebar Navigation */}
      <aside className={styles.sidebar}>
        <h2 className={styles.sidebarTitle}>Admin Panel</h2>
        <nav className={styles.nav}>
          <button
            className={`${styles.navButton} ${activeTab === 'dashboard' ? styles.active : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button
            className={`${styles.navButton} ${activeTab === 'programs' ? styles.active : ''}`}
            onClick={() => setActiveTab('programs')}
          >
            All Programs
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className={styles.content}>
        {error && <div className={styles.error}>{error}</div>}

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && stats && (
          <div className={styles.dashboardTab}>
            <h1>Dashboard</h1>

            {/* Stats Grid */}
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statValue}>{stats.totalUsers}</div>
                <div className={styles.statLabel}>Total Users</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statValue}>{stats.totalPrograms}</div>
                <div className={styles.statLabel}>Total Programs</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statValue}>{stats.activeUsersToday}</div>
                <div className={styles.statLabel}>Active Today</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statValue}>{stats.totalSharedLinks}</div>
                <div className={styles.statLabel}>Shared Links</div>
              </div>
            </div>

            {/* Recent Programs */}
            <h2>Recent Programs</h2>
            <div className={styles.programList}>
              {displayedPrograms.slice(0, 20).map((program) => (
                <div key={program.id} className={styles.programItem}>
                  <div className={styles.programInfo}>
                    <div className={styles.programName}>{program.name}</div>
                    <div className={styles.programUser}>User: {userEmails.get(program.userId) || program.userId}</div>
                    <div className={styles.programDate}>
                      {formatDate(program.updatedAt)}
                    </div>
                  </div>
                  <button
                    className={styles.viewButton}
                    onClick={() => handleViewProgram(program)}
                  >
                    View
                  </button>
                </div>
              ))}
              {displayedPrograms.length === 0 && (
                <div className={styles.noResults}>No programs found</div>
              )}
            </div>
          </div>
        )}

        {/* All Programs Tab */}
        {activeTab === 'programs' && (
          <div className={styles.programsTab}>
            <h1>All Programs</h1>

            {/* Search and Filter */}
            <div className={styles.searchContainer}>
              <input
                type="text"
                placeholder="Search programs by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
              <input
                type="text"
                placeholder="Filter by user ID..."
                value={userFilter}
                onChange={(e) => setUserFilter(e.target.value)}
                className={styles.searchInput}
              />
            </div>

            {/* Program Count */}
            <p className={styles.resultCount}>
              Showing {displayedPrograms.length} of {programs.length} programs
            </p>

            {/* Programs List */}
            <div className={styles.programList}>
              {displayedPrograms.map((program) => (
                <div key={program.id} className={styles.programItem}>
                  <div className={styles.programInfo}>
                    <div className={styles.programName}>{program.name}</div>
                    <div className={styles.programUser}>User: {userEmails.get(program.userId) || program.userId}</div>
                    <div className={styles.programDate}>
                      {formatDate(program.updatedAt)}
                    </div>
                  </div>
                  <button
                    className={styles.viewButton}
                    onClick={() => handleViewProgram(program)}
                  >
                    View
                  </button>
                </div>
              ))}
              {displayedPrograms.length === 0 && (
                <div className={styles.noResults}>No programs found</div>
              )}
            </div>

            {/* Load More Button */}
            {displayedPrograms.length < programs.length && programs.length > programsToShow && (
              <button
                className={styles.loadMoreButton}
                onClick={handleLoadMore}
              >
                Load More Programs
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
