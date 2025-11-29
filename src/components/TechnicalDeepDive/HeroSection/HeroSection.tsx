import React, { useState, useEffect, useRef } from 'react';
import styles from '../styles/TechnicalDeepDive.css';

interface HeroSectionProps {
  technicalLevel: 'high' | 'medium' | 'deep';
}

const HeroSection: React.FC<HeroSectionProps> = ({ technicalLevel }) => {
  const [animationStep, setAnimationStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Animation stages for the interpreter pipeline
  const animationStages = [
    { name: 'Source Code', icon: '📄', color: '#6366f1' },
    { name: 'Lexer', icon: '🔍', color: '#8b5cf6' },
    { name: 'Parser', icon: '🔧', color: '#ec4899' },
    { name: 'Interpreter', icon: '⚡', color: '#f59e0b' },
    { name: 'Output', icon: '📊', color: '#10b981' }
  ];

  // Key metrics
  const metrics = [
    { value: '10,000', label: 'Max Iterations', description: 'Prevents infinite loops' },
    { value: '40+', label: 'Token Types', description: 'IGCSE keywords and operators' },
    { value: '5', label: 'Data Types', description: 'INTEGER, REAL, STRING, CHAR, BOOLEAN' },
    { value: '1,000', label: 'Recursion Depth', description: 'Maximum call stack size' }
  ];

  useEffect(() => {
    if (!isAnimating) return;

    const interval = setInterval(() => {
      setAnimationStep((prev) => (prev + 1) % (animationStages.length + 2));
    }, 800);

    return () => clearInterval(interval);
  }, [isAnimating, animationStages.length]);

  useEffect(() => {
    // Draw pipeline animation on canvas
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw pipeline connections
    const stageWidth = canvas.width / (animationStages.length + 1);

    ctx.strokeStyle = 'rgba(99, 102, 241, 0.3)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);

    for (let i = 0; i < animationStages.length - 1; i++) {
      const startX = stageWidth * (i + 1);
      const endX = stageWidth * (i + 2);
      const y = canvas.height / 2;

      ctx.beginPath();
      ctx.moveTo(startX + 30, y);
      ctx.lineTo(endX - 30, y);
      ctx.stroke();

      // Draw arrow
      ctx.beginPath();
      ctx.moveTo(endX - 30, y);
      ctx.lineTo(endX - 35, y - 5);
      ctx.lineTo(endX - 35, y + 5);
      ctx.closePath();
      ctx.fillStyle = 'rgba(99, 102, 241, 0.5)';
      ctx.fill();
    }

    ctx.setLineDash([]);

    // Draw animated flow
    if (animationStep > 0 && animationStep <= animationStages.length) {
      const progress = (animationStep - 1) / (animationStages.length - 1);
      const currentX = stageWidth * (1 + progress);

      ctx.beginPath();
      ctx.arc(currentX, canvas.height / 2, 8, 0, Math.PI * 2);
      ctx.fillStyle = '#6366f1';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }, [animationStep, animationStages.length]);

  const getTechnicalContent = () => {
    switch (technicalLevel) {
      case 'high':
        return {
          title: 'PseudoRun: Advanced Pseudocode Interpreter',
          subtitle: 'Safe, educational, and technically sophisticated',
          description: 'Experience how PseudoRun transforms IGCSE/A-LEVELS pseudocode into executable programs through our innovative 3-phase pipeline architecture.'
        };

      case 'medium':
        return {
          title: '3-Phase Pipeline: Lexer → Parser → Interpreter',
          subtitle: 'Real-time code analysis with comprehensive error handling',
          description: 'PseudoRun implements a sophisticated compiler architecture with lexical analysis, recursive descent parsing, and generator-based async execution, providing students with professional-grade development tools.'
        };

      case 'deep':
        return {
          title: 'Production-Grade Interpreter Architecture',
          subtitle: 'TypeScript-based runtime with memory isolation and performance optimization',
          description: 'Built with React 18, TypeScript, and Firebase, PseudoRun features a complete Abstract Syntax Tree (AST) implementation, generator-based execution with debug pausing, and advanced performance optimizations including debounced operations and object pooling.'
        };

      default:
        return {
          title: 'PseudoRun: Technical Excellence',
          subtitle: 'Educational technology innovation',
          description: 'Discover the engineering behind our advanced pseudocode interpreter.'
        };
    }
  };

  const content = getTechnicalContent();

  return (
    <div className={styles.heroSection}>
      <div className={styles.heroContent}>
        <header className={styles.heroHeader}>
          <h1 className={styles.heroTitle}>{content.title}</h1>
          <p className={styles.heroSubtitle}>{content.subtitle}</p>
          <p className={styles.heroDescription}>{content.description}</p>
        </header>

        {/* Animated Pipeline Visualization */}
        <div className={styles.pipelineVisualization}>
          <div className={styles.stagesContainer}>
            {animationStages.map((stage, index) => (
              <div
                key={stage.name}
                className={`${styles.stage} ${
                  animationStep > index ? styles.active : ''
                }`}
                style={{
                  borderColor: stage.color,
                  backgroundColor: animationStep > index ? `${stage.color}20` : 'transparent'
                }}
              >
                <div className={styles.stageIcon} style={{ color: stage.color }}>
                  {stage.icon}
                </div>
                <div className={styles.stageName}>{stage.name}</div>
                {technicalLevel === 'deep' && (
                  <div className={styles.stageDetails}>
                    {stage.name === 'Source Code' && 'IGCSE pseudocode syntax'}
                    {stage.name === 'Lexer' && 'Tokenization & validation'}
                    {stage.name === 'Parser' && 'AST generation'}
                    {stage.name === 'Interpreter' && 'Runtime execution'}
                    {stage.name === 'Output' && 'Formatted results'}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Canvas for animated flow */}
          <canvas
            ref={canvasRef}
            className={styles.pipelineCanvas}
            height="60"
          />
        </div>

        {/* Key Metrics */}
        <div className={styles.metricsGrid}>
          {metrics.map((metric) => (
            <div key={metric.label} className={styles.metricCard}>
              <div className={styles.metricValue}>{metric.value}</div>
              <div className={styles.metricLabel}>{metric.label}</div>
              <div className={styles.metricDescription}>{metric.description}</div>
            </div>
          ))}
        </div>

        {/* Technical Details based on level */}
        <div className={styles.technicalHighlights}>
          {technicalLevel === 'high' && (
            <div className={styles.highlightGrid}>
              <div className={styles.highlightItem}>
                <h3>🎯 Educational Focus</h3>
                <p>Designed specifically for IGCSE/A-LEVELS computer science education with safety-first approach.</p>
              </div>
              <div className={styles.highlightItem}>
                <h3>⚡ Instant Feedback</h3>
                <p>Real-time validation and execution helps students learn programming concepts effectively.</p>
              </div>
              <div className={styles.highlightItem}>
                <h3>🛡️ Safe Environment</h3>
                <p>Complete sandboxing prevents any system access while providing full programming experience.</p>
              </div>
            </div>
          )}

          {technicalLevel === 'medium' && (
            <div className={styles.highlightGrid}>
              <div className={styles.highlightItem}>
                <h3>🔍 Lexer Implementation</h3>
                <p>Character-by-character scanning with 40+ keyword recognition, multi-character operator support, and position tracking for precise error reporting.</p>
              </div>
              <div className={styles.highlightItem}>
                <h3>🔧 Parser Architecture</h3>
                <p>Recursive descent parser with operator precedence, supporting complex control structures and type validation with comprehensive error recovery.</p>
              </div>
              <div className={styles.highlightItem}>
                <h3>⚡ Execution Engine</h3>
                <p>Generator-based async execution with debug pausing, memory isolation, and built-in function library supporting IGCSE specifications.</p>
              </div>
            </div>
          )}

          {technicalLevel === 'deep' && (
            <div className={styles.highlightGrid}>
              <div className={styles.highlightItem}>
                <h3>🏗️ Architecture Patterns</h3>
                <p>Implemented using TypeScript with strict type safety, React 18 concurrent features, and Firebase for scalable backend services.</p>
              </div>
              <div className={styles.highlightItem}>
                <h3>🚀 Performance Optimizations</h3>
                <p>Debounced validation (500ms), generator-based execution, object pooling, and CodeMirror 6 integration for responsive editing experience.</p>
              </div>
              <div className={styles.highlightItem}>
                <h3>🛡️ Security Implementation</h3>
                <p>Complete memory isolation, execution limits (MAX_ITERATIONS=10000), recursion depth protection (MAX_RECURSION_DEPTH=1000), and no eval() or Function constructor usage.</p>
              </div>
            </div>
          )}
        </div>

        {/* Animation Controls */}
        <div className={styles.animationControls}>
          <button
            className={styles.button}
            onClick={() => setIsAnimating(!isAnimating)}
          >
            {isAnimating ? '⏸️ Pause Animation' : '▶️ Resume Animation'}
          </button>
          <button
            className={styles.button}
            onClick={() => setAnimationStep(0)}
          >
            🔄 Reset Animation
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;