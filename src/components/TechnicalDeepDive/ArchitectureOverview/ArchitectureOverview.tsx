import React, { useState, useRef, useEffect } from 'react';
import styles from '../styles/TechnicalDeepDive.css';

interface ArchitectureOverviewProps {
  technicalLevel: 'high' | 'medium' | 'deep';
}

interface Component {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  details?: string[];
}

const ArchitectureOverview: React.FC<ArchitectureOverviewProps> = ({ technicalLevel }) => {
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [hoveredComponent, setHoveredComponent] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const components: Component[] = [
    {
      id: 'frontend',
      name: 'Frontend',
      description: 'React 18 TypeScript application with real-time editing',
      technologies: ['React 18', 'TypeScript', 'CodeMirror 6', 'Firebase'],
      details: technicalLevel === 'deep' ? [
        'React 18 with concurrent features and Suspense',
        'TypeScript strict mode with comprehensive type safety',
        'CodeMirror 6 for advanced syntax highlighting',
        'Firebase for authentication and real-time synchronization'
      ] : undefined
    },
    {
      id: 'lexer',
      name: 'Lexer',
      description: 'Character-by-character tokenization with IGCSE support',
      technologies: ['TypeScript', 'Regex Patterns', 'State Machine'],
      details: technicalLevel === 'deep' ? [
        'Character-by-character scanning algorithm',
        '40+ keyword recognition with Set-based lookup',
        'Multi-character operator support (<=, >=, <>)',
        'Position tracking for precise error reporting'
      ] : undefined
    },
    {
      id: 'parser',
      name: 'Parser',
      description: 'Recursive descent parser with AST generation',
      technologies: ['Recursive Descent', 'AST', 'Type System'],
      details: technicalLevel === 'deep' ? [
        'Recursive descent parsing with operator precedence',
        '20+ AST node types with comprehensive type system',
        'Error recovery and syntax validation',
        'Support for complex control structures'
      ] : undefined
    },
    {
      id: 'interpreter',
      name: 'Interpreter',
      description: 'Generator-based async execution with debug support',
      technologies: ['Generator Pattern', 'Async/Await', 'Memory Isolation'],
      details: technicalLevel === 'deep' ? [
        'Generator-based async execution with pausing',
        'ExecutionContext with variable scoping',
        'Built-in function library for IGCSE operations',
        'Virtual file system with READ/WRITE/APPEND modes'
      ] : undefined
    },
    {
      id: 'debug',
      name: 'Debug System',
      description: 'Step-by-step execution with variable inspection',
      technologies: ['Breakpoints', 'Call Stack', 'Variable Tracking'],
      details: technicalLevel === 'deep' ? [
        'Step-by-step execution with generator pausing',
        'Real-time variable state monitoring',
        'Call stack management for recursion',
        'Trace table generation for education'
      ] : undefined
    },
    {
      id: 'storage',
      name: 'Storage',
      description: 'Firebase backend with real-time synchronization',
      technologies: ['Firestore', 'Authentication', 'Cloud Functions'],
      details: technicalLevel === 'deep' ? [
        'Firestore for program and user data storage',
        'Firebase Authentication with email verification',
        'Real-time collaboration features',
        'Cloud Functions for sharing and exports'
      ] : undefined
    }
  ];

  const connections = [
    { from: 'frontend', to: 'lexer' },
    { from: 'frontend', to: 'storage' },
    { from: 'lexer', to: 'parser' },
    { from: 'parser', to: 'interpreter' },
    { from: 'interpreter', to: 'debug' },
    { from: 'frontend', to: 'debug' }
  ];

  // Draw connection diagram
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Component positions (circular layout)
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(canvas.width, canvas.height) / 3;

    const positions: { [key: string]: { x: number; y: number } } = {};
    components.forEach((component, index) => {
      const angle = (index * 2 * Math.PI) / components.length - Math.PI / 2;
      positions[component.id] = {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
      };
    });

    // Draw connections
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.3)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);

    connections.forEach((connection) => {
      const from = positions[connection.from];
      const to = positions[connection.to];

      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.stroke();

      // Draw arrow
      const angle = Math.atan2(to.y - from.y, to.x - from.x);
      const arrowLength = 15;
      const arrowAngle = Math.PI / 6;

      ctx.beginPath();
      ctx.moveTo(to.x - 40, to.y);
      ctx.lineTo(
        to.x - 40 - arrowLength * Math.cos(angle - arrowAngle),
        to.y - 40 - arrowLength * Math.sin(angle - arrowAngle)
      );
      ctx.lineTo(
        to.x - 40 - arrowLength * Math.cos(angle + arrowAngle),
        to.y - 40 - arrowLength * Math.sin(angle + arrowAngle)
      );
      ctx.closePath();
      ctx.fillStyle = 'rgba(99, 102, 241, 0.5)';
      ctx.fill();
    });

    ctx.setLineDash([]);

    // Highlight hovered component connections
    if (hoveredComponent) {
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.8)';
      ctx.lineWidth = 3;

      connections.forEach((connection) => {
        if (connection.from === hoveredComponent || connection.to === hoveredComponent) {
          const from = positions[connection.from];
          const to = positions[connection.to];

          ctx.beginPath();
          ctx.moveTo(from.x, from.y);
          ctx.lineTo(to.x, to.y);
          ctx.stroke();
        }
      });
    }
  }, [hoveredComponent, components, connections]);

  const getArchitectureContent = () => {
    switch (technicalLevel) {
      case 'high':
        return {
          title: 'System Architecture Overview',
          subtitle: 'Comprehensive educational platform design',
          description: 'PseudoRun implements a complete software architecture following modern web development best practices, designed specifically for educational excellence.'
        };

      case 'medium':
        return {
          title: '3-Phase Compiler Architecture',
          subtitle: 'Frontend, interpreter pipeline, and cloud infrastructure',
          description: 'Built with React 18 and TypeScript, featuring a complete lexer-parser-interpreter pipeline with real-time collaboration and comprehensive debugging capabilities.'
        };

      case 'deep':
        return {
          title: 'Production-Grade Technical Architecture',
          subtitle: 'Microservices-ready, scalable, and maintainable codebase',
          description: 'Implements TypeScript strict mode, React 18 concurrent features, generator-based execution, memory isolation, comprehensive error handling, and Firebase integration with real-time synchronization and authentication.'
        };

      default:
        return {
          title: 'System Architecture',
          subtitle: 'Technical design overview',
          description: 'Discover the architecture behind PseudoRun\'s technical excellence.'
        };
    }
  };

  const content = getArchitectureContent();

  const technologyStack = [
    { category: 'Frontend', technologies: ['React 18', 'TypeScript', 'CodeMirror 6', 'CSS Modules'] },
    { category: 'Backend', technologies: ['Firebase Firestore', 'Authentication', 'Cloud Functions'] },
    { category: 'Development', technologies: ['Vite', 'ESLint', 'Prettier', 'Jest'] },
    { category: 'Deployment', technologies: ['Vercel', 'Firebase Hosting', 'CDN'] }
  ];

  return (
    <div className={styles.architectureOverview}>
      <div className={styles.architectureHeader}>
        <h2>{content.title}</h2>
        <h3>{content.subtitle}</h3>
        <p>{content.description}</p>
      </div>

      {/* Interactive Architecture Diagram */}
      <div className={styles.architectureDiagram}>
        <div className={styles.diagramContainer}>
          <canvas
            ref={canvasRef}
            className={styles.diagramCanvas}
            width="800"
            height="600"
          />

          {/* Component nodes */}
          {components.map((component) => (
            <div
              key={component.id}
              className={`${styles.componentNode} ${
                hoveredComponent === component.id ? styles.hovered : ''
              } ${selectedComponent === component.id ? styles.selected : ''}`}
              style={{
                position: 'absolute',
                transform: 'translate(-50%, -50%)',
                cursor: 'pointer'
              }}
              onMouseEnter={() => setHoveredComponent(component.id)}
              onMouseLeave={() => setHoveredComponent(null)}
              onClick={() => setSelectedComponent(
                selectedComponent === component.id ? null : component.id
              )}
            >
              <div className={styles.componentIcon}>
                {component.id === 'frontend' && '🖥️'}
                {component.id === 'lexer' && '📝'}
                {component.id === 'parser' && '🔧'}
                {component.id === 'interpreter' && '⚡'}
                {component.id === 'debug' && '🐛'}
                {component.id === 'storage' && '☁️'}
              </div>
              <div className={styles.componentName}>{component.name}</div>
            </div>
          ))}
        </div>

        {/* Component Details Panel */}
        {selectedComponent && (
          <div className={styles.componentDetails}>
            <div className={styles.detailsHeader}>
              <h3>
                {components.find(c => c.id === selectedComponent)?.name}
              </h3>
              <button
                className={styles.closeButton}
                onClick={() => setSelectedComponent(null)}
              >
                ✕
              </button>
            </div>

            <div className={styles.detailsContent}>
              <p className={styles.componentDescription}>
                {components.find(c => c.id === selectedComponent)?.description}
              </p>

              <div className={styles.technologiesSection}>
                <h4>Technologies Used</h4>
                <div className={styles.technologyTags}>
                  {components.find(c => c.id === selectedComponent)?.technologies.map((tech) => (
                    <span key={tech} className={styles.technologyTag}>
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {technicalLevel === 'deep' && (
                <div className={styles.deepDetails}>
                  <h4>Technical Implementation</h4>
                  <ul>
                    {components.find(c => c.id === selectedComponent)?.details?.map((detail, index) => (
                      <li key={index}>{detail}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Technology Stack Overview */}
      <div className={styles.technologyStack}>
        <h3>Technology Stack</h3>
        <div className={styles.techGrid}>
          {technologyStack.map((category) => (
            <div key={category.category} className={styles.techCategory}>
              <h4>{category.category}</h4>
              <div className={styles.techList}>
                {category.technologies.map((tech) => (
                  <div key={tech} className={styles.techItem}>
                    <div className={styles.techIcon}>
                      {tech.includes('React') && '⚛️'}
                      {tech.includes('TypeScript') && '📘'}
                      {tech.includes('Firebase') && '🔥'}
                      {tech.includes('Vite') && '⚡'}
                      {tech.includes('Vercel') && '▲'}
                    </div>
                    <span>{tech}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Architecture Principles */}
      <div className={styles.architecturePrinciples}>
        <h3>Design Principles</h3>
        <div className={styles.principlesGrid}>
          <div className={styles.principle}>
            <div className={styles.principleIcon}>🏗️</div>
            <h4>Modular Architecture</h4>
            <p>Clean separation of concerns with reusable components and clear interfaces</p>
          </div>
          <div className={styles.principle}>
            <div className={styles.principleIcon}>🚀</div>
            <h4>Performance First</h4>
            <p>Optimized for educational environments with fast startup and responsive interactions</p>
          </div>
          <div className={styles.principle}>
            <div className={styles.principleIcon}>🛡️</div>
            <h4>Security & Safety</h4>
            <p>Complete sandboxing with memory isolation and execution limits</p>
          </div>
          <div className={styles.principle}>
            <div className={styles.principleIcon}>📚</div>
            <h4>Educational Focus</h4>
            <p>Designed specifically for IGCSE/A-LEVELS computer science education</p>
          </div>
          {technicalLevel === 'deep' && (
            <>
              <div className={styles.principle}>
                <div className={styles.principleIcon}>🔧</div>
                <h4>Developer Experience</h4>
                <p>TypeScript strict mode, comprehensive testing, and modern development tools</p>
              </div>
              <div className={styles.principle}>
                <div className={styles.principleIcon}>📈</div>
                <h4>Scalability Ready</h4>
                <p>Architecture designed for horizontal scaling and microservices deployment</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Technical Metrics */}
      {technicalLevel !== 'high' && (
        <div className={styles.architectureMetrics}>
          <h3>Technical Specifications</h3>
          <div className={styles.metricsGrid}>
            <div className={styles.metric}>
              <div className={styles.metricValue}>100%</div>
              <div className={styles.metricLabel}>TypeScript Coverage</div>
            </div>
            <div className={styles.metric}>
              <div className={styles.metricValue}>&lt;50ms</div>
              <div className={styles.metricLabel}>Parser Response Time</div>
            </div>
            <div className={styles.metric}>
              <div className={styles.metricValue}>10K</div>
              <div className={styles.metricLabel}>Iteration Limit</div>
            </div>
            <div className={styles.metric}>
              <div className={styles.metricValue}>&lt;5MB</div>
              <div className={styles.metricLabel}>Typical Memory Usage</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArchitectureOverview;