const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();

// Helper to write file safely
function writeContent(subPath, content) {
  const fullPath = path.join(rootDir, subPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log('Created:', subPath);
}

// -------------------------------------------------------------
// 1. Two Sum (#1)
// -------------------------------------------------------------
const p1Meta = {
  id: 1,
  className: "Solution",
  methodName: "twoSum",
  params: [
    { name: "nums", type: "int[]" },
    { name: "target", type: "int" }
  ],
  returnType: "int[]",
  kind: "function",
  comparator: "unordered",
  timeLimitMs: 2000,
  memoryLimitMb: 256,
  examples: [
    { input: { nums: [2, 7, 11, 15], target: 9 }, output: [0, 1] },
    { input: { nums: [3, 2, 4], target: 6 }, output: [1, 2] },
    { input: { nums: [3, 3], target: 6 }, output: [0, 1] }
  ],
  constraints: [
    "2 <= nums.length <= 10^4",
    "-10^9 <= nums[i] <= 10^9",
    "-10^9 <= target <= 10^9",
    "Only one valid answer exists."
  ],
  followUp: "Can you design an algorithm that runs in faster than O(n^2) time complexity?"
};

const p1Statement = `# Two Sum

Given an array of integers \`nums\` and an integer \`target\`, find the indices of two distinct elements in the array whose values sum to \`target\`.

Each test input is guaranteed to have exactly one valid solution. You may not use the same element twice.

The returned indices may appear in any order.

[Official LeetCode Problem #1](https://leetcode.com/problems/two-sum/)
`;

const p1Starter = `class Solution {
    public int[] twoSum(int[] nums, int target) {
        
    }
}
`;

const p1Ref = `import java.util.HashMap;
import java.util.Map;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[]{map.get(complement), i};
            }
            map.put(nums[i], i);
        }
        return new int[]{};
    }
}
`;

const p1Hidden = [];
// Generate 20 testcases
const p1BaseTests = [
  { nums: [1, 5, 8, 12, 19], target: 13, expected: [1, 2] },
  { nums: [-3, 4, 3, 90], target: 0, expected: [0, 2] },
  { nums: [-10, -5, -3, -1], target: -8, expected: [1, 2] },
  { nums: [0, 4, 3, 0], target: 0, expected: [0, 3] },
  { nums: [1000000000, 3, 5, -1000000000], target: 0, expected: [0, 3] },
  { nums: [5, 75, 25], target: 100, expected: [1, 2] },
  { nums: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], target: 19, expected: [8, 9] },
  { nums: [2, 5, 5, 11], target: 10, expected: [1, 2] }
];
p1BaseTests.forEach(t => p1Hidden.push({ inputs: { nums: t.nums, target: t.target }, expected: t.expected }));

for (let s = 10; s <= 20; s++) {
  const arr = [];
  for (let i = 0; i < s * 100; i++) arr.push(i * 2 + 1);
  arr.push(100000);
  arr.push(200000);
  p1Hidden.push({
    inputs: { nums: arr, target: 300000 },
    expected: [arr.length - 2, arr.length - 1]
  });
}

writeContent('content/problems/1/meta.json', JSON.stringify(p1Meta, null, 2));
writeContent('content/problems/1/statement.md', p1Statement);
writeContent('content/problems/1/starter/Solution.java', p1Starter);
writeContent('server/private/1/Solution.java', p1Ref);
writeContent('server/private/1/tests.json', JSON.stringify(p1Hidden, null, 2));

// -------------------------------------------------------------
// 125. Valid Palindrome
// -------------------------------------------------------------
const p125Meta = {
  id: 125,
  className: "Solution",
  methodName: "isPalindrome",
  params: [{ name: "s", type: "String" }],
  returnType: "boolean",
  kind: "function",
  comparator: "exact",
  timeLimitMs: 2000,
  memoryLimitMb: 256,
  examples: [
    { input: { s: "A man, a plan, a canal: Panama" }, output: true },
    { input: { s: "race a car" }, output: false },
    { input: { s: " " }, output: true }
  ],
  constraints: [
    "1 <= s.length <= 2 * 10^5",
    "s consists only of printable ASCII characters."
  ]
};

const p125Statement = `# Valid Palindrome

A string is defined as a palindrome if, after converting all uppercase letters into lowercase and removing all non-alphanumeric characters, it reads the identical sequence from left to right and right to left.

Given a string \`s\`, return \`true\` if it is a palindrome, or \`false\` otherwise.

[Official LeetCode Problem #125](https://leetcode.com/problems/valid-palindrome/)
`;

const p125Starter = `class Solution {
    public boolean isPalindrome(String s) {
        
    }
}
`;

