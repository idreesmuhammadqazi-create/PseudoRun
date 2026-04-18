import { useEffect, useRef } from 'react';
import { EditorState } from '@codemirror/state';
import { EditorView, keymap, placeholder, lineNumbers } from '@codemirror/view';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { syntaxHighlighting, HighlightStyle } from '@codemirror/language';
import { tags as t } from '@lezer/highlight';
import { autocompletion, CompletionContext } from '@codemirror/autocomplete';
import styles from './Editor.module.css';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
}

// IGCSE Pseudocode autocomplete suggestions
const igcseCompletions = [
  // Keywords
  { label: 'DECLARE', type: 'keyword', info: 'Declare a variable' },
  { label: 'IF', type: 'keyword', info: 'If statement' },
  { label: 'THEN', type: 'keyword', info: 'Then clause' },
  { label: 'ELSE', type: 'keyword', info: 'Else clause' },
  { label: 'ENDIF', type: 'keyword', info: 'End if statement' },
  { label: 'WHILE', type: 'keyword', info: 'While loop' },
  { label: 'DO', type: 'keyword', info: 'Do clause' },
  { label: 'ENDWHILE', type: 'keyword', info: 'End while loop' },
  { label: 'REPEAT', type: 'keyword', info: 'Repeat loop' },
  { label: 'UNTIL', type: 'keyword', info: 'Until clause' },
  { label: 'FOR', type: 'keyword', info: 'For loop' },
  { label: 'TO', type: 'keyword', info: 'To keyword in for loop' },
  { label: 'STEP', type: 'keyword', info: 'Step keyword in for loop' },
  { label: 'NEXT', type: 'keyword', info: 'Next keyword in for loop' },
  { label: 'CASE', type: 'keyword', info: 'Case statement' },
  { label: 'OF', type: 'keyword', info: 'Of keyword' },
  { label: 'OTHERWISE', type: 'keyword', info: 'Otherwise clause in case' },
  { label: 'ENDCASE', type: 'keyword', info: 'End case statement' },
  { label: 'INPUT', type: 'keyword', info: 'Input from user' },
  { label: 'OUTPUT', type: 'keyword', info: 'Output to screen' },
  { label: 'PROCEDURE', type: 'keyword', info: 'Define a procedure' },
  { label: 'ENDPROCEDURE', type: 'keyword', info: 'End procedure definition' },
  { label: 'FUNCTION', type: 'keyword', info: 'Define a function' },
  { label: 'ENDFUNCTION', type: 'keyword', info: 'End function definition' },
  { label: 'RETURN', type: 'keyword', info: 'Return value from function' },
  { label: 'RETURNS', type: 'keyword', info: 'Function return type' },
  { label: 'CALL', type: 'keyword', info: 'Call a procedure' },
  { label: 'BYVAL', type: 'keyword', info: 'Pass parameter by value' },
  { label: 'BYREF', type: 'keyword', info: 'Pass parameter by reference' },
  
  // Data Types
  { label: 'INTEGER', type: 'type', info: 'Integer data type' },
  { label: 'REAL', type: 'type', info: 'Real/decimal data type' },
  { label: 'STRING', type: 'type', info: 'String data type' },
  { label: 'CHAR', type: 'type', info: 'Character data type' },
  { label: 'BOOLEAN', type: 'type', info: 'Boolean data type' },
  { label: 'ARRAY', type: 'type', info: 'Array data type' },
  
  // Boolean values
  { label: 'TRUE', type: 'constant', info: 'Boolean true value' },
  { label: 'FALSE', type: 'constant', info: 'Boolean false value' },
  
  // Operators
  { label: 'AND', type: 'keyword', info: 'Logical AND' },
  { label: 'OR', type: 'keyword', info: 'Logical OR' },
  { label: 'NOT', type: 'keyword', info: 'Logical NOT' },
  { label: 'DIV', type: 'keyword', info: 'Integer division' },
  { label: 'MOD', type: 'keyword', info: 'Modulus (remainder)' },
  
  // Built-in Functions - String
  { label: 'LENGTH', type: 'function', info: 'LENGTH(string) - Returns string length' },
  { label: 'SUBSTRING', type: 'function', info: 'SUBSTRING(string, start, length) - Extracts substring' },
  { label: 'UCASE', type: 'function', info: 'UCASE(string) - Converts to uppercase' },
  { label: 'LCASE', type: 'function', info: 'LCASE(string) - Converts to lowercase' },
  
  // Built-in Functions - Type Conversion
  { label: 'INT', type: 'function', info: 'INT(value) - Converts to integer' },
  { label: 'REAL', type: 'function', info: 'REAL(value) - Converts to real number' },
  { label: 'STRING', type: 'function', info: 'STRING(value) - Converts to string' },
  
  // Built-in Functions - Math
  { label: 'ROUND', type: 'function', info: 'ROUND(number, decimals) - Rounds number' },
  { label: 'RANDOM', type: 'function', info: 'RANDOM() - Returns random number 0.0-1.0' },
];

