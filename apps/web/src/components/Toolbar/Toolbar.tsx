import { useRef, useState, useEffect } from 'react';
import { EXAMPLES } from '@pseudorun/core';
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

      {/* ── Report bug ── */}
      <button
        className={styles.reportBugButton}
        onClick={handleReportBug}
        title="Report a Bug"
      >
        Bug Report
      </button>

      <a
        href="https://discord.gg/qmgmQSRcv"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.discordButton}
        title="Join our Discord community"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className={styles.discordIcon}>
          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.085 2.157 2.419 0 1.333-.956 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.085 2.157 2.419 0 1.333-.946 2.419-2.157 2.419z"/>
        </svg>
        Discord
      </a>

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
