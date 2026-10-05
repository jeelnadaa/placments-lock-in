import fs from 'fs';
import path from 'path';
import { exec, spawn } from 'child_process';
import { promisify } from 'util';
import { ProblemMeta, VerdictType } from '../../src/types';
import { JudgeExecutionResult, RawTestOutput } from './runner';

const execAsync = promisify(exec);

let cachedPythonCmd: string | null = null;

/**
 * Finds the working python command on the host OS (Windows, macOS, Linux).
 */
export async function getPythonCommand(): Promise<string> {
  if (cachedPythonCmd) return cachedPythonCmd;

  const candidates = process.platform === 'win32'
    ? ['python', 'py', 'python3']
    : ['python3', 'python'];

  for (const cmd of candidates) {
    try {
      await execAsync(`${cmd} --version`);
      cachedPythonCmd = cmd;
      return cmd;
    } catch {
      // try next
    }
  }

  // Fallback to python
  cachedPythonCmd = 'python';
  return 'python';
}

export async function executePythonSolution(params: {
  problemMeta: ProblemMeta;
  code: string;
  tests: { index: number; inputs: Record<string, unknown> }[];
  timeLimitMs?: number;
  memoryLimitMb?: number;
}): Promise<JudgeExecutionResult> {
  const { problemMeta, code, tests, timeLimitMs = 2500 } = params;

  const rootDir = process.cwd();
  const runId = `run-py-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
  const runDir = path.join(rootDir, 'scratch', 'runs', runId);

  fs.mkdirSync(runDir, { recursive: true });

  try {
    const pythonCmd = await getPythonCommand();

    // 1. Copy Judge.py
    const judgeSrc = path.join(rootDir, 'server', 'judge', 'Judge.py');
    fs.copyFileSync(judgeSrc, path.join(runDir, 'Judge.py'));

    // 2. Write Solution.py directly with user code so line numbers match 1:1
    fs.writeFileSync(path.join(runDir, 'Solution.py'), code, 'utf8');

    // 3. Write input.json
    const payload = {
      className: problemMeta.className || 'Solution',
      methodName: problemMeta.methodName,
      params: problemMeta.params,
      returnType: problemMeta.returnType,
      kind: problemMeta.kind,
      timeLimitMs: problemMeta.timeLimitMs || timeLimitMs,
      tests: tests.map((t) => ({
        index: t.index,
        inputs: t.inputs,
      })),
    };
    fs.writeFileSync(path.join(runDir, 'input.json'), JSON.stringify(payload), 'utf8');

    // 4. Syntax check with py_compile
    try {
      await execAsync(`${pythonCmd} -m py_compile Solution.py`, {
        cwd: runDir,
        timeout: 5000,
      });
    } catch (compileErr: any) {
      const stderr = compileErr.stderr || compileErr.stdout || compileErr.message;
      return {
        verdict: 'Compile Error',
        compileError: stderr,
        totalRuntimeMs: 0,
        error: stderr,
      };
    }

    // 5. Execute with Judge.py
    const totalTimeLimit = Math.max(timeLimitMs * tests.length, 3000) + 1000;

    let rawOutput = '';
    let rawError = '';
    let timedOut = false;

    const child = spawn(pythonCmd, ['Judge.py', 'input.json'], {
      cwd: runDir,
    });

    const timer = setTimeout(() => {
      timedOut = true;
      try {
        child.kill();
      } catch {
        // ignore
      }
    }, totalTimeLimit);

    child.stdout.on('data', (d) => {
      rawOutput += d.toString('utf8');
    });

    child.stderr.on('data', (d) => {
      rawError += d.toString('utf8');
    });

    await new Promise<void>((resolve) => {
      child.on('close', () => {
        clearTimeout(timer);
        resolve();
      });
      child.on('error', () => {
        clearTimeout(timer);
        resolve();
      });
    });

    if (timedOut) {
      return {
        verdict: 'Time Limit Exceeded',
        totalRuntimeMs: totalTimeLimit,
        error: `Time limit exceeded (over ${totalTimeLimit}ms)`,
        testOutputs: tests.map((t) => ({
          index: t.index,
          runtimeMs: totalTimeLimit,
          stdout: '',
          verdict: 'Time Limit Exceeded',
          error: 'Process killed due to timeout',
        })),
      };
    }

    // Parse JSON result from Judge.py
    try {
      const parsedOutputs: RawTestOutput[] = JSON.parse(rawOutput.trim());
      const totalRuntimeMs = parsedOutputs.reduce((acc, curr) => acc + (curr.runtimeMs || 0), 0);

      // Check verdicts
      let worstVerdict: VerdictType = 'Accepted';
      for (const out of parsedOutputs) {
        if (out.verdict === 'Runtime Error') {
          worstVerdict = 'Runtime Error';
          break;
        }
      }

      return {
        verdict: worstVerdict,
        testOutputs: parsedOutputs,
        totalRuntimeMs,
      };
    } catch {
      return {
        verdict: 'Runtime Error',
        totalRuntimeMs: 0,
        error: rawError || rawOutput || 'Failed to parse Judge.py outputs',
      };
    }
  } finally {
    // Clean up temporary run directory
    try {
      fs.rmSync(runDir, { recursive: true, force: true });
    } catch {
      // ignore
    }
  }
}
