import { AppExportData, CodeVersion, Problem, Progress, Settings } from '../types';

export interface ImportValidationResult {
  valid: boolean;
  error?: string;
  data?: AppExportData;
}

/**
 * Validate imported JSON object schema
 */
export function validateImportData(rawJson: unknown): ImportValidationResult {
  if (!rawJson || typeof rawJson !== 'object') {
    return { valid: false, error: 'Invalid file format: JSON root must be an object' };
  }

  const obj = rawJson as Record<string, unknown>;

  if (obj.version !== 1) {
    return { valid: false, error: 'Unsupported export version (expected version 1)' };
  }

  if (!Array.isArray(obj.progress)) {
    return { valid: false, error: 'Missing or invalid "progress" array' };
  }

  if (!Array.isArray(obj.codeVersions)) {
    return { valid: false, error: 'Missing or invalid "codeVersions" array' };
  }

  // Validate each progress item minimally
  for (let i = 0; i < obj.progress.length; i++) {
    const item = obj.progress[i];
    if (!item || typeof item.problemId !== 'number' || typeof item.status !== 'string') {
      return { valid: false, error: `Invalid progress item at index ${i}` };
    }
  }

  // Validate each codeVersion item minimally
  for (let i = 0; i < obj.codeVersions.length; i++) {
    const v = obj.codeVersions[i];
    if (
      !v ||
      typeof v.id !== 'string' ||
      typeof v.problemId !== 'number' ||
      typeof v.versionNumber !== 'number' ||
      typeof v.code !== 'string' ||
      typeof v.timeComplexity !== 'string' ||
      typeof v.spaceComplexity !== 'string'
    ) {
      return { valid: false, error: `Invalid code version item at index ${i}` };
    }
  }

  return {
    valid: true,
    data: obj as unknown as AppExportData,
  };
}

/**
 * Export full state to JSON string
 */
export function exportAppToJson(data: {
  progress: Progress[];
  codeVersions: CodeVersion[];
  settings?: Settings;
}): string {
  const exportPayload: AppExportData = {
    version: 1,
    exportedAt: new Date().toISOString(),
    settings: data.settings,
    progress: data.progress,
    codeVersions: data.codeVersions,
  };

  return JSON.stringify(exportPayload, null, 2);
}

/**
 * Generate Markdown study log of all solved problems.
 * CRITICAL RULE (Section 4.3.1 - 10):
 * The Markdown report only includes a topic if it was revealed; NEVER include hint text!
 */
export function generateMarkdownReport(params: {
  problems: Problem[];
  progressList: Progress[];
  codeVersions: CodeVersion[];
  spoilerSafeMode: boolean;
}): string {
  const { problems, progressList, codeVersions, spoilerSafeMode } = params;

  const progressMap = new Map<number, Progress>();
  for (const p of progressList) {
    progressMap.set(p.problemId, p);
  }

  const versionsByProblem = new Map<number, CodeVersion[]>();
  for (const v of codeVersions) {
    const list = versionsByProblem.get(v.problemId) || [];
    list.push(v);
    versionsByProblem.set(v.problemId, list);
  }

  // Filter only solved problems
  const solvedProblems = problems.filter((p) => {
    const prog = progressMap.get(p.id);
    return prog?.status === 'SOLVED';
  });

  const lines: string[] = [];
  lines.push('# Blind 75 — Solved Problems Study Report');
  lines.push('');
  lines.push(`Generated: ${new Date().toLocaleDateString()} | Total Solved: ${solvedProblems.length} / 75`);
  lines.push('');

  if (solvedProblems.length === 0) {
    lines.push('_No problems solved yet._');
    return lines.join('\n');
  }

  for (const prob of solvedProblems) {
    const prog = progressMap.get(prob.id);
    const versions = versionsByProblem.get(prob.id) || [];
    const bestVersion = versions.find((v) => v.isBest) || versions[versions.length - 1];

    // Check if topic is revealed
    const topicCanBeShown = !spoilerSafeMode || Boolean(prog?.topicRevealed);
    const topicDisplay = topicCanBeShown ? prob.topic : 'Hidden (Spoiler-Safe)';

    lines.push(`## [Day ${prob.day}] #${prob.id} — ${prob.title}`);
    lines.push(`- **Difficulty**: ${prob.difficulty}`);
    lines.push(`- **Topic**: ${topicDisplay}`);
    if (prog?.firstSolvedAt) {
      lines.push(`- **Solved At**: ${new Date(prog.firstSolvedAt).toLocaleDateString()}`);
    }
    if (prog?.remarks) {
      lines.push('');
      lines.push('### Problem Remarks');
      lines.push(prog.remarks);
    }

    if (bestVersion) {
      lines.push('');
      lines.push(`### Best Solution (v${bestVersion.versionNumber}${bestVersion.label ? ` - ${bestVersion.label}` : ''})`);
      lines.push(`- **Time Complexity**: \`${bestVersion.timeComplexity}\``);
      lines.push(`- **Space Complexity**: \`${bestVersion.spaceComplexity}\``);
      if (bestVersion.remarks) {
        lines.push(`- **Version Notes**: ${bestVersion.remarks}`);
      }
      lines.push('');
      lines.push('```java');
      lines.push(bestVersion.code);
      lines.push('```');
    }

    lines.push('');
    lines.push('---');
    lines.push('');
  }

  return lines.join('\n');
}
