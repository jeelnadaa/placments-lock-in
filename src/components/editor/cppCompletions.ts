import { Completion, CompletionContext, CompletionResult, snippetCompletion } from '@codemirror/autocomplete';

/**
 * Standard vector methods
 */
const vectorMethods: Completion[] = [
  snippetCompletion('push_back(${1:val})', { label: 'push_back', type: 'method', detail: 'push_back(const T& val)' }),
  snippetCompletion('pop_back()', { label: 'pop_back', type: 'method', detail: 'pop_back()' }),
  snippetCompletion('size()', { label: 'size', type: 'method', detail: 'size() -> size_t' }),
  snippetCompletion('empty()', { label: 'empty', type: 'method', detail: 'empty() -> bool' }),
  snippetCompletion('begin()', { label: 'begin', type: 'method', detail: 'begin() -> iterator' }),
  snippetCompletion('end()', { label: 'end', type: 'method', detail: 'end() -> iterator' }),
  snippetCompletion('back()', { label: 'back', type: 'method', detail: 'back() -> T&' }),
  snippetCompletion('front()', { label: 'front', type: 'method', detail: 'front() -> T&' }),
  snippetCompletion('clear()', { label: 'clear', type: 'method', detail: 'clear()' }),
  snippetCompletion('resize(${1:n})', { label: 'resize', type: 'method', detail: 'resize(size_t n)' }),
  snippetCompletion('insert(${1:pos}, ${2:val})', { label: 'insert', type: 'method', detail: 'insert(pos, val)' }),
  snippetCompletion('erase(${1:pos})', { label: 'erase', type: 'method', detail: 'erase(pos)' }),
];

/**
 * Standard unordered_map methods
 */
const mapMethods: Completion[] = [
  snippetCompletion('find(${1:key})', { label: 'find', type: 'method', detail: 'find(key) -> iterator' }),
  snippetCompletion('count(${1:key})', { label: 'count', type: 'method', detail: 'count(key) -> size_t' }),
  snippetCompletion('insert({${1:key}, ${2:val}})', { label: 'insert', type: 'method', detail: 'insert({key, val})' }),
  snippetCompletion('emplace(${1:key}, ${2:val})', { label: 'emplace', type: 'method', detail: 'emplace(key, val)' }),
  snippetCompletion('erase(${1:key})', { label: 'erase', type: 'method', detail: 'erase(key)' }),
  snippetCompletion('size()', { label: 'size', type: 'method', detail: 'size() -> size_t' }),
  snippetCompletion('empty()', { label: 'empty', type: 'method', detail: 'empty() -> bool' }),
  snippetCompletion('begin()', { label: 'begin', type: 'method', detail: 'begin()' }),
  snippetCompletion('end()', { label: 'end', type: 'method', detail: 'end()' }),
  snippetCompletion('clear()', { label: 'clear', type: 'method', detail: 'clear()' }),
];

/**
 * Standard unordered_set methods
 */
const setMethods: Completion[] = [
  snippetCompletion('insert(${1:val})', { label: 'insert', type: 'method', detail: 'insert(val)' }),
  snippetCompletion('emplace(${1:val})', { label: 'emplace', type: 'method', detail: 'emplace(val)' }),
  snippetCompletion('find(${1:val})', { label: 'find', type: 'method', detail: 'find(val) -> iterator' }),
  snippetCompletion('count(${1:val})', { label: 'count', type: 'method', detail: 'count(val) -> size_t' }),
  snippetCompletion('erase(${1:val})', { label: 'erase', type: 'method', detail: 'erase(val)' }),
  snippetCompletion('size()', { label: 'size', type: 'method', detail: 'size() -> size_t' }),
  snippetCompletion('empty()', { label: 'empty', type: 'method', detail: 'empty() -> bool' }),
  snippetCompletion('clear()', { label: 'clear', type: 'method', detail: 'clear()' }),
];

/**
 * Queue / Priority Queue methods
 */
const queueMethods: Completion[] = [
  snippetCompletion('push(${1:val})', { label: 'push', type: 'method', detail: 'push(val)' }),
  snippetCompletion('pop()', { label: 'pop', type: 'method', detail: 'pop()' }),
  snippetCompletion('top()', { label: 'top', type: 'method', detail: 'top() -> const T&' }),
  snippetCompletion('front()', { label: 'front', type: 'method', detail: 'front() -> T&' }),
  snippetCompletion('empty()', { label: 'empty', type: 'method', detail: 'empty() -> bool' }),
  snippetCompletion('size()', { label: 'size', type: 'method', detail: 'size() -> size_t' }),
  snippetCompletion('emplace(${1:val})', { label: 'emplace', type: 'method', detail: 'emplace(val)' }),
];

/**
 * Stack methods
 */
