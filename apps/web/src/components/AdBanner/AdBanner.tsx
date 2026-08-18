/**
 * Ad Banner
 * Dismissible promotion banner for partner sites
 */

import { useState } from 'react';
import styles from './AdBanner.module.css';

const AD_URL = 'https://test.learningaide.ai';
const AD_STORAGE_KEY = 'pseudorun_ad_banner_dismissed';

export default function AdBanner() {
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem(AD_STORAGE_KEY) === 'true'
  );

  if (dismissed) {
    return null;
  }

  const handleDismiss = () => {
    localStorage.setItem(AD_STORAGE_KEY, 'true');
    setDismissed(true);
  };

  return (
    <div className={styles.banner} role="complementary" aria-label="Advertisement">
      <span className={styles.badge}>AD</span>
      <div className={styles.text}>
        <strong>Got your Cambridge marks script?</strong>
        <span>
          Get your exam scripts rechecked by experienced teachers — fast and friendly.
        </span>
      </div>
      <a
        href={AD_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.link}
      >
        Try LearningAide
      </a>
      <button
        onClick={handleDismiss}
        className={styles.close}
        aria-label="Dismiss advertisement"
      >
        ×
      </button>
    </div>
  );
}