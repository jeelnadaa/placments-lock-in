import { ProblemMeta, SupportedLanguage } from '../types';

/**
 * Maps Java/Meta type names to Python type annotations
 */
function javaTypeToPython(javaType: string): string {
  const clean = javaType.trim();
  switch (clean) {
    case 'int':
    case 'long':
    case 'short':
    case 'byte':
      return 'int';
    case 'double':
    case 'float':
      return 'float';
    case 'boolean':
      return 'bool';
    case 'char':
    case 'String':
      return 'str';
    case 'void':
      return 'None';
    case 'int[]':
      return 'List[int]';
    case 'int[][]':
      return 'List[List[int]]';
    case 'char[]':
      return 'List[str]';
    case 'char[][]':
      return 'List[List[str]]';
    case 'String[]':
      return 'List[str]';
    case 'boolean[]':
      return 'List[bool]';
    case 'double[]':
      return 'List[float]';
    case 'ListNode':
      return 'Optional[ListNode]';
    case 'ListNode[]':
      return 'List[Optional[ListNode]]';
    case 'TreeNode':
      return 'Optional[TreeNode]';
    case 'Node':
      return "Optional['Node']";
    case 'Interval':
      return 'Interval';
    case 'Interval[]':
    case 'List<Interval>':
      return 'List[Interval]';
    case 'List<Integer>':
      return 'List[int]';
    case 'List<String>':
      return 'List[str]';
    case 'List<List<Integer>>':
      return 'List[List[int]]';
    case 'List<List<String>>':
      return 'List[List[str]]';
    case 'List<Boolean>':
      return 'List[bool]';
    default:
      if (clean.endsWith('[]')) {
        const inner = clean.slice(0, -2);
        return `List[${javaTypeToPython(inner)}]`;
      }
      return clean;
  }
}

/**
 * Generate Python starter code from problem metadata
 */
