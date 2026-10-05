import { describe, it, expect } from 'vitest';
import { EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { CompletionContext, Completion } from '@codemirror/autocomplete';
import { go } from '@codemirror/lang-go';
import { goLinter } from '../components/editor/goLinter';
import { goCompletionSource } from '../components/editor/goCompletions';
import { generateGoStarterCode } from '../utils/starterCode';
import { ProblemMeta } from '../types';

function createMockGoView(doc: string): EditorView {
  const state = EditorState.create({
    doc,
    extensions: [go()],
  });
  return new EditorView({ state });
}

function createGoCompletionContext(doc: string, pos: number, explicit = false): CompletionContext {
  const state = EditorState.create({ doc });
  return new CompletionContext(state, pos, explicit);
}

describe('Go Linter', () => {
  it('detects unclosed string literals', () => {
    const code = `func test() {
    s := "unclosed string
}`;
    const view = createMockGoView(code);
    const diags = goLinter(view);
    const unclosed = diags.find((d) => d.message.includes('Unclosed string literal'));
    expect(unclosed).toBeDefined();
  });

  it('detects unclosed character literals', () => {
    const code = `func test() {
    c := 'a
}`;
    const view = createMockGoView(code);
    const diags = goLinter(view);
    const unclosed = diags.find((d) => d.message.includes('Unclosed character literal'));
    expect(unclosed).toBeDefined();
  });

  it('detects mismatched brackets', () => {
    const code = `func test() {
    arr := []int{1, (2 + 3]}
}`;
    const view = createMockGoView(code);
    const diags = goLinter(view);
    const mismatch = diags.find((d) => d.message.includes('Mismatched closing'));
    expect(mismatch).toBeDefined();
  });

  it('detects opening brace on newline for func/if/for', () => {
    const code = `func test()
{
    return
}`;
    const view = createMockGoView(code);
    const diags = goLinter(view);
    const braceDiag = diags.find((d) => d.message.includes("opening brace '{' must be placed on the same line"));
    expect(braceDiag).toBeDefined();
  });

  it('detects arrow operator and suggests dot in Go', () => {
    const code = `func test(head *ListNode) int {
    return head->Val
}`;
    const view = createMockGoView(code);
    const diags = goLinter(view);
    const arrowDiag = diags.find((d) => d.message.includes("Use dot operator 'head.Val' instead of arrow '->'"));
    expect(arrowDiag).toBeDefined();
  });

  it('detects null and suggests nil in Go', () => {
    const code = `func test() *ListNode {
    return null
}`;
    const view = createMockGoView(code);
    const diags = goLinter(view);
    const nullDiag = diags.find((d) => d.message.includes("Use 'nil' instead of 'null' in Go"));
    expect(nullDiag).toBeDefined();
  });

  it('detects True / False and suggests true / false', () => {
    const code = `func test() bool {
    return True
}`;
    const view = createMockGoView(code);
    const diags = goLinter(view);
    const boolDiag = diags.find((d) => d.message.includes("Use 'true' instead of 'True' in Go"));
    expect(boolDiag).toBeDefined();
  });

  it('detects class keyword trap', () => {
    const code = `class Solution {
    func test() {}
}`;
    const view = createMockGoView(code);
    const diags = goLinter(view);
    const classDiag = diags.find((d) => d.message.includes('Classes are not supported in Go'));
    expect(classDiag).toBeDefined();
  });

  it('detects JS equality operators', () => {
    const code = `func test(a, b int) bool {
    return a === b
}`;
    const view = createMockGoView(code);
    const diags = goLinter(view);
    expect(diags.some((d) => d.message.includes("Use '==' instead of '==='"))).toBe(true);
  });

  it('passes on clean Go code', () => {
    const code = `func twoSum(nums []int, target int) []int {
    seen := make(map[int]int)
    for i, num := range nums {
        if idx, ok := seen[target-num]; ok {
            return []int{idx, i}
        }
        seen[num] = i
    }
    return nil
}`;
    const view = createMockGoView(code);
    const diags = goLinter(view);
    expect(diags.length).toBe(0);
  });
});

describe('Go Autocompletions', () => {
  it('suggests struct pointer member triggers for head.', async () => {
    const doc = 'head.';
    const ctx = createGoCompletionContext(doc, doc.length);
    const res = await goCompletionSource(ctx);
    expect(res).not.toBeNull();
    const labels = (res!.options as Completion[]).map((o) => o.label);
    expect(labels).toContain('Val');
    expect(labels).toContain('Next');
  });

  it('suggests struct pointer member triggers for root.', async () => {
    const doc = 'root.';
    const ctx = createGoCompletionContext(doc, doc.length);
    const res = await goCompletionSource(ctx);
    expect(res).not.toBeNull();
    const labels = (res!.options as Completion[]).map((o) => o.label);
    expect(labels).toContain('Val');
    expect(labels).toContain('Left');
    expect(labels).toContain('Right');
  });

  it('suggests fmt package functions after fmt.', async () => {
    const doc = 'fmt.';
    const ctx = createGoCompletionContext(doc, doc.length);
    const res = await goCompletionSource(ctx);
    expect(res).not.toBeNull();
    const labels = (res!.options as Completion[]).map((o) => o.label);
    expect(labels).toContain('Println');
    expect(labels).toContain('Printf');
    expect(labels).toContain('Sprintf');
  });

  it('suggests sort package functions after sort.', async () => {
    const doc = 'sort.';
    const ctx = createGoCompletionContext(doc, doc.length);
    const res = await goCompletionSource(ctx);
    expect(res).not.toBeNull();
    const labels = (res!.options as Completion[]).map((o) => o.label);
    expect(labels).toContain('Ints');
    expect(labels).toContain('Slice');
  });

  it('suggests built-in functions like append and make', async () => {
    const doc = 'app';
    const ctx = createGoCompletionContext(doc, doc.length);
    const res = await goCompletionSource(ctx);
    expect(res).not.toBeNull();
    const labels = (res!.options as Completion[]).map((o) => o.label);
    expect(labels).toContain('append');
    expect(labels).toContain('make');
  });
});

describe('Go Starter Code Generation', () => {
  it('generates Two Sum Go starter code with slices and types', () => {
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
    const code = generateGoStarterCode(meta);
    expect(code).toContain('func twoSum(nums []int, target int) []int {');
  });

  it('generates Reverse Linked List Go starter code with *ListNode', () => {
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
    const code = generateGoStarterCode(meta);
    expect(code).toContain('func reverseList(head *ListNode) *ListNode {');
    expect(code).toContain('type ListNode struct {');
    expect(code).toContain('Val int');
    expect(code).toContain('Next *ListNode');
  });

  it('generates 3Sum Go starter code with 2D slice [][]int', () => {
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
    const code = generateGoStarterCode(meta);
    expect(code).toContain('func threeSum(nums []int) [][]int {');
  });

  it('generates Rotate Array Go in-place starter code', () => {
    const meta: ProblemMeta = {
      id: 48,
      className: 'Solution',
      methodName: 'rotate',
      params: [{ name: 'matrix', type: 'int[][]' }],
      returnType: 'void',
      kind: 'inplace:0',
      comparator: 'exact',
      examples: [],
      constraints: [],
    };
    const code = generateGoStarterCode(meta);
    expect(code).toContain('func rotate(matrix [][]int) {');
  });

  it('generates Trie design problem Go type struct and methods', () => {
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
    const code = generateGoStarterCode(meta);
    expect(code).toContain('type Trie struct {');
    expect(code).toContain('func Constructor() Trie');
    expect(code).toContain('func (this *Trie) Insert(word string)');
    expect(code).toContain('func (this *Trie) Search(word string) bool');
    expect(code).toContain('func (this *Trie) StartsWith(prefix string) bool');
  });
});
