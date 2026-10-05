const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();

function writeProblem(p) {
  const contentDir = path.join(rootDir, 'content', 'problems', String(p.id));
  const privateDir = path.join(rootDir, 'server', 'private', String(p.id));

  fs.mkdirSync(path.join(contentDir, 'starter'), { recursive: true });
  fs.mkdirSync(privateDir, { recursive: true });

  fs.writeFileSync(path.join(contentDir, 'meta.json'), JSON.stringify(p.meta, null, 2), 'utf8');
  fs.writeFileSync(path.join(contentDir, 'statement.md'), p.statement.trim() + '\n', 'utf8');
  fs.writeFileSync(path.join(contentDir, 'starter', 'Solution.java'), p.starter.trim() + '\n', 'utf8');
  fs.writeFileSync(path.join(privateDir, 'Solution.java'), p.ref.trim() + '\n', 'utf8');
  fs.writeFileSync(path.join(privateDir, 'tests.json'), JSON.stringify(p.hidden, null, 2), 'utf8');

  console.log(`Generated Problem #${p.id} (${p.meta.methodName})`);
}

const problems = [];

// 242. Valid Anagram
problems.push({
  id: 242,
  meta: {
    id: 242,
    className: "Solution",
    methodName: "isAnagram",
    params: [{ name: "s", type: "String" }, { name: "t", type: "String" }],
    returnType: "boolean",
    kind: "function",
    comparator: "exact",
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    examples: [
      { input: { s: "anagram", t: "nagaram" }, output: true },
      { input: { s: "rat", t: "car" }, output: false }
    ],
    constraints: ["1 <= s.length, t.length <= 5 * 10^4", "s and t consist of lowercase English letters."]
  },
  statement: `# Valid Anagram

Given two strings \`s\` and \`t\`, return \`true\` if \`t\` is an anagram of \`s\`, and \`false\` otherwise.

An anagram is a word or phrase formed by rearranging the letters of a different word or phrase, using all the original letters exactly once.

[Official LeetCode Problem #242](https://leetcode.com/problems/valid-anagram/)`,
  starter: `import java.util.*;
import java.io.*;
import java.lang.*;

class Solution {
    public boolean isAnagram(String s, String t) {
        
    }
}`,
  ref: `import java.util.*;
import java.io.*;
import java.lang.*;

class Solution {
    public boolean isAnagram(String s, String t) {
        if (s.length() != t.length()) return false;
        int[] count = new int[26];
        for (int i = 0; i < s.length(); i++) {
            count[s.charAt(i) - 'a']++;
            count[t.charAt(i) - 'a']--;
        }
        for (int c : count) {
            if (c != 0) return false;
        }
        return true;
    }
}`,
  hidden: [
    { inputs: { s: "a", t: "a" }, expected: true },
    { inputs: { s: "a", t: "b" }, expected: false },
    { inputs: { s: "ab", t: "ba" }, expected: true },
    { inputs: { s: "ab", t: "a" }, expected: false },
    { inputs: { s: "listen", t: "silent" }, expected: true },
    { inputs: { s: "hello", t: "billion" }, expected: false },
    { inputs: { s: "aabbcc", t: "bbaacc" }, expected: true },
    { inputs: { s: "aabbcc", t: "abacc" }, expected: false },
    { inputs: { s: "z", t: "z" }, expected: true },
    { inputs: { s: "az", t: "za" }, expected: true },
    { inputs: { s: "abcdefghijklmnopqrstuvwxyz", t: "zyxwvutsrqponmlkjihgfedcba" }, expected: true },
    { inputs: { s: "abcdefghijklmnopqrstuvwxyz", t: "zyxwvutsrqponmlkjihgfedcbz" }, expected: false },
    { inputs: { s: "aaaaabbbbb", t: "bbbbbaaaaa" }, expected: true },
    { inputs: { s: "restaurant", t: "restauran" }, expected: false },
    { inputs: { s: "conversation", t: "voicesranton" }, expected: true },
    { inputs: { s: "ac", t: "bb" }, expected: false }
  ]
});

