import { useState } from 'react';
import styles from './Tutorial.module.css';

interface TutorialStep {
  title: string;
  content: string;
  code?: string;
}

const tutorialSteps: TutorialStep[] = [
  {
    title: 'Welcome to Pseudocode Runner!',
    content: 'This tutorial will guide you through writing and running your first IGCSE/A-Level pseudocode program. Click Next to continue.',
  },
  {
    title: 'Step 1: Variables',
    content: 'Variables store data. Use DECLARE to create them with a type (INTEGER, REAL, STRING, BOOLEAN).',
    code: `DECLARE Age : INTEGER
DECLARE Name : STRING
Age <- 16
Name <- "Alice"
OUTPUT Name, " is ", Age, " years old"`,
  },
  {
    title: 'Step 2: Input & Output',
    content: 'Use INPUT to get data from users and OUTPUT to display results.',
    code: `DECLARE Number : INTEGER
OUTPUT "Enter a number:"
INPUT Number
OUTPUT "You entered: ", Number`,
  },
  {
    title: 'Step 3: IF Statements',
    content: 'Make decisions with IF-THEN-ELSE statements.',
    code: `DECLARE Score : INTEGER
Score <- 85
IF Score >= 70 THEN
    OUTPUT "Pass"
ELSE
    OUTPUT "Fail"
ENDIF`,
  },
  {
    title: 'Step 4: Loops',
    content: 'Repeat code with FOR, WHILE, or REPEAT loops.',
    code: `DECLARE Counter : INTEGER
FOR Counter <- 1 TO 5
    OUTPUT "Count: ", Counter
NEXT Counter`,
  },
  {
    title: 'Step 5: Arrays',
    content: 'Store multiple values in arrays. Arrays start at index 1.',
    code: `DECLARE Numbers : ARRAY[1:5] OF INTEGER
DECLARE i : INTEGER
FOR i <- 1 TO 5
    Numbers[i] <- i * 10
NEXT i
OUTPUT Numbers[3]`,
  },
  {
    title: 'Step 6: Procedures',
    content: 'Group reusable code into procedures.',
    code: `PROCEDURE Greet(Name : STRING)
    OUTPUT "Hello, ", Name
ENDPROCEDURE

CALL Greet("Student")`,
  },
  {
    title: 'Step 7: Functions',
    content: 'Functions are like procedures but return a value.',
    code: `FUNCTION Square(Num : INTEGER) RETURNS INTEGER
    RETURN Num * Num
ENDFUNCTION

DECLARE Result : INTEGER
Result <- Square(5)
OUTPUT "5 squared is ", Result`,
  },
  {
    title: 'You\'re Ready!',
    content: 'You now know the basics! Try the Examples menu for more complex programs, or start coding your own. Use Ctrl+Space for autocomplete suggestions.',
  },
];

interface TutorialProps {
  onClose: () => void;
  onLoadCode?: (code: string) => void;
}

export default function Tutorial({ onClose, onLoadCode }: TutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const step = tutorialSteps[currentStep];

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleTryCode = () => {
    if (step.code && onLoadCode) {
      if (confirm('Load this example? This will replace your current code.')) {
        onLoadCode(step.code);
        onClose();
      }
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>{step.title}</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>

        <div className={styles.content}>
          <p className={styles.description}>{step.content}</p>

          {step.code && (
            <div className={styles.codeBlock}>
              <pre>{step.code}</pre>
              <button className={styles.tryButton} onClick={handleTryCode}>
                Try This Code
              </button>
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <div className={styles.progress}>
            Step {currentStep + 1} of {tutorialSteps.length}
          </div>
          <div className={styles.buttons}>
            <button
              className={styles.button}
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              Previous
            </button>
            <button
              className={styles.buttonPrimary}
              onClick={handleNext}
            >
              {currentStep === tutorialSteps.length - 1 ? 'Finish' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