const p125Ref = `class Solution {
    public boolean isPalindrome(String s) {
        int i = 0, j = s.length() - 1;
        while (i < j) {
            while (i < j && !Character.isLetterOrDigit(s.charAt(i))) i++;
            while (i < j && !Character.isLetterOrDigit(s.charAt(j))) j--;
            if (Character.toLowerCase(s.charAt(i)) != Character.toLowerCase(s.charAt(j))) {
                return false;
            }
            i++;
            j--;
        }
        return true;
    }
}
`;

const p125Hidden = [
  { inputs: { s: "ab_a" }, expected: true },
  { inputs: { s: "0P" }, expected: false },
  { inputs: { s: ".,," }, expected: true },
  { inputs: { s: "a." }, expected: true },
  { inputs: { s: "Marge, let's \\\"[went]\\\" in. *Margaret* get in." }, expected: false },
  { inputs: { s: "Madam, in Eden, I'm Adam" }, expected: true },
  { inputs: { s: "Never odd or even" }, expected: true },
  { inputs: { s: "Doc, note: I dissent. A fast never prevents a fatness. I diet on cod." }, expected: true },
  { inputs: { s: "12321" }, expected: true },
  { inputs: { s: "123321" }, expected: true },
  { inputs: { s: "123421" }, expected: false },
  { inputs: { s: "Was it a car or a cat I saw?" }, expected: true },
  { inputs: { s: "No 'x' in Nixon" }, expected: true },
  { inputs: { s: "Able was I ere I saw Elba" }, expected: true },
  { inputs: { s: "Eva, can I see bees in a cave?" }, expected: true },
  { inputs: { s: "a".repeat(5000) + "b" + "a".repeat(5000) }, expected: true },
  { inputs: { s: "a".repeat(5000) + "bc" + "a".repeat(5000) }, expected: false }
];

writeContent('content/problems/125/meta.json', JSON.stringify(p125Meta, null, 2));
writeContent('content/problems/125/statement.md', p125Statement);
writeContent('content/problems/125/starter/Solution.java', p125Starter);
writeContent('server/private/125/Solution.java', p125Ref);
writeContent('server/private/125/tests.json', JSON.stringify(p125Hidden, null, 2));

// -------------------------------------------------------------
// 206. Reverse Linked List
// -------------------------------------------------------------
const p206Meta = {
  id: 206,
  className: "Solution",
  methodName: "reverseList",
  params: [{ name: "head", type: "ListNode" }],
  returnType: "ListNode",
  kind: "function",
  comparator: "exact",
  timeLimitMs: 2000,
  memoryLimitMb: 256,
  examples: [
    { input: { head: [1, 2, 3, 4, 5] }, output: [5, 4, 3, 2, 1] },
    { input: { head: [1, 2] }, output: [2, 1] },
    { input: { head: [] }, output: [] }
  ],
  constraints: [
    "The number of nodes in the list is in the range [0, 5000].",
    "-5000 <= Node.val <= 5000"
  ],
  followUp: "A linked list can be reversed either iteratively or recursively. Could you implement both?"
};

const p206Statement = `# Reverse Linked List

Given the head pointer of a singly linked list, reverse the directions of all nodes and return the new head node.

[Official LeetCode Problem #206](https://leetcode.com/problems/reverse-linked-list/)
`;

const p206Starter = `/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    public ListNode reverseList(ListNode head) {
        
    }
}
`;

