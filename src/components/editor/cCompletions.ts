import { Completion, CompletionContext, CompletionResult, snippetCompletion } from '@codemirror/autocomplete';

/**
 * Standard C Library Memory Functions
 */
const memoryFunctions: Completion[] = [
  snippetCompletion('(${1:int}*)malloc(${2:n} * sizeof(${1:int}))', {
    label: 'malloc',
    type: 'function',
    detail: 'void* malloc(size_t size)',
  }),
  snippetCompletion('(${1:int}*)calloc(${2:n}, sizeof(${1:int}))', {
    label: 'calloc',
    type: 'function',
    detail: 'void* calloc(size_t num, size_t size)',
  }),
  snippetCompletion('realloc(${1:ptr}, ${2:new_size})', {
    label: 'realloc',
    type: 'function',
    detail: 'void* realloc(void* ptr, size_t size)',
  }),
  snippetCompletion('free(${1:ptr})', {
    label: 'free',
    type: 'function',
    detail: 'void free(void* ptr)',
  }),
  snippetCompletion('sizeof(${1:type})', {
    label: 'sizeof',
    type: 'keyword',
    detail: 'sizeof(type)',
  }),
  snippetCompletion('memset(${1:ptr}, ${2:0}, sizeof(${3:type}))', {
    label: 'memset',
    type: 'function',
    detail: 'void* memset(void* ptr, int value, size_t num)',
  }),
  snippetCompletion('memcpy(${1:dest}, ${2:src}, ${3:n} * sizeof(${4:type}))', {
    label: 'memcpy',
    type: 'function',
    detail: 'void* memcpy(void* dest, const void* src, size_t num)',
  }),
  snippetCompletion('memmove(${1:dest}, ${2:src}, ${3:num})', {
    label: 'memmove',
    type: 'function',
    detail: 'void* memmove(void* dest, const void* src, size_t num)',
  }),
  snippetCompletion('memcmp(${1:ptr1}, ${2:ptr2}, ${3:num})', {
    label: 'memcmp',
    type: 'function',
    detail: 'int memcmp(const void* ptr1, const void* ptr2, size_t num)',
  }),
];

/**
 * Standard C String Functions
 */
const stringFunctions: Completion[] = [
  snippetCompletion('strlen(${1:s})', {
    label: 'strlen',
    type: 'function',
    detail: 'size_t strlen(const char* s)',
  }),
  snippetCompletion('strcmp(${1:s1}, ${2:s2})', {
    label: 'strcmp',
    type: 'function',
    detail: 'int strcmp(const char* s1, const char* s2)',
  }),
  snippetCompletion('strncmp(${1:s1}, ${2:s2}, ${3:n})', {
    label: 'strncmp',
    type: 'function',
    detail: 'int strncmp(const char* s1, const char* s2, size_t n)',
  }),
  snippetCompletion('strcpy(${1:dest}, ${2:src})', {
    label: 'strcpy',
    type: 'function',
    detail: 'char* strcpy(char* dest, const char* src)',
  }),
  snippetCompletion('strncpy(${1:dest}, ${2:src}, ${3:n})', {
    label: 'strncpy',
    type: 'function',
    detail: 'char* strncpy(char* dest, const char* src, size_t n)',
  }),
  snippetCompletion('strcat(${1:dest}, ${2:src})', {
    label: 'strcat',
    type: 'function',
    detail: 'char* strcat(char* dest, const char* src)',
  }),
  snippetCompletion('strchr(${1:s}, ${2:c})', {
    label: 'strchr',
    type: 'function',
    detail: 'char* strchr(const char* s, int c)',
  }),
  snippetCompletion('strstr(${1:haystack}, ${2:needle})', {
    label: 'strstr',
    type: 'function',
    detail: 'char* strstr(const char* haystack, const char* needle)',
  }),
  snippetCompletion('strdup(${1:s})', {
    label: 'strdup',
    type: 'function',
    detail: 'char* strdup(const char* s)',
  }),
  snippetCompletion('sprintf(${1:buffer}, "${2:%d}", ${3:val})', {
    label: 'sprintf',
    type: 'function',
    detail: 'int sprintf(char* str, const char* format, ...)',
  }),
  snippetCompletion('snprintf(${1:buffer}, ${2:sizeof(buffer)}, "${3:%d}", ${4:val})', {
    label: 'snprintf',
    type: 'function',
    detail: 'int snprintf(char* str, size_t size, const char* format, ...)',
  }),
  snippetCompletion('printf("${1:%d}\\n", ${2:val});', {
    label: 'printf',
    type: 'function',
    detail: 'int printf(const char* format, ...)',
  }),
  snippetCompletion('puts(${1:s});', {
    label: 'puts',
    type: 'function',
    detail: 'int puts(const char* s)',
  }),
];

/**
 * Standard C Sorting and Math Functions
 */
