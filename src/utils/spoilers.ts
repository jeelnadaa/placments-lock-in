import { Problem, Progress, SafeProblemView } from '../types';

/**
 * SINGLE ACCESSOR for exposing problem data to the UI.
 *
 * CRITICAL SPEC REQUIREMENT (Section 4.3.1):
 * Hidden text must not exist in the DOM, tooltips, aria-labels, page titles, or URLs
 * until revealed (Ctrl+F must not find it).
 *
 * Expose topic/hints to the UI ONLY through this accessor so no component can
 * accidentally render unrevealed topics or hint strings.
 */
export function getSafeProblemView(
  problem: Problem,
  progress?: Progress,
  spoilerSafeMode: boolean = true
): SafeProblemView {
  const hintsCount = problem.hints ? problem.hints.length : 3;

  // If Spoiler-Safe Mode is turned OFF completely by the user in Settings
  if (!spoilerSafeMode) {
    return {
      id: problem.id,
      title: problem.title,
      day: problem.day,
      order: problem.order,
      difficulty: problem.difficulty,
      leetcodeUrl: problem.leetcodeUrl,
      neetcodeUrl: problem.neetcodeUrl,
      leetcodePremium: problem.leetcodePremium,
      isTopicRevealed: true,
      topic: problem.topic,
      revealedHints: [...problem.hints],
      hintsRevealedCount: hintsCount,
      totalHints: hintsCount,
      nextAvailableHintIndex: null,
    };
  }

  // When Spoiler-Safe Mode is ON:
  const isTopicRevealed = Boolean(progress?.topicRevealed);
  const hintsRevealedCount = Math.min(hintsCount, Math.max(0, progress?.hintsRevealed ?? 0));

  // Only slice the hints up to the revealed count.
  // Unrevealed hints are strictly NEVER included in the returned array.
  const revealedHints = problem.hints ? problem.hints.slice(0, hintsRevealedCount) : [];

  const nextAvailableHintIndex =
    hintsRevealedCount < hintsCount ? hintsRevealedCount + 1 : null;

  return {
    id: problem.id,
    title: problem.title,
    day: problem.day,
    order: problem.order,
    difficulty: problem.difficulty,
    leetcodeUrl: problem.leetcodeUrl,
    neetcodeUrl: problem.neetcodeUrl,
    leetcodePremium: problem.leetcodePremium,
    isTopicRevealed,
    // Topic is strictly null unless revealed
    topic: isTopicRevealed ? problem.topic : null,
    revealedHints,
    hintsRevealedCount,
    totalHints: hintsCount,
    nextAvailableHintIndex,
  };
}

/**
 * Helper to determine if a problem's topic can be displayed
 */
export function isTopicVisible(progress?: Progress, spoilerSafeMode: boolean = true): boolean {
  if (!spoilerSafeMode) return true;
  return Boolean(progress?.topicRevealed);
}

/**
 * Return the safe hint to reveal next
 */
export function getHintToReveal(problem: Problem, hintNumber: number): string | null {
  if (hintNumber < 1 || hintNumber > problem.hints.length) return null;
  return problem.hints[hintNumber - 1];
}
