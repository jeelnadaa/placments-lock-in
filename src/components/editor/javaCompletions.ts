import { Completion, CompletionContext, CompletionResult, snippetCompletion } from '@codemirror/autocomplete';

/**
 * Common Java Classes & Interfaces
 */
const classCompletions: Completion[] = [
  { label: 'List', type: 'class', detail: 'java.util.List<E>' },
  { label: 'ArrayList', type: 'class', detail: 'java.util.ArrayList<E>' },
  { label: 'LinkedList', type: 'class', detail: 'java.util.LinkedList<E>' },
  { label: 'Map', type: 'class', detail: 'java.util.Map<K, V>' },
  { label: 'HashMap', type: 'class', detail: 'java.util.HashMap<K, V>' },
  { label: 'TreeMap', type: 'class', detail: 'java.util.TreeMap<K, V>' },
  { label: 'ConcurrentHashMap', type: 'class', detail: 'java.util.concurrent.ConcurrentHashMap<K, V>' },
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
  { label: 'Objects', type: 'class', detail: 'java.util.Objects' },
  { label: 'Math', type: 'class', detail: 'java.lang.Math' },
  { label: 'String', type: 'class', detail: 'java.lang.String' },
  { label: 'StringBuilder', type: 'class', detail: 'java.lang.StringBuilder' },
  { label: 'Integer', type: 'class', detail: 'java.lang.Integer' },
  { label: 'Character', type: 'class', detail: 'java.lang.Character' },
  { label: 'Boolean', type: 'class', detail: 'java.lang.Boolean' },
  { label: 'Long', type: 'class', detail: 'java.lang.Long' },
  { label: 'Double', type: 'class', detail: 'java.lang.Double' },
  { label: 'ListNode', type: 'class', detail: 'Definition for singly-linked list node' },
  { label: 'TreeNode', type: 'class', detail: 'Definition for binary tree node' },
  { label: 'Node', type: 'class', detail: 'Definition for graph / trie node' },
];

/**
 * Java Keywords
 */
const keywordCompletions: Completion[] = [
  'int', 'boolean', 'char', 'long', 'double', 'void', 'class', 'public',
  'private', 'protected', 'static', 'final', 'return', 'new', 'if', 'else',
  'for', 'while', 'break', 'continue', 'switch', 'case', 'default', 'try',
  'catch', 'finally', 'throw', 'throws', 'null', 'true', 'false', 'this'
].map((kw) => ({ label: kw, type: 'keyword' }));

/**
 * Map / HashMap / TreeMap method completions
 */
const mapMethods: Completion[] = [
  snippetCompletion('put(${1:key}, ${2:value})', { label: 'put', type: 'method', detail: 'V put(K key, V value)', info: 'Associates the specified value with the specified key in this map.' }),
  snippetCompletion('get(${1:key})', { label: 'get', type: 'method', detail: 'V get(Object key)', info: 'Returns the value to which the specified key is mapped, or null.' }),
  snippetCompletion('getOrDefault(${1:key}, ${2:defaultValue})', { label: 'getOrDefault', type: 'method', detail: 'V getOrDefault(Object key, V defaultValue)', info: 'Returns the value mapped or defaultValue if absent.' }),
  snippetCompletion('containsKey(${1:key})', { label: 'containsKey', type: 'method', detail: 'boolean containsKey(Object key)', info: 'Returns true if this map contains a mapping for the key.' }),
  snippetCompletion('containsValue(${1:value})', { label: 'containsValue', type: 'method', detail: 'boolean containsValue(Object value)', info: 'Returns true if this map maps one or more keys to the value.' }),
  snippetCompletion('remove(${1:key})', { label: 'remove', type: 'method', detail: 'V remove(Object key)', info: 'Removes the mapping for a key from this map.' }),
  snippetCompletion('size()', { label: 'size', type: 'method', detail: 'int size()', info: 'Returns the number of key-value mappings.' }),
  snippetCompletion('isEmpty()', { label: 'isEmpty', type: 'method', detail: 'boolean isEmpty()', info: 'Returns true if this map contains no key-value mappings.' }),
  snippetCompletion('keySet()', { label: 'keySet', type: 'method', detail: 'Set<K> keySet()', info: 'Returns a Set view of the keys in this map.' }),
  snippetCompletion('values()', { label: 'values', type: 'method', detail: 'Collection<V> values()', info: 'Returns a Collection view of the values in this map.' }),
  snippetCompletion('entrySet()', { label: 'entrySet', type: 'method', detail: 'Set<Map.Entry<K, V>> entrySet()', info: 'Returns a Set view of the mappings in this map.' }),
  snippetCompletion('clear()', { label: 'clear', type: 'method', detail: 'void clear()', info: 'Removes all mappings from this map.' }),
  snippetCompletion('putIfAbsent(${1:key}, ${2:value})', { label: 'putIfAbsent', type: 'method', detail: 'V putIfAbsent(K key, V value)', info: 'Puts key-value if not already present.' }),
  snippetCompletion('computeIfAbsent(${1:key}, k -> ${2:new ArrayList<>()})', { label: 'computeIfAbsent', type: 'method', detail: 'V computeIfAbsent(K key, Function mappingFunction)', info: 'Computes value if key is not present.' }),
  snippetCompletion('computeIfPresent(${1:key}, (k, v) -> ${2:v + 1})', { label: 'computeIfPresent', type: 'method', detail: 'V computeIfPresent(K key, BiFunction remappingFunction)' }),
  snippetCompletion('compute(${1:key}, (k, v) -> ${2:v == null ? 1 : v + 1})', { label: 'compute', type: 'method', detail: 'V compute(K key, BiFunction remappingFunction)' }),
  snippetCompletion('merge(${1:key}, ${2:1}, Integer::sum)', { label: 'merge', type: 'method', detail: 'V merge(K key, V value, BiFunction remappingFunction)' }),
  snippetCompletion('replace(${1:key}, ${2:value})', { label: 'replace', type: 'method', detail: 'V replace(K key, V value)', info: 'Replaces the entry for key.' }),
  snippetCompletion('forEach((k, v) -> ${1:/* action */});', { label: 'forEach', type: 'method', detail: 'void forEach(BiConsumer action)' }),
];

