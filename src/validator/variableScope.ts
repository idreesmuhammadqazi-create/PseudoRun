/**
 * Variable scope tracking for semantic validation
 */

import { DeclareNode, ConstantNode, ProcedureNode, FunctionNode, ForNode } from '../interpreter/types';

export interface VariableDeclaration {
  name: string;
  type: string;
  line: number;
  scopeType: 'global' | 'procedure' | 'function' | 'for_loop';
  isParameter?: boolean;
  byRef?: boolean;
  arrayDimensions?: Array<{ lower: number; upper: number }>;
  elementType?: string;
  isConstant?: boolean;
}

export interface ScopeInfo {
  type: 'global' | 'procedure' | 'function' | 'for_loop';
  name: string;
  variables: { [key: string]: VariableDeclaration };
  parent?: ScopeInfo;
}

export class VariableScope {
  private currentScope: ScopeInfo;
  private allScopes: ScopeInfo[] = [];
  private globalVariables: { [key: string]: VariableDeclaration } = {};

  constructor() {
    this.currentScope = {
      type: 'global',
      name: 'global',
      variables: {}
    };
    this.allScopes.push(this.currentScope);
  }

  declareVariable(name: string, type: string, line: number, isConstant?: boolean, arrayDimensions?: Array<{ lower: number; upper: number }>, elementType?: string): void {
    const declaration: VariableDeclaration = {
      name,
      type,
      line,
      scopeType: this.currentScope.type,
      isConstant,
      arrayDimensions,
      elementType
    };

    this.currentScope.variables[name] = declaration;

    if (this.currentScope.type === 'global') {
      this.globalVariables[name] = declaration;
    }
  }

  declareParameter(name: string, type: string, line: number, byRef?: boolean): void {
    const declaration: VariableDeclaration = {
      name,
      type,
      line,
      scopeType: this.currentScope.type,
      isParameter: true,
      byRef
    };

    this.currentScope.variables[name] = declaration;
  }

  enterScope(scopeType: 'procedure' | 'function' | 'for_loop', name: string): void {
    const newScope: ScopeInfo = {
      type: scopeType,
      name,
      variables: {},
      parent: this.currentScope
    };

    this.currentScope = newScope;
    this.allScopes.push(newScope);
  }

  exitScope(): void {
    if (this.currentScope.parent) {
      this.currentScope = this.currentScope.parent;
    }
  }

  lookupVariable(name: string): VariableDeclaration | null {
    let scope: ScopeInfo | undefined = this.currentScope;

    while (scope) {
      if (scope.variables[name] !== undefined) {
        return scope.variables[name]!;
      }
      scope = scope.parent;
    }

    return null;
  }

  isGlobalVariable(name: string): boolean {
    return this.globalVariables[name] !== undefined;
  }

  getCurrentScopeType(): string {
    return this.currentScope.type;
  }

  getAllDeclarations(): VariableDeclaration[] {
    const allDeclarations: VariableDeclaration[] = [];

    for (const scope of this.allScopes) {
      for (const key in scope.variables) {
        allDeclarations.push(scope.variables[key]);
      }
    }

    return allDeclarations;
  }

  getVariablesInCurrentScope(): VariableDeclaration[] {
    const result: VariableDeclaration[] = [];
    for (const key in this.currentScope.variables) {
      result.push(this.currentScope.variables[key]);
    }
    return result;
  }

  processDeclareStatement(node: DeclareNode): void {
    if (node.dataType === 'ARRAY') {
      this.declareVariable(
        node.identifier,
        'ARRAY',
        node.line,
        false,
        node.arrayBounds?.dimensions,
        node.arrayElementType
      );
    } else {
      this.declareVariable(node.identifier, node.dataType, node.line);
    }
  }

  processConstantStatement(node: ConstantNode): void {
    this.declareVariable(
      node.identifier,
      node.dataType,
      node.line,
      true
    );
  }

  processProcedureDeclaration(node: ProcedureNode): void {
    this.enterScope('procedure', node.name);

    for (const param of node.parameters) {
      this.declareParameter(param.name, param.type, node.line, param.byRef);
    }
  }

  processFunctionDeclaration(node: FunctionNode): void {
    this.enterScope('function', node.name);

    for (const param of node.parameters) {
      this.declareParameter(param.name, param.type, node.line, param.byRef);
    }
  }

  processForLoop(node: ForNode): void {
    this.enterScope('for_loop', `for_${node.variable}`);

    this.declareVariable(node.variable, 'INTEGER', node.line);
  }

  getScopeChain(): string[] {
    const chain: string[] = [];
    let scope: ScopeInfo | undefined = this.currentScope;

    while (scope) {
      chain.push(`${scope.type}:${scope.name}`);
      scope = scope.parent;
    }

    return chain.reverse();
  }
}