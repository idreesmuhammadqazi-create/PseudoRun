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
}

export default function DebugControls({
  onStep,
  onContinue,
  onStop,
  isDebugging,
  isPaused
}: DebugControlsProps) {
  if (!isDebugging) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.status}>
        {isPaused ? '⏸️ Paused' : '▶️ Running'}
      </div>

      <div className={styles.buttons}>
        <button
          className={styles.stepButton}
          onClick={onStep}
          disabled={!isPaused}
          title="Step to next line (F10)"
        >
          ⏭️ Step
        </button>

        <button
          className={styles.continueButton}
          onClick={onContinue}
          disabled={!isPaused}
          title="Continue execution (F5)"
        >
          ▶️ Continue
        </button>

        <button
          className={styles.stopButton}
          onClick={onStop}
          title="Stop debugging"
        >
          ⏹️ Stop
        </button>
      </div>
    </div>
  );
}
