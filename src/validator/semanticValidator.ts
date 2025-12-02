/**
 * Semantic validator for variable declaration analysis
 */

import {
  ASTNode,
  DeclareNode,
  AssignmentNode,
  OutputNode,
  InputNode,
  IdentifierNode,
  ArrayAccessNode,
  FunctionCallNode,
  ProcedureNode,
  FunctionNode,
  ForNode,
  CallNode,
  ReturnNode,
  OpenFileNode,
  CloseFileNode,
  ReadFileNode,
  WriteFileNode,
  IfNode,
  WhileNode,
  RepeatNode,
  CaseNode
} from '../interpreter/types';
import { UndeclaredVariableError } from './errorTypes';
import { VariableScope } from './variableScope';

export function validateSemantics(ast: ASTNode[]): UndeclaredVariableError[] {
  const errors: UndeclaredVariableError[] = [];
  const scope = new VariableScope();

  // First pass: collect all variable declarations (procedures, functions, global variables)
  for (const node of ast) {
    if (node.type === 'Procedure') {
      // Register procedure but don't process body yet
      continue;
    } else if (node.type === 'Function') {
      // Register function but don't process body yet
      continue;
    } else if (node.type === 'Declare') {
      scope.processDeclareStatement(node as DeclareNode);
    }
  }

  // Second pass: process all statements and check variable usage
  for (const node of ast) {
    const nodeErrors = validateNode(node, scope);
    errors.push(...nodeErrors);
  }

  // Sort errors by line number for consistent user experience
  return errors.sort((a, b) => a.line - b.line);
}

function validateNode(node: ASTNode, scope: VariableScope): UndeclaredVariableError[] {
  const errors: UndeclaredVariableError[] = [];

  switch (node.type) {
    case 'Declare':
      // Declarations are already processed in first pass
      break;

    case 'Assignment':
      errors.push(...validateAssignment(node as AssignmentNode, scope));
      break;

    case 'Output':
      errors.push(...validateOutput(node as OutputNode, scope));
      break;

    case 'Input':
      errors.push(...validateInput(node as InputNode, scope));
      break;

    case 'If':
      errors.push(...validateIf(node as IfNode, scope));
      break;

    case 'While':
      errors.push(...validateWhile(node as WhileNode, scope));
      break;

    case 'Repeat':
      errors.push(...validateRepeat(node as RepeatNode, scope));
      break;

    case 'For':
      errors.push(...validateFor(node as ForNode, scope));
      break;

    case 'Case':
      errors.push(...validateCase(node as CaseNode, scope));
      break;

    case 'Call':
      errors.push(...validateCall(node as CallNode, scope));
      break;

    case 'Procedure':
      errors.push(...validateProcedure(node as ProcedureNode, scope));
      break;

    case 'Function':
      errors.push(...validateFunction(node as FunctionNode, scope));
      break;

    case 'Return':
      errors.push(...validateReturn(node as ReturnNode, scope));
      break;

    case 'OpenFile':
      errors.push(...validateOpenFile(node as OpenFileNode, scope));
      break;

    case 'CloseFile':
      errors.push(...validateCloseFile(node as CloseFileNode, scope));
      break;

    case 'ReadFile':
      errors.push(...validateReadFile(node as ReadFileNode, scope));
      break;

    case 'WriteFile':
      errors.push(...validateWriteFile(node as WriteFileNode, scope));
      break;

    default:
      console.warn(`Unknown node type in semantic validation: ${(node as any).type}`);
  }

  return errors;
}

function validateAssignment(node: AssignmentNode, scope: VariableScope): UndeclaredVariableError[] {
  const errors: UndeclaredVariableError[] = [];

  if (node.target.type === 'Identifier') {
    const varName = (node.target as IdentifierNode).name;
    const declaration = scope.lookupVariable(varName);

    if (!declaration) {
      errors.push(createUndeclaredVariableError(varName, node.line, 'assignment'));
    } else {
      // Validate the expression being assigned
      errors.push(...validateExpression(node.value, scope));
    }
  } else if (node.target.type === 'ArrayAccess') {
    const arrayAccess = node.target as ArrayAccessNode;
    errors.push(...validateArrayAccess(arrayAccess, scope, 'assignment'));
    errors.push(...validateExpression(node.value, scope));
  }

  return errors;
}

function validateOutput(node: OutputNode, scope: VariableScope): UndeclaredVariableError[] {
  const errors: UndeclaredVariableError[] = [];

  for (const expr of node.expressions) {
    errors.push(...validateExpression(expr, scope));
  }

  return errors;
}

