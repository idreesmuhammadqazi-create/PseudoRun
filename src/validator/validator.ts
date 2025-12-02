/**
 * Validator for IGCSE/A-LEVELS pseudocode
 * Validates syntax and semantics without execution
 */

import { tokenize } from '../interpreter/lexer';
import { parse } from '../interpreter/parser';
import { ValidationError } from './errorTypes';
import { validateSemantics } from './semanticValidator';
import { ASTNode } from '../interpreter/types';

export function validate(code: string): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!code.trim()) {
    return errors;
  }

  let ast: ASTNode[] = [];

  try {
    // Tokenize
    const tokens = tokenize(code);

    // Parse
    ast = parse(tokens);

    // If we get here, code is syntactically valid, proceed to semantic validation
  } catch (error) {
    // Extract line number from error message if present
    const errorMessage = (error as Error).message;
    let line = 1;

    const lineMatch = errorMessage.match(/line (\d+)/);
    if (lineMatch) {
      line = parseInt(lineMatch[1]);
    }

    errors.push({
      line,
      message: errorMessage,
      type: 'syntax'
    });

    return errors;
  }

  // Perform semantic validation
  try {
    const semanticErrors = validateSemantics(ast);
    errors.push(...semanticErrors);
  } catch (error) {
    // If semantic validation itself fails, treat as a syntax error
    const errorMessage = (error as Error).message;
    let line = 1;

    const lineMatch = errorMessage.match(/line (\d+)/);
    if (lineMatch) {
      line = parseInt(lineMatch[1]);
    }

    errors.push({
      line,
      message: `Semantic validation error: ${errorMessage}`,
      type: 'syntax'
    });
  }

  // Sort all errors by line number for consistent user experience
  return errors.sort((a, b) => a.line - b.line);
}