export function generatePythonStarterCode(meta: ProblemMeta): string {
  const lines: string[] = [];

  const typesUsed = new Set<string>();
  typesUsed.add(meta.returnType);
  meta.params.forEach((p) => typesUsed.add(p.type));

  const usesListNode = Array.from(typesUsed).some((t) => t.includes('ListNode'));
  const usesTreeNode = Array.from(typesUsed).some((t) => t.includes('TreeNode'));
  const usesNode = Array.from(typesUsed).some((t) => t.includes('Node') && !t.includes('TreeNode') && !t.includes('ListNode'));

  if (usesListNode) {
    lines.push('# Definition for singly-linked list.');
    lines.push('# class ListNode:');
    lines.push('#     def __init__(self, val=0, next=None):');
    lines.push('#         self.val = val');
    lines.push('#         self.next = next\n');
  }

  if (usesTreeNode) {
    lines.push('# Definition for a binary tree node.');
    lines.push('# class TreeNode:');
    lines.push('#     def __init__(self, val=0, left=None, right=None):');
    lines.push('#         self.val = val');
    lines.push('#         self.left = left');
    lines.push('#         self.right = right\n');
  }

  if (usesNode) {
    lines.push('# Definition for a Node.');
    lines.push('# class Node:');
    lines.push('#     def __init__(self, val=0, neighbors=None):');
    lines.push('#         self.val = val');
    lines.push('#         self.neighbors = neighbors if neighbors is not None else []\n');
  }

  // Determine needed typing imports
  const typingImports = new Set<string>();
  const pythonReturn = javaTypeToPython(meta.returnType);
  if (pythonReturn.includes('List')) typingImports.add('List');
  if (pythonReturn.includes('Optional')) typingImports.add('Optional');
  if (pythonReturn.includes('Dict')) typingImports.add('Dict');

  for (const p of meta.params) {
    const pt = javaTypeToPython(p.type);
    if (pt.includes('List')) typingImports.add('List');
    if (pt.includes('Optional')) typingImports.add('Optional');
    if (pt.includes('Dict')) typingImports.add('Dict');
  }

  if (typingImports.size > 0) {
    lines.push(`from typing import ${Array.from(typingImports).sort().join(', ')}\n`);
  }

  // Handle class-based design problem (e.g. Trie)
  if (meta.kind === 'class') {
    const className = meta.className || 'Trie';
    lines.push(`class ${className}:`);
    lines.push('    def __init__(self):');
    lines.push('        pass\n');

    const classMethods = (meta as any).classMethods as Array<{ name: string; params: Array<{ name: string; type: string }>; returnType: string }> | undefined;
    if (classMethods && classMethods.length > 0) {
      for (const m of classMethods) {
        const mParams = ['self', ...m.params.map((p) => `${p.name}: ${javaTypeToPython(p.type)}`)].join(', ');
        const mRet = javaTypeToPython(m.returnType);
        lines.push(`    def ${m.name}(${mParams}) -> ${mRet}:`);
        lines.push('        pass\n');
      }
    } else if (className === 'Trie') {
      lines.push('    def insert(self, word: str) -> None:');
      lines.push('        pass\n');
      lines.push('    def search(self, word: str) -> bool:');
      lines.push('        pass\n');
      lines.push('    def startsWith(self, prefix: str) -> bool:');
      lines.push('        pass');
    }
    return lines.join('\n').trimEnd();
  }

  // Handle standard function or in-place function
  lines.push('class Solution:');
  const paramStrings = meta.params.map((p) => `${p.name}: ${javaTypeToPython(p.type)}`);
  const allParams = ['self', ...paramStrings].join(', ');

  const isInplace = typeof meta.kind === 'string' && meta.kind.startsWith('inplace:');
  const retType = isInplace ? 'None' : javaTypeToPython(meta.returnType);
  lines.push(`    def ${meta.methodName}(${allParams}) -> ${retType}:`);

  if (isInplace) {
    const targetName = meta.returnType?.startsWith('inplace:')
      ? meta.returnType.split(':')[1]
      : (meta.params[0]?.name || 'the input');
    lines.push('        """');
    lines.push(`        Do not return anything, modify ${targetName} in-place instead.`);
    lines.push('        """');
    lines.push('        pass');
  } else {
    lines.push('        pass');
  }

  return lines.join('\n');
}

/**
 * Maps Java/Meta type names to C++ type annotations
 */
export function javaTypeToCpp(javaType: string, isParam = false): string {
  const clean = javaType.trim();
  switch (clean) {
    case 'int':
    case 'short':
    case 'byte':
      return 'int';
    case 'long':
      return 'long long';
    case 'double':
    case 'float':
      return 'double';
    case 'boolean':
      return 'bool';
    case 'char':
      return 'char';
    case 'String':
      return isParam ? 'string' : 'string';
    case 'void':
      return 'void';
    case 'int[]':
      return isParam ? 'vector<int>&' : 'vector<int>';
    case 'int[][]':
      return isParam ? 'vector<vector<int>>&' : 'vector<vector<int>>';
    case 'char[]':
      return isParam ? 'vector<char>&' : 'vector<char>';
    case 'char[][]':
      return isParam ? 'vector<vector<char>>&' : 'vector<vector<char>>';
    case 'String[]':
      return isParam ? 'vector<string>&' : 'vector<string>';
    case 'boolean[]':
      return isParam ? 'vector<bool>&' : 'vector<bool>';
    case 'double[]':
      return isParam ? 'vector<double>&' : 'vector<double>';
    case 'ListNode':
      return 'ListNode*';
    case 'ListNode[]':
      return isParam ? 'vector<ListNode*>&' : 'vector<ListNode*>';
    case 'TreeNode':
      return 'TreeNode*';
    case 'Node':
      return 'Node*';
    case 'Interval':
      return 'Interval';
    case 'Interval[]':
    case 'List<Interval>':
      return isParam ? 'vector<Interval>&' : 'vector<Interval>';
    case 'List<Integer>':
      return isParam ? 'vector<int>&' : 'vector<int>';
    case 'List<String>':
      return isParam ? 'vector<string>&' : 'vector<string>';
    case 'List<List<Integer>>':
      return isParam ? 'vector<vector<int>>&' : 'vector<vector<int>>';
    case 'List<List<String>>':
      return isParam ? 'vector<vector<string>>&' : 'vector<vector<string>>';
    case 'List<Boolean>':
      return isParam ? 'vector<bool>&' : 'vector<bool>';
    default:
      if (clean.endsWith('[]')) {
        const inner = clean.slice(0, -2);
        return isParam ? `vector<${javaTypeToCpp(inner)}>&` : `vector<${javaTypeToCpp(inner)}>`;
      }
      return clean;
  }
}

