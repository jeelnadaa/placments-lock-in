import { describe, it, expect } from 'vitest';
import { EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { CompletionContext, Completion } from '@codemirror/autocomplete';
import { cpp } from '@codemirror/lang-cpp';
import { cLinter } from '../components/editor/cLinter';
import { cCompletionSource } from '../components/editor/cCompletions';
import { generateCStarterCode } from '../utils/starterCode';
import { ProblemMeta } from '../types';

function createMockCView(doc: string): EditorView {
  const state = EditorState.create({
    doc,
    extensions: [cpp()],
  });
  return new EditorView({ state });
}

function createCCompletionContext(doc: string, pos: number, explicit = false): CompletionContext {
  const state = EditorState.create({ doc });
  return new CompletionContext(state, pos, explicit);
}

describe('C Linter', () => {
  it('detects unclosed string literals', () => {
    const code = `int test() {
    char* s = "unclosed string;
    return 0;
}`;
    const view = createMockCView(code);
    const diags = cLinter(view);
    const unclosed = diags.find((d) => d.message.includes('Unclosed string literal'));
    expect(unclosed).toBeDefined();
  });

  it('detects unclosed character literals', () => {
    const code = `int test() {
    char c = 'a;
    return 0;
}`;
    const view = createMockCView(code);
    const diags = cLinter(view);
    const unclosed = diags.find((d) => d.message.includes('Unclosed character literal'));
    expect(unclosed).toBeDefined();
  });

  it('detects mismatched brackets', () => {
    const code = `int test() {
    int arr[] = {1, (2 + 3]};
    return 0;
}`;
    const view = createMockCView(code);
    const diags = cLinter(view);
    const mismatch = diags.find((d) => d.message.includes('Mismatched closing'));
    expect(mismatch).toBeDefined();
  });

  it('detects missing semicolon at end of statement', () => {
    const code = `int test() {
    int x = 42
    return x;
}`;
    const view = createMockCView(code);
    const diags = cLinter(view);
    const missingSemi = diags.find((d) => d.message.includes("Missing ';' at end of statement"));
    expect(missingSemi).toBeDefined();
  });

  it('detects C++ class usage and warns', () => {
    const code = `class Solution {
    int test() { return 0; }
};`;
    const view = createMockCView(code);
    const diags = cLinter(view);
    const classDiag = diags.find((d) => d.message.includes('Classes are not supported in C'));
    expect(classDiag).toBeDefined();
  });

  it('detects C++ new/delete operators', () => {
    const code = `int* test() {
    int* p = new int(5);
    delete p;
    return p;
}`;
    const view = createMockCView(code);
    const diags = cLinter(view);
    expect(diags.some((d) => d.message.includes("Operator 'new' is not available in C"))).toBe(true);
    expect(diags.some((d) => d.message.includes("Operator 'delete' is not available in C"))).toBe(true);
  });

  it('detects C++ nullptr and suggests NULL', () => {
    const code = `struct ListNode* test() {
    return nullptr;
}`;
    const view = createMockCView(code);
    const diags = cLinter(view);
    const nullDiag = diags.find((d) => d.message.includes("Use 'NULL' instead of 'nullptr'"));
    expect(nullDiag).toBeDefined();
  });

  it('detects C++ vector container', () => {
    const code = `void test() {
    vector<int> v;
}`;
    const view = createMockCView(code);
    const diags = cLinter(view);
    const vecDiag = diags.find((d) => d.message.includes("'vector' is a C++ STL container"));
    expect(vecDiag).toBeDefined();
  });

  it('detects pointer dot access and suggests arrow -> operator', () => {
    const code = `int test(struct ListNode* head) {
    return head.val;
}`;
    const view = createMockCView(code);
    const diags = cLinter(view);
    const ptrDiag = diags.find((d) => d.message.includes("Use arrow operator 'head->val'"));
    expect(ptrDiag).toBeDefined();
  });

  it('detects JS equality operators', () => {
    const code = `bool test(int a, int b) {
    return a === b;
}`;
    const view = createMockCView(code);
    const diags = cLinter(view);
    expect(diags.some((d) => d.message.includes("Use '==' instead of '==='"))).toBe(true);
  });

  it('passes on clean C code', () => {
    const code = `int* twoSum(int* nums, int numsSize, int target, int* returnSize) {
    *returnSize = 2;
    int* res = (int*)malloc(2 * sizeof(int));
    res[0] = 0;
    res[1] = 1;
    return res;
}`;
    const view = createMockCView(code);
    const diags = cLinter(view);
    expect(diags.length).toBe(0);
  });
});

describe('C Autocompletions', () => {
  it('suggests struct pointer arrow triggers for head->', async () => {
    const doc = 'head->';
    const ctx = createCCompletionContext(doc, doc.length);
    const res = await cCompletionSource(ctx);
    expect(res).not.toBeNull();
    const labels = (res!.options as Completion[]).map((o) => o.label);
    expect(labels).toContain('val');
    expect(labels).toContain('next');
  });

  it('suggests struct pointer arrow triggers for root->', async () => {
    const doc = 'root->';
    const ctx = createCCompletionContext(doc, doc.length);
    const res = await cCompletionSource(ctx);
    expect(res).not.toBeNull();
    const labels = (res!.options as Completion[]).map((o) => o.label);
    expect(labels).toContain('val');
    expect(labels).toContain('left');
    expect(labels).toContain('right');
  });

  it('suggests memory management functions like malloc and free', async () => {
    const doc = 'mal';
    const ctx = createCCompletionContext(doc, doc.length);
    const res = await cCompletionSource(ctx);
    expect(res).not.toBeNull();
    const labels = (res!.options as Completion[]).map((o) => o.label);
    expect(labels).toContain('malloc');
    expect(labels).toContain('free');
  });

  it('suggests sorting and string functions like qsort and strlen', async () => {
    const doc = 'qs';
    const ctx = createCCompletionContext(doc, doc.length);
    const res = await cCompletionSource(ctx);
    expect(res).not.toBeNull();
    const labels = (res!.options as Completion[]).map((o) => o.label);
    expect(labels).toContain('qsort');
    expect(labels).toContain('strlen');
  });
});

describe('C Starter Code Generation', () => {
  it('generates Two Sum C starter code with returnSize pointer', () => {
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
    const code = generateCStarterCode(meta);
    expect(code).toContain('int* twoSum(int* nums, int numsSize, int target, int* returnSize)');
    expect(code).toContain('The returned array must be malloced');
  });

  it('generates Reverse Linked List C starter code with struct ListNode*', () => {
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
    const code = generateCStarterCode(meta);
    expect(code).toContain('struct ListNode* reverseList(struct ListNode* head)');
    expect(code).toContain('struct ListNode {');
    expect(code).toContain('int val;');
    expect(code).toContain('struct ListNode *next;');
  });

  it('generates 3Sum C starter code with returnSize and returnColumnSizes', () => {
    const meta: ProblemMeta = {
      id: 15,
      className: 'Solution',
      methodName: 'threeSum',
      params: [{ name: 'nums', type: 'int[]' }],
      returnType: 'List<List<Integer>>',
      kind: 'function',
      comparator: 'unordered-nested',
      examples: [],
      constraints: [],
    };
    const code = generateCStarterCode(meta);
    expect(code).toContain('int** threeSum(int* nums, int numsSize, int* returnSize, int** returnColumnSizes)');
    expect(code).toContain('Return an array of arrays of size *returnSize');
  });

  it('generates Rotate Array C in-place starter code', () => {
    const meta: ProblemMeta = {
      id: 189,
      className: 'Solution',
      methodName: 'rotate',
      params: [
        { name: 'nums', type: 'int[]' },
        { name: 'k', type: 'int' },
      ],
      returnType: 'void',
      kind: 'inplace:0',
      comparator: 'exact',
      examples: [],
      constraints: [],
    };
    const code = generateCStarterCode(meta);
    expect(code).toContain('void rotate(int* nums, int numsSize, int k)');
  });

  it('generates Trie design problem C typedef struct and functions', () => {
    const meta: ProblemMeta = {
      id: 208,
      className: 'Trie',
      methodName: '',
      params: [],
      returnType: 'void',
      kind: 'class',
      comparator: 'exact',
      examples: [],
      constraints: [],
    };
    const code = generateCStarterCode(meta);
    expect(code).toContain('typedef struct {');
    expect(code).toContain('} Trie;');
    expect(code).toContain('Trie* trieCreate()');
    expect(code).toContain('void trieInsert(Trie* obj, char* word)');
    expect(code).toContain('bool trieSearch(Trie* obj, char* word)');
    expect(code).toContain('bool trieStartsWith(Trie* obj, char* prefix)');
    expect(code).toContain('void trieFree(Trie* obj)');
  });
});
