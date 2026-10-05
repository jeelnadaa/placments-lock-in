import { describe, it, expect } from 'vitest';
import {
  getNextVersionNumber,
  createNewCodeVersion,
  restoreAsNewVersion,
  updateVersionMetadata,
} from '../utils/versioning';
import { CodeVersion } from '../types';

describe('Versioning Logic', () => {
  it('should auto-increment version number correctly', () => {
    expect(getNextVersionNumber([])).toBe(1);

    const v1: CodeVersion = {
      id: '1',
      problemId: 1,
      versionNumber: 1,
      language: 'java',
      code: 'class Solution {}',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      remarks: '',
      isBest: false,
      createdAt: '2026-01-01T00:00:00Z',
    };
    expect(getNextVersionNumber([v1])).toBe(2);

    // If v2 was deleted and we have v1 and v3:
    const v3: CodeVersion = { ...v1, id: '3', versionNumber: 3 };
    expect(getNextVersionNumber([v1, v3])).toBe(4);
  });

  it('should require time and space complexity to create a version', () => {
    expect(() =>
      createNewCodeVersion({
        problemId: 1,
        code: 'class Solution {}',
        timeComplexity: '',
        spaceComplexity: 'O(1)',
      })
    ).toThrow('Time complexity is required');

    expect(() =>
      createNewCodeVersion({
        problemId: 1,
        code: 'class Solution {}',
        timeComplexity: 'O(n)',
        spaceComplexity: '   ',
      })
    ).toThrow('Space complexity is required');

    const v = createNewCodeVersion({
      problemId: 1,
      code: 'class Solution {}',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      label: 'Two Pointers',
    });

    expect(v.versionNumber).toBe(1);
    expect(v.timeComplexity).toBe('O(n)');
    expect(v.spaceComplexity).toBe('O(1)');
    expect(v.label).toBe('Two Pointers');
  });

  it('should restore an old version as a brand-new version with next version number and immutable history', () => {
    const v1 = createNewCodeVersion({
      problemId: 1,
      code: 'System.out.println("v1");',
      timeComplexity: 'O(n^2)',
      spaceComplexity: 'O(1)',
      label: 'Brute force',
      remarks: 'Double loop',
    });

    const v2 = createNewCodeVersion({
      problemId: 1,
      code: 'System.out.println("v2");',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      label: 'HashMap',
      existingVersions: [v1],
    });

    const restored = restoreAsNewVersion(v1, [v1, v2]);

    expect(restored.versionNumber).toBe(3);
    expect(restored.code).toBe(v1.code);
    expect(restored.timeComplexity).toBe(v1.timeComplexity);
    expect(restored.spaceComplexity).toBe(v1.spaceComplexity);
    expect(restored.label).toBe('Restored from v1');
    expect(restored.id).not.toBe(v1.id);
  });

  it('should allow updating metadata while code remains immutable', () => {
    const v1 = createNewCodeVersion({
      problemId: 1,
      code: 'original code',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
    });

    const updated = updateVersionMetadata(v1, {
      label: 'Optimal Solution',
      timeComplexity: 'O(log n)',
      spaceComplexity: 'O(1)',
      remarks: 'Added proof of correctness',
    });

    expect(updated.code).toBe('original code'); // unchanged
    expect(updated.label).toBe('Optimal Solution');
    expect(updated.timeComplexity).toBe('O(log n)');
    expect(updated.updatedAt).toBeDefined();
  });
});
