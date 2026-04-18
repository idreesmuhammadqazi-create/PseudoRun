import styles from './ErrorDisplay.module.css';

interface ErrorMessage {
  line: number;
  message: string;
  type: 'syntax' | 'semantic' | 'runtime';
}

interface ErrorDisplayProps {
  errors: ErrorMessage[];
  isValidating: boolean;
}

export default function ErrorDisplay({ errors, isValidating }: ErrorDisplayProps) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.headerLabel}>Problems</span>
        {errors.length > 0 && (
          <span className={styles.count}>{errors.length}</span>
        )}
      </div>

      {isValidating && <div className={styles.validating}>Validating...</div>}

      {!isValidating && errors.length === 0 && (
        <div className={styles.noErrors}>No problems</div>
      )}

      {!isValidating && errors.length > 0 && (
        <div className={styles.errorList}>
          {errors.map((error, index) => (
            <div key={index} className={styles.errorRow}>
              <span className={styles.errorLine}>Ln {error.line}</span>
              <span className={`${styles.errorType} ${
                error.type === 'syntax' ? styles.typeSyntax :
                error.type === 'semantic' ? styles.typeSemantic :
                styles.typeRuntime
              }`}>
                {error.type}
              </span>
              <span className={styles.errorMessage}>{error.message}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export type { ErrorMessage };
