/**
 * Export Modal Component
 * Allows users to export code as PDF, PNG, or print
 */

import React, { useState } from 'react';
import { exportAsPDF, exportAsPNG, printCode } from '../../services/exportService';
import { useTheme } from '../../contexts/ThemeContext';
import styles from './ExportModal.module.css';

interface ExportModalProps {
  code: string;
  programName?: string;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ code, programName, onClose }) => {
  const { theme } = useTheme();
  const [exporting, setExporting] = useState(false);
  const [title, setTitle] = useState(programName || 'Pseudocode');
  const [includeLineNumbers, setIncludeLineNumbers] = useState(true);
  const [fontSize, setFontSize] = useState(12);
  const [exportTheme, setExportTheme] = useState<'light' | 'dark'>(theme);

  const handleExport = async (format: 'pdf' | 'png' | 'print') => {
    if (!code.trim()) {
      alert('Cannot export empty code');
      return;
    }

    setExporting(true);

    try {
      const options = {
        title,
        includeLineNumbers,
        fontSize,
        theme: exportTheme
      };

      switch (format) {
        case 'pdf':
          await exportAsPDF(code, options);
          break;
        case 'png':
          await exportAsPNG(code, options);
          break;
        case 'print':
          printCode(code, options);
          break;
      }

      // Don't close on print, as user might want to adjust settings
      if (format !== 'print') {
        setTimeout(() => {
          onClose();
        }, 500);
      }
    } catch (error) {
      console.error('Export error:', error);
      alert(`Failed to export as ${format.toUpperCase()}. Please try again.`);
    } finally {
      setExporting(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>Export Code</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.section}>
            <label className={styles.label}>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={styles.input}
              placeholder="Enter title..."
            />
          </div>

          <div className={styles.section}>
            <label className={styles.label}>Options</label>

            <div className={styles.checkbox}>
              <input
                type="checkbox"
                id="lineNumbers"
                checked={includeLineNumbers}
                onChange={(e) => setIncludeLineNumbers(e.target.checked)}
              />
              <label htmlFor="lineNumbers">Include line numbers</label>
            </div>
          </div>

          <div className={styles.section}>
            <label className={styles.label}>Font Size: {fontSize}px</label>
            <input
              type="range"
              min="10"
              max="16"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className={styles.slider}
            />
          </div>

          <div className={styles.section}>
            <label className={styles.label}>Theme</label>
            <div className={styles.themeButtons}>
              <button
                className={`${styles.themeButton} ${exportTheme === 'light' ? styles.active : ''}`}
                onClick={() => setExportTheme('light')}
              >
                ☀️ Light
              </button>
              <button
                className={`${styles.themeButton} ${exportTheme === 'dark' ? styles.active : ''}`}
                onClick={() => setExportTheme('dark')}
              >
                🌙 Dark
              </button>
            </div>
          </div>

          <div className={styles.preview}>
            <p className={styles.previewLabel}>Preview:</p>
            <div className={styles.previewBox}>
              <div className={styles.previewTitle}>{title}</div>
              <div className={styles.previewCode}>
                {includeLineNumbers && '1 | '}
                {code.split('\n')[0] || '// Your code here'}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <button
            className={styles.exportButton}
            onClick={() => handleExport('pdf')}
            disabled={exporting}
          >
            📄 Export as PDF
          </button>
          <button
            className={styles.exportButton}
            onClick={() => handleExport('png')}
            disabled={exporting}
          >
            🖼️ Export as Image
          </button>
          <button
            className={styles.exportButton}
            onClick={() => handleExport('print')}
            disabled={exporting}
          >
            🖨️ Print
          </button>
        </div>
      </div>
    </div>
  );
};
