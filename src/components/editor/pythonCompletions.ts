import { Completion, CompletionContext, CompletionResult, snippetCompletion } from '@codemirror/autocomplete';

/**
 * Standard Python Keywords
 */
const pythonKeywords: Completion[] = [
  'def', 'class', 'return', 'if', 'elif', 'else', 'for', 'in', 'while',
  'break', 'continue', 'import', 'from', 'as', 'try', 'except', 'finally',
  'raise', 'with', 'yield', 'lambda', 'pass', 'is', 'not', 'and', 'or',
  'None', 'True', 'False', 'self', 'global', 'nonlocal', 'assert'
].map((kw) => ({ label: kw, type: 'keyword' }));

/**
 * Standard Python Built-in Functions & Types
 */
const pythonBuiltins: Completion[] = [
  snippetCompletion('len(${1:obj})', { label: 'len', type: 'function', detail: 'len(s) -> int', info: 'Return number of items in container.' }),
  snippetCompletion('range(${1:stop})', { label: 'range', type: 'function', detail: 'range(stop) -> range object' }),
  snippetCompletion('range(${1:start}, ${2:stop})', { label: 'range', type: 'function', detail: 'range(start, stop[, step])' }),
  snippetCompletion('enumerate(${1:iterable})', { label: 'enumerate', type: 'function', detail: 'enumerate(iterable) -> (index, value)' }),
  snippetCompletion('zip(${1:iter1}, ${2:iter2})', { label: 'zip', type: 'function', detail: 'zip(*iterables) -> iterator of tuples' }),
  snippetCompletion('sorted(${1:iterable})', { label: 'sorted', type: 'function', detail: 'sorted(iterable, key=None, reverse=False)' }),
  snippetCompletion('min(${1:a}, ${2:b})', { label: 'min', type: 'function', detail: 'min(arg1, arg2, *args)' }),
  snippetCompletion('max(${1:a}, ${2:b})', { label: 'max', type: 'function', detail: 'max(arg1, arg2, *args)' }),
  snippetCompletion('sum(${1:iterable})', { label: 'sum', type: 'function', detail: 'sum(iterable, start=0)' }),
  snippetCompletion('abs(${1:x})', { label: 'abs', type: 'function', detail: 'abs(number)' }),
  snippetCompletion('isinstance(${1:obj}, ${2:classinfo})', { label: 'isinstance', type: 'function', detail: 'isinstance(object, classinfo) -> bool' }),
  snippetCompletion('print(${1:val})', { label: 'print', type: 'function', detail: 'print(*values, sep=" ", end="\\n")' }),
  snippetCompletion('reversed(${1:seq})', { label: 'reversed', type: 'function', detail: 'reversed(sequence) -> reverse iterator' }),
  snippetCompletion('any(${1:iterable})', { label: 'any', type: 'function', detail: 'any(iterable) -> bool' }),
  snippetCompletion('all(${1:iterable})', { label: 'all', type: 'function', detail: 'all(iterable) -> bool' }),
  { label: 'list', type: 'type', detail: 'list([iterable])' },
  { label: 'dict', type: 'type', detail: 'dict(**kwargs)' },
  { label: 'set', type: 'type', detail: 'set([iterable])' },
  { label: 'tuple', type: 'type', detail: 'tuple([iterable])' },
  { label: 'str', type: 'type', detail: 'str(object="")' },
  { label: 'int', type: 'type', detail: 'int(x=0)' },
  { label: 'float', type: 'type', detail: 'float(x=0.0)' },
  { label: 'bool', type: 'type', detail: 'bool(x=False)' },
  { label: 'ListNode', type: 'class', detail: 'Definition for singly-linked list node' },
  { label: 'TreeNode', type: 'class', detail: 'Definition for binary tree node' },
  { label: 'Node', type: 'class', detail: 'Definition for graph / trie node' },
];

/**
 * Standard Python Snippets
 */
