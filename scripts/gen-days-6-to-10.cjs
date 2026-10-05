const fs = require('fs');
const path = require('path');

function writeProblem(meta, statement, starter, refSolution, tests) {
  const contentDir = path.join(__dirname, '..', 'content', 'problems', String(meta.id));
  const starterDir = path.join(contentDir, 'starter');
  const privateDir = path.join(__dirname, '..', 'server', 'private', String(meta.id));

  fs.mkdirSync(starterDir, { recursive: true });
  fs.mkdirSync(privateDir, { recursive: true });

  fs.writeFileSync(path.join(contentDir, 'meta.json'), JSON.stringify(meta, null, 2), 'utf8');
  fs.writeFileSync(path.join(contentDir, 'statement.md'), statement.trim() + '\n', 'utf8');
  fs.writeFileSync(path.join(starterDir, 'Solution.java'), starter.trim() + '\n', 'utf8');
  fs.writeFileSync(path.join(privateDir, 'Solution.java'), refSolution.trim() + '\n', 'utf8');
  fs.writeFileSync(path.join(privateDir, 'tests.json'), JSON.stringify(tests, null, 2), 'utf8');
}

const problems = [
  // -------------------------------------------------------------
  // Day 6
  // -------------------------------------------------------------
  {
    id: 238,
    meta: {
      id: 238,
      title: "Product of Array Except Self",
      slug: "product-of-array-except-self",
      difficulty: "Medium",
      day: 6,
      category: "Array",
      order: 1,
      timeEstimateMinutes: 25,
      className: "Solution",
      methodName: "productExceptSelf",
      kind: "function",
      comparator: "exact",
      params: [{ name: "nums", type: "int[]" }],
      returnType: "int[]",
      examples: [
        { input: { nums: [1, 2, 3, 4] }, output: [24, 12, 8, 6] },
        { input: { nums: [-1, 1, 0, -3, 3] }, output: [0, 0, 9, 0, 0] }
      ],
      constraints: ["2 <= nums.length <= 10^5", "-30 <= nums[i] <= 30", "The product of any prefix or suffix of nums fits in a 32-bit integer."]
    },
    statement: `Given an integer array \`nums\`, return an array \`answer\` such that \`answer[i]\` is equal to the product of all the elements of \`nums\` except \`nums[i]\`.

The product of any prefix or suffix of \`nums\` is guaranteed to fit in a 32-bit integer.

You must write an algorithm that runs in \`O(n)\` time and without using the division operation.`,
    starter: `import java.util.*;
import java.io.*;
import java.lang.*;

class Solution {
    public int[] productExceptSelf(int[] nums) {
        
    }
}`,
    refSolution: `import java.util.*;

class Solution {
    public int[] productExceptSelf(int[] nums) {
        int n = nums.length;
        int[] res = new int[n];
        res[0] = 1;
        for (int i = 1; i < n; i++) {
            res[i] = res[i - 1] * nums[i - 1];
        }
        int right = 1;
        for (int i = n - 1; i >= 0; i--) {
            res[i] *= right;
            right *= nums[i];
        }
        return res;
    }
}`,
    tests: [
      { inputs: { nums: [1, 2, 3, 4] }, expected: [24, 12, 8, 6] },
      { inputs: { nums: [-1, 1, 0, -3, 3] }, expected: [0, 0, 9, 0, 0] },
      { inputs: { nums: [2, 3] }, expected: [3, 2] },
      { inputs: { nums: [0, 0] }, expected: [0, 0] },
      { inputs: { nums: [1, 1, 1, 1] }, expected: [1, 1, 1, 1] },
      { inputs: { nums: [5, 2, 3] }, expected: [6, 15, 10] },
      { inputs: { nums: [-2, -3, -4] }, expected: [12, 8, 6] },
      { inputs: { nums: [4, 5, 1, 8, 2] }, expected: [80, 64, 320, 40, 160] },
      { inputs: { nums: [0, 4, 5] }, expected: [20, 0, 0] },
      { inputs: { nums: [9, 0, -2] }, expected: [0, -18, 0] },
      { inputs: { nums: [1, -1, 1, -1] }, expected: [-1, 1, -1, 1] },
      { inputs: { nums: [2, 2, 2, 2, 2] }, expected: [16, 16, 16, 16, 16] },
      { inputs: { nums: [10, 3, 5, 6, 2] }, expected: [180, 600, 360, 300, 900] },
      { inputs: { nums: [-1, -2, -3, -4, -5] }, expected: [120, 60, 40, 30, 24] },
      { inputs: { nums: [3, 4, 5, 6] }, expected: [120, 90, 72, 60] },
      { inputs: { nums: [1, 2, 0, 4, 5] }, expected: [0, 0, 40, 0, 0] }
    ]
  },
  {
    id: 11,
    meta: {
      id: 11,
      title: "Container With Most Water",
      slug: "container-with-most-water",
      difficulty: "Medium",
      day: 6,
      category: "Two Pointers",
      order: 2,
      timeEstimateMinutes: 25,
      className: "Solution",
      methodName: "maxArea",
      kind: "function",
      comparator: "exact",
      params: [{ name: "height", type: "int[]" }],
      returnType: "int",
      examples: [
        { input: { height: [1, 8, 6, 2, 5, 4, 8, 3, 7] }, output: 49 },
        { input: { height: [1, 1] }, output: 1 }
      ],
      constraints: ["n == height.length", "2 <= n <= 10^5", "0 <= height[i] <= 10^4"]
    },
    statement: `You are given an integer array \`height\` of length \`n\`. There are \`n\` vertical lines drawn such that the two endpoints of the \`i\`th line are \`(i, 0)\` and \`(i, height[i])\`.

Find two lines that together with the x-axis form a container, such that the container contains the most water.

Return the maximum amount of water a container can store.

Notice that you may not slant the container.`,
    starter: `import java.util.*;
import java.io.*;
import java.lang.*;

class Solution {
    public int maxArea(int[] height) {
        
    }
}`,
    refSolution: `import java.util.*;

class Solution {
    public int maxArea(int[] height) {
        int left = 0, right = height.length - 1;
        int maxArea = 0;
        while (left < right) {
            int h = Math.min(height[left], height[right]);
            maxArea = Math.max(maxArea, h * (right - left));
            if (height[left] < height[right]) {
                left++;
            } else {
                right--;
            }
        }
        return maxArea;
    }
}`,
    tests: [
      { inputs: { height: [1, 8, 6, 2, 5, 4, 8, 3, 7] }, expected: 49 },
      { inputs: { height: [1, 1] }, expected: 1 },
      { inputs: { height: [4, 3, 2, 1, 4] }, expected: 16 },
      { inputs: { height: [1, 2, 1] }, expected: 2 },
      { inputs: { height: [2, 3, 4, 5, 18, 17, 6] }, expected: 17 },
      { inputs: { height: [1, 2, 4, 3] }, expected: 4 },
      { inputs: { height: [6, 9] }, expected: 6 },
      { inputs: { height: [0, 2] }, expected: 0 },
      { inputs: { height: [1, 8, 100, 2, 100, 4, 8, 3, 7] }, expected: 200 },
      { inputs: { height: [10, 9, 8, 7, 6, 5, 4, 3, 2, 1] }, expected: 25 },
      { inputs: { height: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }, expected: 25 },
      { inputs: { height: [5, 5, 5, 5] }, expected: 15 },
      { inputs: { height: [1, 3, 2, 5, 25, 24, 5] }, expected: 24 },
      { inputs: { height: [10, 14, 10, 4, 10, 2, 6, 1, 6, 12] }, expected: 96 },
      { inputs: { height: [2, 1] }, expected: 1 },
      { inputs: { height: [100, 100] }, expected: 100 }
    ]
  },
  {
    id: 19,
    meta: {
      id: 19,
      title: "Remove Nth Node From End of List",
      slug: "remove-nth-node-from-end-of-list",
      difficulty: "Medium",
      day: 6,
      category: "Linked List",
      order: 3,
      timeEstimateMinutes: 25,
      className: "Solution",
      methodName: "removeNthFromEnd",
      kind: "function",
      comparator: "exact",
      params: [{ name: "head", type: "ListNode" }, { name: "n", type: "int" }],
      returnType: "ListNode",
      examples: [
        { input: { head: [1, 2, 3, 4, 5], n: 2 }, output: [1, 2, 3, 5] },
        { input: { head: [1], n: 1 }, output: [] },
        { input: { head: [1, 2], n: 1 }, output: [1] }
      ],
      constraints: ["The number of nodes in the list is sz.", "1 <= sz <= 30", "0 <= Node.val <= 100", "1 <= n <= sz"]
    },
    statement: `Given the \`head\` of a linked list, remove the \`n\`th node from the end of the list and return its head.`,
    starter: `import java.util.*;
import java.io.*;
import java.lang.*;

class Solution {
    public ListNode removeNthFromEnd(ListNode head, int n) {
        
    }
}`,
    refSolution: `import java.util.*;

class Solution {
    public ListNode removeNthFromEnd(ListNode head, int n) {
        ListNode dummy = new ListNode(0);
        dummy.next = head;
        ListNode first = dummy;
        ListNode second = dummy;
        for (int i = 0; i <= n; i++) {
            first = first.next;
        }
        while (first != null) {
            first = first.next;
            second = second.next;
        }
        second.next = second.next.next;
        return dummy.next;
    }
}`,
    tests: [
      { inputs: { head: [1, 2, 3, 4, 5], n: 2 }, expected: [1, 2, 3, 5] },
      { inputs: { head: [1], n: 1 }, expected: [] },
      { inputs: { head: [1, 2], n: 1 }, expected: [1] },
      { inputs: { head: [1, 2], n: 2 }, expected: [2] },
      { inputs: { head: [1, 2, 3], n: 1 }, expected: [1, 2] },
      { inputs: { head: [1, 2, 3], n: 2 }, expected: [1, 3] },
      { inputs: { head: [1, 2, 3], n: 3 }, expected: [2, 3] },
      { inputs: { head: [7, 8, 9, 10], n: 4 }, expected: [8, 9, 10] },
      { inputs: { head: [7, 8, 9, 10], n: 1 }, expected: [7, 8, 9] },
      { inputs: { head: [10, 20, 30, 40, 50, 60], n: 3 }, expected: [10, 20, 30, 50, 60] },
      { inputs: { head: [5, 4, 3, 2, 1], n: 5 }, expected: [4, 3, 2, 1] },
      { inputs: { head: [9, 9, 9], n: 2 }, expected: [9, 9] },
      { inputs: { head: [1, 2, 3, 4], n: 2 }, expected: [1, 2, 4] },
      { inputs: { head: [1, 2, 3, 4, 5, 6], n: 6 }, expected: [2, 3, 4, 5, 6] },
      { inputs: { head: [1, 2, 3, 4, 5, 6], n: 1 }, expected: [1, 2, 3, 4, 5] },
      { inputs: { head: [4, 2, 8, 6, 0], n: 3 }, expected: [4, 2, 6, 0] }
    ]
  },
  {
    id: 572,
    meta: {
      id: 572,
      title: "Subtree of Another Tree",
      slug: "subtree-of-another-tree",
      difficulty: "Easy",
      day: 6,
      category: "Trees",
      order: 4,
      timeEstimateMinutes: 20,
      className: "Solution",
      methodName: "isSubtree",
      kind: "function",
      comparator: "exact",
      params: [{ name: "root", type: "TreeNode" }, { name: "subRoot", type: "TreeNode" }],
      returnType: "boolean",
      examples: [
        { input: { root: [3, 4, 5, 1, 2], subRoot: [4, 1, 2] }, output: true },
        { input: { root: [3, 4, 5, 1, 2, null, null, null, null, 0], subRoot: [4, 1, 2] }, output: false }
      ],
      constraints: ["The number of nodes in the root tree is in the range [1, 2000].", "The number of nodes in the subRoot tree is in the range [1, 1000].", "-10^4 <= root.val <= 10^4", "-10^4 <= subRoot.val <= 10^4"]
    },
    statement: `Given the roots of two binary trees \`root\` and \`subRoot\`, return \`true\` if there is a subtree of \`root\` with the same structure and node values of \`subRoot\` and \`false\` otherwise.

A subtree of a binary tree \`tree\` is a tree that consists of a node in \`tree\` and all of this node's descendants. The tree \`tree\` could also be considered as a subtree of itself.`,
    starter: `import java.util.*;
import java.io.*;
import java.lang.*;

class Solution {
    public boolean isSubtree(TreeNode root, TreeNode subRoot) {
        
    }
}`,
    refSolution: `import java.util.*;

class Solution {
    public boolean isSubtree(TreeNode root, TreeNode subRoot) {
        if (root == null) return false;
        if (isSame(root, subRoot)) return true;
        return isSubtree(root.left, subRoot) || isSubtree(root.right, subRoot);
    }

    private boolean isSame(TreeNode a, TreeNode b) {
        if (a == null && b == null) return true;
        if (a == null || b == null) return false;
        if (a.val != b.val) return false;
        return isSame(a.left, b.left) && isSame(a.right, b.right);
    }
}`,
    tests: [
      { inputs: { root: [3, 4, 5, 1, 2], subRoot: [4, 1, 2] }, expected: true },
      { inputs: { root: [3, 4, 5, 1, 2, null, null, null, null, 0], subRoot: [4, 1, 2] }, expected: false },
      { inputs: { root: [1], subRoot: [1] }, expected: true },
      { inputs: { root: [1], subRoot: [2] }, expected: false },
      { inputs: { root: [1, 2, 3], subRoot: [2] }, expected: true },
      { inputs: { root: [1, 2, 3], subRoot: [3] }, expected: true },
      { inputs: { root: [1, 2, 3], subRoot: [1, 2] }, expected: false },
      { inputs: { root: [1, 1], subRoot: [1] }, expected: true },
      { inputs: { root: [3, 4, 5, 1, null, 2], subRoot: [3, 4, 5, 1, null, 2] }, expected: true },
      { inputs: { root: [1, null, 1, null, 1, null, 1, null, 1, null, 1, 2], subRoot: [1, null, 1, 2] }, expected: true },
      { inputs: { root: [4, 2, 6, 1, 3, 5, 7], subRoot: [2, 1, 3] }, expected: true },
      { inputs: { root: [4, 2, 6, 1, 3, 5, 7], subRoot: [6, 5, 7] }, expected: true },
      { inputs: { root: [4, 2, 6, 1, 3, 5, 7], subRoot: [6, 5, null] }, expected: false },
      { inputs: { root: [10, 5, 15, 3, 7], subRoot: [5, 3, 7] }, expected: true },
      { inputs: { root: [10, 5, 15, 3, 7], subRoot: [5, 3, null] }, expected: false },
      { inputs: { root: [1, 2, null, 3], subRoot: [2, 3] }, expected: true }
    ]
  },
  {
    id: 55,
    meta: {
      id: 55,
      title: "Jump Game",
      slug: "jump-game",
      difficulty: "Medium",
      day: 6,
      category: "Greedy",
      order: 5,
      timeEstimateMinutes: 25,
      className: "Solution",
      methodName: "canJump",
      kind: "function",
      comparator: "exact",
      params: [{ name: "nums", type: "int[]" }],
      returnType: "boolean",
      examples: [
        { input: { nums: [2, 3, 1, 1, 4] }, output: true },
        { input: { nums: [3, 2, 1, 0, 4] }, output: false }
      ],
      constraints: ["1 <= nums.length <= 10^4", "0 <= nums[i] <= 10^5"]
    },
    statement: `You are given an integer array \`nums\`. You are initially positioned at the array's first index, and each element in the array represents your maximum jump length at that position.

Return \`true\` if you can reach the last index, or \`false\` otherwise.`,
    starter: `import java.util.*;
import java.io.*;
import java.lang.*;

class Solution {
    public boolean canJump(int[] nums) {
        
    }
}`,
    refSolution: `import java.util.*;

class Solution {
    public boolean canJump(int[] nums) {
        int maxReach = 0;
        for (int i = 0; i < nums.length; i++) {
            if (i > maxReach) return false;
            maxReach = Math.max(maxReach, i + nums[i]);
            if (maxReach >= nums.length - 1) return true;
        }
        return true;
    }
}`,
    tests: [
      { inputs: { nums: [2, 3, 1, 1, 4] }, expected: true },
      { inputs: { nums: [3, 2, 1, 0, 4] }, expected: false },
      { inputs: { nums: [0] }, expected: true },
      { inputs: { nums: [1] }, expected: true },
      { inputs: { nums: [2, 0, 0] }, expected: true },
      { inputs: { nums: [1, 0, 1] }, expected: false },
      { inputs: { nums: [2, 5, 0, 0] }, expected: true },
      { inputs: { nums: [1, 2, 3] }, expected: true },
      { inputs: { nums: [0, 2, 3] }, expected: false },
      { inputs: { nums: [1, 1, 1, 1, 1] }, expected: true },
      { inputs: { nums: [5, 4, 3, 2, 1, 0, 0] }, expected: false },
      { inputs: { nums: [1, 1, 0, 1] }, expected: false },
      { inputs: { nums: [1, 2, 0, 1] }, expected: true },
      { inputs: { nums: [3, 0, 8, 2, 0, 0, 1] }, expected: true },
      { inputs: { nums: [1, 0] }, expected: true },
      { inputs: { nums: [0, 1] }, expected: false }
    ]
  },

  // -------------------------------------------------------------
  // Day 7
  // -------------------------------------------------------------
  {
    id: 271,
    meta: {
      id: 271,
      title: "Encode and Decode Strings",
      slug: "encode-and-decode-strings",
      difficulty: "Medium",
      day: 7,
      category: "String",
      order: 1,
      timeEstimateMinutes: 25,
      className: "Solution",
      methodName: "encodeDecode",
      kind: "function",
      comparator: "exact",
      params: [{ name: "strs", type: "List<String>" }],
      returnType: "List<String>",
      examples: [
        { input: { strs: ["lint", "code", "love", "you"] }, output: ["lint", "code", "love", "you"] },
        { input: { strs: ["we", "say", ":", "yes"] }, output: ["we", "say", ":", "yes"] }
      ],
      constraints: ["0 <= strs.length <= 200", "0 <= strs[i].length <= 200", "strs[i] contains any possible characters out of 256 valid ASCII characters."]
    },
    statement: `Design an algorithm to encode a list of strings to a single string. The encoded string is then sent over the network and is decoded back to the original list of strings.

Please implement \`encode\` and \`decode\` methods:
- \`encode\`: converts a list of strings into a single string.
- \`decode\`: converts the single string back into the list of strings.`,
    starter: `import java.util.*;
import java.io.*;
import java.lang.*;

class Solution {
    // Encodes a list of strings to a single string.
    public String encode(List<String> strs) {
        
    }

    // Decodes a single string to a list of strings.
    public List<String> decode(String s) {
        
    }

    public List<String> encodeDecode(List<String> strs) {
        return decode(encode(strs));
    }
}`,
    refSolution: `import java.util.*;

class Solution {
    public String encode(List<String> strs) {
        StringBuilder sb = new StringBuilder();
        for (String s : strs) {
            sb.append(s.length()).append('#').append(s);
        }
        return sb.toString();
    }

    public List<String> decode(String s) {
        List<String> res = new ArrayList<>();
        int i = 0;
        while (i < s.length()) {
            int slash = s.indexOf('#', i);
            int len = Integer.parseInt(s.substring(i, slash));
            i = slash + 1;
            res.add(s.substring(i, i + len));
            i += len;
        }
        return res;
    }

    public List<String> encodeDecode(List<String> strs) {
        return decode(encode(strs));
    }
}`,
    tests: [
      { inputs: { strs: ["lint", "code", "love", "you"] }, expected: ["lint", "code", "love", "you"] },
      { inputs: { strs: ["we", "say", ":", "yes"] }, expected: ["we", "say", ":", "yes"] },
      { inputs: { strs: [] }, expected: [] },
      { inputs: { strs: [""] }, expected: [""] },
      { inputs: { strs: ["", ""] }, expected: ["", ""] },
      { inputs: { strs: ["abc", "12#34", "###", "hello"] }, expected: ["abc", "12#34", "###", "hello"] },
      { inputs: { strs: ["special", "!@#$%^&*()_+", "newline\n", "\ttab"] }, expected: ["special", "!@#$%^&*()_+", "newline\n", "\ttab"] },
      { inputs: { strs: ["one"] }, expected: ["one"] },
      { inputs: { strs: ["a", "b", "c", "d"] }, expected: ["a", "b", "c", "d"] },
      { inputs: { strs: ["123", "456", "789"] }, expected: ["123", "456", "789"] },
      { inputs: { strs: ["4#lint", "4#code"] }, expected: ["4#lint", "4#code"] },
      { inputs: { strs: ["spaces inside words", "   leading", "trailing   "] }, expected: ["spaces inside words", "   leading", "trailing   "] },
      { inputs: { strs: ["mixed", "10#characters", "0#", "#"] }, expected: ["mixed", "10#characters", "0#", "#"] },
      { inputs: { strs: ["unicode", "alpha", "beta"] }, expected: ["unicode", "alpha", "beta"] },
      { inputs: { strs: ["single letter", "a"] }, expected: ["single letter", "a"] },
      { inputs: { strs: ["final", "test", "case"] }, expected: ["final", "test", "case"] }
    ]
  },
  {
    id: 424,
    meta: {
      id: 424,
      title: "Longest Repeating Character Replacement",
      slug: "longest-repeating-character-replacement",
      difficulty: "Medium",
      day: 7,
      category: "Sliding Window",
      order: 2,
      timeEstimateMinutes: 30,
      className: "Solution",
      methodName: "characterReplacement",
      kind: "function",
      comparator: "exact",
      params: [{ name: "s", type: "String" }, { name: "k", type: "int" }],
      returnType: "int",
      examples: [
        { input: { s: "ABAB", k: 2 }, output: 4 },
        { input: { s: "AABABBA", k: 1 }, output: 4 }
      ],
      constraints: ["1 <= s.length <= 10^5", "s consists of only uppercase English letters.", "0 <= k <= s.length"]
    },
    statement: `You are given a string \`s\` and an integer \`k\`. You can choose any character of the string and change it to any other uppercase English character. You can perform this operation at most \`k\` times.

Return the length of the longest substring containing the same letter you can get after performing the above operations.`,
    starter: `import java.util.*;
import java.io.*;
import java.lang.*;

class Solution {
    public int characterReplacement(String s, int k) {
        
    }
}`,
    refSolution: `import java.util.*;

class Solution {
    public int characterReplacement(String s, int k) {
        int[] counts = new int[26];
        int left = 0, maxCount = 0, maxLength = 0;
        for (int right = 0; right < s.length(); right++) {
            maxCount = Math.max(maxCount, ++counts[s.charAt(right) - 'A']);
            while ((right - left + 1) - maxCount > k) {
                counts[s.charAt(left) - 'A']--;
                left++;
            }
            maxLength = Math.max(maxLength, right - left + 1);
        }
        return maxLength;
    }
}`,
    tests: [
      { inputs: { s: "ABAB", k: 2 }, expected: 4 },
      { inputs: { s: "AABABBA", k: 1 }, expected: 4 },
      { inputs: { s: "AAAA", k: 2 }, expected: 4 },
      { inputs: { s: "ABCD", k: 0 }, expected: 1 },
      { inputs: { s: "ABCD", k: 1 }, expected: 2 },
      { inputs: { s: "ABCD", k: 2 }, expected: 3 },
      { inputs: { s: "ABCD", k: 3 }, expected: 4 },
      { inputs: { s: "A", k: 0 }, expected: 1 },
      { inputs: { s: "ABAA", k: 0 }, expected: 2 },
      { inputs: { s: "BAAA", k: 0 }, expected: 3 },
      { inputs: { s: "KRSCDCSONAJNHLBMDQGIFCPEKABNABIKZWILGABFDNYIHAMMYAQURAIRKICJAISIOYZZACMGOHABAXBGNATSNVGMOBVAUVARASIB", k: 4 }, expected: 7 },
      { inputs: { s: "EOEMQLLQTRQDDCOACUBECIWIPPFORQGNYCIBIBCGARENKBBENASADJHSNOATCVDRIYAHYHAMMYAQURAIRKICJAISIOYZZACMGOHAB", k: 7 }, expected: 11 },
      { inputs: { s: "BAAAB", k: 2 }, expected: 5 },
      { inputs: { s: "ABBB", k: 2 }, expected: 4 },
      { inputs: { s: "AABA", k: 0 }, expected: 2 },
      { inputs: { s: "ABBBBA", k: 1 }, expected: 5 }
    ]
  },
  {
    id: 102,
    meta: {
      id: 102,
      title: "Binary Tree Level Order Traversal",
      slug: "binary-tree-level-order-traversal",
      difficulty: "Medium",
      day: 7,
      category: "Trees",
      order: 3,
      timeEstimateMinutes: 20,
      className: "Solution",
      methodName: "levelOrder",
      kind: "function",
      comparator: "exact",
      params: [{ name: "root", type: "TreeNode" }],
      returnType: "List<List<Integer>>",
      examples: [
        { input: { root: [3, 9, 20, null, null, 15, 7] }, output: [[3], [9, 20], [15, 7]] },
        { input: { root: [1] }, output: [[1]] },
        { input: { root: [] }, output: [] }
      ],
      constraints: ["The number of nodes in the tree is in the range [0, 2000].", "-1000 <= Node.val <= 1000"]
    },
    statement: `Given the \`root\` of a binary tree, return the level order traversal of its nodes' values (i.e., from left to right, level by level).`,
    starter: `import java.util.*;
import java.io.*;
import java.lang.*;

class Solution {
    public List<List<Integer>> levelOrder(TreeNode root) {
        
    }
}`,
    refSolution: `import java.util.*;

class Solution {
    public List<List<Integer>> levelOrder(TreeNode root) {
        List<List<Integer>> res = new ArrayList<>();
        if (root == null) return res;
        java.util.Queue<TreeNode> queue = new java.util.LinkedList<>();
        queue.offer(root);
        while (!queue.isEmpty()) {
            int levelSize = queue.size();
            List<Integer> currentLevel = new ArrayList<>();
            for (int i = 0; i < levelSize; i++) {
                TreeNode node = queue.poll();
                currentLevel.add(node.val);
                if (node.left != null) queue.offer(node.left);
                if (node.right != null) queue.offer(node.right);
            }
            res.add(currentLevel);
        }
        return res;
    }
}`,
    tests: [
      { inputs: { root: [3, 9, 20, null, null, 15, 7] }, expected: [[3], [9, 20], [15, 7]] },
      { inputs: { root: [1] }, expected: [[1]] },
      { inputs: { root: [] }, expected: [] },
      { inputs: { root: [1, 2, 3, 4, 5] }, expected: [[1], [2, 3], [4, 5]] },
      { inputs: { root: [1, 2, null, 3, null, 4] }, expected: [[1], [2], [3], [4]] },
      { inputs: { root: [1, null, 2, null, 3, null, 4] }, expected: [[1], [2], [3], [4]] },
      { inputs: { root: [1, 2, 3, 4, null, null, 5] }, expected: [[1], [2, 3], [4, 5]] },
      { inputs: { root: [5, 4, 8, 11, null, 13, 4, 7, 2] }, expected: [[5], [4, 8], [11, 13, 4], [7, 2]] },
      { inputs: { root: [0] }, expected: [[0]] },
      { inputs: { root: [-10, 9, 20] }, expected: [[-10], [9, 20]] },
      { inputs: { root: [1, 2] }, expected: [[1], [2]] },
      { inputs: { root: [1, null, 2] }, expected: [[1], [2]] },
      { inputs: { root: [1, 2, 3] }, expected: [[1], [2, 3]] },
      { inputs: { root: [3, 1, 4, null, 2] }, expected: [[3], [1, 4], [2]] },
      { inputs: { root: [1, 2, 3, 4, 5, 6, 7] }, expected: [[1], [2, 3], [4, 5, 6, 7]] },
      { inputs: { root: [10, 20, 30, 40] }, expected: [[10], [20, 30], [40]] }
    ]
  },
  {
    id: 322,
    meta: {
      id: 322,
      title: "Coin Change",
      slug: "coin-change",
      difficulty: "Medium",
      day: 7,
      category: "Dynamic Programming",
      order: 4,
      timeEstimateMinutes: 30,
      className: "Solution",
      methodName: "coinChange",
      kind: "function",
      comparator: "exact",
      params: [{ name: "coins", type: "int[]" }, { name: "amount", type: "int" }],
      returnType: "int",
      examples: [
        { input: { coins: [1, 2, 5], amount: 11 }, output: 3 },
        { input: { coins: [2], amount: 3 }, output: -1 },
        { input: { coins: [1], amount: 0 }, output: 0 }
      ],
      constraints: ["1 <= coins.length <= 12", "1 <= coins[i] <= 2^31 - 1", "0 <= amount <= 10^4"]
    },
    statement: `You are given an integer array \`coins\` representing coins of different denominations and an integer \`amount\` representing a total amount of money.

Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return \`-1\`.

You may assume that you have an infinite number of each kind of coin.`,
    starter: `import java.util.*;
import java.io.*;
import java.lang.*;

class Solution {
    public int coinChange(int[] coins, int amount) {
        
    }
}`,
    refSolution: `import java.util.*;

class Solution {
    public int coinChange(int[] coins, int amount) {
        int max = amount + 1;
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, max);
        dp[0] = 0;
        for (int i = 1; i <= amount; i++) {
            for (int c : coins) {
                if (c <= i) {
                    dp[i] = Math.min(dp[i], dp[i - c] + 1);
                }
            }
        }
        return dp[amount] > amount ? -1 : dp[amount];
    }
}`,
    tests: [
      { inputs: { coins: [1, 2, 5], amount: 11 }, expected: 3 },
      { inputs: { coins: [2], amount: 3 }, expected: -1 },
      { inputs: { coins: [1], amount: 0 }, expected: 0 },
      { inputs: { coins: [1], amount: 1 }, expected: 1 },
      { inputs: { coins: [1], amount: 2 }, expected: 2 },
      { inputs: { coins: [2, 5, 10, 1], amount: 27 }, expected: 4 },
      { inputs: { coins: [186, 419, 83, 408], amount: 6249 }, expected: 20 },
      { inputs: { coins: [3, 7, 405, 436], amount: 8839 }, expected: 25 },
      { inputs: { coins: [1, 3, 5], amount: 8 }, expected: 2 },
      { inputs: { coins: [2], amount: 4 }, expected: 2 },
      { inputs: { coins: [2, 4], amount: 7 }, expected: -1 },
      { inputs: { coins: [5], amount: 5 }, expected: 1 },
      { inputs: { coins: [5], amount: 14 }, expected: -1 },
      { inputs: { coins: [1, 5, 10, 25], amount: 30 }, expected: 2 },
      { inputs: { coins: [1, 5, 10, 25], amount: 99 }, expected: 9 },
      { inputs: { coins: [7, 11], amount: 29 }, expected: -1 }
    ]
  },
  {
    id: 57,
    meta: {
      id: 57,
      title: "Insert Interval",
      slug: "insert-interval",
      difficulty: "Medium",
      day: 7,
      category: "Intervals",
      order: 5,
      timeEstimateMinutes: 30,
      className: "Solution",
      methodName: "insert",
      kind: "function",
      comparator: "exact",
      params: [{ name: "intervals", type: "int[][]" }, { name: "newInterval", type: "int[]" }],
      returnType: "int[][]",
      examples: [
        { input: { intervals: [[1, 3], [6, 9]], newInterval: [2, 5] }, output: [[1, 5], [6, 9]] },
        { input: { intervals: [[1, 2], [3, 5], [6, 7], [8, 10], [12, 16]], newInterval: [4, 8] }, output: [[1, 2], [3, 10], [12, 16]] }
      ],
      constraints: ["0 <= intervals.length <= 10^4", "intervals[i].length == 2", "0 <= start_i <= end_i <= 10^5", "intervals is sorted by start_i in ascending order.", "newInterval.length == 2", "0 <= start <= end <= 10^5"]
    },
    statement: `You are given an array of non-overlapping intervals \`intervals\` where \`intervals[i] = [start_i, end_i]\` represent the start and the end of the \`i\`th interval and \`intervals\` is sorted in ascending order by \`start_i\`. You are also given an interval \`newInterval = [start, end]\` that represents the start and end of another interval.

Insert \`newInterval\` into \`intervals\` such that \`intervals\` is still sorted in ascending order by \`start_i\` and \`intervals\` still does not have any overlapping intervals (merge overlapping intervals if necessary).

Return \`intervals\` after the insertion.`,
    starter: `import java.util.*;
import java.io.*;
import java.lang.*;

class Solution {
    public int[][] insert(int[][] intervals, int[] newInterval) {
        
    }
}`,
    refSolution: `import java.util.*;

class Solution {
    public int[][] insert(int[][] intervals, int[] newInterval) {
        List<int[]> result = new ArrayList<>();
        int i = 0;
        int n = intervals.length;

        while (i < n && intervals[i][1] < newInterval[0]) {
            result.add(intervals[i]);
            i++;
        }

        while (i < n && intervals[i][0] <= newInterval[1]) {
            newInterval[0] = Math.min(newInterval[0], intervals[i][0]);
            newInterval[1] = Math.max(newInterval[1], intervals[i][1]);
            i++;
        }
        result.add(newInterval);

        while (i < n) {
            result.add(intervals[i]);
            i++;
        }

        return result.toArray(new int[result.size()][]);
    }
}`,
    tests: [
      { inputs: { intervals: [[1, 3], [6, 9]], newInterval: [2, 5] }, expected: [[1, 5], [6, 9]] },
      { inputs: { intervals: [[1, 2], [3, 5], [6, 7], [8, 10], [12, 16]], newInterval: [4, 8] }, expected: [[1, 2], [3, 10], [12, 16]] },
      { inputs: { intervals: [], newInterval: [5, 7] }, expected: [[5, 7]] },
      { inputs: { intervals: [[1, 5]], newInterval: [2, 3] }, expected: [[1, 5]] },
      { inputs: { intervals: [[1, 5]], newInterval: [2, 7] }, expected: [[1, 7]] },
      { inputs: { intervals: [[1, 5]], newInterval: [6, 8] }, expected: [[1, 5], [6, 8]] },
      { inputs: { intervals: [[1, 5]], newInterval: [0, 3] }, expected: [[0, 5]] },
      { inputs: { intervals: [[1, 5]], newInterval: [0, 0] }, expected: [[0, 0], [1, 5]] },
      { inputs: { intervals: [[3, 5], [12, 15]], newInterval: [6, 6] }, expected: [[3, 5], [6, 6], [12, 15]] },
      { inputs: { intervals: [[2, 4], [5, 7], [8, 10], [11, 13]], newInterval: [3, 6] }, expected: [[2, 7], [8, 10], [11, 13]] },
      { inputs: { intervals: [[1, 3], [4, 6], [7, 9]], newInterval: [2, 8] }, expected: [[1, 9]] },
      { inputs: { intervals: [[1, 2], [3, 4]], newInterval: [0, 5] }, expected: [[0, 5]] },
      { inputs: { intervals: [[1, 5]], newInterval: [5, 7] }, expected: [[1, 7]] },
      { inputs: { intervals: [[2, 6], [7, 9]], newInterval: [15, 18] }, expected: [[2, 6], [7, 9], [15, 18]] },
      { inputs: { intervals: [[1, 2], [3, 5]], newInterval: [1, 5] }, expected: [[1, 5]] },
      { inputs: { intervals: [[0, 2], [3, 9]], newInterval: [6, 8] }, expected: [[0, 2], [3, 9]] }
    ]
  },

  // -------------------------------------------------------------
  // Day 8
  // -------------------------------------------------------------
  {
    id: 143,
    meta: {
      id: 143,
      title: "Reorder List",
      slug: "reorder-list",
      difficulty: "Medium",
      day: 8,
      category: "Linked List",
      order: 1,
      timeEstimateMinutes: 30,
      className: "Solution",
      methodName: "reorderList",
      kind: "inplace:0",
      comparator: "exact",
      params: [{ name: "head", type: "ListNode" }],
      returnType: "void",
      examples: [
        { input: { head: [1, 2, 3, 4] }, output: [1, 4, 2, 3] },
        { input: { head: [1, 2, 3, 4, 5] }, output: [1, 5, 2, 4, 3] }
      ],
      constraints: ["The number of nodes in the list is in the range [1, 5 * 10^4].", "1 <= Node.val <= 1000"]
    },
    statement: `You are given the head of a singly linked-list. The list can be represented as:

L0 → L1 → … → Ln - 1 → Ln

Reorder the list to be on the following form:

L0 → Ln → L1 → Ln - 1 → L2 → Ln - 2 → …

You may not modify the values in the list's nodes. Only nodes themselves may be changed.`,
    starter: `import java.util.*;
import java.io.*;
import java.lang.*;

class Solution {
    public void reorderList(ListNode head) {
        
    }
}`,
    refSolution: `import java.util.*;

class Solution {
    public void reorderList(ListNode head) {
        if (head == null || head.next == null) return;
        ListNode slow = head, fast = head;
        while (fast.next != null && fast.next.next != null) {
            slow = slow.next;
            fast = fast.next.next;
        }
        ListNode second = slow.next;
        slow.next = null;
        ListNode prev = null, curr = second;
        while (curr != null) {
            ListNode next = curr.next;
            curr.next = prev;
            prev = curr;
            curr = next;
        }
        ListNode first = head;
        second = prev;
        while (second != null) {
            ListNode tmp1 = first.next;
            ListNode tmp2 = second.next;
            first.next = second;
            second.next = tmp1;
            first = tmp1;
            second = tmp2;
        }
    }
}`,
    tests: [
      { inputs: { head: [1, 2, 3, 4] }, expected: [1, 4, 2, 3] },
      { inputs: { head: [1, 2, 3, 4, 5] }, expected: [1, 5, 2, 4, 3] },
      { inputs: { head: [1] }, expected: [1] },
      { inputs: { head: [1, 2] }, expected: [1, 2] },
      { inputs: { head: [1, 2, 3] }, expected: [1, 3, 2] },
      { inputs: { head: [10, 20, 30, 40, 50, 60] }, expected: [10, 60, 20, 50, 30, 40] },
      { inputs: { head: [2, 4, 6, 8, 10, 12, 14] }, expected: [2, 14, 4, 12, 6, 10, 8] },
      { inputs: { head: [1, 1, 1, 1] }, expected: [1, 1, 1, 1] },
      { inputs: { head: [5, 4, 3, 2, 1] }, expected: [5, 1, 4, 2, 3] },
      { inputs: { head: [1, 2, 3, 4, 5, 6, 7, 8] }, expected: [1, 8, 2, 7, 3, 6, 4, 5] },
      { inputs: { head: [9, 8] }, expected: [9, 8] },
      { inputs: { head: [9, 8, 7] }, expected: [9, 7, 8] },
      { inputs: { head: [3, 1, 4, 1, 5] }, expected: [3, 5, 1, 1, 4] },
      { inputs: { head: [100, 200, 300, 400] }, expected: [100, 400, 200, 300] },
      { inputs: { head: [7, 6, 5, 4, 3, 2] }, expected: [7, 2, 6, 3, 5, 4] },
      { inputs: { head: [1, 3, 5, 7, 9] }, expected: [1, 9, 3, 7, 5] }
    ]
  },
  {
    id: 235,
    meta: {
      id: 235,
      title: "Lowest Common Ancestor of a Binary Search Tree",
      slug: "lowest-common-ancestor-of-a-binary-search-tree",
      difficulty: "Medium",
      day: 8,
      category: "Trees",
      order: 2,
      timeEstimateMinutes: 20,
      className: "Solution",
      methodName: "lowestCommonAncestor",
      kind: "treenode-val",
      comparator: "exact",
      params: [{ name: "root", type: "TreeNode" }, { name: "p", type: "TreeNode" }, { name: "q", type: "TreeNode" }],
      returnType: "TreeNode",
      examples: [
        { input: { root: [6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], p: 2, q: 8 }, output: 6 },
        { input: { root: [6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], p: 2, q: 4 }, output: 2 }
      ],
      constraints: ["The number of nodes in the tree is in the range [2, 10^5].", "-10^9 <= Node.val <= 10^9", "All Node.val are unique.", "p != q", "p and q will exist in the BST."]
    },
    statement: `Given a BST, find the lowest common ancestor (LCA) node of two given nodes in the tree.

According to the definition of LCA on Wikipedia: "The lowest common ancestor is defined between two nodes \`p\` and \`q\` as the lowest node in \`T\` that has both \`p\` and \`q\` as descendants (where we allow a node to be a descendant of itself)."`,
    starter: `import java.util.*;
import java.io.*;
import java.lang.*;

class Solution {
    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        
    }
}`,
    refSolution: `import java.util.*;

class Solution {
    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        while (root != null) {
            if (p.val < root.val && q.val < root.val) {
                root = root.left;
            } else if (p.val > root.val && q.val > root.val) {
                root = root.right;
            } else {
                return root;
            }
        }
        return null;
    }
}`,
    tests: [
      { inputs: { root: [6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], p: 2, q: 8 }, expected: 6 },
      { inputs: { root: [6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], p: 2, q: 4 }, expected: 2 },
      { inputs: { root: [2, 1], p: 2, q: 1 }, expected: 2 },
      { inputs: { root: [2, 1, 3], p: 1, q: 3 }, expected: 2 },
      { inputs: { root: [6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], p: 3, q: 5 }, expected: 4 },
      { inputs: { root: [6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], p: 0, q: 5 }, expected: 2 },
      { inputs: { root: [6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], p: 7, q: 9 }, expected: 8 },
      { inputs: { root: [5, 3, 6, 2, 4, null, null, 1], p: 1, q: 4 }, expected: 3 },
      { inputs: { root: [5, 3, 6, 2, 4, null, null, 1], p: 1, q: 2 }, expected: 2 },
      { inputs: { root: [5, 3, 6, 2, 4, null, null, 1], p: 4, q: 6 }, expected: 5 },
      { inputs: { root: [10, 5, 15, 2, 7, 12, 20], p: 2, q: 7 }, expected: 5 },
      { inputs: { root: [10, 5, 15, 2, 7, 12, 20], p: 12, q: 20 }, expected: 15 },
      { inputs: { root: [10, 5, 15, 2, 7, 12, 20], p: 7, q: 12 }, expected: 10 },
      { inputs: { root: [8, 4, 12, 2, 6, 10, 14], p: 2, q: 6 }, expected: 4 },
      { inputs: { root: [8, 4, 12, 2, 6, 10, 14], p: 10, q: 14 }, expected: 12 },
      { inputs: { root: [8, 4, 12, 2, 6, 10, 14], p: 6, q: 14 }, expected: 8 }
    ]
  },
  {
    id: 213,
    meta: {
      id: 213,
      title: "House Robber II",
      slug: "house-robber-ii",
      difficulty: "Medium",
      day: 8,
      category: "Dynamic Programming",
      order: 3,
      timeEstimateMinutes: 30,
      className: "Solution",
      methodName: "rob",
      kind: "function",
      comparator: "exact",
      params: [{ name: "nums", type: "int[]" }],
      returnType: "int",
      examples: [
        { input: { nums: [2, 3, 2] }, output: 3 },
        { input: { nums: [1, 2, 3, 1] }, output: 4 },
        { input: { nums: [1, 2, 3] }, output: 3 }
      ],
      constraints: ["1 <= nums.length <= 100", "0 <= nums[i] <= 1000"]
    },
    statement: `You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed. All houses at this place are arranged in a circle. That means the first house is the neighbor of the last one. Meanwhile, adjacent houses have a security system connected, and it will automatically contact the police if two adjacent houses were broken into on the same night.

Given an integer array \`nums\` representing the amount of money of each house, return the maximum amount of money you can rob tonight without alerting the police.`,
    starter: `import java.util.*;
import java.io.*;
import java.lang.*;

class Solution {
    public int rob(int[] nums) {
        
    }
}`,
    refSolution: `import java.util.*;

class Solution {
    public int rob(int[] nums) {
        if (nums.length == 0) return 0;
        if (nums.length == 1) return nums[0];
        return Math.max(robRange(nums, 0, nums.length - 2), robRange(nums, 1, nums.length - 1));
    }

    private int robRange(int[] nums, int start, int end) {
        int prev1 = 0, prev2 = 0;
        for (int i = start; i <= end; i++) {
            int tmp = prev1;
            prev1 = Math.max(prev2 + nums[i], prev1);
            prev2 = tmp;
        }
        return prev1;
    }
}`,
    tests: [
      { inputs: { nums: [2, 3, 2] }, expected: 3 },
      { inputs: { nums: [1, 2, 3, 1] }, expected: 4 },
      { inputs: { nums: [1, 2, 3] }, expected: 3 },
      { inputs: { nums: [1] }, expected: 1 },
      { inputs: { nums: [1, 2] }, expected: 2 },
      { inputs: { nums: [2, 1] }, expected: 2 },
      { inputs: { nums: [1, 3, 1, 3, 100] }, expected: 103 },
      { inputs: { nums: [200, 3, 140, 20, 10] }, expected: 340 },
      { inputs: { nums: [1, 7, 9, 2] }, expected: 11 },
      { inputs: { nums: [6, 6, 4, 8, 4, 3, 3, 10] }, expected: 24 },
      { inputs: { nums: [1, 1, 1, 1, 1] }, expected: 2 },
      { inputs: { nums: [10, 1, 1, 10] }, expected: 11 },
      { inputs: { nums: [0, 0, 0] }, expected: 0 },
      { inputs: { nums: [4, 1, 2, 7, 5, 3, 1] }, expected: 14 },
      { inputs: { nums: [183, 219, 57, 193, 94, 233, 202, 154, 65, 240, 97, 234, 100, 249, 186, 66, 90, 238, 168, 128] }, expected: 1882 },
      { inputs: { nums: [1, 2, 1, 1] }, expected: 3 }
    ]
  },
  {
    id: 190,
    meta: {
      id: 190,
      title: "Reverse Bits",
      slug: "reverse-bits",
      difficulty: "Easy",
      day: 8,
      category: "Bit Manipulation",
      order: 5,
      timeEstimateMinutes: 15,
      className: "Solution",
      methodName: "reverseBits",
      kind: "function",
      comparator: "exact",
      params: [{ name: "n", type: "int" }],
      returnType: "int",
      examples: [
        { input: { n: 43261596 }, output: 964176192 },
        { input: { n: -3 }, output: -1073741825 }
      ],
      constraints: ["The input must be a binary string of length 32."]
    },
    statement: `Reverse bits of a given 32 bits unsigned integer.

Note that in some languages, such as Java, there is no unsigned integer type. In this case, both input and output will be given as a signed integer type. It should not affect your implementation, as the integer's internal representation is the same, whether it is signed or unsigned.`,
    starter: `import java.util.*;
import java.io.*;
import java.lang.*;

class Solution {
    // you need treat n as an unsigned value
    public int reverseBits(int n) {
        
    }
}`,
    refSolution: `import java.util.*;

class Solution {
    public int reverseBits(int n) {
        int result = 0;
        for (int i = 0; i < 32; i++) {
            result = (result << 1) | (n & 1);
            n >>>= 1;
        }
        return result;
    }
}`,
    tests: [
      { inputs: { n: 43261596 }, expected: 964176192 },
      { inputs: { n: -3 }, expected: -1073741825 },
      { inputs: { n: 0 }, expected: 0 },
      { inputs: { n: 1 }, expected: -2147483648 },
      { inputs: { n: -1 }, expected: -1 },
      { inputs: { n: 2 }, expected: 1073741824 },
      { inputs: { n: 3 }, expected: -1073741824 },
      { inputs: { n: 4 }, expected: 536870912 },
      { inputs: { n: 10 }, expected: 1342177280 },
      { inputs: { n: 15 }, expected: -268435456 },
      { inputs: { n: 100 }, expected: 637534208 },
      { inputs: { n: -2147483648 }, expected: 1 },
      { inputs: { n: 2147483647 }, expected: -2 },
      { inputs: { n: 1073741824 }, expected: 2 },
      { inputs: { n: 858993459 }, expected: -858993460 },
      { inputs: { n: 1431655765 }, expected: -1431655766 }
    ]
  },

  // -------------------------------------------------------------
  // Day 9
  // -------------------------------------------------------------
  {
    id: 128,
    meta: {
      id: 128,
      title: "Longest Consecutive Sequence",
      slug: "longest-consecutive-sequence",
      difficulty: "Medium",
      day: 9,
      category: "Array",
      order: 1,
      timeEstimateMinutes: 25,
      className: "Solution",
      methodName: "longestConsecutive",
      kind: "function",
      comparator: "exact",
      params: [{ name: "nums", type: "int[]" }],
      returnType: "int",
      examples: [
        { input: { nums: [100, 4, 200, 1, 3, 2] }, output: 4 },
        { input: { nums: [0, 3, 7, 2, 5, 8, 4, 6, 0, 1] }, output: 9 }
      ],
      constraints: ["0 <= nums.length <= 10^5", "-10^9 <= nums[i] <= 10^9"]
    },
    statement: `Given an unsorted array of integers \`nums\`, return the length of the longest consecutive elements sequence.

You must write an algorithm that runs in \`O(n)\` time.`,
    starter: `import java.util.*;
import java.io.*;
import java.lang.*;

class Solution {
    public int longestConsecutive(int[] nums) {
        
    }
}`,
    refSolution: `import java.util.*;

class Solution {
    public int longestConsecutive(int[] nums) {
        Set<Integer> set = new HashSet<>();
        for (int num : nums) set.add(num);
        int longest = 0;
        for (int num : set) {
            if (!set.contains(num - 1)) {
                int curr = num;
                int streak = 1;
                while (set.contains(curr + 1)) {
                    curr++;
                    streak++;
                }
                longest = Math.max(longest, streak);
            }
        }
        return longest;
    }
}`,
    tests: [
      { inputs: { nums: [100, 4, 200, 1, 3, 2] }, expected: 4 },
      { inputs: { nums: [0, 3, 7, 2, 5, 8, 4, 6, 0, 1] }, expected: 9 },
      { inputs: { nums: [] }, expected: 0 },
      { inputs: { nums: [1] }, expected: 1 },
      { inputs: { nums: [1, 2, 0, 1] }, expected: 3 },
      { inputs: { nums: [9, 1, 4, 7, 3, -1, 0, 5, 8, -1, 6] }, expected: 7 },
      { inputs: { nums: [10, 5, 12, 3, 55, 30, 4, 11, 2] }, expected: 4 },
      { inputs: { nums: [1, 2, 3, 4, 5] }, expected: 5 },
      { inputs: { nums: [5, 4, 3, 2, 1] }, expected: 5 },
      { inputs: { nums: [-5, -4, -3, -2, -1, 0] }, expected: 6 },
      { inputs: { nums: [1, 3, 5, 7] }, expected: 1 },
      { inputs: { nums: [1, 1, 1, 1] }, expected: 1 },
      { inputs: { nums: [4, 0, -4, -2, 2, 5, 2, 0, -8, -8, -8, -8, -1, 7, 4, 5, 5, -4, 6, 6, -3] }, expected: 5 },
      { inputs: { nums: [2147483647, -2147483648] }, expected: 1 },
      { inputs: { nums: [10, 20, 30, 40] }, expected: 1 },
      { inputs: { nums: [2, 1, 4, 7, 3] }, expected: 4 }
    ]
  },
  {
    id: 98,
    meta: {
      id: 98,
      title: "Validate Binary Search Tree",
      slug: "validate-binary-search-tree",
      difficulty: "Medium",
      day: 9,
      category: "Trees",
      order: 2,
      timeEstimateMinutes: 25,
      className: "Solution",
      methodName: "isValidBST",
      kind: "function",
      comparator: "exact",
      params: [{ name: "root", type: "TreeNode" }],
      returnType: "boolean",
      examples: [
        { input: { root: [2, 1, 3] }, output: true },
        { input: { root: [5, 1, 4, null, null, 3, 6] }, output: false }
      ],
      constraints: ["The number of nodes in the tree is in the range [1, 10^4].", "-2^31 <= Node.val <= 2^31 - 1"]
    },
    statement: `Given the \`root\` of a binary tree, determine if it is a valid BST.

A valid BST is defined as follows:
- The left subtree of a node contains only nodes with keys strictly less than the node's key.
- The right subtree of a node contains only nodes with keys strictly greater than the node's key.
- Both the left and right subtrees must also be valid BSTs.`,
    starter: `import java.util.*;
import java.io.*;
import java.lang.*;

class Solution {
    public boolean isValidBST(TreeNode root) {
        
    }
}`,
    refSolution: `import java.util.*;

class Solution {
    public boolean isValidBST(TreeNode root) {
        return validate(root, null, null);
    }

    private boolean validate(TreeNode node, Long min, Long max) {
        if (node == null) return true;
        if (min != null && node.val <= min) return false;
        if (max != null && node.val >= max) return false;
        return validate(node.left, min, (long) node.val) && validate(node.right, (long) node.val, max);
    }
}`,
    tests: [
      { inputs: { root: [2, 1, 3] }, expected: true },
      { inputs: { root: [5, 1, 4, null, null, 3, 6] }, expected: false },
      { inputs: { root: [1] }, expected: true },
      { inputs: { root: [2, 2, 2] }, expected: false },
      { inputs: { root: [1, 1] }, expected: false },
      { inputs: { root: [10, 5, 15, null, null, 6, 20] }, expected: false },
      { inputs: { root: [2147483647] }, expected: true },
      { inputs: { root: [-2147483648] }, expected: true },
      { inputs: { root: [-2147483648, null, 2147483647] }, expected: true },
      { inputs: { root: [3, 1, 5, 0, 2, 4, 6] }, expected: true },
      { inputs: { root: [3, 2, 5, 1, 4] }, expected: false },
      { inputs: { root: [1, null, 2, null, 3] }, expected: true },
      { inputs: { root: [3, null, 2, null, 1] }, expected: false },
      { inputs: { root: [5, 4, 6, null, null, 3, 7] }, expected: false },
      { inputs: { root: [32, 26, 47, 19, null, null, 56, null, 27] }, expected: false },
      { inputs: { root: [4, 2, 6, 1, 3, 5, 7] }, expected: true }
    ]
  },
  {
    id: 200,
    meta: {
      id: 200,
      title: "Number of Islands",
      slug: "number-of-islands",
      difficulty: "Medium",
      day: 9,
      category: "Graphs",
      order: 3,
      timeEstimateMinutes: 25,
      className: "Solution",
      methodName: "numIslands",
      kind: "function",
      comparator: "exact",
      params: [{ name: "grid", type: "char[][]" }],
      returnType: "int",
      examples: [
        {
          input: {
            grid: [
              ["1", "1", "1", "1", "0"],
              ["1", "1", "0", "1", "0"],
              ["1", "1", "0", "0", "0"],
              ["0", "0", "0", "0", "0"]
            ]
          },
          output: 1
        },
        {
          input: {
            grid: [
              ["1", "1", "0", "0", "0"],
              ["1", "1", "0", "0", "0"],
              ["0", "0", "1", "0", "0"],
              ["0", "0", "0", "1", "1"]
            ]
          },
          output: 3
        }
      ],
      constraints: ["m == grid.length", "n == grid[i].length", "1 <= m, n <= 300", "grid[i][j] is '0' or '1'."]
    },
    statement: `Given an \`m x n\` 2D binary grid \`grid\` which represents a map of \`'1'\`s (land) and \`'0'\`s (water), return the number of islands.

An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.`,
    starter: `import java.util.*;
import java.io.*;
import java.lang.*;

class Solution {
    public int numIslands(char[][] grid) {
        
    }
}`,
    refSolution: `import java.util.*;

class Solution {
    public int numIslands(char[][] grid) {
        if (grid == null || grid.length == 0) return 0;
        int count = 0;
        for (int r = 0; r < grid.length; r++) {
            for (int c = 0; c < grid[0].length; c++) {
                if (grid[r][c] == '1') {
                    count++;
                    explore(grid, r, c);
                }
            }
        }
        return count;
    }

    private void explore(char[][] grid, int r, int c) {
        if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length || grid[r][c] != '1') return;
        grid[r][c] = '0';
        explore(grid, r + 1, c);
        explore(grid, r - 1, c);
        explore(grid, r, c + 1);
        explore(grid, r, c - 1);
    }
}`,
    tests: [
      {
        inputs: {
          grid: [
            ["1", "1", "1", "1", "0"],
            ["1", "1", "0", "1", "0"],
            ["1", "1", "0", "0", "0"],
            ["0", "0", "0", "0", "0"]
          ]
        },
        expected: 1
      },
      {
        inputs: {
          grid: [
            ["1", "1", "0", "0", "0"],
            ["1", "1", "0", "0", "0"],
            ["0", "0", "1", "0", "0"],
            ["0", "0", "0", "1", "1"]
          ]
        },
        expected: 3
      },
      { inputs: { grid: [["1"]] }, expected: 1 },
      { inputs: { grid: [["0"]] }, expected: 0 },
      { inputs: { grid: [["1", "0", "1"]] }, expected: 2 },
      { inputs: { grid: [["1", "1", "1"]] }, expected: 1 },
      { inputs: { grid: [["1"], ["0"], ["1"]] }, expected: 2 },
      { inputs: { grid: [["0", "0"], ["0", "0"]] }, expected: 0 },
      { inputs: { grid: [["1", "1"], ["1", "1"]] }, expected: 1 },
      { inputs: { grid: [["1", "0"], ["0", "1"]] }, expected: 2 },
      { inputs: { grid: [["0", "1", "0"], ["1", "0", "1"], ["0", "1", "0"]] }, expected: 4 },
      { inputs: { grid: [["1", "1", "0", "1"], ["0", "1", "0", "0"], ["1", "0", "1", "1"]] }, expected: 3 },
      { inputs: { grid: [["1", "1", "1"], ["0", "1", "0"], ["1", "1", "1"]] }, expected: 1 },
      { inputs: { grid: [["1", "0", "0", "1"], ["0", "0", "0", "0"], ["1", "0", "0", "1"]] }, expected: 4 },
      { inputs: { grid: [["1", "1", "1", "1"]] }, expected: 1 },
      { inputs: { grid: [["1"], ["1"], ["1"], ["1"]] }, expected: 1 }
    ]
  },
  {
    id: 91,
    meta: {
      id: 91,
      title: "Decode Ways",
      slug: "decode-ways",
      difficulty: "Medium",
      day: 9,
      category: "Dynamic Programming",
      order: 4,
      timeEstimateMinutes: 30,
      className: "Solution",
      methodName: "numDecodings",
      kind: "function",
      comparator: "exact",
      params: [{ name: "s", type: "String" }],
      returnType: "int",
      examples: [
        { input: { s: "12" }, output: 2 },
        { input: { s: "226" }, output: 3 },
        { input: { s: "06" }, output: 0 }
      ],
      constraints: ["1 <= s.length <= 100", "s contains only digits and may contain leading zero(s)."]
    },
    statement: `You have intercepted a secret message encoded as a string of numbers. The message is decoded via the following mapping:

"1" -> 'A', "2" -> 'B', ... "26" -> 'Z'

However, while decoding the message, you realize that there are many different ways you can decode the message because some codes are contained in other codes ("2" and "5" vs "25").

For example, "11106" can be decoded into:
- "AAJF" with the grouping (1, 1, 10, 6)
- "KJF" with the grouping (11, 10, 6)
The grouping (1, 11, 06) is invalid because "06" is not a valid code.

Given a string \`s\` containing only digits, return the number of ways to decode it. If the entire string cannot be decoded in any valid way, return \`0\`.`,
    starter: `import java.util.*;
import java.io.*;
import java.lang.*;

class Solution {
    public int numDecodings(String s) {
        
    }
}`,
    refSolution: `import java.util.*;

class Solution {
    public int numDecodings(String s) {
        if (s == null || s.length() == 0 || s.charAt(0) == '0') return 0;
        int n = s.length();
        int[] dp = new int[n + 1];
        dp[0] = 1;
        dp[1] = 1;
        for (int i = 2; i <= n; i++) {
            int oneDigit = Integer.parseInt(s.substring(i - 1, i));
            int twoDigits = Integer.parseInt(s.substring(i - 2, i));
            if (oneDigit >= 1 && oneDigit <= 9) {
                dp[i] += dp[i - 1];
            }
            if (twoDigits >= 10 && twoDigits <= 26) {
                dp[i] += dp[i - 2];
            }
        }
        return dp[n];
    }
}`,
    tests: [
      { inputs: { s: "12" }, expected: 2 },
      { inputs: { s: "226" }, expected: 3 },
      { inputs: { s: "06" }, expected: 0 },
      { inputs: { s: "0" }, expected: 0 },
      { inputs: { s: "10" }, expected: 1 },
      { inputs: { s: "27" }, expected: 1 },
      { inputs: { s: "2101" }, expected: 1 },
      { inputs: { s: "1111" }, expected: 5 },
      { inputs: { s: "1201234" }, expected: 3 },
      { inputs: { s: "2611055971756562" }, expected: 4 },
      { inputs: { s: "100" }, expected: 0 },
      { inputs: { s: "301" }, expected: 0 },
      { inputs: { s: "20" }, expected: 1 },
      { inputs: { s: "11106" }, expected: 2 },
      { inputs: { s: "7" }, expected: 1 },
      { inputs: { s: "26" }, expected: 2 }
    ]
  },
  {
    id: 435,
    meta: {
      id: 435,
      title: "Non-overlapping Intervals",
      slug: "non-overlapping-intervals",
      difficulty: "Medium",
      day: 9,
      category: "Intervals",
      order: 5,
      timeEstimateMinutes: 25,
      className: "Solution",
      methodName: "eraseOverlapIntervals",
      kind: "function",
      comparator: "exact",
      params: [{ name: "intervals", type: "int[][]" }],
      returnType: "int",
      examples: [
        { input: { intervals: [[1, 2], [2, 3], [3, 4], [1, 3]] }, output: 1 },
        { input: { intervals: [[1, 2], [1, 2], [1, 2]] }, output: 2 },
        { input: { intervals: [[1, 2], [2, 3]] }, output: 0 }
      ],
      constraints: ["1 <= intervals.length <= 10^5", "intervals[i].length == 2", "-5 * 10^4 <= start_i < end_i <= 5 * 10^4"]
    },
    statement: `Given an array of intervals \`intervals\` where \`intervals[i] = [start_i, end_i]\`, return the minimum number of intervals you need to remove to make the rest of the intervals non-overlapping.

Note that intervals which only touch at a point are non-overlapping. For example, \`[1, 2]\` and \`[2, 3]\` are non-overlapping.`,
    starter: `import java.util.*;
import java.io.*;
import java.lang.*;

class Solution {
    public int eraseOverlapIntervals(int[][] intervals) {
        
    }
}`,
    refSolution: `import java.util.*;

class Solution {
    public int eraseOverlapIntervals(int[][] intervals) {
        if (intervals.length == 0) return 0;
        Arrays.sort(intervals, (a, b) -> Integer.compare(a[1], b[1]));
        int end = intervals[0][1];
        int count = 0;
        for (int i = 1; i < intervals.length; i++) {
            if (intervals[i][0] < end) {
                count++;
            } else {
                end = intervals[i][1];
            }
        }
        return count;
    }
}`,
    tests: [
      { inputs: { intervals: [[1, 2], [2, 3], [3, 4], [1, 3]] }, expected: 1 },
      { inputs: { intervals: [[1, 2], [1, 2], [1, 2]] }, expected: 2 },
      { inputs: { intervals: [[1, 2], [2, 3]] }, expected: 0 },
      { inputs: { intervals: [[1, 100], [11, 22], [1, 11], [2, 12]] }, expected: 2 },
      { inputs: { intervals: [[1, 2]] }, expected: 0 },
      { inputs: { intervals: [[0, 2], [1, 3], [2, 4], [3, 5], [4, 6]] }, expected: 2 },
      { inputs: { intervals: [[-52, 31], [-73, -26], [82, 97], [-65, -11], [-62, -49], [95, 99], [58, 95], [-97, -91], [-34, -9], [-51, -8]] }, expected: 3 },
      { inputs: { intervals: [[1, 5], [2, 3], [3, 4], [4, 5]] }, expected: 1 },
      { inputs: { intervals: [[1, 4], [2, 5], [3, 6]] }, expected: 2 },
      { inputs: { intervals: [[1, 3], [2, 4], [3, 5]] }, expected: 1 },
      { inputs: { intervals: [[1, 2], [2, 3], [3, 4], [4, 5]] }, expected: 0 },
      { inputs: { intervals: [[1, 10], [2, 3], [4, 5], [6, 7]] }, expected: 1 },
      { inputs: { intervals: [[0, 1], [0, 2], [0, 3]] }, expected: 2 },
      { inputs: { intervals: [[1, 2], [1, 3], [2, 3], [3, 4]] }, expected: 1 },
      { inputs: { intervals: [[-10, 0], [0, 10], [-5, 5]] }, expected: 1 },
      { inputs: { intervals: [[1, 2], [1, 2]] }, expected: 1 }
    ]
  },

  // -------------------------------------------------------------
  // Day 10
  // -------------------------------------------------------------
  {
    id: 230,
    meta: {
      id: 230,
      title: "Kth Smallest Element in a BST",
      slug: "kth-smallest-element-in-a-bst",
      difficulty: "Medium",
      day: 10,
      category: "Trees",
      order: 1,
      timeEstimateMinutes: 20,
      className: "Solution",
      methodName: "kthSmallest",
      kind: "function",
      comparator: "exact",
      params: [{ name: "root", type: "TreeNode" }, { name: "k", type: "int" }],
      returnType: "int",
      examples: [
        { input: { root: [3, 1, 4, null, 2], k: 1 }, output: 1 },
        { input: { root: [5, 3, 6, 2, 4, null, null, 1], k: 3 }, output: 3 }
      ],
      constraints: ["The number of nodes in the tree is n.", "1 <= k <= n <= 10^4", "0 <= Node.val <= 10^4"]
    },
    statement: `Given the \`root\` of a BST, and an integer \`k\`, return the \`k\`th smallest value (1-indexed) of all the values of the nodes in the tree.`,
    starter: `import java.util.*;
import java.io.*;
import java.lang.*;

class Solution {
    public int kthSmallest(TreeNode root, int k) {
        
    }
}`,
    refSolution: `import java.util.*;

class Solution {
    private int count = 0;
    private int result = 0;

    public int kthSmallest(TreeNode root, int k) {
        count = 0;
        result = 0;
        inorder(root, k);
        return result;
    }

    private void inorder(TreeNode node, int k) {
        if (node == null) return;
        inorder(node.left, k);
        count++;
        if (count == k) {
            result = node.val;
            return;
        }
        inorder(node.right, k);
    }
}`,
    tests: [
      { inputs: { root: [3, 1, 4, null, 2], k: 1 }, expected: 1 },
      { inputs: { root: [5, 3, 6, 2, 4, null, null, 1], k: 3 }, expected: 3 },
      { inputs: { root: [1], k: 1 }, expected: 1 },
      { inputs: { root: [2, 1, 3], k: 2 }, expected: 2 },
      { inputs: { root: [2, 1, 3], k: 3 }, expected: 3 },
      { inputs: { root: [4, 2, 6, 1, 3, 5, 7], k: 1 }, expected: 1 },
      { inputs: { root: [4, 2, 6, 1, 3, 5, 7], k: 4 }, expected: 4 },
      { inputs: { root: [4, 2, 6, 1, 3, 5, 7], k: 7 }, expected: 7 },
      { inputs: { root: [10, 5, 15, 3, 8], k: 2 }, expected: 5 },
      { inputs: { root: [10, 5, 15, 3, 8], k: 4 }, expected: 10 },
      { inputs: { root: [10, 5, 15, 3, 8], k: 5 }, expected: 15 },
      { inputs: { root: [5, 3, 6, 2, 4, null, null, 1], k: 1 }, expected: 1 },
      { inputs: { root: [5, 3, 6, 2, 4, null, null, 1], k: 6 }, expected: 6 },
      { inputs: { root: [20, 10, 30, null, 15], k: 2 }, expected: 15 },
      { inputs: { root: [8, 4, 12, 2, 6, 10, 14], k: 5 }, expected: 10 },
      { inputs: { root: [8, 4, 12, 2, 6, 10, 14], k: 3 }, expected: 6 }
    ]
  },
  {
    id: 133,
    meta: {
      id: 133,
      title: "Clone Graph",
      slug: "clone-graph",
      difficulty: "Medium",
      day: 10,
      category: "Graphs",
      order: 2,
      timeEstimateMinutes: 30,
      className: "Solution",
      methodName: "cloneGraph",
      kind: "function",
      comparator: "exact",
      params: [{ name: "node", type: "Node" }],
      returnType: "Node",
      examples: [
        { input: { node: [[2, 4], [1, 3], [2, 4], [1, 3]] }, output: [[2, 4], [1, 3], [2, 4], [1, 3]] },
        { input: { node: [[]] }, output: [[]] },
        { input: { node: [] }, output: [] }
      ],
      constraints: ["The number of nodes in the graph is in the range [0, 100].", "1 <= Node.val <= 100", "Node.val is unique for each node.", "There are no repeated edges and no self-loops in the graph.", "The Graph is connected and all nodes can be visited starting from the given node."]
    },
    statement: `Given a reference of a node in a connected undirected graph.

Return a deep copy (clone) of the graph.

Each node in the graph contains a value (\`int\`) and a list (\`List[Node]\`) of its neighbors.

\`\`\`java
class Node {
    public int val;
    public List<Node> neighbors;
}
\`\`\``,
    starter: `import java.util.*;
import java.io.*;
import java.lang.*;

class Solution {
    public Node cloneGraph(Node node) {
        
    }
}`,
    refSolution: `import java.util.*;

class Solution {
    private Map<Node, Node> visited = new HashMap<>();

    public Node cloneGraph(Node node) {
        if (node == null) return null;
        if (visited.containsKey(node)) return visited.get(node);
        Node clone = new Node(node.val);
        visited.put(node, clone);
        for (Node nbr : node.neighbors) {
            clone.neighbors.add(cloneGraph(nbr));
        }
        return clone;
    }
}`,
    tests: [
      { inputs: { node: [[2, 4], [1, 3], [2, 4], [1, 3]] }, expected: [[2, 4], [1, 3], [2, 4], [1, 3]] },
      { inputs: { node: [[]] }, expected: [[]] },
      { inputs: { node: [] }, expected: [] },
      { inputs: { node: [[2], [1]] }, expected: [[2], [1]] },
      { inputs: { node: [[2, 3], [1, 3], [1, 2]] }, expected: [[2, 3], [1, 3], [1, 2]] },
      { inputs: { node: [[2], [1, 3], [2]] }, expected: [[2], [1, 3], [2]] },
      { inputs: { node: [[2, 3, 4], [1, 3, 4], [1, 2, 4], [1, 2, 3]] }, expected: [[2, 3, 4], [1, 3, 4], [1, 2, 4], [1, 2, 3]] },
      { inputs: { node: [[2, 5], [1, 3], [2, 4], [3, 5], [1, 4]] }, expected: [[2, 5], [1, 3], [2, 4], [3, 5], [1, 4]] },
      { inputs: { node: [[2], [1, 3, 4], [2], [2]] }, expected: [[2], [1, 3, 4], [2], [2]] },
      { inputs: { node: [[2, 3], [1], [1]] }, expected: [[2, 3], [1], [1]] },
      { inputs: { node: [[2], [1, 3], [2, 4], [3]] }, expected: [[2], [1, 3], [2, 4], [3]] },
      { inputs: { node: [[2, 4], [1, 3], [2], [1]] }, expected: [[2, 4], [1, 3], [2], [1]] },
      { inputs: { node: [[2, 3], [1, 4], [1, 4], [2, 3]] }, expected: [[2, 3], [1, 4], [1, 4], [2, 3]] },
      { inputs: { node: [[2], [1, 3], [2]] }, expected: [[2], [1, 3], [2]] },
      { inputs: { node: [[2, 3], [1], [1, 4], [3]] }, expected: [[2, 3], [1], [1, 4], [3]] },
      { inputs: { node: [[2, 4], [1, 3], [2, 4], [1, 3]] }, expected: [[2, 4], [1, 3], [2, 4], [1, 3]] }
    ]
  },
  {
    id: 152,
    meta: {
      id: 152,
      title: "Maximum Product Subarray",
      slug: "maximum-product-subarray",
      difficulty: "Medium",
      day: 10,
      category: "Dynamic Programming",
      order: 3,
      timeEstimateMinutes: 25,
      className: "Solution",
      methodName: "maxProduct",
      kind: "function",
      comparator: "exact",
      params: [{ name: "nums", type: "int[]" }],
      returnType: "int",
      examples: [
        { input: { nums: [2, 3, -2, 4] }, output: 6 },
        { input: { nums: [-2, 0, -1] }, output: 0 }
      ],
      constraints: ["1 <= nums.length <= 2 * 10^4", "-10 <= nums[i] <= 10", "The product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer."]
    },
    statement: `Given an integer array \`nums\`, find a subarray that has the largest product, and return the product.

The test cases are generated so that the answer will fit in a 32-bit integer.`,
    starter: `import java.util.*;
import java.io.*;
import java.lang.*;

class Solution {
    public int maxProduct(int[] nums) {
        
    }
}`,
    refSolution: `import java.util.*;

class Solution {
    public int maxProduct(int[] nums) {
        if (nums.length == 0) return 0;
        int max = nums[0];
        int min = nums[0];
        int result = max;
        for (int i = 1; i < nums.length; i++) {
            int curr = nums[i];
            int tempMax = Math.max(curr, Math.max(max * curr, min * curr));
            min = Math.min(curr, Math.min(max * curr, min * curr));
            max = tempMax;
            result = Math.max(result, max);
        }
        return result;
    }
}`,
    tests: [
      { inputs: { nums: [2, 3, -2, 4] }, expected: 6 },
      { inputs: { nums: [-2, 0, -1] }, expected: 0 },
      { inputs: { nums: [-2] }, expected: -2 },
      { inputs: { nums: [0, 2] }, expected: 2 },
      { inputs: { nums: [-2, 3, -4] }, expected: 24 },
      { inputs: { nums: [0, -2, 0] }, expected: 0 },
      { inputs: { nums: [-2, -3, 7] }, expected: 42 },
      { inputs: { nums: [-1, -2, -3, -4] }, expected: 24 },
      { inputs: { nums: [2, -5, -2, -4, 3] }, expected: 24 },
      { inputs: { nums: [3, -1, 4] }, expected: 4 },
      { inputs: { nums: [-2, 0, -1, -2] }, expected: 2 },
      { inputs: { nums: [1, 0, -1, 2, 3, -5, -2] }, expected: 60 },
      { inputs: { nums: [-1, 0, -2] }, expected: 0 },
      { inputs: { nums: [2, 3, -2, 4, -1] }, expected: 48 },
      { inputs: { nums: [-3, 0, 1, -2] }, expected: 1 },
      { inputs: { nums: [-1, -1] }, expected: 1 }
    ]
  },
  {
    id: 54,
    meta: {
      id: 54,
      title: "Spiral Matrix",
      slug: "spiral-matrix",
      difficulty: "Medium",
      day: 10,
      category: "Matrix",
      order: 4,
      timeEstimateMinutes: 25,
      className: "Solution",
      methodName: "spiralOrder",
      kind: "function",
      comparator: "exact",
      params: [{ name: "matrix", type: "int[][]" }],
      returnType: "List<Integer>",
      examples: [
        { input: { matrix: [[1, 2, 3], [4, 5, 6], [7, 8, 9]] }, output: [1, 2, 3, 6, 9, 8, 7, 4, 5] },
        { input: { matrix: [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]] }, output: [1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7] }
      ],
      constraints: ["m == matrix.length", "n == matrix[i].length", "1 <= m, n <= 10", "-100 <= matrix[i][j] <= 100"]
    },
    statement: `Given an \`m x n\` \`matrix\`, return all elements of the \`matrix\` in spiral order.`,
    starter: `import java.util.*;
import java.io.*;
import java.lang.*;

class Solution {
    public List<Integer> spiralOrder(int[][] matrix) {
        
    }
}`,
    refSolution: `import java.util.*;

class Solution {
    public List<Integer> spiralOrder(int[][] matrix) {
        List<Integer> result = new ArrayList<>();
        if (matrix.length == 0) return result;
        int top = 0, bottom = matrix.length - 1;
        int left = 0, right = matrix[0].length - 1;
        while (top <= bottom && left <= right) {
            for (int col = left; col <= right; col++) result.add(matrix[top][col]);
            top++;
            for (int row = top; row <= bottom; row++) result.add(matrix[row][right]);
            right--;
            if (top <= bottom) {
                for (int col = right; col >= left; col--) result.add(matrix[bottom][col]);
                bottom--;
            }
            if (left <= right) {
                for (int row = bottom; row >= top; row--) result.add(matrix[row][left]);
                left++;
            }
        }
        return result;
    }
}`,
    tests: [
      { inputs: { matrix: [[1, 2, 3], [4, 5, 6], [7, 8, 9]] }, expected: [1, 2, 3, 6, 9, 8, 7, 4, 5] },
      { inputs: { matrix: [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]] }, expected: [1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7] },
      { inputs: { matrix: [[1]] }, expected: [1] },
      { inputs: { matrix: [[1, 2]] }, expected: [1, 2] },
      { inputs: { matrix: [[1], [2]] }, expected: [1, 2] },
      { inputs: { matrix: [[1, 2, 3]] }, expected: [1, 2, 3] },
      { inputs: { matrix: [[1], [2], [3]] }, expected: [1, 2, 3] },
      { inputs: { matrix: [[1, 2], [3, 4]] }, expected: [1, 2, 4, 3] },
      { inputs: { matrix: [[1, 2, 3], [4, 5, 6]] }, expected: [1, 2, 3, 6, 5, 4] },
      { inputs: { matrix: [[1, 2], [3, 4], [5, 6]] }, expected: [1, 2, 4, 6, 5, 3] },
      { inputs: { matrix: [[7], [9], [6]] }, expected: [7, 9, 6] },
      { inputs: { matrix: [[2, 5, 8], [4, 0, -1]] }, expected: [2, 5, 8, -1, 0, 4] },
      { inputs: { matrix: [[1, 2, 3, 4, 5]] }, expected: [1, 2, 3, 4, 5] },
      { inputs: { matrix: [[1], [2], [3], [4], [5]] }, expected: [1, 2, 3, 4, 5] },
      { inputs: { matrix: [[3, 6, 9, 12], [4, 7, 10, 13], [5, 8, 11, 14]] }, expected: [3, 6, 9, 12, 13, 14, 11, 8, 5, 4, 7, 10] },
      { inputs: { matrix: [[6, 9, 7]] }, expected: [6, 9, 7] }
    ]
  }
];

console.log(`Writing ${problems.length} problems for Days 6-10...`);
for (const p of problems) {
  writeProblem(p.meta, p.statement, p.starter, p.refSolution, p.tests);
  console.log(`  Done #${p.id} (${p.meta.title})`);
}
console.log('All Days 6-10 problems written successfully!');