const p206Ref = `class Solution {
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

const p206Hidden = [
  { inputs: { head: [1] }, expected: [1] },
  { inputs: { head: [1, 2, 3] }, expected: [3, 2, 1] },
  { inputs: { head: [-1, -2, -3, -4] }, expected: [-4, -3, -2, -1] },
  { inputs: { head: [10, 20, 30, 40, 50, 60] }, expected: [60, 50, 40, 30, 20, 10] },
  { inputs: { head: [0, 0, 0] }, expected: [0, 0, 0] },
  { inputs: { head: Array.from({ length: 50 }, (_, i) => i) }, expected: Array.from({ length: 50 }, (_, i) => 49 - i) },
  { inputs: { head: Array.from({ length: 100 }, (_, i) => i * 2) }, expected: Array.from({ length: 100 }, (_, i) => (99 - i) * 2) },
  { inputs: { head: [7, 7, 7, 7, 8] }, expected: [8, 7, 7, 7, 7] },
  { inputs: { head: [99, -99] }, expected: [-99, 99] },
  { inputs: { head: [1, 3, 5, 7, 9, 11] }, expected: [11, 9, 7, 5, 3, 1] },
  { inputs: { head: Array.from({ length: 200 }, (_, i) => 1) }, expected: Array.from({ length: 200 }, () => 1) },
  { inputs: { head: [5, 4, 3, 2, 1] }, expected: [1, 2, 3, 4, 5] },
  { inputs: { head: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }, expected: [10, 9, 8, 7, 6, 5, 4, 3, 2, 1] },
  { inputs: { head: [-5, 0, 5] }, expected: [5, 0, -5] },
  { inputs: { head: [100] }, expected: [100] },
  { inputs: { head: [] }, expected: [] }
];

writeContent('content/problems/206/meta.json', JSON.stringify(p206Meta, null, 2));
writeContent('content/problems/206/statement.md', p206Statement);
writeContent('content/problems/206/starter/Solution.java', p206Starter);
writeContent('server/private/206/Solution.java', p206Ref);
writeContent('server/private/206/tests.json', JSON.stringify(p206Hidden, null, 2));

// -------------------------------------------------------------
// 226. Invert Binary Tree
// -------------------------------------------------------------
const p226Meta = {
  id: 226,
  className: "Solution",
  methodName: "invertTree",
  params: [{ name: "root", type: "TreeNode" }],
  returnType: "TreeNode",
  kind: "function",
  comparator: "exact",
  timeLimitMs: 2000,
  memoryLimitMb: 256,
  examples: [
    { input: { root: [4, 2, 7, 1, 3, 6, 9] }, output: [4, 7, 2, 9, 6, 3, 1] },
    { input: { root: [2, 1, 3] }, output: [2, 3, 1] },
    { input: { root: [] }, output: [] }
  ],
  constraints: [
    "The number of nodes in the tree is in the range [0, 100].",
    "-100 <= Node.val <= 100"
  ]
};

const p226Statement = `# Invert Binary Tree

Given the root node of a binary tree, invert the tree (swapping the left and right subtrees of every node) and return the modified root node.

[Official LeetCode Problem #226](https://leetcode.com/problems/invert-binary-tree/)
`;

const p226Starter = `/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode() {}
 *     TreeNode(int val) { this.val = val; }
 *     TreeNode(int val, TreeNode left, TreeNode right) {
 *         this.val = val;
 *         this.left = left;
 *         this.right = right;
 *     }
 * }
 */
class Solution {
    public TreeNode invertTree(TreeNode root) {
        
    }
}
`;

const p226Ref = `class Solution {
    public TreeNode invertTree(TreeNode root) {
        if (root == null) return null;
        TreeNode left = invertTree(root.left);
        TreeNode right = invertTree(root.right);
        root.left = right;
        root.right = left;
        return root;
    }
}
`;

const p226Hidden = [
  { inputs: { root: [1] }, expected: [1] },
  { inputs: { root: [1, 2] }, expected: [1, null, 2] },
  { inputs: { root: [1, null, 2] }, expected: [1, 2] },
  { inputs: { root: [1, 2, null, 3] }, expected: [1, null, 2, null, 3] },
  { inputs: { root: [5, 3, 8, 1, 4, 7, 9] }, expected: [5, 8, 3, 9, 7, 4, 1] },
  { inputs: { root: [10, 5, 15, null, 6, 12, null] }, expected: [10, 15, 5, null, 12, 6] },
  { inputs: { root: [1, 2, 3, 4, 5, 6, 7] }, expected: [1, 3, 2, 7, 6, 5, 4] },
  { inputs: { root: [0] }, expected: [0] },
  { inputs: { root: [-1, -2, -3] }, expected: [-1, -3, -2] },
  { inputs: { root: [1, 2, null, 4, null, 8] }, expected: [1, null, 2, null, 4, null, 8] },
  { inputs: { root: [1, null, 2, null, 3, null, 4] }, expected: [1, 2, null, 3, null, 4] },
  { inputs: { root: [100, 50, 150, 25, 75, 125, 175] }, expected: [100, 150, 50, 175, 125, 75, 25] },
  { inputs: { root: [9, 8, null, 7, null, 6] }, expected: [9, null, 8, null, 7, null, 6] },
  { inputs: { root: [3, 9, 20, null, null, 15, 7] }, expected: [3, 20, 9, 7, 15] },
  { inputs: { root: [1, 2, 3, 4, null, null, 5] }, expected: [1, 3, 2, 5, null, null, 4] },
  { inputs: { root: [] }, expected: [] }
];

writeContent('content/problems/226/meta.json', JSON.stringify(p226Meta, null, 2));
writeContent('content/problems/226/statement.md', p226Statement);
writeContent('content/problems/226/starter/Solution.java', p226Starter);
writeContent('server/private/226/Solution.java', p226Ref);
writeContent('server/private/226/tests.json', JSON.stringify(p226Hidden, null, 2));

// -------------------------------------------------------------
// 141. Linked List Cycle
// -------------------------------------------------------------
const p141Meta = {
  id: 141,
  className: "Solution",
  methodName: "hasCycle",
  params: [
    { name: "head", type: "ListNode" }
  ],
  returnType: "boolean",
  kind: "function",
  comparator: "exact",
  timeLimitMs: 2000,
  memoryLimitMb: 256,
  examples: [
    { input: { head: [3, 2, 0, -4], pos: 1 }, output: true, explanation: "There is a cycle in the linked list, where the tail connects to the 1st node (0-indexed)." },
    { input: { head: [1, 2], pos: 0 }, output: true },
    { input: { head: [1], pos: -1 }, output: false }
  ],
  constraints: [
    "The number of nodes in the list is in the range [0, 10^4].",
    "-10^5 <= Node.val <= 10^5",
    "pos is -1 or a valid index in the linked-list."
  ],
  followUp: "Can you solve it using O(1) (i.e. constant) memory?"
};

const p141Statement = `# Linked List Cycle

