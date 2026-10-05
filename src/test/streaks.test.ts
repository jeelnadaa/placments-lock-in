import { describe, it, expect } from 'vitest';
import { calculateStreaks } from '../utils/streaks';

describe('Streak Calculation', () => {
  const refDate = new Date('2026-10-05T12:00:00Z');

  it('should return 0 for empty solved dates', () => {
    const res = calculateStreaks([], refDate);
    expect(res.currentStreak).toBe(0);
    expect(res.longestStreak).toBe(0);
  });

  it('should count 1 streak for a single problem solved today', () => {
    const res = calculateStreaks(['2026-10-05T08:00:00Z'], refDate);
    expect(res.currentStreak).toBe(1);
    expect(res.longestStreak).toBe(1);
  });

  it('should count streak if last solved was yesterday', () => {
    // Solved 2026-10-04, today is 2026-10-05: streak is still 1 (awaiting today's solve)
    const res = calculateStreaks(['2026-10-04T15:00:00Z'], refDate);
    expect(res.currentStreak).toBe(1);
    expect(res.longestStreak).toBe(1);
  });

  it('should count consecutive days correctly', () => {
    const dates = [
      '2026-10-02T10:00:00Z',
      '2026-10-03T11:00:00Z',
      '2026-10-04T12:00:00Z',
      '2026-10-05T09:00:00Z',
    ];
    const res = calculateStreaks(dates, refDate);
    expect(res.currentStreak).toBe(4);
    expect(res.longestStreak).toBe(4);
  });

  it('should reset current streak to 0 if gap is > 1 day', () => {
    // Solved on Oct 1, Oct 2, Oct 3. Today is Oct 5 (gap on Oct 4)
    const dates = [
      '2026-10-01T10:00:00Z',
      '2026-10-02T11:00:00Z',
      '2026-10-03T12:00:00Z',
    ];
    const res = calculateStreaks(dates, refDate);
    expect(res.currentStreak).toBe(0);
    expect(res.longestStreak).toBe(3);
  });

  it('should handle duplicate solves on the same calendar day properly', () => {
    const dates = [
      '2026-10-04T10:00:00Z',
      '2026-10-04T14:00:00Z',
      '2026-10-05T08:00:00Z',
      '2026-10-05T18:00:00Z',
    ];
    const res = calculateStreaks(dates, refDate);
    expect(res.currentStreak).toBe(2);
    expect(res.longestStreak).toBe(2);
    expect(res.activeDatesCount).toBe(2);
  });
});
