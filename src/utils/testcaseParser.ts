/**
 * Robust testcase input formatter, parser, and validator.
 * Handles both spaced (`[1, 2, 3]`) and unspaced (`[1,2,3]`) formats,
 * multi-language inputs (null/None, true/True, false/False),
 * and strictly validates types while keeping user typing fluid.
 */

export interface ValidationResult {
  valid: boolean;
  value?: unknown;
  error?: string;
}

/**
 * Format initial input value for display in the input box.
 */
export function formatParamValue(val: unknown): string {
  if (val === undefined || val === null) {
    return '';
  }
  if (typeof val === 'string') {
    // If it's already a JSON-like array/object string, keep as is
    const trimmed = val.trim();
    if ((trimmed.startsWith('[') && trimmed.endsWith(']')) || (trimmed.startsWith('{') && trimmed.endsWith('}'))) {
      return val;
    }
    return val;
  }
  if (Array.isArray(val)) {
    try {
      // Space after comma for clean readability
      return JSON.stringify(val).replace(/,/g, ', ');
    } catch {
      return String(val);
    }
  }
  if (typeof val === 'object') {
    try {
      return JSON.stringify(val);
    } catch {
      return String(val);
    }
  }
  return String(val);
}

/**
 * Pre-processes raw user text to be JSON-parseable across languages
 * (e.g. Python None -> null, True -> true, False -> false, single quotes -> double quotes).
 */