// Custom autocomplete function
function igcseAutocomplete(context: CompletionContext) {
  const word = context.matchBefore(/\w*/);
  if (!word || (word.from === word.to && !context.explicit)) {
    return null;
  }

  return {
    from: word.from,
    options: igcseCompletions,
  };
}

// Custom syntax highlighting for IGCSE/A-LEVELS pseudocode
const igcseHighlightStyle = HighlightStyle.define([
  { tag: t.keyword, color: '#0066cc', fontWeight: 'bold' },
  { tag: t.typeName, color: '#008800' },
  { tag: t.operator, color: '#cc6600' },
  { tag: t.comment, color: '#999999', fontStyle: 'italic' },
  { tag: t.string, color: '#cc0000' },
  { tag: t.number, color: '#9933cc' },
]);

export default function Editor({ value, onChange }: EditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  useEffect(() => {
    if (!editorRef.current) return;

    const startState = EditorState.create({
      doc: value,
      extensions: [
        lineNumbers(),
        history(),
        keymap.of([...defaultKeymap, ...historyKeymap]),
        placeholder('// Start typing your IGCSE/A-LEVELS pseudocode here\n// Press Ctrl+Space for autocomplete suggestions'),
        syntaxHighlighting(igcseHighlightStyle),
        autocompletion({ override: [igcseAutocomplete] }),
        EditorView.lineWrapping,
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            const newValue = update.state.doc.toString();
            onChange(newValue);
          }
        }),
        EditorView.theme({
          '&': {
            height: '100%',
            fontSize: '14px',
            fontFamily: 'Consolas, Monaco, "Courier New", monospace',
          },
          '.cm-scroller': {
            overflow: 'auto',
            maxHeight: '100%',
          },
          '.cm-content': {
            fontFamily: 'Consolas, Monaco, "Courier New", monospace',
            padding: '10px 0',
          },
          '.cm-line': {
            padding: '0 8px',
            lineHeight: '1.5',
          },
          '.cm-gutters': {
            backgroundColor: '#f5f5f5',
            border: 'none',
          },
          '.cm-activeLineGutter': {
            backgroundColor: '#e0e0e0',
          },
        }),
      ],
    });

    const view = new EditorView({
      state: startState,
      parent: editorRef.current,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
    };
  }, []); // Only create once

  // Update content when value changes externally
  useEffect(() => {
    if (viewRef.current) {
      const currentValue = viewRef.current.state.doc.toString();
      if (currentValue !== value) {
        viewRef.current.dispatch({
          changes: {
            from: 0,
            to: currentValue.length,
            insert: value,
          },
        });
      }
    }
  }, [value]);

  return (
    <div className={styles.editorContainer}>
      <div ref={editorRef} className={styles.editor}></div>
    </div>
  );
}
