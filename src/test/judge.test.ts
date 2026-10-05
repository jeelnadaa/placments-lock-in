import { describe, it, expect } from 'vitest';
import { handleRunCode, handleSubmitCode } from '../../server/companion';
import { compareResults } from '../../server/judge/comparators';

describe('Judge Comparators', () => {
  it('exact comparator matches identical primitives and ordered arrays', () => {
    expect(compareResults(123, 123, 'exact')).toBe(true);
    expect(compareResults(123, 456, 'exact')).toBe(false);
    expect(compareResults('racecar', 'racecar', 'exact')).toBe(true);
    expect(compareResults([1, 2, 3], [1, 2, 3], 'exact')).toBe(true);
    expect(compareResults([1, 2, 3], [3, 2, 1], 'exact')).toBe(false);
  });

  it('unordered comparator matches arrays regardless of element order', () => {
    expect(compareResults([0, 1], [1, 0], 'unordered')).toBe(true);
    expect(compareResults([1, 2, 3], [3, 1, 2], 'unordered')).toBe(true);
    expect(compareResults([1, 2, 3], [1, 2, 4], 'unordered')).toBe(false);
    expect(compareResults([1, 2, 2], [1, 1, 2], 'unordered')).toBe(false);
  });

  it('unordered-nested comparator matches 2D arrays with inner and outer permuted', () => {
    const actual = [[-1, 0, 1], [-1, -1, 2]];
    const expected = [[2, -1, -1], [0, 1, -1]];
    expect(compareResults(actual, expected, 'unordered-nested')).toBe(true);

    const wrong = [[-1, 0, 1], [0, 0, 0]];
    expect(compareResults(wrong, expected, 'unordered-nested')).toBe(false);
  });

  it('checker comparator validates using custom function', () => {
    const checker = (inputs: Record<string, unknown>, actual: unknown) => {
      const s = inputs.s as string;
      const str = String(actual);
      return s.includes(str) && str === str.split('').reverse().join('');
    };
    expect(compareResults('aba', 'aba', 'checker', { s: 'babad' }, checker)).toBe(true);
    expect(compareResults('bab', 'aba', 'checker', { s: 'babad' }, checker)).toBe(true);
    expect(compareResults('bad', 'aba', 'checker', { s: 'babad' }, checker)).toBe(false);
  });
});

