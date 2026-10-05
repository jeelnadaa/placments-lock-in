import { Problem, Progress } from '../types';
import { getDaysDiff, toLocalDateString } from './streaks';

/**
 * Given a study plan start date string (YYYY-MM-DD), calculate the current plan day (1..15).
 * If today is before start date, returns 1.
 * If today is more than 15 days past start date, returns 15 (or user can clamp).
 */
export function calculateCurrentPlanDay(
  startDateStr: string,
  referenceDate: Date = new Date()
): number {
  if (!startDateStr) return 1;
  const todayStr = toLocalDateString(referenceDate);
  const diffDays = getDaysDiff(startDateStr, todayStr);
  const day = diffDays + 1;
  if (day < 1) return 1;
  if (day > 15) return 15;
  return day;
}

/**
 * Get target calendar date string for Day N based on Start Date
 */
export function getDateForPlanDay(startDateStr: string, dayNumber: number): string {
  if (!startDateStr) return '';
  const d = new Date(`${startDateStr}T00:00:00`);
  d.setDate(d.getDate() + (dayNumber - 1));
  return toLocalDateString(d);
}

/**
 * Identify any problems from earlier days (days < currentPlanDay) that are NOT solved.
 */
export function getBehindScheduleProblems(
  problems: Problem[],
  progressMap: Map<number, Progress> | Record<number, Progress>,
  currentPlanDay: number
): Problem[] {
  const getProg = (id: number): Progress | undefined => {
    if (progressMap instanceof Map) return progressMap.get(id);
    return progressMap[id];
  };

  return problems.filter((problem) => {
    if (problem.day >= currentPlanDay) return false;
    const prog = getProg(problem.id);
    return !prog || prog.status !== 'SOLVED';
  });
}
