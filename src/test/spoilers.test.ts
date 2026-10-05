import { describe, it, expect } from 'vitest';
import { getSafeProblemView } from '../utils/spoilers';
import { Problem, Progress } from '../types';

describe('Spoiler Safety Logic & Single Accessor', () => {
  const dummyProblem: Problem = {
    id: 1,
    title: 'Two Sum',
    day: 1,
    order: 1,
    topic: 'Arrays & Hashing',
    difficulty: 'Easy',
    leetcodeUrl: 'https://leetcode.com/problems/two-sum/',
    neetcodeUrl: 'https://neetcode.io/problems/two-integer-sum',
    leetcodePremium: false,
    hints: [
      'Hint 1: Think about what you are searching for',
      'Hint 2: Can you look up complements instantly?',
      'Hint 3: Scan once with a hash map',
    ],
  };

  it('should return null topic and empty hints on default/initial state with spoilerSafeMode ON', () => {
    const safeView = getSafeProblemView(dummyProblem, undefined, true);

    expect(safeView.isTopicRevealed).toBe(false);
    expect(safeView.topic).toBeNull();
    expect(safeView.revealedHints).toEqual([]);
    expect(safeView.hintsRevealedCount).toBe(0);
    expect(safeView.nextAvailableHintIndex).toBe(1);
  });

  it('should reveal hints strictly sequentially (1 -> 2 -> 3)', () => {
    // Hint 1 revealed
    const progHint1: Progress = {
      problemId: 1,
      status: 'IN_PROGRESS',
      remarks: '',
      topicRevealed: false,
      hintsRevealed: 1,
      lastUpdatedAt: new Date().toISOString(),
    };
    const view1 = getSafeProblemView(dummyProblem, progHint1, true);
    expect(view1.revealedHints.length).toBe(1);
    expect(view1.revealedHints[0]).toBe('Hint 1: Think about what you are searching for');
    expect(view1.nextAvailableHintIndex).toBe(2);
    // Crucial: hint 2 and 3 must not be in revealedHints!
    expect(JSON.stringify(view1.revealedHints)).not.toContain('Hint 2');
    expect(JSON.stringify(view1.revealedHints)).not.toContain('Hint 3');

    // Hint 2 revealed
    const progHint2: Progress = { ...progHint1, hintsRevealed: 2 };
    const view2 = getSafeProblemView(dummyProblem, progHint2, true);
    expect(view2.revealedHints.length).toBe(2);
    expect(view2.revealedHints[1]).toBe('Hint 2: Can you look up complements instantly?');
    expect(view2.nextAvailableHintIndex).toBe(3);
    expect(JSON.stringify(view2.revealedHints)).not.toContain('Hint 3');

    // Hint 3 revealed
    const progHint3: Progress = { ...progHint1, hintsRevealed: 3 };
    const view3 = getSafeProblemView(dummyProblem, progHint3, true);
    expect(view3.revealedHints.length).toBe(3);
    expect(view3.nextAvailableHintIndex).toBeNull();
  });

  it('should reveal topic only when topicRevealed is true', () => {
    const progWithTopic: Progress = {
      problemId: 1,
      status: 'NOT_STARTED',
      remarks: '',
      topicRevealed: true,
      hintsRevealed: 0,
      lastUpdatedAt: new Date().toISOString(),
    };
    const view = getSafeProblemView(dummyProblem, progWithTopic, true);
    expect(view.isTopicRevealed).toBe(true);
    expect(view.topic).toBe('Arrays & Hashing');
  });

  it('should reveal all topics and hints if Spoiler-Safe Mode is turned OFF', () => {
    const safeView = getSafeProblemView(dummyProblem, undefined, false);
    expect(safeView.isTopicRevealed).toBe(true);
    expect(safeView.topic).toBe('Arrays & Hashing');
    expect(safeView.revealedHints.length).toBe(3);
    expect(safeView.nextAvailableHintIndex).toBeNull();
  });

  it('should re-hide topic and hints when progress is reset', () => {
    const progRehidden: Progress = {
      problemId: 1,
      status: 'SOLVED',
      remarks: '',
      topicRevealed: false,
      hintsRevealed: 0,
      lastUpdatedAt: new Date().toISOString(),
    };
    const view = getSafeProblemView(dummyProblem, progRehidden, true);
    expect(view.isTopicRevealed).toBe(false);
    expect(view.topic).toBeNull();
    expect(view.revealedHints).toEqual([]);
  });
});