/**
 * Generate C++ starter code from problem metadata
 */
export function generateCppStarterCode(meta: ProblemMeta): string {
  const lines: string[] = [];

  const typesUsed = new Set<string>();
  typesUsed.add(meta.returnType);
  meta.params.forEach((p) => typesUsed.add(p.type));

  const usesListNode = Array.from(typesUsed).some((t) => t.includes('ListNode'));
  const usesTreeNode = Array.from(typesUsed).some((t) => t.includes('TreeNode'));
  const usesNode = Array.from(typesUsed).some((t) => t.includes('Node') && !t.includes('TreeNode') && !t.includes('ListNode'));

  if (usesListNode) {
    lines.push('/**');
    lines.push(' * Definition for singly-linked list.');
    lines.push(' * struct ListNode {');
    lines.push(' *     int val;');
    lines.push(' *     ListNode *next;');
    lines.push(' *     ListNode() : val(0), next(nullptr) {}');
    lines.push(' *     ListNode(int x) : val(x), next(nullptr) {}');
    lines.push(' *     ListNode(int x, ListNode *next) : val(x), next(next) {}');
    lines.push(' * };');
    lines.push(' */\n');
  }

  if (usesTreeNode) {
    lines.push('/**');
    lines.push(' * Definition for a binary tree node.');
    lines.push(' * struct TreeNode {');
    lines.push(' *     int val;');
    lines.push(' *     TreeNode *left;');
    lines.push(' *     TreeNode *right;');
    lines.push(' *     TreeNode() : val(0), left(nullptr), right(nullptr) {}');
    lines.push(' *     TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}');
    lines.push(' *     TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}');
    lines.push(' * };');
    lines.push(' */\n');
  }

  if (usesNode) {
    lines.push('/**');
    lines.push(' * Definition for a Node.');
    lines.push(' * class Node {');
    lines.push(' * public:');
    lines.push(' *     int val;');
    lines.push(' *     vector<Node*> neighbors;');
    lines.push(' *     Node() : val(0), neighbors({}) {}');
    lines.push(' *     Node(int _val) : val(_val), neighbors({}) {}');
    lines.push(' *     Node(int _val, vector<Node*> _neighbors) : val(_val), neighbors(_neighbors) {}');
    lines.push(' * };');
    lines.push(' */\n');
  }

  // Handle class-based design problem (e.g. Trie)
  if (meta.kind === 'class') {
    const className = meta.className || 'Trie';
    lines.push(`class ${className} {`);
    lines.push('public:');
    lines.push(`    ${className}() {`);
    lines.push('        ');
    lines.push('    }\n');

    const classMethods = (meta as any).classMethods as Array<{ name: string; params: Array<{ name: string; type: string }>; returnType: string }> | undefined;
    if (classMethods && classMethods.length > 0) {
      for (const m of classMethods) {
        const mParams = m.params.map((p) => `${javaTypeToCpp(p.type, true)} ${p.name}`).join(', ');
        const mRet = javaTypeToCpp(m.returnType);
        lines.push(`    ${mRet} ${m.name}(${mParams}) {`);
        lines.push('        ');
        lines.push('    }\n');
      }
    } else if (className === 'Trie') {
      lines.push('    void insert(string word) {');
      lines.push('        ');
      lines.push('    }\n');
      lines.push('    bool search(string word) {');
      lines.push('        ');
      lines.push('    }\n');
      lines.push('    bool startsWith(string prefix) {');
      lines.push('        ');
      lines.push('    }');
    }
    lines.push('};');
    return lines.join('\n');
  }

  // Handle standard function or in-place function
  lines.push('class Solution {');
  lines.push('public:');
  const paramStrings = meta.params.map((p) => `${javaTypeToCpp(p.type, true)} ${p.name}`);
  const allParams = paramStrings.join(', ');

  const isInplace = typeof meta.kind === 'string' && meta.kind.startsWith('inplace:');
  const retType = isInplace ? 'void' : javaTypeToCpp(meta.returnType);
  lines.push(`    ${retType} ${meta.methodName}(${allParams}) {`);
  lines.push('        ');
  lines.push('    }');
  lines.push('};');

  return lines.join('\n');
}

