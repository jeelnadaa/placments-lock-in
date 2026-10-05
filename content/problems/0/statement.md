# 0. Judge Diagnostic & Sandbox

Welcome to the **Local Judge Diagnostic & Playground**. This problem is built specifically to test and verify every capability of the local Java runtime bridge and testcase runner.

---

### Problem Description

Implement a function `runDiagnostic(int[] nums, String mode, int target)` that receives an array of integers `nums`, an operation string `mode`, and an integer `target`.

The method performs the operation specified by `mode`:
1. **`"SUM"`**:
   Computes the sum of all elements in `nums` plus `target`, and returns an array containing that single sum: `new int[]{ sum }`.
2. **`"FILTER"`**:
   Returns an array containing only the elements of `nums` that are strictly greater than `target`, preserving their original order.
3. **`"REVERSE"`**:
   Returns an array with the elements of `nums` in reverse order.
4. **Any other mode (e.g. `"DEFAULT"`)**:
   Returns `new int[]{ nums.length, target }`.

---

### Examples

**Example 1:**
- **Input:** `nums = [1, 2, 3, 4]`, `mode = "SUM"`, `target = 10`
- **Output:** `[20]`
- **Explanation:** Sum of `[1, 2, 3, 4]` is 10. `10 + target (10) = 20`.

**Example 2:**
- **Input:** `nums = [5, 1, 9, 2, 8]`, `mode = "FILTER"`, `target = 4`
- **Output:** `[5, 9, 8]`
- **Explanation:** Elements strictly greater than 4 are 5, 9, 8.

**Example 3:**
- **Input:** `nums = [10, 20, 30]`, `mode = "REVERSE"`, `target = 0`
- **Output:** `[30, 20, 10]`
- **Explanation:** Reversed array.

---

### Working Answer Code (Copy to Test "Accepted")

```java
import java.util.*;
import java.io.*;
import java.lang.*;

class Solution {
    public int[] runDiagnostic(int[] nums, String mode, int target) {
        if ("SUM".equals(mode)) {
            int sum = target;
            for (int x : nums) {
                sum += x;
            }
            return new int[]{sum};
        }
        if ("FILTER".equals(mode)) {
            List<Integer> list = new ArrayList<>();
            for (int x : nums) {
                if (x > target) {
                    list.add(x);
                }
            }
            int[] res = new int[list.size()];
            for (int i = 0; i < list.size(); i++) {
                res[i] = list.get(i);
            }
            return res;
        }
        if ("REVERSE".equals(mode)) {
            int[] res = new int[nums.length];
            for (int i = 0; i < nums.length; i++) {
                res[i] = nums[nums.length - 1 - i];
            }
            return res;
        }
        return new int[]{nums.length, target};
    }
}
```

---

### Diagnostic Test Guide (Try These Experiments!)

1. **Verify Accepted Code**: Paste the answer code above and click **Run Code** (sample tests) or **Submit** (all hidden tests). All testcases should pass and display `Accepted`.
2. **Verify Failing Testcase Reveal**: Change `int sum = target;` to `int sum = 0;` and click **Submit**. Notice how only the single first failing testcase is revealed with its Input, Expected, and Actual values!
3. **Verify Compile-Time Error**: Remove a semicolon on line 8 or change `int sum` to `unknownType sum`. Click **Run Code**. Notice the purple **Compile Error** banner, the line number pill, the syntax snippet, and the caret pointer (`^`).
4. **Verify Runtime Error**: Add `if (target == 0) throw new NullPointerException("Deliberate diagnostic test exception");` and click **Run Code**. Notice the red **Runtime Error** card showing the exception name, message, and clickable `Solution.java` frame line.
5. **Verify Time Limit Exceeded**: Add `while(true){}` inside the method and click **Run Code**. Notice the judge cleanly terminates within ~2 seconds and returns **Time Limit Exceeded** without crashing or freezing.
