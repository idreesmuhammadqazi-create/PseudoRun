/**
 * Trying To Get Backlinks Page
 * A simple page for link building efforts
 */

import { useEffect } from 'react';
import SEOManager from '../SEOManager/SEOManager';
import styles from './TryingToGetBacklinks.module.css';

export default function TryingToGetBacklinks() {
  // Set page title
  useEffect(() => {
    document.title = 'PseudoRun - Connect With Us';
  }, []);

  return (
    <div className={styles.container}>
      <SEOManager feature="landing" />

      <div className={styles.content}>
        <h1 className={styles.title}>Connect With PseudoRun</h1>
        <p className={styles.description}>
          The #1 free IGCSE pseudocode editor for Computer Science students.
        </p>

        <div className={styles.linkSection}>
          <h2>🔗 Connect With Us</h2>
          <p>Find all our links and connect with us on various platforms:</p>

          <a
            href="https://linktr.ee/pseudorun"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.mainLink}
          >
            <div className={styles.linkContent}>
              <span className={styles.linkIcon}>🔗</span>
              <div className={styles.linkText}>
                <h3>linktr.ee/pseudorun</h3>
                <p>All our social links, resources, and connections in one place</p>
              </div>
            </div>
          </a>
        </div>

        <div className={styles.featuresSection}>
          <h2>Why PseudoRun?</h2>
          <div className={styles.features}>
            <div className={styles.feature}>
              <h3>🎯 IGCSE Focused</h3>
              <p>100% aligned with Cambridge IGCSE Computer Science specifications</p>
            </div>
            <div className={styles.feature}>
              <h3>💯 Ad-Free</h3>
              <p>Zero ads, forever. Focus on learning without distractions</p>
            </div>
            <div className={styles.feature}>
              <h3>⚡ Real-Time Validation</h3>
              <p>Instant syntax checking and error detection</p>
            </div>
            <div className={styles.feature}>
              <h3>🐛 Step-by-Step Debugger</h3>
              <p>Master algorithms with line-by-line execution</p>
            </div>
            <div className={styles.feature}>
              <h3>📚 Practice Problems</h3>
              <p>50+ IGCSE-style examples and exercises</p>
            </div>
            <div className={styles.feature}>
              <h3>💾 Free Cloud Storage</h3>
              <p>Save unlimited programs and access anywhere</p>
            </div>
          </div>
        </div>

        <div className={styles.ctaSection}>
          <a href="/" className={styles.backButton}>
            ← Back to PseudoRun
          </a>
        </div>
      </div>
    </div>
  );
}