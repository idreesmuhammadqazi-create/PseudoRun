import React from 'react';
import styles from '../styles/TechnicalDeepDive.css';

interface InterpreterDeepDiveProps {
  technicalLevel: 'high' | 'medium' | 'deep';
}

const InterpreterDeepDive: React.FC<InterpreterDeepDiveProps> = ({ technicalLevel }) => {
  const getInterpreterContent = () => {
    switch (technicalLevel) {
      case 'high':
        return {
          title: 'The Interpreter: Executing Your Pseudocode',
          subtitle: 'Safe and efficient code execution engine',
          description: 'The interpreter takes the Abstract Syntax Tree (AST) from the parser and executes your pseudocode step by step, providing output and managing program state safely.'
        };

      case 'medium':
        return {
          title: 'Generator-Based Execution with Debug Support',
          subtitle: 'Memory isolation and performance optimization',
          description: 'PseudoRun\'s interpreter uses JavaScript generators for async execution with pausing capabilities, complete memory isolation between executions, and comprehensive debug state tracking.'
        };

      case 'deep':
        return {
          title: 'Production-Grade Runtime Engine',
          subtitle: 'Type-safe execution with security limits and optimization',
          description: 'Built with generator pattern for async execution, ExecutionContext for variable scoping, built-in function library for IGCSE operations, virtual file system, comprehensive error handling, and performance optimization including debounced operations.'
        };

      default:
        return {
          title: 'Interpreter: Code Execution',
          subtitle: 'Safe runtime environment',
          description: 'How PseudoRun executes pseudocode securely.'
        };
    }
  };

  const content = getInterpreterContent();

  const executionFeatures = [
    {
      icon: '⚡',
      title: 'Generator-Based Execution',
      description: 'Async execution with pausing for debugging and step-by-step analysis'
    },
    {
      icon: '🛡️',
      title: 'Memory Isolation',
      description: 'Each execution runs in isolated context preventing interference'
    },
    {
      icon: '🔒',
      title: 'Security Limits',
      description: '10,000 iteration limit and 1,000 recursion depth for safety'
    },
    {
      icon: '📊',
      title: 'Variable Tracking',
      description: 'Real-time variable state monitoring during execution'
    }
  ];

  const performanceMetrics = [
    { value: '< 50ms', label: 'Startup Time' },
    { value: '10,000', label: 'Max Iterations' },
    { value: '1,000', label: 'Recursion Depth' },
    { value: '< 5MB', label: 'Memory Usage' }
  ];

  return (
    <div className={styles.interpreterDeepDive}>
      <div className={styles.sectionHeader}>
        <h2>{content.title}</h2>
        <h3>{content.subtitle}</h3>
        <p>{content.description}</p>
      </div>

      {/* Execution Features */}
      <div className={styles.featuresGrid}>
        {executionFeatures.map((feature, index) => (
          <div key={index} className={styles.featureCard}>
            <div className={styles.featureIcon}>{feature.icon}</div>
            <h4>{feature.title}</h4>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>

      {/* Performance Metrics */}
      <div className={styles.performanceGrid}>
        {performanceMetrics.map((metric, index) => (
          <div key={index} className={styles.metricCard}>
            <div className={styles.metricValue}>{metric.value}</div>
            <div className={styles.metricLabel}>{metric.label}</div>
          </div>
        ))}
      </div>

      {technicalLevel === 'medium' && (
        <div className={styles.mediumDetailGrid}>
          <div className={styles.detailItem}>
            <h5>🔄 Execution Context</h5>
            <p>Isolated environment with separate variable scope for each program execution</p>
          </div>
          <div className={styles.detailItem}>
            <h5>🐛 Debug Integration</h5>
            <p>Generator pausing enables step-by-step execution with variable inspection</p>
          </div>
          <div className={styles.detailItem}>
            <h5>📁 Virtual File System</h5>
            <p>In-memory file operations with READ, WRITE, and APPEND modes</p>
          </div>
          <div className={styles.detailItem}>
            <h5>⚡ Performance</h5>
            <p>Optimized for educational use with fast startup and responsive execution</p>
          </div>
        </div>
      )}

      {technicalLevel === 'deep' && (
        <div className={styles.codeBlock}>
          <h4>Generator-Based Execution Pattern</h4>
          <pre>
            <code>
              {`// Core execution generator
async* executeProgram(node: ASTNode) {
  switch (node.type) {
    case 'ASSIGN':
      const value = await this.evaluate(node.expression);
      this.setVariable(node.variable, value);
      yield \`ASSIGNED: \${node.variable} = \${value}\`;
      break;

    case 'OUTPUT':
      const output = await this.evaluate(node.expression);
      yield output.toString();
      break;

    case 'IF':
      const condition = await this.evaluate(node.condition);
      if (condition) {
        for (const child of node.thenBranch) {
          yield* this.executeProgram(child);
        }
      }
      break;

    // ... other cases
  }
}`}
            </code>
          </pre>
        </div>
      )}
    </div>
  );
};

export default InterpreterDeepDive;