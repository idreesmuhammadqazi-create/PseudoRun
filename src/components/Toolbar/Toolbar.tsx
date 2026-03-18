import { useRef, useState, useEffect } from 'react';
import { EXAMPLES } from '../../constants/examples';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import BugReportModal from '../BugReport/BugReportModal';
import styles from './Toolbar.module.css';

interface ToolbarProps {
  onRun: () => void;
  onDebug: () => void;
  onClear: () => void;
  onDownload: () => void;
  onUpload: (file: File) => void;
  onLoadExample: (exampleCode: string) => void;
  onSaveAs: () => void;
  onOpenLibrary: () => void;
  onShare: () => void;
  onExport: () => void;
  onOpenAuth: () => void;
  onOpenTutorial: () => void;
  onOpenSyntaxReference: () => void;
  onOpenPracticeProblems: () => void;
  onOpenExamMode: () => void;
  // onOpenLearningTools: () => void;
  isRunning: boolean;
  examModeActive: boolean;
}

export default function Toolbar({
  onRun,
  onDebug,
  onClear,
  onDownload,
  onUpload,
  onLoadExample,
  onSaveAs,
  onOpenLibrary,
  onShare,
  onExport,
  onOpenAuth,
  onOpenTutorial,
  onOpenSyntaxReference,
  onOpenPracticeProblems,
  onOpenExamMode,
  // onOpenLearningTools,
  isRunning,
  examModeActive
}: ToolbarProps) {
  const { currentUser, logout, isGuestMode } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showExamplesMenu, setShowExamplesMenu] = useState(false);
  const [showBugReportModal, setShowBugReportModal] = useState(false);
  const examplesRef = useRef<HTMLDivElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
      // Reset input so same file can be selected again
      e.target.value = '';
    }
  };

  const handleExampleClick = (code: string) => {
    setShowExamplesMenu(false);
    onLoadExample(code);
  };

  const handleLogout = async () => {
    // If in guest mode, clicking "Login" opens auth modal
    if (isGuestMode) {
      onOpenAuth();
      return;
    }

    // Otherwise, normal logout
    if (confirm('Are you sure you want to logout?')) {
      try {
        await logout();
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
  };

  const handleReportBug = () => {
    setShowBugReportModal(true);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (examplesRef.current && !examplesRef.current.contains(event.target as Node)) {
        setShowExamplesMenu(false);
      }
    };

    if (showExamplesMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showExamplesMenu]);

  return (
    <div className={styles.toolbar}>
      {/* ── Execution group ── */}
      <button
        className={styles.runButton}
        onClick={onRun}
        disabled={isRunning}
      >
        Run
      </button>

      <button
        className={styles.debugButton}
        onClick={onDebug}
        disabled={isRunning}
      >
        Debug
      </button>

      <div className={styles.separator} />

      {/* ── File operations group ── */}
      <button className={styles.secondaryButton} onClick={onClear}>
        Clear
      </button>

      <button className={styles.secondaryButton} onClick={onDownload}>
        Download
      </button>

      <button className={styles.secondaryButton} onClick={handleUploadClick}>
        Upload
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept=".txt"
        onChange={handleFileChange}
        className={styles.fileInput}
      />

      <button className={styles.secondaryButton} onClick={onExport}>
        Export
      </button>

      <div className={styles.examplesContainer} ref={examplesRef}>
        <button
          className={styles.secondaryButton}
          onClick={() => setShowExamplesMenu(!showExamplesMenu)}
          disabled={examModeActive}
        >
          Examples ▼
        </button>

        {showExamplesMenu && (
          <div className={styles.dropdown}>
            {EXAMPLES.map((example, index) => (
              <div
                key={index}
                className={styles.dropdownItem}
                onClick={() => handleExampleClick(example.code)}
              >
                {example.title}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={styles.separator} />

      {/* ── Learning group ── */}
      <button
        className={styles.secondaryButton}
        onClick={onOpenTutorial}
        title="Interactive Tutorial"
      >
        Tutorial
      </button>

      <button
        className={styles.secondaryButton}
        onClick={onOpenSyntaxReference}
        disabled={examModeActive}
        title="Syntax Reference"
      >
        Syntax
      </button>

      <button
        className={styles.secondaryButton}
        onClick={onOpenPracticeProblems}
        disabled={examModeActive}
        title="Practice Problems"
      >
        Practice
      </button>

      <button
        className={styles.secondaryButton}
        onClick={onOpenExamMode}
        disabled={examModeActive}
        title="Start Exam Mode"
      >
        Exam
      </button>

      <div className={styles.separator} />

      {/* ── Save / share group ── */}
      {!isGuestMode && currentUser?.emailVerified && (
        <>
          <button className={styles.secondaryButton} onClick={onSaveAs}>
            Save
          </button>

          <button className={styles.secondaryButton} onClick={onShare}>
            Share
          </button>

          <button className={styles.secondaryButton} onClick={onOpenLibrary}>
            Programs
          </button>

          <div className={styles.separator} />
        </>
      )}

      {/* ── Bug report ── */}
      <button
        className={styles.reportBugButton}
        onClick={handleReportBug}
        title="Report a Bug"
      >
        Bug Report
      </button>

      <div className={styles.separator} />

      {/* ── Right-aligned: theme, user ── */}
      <button
        className={styles.themeToggle}
        onClick={toggleTheme}
        title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme === 'light' ? 'Dark' : 'Light'}
      </button>

      <div className={styles.userSection}>
        <span className={styles.userName}>
          {isGuestMode ? 'Guest' : (currentUser?.displayName || currentUser?.email)}
        </span>
        <button className={styles.logoutButton} onClick={handleLogout}>
          {isGuestMode ? 'Login' : 'Logout'}
        </button>
      </div>

      {showBugReportModal && (
        <BugReportModal onClose={() => setShowBugReportModal(false)} />
      )}
    </div>
  );
}
