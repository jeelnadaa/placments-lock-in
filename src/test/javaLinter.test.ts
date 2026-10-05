import { describe, it, expect } from 'vitest';
import { EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { java } from '@codemirror/lang-java';
import { javaLinter } from '../components/editor/javaLinter';

function createMockView(doc: string): EditorView {
  const state = EditorState.create({
    doc,
    extensions: [java()],
  });
  return new EditorView({ state });
}

describe('Live Java Linter & Scope Diagnostics', () => {
  it('detects duplicate parameter re-declaration in method scope', () => {
    const code = `class Solution {
    public int twoSum(int[] nums, int target) {
        int target = 0;
        return target;
    }
}`;
    const view = createMockView(code);
    const diags = javaLinter(view);

    const redecl = diags.find((d) => d.message.includes("Variable 'target' is already defined"));
    expect(redecl).toBeDefined();
    expect(redecl?.severity).toBe('error');
  });

  it('detects duplicate local variable declaration in same scope', () => {
    const code = `class Solution {
    public int compute() {
        int count = 10;
        int count = 20;
        return count;
    }
}`;
    const view = createMockView(code);
    const diags = javaLinter(view);

    const redecl = diags.find((d) => d.message.includes("Variable 'count' is already defined"));
    expect(redecl).toBeDefined();
  });

  it('permits variables declared in disjoint loop blocks', () => {
    const code = `class Solution {
    public int loopTest() {
        for (int i = 0; i < 10; i++) {
        }
        for (int i = 0; i < 10; i++) {
        }
        return 0;
    }
}`;
    const view = createMockView(code);
    const diags = javaLinter(view);

    const redecl = diags.find((d) => d.message.includes('already defined'));
    expect(redecl).toBeUndefined();
  });

  it('detects missing return statement in non-void method', () => {
    const code = `class Solution {
    public int missingReturnMethod() {
        int a = 1;
        int b = 2;
    }
}`;
    const view = createMockView(code);
    const diags = javaLinter(view);

    const missingReturn = diags.find((d) => d.message.includes('Missing return statement'));
    expect(missingReturn).toBeDefined();
    expect(missingReturn?.message).toContain('missingReturnMethod');
    expect(missingReturn?.message).toContain('int');
  });

  it('does not flag void methods for missing return', () => {
    const code = `class Solution {
    public void voidMethod() {
        int a = 1;
    }
}`;
    const view = createMockView(code);
    const diags = javaLinter(view);

    const missingReturn = diags.find((d) => d.message.includes('Missing return statement'));
    expect(missingReturn).toBeUndefined();
  });

  it('detects unclosed string literal', () => {
    const code = `class Solution {
    public void test() {
        String msg = "unclosed string;
    }
}`;
    const view = createMockView(code);
    const diags = javaLinter(view);

    const unclosed = diags.find((d) => d.message.includes('Unclosed string literal'));
    expect(unclosed).toBeDefined();
  });

  it('detects missing semicolon syntax error', () => {
    const code = `class Solution {
    public int test() {
        int a = 10
        return a;
    }
}`;
    const view = createMockView(code);
    const diags = javaLinter(view);

    const semi = diags.find((d) => d.message.includes(';'));
    expect(semi).toBeDefined();
  });

  it('detects unreachable code after return statement', () => {
    const code = `class Solution {
    public int test() {
        return 1;
        int x = 2;
    }
}`;
    const view = createMockView(code);
    const diags = javaLinter(view);

    const unreachable = diags.find((d) => d.message.includes('Unreachable statement'));
    expect(unreachable).toBeDefined();
    expect(unreachable?.severity).toBe('error');
  });

  it('warns on suspicious assignment in if condition', () => {
    const code = `class Solution {
    public void test(int x) {
        if (x = 5) {
        }
    }
}`;
    const view = createMockView(code);
    const diags = javaLinter(view);

    const assignInCond = diags.find((d) => d.message.includes("Did you mean '=='"));
    expect(assignInCond).toBeDefined();
    expect(assignInCond?.severity).toBe('warning');
  });

  it('warns when comparing string literal with ==', () => {
    const code = `class Solution {
    public boolean test(String s) {
        return s == "target";
    }
}`;
    const view = createMockView(code);
    const diags = javaLinter(view);

    const strEq = diags.find((d) => d.message.includes('.equals(...)'));
    expect(strEq).toBeDefined();
    expect(strEq?.severity).toBe('warning');
  });

  it('detects Python/JS syntax leaks (def, let, elif, len, True)', () => {
    const code = `class Solution {
    def myMethod() {
        let x = 10;
        if (x > 0) {
            return True;
        } elif (x == 0) {
            return False;
        }
    }
}`;
    const view = createMockView(code);
    const diags = javaLinter(view);

    expect(diags.some((d) => d.message.includes("'def'"))).toBe(true);
    expect(diags.some((d) => d.message.includes("'let'"))).toBe(true);
    expect(diags.some((d) => d.message.includes("'else if'"))).toBe(true);
    expect(diags.some((d) => d.message.includes("'true'"))).toBe(true);
  });

  it('detects unmatched closing parenthesis and bracket', () => {
    const code = `class Solution {
    public int test() {
        int x = (1 + 2));
        int[] arr = [1, 2]];
        return x;
    }
}`;
    const view = createMockView(code);
    const diags = javaLinter(view);

    expect(diags.some((d) => d.message.includes("Unmatched closing parenthesis ')'"))).toBe(true);
    expect(diags.some((d) => d.message.includes("Unmatched closing bracket ']'"))).toBe(true);
  });
});
