import Dexie, { Table } from 'dexie';
import { Problem, Progress, CodeVersion, Settings } from '../types';
import seedProblemsRaw from '../data/seedProblems.json';
import { toLocalDateString } from '../utils/streaks';

export class Blind75Database extends Dexie {
  problems!: Table<Problem, number>;
  progress!: Table<Progress, number>;
  codeVersions!: Table<CodeVersion, string>;
  settings!: Table<Settings, string>;

  constructor() {
    super('Blind75Database');

    this.version(1).stores({
      problems: 'id, day, order, topic, difficulty',
      progress: 'problemId, status, lastUpdatedAt',
      codeVersions: 'id, problemId, [problemId+versionNumber], isBest, createdAt',
      settings: 'id',
    });
  }
}

export const db = new Blind75Database();

export const DEFAULT_SETTINGS: Settings = {
  id: 'current',
  startDate: toLocalDateString(new Date()),
  theme: 'dark',
  spoilerSafeMode: true,
  autoRevealTopicOnSolve: true,
};

/**
 * Seed the database if problems table is empty.
 * Idempotent: Never overwrites or deletes existing user progress or versions.
 */
export async function initDatabase(): Promise<void> {
  const problemCount = await db.problems.count();
  if (problemCount === 0) {
    const problems = seedProblemsRaw as Problem[];
    await db.problems.bulkAdd(problems);
  }

  const existingSettings = await db.settings.get('current');
  if (!existingSettings) {
    await db.settings.put(DEFAULT_SETTINGS);
  }
}

/**
 * Wipe all user tracking data (progress, code versions) while keeping the 75 problems.
 * User-requested feature: clear track and reset all progress.
 */
export async function clearAllUserData(): Promise<void> {
  await db.transaction('rw', db.progress, db.codeVersions, db.settings, async () => {
    await db.progress.clear();
    await db.codeVersions.clear();
    await db.settings.put({
      ...DEFAULT_SETTINGS,
      startDate: toLocalDateString(new Date()),
    });
  });
}

/**
 * Re-hide all topics and hints across all problems without deleting remarks or code
 */
export async function rehideAllSpoilers(): Promise<void> {
  await db.progress.toCollection().modify((prog) => {
    prog.topicRevealed = false;
    prog.hintsRevealed = 0;
  });
}