/**
 * Maps Java/Meta type names to C type annotations
 */
export function javaTypeToC(javaType: string): string {
  const clean = javaType.trim();
  switch (clean) {
    case 'int':
    case 'short':
    case 'byte':
      return 'int';
    case 'long':
      return 'long long';
    case 'double':
    case 'float':
      return 'double';
    case 'boolean':
      return 'bool';
    case 'char':
      return 'char';
    case 'String':
      return 'char*';
    case 'void':
      return 'void';
    case 'int[]':
    case 'List<Integer>':
      return 'int*';
    case 'int[][]':
    case 'List<List<Integer>>':
      return 'int**';
    case 'char[]':
      return 'char*';
    case 'char[][]':
      return 'char**';
    case 'String[]':
    case 'List<String>':
      return 'char**';
    case 'List<List<String>>':
      return 'char***';
    case 'boolean[]':
    case 'List<Boolean>':
      return 'bool*';
    case 'double[]':
      return 'double*';
    case 'ListNode':
      return 'struct ListNode*';
    case 'ListNode[]':
      return 'struct ListNode**';
    case 'TreeNode':
      return 'struct TreeNode*';
    case 'Node':
      return 'struct Node*';
    case 'Interval':
      return 'int*';
    case 'Interval[]':
    case 'List<Interval>':
      return 'int**';
    default:
      if (clean.endsWith('[][]')) {
        return 'int**';
      }
      if (clean.endsWith('[]')) {
        return 'int*';
      }
      return clean;
  }
}

/**
 * Generate C starter code from problem metadata
 */
