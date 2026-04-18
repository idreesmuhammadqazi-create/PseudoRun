/**
 * Variables Panel Component
 * Displays current variable values during debugging
 */

import { Variable } from '@pseudorun/core';
import styles from './VariablesPanel.module.css';

interface VariablesPanelProps {
  variables: Map<string, Variable>;
  currentLine: number;
}

export default function VariablesPanel({ variables, currentLine }: VariablesPanelProps) {
  const formatValue = (variable: Variable): string => {
    if (!variable.initialized) {
      return '<uninitialized>';
    }

    if (variable.type === 'ARRAY') {
      return '<array>';
    }

    if (variable.type === 'STRING') {
      return `"${variable.value}"`;
    }

    if (variable.type === 'BOOLEAN') {
      return variable.value ? 'TRUE' : 'FALSE';
    }

    return String(variable.value);
  };

  const variablesList = Array.from(variables.entries()).sort((a, b) =>
    a[0].localeCompare(b[0])
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Variables</h3>
        <span className={styles.line}>Line {currentLine}</span>
      </div>

      <div className={styles.list}>
        {variablesList.length === 0 ? (
          <div className={styles.empty}>No variables declared yet</div>
        ) : (
          variablesList.map(([name, variable]) => (
            <div key={name} className={styles.variable}>
              <div className={styles.variableName}>{name}</div>
              <div className={styles.variableType}>{variable.type}</div>
              <div className={styles.variableValue}>
                {formatValue(variable)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
