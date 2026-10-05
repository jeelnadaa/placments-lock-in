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
 * Real-time Java linter that checks without requiring compilation:
 * 1. Variable re-initialization / duplicate declarations in same method or block scope.
 * 2. Missing semicolons and syntax error nodes.
 * 3. Missing return statements in non-void methods.
 * 4. Unclosed string and character literals.
 * 5. Unbalanced braces and delimiters.
 */
export function javaLinter(view: EditorView): Diagnostic[] {
  const diagnostics: Diagnostic[] = [];
  const state = view.state;
  const doc = state.doc;
  const docLength = doc.length;
  if (docLength === 0) return diagnostics;

  const docText = doc.toString();
  const tree = syntaxTree(state);

  // 1. AST Traversal for Scopes, Variable Redeclarations, Missing Returns, and Syntax Errors
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

  // 2. Line-by-line checks for unclosed string quotes and common errors
  for (let l = 1; l <= doc.lines; l++) {
    const lineObj = doc.line(l);
    const lineText = lineObj.text;

    // Check for "elseif" typo
    const elseifMatch = lineText.match(/\belseif\b/);
    if (elseifMatch && elseifMatch.index !== undefined) {
      diagnostics.push({
        from: lineObj.from + elseifMatch.index,
        to: lineObj.from + elseifMatch.index + 6,
        severity: 'error',
        message: "Syntax error: 'else if' expected, not 'elseif'",
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

  // 3. Brace balance check
  let openBraces = 0;
  for (let i = 0; i < docLength; i++) {
    const ch = docText[i];
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
