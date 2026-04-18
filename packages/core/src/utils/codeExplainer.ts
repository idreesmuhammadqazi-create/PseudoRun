/**
 * Code Explanation Utility
 * Analyzes pseudocode and provides human-readable explanations
 */

export interface CodeExplanation {
  summary: string;
  details: string[];
  complexity: string;
  suggestions: string[];
}

export function explainCode(code: string): CodeExplanation {
  const summary = generateSummary(code);
  const details = generateDetails(code);
  const complexity = analyzeComplexity(code);
  const suggestions = generateSuggestions(code);

  return { summary, details, complexity, suggestions };
}

function generateSummary(code: string): string {
  const hasInput = /INPUT/i.test(code);
  const hasOutput = /OUTPUT/i.test(code);
  const hasLoop = /(FOR|WHILE|REPEAT)/i.test(code);
  const hasFunction = /FUNCTION/i.test(code);
  const hasProcedure = /PROCEDURE/i.test(code);
  const hasArray = /ARRAY\[/i.test(code);
  const hasSelection = /(IF|CASE)/i.test(code);

  let summary = 'This program ';
  const features = [];

  if (hasInput) features.push('accepts user input');
  if (hasLoop) features.push('uses loops for repetition');
  if (hasArray) features.push('works with arrays');
  if (hasSelection) features.push('makes decisions using conditionals');
  if (hasFunction || hasProcedure) features.push('defines reusable functions/procedures');
  if (hasOutput) features.push('displays output');

  if (features.length === 0) {
    return 'This is a simple program with variable declarations and assignments.';
  }

  summary += features.join(', ') + '.';
  return summary;
}

function generateDetails(code: string): string[] {
  const details: string[] = [];

  // Check for variables
  const declareMatches = code.match(/DECLARE\s+(\w+)\s*:\s*(\w+)/gi);
  if (declareMatches && declareMatches.length > 0) {
    details.push(`Declares ${declareMatches.length} variable(s) with specific data types`);
  }

  // Check for arrays
  const arrayMatches = code.match(/ARRAY\[(\d+):(\d+)\]/gi);
  if (arrayMatches) {
    details.push(`Uses array(s) to store multiple values`);
  }

  // Check for input
  if (/INPUT/i.test(code)) {
    details.push('Prompts user for input data');
  }

  // Check for loops
  const forLoops = (code.match(/FOR\s+\w+/gi) || []).length;
  const whileLoops = (code.match(/WHILE\s+/gi) || []).length;
  const repeatLoops = (code.match(/REPEAT/gi) || []).length;

  if (forLoops > 0) details.push(`Contains ${forLoops} FOR loop(s) for fixed iterations`);
  if (whileLoops > 0) details.push(`Contains ${whileLoops} WHILE loop(s) for conditional repetition`);
  if (repeatLoops > 0) details.push(`Contains ${repeatLoops} REPEAT loop(s) that execute at least once`);

  // Check for conditionals
  const ifStatements = (code.match(/IF\s+/gi) || []).length;
  const caseStatements = (code.match(/CASE\s+OF/gi) || []).length;

  if (ifStatements > 0) details.push(`Uses ${ifStatements} IF statement(s) for decision making`);
  if (caseStatements > 0) details.push(`Uses ${caseStatements} CASE statement(s) for multi-way selection`);

  // Check for functions/procedures
  const functions = (code.match(/FUNCTION\s+(\w+)/gi) || []).length;
  const procedures = (code.match(/PROCEDURE\s+(\w+)/gi) || []).length;

  if (functions > 0) details.push(`Defines ${functions} function(s) that return values`);
  if (procedures > 0) details.push(`Defines ${procedures} procedure(s) for reusable code blocks`);

  // Check for built-in functions
  if (/LENGTH\(/i.test(code)) details.push('Uses LENGTH() to get string length');
  if (/SUBSTRING\(/i.test(code)) details.push('Uses SUBSTRING() to extract parts of strings');
  if (/RANDOM\(/i.test(code)) details.push('Uses RANDOM() to generate random numbers');

  // Check for output
  if (/OUTPUT/i.test(code)) {
    details.push('Displays results to the screen');
  }

  if (details.length === 0) {
    details.push('Contains basic variable operations');
  }

  return details;
}

function analyzeComplexity(code: string): string {
  let complexity = 'O(1) - Constant';

  // Check for nested loops
  const nestedLoopPattern = /(FOR|WHILE|REPEAT)[\s\S]*?(FOR|WHILE|REPEAT)/i;
  if (nestedLoopPattern.test(code)) {
    const depth = countNestedLoops(code);
    if (depth >= 2) {
      complexity = 'O(n²) - Quadratic (nested loops detected)';
    }
    if (depth >= 3) {
      complexity = 'O(n³) - Cubic (triple nested loops detected)';
    }
  } else if (/(FOR|WHILE|REPEAT)/i.test(code)) {
    complexity = 'O(n) - Linear (single loop)';
  }

  return complexity;
}

function countNestedLoops(code: string): number {
  let maxDepth = 0;
  let currentDepth = 0;

  const tokens = code.split(/\s+/);
  for (const token of tokens) {
    if (/^(FOR|WHILE|REPEAT)$/i.test(token)) {
      currentDepth++;
      maxDepth = Math.max(maxDepth, currentDepth);
    } else if (/^(NEXT|ENDWHILE|UNTIL)$/i.test(token)) {
      currentDepth--;
    }
  }

  return maxDepth;
}

function generateSuggestions(code: string): string[] {
  const suggestions: string[] = [];

  // Check for magic numbers
  const numberPattern = /\d{2,}/g;
  const numbers = code.match(numberPattern);
  if (numbers && numbers.length > 2) {
    suggestions.push('Consider using named constants for repeated numeric values');
  }

  // Check for variable naming
  if (/\b[a-z]\b/gi.test(code)) {
    suggestions.push('Use descriptive variable names instead of single letters (except loop counters)');
  }

  // Check for comments
  if (!code.includes('//')) {
    suggestions.push('Add comments to explain complex logic');
  }

  // Check for deeply nested structures
  if (countNestedLoops(code) >= 3) {
    suggestions.push('Consider refactoring deeply nested loops into separate procedures');
  }

  // Check for error handling with INPUT
  if (/INPUT/i.test(code) && !/IF.*THEN/i.test(code)) {
    suggestions.push('Consider adding validation for user input');
  }

  // Check for array bounds
  if (/ARRAY\[/i.test(code) && !/IF.*(<|>|<=|>=).*THEN/i.test(code)) {
    suggestions.push('Ensure array access is within bounds to avoid runtime errors');
  }

  if (suggestions.length === 0) {
    suggestions.push('Code structure looks good! Keep practicing.');
  }

  return suggestions;
}
