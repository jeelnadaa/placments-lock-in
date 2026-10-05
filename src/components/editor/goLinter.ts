import { EditorView } from '@codemirror/view';
import { Diagnostic } from '@codemirror/lint';

/**
 * Live IDE-level linter for Go solutions.
 * Checks for syntax structure, delimiter balancing, brace positioning, and common cross-language traps.
 */
export function goLinter(view: EditorView): Diagnostic[] {
  const diagnostics: Diagnostic[] = [];
  const doc = view.state.doc;
  const fullText = doc.toString();

  // 1. Bracket and delimiter balancing
  const bracketStack: Array<{ char: string; pos: number; line: number }> = [];
  let inSingleQuote = false;
  let inDoubleQuote = false;
  let inBacktick = false;
  let singleQuoteStart = 0;
  let doubleQuoteStart = 0;
  let backtickStart = 0;
  let inLineComment = false;
  let inBlockComment = false;

  for (let i = 0; i < fullText.length; i++) {
    const ch = fullText[i];
    const prev = i > 0 ? fullText[i - 1] : '';
    const next = i + 1 < fullText.length ? fullText[i + 1] : '';

    if (ch === '\n') {
      inLineComment = false;
      if (inSingleQuote) {
        diagnostics.push({
          from: singleQuoteStart,
          to: i,
          severity: 'error',
          message: 'SyntaxError: Unclosed character literal',
        });
        inSingleQuote = false;
      }
      if (inDoubleQuote) {
        diagnostics.push({
          from: doubleQuoteStart,
          to: i,
          severity: 'error',
          message: 'SyntaxError: Unclosed string literal',
        });
        inDoubleQuote = false;
      }
      // Backtick strings (raw string literals) can span multiple lines in Go, so don't close on newline
      continue;
    }

    if (inLineComment) continue;

    if (inBlockComment) {
      if (ch === '*' && next === '/') {
        inBlockComment = false;
        i++;
      }
      continue;
    }

    // Check for comment starts
    if (!inSingleQuote && !inDoubleQuote && !inBacktick) {
      if (ch === '/' && next === '/') {
        inLineComment = true;
        i++;
        continue;
      }
      if (ch === '/' && next === '*') {
        inBlockComment = true;
        i++;
        continue;
      }
    }

    // Backticks
    if (ch === '`') {
      if (!inDoubleQuote && !inSingleQuote) {
        if (!inBacktick) {
          inBacktick = true;
          backtickStart = i;
        } else {
          inBacktick = false;
        }
      }
      continue;
    }

    if (inBacktick) continue;

    // Quotes
    if (ch === "'" && prev !== '\\') {
      if (!inSingleQuote && !inDoubleQuote) {
        inSingleQuote = true;
        singleQuoteStart = i;
      } else if (inSingleQuote) {
        inSingleQuote = false;
      }
      continue;
    }

    if (ch === '"' && prev !== '\\') {
      if (!inDoubleQuote && !inSingleQuote) {
        inDoubleQuote = true;
        doubleQuoteStart = i;
      } else if (inDoubleQuote) {
        inDoubleQuote = false;
      }
      continue;
    }

    if (inSingleQuote || inDoubleQuote) continue;

    // Brackets
    if (ch === '(' || ch === '[' || ch === '{') {
      bracketStack.push({ char: ch, pos: i, line: doc.lineAt(i).number });
    } else if (ch === ')' || ch === ']' || ch === '}') {
      if (bracketStack.length === 0) {
        diagnostics.push({
          from: i,
          to: i + 1,
          severity: 'error',
          message: `Unexpected closing '${ch}' with no matching opening bracket`,
        });
      } else {
        const top = bracketStack.pop()!;
        const expected = top.char === '(' ? ')' : top.char === '[' ? ']' : '}';
        if (ch !== expected) {
          diagnostics.push({
            from: i,
            to: i + 1,
            severity: 'error',
            message: `Mismatched closing '${ch}', expected '${expected}' to match '${top.char}' from line ${top.line}`,
          });
        }
      }
    }
  }

  if (inSingleQuote) {
    diagnostics.push({
      from: singleQuoteStart,
      to: fullText.length,
      severity: 'error',
      message: 'SyntaxError: Unclosed character literal',
    });
  }
  if (inDoubleQuote) {
    diagnostics.push({
      from: doubleQuoteStart,
      to: fullText.length,
      severity: 'error',
      message: 'SyntaxError: Unclosed string literal',
    });
  }
  if (inBacktick) {
    diagnostics.push({
      from: backtickStart,
      to: fullText.length,
      severity: 'error',
      message: 'SyntaxError: Unclosed raw string literal (backtick)',
    });
  }

  for (const unclosed of bracketStack) {
    diagnostics.push({
      from: unclosed.pos,
      to: unclosed.pos + 1,
      severity: 'error',
      message: `Unclosed '${unclosed.char}' opened on line ${unclosed.line}`,
    });
  }

  // 2. Line-by-line syntax checks
  const totalLines = doc.lines;

  for (let lineNum = 1; lineNum <= totalLines; lineNum++) {
    const line = doc.line(lineNum);
    const lineText = line.text;
    const trimmed = lineText.trim();

    // Skip empty lines or pure comments
    if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) {
      continue;
    }

    const cleanNoComment = lineText.split('//')[0].trimEnd();

    // Go opening brace on newline trap
    if (
      /^\s*(?:func\b|if\b|for\b|switch\b|else\b)/.test(cleanNoComment) &&
      !cleanNoComment.endsWith('{') &&
      !cleanNoComment.endsWith(',') &&
      !cleanNoComment.endsWith('(')
    ) {
      if (lineNum < totalLines) {
        const nextLine = doc.line(lineNum + 1).text.trim();
        if (nextLine.startsWith('{')) {
          diagnostics.push({
            from: line.to - 1,
            to: line.to,
            severity: 'error',
            message: "Syntax error: In Go, opening brace '{' must be placed on the same line.",
          });
        }
      }
    }

    // Arrow operator trap: head->Val instead of head.Val
    const arrowMatch = cleanNoComment.match(/([A-Za-z0-9_]+)->([A-Za-z0-9_]+)/);
    if (arrowMatch && arrowMatch.index !== undefined) {
      const varName = arrowMatch[1];
      const member = arrowMatch[2];
      diagnostics.push({
        from: line.from + arrowMatch.index,
        to: line.from + arrowMatch.index + arrowMatch[0].length,
        severity: 'error',
        message: `Use dot operator '${varName}.${member}' instead of arrow '->' in Go.`,
      });
    }

    // null / NULL / None / nullptr -> nil
    const nullMatch = cleanNoComment.match(/\b(null|NULL|None|nullptr)\b/);
    if (nullMatch && nullMatch.index !== undefined) {
      diagnostics.push({
        from: line.from + nullMatch.index,
        to: line.from + nullMatch.index + nullMatch[1].length,
        severity: 'error',
        message: `Use 'nil' instead of '${nullMatch[1]}' in Go.`,
      });
    }

    // True / False -> true / false
    const boolMatch = cleanNoComment.match(/\b(True|False)\b/);
    if (boolMatch && boolMatch.index !== undefined) {
      diagnostics.push({
        from: line.from + boolMatch.index,
        to: line.from + boolMatch.index + boolMatch[1].length,
        severity: 'error',
        message: `Use '${boolMatch[1].toLowerCase()}' instead of '${boolMatch[1]}' in Go.`,
      });
    }

    // class trap
    const classMatch = cleanNoComment.match(/\bclass\s+[A-Za-z0-9_]+/);
    if (classMatch && classMatch.index !== undefined) {
      diagnostics.push({
        from: line.from + classMatch.index,
        to: line.from + classMatch.index + 5,
        severity: 'error',
        message: "Classes are not supported in Go. In Go, define structs and methods (e.g. 'type Foo struct').",
      });
    }

    // public / private trap
    const visMatch = cleanNoComment.match(/\b(public|private|protected)\b/);
    if (visMatch && visMatch.index !== undefined) {
      diagnostics.push({
        from: line.from + visMatch.index,
        to: line.from + visMatch.index + visMatch[1].length,
        severity: 'warning',
        message: "Go does not have visibility keywords. Capitalize the first letter for exported identifiers.",
      });
    }

    // JS operator traps ===, !==
    if (cleanNoComment.includes('===')) {
      const idx = cleanNoComment.indexOf('===');
      diagnostics.push({
        from: line.from + idx,
        to: line.from + idx + 3,
        severity: 'error',
        message: "Use '==' instead of '==='. Invalid Go operator.",
      });
    }
    if (cleanNoComment.includes('!==')) {
      const idx = cleanNoComment.indexOf('!==');
      diagnostics.push({
        from: line.from + idx,
        to: line.from + idx + 3,
        severity: 'error',
        message: "Use '!=' instead of '!=='. Invalid Go operator.",
      });
    }

    // def / function trap
    const defMatch = cleanNoComment.match(/^\s*(def|function)\s+/);
    if (defMatch) {
      diagnostics.push({
        from: line.from,
        to: line.from + defMatch[0].length,
        severity: 'error',
        message: `Invalid keyword '${defMatch[1]}'. Use 'func' to declare functions in Go.`,
      });
    }

    // C-style variable declaration: int x = 5
    const cStyleVar = cleanNoComment.match(/^\s*(int|string|bool|float64|char)\s+([A-Za-z0-9_]+)\s*=/);
    if (cStyleVar && !cleanNoComment.includes('func')) {
      const typeName = cStyleVar[1];
      const varName = cStyleVar[2];
      diagnostics.push({
        from: line.from,
        to: line.from + cStyleVar[0].length,
        severity: 'error',
        message: `Invalid variable declaration in Go. Use '${varName} := ...' or 'var ${varName} ${typeName} = ...'.`,
      });
    }
  }

  return diagnostics;
}
