# ⚡ Locked-In: Blind 75 Study Plan & Java IDE Guide

Welcome to **Locked-In** — a local-first, distraction-free study environment engineered specifically for mastering the **Blind 75** algorithm patterns over an intensive **15-Day Study Plan**.

---

## 🎯 What is This App?

Unlike generic problem trackers, **Locked-In** is built from the ground up to train your **pattern recognition instincts**:

1. **Strict Zero-Spoiler Environment**: Topics and hints are locked behind progressive gates. Zero DOM, tooltip, or search-index leaks exist before you deliberately choose to reveal them.
2. **15-Day Interleaving Schedule**: 5 problems per day from 5 *different* pattern categories (e.g., Arrays, Trees, Dynamic Programming, Two Pointers, Graphs). This builds durable cross-topic muscle memory instead of grinding the same pattern repetitively.
3. **Immutable Code Versioning**: Save your work as versions (`v1`, `v2`, `v3`) with mandatory Big-O Time & Space complexities, side-by-side diffing, and star ratings for your best solutions.
4. **100% Local & Private**: All code versions, notes, submissions, custom testcases, and streak data live strictly in your browser's IndexedDB. No accounts, no subscriptions, no cloud tracking.

---

## 💻 Two Ways to Practice

You have total flexibility in how you practice each problem:

### Option 1: Run & Judge Java Code Locally (Recommended)
You don't need to switch tabs or open external websites to solve problems!
- **Built-in Java Editor**: Full syntax highlighting, auto-indentation, smart bracket matching, and a live Java linter catching syntax errors (semicolons, variable scope, `==` vs `.equals()`, missing return statements).
- **Run Locally (`Ctrl + '`)**: Compiles and executes your code against sample test cases and custom test cases in a split-second.
- **Submit Against Judge (`Ctrl + Enter`)**: Runs your solution against the comprehensive hidden judge test suite in the local Java runtime with instant verdicts:
  - `Accepted` (with execution time in milliseconds and confetti)
  - `Wrong Answer` (shows only the first failing test input and your output)
  - `Time Limit Exceeded` (timeout protection against infinite loops)
  - `Compile Error` & `Runtime Error` (with exact line numbers and stack traces)
- **Custom Testcases**: Add your own edge cases or click **"Add to custom testcases"** whenever an unexpected test fails.
- **Judge Sandbox**: Click **`🧪 Judge Sandbox`** in the top navigation anytime to test problem #0, check your local Java runtime health, and verify timeouts/runtime exceptions.

### Option 2: Solve on External Platforms (LeetCode / NeetCode)
If you prefer solving directly on LeetCode or NeetCode, or want to write code in another language (Python, C++, Go, etc.):
- Every problem card has direct links:
  - ↗️ **LeetCode**: Opens the official LeetCode problem statement in a new tab.
  - ↗️ **NeetCode**: Opens NeetCode's curated video explanation and roadmap in a new tab.
- Once you solve it externally:
  - Paste your solution into the editor to log it as an immutable version with your Big-O complexities.
  - Mark the problem as `Solved` in the dropdown or status selector to track your 15-day streak.

---

## 🛡️ The Zero-Spoiler Rulebook

Real technical interviews don't tell you: *"This is a Two-Pointer problem"* or *"Hint: Use a Min-Heap"*.
- **Topics are Locked**: Problem titles appear without topic badges. The topic name will never appear in the DOM or search index until you click `Reveal Topic` or solve the problem.
- **Progressive Hints (1 → 2 → 3)**: Hints unlock strictly in sequence. You cannot jump to Hint 3 without reading Hint 1 and Hint 2 first.
- **Global Re-Hide**: Click `Re-Hide All Spoilers` in the navigation or settings whenever you want to reset your pattern testing baseline.

---

## ⏱️ Interview & Productivity Tools

- **Built-in Stopwatch**: Time your attempts directly inside the workspace. When you submit an `Accepted` solution, your solve time is automatically recorded.
- **Interview Mode**: A one-click toggle in the workspace that completely hides hint accordions and topic details, simulating real whiteboarding pressure.
- **Code Diff Viewer**: Compare your brute-force `v1` with your optimal `v2` to see line-by-line syntax diffs and Big-O improvements.
- **Offline Data Backup**: Export your full progress, submissions, custom testcases, and code versions to JSON anytime from the Settings page.

---

## 🚀 Quick Navigation

- **15-Day Plan**: Interleaving daily problem lists that remember the exact day you left.
- **All Problems**: Search, filter by difficulty (Easy/Medium/Hard), completion status, and topics.
- **Dashboard**: Track streaks, solve distribution, today's schedule, and behind-schedule alerts.
- **Judge Sandbox**: Interactive playground to test the local Java compiler and test harness.
