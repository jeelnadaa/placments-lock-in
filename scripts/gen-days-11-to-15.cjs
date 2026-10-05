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
  // Day 11
  // -------------------------------------------------------------
  {
    id: 207,
    meta: {
      id: 207,
      title: "Course Schedule",
      slug: "course-schedule",
      difficulty: "Medium",
      day: 11,
      category: "Graphs",
      order: 2,
      timeEstimateMinutes: 30,
      className: "Solution",
      methodName: "canFinish",
      kind: "function",
      comparator: "exact",
      params: [{ name: "numCourses", type: "int" }, { name: "prerequisites", type: "int[][]" }],
      returnType: "boolean",
      examples: [
        { input: { numCourses: 2, prerequisites: [[1, 0]] }, output: true },
        { input: { numCourses: 2, prerequisites: [[1, 0], [0, 1]] }, output: false }
      ],
      constraints: ["1 <= numCourses <= 2000", "0 <= prerequisites.length <= 5000", "prerequisites[i].length == 2", "0 <= a_i, b_i < numCourses", "All pairs [a_i, b_i] are distinct."]
    },
    statement: `There are a total of \`numCourses\` courses you have to take, labeled from \`0\` to \`numCourses - 1\`. You are given an array \`prerequisites\` where \`prerequisites[i] = [a_i, b_i]\` indicates that you must take course \`b_i\` first if you want to take course \`a_i\`.

For example, the pair \`[0, 1]\`, indicates that to take course \`0\` you have to first take course \`1\`.

Return \`true\` if you can finish all courses. Otherwise, return \`false\`.`,
    starter: `import java.util.*;
import java.io.*;
import java.lang.*;

class Solution {
    public boolean canFinish(int numCourses, int[][] prerequisites) {
        
    }
}`,
    refSolution: `import java.util.*;

class Solution {
    public boolean canFinish(int numCourses, int[][] prerequisites) {
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < numCourses; i++) adj.add(new ArrayList<>());
        int[] inDegree = new int[numCourses];
        for (int[] p : prerequisites) {
            adj.get(p[1]).add(p[0]);
            inDegree[p[0]]++;
        }
        java.util.Queue<Integer> q = new java.util.LinkedList<>();
        for (int i = 0; i < numCourses; i++) {
            if (inDegree[i] == 0) q.offer(i);
        }
        int count = 0;
        while (!q.isEmpty()) {
            int curr = q.poll();
            count++;
            for (int next : adj.get(curr)) {
                if (--inDegree[next] == 0) {
                    q.offer(next);
                }
            }
        }
        return count == numCourses;
    }
}`,
    tests: [
      { inputs: { numCourses: 2, prerequisites: [[1, 0]] }, expected: true },
      { inputs: { numCourses: 2, prerequisites: [[1, 0], [0, 1]] }, expected: false },
      { inputs: { numCourses: 1, prerequisites: [] }, expected: true },
      { inputs: { numCourses: 3, prerequisites: [[0, 1], [0, 2], [1, 2]] }, expected: true },
      { inputs: { numCourses: 3, prerequisites: [[1, 0], [2, 1], [0, 2]] }, expected: false },
      { inputs: { numCourses: 4, prerequisites: [[1, 0], [2, 0], [3, 1], [3, 2]] }, expected: true },
      { inputs: { numCourses: 4, prerequisites: [[2, 0], [1, 0], [3, 1], [3, 2], [1, 3]] }, expected: false },
      { inputs: { numCourses: 5, prerequisites: [] }, expected: true },
      { inputs: { numCourses: 3, prerequisites: [[1, 0]] }, expected: true },
      { inputs: { numCourses: 4, prerequisites: [[0, 1], [2, 3], [1, 2], [3, 0]] }, expected: false },
      { inputs: { numCourses: 5, prerequisites: [[1, 4], [2, 4], [3, 1], [3, 2]] }, expected: true },
      { inputs: { numCourses: 6, prerequisites: [[1, 0], [2, 1], [3, 2], [4, 3], [5, 4]] }, expected: true },
      { inputs: { numCourses: 6, prerequisites: [[1, 0], [2, 1], [3, 2], [4, 3], [5, 4], [0, 5]] }, expected: false },
      { inputs: { numCourses: 3, prerequisites: [[0, 2], [1, 2], [2, 0]] }, expected: false },
      { inputs: { numCourses: 4, prerequisites: [[1, 2], [2, 3], [3, 1]] }, expected: false },
      { inputs: { numCourses: 5, prerequisites: [[0, 1], [0, 2], [0, 3], [0, 4]] }, expected: true }
    ]
  },
  {
    id: 39,
    meta: {
      id: 39,
      title: "Combination Sum",
      slug: "combination-sum",
      difficulty: "Medium",
      day: 11,
      category: "Backtracking",
      order: 3,
      timeEstimateMinutes: 30,
      className: "Solution",
      methodName: "combinationSum",
      kind: "function",
      comparator: "unordered-nested",
      params: [{ name: "candidates", type: "int[]" }, { name: "target", type: "int" }],
      returnType: "List<List<Integer>>",
      examples: [
        { input: { candidates: [2, 3, 6, 7], target: 7 }, output: [[2, 2, 3], [7]] },
        { input: { candidates: [2, 3, 5], target: 8 }, output: [[2, 2, 2, 2], [2, 3, 3], [3, 5]] },
        { input: { candidates: [2], target: 1 }, output: [] }
      ],
      constraints: ["1 <= candidates.length <= 30", "2 <= candidates[i] <= 40", "All elements of candidates are distinct.", "1 <= target <= 40"]
    },
    statement: `Given an array of distinct integers \`candidates\` and a target integer \`target\`, return a list of all unique combinations of \`candidates\` where the chosen numbers sum to \`target\`. You may return the combinations in any order.

The same number may be chosen from \`candidates\` an unlimited number of times. Two combinations are unique if the frequency of at least one of the chosen numbers is different.`,
    starter: `import java.util.*;
import java.io.*;
import java.lang.*;

class Solution {
    public List<List<Integer>> combinationSum(int[] candidates, int target) {
        
    }
}`,
    refSolution: `import java.util.*;

class Solution {
    public List<List<Integer>> combinationSum(int[] candidates, int target) {
        List<List<Integer>> res = new ArrayList<>();
        Arrays.sort(candidates);
        dfs(candidates, target, 0, new ArrayList<>(), res);
        return res;
    }

    private void dfs(int[] candidates, int target, int start, List<Integer> current, List<List<Integer>> res) {
        if (target == 0) {
            res.add(new ArrayList<>(current));
            return;
        }
        for (int i = start; i < candidates.length; i++) {
            if (candidates[i] > target) break;
            current.add(candidates[i]);
            dfs(candidates, target - candidates[i], i, current, res);
            current.remove(current.size() - 1);
        }
    }
}`,
    tests: [
      { inputs: { candidates: [2, 3, 6, 7], target: 7 }, expected: [[2, 2, 3], [7]] },
      { inputs: { candidates: [2, 3, 5], target: 8 }, expected: [[2, 2, 2, 2], [2, 3, 3], [3, 5]] },
      { inputs: { candidates: [2], target: 1 }, expected: [] },
      { inputs: { candidates: [1], target: 1 }, expected: [[1]] },
      { inputs: { candidates: [1], target: 2 }, expected: [[1, 1]] },
      { inputs: { candidates: [2, 4], target: 6 }, expected: [[2, 2, 2], [2, 4]] },
      { inputs: { candidates: [3, 5], target: 7 }, expected: [] },
      { inputs: { candidates: [3, 5, 8], target: 11 }, expected: [[3, 3, 5], [3, 8]] },
      { inputs: { candidates: [2, 3, 7], target: 18 }, expected: [[2, 2, 2, 2, 2, 2, 2, 2, 2], [2, 2, 2, 2, 2, 2, 3, 3], [2, 2, 2, 2, 3, 7], [2, 2, 2, 3, 3, 3, 3], [2, 2, 7, 7], [2, 3, 3, 3, 7], [3, 3, 3, 3, 3, 3], [2, 2, 2, 2, 2, 2, 3, 3], [3, 3, 3, 3, 3, 3], [2, 2, 2, 2, 2, 2, 2, 2, 2]] },
      { inputs: { candidates: [4, 2, 8], target: 8 }, expected: [[2, 2, 2, 2], [2, 2, 4], [4, 4], [8]] },
      { inputs: { candidates: [7, 3, 2], target: 9 }, expected: [[2, 2, 2, 3], [3, 3, 3], [2, 7]] },
      { inputs: { candidates: [5, 10, 15], target: 15 }, expected: [[5, 5, 5], [5, 10], [15]] },
      { inputs: { candidates: [6, 7, 2], target: 11 }, expected: [[2, 2, 7], [2, 2, 2, 2, 3]] },
      { inputs: { candidates: [8, 3, 5], target: 16 }, expected: [[3, 3, 5, 5], [3, 5, 8], [8, 8]] },
      { inputs: { candidates: [2, 5], target: 10 }, expected: [[2, 2, 2, 2, 2], [5, 5]] },
      { inputs: { candidates: [3, 6, 9], target: 9 }, expected: [[3, 3, 3], [3, 6], [9]] }
    ]
  },
  {
    id: 73,
    meta: {
      id: 73,
      title: "Set Matrix Zeroes",
      slug: "set-matrix-zeroes",
      difficulty: "Medium",
      day: 11,
      category: "Matrix",
      order: 4,
      timeEstimateMinutes: 25,
      className: "Solution",
      methodName: "setZeroes",
      kind: "inplace:0",
      comparator: "exact",
      params: [{ name: "matrix", type: "int[][]" }],
      returnType: "void",
      examples: [
        { input: { matrix: [[1, 1, 1], [1, 0, 1], [1, 1, 1]] }, output: [[1, 0, 1], [0, 0, 0], [1, 0, 1]] },
        { input: { matrix: [[0, 1, 2, 0], [3, 4, 5, 2], [1, 3, 1, 5]] }, output: [[0, 0, 0, 0], [0, 4, 5, 0], [0, 3, 1, 0]] }
      ],
      constraints: ["m == matrix.length", "n == matrix[0].length", "1 <= m, n <= 200", "-2^31 <= matrix[i][j] <= 2^31 - 1"]
    },
    statement: `Given an \`m x n\` integer matrix \`matrix\`, if an element is \`0\`, set its entire row and column to \`0\`'s.

You must do it in place.`,
    starter: `import java.util.*;
import java.io.*;
import java.lang.*;

class Solution {
    public void setZeroes(int[][] matrix) {
        
    }
}`,
    refSolution: `import java.util.*;

class Solution {
    public void setZeroes(int[][] matrix) {
        int m = matrix.length, n = matrix[0].length;
        boolean firstRowZero = false, firstColZero = false;
        for (int i = 0; i < m; i++) if (matrix[i][0] == 0) firstColZero = true;
        for (int j = 0; j < n; j++) if (matrix[0][j] == 0) firstRowZero = true;
        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                if (matrix[i][j] == 0) {
                    matrix[i][0] = 0;
                    matrix[0][j] = 0;
                }
            }
        }
        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                if (matrix[i][0] == 0 || matrix[0][j] == 0) {
                    matrix[i][j] = 0;
                }
            }
        }
        if (firstRowZero) for (int j = 0; j < n; j++) matrix[0][j] = 0;
        if (firstColZero) for (int i = 0; i < m; i++) matrix[i][0] = 0;
    }
}`,
    tests: [
      { inputs: { matrix: [[1, 1, 1], [1, 0, 1], [1, 1, 1]] }, expected: [[1, 0, 1], [0, 0, 0], [1, 0, 1]] },
      { inputs: { matrix: [[0, 1, 2, 0], [3, 4, 5, 2], [1, 3, 1, 5]] }, expected: [[0, 0, 0, 0], [0, 4, 5, 0], [0, 3, 1, 0]] },
      { inputs: { matrix: [[1]] }, expected: [[1]] },
      { inputs: { matrix: [[0]] }, expected: [[0]] },
      { inputs: { matrix: [[1, 0]] }, expected: [[0, 0]] },
      { inputs: { matrix: [[1], [0]] }, expected: [[0], [0]] },
      { inputs: { matrix: [[1, 2, 3], [4, 5, 6]] }, expected: [[1, 2, 3], [4, 5, 6]] },
      { inputs: { matrix: [[1, 2], [3, 0]] }, expected: [[1, 0], [0, 0]] },
      { inputs: { matrix: [[0, 0], [0, 0]] }, expected: [[0, 0], [0, 0]] },
      { inputs: { matrix: [[1, 2, 3], [0, 5, 6], [7, 8, 9]] }, expected: [[0, 2, 3], [0, 0, 0], [0, 8, 9]] },
      { inputs: { matrix: [[1, 0, 3], [4, 5, 6], [7, 8, 9]] }, expected: [[0, 0, 0], [4, 0, 6], [7, 0, 9]] },
      { inputs: { matrix: [[1, 1], [1, 0]] }, expected: [[1, 0], [0, 0]] },
      { inputs: { matrix: [[2, 1, 5, 4], [0, 1, 2, 3], [3, 4, 0, 2]] }, expected: [[0, 1, 0, 4], [0, 0, 0, 0], [0, 0, 0, 0]] },
      { inputs: { matrix: [[0, 1]] }, expected: [[0, 0]] },
      { inputs: { matrix: [[1, 0, 1], [1, 1, 1]] }, expected: [[0, 0, 0], [1, 0, 1]] },
      { inputs: { matrix: [[1, 2, 3, 4, 5]] }, expected: [[1, 2, 3, 4, 5]] }
    ]
  },
  {
    id: 371,
    meta: {
      id: 371,
      title: "Sum of Two Integers",
      slug: "sum-of-two-integers",
      difficulty: "Medium",
      day: 11,
      category: "Bit Manipulation",
      order: 5,
      timeEstimateMinutes: 15,
      className: "Solution",
      methodName: "getSum",
      kind: "function",
      comparator: "exact",
      params: [{ name: "a", type: "int" }, { name: "b", type: "int" }],
      returnType: "int",
      examples: [
        { input: { a: 1, b: 2 }, output: 3 },
        { input: { a: 2, b: 3 }, output: 5 }
      ],
      constraints: ["-1000 <= a, b <= 1000"]
    },
    statement: `Given two integers \`a\` and \`b\`, return the sum of the two integers without using the operators \`+\` and \`-\`.`,
    starter: `import java.util.*;
import java.io.*;
import java.lang.*;

class Solution {
    public int getSum(int a, int b) {
        
    }
}`,
    refSolution: `import java.util.*;

class Solution {
    public int getSum(int a, int b) {
        while (b != 0) {
            int carry = (a & b) << 1;
            a = a ^ b;
            b = carry;
        }
        return a;
    }
}`,
    tests: [
      { inputs: { a: 1, b: 2 }, expected: 3 },
      { inputs: { a: 2, b: 3 }, expected: 5 },
      { inputs: { a: 0, b: 0 }, expected: 0 },
      { inputs: { a: -1, b: 1 }, expected: 0 },
      { inputs: { a: -2, b: 3 }, expected: 1 },
      { inputs: { a: -14, b: 16 }, expected: 2 },
      { inputs: { a: -10, b: -20 }, expected: -30 },
      { inputs: { a: 100, b: 200 }, expected: 300 },
      { inputs: { a: 15, b: 0 }, expected: 15 },
      { inputs: { a: 0, b: -9 }, expected: -9 },
      { inputs: { a: 999, b: 1 }, expected: 1000 },
      { inputs: { a: -500, b: -500 }, expected: -1000 },
      { inputs: { a: 45, b: -30 }, expected: 15 },
      { inputs: { a: -30, b: 45 }, expected: 15 },
      { inputs: { a: 12, b: 12 }, expected: 24 },
      { inputs: { a: -7, b: -8 }, expected: -15 }
    ]
  },

  // -------------------------------------------------------------
  // Day 12
  // -------------------------------------------------------------
  {
    id: 417,
    meta: {
      id: 417,
      title: "Pacific Atlantic Water Flow",
      slug: "pacific-atlantic-water-flow",
      difficulty: "Medium",
      day: 12,
      category: "Graphs",
      order: 1,
      timeEstimateMinutes: 30,
      className: "Solution",
      methodName: "pacificAtlantic",
      kind: "function",
      comparator: "unordered-nested",
      params: [{ name: "heights", type: "int[][]" }],
      returnType: "List<List<Integer>>",
      examples: [
        {
          input: {
            heights: [
              [1, 2, 2, 3, 5],
              [3, 2, 3, 4, 4],
              [2, 4, 5, 3, 1],
              [6, 7, 1, 4, 5],
              [5, 1, 1, 2, 4]
            ]
          },
          output: [[0, 4], [1, 3], [1, 4], [2, 2], [3, 0], [3, 1], [4, 0]]
        },
        { input: { heights: [[1]] }, output: [[0, 0]] }
      ],
      constraints: ["m == heights.length", "n == heights[r].length", "1 <= m, n <= 200", "0 <= heights[r][c] <= 10^5"]
    },
    statement: `There is an \`m x n\` rectangular island that borders both the Pacific Ocean and Atlantic Ocean. The Pacific Ocean touches the island's left and top edges, and the Atlantic Ocean touches the island's right and bottom edges.

The island is partitioned into a grid of square cells. You are given an \`m x n\` integer matrix \`heights\` where \`heights[r][c]\` represents the height above sea level of the cell at coordinate \`(r, c)\`.

The island receives a lot of rain, and the rain water can flow to neighboring cells directly north, south, east, and west if the neighboring cell's height is less than or equal to the current cell's height. Water can flow from any cell adjacent to an ocean into the ocean.

Return a 2D list of grid coordinates \`result\` where \`result[i] = [r_i, c_i]\` denotes that rain water can flow from cell \`(r_i, c_i)\` to both the Pacific and Atlantic oceans.`,
    starter: `import java.util.*;
import java.io.*;
import java.lang.*;

class Solution {
    public List<List<Integer>> pacificAtlantic(int[][] heights) {
        
    }
}`,
    refSolution: `import java.util.*;

class Solution {
    private int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};

    public List<List<Integer>> pacificAtlantic(int[][] heights) {
        List<List<Integer>> res = new ArrayList<>();
        if (heights == null || heights.length == 0) return res;
        int m = heights.length, n = heights[0].length;
        boolean[][] pac = new boolean[m][n];
        boolean[][] atl = new boolean[m][n];
        for (int i = 0; i < m; i++) {
            flow(heights, pac, i, 0, heights[i][0]);
            flow(heights, atl, i, n - 1, heights[i][n - 1]);
        }
        for (int j = 0; j < n; j++) {
            flow(heights, pac, 0, j, heights[0][j]);
            flow(heights, atl, m - 1, j, heights[m - 1][j]);
        }
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (pac[i][j] && atl[i][j]) {
                    res.add(Arrays.asList(i, j));
                }
            }
        }
        return res;
    }

    private void flow(int[][] h, boolean[][] ocean, int r, int c, int prevH) {
        if (r < 0 || r >= h.length || c < 0 || c >= h[0].length || ocean[r][c] || h[r][c] < prevH) return;
        ocean[r][c] = true;
        for (int[] d : dirs) {
            flow(h, ocean, r + d[0], c + d[1], h[r][c]);
        }
    }
}`,
    tests: [
      {
        inputs: {
          heights: [
            [1, 2, 2, 3, 5],
            [3, 2, 3, 4, 4],
            [2, 4, 5, 3, 1],
            [6, 7, 1, 4, 5],
            [5, 1, 1, 2, 4]
          ]
        },
        expected: [[0, 4], [1, 3], [1, 4], [2, 2], [3, 0], [3, 1], [4, 0]]
      },
      { inputs: { heights: [[1]] }, expected: [[0, 0]] },
      { inputs: { heights: [[2, 1], [1, 2]] }, expected: [[0, 0], [0, 1], [1, 0], [1, 1]] },
      { inputs: { heights: [[1, 2, 3], [8, 9, 4], [7, 6, 5]] }, expected: [[0, 2], [1, 0], [1, 1], [1, 2], [2, 0], [2, 1], [2, 2]] },
      { inputs: { heights: [[10, 10, 10], [10, 1, 10], [10, 10, 10]] }, expected: [[0, 0], [0, 1], [0, 2], [1, 0], [1, 2], [2, 0], [2, 1], [2, 2]] },
      { inputs: { heights: [[1, 2], [4, 3]] }, expected: [[0, 1], [1, 0], [1, 1]] },
      { inputs: { heights: [[3, 3, 3, 3], [3, 0, 3, 3], [3, 3, 3, 3]] }, expected: [[0, 0], [0, 1], [0, 2], [0, 3], [1, 0], [1, 2], [1, 3], [2, 0], [2, 1], [2, 2], [2, 3]] },
      { inputs: { heights: [[1, 1], [1, 1]] }, expected: [[0, 0], [0, 1], [1, 0], [1, 1]] },
      { inputs: { heights: [[1, 2, 3, 4]] }, expected: [[0, 0], [0, 1], [0, 2], [0, 3]] },
      { inputs: { heights: [[4], [3], [2], [1]] }, expected: [[0, 0], [1, 0], [2, 0], [3, 0]] },
      { inputs: { heights: [[1, 3, 1], [3, 1, 3], [1, 3, 1]] }, expected: [[0, 1], [1, 0], [1, 2], [2, 1]] },
      { inputs: { heights: [[1, 2, 1], [2, 3, 2], [1, 2, 1]] }, expected: [[0, 1], [1, 0], [1, 1], [1, 2], [2, 1]] },
      { inputs: { heights: [[9, 9], [9, 9]] }, expected: [[0, 0], [0, 1], [1, 0], [1, 1]] },
      { inputs: { heights: [[5, 6, 7], [4, 1, 8], [3, 2, 9]] }, expected: [[0, 2], [1, 2], [2, 0], [2, 1], [2, 2]] },
      { inputs: { heights: [[1, 5], [2, 4], [3, 3]] }, expected: [[0, 1], [1, 1], [2, 0], [2, 1]] },
      { inputs: { heights: [[2, 2], [2, 2]] }, expected: [[0, 0], [0, 1], [1, 0], [1, 1]] }
    ]
  },
  {
    id: 647,
    meta: {
      id: 647,
      title: "Palindromic Substrings",
      slug: "palindromic-substrings",
      difficulty: "Medium",
      day: 12,
      category: "String",
      order: 2,
      timeEstimateMinutes: 20,
      className: "Solution",
      methodName: "countSubstrings",
      kind: "function",
      comparator: "exact",
      params: [{ name: "s", type: "String" }],
      returnType: "int",
      examples: [
        { input: { s: "abc" }, output: 3 },
        { input: { s: "aaa" }, output: 6 }
      ],
      constraints: ["1 <= s.length <= 1000", "s consists of lowercase English letters."]
    },
    statement: `Given a string \`s\`, return the number of palindromic substrings in it.

A string is a palindrome when it reads the same backward as forward.

A substring is a contiguous sequence of characters within the string.`,
    starter: `import java.util.*;
import java.io.*;
import java.lang.*;

class Solution {
    public int countSubstrings(String s) {
        
    }
}`,
    refSolution: `import java.util.*;

class Solution {
    public int countSubstrings(String s) {
        int count = 0;
        for (int i = 0; i < s.length(); i++) {
            count += expand(s, i, i);
            count += expand(s, i, i + 1);
        }
        return count;
    }

    private int expand(String s, int left, int right) {
        int ans = 0;
        while (left >= 0 && right < s.length() && s.charAt(left) == s.charAt(right)) {
            ans++;
            left--;
            right++;
        }
        return ans;
    }
}`,
    tests: [
      { inputs: { s: "abc" }, expected: 3 },
      { inputs: { s: "aaa" }, expected: 6 },
      { inputs: { s: "a" }, expected: 1 },
      { inputs: { s: "aa" }, expected: 3 },
      { inputs: { s: "aba" }, expected: 4 },
      { inputs: { s: "abba" }, expected: 6 },
      { inputs: { s: "racecar" }, expected: 10 },
      { inputs: { s: "noon" }, expected: 6 },
      { inputs: { s: "madam" }, expected: 7 },
      { inputs: { s: "hello" }, expected: 6 },
      { inputs: { s: "leetcode" }, expected: 9 },
      { inputs: { s: "aaaa" }, expected: 10 },
      { inputs: { s: "abacaba" }, expected: 12 },
      { inputs: { s: "xyz" }, expected: 3 },
      { inputs: { s: "baac" }, expected: 5 },
      { inputs: { s: "abccba" }, expected: 9 }
    ]
  },
  {
    id: 79,
    meta: {
      id: 79,
      title: "Word Search",
      slug: "word-search",
      difficulty: "Medium",
      day: 12,
      category: "Backtracking",
      order: 3,
      timeEstimateMinutes: 30,
      className: "Solution",
      methodName: "exist",
      kind: "function",
      comparator: "exact",
      params: [{ name: "board", type: "char[][]" }, { name: "word", type: "String" }],
      returnType: "boolean",
      examples: [
        {
          input: {
            board: [
              ["A", "B", "C", "E"],
              ["S", "F", "C", "S"],
              ["A", "D", "E", "E"]
            ],
            word: "ABCCED"
          },
          output: true
        },
        {
          input: {
            board: [
              ["A", "B", "C", "E"],
              ["S", "F", "C", "S"],
              ["A", "D", "E", "E"]
            ],
            word: "SEE"
          },
          output: true
        },
        {
          input: {
            board: [
              ["A", "B", "C", "E"],
              ["S", "F", "C", "S"],
              ["A", "D", "E", "E"]
            ],
            word: "ABCB"
          },
          output: false
        }
      ],
      constraints: ["m == board.length", "n = board[i].length", "1 <= m, n <= 6", "1 <= word.length <= 15", "board and word consists of only lowercase and uppercase English letters."]
    },
    statement: `Given an \`m x n\` grid of characters \`board\` and a string \`word\`, return \`true\` if \`word\` exists in the grid.

The word can be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once.`,
    starter: `import java.util.*;
import java.io.*;
import java.lang.*;

class Solution {
    public boolean exist(char[][] board, String word) {
        
    }
}`,
    refSolution: `import java.util.*;

class Solution {
    public boolean exist(char[][] board, String word) {
        int m = board.length, n = board[0].length;
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (search(board, word, i, j, 0)) return true;
            }
        }
        return false;
    }

    private boolean search(char[][] board, String word, int r, int c, int idx) {
        if (idx == word.length()) return true;
        if (r < 0 || r >= board.length || c < 0 || c >= board[0].length || board[r][c] != word.charAt(idx)) return false;
        char temp = board[r][c];
        board[r][c] = '#';
        boolean found = search(board, word, r + 1, c, idx + 1) ||
                        search(board, word, r - 1, c, idx + 1) ||
                        search(board, word, r, c + 1, idx + 1) ||
                        search(board, word, r, c - 1, idx + 1);
        board[r][c] = temp;
        return found;
    }
}`,
    tests: [
      {
        inputs: {
          board: [
            ["A", "B", "C", "E"],
            ["S", "F", "C", "S"],
            ["A", "D", "E", "E"]
          ],
          word: "ABCCED"
        },
        expected: true
      },
      {
        inputs: {
          board: [
            ["A", "B", "C", "E"],
            ["S", "F", "C", "S"],
            ["A", "D", "E", "E"]
          ],
          word: "SEE"
        },
        expected: true
      },
      {
        inputs: {
          board: [
            ["A", "B", "C", "E"],
            ["S", "F", "C", "S"],
            ["A", "D", "E", "E"]
          ],
          word: "ABCB"
        },
        expected: false
      },
      { inputs: { board: [["a"]], word: "a" }, expected: true },
      { inputs: { board: [["a"]], word: "b" }, expected: false },
      { inputs: { board: [["a", "b"], ["c", "d"]], word: "abcd" }, expected: false },
      { inputs: { board: [["a", "b"], ["c", "d"]], word: "abdc" }, expected: true },
      { inputs: { board: [["A", "B"], ["C", "D"]], word: "ACDB" }, expected: true },
      { inputs: { board: [["C", "A", "A"], ["A", "A", "A"], ["B", "C", "D"]], word: "AAB" }, expected: true },
      { inputs: { board: [["A", "B", "C", "E"], ["S", "F", "E", "S"], ["A", "D", "E", "E"]], word: "ABCESEEEFS" }, expected: true },
      { inputs: { board: [["a", "a"]], word: "aaa" }, expected: false },
      { inputs: { board: [["a", "a", "a", "a"]], word: "aaaa" }, expected: true },
      { inputs: { board: [["a", "b", "c"], ["d", "e", "f"], ["g", "h", "i"]], word: "cfi" }, expected: true },
      { inputs: { board: [["a", "b", "c"], ["d", "e", "f"], ["g", "h", "i"]], word: "beh" }, expected: true },
      { inputs: { board: [["a", "b", "c"], ["d", "e", "f"], ["g", "h", "i"]], word: "ihgfedcba" }, expected: true },
      { inputs: { board: [["A", "B", "C"], ["D", "E", "F"]], word: "FEDCBA" }, expected: true }
    ]
  },
  {
    id: 211,
    meta: {
      id: 211,
      title: "Design Add and Search Words Data Structure",
      slug: "design-add-and-search-words-data-structure",
      difficulty: "Medium",
      day: 12,
      category: "Trie",
      order: 4,
      timeEstimateMinutes: 30,
      className: "WordDictionary",
      kind: "class",
      comparator: "exact",
      examples: [
        {
          input: {
            operations: ["WordDictionary", "addWord", "addWord", "addWord", "search", "search", "search", "search"],
            args: [[], ["bad"], ["dad"], ["mad"], ["pad"], ["bad"], [".ad"], ["b.."]]
          },
          output: [null, null, null, null, false, true, true, true]
        }
      ],
      constraints: ["1 <= word.length <= 25", "word in addWord consists of lowercase English letters.", "word in search consist of '.' or lowercase English letters.", "At most 10^4 calls will be made to addWord and search."]
    },
    statement: `Design a data structure that supports adding new words and finding if a string matches any previously added string.

Implement the \`WordDictionary\` class:
- \`WordDictionary()\` Initializes the object.
- \`void addWord(word)\` Adds \`word\` to the data structure, it can be matched later.
- \`bool search(word)\` Returns \`true\` if there is any string in the data structure that matches \`word\` or \`false\` otherwise. \`word\` may contain dots \`'.'\` where dots can be matched with any letter.`,
    starter: `import java.util.*;
import java.io.*;
import java.lang.*;

class WordDictionary {

    public WordDictionary() {
        
    }
    
    public void addWord(String word) {
        
    }
    
    public boolean search(String word) {
        
    }
}`,
    refSolution: `import java.util.*;

class WordDictionary {
    private static class Node {
        Node[] children = new Node[26];
        boolean isEnd = false;
    }

    private Node root;

    public WordDictionary() {
        root = new Node();
    }

    public void addWord(String word) {
        Node curr = root;
        for (char c : word.toCharArray()) {
            int idx = c - 'a';
            if (curr.children[idx] == null) {
                curr.children[idx] = new Node();
            }
            curr = curr.children[idx];
        }
        curr.isEnd = true;
    }

    public boolean search(String word) {
        return searchInNode(word, 0, root);
    }

    private boolean searchInNode(String word, int idx, Node curr) {
        if (curr == null) return false;
        if (idx == word.length()) return curr.isEnd;
        char c = word.charAt(idx);
        if (c == '.') {
            for (Node child : curr.children) {
                if (child != null && searchInNode(word, idx + 1, child)) return true;
            }
            return false;
        } else {
            return searchInNode(word, idx + 1, curr.children[c - 'a']);
        }
    }
}`,
    tests: [
      {
        inputs: {
          operations: ["WordDictionary", "addWord", "addWord", "addWord", "search", "search", "search", "search"],
          args: [[], ["bad"], ["dad"], ["mad"], ["pad"], ["bad"], [".ad"], ["b.."]]
        },
        expected: [null, null, null, null, false, true, true, true]
      },
      {
        inputs: {
          operations: ["WordDictionary", "addWord", "search"],
          args: [[], ["a"], ["."]]
        },
        expected: [null, null, true]
      },
      {
        inputs: {
          operations: ["WordDictionary", "addWord", "search"],
          args: [[], ["a"], ["a."]]
        },
        expected: [null, null, false]
      },
      {
        inputs: {
          operations: ["WordDictionary", "addWord", "addWord", "search", "search"],
          args: [[], ["apple"], ["app"], ["app."], ["app.."]]
        },
        expected: [null, null, null, false, true]
      },
      {
        inputs: {
          operations: ["WordDictionary", "addWord", "search", "search"],
          args: [[], ["hello"], ["hello"], ["world"]]
        },
        expected: [null, null, true, false]
      },
      {
        inputs: {
          operations: ["WordDictionary", "addWord", "search", "search", "search"],
          args: [[], ["abc"], ["..."], ["..d"], [".b."]]
        },
        expected: [null, null, true, false, true]
      },
      {
        inputs: {
          operations: ["WordDictionary", "search"],
          args: [[], ["a"]]
        },
        expected: [null, false]
      },
      {
        inputs: {
          operations: ["WordDictionary", "addWord", "addWord", "search"],
          args: [[], ["at"], ["and"], ["an."]]
        },
        expected: [null, null, null, true]
      },
      {
        inputs: {
          operations: ["WordDictionary", "addWord", "addWord", "search"],
          args: [[], ["cat"], ["bat"], ["rat"]]
        },
        expected: [null, null, null, false]
      },
      {
        inputs: {
          operations: ["WordDictionary", "addWord", "addWord", "search"],
          args: [[], ["cat"], ["bat"], [".at"]]
        },
        expected: [null, null, null, true]
      },
      {
        inputs: {
          operations: ["WordDictionary", "addWord", "search"],
          args: [[], ["longerwordhere"], ["............wordhere"]]
        },
        expected: [null, null, false]
      },
      {
        inputs: {
          operations: ["WordDictionary", "addWord", "search"],
          args: [[], ["longerwordhere"], [".............."]]
        },
        expected: [null, null, true]
      },
      {
        inputs: {
          operations: ["WordDictionary", "addWord", "addWord", "search", "search"],
          args: [[], ["tea"], ["toast"], ["t.."], ["t...."]]
        },
        expected: [null, null, null, true, true]
      },
      {
        inputs: {
          operations: ["WordDictionary", "addWord", "search"],
          args: [[], ["z"], ["z"]]
        },
        expected: [null, null, true]
      },
      {
        inputs: {
          operations: ["WordDictionary", "addWord", "search"],
          args: [[], ["z"], ["."]]
        },
        expected: [null, null, true]
      },
      {
        inputs: {
          operations: ["WordDictionary", "addWord", "search"],
          args: [[], ["xyz"], ["x.z"]]
        },
        expected: [null, null, true]
      }
    ]
  },
  {
    id: 252,
    meta: {
      id: 252,
      title: "Meeting Rooms",
      slug: "meeting-rooms",
      difficulty: "Easy",
      day: 12,
      category: "Intervals",
      order: 5,
      timeEstimateMinutes: 15,
      className: "Solution",
      methodName: "canAttendMeetings",
      kind: "function",
      comparator: "exact",
      params: [{ name: "intervals", type: "int[][]" }],
      returnType: "boolean",
      examples: [
        { input: { intervals: [[0, 30], [5, 10], [15, 20]] }, output: false },
        { input: { intervals: [[7, 10], [2, 4]] }, output: true }
      ],
      constraints: ["0 <= intervals.length <= 10^4", "intervals[i].length == 2", "0 <= start_i < end_i <= 10^6"]
    },
    statement: `Given an array of meeting time intervals where \`intervals[i] = [start_i, end_i]\`, determine if a person could attend all meetings.`,
    starter: `import java.util.*;
import java.io.*;
import java.lang.*;

class Solution {
    public boolean canAttendMeetings(int[][] intervals) {
        
    }
}`,
    refSolution: `import java.util.*;

class Solution {
    public boolean canAttendMeetings(int[][] intervals) {
        Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
        for (int i = 1; i < intervals.length; i++) {
            if (intervals[i][0] < intervals[i - 1][1]) {
                return false;
            }
        }
        return true;
    }
}`,
    tests: [
      { inputs: { intervals: [[0, 30], [5, 10], [15, 20]] }, expected: false },
      { inputs: { intervals: [[7, 10], [2, 4]] }, expected: true },
      { inputs: { intervals: [] }, expected: true },
      { inputs: { intervals: [[1, 5]] }, expected: true },
      { inputs: { intervals: [[1, 5], [5, 10]] }, expected: true },
      { inputs: { intervals: [[1, 5], [4, 10]] }, expected: false },
      { inputs: { intervals: [[1, 2], [2, 3], [3, 4], [4, 5]] }, expected: true },
      { inputs: { intervals: [[1, 3], [2, 4], [5, 6]] }, expected: false },
      { inputs: { intervals: [[10, 20], [0, 5], [30, 40]] }, expected: true },
      { inputs: { intervals: [[10, 20], [0, 15]] }, expected: false },
      { inputs: { intervals: [[5, 8], [6, 8]] }, expected: false },
      { inputs: { intervals: [[1, 10], [10, 20], [20, 30]] }, expected: true },
      { inputs: { intervals: [[1, 10], [2, 3], [4, 5]] }, expected: false },
      { inputs: { intervals: [[13, 15], [1, 13]] }, expected: true },
      { inputs: { intervals: [[8, 11], [17, 20], [1, 2]] }, expected: true },
      { inputs: { intervals: [[6, 15], [13, 20], [6, 17]] }, expected: false }
    ]
  },

  // -------------------------------------------------------------
  // Day 13
  // -------------------------------------------------------------
  {
    id: 105,
    meta: {
      id: 105,
      title: "Construct Binary Tree from Preorder and Inorder Traversal",
      slug: "construct-binary-tree-from-preorder-and-inorder-traversal",
      difficulty: "Medium",
      day: 13,
      category: "Trees",
      order: 1,
      timeEstimateMinutes: 30,
      className: "Solution",
      methodName: "buildTree",
      kind: "function",
      comparator: "exact",
      params: [{ name: "preorder", type: "int[]" }, { name: "inorder", type: "int[]" }],
      returnType: "TreeNode",
      examples: [
        { input: { preorder: [3, 9, 20, 15, 7], inorder: [9, 3, 15, 20, 7] }, output: [3, 9, 20, null, null, 15, 7] },
        { input: { preorder: [-1], inorder: [-1] }, output: [-1] }
      ],
      constraints: ["1 <= preorder.length <= 3000", "inorder.length == preorder.length", "-3000 <= preorder[i], inorder[i] <= 3000", "preorder and inorder consist of unique values.", "Each value of inorder also appears in preorder."]
    },
    statement: `Given two integer arrays \`preorder\` and \`inorder\` where \`preorder\` is the preorder traversal of a binary tree and \`inorder\` is the inorder traversal of the same tree, construct and return the binary tree.`,
    starter: `import java.util.*;
import java.io.*;
import java.lang.*;

class Solution {
    public TreeNode buildTree(int[] preorder, int[] inorder) {
        
    }
}`,
    refSolution: `import java.util.*;

class Solution {
    private Map<Integer, Integer> inMap = new HashMap<>();
    private int preIndex = 0;

    public TreeNode buildTree(int[] preorder, int[] inorder) {
        preIndex = 0;
        inMap.clear();
        for (int i = 0; i < inorder.length; i++) {
            inMap.put(inorder[i], i);
        }
        return helper(preorder, 0, inorder.length - 1);
    }

    private TreeNode helper(int[] preorder, int inStart, int inEnd) {
        if (inStart > inEnd) return null;
        int rootVal = preorder[preIndex++];
        TreeNode root = new TreeNode(rootVal);
        int inIndex = inMap.get(rootVal);
        root.left = helper(preorder, inStart, inIndex - 1);
        root.right = helper(preorder, inIndex + 1, inEnd);
        return root;
    }
}`,
    tests: [
      { inputs: { preorder: [3, 9, 20, 15, 7], inorder: [9, 3, 15, 20, 7] }, expected: [3, 9, 20, null, null, 15, 7] },
      { inputs: { preorder: [-1], inorder: [-1] }, expected: [-1] },
      { inputs: { preorder: [1, 2], inorder: [2, 1] }, expected: [1, 2] },
      { inputs: { preorder: [1, 2], inorder: [1, 2] }, expected: [1, null, 2] },
      { inputs: { preorder: [1, 2, 3], inorder: [2, 1, 3] }, expected: [1, 2, 3] },
      { inputs: { preorder: [1, 2, 4, 5, 3], inorder: [4, 2, 5, 1, 3] }, expected: [1, 2, 3, 4, 5] },
      { inputs: { preorder: [1, 2, 3, 4], inorder: [4, 3, 2, 1] }, expected: [1, 2, null, 3, null, 4] },
      { inputs: { preorder: [1, 2, 3, 4], inorder: [1, 2, 3, 4] }, expected: [1, null, 2, null, 3, null, 4] },
      { inputs: { preorder: [4, 2, 1, 3, 6, 5, 7], inorder: [1, 2, 3, 4, 5, 6, 7] }, expected: [4, 2, 6, 1, 3, 5, 7] },
      { inputs: { preorder: [2, 1], inorder: [1, 2] }, expected: [2, 1] },
      { inputs: { preorder: [5, 4, 3, 2, 1], inorder: [1, 2, 3, 4, 5] }, expected: [5, 4, null, 3, null, 2, null, 1] },
      { inputs: { preorder: [10, 5, 15], inorder: [5, 10, 15] }, expected: [10, 5, 15] },
      { inputs: { preorder: [1, 2, 3], inorder: [3, 2, 1] }, expected: [1, 2, null, 3] },
      { inputs: { preorder: [1, 2, 3], inorder: [1, 3, 2] }, expected: [1, null, 2, 3] },
      { inputs: { preorder: [7, -10, -4, 3, -1, 2, -8, 11], inorder: [-4, -10, 3, 7, 2, -1, 11, -8] }, expected: [7, -10, -1, -4, 3, 2, -8, null, null, null, null, null, null, 11] },
      { inputs: { preorder: [1, 4, 2, 3], inorder: [1, 2, 4, 3] }, expected: [1, null, 4, 2, 3] }
    ]
  },
  {
    id: 300,
    meta: {
      id: 300,
      title: "Longest Increasing Subsequence",
      slug: "longest-increasing-subsequence",
      difficulty: "Medium",
      day: 13,
      category: "Dynamic Programming",
      order: 2,
      timeEstimateMinutes: 25,
      className: "Solution",
      methodName: "lengthOfLIS",
      kind: "function",
      comparator: "exact",
      params: [{ name: "nums", type: "int[]" }],
      returnType: "int",
      examples: [
        { input: { nums: [10, 9, 2, 5, 3, 7, 101, 18] }, output: 4 },
        { input: { nums: [0, 1, 0, 3, 2, 3] }, output: 4 },
        { input: { nums: [7, 7, 7, 7, 7, 7, 7] }, output: 1 }
      ],
      constraints: ["1 <= nums.length <= 2500", "-10^4 <= nums[i] <= 10^4"]
    },
    statement: `Given an integer array \`nums\`, return the length of the longest strictly increasing subsequence.`,
    starter: `import java.util.*;
import java.io.*;
import java.lang.*;

class Solution {
    public int lengthOfLIS(int[] nums) {
        
    }
}`,
    refSolution: `import java.util.*;

class Solution {
    public int lengthOfLIS(int[] nums) {
        if (nums.length == 0) return 0;
        int[] tails = new int[nums.length];
        int size = 0;
        for (int x : nums) {
            int i = 0, j = size;
            while (i != j) {
                int m = (i + j) / 2;
                if (tails[m] < x) i = m + 1;
                else j = m;
            }
            tails[i] = x;
            if (i == size) ++size;
        }
        return size;
    }
}`,
    tests: [
      { inputs: { nums: [10, 9, 2, 5, 3, 7, 101, 18] }, expected: 4 },
      { inputs: { nums: [0, 1, 0, 3, 2, 3] }, expected: 4 },
      { inputs: { nums: [7, 7, 7, 7, 7, 7, 7] }, expected: 1 },
      { inputs: { nums: [1] }, expected: 1 },
      { inputs: { nums: [1, 2, 3, 4, 5] }, expected: 5 },
      { inputs: { nums: [5, 4, 3, 2, 1] }, expected: 1 },
      { inputs: { nums: [1, 3, 6, 7, 9, 4, 10, 5, 6] }, expected: 6 },
      { inputs: { nums: [4, 10, 4, 3, 8, 9] }, expected: 3 },
      { inputs: { nums: [3, 5, 6, 2, 5, 4, 19, 5, 6, 7, 12] }, expected: 6 },
      { inputs: { nums: [-2, -1] }, expected: 2 },
      { inputs: { nums: [10, 22, 9, 33, 21, 50, 41, 60, 80] }, expected: 6 },
      { inputs: { nums: [2, 2] }, expected: 1 },
      { inputs: { nums: [1, 5, 2, 4, 3] }, expected: 3 },
      { inputs: { nums: [0] }, expected: 1 },
      { inputs: { nums: [1, 100, 2, 101, 3, 102] }, expected: 4 },
      { inputs: { nums: [1, 3, 2, 4, 3, 5] }, expected: 4 }
    ]
  },
  {
    id: 62,
    meta: {
      id: 62,
      title: "Unique Paths",
      slug: "unique-paths",
      difficulty: "Medium",
      day: 13,
      category: "Dynamic Programming",
      order: 3,
      timeEstimateMinutes: 20,
      className: "Solution",
      methodName: "uniquePaths",
      kind: "function",
      comparator: "exact",
      params: [{ name: "m", type: "int" }, { name: "n", type: "int" }],
      returnType: "int",
      examples: [
        { input: { m: 3, n: 7 }, output: 28 },
        { input: { m: 3, n: 2 }, output: 3 }
      ],
      constraints: ["1 <= m, n <= 100"]
    },
    statement: `There is a robot on an \`m x n\` grid. The robot is initially located at the top-left corner (i.e., \`grid[0][0]\`). The robot tries to move to the bottom-right corner (i.e., \`grid[m - 1][n - 1]\`). The robot can only move either down or right at any point in time.

Given the two integers \`m\` and \`n\`, return the number of possible unique paths that the robot can take to reach the bottom-right corner.`,
    starter: `import java.util.*;
import java.io.*;
import java.lang.*;

class Solution {
    public int uniquePaths(int m, int n) {
        
    }
}`,
    refSolution: `import java.util.*;

class Solution {
    public int uniquePaths(int m, int n) {
        int[] dp = new int[n];
        Arrays.fill(dp, 1);
        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                dp[j] += dp[j - 1];
            }
        }
        return dp[n - 1];
    }
}`,
    tests: [
      { inputs: { m: 3, n: 7 }, expected: 28 },
      { inputs: { m: 3, n: 2 }, expected: 3 },
      { inputs: { m: 1, n: 1 }, expected: 1 },
      { inputs: { m: 1, n: 10 }, expected: 1 },
      { inputs: { m: 10, n: 1 }, expected: 1 },
      { inputs: { m: 2, n: 2 }, expected: 2 },
      { inputs: { m: 3, n: 3 }, expected: 6 },
      { inputs: { m: 4, n: 4 }, expected: 20 },
      { inputs: { m: 5, n: 5 }, expected: 70 },
      { inputs: { m: 6, n: 3 }, expected: 21 },
      { inputs: { m: 7, n: 3 }, expected: 28 },
      { inputs: { m: 10, n: 10 }, expected: 48620 },
      { inputs: { m: 2, n: 100 }, expected: 100 },
      { inputs: { m: 12, n: 12 }, expected: 705432 },
      { inputs: { m: 15, n: 5 }, expected: 3060 },
      { inputs: { m: 20, n: 3 }, expected: 210 }
    ]
  },
  {
    id: 261,
    meta: {
      id: 261,
      title: "Graph Valid Tree",
      slug: "graph-valid-tree",
      difficulty: "Medium",
      day: 13,
      category: "Graphs",
      order: 4,
      timeEstimateMinutes: 25,
      className: "Solution",
      methodName: "validTree",
      kind: "function",
      comparator: "exact",
      params: [{ name: "n", type: "int" }, { name: "edges", type: "int[][]" }],
      returnType: "boolean",
      examples: [
        { input: { n: 5, edges: [[0, 1], [0, 2], [0, 3], [1, 4]] }, output: true },
        { input: { n: 5, edges: [[0, 1], [1, 2], [2, 3], [1, 3], [1, 4]] }, output: false }
      ],
      constraints: ["1 <= n <= 2000", "0 <= edges.length <= 5000", "edges[i].length == 2", "0 <= a_i, b_i < n", "a_i != b_i", "There are no duplicate edges."]
    },
    statement: `You have a graph of \`n\` nodes labeled from \`0\` to \`n - 1\`. You are given an integer n and a list of \`edges\` where \`edges[i] = [a_i, b_i]\` indicates that there is an undirected edge between nodes \`a_i\` and \`b_i\` in the graph.

Return \`true\` if the edges of the given graph make up a valid tree, and \`false\` otherwise.`,
    starter: `import java.util.*;
import java.io.*;
import java.lang.*;

class Solution {
    public boolean validTree(int n, int[][] edges) {
        
    }
}`,
    refSolution: `import java.util.*;

class Solution {
    public boolean validTree(int n, int[][] edges) {
        if (edges.length != n - 1) return false;
        int[] parent = new int[n];
        for (int i = 0; i < n; i++) parent[i] = i;
        for (int[] e : edges) {
            int root1 = find(parent, e[0]);
            int root2 = find(parent, e[1]);
            if (root1 == root2) return false;
            parent[root1] = root2;
        }
        return true;
    }

    private int find(int[] parent, int i) {
        if (parent[i] == i) return i;
        return parent[i] = find(parent, parent[i]);
    }
}`,
    tests: [
      { inputs: { n: 5, edges: [[0, 1], [0, 2], [0, 3], [1, 4]] }, expected: true },
      { inputs: { n: 5, edges: [[0, 1], [1, 2], [2, 3], [1, 3], [1, 4]] }, expected: false },
      { inputs: { n: 1, edges: [] }, expected: true },
      { inputs: { n: 2, edges: [] }, expected: false },
      { inputs: { n: 2, edges: [[0, 1]] }, expected: true },
      { inputs: { n: 3, edges: [[0, 1], [1, 2]] }, expected: true },
      { inputs: { n: 3, edges: [[0, 1], [1, 2], [2, 0]] }, expected: false },
      { inputs: { n: 4, edges: [[0, 1], [2, 3]] }, expected: false },
      { inputs: { n: 4, edges: [[0, 1], [1, 2], [2, 3]] }, expected: true },
      { inputs: { n: 4, edges: [[0, 1], [0, 2], [0, 3]] }, expected: true },
      { inputs: { n: 6, edges: [[0, 1], [1, 2], [1, 3], [3, 4], [4, 5]] }, expected: true },
      { inputs: { n: 5, edges: [[0, 1], [0, 4], [1, 4], [2, 3]] }, expected: false },
      { inputs: { n: 4, edges: [[0, 1], [2, 3], [1, 2], [3, 0]] }, expected: false },
      { inputs: { n: 3, edges: [[0, 1]] }, expected: false },
      { inputs: { n: 5, edges: [[0, 1], [1, 2], [3, 4]] }, expected: false },
      { inputs: { n: 6, edges: [[0, 1], [2, 3], [4, 5], [0, 2], [2, 4]] }, expected: true }
    ]
  },
  {
    id: 253,
    meta: {
      id: 253,
      title: "Meeting Rooms II",
      slug: "meeting-rooms-ii",
      difficulty: "Medium",
      day: 13,
      category: "Intervals",
      order: 5,
      timeEstimateMinutes: 25,
      className: "Solution",
      methodName: "minMeetingRooms",
      kind: "function",
      comparator: "exact",
      params: [{ name: "intervals", type: "int[][]" }],
      returnType: "int",
      examples: [
        { input: { intervals: [[0, 30], [5, 10], [15, 20]] }, output: 2 },
        { input: { intervals: [[7, 10], [2, 4]] }, output: 1 }
      ],
      constraints: ["1 <= intervals.length <= 10^4", "0 <= start_i < end_i <= 10^6"]
    },
    statement: `Given an array of meeting time intervals \`intervals\` where \`intervals[i] = [start_i, end_i]\`, return the minimum number of conference rooms required.`,
    starter: `import java.util.*;
import java.io.*;
import java.lang.*;

class Solution {
    public int minMeetingRooms(int[][] intervals) {
        
    }
}`,
    refSolution: `import java.util.*;

class Solution {
    public int minMeetingRooms(int[][] intervals) {
        if (intervals == null || intervals.length == 0) return 0;
        int n = intervals.length;
        int[] starts = new int[n];
        int[] ends = new int[n];
        for (int i = 0; i < n; i++) {
            starts[i] = intervals[i][0];
            ends[i] = intervals[i][1];
        }
        Arrays.sort(starts);
        Arrays.sort(ends);
        int rooms = 0, endPtr = 0;
        for (int i = 0; i < n; i++) {
            if (starts[i] < ends[endPtr]) {
                rooms++;
            } else {
                endPtr++;
            }
        }
        return rooms;
    }
}`,
    tests: [
      { inputs: { intervals: [[0, 30], [5, 10], [15, 20]] }, expected: 2 },
      { inputs: { intervals: [[7, 10], [2, 4]] }, expected: 1 },
      { inputs: { intervals: [[1, 5]] }, expected: 1 },
      { inputs: { intervals: [[1, 5], [5, 10]] }, expected: 1 },
      { inputs: { intervals: [[1, 5], [2, 6], [3, 7]] }, expected: 3 },
      { inputs: { intervals: [[1, 10], [2, 9], [3, 8], [4, 7]] }, expected: 4 },
      { inputs: { intervals: [[1, 2], [2, 3], [3, 4], [4, 5]] }, expected: 1 },
      { inputs: { intervals: [[1, 4], [2, 5], [7, 9]] }, expected: 2 },
      { inputs: { intervals: [[9, 10], [4, 9], [4, 17]] }, expected: 2 },
      { inputs: { intervals: [[2, 11], [6, 16], [11, 16]] }, expected: 2 },
      { inputs: { intervals: [[13, 15], [1, 13]] }, expected: 1 },
      { inputs: { intervals: [[1, 5], [8, 9], [8, 9]] }, expected: 2 },
      { inputs: { intervals: [[0, 10], [1, 11], [2, 12], [3, 13], [4, 14]] }, expected: 5 },
      { inputs: { intervals: [[10, 20], [20, 30], [30, 40]] }, expected: 1 },
      { inputs: { intervals: [[5, 8], [6, 8]] }, expected: 2 },
      { inputs: { intervals: [[1, 8], [2, 5], [6, 7]] }, expected: 2 }
    ]
  },

  // -------------------------------------------------------------
  // Day 14
  // -------------------------------------------------------------
  {
    id: 139,
    meta: {
      id: 139,
      title: "Word Break",
      slug: "word-break",
      difficulty: "Medium",
      day: 14,
      category: "Dynamic Programming",
      order: 1,
      timeEstimateMinutes: 25,
      className: "Solution",
      methodName: "wordBreak",
      kind: "function",
      comparator: "exact",
      params: [{ name: "s", type: "String" }, { name: "wordDict", type: "List<String>" }],
      returnType: "boolean",
      examples: [
        { input: { s: "leetcode", wordDict: ["leet", "code"] }, output: true },
        { input: { s: "applepenapple", wordDict: ["apple", "pen"] }, output: true },
        { input: { s: "catsandog", wordDict: ["cats", "dog", "sand", "and", "cat"] }, output: false }
      ],
      constraints: ["1 <= s.length <= 300", "1 <= wordDict.length <= 1000", "1 <= wordDict[i].length <= 20", "s and wordDict[i] consist of only lowercase English letters.", "All the strings of wordDict are unique."]
    },
    statement: `Given a string \`s\` and a dictionary of strings \`wordDict\`, return \`true\` if \`s\` can be segmented into a space-separated sequence of one or more dictionary words.

Note that the same word in the dictionary may be reused multiple times in the segmentation.`,
    starter: `import java.util.*;
import java.io.*;
import java.lang.*;

class Solution {
    public boolean wordBreak(String s, List<String> wordDict) {
        
    }
}`,
    refSolution: `import java.util.*;

class Solution {
    public boolean wordBreak(String s, List<String> wordDict) {
        Set<String> dict = new HashSet<>(wordDict);
        boolean[] dp = new boolean[s.length() + 1];
        dp[0] = true;
        for (int i = 1; i <= s.length(); i++) {
            for (int j = 0; j < i; j++) {
                if (dp[j] && dict.contains(s.substring(j, i))) {
                    dp[i] = true;
                    break;
                }
            }
        }
        return dp[s.length()];
    }
}`,
    tests: [
      { inputs: { s: "leetcode", wordDict: ["leet", "code"] }, expected: true },
      { inputs: { s: "applepenapple", wordDict: ["apple", "pen"] }, expected: true },
      { inputs: { s: "catsandog", wordDict: ["cats", "dog", "sand", "and", "cat"] }, expected: false },
      { inputs: { s: "a", wordDict: ["a"] }, expected: true },
      { inputs: { s: "a", wordDict: ["b"] }, expected: false },
      { inputs: { s: "bb", wordDict: ["a", "b", "bbb", "bbbb"] }, expected: true },
      { inputs: { s: "cars", wordDict: ["car", "ca", "rs"] }, expected: true },
      { inputs: { s: "cbca", wordDict: ["bc", "ca"] }, expected: false },
      { inputs: { s: "goalspecial", wordDict: ["go", "goal", "goals", "special"] }, expected: true },
      { inputs: { s: "abcd", wordDict: ["a", "abc", "b", "cd"] }, expected: true },
      { inputs: { s: "program", wordDict: ["pro", "gram"] }, expected: true },
      { inputs: { s: "aaaaaaa", wordDict: ["aaaa", "aaa"] }, expected: true },
      { inputs: { s: "aaaaaaa", wordDict: ["aaaa", "aa"] }, expected: false },
      { inputs: { s: "sanddog", wordDict: ["sand", "dog"] }, expected: true },
      { inputs: { s: "ilikesamsung", wordDict: ["i", "like", "sam", "sung", "samsung"] }, expected: true },
      { inputs: { s: "mississippi", wordDict: ["miss", "is", "sip", "pi"] }, expected: true }
    ]
  },
  {
    id: 1143,
    meta: {
      id: 1143,
      title: "Longest Common Subsequence",
      slug: "longest-common-subsequence",
      difficulty: "Medium",
      day: 14,
      category: "Dynamic Programming",
      order: 2,
      timeEstimateMinutes: 25,
      className: "Solution",
      methodName: "longestCommonSubsequence",
      kind: "function",
      comparator: "exact",
      params: [{ name: "text1", type: "String" }, { name: "text2", type: "String" }],
      returnType: "int",
      examples: [
        { input: { text1: "abcde", text2: "ace" }, output: 3 },
        { input: { text1: "abc", text2: "abc" }, output: 3 },
        { input: { text1: "abc", text2: "def" }, output: 0 }
      ],
      constraints: ["1 <= text1.length, text2.length <= 1000", "text1 and text2 consist of only lowercase English characters."]
    },
    statement: `Given two strings \`text1\` and \`text2\`, return the length of their longest common subsequence. If there is no common subsequence, return \`0\`.

A subsequence of a string is a new string generated from the original string with some characters (can be none) deleted without changing the relative order of the remaining characters.

A common subsequence of two strings is a subsequence that is common to both strings.`,
    starter: `import java.util.*;
import java.io.*;
import java.lang.*;

class Solution {
    public int longestCommonSubsequence(String text1, String text2) {
        
    }
}`,
    refSolution: `import java.util.*;

class Solution {
    public int longestCommonSubsequence(String text1, String text2) {
        int m = text1.length(), n = text2.length();
        int[][] dp = new int[m + 1][n + 1];
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (text1.charAt(i - 1) == text2.charAt(j - 1)) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                } else {
                    dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                }
            }
        }
        return dp[m][n];
    }
}`,
    tests: [
      { inputs: { text1: "abcde", text2: "ace" }, expected: 3 },
      { inputs: { text1: "abc", text2: "abc" }, expected: 3 },
      { inputs: { text1: "abc", text2: "def" }, expected: 0 },
      { inputs: { text1: "a", text2: "a" }, expected: 1 },
      { inputs: { text1: "a", text2: "b" }, expected: 0 },
      { inputs: { text1: "oxcp", text2: "pomv" }, expected: 1 },
      { inputs: { text1: "bsbininm", text2: "jmjkbkjkv" }, expected: 1 },
      { inputs: { text1: "ezupkr", text2: "ubmrapg" }, expected: 2 },
      { inputs: { text1: "pmjghexybyrgzrcrmbtx", text2: "fvueqqublobcbtgunqlq" }, expected: 4 },
      { inputs: { text1: "bl", text2: "yby" }, expected: 1 },
      { inputs: { text1: "hofubmnylkra", text2: "pqshwvdvdsqq" }, expected: 0 },
      { inputs: { text1: "mhunuzqrkzsnidwbun", text2: "szulspmhwpazoxijwbq" }, expected: 6 },
      { inputs: { text1: "greatest", text2: "east" }, expected: 3 },
      { inputs: { text1: "algorithm", text2: "altruistic" }, expected: 4 },
      { inputs: { text1: "abcdef", text2: "azbzed" }, expected: 3 },
      { inputs: { text1: "sea", text2: "eat" }, expected: 2 }
    ]
  },
  {
    id: 323,
    meta: {
      id: 323,
      title: "Number of Connected Components in an Undirected Graph",
      slug: "number-of-connected-components-in-an-undirected-graph",
      difficulty: "Medium",
      day: 14,
      category: "Graphs",
      order: 3,
      timeEstimateMinutes: 25,
      className: "Solution",
      methodName: "countComponents",
      kind: "function",
      comparator: "exact",
      params: [{ name: "n", type: "int" }, { name: "edges", type: "int[][]" }],
      returnType: "int",
      examples: [
        { input: { n: 5, edges: [[0, 1], [1, 2], [3, 4]] }, output: 2 },
        { input: { n: 5, edges: [[0, 1], [1, 2], [2, 3], [3, 4]] }, output: 1 }
      ],
      constraints: ["1 <= n <= 2000", "0 <= edges.length <= 5000", "edges[i].length == 2", "0 <= a_i <= b_i < n", "a_i != b_i", "There are no repeated edges."]
    },
    statement: `You have a graph of \`n\` nodes. You are given an integer \`n\` and an array \`edges\` where \`edges[i] = [a_i, b_i]\` indicates that there is an edge between \`a_i\` and \`b_i\` in the graph.

Return the number of connected components in the graph.`,
    starter: `import java.util.*;
import java.io.*;
import java.lang.*;

class Solution {
    public int countComponents(int n, int[][] edges) {
        
    }
}`,
    refSolution: `import java.util.*;

class Solution {
    public int countComponents(int n, int[][] edges) {
        int[] parent = new int[n];
        for (int i = 0; i < n; i++) parent[i] = i;
        int count = n;
        for (int[] e : edges) {
            int root1 = find(parent, e[0]);
            int root2 = find(parent, e[1]);
            if (root1 != root2) {
                parent[root1] = root2;
                count--;
            }
        }
        return count;
    }

    private int find(int[] parent, int i) {
        if (parent[i] == i) return i;
        return parent[i] = find(parent, parent[i]);
    }
}`,
    tests: [
      { inputs: { n: 5, edges: [[0, 1], [1, 2], [3, 4]] }, expected: 2 },
      { inputs: { n: 5, edges: [[0, 1], [1, 2], [2, 3], [3, 4]] }, expected: 1 },
      { inputs: { n: 1, edges: [] }, expected: 1 },
      { inputs: { n: 2, edges: [] }, expected: 2 },
      { inputs: { n: 2, edges: [[0, 1]] }, expected: 1 },
      { inputs: { n: 3, edges: [[0, 1], [0, 2]] }, expected: 1 },
      { inputs: { n: 4, edges: [[0, 1], [2, 3]] }, expected: 2 },
      { inputs: { n: 4, edges: [] }, expected: 4 },
      { inputs: { n: 4, edges: [[0, 1], [1, 2], [2, 3], [3, 0]] }, expected: 1 },
      { inputs: { n: 6, edges: [[0, 1], [1, 2], [3, 4]] }, expected: 3 },
      { inputs: { n: 5, edges: [[0, 1], [1, 2], [0, 2], [3, 4]] }, expected: 2 },
      { inputs: { n: 6, edges: [[0, 1], [2, 3], [4, 5]] }, expected: 3 },
      { inputs: { n: 5, edges: [[0, 2], [1, 2], [3, 4]] }, expected: 2 },
      { inputs: { n: 7, edges: [[0, 1], [1, 2], [3, 4], [5, 6]] }, expected: 4 },
      { inputs: { n: 4, edges: [[0, 1], [1, 2], [1, 3]] }, expected: 1 },
      { inputs: { n: 6, edges: [[0, 1], [0, 2], [0, 3], [0, 4], [0, 5]] }, expected: 1 }
    ]
  },
  {
    id: 297,
    meta: {
      id: 297,
      title: "Serialize and Deserialize Binary Tree",
      slug: "serialize-and-deserialize-binary-tree",
      difficulty: "Hard",
      day: 14,
      category: "Trees",
      order: 4,
      timeEstimateMinutes: 35,
      className: "Solution",
      methodName: "serializeDeserialize",
      kind: "function",
      comparator: "exact",
      params: [{ name: "root", type: "TreeNode" }],
      returnType: "TreeNode",
      examples: [
        { input: { root: [1, 2, 3, null, null, 4, 5] }, output: [1, 2, 3, null, null, 4, 5] },
        { input: { root: [] }, output: [] }
      ],
      constraints: ["The number of nodes in the tree is in the range [0, 10^4].", "-1000 <= Node.val <= 1000"]
    },
    statement: `Serialization is the process of converting a data structure or object into a sequence of bits so that it can be stored in a file or memory buffer, or transmitted across a network connection link to be reconstructed later in the same or another computer environment.

Design an algorithm to serialize and deserialize a binary tree. There is no restriction on how your serialization/deserialization algorithm should work. You just need to ensure that a binary tree can be serialized to a string and this string can be deserialized to the original tree structure.`,
    starter: `import java.util.*;
import java.io.*;
import java.lang.*;

class Solution {
    // Encodes a tree to a single string.
    public String serialize(TreeNode root) {
        
    }

    // Decodes your encoded data to tree.
    public TreeNode deserialize(String data) {
        
    }

    public TreeNode serializeDeserialize(TreeNode root) {
        return deserialize(serialize(root));
    }
}`,
    refSolution: `import java.util.*;

class Solution {
    public String serialize(TreeNode root) {
        StringBuilder sb = new StringBuilder();
        buildString(root, sb);
        return sb.toString();
    }

    private void buildString(TreeNode node, StringBuilder sb) {
        if (node == null) {
            sb.append("null,");
        } else {
            sb.append(node.val).append(",");
            buildString(node.left, sb);
            buildString(node.right, sb);
        }
    }

    public TreeNode deserialize(String data) {
        String[] tokens = data.split(",");
        java.util.Queue<String> nodes = new java.util.LinkedList<>(Arrays.asList(tokens));
        return buildTree(nodes);
    }

    private TreeNode buildTree(java.util.Queue<String> nodes) {
        String val = nodes.poll();
        if (val == null || val.equals("null") || val.isEmpty()) return null;
        TreeNode node = new TreeNode(Integer.parseInt(val));
        node.left = buildTree(nodes);
        node.right = buildTree(nodes);
        return node;
    }

    public TreeNode serializeDeserialize(TreeNode root) {
        return deserialize(serialize(root));
    }
}`,
    tests: [
      { inputs: { root: [1, 2, 3, null, null, 4, 5] }, expected: [1, 2, 3, null, null, 4, 5] },
      { inputs: { root: [] }, expected: [] },
      { inputs: { root: [1] }, expected: [1] },
      { inputs: { root: [1, 2] }, expected: [1, 2] },
      { inputs: { root: [1, null, 2] }, expected: [1, null, 2] },
      { inputs: { root: [4, 2, 6, 1, 3, 5, 7] }, expected: [4, 2, 6, 1, 3, 5, 7] },
      { inputs: { root: [1, 2, null, 3, null, 4] }, expected: [1, 2, null, 3, null, 4] },
      { inputs: { root: [1, null, 2, null, 3, null, 4] }, expected: [1, null, 2, null, 3, null, 4] },
      { inputs: { root: [10, -5, 20, null, null, 15, 25] }, expected: [10, -5, 20, null, null, 15, 25] },
      { inputs: { root: [0] }, expected: [0] },
      { inputs: { root: [5, 4, 7, 3, null, 2, null, -1, null, 9] }, expected: [5, 4, 7, 3, null, 2, null, -1, null, 9] },
      { inputs: { root: [1, 2, 3, 4, 5, 6, 7] }, expected: [1, 2, 3, 4, 5, 6, 7] },
      { inputs: { root: [10, 20] }, expected: [10, 20] },
      { inputs: { root: [3, 1, 4, null, 2] }, expected: [3, 1, 4, null, 2] },
      { inputs: { root: [-10, 9, 20, null, null, 15, 7] }, expected: [-10, 9, 20, null, null, 15, 7] },
      { inputs: { root: [100, 50, 150] }, expected: [100, 50, 150] }
    ]
  },
  {
    id: 23,
    meta: {
      id: 23,
      title: "Merge k Sorted Lists",
      slug: "merge-k-sorted-lists",
      difficulty: "Hard",
      day: 14,
      category: "Linked List",
      order: 5,
      timeEstimateMinutes: 35,
      className: "Solution",
      methodName: "mergeKLists",
      kind: "function",
      comparator: "exact",
      params: [{ name: "lists", type: "ListNode[]" }],
      returnType: "ListNode",
      examples: [
        { input: { lists: [[1, 4, 5], [1, 3, 4], [2, 6]] }, output: [1, 1, 2, 3, 4, 4, 5, 6] },
        { input: { lists: [] }, output: [] },
        { input: { lists: [[]] }, output: [] }
      ],
      constraints: ["k == lists.length", "0 <= k <= 10^4", "0 <= lists[i].length <= 500", "-10^4 <= lists[i][j] <= 10^4", "lists[i] is sorted in ascending order.", "The sum of lists[i].length will not exceed 10^4."]
    },
    statement: `You are given an array of \`k\` linked-lists \`lists\`, each linked-list is sorted in ascending order.

Merge all the linked-lists into one sorted linked-list and return it.`,
    starter: `import java.util.*;
import java.io.*;
import java.lang.*;

class Solution {
    public ListNode mergeKLists(ListNode[] lists) {
        
    }
}`,
    refSolution: `import java.util.*;

class Solution {
    public ListNode mergeKLists(ListNode[] lists) {
        if (lists == null || lists.length == 0) return null;
        java.util.PriorityQueue<ListNode> pq = new java.util.PriorityQueue<>(Comparator.comparingInt(a -> a.val));
        for (ListNode node : lists) {
            if (node != null) pq.offer(node);
        }
        ListNode dummy = new ListNode(0);
        ListNode curr = dummy;
        while (!pq.isEmpty()) {
            ListNode node = pq.poll();
            curr.next = node;
            curr = curr.next;
            if (node.next != null) {
                pq.offer(node.next);
            }
        }
        return dummy.next;
    }
}`,
    tests: [
      { inputs: { lists: [[1, 4, 5], [1, 3, 4], [2, 6]] }, expected: [1, 1, 2, 3, 4, 4, 5, 6] },
      { inputs: { lists: [] }, expected: [] },
      { inputs: { lists: [[]] }, expected: [] },
      { inputs: { lists: [[1], [0]] }, expected: [0, 1] },
      { inputs: { lists: [[1, 2, 3]] }, expected: [1, 2, 3] },
      { inputs: { lists: [[2], [], [-1]] }, expected: [-1, 2] },
      { inputs: { lists: [[1, 3], [2, 4], [5, 6]] }, expected: [1, 2, 3, 4, 5, 6] },
      { inputs: { lists: [[-2, 1, 4], [-1, 5, 6], [0, 2, 3]] }, expected: [-2, -1, 0, 1, 2, 3, 4, 5, 6] },
      { inputs: { lists: [[1, 1], [1, 1], [1, 1]] }, expected: [1, 1, 1, 1, 1, 1] },
      { inputs: { lists: [[10, 20, 30], [5, 15, 25]] }, expected: [5, 10, 15, 20, 25, 30] },
      { inputs: { lists: [[], [], []] }, expected: [] },
      { inputs: { lists: [[1, 2], [3, 4], [5, 6], [7, 8]] }, expected: [1, 2, 3, 4, 5, 6, 7, 8] },
      { inputs: { lists: [[100], [50], [75], [25]] }, expected: [25, 50, 75, 100] },
      { inputs: { lists: [[1, 2, 5], [1, 3, 4]] }, expected: [1, 1, 2, 3, 4, 5] },
      { inputs: { lists: [[-10, -5, 0], [-8, 2, 4]] }, expected: [-10, -8, -5, 0, 2, 4] },
      { inputs: { lists: [[7], [6], [5], [4], [3], [2], [1]] }, expected: [1, 2, 3, 4, 5, 6, 7] }
    ]
  },

  // -------------------------------------------------------------
  // Day 15
  // -------------------------------------------------------------
  {
    id: 76,
    meta: {
      id: 76,
      title: "Minimum Window Substring",
      slug: "minimum-window-substring",
      difficulty: "Hard",
      day: 15,
      category: "Sliding Window",
      order: 1,
      timeEstimateMinutes: 35,
      className: "Solution",
      methodName: "minWindow",
      kind: "function",
      comparator: "exact",
      params: [{ name: "s", type: "String" }, { name: "t", type: "String" }],
      returnType: "String",
      examples: [
        { input: { s: "ADOBECODEBANC", t: "ABC" }, output: "BANC" },
        { input: { s: "a", t: "a" }, output: "a" },
        { input: { s: "a", t: "aa" }, output: "" }
      ],
      constraints: ["m == s.length", "n == t.length", "1 <= m, n <= 10^5", "s and t consist of uppercase and lowercase English letters."]
    },
    statement: `Given two strings \`s\` and \`t\` of lengths \`m\` and \`n\` respectively, return the minimum window substring of \`s\` such that every character in \`t\` (including duplicates) is included in the window. If there is no such substring, return the empty string \`""\`.

The testcases will be generated such that the answer is unique.`,
    starter: `import java.util.*;
import java.io.*;
import java.lang.*;

class Solution {
    public String minWindow(String s, String t) {
        
    }
}`,
    refSolution: `import java.util.*;

class Solution {
    public String minWindow(String s, String t) {
        if (s == null || t == null || s.length() < t.length()) return "";
        int[] need = new int[128];
        for (char c : t.toCharArray()) need[c]++;
        int left = 0, right = 0, count = t.length(), minLen = Integer.MAX_VALUE, start = 0;
        while (right < s.length()) {
            char r = s.charAt(right);
            if (need[r] > 0) count--;
            need[r]--;
            right++;
            while (count == 0) {
                if (right - left < minLen) {
                    minLen = right - left;
                    start = left;
                }
                char l = s.charAt(left);
                need[l]++;
                if (need[l] > 0) count++;
                left++;
            }
        }
        return minLen == Integer.MAX_VALUE ? "" : s.substring(start, start + minLen);
    }
}`,
    tests: [
      { inputs: { s: "ADOBECODEBANC", t: "ABC" }, expected: "BANC" },
      { inputs: { s: "a", t: "a" }, expected: "a" },
      { inputs: { s: "a", t: "aa" }, expected: "" },
      { inputs: { s: "aa", t: "aa" }, expected: "aa" },
      { inputs: { s: "ab", t: "b" }, expected: "b" },
      { inputs: { s: "ab", t: "a" }, expected: "a" },
      { inputs: { s: "bdab", t: "ab" }, expected: "ab" },
      { inputs: { s: "bba", t: "ab" }, expected: "ba" },
      { inputs: { s: "cabwefgewcwaefgcf", t: "cae" }, expected: "cwae" },
      { inputs: { s: "a", t: "b" }, expected: "" },
      { inputs: { s: "aaaaaaaaaaaabbbbbcdd", t: "abcdd" }, expected: "abbbbbcdd" },
      { inputs: { s: "ADOBECODEBANC", t: "A" }, expected: "A" },
      { inputs: { s: "ADOBECODEBANC", t: "Z" }, expected: "" },
      { inputs: { s: "XYZABC", t: "ABC" }, expected: "ABC" },
      { inputs: { s: "DONOTPANIC", t: "NOT" }, expected: "NOT" },
      { inputs: { s: "timetopractice", t: "toc" }, expected: "toprac" }
    ]
  },
  {
    id: 124,
    meta: {
      id: 124,
      title: "Binary Tree Maximum Path Sum",
      slug: "binary-tree-maximum-path-sum",
      difficulty: "Hard",
      day: 15,
      category: "Trees",
      order: 2,
      timeEstimateMinutes: 30,
      className: "Solution",
      methodName: "maxPathSum",
      kind: "function",
      comparator: "exact",
      params: [{ name: "root", type: "TreeNode" }],
      returnType: "int",
      examples: [
        { input: { root: [1, 2, 3] }, output: 6 },
        { input: { root: [-10, 9, 20, null, null, 15, 7] }, output: 42 }
      ],
      constraints: ["The number of nodes in the tree is in the range [1, 3 * 10^4].", "-1000 <= Node.val <= 1000"]
    },
    statement: `A path in a binary tree is a sequence of nodes where each pair of adjacent nodes in the sequence has an edge connecting them. A node can only appear in the sequence at most once. Note that the path does not need to pass through the root.

The path sum of a path is the sum of the node's values in the path.

Given the \`root\` of a binary tree, return the maximum path sum of any non-empty path.`,
    starter: `import java.util.*;
import java.io.*;
import java.lang.*;

class Solution {
    public int maxPathSum(TreeNode root) {
        
    }
}`,
    refSolution: `import java.util.*;

class Solution {
    private int maxSum = Integer.MIN_VALUE;

    public int maxPathSum(TreeNode root) {
        maxSum = Integer.MIN_VALUE;
        maxGain(root);
        return maxSum;
    }

    private int maxGain(TreeNode node) {
        if (node == null) return 0;
        int leftGain = Math.max(maxGain(node.left), 0);
        int rightGain = Math.max(maxGain(node.right), 0);
        int priceNewPath = node.val + leftGain + rightGain;
        maxSum = Math.max(maxSum, priceNewPath);
        return node.val + Math.max(leftGain, rightGain);
    }
}`,
    tests: [
      { inputs: { root: [1, 2, 3] }, expected: 6 },
      { inputs: { root: [-10, 9, 20, null, null, 15, 7] }, expected: 42 },
      { inputs: { root: [-3] }, expected: -3 },
      { inputs: { root: [2, -1] }, expected: 2 },
      { inputs: { root: [-2, 1] }, expected: 1 },
      { inputs: { root: [-2, -1] }, expected: -1 },
      { inputs: { root: [1, -2, 3] }, expected: 4 },
      { inputs: { root: [5, 4, 8, 11, null, 13, 4, 7, 2, null, null, null, 1] }, expected: 48 },
      { inputs: { root: [1, 2, null, 3, null, 4, null, 5] }, expected: 15 },
      { inputs: { root: [9, 6, -3, null, null, -6, 2, null, null, 2, null, -6, -6, -6] }, expected: 16 },
      { inputs: { root: [0] }, expected: 0 },
      { inputs: { root: [2, 1, 3] }, expected: 6 },
      { inputs: { root: [-1, -2, -3] }, expected: -1 },
      { inputs: { root: [1, 2, 3, 4, 5] }, expected: 11 },
      { inputs: { root: [10, 2, 10, 20, 1, null, -25, null, null, null, null, 3, 4] }, expected: 42 },
      { inputs: { root: [-10, null, 20, 15, 7] }, expected: 42 }
    ]
  },
  {
    id: 212,
    meta: {
      id: 212,
      title: "Word Search II",
      slug: "word-search-ii",
      difficulty: "Hard",
      day: 15,
      category: "Trie",
      order: 3,
      timeEstimateMinutes: 35,
      className: "Solution",
      methodName: "findWords",
      kind: "function",
      comparator: "unordered",
      params: [{ name: "board", type: "char[][]" }, { name: "words", type: "String[]" }],
      returnType: "List<String>",
      examples: [
        {
          input: {
            board: [
              ["o", "a", "a", "n"],
              ["e", "t", "a", "e"],
              ["i", "h", "k", "r"],
              ["i", "f", "l", "v"]
            ],
            words: ["oath", "pea", "eat", "rain"]
          },
          output: ["eat", "oath"]
        },
        {
          input: {
            board: [
              ["a", "b"],
              ["c", "d"]
            ],
            words: ["abcb"]
          },
          output: []
        }
      ],
      constraints: ["m == board.length", "n == board[i].length", "1 <= m, n <= 12", "board[i][j] is a lowercase English letter.", "1 <= words.length <= 3 * 10^4", "1 <= words[i].length <= 10", "words[i] consists of lowercase English letters.", "All the strings of words are unique."]
    },
    statement: `Given an \`m x n\` \`board\` of characters and a list of strings \`words\`, return all words on the board.

Each word must be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once in a word.`,
    starter: `import java.util.*;
import java.io.*;
import java.lang.*;

class Solution {
    public List<String> findWords(char[][] board, String[] words) {
        
    }
}`,
    refSolution: `import java.util.*;

class Solution {
    private static class TrieNode {
        TrieNode[] children = new TrieNode[26];
        String word;
    }

    public List<String> findWords(char[][] board, String[] words) {
        List<String> res = new ArrayList<>();
        TrieNode root = new TrieNode();
        for (String w : words) {
            TrieNode p = root;
            for (char c : w.toCharArray()) {
                int i = c - 'a';
                if (p.children[i] == null) p.children[i] = new TrieNode();
                p = p.children[i];
            }
            p.word = w;
        }

        for (int i = 0; i < board.length; i++) {
            for (int j = 0; j < board[0].length; j++) {
                search(board, i, j, root, res);
            }
        }
        return res;
    }

    private void search(char[][] board, int i, int j, TrieNode p, List<String> res) {
        if (i < 0 || i >= board.length || j < 0 || j >= board[0].length) return;
        char c = board[i][j];
        if (c == '#' || p.children[c - 'a'] == null) return;
        p = p.children[c - 'a'];
        if (p.word != null) {
            res.add(p.word);
            p.word = null;
        }
        board[i][j] = '#';
        search(board, i + 1, j, p, res);
        search(board, i - 1, j, p, res);
        search(board, i, j + 1, p, res);
        search(board, i, j - 1, p, res);
        board[i][j] = c;
    }
}`,
    tests: [
      {
        inputs: {
          board: [
            ["o", "a", "a", "n"],
            ["e", "t", "a", "e"],
            ["i", "h", "k", "r"],
            ["i", "f", "l", "v"]
          ],
          words: ["oath", "pea", "eat", "rain"]
        },
        expected: ["eat", "oath"]
      },
      {
        inputs: {
          board: [
            ["a", "b"],
            ["c", "d"]
          ],
          words: ["abcb"]
        },
        expected: []
      },
      {
        inputs: {
          board: [["a"]],
          words: ["a"]
        },
        expected: ["a"]
      },
      {
        inputs: {
          board: [["a"]],
          words: ["b"]
        },
        expected: []
      },
      {
        inputs: {
          board: [
            ["a", "b"],
            ["c", "d"]
          ],
          words: ["ab", "ac", "bd", "cd", "dcba"]
        },
        expected: ["ab", "ac", "bd", "cd"]
      },
      {
        inputs: {
          board: [
            ["a", "b", "c"],
            ["a", "e", "d"],
            ["a", "f", "g"]
          ],
          words: ["abcdefg", "gfedcbaaa", "eaabcdgfa", "befa", "d"]
        },
        expected: ["abcdefg", "befa", "d", "gfedcbaaa"]
      },
      {
        inputs: {
          board: [
            ["a", "a"]
          ],
          words: ["aaa"]
        },
        expected: []
      },
      {
        inputs: {
          board: [
            ["h", "e", "l", "l", "o"],
            ["w", "o", "r", "l", "d"]
          ],
          words: ["hello", "world", "low", "hold"]
        },
        expected: ["hello", "world", "hold", "low"]
      },
      {
        inputs: {
          board: [
            ["a", "b", "c", "e"],
            ["s", "f", "c", "s"],
            ["a", "d", "e", "e"]
          ],
          words: ["abcced", "see", "abcb"]
        },
        expected: ["abcced", "see"]
      },
      {
        inputs: {
          board: [["z"]],
          words: ["z", "zz"]
        },
        expected: ["z"]
      },
      {
        inputs: {
          board: [
            ["s", "e", "e", "n"],
            ["t", "m", "e", "t"]
          ],
          words: ["seen", "meet", "set"]
        },
        expected: ["meet", "seen", "set"]
      },
      {
        inputs: {
          board: [
            ["a", "p", "p", "l", "e"]
          ],
          words: ["apple", "app", "ple"]
        },
        expected: ["app", "apple", "ple"]
      },
      {
        inputs: {
          board: [
            ["c", "a", "t"],
            ["d", "o", "g"]
          ],
          words: ["cat", "dog", "cog", "tag"]
        },
        expected: ["cat", "dog", "tag"]
      },
      {
        inputs: {
          board: [
            ["x", "y"],
            ["z", "w"]
          ],
          words: ["xywz", "xw", "yw"]
        },
        expected: ["xywz", "yw"]
      },
      {
        inputs: {
          board: [
            ["m", "a"],
            ["p", "s"]
          ],
          words: ["map", "maps", "sap", "spam"]
        },
        expected: ["map", "maps", "sap", "spam"]
      },
      {
        inputs: {
          board: [
            ["f", "i", "n", "d"]
          ],
          words: ["find", "in"]
        },
        expected: ["find", "in"]
      }
    ]
  },
  {
    id: 295,
    meta: {
      id: 295,
      title: "Find Median from Data Stream",
      slug: "find-median-from-data-stream",
      difficulty: "Hard",
      day: 15,
      category: "Heap",
      order: 4,
      timeEstimateMinutes: 35,
      className: "MedianFinder",
      kind: "class",
      comparator: "exact",
      examples: [
        {
          input: {
            operations: ["MedianFinder", "addNum", "addNum", "findMedian", "addNum", "findMedian"],
            args: [[], [1], [2], [], [3], []]
          },
          output: [null, null, null, 1.5, null, 2.0]
        }
      ],
      constraints: ["-10^5 <= num <= 10^5", "There will be at least one element in the data structure before calling findMedian.", "At most 5 * 10^4 calls will be made to addNum and findMedian."]
    },
    statement: `The median is the middle value in an ordered integer list. If the size of the list is even, there is no middle value, and the median is the mean of the two middle values.

- For example, for \`arr = [2,3,4]\`, the median is \`3\`.
- For example, for \`arr = [2,3]\`, the median is \`(2 + 3) / 2 = 2.5\`.

Implement the \`MedianFinder\` class:
- \`MedianFinder()\` initializes the \`MedianFinder\` object.
- \`void addNum(int num)\` adds the integer \`num\` from the data stream to the data structure.
- \`double findMedian()\` returns the median of all elements so far. Answers within \`10^-5\` of the actual answer will be accepted.`,
    starter: `import java.util.*;
import java.io.*;
import java.lang.*;

class MedianFinder {

    public MedianFinder() {
        
    }
    
    public void addNum(int num) {
        
    }
    
    public double findMedian() {
        
    }
}`,
    refSolution: `import java.util.*;

class MedianFinder {
    private java.util.PriorityQueue<Integer> small = new java.util.PriorityQueue<>(Collections.reverseOrder());
    private java.util.PriorityQueue<Integer> large = new java.util.PriorityQueue<>();

    public MedianFinder() {}

    public void addNum(int num) {
        small.offer(num);
        large.offer(small.poll());
        if (small.size() < large.size()) {
            small.offer(large.poll());
        }
    }

    public double findMedian() {
        if (small.size() > large.size()) {
            return small.peek();
        } else {
            return (small.peek() + large.peek()) / 2.0;
        }
    }
}`,
    tests: [
      {
        inputs: {
          operations: ["MedianFinder", "addNum", "addNum", "findMedian", "addNum", "findMedian"],
          args: [[], [1], [2], [], [3], []]
        },
        expected: [null, null, null, 1.5, null, 2.0]
      },
      {
        inputs: {
          operations: ["MedianFinder", "addNum", "findMedian"],
          args: [[], [5], []]
        },
        expected: [null, null, 5.0]
      },
      {
        inputs: {
          operations: ["MedianFinder", "addNum", "addNum", "findMedian"],
          args: [[], [-1], [-2], []]
        },
        expected: [null, null, null, -1.5]
      },
      {
        inputs: {
          operations: ["MedianFinder", "addNum", "addNum", "addNum", "findMedian"],
          args: [[], [6], [10], [2], []]
        },
        expected: [null, null, null, null, 6.0]
      },
      {
        inputs: {
          operations: ["MedianFinder", "addNum", "findMedian", "addNum", "findMedian"],
          args: [[], [2], [], [3], []]
        },
        expected: [null, null, 2.0, null, 2.5]
      },
      {
        inputs: {
          operations: ["MedianFinder", "addNum", "addNum", "addNum", "addNum", "findMedian"],
          args: [[], [1], [2], [3], [4], []]
        },
        expected: [null, null, null, null, null, 2.5]
      },
      {
        inputs: {
          operations: ["MedianFinder", "addNum", "addNum", "addNum", "addNum", "addNum", "findMedian"],
          args: [[], [5], [2], [8], [1], [9], []]
        },
        expected: [null, null, null, null, null, null, 5.0]
      },
      {
        inputs: {
          operations: ["MedianFinder", "addNum", "findMedian", "addNum", "findMedian", "addNum", "findMedian"],
          args: [[], [10], [], [20], [], [30], []]
        },
        expected: [null, null, 10.0, null, 15.0, null, 20.0]
      },
      {
        inputs: {
          operations: ["MedianFinder", "addNum", "addNum", "findMedian"],
          args: [[], [0], [0], []]
        },
        expected: [null, null, null, 0.0]
      },
      {
        inputs: {
          operations: ["MedianFinder", "addNum", "addNum", "addNum", "findMedian"],
          args: [[], [-5], [10], [0], []]
        },
        expected: [null, null, null, null, 0.0]
      },
      {
        inputs: {
          operations: ["MedianFinder", "addNum", "addNum", "addNum", "addNum", "findMedian"],
          args: [[], [-1], [-2], [-3], [-4], []]
        },
        expected: [null, null, null, null, null, -2.5]
      },
      {
        inputs: {
          operations: ["MedianFinder", "addNum", "findMedian"],
          args: [[], [100], []]
        },
        expected: [null, null, 100.0]
      },
      {
        inputs: {
          operations: ["MedianFinder", "addNum", "addNum", "findMedian"],
          args: [[], [100], [200], []]
        },
        expected: [null, null, null, 150.0]
      },
      {
        inputs: {
          operations: ["MedianFinder", "addNum", "addNum", "addNum", "findMedian"],
          args: [[], [100], [200], [300], []]
        },
        expected: [null, null, null, null, 200.0]
      },
      {
        inputs: {
          operations: ["MedianFinder", "addNum", "addNum", "findMedian"],
          args: [[], [7], [7], []]
        },
        expected: [null, null, null, 7.0]
      },
      {
        inputs: {
          operations: ["MedianFinder", "addNum", "addNum", "addNum", "findMedian"],
          args: [[], [1], [3], [2], []]
        },
        expected: [null, null, null, null, 2.0]
      }
    ]
  },
  {
    id: 269,
    meta: {
      id: 269,
      title: "Alien Dictionary",
      slug: "alien-dictionary",
      difficulty: "Hard",
      day: 15,
      category: "Graphs",
      order: 5,
      timeEstimateMinutes: 35,
      className: "Solution",
      methodName: "alienOrder",
      kind: "function",
      comparator: "exact",
      params: [{ name: "words", type: "String[]" }],
      returnType: "String",
      examples: [
        { input: { words: ["wrt", "wrf", "er", "ett", "rftt"] }, output: "wertf" },
        { input: { words: ["z", "x"] }, output: "zx" },
        { input: { words: ["z", "x", "z"] }, output: "" }
      ],
      constraints: ["1 <= words.length <= 100", "1 <= words[i].length <= 100", "words[i] consists of only lowercase English letters."]
    },
    statement: `There is a new alien language that uses the English alphabet. However, the order among the letters is unknown to you.

You are given a list of strings \`words\` from the alien language's dictionary, where the strings are claimed to be sorted lexicographically by the rules of this new language.

Return a string of the unique letters in the new alien language sorted in lexicographically increasing order by the new language's rules. If there is no solution, return \`""\`. If there are multiple solutions, return any of them.`,
    starter: `import java.util.*;
import java.io.*;
import java.lang.*;

class Solution {
    public String alienOrder(String[] words) {
        
    }
}`,
    refSolution: `import java.util.*;

class Solution {
    public String alienOrder(String[] words) {
        Map<Character, Set<Character>> adj = new HashMap<>();
        Map<Character, Integer> inDegree = new HashMap<>();
        for (String w : words) {
            for (char c : w.toCharArray()) {
                inDegree.put(c, 0);
                adj.putIfAbsent(c, new HashSet<>());
            }
        }
        for (int i = 0; i < words.length - 1; i++) {
            String w1 = words[i], w2 = words[i + 1];
            if (w1.length() > w2.length() && w1.startsWith(w2)) return "";
            for (int j = 0; j < Math.min(w1.length(), w2.length()); j++) {
                char c1 = w1.charAt(j), c2 = w2.charAt(j);
                if (c1 != c2) {
                    if (!adj.get(c1).contains(c2)) {
                        adj.get(c1).add(c2);
                        inDegree.put(c2, inDegree.get(c2) + 1);
                    }
                    break;
                }
            }
        }
        java.util.Queue<Character> q = new java.util.LinkedList<>();
        for (char c : inDegree.keySet()) {
            if (inDegree.get(c) == 0) q.offer(c);
        }
        StringBuilder sb = new StringBuilder();
        while (!q.isEmpty()) {
            char curr = q.poll();
            sb.append(curr);
            for (char next : adj.get(curr)) {
                inDegree.put(next, inDegree.get(next) - 1);
                if (inDegree.get(next) == 0) q.offer(next);
            }
        }
        return sb.length() == inDegree.size() ? sb.toString() : "";
    }
}`,
    tests: [
      { inputs: { words: ["wrt", "wrf", "er", "ett", "rftt"] }, expected: "wertf" },
      { inputs: { words: ["z", "x"] }, expected: "zx" },
      { inputs: { words: ["z", "x", "z"] }, expected: "" },
      { inputs: { words: ["abc", "ab"] }, expected: "" },
      { inputs: { words: ["a", "b", "c"] }, expected: "abc" },
      { inputs: { words: ["z"] }, expected: "z" },
      { inputs: { words: ["zy", "zx"] }, expected: "yxz" },
      { inputs: { words: ["ab", "adc"] }, expected: "abcd" },
      { inputs: { words: ["apple", "app"] }, expected: "" },
      { inputs: { words: ["w", "wo", "wor", "word"] }, expected: "drow" },
      { inputs: { words: ["x", "y", "x"] }, expected: "" },
      { inputs: { words: ["ri", "xz", "qsq", "qrt", "dhe", "dhm", "dgb", "dgt", "ith", "ith", "its", "its"] }, expected: "riqxdhgtemsb" },
      { inputs: { words: ["a", "ba", "bc", "c"] }, expected: "abc" },
      { inputs: { words: ["qb", "qba", "qbax"] }, expected: "abqx" },
      { inputs: { words: ["za", "zb", "ca", "cb"] }, expected: "abzc" },
      { inputs: { words: ["ac", "ab", "zc", "zb"] }, expected: "cbaz" }
    ]
  }
];

console.log(`Writing ${problems.length} problems for Days 11-15...`);
for (const p of problems) {
  writeProblem(p.meta, p.statement, p.starter, p.refSolution, p.tests);
  console.log(`  Done #${p.id} (${p.meta.title})`);
}
console.log('All Days 11-15 problems written successfully!');
