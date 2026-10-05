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

  it('matches null and [] equivalently for empty linked lists or data structures across languages', () => {
    expect(compareResults(null, [], 'exact')).toBe(true);
    expect(compareResults([], null, 'exact')).toBe(true);
    expect(compareResults('null', [], 'exact')).toBe(true);
    expect(compareResults([], 'null', 'exact')).toBe(true);
    expect(compareResults(null, [1], 'exact')).toBe(false);
    expect(compareResults([1], null, 'exact')).toBe(false);
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

  // Test Problem #206 Reverse Linked List: handles empty list returning null
  it('Problem #206 Reverse Linked List: Solution returning null for 0 nodes passes empty testcase', async () => {
    const code = `
class Solution {
    public ListNode reverseList(ListNode head) {
        ListNode prev = null;
        ListNode curr = head;
        while (curr != null) {
            ListNode nextTemp = curr.next;
            curr.next = prev;
            prev = curr;
            curr = nextTemp;
        }
        return prev;
    }
}
`;
    const res = await handleSubmitCode({ problemId: 206, code });
    expect(res.verdict).toBe('Accepted');
    expect(res.passed).toBe(res.total);
    expect(res.failing).toBeUndefined();
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

describe('Judge Execution & Verdicts (Local Python Runtime)', () => {
  it('Pilot #1 Two Sum (Python): Correct solution returns Accepted on submit', async () => {
    const pythonCode = `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        lookup = {}
        for i, num in enumerate(nums):
            comp = target - num
            if comp in lookup:
                return [lookup[comp], i]
            lookup[num] = i
        return []
`;
    const res = await handleSubmitCode({ problemId: 1, code: pythonCode, language: 'python' });
    expect(res.verdict).toBe('Accepted');
    expect(res.passed).toBe(res.total);
    expect(res.passed).toBeGreaterThan(0);
  }, 15000);

  it('Pilot #206 Reverse Linked List (Python): Correct solution returns Accepted on submit', async () => {
    const pythonCode = `class Solution:
    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:
        prev = None
        curr = head
        while curr:
            nxt = curr.next
            curr.next = prev
            prev = curr
            curr = nxt
        return prev
`;
    const res = await handleSubmitCode({ problemId: 206, code: pythonCode, language: 'python' });
    expect(res.verdict).toBe('Accepted');
    expect(res.passed).toBe(res.total);
  }, 15000);

  it('Pilot #48 Rotate Image (Python): Correct in-place matrix mutation returns Accepted', async () => {
    const pythonCode = `class Solution:
    def rotate(self, matrix: List[List[int]]) -> None:
        matrix.reverse()
        for i in range(len(matrix)):
            for j in range(i + 1, len(matrix)):
                matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]
`;
    const res = await handleSubmitCode({ problemId: 48, code: pythonCode, language: 'python' });
    expect(res.verdict).toBe('Accepted');
    expect(res.passed).toBe(res.total);
  }, 15000);

  it('Python syntax error returns Compile Error with line details', async () => {
    const brokenCode = `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]
        return 42
`;
    const res = await handleSubmitCode({ problemId: 1, code: brokenCode, language: 'python' });
    expect(res.verdict).toBe('Compile Error');
    expect(res.error).toBeDefined();
    expect(res.error?.toLowerCase()).toContain('syntaxerror');
  }, 15000);

  it('Python Wrong Answer reports failing case correctly', async () => {
    const wrongCode = `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        return [0, 0]
`;
    const res = await handleSubmitCode({ problemId: 1, code: wrongCode, language: 'python' });
    expect(res.verdict).toBe('Wrong Answer');
    expect(res.failing).toBeDefined();
    expect(res.failing?.index).toBe(1);
  }, 15000);

  it('Python Run custom/sample testcases via handleRunCode', async () => {
    const pythonCode = `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        lookup = {}
        for i, num in enumerate(nums):
            comp = target - num
            if comp in lookup:
                return [lookup[comp], i]
            lookup[num] = i
        return []
`;
    const res = await handleRunCode({
      problemId: 1,
      code: pythonCode,
      language: 'python',
      cases: [
        { inputs: { nums: [2, 7, 11, 15], target: 9 }, expected: [0, 1] },
        { inputs: { nums: [3, 2, 4], target: 6 }, expected: [1, 2] },
      ],
    });
    expect(res.verdict).toBe('Accepted');
    expect(res.results.length).toBe(2);
    expect(res.results[0].passed).toBe(true);
    expect(res.results[1].passed).toBe(true);
  }, 15000);
});

describe('Judge Execution & Verdicts (Local C++ Runtime)', () => {
  it('Pilot #1 Two Sum (C++): Correct solution returns Accepted on submit', async () => {
    const cppCode = `class Solution {
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
};
`;
    const res = await handleSubmitCode({ problemId: 1, code: cppCode, language: 'cpp' });
    expect(res.verdict).toBe('Accepted');
    expect(res.passed).toBe(res.total);
    expect(res.passed).toBeGreaterThan(0);
  }, 15000);

  it('Pilot #206 Reverse Linked List (C++): Correct solution returns Accepted on submit', async () => {
    const cppCode = `class Solution {
public:
    ListNode* reverseList(ListNode* head) {
        ListNode* prev = nullptr;
        ListNode* curr = head;
        while (curr) {
            ListNode* next = curr->next;
            curr->next = prev;
            prev = curr;
            curr = next;
        }
        return prev;
    }
};
`;
    const res = await handleSubmitCode({ problemId: 206, code: cppCode, language: 'cpp' });
    expect(res.verdict).toBe('Accepted');
    expect(res.passed).toBe(res.total);
  }, 15000);

  it('Pilot #48 Rotate Image (C++): Correct in-place matrix mutation returns Accepted', async () => {
    const cppCode = `class Solution {
public:
    void rotate(vector<vector<int>>& matrix) {
        reverse(matrix.begin(), matrix.end());
        for (int i = 0; i < matrix.size(); ++i) {
            for (int j = i + 1; j < matrix.size(); ++j) {
                swap(matrix[i][j], matrix[j][i]);
            }
        }
    }
};
`;
    const res = await handleSubmitCode({ problemId: 48, code: cppCode, language: 'cpp' });
    expect(res.verdict).toBe('Accepted');
    expect(res.passed).toBe(res.total);
  }, 15000);

  it('C++ syntax error returns Compile Error with line details', async () => {
    const brokenCode = `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        broken syntax here
    }
};
`;
    const res = await handleSubmitCode({ problemId: 1, code: brokenCode, language: 'cpp' });
    expect(res.verdict).toBe('Compile Error');
    expect(res.error).toBeDefined();
  }, 15000);

  it('C++ Wrong Answer reports failing case correctly', async () => {
    const wrongCode = `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        return {0, 0};
    }
};
`;
    const res = await handleSubmitCode({ problemId: 1, code: wrongCode, language: 'cpp' });
    expect(res.verdict).toBe('Wrong Answer');
    expect(res.failing).toBeDefined();
    expect(res.failing?.index).toBe(1);
  }, 15000);

  it('C++ Run custom/sample testcases via handleRunCode', async () => {
    const cppCode = `class Solution {
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
};
`;
    const res = await handleRunCode({
      problemId: 1,
      code: cppCode,
      language: 'cpp',
      cases: [
        { inputs: { nums: [2, 7, 11, 15], target: 9 }, expected: [0, 1] },
        { inputs: { nums: [3, 2, 4], target: 6 }, expected: [1, 2] },
      ],
    });
    expect(res.verdict).toBe('Accepted');
    expect(res.results.length).toBe(2);
    expect(res.results[0].passed).toBe(true);
    expect(res.results[1].passed).toBe(true);
  }, 15000);

  // ==========================================
  // C Tests
  // ==========================================

  it('Pilot #1 Two Sum (C): Correct solution returns Accepted on all testcases', async () => {
    const cCode = `int* twoSum(int* nums, int numsSize, int target, int* returnSize) {
    *returnSize = 2;
    int* res = (int*)malloc(2 * sizeof(int));
    int cap = 65536;
    int* keys = (int*)malloc(cap * sizeof(int));
    int* vals = (int*)malloc(cap * sizeof(int));
    bool* used = (bool*)calloc(cap, sizeof(bool));

    for (int i = 0; i < numsSize; ++i) {
        int comp = target - nums[i];
        int h = (comp % cap + cap) % cap;
        while (used[h]) {
            if (keys[h] == comp) {
                res[0] = vals[h];
                res[1] = i;
                free(keys);
                free(vals);
                free(used);
                return res;
            }
            h = (h + 1) % cap;
        }

        int nh = (nums[i] % cap + cap) % cap;
        while (used[nh] && keys[nh] != nums[i]) {
            nh = (nh + 1) % cap;
        }
        used[nh] = true;
        keys[nh] = nums[i];
        vals[nh] = i;
    }
    free(keys);
    free(vals);
    free(used);
    return res;
}
`;
    const res = await handleSubmitCode({ problemId: 1, code: cCode, language: 'c' });
    expect(res.verdict).toBe('Accepted');
    expect(res.passed).toBe(res.total);
    expect(res.runtimeMs).toBeGreaterThanOrEqual(0);
  }, 15000);

  it('Pilot #206 Reverse Linked List (C): Correct struct ListNode* reversal returns Accepted', async () => {
    const cCode = `struct ListNode* reverseList(struct ListNode* head) {
    struct ListNode* prev = NULL;
    struct ListNode* curr = head;
    while (curr) {
        struct ListNode* next = curr->next;
        curr->next = prev;
        prev = curr;
        curr = next;
    }
    return prev;
}
`;
    const res = await handleSubmitCode({ problemId: 206, code: cCode, language: 'c' });
    expect(res.verdict).toBe('Accepted');
    expect(res.passed).toBe(res.total);
  }, 15000);

  it('C syntax error returns Compile Error with line details', async () => {
    const brokenCode = `int* twoSum(int* nums, int numsSize, int target, int* returnSize) {
    invalid c syntax here
}
`;
    const res = await handleSubmitCode({ problemId: 1, code: brokenCode, language: 'c' });
    expect(res.verdict).toBe('Compile Error');
    expect(res.error).toBeDefined();
  }, 15000);

  it('C Wrong Answer reports failing case correctly', async () => {
    const wrongCode = `int* twoSum(int* nums, int numsSize, int target, int* returnSize) {
    *returnSize = 2;
    int* res = (int*)malloc(2 * sizeof(int));
    res[0] = 0;
    res[1] = 0;
    return res;
}
`;
    const res = await handleSubmitCode({ problemId: 1, code: wrongCode, language: 'c' });
    expect(res.verdict).toBe('Wrong Answer');
    expect(res.failing).toBeDefined();
    expect(res.failing?.index).toBe(1);
  }, 15000);

  it('C Run custom/sample testcases via handleRunCode', async () => {
    const cCode = `int* twoSum(int* nums, int numsSize, int target, int* returnSize) {
    *returnSize = 2;
    int* res = (int*)malloc(2 * sizeof(int));
    for (int i = 0; i < numsSize; ++i) {
        for (int j = i + 1; j < numsSize; ++j) {
            if (nums[i] + nums[j] == target) {
                res[0] = i;
                res[1] = j;
                return res;
            }
        }
    }
    return res;
}
`;
    const res = await handleRunCode({
      problemId: 1,
      code: cCode,
      language: 'c',
      cases: [
        { inputs: { nums: [2, 7, 11, 15], target: 9 }, expected: [0, 1] },
        { inputs: { nums: [3, 2, 4], target: 6 }, expected: [1, 2] },
      ],
    });
    expect(res.verdict).toBe('Accepted');
    expect(res.results.length).toBe(2);
    expect(res.results[0].passed).toBe(true);
    expect(res.results[1].passed).toBe(true);
  }, 15000);

  // ==========================================
  // Go Tests
  // ==========================================

  it('Pilot #1 Two Sum (Go): Correct solution returns Accepted on all testcases', async () => {
    const goCode = `func twoSum(nums []int, target int) []int {
    seen := make(map[int]int)
    for i, num := range nums {
        if idx, ok := seen[target-num]; ok {
            return []int{idx, i}
        }
        seen[num] = i
    }
    return nil
}
`;
    const res = await handleSubmitCode({ problemId: 1, code: goCode, language: 'go' });
    expect(res.verdict).toBe('Accepted');
    expect(res.passed).toBe(res.total);
    expect(res.runtimeMs).toBeGreaterThanOrEqual(0);
  }, 15000);

  it('Pilot #206 Reverse Linked List (Go): Correct *ListNode reversal returns Accepted', async () => {
    const goCode = `func reverseList(head *ListNode) *ListNode {
    var prev *ListNode = nil
    curr := head
    for curr != nil {
        next := curr.Next
        curr.Next = prev
        prev = curr
        curr = next
    }
    return prev
}
`;
    const res = await handleSubmitCode({ problemId: 206, code: goCode, language: 'go' });
    expect(res.verdict).toBe('Accepted');
    expect(res.passed).toBe(res.total);
  }, 15000);

  it('Pilot #48 Rotate Image (Go): Correct in-place matrix mutation returns Accepted', async () => {
    const goCode = `func rotate(matrix [][]int) {
    n := len(matrix)
    for i := 0; i < n/2; i++ {
        matrix[i], matrix[n-1-i] = matrix[n-1-i], matrix[i]
    }
    for i := 0; i < n; i++ {
        for j := i + 1; j < n; j++ {
            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]
        }
    }
}
`;
    const res = await handleSubmitCode({ problemId: 48, code: goCode, language: 'go' });
    expect(res.verdict).toBe('Accepted');
    expect(res.passed).toBe(res.total);
  }, 15000);

  it('Go syntax error returns Compile Error with line details', async () => {
    const brokenCode = `func twoSum(nums []int, target int) []int {
    invalid go syntax here
}
`;
    const res = await handleSubmitCode({ problemId: 1, code: brokenCode, language: 'go' });
    expect(res.verdict).toBe('Compile Error');
    expect(res.error).toBeDefined();
  }, 15000);

  it('Go Wrong Answer reports failing case correctly', async () => {
    const wrongCode = `func twoSum(nums []int, target int) []int {
    return []int{0, 0}
}
`;
    const res = await handleSubmitCode({ problemId: 1, code: wrongCode, language: 'go' });
    expect(res.verdict).toBe('Wrong Answer');
    expect(res.failing).toBeDefined();
    expect(res.failing?.index).toBe(1);
  }, 15000);

  it('Go Run custom/sample testcases via handleRunCode', async () => {
    const goCode = `func twoSum(nums []int, target int) []int {
    seen := make(map[int]int)
    for i, num := range nums {
        if idx, ok := seen[target-num]; ok {
            return []int{idx, i}
        }
        seen[num] = i
    }
    return nil
}
`;
    const res = await handleRunCode({
      problemId: 1,
      code: goCode,
      language: 'go',
      cases: [
        { inputs: { nums: [2, 7, 11, 15], target: 9 }, expected: [0, 1] },
        { inputs: { nums: [3, 2, 4], target: 6 }, expected: [1, 2] },
      ],
    });
    expect(res.verdict).toBe('Accepted');
    expect(res.results.length).toBe(2);
    expect(res.results[0].passed).toBe(true);
    expect(res.results[1].passed).toBe(true);
  }, 15000);
});