const stackMethods: Completion[] = [
  snippetCompletion('push(${1:val})', { label: 'push', type: 'method', detail: 'push(val)' }),
  snippetCompletion('pop()', { label: 'pop', type: 'method', detail: 'pop()' }),
  snippetCompletion('top()', { label: 'top', type: 'method', detail: 'top() -> T&' }),
  snippetCompletion('empty()', { label: 'empty', type: 'method', detail: 'empty() -> bool' }),
  snippetCompletion('size()', { label: 'size', type: 'method', detail: 'size() -> size_t' }),
  snippetCompletion('emplace(${1:val})', { label: 'emplace', type: 'method', detail: 'emplace(val)' }),
];

/**
 * String methods
 */
const stringMethods: Completion[] = [
  snippetCompletion('length()', { label: 'length', type: 'method', detail: 'length() -> size_t' }),
  snippetCompletion('size()', { label: 'size', type: 'method', detail: 'size() -> size_t' }),
  snippetCompletion('substr(${1:pos}, ${2:len})', { label: 'substr', type: 'method', detail: 'substr(pos, count) -> string' }),
  snippetCompletion('find(${1:str})', { label: 'find', type: 'method', detail: 'find(str) -> size_t' }),
  snippetCompletion('push_back(${1:ch})', { label: 'push_back', type: 'method', detail: 'push_back(ch)' }),
  snippetCompletion('pop_back()', { label: 'pop_back', type: 'method', detail: 'pop_back()' }),
  snippetCompletion('empty()', { label: 'empty', type: 'method', detail: 'empty() -> bool' }),
  snippetCompletion('c_str()', { label: 'c_str', type: 'method', detail: 'c_str() -> const char*' }),
  snippetCompletion('back()', { label: 'back', type: 'method', detail: 'back() -> char&' }),
  snippetCompletion('front()', { label: 'front', type: 'method', detail: 'front() -> char&' }),
];

/**
 * Pointer members for ListNode
 */
const listNodeMembers: Completion[] = [
  { label: 'val', type: 'property', detail: 'int' },
  { label: 'next', type: 'property', detail: 'ListNode*' },
];

/**
 * Pointer members for TreeNode
 */
const treeNodeMembers: Completion[] = [
  { label: 'val', type: 'property', detail: 'int' },
  { label: 'left', type: 'property', detail: 'TreeNode*' },
  { label: 'right', type: 'property', detail: 'TreeNode*' },
];

/**
 * Pointer members for Node (Graph)
 */
const graphNodeMembers: Completion[] = [
  { label: 'val', type: 'property', detail: 'int' },
  { label: 'neighbors', type: 'property', detail: 'vector<Node*>' },
];

/**
 * Global std algorithms and functions
 */
const stdMembers: Completion[] = [
  snippetCompletion('sort(${1:begin}, ${2:end})', { label: 'sort', type: 'function', detail: 'std::sort(begin, end)' }),
  snippetCompletion('reverse(${1:begin}, ${2:end})', { label: 'reverse', type: 'function', detail: 'std::reverse(begin, end)' }),
  snippetCompletion('max(${1:a}, ${2:b})', { label: 'max', type: 'function', detail: 'std::max(a, b)' }),
  snippetCompletion('min(${1:a}, ${2:b})', { label: 'min', type: 'function', detail: 'std::min(a, b)' }),
  snippetCompletion('swap(${1:a}, ${2:b})', { label: 'swap', type: 'function', detail: 'std::swap(a, b)' }),
  snippetCompletion('lower_bound(${1:begin}, ${2:end}, ${3:val})', { label: 'lower_bound', type: 'function', detail: 'std::lower_bound(begin, end, val)' }),
  snippetCompletion('upper_bound(${1:begin}, ${2:end}, ${3:val})', { label: 'upper_bound', type: 'function', detail: 'std::upper_bound(begin, end, val)' }),
  snippetCompletion('fill(${1:begin}, ${2:end}, ${3:val})', { label: 'fill', type: 'function', detail: 'std::fill(begin, end, val)' }),
  snippetCompletion('accumulate(${1:begin}, ${2:end}, ${3:init})', { label: 'accumulate', type: 'function', detail: 'std::accumulate(begin, end, init)' }),
];

/**
 * Global keywords and LeetCode C++ idioms
 */
