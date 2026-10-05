import fs from 'fs';
import path from 'path';
import { exec, spawn } from 'child_process';
import { promisify } from 'util';
import { ProblemMeta } from '../../src/types/index';
import { JudgeExecutionResult, RawTestOutput } from './runner';

const execAsync = promisify(exec);

let cachedGoCmd: string | null = null;

/**
 * Finds the working Go compiler binary across Windows, macOS, and Linux.
 */
export async function getGoCompilerCommand(): Promise<string> {
  if (cachedGoCmd) return cachedGoCmd;

  // 1. Direct command candidates
  const directCandidates = ['go', 'go.exe'];

  for (const cmd of directCandidates) {
    try {
      await execAsync(`${cmd} version`);
      cachedGoCmd = cmd;
      return cmd;
    } catch {
      // continue
    }
  }

  // 2. Standard filesystem paths by OS
  const standardPaths: string[] = [];
  if (process.platform === 'win32') {
    standardPaths.push(
      'C:\\Program Files (x86)\\Go\\bin\\go.exe',
      'C:\\Program Files\\Go\\bin\\go.exe',
      'C:\\Go\\bin\\go.exe',
      path.join(process.env.USERPROFILE || '', 'go', 'bin', 'go.exe')
    );
  } else {
    standardPaths.push(
      '/usr/local/go/bin/go',
      '/opt/homebrew/bin/go',
      '/usr/bin/go',
      path.join(process.env.HOME || '', 'go', 'bin', 'go')
    );
  }

  for (const fullPath of standardPaths) {
    if (fs.existsSync(fullPath)) {
      try {
        await execAsync(`"${fullPath}" version`);
        cachedGoCmd = fullPath;
        return fullPath;
      } catch {
        // continue
      }
    }
  }

  cachedGoCmd = 'go';
  return 'go';
}

function generateDataStructuresGo(): string {
  return `package main

type ListNode struct {
	Val  int
	Next *ListNode
}

type TreeNode struct {
	Val   int
	Left  *TreeNode
	Right *TreeNode
}

type Node struct {
	Val       int
	Neighbors []*Node
}

func buildList(arr []int) *ListNode {
	if len(arr) == 0 {
		return nil
	}
	dummy := &ListNode{}
	curr := dummy
	for _, v := range arr {
		curr.Next = &ListNode{Val: v}
		curr = curr.Next
	}
	return dummy.Next
}

func listToArray(head *ListNode) []int {
	if head == nil {
		return []int{}
	}
	var res []int
	curr := head
	for curr != nil {
		res = append(res, curr.Val)
		curr = curr.Next
	}
	return res
}

func buildTree(arr []*int) *TreeNode {
	if len(arr) == 0 || arr[0] == nil {
		return nil
	}
	root := &TreeNode{Val: *arr[0]}
	queue := []*TreeNode{root}
	idx := 1
	for len(queue) > 0 && idx < len(arr) {
		curr := queue[0]
		queue = queue[1:]

		if idx < len(arr) && arr[idx] != nil {
			curr.Left = &TreeNode{Val: *arr[idx]}
			queue = append(queue, curr.Left)
		}
		idx++

		if idx < len(arr) && arr[idx] != nil {
			curr.Right = &TreeNode{Val: *arr[idx]}
			queue = append(queue, curr.Right)
		}
		idx++
	}
	return root
}

func treeToArray(root *TreeNode) []*int {
	if root == nil {
		return []*int{}
	}
	var res []*int
	queue := []*TreeNode{root}
	for len(queue) > 0 {
		curr := queue[0]
		queue = queue[1:]
		if curr != nil {
			val := curr.Val
			res = append(res, &val)
			queue = append(queue, curr.Left)
			queue = append(queue, curr.Right)
		} else {
			res = append(res, nil)
		}
	}
	for len(res) > 0 && res[len(res)-1] == nil {
		res = res[:len(res)-1]
	}
	return res
}
`;
}