const mapStaticMethods: Completion[] = [
  snippetCompletion('of(${1:k1}, ${2:v1})', { label: 'of', type: 'method', detail: 'Map<K, V> Map.of(K k1, V v1)' }),
  snippetCompletion('entry(${1:key}, ${2:value})', { label: 'entry', type: 'method', detail: 'Map.Entry<K, V> Map.entry(K k, V v)' }),
  snippetCompletion('copyOf(${1:map})', { label: 'copyOf', type: 'method', detail: 'Map<K, V> Map.copyOf(Map map)' }),
];

const mapEntryMethods: Completion[] = [
  snippetCompletion('getKey()', { label: 'getKey', type: 'method', detail: 'K getKey()', info: 'Returns the key corresponding to this entry.' }),
  snippetCompletion('getValue()', { label: 'getValue', type: 'method', detail: 'V getValue()', info: 'Returns the value corresponding to this entry.' }),
  snippetCompletion('setValue(${1:value})', { label: 'setValue', type: 'method', detail: 'V setValue(V value)', info: 'Replaces the value corresponding to this entry.' }),
];

/**
 * List / ArrayList / LinkedList method completions
 */
const listMethods: Completion[] = [
  snippetCompletion('add(${1:item})', { label: 'add', type: 'method', detail: 'boolean add(E e)', info: 'Appends element to end of list.' }),
  snippetCompletion('add(${1:index}, ${2:item})', { label: 'add', type: 'method', detail: 'void add(int index, E element)', info: 'Inserts element at specified index.' }),
  snippetCompletion('get(${1:index})', { label: 'get', type: 'method', detail: 'E get(int index)', info: 'Returns element at index.' }),
  snippetCompletion('set(${1:index}, ${2:value})', { label: 'set', type: 'method', detail: 'E set(int index, E element)', info: 'Replaces element at index.' }),
  snippetCompletion('remove(${1:index})', { label: 'remove', type: 'method', detail: 'E remove(int index)', info: 'Removes element at index.' }),
  snippetCompletion('size()', { label: 'size', type: 'method', detail: 'int size()', info: 'Returns number of elements in list.' }),
  snippetCompletion('isEmpty()', { label: 'isEmpty', type: 'method', detail: 'boolean isEmpty()', info: 'Returns true if list contains no elements.' }),
  snippetCompletion('contains(${1:o})', { label: 'contains', type: 'method', detail: 'boolean contains(Object o)', info: 'Returns true if list contains element.' }),
  snippetCompletion('indexOf(${1:o})', { label: 'indexOf', type: 'method', detail: 'int indexOf(Object o)', info: 'Returns index of first occurrence.' }),
  snippetCompletion('lastIndexOf(${1:o})', { label: 'lastIndexOf', type: 'method', detail: 'int lastIndexOf(Object o)', info: 'Returns index of last occurrence.' }),
  snippetCompletion('clear()', { label: 'clear', type: 'method', detail: 'void clear()', info: 'Removes all elements from list.' }),
  snippetCompletion('toArray()', { label: 'toArray', type: 'method', detail: 'Object[] toArray()', info: 'Returns array of elements in list.' }),
  snippetCompletion('subList(${1:from}, ${2:to})', { label: 'subList', type: 'method', detail: 'List<E> subList(int fromIndex, int toIndex)', info: 'Returns portion of list between indexes.' }),
  snippetCompletion('addAll(${1:collection})', { label: 'addAll', type: 'method', detail: 'boolean addAll(Collection<? extends E> c)', info: 'Appends all elements in collection.' }),
  snippetCompletion('sort(${1:null})', { label: 'sort', type: 'method', detail: 'void sort(Comparator<? super E> c)', info: 'Sorts list using given Comparator.' }),
];

const listStaticMethods: Completion[] = [
  snippetCompletion('of(${1:...elements})', { label: 'of', type: 'method', detail: 'List<E> List.of(E... elements)' }),
  snippetCompletion('copyOf(${1:collection})', { label: 'copyOf', type: 'method', detail: 'List<E> List.copyOf(Collection coll)' }),
];

