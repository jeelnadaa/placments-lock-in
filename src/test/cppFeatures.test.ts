import { describe, it, expect } from 'vitest';
import { EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { CompletionContext, Completion } from '@codemirror/autocomplete';
import { cpp } from '@codemirror/lang-cpp';
import { cppLinter } from '../components/editor/cppLinter';
import { cppCompletionSource } from '../components/editor/cppCompletions';
import { generateCppStarterCode } from '../utils/starterCode';
import { ProblemMeta } from '../types';

function createMockCppView(doc: string): EditorView {
  const state = EditorState.create({
    doc,
    extensions: [cpp()],
  });
  return new EditorView({ state });
}

function createCppCompletionContext(doc: string, pos: number, explicit = false): CompletionContext {
  const state = EditorState.create({ doc });
  return new CompletionContext(state, pos, explicit);
}

describe('C++ Linter', () => {
  it('detects unclosed strings and characters', () => {
    const code = `class Solution {
    string s = "unclosed text;
};`;
    const view = createMockCppView(code);
    const diags = cppLinter(view);
    const unclosed = diags.find((d) => d.message.includes('Unclosed string literal'));
    expect(unclosed).toBeDefined();
  });

  it('detects mismatched brackets', () => {
    const code = `class Solution {
    void test() {
        vector<int> v = {1, 2, (3 + 4]};
    }
};`;
    const view = createMockCppView(code);
    const diags = cppLinter(view);
    const mismatch = diags.find((d) => d.message.includes('Mismatched closing'));
    expect(mismatch).toBeDefined();
  });

  it('detects missing semicolon after class definition', () => {
    const code = `class Solution {
    int test() {
        return 0;
    }
}`;
    const view = createMockCppView(code);
    const diags = cppLinter(view);
    const missingSemi = diags.find((d) => d.message.includes("Missing ';' after class"));
    expect(missingSemi).toBeDefined();
  });

  it('detects missing semicolon at end of statement', () => {
    const code = `class Solution {
public:
    int test() {
        int x = 42
        return x;
    }
};`;
    const view = createMockCppView(code);
    const diags = cppLinter(view);
    const missingSemi = diags.find((d) => d.message.includes("Missing ';' at end of statement"));
    expect(missingSemi).toBeDefined();
  });

  it('detects null instead of nullptr warning', () => {
    const code = `class Solution {
public:
    ListNode* test() {
        return null;
    }
};`;
    const view = createMockCppView(code);
    const diags = cppLinter(view);
    const nullDiag = diags.find((d) => d.message.includes("Use 'nullptr' instead of 'null'"));
    expect(nullDiag).toBeDefined();
  });

  it('detects pointer dot access and suggests arrow -> operator', () => {
    const code = `class Solution {
public:
    int test(ListNode* head) {
        return head.val;
    }
};`;
    const view = createMockCppView(code);
    const diags = cppLinter(view);
    const ptrDiag = diags.find((d) => d.message.includes("Use arrow operator 'head->val'"));
    expect(ptrDiag).toBeDefined();
  });

  it('passes on clean C++ code', () => {
    const code = `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> seen;
        for (int i = 0; i < nums.size(); ++i) {
            int comp = target - nums[i];
            if (seen.count(comp)) {
                return {seen[comp], i};
            }
            seen[nums[i]] = i;
        }
        return {};
    }
};`;
    const view = createMockCppView(code);
    const diags = cppLinter(view);
    expect(diags.length).toBe(0);
  });
});

describe('C++ Autocompletions', () => {
  it('provides vector methods after typing dot on vector variables', async () => {
    const doc = `class Solution {
    void test() {
        vector<int> nums;
        nums.
    }
};`;
    const dotPos = doc.indexOf('nums.') + 5;
    const ctx = createCppCompletionContext(doc, dotPos, true);
    const res = await cppCompletionSource(ctx);

    expect(res).not.toBeNull();
    const labels = (res?.options || []).map((o: Completion) => o.label);
    expect(labels).toContain('push_back');
    expect(labels).toContain('pop_back');
    expect(labels).toContain('size');
    expect(labels).toContain('empty');
  });

  it('provides map methods after typing dot on map variables', async () => {
    const doc = `class Solution {
    void test() {
        unordered_map<int, int> map;
        map.
    }
};`;
    const dotPos = doc.indexOf('map.') + 4;
    const ctx = createCppCompletionContext(doc, dotPos, true);
    const res = await cppCompletionSource(ctx);

    expect(res).not.toBeNull();
    const labels = (res?.options || []).map((o: Completion) => o.label);
    expect(labels).toContain('find');
    expect(labels).toContain('count');
    expect(labels).toContain('insert');
    expect(labels).toContain('emplace');
  });

  it('provides pointer member completions after typing arrow -> on head or root', async () => {
    const doc = `class Solution {
    void test(ListNode* head) {
        head->
    }
};`;
    const arrowPos = doc.indexOf('head->') + 6;
    const ctx = createCppCompletionContext(doc, arrowPos, true);
    const res = await cppCompletionSource(ctx);

    expect(res).not.toBeNull();
    const labels = (res?.options || []).map((o: Completion) => o.label);
    expect(labels).toContain('val');
    expect(labels).toContain('next');
  });

  it('provides std algorithms after typing "std::"', async () => {
    const doc = `void test() {
    std::
}`;
    const pos = doc.indexOf('std::') + 5;
    const ctx = createCppCompletionContext(doc, pos, true);
    const res = await cppCompletionSource(ctx);

    expect(res).not.toBeNull();
    const labels = (res?.options || []).map((o: Completion) => o.label);
    expect(labels).toContain('sort');
    expect(labels).toContain('reverse');
    expect(labels).toContain('max');
    expect(labels).toContain('min');
  });
});

describe('generateCppStarterCode', () => {
  it('generates standard signature for Two Sum', () => {
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
    const code = generateCppStarterCode(meta);
    expect(code).toContain('class Solution {');
    expect(code).toContain('vector<int> twoSum(vector<int>& nums, int target) {');
    expect(code).toContain('};');
  });

  it('generates ListNode* signature and comment for Reverse Linked List', () => {
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
    const code = generateCppStarterCode(meta);
    expect(code).toContain('struct ListNode {');
    expect(code).toContain('ListNode* reverseList(ListNode* head) {');
  });

  it('generates TreeNode* signature and comment for Invert Binary Tree', () => {
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
    const code = generateCppStarterCode(meta);
    expect(code).toContain('struct TreeNode {');
    expect(code).toContain('TreeNode* invertTree(TreeNode* root) {');
  });

  it('generates void return type for inplace Rotate Image', () => {
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
    const code = generateCppStarterCode(meta);
    expect(code).toContain('void rotate(vector<vector<int>>& matrix) {');
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
    const code = generateCppStarterCode(meta);
    expect(code).toContain('class Trie {');
    expect(code).toContain('Trie() {');
    expect(code).toContain('void insert(string word) {');
    expect(code).toContain('bool search(string word) {');
    expect(code).toContain('bool startsWith(string prefix) {');
  });
});
