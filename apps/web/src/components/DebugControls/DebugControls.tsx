/**
 * Debug Controls Component
 * Provides step-by-step debugging controls
 */

import styles from './DebugControls.module.css';

interface DebugControlsProps {
  onStep: () => void;
  onContinue: () => void;
  onStop: () => void;
  isDebugging: boolean;
  isPaused: boolean;
  waitingForInput?: boolean;
  waitingForFileUpload?: boolean;
}

export default function DebugControls({
  onStep,
  onContinue,
  onStop,
  isDebugging,
  isPaused,
  waitingForInput = false,
  waitingForFileUpload = false
}: DebugControlsProps) {
  if (!isDebugging) {
    return null;
  }

  const isWaitingForUserInput = waitingForInput || waitingForFileUpload;

  return (
    <div className={styles.container}>
      <div className={styles.status}>
        {isWaitingForUserInput ? '⏳ Waiting for Input' : isPaused ? '⏸ Paused' : '▶ Running'}
      </div>

      {!isWaitingForUserInput && (
        <div className={styles.buttons}>
          <button
            className={styles.stepButton}
            onClick={onStep}
            disabled={!isPaused}
            title="Step to next line (F10)"
          >
            Step
          </button>

          <button
            className={styles.continueButton}
            onClick={onContinue}
            disabled={!isPaused}
            title="Continue execution (F5)"
          >
            Continue
          </button>

          <button
            className={styles.stopButton}
            onClick={onStop}
            title="Stop debugging"
          >
            Stop
          </button>
        </div>
      )}

      {isWaitingForUserInput && (
        <div className={styles.inputHint}>
          Provide input in the output panel below, then continue debugging
        </div>
      )}
    </div>
  );
}