// 21. Merge Two Sorted Lists
problems.push({
  id: 21,
  meta: {
    id: 21,
    className: "Solution",
    methodName: "mergeTwoLists",
    params: [{ name: "list1", type: "ListNode" }, { name: "list2", type: "ListNode" }],
    returnType: "ListNode",
    kind: "function",
    comparator: "exact",
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    examples: [
      { input: { list1: [1, 2, 4], list2: [1, 3, 4] }, output: [1, 1, 2, 3, 4, 4] },
      { input: { list1: [], list2: [] }, output: [] },
      { input: { list1: [], list2: [0] }, output: [0] }
    ],
    constraints: ["The number of nodes in both lists is in the range [0, 50].", "-100 <= Node.val <= 100", "Both list1 and list2 are sorted in non-decreasing order."]
  },
  statement: `# Merge Two Sorted Lists

You are given the heads of two sorted linked lists \`list1\` and \`list2\`.

Merge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists.

Return the head of the merged linked list.

[Official LeetCode Problem #21](https://leetcode.com/problems/merge-two-sorted-lists/)`,
  starter: `import java.util.*;
import java.io.*;
import java.lang.*;

class Solution {
    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
        
    }
}`,
  ref: `import java.util.*;
import java.io.*;
import java.lang.*;

class Solution {
    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
        ListNode dummy = new ListNode(0);
        ListNode curr = dummy;
        while (list1 != null && list2 != null) {
            if (list1.val <= list2.val) {
                curr.next = list1;
                list1 = list1.next;
            } else {
                curr.next = list2;
                list2 = list2.next;
            }
            curr = curr.next;
        }
        curr.next = (list1 != null) ? list1 : list2;
        return dummy.next;
    }
}`,
  hidden: [
    { inputs: { list1: [1], list2: [2] }, expected: [1, 2] },
    { inputs: { list1: [2], list2: [1] }, expected: [1, 2] },
    { inputs: { list1: [5], list2: [] }, expected: [5] },
    { inputs: { list1: [], list2: [5] }, expected: [5] },
    { inputs: { list1: [1, 3, 5], list2: [2, 4, 6] }, expected: [1, 2, 3, 4, 5, 6] },
    { inputs: { list1: [1, 2, 3], list2: [4, 5, 6] }, expected: [1, 2, 3, 4, 5, 6] },
    { inputs: { list1: [4, 5, 6], list2: [1, 2, 3] }, expected: [1, 2, 3, 4, 5, 6] },
    { inputs: { list1: [-10, -5, 0], list2: [-8, -2, 5] }, expected: [-10, -8, -5, -2, 0, 5] },
    { inputs: { list1: [1, 1, 1], list2: [1, 1, 1] }, expected: [1, 1, 1, 1, 1, 1] },
    { inputs: { list1: [-99, 0, 99], list2: [-100, 100] }, expected: [-100, -99, 0, 99, 100] },
    { inputs: { list1: [2, 2], list2: [2, 2] }, expected: [2, 2, 2, 2] },
    { inputs: { list1: [1, 5, 10], list2: [2, 3, 4, 6, 7, 8, 9] }, expected: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
    { inputs: { list1: [0], list2: [0] }, expected: [0, 0] },
    { inputs: { list1: [-1], list2: [1] }, expected: [-1, 1] },
    { inputs: { list1: [10], list2: [20, 30] }, expected: [10, 20, 30] },
    { inputs: { list1: [10, 20], list2: [5] }, expected: [5, 10, 20] }
  ]
});

// 104. Maximum Depth of Binary Tree
problems.push({
  id: 104,
  meta: {
    id: 104,
    className: "Solution",
    methodName: "maxDepth",
    params: [{ name: "root", type: "TreeNode" }],
    returnType: "int",
    kind: "function",
    comparator: "exact",
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    examples: [
      { input: { root: [3, 9, 20, null, null, 15, 7] }, output: 3 },
      { input: { root: [1, null, 2] }, output: 2 }
    ],
    constraints: ["The number of nodes in the tree is in the range [0, 10^4].", "-100 <= Node.val <= 100"]
  },
  statement: `# Maximum Depth of Binary Tree

Given the \`root\` of a binary tree, return its maximum depth.

A binary tree's maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.

[Official LeetCode Problem #104](https://leetcode.com/problems/maximum-depth-of-binary-tree/)`,
  starter: `import java.util.*;
import java.io.*;
import java.lang.*;

class Solution {
    public int maxDepth(TreeNode root) {
        
    }
}`,
  ref: `import java.util.*;
import java.io.*;
import java.lang.*;

class Solution {
    public int maxDepth(TreeNode root) {
        if (root == null) return 0;
        int left = maxDepth(root.left);
        int right = maxDepth(root.right);
        return 1 + (left > right ? left : right);
    }
}`,
  hidden: [
    { inputs: { root: [] }, expected: 0 },
    { inputs: { root: [1] }, expected: 1 },
    { inputs: { root: [1, 2] }, expected: 2 },
    { inputs: { root: [1, 2, 3] }, expected: 2 },
    { inputs: { root: [1, 2, 3, 4, 5] }, expected: 3 },
    { inputs: { root: [1, null, 2, null, 3, null, 4] }, expected: 4 },
    { inputs: { root: [1, 2, null, 3, null, 4] }, expected: 4 },
    { inputs: { root: [0, -3, 9, -10, null, 5] }, expected: 3 },
    { inputs: { root: [1, 2, 3, 4, null, null, 5] }, expected: 3 },
    { inputs: { root: [1, 2, 3, 4, 5, 6, 7] }, expected: 3 },
    { inputs: { root: [1, null, 2, null, 3] }, expected: 3 },
    { inputs: { root: [1, 2, null, 3] }, expected: 3 },
    { inputs: { root: [5, 4, 8, 11, null, 13, 4, 7, 2, null, null, null, 1] }, expected: 4 },
    { inputs: { root: [1, 2, 3, 4, 5, null, null, 6] }, expected: 4 },
    { inputs: { root: [-10] }, expected: 1 },
    { inputs: { root: [1, 2, 3, 4, 5, 6, 7, 8] }, expected: 4 }
  ]
});

// 338. Counting Bits
problems.push({
  id: 338,
  meta: {
    id: 338,
    className: "Solution",
    methodName: "countBits",
    params: [{ name: "n", type: "int" }],
    returnType: "int[]",
    kind: "function",
    comparator: "exact",
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    examples: [
      { input: { n: 2 }, output: [0, 1, 1] },
      { input: { n: 5 }, output: [0, 1, 1, 2, 1, 2] }
    ],
    constraints: ["0 <= n <= 10^5"]
  },
  statement: `# Counting Bits

Given an integer \`n\`, return an array \`ans\` of length \`n + 1\` such that for each \`i\` (\`0 <= i <= n\`), \`ans[i]\` is the number of \`1\`'s in the binary representation of \`i\`.

[Official LeetCode Problem #338](https://leetcode.com/problems/counting-bits/)`,
  starter: `import java.util.*;
import java.io.*;
import java.lang.*;

class Solution {
    public int[] countBits(int n) {
        
    }
}`,
  ref: `import java.util.*;
import java.io.*;
import java.lang.*;

class Solution {
    public int[] countBits(int n) {
        int[] ans = new int[n + 1];
        for (int i = 1; i <= n; i++) {
            ans[i] = ans[i >> 1] + (i & 1);
        }
        return ans;
    }
}`,
  hidden: [
    { inputs: { n: 0 }, expected: [0] },
    { inputs: { n: 1 }, expected: [0, 1] },
    { inputs: { n: 3 }, expected: [0, 1, 1, 2] },
    { inputs: { n: 4 }, expected: [0, 1, 1, 2, 1] },
    { inputs: { n: 6 }, expected: [0, 1, 1, 2, 1, 2, 2] },
    { inputs: { n: 7 }, expected: [0, 1, 1, 2, 1, 2, 2, 3] },
    { inputs: { n: 8 }, expected: [0, 1, 1, 2, 1, 2, 2, 3, 1] },
    { inputs: { n: 10 }, expected: [0, 1, 1, 2, 1, 2, 2, 3, 1, 2, 2] },
    { inputs: { n: 12 }, expected: [0, 1, 1, 2, 1, 2, 2, 3, 1, 2, 2, 3, 2] },
    { inputs: { n: 15 }, expected: [0, 1, 1, 2, 1, 2, 2, 3, 1, 2, 2, 3, 2, 3, 3, 4] },
    { inputs: { n: 16 }, expected: [0, 1, 1, 2, 1, 2, 2, 3, 1, 2, 2, 3, 2, 3, 3, 4, 1] },
    { inputs: { n: 9 }, expected: [0, 1, 1, 2, 1, 2, 2, 3, 1, 2] },
    { inputs: { n: 11 }, expected: [0, 1, 1, 2, 1, 2, 2, 3, 1, 2, 2, 3] },
    { inputs: { n: 13 }, expected: [0, 1, 1, 2, 1, 2, 2, 3, 1, 2, 2, 3, 2, 3] },
    { inputs: { n: 14 }, expected: [0, 1, 1, 2, 1, 2, 2, 3, 1, 2, 2, 3, 2, 3, 3] },
    { inputs: { n: 17 }, expected: [0, 1, 1, 2, 1, 2, 2, 3, 1, 2, 2, 3, 2, 3, 3, 4, 1, 2] }
  ]
});

// 153. Find Minimum in Rotated Sorted Array
problems.push({
  id: 153,
  meta: {
    id: 153,
    className: "Solution",
    methodName: "findMin",
    params: [{ name: "nums", type: "int[]" }],
    returnType: "int",
    kind: "function",
    comparator: "exact",
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    examples: [
      { input: { nums: [3, 4, 5, 1, 2] }, output: 1 },
      { input: { nums: [4, 5, 6, 7, 0, 1, 2] }, output: 0 },
      { input: { nums: [11, 13, 15, 17] }, output: 11 }
    ],
    constraints: ["n == nums.length", "1 <= n <= 5000", "-5000 <= nums[i] <= 5000", "All the integers of nums are unique.", "nums is sorted and rotated between 1 and n times."]
  },
  statement: `# Find Minimum in Rotated Sorted Array

Suppose an array of length \`n\` sorted in ascending order is rotated between \`1\` and \`n\` times. For example, the array \`nums = [0,1,2,4,5,6,7]\` might become:
- \`[4,5,6,7,0,1,2]\` if it was rotated 4 times.
- \`[0,1,2,4,5,6,7]\` if it was rotated 7 times.

Notice that rotating an array \`[a[0], a[1], a[2], ..., a[n-1]]\` 1 time results in the array \`[a[n-1], a[0], a[1], a[2], ..., a[n-2]]\`.

Given the sorted rotated array \`nums\` of unique elements, return the minimum element of this array.

You must write an algorithm that runs in \`O(log n)\` time.

[Official LeetCode Problem #153](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/)`,
  starter: `import java.util.*;
import java.io.*;
import java.lang.*;

class Solution {
    public int findMin(int[] nums) {
        
    }
}`,
  ref: `import java.util.*;
import java.io.*;
import java.lang.*;

class Solution {
    public int findMin(int[] nums) {
        int l = 0, r = nums.length - 1;
        while (l < r) {
            int m = l + (r - l) / 2;
            if (nums[m] > nums[r]) {
                l = m + 1;
            } else {
                r = m;
            }
        }
        return nums[l];
    }
}`,
  hidden: [
    { inputs: { nums: [1] }, expected: 1 },
    { inputs: { nums: [2, 1] }, expected: 1 },
    { inputs: { nums: [1, 2] }, expected: 1 },
    { inputs: { nums: [3, 1, 2] }, expected: 1 },
    { inputs: { nums: [2, 3, 1] }, expected: 1 },
    { inputs: { nums: [1, 2, 3] }, expected: 1 },
    { inputs: { nums: [5, 1, 2, 3, 4] }, expected: 1 },
    { inputs: { nums: [2, 3, 4, 5, 1] }, expected: 1 },
    { inputs: { nums: [10, 20, 30, 40, 5] }, expected: 5 },
    { inputs: { nums: [4, 5, 1, 2, 3] }, expected: 1 },
    { inputs: { nums: [-5, -2, -1, -10, -8] }, expected: -10 },
    { inputs: { nums: [3, 4, 5, 6, 7, 8, 9, 1, 2] }, expected: 1 },
    { inputs: { nums: [100, 200, 300, -100, 0] }, expected: -100 },
    { inputs: { nums: [6, 7, 8, 9, 10, 1, 2, 3, 4, 5] }, expected: 1 },
    { inputs: { nums: [2, 3, 4, 5, 6, 7, 8, 9, 1] }, expected: 1 },
    { inputs: { nums: [1, 2, 3, 4, 5, 6, 7, 8, 9] }, expected: 1 }
  ]
});

// 49. Group Anagrams
problems.push({
  id: 49,
  meta: {
    id: 49,
    className: "Solution",
    methodName: "groupAnagrams",
    params: [{ name: "strs", type: "String[]" }],
    returnType: "List<List<String>>",
    kind: "function",
    comparator: "unordered-nested",
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    examples: [
      { input: { strs: ["eat", "tea", "tan", "ate", "nat", "bat"] }, output: [["bat"], ["nat", "tan"], ["ate", "eat", "tea"]] },
      { input: { strs: [""] }, output: [[""]] },
      { input: { strs: ["a"] }, output: [["a"]] }
    ],
    constraints: ["1 <= strs.length <= 10^4", "0 <= strs[i].length <= 100", "strs[i] consists of lowercase English letters."]
  },
  statement: `# Group Anagrams

Given an array of strings \`strs\`, group the anagrams together. You can return the answer in any order.

[Official LeetCode Problem #49](https://leetcode.com/problems/group-anagrams/)`,
  starter: `import java.util.*;
import java.io.*;
import java.lang.*;

class Solution {
    public List<List<String>> groupAnagrams(String[] strs) {
        
    }
}`,
  ref: `import java.util.*;
import java.io.*;
import java.lang.*;

class Solution {
    public List<List<String>> groupAnagrams(String[] strs) {
        Map<String, List<String>> map = new HashMap<>();
        for (String s : strs) {
            char[] chars = s.toCharArray();
            Arrays.sort(chars);
            String key = new String(chars);
            map.computeIfAbsent(key, k -> new ArrayList<>()).add(s);
        }
        return new ArrayList<>(map.values());
    }
}`,
  hidden: [
    { inputs: { strs: ["a", "b", "c"] }, expected: [["a"], ["b"], ["c"]] },
    { inputs: { strs: ["ab", "ba", "abc", "cba", "bca"] }, expected: [["ab", "ba"], ["abc", "cba", "bca"]] },
    { inputs: { strs: ["", "", ""] }, expected: [["", "", ""]] },
    { inputs: { strs: ["listen", "silent", "enlist"] }, expected: [["listen", "silent", "enlist"]] },
    { inputs: { strs: ["rat", "tar", "art", "car"] }, expected: [["rat", "tar", "art"], ["car"]] },
    { inputs: { strs: ["hello", "world"] }, expected: [["hello"], ["world"]] },
    { inputs: { strs: ["opt", "top", "pot", "stop", "spot", "pots"] }, expected: [["opt", "top", "pot"], ["stop", "spot", "pots"]] },
    { inputs: { strs: ["z"] }, expected: [["z"]] },
    { inputs: { strs: ["ab", "bc", "cd"] }, expected: [["ab"], ["bc"], ["cd"]] },
    { inputs: { strs: ["abc", "def", "ghi"] }, expected: [["abc"], ["def"], ["ghi"]] },
    { inputs: { strs: ["aaa", "aaa", "aaa"] }, expected: [["aaa", "aaa", "aaa"]] },
    { inputs: { strs: ["a", "aa", "aaa", "aaaa"] }, expected: [["a"], ["aa"], ["aaa"], ["aaaa"]] },
    { inputs: { strs: ["cat", "dog", "act", "god"] }, expected: [["cat", "act"], ["dog", "god"]] },
    { inputs: { strs: ["tab", "bat", "map"] }, expected: [["tab", "bat"], ["map"]] },
    { inputs: { strs: ["silent", "listen", "hello"] }, expected: [["silent", "listen"], ["hello"]] },
    { inputs: { strs: ["x", "y", "x", "y"] }, expected: [["x", "x"], ["y", "y"]] }
  ]
});

// 100. Same Tree
problems.push({
  id: 100,
  meta: {
    id: 100,
    className: "Solution",
    methodName: "isSameTree",
    params: [{ name: "p", type: "TreeNode" }, { name: "q", type: "TreeNode" }],
    returnType: "boolean",
    kind: "function",
    comparator: "exact",
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    examples: [
      { input: { p: [1, 2, 3], q: [1, 2, 3] }, output: true },
      { input: { p: [1, 2], q: [1, null, 2] }, output: false },
      { input: { p: [1, 2, 1], q: [1, 1, 2] }, output: false }
    ],
    constraints: ["The number of nodes in both trees is in the range [0, 100].", "-10^4 <= Node.val <= 10^4"]
  },
  statement: `# Same Tree

Given the roots of two binary trees \`p\` and \`q\`, write a function to check if they are the same or not.

Two binary trees are considered the same if they are structurally identical, and the nodes have the same value.

[Official LeetCode Problem #100](https://leetcode.com/problems/same-tree/)`,
  starter: `import java.util.*;
import java.io.*;
import java.lang.*;

class Solution {
    public boolean isSameTree(TreeNode p, TreeNode q) {
        
    }
}`,
  ref: `import java.util.*;
import java.io.*;
import java.lang.*;

class Solution {
    public boolean isSameTree(TreeNode p, TreeNode q) {
        if (p == null && q == null) return true;
        if (p == null || q == null) return false;
        if (p.val != q.val) return false;
        return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
    }
}`,
  hidden: [
    { inputs: { p: [], q: [] }, expected: true },
    { inputs: { p: [1], q: [1] }, expected: true },
    { inputs: { p: [1], q: [2] }, expected: false },
    { inputs: { p: [1], q: [] }, expected: false },
    { inputs: { p: [], q: [1] }, expected: false },
    { inputs: { p: [1, 2, 3, 4], q: [1, 2, 3, 4] }, expected: true },
    { inputs: { p: [1, 2, 3, 4], q: [1, 2, 3, 5] }, expected: false },
    { inputs: { p: [10, 5, 15], q: [10, 5, 15] }, expected: true },
    { inputs: { p: [10, 5, null], q: [10, null, 5] }, expected: false },
    { inputs: { p: [1, null, 2, null, 3], q: [1, null, 2, null, 3] }, expected: true },
    { inputs: { p: [1, 2, null, 3], q: [1, null, 2, 3] }, expected: false },
    { inputs: { p: [0, -5, 5], q: [0, -5, 5] }, expected: true },
    { inputs: { p: [1, 2, 3, null, null, 4, 5], q: [1, 2, 3, null, null, 4, 5] }, expected: true },
    { inputs: { p: [1, 2, 3, null, null, 4, 5], q: [1, 2, 3, null, null, 5, 4] }, expected: false },
    { inputs: { p: [42], q: [42] }, expected: true },
    { inputs: { p: [42, 1], q: [42, null, 1] }, expected: false }
  ]
});

// 198. House Robber
problems.push({
  id: 198,
  meta: {
    id: 198,
    className: "Solution",
    methodName: "rob",
    params: [{ name: "nums", type: "int[]" }],
    returnType: "int",
    kind: "function",
    comparator: "exact",
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    examples: [
      { input: { nums: [1, 2, 3, 1] }, output: 4, explanation: "Rob house 1 (money = 1) and then rob house 3 (money = 3). Total = 1 + 3 = 4." },
      { input: { nums: [2, 7, 9, 3, 1] }, output: 12, explanation: "Rob house 1 (2), house 3 (9) and house 5 (1). Total = 2 + 9 + 1 = 12." }
    ],
    constraints: ["1 <= nums.length <= 100", "0 <= nums[i] <= 400"]
  },
  statement: `# House Robber

You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed, the only constraint stopping you from robbing each of them is that adjacent houses have security systems connected and it will automatically contact the police if two adjacent houses were broken into on the same night.

Given an integer array \`nums\` representing the amount of money of each house, return the maximum amount of money you can rob tonight without alerting the police.

[Official LeetCode Problem #198](https://leetcode.com/problems/house-robber/)`,
  starter: `import java.util.*;
import java.io.*;
import java.lang.*;

class Solution {
    public int rob(int[] nums) {
        
    }
}`,
  ref: `import java.util.*;
import java.io.*;
import java.lang.*;

class Solution {
    public int rob(int[] nums) {
        int rob1 = 0, rob2 = 0;
        for (int n : nums) {
            int temp = Math.max(rob1 + n, rob2);
            rob1 = rob2;
            rob2 = temp;
        }
        return rob2;
    }
}`,
  hidden: [
    { inputs: { nums: [0] }, expected: 0 },
    { inputs: { nums: [5] }, expected: 5 },
    { inputs: { nums: [2, 1] }, expected: 2 },
    { inputs: { nums: [1, 2] }, expected: 2 },
    { inputs: { nums: [1, 3, 1] }, expected: 3 },
    { inputs: { nums: [2, 1, 1, 2] }, expected: 4 },
    { inputs: { nums: [10, 1, 1, 10] }, expected: 20 },
    { inputs: { nums: [100, 200, 100] }, expected: 200 },
    { inputs: { nums: [4, 1, 2, 7, 5, 3, 1] }, expected: 14 },
    { inputs: { nums: [1, 2, 3, 4, 5, 6, 7, 8, 9] }, expected: 25 },
    { inputs: { nums: [9, 8, 7, 6, 5, 4, 3, 2, 1] }, expected: 25 },
    { inputs: { nums: [0, 0, 0, 0] }, expected: 0 },
    { inputs: { nums: [50, 1, 1, 50, 1, 50] }, expected: 150 },
    { inputs: { nums: [2, 4, 8, 9, 9, 3] }, expected: 19 },
    { inputs: { nums: [20, 10, 30, 40, 50] }, expected: 100 },
    { inputs: { nums: [1, 100, 1, 100, 1] }, expected: 200 }
  ]
});

// 347. Top K Frequent Elements
problems.push({
  id: 347,
  meta: {
    id: 347,
    className: "Solution",
    methodName: "topKFrequent",
    params: [{ name: "nums", type: "int[]" }, { name: "k", type: "int" }],
    returnType: "int[]",
    kind: "function",
    comparator: "unordered",
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    examples: [
      { input: { nums: [1, 1, 1, 2, 2, 3], k: 2 }, output: [1, 2] },
      { input: { nums: [1], k: 1 }, output: [1] }
    ],
    constraints: ["1 <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4", "k is in the range [1, the number of unique elements in the array].", "It is guaranteed that the answer is unique."]
  },
  statement: `# Top K Frequent Elements

Given an integer array \`nums\` and an integer \`k\`, return the \`k\` most frequent elements. You may return the answer in any order.

[Official LeetCode Problem #347](https://leetcode.com/problems/top-k-frequent-elements/)`,
  starter: `import java.util.*;
import java.io.*;
import java.lang.*;

class Solution {
    public int[] topKFrequent(int[] nums, int k) {
        
    }
}`,
  ref: `import java.util.*;
import java.io.*;
import java.lang.*;

class Solution {
    public int[] topKFrequent(int[] nums, int k) {
        Map<Integer, Integer> count = new HashMap<>();
        for (int n : nums) count.put(n, count.getOrDefault(n, 0) + 1);

        PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[1] - b[1]);
        for (Map.Entry<Integer, Integer> e : count.entrySet()) {
            pq.offer(new int[]{e.getKey(), e.getValue()});
            if (pq.size() > k) pq.poll();
        }

        int[] res = new int[k];
        for (int i = 0; i < k; i++) res[i] = pq.poll()[0];
        return res;
    }
}`,
  hidden: [
    { inputs: { nums: [4, 4, 4, 6, 6, 8], k: 1 }, expected: [4] },
    { inputs: { nums: [4, 4, 4, 6, 6, 8], k: 2 }, expected: [4, 6] },
    { inputs: { nums: [1, 2, 3], k: 3 }, expected: [1, 2, 3] },
    { inputs: { nums: [-1, -1], k: 1 }, expected: [-1] },
    { inputs: { nums: [5, 5, 5, 5, 5], k: 1 }, expected: [5] },
    { inputs: { nums: [1, 1, 2, 2, 3, 3, 3], k: 1 }, expected: [3] },
    { inputs: { nums: [1, 1, 2, 2, 3, 3, 3], k: 2 }, expected: [3, 1] },
    { inputs: { nums: [10, 20, 20, 30, 30, 30], k: 2 }, expected: [30, 20] },
    { inputs: { nums: [0, 0, 0, 1, 2], k: 1 }, expected: [0] },
    { inputs: { nums: [-10, -10, -20, -20, -30], k: 2 }, expected: [-10, -20] },
    { inputs: { nums: [7, 7, 8, 8, 9, 9, 10, 10, 10], k: 1 }, expected: [10] },
    { inputs: { nums: [1, 2, 2, 3, 3, 3, 4, 4, 4, 4], k: 2 }, expected: [4, 3] },
    { inputs: { nums: [100, 200, 100], k: 1 }, expected: [100] },
    { inputs: { nums: [99, 98, 97, 96, 99], k: 1 }, expected: [99] },
    { inputs: { nums: [1, 1, 1, 2, 2, 3, 3, 4], k: 2 }, expected: [1, 2] },
    { inputs: { nums: [1, 2, 3, 4, 5, 5, 5], k: 1 }, expected: [5] }
  ]
});

// 3. Longest Substring Without Repeating Characters
problems.push({
  id: 3,
  meta: {
    id: 3,
    className: "Solution",
    methodName: "lengthOfLongestSubstring",
    params: [{ name: "s", type: "String" }],
    returnType: "int",
    kind: "function",
    comparator: "exact",
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    examples: [
      { input: { s: "abcabcbb" }, output: 3, explanation: "The answer is \"abc\", with the length of 3." },
      { input: { s: "bbbbb" }, output: 1 },
      { input: { s: "pwwkew" }, output: 3 }
    ],
    constraints: ["0 <= s.length <= 5 * 10^4", "s consists of English letters, digits, symbols and spaces."]
  },
  statement: `# Longest Substring Without Repeating Characters

Given a string \`s\`, find the length of the longest substring without repeating characters.

[Official LeetCode Problem #3](https://leetcode.com/problems/longest-substring-without-repeating-characters/)`,
  starter: `import java.util.*;
import java.io.*;
import java.lang.*;

class Solution {
    public int lengthOfLongestSubstring(String s) {
        
    }
}`,
  ref: `import java.util.*;
import java.io.*;
import java.lang.*;

class Solution {
    public int lengthOfLongestSubstring(String s) {
        int[] last = new int[256];
        Arrays.fill(last, -1);
        int max = 0, start = 0;
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if (last[c] >= start) {
                start = last[c] + 1;
            }
            last[c] = i;
            if (i - start + 1 > max) max = i - start + 1;
        }
        return max;
    }
}`,
  hidden: [
    { inputs: { s: "" }, expected: 0 },
    { inputs: { s: " " }, expected: 1 },
    { inputs: { s: "au" }, expected: 2 },
    { inputs: { s: "dvdf" }, expected: 3 },
    { inputs: { s: "abba" }, expected: 2 },
    { inputs: { s: "tmmzuxt" }, expected: 5 },
    { inputs: { s: "abcdefg" }, expected: 7 },
    { inputs: { s: "aab" }, expected: 2 },
    { inputs: { s: "cdd" }, expected: 2 },
    { inputs: { s: "anviaj" }, expected: 5 },
    { inputs: { s: "asjrgapa" }, expected: 6 },
    { inputs: { s: "1234567890" }, expected: 10 },
    { inputs: { s: "a1b2c3d4" }, expected: 8 },
    { inputs: { s: "xyzxyzxyz" }, expected: 3 },
    { inputs: { s: "abcdeafghij" }, expected: 10 },
    { inputs: { s: "bpfbhmipx" }, expected: 7 }
  ]
});

// 33. Search in Rotated Sorted Array
problems.push({
  id: 33,
  meta: {
    id: 33,
    className: "Solution",
    methodName: "search",
    params: [{ name: "nums", type: "int[]" }, { name: "target", type: "int" }],
    returnType: "int",
    kind: "function",
    comparator: "exact",
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    examples: [
      { input: { nums: [4, 5, 6, 7, 0, 1, 2], target: 0 }, output: 4 },
      { input: { nums: [4, 5, 6, 7, 0, 1, 2], target: 3 }, output: -1 },
      { input: { nums: [1], target: 0 }, output: -1 }
    ],
    constraints: ["1 <= nums.length <= 5000", "-10^4 <= nums[i] <= 10^4", "All values of nums are unique.", "nums is an ascending array that is possibly rotated.", "-10^4 <= target <= 10^4"]
  },
  statement: `# Search in Rotated Sorted Array

There is an integer array \`nums\` sorted in ascending order (with distinct values).

Prior to being passed to your function, \`nums\` is possibly rotated at an unknown pivot index \`k\` (\`1 <= k < nums.length\`) such that the resulting array is \`[nums[k], nums[k+1], ..., nums[n-1], nums[0], nums[1], ..., nums[k-1]]\`.

Given the array \`nums\` after the possible rotation and an integer \`target\`, return the index of \`target\` if it is in \`nums\`, or \`-1\` if it is not in \`nums\`.

You must write an algorithm with \`O(log n)\` runtime complexity.

[Official LeetCode Problem #33](https://leetcode.com/problems/search-in-rotated-sorted-array/)`,
  starter: `import java.util.*;
import java.io.*;
import java.lang.*;

class Solution {
    public int search(int[] nums, int target) {
        
    }
}`,
  ref: `import java.util.*;
import java.io.*;
import java.lang.*;

class Solution {
    public int search(int[] nums, int target) {
        int l = 0, r = nums.length - 1;
        while (l <= r) {
            int m = l + (r - l) / 2;
            if (nums[m] == target) return m;
            if (nums[l] <= nums[m]) {
                if (nums[l] <= target && target < nums[m]) r = m - 1;
                else l = m + 1;
            } else {
                if (nums[m] < target && target <= nums[r]) l = m + 1;
                else r = m - 1;
            }
        }
        return -1;
    }
}`,
  hidden: [
    { inputs: { nums: [1], target: 1 }, expected: 0 },
    { inputs: { nums: [1, 3], target: 3 }, expected: 1 },
    { inputs: { nums: [3, 1], target: 1 }, expected: 1 },
    { inputs: { nums: [3, 1], target: 3 }, expected: 0 },
    { inputs: { nums: [5, 1, 3], target: 5 }, expected: 0 },
    { inputs: { nums: [5, 1, 3], target: 3 }, expected: 2 },
    { inputs: { nums: [4, 5, 6, 7, 8, 1, 2, 3], target: 8 }, expected: 4 },
    { inputs: { nums: [4, 5, 6, 7, 8, 1, 2, 3], target: 2 }, expected: 6 },
    { inputs: { nums: [4, 5, 6, 7, 8, 1, 2, 3], target: 10 }, expected: -1 },
    { inputs: { nums: [1, 2, 3, 4, 5, 6, 7], target: 4 }, expected: 3 },
    { inputs: { nums: [7, 1, 2, 3, 4, 5, 6], target: 7 }, expected: 0 },
    { inputs: { nums: [2, 3, 4, 5, 6, 7, 1], target: 1 }, expected: 6 },
    { inputs: { nums: [10, 20, 30, 40, 5], target: 5 }, expected: 4 },
    { inputs: { nums: [10, 20, 30, 40, 5], target: 30 }, expected: 2 },
    { inputs: { nums: [8, 9, 2, 3, 4], target: 9 }, expected: 1 },
    { inputs: { nums: [8, 9, 2, 3, 4], target: 1 }, expected: -1 }
  ]
});

// 56. Merge Intervals
problems.push({
  id: 56,
  meta: {
    id: 56,
    className: "Solution",
    methodName: "merge",
    params: [{ name: "intervals", type: "int[][]" }],
    returnType: "int[][]",
    kind: "function",
    comparator: "exact",
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    examples: [
      { input: { intervals: [[1, 3], [2, 6], [8, 10], [15, 18]] }, output: [[1, 6], [8, 10], [15, 18]], explanation: "Since intervals [1,3] and [2,6] overlap, merge them into [1,6]." },
      { input: { intervals: [[1, 4], [4, 5]] }, output: [[1, 5]], explanation: "Intervals [1,4] and [4,5] are considered overlapping." }
    ],
    constraints: ["1 <= intervals.length <= 10^4", "intervals[i].length == 2", "0 <= start_i <= end_i <= 10^4"]
  },
  statement: `# Merge Intervals

Given an array of \`intervals\` where \`intervals[i] = [start_i, end_i]\`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.

[Official LeetCode Problem #56](https://leetcode.com/problems/merge-intervals/)`,
  starter: `import java.util.*;
import java.io.*;
import java.lang.*;

class Solution {
    public int[][] merge(int[][] intervals) {
        
    }
}`,
  ref: `import java.util.*;
import java.io.*;
import java.lang.*;

class Solution {
    public int[][] merge(int[][] intervals) {
        if (intervals.length <= 1) return intervals;
        Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
        List<int[]> merged = new ArrayList<>();
        int[] curr = intervals[0];
        merged.add(curr);

        for (int i = 1; i < intervals.length; i++) {
            int[] next = intervals[i];
            if (next[0] <= curr[1]) {
                curr[1] = Math.max(curr[1], next[1]);
            } else {
                curr = next;
                merged.add(curr);
            }
        }
        return merged.toArray(new int[merged.size()][]);
    }
}`,
  hidden: [
    { inputs: { intervals: [[1, 4]] }, expected: [[1, 4]] },
    { inputs: { intervals: [[1, 4], [0, 4]] }, expected: [[0, 4]] },
    { inputs: { intervals: [[1, 4], [2, 3]] }, expected: [[1, 4]] },
    { inputs: { intervals: [[1, 4], [0, 0]] }, expected: [[0, 0], [1, 4]] },
    { inputs: { intervals: [[2, 3], [4, 5], [6, 7], [8, 9], [1, 10]] }, expected: [[1, 10]] },
    { inputs: { intervals: [[2, 3], [5, 5], [2, 2], [3, 4], [3, 4]] }, expected: [[2, 4], [5, 5]] },
    { inputs: { intervals: [[1, 3], [2, 6], [8, 9], [9, 11], [8, 10], [2, 4], [15, 18], [16, 17]] }, expected: [[1, 6], [8, 11], [15, 18]] },
    { inputs: { intervals: [[1, 2], [3, 4], [5, 6]] }, expected: [[1, 2], [3, 4], [5, 6]] },
    { inputs: { intervals: [[1, 10], [2, 3], [4, 5]] }, expected: [[1, 10]] },
    { inputs: { intervals: [[1, 5], [2, 6], [3, 7]] }, expected: [[1, 7]] },
    { inputs: { intervals: [[0, 2], [1, 4], [3, 5]] }, expected: [[0, 5]] },
    { inputs: { intervals: [[10, 20], [20, 30]] }, expected: [[10, 30]] },
    { inputs: { intervals: [[1, 5], [6, 10]] }, expected: [[1, 5], [6, 10]] },
    { inputs: { intervals: [[5, 10], [1, 4]] }, expected: [[1, 4], [5, 10]] },
    { inputs: { intervals: [[1, 2], [2, 3], [3, 4], [4, 5]] }, expected: [[1, 5]] },
    { inputs: { intervals: [[0, 0], [1, 1], [2, 2]] }, expected: [[0, 0], [1, 1], [2, 2]] }
  ]
});

// 268. Missing Number
problems.push({
  id: 268,
  meta: {
    id: 268,
    className: "Solution",
    methodName: "missingNumber",
    params: [{ name: "nums", type: "int[]" }],
    returnType: "int",
    kind: "function",
    comparator: "exact",
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    examples: [
      { input: { nums: [3, 0, 1] }, output: 2 },
      { input: { nums: [0, 1] }, output: 2 },
      { input: { nums: [9, 6, 4, 2, 3, 5, 7, 0, 1] }, output: 8 }
    ],
    constraints: ["n == nums.length", "1 <= n <= 10^4", "0 <= nums[i] <= n", "All the numbers of nums are unique."]
  },
  statement: `# Missing Number

Given an array \`nums\` containing \`n\` distinct numbers in the range \`[0, n]\`, return the only number in the range that is missing from the array.

[Official LeetCode Problem #268](https://leetcode.com/problems/missing-number/)`,
  starter: `import java.util.*;
import java.io.*;
import java.lang.*;

class Solution {
    public int missingNumber(int[] nums) {
        
    }
}`,
  ref: `import java.util.*;
import java.io.*;
import java.lang.*;

class Solution {
    public int missingNumber(int[] nums) {
        int n = nums.length;
        int expected = n * (n + 1) / 2;
        int actual = 0;
        for (int x : nums) actual += x;
        return expected - actual;
    }
}`,
  hidden: [
    { inputs: { nums: [0] }, expected: 1 },
    { inputs: { nums: [1] }, expected: 0 },
    { inputs: { nums: [1, 2] }, expected: 0 },
    { inputs: { nums: [0, 2] }, expected: 1 },
    { inputs: { nums: [0, 1, 2, 4] }, expected: 3 },
    { inputs: { nums: [1, 2, 3, 4] }, expected: 0 },
    { inputs: { nums: [0, 1, 2, 3] }, expected: 4 },
    { inputs: { nums: [8, 6, 4, 2, 3, 5, 7, 0, 1] }, expected: 9 },
    { inputs: { nums: [4, 3, 2, 1, 0] }, expected: 5 },
    { inputs: { nums: [5, 4, 3, 2, 1, 0] }, expected: 6 },
    { inputs: { nums: [10, 9, 8, 7, 6, 5, 4, 3, 2, 1] }, expected: 0 },
    { inputs: { nums: [0, 1, 3, 4, 5, 6, 7, 8, 9, 10] }, expected: 2 },
    { inputs: { nums: [2, 0] }, expected: 1 },
    { inputs: { nums: [3, 2, 0] }, expected: 1 },
    { inputs: { nums: [0, 1, 2, 3, 4, 5, 7] }, expected: 6 },
    { inputs: { nums: [0, 1, 2, 3, 5, 6, 7] }, expected: 4 }
  ]
});

for (const p of problems) {
  writeProblem(p);
}
console.log('Finished Days 3-5 batch!');
