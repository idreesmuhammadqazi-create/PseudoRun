/**
 * Variable scope tracking for semantic validation
 */

import { ASTNode, DeclareNode, ProcedureNode, FunctionNode, ForNode } from '../interpreter/types';

export interface VariableDeclaration {
  name: string;
  type: string;
  line: number;
  scopeType: 'global' | 'procedure' | 'function' | 'for_loop';
  isParameter?: boolean;
  byRef?: boolean;
  arrayDimensions?: Array<{ lower: number; upper: number }>;
  elementType?: string;
}

export interface ScopeInfo {
  type: 'global' | 'procedure' | 'function' | 'for_loop';
  name: string;
  variables: Map<string, VariableDeclaration>;
  parent?: ScopeInfo;
}

export class VariableScope {
  private currentScope: ScopeInfo;
  private allScopes: ScopeInfo[] = [];
  private globalVariables: Map<string, VariableDeclaration> = new Map();

  constructor() {
    this.currentScope = {
      type: 'global',
      name: 'global',
      variables: new Map()
    };
    this.allScopes.push(this.currentScope);
  }

  declareVariable(name: string, type: string, line: number, arrayDimensions?: Array<{ lower: number; upper: number }>, elementType?: string): void {
    const declaration: VariableDeclaration = {
      name,
      type,
      line,
      scopeType: this.currentScope.type,
      arrayDimensions,
      elementType
    };

    this.currentScope.variables.set(name, declaration);

    if (this.currentScope.type === 'global') {
      this.globalVariables.set(name, declaration);
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

    this.currentScope.variables.set(name, declaration);
  }

  enterScope(scopeType: 'procedure' | 'function' | 'for_loop', name: string): void {
    const newScope: ScopeInfo = {
      type: scopeType,
      name,
      variables: new Map(),
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
      if (scope.variables.has(name)) {
        return scope.variables.get(name)!;
      }
      scope = scope.parent;
    }

    return null;
  }

  isGlobalVariable(name: string): boolean {
    return this.globalVariables.has(name);
  }

  getCurrentScopeType(): string {
    return this.currentScope.type;
  }

  getAllDeclarations(): VariableDeclaration[] {
    const allDeclarations: VariableDeclaration[] = [];

    for (const scope of this.allScopes) {
      for (const declaration of scope.variables.values()) {
        allDeclarations.push(declaration);
      }
    }

    return allDeclarations;
  }

  getVariablesInCurrentScope(): VariableDeclaration[] {
    return Array.from(this.currentScope.variables.values());
  }

  processDeclareStatement(node: DeclareNode): void {
    if (node.dataType === 'ARRAY') {
      this.declareVariable(
        node.identifier,
        'ARRAY',
        node.line,
        node.arrayBounds?.dimensions,
        node.arrayElementType
      );
    } else {
      this.declareVariable(node.identifier, node.dataType, node.line);
    }
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