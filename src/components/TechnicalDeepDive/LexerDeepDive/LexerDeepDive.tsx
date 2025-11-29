import React, { useState, useEffect, useRef } from 'react';
import { tokenize } from '../../../interpreter/lexer';
import { Token } from '../../../interpreter/types';
import styles from '../styles/TechnicalDeepDive.css';

interface LexerDeepDiveProps {
  technicalLevel: 'high' | 'medium' | 'deep';
}

const LexerDeepDive: React.FC<LexerDeepDiveProps> = ({ technicalLevel }) => {
  const [code, setCode] = useState(`DECLARE name : STRING
DECLARE age : INTEGER
DECLARE score : REAL
name ← "Alice"
age ← 25
score ← 95.5
OUTPUT "Name: " + name
OUTPUT "Age: " + age
IF age >= 18 THEN
    OUTPUT "Adult"
ELSE
    OUTPUT "Minor"
ENDIF`);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [showTokenDetails, setShowTokenDetails] = useState<string | null>(null);
  const [currentLine, setCurrentLine] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(100);
  const animationRef = useRef<NodeJS.Timeout | null>(null);

  // Tokenize code whenever it changes
  useEffect(() => {
    try {
      const newTokens = tokenize(code);
      setTokens(newTokens);
    } catch (error) {
      setTokens([]);
    }
  }, [code]);

  // Animation logic for token-by-token visualization
  useEffect(() => {
    if (!isAnimating) {
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
      return;
    }

    let index = 0;
    animationRef.current = setInterval(() => {
      if (index < tokens.length) {
        setCurrentLine(tokens[index].line);
        index++;
      } else {
        setIsAnimating(false);
        if (animationRef.current) {
          clearInterval(animationRef.current);
        }
      }
    }, animationSpeed);

    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
    };
  }, [isAnimating, tokens, animationSpeed]);

  // Token type colors
  const getTokenColor = (tokenType: string) => {
    const colors: { [key: string]: string } = {
      'KEYWORD': '#8b5cf6',
      'IDENTIFIER': '#6366f1',
      'STRING': '#ef4444',
      'NUMBER': '#10b981',
      'OPERATOR': '#f59e0b',
      'ASSIGNMENT': '#f59e0b',
      'COMMENT': '#6b7280',
      'NEWLINE': '#d1d5db',
      'COMMA': '#d1d5db',
      'COLON': '#d1d5db',
      'LPAREN': '#d1d5db',
      'RPAREN': '#d1d5db',
      'LBRACKET': '#d1d5db',
      'RBRACKET': '#d1d5db',
      'EOF': '#ef4444'
    };
    return colors[tokenType] || '#d1d5db';
  };

  // Sample code snippets for demonstration
  const sampleCode = [
    {
      name: 'Variable Declaration',
      code: `DECLARE x : INTEGER
DECLARE y : REAL
DECLARE name : STRING
x ← 10
y ← 3.14
name ← "John"`
    },
    {
      name: 'Control Structure',
      code: `IF score >= 90 THEN
    OUTPUT "Excellent"
ELSE IF score >= 70 THEN
    OUTPUT "Good"
ELSE
    OUTPUT "Needs Improvement"
ENDIF`
    },
    {
      name: 'Loop Example',
      code: `FOR i ← 1 TO 5
    OUTPUT "Count: " + i
NEXT i

WHILE x < 10 DO
    x ← x + 1
    OUTPUT x
ENDWHILE`
    },
    {
      name: 'Function Call',
      code: `DECLARE result : INTEGER
result ← LENGTH("Hello")
OUTPUT "Length: " + result
result ← ROUND(3.14159, 2)
OUTPUT "Rounded: " + result`
    }
  ];

  const getLexerContent = () => {
    switch (technicalLevel) {
      case 'high':
        return {
          title: 'The Lexer: Converting Code to Tokens',
          subtitle: 'First step in interpreting pseudocode',
          description: 'The lexer scans your pseudocode character by character, converting it into meaningful tokens that the parser can understand. This is the foundation of how PseudoRun understands your code.'
        };

      case 'medium':
        return {
          title: 'Lexical Analysis with IGCSE Support',
          subtitle: 'Character-by-character scanning with 40+ token types',
          description: 'PseudoRun\'s lexer implements sophisticated character recognition with support for IGCSE/A-LEVELS syntax including multi-character operators, string literals, comments, and assignment operators (←, <--).'
        };

      case 'deep':
        return {
          title: 'Production-Grade Lexer Implementation',
          subtitle: 'State machine pattern with precise error reporting',
          description: 'Built with TypeScript for type safety, the lexer uses character-by-character scanning with Set-based keyword lookup (O(1) complexity), position tracking for precise error reporting, and comprehensive support for IGCSE pseudocode specifications.'
        };

      default:
        return {
          title: 'Lexer: Token Analysis',
          subtitle: 'Code scanning and tokenization',
          description: 'Understanding how PseudoRun processes code.'
        };
    }
  };

  const content = getLexerContent();

  const technicalDetails = technicalLevel === 'deep' ? [
    {
      feature: 'Character-by-Character Scanning',
      description: 'O(n) complexity with single pass through source code',
      implementation: 'lexer.ts:25-226'
    },
    {
      feature: 'Keyword Recognition',
      description: 'Set-based lookup with 40+ IGCSE keywords for O(1) access',
      implementation: 'lexer.ts:8-17'
    },
    {
      feature: 'Multi-Character Operators',
      description: 'Support for <=, >=, <> and other compound operators',
      implementation: 'lexer.ts:132-151'
    },
    {
      feature: 'String Literal Handling',
      description: 'Support for both double-quoted and single-quoted strings',
      implementation: 'lexer.ts:58-102'
    },
    {
      feature: 'Position Tracking',
      description: 'Precise line and column numbers for error reporting',
      implementation: 'lexer.ts:21-24'
    },
    {
      feature: 'Assignment Operators',
      description: 'Support for both ← (arrow) and <-- (dash) assignments',
      implementation: 'lexer.ts:118-129'
    }
  ] : [];

  return (
    <div className={styles.lexerDeepDive}>
      <div className={styles.sectionHeader}>
        <h2>{content.title}</h2>
        <h3>{content.subtitle}</h3>
        <p>{content.description}</p>
      </div>

      {/* Interactive Lexer Playground */}
      <div className={styles.lexerPlayground}>
        <div className={styles.playgroundHeader}>
          <h4>🔬 Live Lexer Playground</h4>
          <p>Try typing pseudocode and see how it gets tokenized in real-time</p>
        </div>

        <div className={styles.playgroundGrid}>
          {/* Code Input */}
          <div className={styles.codeInput}>
            <h5>Input Pseudocode</h5>
            <textarea
              className={styles.codeTextarea}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter your pseudocode here..."
              spellCheck={false}
            />

            <div className={styles.sampleCodeSection}>
              <h6>Sample Code:</h6>
              <div className={styles.sampleCodeGrid}>
                {sampleCode.map((sample) => (
                  <button
                    key={sample.name}
                    className={styles.sampleButton}
                    onClick={() => setCode(sample.code)}
                  >
                    {sample.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Token Output */}
          <div className={styles.tokenOutput}>
            <h5>Generated Tokens</h5>
            <div className={styles.tokenControls}>
              <button
                className={styles.button}
                onClick={() => setIsAnimating(!isAnimating)}
              >
                {isAnimating ? '⏸️ Pause Animation' : '▶️ Animate'}
              </button>
              <div className={styles.speedControl}>
                <label>Speed:</label>
                <input
                  type="range"
                  min="50"
                  max="500"
                  value={animationSpeed}
                  onChange={(e) => setAnimationSpeed(parseInt(e.target.value))}
                />
                <span>{animationSpeed}ms</span>
              </div>
            </div>

            <div className={styles.tokenDisplay}>
              {tokens.length === 0 ? (
                <div className={styles.emptyState}>
                  <p>No tokens to display</p>
                  <p>Enter some pseudocode to see tokenization</p>
                </div>
              ) : (
                <div className={styles.tokenList}>
                  {tokens.map((token, index) => (
                    <div
                      key={index}
                      className={`${styles.token} ${
                        isAnimating && token.line <= currentLine ? styles.animated : ''
                      }`}
                      style={{ borderColor: getTokenColor(token.type) }}
                      onMouseEnter={() => setShowTokenDetails(`${index}`)}
                      onMouseLeave={() => setShowTokenDetails(null)}
                    >
                      <div className={styles.tokenType} style={{ color: getTokenColor(token.type) }}>
                        {token.type}
                      </div>
                      <div className={styles.tokenValue}>
                        {token.value === '\n' ? '\\n' :
                         token.value === '' ? 'EOF' :
                         token.value}
                      </div>
                      <div className={styles.tokenPosition}>
                        L{token.line}:C{token.column}
                      </div>

                      {showTokenDetails === `${index}` && (
                        <div className={styles.tokenTooltip}>
                          <div className={styles.tooltipHeader}>
                            Token Details
                          </div>
                          <div className={styles.tooltipContent}>
                            <div className={styles.tooltipRow}>
                              <strong>Type:</strong> {token.type}
                            </div>
                            <div className={styles.tooltipRow}>
                              <strong>Value:</strong> "{token.value}"
                            </div>
                            <div className={styles.tooltipRow}>
                              <strong>Line:</strong> {token.line}
                            </div>
                            <div className={styles.tooltipRow}>
                              <strong>Column:</strong> {token.column}
                            </div>
                            {technicalLevel === 'deep' && (
                              <div className={styles.tooltipRow}>
                                <strong>Index:</strong> {index}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Statistics */}
            <div className={styles.tokenStats}>
              <div className={styles.statItem}>
                <div className={styles.statValue}>{tokens.length}</div>
                <div className={styles.statLabel}>Total Tokens</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statValue}>
                  {new Set(tokens.map(t => t.type)).size}
                </div>
                <div className={styles.statLabel}>Token Types</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statValue}>
                  {Math.max(...tokens.map(t => t.line))}
                </div>
                <div className={styles.statLabel}>Lines</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Implementation Details */}
      {technicalLevel !== 'high' && (
        <div className={styles.implementationDetails}>
          <h4>Technical Implementation</h4>

          {technicalLevel === 'medium' && (
            <div className={styles.mediumDetailGrid}>
              <div className={styles.detailItem}>
                <h5>🔍 Scanning Algorithm</h5>
                <p>Character-by-character processing with position tracking for precise error reporting and debugging.</p>
              </div>
              <div className={styles.detailItem}>
                <h5>📝 Token Types</h5>
                <p>Supports 40+ token types including keywords, identifiers, literals, operators, and punctuation.</p>
              </div>
              <div className={styles.detailItem}>
                <h5>🔧 Operator Recognition</h5>
                <p>Handles multi-character operators like <=, >=, and <> with proper precedence.</p>
              </div>
              <div className={styles.detailItem}>
                <h5>📄 String Handling</h5>
                <p>Supports both single and double-quoted strings with escape character handling.</p>
              </div>
            </div>
          )}

          {technicalLevel === 'deep' && (
            <div className={styles.deepDetailGrid}>
              {technicalDetails.map((detail, index) => (
                <div key={index} className={styles.deepDetailItem}>
                  <h5>{detail.feature}</h5>
                  <p>{detail.description}</p>
                  <div className={styles.codeReference}>
                    <code>{detail.implementation}</code>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Performance Characteristics */}
      <div className={styles.performanceSection}>
        <h4>Performance Characteristics</h4>
        <div className={styles.performanceGrid}>
          <div className={styles.performanceItem}>
            <div className={styles.performanceMetric}>
              <div className={styles.metricValue}>O(n)</div>
              <div className={styles.metricLabel}>Time Complexity</div>
            </div>
            <p>Linear time complexity with single pass through source code</p>
          </div>
          <div className={styles.performanceItem}>
            <div className={styles.performanceMetric}>
              <div className={styles.metricValue}>O(n)</div>
              <div className={styles.metricLabel}>Space Complexity</div>
            </div>
            <p>Linear space proportional to number of tokens generated</p>
          </div>
          <div className={styles.performanceItem}>
            <div className={styles.performanceMetric}>
              <div className={styles.metricValue}>1000+</div>
              <div className={styles.metricLabel}>Lines/Second</div>
            </div>
            <p>Can tokenize over 1000 lines of code per second</p>
          </div>
          <div className={styles.performanceItem}>
            <div className={styles.performanceMetric}>
              <div className={styles.metricValue}>O(1)</div>
              <div className={styles.metricLabel}>Keyword Lookup</div>
            </div>
            <p>Constant-time keyword recognition using Set data structure</p>
          </div>
        </div>
      </div>

      {/* IGCSE Support Matrix */}
      <div className={styles.igcseSupport}>
        <h4>IGCSE Pseudocode Support</h4>
        <div className={styles.supportGrid}>
          <div className={styles.supportCategory}>
            <h5>Data Types</h5>
            <ul>
              <li>INTEGER, REAL, STRING, CHAR, BOOLEAN</li>
              <li>ARRAY declaration and initialization</li>
              <li>CONSTANT declaration</li>
            </ul>
          </div>
          <div className={styles.supportCategory}>
            <h5>Operators</h5>
            <ul>
              <li>Arithmetic: +, -, *, /, DIV, MOD</li>
              <li>Comparison: =, <>, <, >, <=, >=</li>
              <li>Logical: AND, OR, NOT</li>
              <li>Assignment: ←, <--</li>
            </ul>
          </div>
          <div className={styles.supportCategory}>
            <h5>Control Structures</h5>
            <ul>
              <li>IF...THEN...ELSE...ENDIF</li>
              <li>WHILE...DO...ENDWHILE</li>
              <li>FOR...TO...STEP...NEXT</li>
              <li>REPEAT...UNTIL</li>
              <li>CASE...OF...OTHERWISE...ENDCASE</li>
            </ul>
          </div>
          <div className={styles.supportCategory}>
            <h5>Input/Output</h5>
            <ul>
              <li>INPUT variable</li>
              <li>OUTPUT expression</li>
              <li>File operations with OPENFILE, CLOSEFILE</li>
              <li>READFILE, WRITEFILE, EOF function</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LexerDeepDive;