import { ProblemMeta, SupportedLanguage } from './types';
import {
  generatePythonStarterCode,
  generateCppStarterCode,
  generateCStarterCode,
  generateGoStarterCode,
} from './utils/starterCode';

// Eagerly bundle problem content that is ready
const metaModules = import.meta.glob('../content/problems/*/meta.json', { eager: true, import: 'default' }) as Record<string, ProblemMeta>;
const statementModules = import.meta.glob('../content/problems/*/statement.md', { eager: true, query: '?raw', import: 'default' }) as Record<string, string>;
const starterModules = import.meta.glob('../content/problems/*/starter/Solution.java', { eager: true, query: '?raw', import: 'default' }) as Record<string, string>;
const pythonStarterModules = import.meta.glob('../content/problems/*/starter/Solution.py', { eager: true, query: '?raw', import: 'default' }) as Record<string, string>;
const cppStarterModules = import.meta.glob('../content/problems/*/starter/Solution.cpp', { eager: true, query: '?raw', import: 'default' }) as Record<string, string>;
const cStarterModules = import.meta.glob('../content/problems/*/starter/Solution.c', { eager: true, query: '?raw', import: 'default' }) as Record<string, string>;
const goStarterModules = import.meta.glob('../content/problems/*/starter/Solution.go', { eager: true, query: '?raw', import: 'default' }) as Record<string, string>;

export interface ProblemFullContent {
  meta: ProblemMeta;
  statement: string;
  starterCode: string;
}

const contentByProblemId = new Map<number, ProblemFullContent>();

for (const [filePath, meta] of Object.entries(metaModules)) {
  const match = filePath.match(/problems\/(\d+)\/meta\.json$/);
  if (match) {
    const id = Number(match[1]);
    const statementPath = `../content/problems/${id}/statement.md`;
    const starterPath = `../content/problems/${id}/starter/Solution.java`;

    contentByProblemId.set(id, {
      meta,
      statement: statementModules[statementPath] || '',
      starterCode: starterModules[starterPath] || '',
    });
  }
}

export function getProblemContent(problemId: number): ProblemFullContent | undefined {
  return contentByProblemId.get(problemId);
}

export function hasProblemContent(problemId: number): boolean {
  return contentByProblemId.has(problemId);
}

/**
 * Retrieve stored starter code tailored for specific language
 */
export function getProblemStarterCode(problemId: number, language: SupportedLanguage): string {
  const content = getProblemContent(problemId);
  if (!content) return '';

  if (language === 'python') {
    const pyPath = `../content/problems/${problemId}/starter/Solution.py`;
    if (pythonStarterModules[pyPath]) {
      return pythonStarterModules[pyPath];
    }
    return generatePythonStarterCode(content.meta);
  }

  if (language === 'cpp') {
    const cppPath = `../content/problems/${problemId}/starter/Solution.cpp`;
    if (cppStarterModules[cppPath]) {
      return cppStarterModules[cppPath];
    }
    return generateCppStarterCode(content.meta);
  }

  if (language === 'c') {
    const cPath = `../content/problems/${problemId}/starter/Solution.c`;
    if (cStarterModules[cPath]) {
      return cStarterModules[cPath];
    }
    return generateCStarterCode(content.meta);
  }

  if (language === 'go') {
    const goPath = `../content/problems/${problemId}/starter/Solution.go`;
    if (goStarterModules[goPath]) {
      return goStarterModules[goPath];
    }
    return generateGoStarterCode(content.meta);
  }

  return content.starterCode || `class Solution {\n    // Solution for ${problemId}\n}`;
}