/**
 * Set / HashSet / TreeSet method completions
 */
const setMethods: Completion[] = [
  snippetCompletion('add(${1:item})', { label: 'add', type: 'method', detail: 'boolean add(E e)', info: 'Adds element if not already present.' }),
  snippetCompletion('contains(${1:o})', { label: 'contains', type: 'method', detail: 'boolean contains(Object o)', info: 'Returns true if set contains element.' }),
  snippetCompletion('remove(${1:o})', { label: 'remove', type: 'method', detail: 'boolean remove(Object o)', info: 'Removes element from set.' }),
  snippetCompletion('size()', { label: 'size', type: 'method', detail: 'int size()', info: 'Returns number of elements in set.' }),
  snippetCompletion('isEmpty()', { label: 'isEmpty', type: 'method', detail: 'boolean isEmpty()', info: 'Returns true if set is empty.' }),
  snippetCompletion('clear()', { label: 'clear', type: 'method', detail: 'void clear()', info: 'Removes all elements from set.' }),
  snippetCompletion('toArray()', { label: 'toArray', type: 'method', detail: 'Object[] toArray()', info: 'Returns array of elements in set.' }),
  snippetCompletion('addAll(${1:collection})', { label: 'addAll', type: 'method', detail: 'boolean addAll(Collection<? extends E> c)' }),
];

const setStaticMethods: Completion[] = [
  snippetCompletion('of(${1:...elements})', { label: 'of', type: 'method', detail: 'Set<E> Set.of(E... elements)' }),
  snippetCompletion('copyOf(${1:collection})', { label: 'copyOf', type: 'method', detail: 'Set<E> Set.copyOf(Collection coll)' }),
];

/**
 * Queue / PriorityQueue / Deque method completions
 */
const queueMethods: Completion[] = [
  snippetCompletion('offer(${1:item})', { label: 'offer', type: 'method', detail: 'boolean offer(E e)', info: 'Inserts item into queue.' }),
  snippetCompletion('poll()', { label: 'poll', type: 'method', detail: 'E poll()', info: 'Retrieves and removes head, or null if empty.' }),
  snippetCompletion('peek()', { label: 'peek', type: 'method', detail: 'E peek()', info: 'Retrieves head without removing, or null if empty.' }),
  snippetCompletion('add(${1:item})', { label: 'add', type: 'method', detail: 'boolean add(E e)', info: 'Inserts item into queue.' }),
  snippetCompletion('isEmpty()', { label: 'isEmpty', type: 'method', detail: 'boolean isEmpty()', info: 'Returns true if queue is empty.' }),
  snippetCompletion('size()', { label: 'size', type: 'method', detail: 'int size()', info: 'Returns number of elements in queue.' }),
  snippetCompletion('clear()', { label: 'clear', type: 'method', detail: 'void clear()', info: 'Removes all elements from queue.' }),
  snippetCompletion('offerFirst(${1:item})', { label: 'offerFirst', type: 'method', detail: 'boolean offerFirst(E e)' }),
  snippetCompletion('offerLast(${1:item})', { label: 'offerLast', type: 'method', detail: 'boolean offerLast(E e)' }),
  snippetCompletion('pollFirst()', { label: 'pollFirst', type: 'method', detail: 'E pollFirst()' }),
  snippetCompletion('pollLast()', { label: 'pollLast', type: 'method', detail: 'E pollLast()' }),
  snippetCompletion('peekFirst()', { label: 'peekFirst', type: 'method', detail: 'E peekFirst()' }),
  snippetCompletion('peekLast()', { label: 'peekLast', type: 'method', detail: 'E peekLast()' }),
];

/**
 * Stack method completions
 */
const stackMethods: Completion[] = [
  snippetCompletion('push(${1:item})', { label: 'push', type: 'method', detail: 'E push(E item)', info: 'Pushes item onto stack.' }),
  snippetCompletion('pop()', { label: 'pop', type: 'method', detail: 'E pop()', info: 'Removes and returns top of stack.' }),
  snippetCompletion('peek()', { label: 'peek', type: 'method', detail: 'E peek()', info: 'Looks at top of stack without removing.' }),
  snippetCompletion('empty()', { label: 'empty', type: 'method', detail: 'boolean empty()', info: 'Tests if stack is empty.' }),
  snippetCompletion('isEmpty()', { label: 'isEmpty', type: 'method', detail: 'boolean isEmpty()', info: 'Tests if stack is empty.' }),
  snippetCompletion('size()', { label: 'size', type: 'method', detail: 'int size()', info: 'Returns number of elements in stack.' }),
  snippetCompletion('search(${1:o})', { label: 'search', type: 'method', detail: 'int search(Object o)', info: 'Returns 1-based position from top of stack.' }),
];

/**
 * String method completions
 */
