import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { createRequire } from 'module';
import { executeJavaSolution, RawTestOutput, JudgeExecutionResult } from './judge/runner';
import { executePythonSolution } from './judge/pythonRunner';
import { executeCppSolution } from './judge/cppRunner';
import { executeCSolution } from './judge/cRunner';
import { executeGoSolution } from './judge/goRunner';
import { compareResults } from './judge/comparators';
import { ProblemMeta, RunResponse, SubmitResponse, TestResultItem, SupportedLanguage } from '../src/types';

const execAsync = promisify(exec);
const req = createRequire(import.meta.url);

export function loadProblemMeta(problemId: number): ProblemMeta {
  const rootDir = process.cwd();
  const metaPath = path.join(rootDir, 'content', 'problems', String(problemId), 'meta.json');
  if (!fs.existsSync(metaPath)) {
    throw new Error(`Problem metadata not found for ID ${problemId}`);
  }
  return JSON.parse(fs.readFileSync(metaPath, 'utf8'));
}

export function loadHiddenTests(problemId: number): { inputs: Record<string, unknown>; expected: unknown }[] {
  const rootDir = process.cwd();
  const hiddenPath = path.join(rootDir, 'server', 'private', String(problemId), 'tests.json');
  if (!fs.existsSync(hiddenPath)) {
    throw new Error(`Hidden tests not found for problem ${problemId}`);
  }
  return JSON.parse(fs.readFileSync(hiddenPath, 'utf8'));
}

export function loadReferenceSolution(problemId: number): string {
  const rootDir = process.cwd();
  const refPath = path.join(rootDir, 'server', 'private', String(problemId), 'Solution.java');
  if (!fs.existsSync(refPath)) {
    throw new Error(`Reference solution not found for problem ${problemId}`);
  }
  return fs.readFileSync(refPath, 'utf8');
}

export function loadCustomChecker(problemId: number): ((inputs: Record<string, unknown>, actual: unknown) => boolean) | undefined {
  const rootDir = process.cwd();
  const checkerJsPath = path.join(rootDir, 'server', 'private', String(problemId), 'checker.js');
  if (fs.existsSync(checkerJsPath)) {
    try {
      const mod = req(checkerJsPath);
      return mod.check || mod.default;
    } catch {
      return undefined;
    }
  }
  return undefined;
}

/**
 * Handle Run code execution
 */