Given the head pointer of a singly linked list, determine whether the list contains a cycle.

A cycle exists if continuing to traverse through \`next\` pointers can visit a previously visited node repeatedly.

Return \`true\` if a cycle exists in the list; otherwise return \`false\`.

[Official LeetCode Problem #141](https://leetcode.com/problems/linked-list-cycle/)
`;

const p141Starter = `/**
 * Definition for singly-linked list.
 * class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode(int x) {
 *         val = x;
 *         next = null;
 *     }
 * }
 */
public class Solution {
    public boolean hasCycle(ListNode head) {
        
    }
}
`;

const p141Ref = `public class Solution {
    public boolean hasCycle(ListNode head) {
        if (head == null || head.next == null) return false;
        ListNode slow = head;
        ListNode fast = head.next;
        while (slow != fast) {
            if (fast == null || fast.next == null) return false;
            slow = slow.next;
            fast = fast.next.next;
        }
        return true;
    }
}
`;

const p141Hidden = [
  { inputs: { head: [1, 2, 3, 4], pos: -1 }, expected: false },
  { inputs: { head: [1, 2, 3, 4, 5], pos: 2 }, expected: true },
  { inputs: { head: [1], pos: 0 }, expected: true },
  { inputs: { head: [], pos: -1 }, expected: false },
  { inputs: { head: [1, 2], pos: -1 }, expected: false },
  { inputs: { head: [-1, -7, 7, -4, 19, 6, -9, -5, -2, -5], pos: 6 }, expected: true },
  { inputs: { head: [10, 20, 30, 40, 50, 60, 70, 80], pos: 0 }, expected: true },
  { inputs: { head: [10, 20, 30, 40, 50, 60, 70, 80], pos: 7 }, expected: true },
  { inputs: { head: Array.from({ length: 50 }, (_, i) => i), pos: -1 }, expected: false },
  { inputs: { head: Array.from({ length: 100 }, (_, i) => i), pos: 45 }, expected: true },
  { inputs: { head: [5, 5, 5, 5], pos: 1 }, expected: true },
  { inputs: { head: [1, 2, 3], pos: -1 }, expected: false },
  { inputs: { head: [1, 2, 3, 4, 5, 6, 7], pos: 6 }, expected: true },
  { inputs: { head: [10, -10, 20, -20], pos: -1 }, expected: false },
  { inputs: { head: [42], pos: -1 }, expected: false },
  { inputs: { head: Array.from({ length: 200 }, (_, i) => i), pos: 199 }, expected: true }
];

writeContent('content/problems/141/meta.json', JSON.stringify(p141Meta, null, 2));
writeContent('content/problems/141/statement.md', p141Statement);
writeContent('content/problems/141/starter/Solution.java', p141Starter);
writeContent('server/private/141/Solution.java', p141Ref);
writeContent('server/private/141/tests.json', JSON.stringify(p141Hidden, null, 2));

// -------------------------------------------------------------
// 15. 3Sum
// -------------------------------------------------------------
const p15Meta = {
  id: 15,
  className: "Solution",
  methodName: "threeSum",
  params: [{ name: "nums", type: "int[]" }],
  returnType: "List<List<Integer>>",
  kind: "function",
  comparator: "unordered-nested",
  timeLimitMs: 2000,
  memoryLimitMb: 256,
  examples: [
    { input: { nums: [-1, 0, 1, 2, -1, -4] }, output: [[-1, -1, 2], [-1, 0, 1]] },
    { input: { nums: [0, 1, 1] }, output: [] },
    { input: { nums: [0, 0, 0] }, output: [[0, 0, 0]] }
  ],
  constraints: [
    "3 <= nums.length <= 3000",
    "-10^5 <= nums[i] <= 10^5"
  ]
};

