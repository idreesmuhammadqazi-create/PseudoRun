import { useState, useEffect } from 'react';
import styles from './ExamMode.module.css';

interface ExamModeProps {
  isActive: boolean;
  duration: number; // in minutes
  onTimeout: () => void;
  onExit: () => void;
}

export default function ExamMode({ isActive, duration, onTimeout, onExit }: ExamModeProps) {
  const [timeRemaining, setTimeRemaining] = useState(duration * 60); // convert to seconds
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!isActive || isPaused) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, isPaused, onTimeout]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    const percentage = (timeRemaining / (duration * 60)) * 100;
    if (percentage > 50) return styles.timeGood;
    if (percentage > 25) return styles.timeWarning;
    return styles.timeCritical;
  };

  const handleExit = () => {
    if (confirm('Exit exam mode? Your progress will be saved but the timer will stop.')) {
      onExit();
    }
  };

  if (!isActive) return null;

  return (
    <div className={styles.container}>
      <div className={styles.banner}>
        <div className={styles.left}>
          <span className={styles.label}>EXAM MODE</span>
          <span className={styles.info}>Examples and hints disabled</span>
        </div>

        <div className={styles.center}>
          <div className={`${styles.timer} ${getTimeColor()}`}>
            <svg className={styles.clockIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 6v6l4 2"/>
            </svg>
            <span className={styles.time}>{formatTime(timeRemaining)}</span>
          </div>
        </div>

        <div className={styles.right}>
          <button
            className={styles.pauseButton}
            onClick={() => setIsPaused(!isPaused)}
          >
            {isPaused ? 'Resume' : 'Pause'}
          </button>
          <button className={styles.exitButton} onClick={handleExit}>
            Exit Exam
          </button>
        </div>
      </div>
    </div>
  );
}

// Exam Mode Start Modal
interface ExamModeStartModalProps {
  onStart: (duration: number) => void;
  onCancel: () => void;
}

export function ExamModeStartModal({ onStart, onCancel }: ExamModeStartModalProps) {
  const [selectedDuration, setSelectedDuration] = useState(45);

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>Start Exam Mode</h2>
        </div>

        <div className={styles.modalContent}>
          <p className={styles.description}>
            Exam mode simulates real exam conditions:
          </p>
          <ul className={styles.features}>
            <li>⏱️ Timed session with countdown</li>
            <li>🚫 Examples menu disabled</li>
            <li>🚫 Syntax reference disabled</li>
            <li>✅ Full editor and debugging available</li>
          </ul>

          <div className={styles.durationSelector}>
            <label htmlFor="duration">Exam Duration:</label>
            <select
              id="duration"
              value={selectedDuration}
              onChange={(e) => setSelectedDuration(Number(e.target.value))}
              className={styles.select}
            >
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={45}>45 minutes (recommended)</option>
              <option value={60}>60 minutes</option>
              <option value={90}>90 minutes</option>
            </select>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.cancelButton} onClick={onCancel}>
            Cancel
          </button>
          <button
            className={styles.startButton}
            onClick={() => onStart(selectedDuration)}
          >
            Start Exam
          </button>
        </div>
      </div>
    </div>
  );
}
