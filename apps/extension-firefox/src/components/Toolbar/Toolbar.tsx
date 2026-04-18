import { useRef, useState, useEffect } from 'react';
import { EXAMPLES } from '@pseudorun/core';
import { useTheme } from '../../contexts/ThemeContext';
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
  onOpenLearningTools: () => void;
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
  onOpenAuth: _onOpenAuth, // Prefix with underscore to mark as unused
  onOpenTutorial,
  onOpenSyntaxReference,
  onOpenPracticeProblems,
  onOpenExamMode,
  onOpenLearningTools,
  isRunning,
  examModeActive
}: ToolbarProps) {
  const { theme, toggleTheme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showExamplesMenu, setShowExamplesMenu] = useState(false);
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
        🐛 Debug
      </button>

      <button className={styles.secondaryButton} onClick={onClear}>
        Clear
      </button>

      <button className={styles.secondaryButton} onClick={onDownload}>
        Download
      </button>

      <button className={styles.secondaryButton} onClick={onExport}>
        📤 Export
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

      <button 
        className={styles.secondaryButton} 
        onClick={onOpenTutorial}
        title="Interactive Tutorial"
      >
        📚 Tutorial
      </button>

      <button 
        className={styles.secondaryButton} 
        onClick={onOpenSyntaxReference}
        disabled={examModeActive}
        title="Syntax Reference"
      >
        📖 Syntax
      </button>

      <button 
        className={styles.secondaryButton} 
        onClick={onOpenPracticeProblems}
        disabled={examModeActive}
        title="Practice Problems"
      >
        🎯 Practice
      </button>

      <button
        className={styles.secondaryButton}
        onClick={onOpenLearningTools}
        title="Code Analysis & Tips"
      >
        💡 Analyze
      </button>

      <button
        className={styles.secondaryButton}
        onClick={onOpenExamMode}
        disabled={examModeActive}
        title="Start Exam Mode"
      >
        ⏱️ Exam Mode
      </button>

      {/* Offline mode - show local save and library features */}
      <button className={styles.secondaryButton} onClick={onSaveAs}>
        💾 Save As
      </button>

      <button className={styles.secondaryButton} onClick={onShare} disabled title="Share feature not available offline">
        🔗 Share
      </button>

      <button className={styles.secondaryButton} onClick={onOpenLibrary}>
        📂 My Programs
      </button>

      <button 
        className={styles.themeToggle}
        onClick={toggleTheme}
        title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme === 'light' ? '🌙' : '☀️'}
      </button>

      <div className={styles.userSection}>
        <span className={styles.userName}>
          Guest (Offline Mode)
        </span>
      </div>

      <a
        href="https://fazier.com/launches/pseudorun"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.fazierBadge}
      >
        <img
          src={`https://fazier.com/api/v1/public/badges/embed_image.svg?launch_id=5789&badge_type=monthly&theme=${theme === 'dark' ? 'dark' : 'light'}`}
          width={250}
          height={54}
          alt="Fazier badge"
        />
      </a>
    </div>
  );
}