export async function handleRunCode(payload: {
  problemId: number;
  code: string;
  language?: SupportedLanguage;
  cases: { inputs: Record<string, unknown>; expected?: unknown }[];
}): Promise<RunResponse> {
  const { problemId, code, language = 'java', cases } = payload;
  const meta = loadProblemMeta(problemId);
  const customChecker = loadCustomChecker(problemId);

  // If any custom case is missing expected, compute expected with reference solution
  const casesWithExpected = [...cases];
  const missingExpectedIndices = casesWithExpected
    .map((c, i) => (c.expected === undefined ? i : -1))
    .filter((i) => i !== -1);

  if (missingExpectedIndices.length > 0) {
    try {
      const refCode = loadReferenceSolution(problemId);
      const refTests = missingExpectedIndices.map((idx) => ({
        index: idx,
        inputs: casesWithExpected[idx].inputs,
      }));

      const refExec = await executeJavaSolution({
        problemMeta: meta,
        code: refCode,
        tests: refTests,
        timeLimitMs: meta.timeLimitMs,
        memoryLimitMb: meta.memoryLimitMb,
      });

      if (refExec.testOutputs) {
        for (const out of refExec.testOutputs) {
          casesWithExpected[out.index].expected = out.actual;
        }
      }
    } catch (err) {
      console.error('Failed to compute expected outputs with reference solution:', err);
    }
  }

  // Execute user solution on all provided cases
  let execResult: JudgeExecutionResult;
  try {
    if (language === 'python') {
      execResult = await executePythonSolution({
        problemMeta: meta,
        code,
        tests: casesWithExpected.map((c, idx) => ({ index: idx, inputs: c.inputs })),
        timeLimitMs: meta.timeLimitMs,
        memoryLimitMb: meta.memoryLimitMb,
      });
    } else if (language === 'cpp') {
      execResult = await executeCppSolution({
        problemMeta: meta,
        code,
        tests: casesWithExpected.map((c, idx) => ({ index: idx, inputs: c.inputs })),
        timeLimitMs: meta.timeLimitMs,
        memoryLimitMb: meta.memoryLimitMb,
      });
    } else if (language === 'c') {
      execResult = await executeCSolution({
        problemMeta: meta,
        code,
        tests: casesWithExpected.map((c, idx) => ({ index: idx, inputs: c.inputs })),
        timeLimitMs: meta.timeLimitMs,
        memoryLimitMb: meta.memoryLimitMb,
      });
    } else if (language === 'go') {
      execResult = await executeGoSolution({
        problemMeta: meta,
        code,
        tests: casesWithExpected.map((c, idx) => ({ index: idx, inputs: c.inputs })),
        timeLimitMs: meta.timeLimitMs,
        memoryLimitMb: meta.memoryLimitMb,
      });
    } else {
      execResult = await executeJavaSolution({
        problemMeta: meta,
        code,
        tests: casesWithExpected.map((c, idx) => ({ index: idx, inputs: c.inputs })),
        timeLimitMs: meta.timeLimitMs,
        memoryLimitMb: meta.memoryLimitMb,
      });
    }
  } catch (err: any) {
    return {
      verdict: 'Runtime Error',
      results: casesWithExpected.map((c, i) => ({
        index: i,
        passed: false,
        input: c.inputs,
        expected: c.expected,
        error: err.message || 'Execution error',
      })),
      runtimeMs: 0,
      error: err.message || String(err),
    };
  }

  if (execResult.verdict === 'Compile Error') {
    return {
      verdict: 'Compile Error',
      results: [],
      runtimeMs: 0,
      compileError: execResult.compileError,
      error: execResult.compileError,
    };
  }

  if (execResult.verdict !== 'Accepted' && (!execResult.testOutputs || execResult.testOutputs.length === 0)) {
    return {
      verdict: execResult.verdict,
      results: casesWithExpected.map((c, i) => ({
        index: i,
        passed: false,
        input: c.inputs,
        expected: c.expected,
        error: execResult.error,
      })),
      runtimeMs: 0,
      error: execResult.error,
    };
  }

  const results: TestResultItem[] = [];
  let allPassed = true;
  let overallVerdict: RunResponse['verdict'] = 'Accepted';

  const outputMap = new Map<number, RawTestOutput>();
  if (execResult.testOutputs) {
    for (const out of execResult.testOutputs) {
      outputMap.set(out.index, out);
    }
  }

  for (let i = 0; i < casesWithExpected.length; i++) {
    const c = casesWithExpected[i];
    const out = outputMap.get(i);

    if (!out) {
      results.push({
        index: i,
        passed: false,
        input: c.inputs,
        expected: c.expected,
        error: 'Execution terminated before reaching this testcase',
      });
      allPassed = false;
      continue;
    }

    if (out.verdict !== 'OK') {
      results.push({
        index: i,
        passed: false,
        input: c.inputs,
        expected: c.expected,
        stdout: out.stdout,
        runtimeMs: out.runtimeMs,
        error: out.error,
        stackTrace: out.stackTrace,
      });
      allPassed = false;
      if (overallVerdict === 'Accepted') {
        overallVerdict = out.verdict;
      }
    } else {
      const isMatch = compareResults({
        actual: out.actual,
        expected: c.expected,
        comparator: meta.comparator,
        inputs: c.inputs,
        customChecker,
      });

      if (!isMatch) {
        allPassed = false;
        if (overallVerdict === 'Accepted') {
          overallVerdict = 'Wrong Answer';
        }
      }

      results.push({
        index: i,
        passed: isMatch,
        input: c.inputs,
        expected: c.expected,
        actual: out.actual,
        stdout: out.stdout,
        runtimeMs: out.runtimeMs,
      });
    }
  }

  return {
    verdict: allPassed ? 'Accepted' : overallVerdict,
    results,
    runtimeMs: execResult.totalRuntimeMs,
  };
}

/**
 * Handle Submit code execution
 */
