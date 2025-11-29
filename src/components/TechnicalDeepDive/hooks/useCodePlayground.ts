import { useState, useEffect, useCallback, useRef } from 'react';
import { tokenize } from '../../../interpreter/lexer';
import { parse } from '../../../interpreter/parser';
import { Token } from '../../../interpreter/types';

interface PlaygroundState {
  code: string;
  tokens: Token[];
  ast: any;
  isRunning: boolean;
  output: string[];
  error: string | null;
  debugMode: boolean;
  currentLine: number;
  variables: Array<{ name: string; value: any; type: string }>;
}

interface UseCodePlaygroundOptions {
  initialCode?: string;
  onOutput?: (output: string[]) => void;
  onError?: (error: string) => void;
  onDebugStateChange?: (state: PlaygroundState) => void;
}

export const useCodePlayground = (options: UseCodePlaygroundOptions = {}) => {
  const {
    initialCode = '',
    onOutput,
    onError,
    onDebugStateChange
  } = options;

  const [state, setState] = useState<PlaygroundState>({
    code: initialCode,
    tokens: [],
    ast: null,
    isRunning: false,
    output: [],
    error: null,
    debugMode: false,
    currentLine: 0,
    variables: []
  });

  const animationRef = useRef<NodeJS.Timeout | null>(null);
  const interpreterRef = useRef<any>(null);

  // Parse code whenever it changes
  const parseCode = useCallback((code: string) => {
    try {
      const tokens = tokenize(code);
      const ast = parse(tokens);

      setState(prev => ({
        ...prev,
        tokens,
        ast,
        error: null
      }));

      return { tokens, ast, error: null };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      setState(prev => ({
        ...prev,
        tokens: [],
        ast: null,
        error: errorMessage
      }));

      onError?.(errorMessage);
      return { tokens: [], ast: null, error: errorMessage };
    }
  }, [onError]);

  // Initialize parsing when component mounts or code changes
  useEffect(() => {
    parseCode(state.code);
  }, [state.code, parseCode]);

  // Execute code
  const executeCode = useCallback(async () => {
    if (state.isRunning || !state.ast) return;

    setState(prev => ({ ...prev, isRunning: true, output: [], error: null }));

    try {
      // Simulate execution with sample output
      const executionOutput = [
        `Executing program with ${state.tokens.length} tokens...`,
        'Line 1: Variables declared',
        'Line 2: Assignment performed',
        'Line 3: Calculation completed',
        'Line 4: Output generated',
        'Program finished successfully'
      ];

      // Animate output
      for (let i = 0; i < executionOutput.length; i++) {
        await new Promise(resolve => {
          animationRef.current = setTimeout(resolve, 500);
        });

        setState(prev => ({
          ...prev,
          output: [...prev.output, executionOutput[i]]
        }));
      }

      onOutput?.(executionOutput);

      setState(prev => ({
        ...prev,
        isRunning: false
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Execution error';

      setState(prev => ({
        ...prev,
        isRunning: false,
        error: errorMessage
      }));

      onError?.(errorMessage);
    }
  }, [state.isRunning, state.ast, state.tokens, onOutput, onError]);

  // Debug execution
  const debugCode = useCallback(async () => {
    if (state.isRunning || !state.ast) return;

    setState(prev => ({
      ...prev,
      isRunning: true,
      debugMode: true,
      currentLine: 0,
      output: [],
      error: null,
      variables: []
    }));

    try {
      const debugOutput = [];
      const variables: Array<{ name: string; value: any; type: string }> = [];

      // Simulate debug execution with line-by-line stepping
      const lines = [
        { line: 1, action: 'DECLARE x, y : INTEGER', variables: [] },
        { line: 2, action: 'x ← 10', variables: [{ name: 'x', value: 10, type: 'INTEGER' }] },
        { line: 3, action: 'y ← 20', variables: [
          { name: 'x', value: 10, type: 'INTEGER' },
          { name: 'y', value: 20, type: 'INTEGER' }
        ]},
        { line: 4, action: 'result ← x + y', variables: [
          { name: 'x', value: 10, type: 'INTEGER' },
          { name: 'y', value: 20, type: 'INTEGER' },
          { name: 'result', value: 30, type: 'INTEGER' }
        ]},
        { line: 5, action: 'OUTPUT "Result: " + result', variables: [
          { name: 'x', value: 10, type: 'INTEGER' },
          { name: 'y', value: 20, type: 'INTEGER' },
          { name: 'result', value: 30, type: 'INTEGER' }
        ]}
      ];

      for (let i = 0; i < lines.length; i++) {
        await new Promise(resolve => {
          animationRef.current = setTimeout(resolve, 1000);
        });

        const lineData = lines[i];
        debugOutput.push(`Line ${lineData.line}: ${lineData.action}`);

        setState(prev => ({
          ...prev,
          currentLine: lineData.line,
          output: debugOutput,
          variables: lineData.variables
        }));

        onDebugStateChange?.(state);
      }

      setState(prev => ({
        ...prev,
        isRunning: false,
        debugMode: false
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Debug error';

      setState(prev => ({
        ...prev,
        isRunning: false,
        debugMode: false,
        error: errorMessage
      }));

      onError?.(errorMessage);
    }
  }, [state.isRunning, state.ast, onOutput, onError, onDebugStateChange]);

  // Step forward in debug mode
  const stepDebug = useCallback(() => {
    if (!state.debugMode || state.currentLine >= 5) return;

    const nextLine = state.currentLine + 1;
    const variables = getVariablesForLine(nextLine);

    setState(prev => ({
      ...prev,
      currentLine: nextLine,
      variables
    }));
  }, [state.debugMode, state.currentLine]);

  // Stop debug mode
  const stopDebug = useCallback(() => {
    setState(prev => ({
      ...prev,
      debugMode: false,
      isRunning: false
    }));
  }, []);

  // Clear output
  const clearOutput = useCallback(() => {
    setState(prev => ({
      ...prev,
      output: [],
      error: null,
      debugMode: false,
      currentLine: 0
    }));
  }, []);

  // Update code
  const updateCode = useCallback((newCode: string) => {
    setState(prev => ({
      ...prev,
      code: newCode,
      output: [],
      error: null,
      debugMode: false,
      currentLine: 0
    }));
  }, []);

  // Get performance metrics
  const getMetrics = useCallback(() => {
    return {
      tokenCount: state.tokens.length,
      lineCount: Math.max(...state.tokens.map(t => t.line), 0),
      nodeCount: state.ast ? countNodes(state.ast) : 0,
      complexity: calculateComplexity(state.tokens)
    };
  }, [state.tokens, state.ast]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, []);

  return {
    // State
    ...state,

    // Actions
    executeCode,
    debugCode,
    stepDebug,
    stopDebug,
    clearOutput,
    updateCode,

    // Computed values
    metrics: getMetrics(),
    hasCode: state.code.trim().length > 0,
    hasError: !!state.error,
    canRun: !!state.ast && !state.isRunning,
    canDebug: !!state.ast && !state.isRunning
  };
};

// Helper functions
function countNodes(node: any): number {
  if (!node || typeof node !== 'object') return 0;

  let count = 1;
  if (node.children && Array.isArray(node.children)) {
    count += node.children.reduce((sum: number, child: any) => sum + countNodes(child), 0);
  }

  return count;
}

function calculateComplexity(tokens: Token[]): number {
  const loops = tokens.filter(t => t.value === 'WHILE' || t.value === 'FOR' || t.value === 'REPEAT').length;
  const conditions = tokens.filter(t => t.value === 'IF').length;
  const assignments = tokens.filter(t => t.type === 'ASSIGNMENT').length;

  return loops * 2 + conditions + assignments;
}

function getVariablesForLine(line: number): Array<{ name: string; value: any; type: string }> {
  const lineVariables: { [key: number]: Array<{ name: string; value: any; type: string }> } = {
    1: [],
    2: [{ name: 'x', value: 10, type: 'INTEGER' }],
    3: [
      { name: 'x', value: 10, type: 'INTEGER' },
      { name: 'y', value: 20, type: 'INTEGER' }
    ],
    4: [
      { name: 'x', value: 10, type: 'INTEGER' },
      { name: 'y', value: 20, type: 'INTEGER' },
      { name: 'result', value: 30, type: 'INTEGER' }
    ],
    5: [
      { name: 'x', value: 10, type: 'INTEGER' },
      { name: 'y', value: 20, type: 'INTEGER' },
      { name: 'result', value: 30, type: 'INTEGER' }
    ]
  };

  return lineVariables[line] || [];
}

export default useCodePlayground;