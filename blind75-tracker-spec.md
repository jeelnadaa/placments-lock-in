# Blind 75 Tracker — Project Spec + Study Plan

> Hand this entire file to your coding agent. It contains (1) the 15-day study plan with progressive hints, (2) the full product spec for the tracker web app, and (3) a JSON seed to load into the app.
>
> ⚠️ **Spoiler warning for the human:** this file reveals every problem's topic and its hints. The app built from it must hide both behind dropdowns (see section 4.3.1). If you want to stay spoiler-free, don't read the plan tables or hints below; just give the file to your agent.

---

## 1. Study Plan Overview

- **75 problems / 5 per day = 15 days.**
- Topic categories follow **NeetCode's Blind 75 categories** (Arrays & Hashing, Two Pointers, Sliding Window, Stack, Binary Search, Linked List, Trees, Tries, Heap / Priority Queue, Backtracking, Graphs, Advanced Graphs, 1-D DP, 2-D DP, Greedy, Intervals, Math & Geometry, Bit Manipulation).
- **Every day contains 5 problems from 5 different topics**, so you never grind one pattern for a whole session.
- Difficulty ramps up: Days 1–3 are mostly Easy warm-ups, Days 4–12 are Medium-heavy, Days 14–15 carry all the Hards (Day 15 is the "boss day").
- Prerequisite order is respected (e.g. Trie basics before Word Search II, Graphs before Alien Dictionary, 1-D DP before 2-D DP).
- 🔒 = LeetCode Premium. NeetCode offers these free; use the NeetCode link instead. (NeetCode links for the 5 premium problems other than Encode/Decode were not verified live — if one 404s, search the title on neetcode.io.)

## 2. Day-by-Day Plan


### Day 1