const stringMethods: Completion[] = [
  snippetCompletion('length()', { label: 'length', type: 'method', detail: 'int length()', info: 'Returns string length.' }),
  snippetCompletion('charAt(${1:index})', { label: 'charAt', type: 'method', detail: 'char charAt(int index)', info: 'Returns char at index.' }),
  snippetCompletion('substring(${1:beginIndex}, ${2:endIndex})', { label: 'substring', type: 'method', detail: 'String substring(int beginIndex, int endIndex)' }),
  snippetCompletion('substring(${1:beginIndex})', { label: 'substring', type: 'method', detail: 'String substring(int beginIndex)' }),
  snippetCompletion('indexOf(${1:str})', { label: 'indexOf', type: 'method', detail: 'int indexOf(String str)' }),
  snippetCompletion('lastIndexOf(${1:str})', { label: 'lastIndexOf', type: 'method', detail: 'int lastIndexOf(String str)' }),
  snippetCompletion('toLowerCase()', { label: 'toLowerCase', type: 'method', detail: 'String toLowerCase()' }),
  snippetCompletion('toUpperCase()', { label: 'toUpperCase', type: 'method', detail: 'String toUpperCase()' }),
  snippetCompletion('toCharArray()', { label: 'toCharArray', type: 'method', detail: 'char[] toCharArray()' }),
  snippetCompletion('trim()', { label: 'trim', type: 'method', detail: 'String trim()' }),
  snippetCompletion('split("${1:regex}")', { label: 'split', type: 'method', detail: 'String[] split(String regex)' }),
  snippetCompletion('replace(${1:oldChar}, ${2:newChar})', { label: 'replace', type: 'method', detail: 'String replace(char oldChar, char newChar)' }),
  snippetCompletion('replaceAll("${1:regex}", "${2:replacement}")', { label: 'replaceAll', type: 'method', detail: 'String replaceAll(String regex, String replacement)' }),
  snippetCompletion('startsWith(${1:prefix})', { label: 'startsWith', type: 'method', detail: 'boolean startsWith(String prefix)' }),
  snippetCompletion('endsWith(${1:suffix})', { label: 'endsWith', type: 'method', detail: 'boolean endsWith(String suffix)' }),
  snippetCompletion('contains(${1:s})', { label: 'contains', type: 'method', detail: 'boolean contains(CharSequence s)' }),
  snippetCompletion('equals(${1:obj})', { label: 'equals', type: 'method', detail: 'boolean equals(Object anObject)' }),
  snippetCompletion('equalsIgnoreCase(${1:str})', { label: 'equalsIgnoreCase', type: 'method', detail: 'boolean equalsIgnoreCase(String another)' }),
  snippetCompletion('isEmpty()', { label: 'isEmpty', type: 'method', detail: 'boolean isEmpty()' }),
  snippetCompletion('compareTo(${1:another})', { label: 'compareTo', type: 'method', detail: 'int compareTo(String anotherString)' }),
];

/**
 * StringBuilder method completions
 */
const stringBuilderMethods: Completion[] = [
  snippetCompletion('append(${1:obj})', { label: 'append', type: 'method', detail: 'StringBuilder append(Object obj)' }),
  snippetCompletion('reverse()', { label: 'reverse', type: 'method', detail: 'StringBuilder reverse()' }),
  snippetCompletion('toString()', { label: 'toString', type: 'method', detail: 'String toString()' }),
  snippetCompletion('length()', { label: 'length', type: 'method', detail: 'int length()' }),
  snippetCompletion('charAt(${1:index})', { label: 'charAt', type: 'method', detail: 'char charAt(int index)' }),
  snippetCompletion('setCharAt(${1:index}, ${2:ch})', { label: 'setCharAt', type: 'method', detail: 'void setCharAt(int index, char ch)' }),
  snippetCompletion('deleteCharAt(${1:index})', { label: 'deleteCharAt', type: 'method', detail: 'StringBuilder deleteCharAt(int index)' }),
  snippetCompletion('delete(${1:start}, ${2:end})', { label: 'delete', type: 'method', detail: 'StringBuilder delete(int start, int end)' }),
  snippetCompletion('insert(${1:offset}, ${2:obj})', { label: 'insert', type: 'method', detail: 'StringBuilder insert(int offset, Object obj)' }),
  snippetCompletion('substring(${1:start}, ${2:end})', { label: 'substring', type: 'method', detail: 'String substring(int start, int end)' }),
  snippetCompletion('indexOf(${1:str})', { label: 'indexOf', type: 'method', detail: 'int indexOf(String str)' }),
];

/**
 * Static Arrays methods
 */
