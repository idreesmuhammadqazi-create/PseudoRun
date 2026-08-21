/**
 * Ad Banner
 * Compact dismissible promotion banner for LearningAide
 */

import { useEffect, useState } from 'react';
import styles from './AdBanner.module.css';
import { trackAdView, trackAdClick } from '../../services/adAnalyticsService';

const AD_URL = 'https://recheck.learningaide.ai?ref=PseudoRun';
const AD_STORAGE_KEY = 'pseudorun_ad_banner_dismissed';

function AideLogo() {
  return (
    <svg className={styles.logo} width="22" height="22" viewBox="0 0 44 44" fill="none" aria-hidden="true">
      <path d="M22 6L34 38H27.5L22 22L16.5 38H10Z" fill="currentColor" />
      <path d="M13 29H31" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.2" />
      <path d="M29 26L34 20" stroke="#0DB763" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export default function AdBanner() {
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem(AD_STORAGE_KEY) === 'true'
  );

  useEffect(() => {
    if (!dismissed) {
      trackAdView();
    }
  }, [dismissed]);

  if (dismissed) {
    return null;
  }

  const handleDismiss = () => {
    localStorage.setItem(AD_STORAGE_KEY, 'true');
    setDismissed(true);
  };

  const handleClick = () => {
    trackAdClick();
  };

  return (
    <div className={styles.banner} role="complementary" aria-label="Advertisement">
      <div className={styles.brand}>
        <AideLogo />
        <span className={styles.brandText}>
          AIDE<span>AI</span>
        </span>
      </div>
      <p className={styles.text}>
        Think your Cambridge script was under-marked? Get an AI re-grade before paying for a recheck.
      </p>
      <a
        href={AD_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.link}
        onClick={handleClick}
      >
        Recheck your paper
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