export async function handleSubmitCode(payload: {
  problemId: number;
  code: string;
  language?: SupportedLanguage;
}): Promise<SubmitResponse> {
  const { problemId, code, language = 'java' } = payload;
  const meta = loadProblemMeta(problemId);
  const hiddenTests = loadHiddenTests(problemId);
  const customChecker = loadCustomChecker(problemId);

  // Combine sample examples + hidden tests
  const allTests: { inputs: Record<string, unknown>; expected: unknown }[] = [];

  for (const ex of meta.examples) {
    allTests.push({ inputs: ex.input, expected: ex.output });
  }
  for (const ht of hiddenTests) {
    allTests.push(ht);
  }

  const total = allTests.length;

  // Execute user solution on all tests in order
  let execResult: JudgeExecutionResult;
  try {
    if (language === 'python') {
      execResult = await executePythonSolution({
        problemMeta: meta,
        code,
        tests: allTests.map((t, i) => ({ index: i, inputs: t.inputs })),
        timeLimitMs: meta.timeLimitMs,
        memoryLimitMb: meta.memoryLimitMb,
      });
    } else if (language === 'cpp') {
      execResult = await executeCppSolution({
        problemMeta: meta,
        code,
        tests: allTests.map((t, i) => ({ index: i, inputs: t.inputs })),
        timeLimitMs: meta.timeLimitMs,
        memoryLimitMb: meta.memoryLimitMb,
      });
    } else if (language === 'c') {
      execResult = await executeCSolution({
        problemMeta: meta,
        code,
        tests: allTests.map((t, i) => ({ index: i, inputs: t.inputs })),
        timeLimitMs: meta.timeLimitMs,
        memoryLimitMb: meta.memoryLimitMb,
      });
    } else if (language === 'go') {
      execResult = await executeGoSolution({
        problemMeta: meta,
        code,
        tests: allTests.map((t, i) => ({ index: i, inputs: t.inputs })),
        timeLimitMs: meta.timeLimitMs,
        memoryLimitMb: meta.memoryLimitMb,
      });
    } else {
      execResult = await executeJavaSolution({
        problemMeta: meta,
        code,
        tests: allTests.map((t, i) => ({ index: i, inputs: t.inputs })),
        timeLimitMs: meta.timeLimitMs,
        memoryLimitMb: meta.memoryLimitMb,
      });
    }
  } catch (err: any) {
    return {
      verdict: 'Runtime Error',
      passed: 0,
      total,
      runtimeMs: 0,
      error: err.message || String(err),
      failing: {
        index: 1,
        input: allTests[0]?.inputs || {},
        error: err.message || 'Execution error',
      },
    };
  }

  if (execResult.verdict === 'Compile Error') {
    return {
      verdict: 'Compile Error',
      passed: 0,
      total,
      runtimeMs: 0,
      error: execResult.compileError,
      compileError: execResult.compileError,
    };
  }

  if (execResult.verdict !== 'Accepted' && (!execResult.testOutputs || execResult.testOutputs.length === 0)) {
    return {
      verdict: execResult.verdict,
      passed: 0,
      total,
      runtimeMs: 0,
      error: execResult.error,
      failing: {
        index: 1,
        input: allTests[0]?.inputs || {},
        error: execResult.error,
      },
    };
  }

  const outputMap = new Map<number, RawTestOutput>();
  if (execResult.testOutputs) {
    for (const out of execResult.testOutputs) {
      outputMap.set(out.index, out);
    }
  }

  let passed = 0;
  let totalRuntime = 0;

  for (let i = 0; i < total; i++) {
    const t = allTests[i];
    const out = outputMap.get(i);

    if (!out) {
      // Stopped early due to previous error
      break;
    }

    totalRuntime += out.runtimeMs || 0;

    if (out.verdict !== 'OK') {
      // First failing test - reveal ONLY this single testcase
      return {
        verdict: out.verdict,
        passed,
        total,
        runtimeMs: totalRuntime,
        failing: {
          index: i + 1,
          input: t.inputs,
          actual: out.actual !== undefined ? JSON.stringify(out.actual) : undefined,
          expected: JSON.stringify(t.expected),
          stdout: out.stdout,
          error: out.error,
          stackTrace: out.stackTrace,
        },
      };
    }

    const isMatch = compareResults({
      actual: out.actual,
      expected: t.expected,
      comparator: meta.comparator,
      inputs: t.inputs,
      customChecker,
    });

    if (!isMatch) {
      // Wrong Answer - reveal ONLY this single testcase
      return {
        verdict: 'Wrong Answer',
        passed,
        total,
        runtimeMs: totalRuntime,
        failing: {
          index: i + 1,
          input: t.inputs,
          actual: JSON.stringify(out.actual),
          expected: JSON.stringify(t.expected),
          stdout: out.stdout,
        },
      };
    }

    passed++;
  }

  if (passed !== total) {
    const failingIdx = passed;
    const t = allTests[failingIdx];
    return {
      verdict: execResult.verdict || 'Runtime Error',
      passed,
      total,
      runtimeMs: totalRuntime,
      error: execResult.error,
      failing: {
        index: failingIdx + 1,
        input: t?.inputs || {},
        error: execResult.error,
      },
    };
  }

  // All tests passed! Reveal NOTHING about hidden test data
  return {
    verdict: 'Accepted',
    passed,
    total,
    runtimeMs: totalRuntime,
  };
}

const reflectionCache = new Map<string, any[]>();

/**
 * Dynamically reflect on any class in the host Java 21 runtime.
 */
export async function handleReflectClass(payload: { className: string }): Promise<any[]> {
  const { className } = payload;
  if (!className || typeof className !== 'string') return [];
  const clean = className.trim();
  if (reflectionCache.has(clean)) {
    return reflectionCache.get(clean)!;
  }

  try {
    const rootDir = process.cwd();
    const scriptPath = path.join(rootDir, 'server', 'judge', 'Reflector.java');
    const { stdout } = await execAsync(`java "${scriptPath}" "${clean}"`, { timeout: 5000 });
    const parsed = JSON.parse(stdout.trim() || '[]');
    reflectionCache.set(clean, parsed);
    return parsed;
  } catch (err) {
    console.error('Reflector failed for', clean, err);
    return [];
  }
}