| # | LC ID | Problem | NeetCode Topic | Difficulty | LeetCode | NeetCode |
|---|-------|---------|----------------|------------|----------|----------|
| 1 | 1 | Two Sum | Arrays & Hashing | Easy | [LeetCode](https://leetcode.com/problems/two-sum/) | [NeetCode](https://neetcode.io/problems/two-integer-sum) |
| 2 | 125 | Valid Palindrome | Two Pointers | Easy | [LeetCode](https://leetcode.com/problems/valid-palindrome/) | [NeetCode](https://neetcode.io/problems/is-palindrome) |
| 3 | 20 | Valid Parentheses | Stack | Easy | [LeetCode](https://leetcode.com/problems/valid-parentheses/) | [NeetCode](https://neetcode.io/problems/validate-parentheses) |
| 4 | 121 | Best Time to Buy and Sell Stock | Sliding Window | Easy | [LeetCode](https://leetcode.com/problems/best-time-to-buy-and-sell-stock/) | [NeetCode](https://neetcode.io/problems/buy-and-sell-crypto) |
| 5 | 191 | Number of 1 Bits | Bit Manipulation | Easy | [LeetCode](https://leetcode.com/problems/number-of-1-bits/) | — |

**Hints (progressive: Hint 1 is a gentle nudge, Hint 3 nearly gives the approach):**

- **Two Sum**
  - Hint 1: Checking every pair works, but what does that cost? Think about what you're really searching for at each element.
  - Hint 2: For the current number, exactly which other value would complete the target? Can you look that up instantly?
  - Hint 3: Scan once while remembering values already seen with their indices (hash map). Check for the complement before inserting. Target: O(n) time, O(n) space.
- **Valid Palindrome**
  - Hint 1: Ignore non-alphanumeric characters and case. What is the cheapest way to compare mirror positions?
  - Hint 2: You only need to look at the two ends and move inward.
  - Hint 3: Two indices, left and right; skip characters that aren't letters or digits; compare lowercase; stop when they cross.
- **Valid Parentheses**
  - Hint 1: The most recently opened bracket must be the first one closed.
  - Hint 2: Which data structure gives you last-in, first-out?
  - Hint 3: Push openers; on a closer, the stack must be non-empty and its top must match. At the end the stack must be empty.
- **Best Time to Buy and Sell Stock**
  - Hint 1: You must buy before you sell, so order matters.
  - Hint 2: At each day, what single piece of past information would let you compute the best profit if you sold today?
  - Hint 3: Track the minimum price so far; profit today = price - minSoFar; keep the max profit. One pass, O(1) space.
- **Number of 1 Bits**
  - Hint 1: Look at the lowest bit of the number.
  - Hint 2: Is there a trick that removes only the lowest set bit?
  - Hint 3: Loop n &= (n - 1) and count iterations until n is 0.

### Day 2

| # | LC ID | Problem | NeetCode Topic | Difficulty | LeetCode | NeetCode |
|---|-------|---------|----------------|------------|----------|----------|
| 1 | 217 | Contains Duplicate | Arrays & Hashing | Easy | [LeetCode](https://leetcode.com/problems/contains-duplicate/) | [NeetCode](https://neetcode.io/problems/duplicate-integer) |
| 2 | 206 | Reverse Linked List | Linked List | Easy | [LeetCode](https://leetcode.com/problems/reverse-linked-list/) | [NeetCode](https://neetcode.io/problems/reverse-a-linked-list) |
| 3 | 226 | Invert Binary Tree | Trees | Easy | [LeetCode](https://leetcode.com/problems/invert-binary-tree/) | [NeetCode](https://neetcode.io/problems/invert-a-binary-tree) |
| 4 | 70 | Climbing Stairs | 1-D Dynamic Programming | Easy | [LeetCode](https://leetcode.com/problems/climbing-stairs/) | — |
| 5 | 53 | Maximum Subarray | Greedy | Medium | [LeetCode](https://leetcode.com/problems/maximum-subarray/) | — |

**Hints (progressive: Hint 1 is a gentle nudge, Hint 3 nearly gives the approach):**

- **Contains Duplicate**
  - Hint 1: Comparing every pair is the obvious approach. Is there a cheaper way to ask 'have I met this value before?'
  - Hint 2: You want a structure with constant-time membership checks.
  - Hint 3: One pass with a hash set: if the value is already in the set, return true. (Alternative: sort and compare neighbours.)
- **Reverse Linked List**
  - Hint 1: Every node's next pointer must end up pointing backwards.
  - Hint 2: If you overwrite next, you lose the rest of the list. What must you save first?
  - Hint 3: Iterate with prev (null), curr, and a temp for curr.next: save next, point curr.next to prev, advance both. Recursion also works.
- **Invert Binary Tree**
  - Hint 1: Every node's two children swap places.
  - Hint 2: The same operation applies to each subtree.
  - Hint 3: Recursively swap left and right at every node (base case: null). BFS/DFS iterative also works.
- **Climbing Stairs**
  - Hint 1: To reach step n, which earlier steps could you have come from?
  - Hint 2: Does the count of ways remind you of a famous sequence?
  - Hint 3: ways(n) = ways(n-1) + ways(n-2); keep just two variables for O(1) space.
- **Maximum Subarray**
  - Hint 1: When is the running sum of a subarray hurting you?
  - Hint 2: If the running sum goes negative, should you continue it?
  - Hint 3: Kadane's: cur = max(x, cur + x); best = max(best, cur). O(n), O(1).

### Day 3

| # | LC ID | Problem | NeetCode Topic | Difficulty | LeetCode | NeetCode |
|---|-------|---------|----------------|------------|----------|----------|
| 1 | 242 | Valid Anagram | Arrays & Hashing | Easy | [LeetCode](https://leetcode.com/problems/valid-anagram/) | [NeetCode](https://neetcode.io/problems/is-anagram) |
| 2 | 21 | Merge Two Sorted Lists | Linked List | Easy | [LeetCode](https://leetcode.com/problems/merge-two-sorted-lists/) | [NeetCode](https://neetcode.io/problems/merge-two-sorted-linked-lists) |
| 3 | 104 | Maximum Depth of Binary Tree | Trees | Easy | [LeetCode](https://leetcode.com/problems/maximum-depth-of-binary-tree/) | [NeetCode](https://neetcode.io/problems/depth-of-binary-tree) |
| 4 | 338 | Counting Bits | Bit Manipulation | Easy | [LeetCode](https://leetcode.com/problems/counting-bits/) | — |
| 5 | 153 | Find Minimum in Rotated Sorted Array | Binary Search | Medium | [LeetCode](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/) | [NeetCode](https://neetcode.io/problems/find-minimum-in-rotated-sorted-array) |

**Hints (progressive: Hint 1 is a gentle nudge, Hint 3 nearly gives the approach):**

- **Valid Anagram**
  - Hint 1: Two strings are anagrams when they contain the same characters with the same frequencies.
  - Hint 2: You don't need to sort; you just need to compare counts.
  - Hint 3: Quick length check, then a 26-slot count array (or map): +1 for chars in s, -1 for chars in t, all zeros means anagram. O(n) time.
- **Merge Two Sorted Lists**
  - Hint 1: Compare the two current heads and take the smaller one.
  - Hint 2: A dummy starting node saves you from special-casing the first node.
  - Hint 3: Keep a tail pointer; attach the smaller head and advance; when one list ends, attach the rest of the other.
- **Maximum Depth of Binary Tree**
  - Hint 1: The depth of a tree is built from the depth of its parts.
  - Hint 2: What is the depth of an empty tree?
  - Hint 3: 1 + max(depth(left), depth(right)), with null returning 0. BFS level counting is the iterative alternative.
- **Counting Bits**
  - Hint 1: Computing bits per number from scratch repeats work.
  - Hint 2: Relate the count for i to the count of a smaller number.
  - Hint 3: bits[i] = bits[i >> 1] + (i & 1). O(n).
- **Find Minimum in Rotated Sorted Array**
  - Hint 1: The array was sorted, then rotated. Where does the order 'break'?
  - Hint 2: Compare the middle element with the right end to decide which half contains the smallest value.
  - Hint 3: Binary search: if nums[mid] > nums[right], the minimum is in (mid, right]; otherwise it's in [left, mid]. O(log n).

### Day 4

| # | LC ID | Problem | NeetCode Topic | Difficulty | LeetCode | NeetCode |
|---|-------|---------|----------------|------------|----------|----------|
| 1 | 49 | Group Anagrams | Arrays & Hashing | Medium | [LeetCode](https://leetcode.com/problems/group-anagrams/) | [NeetCode](https://neetcode.io/problems/anagram-groups) |
| 2 | 15 | 3Sum | Two Pointers | Medium | [LeetCode](https://leetcode.com/problems/3sum/) | [NeetCode](https://neetcode.io/problems/three-integer-sum) |
| 3 | 141 | Linked List Cycle | Linked List | Easy | [LeetCode](https://leetcode.com/problems/linked-list-cycle/) | [NeetCode](https://neetcode.io/problems/linked-list-cycle-detection) |
| 4 | 100 | Same Tree | Trees | Easy | [LeetCode](https://leetcode.com/problems/same-tree/) | [NeetCode](https://neetcode.io/problems/same-binary-tree) |
| 5 | 198 | House Robber | 1-D Dynamic Programming | Medium | [LeetCode](https://leetcode.com/problems/house-robber/) | — |

**Hints (progressive: Hint 1 is a gentle nudge, Hint 3 nearly gives the approach):**

- **Group Anagrams**
  - Hint 1: Anagrams look different but share something identical once you transform them.
  - Hint 2: What 'signature' is the same for every anagram of a word? Use that as a grouping key.
  - Hint 3: Hash map from signature (sorted string, or a 26-count key) to a list of words. Return the map's values.
- **3Sum**
  - Hint 1: Trying all triples is O(n^3). What if you fix one number first? What's left to find?
  - Hint 2: After fixing one number, the rest is a pair-sum problem, which gets easy when the array is sorted.
  - Hint 3: Sort, loop i, then use left/right pointers on the rest. Skip duplicate values for i, left and right so triplets aren't repeated. O(n^2).
- **Linked List Cycle**
  - Hint 1: A set of visited nodes works but uses extra memory. Is there an O(1)-space way?
  - Hint 2: Imagine two runners on a loop moving at different speeds.
  - Hint 3: Slow moves 1 step, fast moves 2. If they ever meet there's a cycle; if fast reaches null there isn't.
- **Same Tree**
  - Hint 1: Two trees match when the roots match and both subtrees match.
  - Hint 2: Be careful about null cases: both null, one null.
  - Hint 3: Recursive: both null -> true; one null or values differ -> false; else same(left,left) && same(right,right).
- **House Robber**
  - Hint 1: At each house you choose: take it or skip it.
  - Hint 2: If you take house i, what must be true about house i-1?
  - Hint 3: dp[i] = max(dp[i-1], dp[i-2] + nums[i]); two rolling variables are enough.

### Day 5

| # | LC ID | Problem | NeetCode Topic | Difficulty | LeetCode | NeetCode |
|---|-------|---------|----------------|------------|----------|----------|
| 1 | 347 | Top K Frequent Elements | Arrays & Hashing | Medium | [LeetCode](https://leetcode.com/problems/top-k-frequent-elements/) | [NeetCode](https://neetcode.io/problems/top-k-elements-in-list) |
| 2 | 3 | Longest Substring Without Repeating Characters | Sliding Window | Medium | [LeetCode](https://leetcode.com/problems/longest-substring-without-repeating-characters/) | [NeetCode](https://neetcode.io/problems/longest-substring-without-duplicates) |
| 3 | 33 | Search in Rotated Sorted Array | Binary Search | Medium | [LeetCode](https://leetcode.com/problems/search-in-rotated-sorted-array/) | [NeetCode](https://neetcode.io/problems/find-target-in-rotated-sorted-array) |
| 4 | 56 | Merge Intervals | Intervals | Medium | [LeetCode](https://leetcode.com/problems/merge-intervals/) | — |
| 5 | 268 | Missing Number | Bit Manipulation | Easy | [LeetCode](https://leetcode.com/problems/missing-number/) | — |

**Hints (progressive: Hint 1 is a gentle nudge, Hint 3 nearly gives the approach):**

- **Top K Frequent Elements**
  - Hint 1: You need to know how often each value appears before you can rank anything.
  - Hint 2: Sorting by frequency works in O(n log n). Can you avoid a full sort, since frequency is bounded by n?
  - Hint 3: Count with a map, then either bucket values by frequency (index = count) and read from the highest bucket down, or keep a size-k min-heap.
- **Longest Substring Without Repeating Characters**
  - Hint 1: Checking every substring is too slow. Think about a range that grows and shrinks as you scan.
  - Hint 2: Maintain a range that never contains a repeated character. What do you do the moment a repeat appears?
  - Hint 3: Two pointers with a set (or map of last-seen index). On a duplicate, advance the left pointer past the earlier occurrence. Track max length. O(n).
- **Search in Rotated Sorted Array**
  - Hint 1: Even after rotation, at least one half around the middle is properly sorted.
  - Hint 2: Find which half is sorted, then check if the target falls inside that half's range.
  - Hint 3: Binary search: if left half sorted and target in it, go left, else go right (and mirror for the other case). O(log n).
- **Merge Intervals**
  - Hint 1: Order matters. What would help if the intervals were arranged first?
  - Hint 2: Only the most recent merged interval can overlap with the next one.
  - Hint 3: Sort by start; if current.start <= last.end then last.end = max(last.end, current.end); otherwise append.
- **Missing Number**
  - Hint 1: The numbers 0..n are present except one.
  - Hint 2: Something about the full range is known without looking at the array.
  - Hint 3: Use the sum formula n(n+1)/2 minus the array sum, or XOR all indices and values. O(n) time, O(1) space.

### Day 6

| # | LC ID | Problem | NeetCode Topic | Difficulty | LeetCode | NeetCode |
|---|-------|---------|----------------|------------|----------|----------|
| 1 | 238 | Product of Array Except Self | Arrays & Hashing | Medium | [LeetCode](https://leetcode.com/problems/product-of-array-except-self/) | [NeetCode](https://neetcode.io/problems/products-of-array-discluding-self) |
| 2 | 11 | Container With Most Water | Two Pointers | Medium | [LeetCode](https://leetcode.com/problems/container-with-most-water/) | [NeetCode](https://neetcode.io/problems/max-water-container) |
| 3 | 19 | Remove Nth Node From End of List | Linked List | Medium | [LeetCode](https://leetcode.com/problems/remove-nth-node-from-end-of-list/) | [NeetCode](https://neetcode.io/problems/remove-node-from-end-of-linked-list) |
| 4 | 572 | Subtree of Another Tree | Trees | Easy | [LeetCode](https://leetcode.com/problems/subtree-of-another-tree/) | [NeetCode](https://neetcode.io/problems/subtree-of-a-binary-tree) |
| 5 | 55 | Jump Game | Greedy | Medium | [LeetCode](https://leetcode.com/problems/jump-game/) | — |

**Hints (progressive: Hint 1 is a gentle nudge, Hint 3 nearly gives the approach):**

- **Product of Array Except Self**
  - Hint 1: Division isn't allowed, so think about what the answer at index i is actually made of.
  - Hint 2: The answer at i is (product of everything to the left) x (product of everything to the right).
  - Hint 3: First pass fills result[i] with the prefix product; second pass goes right to left with a running suffix product multiplied in. O(n) time, O(1) extra space.
- **Container With Most Water**
  - Hint 1: Area = width x the shorter of the two lines. What limits a wide container?
  - Hint 2: Start with the widest container. Which side would you have to change to possibly get a bigger area?
  - Hint 3: Pointers at both ends; compute area; move the pointer at the shorter line inward (moving the taller one can't help). Track the max. O(n).
- **Remove Nth Node From End of List**
  - Hint 1: Removing the nth from the end seems to need the length. Can you avoid a two-pass solution?
  - Hint 2: Use two pointers separated by a fixed gap.
  - Hint 3: Dummy node before head. Move fast n steps ahead, then move both until fast reaches the end; slow.next is the node to remove.
- **Subtree of Another Tree**
  - Hint 1: You may already own a helper that tells you whether two trees are identical.
  - Hint 2: Where could the smaller tree's root appear in the bigger tree?
  - Hint 3: At every node of root, test sameTree(node, subRoot); otherwise recurse into the left and right children.
- **Jump Game**
  - Hint 1: You only need to know if the end is reachable, not the path.
  - Hint 2: Track how far you can reach so far.
  - Hint 3: Loop i: if i > farthest return false; farthest = max(farthest, i + nums[i]). Return true at the end (or work backwards moving a 'goal').

### Day 7

| # | LC ID | Problem | NeetCode Topic | Difficulty | LeetCode | NeetCode |
|---|-------|---------|----------------|------------|----------|----------|
| 1 | 271 | Encode and Decode Strings | Arrays & Hashing | Medium | [LeetCode](https://leetcode.com/problems/encode-and-decode-strings/) 🔒 | [NeetCode](https://neetcode.io/problems/string-encode-and-decode) |
| 2 | 424 | Longest Repeating Character Replacement | Sliding Window | Medium | [LeetCode](https://leetcode.com/problems/longest-repeating-character-replacement/) | [NeetCode](https://neetcode.io/problems/longest-repeating-substring-with-replacement) |
| 3 | 102 | Binary Tree Level Order Traversal | Trees | Medium | [LeetCode](https://leetcode.com/problems/binary-tree-level-order-traversal/) | [NeetCode](https://neetcode.io/problems/level-order-traversal-of-binary-tree) |
| 4 | 322 | Coin Change | 1-D Dynamic Programming | Medium | [LeetCode](https://leetcode.com/problems/coin-change/) | — |
| 5 | 57 | Insert Interval | Intervals | Medium | [LeetCode](https://leetcode.com/problems/insert-interval/) | — |

**Hints (progressive: Hint 1 is a gentle nudge, Hint 3 nearly gives the approach):**

- **Encode and Decode Strings**
  - Hint 1: A simple delimiter fails if strings can contain any character, including your delimiter.
  - Hint 2: Encode extra information with each string so the decoder knows exactly where it ends.
  - Hint 3: Write length + a separator + the string for each one. To decode, read the number up to the separator, then take exactly that many characters and repeat.
- **Longest Repeating Character Replacement**
  - Hint 1: A range is valid if (its length minus the count of its most frequent character) is at most k.
  - Hint 2: Grow the range from the right; only shrink when it becomes invalid.
  - Hint 3: Use a 26-slot count array and track the max frequency seen in the window. The window can stay at its best size and slide. O(n).
- **Binary Tree Level Order Traversal**
  - Hint 1: You need nodes grouped by depth.
  - Hint 2: Which traversal naturally processes a tree level by level?
  - Hint 3: BFS with a queue; at each round process exactly queue.size() nodes to form one level.
- **Coin Change**
  - Hint 1: Taking the largest coin first can fail. Why?
  - Hint 2: The best answer for an amount depends on best answers for smaller amounts.
  - Hint 3: dp[0]=0; dp[a] = min over coins c of dp[a-c] + 1; initialise others to amount+1; if dp[amount] > amount return -1.
- **Insert Interval**
  - Hint 1: The existing intervals are sorted and don't overlap.
  - Hint 2: Split the work into three phases by how intervals relate to the new one.
  - Hint 3: Add all intervals ending before the new start; merge overlaps by taking min start / max end; then add the rest.

### Day 8

| # | LC ID | Problem | NeetCode Topic | Difficulty | LeetCode | NeetCode |
|---|-------|---------|----------------|------------|----------|----------|
| 1 | 143 | Reorder List | Linked List | Medium | [LeetCode](https://leetcode.com/problems/reorder-list/) | [NeetCode](https://neetcode.io/problems/reorder-linked-list) |
| 2 | 235 | Lowest Common Ancestor of a Binary Search Tree | Trees | Medium | [LeetCode](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/) | [NeetCode](https://neetcode.io/problems/lowest-common-ancestor-in-binary-search-tree) |
| 3 | 213 | House Robber II | 1-D Dynamic Programming | Medium | [LeetCode](https://leetcode.com/problems/house-robber-ii/) | — |
| 4 | 48 | Rotate Image | Math & Geometry | Medium | [LeetCode](https://leetcode.com/problems/rotate-image/) | — |
| 5 | 190 | Reverse Bits | Bit Manipulation | Easy | [LeetCode](https://leetcode.com/problems/reverse-bits/) | — |

**Hints (progressive: Hint 1 is a gentle nudge, Hint 3 nearly gives the approach):**

- **Reorder List**
  - Hint 1: Target order alternates: first, last, second, second-last, ...
  - Hint 2: Break it into three smaller list tasks you already know.
  - Hint 3: Find the middle (slow/fast), reverse the second half, then merge the two halves by alternating nodes.
- **Lowest Common Ancestor of a Binary Search Tree**
  - Hint 1: The BST ordering tells you which side each value lives on.
  - Hint 2: If both values are on the same side of the current node, where must the answer be?
  - Hint 3: Walk down from root: both smaller -> go left; both larger -> go right; otherwise this node is the answer. O(h).
- **House Robber II**
  - Hint 1: The houses form a circle, so first and last are neighbours.
  - Hint 2: You can never take both ends. What does that suggest about splitting the problem?
  - Hint 3: Run the linear House Robber twice: on nums[0..n-2] and on nums[1..n-1]; take the larger. Handle n = 1.
- **Rotate Image**
  - Hint 1: A rotation can be broken down into simpler matrix operations.
  - Hint 2: Think of one flip across a diagonal and one reversal.
  - Hint 3: Transpose the matrix, then reverse each row (for 90 degrees clockwise). In place, O(1) extra space.
- **Reverse Bits**
  - Hint 1: Build the result one bit at a time.
  - Hint 2: Take the lowest bit of n, push it onto the result from the right.
  - Hint 3: Loop 32 times: result = (result << 1) | (n & 1); n >>>= 1 (use unsigned shift in Java).

### Day 9

| # | LC ID | Problem | NeetCode Topic | Difficulty | LeetCode | NeetCode |
|---|-------|---------|----------------|------------|----------|----------|
| 1 | 128 | Longest Consecutive Sequence | Arrays & Hashing | Medium | [LeetCode](https://leetcode.com/problems/longest-consecutive-sequence/) | [NeetCode](https://neetcode.io/problems/longest-consecutive-sequence) |
| 2 | 98 | Validate Binary Search Tree | Trees | Medium | [LeetCode](https://leetcode.com/problems/validate-binary-search-tree/) | — |
| 3 | 200 | Number of Islands | Graphs | Medium | [LeetCode](https://leetcode.com/problems/number-of-islands/) | — |
| 4 | 91 | Decode Ways | 1-D Dynamic Programming | Medium | [LeetCode](https://leetcode.com/problems/decode-ways/) | — |
| 5 | 435 | Non-overlapping Intervals | Intervals | Medium | [LeetCode](https://leetcode.com/problems/non-overlapping-intervals/) | — |

**Hints (progressive: Hint 1 is a gentle nudge, Hint 3 nearly gives the approach):**

- **Longest Consecutive Sequence**
  - Hint 1: Sorting is O(n log n). The problem asks for better, so avoid ordering the data.
  - Hint 2: A consecutive run only needs to be counted once, from its very first number. How do you recognise a first number?
  - Hint 3: Put everything in a set. For each num where num-1 is absent, count upward (num+1, num+2, ...) while present; track the longest. O(n).
- **Validate Binary Search Tree**
  - Hint 1: Comparing each node only with its parent is not enough.
  - Hint 2: Every node must sit within a range inherited from all of its ancestors.
  - Hint 3: Recurse with (min, max) bounds, narrowing on each side (use long or null bounds to avoid int edge cases). Or check that in-order traversal is strictly increasing.
- **Number of Islands**
  - Hint 1: An island is a group of connected land cells.
  - Hint 2: When you meet unvisited land, how do you make sure you never count that same island again?
  - Hint 3: Scan the grid; on land, increment count and flood-fill the whole island (DFS/BFS) marking cells visited.
- **Decode Ways**
  - Hint 1: At each position, a single digit and a pair of digits might each form a letter.
  - Hint 2: Zeros need special care: when are they valid?
  - Hint 3: dp[i] = (s[i-1] != '0' ? dp[i-1] : 0) + (10 <= two-digit <= 26 ? dp[i-2] : 0). Two variables suffice.
- **Non-overlapping Intervals**
  - Hint 1: Removing the fewest is the same as keeping the most.
  - Hint 2: When two intervals overlap, which one should you keep?
  - Hint 3: Sort by end time; greedily keep intervals that start at/after the last kept end; count the ones you skip.

### Day 10

| # | LC ID | Problem | NeetCode Topic | Difficulty | LeetCode | NeetCode |
|---|-------|---------|----------------|------------|----------|----------|
| 1 | 230 | Kth Smallest Element in a BST | Trees | Medium | [LeetCode](https://leetcode.com/problems/kth-smallest-element-in-a-bst/) | — |
| 2 | 133 | Clone Graph | Graphs | Medium | [LeetCode](https://leetcode.com/problems/clone-graph/) | — |
| 3 | 152 | Maximum Product Subarray | 1-D Dynamic Programming | Medium | [LeetCode](https://leetcode.com/problems/maximum-product-subarray/) | — |
| 4 | 54 | Spiral Matrix | Math & Geometry | Medium | [LeetCode](https://leetcode.com/problems/spiral-matrix/) | — |
| 5 | 208 | Implement Trie (Prefix Tree) | Tries | Medium | [LeetCode](https://leetcode.com/problems/implement-trie-prefix-tree/) | — |

**Hints (progressive: Hint 1 is a gentle nudge, Hint 3 nearly gives the approach):**

- **Kth Smallest Element in a BST**
  - Hint 1: What traversal order visits a BST's values in sorted order?
  - Hint 2: You don't need to visit every node, you can stop early.
  - Hint 3: Iterative in-order using a stack; decrement k each time you pop; the kth pop is the answer.
- **Clone Graph**
  - Hint 1: You must produce new nodes without confusing them with originals.
  - Hint 2: Cycles can make you copy forever unless you remember what is already copied.
  - Hint 3: HashMap original -> clone; DFS/BFS: create clone if missing, then clone and link all neighbours.
- **Maximum Product Subarray**
  - Hint 1: Negatives can flip a very small product into a very large one.
  - Hint 2: Keeping only the max product ending here is not enough. What else do you need?
  - Hint 3: Track both max and min product ending at each index; new max/min come from {x, x*max, x*min}. Track the global max.
- **Spiral Matrix**
  - Hint 1: Walk in one direction until a boundary, then turn.
  - Hint 2: Keep four shrinking boundaries.
  - Hint 3: top/bottom/left/right pointers; traverse each edge in order and shrink; guard against a single leftover row or column.
- **Implement Trie (Prefix Tree)**
  - Hint 1: Each character on a path leads to the next one.
  - Hint 2: What should a single node store?
  - Hint 3: Node with children (array[26] or map) and an end-of-word flag. insert/search/startsWith all walk the path char by char.

### Day 11

| # | LC ID | Problem | NeetCode Topic | Difficulty | LeetCode | NeetCode |
|---|-------|---------|----------------|------------|----------|----------|
| 1 | 207 | Course Schedule | Graphs | Medium | [LeetCode](https://leetcode.com/problems/course-schedule/) | — |
| 2 | 5 | Longest Palindromic Substring | 1-D Dynamic Programming | Medium | [LeetCode](https://leetcode.com/problems/longest-palindromic-substring/) | — |
| 3 | 39 | Combination Sum | Backtracking | Medium | [LeetCode](https://leetcode.com/problems/combination-sum/) | — |
| 4 | 73 | Set Matrix Zeroes | Math & Geometry | Medium | [LeetCode](https://leetcode.com/problems/set-matrix-zeroes/) | — |
| 5 | 371 | Sum of Two Integers | Bit Manipulation | Medium | [LeetCode](https://leetcode.com/problems/sum-of-two-integers/) | — |

**Hints (progressive: Hint 1 is a gentle nudge, Hint 3 nearly gives the approach):**

- **Course Schedule**
  - Hint 1: Courses and prerequisites form a graph.
  - Hint 2: When is it impossible to finish all courses?
  - Hint 3: Detect a cycle: DFS with unvisited/visiting/done states, or topological sort with indegrees (Kahn's). No cycle -> true.
- **Longest Palindromic Substring**
  - Hint 1: Palindromes mirror around a centre.
  - Hint 2: How many distinct centres can a string have (think odd and even length)?
  - Hint 3: Expand outward from each of the 2n-1 centres while characters match; keep the longest range. O(n^2) time, O(1) space.
- **Combination Sum**
  - Hint 1: Numbers can be reused, so what choices exist at each step?
  - Hint 2: At each step you either use the current candidate again or move to the next.
  - Hint 3: Backtracking with a start index (avoids duplicate combos) and remaining target; stop when remaining < 0, record when it hits 0.
- **Set Matrix Zeroes**
  - Hint 1: Zeroing as you scan corrupts information about later cells.
  - Hint 2: You need to remember which rows and columns to clear. Where can you store that without extra space?
  - Hint 3: Use the first row and first column as markers, with two flags for whether they themselves need zeroing. O(1) space.
- **Sum of Two Integers**
  - Hint 1: You can't use + or -. How else can you add?
  - Hint 2: Addition splits into a sum without carry and the carry itself.
  - Hint 3: XOR gives the sum without carry; (a & b) << 1 gives the carry. Loop until carry is 0. Java ints handle negatives via two's complement.

### Day 12

| # | LC ID | Problem | NeetCode Topic | Difficulty | LeetCode | NeetCode |
|---|-------|---------|----------------|------------|----------|----------|
| 1 | 417 | Pacific Atlantic Water Flow | Graphs | Medium | [LeetCode](https://leetcode.com/problems/pacific-atlantic-water-flow/) | — |
| 2 | 647 | Palindromic Substrings | 1-D Dynamic Programming | Medium | [LeetCode](https://leetcode.com/problems/palindromic-substrings/) | — |
| 3 | 79 | Word Search | Backtracking | Medium | [LeetCode](https://leetcode.com/problems/word-search/) | — |
| 4 | 211 | Design Add and Search Words Data Structure | Tries | Medium | [LeetCode](https://leetcode.com/problems/design-add-and-search-words-data-structure/) | — |
| 5 | 252 | Meeting Rooms | Intervals | Easy | [LeetCode](https://leetcode.com/problems/meeting-rooms/) 🔒 | [NeetCode](https://neetcode.io/problems/meeting-schedule) |

**Hints (progressive: Hint 1 is a gentle nudge, Hint 3 nearly gives the approach):**

- **Pacific Atlantic Water Flow**
  - Hint 1: Checking every cell's route to both oceans repeats a lot of work.
  - Hint 2: Reverse the viewpoint: start from the oceans and walk uphill.
  - Hint 3: Multi-source DFS/BFS from each ocean's border, moving to cells with height >= current. Answer is the intersection of the two visited sets.
- **Palindromic Substrings**
  - Hint 1: It's closely related to finding the longest palindromic substring.
  - Hint 2: Instead of keeping only the longest, what should you do at every successful expansion?
  - Hint 3: Expand around each centre (odd and even) and add 1 to the count for every palindrome found.
- **Word Search**
  - Hint 1: Try every cell as a starting point.
  - Hint 2: A cell cannot be reused within one path. How do you mark it temporarily?
  - Hint 3: DFS with in-place marking (restore after returning); prune immediately on character mismatch or out of bounds.
- **Design Add and Search Words Data Structure**
  - Hint 1: It's the same structure as a prefix tree, plus one twist.
  - Hint 2: What do you do with a '.' when you can't know which child to take?
  - Hint 3: Trie plus DFS: for a letter follow that child; for '.' try every existing child recursively.
- **Meeting Rooms**
  - Hint 1: If any two meetings overlap, attending all is impossible.
  - Hint 2: Sorting puts potential overlaps next to each other.
  - Hint 3: Sort by start; if any meeting starts before the previous one ends, return false.

### Day 13

| # | LC ID | Problem | NeetCode Topic | Difficulty | LeetCode | NeetCode |
|---|-------|---------|----------------|------------|----------|----------|
| 1 | 105 | Construct Binary Tree from Preorder and Inorder Traversal | Trees | Medium | [LeetCode](https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/) | — |
| 2 | 300 | Longest Increasing Subsequence | 1-D Dynamic Programming | Medium | [LeetCode](https://leetcode.com/problems/longest-increasing-subsequence/) | — |
| 3 | 62 | Unique Paths | 2-D Dynamic Programming | Medium | [LeetCode](https://leetcode.com/problems/unique-paths/) | — |
| 4 | 261 | Graph Valid Tree | Graphs | Medium | [LeetCode](https://leetcode.com/problems/graph-valid-tree/) 🔒 | [NeetCode](https://neetcode.io/problems/valid-tree) |
| 5 | 253 | Meeting Rooms II | Intervals | Medium | [LeetCode](https://leetcode.com/problems/meeting-rooms-ii/) 🔒 | [NeetCode](https://neetcode.io/problems/meeting-schedule-ii) |

**Hints (progressive: Hint 1 is a gentle nudge, Hint 3 nearly gives the approach):**

- **Construct Binary Tree from Preorder and Inorder Traversal**
  - Hint 1: Which element is always the root, according to the first traversal?
  - Hint 2: Where that root sits in the other traversal splits left and right subtrees.
  - Hint 3: Map value -> index for inorder (O(1) lookup). Build recursively using a moving preorder pointer and inorder bounds. O(n).
- **Longest Increasing Subsequence**
  - Hint 1: The best subsequence ending at i depends on earlier smaller elements.
  - Hint 2: An O(n^2) table is a fine first version. Can you improve it afterwards?
  - Hint 3: dp[i] = 1 + max(dp[j]) for j<i with nums[j]<nums[i]. Faster: maintain a 'tails' array and binary-search each element's position, O(n log n).
- **Unique Paths**
  - Hint 1: A robot can only enter a cell from two directions.
  - Hint 2: How do the paths into a cell relate to its two neighbours?
  - Hint 3: paths[r][c] = paths[r-1][c] + paths[r][c-1]; can be compressed to a single row. A combinatorics formula also exists.
- **Graph Valid Tree**
  - Hint 1: Count the edges first: how many does a connected acyclic graph on n nodes have?
  - Hint 2: If the count is right, only one more property needs checking.
  - Hint 3: Need exactly n-1 edges and connectivity (one DFS/BFS from node 0 reaches all), or union-find detects a cycle.
- **Meeting Rooms II**
  - Hint 1: You want the largest number of meetings happening simultaneously.
  - Hint 2: Think about when rooms become free.
  - Hint 3: Sort by start and keep a min-heap of end times (pop if earliest end <= new start). Heap size peak = answer. Or sort starts and ends separately with two pointers.

### Day 14

| # | LC ID | Problem | NeetCode Topic | Difficulty | LeetCode | NeetCode |
|---|-------|---------|----------------|------------|----------|----------|
| 1 | 139 | Word Break | 1-D Dynamic Programming | Medium | [LeetCode](https://leetcode.com/problems/word-break/) | — |
| 2 | 1143 | Longest Common Subsequence | 2-D Dynamic Programming | Medium | [LeetCode](https://leetcode.com/problems/longest-common-subsequence/) | — |
| 3 | 323 | Number of Connected Components in an Undirected Graph | Graphs | Medium | [LeetCode](https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/) 🔒 | [NeetCode](https://neetcode.io/problems/count-connected-components) |
| 4 | 297 | Serialize and Deserialize Binary Tree | Trees | Hard | [LeetCode](https://leetcode.com/problems/serialize-and-deserialize-binary-tree/) | — |
| 5 | 23 | Merge K Sorted Lists | Linked List | Hard | [LeetCode](https://leetcode.com/problems/merge-k-sorted-lists/) | [NeetCode](https://neetcode.io/problems/merge-k-sorted-linked-lists) |

**Hints (progressive: Hint 1 is a gentle nudge, Hint 3 nearly gives the approach):**

- **Word Break**
  - Hint 1: Ask: can this prefix of the string be built from dictionary words?
  - Hint 2: Answer smaller prefixes first and reuse them.
  - Hint 3: dp[i] is true if some j < i has dp[j] true and s[j..i) is in the dictionary. dp[0] = true.
- **Longest Common Subsequence**
  - Hint 1: Compare the last characters of the two prefixes.
  - Hint 2: If they match you extend something; if not you must drop one character from one side.
  - Hint 3: dp[i][j] = s1[i-1]==s2[j-1] ? dp[i-1][j-1]+1 : max(dp[i-1][j], dp[i][j-1]).
- **Number of Connected Components in an Undirected Graph**
  - Hint 1: You're counting separate groups of connected nodes.
  - Hint 2: Traverse each group once, or merge groups as edges arrive.
  - Hint 3: DFS/BFS from each unvisited node counting starts, or Union-Find starting with n components and decrementing on each successful union.
- **Serialize and Deserialize Binary Tree**
  - Hint 1: You need to preserve the structure, so null children must be recorded.
  - Hint 2: Choose one traversal and use it consistently for both directions.
  - Hint 3: Preorder with a marker like 'N' for null and a delimiter; deserialize by consuming tokens recursively from a queue/iterator.
- **Merge K Sorted Lists**
  - Hint 1: You already know how to merge two sorted lists. What's expensive about doing it k times in a row?
  - Hint 2: At each step you just need the smallest among k current heads.
  - Hint 3: Use a min-heap of the k heads, or merge lists pairwise in a divide-and-conquer fashion. O(N log k).

### Day 15

| # | LC ID | Problem | NeetCode Topic | Difficulty | LeetCode | NeetCode |
|---|-------|---------|----------------|------------|----------|----------|
| 1 | 76 | Minimum Window Substring | Sliding Window | Hard | [LeetCode](https://leetcode.com/problems/minimum-window-substring/) | [NeetCode](https://neetcode.io/problems/minimum-window-with-characters) |
| 2 | 124 | Binary Tree Maximum Path Sum | Trees | Hard | [LeetCode](https://leetcode.com/problems/binary-tree-maximum-path-sum/) | — |
| 3 | 212 | Word Search II | Tries | Hard | [LeetCode](https://leetcode.com/problems/word-search-ii/) | — |
| 4 | 295 | Find Median from Data Stream | Heap / Priority Queue | Hard | [LeetCode](https://leetcode.com/problems/find-median-from-data-stream/) | — |
| 5 | 269 | Alien Dictionary | Advanced Graphs | Hard | [LeetCode](https://leetcode.com/problems/alien-dictionary/) 🔒 | [NeetCode](https://neetcode.io/problems/foreign-dictionary) |

**Hints (progressive: Hint 1 is a gentle nudge, Hint 3 nearly gives the approach):**

- **Minimum Window Substring**
  - Hint 1: You need counts of what's required versus what the current range holds.
  - Hint 2: Expand until the range satisfies the requirement, then shrink from the left as far as possible while it still does.
  - Hint 3: Keep need/have counters plus a 'formed' count of satisfied characters to check validity in O(1). Record the smallest valid range. O(n).
- **Binary Tree Maximum Path Sum**
  - Hint 1: A best path may use both children of a node, but think about what a parent can use from that node.
  - Hint 2: A node can pass up only one downward branch to its parent, never both.
  - Hint 3: DFS returns node + max(0, bestLeft, bestRight) to the parent; update a global max with node + max(0,left) + max(0,right).
- **Word Search II**
  - Hint 1: Running a grid search per word is too slow when there are many words.
  - Hint 2: Words that share prefixes can share work.
  - Hint 3: Build a trie of all words, DFS from every cell following trie edges, mark cells visited, collect words at end nodes, and prune exhausted branches.
- **Find Median from Data Stream**
  - Hint 1: The median sits at the boundary between a lower half and an upper half.
  - Hint 2: Which two values do you need quick access to: the largest of the lower half and the smallest of the upper half?
  - Hint 3: Max-heap for the lower half, min-heap for the upper half; keep their sizes within 1 of each other; median from the tops.
- **Alien Dictionary**
  - Hint 1: Adjacent words in a sorted list reveal ordering between some characters.
  - Hint 2: Compare each neighbouring pair at the first position where they differ.
  - Hint 3: Build edges from those differences and topologically sort. Watch invalid input like 'abc' before 'ab', and return empty on a cycle.

---

## 3. Topic Coverage (agent reference only — never display this in the UI)

| Topic | Count |
|---|---|
| Arrays & Hashing | 8 |
| Two Pointers | 3 |
| Sliding Window | 4 |
| Stack | 1 |
| Binary Search | 2 |
| Linked List | 6 |
| Trees | 11 |
| Tries | 3 |
| Heap / Priority Queue | 1 |
| Backtracking | 2 |
| Graphs | 6 |
| Advanced Graphs | 1 |
| 1-D Dynamic Programming | 10 |
| 2-D Dynamic Programming | 2 |
| Greedy | 2 |
| Intervals | 5 |
| Math & Geometry | 3 |
| Bit Manipulation | 5 |
| **Total** | **75** |

---

## 4. Web App Specification — "Blind 75 Tracker"

### 4.1 Goal
A personal, **local-first** web app to track progress through the 15-day Blind 75 plan. The user solves problems on LeetCode/NeetCode, then stores their **Java solutions**, complexity analysis, and remarks here. **The app never compiles or executes code** — it only stores and displays it.

### 4.2 Recommended Stack (agent may substitute if it justifies)
- React + TypeScript + Vite
- Tailwind CSS (dark mode support, default to system preference)
- **IndexedDB via Dexie.js** for persistence (no backend, no login; works offline)
- **Monaco Editor** or CodeMirror 6 for the code editor — Java syntax highlighting only, no run button
- `diff` / `react-diff-viewer` (or Monaco's diff editor) for comparing versions
- Recharts for progress charts
- Vitest + React Testing Library for core logic tests (versioning, streaks, import/export)

### 4.3 Core Features

**A. Dashboard**
- Overall progress: solved / 75, percentage ring or bar.
- Topic breakdown lives inside a **collapsed dropdown (closed by default)** and lists only topics already revealed by the user (see 4.3.1). Never show unrevealed topics, not even as counts or empty bars.
- Per-difficulty breakdown (Easy / Medium / Hard).
- Current streak and longest streak (a "day counts" if at least one problem was marked solved that calendar day).
- "Today's plan" card: the 5 problems for the current plan day (see Settings → Start Date), with status chips.
- "Behind schedule" indicator if earlier plan days still have unsolved problems, with a one-click link to them.

**B. Plan View (15 days)**
- Day tabs or accordion (Day 1 … Day 15). Each shows its 5 problems: LC ID, title, difficulty badge, status, collapsed "Topic" and "Hints" dropdowns (see 4.3.1), links (LeetCode, NeetCode), and a "Open" button to the problem page.
- User sets a **Start Date** in Settings; each Day N maps to `startDate + (N-1)` days. Highlight today's day. User can also manually jump to any day.

**C. All Problems View**
- Table of all 75 with filters: difficulty, status, day, "has remarks", "premium". Free-text search by title/ID only (search must never match topic or hint text). Sortable columns. **No topic column, topic filter, topic grouping or topic sorting** unless Spoiler-Safe Mode is off.

**D. Problem Detail Page** (the heart of the app)
- Header: title, LC ID, difficulty, assigned day, external links (LeetCode / NeetCode; show a 🔒 tooltip for premium).
- **Topic and Hints dropdowns** directly under the header (collapsed by default, see 4.3.1).
- **Status** (single select): `Not Started`, `In Progress`, `Solved`, `Needs Revision`. Changing to Solved for the first time records `firstSolvedAt`.
- **Problem-level remarks**: markdown text area (key insight, pattern, mistakes, interview follow-ups). Auto-saved.
- **Code Versions panel** (see 4.4).

**E. Settings**
- Start date, theme, **Spoiler-Safe Mode** toggle (default ON; turning it OFF requires a confirm dialog), "Auto-reveal topic when I mark a problem Solved" toggle (default ON), "Re-hide all topics and hints" button (with confirm), export/import data, reset all data (with confirmation).

**F. Export / Import**
- Export everything (progress + all versions + settings) to a single JSON file; import with merge-or-replace choice and schema validation.
- Optionally export a Markdown report of solved problems (title, best version code, complexity, remarks; include topic only if it has been revealed).

### 4.3.1 Spoiler-Safe Mode (critical requirement)

The user wants to **practise recognising patterns on their own**, so the topic (pattern category) and the hints of each problem must never be visible until deliberately opened. The problem title and difficulty remain visible.

**Rules**
1. **Default state is hidden.** On first load, Spoiler-Safe Mode is ON. Every problem's topic and hints are hidden everywhere in the app.
2. **Topic dropdown** (per problem): a collapsed control labelled e.g. "🔒 Reveal topic". Clicking opens it and shows the NeetCode topic. Persist the reveal (`topicRevealed = true`) so it stays open across reloads. Provide a per-problem "Re-hide" action.
3. **Hints dropdown** (per problem): a collapsed accordion labelled "💡 Hints (0/3 used)". Hints unlock **one at a time, in order**: the user must click "Show hint 1", then "Show hint 2", then "Show hint 3". Hint N+1's button is not shown until hint N is revealed. Persist `hintsRevealed` (0–3). Per-problem "Re-hide hints" action resets it to 0.
4. These dropdowns must appear in **every place a problem is listed or opened**: Plan view rows (as inline expandable rows), All Problems list rows (expandable), Dashboard "Today's plan" card, and the Problem Detail page.
5. **Not in the DOM until revealed.** Do not merely hide topics/hints with CSS; do not render their text into the DOM, tooltips, `title`/`aria-label` attributes, page `<title>`, URLs, or console logs until revealed. (Ctrl+F on the page must not find them.)
6. **No indirect leaks.** Before a topic is revealed, do not colour-code, icon-code, group, sort, or filter anything by topic. Dashboard topic breakdown only counts and lists topics that are revealed (or auto-revealed on solve); show a muted line such as "N problems have hidden topics".
7. **Auto-reveal on solve** (setting, default ON): when a problem is marked `SOLVED`, its topic is revealed automatically (hints stay as they were). If the setting is OFF, topics only reveal manually.
8. **Usage stats:** track hints used per problem. Show a small stat on the dashboard ("Solved without hints: X / Y") and a "Hints used" column/chip on solved problems. Revealing a topic is also recorded (`topicRevealed`) and shown as a chip.
9. **Spoiler-Safe Mode OFF** (Settings, with confirm dialog): all topics and hints are shown inline without dropdowns, and topic filters/grouping become available. Turning it back ON re-hides everything that was only shown because the mode was off (revealed flags the user set manually remain).
10. **Exports:** the JSON export always contains full data (including reveal flags). The Markdown report only includes a topic if it was revealed; never include hint text.
11. The seed JSON (section 6) contains `topic` and `hints` for every problem. Keep them in the data layer only, and expose them to the UI through a single accessor that checks reveal state, so no component can accidentally render them.

### 4.4 Code Versioning (critical requirement)

Each problem has an **append-only list of versions**. Editing never overwrites history.

**Version fields**
| Field | Type | Notes |
|---|---|---|
| `id` | string (uuid) | |
| `problemId` | number | LeetCode ID |
| `versionNumber` | number | 1, 2, 3 … per problem, auto-increment |
| `label` | string (optional) | e.g. "Brute force", "HashMap one-pass", "Optimized" |
| `language` | `"java"` | fixed to Java for now, but keep the field so other languages can be added later |
| `code` | string | the Java source, stored as-is |
| `timeComplexity` | string | Big-O, e.g. `O(n log n)` |
| `spaceComplexity` | string | Big-O, e.g. `O(1)` |
| `remarks` | string (markdown) | version-specific notes: what changed, why, tradeoffs, test cases that failed |
| `createdAt` | ISO datetime | |
| `isBest` | boolean | at most one version per problem flagged as best/final |

**Behavior**
- "New Version" button opens the editor **pre-filled with the previous version's code** (so the user can iterate); saving creates version N+1.
- Time and Space complexity are **required** to save a version. Provide a combo input: dropdown of common values (`O(1)`, `O(log n)`, `O(n)`, `O(n log n)`, `O(n²)`, `O(2ⁿ)`, `O(n!)`, `O(V+E)`, `O(m*n)`) plus free-text custom entry.
- Remarks per version are optional but encouraged (show a gentle empty-state nudge).
- Version history list (newest first) showing: version number, label, time/space chips, createdAt, isBest star, short remark preview.
- Clicking a version shows read-only code (syntax highlighted), its complexities, and full remarks.
- **Compare**: pick any two versions → side-by-side diff of code, plus a small table comparing time/space/remarks.
- **Restore**: "Restore as new version" copies an old version's code into a *new* version (never mutates history).
- **Mark as best**: star one version; shown on All Problems table and the dashboard summary.
- Versions can be **deleted** only via an explicit confirm dialog; deleting does not renumber the others.
- Metadata-only edits (label, complexity, remarks) on an existing version are allowed and tracked with an `updatedAt`, but the `code` field is immutable once saved — code changes require a new version.

### 4.5 Data Model (IndexedDB / Dexie)

```ts
interface Problem {              // seeded from the JSON in section 6, read-only metadata
  id: number;                    // LeetCode problem number (primary key)
  title: string;
  day: number;                   // 1..15
  order: number;                 // 1..5 within the day
  topic: string;                 // NeetCode category. SPOILER: hidden by default (see 4.3.1)
  hints: string[];               // exactly 3 progressive hints. SPOILER: hidden by default (see 4.3.1)
  difficulty: "Easy" | "Medium" | "Hard";
  leetcodeUrl: string;
  neetcodeUrl: string | null;
  leetcodePremium: boolean;
}

interface Progress {             // one row per problem, created lazily
  problemId: number;             // primary key
  status: "NOT_STARTED" | "IN_PROGRESS" | "SOLVED" | "NEEDS_REVISION";
  remarks: string;               // markdown, problem-level
  topicRevealed: boolean;        // default false
  hintsRevealed: 0 | 1 | 2 | 3;  // default 0
  firstSolvedAt?: string;
  lastUpdatedAt: string;
}

interface CodeVersion {          // see 4.4
  id: string;
  problemId: number;             // indexed
  versionNumber: number;
  label?: string;
  language: "java";
  code: string;
  timeComplexity: string;
  spaceComplexity: string;
  remarks: string;
  isBest: boolean;
  createdAt: string;
  updatedAt?: string;
}

interface Settings {
  startDate: string;             // ISO date
  theme: "system" | "light" | "dark";
  spoilerSafeMode: boolean;      // default true
  autoRevealTopicOnSolve: boolean; // default true
}
```

Indexes: `CodeVersion[problemId+versionNumber]`, `Progress[status]`, `Problem[day]`, `Problem[topic]`.

### 4.6 UX / Non-Functional Requirements
- Responsive: usable on phone (checking today's plan) and desktop (writing code).
- Keyboard shortcuts: `Ctrl/Cmd+S` saves the current version; `N` opens New Version on a problem page.
- Warn before navigating away from an unsaved editor.
- Accessible: semantic HTML, focus states, colour is never the only status indicator.
- All data stays in the browser; no network calls except opening external links. No analytics.
- Seed loading is idempotent: re-running it must not duplicate or wipe user progress.
- Clean, calm visual design; once a topic is revealed its badge uses a consistent colour across the app. Nothing may be colour-coded by topic before it is revealed.

### 4.7 Explicit Non-Goals
- No code execution, compilation, or test running.
- No authentication or backend (can be a later extension).
- No scraping of LeetCode/NeetCode content; only link out.
- No AI features.

### 4.8 Acceptance Criteria
1. Fresh install loads all 75 problems grouped into 15 days × 5, matching section 2 exactly.
2. I can open any problem, set status, write remarks, and add Java code with required time and space complexity.
3. Saving again creates a new version (v2, v3 …); old versions remain viewable and unchanged.
4. I can diff any two versions and restore an old one as a new version.
5. Dashboard progress, topic bars, streak, and "Today's plan" update immediately after status changes.
6. Export → wipe → import fully restores all data, including every version.
7. Refreshing the page or closing the browser loses nothing.
8. Core logic (version numbering, restore, streak calc, import/export, reveal-state logic) has unit tests that pass.
9. On a fresh install, no topic name or hint text appears anywhere in the UI or DOM (verify with Ctrl+F and by inspecting the DOM) for any problem.
10. Hints unlock strictly in order (1 → 2 → 3), and each reveal persists after refresh. "Re-hide" returns the problem to hidden.
11. Marking a problem Solved auto-reveals its topic (when that setting is on) and the dashboard topic breakdown then lists only revealed topics.
12. The Plan view, All Problems view and Today's plan card all offer the same Topic and Hints dropdowns.

### 4.9 Suggested Build Order for the Agent
1. Scaffold project, Dexie schema, seed loader (section 6).
2. Plan View + All Problems view + Problem Detail (status + remarks), including the Spoiler-Safe topic/hint dropdowns from 4.3.1 from the very start (do not add them later).
3. Version editor, history, diff, restore, best flag.
4. Dashboard (progress, streaks, today's plan).
5. Settings, export/import.
6. Tests, polish, README with run instructions.

---

## 5. Notes for the Agent
- Treat section 6 as the single source of truth for problems and hints. Do not invent, drop, or reorder problems, and do not rewrite the hints.
- The Spoiler-Safe rules in 4.3.1 override any convenience: when in doubt, hide it.
- Do not add a code-run feature even if it seems easy.
- Keep dependencies modest; prefer well-maintained libraries.
- Finish with a README covering install, dev, build, and how data persistence/export works.

---

## 6. Seed Data (JSON)

```json

[
 {
  "id": 1,
  "title": "Two Sum",
  "day": 1,
  "order": 1,
  "topic": "Arrays & Hashing",
  "difficulty": "Easy",
  "leetcodeUrl": "https://leetcode.com/problems/two-sum/",
  "neetcodeUrl": "https://neetcode.io/problems/two-integer-sum",
  "leetcodePremium": false,
  "hints": [
   "Checking every pair works, but what does that cost? Think about what you're really searching for at each element.",
   "For the current number, exactly which other value would complete the target? Can you look that up instantly?",
   "Scan once while remembering values already seen with their indices (hash map). Check for the complement before inserting. Target: O(n) time, O(n) space."
  ]
 },
 {
  "id": 125,
  "title": "Valid Palindrome",
  "day": 1,
  "order": 2,
  "topic": "Two Pointers",
  "difficulty": "Easy",
  "leetcodeUrl": "https://leetcode.com/problems/valid-palindrome/",
  "neetcodeUrl": "https://neetcode.io/problems/is-palindrome",
  "leetcodePremium": false,
  "hints": [
   "Ignore non-alphanumeric characters and case. What is the cheapest way to compare mirror positions?",
   "You only need to look at the two ends and move inward.",
   "Two indices, left and right; skip characters that aren't letters or digits; compare lowercase; stop when they cross."
  ]
 },
 {
  "id": 20,
  "title": "Valid Parentheses",
  "day": 1,
  "order": 3,
  "topic": "Stack",
  "difficulty": "Easy",
  "leetcodeUrl": "https://leetcode.com/problems/valid-parentheses/",
  "neetcodeUrl": "https://neetcode.io/problems/validate-parentheses",
  "leetcodePremium": false,
  "hints": [
   "The most recently opened bracket must be the first one closed.",
   "Which data structure gives you last-in, first-out?",
   "Push openers; on a closer, the stack must be non-empty and its top must match. At the end the stack must be empty."
  ]
 },
 {
  "id": 121,
  "title": "Best Time to Buy and Sell Stock",
  "day": 1,
  "order": 4,
  "topic": "Sliding Window",
  "difficulty": "Easy",
  "leetcodeUrl": "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
  "neetcodeUrl": "https://neetcode.io/problems/buy-and-sell-crypto",
  "leetcodePremium": false,
  "hints": [
   "You must buy before you sell, so order matters.",
   "At each day, what single piece of past information would let you compute the best profit if you sold today?",
   "Track the minimum price so far; profit today = price - minSoFar; keep the max profit. One pass, O(1) space."
  ]
 },
 {
  "id": 191,
  "title": "Number of 1 Bits",
  "day": 1,
  "order": 5,
  "topic": "Bit Manipulation",
  "difficulty": "Easy",
  "leetcodeUrl": "https://leetcode.com/problems/number-of-1-bits/",
  "neetcodeUrl": null,
  "leetcodePremium": false,
  "hints": [
   "Look at the lowest bit of the number.",
   "Is there a trick that removes only the lowest set bit?",
   "Loop n &= (n - 1) and count iterations until n is 0."
  ]
 },
 {
  "id": 217,
  "title": "Contains Duplicate",
  "day": 2,
  "order": 1,
  "topic": "Arrays & Hashing",
  "difficulty": "Easy",
  "leetcodeUrl": "https://leetcode.com/problems/contains-duplicate/",
  "neetcodeUrl": "https://neetcode.io/problems/duplicate-integer",
  "leetcodePremium": false,
  "hints": [
   "Comparing every pair is the obvious approach. Is there a cheaper way to ask 'have I met this value before?'",
   "You want a structure with constant-time membership checks.",
   "One pass with a hash set: if the value is already in the set, return true. (Alternative: sort and compare neighbours.)"
  ]
 },
 {
  "id": 206,
  "title": "Reverse Linked List",
  "day": 2,
  "order": 2,
  "topic": "Linked List",
  "difficulty": "Easy",
  "leetcodeUrl": "https://leetcode.com/problems/reverse-linked-list/",
  "neetcodeUrl": "https://neetcode.io/problems/reverse-a-linked-list",
  "leetcodePremium": false,
  "hints": [
   "Every node's next pointer must end up pointing backwards.",
   "If you overwrite next, you lose the rest of the list. What must you save first?",
   "Iterate with prev (null), curr, and a temp for curr.next: save next, point curr.next to prev, advance both. Recursion also works."
  ]
 },
 {
  "id": 226,
  "title": "Invert Binary Tree",
  "day": 2,
  "order": 3,
  "topic": "Trees",
  "difficulty": "Easy",
  "leetcodeUrl": "https://leetcode.com/problems/invert-binary-tree/",
  "neetcodeUrl": "https://neetcode.io/problems/invert-a-binary-tree",
  "leetcodePremium": false,
  "hints": [
   "Every node's two children swap places.",
   "The same operation applies to each subtree.",
   "Recursively swap left and right at every node (base case: null). BFS/DFS iterative also works."
  ]
 },
 {
  "id": 70,
  "title": "Climbing Stairs",
  "day": 2,
  "order": 4,
  "topic": "1-D Dynamic Programming",
  "difficulty": "Easy",
  "leetcodeUrl": "https://leetcode.com/problems/climbing-stairs/",
  "neetcodeUrl": null,
  "leetcodePremium": false,
  "hints": [
   "To reach step n, which earlier steps could you have come from?",
   "Does the count of ways remind you of a famous sequence?",
   "ways(n) = ways(n-1) + ways(n-2); keep just two variables for O(1) space."
  ]
 },
 {
  "id": 53,
  "title": "Maximum Subarray",
  "day": 2,
  "order": 5,
  "topic": "Greedy",
  "difficulty": "Medium",
  "leetcodeUrl": "https://leetcode.com/problems/maximum-subarray/",
  "neetcodeUrl": null,
  "leetcodePremium": false,
  "hints": [
   "When is the running sum of a subarray hurting you?",
   "If the running sum goes negative, should you continue it?",
   "Kadane's: cur = max(x, cur + x); best = max(best, cur). O(n), O(1)."
  ]
 },
 {
  "id": 242,
  "title": "Valid Anagram",
  "day": 3,
  "order": 1,
  "topic": "Arrays & Hashing",
  "difficulty": "Easy",
  "leetcodeUrl": "https://leetcode.com/problems/valid-anagram/",
  "neetcodeUrl": "https://neetcode.io/problems/is-anagram",
  "leetcodePremium": false,
  "hints": [
   "Two strings are anagrams when they contain the same characters with the same frequencies.",
   "You don't need to sort; you just need to compare counts.",
   "Quick length check, then a 26-slot count array (or map): +1 for chars in s, -1 for chars in t, all zeros means anagram. O(n) time."
  ]
 },
 {
  "id": 21,
  "title": "Merge Two Sorted Lists",
  "day": 3,
  "order": 2,
  "topic": "Linked List",
  "difficulty": "Easy",
  "leetcodeUrl": "https://leetcode.com/problems/merge-two-sorted-lists/",
  "neetcodeUrl": "https://neetcode.io/problems/merge-two-sorted-linked-lists",
  "leetcodePremium": false,
  "hints": [
   "Compare the two current heads and take the smaller one.",
   "A dummy starting node saves you from special-casing the first node.",
   "Keep a tail pointer; attach the smaller head and advance; when one list ends, attach the rest of the other."
  ]
 },
 {
  "id": 104,
  "title": "Maximum Depth of Binary Tree",
  "day": 3,
  "order": 3,
  "topic": "Trees",
  "difficulty": "Easy",
  "leetcodeUrl": "https://leetcode.com/problems/maximum-depth-of-binary-tree/",
  "neetcodeUrl": "https://neetcode.io/problems/depth-of-binary-tree",
  "leetcodePremium": false,
  "hints": [
   "The depth of a tree is built from the depth of its parts.",
   "What is the depth of an empty tree?",
   "1 + max(depth(left), depth(right)), with null returning 0. BFS level counting is the iterative alternative."
  ]
 },
 {
  "id": 338,
  "title": "Counting Bits",
  "day": 3,
  "order": 4,
  "topic": "Bit Manipulation",
  "difficulty": "Easy",
  "leetcodeUrl": "https://leetcode.com/problems/counting-bits/",
  "neetcodeUrl": null,
  "leetcodePremium": false,
  "hints": [
   "Computing bits per number from scratch repeats work.",
   "Relate the count for i to the count of a smaller number.",
   "bits[i] = bits[i >> 1] + (i & 1). O(n)."
  ]
 },
 {
  "id": 153,
  "title": "Find Minimum in Rotated Sorted Array",
  "day": 3,
  "order": 5,
  "topic": "Binary Search",
  "difficulty": "Medium",
  "leetcodeUrl": "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/",
  "neetcodeUrl": "https://neetcode.io/problems/find-minimum-in-rotated-sorted-array",
  "leetcodePremium": false,
  "hints": [
   "The array was sorted, then rotated. Where does the order 'break'?",
   "Compare the middle element with the right end to decide which half contains the smallest value.",
   "Binary search: if nums[mid] > nums[right], the minimum is in (mid, right]; otherwise it's in [left, mid]. O(log n)."
  ]
 },
 {
  "id": 49,
  "title": "Group Anagrams",
  "day": 4,
  "order": 1,
  "topic": "Arrays & Hashing",
  "difficulty": "Medium",
  "leetcodeUrl": "https://leetcode.com/problems/group-anagrams/",
  "neetcodeUrl": "https://neetcode.io/problems/anagram-groups",
  "leetcodePremium": false,
  "hints": [
   "Anagrams look different but share something identical once you transform them.",
   "What 'signature' is the same for every anagram of a word? Use that as a grouping key.",
   "Hash map from signature (sorted string, or a 26-count key) to a list of words. Return the map's values."
  ]
 },
 {
  "id": 15,
  "title": "3Sum",
  "day": 4,
  "order": 2,
  "topic": "Two Pointers",
  "difficulty": "Medium",
  "leetcodeUrl": "https://leetcode.com/problems/3sum/",
  "neetcodeUrl": "https://neetcode.io/problems/three-integer-sum",
  "leetcodePremium": false,
  "hints": [
   "Trying all triples is O(n^3). What if you fix one number first? What's left to find?",
   "After fixing one number, the rest is a pair-sum problem, which gets easy when the array is sorted.",
   "Sort, loop i, then use left/right pointers on the rest. Skip duplicate values for i, left and right so triplets aren't repeated. O(n^2)."
  ]
 },
 {
  "id": 141,
  "title": "Linked List Cycle",
  "day": 4,
  "order": 3,
  "topic": "Linked List",
  "difficulty": "Easy",
  "leetcodeUrl": "https://leetcode.com/problems/linked-list-cycle/",
  "neetcodeUrl": "https://neetcode.io/problems/linked-list-cycle-detection",
  "leetcodePremium": false,
  "hints": [
   "A set of visited nodes works but uses extra memory. Is there an O(1)-space way?",
   "Imagine two runners on a loop moving at different speeds.",
   "Slow moves 1 step, fast moves 2. If they ever meet there's a cycle; if fast reaches null there isn't."
  ]
 },
 {
  "id": 100,
  "title": "Same Tree",
  "day": 4,
  "order": 4,
  "topic": "Trees",
  "difficulty": "Easy",
  "leetcodeUrl": "https://leetcode.com/problems/same-tree/",
  "neetcodeUrl": "https://neetcode.io/problems/same-binary-tree",
  "leetcodePremium": false,
  "hints": [
   "Two trees match when the roots match and both subtrees match.",
   "Be careful about null cases: both null, one null.",
   "Recursive: both null -> true; one null or values differ -> false; else same(left,left) && same(right,right)."
  ]
 },
 {
  "id": 198,
  "title": "House Robber",
  "day": 4,
  "order": 5,
  "topic": "1-D Dynamic Programming",
  "difficulty": "Medium",
  "leetcodeUrl": "https://leetcode.com/problems/house-robber/",
  "neetcodeUrl": null,
  "leetcodePremium": false,
  "hints": [
   "At each house you choose: take it or skip it.",
   "If you take house i, what must be true about house i-1?",
   "dp[i] = max(dp[i-1], dp[i-2] + nums[i]); two rolling variables are enough."
  ]
 },
 {
  "id": 347,
  "title": "Top K Frequent Elements",
  "day": 5,
  "order": 1,
  "topic": "Arrays & Hashing",
  "difficulty": "Medium",
  "leetcodeUrl": "https://leetcode.com/problems/top-k-frequent-elements/",
  "neetcodeUrl": "https://neetcode.io/problems/top-k-elements-in-list",
  "leetcodePremium": false,
  "hints": [
   "You need to know how often each value appears before you can rank anything.",
   "Sorting by frequency works in O(n log n). Can you avoid a full sort, since frequency is bounded by n?",
   "Count with a map, then either bucket values by frequency (index = count) and read from the highest bucket down, or keep a size-k min-heap."
  ]
 },
 {
  "id": 3,
  "title": "Longest Substring Without Repeating Characters",
  "day": 5,
  "order": 2,
  "topic": "Sliding Window",
  "difficulty": "Medium",
  "leetcodeUrl": "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
  "neetcodeUrl": "https://neetcode.io/problems/longest-substring-without-duplicates",
  "leetcodePremium": false,
  "hints": [
   "Checking every substring is too slow. Think about a range that grows and shrinks as you scan.",
   "Maintain a range that never contains a repeated character. What do you do the moment a repeat appears?",
   "Two pointers with a set (or map of last-seen index). On a duplicate, advance the left pointer past the earlier occurrence. Track max length. O(n)."
  ]
 },
 {
  "id": 33,
  "title": "Search in Rotated Sorted Array",
  "day": 5,
  "order": 3,
  "topic": "Binary Search",
  "difficulty": "Medium",
  "leetcodeUrl": "https://leetcode.com/problems/search-in-rotated-sorted-array/",
  "neetcodeUrl": "https://neetcode.io/problems/find-target-in-rotated-sorted-array",
  "leetcodePremium": false,
  "hints": [
   "Even after rotation, at least one half around the middle is properly sorted.",
   "Find which half is sorted, then check if the target falls inside that half's range.",
   "Binary search: if left half sorted and target in it, go left, else go right (and mirror for the other case). O(log n)."
  ]
 },
 {
  "id": 56,
  "title": "Merge Intervals",
  "day": 5,
  "order": 4,
  "topic": "Intervals",
  "difficulty": "Medium",
  "leetcodeUrl": "https://leetcode.com/problems/merge-intervals/",
  "neetcodeUrl": null,
  "leetcodePremium": false,
  "hints": [
   "Order matters. What would help if the intervals were arranged first?",
   "Only the most recent merged interval can overlap with the next one.",
   "Sort by start; if current.start <= last.end then last.end = max(last.end, current.end); otherwise append."
  ]
 },
 {
  "id": 268,
  "title": "Missing Number",
  "day": 5,
  "order": 5,
  "topic": "Bit Manipulation",
  "difficulty": "Easy",
  "leetcodeUrl": "https://leetcode.com/problems/missing-number/",
  "neetcodeUrl": null,
  "leetcodePremium": false,
  "hints": [
   "The numbers 0..n are present except one.",
   "Something about the full range is known without looking at the array.",
   "Use the sum formula n(n+1)/2 minus the array sum, or XOR all indices and values. O(n) time, O(1) space."
  ]
 },
 {
  "id": 238,
  "title": "Product of Array Except Self",
  "day": 6,
  "order": 1,
  "topic": "Arrays & Hashing",
  "difficulty": "Medium",
  "leetcodeUrl": "https://leetcode.com/problems/product-of-array-except-self/",
  "neetcodeUrl": "https://neetcode.io/problems/products-of-array-discluding-self",
  "leetcodePremium": false,
  "hints": [
   "Division isn't allowed, so think about what the answer at index i is actually made of.",
   "The answer at i is (product of everything to the left) x (product of everything to the right).",
   "First pass fills result[i] with the prefix product; second pass goes right to left with a running suffix product multiplied in. O(n) time, O(1) extra space."
  ]
 },
 {
  "id": 11,
  "title": "Container With Most Water",
  "day": 6,
  "order": 2,
  "topic": "Two Pointers",
  "difficulty": "Medium",
  "leetcodeUrl": "https://leetcode.com/problems/container-with-most-water/",
  "neetcodeUrl": "https://neetcode.io/problems/max-water-container",
  "leetcodePremium": false,
  "hints": [
   "Area = width x the shorter of the two lines. What limits a wide container?",
   "Start with the widest container. Which side would you have to change to possibly get a bigger area?",
   "Pointers at both ends; compute area; move the pointer at the shorter line inward (moving the taller one can't help). Track the max. O(n)."
  ]
 },
 {
  "id": 19,
  "title": "Remove Nth Node From End of List",
  "day": 6,
  "order": 3,
  "topic": "Linked List",
  "difficulty": "Medium",
  "leetcodeUrl": "https://leetcode.com/problems/remove-nth-node-from-end-of-list/",
  "neetcodeUrl": "https://neetcode.io/problems/remove-node-from-end-of-linked-list",
  "leetcodePremium": false,
  "hints": [
   "Removing the nth from the end seems to need the length. Can you avoid a two-pass solution?",
   "Use two pointers separated by a fixed gap.",
   "Dummy node before head. Move fast n steps ahead, then move both until fast reaches the end; slow.next is the node to remove."
  ]
 },
 {
  "id": 572,
  "title": "Subtree of Another Tree",
  "day": 6,
  "order": 4,
  "topic": "Trees",
  "difficulty": "Easy",
  "leetcodeUrl": "https://leetcode.com/problems/subtree-of-another-tree/",
  "neetcodeUrl": "https://neetcode.io/problems/subtree-of-a-binary-tree",
  "leetcodePremium": false,
  "hints": [
   "You may already own a helper that tells you whether two trees are identical.",
   "Where could the smaller tree's root appear in the bigger tree?",
   "At every node of root, test sameTree(node, subRoot); otherwise recurse into the left and right children."
  ]
 },
 {
  "id": 55,
  "title": "Jump Game",
  "day": 6,
  "order": 5,
  "topic": "Greedy",
  "difficulty": "Medium",
  "leetcodeUrl": "https://leetcode.com/problems/jump-game/",
  "neetcodeUrl": null,
  "leetcodePremium": false,
  "hints": [
   "You only need to know if the end is reachable, not the path.",
   "Track how far you can reach so far.",
   "Loop i: if i > farthest return false; farthest = max(farthest, i + nums[i]). Return true at the end (or work backwards moving a 'goal')."
  ]
 },
 {
  "id": 271,
  "title": "Encode and Decode Strings",
  "day": 7,
  "order": 1,
  "topic": "Arrays & Hashing",
  "difficulty": "Medium",
  "leetcodeUrl": "https://leetcode.com/problems/encode-and-decode-strings/",
  "neetcodeUrl": "https://neetcode.io/problems/string-encode-and-decode",
  "leetcodePremium": true,
  "hints": [
   "A simple delimiter fails if strings can contain any character, including your delimiter.",
   "Encode extra information with each string so the decoder knows exactly where it ends.",
   "Write length + a separator + the string for each one. To decode, read the number up to the separator, then take exactly that many characters and repeat."
  ]
 },
 {
  "id": 424,
  "title": "Longest Repeating Character Replacement",
  "day": 7,
  "order": 2,
  "topic": "Sliding Window",
  "difficulty": "Medium",
  "leetcodeUrl": "https://leetcode.com/problems/longest-repeating-character-replacement/",
  "neetcodeUrl": "https://neetcode.io/problems/longest-repeating-substring-with-replacement",
  "leetcodePremium": false,
  "hints": [
   "A range is valid if (its length minus the count of its most frequent character) is at most k.",
   "Grow the range from the right; only shrink when it becomes invalid.",
   "Use a 26-slot count array and track the max frequency seen in the window. The window can stay at its best size and slide. O(n)."
  ]
 },
 {
  "id": 102,
  "title": "Binary Tree Level Order Traversal",
  "day": 7,
  "order": 3,
  "topic": "Trees",
  "difficulty": "Medium",
  "leetcodeUrl": "https://leetcode.com/problems/binary-tree-level-order-traversal/",
  "neetcodeUrl": "https://neetcode.io/problems/level-order-traversal-of-binary-tree",
  "leetcodePremium": false,
  "hints": [
   "You need nodes grouped by depth.",
   "Which traversal naturally processes a tree level by level?",
   "BFS with a queue; at each round process exactly queue.size() nodes to form one level."
  ]
 },
 {
  "id": 322,
  "title": "Coin Change",
  "day": 7,
  "order": 4,
  "topic": "1-D Dynamic Programming",
  "difficulty": "Medium",
  "leetcodeUrl": "https://leetcode.com/problems/coin-change/",
  "neetcodeUrl": null,
  "leetcodePremium": false,
  "hints": [
   "Taking the largest coin first can fail. Why?",
   "The best answer for an amount depends on best answers for smaller amounts.",
   "dp[0]=0; dp[a] = min over coins c of dp[a-c] + 1; initialise others to amount+1; if dp[amount] > amount return -1."
  ]
 },
 {
  "id": 57,
  "title": "Insert Interval",
  "day": 7,
  "order": 5,
  "topic": "Intervals",
  "difficulty": "Medium",
  "leetcodeUrl": "https://leetcode.com/problems/insert-interval/",
  "neetcodeUrl": null,
  "leetcodePremium": false,
  "hints": [
   "The existing intervals are sorted and don't overlap.",
   "Split the work into three phases by how intervals relate to the new one.",
   "Add all intervals ending before the new start; merge overlaps by taking min start / max end; then add the rest."
  ]
 },
 {
  "id": 143,
  "title": "Reorder List",
  "day": 8,
  "order": 1,
  "topic": "Linked List",
  "difficulty": "Medium",
  "leetcodeUrl": "https://leetcode.com/problems/reorder-list/",
  "neetcodeUrl": "https://neetcode.io/problems/reorder-linked-list",
  "leetcodePremium": false,
  "hints": [
   "Target order alternates: first, last, second, second-last, ...",
   "Break it into three smaller list tasks you already know.",
   "Find the middle (slow/fast), reverse the second half, then merge the two halves by alternating nodes."
  ]
 },
 {
  "id": 235,
  "title": "Lowest Common Ancestor of a Binary Search Tree",
  "day": 8,
  "order": 2,
  "topic": "Trees",
  "difficulty": "Medium",
  "leetcodeUrl": "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/",
  "neetcodeUrl": "https://neetcode.io/problems/lowest-common-ancestor-in-binary-search-tree",
  "leetcodePremium": false,
  "hints": [
   "The BST ordering tells you which side each value lives on.",
   "If both values are on the same side of the current node, where must the answer be?",
   "Walk down from root: both smaller -> go left; both larger -> go right; otherwise this node is the answer. O(h)."
  ]
 },
 {
  "id": 213,
  "title": "House Robber II",
  "day": 8,
  "order": 3,
  "topic": "1-D Dynamic Programming",
  "difficulty": "Medium",
  "leetcodeUrl": "https://leetcode.com/problems/house-robber-ii/",
  "neetcodeUrl": null,
  "leetcodePremium": false,
  "hints": [
   "The houses form a circle, so first and last are neighbours.",
   "You can never take both ends. What does that suggest about splitting the problem?",
   "Run the linear House Robber twice: on nums[0..n-2] and on nums[1..n-1]; take the larger. Handle n = 1."
  ]
 },
 {
  "id": 48,
  "title": "Rotate Image",
  "day": 8,
  "order": 4,
  "topic": "Math & Geometry",
  "difficulty": "Medium",
  "leetcodeUrl": "https://leetcode.com/problems/rotate-image/",
  "neetcodeUrl": null,
  "leetcodePremium": false,
  "hints": [
   "A rotation can be broken down into simpler matrix operations.",
   "Think of one flip across a diagonal and one reversal.",
   "Transpose the matrix, then reverse each row (for 90 degrees clockwise). In place, O(1) extra space."
  ]
 },
 {
  "id": 190,
  "title": "Reverse Bits",
  "day": 8,
  "order": 5,
  "topic": "Bit Manipulation",
  "difficulty": "Easy",
  "leetcodeUrl": "https://leetcode.com/problems/reverse-bits/",
  "neetcodeUrl": null,
  "leetcodePremium": false,
  "hints": [
   "Build the result one bit at a time.",
   "Take the lowest bit of n, push it onto the result from the right.",
   "Loop 32 times: result = (result << 1) | (n & 1); n >>>= 1 (use unsigned shift in Java)."
  ]
 },
 {
  "id": 128,
  "title": "Longest Consecutive Sequence",
  "day": 9,
  "order": 1,
  "topic": "Arrays & Hashing",
  "difficulty": "Medium",
  "leetcodeUrl": "https://leetcode.com/problems/longest-consecutive-sequence/",
  "neetcodeUrl": "https://neetcode.io/problems/longest-consecutive-sequence",
  "leetcodePremium": false,
  "hints": [
   "Sorting is O(n log n). The problem asks for better, so avoid ordering the data.",
   "A consecutive run only needs to be counted once, from its very first number. How do you recognise a first number?",
   "Put everything in a set. For each num where num-1 is absent, count upward (num+1, num+2, ...) while present; track the longest. O(n)."
  ]
 },
 {
  "id": 98,
  "title": "Validate Binary Search Tree",
  "day": 9,
  "order": 2,
  "topic": "Trees",
  "difficulty": "Medium",
  "leetcodeUrl": "https://leetcode.com/problems/validate-binary-search-tree/",
  "neetcodeUrl": null,
  "leetcodePremium": false,
  "hints": [
   "Comparing each node only with its parent is not enough.",
   "Every node must sit within a range inherited from all of its ancestors.",
   "Recurse with (min, max) bounds, narrowing on each side (use long or null bounds to avoid int edge cases). Or check that in-order traversal is strictly increasing."
  ]
 },
 {
  "id": 200,
  "title": "Number of Islands",
  "day": 9,
  "order": 3,
  "topic": "Graphs",
  "difficulty": "Medium",
  "leetcodeUrl": "https://leetcode.com/problems/number-of-islands/",
  "neetcodeUrl": null,
  "leetcodePremium": false,
  "hints": [
   "An island is a group of connected land cells.",
   "When you meet unvisited land, how do you make sure you never count that same island again?",
   "Scan the grid; on land, increment count and flood-fill the whole island (DFS/BFS) marking cells visited."
  ]
 },
 {
  "id": 91,
  "title": "Decode Ways",
  "day": 9,
  "order": 4,
  "topic": "1-D Dynamic Programming",
  "difficulty": "Medium",
  "leetcodeUrl": "https://leetcode.com/problems/decode-ways/",
  "neetcodeUrl": null,
  "leetcodePremium": false,
  "hints": [
   "At each position, a single digit and a pair of digits might each form a letter.",
   "Zeros need special care: when are they valid?",
   "dp[i] = (s[i-1] != '0' ? dp[i-1] : 0) + (10 <= two-digit <= 26 ? dp[i-2] : 0). Two variables suffice."
  ]
 },
 {
  "id": 435,
  "title": "Non-overlapping Intervals",
  "day": 9,
  "order": 5,
  "topic": "Intervals",
  "difficulty": "Medium",
  "leetcodeUrl": "https://leetcode.com/problems/non-overlapping-intervals/",
  "neetcodeUrl": null,
  "leetcodePremium": false,
  "hints": [
   "Removing the fewest is the same as keeping the most.",
   "When two intervals overlap, which one should you keep?",
   "Sort by end time; greedily keep intervals that start at/after the last kept end; count the ones you skip."
  ]
 },
 {
  "id": 230,
  "title": "Kth Smallest Element in a BST",
  "day": 10,
  "order": 1,
  "topic": "Trees",
  "difficulty": "Medium",
  "leetcodeUrl": "https://leetcode.com/problems/kth-smallest-element-in-a-bst/",
  "neetcodeUrl": null,
  "leetcodePremium": false,
  "hints": [
   "What traversal order visits a BST's values in sorted order?",
   "You don't need to visit every node, you can stop early.",
   "Iterative in-order using a stack; decrement k each time you pop; the kth pop is the answer."
  ]
 },
 {
  "id": 133,
  "title": "Clone Graph",
  "day": 10,
  "order": 2,
  "topic": "Graphs",
  "difficulty": "Medium",
  "leetcodeUrl": "https://leetcode.com/problems/clone-graph/",
  "neetcodeUrl": null,
  "leetcodePremium": false,
  "hints": [
   "You must produce new nodes without confusing them with originals.",
   "Cycles can make you copy forever unless you remember what is already copied.",
   "HashMap original -> clone; DFS/BFS: create clone if missing, then clone and link all neighbours."
  ]
 },
 {
  "id": 152,
  "title": "Maximum Product Subarray",
  "day": 10,
  "order": 3,
  "topic": "1-D Dynamic Programming",
  "difficulty": "Medium",
  "leetcodeUrl": "https://leetcode.com/problems/maximum-product-subarray/",
  "neetcodeUrl": null,
  "leetcodePremium": false,
  "hints": [
   "Negatives can flip a very small product into a very large one.",
   "Keeping only the max product ending here is not enough. What else do you need?",
   "Track both max and min product ending at each index; new max/min come from {x, x*max, x*min}. Track the global max."
  ]
 },
 {
  "id": 54,
  "title": "Spiral Matrix",
  "day": 10,
  "order": 4,
  "topic": "Math & Geometry",
  "difficulty": "Medium",
  "leetcodeUrl": "https://leetcode.com/problems/spiral-matrix/",
  "neetcodeUrl": null,
  "leetcodePremium": false,
  "hints": [
   "Walk in one direction until a boundary, then turn.",
   "Keep four shrinking boundaries.",
   "top/bottom/left/right pointers; traverse each edge in order and shrink; guard against a single leftover row or column."
  ]
 },
 {
  "id": 208,
  "title": "Implement Trie (Prefix Tree)",
  "day": 10,
  "order": 5,
  "topic": "Tries",
  "difficulty": "Medium",
  "leetcodeUrl": "https://leetcode.com/problems/implement-trie-prefix-tree/",
  "neetcodeUrl": null,
  "leetcodePremium": false,
  "hints": [
   "Each character on a path leads to the next one.",
   "What should a single node store?",
   "Node with children (array[26] or map) and an end-of-word flag. insert/search/startsWith all walk the path char by char."
  ]
 },
 {
  "id": 207,
  "title": "Course Schedule",
  "day": 11,
  "order": 1,
  "topic": "Graphs",
  "difficulty": "Medium",
  "leetcodeUrl": "https://leetcode.com/problems/course-schedule/",
  "neetcodeUrl": null,
  "leetcodePremium": false,
  "hints": [
   "Courses and prerequisites form a graph.",
   "When is it impossible to finish all courses?",
   "Detect a cycle: DFS with unvisited/visiting/done states, or topological sort with indegrees (Kahn's). No cycle -> true."
  ]
 },
 {
  "id": 5,
  "title": "Longest Palindromic Substring",
  "day": 11,
  "order": 2,
  "topic": "1-D Dynamic Programming",
  "difficulty": "Medium",
  "leetcodeUrl": "https://leetcode.com/problems/longest-palindromic-substring/",
  "neetcodeUrl": null,
  "leetcodePremium": false,
  "hints": [
   "Palindromes mirror around a centre.",
   "How many distinct centres can a string have (think odd and even length)?",
   "Expand outward from each of the 2n-1 centres while characters match; keep the longest range. O(n^2) time, O(1) space."
  ]
 },
 {
  "id": 39,
  "title": "Combination Sum",
  "day": 11,
  "order": 3,
  "topic": "Backtracking",
  "difficulty": "Medium",
  "leetcodeUrl": "https://leetcode.com/problems/combination-sum/",
  "neetcodeUrl": null,
  "leetcodePremium": false,
  "hints": [
   "Numbers can be reused, so what choices exist at each step?",
   "At each step you either use the current candidate again or move to the next.",
   "Backtracking with a start index (avoids duplicate combos) and remaining target; stop when remaining < 0, record when it hits 0."
  ]
 },
 {
  "id": 73,
  "title": "Set Matrix Zeroes",
  "day": 11,
  "order": 4,
  "topic": "Math & Geometry",
  "difficulty": "Medium",
  "leetcodeUrl": "https://leetcode.com/problems/set-matrix-zeroes/",
  "neetcodeUrl": null,
  "leetcodePremium": false,
  "hints": [
   "Zeroing as you scan corrupts information about later cells.",
   "You need to remember which rows and columns to clear. Where can you store that without extra space?",
   "Use the first row and first column as markers, with two flags for whether they themselves need zeroing. O(1) space."
  ]
 },
 {
  "id": 371,
  "title": "Sum of Two Integers",
  "day": 11,
  "order": 5,
  "topic": "Bit Manipulation",
  "difficulty": "Medium",
  "leetcodeUrl": "https://leetcode.com/problems/sum-of-two-integers/",
  "neetcodeUrl": null,
  "leetcodePremium": false,
  "hints": [
   "You can't use + or -. How else can you add?",
   "Addition splits into a sum without carry and the carry itself.",
   "XOR gives the sum without carry; (a & b) << 1 gives the carry. Loop until carry is 0. Java ints handle negatives via two's complement."
  ]
 },
 {
  "id": 417,
  "title": "Pacific Atlantic Water Flow",
  "day": 12,
  "order": 1,
  "topic": "Graphs",
  "difficulty": "Medium",
  "leetcodeUrl": "https://leetcode.com/problems/pacific-atlantic-water-flow/",
  "neetcodeUrl": null,
  "leetcodePremium": false,
  "hints": [
   "Checking every cell's route to both oceans repeats a lot of work.",
   "Reverse the viewpoint: start from the oceans and walk uphill.",
   "Multi-source DFS/BFS from each ocean's border, moving to cells with height >= current. Answer is the intersection of the two visited sets."
  ]
 },
 {
  "id": 647,
  "title": "Palindromic Substrings",
  "day": 12,
  "order": 2,
  "topic": "1-D Dynamic Programming",
  "difficulty": "Medium",
  "leetcodeUrl": "https://leetcode.com/problems/palindromic-substrings/",
  "neetcodeUrl": null,
  "leetcodePremium": false,
  "hints": [
   "It's closely related to finding the longest palindromic substring.",
   "Instead of keeping only the longest, what should you do at every successful expansion?",
   "Expand around each centre (odd and even) and add 1 to the count for every palindrome found."
  ]
 },
 {
  "id": 79,
  "title": "Word Search",
  "day": 12,
  "order": 3,
  "topic": "Backtracking",
  "difficulty": "Medium",
  "leetcodeUrl": "https://leetcode.com/problems/word-search/",
  "neetcodeUrl": null,
  "leetcodePremium": false,
  "hints": [
   "Try every cell as a starting point.",
   "A cell cannot be reused within one path. How do you mark it temporarily?",
   "DFS with in-place marking (restore after returning); prune immediately on character mismatch or out of bounds."
  ]
 },
 {
  "id": 211,
  "title": "Design Add and Search Words Data Structure",
  "day": 12,
  "order": 4,
  "topic": "Tries",
  "difficulty": "Medium",
  "leetcodeUrl": "https://leetcode.com/problems/design-add-and-search-words-data-structure/",
  "neetcodeUrl": null,
  "leetcodePremium": false,
  "hints": [
   "It's the same structure as a prefix tree, plus one twist.",
   "What do you do with a '.' when you can't know which child to take?",
   "Trie plus DFS: for a letter follow that child; for '.' try every existing child recursively."
  ]
 },
 {
  "id": 252,
  "title": "Meeting Rooms",
  "day": 12,
  "order": 5,
  "topic": "Intervals",
  "difficulty": "Easy",
  "leetcodeUrl": "https://leetcode.com/problems/meeting-rooms/",
  "neetcodeUrl": "https://neetcode.io/problems/meeting-schedule",
  "leetcodePremium": true,
  "hints": [
   "If any two meetings overlap, attending all is impossible.",
   "Sorting puts potential overlaps next to each other.",
   "Sort by start; if any meeting starts before the previous one ends, return false."
  ]
 },
 {
  "id": 105,
  "title": "Construct Binary Tree from Preorder and Inorder Traversal",
  "day": 13,
  "order": 1,
  "topic": "Trees",
  "difficulty": "Medium",
  "leetcodeUrl": "https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/",
  "neetcodeUrl": null,
  "leetcodePremium": false,
  "hints": [
   "Which element is always the root, according to the first traversal?",
   "Where that root sits in the other traversal splits left and right subtrees.",
   "Map value -> index for inorder (O(1) lookup). Build recursively using a moving preorder pointer and inorder bounds. O(n)."
  ]
 },
 {
  "id": 300,
  "title": "Longest Increasing Subsequence",
  "day": 13,
  "order": 2,
  "topic": "1-D Dynamic Programming",
  "difficulty": "Medium",
  "leetcodeUrl": "https://leetcode.com/problems/longest-increasing-subsequence/",
  "neetcodeUrl": null,
  "leetcodePremium": false,
  "hints": [
   "The best subsequence ending at i depends on earlier smaller elements.",
   "An O(n^2) table is a fine first version. Can you improve it afterwards?",
   "dp[i] = 1 + max(dp[j]) for j<i with nums[j]<nums[i]. Faster: maintain a 'tails' array and binary-search each element's position, O(n log n)."
  ]
 },
 {
  "id": 62,
  "title": "Unique Paths",
  "day": 13,
  "order": 3,
  "topic": "2-D Dynamic Programming",
  "difficulty": "Medium",
  "leetcodeUrl": "https://leetcode.com/problems/unique-paths/",
  "neetcodeUrl": null,
  "leetcodePremium": false,
  "hints": [
   "A robot can only enter a cell from two directions.",
   "How do the paths into a cell relate to its two neighbours?",
   "paths[r][c] = paths[r-1][c] + paths[r][c-1]; can be compressed to a single row. A combinatorics formula also exists."
  ]
 },
 {
  "id": 261,
  "title": "Graph Valid Tree",
  "day": 13,
  "order": 4,
  "topic": "Graphs",
  "difficulty": "Medium",
  "leetcodeUrl": "https://leetcode.com/problems/graph-valid-tree/",
  "neetcodeUrl": "https://neetcode.io/problems/valid-tree",
  "leetcodePremium": true,
  "hints": [
   "Count the edges first: how many does a connected acyclic graph on n nodes have?",
   "If the count is right, only one more property needs checking.",
   "Need exactly n-1 edges and connectivity (one DFS/BFS from node 0 reaches all), or union-find detects a cycle."
  ]
 },
 {
  "id": 253,
  "title": "Meeting Rooms II",
  "day": 13,
  "order": 5,
  "topic": "Intervals",
  "difficulty": "Medium",
  "leetcodeUrl": "https://leetcode.com/problems/meeting-rooms-ii/",
  "neetcodeUrl": "https://neetcode.io/problems/meeting-schedule-ii",
  "leetcodePremium": true,
  "hints": [
   "You want the largest number of meetings happening simultaneously.",
   "Think about when rooms become free.",
   "Sort by start and keep a min-heap of end times (pop if earliest end <= new start). Heap size peak = answer. Or sort starts and ends separately with two pointers."
  ]
 },
 {
  "id": 139,
  "title": "Word Break",
  "day": 14,
  "order": 1,
  "topic": "1-D Dynamic Programming",
  "difficulty": "Medium",
  "leetcodeUrl": "https://leetcode.com/problems/word-break/",
  "neetcodeUrl": null,
  "leetcodePremium": false,
  "hints": [
   "Ask: can this prefix of the string be built from dictionary words?",
   "Answer smaller prefixes first and reuse them.",
   "dp[i] is true if some j < i has dp[j] true and s[j..i) is in the dictionary. dp[0] = true."
  ]
 },
 {
  "id": 1143,
  "title": "Longest Common Subsequence",
  "day": 14,
  "order": 2,
  "topic": "2-D Dynamic Programming",
  "difficulty": "Medium",
  "leetcodeUrl": "https://leetcode.com/problems/longest-common-subsequence/",
  "neetcodeUrl": null,
  "leetcodePremium": false,
  "hints": [
   "Compare the last characters of the two prefixes.",
   "If they match you extend something; if not you must drop one character from one side.",
   "dp[i][j] = s1[i-1]==s2[j-1] ? dp[i-1][j-1]+1 : max(dp[i-1][j], dp[i][j-1])."
  ]
 },
 {
  "id": 323,
  "title": "Number of Connected Components in an Undirected Graph",
  "day": 14,
  "order": 3,
  "topic": "Graphs",
  "difficulty": "Medium",
  "leetcodeUrl": "https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/",
  "neetcodeUrl": "https://neetcode.io/problems/count-connected-components",
  "leetcodePremium": true,
  "hints": [
   "You're counting separate groups of connected nodes.",
   "Traverse each group once, or merge groups as edges arrive.",
   "DFS/BFS from each unvisited node counting starts, or Union-Find starting with n components and decrementing on each successful union."
  ]
 },
 {
  "id": 297,
  "title": "Serialize and Deserialize Binary Tree",
  "day": 14,
  "order": 4,
  "topic": "Trees",
  "difficulty": "Hard",
  "leetcodeUrl": "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/",
  "neetcodeUrl": null,
  "leetcodePremium": false,
  "hints": [
   "You need to preserve the structure, so null children must be recorded.",
   "Choose one traversal and use it consistently for both directions.",
   "Preorder with a marker like 'N' for null and a delimiter; deserialize by consuming tokens recursively from a queue/iterator."
  ]
 },
 {
  "id": 23,
  "title": "Merge K Sorted Lists",
  "day": 14,
  "order": 5,
  "topic": "Linked List",
  "difficulty": "Hard",
  "leetcodeUrl": "https://leetcode.com/problems/merge-k-sorted-lists/",
  "neetcodeUrl": "https://neetcode.io/problems/merge-k-sorted-linked-lists",
  "leetcodePremium": false,
  "hints": [
   "You already know how to merge two sorted lists. What's expensive about doing it k times in a row?",
   "At each step you just need the smallest among k current heads.",
   "Use a min-heap of the k heads, or merge lists pairwise in a divide-and-conquer fashion. O(N log k)."
  ]
 },
 {
  "id": 76,
  "title": "Minimum Window Substring",
  "day": 15,
  "order": 1,
  "topic": "Sliding Window",
  "difficulty": "Hard",
  "leetcodeUrl": "https://leetcode.com/problems/minimum-window-substring/",
  "neetcodeUrl": "https://neetcode.io/problems/minimum-window-with-characters",
  "leetcodePremium": false,
  "hints": [
   "You need counts of what's required versus what the current range holds.",
   "Expand until the range satisfies the requirement, then shrink from the left as far as possible while it still does.",
   "Keep need/have counters plus a 'formed' count of satisfied characters to check validity in O(1). Record the smallest valid range. O(n)."
  ]
 },
 {
  "id": 124,
  "title": "Binary Tree Maximum Path Sum",
  "day": 15,
  "order": 2,
  "topic": "Trees",
  "difficulty": "Hard",
  "leetcodeUrl": "https://leetcode.com/problems/binary-tree-maximum-path-sum/",
  "neetcodeUrl": null,
  "leetcodePremium": false,
  "hints": [
   "A best path may use both children of a node, but think about what a parent can use from that node.",
   "A node can pass up only one downward branch to its parent, never both.",
   "DFS returns node + max(0, bestLeft, bestRight) to the parent; update a global max with node + max(0,left) + max(0,right)."
  ]
 },
 {
  "id": 212,
  "title": "Word Search II",
  "day": 15,
  "order": 3,
  "topic": "Tries",
  "difficulty": "Hard",
  "leetcodeUrl": "https://leetcode.com/problems/word-search-ii/",
  "neetcodeUrl": null,
  "leetcodePremium": false,
  "hints": [
   "Running a grid search per word is too slow when there are many words.",
   "Words that share prefixes can share work.",
   "Build a trie of all words, DFS from every cell following trie edges, mark cells visited, collect words at end nodes, and prune exhausted branches."
  ]
 },
 {
  "id": 295,
  "title": "Find Median from Data Stream",
  "day": 15,
  "order": 4,
  "topic": "Heap / Priority Queue",
  "difficulty": "Hard",
  "leetcodeUrl": "https://leetcode.com/problems/find-median-from-data-stream/",
  "neetcodeUrl": null,
  "leetcodePremium": false,
  "hints": [
   "The median sits at the boundary between a lower half and an upper half.",
   "Which two values do you need quick access to: the largest of the lower half and the smallest of the upper half?",
   "Max-heap for the lower half, min-heap for the upper half; keep their sizes within 1 of each other; median from the tops."
  ]
 },
 {
  "id": 269,
  "title": "Alien Dictionary",
  "day": 15,
  "order": 5,
  "topic": "Advanced Graphs",
  "difficulty": "Hard",
  "leetcodeUrl": "https://leetcode.com/problems/alien-dictionary/",
  "neetcodeUrl": "https://neetcode.io/problems/foreign-dictionary",
  "leetcodePremium": true,
  "hints": [
   "Adjacent words in a sorted list reveal ordering between some characters.",
   "Compare each neighbouring pair at the first position where they differ.",
   "Build edges from those differences and topologically sort. Watch invalid input like 'abc' before 'ab', and return empty on a cycle."
  ]
 }
]
```