const arraysStaticMethods: Completion[] = [
  snippetCompletion('sort(${1:arr});', { label: 'sort', type: 'method', detail: 'void Arrays.sort(int[] a)' }),
  snippetCompletion('sort(${1:arr}, ${2:(a, b) -> Integer.compare(a[0], b[0])});', { label: 'sort', type: 'method', detail: 'void Arrays.sort(T[] a, Comparator c)' }),
  snippetCompletion('fill(${1:arr}, ${2:val});', { label: 'fill', type: 'method', detail: 'void Arrays.fill(int[] a, int val)' }),
  snippetCompletion('binarySearch(${1:arr}, ${2:key})', { label: 'binarySearch', type: 'method', detail: 'int Arrays.binarySearch(int[] a, int key)' }),
  snippetCompletion('copyOf(${1:arr}, ${2:length})', { label: 'copyOf', type: 'method', detail: 'int[] Arrays.copyOf(int[] original, int newLength)' }),
  snippetCompletion('copyOfRange(${1:arr}, ${2:from}, ${3:to})', { label: 'copyOfRange', type: 'method', detail: 'int[] Arrays.copyOfRange(int[] original, int from, int to)' }),
  snippetCompletion('equals(${1:a}, ${2:b})', { label: 'equals', type: 'method', detail: 'boolean Arrays.equals(int[] a, int[] b)' }),
  snippetCompletion('toString(${1:arr})', { label: 'toString', type: 'method', detail: 'String Arrays.toString(int[] a)' }),
  snippetCompletion('deepToString(${1:matrix})', { label: 'deepToString', type: 'method', detail: 'String Arrays.deepToString(Object[] a)' }),
  snippetCompletion('asList(${1:...items})', { label: 'asList', type: 'method', detail: 'List<T> Arrays.asList(T... a)' }),
  snippetCompletion('stream(${1:arr})', { label: 'stream', type: 'method', detail: 'IntStream Arrays.stream(int[] array)' }),
];

/**
 * Static Collections methods
 */
const collectionsStaticMethods: Completion[] = [
  snippetCompletion('sort(${1:list});', { label: 'sort', type: 'method', detail: 'void Collections.sort(List<T> list)' }),
  snippetCompletion('sort(${1:list}, ${2:(a, b) -> b - a});', { label: 'sort', type: 'method', detail: 'void Collections.sort(List<T> list, Comparator c)' }),
  snippetCompletion('reverse(${1:list});', { label: 'reverse', type: 'method', detail: 'void Collections.reverse(List<?> list)' }),
  snippetCompletion('max(${1:coll})', { label: 'max', type: 'method', detail: 'T Collections.max(Collection<? extends T> coll)' }),
  snippetCompletion('min(${1:coll})', { label: 'min', type: 'method', detail: 'T Collections.min(Collection<? extends T> coll)' }),
  snippetCompletion('swap(${1:list}, ${2:i}, ${3:j});', { label: 'swap', type: 'method', detail: 'void Collections.swap(List<?> list, int i, int j)' }),
  snippetCompletion('frequency(${1:coll}, ${2:o})', { label: 'frequency', type: 'method', detail: 'int Collections.frequency(Collection<?> c, Object o)' }),
  snippetCompletion('emptyList()', { label: 'emptyList', type: 'method', detail: 'List<T> Collections.emptyList()' }),
  snippetCompletion('emptyMap()', { label: 'emptyMap', type: 'method', detail: 'Map<K, V> Collections.emptyMap()' }),
  snippetCompletion('emptySet()', { label: 'emptySet', type: 'method', detail: 'Set<T> Collections.emptySet()' }),
  snippetCompletion('unmodifiableList(${1:list})', { label: 'unmodifiableList', type: 'method', detail: 'List<T> Collections.unmodifiableList(List<? extends T> list)' }),
  snippetCompletion('unmodifiableMap(${1:map})', { label: 'unmodifiableMap', type: 'method', detail: 'Map<K, V> Collections.unmodifiableMap(Map<? extends K, ? extends V> m)' }),
];

/**
 * Static Objects methods
 */
const objectsStaticMethods: Completion[] = [
  snippetCompletion('equals(${1:a}, ${2:b})', { label: 'equals', type: 'method', detail: 'boolean Objects.equals(Object a, Object b)' }),
  snippetCompletion('hash(${1:...values})', { label: 'hash', type: 'method', detail: 'int Objects.hash(Object... values)' }),
  snippetCompletion('hashCode(${1:o})', { label: 'hashCode', type: 'method', detail: 'int Objects.hashCode(Object o)' }),
  snippetCompletion('requireNonNull(${1:obj})', { label: 'requireNonNull', type: 'method', detail: 'T Objects.requireNonNull(T obj)' }),
  snippetCompletion('toString(${1:o})', { label: 'toString', type: 'method', detail: 'String Objects.toString(Object o)' }),
];

/**
 * Static Math methods
 */
const mathStaticMethods: Completion[] = [
  snippetCompletion('max(${1:a}, ${2:b})', { label: 'max', type: 'method', detail: 'Math.max(a, b)' }),
  snippetCompletion('min(${1:a}, ${2:b})', { label: 'min', type: 'method', detail: 'Math.min(a, b)' }),
  snippetCompletion('abs(${1:x})', { label: 'abs', type: 'method', detail: 'Math.abs(x)' }),
  snippetCompletion('pow(${1:a}, ${2:b})', { label: 'pow', type: 'method', detail: 'Math.pow(a, b)' }),
  snippetCompletion('sqrt(${1:x})', { label: 'sqrt', type: 'method', detail: 'Math.sqrt(x)' }),
  snippetCompletion('floor(${1:x})', { label: 'floor', type: 'method', detail: 'Math.floor(x)' }),
  snippetCompletion('ceil(${1:x})', { label: 'ceil', type: 'method', detail: 'Math.ceil(x)' }),
  snippetCompletion('round(${1:x})', { label: 'round', type: 'method', detail: 'Math.round(x)' }),
  snippetCompletion('log(${1:x})', { label: 'log', type: 'method', detail: 'Math.log(x)' }),
  snippetCompletion('random()', { label: 'random', type: 'method', detail: 'double Math.random()' }),
  { label: 'PI', type: 'constant', detail: '3.141592653589793' },
  { label: 'E', type: 'constant', detail: '2.718281828459045' },
];

