/**
 * Landing Page — "Midnight Workshop" redesign
 * Warm dark aesthetic, left-aligned hero, split IDE demo
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
        <span className={styles.logo}>
          PseudoRun<span className={styles.cursor}>_</span>
        </span>
        <button
          onClick={() => setShowAuth(true)}
          className={styles.signInBtn}
        >
          Sign in
        </button>
      </nav>

      {/* Hero */}
      <section className={styles.hero}>
        <span className={styles.label}>for IGCSE Computer Science</span>
        <h1 className={styles.heading}>
          {'The pseudocode editor\nthat actually runs your code.'}
        </h1>
        <p className={styles.subtext}>
          Write Cambridge IGCSE pseudocode in a real editor with syntax
          highlighting, step-through debugging, and instant execution. Free
          forever.
        </p>
        <div className={styles.buttons}>
          <button
            onClick={() => setShowAuth(true)}
            className={styles.primaryBtn}
          >
            Open editor &rarr;
          </button>
          <button onClick={handleTryNow} className={styles.ghostBtn}>
            Try without signing up
          </button>
          <a
            href="https://discord.gg/qmgmQSRcv"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.discordBtn}
          >
            Join Discord
          </a>
        </div>
      </section>

      {/* Split Demo */}
      <section className={styles.demo}>
        <div className={styles.demoContainer}>
          <div className={styles.windowChrome}>
            <span className={styles.dot} data-color="red" />
            <span className={styles.dot} data-color="yellow" />
            <span className={styles.dot} data-color="green" />
          </div>
          <div className={styles.panels}>
            {/* Editor Panel */}
            <div className={styles.panel}>
              <div className={styles.panelTab}>editor.pseudo</div>
              <pre className={styles.codeBlock}>
                <code>
                  <span className={styles.lineNum}>1</span>
                  <span className={styles.keyword}>DECLARE</span>{' '}
                  <span className={styles.variable}>Count</span>{' '}
                  <span className={styles.punctuation}>:</span>{' '}
                  <span className={styles.type}>INTEGER</span>
                  {'\n'}
                  <span className={styles.lineNum}>2</span>
                  <span className={styles.keyword}>FOR</span>{' '}
                  <span className={styles.variable}>Count</span>{' '}
                  <span className={styles.punctuation}>&larr;</span>{' '}
                  <span className={styles.number}>1</span>{' '}
                  <span className={styles.keyword}>TO</span>{' '}
                  <span className={styles.number}>10</span>
                  {'\n'}
                  <span className={styles.lineNum}>3</span>
                  {'  '}
                  <span className={styles.keyword}>IF</span>{' '}
                  <span className={styles.variable}>Count</span>{' '}
                  <span className={styles.keyword}>MOD</span>{' '}
                  <span className={styles.number}>2</span>{' '}
                  <span className={styles.punctuation}>=</span>{' '}
                  <span className={styles.number}>0</span>{' '}
                  <span className={styles.keyword}>THEN</span>
                  {'\n'}
                  <span className={styles.lineNum}>4</span>
                  {'    '}
                  <span className={styles.keyword}>OUTPUT</span>{' '}
                  <span className={styles.variable}>Count</span>
                  <span className={styles.punctuation}>,</span>{' '}
                  <span className={styles.string}>" is even"</span>
                  {'\n'}
                  <span className={styles.lineNum}>5</span>
                  {'  '}
                  <span className={styles.keyword}>ENDIF</span>
                  {'\n'}
                  <span className={styles.lineNum}>6</span>
                  <span className={styles.keyword}>NEXT</span>{' '}
                  <span className={styles.variable}>Count</span>
                </code>
              </pre>
            </div>

            {/* Output Panel */}
            <div className={styles.panel}>
              <div className={styles.panelTab}>output</div>
              <pre className={styles.outputBlock}>
                <code className={styles.outputText}>
                  {'2 is even\n4 is even\n6 is even\n8 is even\n10 is even'}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className={styles.features}>
        <div className={styles.divider} />
        <div className={styles.featureGrid}>
          <div className={styles.feature}>
            <h3 className={styles.featureTitle}>Cambridge IGCSE syntax</h3>
            <p className={styles.featureDesc}>
              Follows the exact pseudocode specification. No guessing what's
              valid.
            </p>
          </div>
          <div className={styles.feature}>
            <h3 className={styles.featureTitle}>Line-by-line debugger</h3>
            <p className={styles.featureDesc}>
              Step through execution, inspect variables, understand control flow.
            </p>
          </div>
          <div className={styles.feature}>
            <h3 className={styles.featureTitle}>Cloud saves</h3>
            <p className={styles.featureDesc}>
              Sign in to save your work. Pick up where you left off on any
              device.
            </p>
          </div>
        </div>
      </section>

      {/* Why free? */}
      <section className={styles.whySection}>
        <h2 className={styles.whyHeading}>Why is this free?</h2>
        <p className={styles.whyText}>
          I was tired of pseudocode tools covered in ads or locked behind
          subscriptions. PseudoRun is a side project — it costs almost nothing to
          run and I want students to have something that just works.
        </p>
        <p className={styles.whyText}>
          If you find it useful,{' '}
          <a
            href="https://crypt0phage.gumroad.com/coffee"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.coffeeLink}
          >
            buy me a coffee
          </a>{' '}
          — it keeps the servers running.
        </p>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.badges}>
          <a
            href="https://fazier.com/launches/pseudorun"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="https://fazier.com/api/v1/public/badges/embed_image.svg?launch_id=5789&badge_type=monthly&theme=light"
              alt="Fazier badge"
              height={36}
            />
          </a>
          <a
            href="https://frogdr.com/pseudorun.tech?utm_source=pseudorun.tech"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="https://frogdr.com/pseudorun.tech/badge-white.svg"
              alt="FrogDR badge"
              height={36}
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
              height={36}
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
              height={36}
            />
          </a>
          <a
            href="https://wired.business"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="https://wired.business/badge3-light.svg"
              alt="Featured on Wired Business"
              height={36}
            />
          </a>
          <a
            href="https://findly.tools/pseudorun?utm_source=www.pseudorun.tech"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="https://findly.tools/badges/findly-tools-badge-light.svg"
              alt="Featured on findly.tools"
              height={36}
            />
          </a>
          <a
            href="https://ufind.best/products/pseudorun?utm_source=www.pseudorun.tech"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="https://ufind.best/badges/ufind-best-badge-light.svg"
              alt="Featured on ufind.best"
              height={36}
            />
          </a>
          <a
            href="https://dofollow.tools"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="https://dofollow.tools/badge/badge_light.svg"
              alt="Featured on Dofollow.Tools"
              height={36}
            />
          </a>
          <a
            href="https://launch-list.org/product/pseudorun"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="https://launch-list.org/badges/svg/launch_list_badge_live.svg"
              alt="Featured on Launch List"
              height={36}
            />
          </a>
          <a
            href="https://turbo0.com/item/pseudorun"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="https://img.turbo0.com/badge-listed-light.svg"
              alt="Featured on Turbo0"
              height={36}
            />
          </a>
          <a
            href="https://startupfa.me/s/pseudorun?utm_source=www.pseudorun.tech"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="https://startupfa.me/badges/featured-badge.webp"
              alt="Featured on Startup Fame"
              height={36}
            />
          </a>
          <a
            href="https://fwfw.app/item/pseudorun"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="https://fwfw.app/badge-white.svg"
              alt="Featured on FWFW"
              height={36}
            />
          </a>
          <a
            href="https://submithunt.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="https://submithunt.com/badge.png"
              alt="Featured on SubmitHunt"
              height={36}
            />
          </a>
          <a
            href="https://saasfame.com/item/pseudorun"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="https://saasfame.com/badge-light.svg"
              alt="Featured on SaasFame"
              height={36}
            />
          </a>
          <a
            href="https://toolfame.com/item/pseudorun"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="https://toolfame.com/badge-light.svg"
              alt="Featured on ToolFame"
              height={36}
            />
          </a>
        </div>
        <p className={styles.copyright}>&copy; 2025 PseudoRun</p>
      </footer>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </div>
  );
}
