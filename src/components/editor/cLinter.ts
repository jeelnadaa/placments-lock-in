import { EditorView } from '@codemirror/view';
import { Diagnostic } from '@codemirror/lint';

/**
 * Live IDE-level linter for C solutions.
 * Checks for syntax structure, delimiter balancing, semicolons, and common cross-language/C++ traps.
 */
export function cLinter(view: EditorView): Diagnostic[] {
  const diagnostics: Diagnostic[] = [];
  const doc = view.state.doc;
  const fullText = doc.toString();

  // 1. Bracket and delimiter balancing
  const bracketStack: Array<{ char: string; pos: number; line: number }> = [];
  let inSingleQuote = false;
  let inDoubleQuote = false;
  let singleQuoteStart = 0;
  let doubleQuoteStart = 0;
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
    if (!inSingleQuote && !inDoubleQuote) {
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
  let insideStruct = false;

  for (let lineNum = 1; lineNum <= totalLines; lineNum++) {
    const line = doc.line(lineNum);
    const lineText = line.text;
    const trimmed = lineText.trim();

    // Skip empty lines or pure comments
    if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) {
      continue;
    }

    const cleanNoComment = lineText.split('//')[0].trimEnd();

    // Struct start
    if (/^\s*(typedef\s+)?struct\s+[A-Za-z0-9_]*/.test(cleanNoComment)) {
      insideStruct = true;
    }

    // Semicolon after closing struct bracket: } ;
    if (insideStruct && cleanNoComment === '}') {
      diagnostics.push({
        from: line.from,
        to: line.to,
        severity: 'error',
        message: "Missing ';' or type alias after struct definition closing brace.",
      });
      insideStruct = false;
    }

    // C++ class trap: class Solution or class Foo
    const classMatch = cleanNoComment.match(/\bclass\s+[A-Za-z0-9_]+/);
    if (classMatch && classMatch.index !== undefined) {
      diagnostics.push({
        from: line.from + classMatch.index,
        to: line.from + classMatch.index + 5,
        severity: 'error',
        message: "Classes are not supported in C. Use functions or 'struct' in C.",
      });
    }

    // C++ new / delete traps
    const newMatch = cleanNoComment.match(/\bnew\s+[A-Za-z0-9_]+/);
    if (newMatch && newMatch.index !== undefined) {
      diagnostics.push({
        from: line.from + newMatch.index,
        to: line.from + newMatch.index + 3,
        severity: 'error',
        message: "Operator 'new' is not available in C. Use 'malloc(sizeof(...))' to allocate memory dynamically.",
      });
    }

    const deleteMatch = cleanNoComment.match(/\bdelete\s+[A-Za-z0-9_]+/);
    if (deleteMatch && deleteMatch.index !== undefined) {
      diagnostics.push({
        from: line.from + deleteMatch.index,
        to: line.from + deleteMatch.index + 6,
        severity: 'error',
        message: "Operator 'delete' is not available in C. Use 'free(...)' instead.",
      });
    }

    // C++ namespace trap std::
    if (cleanNoComment.includes('std::')) {
      const idx = cleanNoComment.indexOf('std::');
      diagnostics.push({
        from: line.from + idx,
        to: line.from + idx + 5,
        severity: 'error',
        message: "Namespace 'std::' is C++ only. C standard library functions are in global scope.",
      });
    }

    // C++ vector trap
    const vectorMatch = cleanNoComment.match(/\bvector\s*</);
    if (vectorMatch && vectorMatch.index !== undefined) {
      diagnostics.push({
        from: line.from + vectorMatch.index,
        to: line.from + vectorMatch.index + 6,
        severity: 'error',
        message: "'vector' is a C++ STL container and not available in C. Use arrays or pointers in C.",
      });
    }

    // C++ nullptr trap
    const nullptrMatch = cleanNoComment.match(/\bnullptr\b/);
    if (nullptrMatch && nullptrMatch.index !== undefined) {
      diagnostics.push({
        from: line.from + nullptrMatch.index,
        to: line.from + nullptrMatch.index + 7,
        severity: 'error',
        message: "Use 'NULL' instead of 'nullptr' in C.",
      });
    }

    // null trap
    const nullMatch = cleanNoComment.match(/\bnull\b/);
    if (nullMatch && nullMatch.index !== undefined) {
      diagnostics.push({
        from: line.from + nullMatch.index,
        to: line.from + nullMatch.index + 4,
        severity: 'warning',
        message: "Use 'NULL' instead of 'null' in C.",
      });
    }

    // Python None trap
    const noneMatch = cleanNoComment.match(/\bNone\b/);
    if (noneMatch && noneMatch.index !== undefined) {
      diagnostics.push({
        from: line.from + noneMatch.index,
        to: line.from + noneMatch.index + 4,
        severity: 'error',
        message: "Use 'NULL' instead of 'None' in C.",
      });
    }

    // Python True / False
    const boolMatch = cleanNoComment.match(/\b(True|False)\b/);
    if (boolMatch && boolMatch.index !== undefined) {
      diagnostics.push({
        from: line.from + boolMatch.index,
        to: line.from + boolMatch.index + boolMatch[1].length,
        severity: 'error',
        message: `Use '${boolMatch[1].toLowerCase()}' instead of '${boolMatch[1]}' in C.`,
      });
    }

    // JS operator traps ===, !==
    if (cleanNoComment.includes('===')) {
      const idx = cleanNoComment.indexOf('===');
      diagnostics.push({
        from: line.from + idx,
        to: line.from + idx + 3,
        severity: 'error',
        message: "Use '==' instead of '==='. Invalid C operator.",
      });
    }
    if (cleanNoComment.includes('!==')) {
      const idx = cleanNoComment.indexOf('!==');
      diagnostics.push({
        from: line.from + idx,
        to: line.from + idx + 3,
        severity: 'error',
        message: "Use '!=' instead of '!=='. Invalid C operator.",
      });
    }

    // Python / JS function declaration keywords
    const defMatch = cleanNoComment.match(/^\s*(def|function)\s+/);
    if (defMatch) {
      diagnostics.push({
        from: line.from,
        to: line.from + defMatch[0].length,
        severity: 'error',
        message: `Invalid keyword '${defMatch[1]}' in C. Specify the return type explicitly (e.g. 'int', 'void').`,
      });
    }

    // Pointer dot trap: head.val or root.val when pointer
    const ptrDotMatch = cleanNoComment.match(/\b(head|curr|prev|fast|slow|dummy|root|p|q|node|obj)\.(val|next|left|right)\b/);
    if (ptrDotMatch && ptrDotMatch.index !== undefined) {
      const varName = ptrDotMatch[1];
      const member = ptrDotMatch[2];
      diagnostics.push({
        from: line.from + ptrDotMatch.index,
        to: line.from + ptrDotMatch.index + ptrDotMatch[0].length,
        severity: 'error',
        message: `Use arrow operator '${varName}->${member}' instead of '${varName}.${member}' for pointers.`,
      });
    }

    // Semicolon checks for standard statements
    const needsSemicolon =
      /^(?:return\b|break\b|continue\b|int\b|long\b|double\b|float\b|bool\b|char\b|size_t\b|struct\b)/.test(
        trimmed
      ) &&
      !trimmed.endsWith('{') &&
      !trimmed.endsWith('}') &&
      !trimmed.endsWith(';') &&
      !trimmed.endsWith(',') &&
      !trimmed.endsWith('(') &&
      !trimmed.endsWith(':');

    if (needsSemicolon && !bracketStack.some((b) => b.line === lineNum)) {
      diagnostics.push({
        from: line.to - 1,
        to: line.to,
        severity: 'error',
        message: "Missing ';' at end of statement.",
      });
    }
  }

  return diagnostics;
}
