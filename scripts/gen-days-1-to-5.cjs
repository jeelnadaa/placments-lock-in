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

// 20. Valid Parentheses
problems.push({
  id: 20,
  meta: {
    id: 20,
    className: "Solution",
    methodName: "isValid",
    params: [{ name: "s", type: "String" }],
    returnType: "boolean",
    kind: "function",
    comparator: "exact",
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    examples: [
      { input: { s: "()" }, output: true },
      { input: { s: "()[]{}" }, output: true },
      { input: { s: "(]" }, output: false },
      { input: { s: "([])" }, output: true }
    ],
    constraints: ["1 <= s.length <= 10^4", "s consists of parentheses only '()[]{}'."]
  },
  statement: `# Valid Parentheses

Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.

[Official LeetCode Problem #20](https://leetcode.com/problems/valid-parentheses/)`,
  starter: `import java.util.*;
import java.io.*;
import java.lang.*;

class Solution {
    public boolean isValid(String s) {
        
    }
}`,
  ref: `import java.util.*;
import java.io.*;
import java.lang.*;

class Solution {
    public boolean isValid(String s) {
        char[] stack = new char[s.length()];
        int top = -1;
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if (c == '(' || c == '{' || c == '[') {
                stack[++top] = c;
            } else {
                if (top < 0) return false;
                char open = stack[top--];
                if (c == ')' && open != '(') return false;
                if (c == '}' && open != '{') return false;
                if (c == ']' && open != '[') return false;
            }
        }
        return top == -1;
    }
}`,
  hidden: [
    { inputs: { s: "" }, expected: true },
    { inputs: { s: "[" }, expected: false },
    { inputs: { s: "]" }, expected: false },
    { inputs: { s: "(((" }, expected: false },
    { inputs: { s: ")))" }, expected: false },
    { inputs: { s: "{[]}" }, expected: true },
    { inputs: { s: "([)]" }, expected: false },
    { inputs: { s: "({[]})" }, expected: true },
    { inputs: { s: "()()()()()" }, expected: true },
    { inputs: { s: "(((())))" }, expected: true },
    { inputs: { s: "((((((((((" }, expected: false },
    { inputs: { s: "[[[[[[[]]]]]]]" }, expected: true },
    { inputs: { s: "}{" }, expected: false },
    { inputs: { s: "()[]{}([{}])" }, expected: true },
    { inputs: { s: "[({})]()" }, expected: true },
    { inputs: { s: "[({})](]" }, expected: false }
  ]
});

// 121. Best Time to Buy and Sell Stock
problems.push({
  id: 121,
  meta: {
    id: 121,
    className: "Solution",
    methodName: "maxProfit",
    params: [{ name: "prices", type: "int[]" }],
    returnType: "int",
    kind: "function",
    comparator: "exact",
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    examples: [
      { input: { prices: [7, 1, 5, 3, 6, 4] }, output: 5, explanation: "Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5." },
      { input: { prices: [7, 6, 4, 3, 1] }, output: 0, explanation: "In this case, no transactions are done and max profit = 0." }
    ],
    constraints: ["1 <= prices.length <= 10^5", "0 <= prices[i] <= 10^4"]
  },
  statement: `# Best Time to Buy and Sell Stock

You are given an array \`prices\` where \`prices[i]\` is the price of a given stock on the \`i\`th day.

You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.

Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return \`0\`.

[Official LeetCode Problem #121](https://leetcode.com/problems/best-time-to-buy-and-sell-stock/)`,
  starter: `import java.util.*;
import java.io.*;
import java.lang.*;

class Solution {
    public int maxProfit(int[] prices) {
        
    }
}`,
  ref: `import java.util.*;
import java.io.*;
import java.lang.*;

class Solution {
    public int maxProfit(int[] prices) {
        int minPrice = Integer.MAX_VALUE;
        int maxProfit = 0;
        for (int p : prices) {
            if (p < minPrice) {
                minPrice = p;
            } else if (p - minPrice > maxProfit) {
                maxProfit = p - minPrice;
            }
        }
        return maxProfit;
    }
}`,
  hidden: [
    { inputs: { prices: [1] }, expected: 0 },
    { inputs: { prices: [1, 2] }, expected: 1 },
    { inputs: { prices: [2, 1] }, expected: 0 },
    { inputs: { prices: [2, 4, 1] }, expected: 2 },
    { inputs: { prices: [3, 2, 6, 5, 0, 3] }, expected: 4 },
    { inputs: { prices: [1, 2, 3, 4, 5] }, expected: 4 },
    { inputs: { prices: [5, 4, 3, 2, 1] }, expected: 0 },
    { inputs: { prices: [2, 1, 2, 1, 0, 1, 2] }, expected: 2 },
    { inputs: { prices: [1, 1000] }, expected: 999 },
    { inputs: { prices: [1000, 1] }, expected: 0 },
    { inputs: { prices: [10, 20, 5, 100, 1, 20] }, expected: 95 },
    { inputs: { prices: [5, 5, 5, 5] }, expected: 0 },
    { inputs: { prices: [6, 1, 3, 2, 4, 7] }, expected: 6 },
    { inputs: { prices: [9, 8, 7, 10, 1, 2] }, expected: 3 },
    { inputs: { prices: [0, 100, 0, 100] }, expected: 100 },
    { inputs: { prices: [3, 3, 5, 0, 0, 3, 1, 4] }, expected: 4 }
  ]
});

