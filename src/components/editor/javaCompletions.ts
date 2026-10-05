import { Completion, CompletionContext, CompletionResult, snippetCompletion } from '@codemirror/autocomplete';

const standardJavaCompletions: Completion[] = [
  // Common Classes
  { label: 'List', type: 'class', detail: 'java.util.List<E>' },
  { label: 'ArrayList', type: 'class', detail: 'java.util.ArrayList<E>' },
  { label: 'LinkedList', type: 'class', detail: 'java.util.LinkedList<E>' },
  { label: 'Map', type: 'class', detail: 'java.util.Map<K, V>' },
  { label: 'HashMap', type: 'class', detail: 'java.util.HashMap<K, V>' },
  { label: 'TreeMap', type: 'class', detail: 'java.util.TreeMap<K, V>' },
  { label: 'Set', type: 'class', detail: 'java.util.Set<E>' },
  { label: 'HashSet', type: 'class', detail: 'java.util.HashSet<E>' },
  { label: 'TreeSet', type: 'class', detail: 'java.util.TreeSet<E>' },
  { label: 'Queue', type: 'class', detail: 'java.util.Queue<E>' },
  { label: 'Deque', type: 'class', detail: 'java.util.Deque<E>' },
  { label: 'ArrayDeque', type: 'class', detail: 'java.util.ArrayDeque<E>' },
  { label: 'PriorityQueue', type: 'class', detail: 'java.util.PriorityQueue<E>' },
  { label: 'Stack', type: 'class', detail: 'java.util.Stack<E>' },
  { label: 'Arrays', type: 'class', detail: 'java.util.Arrays' },
  { label: 'Collections', type: 'class', detail: 'java.util.Collections' },
  { label: 'Math', type: 'class', detail: 'java.lang.Math' },
  { label: 'String', type: 'class', detail: 'java.lang.String' },
  { label: 'StringBuilder', type: 'class', detail: 'java.lang.StringBuilder' },
  { label: 'Integer', type: 'class', detail: 'java.lang.Integer' },
  { label: 'Character', type: 'class', detail: 'java.lang.Character' },
  { label: 'Boolean', type: 'class', detail: 'java.lang.Boolean' },
  { label: 'Long', type: 'class', detail: 'java.lang.Long' },
  { label: 'Double', type: 'class', detail: 'java.lang.Double' },
  { label: 'ListNode', type: 'class', detail: 'Definition for singly-linked list' },
  { label: 'TreeNode', type: 'class', detail: 'Definition for binary tree node' },
  { label: 'Node', type: 'class', detail: 'Definition for graph / trie / n-ary node' },

  // Primitive Keywords
  { label: 'int', type: 'keyword' },
  { label: 'boolean', type: 'keyword' },
  { label: 'char', type: 'keyword' },
  { label: 'long', type: 'keyword' },
  { label: 'double', type: 'keyword' },
  { label: 'void', type: 'keyword' },
  { label: 'class', type: 'keyword' },
  { label: 'public', type: 'keyword' },
  { label: 'private', type: 'keyword' },
  { label: 'protected', type: 'keyword' },
  { label: 'static', type: 'keyword' },
  { label: 'final', type: 'keyword' },
  { label: 'return', type: 'keyword' },
  { label: 'new', type: 'keyword' },
  { label: 'if', type: 'keyword' },
  { label: 'else', type: 'keyword' },
  { label: 'for', type: 'keyword' },
  { label: 'while', type: 'keyword' },
  { label: 'break', type: 'keyword' },
  { label: 'continue', type: 'keyword' },
  { label: 'switch', type: 'keyword' },
  { label: 'case', type: 'keyword' },
  { label: 'default', type: 'keyword' },
  { label: 'try', type: 'keyword' },
  { label: 'catch', type: 'keyword' },
  { label: 'finally', type: 'keyword' },
  { label: 'throw', type: 'keyword' },
  { label: 'throws', type: 'keyword' },
  { label: 'null', type: 'keyword' },
  { label: 'true', type: 'keyword' },
  { label: 'false', type: 'keyword' },
  { label: 'this', type: 'keyword' },

  // Commonly Used Methods
  { label: 'length()', type: 'method', detail: 'int length()' },
  { label: 'charAt', type: 'method', detail: 'char charAt(int index)', apply: 'charAt(${1:index})' },
  { label: 'substring', type: 'method', detail: 'String substring(int beginIndex, int endIndex)', apply: 'substring(${1:begin}, ${2:end})' },
  { label: 'toLowerCase()', type: 'method', detail: 'String toLowerCase()' },
  { label: 'toUpperCase()', type: 'method', detail: 'String toUpperCase()' },
  { label: 'toCharArray()', type: 'method', detail: 'char[] toCharArray()' },
  { label: 'split', type: 'method', detail: 'String[] split(String regex)', apply: 'split("${1:regex}")' },
  { label: 'trim()', type: 'method', detail: 'String trim()' },
  { label: 'equals', type: 'method', detail: 'boolean equals(Object anObject)', apply: 'equals(${1:obj})' },
  { label: 'equalsIgnoreCase', type: 'method', detail: 'boolean equalsIgnoreCase(String another)', apply: 'equalsIgnoreCase(${1:str})' },
  { label: 'contains', type: 'method', detail: 'boolean contains(CharSequence s)', apply: 'contains(${1:s})' },
  { label: 'isEmpty()', type: 'method', detail: 'boolean isEmpty()' },
  { label: 'indexOf', type: 'method', detail: 'int indexOf(String str)', apply: 'indexOf(${1:str})' },
  { label: 'lastIndexOf', type: 'method', detail: 'int lastIndexOf(String str)', apply: 'lastIndexOf(${1:str})' },
  { label: 'replace', type: 'method', detail: 'String replace(char oldChar, char newChar)', apply: 'replace(${1:oldChar}, ${2:newChar})' },

  // List / Collection Methods
  { label: 'add', type: 'method', detail: 'boolean add(E e)', apply: 'add(${1:item})' },
  { label: 'get', type: 'method', detail: 'E get(int index)', apply: 'get(${1:index})' },
  { label: 'set', type: 'method', detail: 'E set(int index, E element)', apply: 'set(${1:index}, ${2:val})' },
  { label: 'remove', type: 'method', detail: 'E remove(int index / Object o)', apply: 'remove(${1:key})' },
  { label: 'size()', type: 'method', detail: 'int size()' },
  { label: 'clear()', type: 'method', detail: 'void clear()' },
  { label: 'addAll', type: 'method', detail: 'boolean addAll(Collection<? extends E> c)', apply: 'addAll(${1:c})' },
  { label: 'toArray()', type: 'method', detail: 'Object[] toArray()' },

  // Map Methods
  { label: 'put', type: 'method', detail: 'V put(K key, V value)', apply: 'put(${1:key}, ${2:val})' },
  { label: 'getOrDefault', type: 'method', detail: 'V getOrDefault(Object key, V defaultValue)', apply: 'getOrDefault(${1:key}, ${2:0})' },
  { label: 'containsKey', type: 'method', detail: 'boolean containsKey(Object key)', apply: 'containsKey(${1:key})' },
  { label: 'containsValue', type: 'method', detail: 'boolean containsValue(Object value)', apply: 'containsValue(${1:val})' },
  { label: 'keySet()', type: 'method', detail: 'Set<K> keySet()' },
  { label: 'values()', type: 'method', detail: 'Collection<V> values()' },
  { label: 'entrySet()', type: 'method', detail: 'Set<Map.Entry<K, V>> entrySet()' },
  { label: 'putIfAbsent', type: 'method', detail: 'V putIfAbsent(K key, V value)', apply: 'putIfAbsent(${1:key}, ${2:val})' },

  // Queue / Deque / Stack Methods
  { label: 'offer', type: 'method', detail: 'boolean offer(E e)', apply: 'offer(${1:item})' },
  { label: 'poll()', type: 'method', detail: 'E poll()' },
  { label: 'peek()', type: 'method', detail: 'E peek()' },
  { label: 'push', type: 'method', detail: 'void push(E e)', apply: 'push(${1:item})' },
  { label: 'pop()', type: 'method', detail: 'E pop()' },

  // StringBuilder Methods
  { label: 'append', type: 'method', detail: 'StringBuilder append(Object obj)', apply: 'append(${1:obj})' },
  { label: 'reverse()', type: 'method', detail: 'StringBuilder reverse()' },
  { label: 'toString()', type: 'method', detail: 'String toString()' },

  // Math Methods
  { label: 'Math.max', type: 'method', detail: 'Math.max(a, b)', apply: 'Math.max(${1:a}, ${2:b})' },
  { label: 'Math.min', type: 'method', detail: 'Math.min(a, b)', apply: 'Math.min(${1:a}, ${2:b})' },
  { label: 'Math.abs', type: 'method', detail: 'Math.abs(x)', apply: 'Math.abs(${1:x})' },
  { label: 'Math.pow', type: 'method', detail: 'Math.pow(a, b)', apply: 'Math.pow(${1:a}, ${2:b})' },
  { label: 'Math.sqrt', type: 'method', detail: 'Math.sqrt(x)', apply: 'Math.sqrt(${1:x})' },
  { label: 'Math.floor', type: 'method', detail: 'Math.floor(x)', apply: 'Math.floor(${1:x})' },
  { label: 'Math.ceil', type: 'method', detail: 'Math.ceil(x)', apply: 'Math.ceil(${1:x})' },

  // Arrays & Collections Methods
  { label: 'Arrays.sort', type: 'method', detail: 'Arrays.sort(arr)', apply: 'Arrays.sort(${1:arr});' },
  { label: 'Arrays.fill', type: 'method', detail: 'Arrays.fill(arr, val)', apply: 'Arrays.fill(${1:arr}, ${2:val});' },
  { label: 'Arrays.binarySearch', type: 'method', detail: 'Arrays.binarySearch(arr, key)', apply: 'Arrays.binarySearch(${1:arr}, ${2:key})' },
  { label: 'Arrays.copyOf', type: 'method', detail: 'Arrays.copyOf(arr, length)', apply: 'Arrays.copyOf(${1:arr}, ${2:length})' },
  { label: 'Arrays.toString', type: 'method', detail: 'Arrays.toString(arr)', apply: 'Arrays.toString(${1:arr})' },
  { label: 'Collections.sort', type: 'method', detail: 'Collections.sort(list)', apply: 'Collections.sort(${1:list});' },
  { label: 'Collections.reverse', type: 'method', detail: 'Collections.reverse(list)', apply: 'Collections.reverse(${1:list});' },
  { label: 'Collections.max', type: 'method', detail: 'Collections.max(coll)', apply: 'Collections.max(${1:coll})' },
  { label: 'Collections.min', type: 'method', detail: 'Collections.min(coll)', apply: 'Collections.min(${1:coll})' },

  // Numbers & Parsing
  { label: 'Integer.parseInt', type: 'method', detail: 'Integer.parseInt(s)', apply: 'Integer.parseInt(${1:s})' },
  { label: 'Integer.valueOf', type: 'method', detail: 'Integer.valueOf(s)', apply: 'Integer.valueOf(${1:s})' },
  { label: 'Integer.MAX_VALUE', type: 'constant', detail: '2,147,483,647' },
  { label: 'Integer.MIN_VALUE', type: 'constant', detail: '-2,147,483,648' },
  { label: 'Long.MAX_VALUE', type: 'constant', detail: '9,223,372,036,854,775,807' },
  { label: 'Character.isDigit', type: 'method', detail: 'Character.isDigit(c)', apply: 'Character.isDigit(${1:c})' },
  { label: 'Character.isLetter', type: 'method', detail: 'Character.isLetter(c)', apply: 'Character.isLetter(${1:c})' },
  { label: 'Character.isLetterOrDigit', type: 'method', detail: 'Character.isLetterOrDigit(c)', apply: 'Character.isLetterOrDigit(${1:c})' },
  { label: 'Character.toLowerCase', type: 'method', detail: 'Character.toLowerCase(c)', apply: 'Character.toLowerCase(${1:c})' },

  // Snippets
  snippetCompletion('for (int ${1:i} = 0; ${1:i} < ${2:n}; ${1:i}++) {\n    ${3}\n}', {
    label: 'fori',
    detail: 'Standard indexed for-loop',
    type: 'snippet',
  }),
  snippetCompletion('for (${1:int} ${2:num} : ${3:nums}) {\n    ${4}\n}', {
    label: 'foreach',
    detail: 'Enhanced for-each loop',
    type: 'snippet',
  }),
  snippetCompletion('System.out.println(${1});', {
    label: 'sout',
    detail: 'System.out.println()',
    type: 'snippet',
  }),
  snippetCompletion('Map<${1:Integer}, ${2:Integer}> map = new HashMap<>();', {
    label: 'newmap',
    detail: 'Map<K, V> map = new HashMap<>()',
    type: 'snippet',
  }),
  snippetCompletion('List<${1:Integer}> list = new ArrayList<>();', {
    label: 'newlist',
    detail: 'List<T> list = new ArrayList<>()',
    type: 'snippet',
  }),
  snippetCompletion('Set<${1:Integer}> set = new HashSet<>();', {
    label: 'newset',
    detail: 'Set<T> set = new HashSet<>()',
    type: 'snippet',
  }),
  snippetCompletion('PriorityQueue<${1:Integer}> pq = new PriorityQueue<>();', {
    label: 'newpq',
    detail: 'PriorityQueue<T> min-heap',
    type: 'snippet',
  }),
];

/**
 * Autocompletion source combining standard Java library, common snippets,
 * and dynamic identifiers parsed from the active document.
 */
export function javaCompletionSource(context: CompletionContext): CompletionResult | null {
  const word = context.matchBefore(/[A-Za-z0-9_$.]*/);
  if (!word || (word.from === word.to && !context.explicit)) {
    return null;
  }

  // Extract local identifiers from current editor text
  const docText = context.state.doc.toString();
  const identifierRegex = /[A-Za-z_][A-Za-z0-9_]{2,}/g;
  const localWords = new Set<string>();
  let m: RegExpExecArray | null;

  while ((m = identifierRegex.exec(docText)) !== null) {
    localWords.add(m[0]);
  }

  const localCompletions: Completion[] = [];
  const knownLabels = new Set(standardJavaCompletions.map((c) => c.label));

  for (const id of localWords) {
    if (!knownLabels.has(id)) {
      localCompletions.push({
        label: id,
        type: 'variable',
        detail: 'Local symbol',
      });
    }
  }

  const allCompletions = [...standardJavaCompletions, ...localCompletions];

  return {
    from: word.from,
    options: allCompletions,
    validFor: /^[A-Za-z0-9_$.]*$/,
  };
}