describe('Judge Execution & Verdicts (Local Java Runtime)', () => {
  // Test Accepted verdict on Pilot #1 (Two Sum)
  it('Pilot #1 Two Sum: Correct reference solution returns Accepted on submit', async () => {
    const code = `
class Solution {
    public int[] twoSum(int[] nums, int target) {
        java.util.Map<Integer, Integer> map = new java.util.HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int comp = target - nums[i];
            if (map.containsKey(comp)) {
                return new int[] { map.get(comp), i };
            }
            map.put(nums[i], i);
        }
        return new int[0];
    }
}
`;
    const res = await handleSubmitCode({ problemId: 1, code });
    expect(res.verdict).toBe('Accepted');
    expect(res.passed).toBe(res.total);
    expect(res.total).toBeGreaterThanOrEqual(15);
    expect(res.failing).toBeUndefined();
    expect(res.runtimeMs).toBeGreaterThanOrEqual(0);
  }, 15000);

  // Test Wrong Answer verdict on Pilot #1 (Two Sum)
  it('Pilot #1 Two Sum: Incorrect solution returns Wrong Answer with ONLY first failing test', async () => {
    const wrongCode = `
class Solution {
    public int[] twoSum(int[] nums, int target) {
        return new int[] { 0, 0 }; // Intentionally wrong
    }
}
`;
    const res = await handleSubmitCode({ problemId: 1, code: wrongCode });
    expect(res.verdict).toBe('Wrong Answer');
    expect(res.passed).toBeLessThan(res.total);
    expect(res.failing).toBeDefined();
    // Verify failing payload contains ONLY the single failing test
    expect(res.failing?.index).toBeDefined();
    expect(res.failing?.input).toBeDefined();
    expect(res.failing?.actual).toBeDefined();
    expect(res.failing?.expected).toBeDefined();
    // Must NOT reveal all tests array
    expect((res as any).allTests).toBeUndefined();
    expect((res as any).hiddenTests).toBeUndefined();
  }, 15000);

  // Test Compile Error verdict
  it('Compile Error: Syntax errors return Compile Error verdict', async () => {
    const syntaxErrorCode = `
class Solution {
    public int[] twoSum(int[] nums, int target) {
        this is not valid java code;
    }
}
`;
    const res = await handleSubmitCode({ problemId: 1, code: syntaxErrorCode });
    expect(res.verdict).toBe('Compile Error');
    expect(res.compileError).toBeDefined();
    expect(res.compileError).toContain('Solution.java');
  }, 15000);

  // Test Runtime Error verdict
  it('Runtime Error: Uncaught exceptions return Runtime Error verdict with message and Solution line', async () => {
    const runtimeErrorCode = `
class Solution {
    public int[] twoSum(int[] nums, int target) {
        throw new IllegalArgumentException("Simulated runtime failure");
    }
}
`;
    const res = await handleSubmitCode({ problemId: 1, code: runtimeErrorCode });
    expect(res.verdict).toBe('Runtime Error');
    expect(res.failing).toBeDefined();
    expect(res.failing?.error).toContain('IllegalArgumentException');
    expect(res.failing?.error).toContain('Simulated runtime failure');
  }, 15000);

  // Test Time Limit Exceeded verdict
  it('Time Limit Exceeded: Infinite loop stops and returns Time Limit Exceeded', async () => {
    const tleCode = `
class Solution {
    public int[] twoSum(int[] nums, int target) {
        while (true) {
            // Infinite loop
        }
    }
}
`;
    const res = await handleRunCode({
      problemId: 1,
      code: tleCode,
      cases: [{ inputs: { nums: [2, 7, 11, 15], target: 9 }, expected: [0, 1] }],
    });
    expect(res.verdict).toBe('Time Limit Exceeded');
  }, 15000);

  // Test In-Place Modification (Pilot #48 Rotate Image)
  it('Pilot #48 Rotate Image: in-place modification is captured and judged', async () => {
    const rotateCode = `
class Solution {
    public void rotate(int[][] matrix) {
        int n = matrix.length;
        for (int i = 0; i < n; i++) {
            for (int j = i; j < n; j++) {
                int temp = matrix[i][j];
                matrix[i][j] = matrix[j][i];
                matrix[j][i] = temp;
            }
        }
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n / 2; j++) {
                int temp = matrix[i][j];
                matrix[i][j] = matrix[i][n - 1 - j];
                matrix[i][n - 1 - j] = temp;
            }
        }
    }
}
`;
    const res = await handleSubmitCode({ problemId: 48, code: rotateCode });
    expect(res.verdict).toBe('Accepted');
    expect(res.passed).toBe(res.total);
  }, 15000);

  // Test Custom Class / Operations & Args (Pilot #208 Implement Trie)
  it('Pilot #208 Implement Trie: class design operations and args work correctly', async () => {
    const trieCode = `
class Trie {
    private Trie[] children = new Trie[26];
    private boolean isEnd = false;

    public Trie() {}

    public void insert(String word) {
        Trie curr = this;
        for (char c : word.toCharArray()) {
            int idx = c - 'a';
            if (curr.children[idx] == null) curr.children[idx] = new Trie();
            curr = curr.children[idx];
        }
        curr.isEnd = true;
    }

    public boolean search(String word) {
        Trie curr = this;
        for (char c : word.toCharArray()) {
            int idx = c - 'a';
            if (curr.children[idx] == null) return false;
            curr = curr.children[idx];
        }
        return curr.isEnd;
    }

    public boolean startsWith(String prefix) {
        Trie curr = this;
        for (char c : prefix.toCharArray()) {
            int idx = c - 'a';
            if (curr.children[idx] == null) return false;
            curr = curr.children[idx];
        }
        return true;
    }
}
`;
    const res = await handleSubmitCode({ problemId: 208, code: trieCode });
    expect(res.verdict).toBe('Accepted');
    expect(res.passed).toBe(res.total);
  }, 15000);
});

describe('Security & Hidden Tests Protection', () => {
  it('Accepted submission returns zero hidden test details (no data leakage)', async () => {
    const code = `
class Solution {
    public boolean isPalindrome(String s) {
        int i = 0, j = s.length() - 1;
        while (i < j) {
            while (i < j && !Character.isLetterOrDigit(s.charAt(i))) i++;
            while (i < j && !Character.isLetterOrDigit(s.charAt(j))) j--;
            if (Character.toLowerCase(s.charAt(i)) != Character.toLowerCase(s.charAt(j))) return false;
            i++;
            j--;
        }
        return true;
    }
}
`;
    const res = await handleSubmitCode({ problemId: 125, code });
    expect(res.verdict).toBe('Accepted');
    expect(res.failing).toBeUndefined();
    // Neither inputs nor expected outputs are exposed on success
    expect((res as any).inputs).toBeUndefined();
    expect((res as any).expected).toBeUndefined();
    expect((res as any).testOutputs).toBeUndefined();
  }, 15000);
});