// 191. Number of 1 Bits
problems.push({
  id: 191,
  meta: {
    id: 191,
    className: "Solution",
    methodName: "hammingWeight",
    params: [{ name: "n", type: "int" }],
    returnType: "int",
    kind: "function",
    comparator: "exact",
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    examples: [
      { input: { n: 11 }, output: 3, explanation: "The input binary is 1011, having a total of three set bits." },
      { input: { n: 128 }, output: 1 },
      { input: { n: 2147483645 }, output: 30 }
    ],
    constraints: ["1 <= n <= 2^31 - 1"]
  },
  statement: `# Number of 1 Bits

Write a function that takes the binary representation of a positive integer and returns the number of set bits it has (also known as the Hamming weight).

[Official LeetCode Problem #191](https://leetcode.com/problems/number-of-1-bits/)`,
  starter: `import java.util.*;
import java.io.*;
import java.lang.*;

class Solution {
    public int hammingWeight(int n) {
        
    }
}`,
  ref: `import java.util.*;
import java.io.*;
import java.lang.*;

class Solution {
    public int hammingWeight(int n) {
        return Integer.bitCount(n);
    }
}`,
  hidden: [
    { inputs: { n: 1 }, expected: 1 },
    { inputs: { n: 2 }, expected: 1 },
    { inputs: { n: 3 }, expected: 2 },
    { inputs: { n: 4 }, expected: 1 },
    { inputs: { n: 7 }, expected: 3 },
    { inputs: { n: 8 }, expected: 1 },
    { inputs: { n: 15 }, expected: 4 },
    { inputs: { n: 16 }, expected: 1 },
    { inputs: { n: 255 }, expected: 8 },
    { inputs: { n: 1023 }, expected: 10 },
    { inputs: { n: 1024 }, expected: 1 },
    { inputs: { n: 65535 }, expected: 16 },
    { inputs: { n: 1000000 }, expected: 7 },
    { inputs: { n: 2147483647 }, expected: 31 },
    { inputs: { n: 1431655765 }, expected: 16 },
    { inputs: { n: 858993459 }, expected: 16 }
  ]
});

// 217. Contains Duplicate
problems.push({
  id: 217,
  meta: {
    id: 217,
    className: "Solution",
    methodName: "containsDuplicate",
    params: [{ name: "nums", type: "int[]" }],
    returnType: "boolean",
    kind: "function",
    comparator: "exact",
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    examples: [
      { input: { nums: [1, 2, 3, 1] }, output: true },
      { input: { nums: [1, 2, 3, 4] }, output: false },
      { input: { nums: [1, 1, 1, 3, 3, 4, 3, 2, 4, 2] }, output: true }
    ],
    constraints: ["1 <= nums.length <= 10^5", "-10^9 <= nums[i] <= 10^9"]
  },
  statement: `# Contains Duplicate

Given an integer array \`nums\`, return \`true\` if any value appears at least twice in the array, and return \`false\` if every element is distinct.

[Official LeetCode Problem #217](https://leetcode.com/problems/contains-duplicate/)`,
  starter: `import java.util.*;
import java.io.*;
import java.lang.*;

class Solution {
    public boolean containsDuplicate(int[] nums) {
        
    }
}`,
  ref: `import java.util.*;
import java.io.*;
import java.lang.*;

class Solution {
    public boolean containsDuplicate(int[] nums) {
        Set<Integer> set = new HashSet<>();
        for (int x : nums) {
            if (!set.add(x)) return true;
        }
        return false;
    }
}`,
  hidden: [
    { inputs: { nums: [1] }, expected: false },
    { inputs: { nums: [1, 1] }, expected: true },
    { inputs: { nums: [1, 2] }, expected: false },
    { inputs: { nums: [2, 14, 18, 22, 22] }, expected: true },
    { inputs: { nums: [0, 0] }, expected: true },
    { inputs: { nums: [0, 1, 2, 3] }, expected: false },
    { inputs: { nums: [-1, -2, -3, -1] }, expected: true },
    { inputs: { nums: [-1000000000, 1000000000] }, expected: false },
    { inputs: { nums: [1, 5, -2, -4, 0] }, expected: false },
    { inputs: { nums: [3, 3] }, expected: true },
    { inputs: { nums: [10, 9, 8, 7, 6, 5, 4, 3, 2, 1] }, expected: false },
    { inputs: { nums: [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 10] }, expected: true },
    { inputs: { nums: [1, 2, 3, 4, 5, 6, 7, 8, 9, 9] }, expected: true },
    { inputs: { nums: [99, 100, 101, 102, 99] }, expected: true },
    { inputs: { nums: [4, 5, 6, 7, 0, 1, 2] }, expected: false },
    { inputs: { nums: [1000000, -1000000, 0, 1000000] }, expected: true }
  ]
});

