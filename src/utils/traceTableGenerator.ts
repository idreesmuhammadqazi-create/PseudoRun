// IGCSE/A-LEVELS Trace Table Generator

export interface TraceTableRow {
  step: number;
  line: number;
  statement: string;
  variables: { [key: string]: string };
  output?: string;
}

export interface TraceTable {
  variables: string[];
  rows: TraceTableRow[];
  hasOutput: boolean;
}

interface Variable {
  name: string;
  value: any;
  type: string;
}

export function generateTraceTable(code: string): TraceTable {
  const lines = code.split('\n').filter(line => {
    const trimmed = line.trim();
    return trimmed && !trimmed.startsWith('//');
  });

  const variables: Map<string, Variable> = new Map();
  const rows: TraceTableRow[] = [];
  let stepNumber = 0;
  let hasOutput = false;

  // First pass: find all DECLARE statements to identify variables
  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('DECLARE')) {
      const match = trimmed.match(/DECLARE\s+(\w+)\s*:\s*(\w+)/i);
      if (match) {
        const varName = match[1];
        const varType = match[2];
        variables.set(varName, { name: varName, value: undefined, type: varType });

        // Add a row for the declaration
        const varSnapshot: { [key: string]: string } = {};
        variables.forEach((v, k) => {
          varSnapshot[k] = v.value === undefined ? '?' : String(v.value);
        });

        stepNumber++;
        rows.push({
          step: stepNumber,
          line: index + 1,
          statement: trimmed,
          variables: varSnapshot
        });
      }
    }
  });

  // Second pass: simulate execution
  lines.forEach((line, index) => {
    const trimmed = line.trim();

    // Skip DECLARE statements (already processed)
    if (trimmed.startsWith('DECLARE')) {
      return;
    }

    // Skip control flow keywords that don't change variables
    if (
      trimmed.startsWith('THEN') ||
      trimmed.startsWith('ELSE') ||
      trimmed.startsWith('ENDIF') ||
      trimmed.startsWith('ENDWHILE') ||
      trimmed.startsWith('ENDFOR') ||
      trimmed.startsWith('NEXT') ||
      trimmed.startsWith('UNTIL') ||
      trimmed === 'DO'
    ) {
      return;
    }

    let shouldAddRow = false;
    let outputValue: string | undefined;

    // Handle INPUT statements
    if (trimmed.startsWith('INPUT')) {
      const match = trimmed.match(/INPUT\s+(\w+)/i);
      if (match) {
        const varName = match[1];
        if (variables.has(varName)) {
          const varType = variables.get(varName)!.type.toUpperCase();
          // Simulate input based on type
          if (varType === 'INTEGER') {
            variables.get(varName)!.value = 10; // Example value
          } else if (varType === 'REAL') {
            variables.get(varName)!.value = 5.5; // Example value
          } else if (varType === 'STRING') {
            variables.get(varName)!.value = '"Hello"'; // Example value
          } else if (varType === 'BOOLEAN') {
            variables.get(varName)!.value = 'TRUE'; // Example value
          } else {
            variables.get(varName)!.value = 'input'; // Default
          }
          shouldAddRow = true;
        }
      }
    }

    // Handle OUTPUT statements
    if (trimmed.startsWith('OUTPUT') || trimmed.startsWith('PRINT')) {
      hasOutput = true;
      const match = trimmed.match(/(?:OUTPUT|PRINT)\s+(.+)/i);
      if (match) {
        const expression = match[1].trim();
        // Try to evaluate the expression
        if (variables.has(expression)) {
          outputValue = String(variables.get(expression)!.value);
        } else if (expression.startsWith('"') && expression.endsWith('"')) {
          outputValue = expression.slice(1, -1);
        } else {
          outputValue = expression;
        }
        shouldAddRow = true;
      }
    }

    // Handle assignments (using <-- or :=)
    if (trimmed.includes('<--') || trimmed.includes(':=')) {
      const separator = trimmed.includes('<--') ? '<--' : ':=';
      const parts = trimmed.split(separator);
      if (parts.length === 2) {
        const varName = parts[0].trim();
        const expression = parts[1].trim();

        if (variables.has(varName)) {
          // Try to evaluate simple expressions
          const value = evaluateExpression(expression, variables);
          variables.get(varName)!.value = value;
          shouldAddRow = true;
        } else {
          // Variable not declared, but still track it
          variables.set(varName, { name: varName, value: evaluateExpression(expression, variables), type: 'UNKNOWN' });
          shouldAddRow = true;
        }
      }
    }

    // Handle IF, WHILE, FOR, REPEAT conditions
    if (
      trimmed.startsWith('IF') ||
      trimmed.startsWith('WHILE') ||
      trimmed.startsWith('FOR') ||
      trimmed.startsWith('REPEAT')
    ) {
      shouldAddRow = true;
    }

    // Add row if state changed
    if (shouldAddRow) {
      const varSnapshot: { [key: string]: string } = {};
      variables.forEach((v, k) => {
        varSnapshot[k] = v.value === undefined ? '?' : String(v.value);
      });

      stepNumber++;
      rows.push({
        step: stepNumber,
        line: index + 1,
        statement: trimmed.length > 50 ? trimmed.substring(0, 47) + '...' : trimmed,
        variables: varSnapshot,
        output: outputValue
      });
    }
  });

  return {
    variables: Array.from(variables.keys()),
    rows,
    hasOutput
  };
}