const p15Statement = `# 3Sum

Given an integer array \`nums\`, return all distinct triplets \`[nums[i], nums[j], nums[k]]\` such that \`i != j\`, \`i != k\`, and \`j != k\`, and:

\`\`\`
nums[i] + nums[j] + nums[k] == 0
\`\`\`

The solution set must not contain duplicate triplets. The order of triplets and the order of elements inside each triplet may be returned in any order.

[Official LeetCode Problem #15](https://leetcode.com/problems/3sum/)
`;

const p15Starter = `import java.util.List;

class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        
    }
}
`;

const p15Ref = `import java.util.*;

class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        Arrays.sort(nums);
        List<List<Integer>> result = new ArrayList<>();
        for (int i = 0; i < nums.length - 2; i++) {
            if (i > 0 && nums[i] == nums[i - 1]) continue;
            if (nums[i] > 0) break;
            int l = i + 1, r = nums.length - 1;
            while (l < r) {
                int sum = nums[i] + nums[l] + nums[r];
                if (sum == 0) {
                    result.add(Arrays.asList(nums[i], nums[l], nums[r]));
                    while (l < r && nums[l] == nums[l + 1]) l++;
                    while (l < r && nums[r] == nums[r - 1]) r--;
                    l++;
                    r--;
                } else if (sum < 0) {
                    l++;
                } else {
                    r--;
                }
            }
        }
        return result;
    }
}
`;

const p15Hidden = [
  { inputs: { nums: [-2, 0, 1, 1, 2] }, expected: [[-2, 0, 2], [-2, 1, 1]] },
  { inputs: { nums: [1, 2, -2, -1] }, expected: [] },
  { inputs: { nums: [0, 0, 0, 0] }, expected: [[0, 0, 0]] },
  { inputs: { nums: [-4, -2, -2, -2, 0, 1, 2, 2, 2, 3, 3, 4, 4, 6, 6] }, expected: [[-4, -2, 6], [-4, 0, 4], [-4, 1, 3], [-4, 2, 2], [-2, -2, 4], [-2, 0, 2]] },
  { inputs: { nums: [-1, 0, 1] }, expected: [[-1, 0, 1]] },
  { inputs: { nums: [3, -2, 1, 0] }, expected: [] },
  { inputs: { nums: [-5, 1, 4, 2, 3, -4] }, expected: [[-5, 1, 4], [-5, 2, 3], [-4, 1, 3]] },
  { inputs: { nums: [-1, -1, 2, 2] }, expected: [[-1, -1, 2]] },
  { inputs: { nums: [1, -1, -1, 0] }, expected: [] },
  { inputs: { nums: [-2, 0, 0, 2, 2] }, expected: [[-2, 0, 2]] },
  { inputs: { nums: [-10, 1, 2, 3, 4, 5, 6, 7, 8, 9] }, expected: [[-10, 1, 9], [-10, 2, 8], [-10, 3, 7], [-10, 4, 6]] },
  { inputs: { nums: [-3, 3, 0] }, expected: [[-3, 0, 3]] },
  { inputs: { nums: [-4, -1, -1, 0, 1, 2] }, expected: [[-1, -1, 2], [-1, 0, 1]] },
  { inputs: { nums: [0, 2, -2] }, expected: [[-2, 0, 2]] },
  { inputs: { nums: [100, -50, -50] }, expected: [[-50, -50, 100]] },
  { inputs: { nums: [-100, 50, 50] }, expected: [[-100, 50, 50]] }
];

writeContent('content/problems/15/meta.json', JSON.stringify(p15Meta, null, 2));
writeContent('content/problems/15/statement.md', p15Statement);
writeContent('content/problems/15/starter/Solution.java', p15Starter);
writeContent('server/private/15/Solution.java', p15Ref);
writeContent('server/private/15/tests.json', JSON.stringify(p15Hidden, null, 2));

// -------------------------------------------------------------
// 48. Rotate Image
// -------------------------------------------------------------
const p48Meta = {
  id: 48,
  className: "Solution",
  methodName: "rotate",
  params: [{ name: "matrix", type: "int[][]" }],
  returnType: "void",
  kind: "inplace:0",
  comparator: "exact",
  timeLimitMs: 2000,
  memoryLimitMb: 256,
  examples: [
    {
      input: { matrix: [[1, 2, 3], [4, 5, 6], [7, 8, 9]] },
      output: [[7, 4, 1], [8, 5, 2], [9, 6, 3]]
    },
    {
      input: { matrix: [[5, 1, 9, 11], [2, 4, 8, 10], [13, 3, 6, 7], [15, 14, 12, 16]] },
      output: [[15, 13, 2, 5], [14, 3, 4, 1], [12, 6, 8, 9], [16, 7, 10, 11]]
    }
  ],
  constraints: [
    "n == matrix.length == matrix[i].length",
    "1 <= n <= 20",
    "-1000 <= matrix[i][j] <= 1000"
  ]
};

const p48Statement = `# Rotate Image

You are provided with an \`n x n\` 2D square matrix representing an image. Rotate the image clockwise by 90 degrees directly in-place.

You must modify the 2D array directly without creating or allocating another matrix.

[Official LeetCode Problem #48](https://leetcode.com/problems/rotate-image/)
`;

const p48Starter = `class Solution {
    public void rotate(int[][] matrix) {
        
    }
}
`;

const p48Ref = `class Solution {
    public void rotate(int[][] matrix) {
        int n = matrix.length;
        // Transpose
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                int temp = matrix[i][j];
                matrix[i][j] = matrix[j][i];
                matrix[j][i] = temp;
            }
        }
        // Reverse rows
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

const p48Hidden = [
  { inputs: { matrix: [[1]] }, expected: [[1]] },
  { inputs: { matrix: [[1, 2], [3, 4]] }, expected: [[3, 1], [4, 2]] },
  { inputs: { matrix: [[1, 0], [0, 1]] }, expected: [[0, 1], [1, 0]] },
  { inputs: { matrix: [[-1, -2], [-3, -4]] }, expected: [[-3, -1], [-4, -2]] },
  { inputs: { matrix: [[1, 2, 3], [4, 5, 6], [7, 8, 9]] }, expected: [[7, 4, 1], [8, 5, 2], [9, 6, 3]] },
  { inputs: { matrix: [[0, 0, 0], [0, 1, 0], [0, 0, 0]] }, expected: [[0, 0, 0], [0, 1, 0], [0, 0, 0]] },
  { inputs: { matrix: [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 16]] }, expected: [[13, 9, 5, 1], [14, 10, 6, 2], [15, 11, 7, 3], [16, 12, 8, 4]] },
  { inputs: { matrix: [[5, 5, 5], [6, 6, 6], [7, 7, 7]] }, expected: [[7, 6, 5], [7, 6, 5], [7, 6, 5]] },
  { inputs: { matrix: [[1, 2, 3, 4, 5], [6, 7, 8, 9, 10], [11, 12, 13, 14, 15], [16, 17, 18, 19, 20], [21, 22, 23, 24, 25]] }, expected: [[21, 16, 11, 6, 1], [22, 17, 12, 7, 2], [23, 18, 13, 8, 3], [24, 19, 14, 9, 4], [25, 20, 15, 10, 5]] },
  { inputs: { matrix: [[-10, 20], [30, -40]] }, expected: [[30, -10], [-40, 20]] },
  { inputs: { matrix: [[0, 1, 2], [3, 4, 5], [6, 7, 8]] }, expected: [[6, 3, 0], [7, 4, 1], [8, 5, 2]] },
  { inputs: { matrix: [[10, 20, 30], [40, 50, 60], [70, 80, 90]] }, expected: [[70, 40, 10], [80, 50, 20], [90, 60, 30]] },
  { inputs: { matrix: [[9, 8], [7, 6]] }, expected: [[7, 9], [6, 8]] },
  { inputs: { matrix: [[1, 2, 3], [4, 5, 6], [7, 8, 9]] }, expected: [[7, 4, 1], [8, 5, 2], [9, 6, 3]] },
  { inputs: { matrix: [[2, 4], [6, 8]] }, expected: [[6, 2], [8, 4]] },
  { inputs: { matrix: [[100]] }, expected: [[100]] }
];

writeContent('content/problems/48/meta.json', JSON.stringify(p48Meta, null, 2));
writeContent('content/problems/48/statement.md', p48Statement);
writeContent('content/problems/48/starter/Solution.java', p48Starter);
writeContent('server/private/48/Solution.java', p48Ref);
writeContent('server/private/48/tests.json', JSON.stringify(p48Hidden, null, 2));

// -------------------------------------------------------------
// 5. Longest Palindromic Substring
// -------------------------------------------------------------
const p5Meta = {
  id: 5,
  className: "Solution",
  methodName: "longestPalindrome",
  params: [{ name: "s", type: "String" }],
  returnType: "String",
  kind: "function",
  comparator: "checker",
  timeLimitMs: 2000,
  memoryLimitMb: 256,
  examples: [
    { input: { s: "babad" }, output: "bab", explanation: "'aba' is also a valid answer." },
    { input: { s: "cbbd" }, output: "bb" }
  ],
  constraints: [
    "1 <= s.length <= 1000",
    "s consist of only digits and English letters."
  ]
};

const p5Statement = `# Longest Palindromic Substring

