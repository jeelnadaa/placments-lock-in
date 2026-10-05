# Blind 75 Tracker — Study Plan & Java Code Log

A minimalist, dark-themed, local-first web application designed for mastering the **Blind 75** algorithm patterns over a 15-day study plan.

The app is built specifically to protect and train your pattern recognition instincts: topics and hints remain strictly locked behind progressive dropdowns with zero DOM leakage until you deliberately unlock them.

---

## ⚡ Key Highlights & Features

### 1. 🛡️ Critical Spoiler-Safe Mode (Section 4.3.1)
- **Zero DOM Leakage**: Topics and hints do not exist in the DOM, tooltips, `title`/`aria-label` attributes, URLs, or search indexes until explicitly revealed. Ctrl+F will never accidentally find a problem's pattern or hint.
- **Single Accessor Architecture**: All UI components consume problem data exclusively through `getSafeProblemView()`, preventing any component from accidentally rendering unrevealed topic strings or hints.
- **Progressive Sequential Hints (1 → 2 → 3)**: Hints unlock one at a time, in order. Hint $N+1$ cannot be seen until Hint $N$ has been unlocked.
- **Per-Problem & Global Re-Hide**: Instant "Re-hide" actions restore problems to their hidden state.
- **Auto-Reveal on Solve**: Marking a problem as `Solved` can automatically reveal its topic category (toggleable in Settings, default ON).
- **Muted Topic Breakdown**: The dashboard topic breakdown lives inside a collapsed dropdown and lists *only* topics you have revealed, keeping unrevealed topics completely obscured.

### 2. 📝 Append-Only Java Code Versioning (Section 4.4)
- **Immutable Code**: Once saved, code cannot be silently overwritten. Editing code creates a new version (`v1`, `v2`, `v3`...).
- **Required Complexity**: Time and Space Big-O complexity are required fields with dropdown combos and custom input.
- **Side-by-Side & Unified Diff**: Compare any two versions to inspect code changes, time/space complexity progression, and remarks.
- **Restore as New Version**: Revert to an earlier implementation without erasing history (creates `vN+1`).
- **Star Best Solution**: Flag your cleanest or most optimal version as the "Best Solution".
- **Syntax Highlighting**: Java syntax highlighting via CodeMirror 6 with line numbers and bracket matching. **Zero code execution or compilation** — purely focused on algorithm design and review.

### 3. 📅 15-Day Study Plan & Dashboard
- **5 Problems Per Day from 5 Different Topics**: Interleaving practice ensures you never grind a single pattern in isolation.
- **Dynamic Start Date**: Set your start date in Settings; Day $N$ maps to `startDate + (N-1)`.
- **Today's Plan**: Dashboard highlights today's 5 problems with status chips and inline spoiler controls.
- **Behind Schedule Alert**: Flags unsolved problems from earlier days with 1-click navigation.
- **Streak Tracker & Hint Independence**: Live calculation of current and longest consecutive day streaks, plus a "Solved without hints: X / Y" metric.

### 4. 💾 Local-First Persistence & Export / Import
- **IndexedDB via Dexie.js**: All data is saved directly in your browser. Works completely offline with zero backend and no telemetry.
- **Idempotent Seeding**: The 75 problems from NeetCode's Blind 75 are seeded once and never overwrite your progress.
- **Clear Track Option**: A dedicated "Danger Zone" in Settings and header allows you to reset all progress, remarks, and code back to Day 1 with explicit `RESET` confirmation.
- **JSON Export / Import**: Full backup of progress, code versions, and settings with schema validation and choice between Replace or Merge.
- **Markdown Study Report**: Export a readable Markdown document of all solved problems (includes topic only if revealed; never includes hints).

### 5. 🎨 Design Aesthetics
- **Satoshi Font**: Modern sans-serif typography loaded by default.
- **Minimalist Dark Monochrome Theme**: Deep neutral backgrounds (`#09090b`), high-contrast borders, refined monochrome badges, and subtle micro-interactions.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (tested on Node v20/v24)
- npm or pnpm

### Installation
```bash
# Clone or navigate to the repository
cd d:/locked-in

# Install dependencies
npm install
```

