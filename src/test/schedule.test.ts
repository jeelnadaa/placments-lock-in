import { describe, it, expect } from 'vitest';
import {
  calculateCurrentPlanDay,
  getDateForPlanDay,
  getBehindScheduleProblems,
} from '../utils/schedule';
import { Problem, Progress } from '../types';

describe('Schedule & Behind-Schedule Logic', () => {
  it('should map start date to Day 1 on start date, Day 2 on next day, etc.', () => {
    const startDate = '2026-10-01';

    const day1Ref = new Date('2026-10-01T10:00:00');
    expect(calculateCurrentPlanDay(startDate, day1Ref)).toBe(1);

    const day5Ref = new Date('2026-10-05T10:00:00');
    expect(calculateCurrentPlanDay(startDate, day5Ref)).toBe(5);

    // Day 20 clamped to 15
    const day20Ref = new Date('2026-10-25T10:00:00');
    expect(calculateCurrentPlanDay(startDate, day20Ref)).toBe(15);
  });

  it('should calculate calendar date for any plan day', () => {
    expect(getDateForPlanDay('2026-10-01', 1)).toBe('2026-10-01');
    expect(getDateForPlanDay('2026-10-01', 5)).toBe('2026-10-05');
  });

  it('should identify behind schedule problems from earlier days', () => {
    const problems: Problem[] = [
      { id: 1, title: 'Day 1 Prob', day: 1, order: 1, topic: 'A', difficulty: 'Easy', leetcodeUrl: '', neetcodeUrl: null, leetcodePremium: false, hints: [] },
      { id: 2, title: 'Day 1 Prob 2', day: 1, order: 2, topic: 'A', difficulty: 'Easy', leetcodeUrl: '', neetcodeUrl: null, leetcodePremium: false, hints: [] },
      { id: 3, title: 'Day 2 Prob', day: 2, order: 1, topic: 'B', difficulty: 'Easy', leetcodeUrl: '', neetcodeUrl: null, leetcodePremium: false, hints: [] },
      { id: 4, title: 'Day 3 Prob', day: 3, order: 1, topic: 'C', difficulty: 'Easy', leetcodeUrl: '', neetcodeUrl: null, leetcodePremium: false, hints: [] },
    ];

    const progressMap: Record<number, Progress> = {
      1: { problemId: 1, status: 'SOLVED', remarks: '', topicRevealed: false, hintsRevealed: 0, lastUpdatedAt: '' },
      2: { problemId: 2, status: 'IN_PROGRESS', remarks: '', topicRevealed: false, hintsRevealed: 0, lastUpdatedAt: '' },
      // 3 has no progress record, so not solved
    };

    // Current plan day is Day 3. Earlier days are Day 1 and Day 2.
    // Unsolved are: Problem 2 (Day 1) and Problem 3 (Day 2). Problem 4 is Day 3 (not earlier).
    const behind = getBehindScheduleProblems(problems, progressMap, 3);
    expect(behind.map((p) => p.id)).toEqual([2, 3]);
  });
});
