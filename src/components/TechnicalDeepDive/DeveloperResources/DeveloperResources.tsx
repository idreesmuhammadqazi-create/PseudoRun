import React from 'react';
import styles from '../styles/TechnicalDeepDive.css';

interface DeveloperResourcesProps {
  technicalLevel: 'high' | 'medium' | 'deep';
}

const DeveloperResources: React.FC<DeveloperResourcesProps> = ({ technicalLevel }) => {
  const getDeveloperContent = () => {
    switch (technicalLevel) {
      case 'high':
        return {
          title: 'For Developers',
          subtitle: 'Contribute to PseudoRun\'s evolution',
          description: 'Join our community of developers building the future of computer science education. Whether you want to contribute features, fix bugs, or build on our platform, we welcome your expertise.'
        };

      case 'medium':
        return {
          title: 'Open Source Development',
          subtitle: 'TypeScript, React 18, and Firebase architecture',
          description: 'PseudoRun is built with modern web technologies and follows best practices for maintainability, performance, and scalability. Comprehensive documentation and testing make it easy to contribute.'
        };

      case 'deep':
        return {
          title: 'Enterprise-Grade Development Stack',
          subtitle: 'Production-ready architecture with comprehensive development tools',
          description: 'Built with TypeScript strict mode, React 18 concurrent features, Vite build system, comprehensive testing with Jest, ESLint/Prettier configuration, GitHub Actions CI/CD, Firebase backend integration, and enterprise-grade security practices. Ready for scaling and microservices architecture.'
        };

      default:
        return {
          title: 'Developer Resources',
          subtitle: 'Build with us',
          description: 'Resources for developers interested in PseudoRun.'
        };
    }
  };

  const content = getDeveloperContent();

  const contributionAreas = [
    {
      icon: '🔧',
      title: 'Core Interpreter',
      description: 'Enhance lexer, parser, or interpreter components',
      skills: ['TypeScript', 'Compiler Design', 'Algorithms']
    },
    {
      icon: '⚛️',
      title: 'Frontend Development',
      description: 'Improve React components and user experience',
      skills: ['React', 'TypeScript', 'CSS/SCSS']
    },
    {
      icon: '☁️',
      title: 'Backend Services',
      description: 'Scale Firebase services and add new features',
      skills: ['Firebase', 'Cloud Functions', 'Database Design']
    },
    {
      icon: '🧪',
      title: 'Testing & QA',
      description: 'Comprehensive testing and quality assurance',
      skills: ['Jest', 'Testing Libraries', 'CI/CD']
    },
    {
      icon: '📚',
      title: 'Documentation',
      description: 'Improve docs and educational content',
      skills: ['Technical Writing', 'Education', 'Markdown']
    },
    {
      icon: '🚀',
      title: 'DevOps & Infrastructure',
      description: 'Deploy and scale PseudoRun infrastructure',
      skills: ['DevOps', 'Cloud Platforms', 'Monitoring']
    }
  ];

  const gettingStartedSteps = [
    {
      step: '1',
      title: 'Clone Repository',
      description: 'Fork and clone the PseudoRun repository from GitHub',
      command: 'git clone https://github.com/your-username/pseudorun.git'
    },
    {
      step: '2',
      title: 'Install Dependencies',
      description: 'Install Node.js dependencies and set up development environment',
      command: 'npm install && npm run dev'
    },
    {
      step: '3',
      title: 'Run Tests',
      description: 'Ensure all tests pass before making changes',
      command: 'npm test && npm run type-check'
    },
    {
      step: '4',
      title: 'Make Changes',
      description: 'Create a feature branch and implement your changes',
      command: 'git checkout -b feature/your-feature-name'
    },
    {
      step: '5',
      title: 'Submit PR',
      description: 'Create a pull request with detailed description',
      command: 'git push origin feature/your-feature-name'
    }
  ];

  const apiEndpoints = [
    {
      method: 'POST',
      endpoint: '/api/interpret',
      description: 'Execute pseudocode and get results',
      params: 'code: string, options?: InterpreterOptions'
    },
    {
      method: 'POST',
      endpoint: '/api/validate',
      description: 'Validate pseudocode syntax',
      params: 'code: string'
    },
    {
      method: 'GET',
      endpoint: '/api/tokens',
      description: 'Get available tokens and keywords',
      params: 'none'
    },
    {
      method: 'POST',
      endpoint: '/api/ast',
      description: 'Parse code and get Abstract Syntax Tree',
      params: 'code: string'
    }
  ];

  return (
    <div className={styles.developerResources}>
      <div className={styles.sectionHeader}>
        <h2>{content.title}</h2>
        <h3>{content.subtitle}</h3>
        <p>{content.description}</p>
      </div>

      {/* Contribution Areas */}
      <div className={styles.contributionSection}>
        <h4>🤝 How to Contribute</h4>
        <div className={styles.contributionGrid}>
          {contributionAreas.map((area, index) => (
            <div key={index} className={styles.contributionCard}>
              <div className={styles.contributionIcon}>{area.icon}</div>
              <h5>{area.title}</h5>
              <p>{area.description}</p>
              <div className={styles.skillsList}>
                {area.skills.map((skill, skillIndex) => (
                  <span key={skillIndex} className={styles.skillTag}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Getting Started */}
      <div className={styles.gettingStartedSection}>
        <h4>🚀 Getting Started</h4>
        <div className={styles.stepsGrid}>
          {gettingStartedSteps.map((step) => (
            <div key={step.step} className={styles.stepCard}>
              <div className={styles.stepNumber}>{step.step}</div>
              <h5>{step.title}</h5>
              <p>{step.description}</p>
              <div className={styles.commandBlock}>
                <code>{step.command}</code>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Development Guidelines */}
      <div className={styles.guidelinesSection}>
        <h4>📋 Development Guidelines</h4>
        <div className={styles.guidelinesGrid}>
          <div className={styles.guidelineItem}>
            <h5>🔧 Code Standards</h5>
            <ul>
              <li>Use TypeScript strict mode</li>
              <li>Follow ESLint and Prettier configuration</li>
              <li>Write comprehensive tests for new features</li>
              <li>Document complex logic with JSDoc comments</li>
            </ul>
          </div>
          <div className={styles.guidelineItem}>
            <h5>🧪 Testing Requirements</h5>
            <ul>
              <li>Unit tests for all functions and components</li>
              <li>Integration tests for interpreter pipeline</li>
              <li>End-to-end tests for user workflows</li>
              <li>Performance tests for critical paths</li>
            </ul>
          </div>
          <div className={styles.guidelineItem}>
            <h5>📚 Documentation</h5>
            <ul>
              <li>Update README for significant changes</li>
              <li>Add inline comments for complex algorithms</li>
              <li>Update API documentation for new endpoints</li>
              <li>Include examples in PR descriptions</li>
            </ul>
          </div>
          <div className={styles.guidelineItem}>
            <h5>🚀 Performance</h5>
            <ul>
              <li>Profile performance impact of changes</li>
              <li>Optimize for educational use cases</li>
              <li>Maintain sub-100ms response times</li>
              <li>Consider memory usage for large programs</li>
            </ul>
          </div>
        </div>
      </div>

      {/* API Documentation */}
      <div className={styles.apiSection}>
        <h4>🔌 API Endpoints</h4>
        <div className={styles.apiGrid}>
          {apiEndpoints.map((endpoint, index) => (
            <div key={index} className={styles.apiCard}>
              <div className={styles.apiMethod}>
                <span className={`${styles.method} ${styles[endpoint.method.toLowerCase()]}`}>
                  {endpoint.method}
                </span>
                <span className={styles.endpoint}>{endpoint.endpoint}</span>
              </div>
              <p className={styles.apiDescription}>{endpoint.description}</p>
              <div className={styles.apiParams}>
                <strong>Parameters:</strong> {endpoint.params}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Development Tools */}
      <div className={styles.toolsSection}>
        <h4>🛠️ Development Tools</h4>
        <div className={styles.toolsGrid}>
          <div className={styles.toolCard}>
            <h5>VS Code Extensions</h5>
            <ul>
              <li>ES7+ React/Redux/React-Native snippets</li>
              <li>TypeScript Importer</li>
              <li>Prettier - Code formatter</li>
              <li>ESLint</li>
            </ul>
          </div>
          <div className={styles.toolCard}>
            <h5>Browser Tools</h5>
            <ul>
              <li>React Developer Tools</li>
              <li>Redux DevTools (if applicable)</li>
              <li>Chrome DevTools Performance</li>
              <li>Network inspection for Firebase calls</li>
            </ul>
          </div>
          <div className={styles.toolCard}>
            <h5>Command Line Tools</h5>
            <ul>
              <li>npm scripts for development tasks</li>
              <li>Git hooks for pre-commit checks</li>
              <li>TypeScript compiler for type checking</li>
              <li>Vite for fast development builds</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Community */}
      <div className={styles.communitySection}>
        <h4>👥 Join Our Community</h4>
        <div className={styles.communityGrid}>
          <div className={styles.communityItem}>
            <h5>💬 Discussions</h5>
            <p>Join GitHub Discussions for questions, ideas, and collaboration</p>
            <a href="#" className={styles.communityLink}>Join Discussion</a>
          </div>
          <div className={styles.communityItem}>
            <h5>🐛 Bug Reports</h5>
            <p>Report issues and feature requests on GitHub Issues</p>
            <a href="#" className={styles.communityLink}>Report Issue</a>
          </div>
          <div className={styles.communityItem}>
            <h5>📖 Documentation</h5>
            <p>Contribute to improving our documentation and guides</p>
            <a href="#" className={styles.communityLink}>Improve Docs</a>
          </div>
          <div className={styles.communityItem}>
            <h5>⭐ Show Support</h5>
            <p>Star the repository and share PseudoRun with others</p>
            <a href="#" className={styles.communityLink}>Star on GitHub</a>
          </div>
        </div>
      </div>

      {/* Project Roadmap */}
      <div className={styles.roadmapSection}>
        <h4>🗺️ Project Roadmap</h4>
        <div className={styles.roadmapTimeline}>
          <div className={styles.roadmapItem}>
            <div className={styles.roadmapMarker}>
              <span className={styles.roadmapVersion}>v2.0</span>
              <span className={styles.roadmapStatus}>Planned</span>
            </div>
            <h5>Advanced Debugger</h5>
            <p>Breakpoints, watch expressions, call stack visualization</p>
          </div>
          <div className={styles.roadmapItem}>
            <div className={styles.roadmapMarker}>
              <span className={styles.roadmapVersion}>v2.1</span>
              <span className={styles.roadmapStatus}>In Progress</span>
            </div>
            <h5>Collaborative Editing</h5>
            <p>Real-time collaboration with live cursors and shared state</p>
          </div>
          <div className={styles.roadmapItem}>
            <div className={styles.roadmapMarker}>
              <span className={styles.roadmapVersion}>v2.2</span>
              <span className={styles.roadmapStatus}>Research</span>
            </div>
            <h5>AI Assistant</h5>
            <p>AI-powered code completion and learning assistance</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeveloperResources;