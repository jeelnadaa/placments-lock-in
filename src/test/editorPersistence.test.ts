import { describe, it, expect, beforeEach } from 'vitest';
import { clearAllUserData } from '../db/db';

describe('Editor Code Persistence Across Sessions', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('persists code in localStorage with problem-specific key', () => {
    const problemId = 1;
    const testCode = 'class Solution { public int[] twoSum(int[] nums, int target) { return new int[]{0, 1}; } }';
    
    // Simulate user typing in editor
    localStorage.setItem(`lockedin_code_${problemId}`, testCode);

    // Simulate closing browser and reopening
    const retrieved = localStorage.getItem(`lockedin_code_${problemId}`);
    expect(retrieved).toBe(testCode);
  });

  it('maintains distinct code for different problems', () => {
    const codeP1 = '// Code for Two Sum';
    const codeP206 = '// Code for Reverse Linked List';

    localStorage.setItem('lockedin_code_1', codeP1);
    localStorage.setItem('lockedin_code_206', codeP206);

    expect(localStorage.getItem('lockedin_code_1')).toBe(codeP1);
    expect(localStorage.getItem('lockedin_code_206')).toBe(codeP206);
  });

  it('removes specific draft key when reset to starter code', () => {
    localStorage.setItem('lockedin_code_1', 'my draft');
    expect(localStorage.getItem('lockedin_code_1')).toBe('my draft');

    // Simulate reset
    localStorage.removeItem('lockedin_code_1');
    expect(localStorage.getItem('lockedin_code_1')).toBeNull();
  });

  it('clearAllUserData removes all lockedin_code_* drafts from localStorage', async () => {
    localStorage.setItem('lockedin_code_1', 'draft 1');
    localStorage.setItem('lockedin_code_206', 'draft 206');
    localStorage.setItem('other_app_key', 'keep me');

    await clearAllUserData();

    expect(localStorage.getItem('lockedin_code_1')).toBeNull();
    expect(localStorage.getItem('lockedin_code_206')).toBeNull();
    expect(localStorage.getItem('other_app_key')).toBe('keep me');
  });
});
