import { CodeVersion, SupportedLanguage } from '../types';

export const COMMON_COMPLEXITIES = [
  'O(1)',
  'O(log n)',
  'O(n)',
  'O(n log n)',
  'O(n²)',
  'O(2ⁿ)',
  'O(n!)',
  'O(V+E)',
  'O(m*n)',
];

/**
 * Generate a random UUID v4 fallback if crypto.randomUUID is unavailable
 */
export function generateUUID(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Get next auto-incrementing version number for a problem.
 * If there are existing versions [v1, v2, v5] (e.g. after deletion of v3, v4),
 * the next version is max(versionNumber) + 1.
 */
export function getNextVersionNumber(existingVersions: CodeVersion[]): number {
  if (!existingVersions || existingVersions.length === 0) return 1;
  const maxVersion = Math.max(...existingVersions.map((v) => v.versionNumber));
  return maxVersion + 1;
}

/**
 * Create a new CodeVersion instance
 */
export function createNewCodeVersion(params: {
  problemId: number;
  code: string;
  timeComplexity: string;
  spaceComplexity: string;
  remarks?: string;
  label?: string;
  language?: SupportedLanguage;
  existingVersions?: CodeVersion[];
  isBest?: boolean;
}): CodeVersion {
  const {
    problemId,
    code,
    timeComplexity,
    spaceComplexity,
    remarks = '',
    label,
    language = 'python',
    existingVersions = [],
    isBest = false,
  } = params;

  if (!timeComplexity?.trim()) {
    throw new Error('Time complexity is required');
  }
  if (!spaceComplexity?.trim()) {
    throw new Error('Space complexity is required');
  }

  const nextVer = getNextVersionNumber(existingVersions);

  return {
    id: generateUUID(),
    problemId,
    versionNumber: nextVer,
    label: label?.trim() || undefined,
    language,
    code,
    timeComplexity: timeComplexity.trim(),
    spaceComplexity: spaceComplexity.trim(),
    remarks: remarks || '',
    isBest,
    createdAt: new Date().toISOString(),
  };
}

/**
 * Restore an old version as a brand-new version, preserving history
 */
export function restoreAsNewVersion(
  oldVersion: CodeVersion,
  existingVersions: CodeVersion[]
): CodeVersion {
  const nextVer = getNextVersionNumber(existingVersions);
  return {
    id: generateUUID(),
    problemId: oldVersion.problemId,
    versionNumber: nextVer,
    label: `Restored from v${oldVersion.versionNumber}`,
    language: oldVersion.language || 'python',
    code: oldVersion.code,
    timeComplexity: oldVersion.timeComplexity,
    spaceComplexity: oldVersion.spaceComplexity,
    remarks: `Restored from version ${oldVersion.versionNumber}.${
      oldVersion.remarks ? ` Original remarks:\n${oldVersion.remarks}` : ''
    }`,
    isBest: false,
    createdAt: new Date().toISOString(),
  };
}

/**
 * Update metadata (label, complexity, remarks) for an existing version.
 * Code field is strictly immutable.
 */
export function updateVersionMetadata(
  version: CodeVersion,
  updates: {
    label?: string;
    timeComplexity: string;
    spaceComplexity: string;
    remarks: string;
  }
): CodeVersion {
  if (!updates.timeComplexity?.trim()) {
    throw new Error('Time complexity is required');
  }
  if (!updates.spaceComplexity?.trim()) {
    throw new Error('Space complexity is required');
  }

  return {
    ...version,
    label: updates.label?.trim() || undefined,
    timeComplexity: updates.timeComplexity.trim(),
    spaceComplexity: updates.spaceComplexity.trim(),
    remarks: updates.remarks,
    updatedAt: new Date().toISOString(),
  };
}