function evaluateExpression(expr: string, variables: Map<string, Variable>): any {
  expr = expr.trim();

  // String literal
  if (expr.startsWith('"') && expr.endsWith('"')) {
    return expr;
  }

  // Number literal
  if (!isNaN(Number(expr))) {
    return Number(expr);
  }

  // Boolean literal
  if (expr === 'TRUE' || expr === 'FALSE') {
    return expr;
  }

  // Single variable
  if (variables.has(expr)) {
    return variables.get(expr)!.value;
  }

  // Simple arithmetic operations
  if (expr.includes('+')) {
    const parts = expr.split('+').map(p => p.trim());
    if (parts.length === 2) {
      const left = variables.has(parts[0]) ? variables.get(parts[0])!.value : Number(parts[0]);
      const right = variables.has(parts[1]) ? variables.get(parts[1])!.value : Number(parts[1]);
      if (typeof left === 'number' && typeof right === 'number') {
        return left + right;
      }
    }
  }

  if (expr.includes('-')) {
    const parts = expr.split('-').map(p => p.trim());
    if (parts.length === 2 && parts[0] !== '') {
      const left = variables.has(parts[0]) ? variables.get(parts[0])!.value : Number(parts[0]);
      const right = variables.has(parts[1]) ? variables.get(parts[1])!.value : Number(parts[1]);
      if (typeof left === 'number' && typeof right === 'number') {
        return left - right;
      }
    }
  }

  if (expr.includes('*')) {
    const parts = expr.split('*').map(p => p.trim());
    if (parts.length === 2) {
      const left = variables.has(parts[0]) ? variables.get(parts[0])!.value : Number(parts[0]);
      const right = variables.has(parts[1]) ? variables.get(parts[1])!.value : Number(parts[1]);
      if (typeof left === 'number' && typeof right === 'number') {
        return left * right;
      }
    }
  }

  if (expr.includes('/')) {
    const parts = expr.split('/').map(p => p.trim());
    if (parts.length === 2) {
      const left = variables.has(parts[0]) ? variables.get(parts[0])!.value : Number(parts[0]);
      const right = variables.has(parts[1]) ? variables.get(parts[1])!.value : Number(parts[1]);
      if (typeof left === 'number' && typeof right === 'number' && right !== 0) {
        return left / right;
      }
    }
  }

  // Function calls
  if (expr.includes('LENGTH(')) {
    const match = expr.match(/LENGTH\((\w+)\)/i);
    if (match && variables.has(match[1])) {
      const value = variables.get(match[1])!.value;
      if (typeof value === 'string') {
        return value.length - 2; // Subtract quotes
      }
    }
  }

  // Default: return as string
  return expr;
}