function generateMainGo(meta: ProblemMeta): string {
  const isInplace = typeof meta.kind === 'string' && meta.kind.startsWith('inplace:');
  const isClass = meta.kind === 'class';
  const methodName = meta.methodName;
  const returnType = meta.returnType?.trim() || '';

  return `package main

import (
	"encoding/json"
	"fmt"
	"os"
	"time"
)

type RawTestCase struct {
	Index  int                        \`json:"index"\`
	Inputs map[string]json.RawMessage \`json:"inputs"\`
}

type TestResultOutput struct {
	Index     int         \`json:"index"\`
	Verdict   string      \`json:"verdict"\`
	Actual    interface{} \`json:"actual"\`
	RuntimeMs float64     \`json:"runtimeMs"\`
}

func main() {
	fileData, err := os.ReadFile("input.json")
	if err != nil {
		fmt.Fprintf(os.Stderr, "Cannot read input.json: %v\\n", err)
		os.Exit(1)
	}

	var testCases []RawTestCase
	if err := json.Unmarshal(fileData, &testCases); err != nil {
		fmt.Fprintf(os.Stderr, "Cannot parse input.json: %v\\n", err)
		os.Exit(1)
	}

	var results []TestResultOutput

	for _, tc := range testCases {
		start := time.Now()

		${
      isClass
        ? `
		var ops []string
		json.Unmarshal(tc.Inputs["operations"], &ops)
		var args [][]json.RawMessage
		json.Unmarshal(tc.Inputs["args"], &args)

		obj := Constructor()
		var actualOutputs []interface{}

		for opIdx, op := range ops {
			argList := args[opIdx]
			if op == "${meta.className || 'Trie'}" {
				actualOutputs = append(actualOutputs, nil)
			}
			${
        meta.className === 'Trie'
          ? `
			else if op == "insert" {
				var word string
				json.Unmarshal(argList[0], &word)
				obj.Insert(word)
				actualOutputs = append(actualOutputs, nil)
			} else if op == "search" {
				var word string
				json.Unmarshal(argList[0], &word)
				res := obj.Search(word)
				actualOutputs = append(actualOutputs, res)
			} else if op == "startsWith" {
				var prefix string
				json.Unmarshal(argList[0], &prefix)
				res := obj.StartsWith(prefix)
				actualOutputs = append(actualOutputs, res)
			}
			`
          : meta.className === 'WordDictionary'
          ? `
			else if op == "addWord" {
				var word string
				json.Unmarshal(argList[0], &word)
				obj.AddWord(word)
				actualOutputs = append(actualOutputs, nil)
			} else if op == "search" {
				var word string
				json.Unmarshal(argList[0], &word)
				res := obj.Search(word)
				actualOutputs = append(actualOutputs, res)
			}
			`
          : meta.className === 'MedianFinder'
          ? `
			else if op == "addNum" {
				var num int
				json.Unmarshal(argList[0], &num)
				obj.AddNum(num)
				actualOutputs = append(actualOutputs, nil)
			} else if op == "findMedian" {
				res := obj.FindMedian()
				actualOutputs = append(actualOutputs, res)
			}
			`
          : ''
      }
		}

		elapsed := time.Since(start).Seconds() * 1000.0
		results = append(results, TestResultOutput{
			Index:     tc.Index,
			Verdict:   "OK",
			Actual:    actualOutputs,
			RuntimeMs: elapsed,
		})
		`
        : `
		// Parse inputs
		${meta.params
      .map((p) => {
        const t = p.type.trim();
        if (t === 'int[]' || t === 'List<Integer>') {
          return `var ${p.name} []int\n\t\tjson.Unmarshal(tc.Inputs["${p.name}"], &${p.name})`;
        }
        if (t === 'int[][]' || t === 'List<List<Integer>>') {
          return `var ${p.name} [][]int\n\t\tjson.Unmarshal(tc.Inputs["${p.name}"], &${p.name})`;
        }
        if (t === 'String[]' || t === 'List<String>') {
          return `var ${p.name} []string\n\t\tjson.Unmarshal(tc.Inputs["${p.name}"], &${p.name})`;
        }
        if (t === 'char[]') {
          return `var raw_${p.name} []string\n\t\tjson.Unmarshal(tc.Inputs["${p.name}"], &raw_${p.name})\n\t\t${p.name} := make([]byte, len(raw_${p.name}))\n\t\tfor i, s := range raw_${p.name} { if len(s) > 0 { ${p.name}[i] = s[0] } }`;
        }
        if (t === 'char[][]') {
          return `var raw_${p.name} [][]string\n\t\tjson.Unmarshal(tc.Inputs["${p.name}"], &raw_${p.name})\n\t\t${p.name} := make([][]byte, len(raw_${p.name}))\n\t\tfor i, row := range raw_${p.name} {\n\t\t\t${p.name}[i] = make([]byte, len(row))\n\t\t\tfor j, s := range row { if len(s) > 0 { ${p.name}[i][j] = s[0] } }\n\t\t}`;
        }
        if (t === 'String') {
          return `var ${p.name} string\n\t\tjson.Unmarshal(tc.Inputs["${p.name}"], &${p.name})`;
        }
        if (t === 'int') {
          return `var ${p.name} int\n\t\tjson.Unmarshal(tc.Inputs["${p.name}"], &${p.name})`;
        }
        if (t === 'long') {
          return `var ${p.name} int64\n\t\tjson.Unmarshal(tc.Inputs["${p.name}"], &${p.name})`;
        }
        if (t === 'double' || t === 'float') {
          return `var ${p.name} float64\n\t\tjson.Unmarshal(tc.Inputs["${p.name}"], &${p.name})`;
        }
        if (t === 'boolean') {
          return `var ${p.name} bool\n\t\tjson.Unmarshal(tc.Inputs["${p.name}"], &${p.name})`;
        }
        if (t === 'ListNode') {
          return `var raw_${p.name} []int\n\t\tjson.Unmarshal(tc.Inputs["${p.name}"], &raw_${p.name})\n\t\t${p.name} := buildList(raw_${p.name})`;
        }
        if (t === 'TreeNode') {
          return `var raw_${p.name} []*int\n\t\tjson.Unmarshal(tc.Inputs["${p.name}"], &raw_${p.name})\n\t\t${p.name} := buildTree(raw_${p.name})`;
        }
        return `// Unhandled param ${p.name}`;
      })
      .join('\n\t\t')}

		${
      isInplace
        ? `
		${methodName}(${meta.params.map((p) => p.name).join(', ')})
		elapsed := time.Since(start).Seconds() * 1000.0

		results = append(results, TestResultOutput{
			Index:     tc.Index,
			Verdict:   "OK",
			Actual:    ${meta.params[0]?.name || 'nil'},
			RuntimeMs: elapsed,
		})
		`
        : `
		rawActual := ${methodName}(${meta.params.map((p) => p.name).join(', ')})
		elapsed := time.Since(start).Seconds() * 1000.0

		var actualVal interface{} = rawActual
		${
      returnType === 'ListNode'
        ? `actualVal = listToArray(rawActual)`
        : returnType === 'TreeNode'
        ? `actualVal = treeToArray(rawActual)`
        : ''
    }

		results = append(results, TestResultOutput{
			Index:     tc.Index,
			Verdict:   "OK",
			Actual:    actualVal,
			RuntimeMs: elapsed,
		})
		`
    }
		`
    }
	}

	outJson, _ := json.Marshal(results)
	os.Stdout.Write(outJson)
}
`;
}

