# Pseudocode Interpreter â Logic Bug Report

## Reference Specification

Cambridge 9618 Pseudocode Guide (2027â2029 syllabus). Only bugs where **existing interpreter functionality contradicts the spec** are listed. Features the interpreter does not claim to support (OOP, user-defined types, random files, SEEK/GETRECORD/PUTRECORD, DATE, etc.) are excluded.

---

## Summary Table

| #  | Title | Severity | File(s) |
|----|-------|----------|---------|
| 1  | CONSTANT syntax is wrong | Critical | `parser.ts`, `lexer.ts` |
| 2  | WHILE loop requires spurious DO keyword | Critical | `parser.ts` |
| 3  | Missing built-in function RIGHT | High | `interpreter.ts` |
| 4  | Missing built-in function MID (has SUBSTRING instead) | High | `interpreter.ts` |
| 5  | LCASE/UCASE accept STRING instead of CHAR only | Medium | `interpreter.ts` |
| 6  | RAND function has wrong name and signature | Critical | `interpreter.ts` |
| 7  | INT function truncates toward ââ instead of toward zero | Medium | `interpreter.ts` |
| 8  | executeSyncAssignment skips type checking | High | `interpreter.ts` |
| 9  | No iteration limit in sync execution (functions) | High | `interpreter.ts` |
| 10 | CASE OF parses expression instead of identifier | Low | `parser.ts` |
| 11 | CASE statement can't handle negative literal case values | Medium | `parser.ts` |
| 12 | closeFile doesn't properly close WRITE/APPEND files | High | `interpreter.ts` |
| 13 | File operations produce spurious output | Medium | `interpreter.ts` |
| 14 | INPUT echoes the entered value as output | Medium | `interpreter.ts` |
| 15 | BYREF keyword doesn't propagate to subsequent parameters | High | `parser.ts` |
| 16 | Single-quoted literals get type STRING instead of CHAR | Medium | `lexer.ts`, `parser.ts` |
| 17 | DIV uses Math.floor instead of truncation toward zero | Medium | `interpreter.ts` |
| 18 | Division `/` doesn't always return REAL | Low | `interpreter.ts` |

**Totals:** 3 Critical, 5 High, 7 Medium, 3 Low â 18 bugs

---

## Bug Details

### Bug 1 â CONSTANT syntax is wrong

**Severity:** Critical

**File(s):** `parser.ts:151-175`, `lexer.ts`

**What the spec says:**
```
CONSTANT <identifier> = <value>
```
Uses `=` (not `â` or `<--`). No data type declaration. Only literal values are permitted â never a variable, another constant, or an expression.

**What the interpreter does:**
Parses constants as:
```
CONSTANT <identifier> : <dataType> <-- <value>
```
Requires a colon, a data type keyword, and uses the `<--` assignment operator. Also accepts arbitrary expressions as the value.

**Impact:** Any constant declared per the official spec will fail to parse.

**Suggested fix:**
Rewrite the CONSTANT parsing rule to expect `=` after the identifier, remove the data type requirement, and restrict the right-hand side to literal tokens only (NUMBER, STRING, TRUE, FALSE).

---

### Bug 2 â WHILE loop requires spurious DO keyword

**Severity:** Critical

**File(s):** `parser.ts:398-421`

**What the spec says:**
```
WHILE <condition>
  <statements>
ENDWHILE
```
There is no `DO` keyword in the WHILE syntax.

**What the interpreter does:**
Requires `DO` after the condition:
```
WHILE <condition> DO
```

**Impact:** Spec-compliant WHILE loops fail to parse.

**Suggested fix:**
Remove the mandatory `DO` token consumption after parsing the WHILE condition. Optionally accept `DO` as a no-op for backwards compatibility.

---

### Bug 3 â Missing built-in function RIGHT

**Severity:** High

**File(s):** `interpreter.ts` (evaluateBuiltInFunction)

**What the spec says:**
```
RIGHT(ThisString : STRING, x : INTEGER) RETURNS STRING
```
Returns the rightmost `x` characters. Example: `RIGHT("ABCDEFGH", 3)` returns `"FGH"`.

**What the interpreter does:**
The interpreter has: LENGTH, SUBSTRING, UCASE, LCASE, INT, REAL, STRING, ROUND, RANDOM, EOF. There is no `RIGHT` function.

**Impact:** Any call to `RIGHT(...)` causes a "Function not found" runtime error.

