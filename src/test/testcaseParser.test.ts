import { describe, it, expect } from 'vitest';
import { formatParamValue, parseAndValidateParam } from '../utils/testcaseParser';

describe('Testcase Parser & Validator', () => {
  describe('formatParamValue', () => {
    it('formats arrays with clean spaces between elements', () => {
      expect(formatParamValue([1, 2, 3])).toBe('[1, 2, 3]');
      expect(formatParamValue([])).toBe('[]');
    });

    it('formats primitives and strings properly', () => {
      expect(formatParamValue(42)).toBe('42');
      expect(formatParamValue(true)).toBe('true');
      expect(formatParamValue('hello')).toBe('hello');
      expect(formatParamValue(null)).toBe('');
      expect(formatParamValue(undefined)).toBe('');
    });
  });

  describe('parseAndValidateParam: Arrays and Lists (int[], ListNode, TreeNode, etc.)', () => {
    it('accepts list with spaces after comma', () => {
      const res = parseAndValidateParam('[1, 2, 3]', 'int[]');
      expect(res.valid).toBe(true);
      expect(res.value).toEqual([1, 2, 3]);
    });

    it('accepts list without spaces after comma', () => {
      const res = parseAndValidateParam('[1,2,3]', 'int[]');
      expect(res.valid).toBe(true);
      expect(res.value).toEqual([1, 2, 3]);
    });

    it('accepts list with irregular spacing around brackets and commas', () => {
      const res = parseAndValidateParam('[  1 ,  2 , 3   ]', 'int[]');
      expect(res.valid).toBe(true);
      expect(res.value).toEqual([1, 2, 3]);
    });

    it('accepts empty list []', () => {
      const res = parseAndValidateParam('[]', 'int[]');
      expect(res.valid).toBe(true);
      expect(res.value).toEqual([]);
    });

    it('accepts ListNode with both spaces and no spaces, and empty list', () => {
      expect(parseAndValidateParam('[1, 2, 3, 4, 5]', 'ListNode')).toEqual({
        valid: true,
        value: [1, 2, 3, 4, 5],
      });
      expect(parseAndValidateParam('[1,2,3,4,5]', 'ListNode')).toEqual({
        valid: true,
        value: [1, 2, 3, 4, 5],
      });
      expect(parseAndValidateParam('[]', 'ListNode')).toEqual({
        valid: true,
        value: [],
      });
    });

    it('rejects lists not enclosed in brackets []', () => {
      const res1 = parseAndValidateParam('1, 2, 3', 'int[]');
      expect(res1.valid).toBe(false);
      expect(res1.error).toContain('brackets []');

      const res2 = parseAndValidateParam('1,2,3', 'ListNode');
      expect(res2.valid).toBe(false);
      expect(res2.error).toContain('brackets');
    });

    it('rejects unclosed brackets and malformed syntax', () => {
      const res = parseAndValidateParam('[1, 2,', 'int[]');
      expect(res.valid).toBe(false);
    });

    it('rejects non-integer elements for int[]', () => {
      const res = parseAndValidateParam('[1, "abc", 3]', 'int[]');
      expect(res.valid).toBe(false);
      expect(res.error).toContain('must be an integer');
    });

    it('accepts TreeNode with integers, null, None, and empty list', () => {
      const res1 = parseAndValidateParam('[3, 9, 20, null, null, 15, 7]', 'TreeNode');
      expect(res1.valid).toBe(true);
      expect(res1.value).toEqual([3, 9, 20, null, null, 15, 7]);

      const res2 = parseAndValidateParam('[3,9,20,null,null,15,7]', 'TreeNode');
      expect(res2.valid).toBe(true);
      expect(res2.value).toEqual([3, 9, 20, null, null, 15, 7]);

      // Python style None
      const res3 = parseAndValidateParam('[1, None, 2]', 'TreeNode');
      expect(res3.valid).toBe(true);
      expect(res3.value).toEqual([1, null, 2]);

      const resEmpty = parseAndValidateParam('[]', 'TreeNode');
      expect(resEmpty.valid).toBe(true);
      expect(resEmpty.value).toEqual([]);
    });

    it('rejects invalid TreeNode values like strings', () => {
      const res = parseAndValidateParam('[1, "invalid", 3]', 'TreeNode');
      expect(res.valid).toBe(false);
      expect(res.error).toContain('must be an integer or null');
    });
  });

  describe('parseAndValidateParam: 2D Arrays and Primitives', () => {
    it('accepts 2D arrays with and without spaces', () => {
      const res1 = parseAndValidateParam('[[1, 2], [3, 4]]', 'int[][]');
      expect(res1.valid).toBe(true);
      expect(res1.value).toEqual([[1, 2], [3, 4]]);

      const res2 = parseAndValidateParam('[[1,2],[3,4]]', 'int[][]');
      expect(res2.valid).toBe(true);
      expect(res2.value).toEqual([[1, 2], [3, 4]]);
    });

    it('rejects 1D array when 2D array expected', () => {
      const res = parseAndValidateParam('[1, 2]', 'int[][]');
      expect(res.valid).toBe(false);
      expect(res.error).toContain('must be an array');
    });

    it('accepts valid integers and rejects non-integers for int', () => {
      expect(parseAndValidateParam('42', 'int')).toEqual({ valid: true, value: 42 });
      expect(parseAndValidateParam('-15', 'int')).toEqual({ valid: true, value: -15 });
      expect(parseAndValidateParam('abc', 'int').valid).toBe(false);
      expect(parseAndValidateParam('[1, 2]', 'int').valid).toBe(false);
    });

    it('accepts booleans true/false/True/False', () => {
      expect(parseAndValidateParam('true', 'boolean')).toEqual({ valid: true, value: true });
      expect(parseAndValidateParam('False', 'boolean')).toEqual({ valid: true, value: false });
      expect(parseAndValidateParam('yes', 'boolean').valid).toBe(false);
    });

    it('accepts strings quoted or unquoted', () => {
      expect(parseAndValidateParam('"ADOBECODEBANC"', 'String')).toEqual({ valid: true, value: 'ADOBECODEBANC' });
      expect(parseAndValidateParam('ADOBECODEBANC', 'String')).toEqual({ valid: true, value: 'ADOBECODEBANC' });
    });
  });
});
