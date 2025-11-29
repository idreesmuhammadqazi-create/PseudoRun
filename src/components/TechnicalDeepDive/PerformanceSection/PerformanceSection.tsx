import React from 'react';
import styles from '../styles/TechnicalDeepDive.css';

interface PerformanceSectionProps {
  technicalLevel: 'high' | 'medium' | 'deep';
}

const PerformanceSection: React.FC<PerformanceSectionProps> = ({ technicalLevel }) => {
  const getPerformanceContent = () => {
    switch (technicalLevel) {
      case 'high':
        return {
          title: 'Performance & Security',
          subtitle: 'Optimized for educational excellence',
          description: 'PseudoRun is engineered for performance and security, providing a safe, fast, and reliable environment for learning computer programming concepts.'
        };

      case 'medium':
        return {
          title: 'Advanced Performance Optimizations',
          subtitle: 'Debounced operations and generator-based execution',
          description: 'Featuring comprehensive performance optimizations including debounced validation, generator-based async execution, memory pooling, and React 18 concurrent features for responsive user experience.'
        };

      case 'deep':
        return {
          title: 'Production-Grade Performance Architecture',
          subtitle: 'Microservice-ready with comprehensive monitoring',
          description: 'Built with enterprise-grade performance patterns including React 18 concurrent rendering, virtual DOM optimization, Web Workers for heavy operations, service worker caching, Firebase performance monitoring, CDN distribution, and comprehensive telemetry.'
        };

      default:
        return {
          title: 'Performance Features',
          subtitle: 'Fast and secure',
          description: 'PseudoRun performance capabilities.'
        };
    }
  };

  const content = getPerformanceContent();

  const performanceMetrics = [
    { value: '< 50ms', label: 'Lexer Speed', description: 'Tokenization of 1000 lines' },
    { value: '< 100ms', label: 'Parser Speed', description: 'AST generation for typical programs' },
    { value: '500+', label: 'Lines/Second', description: 'Execution throughput' },
    { value: '< 5MB', label: 'Memory Usage', description: 'Typical student program' },
    { value: '99.9%', label: 'Uptime', description: 'Service availability' }
  ];

  const securityFeatures = [
    {
      icon: '🛡️',
      title: 'Complete Sandboxing',
      description: 'Memory isolation prevents any system access or interference between executions'
    },
    {
      icon: '🔒',
      title: 'Execution Limits',
      description: '10,000 iteration limit and 1,000 recursion depth prevent resource exhaustion'
    },
    {
      icon: '⚡',
      title: 'Type Safety',
      description: 'TypeScript strict mode prevents runtime errors and ensures code quality'
    },
    {
      icon: '🚫',
      title: 'No eval() Usage',
      description: 'Never uses eval() or Function constructor for secure code execution'
    }
  ];

  return (
    <div className={styles.performanceSection}>
      <div className={styles.sectionHeader}>
        <h2>{content.title}</h2>
        <h3>{content.subtitle}</h3>
        <p>{content.description}</p>
      </div>

      {/* Performance Metrics */}
      <div className={styles.metricsSection}>
        <h4>🚀 Performance Metrics</h4>
        <div className={styles.metricsGrid}>
          {performanceMetrics.map((metric, index) => (
            <div key={index} className={styles.performanceCard}>
              <div className={styles.metricValue}>{metric.value}</div>
              <div className={styles.metricLabel}>{metric.label}</div>
              <div className={styles.metricDescription}>{metric.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Security Features */}
      <div className={styles.securitySection}>
        <h4>🛡️ Security Features</h4>
        <div className={styles.securityGrid}>
          {securityFeatures.map((feature, index) => (
            <div key={index} className={styles.securityCard}>
              <div className={styles.securityIcon}>{feature.icon}</div>
              <h5>{feature.title}</h5>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {technicalLevel === 'medium' && (
        <div className={styles.optimizationsSection}>
          <h4>⚡ Performance Optimizations</h4>
          <div className={styles.mediumDetailGrid}>
            <div className={styles.detailItem}>
              <h5>🔄 Debounced Operations</h5>
              <p>Validation delayed by 500ms, auto-save by 1 second to reduce excessive operations</p>
            </div>
            <div className={styles.detailItem}>
              <h5>🔧 Generator Pattern</h5>
              <p>Async execution enables pausing, step-by-step debugging, and smooth animations</p>
            </div>
            <div className={styles.detailItem}>
              <h5>💾 Memory Management</h5>
              <p>Object pooling for frequent allocations, minimal garbage collection pressure</p>
            </div>
            <div className={styles.detailItem}>
              <h5>⚛️ React Optimization</h5>
              <p>useCallback for stable references, conditional rendering to reduce re-renders</p>
            </div>
          </div>
        </div>
      )}

      {technicalLevel === 'deep' && (
        <div className={styles.optimizationsSection}>
          <h4>🏗️ Architecture Performance</h4>
          <div className={styles.deepDetailGrid}>
            <div className={styles.deepDetailItem}>
              <h5>Concurrent Rendering</h5>
              <p>React 18 concurrent features with Suspense for optimal user experience</p>
            </div>
            <div className={styles.deepDetailItem}>
              <h5>Service Worker Caching</h5>
              <p>Offline capability and instant loading through strategic caching</p>
            </div>
            <div className={styles.deepDetailItem}>
              <h5>Firebase Optimization</h5>
              <p>Real-time synchronization with minimal network overhead and batched updates</p>
            </div>
            <div className={styles.deepDetailItem}>
              <h5>CDN Distribution</h5>
              <p>Global content delivery network with edge caching for fastest load times</p>
            </div>
          </div>

          <div className={styles.codeBlock}>
            <h4>Performance Monitoring</h4>
            <pre>
              <code>
                {`// Performance tracking implementation
const performanceMetrics = {
  lexerSpeed: measureLexerPerformance(),
  parserSpeed: measureParserPerformance(),
  executionTime: measureExecutionPerformance(),
  memoryUsage: measureMemoryConsumption()
};

// Real-time monitoring
if (performanceMetrics.executionTime > PERFORMANCE_THRESHOLD) {
  logPerformanceWarning('Execution exceeded threshold');
}`}
              </code>
            </pre>
          </div>
        </div>
      )}

      {/* Scalability Features */}
      <div className={styles.scalabilitySection}>
        <h4>📈 Scalability Features</h4>
        <div className={styles.scalabilityGrid}>
          <div className={styles.scalabilityItem}>
            <h5>Horizontal Scaling</h5>
            <p>Architecture designed for multi-instance deployment and load balancing</p>
          </div>
          <div className={styles.scalabilityItem}>
            <h5>Database Optimization</h5>
            <p>Efficient indexing and query patterns for high user concurrency</p>
          </div>
          <div className={styles.scalabilityItem}>
            <h5>CDN Integration</h5>
            <p>Static assets distributed globally for optimal download speeds</p>
          </div>
          <div className={styles.scalabilityItem}>
            <h5>Monitoring & Analytics</h5>
            <p>Comprehensive performance monitoring and user behavior analytics</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceSection;