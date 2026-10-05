import { ComparatorType } from '../../src/types';

/**
 * Deep equality comparison with tolerance for floating points
 */
export function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (a == null || b == null) return a === b;

  if (typeof a === 'number' && typeof b === 'number') {
    return Math.abs(a - b) < 1e-6;
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }

  if (typeof a === 'object' && typeof b === 'object') {
    const keysA = Object.keys(a as Record<string, unknown>);
    const keysB = Object.keys(b as Record<string, unknown>);
    if (keysA.length !== keysB.length) return false;
    for (const key of keysA) {
      if (!deepEqual((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key])) {
        return false;
      }
    }
    return true;
  }

  return false;
}

/**
 * Normalizes an array/value for unordered comparison
 */
export function normalizeUnordered(arr: unknown): unknown[] {
  if (!Array.isArray(arr)) return [arr];
  return [...arr].sort((x, y) => JSON.stringify(x).localeCompare(JSON.stringify(y)));
}

/**
 * Normalizes nested lists (e.g. 3Sum output)
 * Sorts each inner list, then sorts the outer list
 */
export function normalizeUnorderedNested(arr: unknown): unknown[] {
  if (!Array.isArray(arr)) return [arr];
  const sortedInner = arr.map((item) => {
    if (Array.isArray(item)) {
      return [...item].sort((x, y) => {
        if (typeof x === 'number' && typeof y === 'number') return x - y;
        return String(x).localeCompare(String(y));
      });
    }
    return item;
  });
  return sortedInner.sort((x, y) => JSON.stringify(x).localeCompare(JSON.stringify(y)));
}

/**
 * Compare actual vs expected using specified comparator.
 * Supports both object signature and positional parameter signature.
 */
export function compareResults(
  actualOrParams: any,
  expected?: unknown,
  comparator: ComparatorType = 'exact',
  inputs: Record<string, unknown> = {},
  customChecker?: (inputs: Record<string, unknown>, actual: unknown) => boolean
): boolean {
  let actual: unknown;
  let exp: unknown;
  let comp: ComparatorType = comparator;
  let inps: Record<string, unknown> = inputs;
  let checker = customChecker;

  if (
    actualOrParams !== null &&
    typeof actualOrParams === 'object' &&
    'comparator' in actualOrParams &&
    'actual' in actualOrParams
  ) {
    actual = actualOrParams.actual;
    exp = actualOrParams.expected;
    comp = actualOrParams.comparator;
    inps = actualOrParams.inputs || {};
    checker = actualOrParams.customChecker;
  } else {
    actual = actualOrParams;
    exp = expected;
  }

  if (comp === 'checker' && checker) {
    return checker(inps, actual);
  }

  switch (comp) {
    case 'exact':
      return deepEqual(actual, exp);

    case 'unordered': {
      const normA = normalizeUnordered(actual);
      const normE = normalizeUnordered(exp);
      return deepEqual(normA, normE);
    }

    case 'unordered-nested': {
      const normA = normalizeUnorderedNested(actual);
      const normE = normalizeUnorderedNested(exp);
      return deepEqual(normA, normE);
    }

    case 'set-of-pairs': {
      const normA = normalizeUnordered(actual);
      const normE = normalizeUnordered(exp);
      return deepEqual(normA, normE);
    }

    default:
      return deepEqual(actual, exp);
  }
}
