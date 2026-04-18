/**
 * Share Modal Component
 * Displays shareable link with copy functionality
 */

import React, { useState } from 'react';
import styles from './ShareModal.module.css';

interface ShareModalProps {
  shareUrl: string;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ shareUrl, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
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
        <header className={styles.header}>
          <h2 className={styles.title}>Share Your Code</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </header>

        <div className={styles.content}>
          <p className={styles.description}>
            Anyone with this link can view your code. The link will expire in 90 days.
          </p>

          <div className={styles.urlContainer}>
            <input
              type="text"
              value={shareUrl}
              readOnly
              className={styles.urlInput}
            />
            <button
              className={styles.copyButton}
              onClick={handleCopy}
            >
              {copied ? '✓ Copied!' : 'Copy'}
            </button>
          </div>

          <div className={styles.socialShare}>
            <p className={styles.shareLabel}>Share via:</p>
            <div className={styles.socialButtons}>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialButton}
                title="Share on WhatsApp"
              >
                WhatsApp
              </a>
              <a
                href={`mailto:?subject=Check out my pseudocode&body=${encodeURIComponent(shareUrl)}`}
                className={styles.socialButton}
                title="Share via Email"
              >
                Email
              </a>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent('Check out my pseudocode: ' + shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialButton}
                title="Share on Twitter"
              >
                Twitter
              </a>
            </div>
          </div>
        </div>

        <footer className={styles.footer}>
          <button className={styles.doneButton} onClick={onClose}>
            Done
          </button>
        </footer>
      </div>
    </div>
  );
};