const pythonSnippets: Completion[] = [
  snippetCompletion('for ${1:i} in range(${2:n}):\n    ${3:pass}', {
    label: 'fori',
    type: 'snippet',
    detail: 'for i in range(n) loop',
  }),
  snippetCompletion('for ${1:item} in ${2:items}:\n    ${3:pass}', {
    label: 'foreach',
    type: 'snippet',
    detail: 'for item in items loop',
  }),
  snippetCompletion('for ${1:i}, ${2:num} in enumerate(${3:nums}):\n    ${4:pass}', {
    label: 'forenum',
    type: 'snippet',
    detail: 'for index, value in enumerate(...)',
  }),
  snippetCompletion('while ${1:left} < ${2:right}:\n    ${3:pass}', {
    label: 'while',
    type: 'snippet',
    detail: 'while condition loop',
  }),
  snippetCompletion('def ${1:helper}(self, ${2:args}):\n    ${3:pass}', {
    label: 'def',
    type: 'snippet',
    detail: 'Define helper function',
  }),
  snippetCompletion('left, right = 0, len(${1:nums}) - 1\nwhile left <= right:\n    mid = (left + right) // 2\n    ${2:pass}', {
    label: 'binsearch',
    type: 'snippet',
    detail: 'Binary search template',
  }),
];

/**
 * Dictionary methods
 */
const dictMethods: Completion[] = [
  snippetCompletion('get(${1:key}, ${2:None})', { label: 'get', type: 'method', detail: 'get(key[, default])', info: 'Return value for key if key is in dictionary, else default.' }),
  snippetCompletion('keys()', { label: 'keys', type: 'method', detail: 'keys() -> dict_keys', info: 'Return view of dictionary keys.' }),
  snippetCompletion('values()', { label: 'values', type: 'method', detail: 'values() -> dict_values', info: 'Return view of dictionary values.' }),
  snippetCompletion('items()', { label: 'items', type: 'method', detail: 'items() -> dict_items', info: 'Return view of dictionary (key, value) pairs.' }),
  snippetCompletion('pop(${1:key}, ${2:None})', { label: 'pop', type: 'method', detail: 'pop(key[, default])', info: 'Remove specified key and return corresponding value.' }),
  snippetCompletion('setdefault(${1:key}, ${2:default})', { label: 'setdefault', type: 'method', detail: 'setdefault(key[, default])', info: 'Insert key with default if not in dict.' }),
  snippetCompletion('update(${1:other})', { label: 'update', type: 'method', detail: 'update([E, ]**F)', info: 'Update dict from dict/iterable E and F.' }),
  snippetCompletion('clear()', { label: 'clear', type: 'method', detail: 'clear()', info: 'Remove all items from dictionary.' }),
  snippetCompletion('copy()', { label: 'copy', type: 'method', detail: 'copy() -> dict', info: 'Shallow copy of dictionary.' }),
];

/**
 * List methods
 */
const listMethods: Completion[] = [
  snippetCompletion('append(${1:item})', { label: 'append', type: 'method', detail: 'append(object)', info: 'Append object to end of list.' }),
  snippetCompletion('pop(${1:-1})', { label: 'pop', type: 'method', detail: 'pop([index]) -> item', info: 'Remove and return item at index (default last).' }),
  snippetCompletion('extend(${1:iterable})', { label: 'extend', type: 'method', detail: 'extend(iterable)', info: 'Extend list by appending elements from iterable.' }),
  snippetCompletion('insert(${1:index}, ${2:object})', { label: 'insert', type: 'method', detail: 'insert(index, object)', info: 'Insert object before index.' }),
  snippetCompletion('remove(${1:value})', { label: 'remove', type: 'method', detail: 'remove(value)', info: 'Remove first occurrence of value.' }),
  snippetCompletion('sort(${1:key=None}, ${2:reverse=False})', { label: 'sort', type: 'method', detail: 'sort(*, key=None, reverse=False)', info: 'Sort list in place.' }),
  snippetCompletion('reverse()', { label: 'reverse', type: 'method', detail: 'reverse()', info: 'Reverse list in place.' }),
  snippetCompletion('index(${1:value})', { label: 'index', type: 'method', detail: 'index(value, [start, [stop]])', info: 'Return first index of value.' }),
  snippetCompletion('count(${1:value})', { label: 'count', type: 'method', detail: 'count(value) -> int', info: 'Return number of occurrences of value.' }),
  snippetCompletion('clear()', { label: 'clear', type: 'method', detail: 'clear()', info: 'Remove all items from list.' }),
  snippetCompletion('copy()', { label: 'copy', type: 'method', detail: 'copy() -> list', info: 'Shallow copy of list.' }),
];

