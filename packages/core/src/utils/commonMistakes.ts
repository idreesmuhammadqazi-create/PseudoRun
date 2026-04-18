/**
 * Common Mistakes Detector
 * Identifies typical student errors in pseudocode
 */

export interface CommonMistake {
  line: number;
  type: 'warning' | 'info';
  category: string;
  message: string;
  suggestion: string;
}

export function detectCommonMistakes(code: string): CommonMistake[] {
  const mistakes: CommonMistake[] = [];
  const lines = code.split('\n');

  lines.forEach((line, index) => {
    const lineNum = index + 1;
    const trimmed = line.trim();

    // Skip empty lines and comments
    if (!trimmed || trimmed.startsWith('//')) return;

    // Mistake 1: Using = instead of <-- for assignment
    if (/\w+\s*=\s*[^=<>]/.test(trimmed) && !/IF|WHILE|UNTIL/.test(trimmed)) {
      mistakes.push({
        line: lineNum,
        type: 'warning',
        category: 'Assignment',
        message: 'Using = for assignment (should use <--)',
        suggestion: 'In pseudocode, use <-- for assignment, not ='
      });
    }

    // Mistake 2: Using == for comparison
    if (/==/.test(trimmed)) {
      mistakes.push({
        line: lineNum,
        type: 'warning',
        category: 'Comparison',
        message: 'Using == for comparison (should use =)',
        suggestion: 'In pseudocode, use = for comparison, not =='
      });
    }

    // Mistake 3: Missing DECLARE
    if (/^[A-Z][a-zA-Z0-9]*\s*<--/.test(trimmed) && !code.includes(`DECLARE ${trimmed.split('<--')[0].trim()}`)) {
      mistakes.push({
        line: lineNum,
        type: 'info',
        category: 'Variables',
        message: 'Variable used without DECLARE statement',
        suggestion: 'Always declare variables before use with DECLARE'
      });
    }

    // Mistake 4: Array indexing from 0
    if (/\[\s*0\s*\]/.test(trimmed)) {
      mistakes.push({
        line: lineNum,
        type: 'warning',
        category: 'Arrays',
        message: 'Array indexed from 0 (pseudocode uses 1-based indexing)',
        suggestion: 'Cambridge pseudocode arrays start at index 1, not 0'
      });
    }

    // Mistake 5: Using brackets instead of THEN/DO/ENDLOOP
    if (/\{|\}/.test(trimmed)) {
      mistakes.push({
        line: lineNum,
        type: 'warning',
        category: 'Syntax',
        message: 'Using curly braces { } (not valid in pseudocode)',
        suggestion: 'Use THEN...ENDIF, DO...ENDWHILE instead of braces'
      });
    }

    // Mistake 6: Missing ENDIF/ENDWHILE/NEXT
    if (/^IF\s+/i.test(trimmed)) {
      const ifMatch = code.substring(code.indexOf(trimmed));
      if (!/ENDIF/i.test(ifMatch.split('\n').slice(0, 10).join('\n'))) {
        mistakes.push({
          line: lineNum,
          type: 'warning',
          category: 'Control Flow',
          message: 'IF statement may be missing ENDIF',
          suggestion: 'Every IF must end with ENDIF'
        });
      }
    }

    // Mistake 7: Using wrong loop syntax
    if (/for\s*\(/i.test(trimmed)) {
      mistakes.push({
        line: lineNum,
        type: 'warning',
        category: 'Loops',
        message: 'Using programming language syntax for loop',
        suggestion: 'Use: FOR i <-- 1 TO 10 ... NEXT i'
      });
    }

    // Mistake 8: Using print/console.log instead of OUTPUT
    if (/(print|console\.log|cout|printf)/i.test(trimmed)) {
      mistakes.push({
        line: lineNum,
        type: 'warning',
        category: 'I/O',
        message: 'Using programming language output function',
        suggestion: 'Use OUTPUT for displaying results in pseudocode'
      });
    }

    // Mistake 9: Using wrong string concatenation
    if (/\+\s*"/.test(trimmed) && /OUTPUT/i.test(trimmed)) {
      mistakes.push({
        line: lineNum,
        type: 'info',
        category: 'Output',
        message: 'Using + for string concatenation in OUTPUT',
        suggestion: 'In OUTPUT, use commas to separate values: OUTPUT "text", variable'
      });
    }

    // Mistake 10: Missing RETURNS in function definition
    if (/^FUNCTION\s+\w+/i.test(trimmed) && !/RETURNS/i.test(trimmed)) {
      mistakes.push({
        line: lineNum,
        type: 'warning',
        category: 'Functions',
        message: 'FUNCTION missing RETURNS type declaration',
        suggestion: 'Functions must specify return type: FUNCTION Name() RETURNS INTEGER'
      });
    }

    // Mistake 11: Using != instead of <>
    if (/!=/.test(trimmed)) {
      mistakes.push({
        line: lineNum,
        type: 'warning',
        category: 'Comparison',
        message: 'Using != for not equal (should use <>)',
        suggestion: 'In pseudocode, use <> for "not equal", not !='
      });
    }

    // Mistake 12: Using && or || instead of AND/OR
    if (/&&|\|\|/.test(trimmed)) {
      mistakes.push({
        line: lineNum,
        type: 'warning',
        category: 'Logic',
        message: 'Using && or || (should use AND/OR)',
        suggestion: 'Use AND, OR, NOT keywords instead of &&, ||, !'
      });
    }

    // Mistake 13: Missing DO in WHILE loop
    if (/^WHILE\s+.*(?!DO)$/i.test(trimmed) && !/DO/i.test(trimmed)) {
      mistakes.push({
        line: lineNum,
        type: 'warning',
        category: 'Loops',
        message: 'WHILE statement missing DO keyword',
        suggestion: 'WHILE loops need DO: WHILE condition DO'
      });
    }

    // Mistake 14: Inconsistent case for keywords
    if (/\b(if|then|else|for|while|declare|output|input)\b/.test(trimmed)) {
      mistakes.push({
        line: lineNum,
        type: 'info',
        category: 'Style',
        message: 'Keywords should be in UPPERCASE',
        suggestion: 'Convention: use UPPERCASE for keywords (IF, THEN, DECLARE, etc.)'
      });
    }
  });

  return mistakes;
}