### Development
Start the local Vite development server:
```bash
npm run dev
```
Open [http://localhost:5173/](http://localhost:5173/) in your browser.

### Production Build
Type-check with TypeScript and build the optimized production bundle:
```bash
npm run build
```
Preview the production build:
```bash
npm run preview
```

### Unit Tests
Run the Vitest test suite covering versioning, streaks, schedule, spoilers, and acceptance criteria:
```bash
npm test
```

---

## 📂 Project Architecture

```
locked-in/
├── src/
│   ├── components/
│   │   ├── common/         # Badges, Modals, Toasts
│   │   ├── dashboard/      # Progress metrics, streaks, today's plan, topic breakdown
│   │   ├── editor/         # CodeMirror Java editor, CodeDiffViewer
│   │   ├── layout/         # Sticky Navbar with live streak and quick reset
│   │   ├── plan/           # 15-day plan tabs and daily problem lists
│   │   ├── problems/       # All Problems table with filters, Problem Detail page
│   │   ├── settings/       # Settings, export/import, re-hide, clear track
│   │   └── spoilers/       # Reusable SpoilerControl component
│   ├── data/
│   │   ├── seedProblems.json # All 75 problems extracted from spec
│   ├── db/
│   │   └── db.ts           # Dexie IndexedDB tables, migrations, and seeding
│   ├── test/               # Vitest test suites (28 tests across 6 files)
│   │   ├── acceptanceCriteria.test.tsx
│   │   ├── importExport.test.ts
│   │   ├── schedule.test.ts
│   │   ├── spoilers.test.ts
│   │   ├── streaks.test.ts
│   │   └── versioning.test.ts
│   ├── types/
│   │   └── index.ts        # Problem, Progress, CodeVersion, Settings, SafeProblemView
│   ├── utils/              # Pure logic utilities
│   │   ├── importExport.ts
│   │   ├── schedule.ts
│   │   ├── spoilers.ts     # Single-accessor spoiler isolation
│   │   ├── streaks.ts
│   │   └── versioning.ts
│   ├── App.tsx             # Root application with Dexie live queries
│   ├── index.css           # Tailwind directives, custom scrollbars, dark styles
│   └── main.tsx            # React root mount
├── blind75-tracker-spec.md # The single source of truth spec
├── index.html              # HTML shell with Satoshi font
├── package.json            # Scripts & dependencies
├── tailwind.config.js      # Satoshi font and monochrome theme tokens
├── tsconfig.json           # Strict TypeScript configuration
└── vite.config.ts          # Vite & Vitest configuration
```

---

## 🧪 Acceptance Criteria Verification Matrix

| Criterion | Requirement | Verification Method | Status |
|---|---|---|---|
| **4.8.1** | Fresh install loads all 75 problems grouped into 15 days × 5 | Tested in `acceptanceCriteria.test.tsx` & Dexie seed | ✅ PASS |
| **4.8.2** | Set status, remarks, Java code with required time & space complexity | Tested in `versioning.test.ts` & `ProblemDetailView.tsx` | ✅ PASS |
| **4.8.3** | Append-only versions (v2, v3...); old versions unchanged | Tested in `versioning.test.ts` | ✅ PASS |
| **4.8.4** | Diff any two versions and restore old version as new version | Tested in `versioning.test.ts` & `CodeDiffViewer.tsx` | ✅ PASS |
| **4.8.5** | Dashboard progress, topic bars, streak, and today's plan update live | Tested in `DashboardView.tsx` & Dexie reactive live queries | ✅ PASS |
| **4.8.6** | Export → wipe → import fully restores all data and versions | Tested in `importExport.test.ts` & `SettingsView.tsx` | ✅ PASS |
| **4.8.7** | Refreshing browser loses nothing (IndexedDB persistence) | Handled by Dexie IndexedDB persistence layer | ✅ PASS |
| **4.8.8** | Core logic unit tests pass | 28 automated Vitest unit tests | ✅ PASS |
| **4.8.9** | Zero topic or hint text appears in DOM or UI on initial load | Verified via `acceptanceCriteria.test.tsx` (DOM scan) | ✅ PASS |
| **4.8.10**| Hints unlock strictly in order (1 → 2 → 3); re-hide resets | Tested in `acceptanceCriteria.test.tsx` & `spoilers.test.ts` | ✅ PASS |
| **4.8.11**| Solved auto-reveals topic; breakdown lists only revealed topics | Tested in `DashboardView.tsx` & `spoilers.test.ts` | ✅ PASS |
| **4.8.12**| Same topic & hints dropdowns in Plan, All Problems, and Today's Plan | Reusable `SpoilerControl.tsx` used in all views | ✅ PASS |

---

## 🛡️ Data Storage & Privacy

All problem progress, remarks, code versions, and configuration settings are stored locally on your device in browser **IndexedDB** using Dexie.js.

- **No backend servers, no analytics, no external trackers.**
- Only external connections are direct links opening LeetCode and NeetCode when clicked.
- To transfer your study progress between devices or browsers, use the **Export JSON** and **Import JSON** features in Settings.
- To start over with a fresh study plan, use the **Reset Track** button.