function normalizeToJSON(raw: string): string {
  let s = raw.trim();

  // Normalize Python booleans and None
  s = s.replace(/\bNone\b/g, 'null')
       .replace(/\bTrue\b/g, 'true')
       .replace(/\bFalse\b/g, 'false');

  // If single quotes are used instead of double quotes, e.g. ['a', 'b'] -> ["a", "b"]
  // Replace single quotes that wrap words/chars with double quotes
  s = s.replace(/'([^'\\]*(?:\\.[^'\\]*)*)'/g, '"$1"');

  return s;
}

/**
 * Validates and parses a parameter value string according to its problem definition type.
 */
export function parseAndValidateParam(raw: string, type: string): ValidationResult {
  const trimmed = raw.trim();
  const cleanType = type.trim();

  if (trimmed === '') {
    return {
      valid: false,
      error: 'Value cannot be empty',
    };
  }

  // 1. Primitive: int / long
  if (cleanType === 'int' || cleanType === 'Integer' || cleanType === 'long' || cleanType === 'Long') {
    if (!/^-?\d+$/.test(trimmed)) {
      return {
        valid: false,
        error: `Expected an integer for ${cleanType}, e.g. 0 or 42 (got: ${trimmed})`,
      };
    }
    const num = Number(trimmed);
    if (!Number.isSafeInteger(num) && cleanType !== 'long') {
      return {
        valid: false,
        error: `Integer out of safe range: ${trimmed}`,
      };
    }
    return { valid: true, value: num };
  }

  // 2. Primitive: double
  if (cleanType === 'double' || cleanType === 'Double') {
    if (!/^-?\d+(\.\d+)?([eE][+-]?\d+)?$/.test(trimmed)) {
      return {
        valid: false,
        error: `Expected a number for ${cleanType}, e.g. 3.14 (got: ${trimmed})`,
      };
    }
    return { valid: true, value: parseFloat(trimmed) };
  }

  // 3. Primitive: boolean
  if (cleanType === 'boolean' || cleanType === 'Boolean') {
    const lower = trimmed.toLowerCase();
    if (lower === 'true') return { valid: true, value: true };
    if (lower === 'false') return { valid: true, value: false };
    return {
      valid: false,
      error: `Expected 'true' or 'false' for boolean (got: ${trimmed})`,
    };
  }

  // 4. Primitive: char / Character
  if (cleanType === 'char' || cleanType === 'Character') {
    let ch = trimmed;
    if ((ch.startsWith('"') && ch.endsWith('"')) || (ch.startsWith("'") && ch.endsWith("'"))) {
      ch = ch.slice(1, -1);
    }
    if (ch.length !== 1) {
      return {
        valid: false,
        error: `Expected a single character for char, e.g. 'a' (got: ${trimmed})`,
      };
    }
    return { valid: true, value: ch };
  }

  // 5. String
  if (cleanType === 'String') {
    let str = trimmed;
    if ((str.startsWith('"') && str.endsWith('"')) || (str.startsWith("'") && str.endsWith("'"))) {
      try {
        str = JSON.parse(normalizeToJSON(trimmed));
      } catch {
        str = str.slice(1, -1);
      }
    }
    return { valid: true, value: str };
  }

  // 6. 2D Arrays: int[][], char[][], List<List<Integer>>, List<List<String>>
  if (cleanType === 'int[][]' || cleanType === 'char[][]' || cleanType.startsWith('List<List<')) {
    if (!trimmed.startsWith('[') || !trimmed.endsWith(']')) {
      return {
        valid: false,
        error: `Expected a 2D array format, e.g. [[1, 2], [3, 4]] or [[1,2],[3,4]]`,
      };
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(normalizeToJSON(trimmed));
    } catch {
      return {
        valid: false,
        error: `Invalid array syntax. Ensure brackets and commas are properly closed.`,
      };
    }

    if (!Array.isArray(parsed)) {
      return { valid: false, error: `Expected a 2D array, e.g. [[1, 2], [3, 4]]` };
    }

    for (let r = 0; r < parsed.length; r++) {
      const row = parsed[r];
      if (!Array.isArray(row)) {
        return {
          valid: false,
          error: `Row ${r} must be an array, e.g. [1, 2]`,
        };
      }
      if (cleanType === 'int[][]') {
        for (let c = 0; c < row.length; c++) {
          if (typeof row[c] !== 'number' || !Number.isInteger(row[c])) {
            return {
              valid: false,
              error: `Element at [${r}][${c}] is not an integer: ${JSON.stringify(row[c])}`,
            };
          }
        }
      }
    }

    return { valid: true, value: parsed };
  }

  // 7. Graph Node
  if (cleanType === 'Node') {
    if (!trimmed.startsWith('[') || !trimmed.endsWith(']')) {
      return {
        valid: false,
        error: `Expected adjacency list format, e.g. [[2, 4], [1, 3], [2, 4], [1, 3]] or []`,
      };
    }
    let parsed: unknown;
    try {
      parsed = JSON.parse(normalizeToJSON(trimmed));
    } catch {
      return {
        valid: false,
        error: `Invalid JSON for Graph Node. Expected [[2, 4], [1, 3]] or []`,
      };
    }
    if (!Array.isArray(parsed)) {
      return { valid: false, error: `Expected an adjacency array for Graph Node` };
    }
    return { valid: true, value: parsed };
  }

  // 8. Binary Tree: TreeNode
  if (cleanType === 'TreeNode') {
    // Can be a target node value (integer) or level-order array [3, 9, 20, null, null, 15, 7]
    if (/^-?\d+$/.test(trimmed)) {
      return { valid: true, value: Number(trimmed) };
    }

    if (!trimmed.startsWith('[') || !trimmed.endsWith(']')) {
      return {
        valid: false,
        error: `Expected level-order array for TreeNode, e.g. [3, 9, 20, null, null, 15, 7] or []`,
      };
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(normalizeToJSON(trimmed));
    } catch {
      return {
        valid: false,
        error: `Invalid tree array syntax. Values must be integers or null, separated by commas.`,
      };
    }

    if (!Array.isArray(parsed)) {
      return { valid: false, error: `Expected an array for TreeNode` };
    }

    for (let i = 0; i < parsed.length; i++) {
      const item = parsed[i];
      if (item !== null && (typeof item !== 'number' || !Number.isInteger(item))) {
        return {
          valid: false,
          error: `Tree element at index ${i} must be an integer or null (got: ${JSON.stringify(item)})`,
        };
      }
    }

    return { valid: true, value: parsed };
  }

  // 9. Linked List: ListNode
  if (cleanType === 'ListNode') {
    if (!trimmed.startsWith('[') || !trimmed.endsWith(']')) {
      return {
        valid: false,
        error: `Expected linked list format enclosed in brackets [], e.g. [1, 2, 3] or [1,2,3] or []`,
      };
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(normalizeToJSON(trimmed));
    } catch {
      return {
        valid: false,
        error: `Invalid linked list syntax. Values must be integers separated by commas.`,
      };
    }

    if (!Array.isArray(parsed)) {
      return { valid: false, error: `Expected an array for ListNode` };
    }

    for (let i = 0; i < parsed.length; i++) {
      const item = parsed[i];
      if (typeof item !== 'number' || !Number.isInteger(item)) {
        return {
          valid: false,
          error: `Linked list node value at index ${i} must be an integer (got: ${JSON.stringify(item)})`,
        };
      }
    }

    return { valid: true, value: parsed };
  }

  // 10. 1D Arrays: int[], long[], double[], char[], String[], ListNode[], List<Integer>, List<String>
  if (cleanType.includes('[]') || cleanType.startsWith('List<')) {
    if (!trimmed.startsWith('[') || !trimmed.endsWith(']')) {
      return {
        valid: false,
        error: `Expected array format enclosed in brackets [], e.g. [1, 2, 3] or [1,2,3]`,
      };
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(normalizeToJSON(trimmed));
    } catch {
      return {
        valid: false,
        error: `Invalid array syntax. Ensure elements are separated by commas and brackets match.`,
      };
    }

    if (!Array.isArray(parsed)) {
      return { valid: false, error: `Expected array format, e.g. [1, 2, 3]` };
    }

    if (cleanType === 'int[]' || cleanType === 'List<Integer>') {
      for (let i = 0; i < parsed.length; i++) {
        const item = parsed[i];
        if (typeof item !== 'number' || !Number.isInteger(item)) {
          return {
            valid: false,
            error: `Element at index ${i} must be an integer (got: ${JSON.stringify(item)})`,
          };
        }
      }
    }

    return { valid: true, value: parsed };
  }

  // Fallback: try parsing JSON, if fails return raw string
  try {
    const parsed = JSON.parse(normalizeToJSON(trimmed));
    return { valid: true, value: parsed };
  } catch {
    return { valid: true, value: trimmed };
  }
}