const algoFunctions: Completion[] = [
  snippetCompletion('qsort(${1:base}, ${2:n}, sizeof(${3:int}), ${4:cmp})', {
    label: 'qsort',
    type: 'function',
    detail: 'void qsort(void* base, size_t nitems, size_t size, int (*compar)(const void*, const void*))',
  }),
  snippetCompletion('bsearch(${1:&key}, ${2:base}, ${3:n}, sizeof(${4:int}), ${5:cmp})', {
    label: 'bsearch',
    type: 'function',
    detail: 'void* bsearch(const void* key, const void* base, size_t nitems, size_t size, int (*compar)(const void*, const void*))',
  }),
  snippetCompletion('abs(${1:x})', { label: 'abs', type: 'function', detail: 'int abs(int x)' }),
  snippetCompletion('fabs(${1:x})', { label: 'fabs', type: 'function', detail: 'double fabs(double x)' }),
  snippetCompletion('fmax(${1:a}, ${2:b})', { label: 'fmax', type: 'function', detail: 'double fmax(double a, double b)' }),
  snippetCompletion('fmin(${1:a}, ${2:b})', { label: 'fmin', type: 'function', detail: 'double fmin(double a, double b)' }),
  snippetCompletion('pow(${1:base}, ${2:exp})', { label: 'pow', type: 'function', detail: 'double pow(double base, double exp)' }),
  snippetCompletion('sqrt(${1:x})', { label: 'sqrt', type: 'function', detail: 'double sqrt(double x)' }),
];

/**
 * Pointer members for ListNode
 */
const listNodeMembers: Completion[] = [
  { label: 'val', type: 'property', detail: 'int' },
  { label: 'next', type: 'property', detail: 'struct ListNode*' },
];

/**
 * Pointer members for TreeNode
 */
const treeNodeMembers: Completion[] = [
  { label: 'val', type: 'property', detail: 'int' },
  { label: 'left', type: 'property', detail: 'struct TreeNode*' },
  { label: 'right', type: 'property', detail: 'struct TreeNode*' },
];

/**
 * Pointer members for Node (Graph)
 */
const graphNodeMembers: Completion[] = [
  { label: 'val', type: 'property', detail: 'int' },
  { label: 'numNeighbors', type: 'property', detail: 'int' },
  { label: 'neighbors', type: 'property', detail: 'struct Node**' },
];

/**
 * C Keywords and Common Constants
 */
const cKeywords: Completion[] = [
  { label: 'NULL', type: 'constant', detail: '((void*)0)' },
  { label: 'true', type: 'keyword', detail: '1 (stdbool.h)' },
  { label: 'false', type: 'keyword', detail: '0 (stdbool.h)' },
  { label: 'int', type: 'type', detail: '32-bit signed integer' },
  { label: 'char', type: 'type', detail: '8-bit character' },
  { label: 'bool', type: 'type', detail: 'boolean type' },
  { label: 'void', type: 'type', detail: 'void type' },
  { label: 'double', type: 'type', detail: 'double-precision float' },
  { label: 'float', type: 'type', detail: 'single-precision float' },
  { label: 'long long', type: 'type', detail: '64-bit signed integer' },
  { label: 'size_t', type: 'type', detail: 'unsigned integer type' },
  { label: 'struct', type: 'keyword', detail: 'struct keyword' },
  { label: 'typedef', type: 'keyword', detail: 'typedef keyword' },
  { label: 'return', type: 'keyword', detail: 'return statement' },
  { label: 'INT_MAX', type: 'constant', detail: '2147483647 (limits.h)' },
  { label: 'INT_MIN', type: 'constant', detail: '-2147483648 (limits.h)' },
  { label: 'LONG_MAX', type: 'constant', detail: '9223372036854775807LL' },
  { label: 'LONG_MIN', type: 'constant', detail: '-9223372036854775808LL' },

  // Snippets
  snippetCompletion('for (int ${1:i} = 0; ${1:i} < ${2:n}; ${1:i}++) {\n    ${3}\n}', {
    label: 'for',
    type: 'keyword',
    detail: 'for loop',
  }),
  snippetCompletion('while (${1:condition}) {\n    ${2}\n}', {
    label: 'while',
    type: 'keyword',
    detail: 'while loop',
  }),
  snippetCompletion('int cmp(const void* a, const void* b) {\n    return (*(int*)a - *(int*)b);\n}', {
    label: 'cmp',
    type: 'snippet',
    detail: 'qsort comparison function',
  }),
];

/**
 * Autocompletion source for C code in CodeMirror 6.
 */
export async function cCompletionSource(context: CompletionContext): Promise<CompletionResult | null> {
  const line = context.state.doc.lineAt(context.pos);
  const textBefore = line.text.slice(0, context.pos - line.from);

  // 1. Pointer arrow trigger: head->, root->, etc.
  const arrowMatch = textBefore.match(/([A-Za-z0-9_]+)->([A-Za-z0-9_]*)$/);
  if (arrowMatch) {
    const varName = arrowMatch[1];
    const prefix = arrowMatch[2];
    const from = context.pos - prefix.length;

    // Node pointer suggestions
    if (/^(head|curr|prev|fast|slow|dummy|p|l1|l2)$/i.test(varName)) {
      return {
        from,
        options: listNodeMembers,
        validFor: /^[A-Za-z0-9_]*$/,
      };
    }
    if (/^(root|node|left|right|cur|curr|p|q|sub)$/i.test(varName)) {
      return {
        from,
        options: treeNodeMembers,
        validFor: /^[A-Za-z0-9_]*$/,
      };
    }
    if (/^(graph|adj|n|neighbor)$/i.test(varName)) {
      return {
        from,
        options: graphNodeMembers,
        validFor: /^[A-Za-z0-9_]*$/,
      };
    }

    // Default to combined struct pointer members
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
    ...memoryFunctions,
    ...stringFunctions,
    ...algoFunctions,
    ...cKeywords,
  ];

  return {
    from,
    options: allOptions,
    validFor: /^[A-Za-z_][A-Za-z0-9_]*$/,
  };
}
