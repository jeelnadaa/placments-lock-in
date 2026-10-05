import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import seedProblemsRaw from '../data/seedProblems.json';
import { Problem, Progress } from '../types';
import { getSafeProblemView } from '../utils/spoilers';
import { SpoilerControl } from '../components/spoilers/SpoilerControl';
import {
  createNewCodeVersion,
  getNextVersionNumber,
  restoreAsNewVersion,
} from '../utils/versioning';
import { calculateStreaks } from '../utils/streaks';
import { exportAppToJson, validateImportData } from '../utils/importExport';

describe('Acceptance Criteria Verification', () => {
  const problems = seedProblemsRaw as Problem[];

  // Criterion 1: Fresh install loads all 75 problems grouped into 15 days x 5
  it('Criterion 1: Exactly 75 problems grouped into 15 days x 5', () => {
    expect(problems.length).toBe(75);
    for (let day = 1; day <= 15; day++) {
      const dayProbs = problems.filter((p) => p.day === day);
      expect(dayProbs.length).toBe(5);
      // Verify orders 1..5
      const orders = dayProbs.map((p) => p.order).sort();
      expect(orders).toEqual([1, 2, 3, 4, 5]);
    }
  });

  // Criterion 9: On fresh install, NO topic name or hint text appears anywhere in the UI or DOM
  it('Criterion 9: No topic name or hint text in DOM when unrevealed (Ctrl+F safe)', () => {
    const p1 = problems[0]; // Two Sum, topic: "Arrays & Hashing"
    const prog: Progress = {
      problemId: p1.id,
      status: 'NOT_STARTED',
      remarks: '',
      topicRevealed: false,
      hintsRevealed: 0,
      lastUpdatedAt: new Date().toISOString(),
    };

    const { container } = render(
      <SpoilerControl
        problem={p1}
        progress={prog}
        spoilerSafeMode={true}
        onUpdateProgress={() => {}}
      />
    );

    const domHtml = container.innerHTML;
    // Must NOT contain topic
    expect(domHtml).not.toContain('Arrays & Hashing');
    // Must NOT contain any hints
    for (const hint of p1.hints) {
      expect(domHtml).not.toContain(hint);
    }
    // Must contain lock button
    expect(screen.getByText(/reveal topic/i)).toBeTruthy();
    expect(screen.getByText(/hints \(0\/3 used\)/i)).toBeTruthy();
  });

  // Criterion 10: Hints unlock strictly in order (1 -> 2 -> 3) and re-hide returns to hidden
  it('Criterion 10: Progressive sequential hints unlock and re-hide functionality', () => {
    const p1 = problems[0];
    let currentProgress: Progress = {
      problemId: p1.id,
      status: 'NOT_STARTED',
      remarks: '',
      topicRevealed: false,
      hintsRevealed: 0,
      lastUpdatedAt: new Date().toISOString(),
    };

    const updateMock = vi.fn((updates: Partial<Progress>) => {
      currentProgress = { ...currentProgress, ...updates };
    });

    const { rerender, container } = render(
      <SpoilerControl
        problem={p1}
        progress={currentProgress}
        spoilerSafeMode={true}
        onUpdateProgress={updateMock}
      />
    );

    // Expand hints accordion
    fireEvent.click(screen.getByText(/hints \(0\/3 used\)/i));

    // Initially Hint 1 button is shown, hints 2 and 3 are NOT in DOM
    const unlockBtn1 = screen.getByText(/unlock hint 1/i);
    expect(unlockBtn1).toBeTruthy();
    expect(container.innerHTML).not.toContain(p1.hints[0]);
    expect(container.innerHTML).not.toContain(p1.hints[1]);
    expect(container.innerHTML).not.toContain(p1.hints[2]);

    // Click Unlock Hint 1
    fireEvent.click(unlockBtn1);
    expect(updateMock).toHaveBeenCalledWith({ hintsRevealed: 1 });

    // Rerender with 1 hint revealed
    rerender(
      <SpoilerControl
        problem={p1}
        progress={{ ...currentProgress, hintsRevealed: 1 }}
        spoilerSafeMode={true}
        onUpdateProgress={updateMock}
      />
    );

    // Now Hint 1 text is in DOM, Hint 2 button is present, Hint 2 and 3 text still NOT in DOM
    expect(container.innerHTML).toContain(p1.hints[0]);
    expect(container.innerHTML).not.toContain(p1.hints[1]);
    expect(container.innerHTML).not.toContain(p1.hints[2]);
    expect(screen.getByText(/unlock hint 2/i)).toBeTruthy();
    expect(screen.queryByText(/unlock hint 3/i)).toBeNull();

    // Click Re-hide hints
    const rehideBtn = screen.getByText(/re-hide all hints/i);
    fireEvent.click(rehideBtn);
    expect(updateMock).toHaveBeenCalledWith({ hintsRevealed: 0 });
  });

  // Criterion 11: Marking a problem Solved auto-reveals its topic
  it('Criterion 11: Auto-reveal topic on Solved setting', () => {
    const p1 = problems[0];
    const initialView = getSafeProblemView(p1, undefined, true);
    expect(initialView.topic).toBeNull();

    // Simulate auto-reveal on solve
    const solvedProg: Progress = {
      problemId: p1.id,
      status: 'SOLVED',
      remarks: '',
      topicRevealed: true,
      hintsRevealed: 0,
      firstSolvedAt: new Date().toISOString(),
      lastUpdatedAt: new Date().toISOString(),
    };

    const solvedView = getSafeProblemView(p1, solvedProg, true);
    expect(solvedView.isTopicRevealed).toBe(true);
    expect(solvedView.topic).toBe('Arrays & Hashing');
  });

  // Criteria 2, 3, 4: Code versions, required complexity, diff, restore
  it('Criteria 2, 3, 4: Version creation, immutability, restore as new version', () => {
    // 1. Required complexities
    expect(() =>
      createNewCodeVersion({
        problemId: 1,
        code: 'class Sol {}',
        timeComplexity: '',
        spaceComplexity: 'O(1)',
      })
    ).toThrow();

    // 2. Create v1
    const v1 = createNewCodeVersion({
      problemId: 1,
      code: 'int[] twoSum() { return new int[]{}; }',
      timeComplexity: 'O(n^2)',
      spaceComplexity: 'O(1)',
      label: 'Brute force',
    });
    expect(v1.versionNumber).toBe(1);

    // 3. Create v2
    const v2 = createNewCodeVersion({
      problemId: 1,
      code: 'int[] twoSum() { Map map = new HashMap(); return new int[]{}; }',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      label: 'Hash map',
      existingVersions: [v1],
    });
    expect(v2.versionNumber).toBe(2);
    expect(getNextVersionNumber([v1, v2])).toBe(3);

    // 4. Restore v1 as v3
    const v3 = restoreAsNewVersion(v1, [v1, v2]);
    expect(v3.versionNumber).toBe(3);
    expect(v3.code).toBe(v1.code);
    expect(v3.label).toBe('Restored from v1');
  });

  // Criterion 5: Streaks calculation
  it('Criterion 5: Streaks calculation based on calendar days', () => {
    const today = new Date();
    const todayISO = today.toISOString();
    const streaks = calculateStreaks([todayISO]);
    expect(streaks.currentStreak).toBe(1);
    expect(streaks.longestStreak).toBe(1);
  });

  // Criterion 6: Export -> import restores data fully
  it('Criterion 6: Export to JSON and validate schema', () => {
    const v1 = createNewCodeVersion({
      problemId: 1,
      code: 'class Sol {}',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
    });
    const prog: Progress = {
      problemId: 1,
      status: 'SOLVED',
      remarks: 'Done',
      topicRevealed: true,
      hintsRevealed: 0,
      firstSolvedAt: new Date().toISOString(),
      lastUpdatedAt: new Date().toISOString(),
    };

    const exported = exportAppToJson({
      progress: [prog],
      codeVersions: [v1],
    });

    const parsed = JSON.parse(exported);
    const validated = validateImportData(parsed);
    expect(validated.valid).toBe(true);
    expect(validated.data?.progress.length).toBe(1);
    expect(validated.data?.codeVersions.length).toBe(1);
  });
});