function validateInput(node: InputNode, scope: VariableScope): UndeclaredVariableError[] {
  const errors: UndeclaredVariableError[] = [];

  if (node.target.type === 'Identifier') {
    const varName = (node.target as IdentifierNode).name;
    const declaration = scope.lookupVariable(varName);

    if (!declaration) {
      errors.push(createUndeclaredVariableError(varName, node.line, 'input'));
    }
  } else if (node.target.type === 'ArrayAccess') {
    const arrayAccess = node.target as ArrayAccessNode;
    errors.push(...validateArrayAccess(arrayAccess, scope, 'input'));
  }

  return errors;
}

function validateIf(node: IfNode, scope: VariableScope): UndeclaredVariableError[] {
  const errors: UndeclaredVariableError[] = [];

  // Validate condition
  errors.push(...validateExpression(node.condition, scope));

  // Validate then block
  for (const stmt of node.thenBlock) {
    errors.push(...validateNode(stmt, scope));
  }

  // Validate else if blocks
  if (node.elseIfBlocks) {
    for (const elseIfBlock of node.elseIfBlocks) {
      errors.push(...validateExpression(elseIfBlock.condition, scope));
      for (const stmt of elseIfBlock.block) {
        errors.push(...validateNode(stmt, scope));
      }
    }
  }

  // Validate else block
  if (node.elseBlock) {
    for (const stmt of node.elseBlock) {
      errors.push(...validateNode(stmt, scope));
    }
  }

  return errors;
}

function validateWhile(node: WhileNode, scope: VariableScope): UndeclaredVariableError[] {
  const errors: UndeclaredVariableError[] = [];

  // Validate condition
  errors.push(...validateExpression(node.condition, scope));

  // Validate body
  for (const stmt of node.body) {
    errors.push(...validateNode(stmt, scope));
  }

  return errors;
}

function validateRepeat(node: RepeatNode, scope: VariableScope): UndeclaredVariableError[] {
  const errors: UndeclaredVariableError[] = [];

  // Validate body
  for (const stmt of node.body) {
    errors.push(...validateNode(stmt, scope));
  }

  // Validate condition
  errors.push(...validateExpression(node.condition, scope));

  return errors;
}

function validateFor(node: ForNode, scope: VariableScope): UndeclaredVariableError[] {
  const errors: UndeclaredVariableError[] = [];

  // Process for loop scope
  scope.processForLoop(node);

  // Validate bounds expressions
  errors.push(...validateExpression(node.start, scope));
  errors.push(...validateExpression(node.end, scope));
  errors.push(...validateExpression(node.step, scope));

  // Validate body
  for (const stmt of node.body) {
    errors.push(...validateNode(stmt, scope));
  }

  // Exit for loop scope
  scope.exitScope();

  return errors;
}

function validateCase(node: CaseNode, scope: VariableScope): UndeclaredVariableError[] {
  const errors: UndeclaredVariableError[] = [];

  // Validate expression
  errors.push(...validateExpression(node.expression, scope));

  // Validate case blocks
  for (const caseBlock of node.cases) {
    if (caseBlock.value !== undefined) {
      errors.push(...validateExpression(caseBlock.value, scope));
    }
    if (caseBlock.rangeStart !== undefined && caseBlock.rangeEnd !== undefined) {
      errors.push(...validateExpression(caseBlock.rangeStart, scope));
      errors.push(...validateExpression(caseBlock.rangeEnd, scope));
    }
    for (const stmt of caseBlock.statements) {
      errors.push(...validateNode(stmt, scope));
    }
  }

  // Validate otherwise block
  if (node.otherwiseBlock) {
    for (const stmt of node.otherwiseBlock) {
      errors.push(...validateNode(stmt, scope));
    }
  }

  return errors;
}

function validateCall(node: CallNode, scope: VariableScope): UndeclaredVariableError[] {
  const errors: UndeclaredVariableError[] = [];

  // Validate arguments
  for (const arg of node.arguments) {
    errors.push(...validateExpression(arg, scope));
  }

  return errors;
}

function validateProcedure(node: ProcedureNode, scope: VariableScope): UndeclaredVariableError[] {
  const errors: UndeclaredVariableError[] = [];

  // Enter procedure scope
  scope.processProcedureDeclaration(node);

  // Validate procedure body
  for (const stmt of node.body) {
    errors.push(...validateNode(stmt, scope));
  }

  // Exit procedure scope
  scope.exitScope();

  return errors;
}

