import React, { useState, useEffect } from 'react';
import HeroSection from './HeroSection/HeroSection';
import ArchitectureOverview from './ArchitectureOverview/ArchitectureOverview';
import LexerDeepDive from './LexerDeepDive/LexerDeepDive';
import ParserDeepDive from './ParserDeepDive/ParserDeepDive';
import InterpreterDeepDive from './InterpreterDeepDive/InterpreterDeepDive';
import DebugSystemDeepDive from './DebugSystemDeepDive/DebugSystemDeepDive';
import InteractivePlayground from './InteractivePlayground/InteractivePlayground';
import PerformanceSection from './PerformanceSection/PerformanceSection';
import DeveloperResources from './DeveloperResources/DeveloperResources';
import styles from './styles/TechnicalDeepDive.css';

const TechnicalDeepDive: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [technicalLevel, setTechnicalLevel] = useState<'high' | 'medium' | 'deep'>('high');

  // Handle scroll-based section detection
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'architecture', 'lexer', 'parser', 'interpreter', 'debug', 'playground', 'performance', 'developer'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigationItems = [
    { id: 'hero', label: 'Overview', icon: '🏠' },
    { id: 'architecture', label: 'Architecture', icon: '🏗️' },
    { id: 'lexer', label: 'Lexer', icon: '📝' },
    { id: 'parser', label: 'Parser', icon: '🔧' },
    { id: 'interpreter', label: 'Interpreter', icon: '⚡' },
    { id: 'debug', label: 'Debug System', icon: '🐛' },
    { id: 'playground', label: 'Try It', icon: '🎮' },
    { id: 'performance', label: 'Performance', icon: '🚀' },
    { id: 'developer', label: 'For Developers', icon: '💻' }
  ];

  return (
    <div className={styles.technicalDeepDive}>
      {/* Navigation Sidebar */}
      <nav className={styles.navigation}>
        <div className={styles.navHeader}>
          <h2>PseudoRun</h2>
          <p>Technical Deep-Dive</p>
        </div>

        <div className={styles.technicalLevelSelector}>
          <label>Technical Depth:</label>
          <select
            value={technicalLevel}
            onChange={(e) => setTechnicalLevel(e.target.value as 'high' | 'medium' | 'deep')}
          >
            <option value="high">High Level</option>
            <option value="medium">Medium Detail</option>
            <option value="deep">Deep Technical</option>
          </select>
        </div>

        <ul className={styles.navList}>
          {navigationItems.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={`${styles.navLink} ${activeSection === item.id ? styles.active : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <span className={styles.navIcon}>{item.icon}</span>
                <span className={styles.navLabel}>{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Main Content */}
      <main className={styles.content}>
        <section id="hero" className={styles.section}>
          <HeroSection technicalLevel={technicalLevel} />
        </section>

        <section id="architecture" className={styles.section}>
          <ArchitectureOverview technicalLevel={technicalLevel} />
        </section>

        <section id="lexer" className={styles.section}>
          <LexerDeepDive technicalLevel={technicalLevel} />
        </section>

        <section id="parser" className={styles.section}>
          <ParserDeepDive technicalLevel={technicalLevel} />
        </section>

        <section id="interpreter" className={styles.section}>
          <InterpreterDeepDive technicalLevel={technicalLevel} />
        </section>

        <section id="debug" className={styles.section}>
          <DebugSystemDeepDive technicalLevel={technicalLevel} />
        </section>

        <section id="playground" className={styles.section}>
          <InteractivePlayground technicalLevel={technicalLevel} />
        </section>

        <section id="performance" className={styles.section}>
          <PerformanceSection technicalLevel={technicalLevel} />
        </section>

        <section id="developer" className={styles.section}>
          <DeveloperResources technicalLevel={technicalLevel} />
        </section>
      </main>

      {/* Scroll Progress Indicator */}
      <div className={styles.scrollProgress}>
        <div
          className={styles.progressBar}
          style={{ width: `${(window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default TechnicalDeepDive;