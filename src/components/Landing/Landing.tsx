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
      {/* Nav */}
      <nav className={styles.nav}>
        <span className={styles.logo}>PseudoRun</span>
        <button
          onClick={() => setShowAuth(true)}
          className={styles.signInLink}
        >
          Sign in
        </button>
      </nav>

      {/* Hero */}
      <section className={styles.hero}>
        <span className={styles.label}>Free &amp; open for IGCSE students</span>
        <h1 className={styles.heading}>
          Write pseudocode.{'\n'}Run it instantly.
        </h1>
        <p className={styles.subtext}>
          A free editor built for Cambridge IGCSE Computer Science.
          Write, run, and debug pseudocode — no setup, no ads, no paywalls.
        </p>
        <div className={styles.buttons}>
          <button
            onClick={() => setShowAuth(true)}
            className={styles.primaryBtn}
          >
            Open editor
          </button>
          <button onClick={handleTryNow} className={styles.secondaryBtn}>
            Try without account
          </button>
        </div>
      </section>

      {/* Code Preview */}
      <section className={styles.codePreview}>
        <div className={styles.codeWindow}>
          <div className={styles.windowChrome}>
            <span className={styles.dot} data-color="red" />
            <span className={styles.dot} data-color="yellow" />
            <span className={styles.dot} data-color="green" />
          </div>
          <pre className={styles.codeBlock}>
            <code>
              <span className={styles.keyword}>DECLARE</span>{' '}
              <span className={styles.variable}>Count</span>{' '}
              <span className={styles.punctuation}>:</span>{' '}
              <span className={styles.type}>INTEGER</span>
              {'\n'}
              <span className={styles.keyword}>FOR</span>{' '}
              <span className={styles.variable}>Count</span>{' '}
              <span className={styles.punctuation}>←</span>{' '}
              <span className={styles.number}>1</span>{' '}
              <span className={styles.keyword}>TO</span>{' '}
              <span className={styles.number}>10</span>
              {'\n'}
              {'    '}
              <span className={styles.keyword}>IF</span>{' '}
              <span className={styles.variable}>Count</span>{' '}
              <span className={styles.keyword}>MOD</span>{' '}
              <span className={styles.number}>2</span>{' '}
              <span className={styles.punctuation}>=</span>{' '}
              <span className={styles.number}>0</span>{' '}
              <span className={styles.keyword}>THEN</span>
              {'\n'}
              {'        '}
              <span className={styles.keyword}>OUTPUT</span>{' '}
              <span className={styles.variable}>Count</span>
              <span className={styles.punctuation}>,</span>{' '}
              <span className={styles.string}>" is even"</span>
              {'\n'}
              {'    '}
              <span className={styles.keyword}>ENDIF</span>
              {'\n'}
              <span className={styles.keyword}>NEXT</span>{' '}
              <span className={styles.variable}>Count</span>
            </code>
          </pre>
        </div>
      </section>

      {/* Features */}
      <section className={styles.features}>
        <article className={styles.featureCard}>
          <h3 className={styles.featureTitle}>Runs in your browser</h3>
          <p className={styles.featureDesc}>
            No downloads. Open the editor and start writing pseudocode immediately.
          </p>
        </article>
        <article className={styles.featureCard}>
          <h3 className={styles.featureTitle}>Built for IGCSE</h3>
          <p className={styles.featureDesc}>
            Aligned with Cambridge IGCSE pseudocode syntax. Practice exactly what's on the exam.
          </p>
        </article>
        <article className={styles.featureCard}>
          <h3 className={styles.featureTitle}>Step-through debugger</h3>
          <p className={styles.featureDesc}>
            Execute line by line. Watch variables change. Understand how your code actually works.
          </p>
        </article>
        <article className={styles.featureCard}>
          <h3 className={styles.featureTitle}>Save your work</h3>
          <p className={styles.featureDesc}>
            Sign in to save programs to the cloud. Access them from any device.
          </p>
        </article>
      </section>

      {/* Why this exists */}
      <section className={styles.whySection}>
        <h2 className={styles.whyHeading}>Why this exists</h2>
        <p className={styles.whyText}>
          I built PseudoRun because every pseudocode tool I found was either
          buried in ads or locked behind a paywall. This is free, and it stays free.
        </p>
        <a
          href="https://crypt0phage.gumroad.com/coffee"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.supportLink}
        >
          Support the project →
        </a>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <p className={styles.footerText}>Built for students, not for profit.</p>
        <div className={styles.badges}>
          <a
            href="https://fazier.com/launches/pseudorun"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="https://fazier.com/api/v1/public/badges/embed_image.svg?launch_id=5789&badge_type=monthly&theme=light"
              alt="Fazier badge"
              height={32}
            />
          </a>
          <a
            href="https://launchigniter.com/product/pseudorun?ref=badge-pseudorun"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="https://launchigniter.com/api/badge/pseudorun?theme=light"
              alt="Featured on LaunchIgniter"
              height={32}
            />
          </a>
          <a
            href="https://twelve.tools"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="https://twelve.tools/badge3-dark.svg"
              alt="Featured on Twelve Tools"
              height={32}
            />
          </a>
        </div>
      </footer>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </div>
  );
}
