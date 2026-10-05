import { Completion, CompletionContext, CompletionResult, snippetCompletion } from '@codemirror/autocomplete';

/**
 * Built-in Go functions
 */
const builtinFunctions: Completion[] = [
  snippetCompletion('append(${1:slice}, ${2:element})', {
    label: 'append',
    type: 'function',
    detail: 'append(slice []T, elems ...T) []T',
  }),
  snippetCompletion('make(${1:type}, ${2:len})', {
    label: 'make',
    type: 'function',
    detail: 'make(t Type, size ...IntegerType) Type',
  }),
  snippetCompletion('len(${1:v})', { label: 'len', type: 'function', detail: 'len(v Type) int' }),
  snippetCompletion('cap(${1:v})', { label: 'cap', type: 'function', detail: 'cap(v Type) int' }),
  snippetCompletion('copy(${1:dst}, ${2:src})', {
    label: 'copy',
    type: 'function',
    detail: 'copy(dst, src []T) int',
  }),
  snippetCompletion('delete(${1:m}, ${2:key})', {
    label: 'delete',
    type: 'function',
    detail: 'delete(m map[Type]Type1, key Type)',
  }),
  snippetCompletion('panic(${1:v})', { label: 'panic', type: 'function', detail: 'panic(v any)' }),
  snippetCompletion('recover()', { label: 'recover', type: 'function', detail: 'recover() any' }),
];

/**
 * fmt package completions
 */
const fmtMethods: Completion[] = [
  snippetCompletion('Println(${1:a})', { label: 'Println', type: 'method', detail: 'fmt.Println(a ...any)' }),
  snippetCompletion('Printf("${1:%v}\\n", ${2:a})', { label: 'Printf', type: 'method', detail: 'fmt.Printf(format, a...)' }),
  snippetCompletion('Sprintf("${1:%v}", ${2:a})', { label: 'Sprintf', type: 'method', detail: 'fmt.Sprintf(format, a...) string' }),
];

/**
 * sort package completions
 */
const sortMethods: Completion[] = [
  snippetCompletion('Ints(${1:x})', { label: 'Ints', type: 'method', detail: 'sort.Ints(x []int)' }),
  snippetCompletion('Strings(${1:x})', { label: 'Strings', type: 'method', detail: 'sort.Strings(x []string)' }),
  snippetCompletion('Slice(${1:x}, func(i, j int) bool {\n    return ${2:x[i] < x[j]}\n})', {
    label: 'Slice',
    type: 'method',
    detail: 'sort.Slice(x any, less func(i, j int) bool)',
  }),
];

/**
 * math package completions
 */
const mathMethods: Completion[] = [
  snippetCompletion('Max(${1:x}, ${2:y})', { label: 'Max', type: 'method', detail: 'math.Max(x, y float64) float64' }),
  snippetCompletion('Min(${1:x}, ${2:y})', { label: 'Min', type: 'method', detail: 'math.Min(x, y float64) float64' }),
  snippetCompletion('Abs(${1:x})', { label: 'Abs', type: 'method', detail: 'math.Abs(x float64) float64' }),
  { label: 'MaxInt', type: 'constant', detail: 'math.MaxInt' },
  { label: 'MinInt', type: 'constant', detail: 'math.MinInt' },
  { label: 'MaxInt32', type: 'constant', detail: 'math.MaxInt32' },
  { label: 'MinInt32', type: 'constant', detail: 'math.MinInt32' },
];

/**
 * strings package completions
 */
const stringsMethods: Completion[] = [
  snippetCompletion('Join(${1:elems}, "${2:separator}")', { label: 'Join', type: 'method', detail: 'strings.Join(elems []string, sep string) string' }),
  snippetCompletion('Split(${1:s}, "${2:separator}")', { label: 'Split', type: 'method', detail: 'strings.Split(s, sep string) []string' }),
  snippetCompletion('Contains(${1:s}, ${2:substr})', { label: 'Contains', type: 'method', detail: 'strings.Contains(s, substr string) bool' }),
  snippetCompletion('HasPrefix(${1:s}, ${2:prefix})', { label: 'HasPrefix', type: 'method', detail: 'strings.HasPrefix(s, prefix string) bool' }),
  snippetCompletion('HasSuffix(${1:s}, ${2:suffix})', { label: 'HasSuffix', type: 'method', detail: 'strings.HasSuffix(s, suffix string) bool' }),
  snippetCompletion('ToLower(${1:s})', { label: 'ToLower', type: 'method', detail: 'strings.ToLower(s string) string' }),
  snippetCompletion('ToUpper(${1:s})', { label: 'ToUpper', type: 'method', detail: 'strings.ToUpper(s string) string' }),
];

/**
 * Struct members for ListNode
 */
const listNodeMembers: Completion[] = [
  { label: 'Val', type: 'property', detail: 'int' },
  { label: 'Next', type: 'property', detail: '*ListNode' },
];

/**
 * Struct members for TreeNode
 */
const treeNodeMembers: Completion[] = [
  { label: 'Val', type: 'property', detail: 'int' },
  { label: 'Left', type: 'property', detail: '*TreeNode' },
  { label: 'Right', type: 'property', detail: '*TreeNode' },
];

/**
 * Struct members for Node (Graph)
 */