/**
 * Static Integer / Character methods
 */
const integerStaticMethods: Completion[] = [
  snippetCompletion('parseInt(${1:s})', { label: 'parseInt', type: 'method', detail: 'int Integer.parseInt(String s)' }),
  snippetCompletion('valueOf(${1:s})', { label: 'valueOf', type: 'method', detail: 'Integer Integer.valueOf(String s)' }),
  snippetCompletion('compare(${1:x}, ${2:y})', { label: 'compare', type: 'method', detail: 'int Integer.compare(int x, int y)' }),
  snippetCompletion('max(${1:a}, ${2:b})', { label: 'max', type: 'method', detail: 'int Integer.max(int a, int b)' }),
  snippetCompletion('min(${1:a}, ${2:b})', { label: 'min', type: 'method', detail: 'int Integer.min(int a, int b)' }),
  snippetCompletion('bitCount(${1:i})', { label: 'bitCount', type: 'method', detail: 'int Integer.bitCount(int i)' }),
  snippetCompletion('toBinaryString(${1:i})', { label: 'toBinaryString', type: 'method', detail: 'String Integer.toBinaryString(int i)' }),
  { label: 'MAX_VALUE', type: 'constant', detail: '2,147,483,647' },
  { label: 'MIN_VALUE', type: 'constant', detail: '-2,147,483,648' },
];

const characterStaticMethods: Completion[] = [
  snippetCompletion('isDigit(${1:c})', { label: 'isDigit', type: 'method', detail: 'boolean Character.isDigit(char ch)' }),
  snippetCompletion('isLetter(${1:c})', { label: 'isLetter', type: 'method', detail: 'boolean Character.isLetter(char ch)' }),
  snippetCompletion('isLetterOrDigit(${1:c})', { label: 'isLetterOrDigit', type: 'method', detail: 'boolean Character.isLetterOrDigit(char ch)' }),
  snippetCompletion('isWhitespace(${1:c})', { label: 'isWhitespace', type: 'method', detail: 'boolean Character.isWhitespace(char ch)' }),
  snippetCompletion('toLowerCase(${1:c})', { label: 'toLowerCase', type: 'method', detail: 'char Character.toLowerCase(char ch)' }),
  snippetCompletion('toUpperCase(${1:c})', { label: 'toUpperCase', type: 'method', detail: 'char Character.toUpperCase(char ch)' }),
  snippetCompletion('getNumericValue(${1:c})', { label: 'getNumericValue', type: 'method', detail: 'int Character.getNumericValue(char ch)' }),
];

/**
 * Node properties (ListNode, TreeNode, Node)
 */
const listNodeMembers: Completion[] = [
  { label: 'val', type: 'property', detail: 'int val' },
  { label: 'next', type: 'property', detail: 'ListNode next' },
];

const treeNodeMembers: Completion[] = [
  { label: 'val', type: 'property', detail: 'int val' },
  { label: 'left', type: 'property', detail: 'TreeNode left' },
  { label: 'right', type: 'property', detail: 'TreeNode right' },
];

const graphNodeMembers: Completion[] = [
  { label: 'val', type: 'property', detail: 'int val' },
  { label: 'neighbors', type: 'property', detail: 'List<Node> neighbors' },
];

const arrayMembers: Completion[] = [
  { label: 'length', type: 'property', detail: 'int length' },
  snippetCompletion('clone()', { label: 'clone', type: 'method', detail: 'Object clone()' }),
];

/**
 * Standard snippets
 */