export interface GoExecutionOptions {
  problemMeta: ProblemMeta;
  code: string;
  tests: { index: number; inputs: Record<string, unknown> }[];
  timeLimitMs?: number;
  memoryLimitMb?: number;
}

/**
 * Execute Go solution against input test cases.
 */
export async function executeGoSolution(options: GoExecutionOptions): Promise<JudgeExecutionResult> {
  const { problemMeta, code, tests, timeLimitMs = 2000 } = options;

  const goCmd = await getGoCompilerCommand();
  const runId = `judge_go_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const scratchDir = path.resolve(process.cwd(), '.scratch', runId);
  fs.mkdirSync(scratchDir, { recursive: true });

  const goModPath = path.join(scratchDir, 'go.mod');
  const dsPath = path.join(scratchDir, 'ds.go');
  const solutionPath = path.join(scratchDir, 'solution.go');
  const mainPath = path.join(scratchDir, 'main.go');
  const inputPath = path.join(scratchDir, 'input.json');
  const exePath = path.join(scratchDir, process.platform === 'win32' ? 'driver.exe' : 'driver');

  try {
    // 1. Write go.mod
    fs.writeFileSync(goModPath, 'module runner\n\ngo 1.20\n', 'utf8');

    // 2. Write data structures
    fs.writeFileSync(dsPath, generateDataStructuresGo(), 'utf8');

    // 3. Write user solution (prepend package main\n\n)
    const userCodeWithPackage = code.trim().startsWith('package ') ? code : `package main\n\n${code}`;
    fs.writeFileSync(solutionPath, userCodeWithPackage, 'utf8');

    // 4. Write driver main.go
    fs.writeFileSync(mainPath, generateMainGo(problemMeta), 'utf8');

    // 5. Write inputs
    fs.writeFileSync(inputPath, JSON.stringify(tests), 'utf8');

    // 6. Build driver with Go compiler
    const buildCmd = `"${goCmd}" build -o "${exePath}" .`;

    try {
      await execAsync(buildCmd, { cwd: scratchDir, timeout: 15000 });
    } catch (compileErr: any) {
      const errOut = (compileErr.stderr || compileErr.stdout || compileErr.message || '').toString();
      // Adjust line number for package main\n\n header offset (subtract 2 lines)
      const cleaned = errOut
        .split('\n')
        .map((l: string) => {
          return l.replace(/solution\.go:(\d+):/, (_match: string, p1: string) => {
            const line = Math.max(1, parseInt(p1, 10) - 2);
            return `solution.go:${line}:`;
          });
        })
        .filter((l: string) => !l.includes('main.go:') && !l.includes('ds.go:'))
        .join('\n')
        .trim();

      return {
        verdict: 'Compile Error',
        compileError: cleaned || 'Go Compilation Error',
        totalRuntimeMs: 0,
      };
    }

    // 7. Run compiled driver binary
    const startTime = Date.now();
    const runResult = await new Promise<{ stdout: string; stderr: string; code: number | null }>((resolve) => {
      const child = spawn(exePath, [], {
        cwd: scratchDir,
        windowsHide: true,
      });

      let stdout = '';
      let stderr = '';
      let killed = false;

      const timer = setTimeout(() => {
        killed = true;
        child.kill();
      }, Math.max(timeLimitMs * tests.length, 3000));

      child.stdout.on('data', (d) => {
        stdout += d.toString();
      });
      child.stderr.on('data', (d) => {
        stderr += d.toString();
      });

      child.on('close', (exitCode) => {
        clearTimeout(timer);
        if (killed) {
          resolve({ stdout, stderr: 'Time Limit Exceeded', code: 124 });
        } else {
          resolve({ stdout, stderr, code: exitCode });
        }
      });

      child.on('error', (err) => {
        clearTimeout(timer);
        resolve({ stdout, stderr: err.message, code: 1 });
      });
    });

    const totalRuntimeMs = Date.now() - startTime;

    if (runResult.code === 124) {
      return {
        verdict: 'Time Limit Exceeded',
        error: 'Execution exceeded time limit',
        totalRuntimeMs,
      };
    }

    if (runResult.code !== 0 && !runResult.stdout.trim().endsWith(']')) {
      return {
        verdict: 'Runtime Error',
        error: runResult.stderr || `Process exited with code ${runResult.code}`,
        totalRuntimeMs,
      };
    }

    // Parse JSON outputs
    try {
      const trimmed = runResult.stdout.trim();
      const jsonStart = trimmed.indexOf('[');
      const jsonEnd = trimmed.lastIndexOf(']');
      if (jsonStart === -1 || jsonEnd === -1) {
        throw new Error('No JSON output array found');
      }
      const parsedOutputs = JSON.parse(trimmed.slice(jsonStart, jsonEnd + 1)) as RawTestOutput[];

      return {
        verdict: 'Accepted',
        totalRuntimeMs,
        testOutputs: parsedOutputs,
      };
    } catch (parseErr: any) {
      return {
        verdict: 'Runtime Error',
        error: `Output parse failed: ${parseErr.message}\nRaw stdout: ${runResult.stdout.slice(0, 500)}`,
        totalRuntimeMs,
      };
    }
  } finally {
    try {
      fs.rmSync(scratchDir, { recursive: true, force: true });
    } catch {
      // ignore cleanup errors
    }
  }
}