export function generateCStarterCode(meta: ProblemMeta): string {
  const lines: string[] = [];

  const typesUsed = new Set<string>();
  typesUsed.add(meta.returnType);
  meta.params.forEach((p) => typesUsed.add(p.type));

  const usesListNode = Array.from(typesUsed).some((t) => t.includes('ListNode'));
  const usesTreeNode = Array.from(typesUsed).some((t) => t.includes('TreeNode'));
  const usesNode = Array.from(typesUsed).some((t) => t.includes('Node') && !t.includes('TreeNode') && !t.includes('ListNode'));

  if (usesListNode) {
    lines.push('/**');
    lines.push(' * Definition for singly-linked list.');
    lines.push(' * struct ListNode {');
    lines.push(' *     int val;');
    lines.push(' *     struct ListNode *next;');
    lines.push(' * };');
    lines.push(' */\n');
  }

  if (usesTreeNode) {
    lines.push('/**');
    lines.push(' * Definition for a binary tree node.');
    lines.push(' * struct TreeNode {');
    lines.push(' *     int val;');
    lines.push(' *     struct TreeNode *left;');
    lines.push(' *     struct TreeNode *right;');
    lines.push(' * };');
    lines.push(' */\n');
  }

  if (usesNode) {
    lines.push('/**');
    lines.push(' * Definition for a Node.');
    lines.push(' * struct Node {');
    lines.push(' *     int val;');
    lines.push(' *     int numNeighbors;');
    lines.push(' *     struct Node** neighbors;');
    lines.push(' * };');
    lines.push(' */\n');
  }

  // Handle class-based design problem (Trie, WordDictionary, MedianFinder)
  if (meta.kind === 'class') {
    const className = meta.className || 'Trie';
    lines.push(`typedef struct {`);
    lines.push(`    `);
    lines.push(`} ${className};\n`);

    const lowerPrefix = className.charAt(0).toLowerCase() + className.slice(1);
    lines.push(`${className}* ${lowerPrefix}Create() {`);
    lines.push(`    `);
    lines.push(`}\n`);

    const classMethods = (meta as any).classMethods as Array<{ name: string; params: Array<{ name: string; type: string }>; returnType: string }> | undefined;
    if (classMethods && classMethods.length > 0) {
      for (const m of classMethods) {
        const mParams = [`${className}* obj`, ...m.params.map((p) => `${javaTypeToC(p.type)} ${p.name}`)].join(', ');
        const mRet = javaTypeToC(m.returnType);
        const methodName = lowerPrefix + m.name.charAt(0).toUpperCase() + m.name.slice(1);
        lines.push(`${mRet} ${methodName}(${mParams}) {`);
        lines.push(`    `);
        lines.push(`}\n`);
      }
    } else if (className === 'Trie') {
      lines.push(`void trieInsert(Trie* obj, char* word) {`);
      lines.push(`    `);
      lines.push(`}\n`);
      lines.push(`bool trieSearch(Trie* obj, char* word) {`);
      lines.push(`    `);
      lines.push(`}\n`);
      lines.push(`bool trieStartsWith(Trie* obj, char* prefix) {`);
      lines.push(`    `);
      lines.push(`}\n`);
    } else if (className === 'WordDictionary') {
      lines.push(`void wordDictionaryAddWord(WordDictionary* obj, char* word) {`);
      lines.push(`    `);
      lines.push(`}\n`);
      lines.push(`bool wordDictionarySearch(WordDictionary* obj, char* word) {`);
      lines.push(`    `);
      lines.push(`}\n`);
    } else if (className === 'MedianFinder') {
      lines.push(`void medianFinderAddNum(MedianFinder* obj, int num) {`);
      lines.push(`    `);
      lines.push(`}\n`);
      lines.push(`double medianFinderFindMedian(MedianFinder* obj) {`);
      lines.push(`    `);
      lines.push(`}\n`);
    }

    lines.push(`void ${lowerPrefix}Free(${className}* obj) {`);
    lines.push(`    `);
    lines.push(`}`);
    return lines.join('\n');
  }

  // Handle standard function or in-place function
  const isInplace = typeof meta.kind === 'string' && meta.kind.startsWith('inplace:');
  const retType = isInplace ? 'void' : javaTypeToC(meta.returnType);

  // Note comments for array returns
  if (!isInplace) {
    const r = meta.returnType?.trim() || '';
    if (r === 'int[][]' || r === 'char[][]' || r === 'List<List<Integer>>' || r === 'List<List<String>>') {
      lines.push('/**');
      lines.push(' * Return an array of arrays of size *returnSize.');
      lines.push(' * The sizes of the arrays are returned as *returnColumnSizes array.');
      lines.push(' * Note: Both returned array and *columnSizes array must be malloced, assume caller calls free().');
      lines.push(' */');
    } else if (r === 'int[]' || r === 'char[]' || r === 'String[]' || r === 'List<Integer>' || r === 'List<String>') {
      lines.push('/**');
      lines.push(' * Note: The returned array must be malloced, assume caller calls free().');
      lines.push(' */');
    }
  }

  // Build params
  const paramStrings: string[] = [];
  for (const p of meta.params) {
    const t = p.type.trim();
    if (t === 'int[]') {
      paramStrings.push(`int* ${p.name}`, `int ${p.name}Size`);
    } else if (t === 'char[]') {
      paramStrings.push(`char* ${p.name}`, `int ${p.name}Size`);
    } else if (t === 'int[][]') {
      paramStrings.push(`int** ${p.name}`, `int ${p.name}Size`, `int* ${p.name}ColSize`);
    } else if (t === 'char[][]') {
      paramStrings.push(`char** ${p.name}`, `int ${p.name}Size`, `int* ${p.name}ColSize`);
    } else if (t === 'String[]' || t === 'List<String>') {
      paramStrings.push(`char** ${p.name}`, `int ${p.name}Size`);
    } else if (t === 'ListNode[]') {
      paramStrings.push(`struct ListNode** ${p.name}`, `int ${p.name}Size`);
    } else if (t === 'Interval[]' || t === 'List<Interval>') {
      paramStrings.push(`int** ${p.name}`, `int ${p.name}Size`, `int* ${p.name}ColSize`);
    } else {
      paramStrings.push(`${javaTypeToC(t)} ${p.name}`);
    }
  }

  if (!isInplace) {
    const r = meta.returnType?.trim() || '';
    if (r === 'int[][]' || r === 'char[][]' || r === 'List<List<Integer>>' || r === 'List<List<String>>') {
      paramStrings.push('int* returnSize', 'int** returnColumnSizes');
    } else if (
      r === 'int[]' ||
      r === 'char[]' ||
      r === 'String[]' ||
      r === 'List<Integer>' ||
      r === 'List<String>' ||
      r === 'boolean[]' ||
      r === 'List<Boolean>'
    ) {
      paramStrings.push('int* returnSize');
    }
  }

  lines.push(`${retType} ${meta.methodName}(${paramStrings.join(', ')}) {`);
  lines.push('    ');
  lines.push('}');

  return lines.join('\n');
}