const standardSnippets: Completion[] = [
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

interface InferredVariable {
  category: string;
  exactType?: string;
}

/**
 * Scan editor document to map variable names to their declared types.
 * Supports nested generics, 'var', constructor calls, loops, and parameters.
 */
function inferVariableTypes(docText: string): Map<string, InferredVariable> {
  const typeMap = new Map<string, InferredVariable>();

  // 1. Matches: var varName = new Type(...)
  const varRegex = /\bvar\s+([A-Za-z_][A-Za-z0-9_]*)\s*=\s*new\s+([A-Za-z_][A-Za-z0-9_]*)/g;
  let mVar: RegExpExecArray | null;
  while ((mVar = varRegex.exec(docText)) !== null) {
    const varName = mVar[1].trim();
    const typeName = mVar[2].trim();
    const cat = categorizeTypeName(typeName);
    typeMap.set(varName, { category: cat, exactType: typeName });
  }

  // 2. Matches general declarations: Type<...> varName or Type[] varName or Type varName
  const declRegex = /(?:[\(,;]|\b)\s*([A-Za-z_][A-Za-z0-9_]*(?:<(?:[^<>]|<[^>]+>)*>)?(?:\[\])*)\s+([A-Za-z_][A-Za-z0-9_]*)\s*(?:=|;|,|\)|\:)/g;
  let match: RegExpExecArray | null;

  while ((match = declRegex.exec(docText)) !== null) {
    const rawType = match[1].trim();
    const varName = match[2].trim();

    if (['public', 'private', 'protected', 'static', 'final', 'class', 'return', 'else', 'import', 'package', 'new', 'var'].includes(varName)) {
      continue;
    }

    const cat = categorizeTypeName(rawType);
    const bareType = rawType.replace(/<.*>$/, '').replace(/\[\]*$/, '').trim();
    typeMap.set(varName, { category: cat, exactType: bareType });
  }

  return typeMap;
}

function categorizeTypeName(rawType: string): string {
  if (rawType.includes('ListNode')) return 'listnode';
  if (rawType.includes('TreeNode')) return 'treenode';
  if (rawType === 'Node' || rawType.endsWith('.Node')) return 'node';
  if (rawType.includes('Map.Entry') || rawType.includes('Entry')) return 'mapentry';
  if (rawType.includes('Map') || rawType.includes('HashMap') || rawType.includes('TreeMap')) return 'map';
  if (rawType.includes('List') || rawType.includes('ArrayList') || rawType.includes('LinkedList')) return 'list';
  if (rawType.includes('Set') || rawType.includes('HashSet') || rawType.includes('TreeSet')) return 'set';
  if (rawType.includes('PriorityQueue')) return 'queue';
  if (rawType.includes('Queue') || rawType.includes('Deque') || rawType.includes('ArrayDeque')) return 'queue';
  if (rawType.includes('Stack')) return 'stack';
  if (rawType.includes('StringBuilder') || rawType.includes('StringBuffer')) return 'stringbuilder';
  if (rawType === 'String' || rawType.endsWith('String')) return 'string';
  if (rawType.includes('[]')) return 'array';
  return 'custom';
}

/**
 * Client-side in-memory cache for dynamic reflection from the backend server
 */
const clientReflectionCache = new Map<string, Completion[]>();

/**
 * Pre-fetch common Java classes into client reflection cache
 */
const PREFETCH_CLASSES = [
  'Map', 'HashMap', 'List', 'ArrayList', 'Set', 'HashSet', 'PriorityQueue',
  'Arrays', 'Collections', 'Math', 'String', 'StringBuilder', 'Integer', 'Character', 'Objects'
];

export function prefetchJavaReflection(): void {
  if (typeof window === 'undefined') return;
  PREFETCH_CLASSES.forEach((cls) => {
    fetchClassCompletions(cls).catch(() => {});
  });
}

/**
 * Fetch dynamic autocompletions from host Java 21 runtime via judge companion server
 */
export async function fetchClassCompletions(className: string): Promise<Completion[]> {
  const clean = className.trim();
  if (!clean) return [];
  if (clientReflectionCache.has(clean)) {
    return clientReflectionCache.get(clean)!;
  }

  try {
    const res = await fetch('/api/judge/reflect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ className: clean }),
    });
    if (!res.ok) return [];
    const data: Array<{ label: string; type: string; detail: string; apply: string }> = await res.json();
    const mapped: Completion[] = data.map((item) => {
      if (item.apply && item.apply.includes('${')) {
        return snippetCompletion(item.apply, {
          label: item.label,
          type: (item.type as any) || 'method',
          detail: item.detail,
        });
      }
      return {
        label: item.label,
        type: (item.type as any) || 'method',
        detail: item.detail,
        apply: item.apply,
      };
    });
    clientReflectionCache.set(clean, mapped);
    return mapped;
  } catch {
    return [];
  }
}

/**
 * Retrieve curated completions for static classes or inferred categories.
 */
function getCuratedCompletions(categoryOrClass: string): Completion[] {
  switch (categoryOrClass) {
    case 'Arrays':
      return arraysStaticMethods;
    case 'Collections':
      return collectionsStaticMethods;
    case 'Objects':
      return objectsStaticMethods;
    case 'Math':
      return mathStaticMethods;
    case 'Integer':
      return integerStaticMethods;
    case 'Character':
      return characterStaticMethods;
    case 'map':
      return mapMethods;
    case 'Map':
      return [...mapStaticMethods, ...mapMethods];
    case 'mapentry':
      return mapEntryMethods;
    case 'list':
      return listMethods;
    case 'List':
      return [...listStaticMethods, ...listMethods];
    case 'set':
      return setMethods;
    case 'Set':
      return [...setStaticMethods, ...setMethods];
    case 'queue':
      return queueMethods;
    case 'stack':
      return stackMethods;
    case 'string':
      return stringMethods;
    case 'stringbuilder':
      return stringBuilderMethods;
    case 'listnode':
      return listNodeMembers;
    case 'treenode':
      return treeNodeMembers;
    case 'node':
      return graphNodeMembers;
    case 'array':
      return arrayMembers;
    default:
      return [];
  }
}

/**
 * Retrieve member completions combining curated snippets and server reflection.
 */
