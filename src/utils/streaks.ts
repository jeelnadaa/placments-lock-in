/**
 * Format a Date object or ISO string to YYYY-MM-DD in local time
 */
export function toLocalDateString(dateInput: Date | string): string {
  const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(d.getTime())) return '';
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Difference in whole days between two YYYY-MM-DD date strings
 */
export function getDaysDiff(dateStr1: string, dateStr2: string): number {
  const d1 = new Date(`${dateStr1}T00:00:00`);
  const d2 = new Date(`${dateStr2}T00:00:00`);
  const diffTime = d2.getTime() - d1.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

export interface StreakResult {
  currentStreak: number;
  longestStreak: number;
  activeDatesCount: number;
  lastActiveDate: string | null;
}

/**
 * Calculate streaks from solved dates.
 * A day counts if at least one problem was marked solved on that calendar day.
 */
export function calculateStreaks(
  solvedDateStrings: string[],
  referenceDate: Date = new Date()
): StreakResult {
  if (!solvedDateStrings || solvedDateStrings.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      activeDatesCount: 0,
      lastActiveDate: null,
    };
  }

  // Convert all to unique YYYY-MM-DD sorted ascending
  const uniqueDates = Array.from(
    new Set(
      solvedDateStrings
        .map((ds) => toLocalDateString(ds))
        .filter((d) => d.length === 10)
    )
  ).sort();

  if (uniqueDates.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      activeDatesCount: 0,
      lastActiveDate: null,
    };
  }

  // Calculate longest streak across history
  let longestStreak = 0;
  let runningStreak = 0;
  let prevDate: string | null = null;

  for (const dateStr of uniqueDates) {
    if (prevDate === null) {
      runningStreak = 1;
    } else {
      const diff = getDaysDiff(prevDate, dateStr);
      if (diff === 1) {
        runningStreak += 1;
      } else if (diff > 1) {
        runningStreak = 1;
      }
    }
    prevDate = dateStr;
    if (runningStreak > longestStreak) {
      longestStreak = runningStreak;
    }
  }

  // Calculate current streak relative to referenceDate (today)
  const todayStr = toLocalDateString(referenceDate);
  const lastActiveDate = uniqueDates[uniqueDates.length - 1];
  const diffFromToday = getDaysDiff(lastActiveDate, todayStr);

  let currentStreak = 0;
  // If the last activity was today (diff 0) or yesterday (diff 1), the streak is alive
  if (diffFromToday === 0 || diffFromToday === 1) {
    let count = 0;
    let expectedDate = lastActiveDate;

    for (let i = uniqueDates.length - 1; i >= 0; i--) {
      const cur = uniqueDates[i];
      const stepDiff = getDaysDiff(cur, expectedDate);
      if (stepDiff === 0) {
        count += 1;
        // set expected to previous calendar day
        const d = new Date(`${expectedDate}T00:00:00`);
        d.setDate(d.getDate() - 1);
        expectedDate = toLocalDateString(d);
      } else {
        break;
      }
    }
    currentStreak = count;
  } else {
    // If last active date is more than 1 day in the past, streak is broken (0)
    currentStreak = 0;
  }

  return {
    currentStreak,
    longestStreak,
    activeDatesCount: uniqueDates.length,
    lastActiveDate,
  };
}