/**
 * Maps Java/Meta type names to Go type annotations
 */
export function javaTypeToGo(javaType: string): string {
  const clean = javaType.trim();
  switch (clean) {
    case 'int':
    case 'short':
    case 'byte':
      return 'int';
    case 'long':
      return 'int64';
    case 'double':
    case 'float':
      return 'float64';
    case 'boolean':
      return 'bool';
    case 'char':
      return 'byte';
    case 'String':
      return 'string';
    case 'void':
      return '';
    case 'int[]':
    case 'List<Integer>':
      return '[]int';
    case 'int[][]':
    case 'List<List<Integer>>':
      return '[][]int';
    case 'char[]':
      return '[]byte';
    case 'char[][]':
      return '[][]byte';
    case 'String[]':
    case 'List<String>':
      return '[]string';
    case 'List<List<String>>':
      return '[][]string';
    case 'boolean[]':
    case 'List<Boolean>':
      return '[]bool';
    case 'double[]':
      return '[]float64';
    case 'ListNode':
      return '*ListNode';
    case 'ListNode[]':
      return '[]*ListNode';
    case 'TreeNode':
      return '*TreeNode';
    case 'Node':
      return '*Node';
    case 'Interval':
      return '[]int';
    case 'Interval[]':
    case 'List<Interval>':
      return '[][]int';
    default:
      if (clean.endsWith('[][]')) {
        return '[][]int';
      }
      if (clean.endsWith('[]')) {
        return '[]int';
      }
      return clean;
  }
}

/**
 * Generate Go starter code from problem metadata
 */