Given a string \`s\`, return the longest palindromic substring in \`s\`.

If there are multiple substrings of the same maximum length, any of them is accepted.

[Official LeetCode Problem #5](https://leetcode.com/problems/longest-palindromic-substring/)
`;

const p5Starter = `class Solution {
    public String longestPalindrome(String s) {
        
    }
}
`;

const p5Ref = `class Solution {
    public String longestPalindrome(String s) {
        if (s == null || s.length() < 1) return "";
        int start = 0, end = 0;
        for (int i = 0; i < s.length(); i++) {
            int len1 = expandAroundCenter(s, i, i);
            int len2 = expandAroundCenter(s, i, i + 1);
            int len = Math.max(len1, len2);
            if (len > end - start) {
                start = i - (len - 1) / 2;
                end = i + len / 2;
            }
        }
        return s.substring(start, end + 1);
    }

    private int expandAroundCenter(String s, int left, int right) {
        while (left >= 0 && right < s.length() && s.charAt(left) == s.charAt(right)) {
            left--;
            right++;
        }
        return right - left - 1;
    }
}
`;

const p5Checker = `exports.check = function(inputs, actual) {
    if (typeof actual !== 'string') return false;
    const s = inputs.s;
    if (!s.includes(actual)) return false;
    // Check if actual is a palindrome
    let i = 0, j = actual.length - 1;
    while (i < j) {
        if (actual.charAt(i) !== actual.charAt(j)) return false;
        i++;
        j--;
    }
    // Check if it achieves maximum length
    // Compute max palindrome length in s
    let maxLen = 0;
    for (let c = 0; c < s.length; c++) {
        // odd
        let l = c, r = c;
        while (l >= 0 && r < s.length && s[l] === s[r]) { l--; r++; }
        if (r - l - 1 > maxLen) maxLen = r - l - 1;
        // even
        l = c; r = c + 1;
        while (l >= 0 && r < s.length && s[l] === s[r]) { l--; r++; }
        if (r - l - 1 > maxLen) maxLen = r - l - 1;
    }
    return actual.length === maxLen;
};
`;

const p5Hidden = [
  { inputs: { s: "a" }, expected: "a" },
  { inputs: { s: "ac" }, expected: "a" },
  { inputs: { s: "racecar" }, expected: "racecar" },
  { inputs: { s: "noon" }, expected: "noon" },
  { inputs: { s: "aacabdkacaa" }, expected: "aca" },
  { inputs: { s: "forgeeksskeegfor" }, expected: "geeksskeeg" },
  { inputs: { s: "abacdfgdcaba" }, expected: "aba" },
  { inputs: { s: "civilwartestingwhetherthatnaptionoranynartionsoconceivedandsodedicatedcanlongendure" }, expected: "tat" },
  { inputs: { s: "aaaaa" }, expected: "aaaaa" },
  { inputs: { s: "banana" }, expected: "anana" },
  { inputs: { s: "million" }, expected: "illi" },
  { inputs: { s: "character" }, expected: "ara" },
  { inputs: { s: "abacaba" }, expected: "abacaba" },
  { inputs: { s: "123454321" }, expected: "123454321" },
  { inputs: { s: "x".repeat(300) }, expected: "x".repeat(300) },
  { inputs: { s: "abcde".repeat(50) }, expected: "a" }
];

writeContent('content/problems/5/meta.json', JSON.stringify(p5Meta, null, 2));
writeContent('content/problems/5/statement.md', p5Statement);
writeContent('content/problems/5/starter/Solution.java', p5Starter);
writeContent('server/private/5/Solution.java', p5Ref);
writeContent('server/private/5/checker.js', p5Checker);
writeContent('server/private/5/tests.json', JSON.stringify(p5Hidden, null, 2));

