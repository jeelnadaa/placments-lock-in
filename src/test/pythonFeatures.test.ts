import { describe, it, expect } from 'vitest';
import { EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { CompletionContext, Completion } from '@codemirror/autocomplete';
import { python } from '@codemirror/lang-python';
import { pythonLinter } from '../components/editor/pythonLinter';
import { pythonCompletionSource } from '../components/editor/pythonCompletions';
import { generatePythonStarterCode } from '../utils/starterCode';
import { ProblemMeta } from '../types';

function createMockPythonView(doc: string): EditorView {
  const state = EditorState.create({
    doc,
    extensions: [python()],
  });
  return new EditorView({ state });
}

function createPythonCompletionContext(doc: string, pos: number, explicit = false): CompletionContext {
  const state = EditorState.create({ doc });
  return new CompletionContext(state, pos, explicit);
}

describe('Python Linter', () => {
  it('detects unclosed strings', () => {
    const code = `def solution():
    s = "hello world
    return s`;
    const view = createMockPythonView(code);
    const diags = pythonLinter(view);
    const unclosed = diags.find((d) => d.message.includes('Unclosed string literal'));
    expect(unclosed).toBeDefined();
    expect(unclosed?.severity).toBe('error');
  });

  it('detects mismatched brackets and parentheses', () => {
    const code = `def solution(nums):
    result = [1, 2, (3 + 4]
    return result`;
    const view = createMockPythonView(code);
    const diags = pythonLinter(view);
    const mismatch = diags.find((d) => d.message.includes('Mismatched closing'));
    expect(mismatch).toBeDefined();
  });

  it('detects missing colon after if/def/while/for statements', () => {
    const code = `def twoSum(nums, target)
    for num in nums
        if num == target
            return True`;
    const view = createMockPythonView(code);
    const diags = pythonLinter(view);
    const colonDiags = diags.filter((d) => d.message.includes("Missing ':'"));
    expect(colonDiags.length).toBeGreaterThanOrEqual(2);
  });

  it('detects JavaScript / Java syntax traps in Python', () => {
    const code = `def check(a, b):
    if (a === b && a !== null):
        return true
    elif (a || false):
        return this.value`;
    const view = createMockPythonView(code);
    const diags = pythonLinter(view);
    const msgs = diags.map((d) => d.message);
    expect(msgs.some((m) => m.includes("Use '==' instead of '==='"))).toBe(true);
    expect(msgs.some((m) => m.includes("Use 'and' instead of '&&'"))).toBe(true);
    expect(msgs.some((m) => m.includes("Use 'None' instead of 'null'"))).toBe(true);
    expect(msgs.some((m) => m.includes("Use 'True' instead of 'true'"))).toBe(true);
    expect(msgs.some((m) => m.includes("Use 'or' instead of '||'"))).toBe(true);
    expect(msgs.some((m) => m.includes("Use 'self.' instead of 'this.'"))).toBe(true);
  });

  it('detects mixed tabs and spaces indentation', () => {
    const code = "def test():\n    x = 1\n\ty = 2\n    return x + y";
    const view = createMockPythonView(code);
    const diags = pythonLinter(view);
    const indentDiag = diags.find((d) => d.message.includes('Indentation contains tab'));
    expect(indentDiag).toBeDefined();
  });

  it('passes on clean Python code with no errors', () => {
    const code = `class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        seen = {}
        for i, num in enumerate(nums):
            diff = target - num
            if diff in seen:
                return [seen[diff], i]
            seen[num] = i
        return []`;
    const view = createMockPythonView(code);
    const diags = pythonLinter(view);
    expect(diags.length).toBe(0);
  });
});

describe('Python Autocompletions', () => {
  it('provides dict methods after typing dot on dict-like variables', async () => {
    const doc = `class Solution:
    def test(self):
        d = {}
        d.
`;
    const dotPos = doc.indexOf('d.') + 2;
    const ctx = createPythonCompletionContext(doc, dotPos, true);
    const res = await pythonCompletionSource(ctx);

    expect(res).not.toBeNull();
    const labels = (res?.options || []).map((o: Completion) => o.label);
    expect(labels).toContain('get');
    expect(labels).toContain('items');
    expect(labels).toContain('keys');
    expect(labels).toContain('values');
    expect(labels).toContain('setdefault');
  });

  it('provides heapq functions after typing "heapq."', async () => {
    const doc = `import heapq
class Solution:
    def test(self):
        heapq.
`;
    const dotPos = doc.indexOf('heapq.') + 6;
    const ctx = createPythonCompletionContext(doc, dotPos, true);
    const res = await pythonCompletionSource(ctx);

    expect(res).not.toBeNull();
    const labels = (res?.options || []).map((o: Completion) => o.label);
    expect(labels).toContain('heappush');
    expect(labels).toContain('heappop');
    expect(labels).toContain('heapify');
    expect(labels).toContain('nlargest');
  });

  it('provides collections classes after typing "collections."', async () => {
    const doc = `import collections
collections.
`;
    const dotPos = doc.indexOf('collections.') + 12;
    const ctx = createPythonCompletionContext(doc, dotPos, true);
    const res = await pythonCompletionSource(ctx);

    expect(res).not.toBeNull();
    const labels = (res?.options || []).map((o: Completion) => o.label);
    expect(labels).toContain('defaultdict');
    expect(labels).toContain('Counter');
    expect(labels).toContain('deque');
  });

  it('provides TreeNode attributes after typing "node." or "root."', async () => {
    const doc = `class Solution:
    def test(self, root):
        root.
`;
    const dotPos = doc.indexOf('root.') + 5;
    const ctx = createPythonCompletionContext(doc, dotPos, true);
    const res = await pythonCompletionSource(ctx);

    expect(res).not.toBeNull();
    const labels = (res?.options || []).map((o: Completion) => o.label);
    expect(labels).toContain('val');
    expect(labels).toContain('left');
    expect(labels).toContain('right');
  });

  it('provides general Python builtins and keywords on standard typing', async () => {
    const doc = `enu`;
    const ctx = createPythonCompletionContext(doc, 3, false);
    const res = await pythonCompletionSource(ctx);

    expect(res).not.toBeNull();
    const labels = (res?.options || []).map((o: Completion) => o.label);
    expect(labels).toContain('enumerate');
  });
});

describe('generatePythonStarterCode', () => {
  it('generates standard method signature for Two Sum', () => {
    const meta: ProblemMeta = {
      id: 1,
      className: 'Solution',
      methodName: 'twoSum',
      params: [
        { name: 'nums', type: 'int[]' },
        { name: 'target', type: 'int' },
      ],
      returnType: 'int[]',
      kind: 'function',
      comparator: 'exact',
      examples: [],
      constraints: [],
    };
    const code = generatePythonStarterCode(meta);
    expect(code).toContain('class Solution:');
    expect(code).toContain('def twoSum(self, nums: List[int], target: int) -> List[int]:');
    expect(code).toContain('pass');
  });

  it('generates Optional[ListNode] signature and comment for Reverse Linked List', () => {
    const meta: ProblemMeta = {
      id: 206,
      className: 'Solution',
      methodName: 'reverseList',
      params: [{ name: 'head', type: 'ListNode' }],
      returnType: 'ListNode',
      kind: 'function',
      comparator: 'exact',
      examples: [],
      constraints: [],
    };
    const code = generatePythonStarterCode(meta);
    expect(code).toContain('class ListNode:');
    expect(code).toContain('def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:');
  });

  it('generates TreeNode signature and comment for Invert Binary Tree', () => {
    const meta: ProblemMeta = {
      id: 226,
      className: 'Solution',
      methodName: 'invertTree',
      params: [{ name: 'root', type: 'TreeNode' }],
      returnType: 'TreeNode',
      kind: 'function',
      comparator: 'exact',
      examples: [],
      constraints: [],
    };
    const code = generatePythonStarterCode(meta);
    expect(code).toContain('class TreeNode:');
    expect(code).toContain('def invertTree(self, root: Optional[TreeNode]) -> Optional[TreeNode]:');
  });

  it('generates inplace return type None for Rotate Image', () => {
    const meta: ProblemMeta = {
      id: 48,
      className: 'Solution',
      methodName: 'rotate',
      params: [{ name: 'matrix', type: 'int[][]' }],
      returnType: 'inplace:matrix',
      kind: 'inplace:0',
      comparator: 'exact',
      examples: [],
      constraints: [],
    };
    const code = generatePythonStarterCode(meta);
    expect(code).toContain('def rotate(self, matrix: List[List[int]]) -> None:');
    expect(code).toContain('Do not return anything, modify matrix in-place instead.');
  });

  it('generates class design stub for Trie', () => {
    const meta: any = {
      id: 208,
      className: 'Trie',
      methodName: 'constructor',
      params: [],
      returnType: 'class',
      kind: 'class',
      comparator: 'exact',
      examples: [],
      constraints: [],
      classMethods: [
        { name: 'insert', params: [{ name: 'word', type: 'String' }], returnType: 'void' },
        { name: 'search', params: [{ name: 'word', type: 'String' }], returnType: 'boolean' },
        { name: 'startsWith', params: [{ name: 'prefix', type: 'String' }], returnType: 'boolean' },
      ],
    };
    const code = generatePythonStarterCode(meta);
    expect(code).toContain('class Trie:');
    expect(code).toContain('def __init__(self):');
    expect(code).toContain('def insert(self, word: str) -> None:');
    expect(code).toContain('def search(self, word: str) -> bool:');
    expect(code).toContain('def startsWith(self, prefix: str) -> bool:');
  });
});