export function generateGoStarterCode(meta: ProblemMeta): string {
  const lines: string[] = [];

  const typesUsed = new Set<string>();
  typesUsed.add(meta.returnType);
  meta.params.forEach((p) => typesUsed.add(p.type));

  const usesListNode = Array.from(typesUsed).some((t) => t.includes('ListNode'));
  const usesTreeNode = Array.from(typesUsed).some((t) => t.includes('TreeNode'));
  const usesNode = Array.from(typesUsed).some((t) => t.includes('Node') && !t.includes('TreeNode') && !t.includes('ListNode'));

  if (usesListNode) {
    lines.push('/**');
    lines.push(' * Definition for singly-linked list.');
    lines.push(' * type ListNode struct {');
    lines.push(' *     Val int');
    lines.push(' *     Next *ListNode');
    lines.push(' * }');
    lines.push(' */\n');
  }

  if (usesTreeNode) {
    lines.push('/**');
    lines.push(' * Definition for a binary tree node.');
    lines.push(' * type TreeNode struct {');
    lines.push(' *     Val int');
    lines.push(' *     Left *TreeNode');
    lines.push(' *     Right *TreeNode');
    lines.push(' * }');
    lines.push(' */\n');
  }

  if (usesNode) {
    lines.push('/**');
    lines.push(' * Definition for a Node.');
    lines.push(' * type Node struct {');
    lines.push(' *     Val int');
    lines.push(' *     Neighbors []*Node');
    lines.push(' * }');
    lines.push(' */\n');
  }

  // Handle class-based design problem (Trie, WordDictionary, MedianFinder)
  if (meta.kind === 'class') {
    const className = meta.className || 'Trie';
    lines.push(`type ${className} struct {`);
    lines.push(`    `);
    lines.push(`}\n`);

    lines.push(`func Constructor() ${className} {`);
    lines.push(`    return ${className}{}`);
    lines.push(`}\n`);

    const classMethods = (meta as any).classMethods as Array<{ name: string; params: Array<{ name: string; type: string }>; returnType: string }> | undefined;
    if (classMethods && classMethods.length > 0) {
      for (const m of classMethods) {
        const mParams = m.params.map((p) => `${p.name} ${javaTypeToGo(p.type)}`).join(', ');
        const mRet = javaTypeToGo(m.returnType);
        const capitalizedMethod = m.name.charAt(0).toUpperCase() + m.name.slice(1);
        const retPart = mRet ? ` ${mRet}` : '';
        lines.push(`func (this *${className}) ${capitalizedMethod}(${mParams})${retPart} {`);
        lines.push(`    `);
        lines.push(`}\n`);
      }
    } else if (className === 'Trie') {
      lines.push(`func (this *Trie) Insert(word string) {`);
      lines.push(`    `);
      lines.push(`}\n`);
      lines.push(`func (this *Trie) Search(word string) bool {`);
      lines.push(`    return false`);
      lines.push(`}\n`);
      lines.push(`func (this *Trie) StartsWith(prefix string) bool {`);
      lines.push(`    return false`);
      lines.push(`}`);
    } else if (className === 'WordDictionary') {
      lines.push(`func (this *WordDictionary) AddWord(word string) {`);
      lines.push(`    `);
      lines.push(`}\n`);
      lines.push(`func (this *WordDictionary) Search(word string) bool {`);
      lines.push(`    return false`);
      lines.push(`}`);
    } else if (className === 'MedianFinder') {
      lines.push(`func (this *MedianFinder) AddNum(num int) {`);
      lines.push(`    `);
      lines.push(`}\n`);
      lines.push(`func (this *MedianFinder) FindMedian() float64 {`);
      lines.push(`    return 0.0`);
      lines.push(`}`);
    }
    return lines.join('\n');
  }

  // Handle standard function or in-place function
  const isInplace = typeof meta.kind === 'string' && meta.kind.startsWith('inplace:');
  const retType = isInplace ? '' : javaTypeToGo(meta.returnType);
  const retPart = retType ? ` ${retType}` : '';

  const paramStrings = meta.params.map((p) => `${p.name} ${javaTypeToGo(p.type)}`);
  const allParams = paramStrings.join(', ');

  lines.push(`func ${meta.methodName}(${allParams})${retPart} {`);
  lines.push('    ');
  lines.push('}');

  return lines.join('\n');
}

/**
 * Get starter code for any language
 */
export function getStarterCodeForLanguage(
  meta: ProblemMeta,
  language: SupportedLanguage,
  defaultJavaStarter?: string
): string {
  if (language === 'python') {
    return generatePythonStarterCode(meta);
  }
  if (language === 'cpp') {
    return generateCppStarterCode(meta);
  }
  if (language === 'c') {
    return generateCStarterCode(meta);
  }
  if (language === 'go') {
    return generateGoStarterCode(meta);
  }
  // Java default
  return defaultJavaStarter || `class Solution {\n    // Solution for ${meta.id}\n}`;
}
