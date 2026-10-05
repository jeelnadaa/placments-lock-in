import { describe, it, expect } from 'vitest';
import {
  exportAppToJson,
  validateImportData,
  generateMarkdownReport,
} from '../utils/importExport';
import { CodeVersion, Problem, Progress } from '../types';

describe('Import and Export Logic', () => {
  const dummyProgress: Progress[] = [
    {
      problemId: 1,
      status: 'SOLVED',
      remarks: 'Hash map approach is optimal',
      topicRevealed: true,
      hintsRevealed: 0,
      firstSolvedAt: '2026-10-01T10:00:00Z',
      lastUpdatedAt: '2026-10-01T10:00:00Z',
    },
    {
      problemId: 2,
      status: 'IN_PROGRESS',
      remarks: 'Need to review edge cases',
      topicRevealed: false,
      hintsRevealed: 1,
      lastUpdatedAt: '2026-10-02T10:00:00Z',
    },
  ];

  const dummyVersions: CodeVersion[] = [
    {
      id: 'v1-id',
      problemId: 1,
      versionNumber: 1,
      label: 'Optimal Solution',
      language: 'java',
      code: 'class Solution {\n  public int[] twoSum() {}\n}',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      remarks: 'Single pass',
      isBest: true,
      createdAt: '2026-10-01T10:00:00Z',
    },
  ];

  const dummyProblems: Problem[] = [
    {
      id: 1,
      title: 'Two Sum',
      day: 1,
      order: 1,
      topic: 'Arrays & Hashing',
      difficulty: 'Easy',
      leetcodeUrl: 'https://leetcode.com',
      neetcodeUrl: null,
      leetcodePremium: false,
      hints: ['Hint 1 secret', 'Hint 2 secret', 'Hint 3 secret'],
    },
    {
      id: 2,
      title: 'Valid Palindrome',
      day: 1,
      order: 2,
      topic: 'Two Pointers',
      difficulty: 'Easy',
      leetcodeUrl: 'https://leetcode.com',
      neetcodeUrl: null,
      leetcodePremium: false,
      hints: ['Hint A secret', 'Hint B secret', 'Hint C secret'],
    },
  ];

  it('should export state to valid JSON string and re-validate it', () => {
    const jsonStr = exportAppToJson({
      progress: dummyProgress,
      codeVersions: dummyVersions,
    });

    const parsed = JSON.parse(jsonStr);
    expect(parsed.version).toBe(1);
    expect(parsed.progress.length).toBe(2);
    expect(parsed.codeVersions.length).toBe(1);

    const validation = validateImportData(parsed);
    expect(validation.valid).toBe(true);
    expect(validation.data?.progress.length).toBe(2);
  });

  it('should reject invalid import data schema', () => {
    expect(validateImportData(null).valid).toBe(false);
    expect(validateImportData('string').valid).toBe(false);
    expect(validateImportData({ version: 2 }).valid).toBe(false);
    expect(validateImportData({ version: 1, progress: 'not-array' }).valid).toBe(false);
    expect(
      validateImportData({
        version: 1,
        progress: [{ problemId: 'not-a-number' }],
        codeVersions: [],
      }).valid
    ).toBe(false);
  });

  it('should generate Markdown report with revealed topics only and NEVER include hint text', () => {
    const report = generateMarkdownReport({
      problems: dummyProblems,
      progressList: dummyProgress,
      codeVersions: dummyVersions,
      spoilerSafeMode: true,
    });

    // Problem 1 is SOLVED with topic revealed
    expect(report).toContain('Two Sum');
    expect(report).toContain('Arrays & Hashing');
    expect(report).toContain('O(n)');
    expect(report).toContain('class Solution');

    // Problem 2 is IN_PROGRESS (not solved), so not in solved report
    expect(report).not.toContain('Valid Palindrome');

    // CRITICAL: Hint text must NEVER be in the Markdown report
    expect(report).not.toContain('Hint 1 secret');
    expect(report).not.toContain('Hint 2 secret');
    expect(report).not.toContain('Hint A secret');
  });
});
