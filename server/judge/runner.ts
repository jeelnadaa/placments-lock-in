import fs from 'fs';
import path from 'path';
import { exec, spawn } from 'child_process';
import { promisify } from 'util';
import { ProblemMeta, VerdictType } from '../../src/types';

const execAsync = promisify(exec);

export interface RawTestOutput {
  index: number;
  runtimeMs: number;
  stdout: string;
  verdict: 'OK' | 'Time Limit Exceeded' | 'Memory Limit Exceeded' | 'Runtime Error';
  actual?: unknown;
  error?: string;
  stackTrace?: string;
}

export interface JudgeExecutionResult {
  verdict: VerdictType;
  testOutputs?: RawTestOutput[];
  totalRuntimeMs: number;
  compileError?: string;
  error?: string;
}

export async function executeJavaSolution(params: {
  problemMeta: ProblemMeta;
  code: string;
  tests: { index: number; inputs: Record<string, unknown> }[];
  timeLimitMs?: number;
  memoryLimitMb?: number;
}): Promise<JudgeExecutionResult> {
  const { problemMeta, code, tests, timeLimitMs = 2000, memoryLimitMb = 256 } = params;

  // Base directory for judge runs
  const rootDir = process.cwd();
  const runId = `run-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
  const runDir = path.join(rootDir, 'scratch', 'runs', runId);

  fs.mkdirSync(runDir, { recursive: true });

  try {
    // 1. Copy templates
    const templatesDir = path.join(rootDir, 'server', 'judge', 'templates');
    if (fs.existsSync(templatesDir)) {
      const templateFiles = fs.readdirSync(templatesDir);
      for (const file of templateFiles) {
        fs.copyFileSync(path.join(templatesDir, file), path.join(runDir, file));
      }
    }

    // 2. Copy Judge.java
    const judgeSrc = path.join(rootDir, 'server', 'judge', 'Judge.java');
    fs.copyFileSync(judgeSrc, path.join(runDir, 'Judge.java'));

    // 3. Write Solution file
    const classFileName = `${problemMeta.className || 'Solution'}.java`;
    fs.writeFileSync(path.join(runDir, classFileName), code, 'utf8');

    // 4. Write input.json
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

    // 5. Compile with javac
    try {
      await execAsync('javac -encoding UTF-8 *.java', {
        cwd: runDir,
        timeout: 10000,
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

    // 6. Run with java
    const javaArgs = [
      `-Xmx${memoryLimitMb}m`,
      '-Xss64m',
      'Judge',
      'input.json',
    ];

    let rawOutput = '';
    try {
      rawOutput = await new Promise<string>((resolve, reject) => {
        const child = spawn('java', javaArgs, {
          cwd: runDir,
          stdio: ['ignore', 'pipe', 'pipe'],
        });

        let stdout = '';
        let stderr = '';

        child.stdout.on('data', (d) => {
          stdout += d.toString('utf8');
        });

        child.stderr.on('data', (d) => {
          stderr += d.toString('utf8');
        });

        const maxWait = (timeLimitMs + 1000) * tests.length + 5000;
        const timer = setTimeout(() => {
          child.kill();
          reject(new Error('Judge execution timeout'));
        }, maxWait);

        child.on('close', (code) => {
          clearTimeout(timer);
          if (code !== 0 && !stdout.trim()) {
            reject(new Error(`Java process exited with code ${code}:\n${stderr || stdout}`));
          } else {
            resolve(stdout.trim());
          }
        });

        child.on('error', (err) => {
          clearTimeout(timer);
          reject(err);
        });
      });
    } catch (runErr: any) {
      return {
        verdict: 'Runtime Error',
        totalRuntimeMs: 0,
        error: runErr.message || String(runErr),
      };
    }

    let parsedOutputs: RawTestOutput[] = [];
    try {
      parsedOutputs = JSON.parse(rawOutput);
    } catch (parseErr) {
      return {
        verdict: 'Runtime Error',
        totalRuntimeMs: 0,
        error: `Failed to parse judge output:\n${rawOutput}`,
      };
    }

    let totalRuntime = 0;
    let worstVerdict: VerdictType = 'Accepted';

    for (const out of parsedOutputs) {
      totalRuntime += out.runtimeMs || 0;
      if (out.verdict === 'Time Limit Exceeded') {
        worstVerdict = 'Time Limit Exceeded';
        break;
      }
      if (out.verdict === 'Memory Limit Exceeded') {
        worstVerdict = 'Memory Limit Exceeded';
        break;
      }
      if (out.verdict === 'Runtime Error') {
        worstVerdict = 'Runtime Error';
        break;
      }
    }

    return {
      verdict: worstVerdict,
      testOutputs: parsedOutputs,
      totalRuntimeMs: Math.max(1, Math.round(totalRuntime)),
    };
  } finally {
    // Clean up temporary run directory
    try {
      fs.rmSync(runDir, { recursive: true, force: true });
    } catch {
      // ignore cleanup errors
    }
  }
}
