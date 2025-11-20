/**
 * Landing Page
 * Shown to unauthenticated users
 */

import { useState } from 'react';
import AuthModal from '../Auth/AuthModal';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Landing.module.css';

export default function Landing() {
  const [showAuth, setShowAuth] = useState(false);
  const { setGuestMode } = useAuth();

  const handleTryNow = () => {
    setGuestMode(true);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.appTitle}>PseudoRun</h1>
        <div className={styles.badgesContainer}>
          <a
            href="https://fazier.com/launches/pseudorun"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.fazierBadge}
          >
            <img
              src="https://fazier.com/api/v1/public/badges/embed_image.svg?launch_id=5789&badge_type=monthly&theme=light"
              width={250}
            height={54}
              alt="Fazier badge"
            />
          </a>
        </div>
      </div>
      <div className={styles.hero}>
        <div className={styles.badge}>The #1 IGCSE Pseudocode Tool</div>

        <h1 className={styles.title}>
          Master IGCSE Pseudocode with
          <span className={styles.highlight}> PseudoRun</span>
        </h1>

        <p className={styles.subtitle}>
          The #1 free online IGCSE pseudocode editor and simulator designed for Computer Science students.
          Write, debug, and practice pseudocode with real-time validation to ace your exams.
        </p>

        <div className={styles.ctaGroup}>
          <button onClick={() => setShowAuth(true)} className={styles.ctaButton}>
            Start Coding Free
            <span className={styles.arrow}>→</span>
          </button>
          <button onClick={handleTryNow} className={styles.tryNowButton}>
            Try Now without Login
          </button>
          <p className={styles.note}>No credit card required • Get started in 30 seconds</p>
        </div>

        <div className={styles.features}>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>
              <span className={styles.iconEmoji}>✓</span>
            </div>
            <h3>IGCSE Exam Focused</h3>
            <p>100% aligned with Cambridge IGCSE Computer Science pseudocode specifications and exam patterns</p>
          </div>

          <div className={styles.feature}>
            <div className={styles.featureIcon}>
              <span className={styles.iconEmoji}>⚡</span>
            </div>
            <h3>Real-Time Validation</h3>
            <p>Instant syntax checking and error detection to help you write perfect IGCSE pseudocode</p>
          </div>

          <div className={styles.feature}>
            <div className={styles.featureIcon}>
              <span className={styles.iconEmoji}>🐛</span>
            </div>
            <h3>Step-by-Step Debugger</h3>
            <p>Master IGCSE algorithms with line-by-line execution and variable tracking for deeper understanding</p>
          </div>

          <div className={styles.feature}>
            <div className={styles.featureIcon}>
              <span className={styles.iconEmoji}>💾</span>
            </div>
            <h3>Free Cloud Storage</h3>
            <p>Save unlimited IGCSE pseudocode programs and access them from any device for exam preparation</p>
          </div>

          <div className={styles.feature}>
            <div className={styles.featureIcon}>
              <span className={styles.iconEmoji}>📚</span>
            </div>
            <h3>IGCSE Practice Problems</h3>
            <p>50+ IGCSE-style examples and exercises covering loops, arrays, procedures, and exam topics</p>
          </div>

          <div className={styles.feature}>
            <div className={styles.featureIcon}>
              <span className={styles.iconEmoji}>🎯</span>
            </div>
            <h3>Exam Mode Timer</h3>
            <p>Practice under timed conditions to build speed and confidence for your IGCSE Computer Science exams</p>
          </div>
        </div>

        <div className={styles.testimonials}>
          <div className={styles.testimonial}>
            <p className={styles.quote}>"PseudoRun helped me score 95% on my IGCSE Computer Science exam! The IGCSE pseudocode practice was perfect."</p>
            <p className={styles.author}>— Sarah K., IGCSE Student</p>
          </div>
          <div className={styles.testimonial}>
            <p className={styles.quote}>"The best IGCSE pseudocode editor I've found. Perfect for understanding algorithms and preparing for practical exams."</p>
            <p className={styles.author}>— Michael T., Computer Science Student</p>
          </div>
        </div>

        <div className={styles.finalCta}>
          <h2>Join 10,000+ IGCSE Students mastering pseudocode with PseudoRun</h2>
          <p className={styles.subtitle}>Start your journey to IGCSE Computer Science exam success today</p>
          <button onClick={() => setShowAuth(true)} className={styles.ctaButtonSecondary}>
            Start Free IGCSE Pseudocode Practice
          </button>
        </div>
      </div>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </div>
  );
}