// 70. Climbing Stairs
problems.push({
  id: 70,
  meta: {
    id: 70,
    className: "Solution",
    methodName: "climbStairs",
    params: [{ name: "n", type: "int" }],
    returnType: "int",
    kind: "function",
    comparator: "exact",
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    examples: [
      { input: { n: 2 }, output: 2, explanation: "There are two ways to climb: 1 step + 1 step, or 2 steps." },
      { input: { n: 3 }, output: 3, explanation: "Three ways: 1+1+1, 1+2, or 2+1." }
    ],
    constraints: ["1 <= n <= 45"]
  },
  statement: `# Climbing Stairs

You are climbing a staircase. It takes \`n\` steps to reach the top.

Each time you can either climb \`1\` or \`2\` steps. In how many distinct ways can you climb to the top?

[Official LeetCode Problem #70](https://leetcode.com/problems/climbing-stairs/)`,
  starter: `import java.util.*;
import java.io.*;
import java.lang.*;

class Solution {
    public int climbStairs(int n) {
        
    }
}`,
  ref: `import java.util.*;
import java.io.*;
import java.lang.*;

class Solution {
    public int climbStairs(int n) {
        if (n <= 2) return n;
        int a = 1, b = 2;
        for (int i = 3; i <= n; i++) {
            int c = a + b;
            a = b;
            b = c;
        }
        return b;
    }
}`,
  hidden: [
    { inputs: { n: 1 }, expected: 1 },
    { inputs: { n: 4 }, expected: 5 },
    { inputs: { n: 5 }, expected: 8 },
    { inputs: { n: 6 }, expected: 13 },
    { inputs: { n: 7 }, expected: 21 },
    { inputs: { n: 8 }, expected: 34 },
    { inputs: { n: 9 }, expected: 55 },
    { inputs: { n: 10 }, expected: 89 },
    { inputs: { n: 15 }, expected: 987 },
    { inputs: { n: 20 }, expected: 10946 },
    { inputs: { n: 25 }, expected: 121393 },
    { inputs: { n: 30 }, expected: 1346269 },
    { inputs: { n: 35 }, expected: 14930352 },
    { inputs: { n: 40 }, expected: 165580141 },
    { inputs: { n: 44 }, expected: 1134903170 },
    { inputs: { n: 45 }, expected: 1836311903 }
  ]
});

// 53. Maximum Subarray
problems.push({
  id: 53,
  meta: {
    id: 53,
    className: "Solution",
    methodName: "maxSubArray",
    params: [{ name: "nums", type: "int[]" }],
    returnType: "int",
    kind: "function",
    comparator: "exact",
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    examples: [
      { input: { nums: [-2, 1, -3, 4, -1, 2, 1, -5, 4] }, output: 6, explanation: "The subarray [4, -1, 2, 1] has the largest sum 6." },
      { input: { nums: [1] }, output: 1 },
      { input: { nums: [5, 4, -1, 7, 8] }, output: 23 }
    ],
    constraints: ["1 <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4"]
  },
  statement: `# Maximum Subarray

Given an integer array \`nums\`, find the subarray with the largest sum, and return its sum.

[Official LeetCode Problem #53](https://leetcode.com/problems/maximum-subarray/)`,
  starter: `import java.util.*;
import java.io.*;
import java.lang.*;

class Solution {
    public int maxSubArray(int[] nums) {
        
    }
}`,
  ref: `import java.util.*;
import java.io.*;
import java.lang.*;

class Solution {
    public int maxSubArray(int[] nums) {
        int max = nums[0];
        int cur = 0;
        for (int x : nums) {
            cur += x;
            if (cur > max) max = cur;
            if (cur < 0) cur = 0;
        }
        return max;
    }
}`,
  hidden: [
    { inputs: { nums: [-1] }, expected: -1 },
    { inputs: { nums: [-2, -1] }, expected: -1 },
    { inputs: { nums: [-1, -2] }, expected: -1 },
    { inputs: { nums: [1, 2] }, expected: 3 },
    { inputs: { nums: [0, 0, 0] }, expected: 0 },
    { inputs: { nums: [-1, 0, -2] }, expected: 0 },
    { inputs: { nums: [8, -19, 5, -4, 20] }, expected: 21 },
    { inputs: { nums: [1, -1, 1] }, expected: 1 },
    { inputs: { nums: [2, -1, 2] }, expected: 3 },
    { inputs: { nums: [100, -200, 300] }, expected: 300 },
    { inputs: { nums: [-5, -4, -3, -2, -1] }, expected: -1 },
    { inputs: { nums: [1, 2, 3, 4, 5] }, expected: 15 },
    { inputs: { nums: [3, -1, 2, -1, -4] }, expected: 4 },
    { inputs: { nums: [-2, 1] }, expected: 1 },
    { inputs: { nums: [2, -3, 7, -2, 6, -1] }, expected: 11 },
    { inputs: { nums: [10, -5, 10, -5, 10] }, expected: 20 }
  ]
});

for (const p of problems) {
  writeProblem(p);
}
console.log('Finished Days 1-2 batch!');