/**
 * Set methods
 */
const setMethods: Completion[] = [
  snippetCompletion('add(${1:elem})', { label: 'add', type: 'method', detail: 'add(elem)', info: 'Add element to set.' }),
  snippetCompletion('remove(${1:elem})', { label: 'remove', type: 'method', detail: 'remove(elem)', info: 'Remove element from set; raises KeyError if not present.' }),
  snippetCompletion('discard(${1:elem})', { label: 'discard', type: 'method', detail: 'discard(elem)', info: 'Remove element from set if present.' }),
  snippetCompletion('pop()', { label: 'pop', type: 'method', detail: 'pop() -> elem', info: 'Remove and return an arbitrary set element.' }),
  snippetCompletion('clear()', { label: 'clear', type: 'method', detail: 'clear()', info: 'Remove all elements from set.' }),
  snippetCompletion('union(${1:other})', { label: 'union', type: 'method', detail: 'union(*others) -> set', info: 'Return union of sets.' }),
  snippetCompletion('intersection(${1:other})', { label: 'intersection', type: 'method', detail: 'intersection(*others) -> set', info: 'Return intersection of sets.' }),
  snippetCompletion('difference(${1:other})', { label: 'difference', type: 'method', detail: 'difference(*others) -> set', info: 'Return difference of sets.' }),
];

/**
 * String methods
 */
const strMethods: Completion[] = [
  snippetCompletion('split("${1: }")', { label: 'split', type: 'method', detail: 'split(sep=None, maxsplit=-1) -> list[str]' }),
  snippetCompletion('join(${1:iterable})', { label: 'join', type: 'method', detail: 'join(iterable) -> str', info: 'Concatenate any number of strings.' }),
  snippetCompletion('strip()', { label: 'strip', type: 'method', detail: 'strip([chars]) -> str', info: 'Strip leading and trailing whitespace.' }),
  snippetCompletion('startswith(${1:prefix})', { label: 'startswith', type: 'method', detail: 'startswith(prefix[, start[, end]]) -> bool' }),
  snippetCompletion('endswith(${1:suffix})', { label: 'endswith', type: 'method', detail: 'endswith(suffix[, start[, end]]) -> bool' }),
  snippetCompletion('lower()', { label: 'lower', type: 'method', detail: 'lower() -> str' }),
  snippetCompletion('upper()', { label: 'upper', type: 'method', detail: 'upper() -> str' }),
  snippetCompletion('find(${1:sub})', { label: 'find', type: 'method', detail: 'find(sub[, start[, end]]) -> int' }),
  snippetCompletion('replace(${1:old}, ${2:new})', { label: 'replace', type: 'method', detail: 'replace(old, new[, count]) -> str' }),
  snippetCompletion('count(${1:sub})', { label: 'count', type: 'method', detail: 'count(sub[, start[, end]]) -> int' }),
  snippetCompletion('isdigit()', { label: 'isdigit', type: 'method', detail: 'isdigit() -> bool' }),
  snippetCompletion('isalpha()', { label: 'isalpha', type: 'method', detail: 'isalpha() -> bool' }),
  snippetCompletion('isalnum()', { label: 'isalnum', type: 'method', detail: 'isalnum() -> bool' }),
  snippetCompletion('isspace()', { label: 'isspace', type: 'method', detail: 'isspace() -> bool' }),
];