const globalCppCompletions: Completion[] = [
  { label: 'auto', type: 'keyword' },
  { label: 'nullptr', type: 'constant' },
  { label: 'INT_MAX', type: 'constant', detail: '2147483647' },
  { label: 'INT_MIN', type: 'constant', detail: '-2147483648' },
  { label: 'vector', type: 'class', detail: 'vector<T>' },
  { label: 'unordered_map', type: 'class', detail: 'unordered_map<K, V>' },
  { label: 'unordered_set', type: 'class', detail: 'unordered_set<T>' },
  { label: 'priority_queue', type: 'class', detail: 'priority_queue<T>' },
  { label: 'pair', type: 'class', detail: 'pair<T1, T2>' },
  { label: 'string', type: 'class', detail: 'std::string' },
  { label: 'ListNode', type: 'class' },
  { label: 'TreeNode', type: 'class' },
  { label: 'const', type: 'keyword' },
  { label: 'return', type: 'keyword' },
  snippetCompletion('for (int ${1:i} = 0; ${1:i} < ${2:n}; ++${1:i}) {\n    ${3}\n}', { label: 'fori', type: 'snippet', detail: 'Standard for loop' }),
  snippetCompletion('for (const auto& ${1:item} : ${2:container}) {\n    ${3}\n}', { label: 'forin', type: 'snippet', detail: 'Range-based for loop' }),
  snippetCompletion('priority_queue<int, vector<int>, greater<int>> minHeap;', { label: 'minHeap', type: 'snippet', detail: 'Min heap in C++' }),
];

function getCppMemberCompletions(objName: string, isArrow: boolean): Completion[] {
  const lower = objName.toLowerCase();

  if (isArrow) {
    if (lower === 'root' || lower.includes('tree') || lower === 'p' || lower === 'q') {
      return treeNodeMembers;
    }
    if (lower === 'head' || lower === 'curr' || lower === 'prev' || lower === 'slow' || lower === 'fast' || lower === 'dummy' || lower === 'list') {
      return listNodeMembers;
    }
    if (lower.includes('graph') || lower.includes('clone') || lower.includes('neighbor') || lower === 'node') {
      return graphNodeMembers;
    }
    return [...treeNodeMembers, ...listNodeMembers];
  }

  // Dot access
  if (lower === 'std') {
    return stdMembers;
  }

  if (lower.includes('map') || lower.includes('counts') || lower.includes('freq') || lower.includes('memo') || lower === 'd' || lower === 'mp') {
    return mapMethods;
  }

  if (lower.includes('set') || lower.includes('seen') || lower.includes('visited')) {
    return setMethods;
  }

  if (lower.includes('pq') || lower.includes('heap') || lower === 'q' || lower.includes('queue')) {
    return queueMethods;
  }

  if (lower.includes('st') || lower.includes('stack')) {
    return stackMethods;
  }

  if (lower === 's' || lower.includes('str') || lower.includes('word') || lower === 'text') {
    return stringMethods;
  }

  if (lower.includes('vec') || lower.includes('nums') || lower.includes('arr') || lower === 'res' || lower === 'ans' || lower === 'row' || lower === 'col' || lower === 'matrix') {
    return vectorMethods;
  }

  // Fallback: common STL container methods
  return [...vectorMethods, ...mapMethods.filter((m) => !vectorMethods.some((v) => v.label === m.label))];
}

export async function cppCompletionSource(context: CompletionContext): Promise<CompletionResult | null> {
  // 1. Check for '->' pointer member trigger
  const arrowMatch = context.matchBefore(/[A-Za-z_][A-Za-z0-9_]*->[A-Za-z0-9_]*/);
  if (arrowMatch) {
    const parts = arrowMatch.text.split('->');
    const objectName = parts[0];
    const prefix = parts[1] || '';
    const startPos = arrowMatch.to - prefix.length;
    return {
      from: startPos,
      options: getCppMemberCompletions(objectName, true),
      validFor: /^[A-Za-z0-9_]*$/,
    };
  }

  // 2. Check for '::' scope resolution trigger (e.g. std::)
  const scopeMatch = context.matchBefore(/[A-Za-z_][A-Za-z0-9_]*::[A-Za-z0-9_]*/);
  if (scopeMatch) {
    const parts = scopeMatch.text.split('::');
    const scopeName = parts[0];
    const prefix = parts[1] || '';
    const startPos = scopeMatch.to - prefix.length;
    if (scopeName === 'std') {
      return {
        from: startPos,
        options: stdMembers,
        validFor: /^[A-Za-z0-9_]*$/,
      };
    }
  }

  // 3. Check for '.' dot member trigger
  const dotMatch = context.matchBefore(/[A-Za-z_][A-Za-z0-9_]*\.[A-Za-z0-9_]*/);
  if (dotMatch) {
    const parts = dotMatch.text.split('.');
    const objectName = parts[0];
    const prefix = parts[1] || '';
    const startPos = dotMatch.to - prefix.length;
    return {
      from: startPos,
      options: getCppMemberCompletions(objectName, false),
      validFor: /^[A-Za-z0-9_]*$/,
    };
  }

  // 4. Standard word completion
  const word = context.matchBefore(/\w+/);
  if (!word && !context.explicit) return null;

  return {
    from: word ? word.from : context.pos,
    options: [...globalCppCompletions, ...stdMembers],
  };
}