const graphNodeMembers: Completion[] = [
  { label: 'Val', type: 'property', detail: 'int' },
  { label: 'Neighbors', type: 'property', detail: '[]*Node' },
];

/**
 * Go keywords, common types, and snippets
 */
const goKeywords: Completion[] = [
  { label: 'nil', type: 'constant', detail: 'untyped nil value' },
  { label: 'true', type: 'keyword', detail: 'boolean true' },
  { label: 'false', type: 'keyword', detail: 'boolean false' },
  { label: 'int', type: 'type', detail: 'signed integer (32 or 64 bit)' },
  { label: 'int64', type: 'type', detail: '64-bit signed integer' },
  { label: 'string', type: 'type', detail: 'string type' },
  { label: 'bool', type: 'type', detail: 'boolean type' },
  { label: 'byte', type: 'type', detail: 'alias for uint8' },
  { label: 'rune', type: 'type', detail: 'alias for int32' },
  { label: 'float64', type: 'type', detail: '64-bit float' },
  { label: 'func', type: 'keyword', detail: 'function declaration' },
  { label: 'return', type: 'keyword', detail: 'return statement' },
  { label: 'var', type: 'keyword', detail: 'variable declaration' },
  { label: 'type', type: 'keyword', detail: 'type definition' },
  { label: 'struct', type: 'keyword', detail: 'struct type' },
  { label: 'range', type: 'keyword', detail: 'range iteration' },
  { label: 'for', type: 'keyword', detail: 'for loop' },
  { label: 'if', type: 'keyword', detail: 'if statement' },
  { label: 'else', type: 'keyword', detail: 'else statement' },
  { label: 'map', type: 'keyword', detail: 'hash map type' },

  // Snippets
  snippetCompletion('for ${1:i} := 0; ${1:i} < ${2:n}; ${1:i}++ {\n    ${3}\n}', {
    label: 'for',
    type: 'keyword',
    detail: 'for i := 0; i < n; i++',
  }),
  snippetCompletion('for ${1:i}, ${2:v} := range ${3:slice} {\n    ${4}\n}', {
    label: 'range',
    type: 'keyword',
    detail: 'for i, v := range slice',
  }),
  snippetCompletion('make(map[${1:string}]${2:int})', {
    label: 'make(map)',
    type: 'snippet',
    detail: 'make hash map',
  }),
  snippetCompletion('make([]${1:int}, ${2:0})', {
    label: 'make(slice)',
    type: 'snippet',
    detail: 'make slice',
  }),
];

/**
 * Autocompletion source for Go code in CodeMirror 6.
 */
export async function goCompletionSource(context: CompletionContext): Promise<CompletionResult | null> {
  const line = context.state.doc.lineAt(context.pos);
  const textBefore = line.text.slice(0, context.pos - line.from);

  // 1. Dot triggers: fmt., sort., math., strings., head., root.
  const dotMatch = textBefore.match(/([A-Za-z0-9_]+)\.([A-Za-z0-9_]*)$/);
  if (dotMatch) {
    const receiver = dotMatch[1];
    const prefix = dotMatch[2];
    const from = context.pos - prefix.length;

    if (receiver === 'fmt') {
      return { from, options: fmtMethods, validFor: /^[A-Za-z0-9_]*$/ };
    }
    if (receiver === 'sort') {
      return { from, options: sortMethods, validFor: /^[A-Za-z0-9_]*$/ };
    }
    if (receiver === 'math') {
      return { from, options: mathMethods, validFor: /^[A-Za-z0-9_]*$/ };
    }
    if (receiver === 'strings') {
      return { from, options: stringsMethods, validFor: /^[A-Za-z0-9_]*$/ };
    }

    // Node pointer/struct members
    if (/^(head|curr|prev|fast|slow|dummy|p|l1|l2)$/i.test(receiver)) {
      return { from, options: listNodeMembers, validFor: /^[A-Za-z0-9_]*$/ };
    }
    if (/^(root|node|left|right|cur|curr|p|q|sub)$/i.test(receiver)) {
      return { from, options: treeNodeMembers, validFor: /^[A-Za-z0-9_]*$/ };
    }
    if (/^(graph|adj|n|neighbor)$/i.test(receiver)) {
      return { from, options: graphNodeMembers, validFor: /^[A-Za-z0-9_]*$/ };
    }

    // Generic member suggestions
    return {
      from,
      options: [...listNodeMembers, ...treeNodeMembers, ...graphNodeMembers],
      validFor: /^[A-Za-z0-9_]*$/,
    };
  }

  // 2. Word completions
  const word = context.matchBefore(/[A-Za-z_][A-Za-z0-9_]*/);
  if (!word && !context.explicit) return null;

  const from = word ? word.from : context.pos;
  const allOptions: Completion[] = [
    ...builtinFunctions,
    ...goKeywords,
    { label: 'fmt', type: 'module', detail: 'standard I/O package' },
    { label: 'sort', type: 'module', detail: 'sorting algorithms package' },
    { label: 'math', type: 'module', detail: 'math functions package' },
    { label: 'strings', type: 'module', detail: 'strings manipulation package' },
  ];

  return {
    from,
    options: allOptions,
    validFor: /^[A-Za-z_][A-Za-z0-9_]*$/,
  };
}
