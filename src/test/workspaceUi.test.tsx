import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ConsolePanel } from '../components/workspace/ConsolePanel';
import { ProblemMeta, CustomCase, RunResponse, SubmitResponse } from '../types';

describe('ConsolePanel & Testcase Flow UI', () => {
  const meta: ProblemMeta = {
    id: 1,
    className: 'Solution',
    methodName: 'twoSum',
    params: [
      { name: 'nums', type: 'int[]' },
      { name: 'target', type: 'int' },
    ],
    returnType: 'int[]',
    kind: 'function',
    comparator: 'unordered',
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    examples: [
      { input: { nums: [2, 7, 11, 15], target: 9 }, output: [0, 1] },
      { input: { nums: [3, 2, 4], target: 6 }, output: [1, 2] },
    ],
    constraints: ['2 <= nums.length <= 10^4'],
  };

  const sampleCases = [
    { inputs: { nums: [2, 7, 11, 15], target: 9 }, expected: [0, 1] },
    { inputs: { nums: [3, 2, 4], target: 6 }, expected: [1, 2] },
  ];

  const customCases: CustomCase[] = [
    {
      id: 'custom-1',
      problemId: 1,
      inputs: { nums: '[3,3]', target: '6' },
      source: 'user',
      createdAt: new Date().toISOString(),
    },
  ];

  it('renders Testcase tab with sample case chips and custom cases', () => {
    const onAddCustomCase = vi.fn();
    const onDeleteCustomCase = vi.fn();
    const onUpdateSampleCase = vi.fn();

    render(
      <ConsolePanel
        meta={meta}
        activeConsoleTab="testcase"
        setActiveConsoleTab={() => {}}
        sampleCases={sampleCases}
        customCases={customCases}
        onAddCustomCase={onAddCustomCase}
        onDeleteCustomCase={onDeleteCustomCase}
        onUpdateSampleCase={onUpdateSampleCase}
        runResult={null}
        submitResult={null}
        isRunning={false}
        onSaveAsVersionClick={() => {}}
        onAddFailingToCustomCases={() => {}}
      />
    );

    // Case chips
    expect(screen.getByText('Case 1')).toBeTruthy();
    expect(screen.getByText('Case 2')).toBeTruthy();
    expect(screen.getByText('Custom 1')).toBeTruthy();

    // Parameter labels
    expect(screen.getByText('nums =')).toBeTruthy();
    expect(screen.getByText('target =')).toBeTruthy();

    // Add new case button "+"
    const addBtn = screen.getByTitle('Add custom testcase');
    expect(addBtn).toBeTruthy();
    fireEvent.click(addBtn);
    expect(onAddCustomCase).toHaveBeenCalled();
  });

  it('renders Run Result tab with passed cases and execution details', () => {
    const runResult: RunResponse = {
      verdict: 'Accepted',
      runtimeMs: 12,
      results: [
        {
          index: 0,
          passed: true,
          input: { nums: [2, 7, 11, 15], target: 9 },
          actual: [0, 1],
          expected: [0, 1],
          stdout: '',
          runtimeMs: 6,
        },
        {
          index: 1,
          passed: true,
          input: { nums: [3, 2, 4], target: 6 },
          actual: [1, 2],
          expected: [1, 2],
          stdout: '',
          runtimeMs: 6,
        },
      ],
    };

    render(
      <ConsolePanel
        meta={meta}
        activeConsoleTab="result"
        setActiveConsoleTab={() => {}}
        sampleCases={sampleCases}
        customCases={[]}
        onAddCustomCase={() => {}}
        onDeleteCustomCase={() => {}}
        onUpdateSampleCase={() => {}}
        runResult={runResult}
        submitResult={null}
        isRunning={false}
        onSaveAsVersionClick={() => {}}
        onAddFailingToCustomCases={() => {}}
      />
    );

    expect(screen.getByText('Accepted')).toBeTruthy();
    expect(screen.getByText(/Runtime: 12 ms/)).toBeTruthy();
  });

  it('renders Submit Result with failing hidden test and "Add to my testcases" button', () => {
    const onAddFailing = vi.fn();
    const submitResult: SubmitResponse = {
      verdict: 'Wrong Answer',
      passed: 14,
      total: 18,
      runtimeMs: 45,
      failing: {
        index: 14,
        input: { nums: [0, 4, 3, 0], target: 0 },
        actual: '[0, 0]',
        expected: '[0, 3]',
        stdout: 'debug log',
      },
    };

    render(
      <ConsolePanel
        meta={meta}
        activeConsoleTab="result"
        setActiveConsoleTab={() => {}}
        sampleCases={sampleCases}
        customCases={[]}
        onAddCustomCase={() => {}}
        onDeleteCustomCase={() => {}}
        onUpdateSampleCase={() => {}}
        runResult={null}
        submitResult={submitResult}
        isRunning={false}
        onSaveAsVersionClick={() => {}}
        onAddFailingToCustomCases={onAddFailing}
      />
    );

    // Shows Wrong Answer verdict and passed count
    expect(screen.getByText('Wrong Answer')).toBeTruthy();
    expect(screen.getByText(/14 \/ 18 testcases passed/)).toBeTruthy();

    // Shows failing input and actual vs expected
    expect(screen.getByText(/Failing Testcase/)).toBeTruthy();
    expect(screen.getByText(/debug log/)).toBeTruthy();

    // Click "Add to my testcases" button
    const addFailingBtn = screen.getByText('Add to my testcases');
    expect(addFailingBtn).toBeTruthy();
    fireEvent.click(addFailingBtn);
    expect(onAddFailing).toHaveBeenCalledWith({ nums: [0, 4, 3, 0], target: 0 });
  });
});
