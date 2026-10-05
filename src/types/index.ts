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

export interface AppExportData {
  version: 1;
  exportedAt: string;
  settings?: Settings;
  progress: Progress[];
  codeVersions: CodeVersion[];
}