/**
 * ListNode members
 */
const listNodeMembers: Completion[] = [
  { label: 'val', type: 'property', detail: 'int' },
  { label: 'next', type: 'property', detail: 'Optional[ListNode]' },
];

/**
 * TreeNode members
 */
const treeNodeMembers: Completion[] = [
  { label: 'val', type: 'property', detail: 'int' },
  { label: 'left', type: 'property', detail: 'Optional[TreeNode]' },
  { label: 'right', type: 'property', detail: 'Optional[TreeNode]' },
];

/**
 * Node (Graph / Trie) members
 */
const graphNodeMembers: Completion[] = [
  { label: 'val', type: 'property', detail: 'int' },
  { label: 'neighbors', type: 'property', detail: 'List[Node]' },
];

/**
 * Heapq module functions
 */
const heapqMembers: Completion[] = [
  snippetCompletion('heappush(${1:heap}, ${2:item})', { label: 'heappush', type: 'function', detail: 'heappush(heap, item)' }),
  snippetCompletion('heappop(${1:heap})', { label: 'heappop', type: 'function', detail: 'heappop(heap) -> item' }),
  snippetCompletion('heappushpop(${1:heap}, ${2:item})', { label: 'heappushpop', type: 'function', detail: 'heappushpop(heap, item)' }),
  snippetCompletion('heapify(${1:x})', { label: 'heapify', type: 'function', detail: 'heapify(x)' }),
  snippetCompletion('heapreplace(${1:heap}, ${2:item})', { label: 'heapreplace', type: 'function', detail: 'heapreplace(heap, item)' }),
  snippetCompletion('nlargest(${1:n}, ${2:iterable})', { label: 'nlargest', type: 'function', detail: 'nlargest(n, iterable[, key])' }),
  snippetCompletion('nsmallest(${1:n}, ${2:iterable})', { label: 'nsmallest', type: 'function', detail: 'nsmallest(n, iterable[, key])' }),
];

/**
 * Collections module functions / types
 */
const collectionsMembers: Completion[] = [
  snippetCompletion('defaultdict(${1:list})', { label: 'defaultdict', type: 'class', detail: 'defaultdict(default_factory)' }),
  snippetCompletion('Counter(${1:iterable})', { label: 'Counter', type: 'class', detail: 'Counter([iterable-or-mapping])' }),
  snippetCompletion('deque(${1:iterable})', { label: 'deque', type: 'class', detail: 'deque([iterable[, maxlen]])' }),
  snippetCompletion('OrderedDict()', { label: 'OrderedDict', type: 'class', detail: 'OrderedDict()' }),
];

/**
 * Math module members
 */
const mathMembers: Completion[] = [
  snippetCompletion('sqrt(${1:x})', { label: 'sqrt', type: 'function', detail: 'sqrt(x)' }),
  snippetCompletion('floor(${1:x})', { label: 'floor', type: 'function', detail: 'floor(x)' }),
  snippetCompletion('ceil(${1:x})', { label: 'ceil', type: 'function', detail: 'ceil(x)' }),
  snippetCompletion('gcd(${1:a}, ${2:b})', { label: 'gcd', type: 'function', detail: 'gcd(*integers)' }),
  snippetCompletion('comb(${1:n}, ${2:k})', { label: 'comb', type: 'function', detail: 'comb(n, k)' }),
  snippetCompletion('isqrt(${1:n})', { label: 'isqrt', type: 'function', detail: 'isqrt(n)' }),
  { label: 'inf', type: 'constant', detail: 'float("inf")' },
  { label: 'pi', type: 'constant', detail: '3.141592653589793' },
  { label: 'e', type: 'constant', detail: '2.718281828459045' },
];

/**
 * Map variable name / object expression to completion members
 */
