import { EditorView } from '@codemirror/view';
import { Diagnostic } from '@codemirror/lint';

/**
 * Live IDE-level linter for Python solutions.
 * Analyzes syntax structure, delimiter balancing, colons, indentation, and common cross-language syntax traps.
 */
export function pythonLinter(view: EditorView): Diagnostic[] {
  const diagnostics: Diagnostic[] = [];
  const doc = view.state.doc;
  const fullText = doc.toString();

  // 1. Bracket and parenthesis balancing
  const bracketStack: Array<{ char: string; pos: number; line: number }> = [];
  let inSingleQuote = false;
  let inDoubleQuote = false;
  let singleQuoteStart = 0;
  let doubleQuoteStart = 0;
  let inTripleSingle = false;
  let inTripleDouble = false;
  let inComment = false;

  for (let i = 0; i < fullText.length; i++) {
    const ch = fullText[i];
    const prev = i > 0 ? fullText[i - 1] : '';
    const next1 = i + 1 < fullText.length ? fullText[i + 1] : '';
    const next2 = i + 2 < fullText.length ? fullText[i + 2] : '';

    if (ch === '\n') {
      inComment = false;
      if (inSingleQuote && !inTripleSingle) {
        diagnostics.push({
          from: singleQuoteStart,
          to: i,
          severity: 'error',
          message: 'SyntaxError: Unclosed string literal',
        });
        inSingleQuote = false;
      }
      if (inDoubleQuote && !inTripleDouble) {
        diagnostics.push({
          from: doubleQuoteStart,
          to: i,
          severity: 'error',
          message: 'SyntaxError: Unclosed string literal',
        });
        inDoubleQuote = false;
      }
      continue;
    }

    if (inComment) continue;

    // Check for triple quotes
    if (ch === "'" && next1 === "'" && next2 === "'") {
      inTripleSingle = !inTripleSingle;
      i += 2;
      continue;
    }
    if (ch === '"' && next1 === '"' && next2 === '"') {
      inTripleDouble = !inTripleDouble;
      i += 2;
      continue;
    }

    if (inTripleSingle || inTripleDouble) continue;

    // Single / double quote toggle
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

    if (ch === '#') {
      inComment = true;
      continue;
    }

    // Bracket checking
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

  if (inSingleQuote && !inTripleSingle) {
    diagnostics.push({
      from: singleQuoteStart,
      to: fullText.length,
      severity: 'error',
      message: 'SyntaxError: Unclosed string literal',
    });
  } else if (inDoubleQuote && !inTripleDouble) {
    diagnostics.push({
      from: doubleQuoteStart,
      to: fullText.length,
      severity: 'error',
      message: 'SyntaxError: Unclosed string literal',
    });
  }

  // Any unclosed brackets left on stack
  for (const unclosed of bracketStack) {
    diagnostics.push({
      from: unclosed.pos,
      to: unclosed.pos + 1,
      severity: 'error',
      message: `Unclosed '${unclosed.char}' opened on line ${unclosed.line}`,
    });
  }

  // 2. Line-by-line checks for indentation, colons, and language traps
  const totalLines = doc.lines;
  let previousLineEndedWithColon = false;
  let previousIndent = 0;

  for (let lineNum = 1; lineNum <= totalLines; lineNum++) {
    const line = doc.line(lineNum);
    const lineText = line.text;
    const trimmed = lineText.trim();

    // Skip empty lines or pure comment lines
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    // Indentation analysis
    const matchIndent = lineText.match(/^([ \t]*)/);
    const rawIndent = matchIndent ? matchIndent[1] : '';
    const hasTabs = rawIndent.includes('\t');
    const hasSpaces = rawIndent.includes(' ');

    if (hasTabs) {
      diagnostics.push({
        from: line.from,
        to: line.from + rawIndent.length,
        severity: 'warning',
        message: 'Indentation contains tab (\\t). Use 4 spaces for indentation instead.',
      });
    }

    if (hasTabs && hasSpaces) {
      diagnostics.push({
        from: line.from,
        to: line.from + rawIndent.length,
        severity: 'error',
        message: 'IndentationError: Inconsistent use of tabs and spaces in indentation.',
      });
    }

    const currentIndent = rawIndent.length;

    // Check if previous line had a block opener (:) but this line was not indented
    if (previousLineEndedWithColon && currentIndent <= previousIndent) {
      diagnostics.push({
        from: line.from,
        to: line.from + currentIndent + 1,
        severity: 'error',
        message: 'IndentationError: Expected an indented block after statement with colon (:).',
      });
    }

    // Check statements requiring a trailing colon
    const cleanNoComment = lineText.split('#')[0].trimEnd();
    const isControlStmt = /^(?:def\s+[A-Za-z_][A-Za-z0-9_]*\s*\(.*?\)|class\s+[A-Za-z_][A-Za-z0-9_]*(?:\(.*?\))?|if\b.+|elif\b.+|else\b|for\b.+|while\b.+|try\b|except\b.*|finally\b|with\b.+)$/.test(cleanNoComment.trim());

    if (isControlStmt && !cleanNoComment.endsWith(':') && !bracketStack.some((b) => b.line === lineNum)) {
      diagnostics.push({
        from: line.to - 1,
        to: line.to,
        severity: 'error',
        message: `SyntaxError: Missing ':' at end of '${cleanNoComment.trim().split(' ')[0]}' header.`,
      });
    }

    // Common cross-language traps
    const checkWordTrap = (word: string, replacement: string) => {
      const regex = new RegExp(`\\b${word}\\b`, 'g');
      let m: RegExpExecArray | null;
      while ((m = regex.exec(cleanNoComment)) !== null) {
        diagnostics.push({
          from: line.from + m.index,
          to: line.from + m.index + word.length,
          severity: 'warning',
          message: `Use '${replacement}' instead of '${word}'.`,
        });
      }
    };

    checkWordTrap('null', 'None');
    checkWordTrap('true', 'True');
    checkWordTrap('false', 'False');

    // Operator traps: &&, ||, ===
    const checkOpTrap = (op: string, replacement: string) => {
      const idx = cleanNoComment.indexOf(op);
      if (idx !== -1) {
        diagnostics.push({
          from: line.from + idx,
          to: line.from + idx + op.length,
          severity: 'error',
          message: `Use '${replacement}' instead of '${op}'. Invalid Python operator.`,
        });
      }
    };

    checkOpTrap('===', '==');
    checkOpTrap('!==', '!=');
    checkOpTrap('&&', 'and');
    checkOpTrap('||', 'or');

    // 'this.' trap
    const thisIdx = cleanNoComment.indexOf('this.');
    if (thisIdx !== -1) {
      diagnostics.push({
        from: line.from + thisIdx,
        to: line.from + thisIdx + 5,
        severity: 'warning',
        message: "Use 'self.' instead of 'this.'.",
      });
    }

    // Java modifier keyword traps
    const modMatch = cleanNoComment.match(/\b(public|private|protected)\b/);
    if (modMatch && modMatch.index !== undefined) {
      diagnostics.push({
        from: line.from + modMatch.index,
        to: line.from + modMatch.index + modMatch[1].length,
        severity: 'error',
        message: `Python does not use '${modMatch[1]}' access modifiers.`,
      });
    }

    // Track state for next line
    previousLineEndedWithColon = cleanNoComment.endsWith(':');
    previousIndent = currentIndent;
  }

  return diagnostics;
}