// -------------------------------------------------------------
// 208. Implement Trie (Prefix Tree)
// -------------------------------------------------------------
const p208Meta = {
  id: 208,
  className: "Trie",
  methodName: "",
  params: [],
  returnType: "void",
  kind: "class",
  comparator: "exact",
  timeLimitMs: 2000,
  memoryLimitMb: 256,
  examples: [
    {
      input: {
        operations: ["Trie", "insert", "search", "search", "startsWith", "insert", "search"],
        args: [[], ["apple"], ["apple"], ["app"], ["app"], ["app"], ["app"]]
      },
      output: [null, null, true, false, true, null, true]
    }
  ],
  constraints: [
    "1 <= word.length, prefix.length <= 2000",
    "word and prefix consist only of lowercase English letters.",
    "At most 3 * 10^4 calls in total will be made to insert, search, and startsWith."
  ]
};

const p208Statement = `# Implement Trie (Prefix Tree)

A trie (pronounced as 'try') or prefix tree is a tree data structure used to efficiently store and retrieve keys in a dataset of strings. There are various applications of this data structure, such as autocomplete and spellchecker.

Implement the \`Trie\` class:
- \`Trie()\` Initializes the trie object.
- \`void insert(String word)\` Inserts the string \`word\` into the trie.
- \`boolean search(String word)\` Returns \`true\` if the string \`word\` is in the trie (i.e., was inserted before), and \`false\` otherwise.
- \`boolean startsWith(String prefix)\` Returns \`true\` if there is a previously inserted string \`word\` that has the prefix \`prefix\`, and \`false\` otherwise.

[Official LeetCode Problem #208](https://leetcode.com/problems/implement-trie-prefix-tree/)
`;

const p208Starter = `class Trie {

    public Trie() {
        
    }
    
    public void insert(String word) {
        
    }
    
    public boolean search(String word) {
        
    }
    
    public boolean startsWith(String prefix) {
        
    }
}

/**
 * Your Trie object will be instantiated and called as such:
 * Trie obj = new Trie();
 * obj.insert(word);
 * boolean param_2 = obj.search(word);
 * boolean param_3 = obj.startsWith(prefix);
 */
`;

const p208Ref = `class Trie {
    private static class Node {
        Node[] children = new Node[26];
        boolean isEnd = false;
    }

    private final Node root;

    public Trie() {
        root = new Node();
    }

    public void insert(String word) {
        Node curr = root;
        for (int i = 0; i < word.length(); i++) {
            int idx = word.charAt(i) - 'a';
            if (curr.children[idx] == null) {
                curr.children[idx] = new Node();
            }
            curr = curr.children[idx];
        }
        curr.isEnd = true;
    }

    public boolean search(String word) {
        Node node = find(word);
        return node != null && node.isEnd;
    }

    public boolean startsWith(String prefix) {
        return find(prefix) != null;
    }

    private Node find(String prefix) {
        Node curr = root;
        for (int i = 0; i < prefix.length(); i++) {
            int idx = prefix.charAt(i) - 'a';
            if (curr.children[idx] == null) return null;
            curr = curr.children[idx];
        }
        return curr;
    }
}
`;

const p208Hidden = [
  {
    inputs: {
      operations: ["Trie", "insert", "search", "startsWith"],
      args: [[], ["hello"], ["hello"], ["hell"]]
    },
    expected: [null, null, true, true]
  },
  {
    inputs: {
      operations: ["Trie", "search", "startsWith"],
      args: [[], ["nonexistent"], ["non"]]
    },
    expected: [null, false, false]
  },
  {
    inputs: {
      operations: ["Trie", "insert", "insert", "search", "search", "startsWith", "startsWith"],
      args: [[], ["cat"], ["car"], ["cat"], ["cars"], ["ca"], ["z"]]
    },
    expected: [null, null, null, true, false, true, false]
  },
  {
    inputs: {
      operations: ["Trie", "insert", "startsWith", "search"],
      args: [[], ["a"], ["a"], ["a"]]
    },
    expected: [null, null, true, true]
  },
  {
    inputs: {
      operations: ["Trie", "insert", "insert", "insert", "search", "search", "search"],
      args: [[], ["banana"], ["bandana"], ["band"], ["ban"], ["band"], ["bandana"]]
    },
    expected: [null, null, null, null, false, true, true]
  },
  {
    inputs: {
      operations: ["Trie", "insert", "search"],
      args: [[], ["supercalifragilisticexpialidocious"], ["supercalifragilisticexpialidocious"]]
    },
    expected: [null, null, true]
  }
];

writeContent('content/problems/208/meta.json', JSON.stringify(p208Meta, null, 2));
writeContent('content/problems/208/statement.md', p208Statement);
writeContent('content/problems/208/starter/Solution.java', p208Starter);
writeContent('server/private/208/Solution.java', p208Ref);
writeContent('server/private/208/tests.json', JSON.stringify(p208Hidden, null, 2));

console.log('Pilot problems content & hidden tests generated successfully.');