function getPythonMemberCompletions(objectName: string, _docText: string): Completion[] {
  const lower = objectName.toLowerCase();

  // 1. Modules
  if (lower === 'heapq') return heapqMembers;
  if (lower === 'collections') return collectionsMembers;
  if (lower === 'math') return mathMembers;

  // 2. Name and assignment heuristics
  if (
    lower.includes('map') ||
    lower.includes('dict') ||
    lower === 'd' ||
    lower === 'hm' ||
    lower.includes('counts') ||
    lower.includes('memo') ||
    lower.includes('freq')
  ) {
    return dictMethods;
  }

  if (
    lower.includes('list') ||
    lower.includes('arr') ||
    lower.includes('nums') ||
    lower === 'res' ||
    lower === 'ans' ||
    lower === 'stack' ||
    lower === 'q' ||
    lower === 'queue' ||
    lower === 'row' ||
    lower === 'col' ||
    lower === 'matrix'
  ) {
    return listMethods;
  }

  if (lower.includes('set') || lower.includes('seen') || lower.includes('visited')) {
    return setMethods;
  }

  if (lower === 's' || lower.includes('str') || lower.includes('word') || lower === 'text') {
    return strMethods;
  }

  if (lower === 'head' || lower === 'curr' || lower === 'prev' || lower === 'fast' || lower === 'slow' || lower === 'dummy' || lower === 'listnode') {
    return listNodeMembers;
  }

  if (lower === 'root' || lower === 'tree' || lower === 'treenode' || lower === 'p' || lower === 'q') {
    return treeNodeMembers;
  }

  if (lower.includes('graph') || lower.includes('clone') || lower.includes('neighbor') || lower === 'node') {
    return graphNodeMembers;
  }

  // Fallback: provide combined list + dict + string methods
  return [
    ...dictMethods,
    ...listMethods.filter((lm) => !dictMethods.some((dm) => dm.label === lm.label)),
    ...strMethods.filter((sm) => !dictMethods.some((dm) => dm.label === sm.label)),
  ];
}

/**
 * Autocompletion source for Python solutions in CodeMirror
 */
export async function pythonCompletionSource(context: CompletionContext): Promise<CompletionResult | null> {
  // 1. Dot-member access: e.g. "map." or "nums.ap" or "heapq.he"
  const dotMatch = context.matchBefore(/([A-Za-z_][A-Za-z0-9_]*)\.([A-Za-z0-9_]*)$/);
  if (dotMatch) {
    const parts = dotMatch.text.split('.');
    const objectName = parts[0];
    const prefix = parts[1] || '';
    const from = context.pos - prefix.length;
    const docText = context.state.doc.toString();
    const options = getPythonMemberCompletions(objectName, docText);

    return {
      from,
      options,
      validFor: /^[A-Za-z0-9_]*$/,
    };
  }

  // 2. Regular identifier completion
  const word = context.matchBefore(/[A-Za-z0-9_$]+/);
  if (!word || (word.from === word.to && !context.explicit)) {
    return null;
  }

  // Extract local identifiers from document
  const docText = context.state.doc.toString();
  const identifierRegex = /[A-Za-z_][A-Za-z0-9_]{1,}/g;
  const localWords = new Set<string>();
  let m: RegExpExecArray | null;

  while ((m = identifierRegex.exec(docText)) !== null) {
    localWords.add(m[0]);
  }

  const baseCompletions = [
    ...pythonKeywords,
    ...pythonBuiltins,
    ...pythonSnippets,
    ...listMethods,
    ...dictMethods,
    ...strMethods,
  ];

  const knownLabels = new Set(baseCompletions.map((c) => c.label));
  const localCompletions: Completion[] = [];

  for (const id of localWords) {
    if (!knownLabels.has(id)) {
      localCompletions.push({
        label: id,
        type: 'variable',
        detail: 'Local symbol',
      });
    }
  }

  return {
    from: word.from,
    options: [...baseCompletions, ...localCompletions],
    validFor: /^[A-Za-z0-9_$]*$/,
  };
}
