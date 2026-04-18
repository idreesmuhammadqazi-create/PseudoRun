// Simple test script for CONSTANT keyword
import { tokenize } from './src/interpreter/lexer.js';
import { parse } from './src/interpreter/parser.js';
import { validateSemantics } from './src/validator/semanticValidator.js';

// Test 1: Basic constant with value
console.log('Test 1: Basic constant with value');
try {
  const code1 = 'CONSTANT PI : REAL <-- 3.14159\nOUTPUT PI';
  const tokens1 = tokenize(code1);
  const ast1 = parse(tokens1);
  const errors1 = validateSemantics(ast1);
  console.log('✓ Parsed successfully');
  console.log('  AST nodes:', ast1.map(n => n.type).join(', '));
  console.log('  Validation errors:', errors1.length === 0 ? 'None' : errors1.map(e => e.message).join(', '));
} catch (e) {
  console.log('✗ Error:', e.message);
}

// Test 2: Constant without value
console.log('\nTest 2: Constant without value');
try {
  const code2 = 'CONSTANT MAX : INTEGER\nINPUT MAX';
  const tokens2 = tokenize(code2);
  const ast2 = parse(tokens2);
  const errors2 = validateSemantics(ast2);
  console.log('✓ Parsed successfully');
  console.log('  AST nodes:', ast2.map(n => n.type).join(', '));
  console.log('  Validation errors:', errors2.length === 0 ? 'None' : errors2.map(e => e.message).join(', '));
} catch (e) {
  console.log('✗ Error:', e.message);
}

// Test 3: Constant reassignment (should produce validation error)
console.log('\nTest 3: Constant reassignment (should fail validation)');
try {
  const code3 = 'CONSTANT X : INTEGER <-- 5\nX <-- 10';
  const tokens3 = tokenize(code3);
  const ast3 = parse(tokens3);
  const errors3 = validateSemantics(ast3);
  console.log('✓ Parsed successfully');
  console.log('  AST nodes:', ast3.map(n => n.type).join(', '));
  console.log('  Validation errors:', errors3.length > 0 ? '✓ ' + errors3.map(e => e.message).join(', ') : '✗ No validation error (expected one!)');
} catch (e) {
  console.log('✗ Error:', e.message);
}

// Test 4: Constant in expression
console.log('\nTest 4: Constant in expression');
try {
  const code4 = 'CONSTANT MULTIPLIER : INTEGER <-- 10\nDECLARE result : INTEGER\nresult <-- MULTIPLIER * 5';
  const tokens4 = tokenize(code4);
  const ast4 = parse(tokens4);
  const errors4 = validateSemantics(ast4);
  console.log('✓ Parsed successfully');
  console.log('  AST nodes:', ast4.map(n => n.type).join(', '));
  console.log('  Validation errors:', errors4.length === 0 ? 'None' : errors4.map(e => e.message).join(', '));
} catch (e) {
  console.log('✗ Error:', e.message);
}

// Test 5: All data types
console.log('\nTest 5: All data types');
try {
  const code5 = `CONSTANT A : INTEGER <-- 42
CONSTANT B : REAL <-- 3.14
CONSTANT C : STRING <-- "Hello"
CONSTANT D : BOOLEAN <-- TRUE`;
  const tokens5 = tokenize(code5);
  const ast5 = parse(tokens5);
  const errors5 = validateSemantics(ast5);
  console.log('✓ Parsed successfully');
  console.log('  AST nodes:', ast5.map(n => n.type).join(', '));
  console.log('  Validation errors:', errors5.length === 0 ? 'None' : errors5.map(e => e.message).join(', '));
} catch (e) {
  console.log('✗ Error:', e.message);
}

console.log('\n=== All tests completed ===');