**Suggested fix:**
Add a `RIGHT` case to `evaluateBuiltInFunction`:
```ts
case 'RIGHT': {
  const str = args[0] as string;
  const count = args[1] as number;
  return str.slice(str.length - count);
}
```

---

### Bug 4 â Missing built-in function MID (has SUBSTRING instead)

**Severity:** High

**File(s):** `interpreter.ts:1509-1530`

**What the spec says:**
```
MID(ThisString : STRING, x : INTEGER, y : INTEGER) RETURNS STRING
```
Returns a string of length `y` starting at position `x` (1-indexed). Example: `MID("ABCDEFGH", 2, 3)` returns `"BCD"`.

**What the interpreter does:**
Provides `SUBSTRING(string, start, length)` with equivalent behavior but the wrong name. `MID` is not recognized.

**Impact:** Spec-compliant `MID(...)` calls fail. `SUBSTRING` is not in the spec, so students writing to the spec cannot use the interpreter's function and vice versa.

**Suggested fix:**
Rename the `SUBSTRING` handler to `MID`. Optionally keep `SUBSTRING` as a deprecated alias.

---

### Bug 5 â LCASE/UCASE accept STRING instead of CHAR only

**Severity:** Medium

**File(s):** `interpreter.ts:1532-1550`

**What the spec says:**
```
LCASE(ThisChar : CHAR) RETURNS CHAR
UCASE(ThisChar : CHAR) RETURNS CHAR
```
These functions operate on a single CHAR, not a STRING.

**What the interpreter does:**
Accepts full STRING values and converts the entire string to lower/upper case.

**Impact:** Functionally works for single characters but does not enforce the CHAR-only constraint. Students won't get the type error they'd get in an exam-correct environment.

**Suggested fix:**
Add a runtime check that the argument is a single character (length 1). Throw a type error if a multi-character string is passed.

---

### Bug 6 â RAND function has wrong name and signature

**Severity:** Critical

**File(s):** `interpreter.ts:1607-1611`

**What the spec says:**
```
RAND(x : INTEGER) RETURNS REAL
```
Takes an INTEGER parameter `x` and returns a random REAL number in the range 0 (inclusive) to `x` (exclusive).

**What the interpreter does:**
Implements `RANDOM()` with no parameters, returning a REAL between 0.0 and 1.0 (equivalent to `Math.random()`).

**Impact:** Both the name (`RANDOM` vs `RAND`) and the signature (no params vs one param) are wrong. Spec-compliant code using `RAND(10)` will fail.

**Suggested fix:**
Rename `RANDOM` to `RAND`, accept one INTEGER parameter, and return `Math.random() * x`. Optionally keep `RANDOM` as a deprecated alias.

---

### Bug 7 â INT function truncates toward ââ instead of toward zero

**Severity:** Medium

**File(s):** `interpreter.ts:1552-1567`

**What the spec says:**
```
INT(x : REAL) RETURNS INTEGER
```
"Returns the integer part of x." Example: `INT(27.5415)` returns `27`.

**What the interpreter does:**
Uses `Math.floor()`, which truncates toward negative infinity. For negative inputs, `INT(-3.7)` returns `-4` instead of the expected `-3`.

**Impact:** Incorrect results for negative REAL values.

**Suggested fix:**
Replace `Math.floor(x)` with `Math.trunc(x)`.

---

### Bug 8 â executeSyncAssignment skips type checking

**Severity:** High

**File(s):** `interpreter.ts:1058-1099`

**What the spec says:**
Type safety should be enforced consistently across all contexts.

**What the interpreter does:**
The async `executeAssignment` path calls `coerceOrReject()` to validate types before assignment. However, `executeSyncAssignment` (used inside function bodies) sets `variable.value = value` directly without calling `coerceOrReject()`.

**Impact:** All assignments inside function bodies bypass type checking. Assigning a STRING to an INTEGER variable inside a function silently succeeds.

**Suggested fix:**
Add a `coerceOrReject(variable, value)` call in `executeSyncAssignment` before setting the value, mirroring the async path.

---

### Bug 9 â No iteration limit in sync execution (functions)

**Severity:** High

**File(s):** `interpreter.ts:1027` (executeSyncNode)

**What the spec says:** N/A (interpreter safety concern).

**What the interpreter does:**
The async `executeNode` increments `iterationCount` and checks it against `MAX_ITERATIONS` to detect and break infinite loops. However, `executeSyncNode` (used for function/procedure bodies) never increments or checks the iteration count.

**Impact:** An infinite loop inside a function will hang the interpreter forever with no way to break out.

**Suggested fix:**
Add the same `iterationCount` increment and `MAX_ITERATIONS` check to `executeSyncNode`.

---

### Bug 10 â CASE OF parses expression instead of identifier

**Severity:** Low

**File(s):** `parser.ts:504`

**What the spec says:**
```
CASE OF <identifier>
```
The operand must be a simple variable identifier.

**What the interpreter does:**
Parses a full expression via `this.parseExpression()`, allowing constructs like `CASE OF x + 1`.

**Impact:** Low â this is a superset of the spec behavior. All valid code works, but invalid code (expressions instead of identifiers) is also accepted.

**Suggested fix:**
Replace `this.parseExpression()` with `this.parseIdentifier()` or equivalent, and emit a parse error if the token is not a plain IDENTIFIER.

---

### Bug 11 â CASE statement can't handle negative literal case values

**Severity:** Medium

**File(s):** `parser.ts:555-558`

**What the spec says:**
Case values can be numeric literals, including negative numbers.

**What the interpreter does:**
The parser detects the start of a new case branch by checking for `NUMBER`, `STRING`, `TRUE`, `FALSE`, `OTHERWISE`, or `ENDCASE` tokens. A negative number like `-1` starts with a `-` which is an OPERATOR token, not a NUMBER. The parser therefore treats `-1 :` as a statement in the *previous* case block instead of as a new case value.

**Impact:** Any case branch with a negative literal value is silently misparsed.

**Suggested fix:**
Add lookahead logic: if the current token is `-` (OPERATOR) and the next token is `NUMBER`, treat it as the start of a new case branch with a negative value.

---

### Bug 12 â closeFile doesn't properly close WRITE/APPEND files

**Severity:** High

**File(s):** `interpreter.ts:750-771`

**What the spec says:**
`CLOSEFILE <filename>` closes the file, after which it can be reopened.

**What the interpreter does:**
For files opened in WRITE or APPEND mode, the file handle entry remains in the `fileHandles` map after closing. Consequently `this.fileHandles.has(filename)` still returns `true`, and a subsequent `OPENFILE` throws an "already open" error.

**Impact:** Files opened for WRITE/APPEND cannot be reopened after closing.

**Suggested fix:**
Ensure `this.fileHandles.delete(filename)` is called for all modes (READ, WRITE, APPEND) in the close handler.

---

### Bug 13 â File operations produce spurious output

**Severity:** Medium

**File(s):** `interpreter.ts:747, 765, 769, 864, 892`

**What the spec says:**
File operations (OPENFILE, CLOSEFILE, READFILE, WRITEFILE) are silent. Only `OUTPUT` produces visible output.

**What the interpreter does:**
File operations yield informational messages such as:
- `"Opened file 'data.txt' in READ mode"`
- `"Closed file 'data.txt'"`
- `"[Write to data.txt] some data"`

READFILE also echoes the line that was read.

**Impact:** Programs produce unexpected extra output lines that are not from OUTPUT statements.

**Suggested fix:**
Remove all `yield` statements from file operation handlers that emit informational/debug messages. Only `OUTPUT` and `PRINT` should yield output.

---

### Bug 14 â INPUT echoes the entered value as output

**Severity:** Medium

**File(s):** `interpreter.ts:447, 518`

**What the spec says:**
`INPUT <identifier>` reads a value into a variable. It does not produce output.

**What the interpreter does:**
After reading input, the entered value is yielded as output: `yield input`.

**Impact:** Every INPUT statement generates a spurious output line containing the entered value. This may be intentional for UX (mimicking terminal echo) but diverges from spec behavior.

**Suggested fix:**
Remove the `yield input` after INPUT handling. If echo behavior is desired for the UI, handle it at the UI layer rather than the interpreter layer.

---

### Bug 15 â BYREF keyword doesn't propagate to subsequent parameters

**Severity:** High

**File(s):** `parser.ts:810-842`

**What the spec says:**
> "If there are several parameters passed by the same method, the BYVAL or BYREF keyword need not be repeated."

Example:
```
PROCEDURE SWAP(BYREF X : INTEGER, Y : INTEGER)
```
Both `X` and `Y` are passed BYREF.

**What the interpreter does:**
Each parameter independently checks for the presence of `BYREF` or `BYVAL`. In the example above, only `X` is marked BYREF; `Y` defaults to BYVAL.

**Impact:** Multi-parameter procedures where BYREF/BYVAL is stated once (per the spec) will have incorrect parameter passing semantics for all parameters after the first.

**Suggested fix:**
Track the most recently seen passing mode (`BYREF` or `BYVAL`) and apply it to subsequent parameters until a new mode keyword is encountered:
```ts
let currentMode = 'BYVAL'; // default
// When parsing each param:
if (this.check('BYREF') || this.check('BYVAL')) {
  currentMode = this.advance().value;
}
param.passingMode = currentMode;
```

---

### Bug 16 â Single-quoted literals get type STRING instead of CHAR

**Severity:** Medium

**File(s):** `lexer.ts:82-101`, `parser.ts:1031-1039`

**What the spec says:**
- Single quotes denote CHAR: `'x'`, `'C'`, `'@'`
- Double quotes denote STRING: `"This is a string"`, `""`

**What the interpreter does:**
Both single-quoted and double-quoted literals produce STRING tokens. The parser does not distinguish between them, so `'A'` gets `dataType: 'STRING'` instead of `dataType: 'CHAR'`.

**Impact:** CHAR literals are mistyped as STRING. This can cause type mismatch errors when assigning to CHAR variables, and means the type system doesn't correctly model the CHAR/STRING distinction.

**Suggested fix:**
In the lexer, emit a `CHAR` token type (or a STRING token with a `subType: 'CHAR'` flag) for single-quoted literals. In the parser, set `dataType: 'CHAR'` for single-quoted literal nodes.

---

### Bug 17 â DIV uses Math.floor instead of truncation toward zero

**Severity:** Medium

**File(s):** `interpreter.ts:1385`

**What the spec says:**
> "Integer division: Used to find the quotient (integer number before the decimal point) after division."

Example: `7 DIV 2` = `3`.

**What the interpreter does:**
Uses `Math.floor(left / right)`. For negative operands: `-7 DIV 2` returns `-4` (floor) instead of `-3` (truncation toward zero).

**Impact:** Incorrect results for negative operands.

**Suggested fix:**
Replace `Math.floor(left / right)` with `Math.trunc(left / right)`.

---

### Bug 18 â Division `/` doesn't always return REAL

**Severity:** Low

**File(s):** `interpreter.ts:1372-1378`

**What the spec says:**
> "The resulting value should be of data type REAL, even if the operands are integers."

**What the interpreter does:**
Returns `left / right` directly. In JavaScript, `10 / 5` evaluates to `2` (indistinguishable from an integer at the JS level). When the result is stored, the interpreter's type tracking may record it as INTEGER rather than REAL if the numeric value happens to be a whole number.

**Impact:** Primarily a type-tracking issue. The numeric value is correct, but the recorded data type may be wrong when the result is a whole number.

**Suggested fix:**
After computing division, explicitly tag the result's data type as `REAL` regardless of whether the numeric value is a whole number. This ensures type consistency when the value flows into typed variables.

---

## Priority Recommendations

### Must fix (Critical â spec-compliant code fails to run):
1. **Bug 1** â CONSTANT syntax
2. **Bug 2** â WHILE DO keyword
3. **Bug 6** â RAND name and signature

### Should fix (High â common operations broken or silently wrong):
4. **Bug 3** â Missing RIGHT
5. **Bug 4** â MID vs SUBSTRING
6. **Bug 8** â Sync assignment skips type checking
7. **Bug 9** â No iteration limit in sync execution
8. **Bug 12** â closeFile doesn't clean up WRITE/APPEND handles
9. **Bug 15** â BYREF propagation

### Nice to fix (Medium â edge cases or type strictness):
10. **Bug 5** â LCASE/UCASE on STRING vs CHAR
11. **Bug 7** â INT truncation direction
12. **Bug 11** â Negative CASE values
13. **Bug 13** â Spurious file operation output
14. **Bug 14** â INPUT echo
15. **Bug 16** â CHAR vs STRING literal typing
16. **Bug 17** â DIV truncation direction

### Low priority (spec superset or minor type tracking):
17. **Bug 10** â CASE OF expression vs identifier
18. **Bug 18** â Division REAL type tracking