async function getMemberCompletions(objectName: string, docText: string): Promise<Completion[]> {
  // 1. Static classes
  if (['Arrays', 'Collections', 'Objects', 'Math', 'Integer', 'Character', 'Map', 'List', 'Set'].includes(objectName)) {
    const curated = getCuratedCompletions(objectName);
    const reflected = await fetchClassCompletions(objectName);
    return mergeCompletions(curated, reflected);
  }

  // 2. Look up inferred type from document
  const typeMap = inferVariableTypes(docText);
  const inferred = typeMap.get(objectName);

  let category = inferred?.category;
  let exactType = inferred?.exactType;

  // 3. Fallback name heuristics if declaration not parsed
  if (!category || category === 'custom') {
    const lower = objectName.toLowerCase();
    if (lower.includes('map') || lower.includes('dict') || lower === 'hm') {
      category = 'map';
      exactType = exactType || 'Map';
    } else if (lower.includes('list') || lower === 'ans' || lower === 'res') {
      category = 'list';
      exactType = exactType || 'List';
    } else if (lower.includes('set') || lower.includes('visited') || lower.includes('seen')) {
      category = 'set';
      exactType = exactType || 'Set';
    } else if (lower.includes('queue') || lower === 'q' || lower === 'pq') {
      category = 'queue';
      exactType = exactType || (lower.includes('pq') ? 'PriorityQueue' : 'Queue');
    } else if (lower.includes('stack') || lower === 'st') {
      category = 'stack';
      exactType = exactType || 'Stack';
    } else if (lower === 'sb' || lower.includes('builder')) {
      category = 'stringbuilder';
      exactType = exactType || 'StringBuilder';
    } else if (lower === 's' || lower.includes('str') || lower.includes('word')) {
      category = 'string';
      exactType = exactType || 'String';
    } else if (lower === 'head' || lower === 'curr' || lower === 'node' || lower === 'prev' || lower === 'fast' || lower === 'slow') {
      category = 'listnode';
      exactType = 'ListNode';
    } else if (lower === 'root' || lower === 'tree' || lower === 'p' || lower === 'q') {
      category = 'treenode';
      exactType = 'TreeNode';
    } else if (lower.includes('entry') || lower === 'e') {
      category = 'mapentry';
      exactType = 'Map.Entry';
    } else if (lower.includes('arr') || lower === 'nums' || lower === 'matrix') {
      category = 'array';
    }
  }

  const curated = getCuratedCompletions(category || 'custom');

  // If we have an exact type or class query candidate, fetch reflection
  const queryClass = exactType || (category === 'map' ? 'Map' : category === 'list' ? 'List' : category === 'set' ? 'Set' : category === 'queue' ? 'Queue' : category === 'stack' ? 'Stack' : category === 'string' ? 'String' : category === 'stringbuilder' ? 'StringBuilder' : null);

  let reflected: Completion[] = [];
  if (queryClass && queryClass !== 'array' && queryClass !== 'listnode' && queryClass !== 'treenode' && queryClass !== 'node') {
    reflected = await fetchClassCompletions(queryClass);
  }

  if (curated.length > 0 || reflected.length > 0) {
    return mergeCompletions(curated, reflected);
  }

  // Unknown object: provide combined popular collection and string methods
  return [
    ...mapMethods,
    ...listMethods.filter((lm) => !mapMethods.some((mm) => mm.label === lm.label)),
    ...stringMethods.filter((sm) => !mapMethods.some((mm) => mm.label === sm.label)),
    ...arrayMembers,
  ];
}

/**
 * Merge curated and reflected completions, prioritizing curated for rich parameter names
 */
function mergeCompletions(curated: Completion[], reflected: Completion[]): Completion[] {
  const seen = new Set(curated.map((c) => c.label));
  const merged = [...curated];

  for (const r of reflected) {
    if (!seen.has(r.label)) {
      merged.push(r);
      seen.add(r.label);
    }
  }

  return merged;
}

/**
 * Autocompletion source combining dot-member inspection, standard Java library,
 * reflection from host Java 21 server, snippets, and local document symbols.
 */
export async function javaCompletionSource(context: CompletionContext): Promise<CompletionResult | null> {
  // 1. Check for dot-member access: e.g. "map." or "map.pu" or "Arrays.s"
  const dotMatch = context.matchBefore(/([A-Za-z_][A-Za-z0-9_]*)\.([A-Za-z0-9_]*)$/);
  if (dotMatch) {
    const parts = dotMatch.text.split('.');
    const objectName = parts[0];
    const prefix = parts[1] || '';
    const from = context.pos - prefix.length;
    const docText = context.state.doc.toString();
    const options = await getMemberCompletions(objectName, docText);

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

  // Extract local identifiers from current editor text
  const docText = context.state.doc.toString();
  const identifierRegex = /[A-Za-z_][A-Za-z0-9_]{1,}/g;
  const localWords = new Set<string>();
  let m: RegExpExecArray | null;

  while ((m = identifierRegex.exec(docText)) !== null) {
    localWords.add(m[0]);
  }

  const baseCompletions = [
    ...classCompletions,
    ...keywordCompletions,
    ...standardSnippets,
    ...mapMethods,
    ...listMethods,
    ...stringMethods,
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
