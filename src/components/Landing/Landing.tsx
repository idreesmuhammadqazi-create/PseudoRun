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
      <header className={styles.header}>
        <span className={styles.appTitle}>PseudoRun</span>
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
          <a href="https://frogdr.com/pseudorun.tech?utm_source=pseudorun.tech" target="_blank"><img src="https://frogdr.com/pseudorun.tech/badge-white.svg" alt="Monitor your Domain Rating with FrogDR" width="250" height="54"/></a>
        </div>
      </header>

      <main className={styles.hero}>
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

        <section className={styles.features} aria-label="Key Features">
          <article className={styles.feature}>
            <div className={styles.featureIcon}>
              <span className={styles.iconEmoji}>✓</span>
            </div>
            <h3>IGCSE Exam Focused</h3>
            <p>100% aligned with Cambridge IGCSE Computer Science pseudocode specifications and exam patterns</p>
          </article>

          <article className={styles.feature}>
            <div className={styles.featureIcon}>
              <span className={styles.iconEmoji}>⚡</span>
            </div>
            <h3>Real-Time Validation</h3>
            <p>Instant syntax checking and error detection to help you write perfect IGCSE pseudocode</p>
          </article>

          <article className={styles.feature}>
            <div className={styles.featureIcon}>
              <span className={styles.iconEmoji}>🐛</span>
            </div>
            <h3>Step-by-Step Debugger</h3>
            <p>Master IGCSE algorithms with line-by-line execution and variable tracking for deeper understanding</p>
          </article>

          <article className={styles.feature}>
            <div className={styles.featureIcon}>
              <span className={styles.iconEmoji}>💾</span>
            </div>
            <h3>Free Cloud Storage</h3>
            <p>Save unlimited IGCSE pseudocode programs and access them from any device for exam preparation</p>
          </article>

          <article className={styles.feature}>
            <div className={styles.featureIcon}>
              <span className={styles.iconEmoji}>📚</span>
            </div>
            <h3>IGCSE Practice Problems</h3>
            <p>50+ IGCSE-style examples and exercises covering loops, arrays, procedures, and exam topics</p>
          </article>

          <article className={styles.feature}>
            <div className={styles.featureIcon}>
              <span className={styles.iconEmoji}>🎯</span>
            </div>
            <h3>Exam Mode Timer</h3>
            <p>Practice under timed conditions to build speed and confidence for your IGCSE Computer Science exams</p>
          </article>
        </section>

        <section className={styles.testimonials} aria-label="Student Testimonials">
          <article className={styles.testimonial}>
            <p className={styles.quote}>"PseudoRun helped me score 95% on my IGCSE Computer Science exam! The IGCSE pseudocode practice was perfect."</p>
            <p className={styles.author}>— Sarah K., IGCSE Student</p>
          </article>
          <article className={styles.testimonial}>
            <p className={styles.quote}>"The best IGCSE pseudocode editor I've found. Perfect for understanding algorithms and preparing for practical exams."</p>
            <p className={styles.author}>— Michael T., Computer Science Student</p>
          </article>
        </section>

        <section className={styles.whySection} aria-label="Why PseudoRun">
          <h2>🎯 Why We Built PseudoRun</h2>
          <p><strong>The Problem:</strong> As a student, I was frustrated with online learning platforms that bombarded me with interruptive pop-up ads, banner distractions, and premium paywalls hiding essential features.</p>
          <p><strong>Our Promise:</strong> PseudoRun is built differently. Our promise is simple: Zero ads, forever. All features are free. We prioritize student privacy above all else. Every feature is laser-focused on IGCSE success.</p>
          <p><strong>Our Mission:</strong> To provide every IGCSE Computer Science student with the best pseudocode learning tool - free from distractions and focused entirely on your success.</p>
        </section>

        <section className={styles.finalCta} aria-label="Get Started">
          <h2>Join 10,000+ IGCSE Students mastering pseudocode with PseudoRun</h2>
          <p className={styles.subtitle}>Start your journey to IGCSE Computer Science exam success today</p>
          <button onClick={() => setShowAuth(true)} className={styles.ctaButtonSecondary}>
            Start Free IGCSE Pseudocode Practice
          </button>
          <div style={{ marginTop: '20px' }}>
            <a
              href="https://crypt0phage.gumroad.com/coffee"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.coffeeSupportLanding}
              title="Buy us a coffee to support PseudoRun"
            >
              ☕ Buy Me a Coffee
            </a>
          </div>
        </section>
      </main>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      
      <div style={{ height: '60px' }}></div>
      
      <footer className={styles.footer}>
        <a href="https://launchigniter.com/product/pseudorun?ref=badge-pseudorun" target="_blank" rel="noopener noreferrer">
          <img src="https://launchigniter.com/api/badge/pseudorun?theme=light" alt="Featured on LaunchIgniter" width="212" height="55" />
        </a>
        <a href="https://twelve.tools" target="_blank" rel="noopener noreferrer">
          <img src="https://twelve.tools/badge3-dark.svg" alt="Featured on Twelve Tools" width="200" height="54" />
        </a>
        <a href="https://wired.business" target="_blank" rel="noopener noreferrer">
          <img src="https://wired.business/badge3-light.svg" alt="Featured on Wired Business" width="200" height="54" />
        </a>
        <a href="https://findly.tools/pseudorun?utm_source=www.pseudorun.tech" target="_blank" rel="noopener noreferrer">
          <img src="https://findly.tools/badges/findly-tools-badge-light.svg" alt="Featured on findly.tools" width="150" />
        </a>
        <a href="https://ufind.best/products/pseudorun?utm_source=www.pseudorun.tech" target="_blank" rel="noopener"><img src="https://ufind.best/badges/ufind-best-badge-light.svg" alt="Featured on ufind.best" width="150" /></a>
        <a href="https://dofollow.tools" target="_blank"><img src="https://dofollow.tools/badge/badge_light.svg" alt="Featured on Dofollow.Tools" width="200" height="54" /></a>
        <a style={{display: "block", width: "fit-content"}} href="https://launch-list.org/product/pseudorun" target="_blank">
          <img style={{height: "50px"}}
             src="https://launch-list.org/badges/svg/launch_list_badge_live.svg"
             alt="Launch List Badge" />
        </a>
        <a href="https://turbo0.com/item/pseudorun" target="_blank" rel="noopener noreferrer">
          <img src="https://img.turbo0.com/badge-listed-light.svg" alt="Listed on Turbo0" height="54px" width="171" />
        </a>
        <a href="https://startupfa.me/s/pseudorun?utm_source=www.pseudorun.tech" target="_blank">
          <img src="https://startupfa.me/badges/featured-badge.webp" alt="PseudoRun - Featured on Startup Fame" width="171" height="54" />
        </a>
        <a href="https://fwfw.app/item/pseudorun" target="_blank"><img src="https://fwfw.app/badge-white.svg" width="250" height="54" alt="Featured on FWFW" /></a>
        <a href="https://submithunt.com" target="_blank" rel="noopener noreferrer">
          <img src="https://submithunt.com/badge.png" alt="Featured on SubmitHunt" width="150" height="45" />
        </a>
        <a href="https://saasfame.com/item/pseudorun" target="_blank" rel="noopener noreferrer">
          <img src="https://saasfame.com/badge-light.svg" alt="Featured on saasfame.com" style={{height: "54px", width: "auto"}} />
        </a>
        <a href="https://toolfame.com/item/pseudorun" target="_blank" rel="noopener noreferrer">
          <img src="https://toolfame.com/badge-light.svg" alt="Featured on toolfame.com" style={{height: "54px", width: "auto"}} />
        </a>
        

      </footer>
      
      
    </div>
  );
}