function validateFunction(node: FunctionNode, scope: VariableScope): UndeclaredVariableError[] {
  const errors: UndeclaredVariableError[] = [];

  // Enter function scope
  scope.processFunctionDeclaration(node);

  // Validate function body
  for (const stmt of node.body) {
    errors.push(...validateNode(stmt, scope));
  }

  // Exit function scope
  scope.exitScope();

  return errors;
}

function validateReturn(node: ReturnNode, scope: VariableScope): UndeclaredVariableError[] {
  return validateExpression(node.value, scope);
}

function validateOpenFile(node: OpenFileNode, scope: VariableScope): UndeclaredVariableError[] {
  return validateExpression(node.filename, scope);
}

function validateCloseFile(node: CloseFileNode, scope: VariableScope): UndeclaredVariableError[] {
  return validateExpression(node.filename, scope);
}

function validateReadFile(node: ReadFileNode, scope: VariableScope): UndeclaredVariableError[] {
  const errors: UndeclaredVariableError[] = [];

  // Validate filename
  errors.push(...validateExpression(node.filename, scope));

  // Validate target variable
  if (node.target.type === 'Identifier') {
    const varName = (node.target as IdentifierNode).name;
    const declaration = scope.lookupVariable(varName);

    if (!declaration) {
      errors.push(createUndeclaredVariableError(varName, node.line, 'input'));
    }
  } else if (node.target.type === 'ArrayAccess') {
    const arrayAccess = node.target as ArrayAccessNode;
    errors.push(...validateArrayAccess(arrayAccess, scope, 'input'));
  }

  return errors;
}

function validateWriteFile(node: WriteFileNode, scope: VariableScope): UndeclaredVariableError[] {
  const errors: UndeclaredVariableError[] = [];

  errors.push(...validateExpression(node.filename, scope));
  errors.push(...validateExpression(node.data, scope));

  return errors;
}

function validateExpression(expr: any, scope: VariableScope): UndeclaredVariableError[] {
  const errors: UndeclaredVariableError[] = [];

  switch (expr.type) {
    case 'Literal':
      // Literals don't need validation
      break;

    case 'Identifier':
      const varName = (expr as IdentifierNode).name;
      const declaration = scope.lookupVariable(varName);

      if (!declaration) {
        errors.push(createUndeclaredVariableError(varName, expr.line, 'access'));
      }
      break;

    case 'ArrayAccess':
      errors.push(...validateArrayAccess(expr as ArrayAccessNode, scope, 'access'));
      break;

    case 'BinaryOp':
      errors.push(...validateExpression((expr as any).left, scope));
      errors.push(...validateExpression((expr as any).right, scope));
      break;

    case 'UnaryOp':
      errors.push(...validateExpression((expr as any).operand, scope));
      break;

    case 'FunctionCall':
      errors.push(...validateFunctionCall(expr as FunctionCallNode, scope));
      break;

    default:
      console.warn(`Unknown expression type in semantic validation: ${expr.type}`);
  }

  return errors;
}

function validateArrayAccess(node: ArrayAccessNode, scope: VariableScope, context: 'access' | 'assignment' | 'input'): UndeclaredVariableError[] {
  const errors: UndeclaredVariableError[] = [];

  // Check if array is declared
  const arrayDeclaration = scope.lookupVariable(node.array);
  if (!arrayDeclaration) {
    errors.push(createUndeclaredVariableError(node.array, node.line, 'array_access'));
  }

  // Validate indices
  for (const idx of node.indices) {
    errors.push(...validateExpression(idx, scope));
  }

  return errors;
}

function validateFunctionCall(node: FunctionCallNode, scope: VariableScope): UndeclaredVariableError[] {
  const errors: UndeclaredVariableError[] = [];

  // Validate arguments
  for (const arg of node.arguments) {
    errors.push(...validateExpression(arg, scope));
  }

  return errors;
}

function createUndeclaredVariableError(variableName: string, line: number, context: 'access' | 'assignment' | 'input' | 'array_access' | 'function_call'): UndeclaredVariableError {
  let message: string;

  switch (context) {
    case 'access':
      message = `Variable '${variableName}' is not declared when accessing`;
      break;
    case 'assignment':
      message = `Variable '${variableName}' is not declared when assigning`;
      break;
    case 'input':
      message = `Variable '${variableName}' is not declared when reading input`;
      break;
    case 'array_access':
      message = `Array '${variableName}' is not declared when accessing`;
      break;
    case 'function_call':
      message = `Variable '${variableName}' is not declared when used in function call`;
      break;
  }

  return {
    type: 'semantic',
    errorSubtype: 'undeclared_variable',
    line,
    message,
    variableName,
    context
  };
}