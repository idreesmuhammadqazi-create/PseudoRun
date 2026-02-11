/**
 * Error types for validation
 */

export type ValidationType = 'syntax' | 'semantic' | 'runtime';

export interface ValidationError {
  line: number;
  message: string;
  type: ValidationType;
}

export interface UndeclaredVariableError extends ValidationError {
  type: 'semantic';
  errorSubtype: 'undeclared_variable';
  variableName: string;
  context: 'access' | 'assignment' | 'input' | 'array_access' | 'function_call';
}

export interface ConstantReassignmentError extends ValidationError {
  type: 'semantic';
  errorSubtype: 'constant_reassignment';
  constantName: string;
}
