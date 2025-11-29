import React, { useState, useEffect } from 'react';
import styles from '../styles/TechnicalDeepDive.css';

interface InteractivePlaygroundProps {
  technicalLevel: 'high' | 'medium' | 'deep';
}

const InteractivePlayground: React.FC<InteractivePlaygroundProps> = ({ technicalLevel }) => {
  const [code, setCode] = useState(`DECLARE name : STRING
DECLARE age : INTEGER
name ← "World"
age ← 25
OUTPUT "Hello, " + name
OUTPUT "You are " + age + " years old"
IF age >= 18 THEN
    OUTPUT "You are an adult"
ELSE
    OUTPUT "You are a minor"
ENDIF`);

  const [output, setOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const samples = [
    {
      name: 'Basic I/O',
      code: `DECLARE name : STRING
DECLARE age : INTEGER
INPUT "Enter your name: ", name
INPUT "Enter your age: ", age
OUTPUT "Hello, " + name
OUTPUT "Age: " + age`
    },
    {
      name: 'Loop Example',
      code: `DECLARE i, sum : INTEGER
sum ← 0
FOR i ← 1 TO 10
    sum ← sum + i
    OUTPUT "i = " + i + ", sum = " + sum
NEXT i
OUTPUT "Final sum: " + sum`
    },
    {
      name: 'Array Operations',
      code: `DECLARE numbers : ARRAY[5] OF INTEGER
DECLARE i : INTEGER
FOR i ← 1 TO 5
    numbers[i] ← i * i
    OUTPUT "numbers[" + i + "] = " + numbers[i]
NEXT i`
    },
    {
      name: 'Function Example',
      code: `FUNCTION Add(a, b : INTEGER) RETURNS INTEGER
    RETURN a + b
ENDFUNCTION

DECLARE result : INTEGER
result ← Add(10, 20)
OUTPUT "Result: " + result`
    }
  ];

  const handleRun = () => {
    setIsRunning(true);
    setError(null);
    setOutput([]);

    // Simulate execution with sample output
    setTimeout(() => {
      try {
        const sampleOutput = [
          'Hello, World',
          'You are 25 years old',
          'You are an adult'
        ];
        setOutput(sampleOutput);
        setIsRunning(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setIsRunning(false);
      }
    }, 2000);
  };

  const handleClear = () => {
    setOutput([]);
    setError(null);
  };

  return (
    <div className={styles.interactivePlayground}>
      <div className={styles.sectionHeader}>
        <h2>Interactive Playground</h2>
        <h3>Try PseudoCode Live</h3>
        <p>Write and execute IGCSE pseudocode in your browser. See how the lexer, parser, and interpreter work together.</p>
      </div>

      <div className={styles.playgroundContainer}>
        {/* Code Editor */}
        <div className={styles.editorPanel}>
          <div className={styles.panelHeader}>
            <h4>📝 Pseudocode Editor</h4>
            <div className={styles.editorControls}>
              <select
                className={styles.sampleSelect}
                onChange={(e) => {
                  const sample = samples[parseInt(e.target.value)];
                  if (sample) setCode(sample.code);
                }}
              >
                <option value="">Load Sample...</option>
                {samples.map((sample, index) => (
                  <option key={index} value={index}>{sample.name}</option>
                ))}
              </select>
            </div>
          </div>

          <textarea
            className={styles.codeTextarea}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Write your IGCSE pseudocode here..."
            spellCheck={false}
          />

          <div className={styles.runControls}>
            <button
              className={`${styles.button} ${isRunning ? styles.running : ''}`}
              onClick={handleRun}
              disabled={isRunning}
            >
              {isRunning ? '⏸️ Running...' : '▶️ Run Code'}
            </button>
            <button
              className={styles.button}
              onClick={handleClear}
            >
              🗑️ Clear Output
            </button>
          </div>
        </div>

        {/* Output Panel */}
        <div className={styles.outputPanel}>
          <div className={styles.panelHeader}>
            <h4>📊 Output</h4>
            <div className={styles.outputStatus}>
              {isRunning ? '🟡 Running...' : '🟢 Ready'}
            </div>
          </div>

          <div className={styles.outputContainer}>
            {error ? (
              <div className={styles.errorOutput}>
                <div className={styles.errorHeader}>❌ Error</div>
                <div className={styles.errorMessage}>{error}</div>
              </div>
            ) : output.length === 0 ? (
              <div className={styles.emptyOutput}>
                <p>Run your code to see output here</p>
              </div>
            ) : (
              <div className={styles.outputLines}>
                {output.map((line, index) => (
                  <div key={index} className={styles.outputLine}>
                    <span className={styles.lineNumber}>{index + 1}</span>
                    <span className={styles.lineContent}>{line}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {technicalLevel !== 'high' && (
        <div className={styles.playgroundFeatures}>
          <h4>Playground Features</h4>
          <div className={styles.featuresGrid}>
            <div className={styles.featureItem}>
              <h5>🔍 Real-time Validation</h5>
              <p>Syntax checking as you type with immediate error feedback</p>
            </div>
            <div className={styles.featureItem}>
              <h5>⚡ Fast Execution</h5>
              <p>Quick compilation and execution with animated output</p>
            </div>
            <div className={styles.featureItem}>
              <h5>📚 IGCSE Compatible</h5>
              <p>Full support for IGCSE/A-LEVELS pseudocode syntax</p>
            </div>
            {technicalLevel === 'deep' && (
              <div className={styles.featureItem}>
                <h5>🔧 Debug Mode Available</h5>
                <p>Step-by-step execution with variable inspection in full editor</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractivePlayground;