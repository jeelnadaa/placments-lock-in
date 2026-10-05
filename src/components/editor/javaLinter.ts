import { syntaxTree } from '@codemirror/language';
import type { Diagnostic } from '@codemirror/lint';
import { EditorView } from '@codemirror/view';

interface VarInfo {
  name: string;
  from: number;
  to: number;
  line: number;
}

class Scope {
  parent: Scope | null;
  vars: Map<string, VarInfo>;

  constructor(parent: Scope | null = null) {
    this.parent = parent;
    this.vars = new Map();
  }

  find(name: string): VarInfo | null {
    if (this.vars.has(name)) {
      return this.vars.get(name)!;
    }
    if (this.parent) {
      return this.parent.find(name);
    }
    return null;
  }

  add(info: VarInfo) {
    this.vars.set(info.name, info);
  }
}

/**
 * Real-time Java linter with deep AST inspection and edge-case detection:
 * 1. Scope tracking: Duplicate variable declarations & re-initializations.
 * 2. Unreachable code: Statements directly following return, throw, break, or continue.
 * 3. Conditional bugs: Assignment '=' used instead of equality '==' in if/while conditions.
 * 4. String comparisons: '==' / '!=' with String literals instead of .equals(...).
 * 5. Method returns: Non-void methods missing return statements.
 * 6. Python/JS syntax leaks: def, function, let, const, elif, True, False, None, len(), print().
 * 7. Syntax errors: Missing semicolons, unclosed string/char quotes.
 * 8. Delimiter balancing: Unmatched '{', '}', '(', ')', '[', ']'.
 */
export function javaLinter(view: EditorView): Diagnostic[] {
  const diagnostics: Diagnostic[] = [];
  const state = view.state;
  const doc = state.doc;
  const docLength = doc.length;
  if (docLength === 0) return diagnostics;

  const docText = doc.toString();
  const tree = syntaxTree(state);

  // 1. AST Traversal
  let currentScope: Scope | null = null;
  let inMethodOrCtor = false;

  try {
    tree.iterate({
      enter(node) {
        const nodeName = node.name;

        // Enter method or constructor scope
        if (nodeName === 'MethodDeclaration' || nodeName === 'ConstructorDeclaration') {
          inMethodOrCtor = true;
          currentScope = new Scope(null);

          // Check for missing return statement in non-void methods
          if (nodeName === 'MethodDeclaration') {
            let returnType = '';
            let methodName = '';
            let hasReturn = false;
            let methodDefNode: { from: number; to: number } | null = null;

            const cursor = node.node.cursor();
            if (cursor.firstChild()) {
              do {
                if (cursor.name === 'PrimitiveType' || cursor.name === 'TypeName' || cursor.name === 'ArrayType') {
                  returnType = doc.sliceString(cursor.from, cursor.to);
                } else if (cursor.name === 'Definition') {
                  methodName = doc.sliceString(cursor.from, cursor.to);
                  methodDefNode = { from: cursor.from, to: cursor.to };
                } else if (cursor.name === 'Block') {
                  // Inspect block children for ReturnStatement or ThrowStatement
                  const blockCursor = cursor.node.cursor();
                  if (blockCursor.firstChild()) {
                    do {
                      if (
                        blockCursor.name === 'ReturnStatement' ||
                        blockCursor.name === 'ThrowStatement'
                      ) {
                        hasReturn = true;
                        break;
                      }
                    } while (blockCursor.next());
                  }
                }
              } while (cursor.nextSibling());
            }

            if (
              returnType &&
              returnType !== 'void' &&
              !hasReturn &&
              methodDefNode &&
              methodName !== 'main'
            ) {
              diagnostics.push({
                from: methodDefNode.from,
                to: methodDefNode.to,
                severity: 'error',
                message: `Missing return statement: Method '${methodName}' must return a result of type '${returnType}'`,
                source: 'Java',
              });
            }
          }
        } else if (
          inMethodOrCtor &&
          (nodeName === 'Block' ||
            nodeName === 'ForStatement' ||
            nodeName === 'EnhancedForStatement' ||
            nodeName === 'WhileStatement' ||
            nodeName === 'DoStatement' ||
            nodeName === 'IfStatement' ||
            nodeName === 'SwitchStatement')
        ) {
          // Push new nested block scope
          currentScope = new Scope(currentScope);

          // EDGE CASE: Check for unreachable statements inside Block
          if (nodeName === 'Block') {
            let sawTerminator = false;
            let termName = '';
            const blockCursor = node.node.cursor();
            if (blockCursor.firstChild()) {
              do {
                const childName = blockCursor.name;
                if (
                  childName === '{' ||
                  childName === '}' ||
                  childName.includes('Comment')
                ) {
                  continue;
                }

                if (sawTerminator) {
                  diagnostics.push({
                    from: blockCursor.from,
                    to: blockCursor.to,
                    severity: 'error',
                    message: `Unreachable statement: Code following '${termName}' will never be executed`,
                    source: 'Java',
                  });
                  break;
                }

                if (
                  childName === 'ReturnStatement' ||
                  childName === 'ThrowStatement' ||
                  childName === 'BreakStatement' ||
                  childName === 'ContinueStatement'
                ) {
                  sawTerminator = true;
                  termName = childName.replace('Statement', '').toLowerCase();
                }
              } while (blockCursor.nextSibling());
            }
          }
        } else if (inMethodOrCtor && nodeName === 'Definition') {
          // Check if parent is a variable or parameter declaration
          const parent = node.node.parent;
          const parentName = parent ? parent.name : null;

          if (
            parentName === 'VariableDeclarator' ||
            parentName === 'FormalParameter' ||
            parentName === 'CatchFormalParameter'
          ) {
            const varName = doc.sliceString(node.from, node.to);
            const line = doc.lineAt(node.from).number;

            const existing = currentScope ? currentScope.find(varName) : null;
            if (existing) {
              diagnostics.push({
                from: Math.max(0, node.from),
                to: Math.min(docLength, Math.max(node.from + 1, node.to)),
                severity: 'error',
                message: `Variable '${varName}' is already defined in the scope (first defined at line ${existing.line})`,
                source: 'Java',
              });
            } else if (currentScope) {
              currentScope.add({
                name: varName,
                from: node.from,
                to: node.to,
                line,
              });
            }
          }
        } else if (nodeName === 'AssignmentExpression') {
          // EDGE CASE: Check for accidental single assignment inside conditional expression
          const parent = node.node.parent;
          const grandParent = parent?.parent;
          if (
            parent?.name === 'ParenthesizedExpression' &&
            (grandParent?.name === 'IfStatement' || grandParent?.name === 'WhileStatement')
          ) {
            diagnostics.push({
              from: node.from,
              to: node.to,
              severity: 'warning',
              message: "Suspicious assignment in condition: Did you mean '==' for comparison instead of '='?",
              source: 'Java',
            });
          }
        } else if (nodeName === 'BinaryExpression') {
          // EDGE CASE: Check for String literal comparison with == or !=
          let hasStringLiteral = false;
          let isEqualityOp = false;
          let opRange: { from: number; to: number } | null = null;

          const binCursor = node.node.cursor();
          if (binCursor.firstChild()) {
            do {
              if (binCursor.name === 'StringLiteral') {
                hasStringLiteral = true;
              } else if (binCursor.name === 'CompareOp') {
                const op = doc.sliceString(binCursor.from, binCursor.to);
                if (op === '==' || op === '!=') {
                  isEqualityOp = true;
                  opRange = { from: binCursor.from, to: binCursor.to };
                }
              }
            } while (binCursor.nextSibling());
          }

          if (hasStringLiteral && isEqualityOp && opRange) {
            diagnostics.push({
              from: opRange.from,
              to: opRange.to,
              severity: 'warning',
              message: "Comparing string content with '==' checks object reference; use .equals(...) for content comparison",
              source: 'Java',
            });
          }
        } else if (node.type.isError || nodeName === '⚠') {
          // Lezer AST error node detected
          let from = Math.max(0, Math.min(docLength, node.from));
          let to = Math.max(from, Math.min(docLength, node.to > from ? node.to : from + 1));

          // Look at the character immediately before error position
          const sliceBefore = docText.slice(0, from).trimEnd();
          const lastChar = sliceBefore.length > 0 ? sliceBefore[sliceBefore.length - 1] : '';

          let msg = 'Syntax error';
          if (
            lastChar &&
            lastChar !== ';' &&
            lastChar !== '{' &&
            lastChar !== '}' &&
            lastChar !== ':' &&
            lastChar !== '(' &&
            lastChar !== ',' &&
            lastChar !== '['
          ) {
            msg = "Syntax error: ';' expected";
            from = Math.max(0, sliceBefore.length - 1);
            to = Math.min(docLength, sliceBefore.length);
          } else {
            msg = 'Syntax error: Unexpected token or statement';
          }

          diagnostics.push({
            from,
            to,
            severity: 'error',
            message: msg,
            source: 'Java',
          });
        }
      },
      leave(node) {
        const nodeName = node.name;
        if (nodeName === 'MethodDeclaration' || nodeName === 'ConstructorDeclaration') {
          inMethodOrCtor = false;
          currentScope = null;
        } else if (
          inMethodOrCtor &&
          (nodeName === 'Block' ||
            nodeName === 'ForStatement' ||
            nodeName === 'EnhancedForStatement' ||
            nodeName === 'WhileStatement' ||
            nodeName === 'DoStatement' ||
            nodeName === 'IfStatement' ||
            nodeName === 'SwitchStatement')
        ) {
          if (currentScope && currentScope.parent) {
            currentScope = currentScope.parent;
          }
        }
      },
    });
  } catch (err) {
    console.error('Error during Java AST linting:', err);
  }

  // 2. Line-by-line checks for syntax leaks, unclosed quotes, and common edge cases
  for (let l = 1; l <= doc.lines; l++) {
    const lineObj = doc.line(l);
    const lineText = lineObj.text;

    // Check for comment-only line
    const trimmed = lineText.trim();
    if (trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('/*')) {
      continue;
    }

    // EDGE CASE: Python / JavaScript syntax leaks
    const pythonJsPatterns: [RegExp, string][] = [
      [/\bdef\s+([A-Za-z0-9_]+)/, "Illegal keyword 'def'; in Java declare methods with return types (e.g. 'public int')"],
      [/\bfunction\s+([A-Za-z0-9_]+)/, "Illegal keyword 'function'; Java methods require return types (e.g. 'public void')"],
      [/\b(let|const)\s+([A-Za-z0-9_]+)/, "Illegal keyword '$1'; specify a type in Java (e.g. 'int', 'String') or 'var'"],
      [/\b(elif|elseif)\b/, "Syntax error: Use 'else if' in Java"],
      [/\b(True)\b/, "Java boolean literals are lowercase: use 'true'"],
      [/\b(False)\b/, "Java boolean literals are lowercase: use 'false'"],
      [/\b(None|nil|undefined)\b/, "Java null reference is 'null' (not '$1')"],
      [/\blen\s*\(/, "Function 'len()' does not exist in Java; use .length, .length(), or .size()"],
      [/\bprint\s*\(/, "Use 'System.out.println(...)' to print in Java"],
      [/\bconsole\.log\s*\(/, "Use 'System.out.println(...)' in Java"],
    ];

    for (const [pat, msg] of pythonJsPatterns) {
      const match = lineText.match(pat);
      if (match && match.index !== undefined) {
        diagnostics.push({
          from: lineObj.from + match.index,
          to: lineObj.from + match.index + match[0].length,
          severity: 'error',
          message: msg.replace('$1', match[1] || match[0]),
          source: 'Java',
        });
      }
    }

    // EDGE CASE: Calling .charAt[i] with brackets instead of parentheses
    const charAtBracket = lineText.match(/\.charAt\s*\[/);
    if (charAtBracket && charAtBracket.index !== undefined) {
      diagnostics.push({
        from: lineObj.from + charAtBracket.index,
        to: lineObj.from + charAtBracket.index + charAtBracket[0].length,
        severity: 'error',
        message: "Use parentheses for charAt: '.charAt(i)', not brackets '[]'",
        source: 'Java',
      });
    }

    // Check for unclosed string literal on this line (unless line comment or continued)
    let inString = false;
    let quoteStart = -1;
    let inChar = false;
    let charStart = -1;
    let escaped = false;

    for (let c = 0; c < lineText.length; c++) {
      const ch = lineText[c];
      const nextCh = lineText[c + 1];

      if (!inString && !inChar && ch === '/' && nextCh === '/') {
        break; // line comment starts, stop checking
      }

      if (escaped) {
        escaped = false;
        continue;
      }

      if (ch === '\\') {
        escaped = true;
        continue;
      }

      if (ch === '"' && !inChar) {
        if (!inString) {
          inString = true;
          quoteStart = c;
        } else {
          inString = false;
          quoteStart = -1;
        }
      } else if (ch === "'" && !inString) {
        if (!inChar) {
          inChar = true;
          charStart = c;
        } else {
          inChar = false;
          charStart = -1;
        }
      }
    }

    if (inString && quoteStart !== -1) {
      diagnostics.push({
        from: lineObj.from + quoteStart,
        to: lineObj.to,
        severity: 'error',
        message: 'Unclosed string literal',
        source: 'Java',
      });
    }

    if (inChar && charStart !== -1) {
      diagnostics.push({
        from: lineObj.from + charStart,
        to: lineObj.to,
        severity: 'error',
        message: 'Unclosed character literal',
        source: 'Java',
      });
    }
  }

  // 3. Delimiter balance checks: {}, (), []
  let openBraces = 0;
  let openParens = 0;
  let openBrackets = 0;
  let inStr = false;
  let inCh = false;
  let esc = false;

  for (let i = 0; i < docLength; i++) {
    const ch = docText[i];

    if (esc) {
      esc = false;
      continue;
    }
    if (ch === '\\') {
      esc = true;
      continue;
    }
    if (ch === '"' && !inCh) {
      inStr = !inStr;
      continue;
    }
    if (ch === "'" && !inStr) {
      inCh = !inCh;
      continue;
    }
    if (inStr || inCh) continue;

    // Check braces
    if (ch === '{') openBraces++;
    else if (ch === '}') {
      openBraces--;
      if (openBraces < 0) {
        diagnostics.push({
          from: i,
          to: i + 1,
          severity: 'error',
          message: "Syntax error: Unmatched closing brace '}'",
          source: 'Java',
        });
        openBraces = 0;
      }
    }

    // Check parentheses
    if (ch === '(') openParens++;
    else if (ch === ')') {
      openParens--;
      if (openParens < 0) {
        diagnostics.push({
          from: i,
          to: i + 1,
          severity: 'error',
          message: "Syntax error: Unmatched closing parenthesis ')'",
          source: 'Java',
        });
        openParens = 0;
      }
    }

    // Check brackets
    if (ch === '[') openBrackets++;
    else if (ch === ']') {
      openBrackets--;
      if (openBrackets < 0) {
        diagnostics.push({
          from: i,
          to: i + 1,
          severity: 'error',
          message: "Syntax error: Unmatched closing bracket ']'",
          source: 'Java',
        });
        openBrackets = 0;
      }
    }
  }

  if (openBraces > 0) {
    const lastPos = Math.max(0, docLength - 1);
    diagnostics.push({
      from: lastPos,
      to: docLength,
      severity: 'error',
      message: `Syntax error: Missing ${openBraces} closing brace '${'}'.repeat(openBraces)}'`,
      source: 'Java',
    });
  }

  if (openParens > 0) {
    const lastPos = Math.max(0, docLength - 1);
    diagnostics.push({
      from: lastPos,
      to: docLength,
      severity: 'error',
      message: `Syntax error: Missing ${openParens} closing parenthesis ')'`,
      source: 'Java',
    });
  }

  if (openBrackets > 0) {
    const lastPos = Math.max(0, docLength - 1);
    diagnostics.push({
      from: lastPos,
      to: docLength,
      severity: 'error',
      message: `Syntax error: Missing ${openBrackets} closing bracket ']'`,
      source: 'Java',
    });
  }

  // Deduplicate diagnostics overlapping on the exact same range and message
  const uniqueDiagnostics: Diagnostic[] = [];
  const seen = new Set<string>();

  for (const diag of diagnostics) {
    const key = `${diag.from}-${diag.to}-${diag.message}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueDiagnostics.push(diag);
    }
  }

  return uniqueDiagnostics;
}
