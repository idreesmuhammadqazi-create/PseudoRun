import React, { useState, useEffect, useRef } from 'react';
import { tokenize } from '../../../interpreter/lexer';
import { Token } from '../../../interpreter/types';
import styles from '../styles/TechnicalDeepDive.css';

interface LexerDeepDiveProps {
  technicalLevel: 'high' | 'medium' | 'deep';
}

const LexerDeepDive: React.FC<LexerDeepDiveProps> = ({ technicalLevel }) => {
  const [code, setCode] = useState(`DECLARE name : STRING\nDECLARE age : INTEGER\nDECLARE score : REAL\nname ← "Alice"\nage ← 25\nscore ← 95.5\nOUTPUT "Name: " + name\nOUTPUT "Age: " + age\nIF age >= 18 THEN\n    OUTPUT "Adult"\nELSE\n    OUTPUT "Minor"\nENDIF\nFOR i ← 1 TO 3\n    OUTPUT "Count: " + i\nNEXT i`);
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
      code: `DECLARE score : INTEGER\nDECLARE name : STRING\nDECLARE pi : REAL\nscore ← 95\nname ← "Alice"\npi ← 3.14159`
    },
    {
      name: 'Control Structures',
      code: `IF age >= 18 THEN\n    OUTPUT "Adult"\nELSE\n    OUTPUT "Minor"\nENDIF\n\nWHILE x < 10 DO\n    x ← x + 1\n    OUTPUT x\nENDWHILE`
    },
    {
      name: 'Loops and Arrays',
      code: `DECLARE numbers : ARRAY[5] OF INTEGER\nDECLARE i : INTEGER\nFOR i ← 1 TO 5\n    numbers[i] ← i * i\n    OUTPUT numbers[i]\nNEXT i\n\nREPEAT\n    INPUT value\n    numbers[index] ← value\n    index ← index + 1\nUNTIL index > 5`
    },
    {
      name: 'Procedures and Functions',
      code: `PROCEDURE CalculateSum(a, b : INTEGER)\n    DECLARE result : INTEGER\n    result ← a + b\n    OUTPUT result\nENDPROCEDURE\n\nFUNCTION Factorial(n : INTEGER) RETURNS INTEGER\n    IF n <= 1 THEN\n        RETURN 1\n    ELSE\n        RETURN n * Factorial(n - 1)\n    ENDIF\nENDFUNCTION`
    }
  ];

  return (
    <div className={styles.lexerDeepDive}>
      <div className={styles.sectionHeader}>
        <h2>The Lexer: Converting Code to Tokens</h2>
        <h3>First step in interpreting pseudocode</h3>
        <p>The lexer scans your pseudocode character by character, converting it into meaningful tokens that the parser can understand. This is the foundation of how PseudoRun understands your code.</p>
      </div>

      {/* Interactive Lexer Playground */}
      <div className={styles.lexerPlayground}>
        <div className={styles.playgroundHeader}>
          <h4>🔍 Live Lexer Playground</h4>
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
                {sampleCode.map((sample, index) => (
                  <button
                    key={index}
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
                className={`${styles.button} ${isAnimating ? styles.running : ''}`}
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
                      className={`${styles.token} ${isAnimating && token.line <= currentLine ? styles.animated : ''}`}
                      style={{ borderColor: getTokenColor(token.type) }}
                      onMouseEnter={() => setShowTokenDetails(`${index}`)}
                      onMouseLeave={() => setShowTokenDetails(null)}
                    >
                      <div className={styles.tokenType} style={{ color: getTokenColor(token.type) }}>
                        {token.type}
                      </div>
                      <div className={styles.tokenValue}>
                        {token.value === '\\n' ? '\\n' :
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

      {/* Technical Implementation Details */}
      <div className={styles.implementationDetails}>
        <h4>Technical Implementation</h4>

        <div className={styles.mediumDetailGrid}>
          <div className={styles.detailItem}>
            <h5>🔍 Scanning Algorithm</h5>
            <p>Character-by-character processing with position tracking for precise error reporting.</p>
          </div>
          <div className={styles.detailItem}>
            <h5>📝 Token Types</h5>
            <p>Supports 40+ token types including keywords, identifiers, literals, operators, and punctuation.</p>
          </div>
          <div className={styles.detailItem}>
            <h5>🔧 Operator Recognition</h5>
            <p>Handles multi-character operators like {'<='}, {'>='}, and {'<>'} with proper precedence.</p>
          </div>
          <div className={styles.detailItem}>
            <h5>📄 String Handling</h5>
            <p>Supports both double-quoted and single-quoted strings with escape character handling.</p>
          </div>
        </div>
      </div>

      {/* Performance Characteristics */}
      <div className={styles.performanceSection}>
        <h4>Performance Characteristics</h4>
        <div className={styles.performanceGrid}>
          <div className={styles.performanceItem}>
            <div className={styles.performanceMetric}>
              <div className={styles.metricValue}>O(n)</div>
              <div className={styles.metricLabel}>Time Complexity</div>
            </div>
            <p>Linear time complexity with single pass through source code.</p>
          </div>
          <div className={styles.performanceItem}>
            <div className={styles.performanceMetric}>
              <div className={styles.metricValue}>O(n)</div>
              <div className={styles.metricLabel}>Space Complexity</div>
            </div>
            <p>Linear space usage proportional to number of tokens generated.</p>
          </div>
          <div className={styles.performanceItem}>
            <div className={styles.performanceMetric}>
              <div className={styles.metricValue}>1000+</div>
              <div className={styles.metricLabel}>Lines/Second</div>
            </div>
            <p>Can tokenize over 1000 lines of code per second.</p>
          </div>
          <div className={styles.performanceItem}>
            <div className={styles.performanceMetric}>
              <div className={styles.metricValue}>O(1)</div>
              <div className={styles.metricLabel}>Keyword Lookup</div>
            </div>
            <p>Constant-time keyword recognition using Set data structure.</p>
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
              <li>Comparison: =, {'<>'}, {'<', '>'}, {'<='}, {'>='}</li>
              <li>Logical: AND, OR, NOT</li>
              <li>Assignment: {'←'}, {'<--'}</li>
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
  </div>
  );
};

export default LexerDeepDive;