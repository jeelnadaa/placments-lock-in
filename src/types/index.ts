export type ProblemDifficulty = 'Easy' | 'Medium' | 'Hard';

export type ProblemStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'SOLVED' | 'NEEDS_REVISION';

export interface Problem {
  id: number;
  title: string;
  day: number;
  order: number;
  topic: string;
  difficulty: ProblemDifficulty;
  leetcodeUrl: string;
  neetcodeUrl: string | null;
  leetcodePremium: boolean;
  hints: string[];
}

export interface Progress {
  problemId: number;
  status: ProblemStatus;
  remarks: string;
  topicRevealed: boolean;
  hintsRevealed: 0 | 1 | 2 | 3;
  firstSolvedAt?: string;
  lastUpdatedAt: string;
  // Execution tracking additions
  attempts?: number;
  firstAcceptedAt?: string;
  timeToAcceptMs?: number;
}

export interface CodeVersion {
  id: string;
  problemId: number;
  versionNumber: number;
  label?: string;
  language: 'java';
  code: string;
  timeComplexity: string;
  spaceComplexity: string;
  remarks: string;
  isBest: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface Settings {
  id?: string; // used for Dexie key
  startDate: string; // YYYY-MM-DD
  theme: 'system' | 'light' | 'dark';
  spoilerSafeMode: boolean; // default true
  autoRevealTopicOnSolve: boolean; // default true
  fontSize?: number; // default 14 or 15
}

export interface SafeProblemView {
  id: number;
  title: string;
  day: number;
  order: number;
  difficulty: ProblemDifficulty;
  leetcodeUrl: string;
  neetcodeUrl: string | null;
  leetcodePremium: boolean;
  // Spoiler safe attributes:
  isTopicRevealed: boolean;
  topic: string | null; // strictly null when not revealed in spoiler-safe mode
  revealedHints: string[]; // only reveals unlocked hints (length 0..3)
  hintsRevealedCount: number;
  totalHints: number;
  nextAvailableHintIndex: number | null; // 1, 2, or 3, or null if all revealed
}

export type VerdictType =
  | 'Accepted'
  | 'Wrong Answer'
  | 'Runtime Error'
  | 'Time Limit Exceeded'
  | 'Memory Limit Exceeded'
  | 'Compile Error';

export interface FailingTestDetail {
  index: number;
  input: Record<string, unknown> | string;
  actual?: string;
  expected?: string;
  stdout?: string;
  error?: string;
  stackTrace?: string;
}

export interface Submission {
  id: string;
  problemId: number;
  versionId?: string;
  code: string;
  verdict: VerdictType;
  passed: number;
  total: number;
  runtimeMs: number;
  failing?: FailingTestDetail;
  createdAt: string;
}

export interface CustomCase {
  id: string;
  problemId: number;
  inputs: Record<string, string>;
  source: 'user' | 'hidden-failure';
  createdAt: string;
}

export type ProblemKind = 'function' | `inplace:${number}` | 'class';
export type ComparatorType = 'exact' | 'unordered' | 'unordered-nested' | 'set-of-pairs' | 'checker';

export interface ParamDef {
  name: string;
  type: string;
}

export interface ExampleCase {
  input: Record<string, unknown>;
  output: unknown;
  explanation?: string;
}

export interface ProblemMeta {
  id: number;
  className: string;
  methodName: string;
  params: ParamDef[];
  returnType: string;
  kind: ProblemKind;
  comparator: ComparatorType;
  timeLimitMs?: number;
  memoryLimitMb?: number;
  examples: ExampleCase[];
  constraints: string[];
  followUp?: string;
}

export interface TestResultItem {
  index: number;
  passed: boolean;
  input: Record<string, unknown>;
  expected?: unknown;
  actual?: unknown;
  stdout?: string;
  runtimeMs?: number;
  error?: string;
  stackTrace?: string;
}

export interface RunResponse {
  verdict: VerdictType;
  results: TestResultItem[];
  runtimeMs: number;
  error?: string;
  compileError?: string;
}

export interface SubmitResponse {
  verdict: VerdictType;
  passed: number;
  total: number;
  runtimeMs: number;
  failing?: FailingTestDetail;
  error?: string;
  compileError?: string;
}

export interface AppExportData {
  version: 1 | 2;
  exportedAt: string;
  settings?: Settings;
  progress: Progress[];
  codeVersions: CodeVersion[];
  submissions?: Submission[];
  customCases?: CustomCase[];
}
