import { describe, it, expect } from 'vitest';
import { EditorState } from '@codemirror/state';
import { CompletionContext, Completion } from '@codemirror/autocomplete';
import { javaCompletionSource } from '../components/editor/javaCompletions';

function createContext(doc: string, pos: number, explicit = false): CompletionContext {
  const state = EditorState.create({ doc });
  return new CompletionContext(state, pos, explicit);
}

describe('Java Autocompletions (Dot-member & standard)', () => {
  it('provides all Map methods when typing after "map."', async () => {
    const doc = `
class Solution {
    public void test() {
        Map<Integer, Integer> map = new HashMap<>();
        map.
    }
}
`;
    const dotPos = doc.indexOf('map.') + 4; // cursor right after dot
    const ctx = createContext(doc, dotPos, true);
    const res = await javaCompletionSource(ctx);

    expect(res).not.toBeNull();
    expect(res?.from).toBe(dotPos); // Replaces AFTER the dot
    const labels = (res?.options || []).map((o: Completion) => o.label);
    expect(labels).toContain('put');
    expect(labels).toContain('get');
    expect(labels).toContain('getOrDefault');
    expect(labels).toContain('containsKey');
    expect(labels).toContain('size');
    expect(labels).toContain('isEmpty');
    expect(labels).toContain('keySet');
    expect(labels).toContain('values');
    expect(labels).toContain('entrySet');
  });

  it('filters member completions when typing "map.p"', async () => {
    const doc = `
class Solution {
    public void test() {
        Map<String, Integer> map = new HashMap<>();
        map.p
    }
}
`;
    const pos = doc.indexOf('map.p') + 5; // cursor right after "p"
    const ctx = createContext(doc, pos, true);
    const res = await javaCompletionSource(ctx);

    expect(res).not.toBeNull();
    // from must be at the position of 'p' so CodeMirror filters by 'p'
    expect(res?.from).toBe(pos - 1);
    const labels = (res?.options || []).map((o: Completion) => o.label);
    expect(labels).toContain('put');
    expect(labels).toContain('putIfAbsent');
  });

  it('provides List methods when typing after "list."', async () => {
    const doc = `
class Solution {
    public void test() {
        List<Integer> list = new ArrayList<>();
        list.
    }
}
`;
    const dotPos = doc.indexOf('list.') + 5;
    const ctx = createContext(doc, dotPos, true);
    const res = await javaCompletionSource(ctx);

    expect(res).not.toBeNull();
    const labels = (res?.options || []).map((o: Completion) => o.label);
    expect(labels).toContain('add');
    expect(labels).toContain('get');
    expect(labels).toContain('size');
    expect(labels).toContain('remove');
  });

  it('provides String methods when typing after "s."', async () => {
    const doc = `
class Solution {
    public void test() {
        String s = "hello";
        s.
    }
}
`;
    const dotPos = doc.indexOf('s.') + 2;
    const ctx = createContext(doc, dotPos, true);
    const res = await javaCompletionSource(ctx);

    expect(res).not.toBeNull();
    const labels = (res?.options || []).map((o: Completion) => o.label);
    expect(labels).toContain('length');
    expect(labels).toContain('charAt');
    expect(labels).toContain('substring');
    expect(labels).toContain('indexOf');
  });

  it('provides ListNode members (val, next) on "head."', async () => {
    const doc = `
class Solution {
    public ListNode reverseList(ListNode head) {
        head.
    }
}
`;
    const dotPos = doc.indexOf('head.') + 5;
    const ctx = createContext(doc, dotPos, true);
    const res = await javaCompletionSource(ctx);

    expect(res).not.toBeNull();
    const labels = (res?.options || []).map((o: Completion) => o.label);
    expect(labels).toContain('val');
    expect(labels).toContain('next');
  });

  it('provides static methods on "Arrays."', async () => {
    const doc = `
class Solution {
    public void test() {
        Arrays.
    }
}
`;
    const dotPos = doc.indexOf('Arrays.') + 7;
    const ctx = createContext(doc, dotPos, true);
    const res = await javaCompletionSource(ctx);

    expect(res).not.toBeNull();
    const labels = (res?.options || []).map((o: Completion) => o.label);
    expect(labels).toContain('sort');
    expect(labels).toContain('fill');
    expect(labels).toContain('binarySearch');
  });

  it('provides static methods on "Math."', async () => {
    const doc = `
class Solution {
    public void test() {
        Math.
    }
}
`;
    const dotPos = doc.indexOf('Math.') + 5;
    const ctx = createContext(doc, dotPos, true);
    const res = await javaCompletionSource(ctx);

    expect(res).not.toBeNull();
    const labels = (res?.options || []).map((o: Completion) => o.label);
    expect(labels).toContain('max');
    expect(labels).toContain('min');
    expect(labels).toContain('abs');
  });

  it('provides general classes and keywords when typing identifiers', async () => {
    const doc = `
class Solution {
    public void test() {
        Hash
    }
}
`;
    const pos = doc.indexOf('Hash') + 4;
    const ctx = createContext(doc, pos, true);
    const res = await javaCompletionSource(ctx);

    expect(res).not.toBeNull();
    const labels = (res?.options || []).map((o: Completion) => o.label);
    expect(labels).toContain('HashMap');
    expect(labels).toContain('HashSet');
  });
});
