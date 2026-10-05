import { useEffect, useState, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  db,
  initDatabase,
  clearAllUserData,
  rehideAllSpoilers,
  DEFAULT_SETTINGS,
} from './db/db';
import { Problem, Progress, CodeVersion, Settings, Submission, CustomCase } from './types';
import { Navbar, NavigationTab } from './components/layout/Navbar';
import { DashboardView } from './components/dashboard/DashboardView';
import { PlanView } from './components/plan/PlanView';
import { AllProblemsView } from './components/problems/AllProblemsView';
import { ProblemDetailView } from './components/problems/ProblemDetailView';
import { SettingsView } from './components/settings/SettingsView';
import { Modal } from './components/common/Modal';
import { ToastProvider, useToast } from './components/common/Toast';
import { calculateStreaks } from './utils/streaks';

function AppContent() {
  const { showToast } = useToast();

  // Navigation and active states
  const [currentTab, setCurrentTab] = useState<NavigationTab>('dashboard');
  const [activeProblemId, setActiveProblemId] = useState<number | null>(null);
  const [planSelectedDay, setPlanSelectedDay] = useState<number>(1);
  const [clearTrackModalOpen, setClearTrackModalOpen] = useState(false);
  const [clearConfirmText, setClearConfirmText] = useState('');

  // Live query data from Dexie
  const problems = useLiveQuery(() => db.problems.toArray(), [], [] as Problem[]);
  const progressList = useLiveQuery(() => db.progress.toArray(), [], [] as Progress[]);
  const codeVersions = useLiveQuery(() => db.codeVersions.toArray(), [], [] as CodeVersion[]);
  const submissionsList = useLiveQuery(() => db.submissions.toArray(), [], [] as Submission[]);
  const customCasesList = useLiveQuery(() => db.customCases.toArray(), [], [] as CustomCase[]);
  const dbSettings = useLiveQuery(() => db.settings.get('current'), []);

  const settings: Settings = dbSettings || DEFAULT_SETTINGS;

  // Initialize DB and seeds on mount
  useEffect(() => {
    initDatabase().catch((err) => {
      console.error('Failed to initialize database:', err);
    });
  }, []);

  // Quick lookup maps
  const progressMap = useMemo(() => {
    const map = new Map<number, Progress>();
    for (const p of progressList) {
      map.set(p.problemId, p);
    }
    return map;
  }, [progressList]);

  const bestVersionsMap = useMemo(() => {
    const map = new Map<number, boolean>();
    for (const v of codeVersions) {
      if (v.isBest) {
        map.set(v.problemId, true);
      }
    }
    return map;
  }, [codeVersions]);

  // Overall solved count & Streaks
  const solvedDateStrings = useMemo(() => {
    return progressList
      .filter((p) => p.status === 'SOLVED')
      .map((p) => p.firstSolvedAt || p.lastUpdatedAt)
      .filter(Boolean) as string[];
  }, [progressList]);

  const { currentStreak, longestStreak } = useMemo(() => {
    return calculateStreaks(solvedDateStrings);
  }, [solvedDateStrings]);

  const solvedCount = progressList.filter((p) => p.status === 'SOLVED').length;

  // Active problem object
  const activeProblem = useMemo(() => {
    if (!activeProblemId) return null;
    return problems.find((p) => p.id === activeProblemId) || null;
  }, [problems, activeProblemId]);

  const activeProblemVersions = useMemo(() => {
    if (!activeProblemId) return [];
    return codeVersions.filter((v) => v.problemId === activeProblemId);
  }, [codeVersions, activeProblemId]);

  const activeProblemSubmissions = useMemo(() => {
    if (!activeProblemId) return [];
    return submissionsList
      .filter((s) => s.problemId === activeProblemId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [submissionsList, activeProblemId]);

  const activeProblemCustomCases = useMemo(() => {
    if (!activeProblemId) return [];
    return customCasesList.filter((c) => c.problemId === activeProblemId);
  }, [customCasesList, activeProblemId]);

  // Handlers
  const handleUpdateProgress = async (problemId: number, updates: Partial<Progress>) => {
    const existing = progressMap.get(problemId);
    const now = new Date().toISOString();

    if (existing) {
      await db.progress.update(problemId, {
        ...updates,
        lastUpdatedAt: now,
      });
    } else {
      await db.progress.put({
        problemId,
        status: updates.status || 'NOT_STARTED',
        remarks: updates.remarks || '',
        topicRevealed: updates.topicRevealed ?? false,
        hintsRevealed: updates.hintsRevealed ?? 0,
        firstSolvedAt: updates.status === 'SOLVED' ? now : undefined,
        lastUpdatedAt: now,
      });
    }
  };

  const handleSaveNewVersion = async (newVersion: CodeVersion) => {
    await db.transaction('rw', db.codeVersions, async () => {
      // If marked as best, unmark other versions for this problem
      if (newVersion.isBest) {
        const others = codeVersions.filter((v) => v.problemId === newVersion.problemId);
        for (const o of others) {
          if (o.isBest) {
            await db.codeVersions.update(o.id, { isBest: false });
          }
        }
      }
      await db.codeVersions.add(newVersion);
    });
  };

  const handleUpdateVersion = async (version: CodeVersion) => {
    await db.codeVersions.put(version);
  };

  const handleDeleteVersion = async (versionId: string) => {
    await db.codeVersions.delete(versionId);
  };

  const handleMarkBestVersion = async (versionId: string) => {
    const target = codeVersions.find((v) => v.id === versionId);
    if (!target) return;

    await db.transaction('rw', db.codeVersions, async () => {
      const isCurrentlyBest = target.isBest;
      const problemVersions = codeVersions.filter((v) => v.problemId === target.problemId);

      for (const v of problemVersions) {
        await db.codeVersions.update(v.id, {
          isBest: !isCurrentlyBest && v.id === versionId,
        });
      }
    });
  };

  const handleAddSubmission = async (sub: Submission) => {
    await db.submissions.add(sub);
  };

  const handleAddCustomCase = async (cc: CustomCase) => {
    await db.customCases.add(cc);
  };

  const handleDeleteCustomCase = async (id: string) => {
    await db.customCases.delete(id);
  };

  const handleUpdateSettings = async (newSettings: Partial<Settings>) => {
    const current = await db.settings.get('current');
    const updated = { ...(current || DEFAULT_SETTINGS), ...newSettings };
    await db.settings.put(updated);
  };

  const handleRehideAllSpoilers = async () => {
    await rehideAllSpoilers();
  };

  const handleClearTrack = async () => {
    await clearAllUserData();
    setActiveProblemId(null);
  };

  const handleImportData = async (
    importedProgress: Progress[],
    importedVersions: CodeVersion[],
    importedSettings?: Settings,
    mode: 'replace' | 'merge' = 'replace',
    importedSubmissions?: Submission[],
    importedCustomCases?: CustomCase[]
  ) => {
    await db.transaction(
      'rw',
      db.progress,
      db.codeVersions,
      db.settings,
      db.submissions,
      db.customCases,
      async () => {
        if (mode === 'replace') {
          await db.progress.clear();
          await db.codeVersions.clear();
          await db.submissions.clear();
          await db.customCases.clear();
          await db.progress.bulkAdd(importedProgress);
          await db.codeVersions.bulkAdd(importedVersions);
          if (importedSubmissions?.length) await db.submissions.bulkAdd(importedSubmissions);
          if (importedCustomCases?.length) await db.customCases.bulkAdd(importedCustomCases);
        } else {
          await db.progress.bulkPut(importedProgress);
          await db.codeVersions.bulkPut(importedVersions);
          if (importedSubmissions?.length) await db.submissions.bulkPut(importedSubmissions);
          if (importedCustomCases?.length) await db.customCases.bulkPut(importedCustomCases);
        }
        if (importedSettings) {
          await db.settings.put({
            ...DEFAULT_SETTINGS,
            ...importedSettings,
            id: 'current',
          });
        }
      }
    );
  };

  const handleOpenProblem = (problemId: number) => {
    setActiveProblemId(problemId);
  };

  const handleBackFromProblem = () => {
    setActiveProblemId(null);
  };

  return (
    <div className="min-h-screen bg-mono-950 text-mono-100 flex flex-col font-sans">
      {/* NAVBAR: hidden in workspace view for maximum screen area */}
      {!activeProblem && (
        <Navbar
          currentTab={currentTab}
          onSelectTab={(tab) => {
            setActiveProblemId(null);
            setCurrentTab(tab);
          }}
          solvedCount={solvedCount}
          currentStreak={currentStreak}
          settings={settings}
          onClearTrackClick={() => {
            setClearConfirmText('');
            setClearTrackModalOpen(true);
          }}
        />
      )}

      {/* MAIN VIEW CONTAINER */}
      <main
        className={
          activeProblem
            ? 'flex-1 w-full h-screen overflow-hidden'
            : 'flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8'
        }
      >
        {/* If a problem is currently opened, display ProblemDetailView */}
        {activeProblem ? (
          <ProblemDetailView
            problem={activeProblem}
            allProblems={problems}
            progress={progressMap.get(activeProblem.id)}
            versions={activeProblemVersions}
            submissions={activeProblemSubmissions}
            customCases={activeProblemCustomCases}
            settings={settings}
            onBack={handleBackFromProblem}
            onNavigateProblem={handleOpenProblem}
            onUpdateProgress={(updates) => handleUpdateProgress(activeProblem.id, updates)}
            onSaveNewVersion={handleSaveNewVersion}
            onUpdateVersion={handleUpdateVersion}
            onDeleteVersion={handleDeleteVersion}
            onMarkBestVersion={handleMarkBestVersion}
            onAddSubmission={handleAddSubmission}
            onAddCustomCase={handleAddCustomCase}
            onDeleteCustomCase={handleDeleteCustomCase}
          />
        ) : (
          <>
            {currentTab === 'dashboard' && (
              <DashboardView
                problems={problems}
                progressMap={progressMap}
                settings={settings}
                currentStreak={currentStreak}
                longestStreak={longestStreak}
                onOpenProblem={handleOpenProblem}
                onUpdateProgress={handleUpdateProgress}
                onNavigateToPlanDay={(day) => {
                  setPlanSelectedDay(day);
                  setCurrentTab('plan');
                }}
                onNavigateToUnsolvedBehind={() => {
                  setCurrentTab('problems');
                }}
              />
            )}

            {currentTab === 'plan' && (
              <PlanView
                problems={problems}
                progressMap={progressMap}
                settings={settings}
                selectedDay={planSelectedDay}
                onOpenProblem={handleOpenProblem}
                onUpdateProgress={handleUpdateProgress}
              />
            )}

            {currentTab === 'problems' && (
              <AllProblemsView
                problems={problems}
                progressMap={progressMap}
                bestVersionsMap={bestVersionsMap}
                settings={settings}
                onOpenProblem={handleOpenProblem}
                onUpdateProgress={handleUpdateProgress}
              />
            )}

            {currentTab === 'settings' && (
              <SettingsView
                settings={settings}
                problems={problems}
                progressList={progressList}
                codeVersions={codeVersions}
                submissionsList={submissionsList}
                customCasesList={customCasesList}
                onUpdateSettings={handleUpdateSettings}
                onRehideAllSpoilers={handleRehideAllSpoilers}
                onClearTrack={handleClearTrack}
                onImportData={handleImportData}
              />
            )}
          </>
        )}
      </main>

      {/* QUICK RESET / CLEAR TRACK MODAL */}
      <Modal
        isOpen={clearTrackModalOpen}
        onClose={() => setClearTrackModalOpen(false)}
        title="⚠️ Reset Entire Study Track?"
        maxWidth="max-w-md"
      >
        <div className="flex flex-col gap-4 text-xs text-mono-300">
          <p className="text-rose-300">
            This will permanently delete all your progress marks, problem remarks, and saved Java versions from your browser.
          </p>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="quickResetConfirmInput" className="font-mono text-mono-400">
              Type <strong className="text-mono-100">RESET</strong> to confirm:
            </label>
            <input
              id="quickResetConfirmInput"
              type="text"
              value={clearConfirmText}
              onChange={(e) => setClearConfirmText(e.target.value)}
              placeholder="RESET"
              className="bg-mono-950 border border-mono-800 rounded-lg px-3 py-2 text-xs font-mono text-mono-100 uppercase focus:outline-none focus:border-rose-600"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-mono-800">
            <button
              type="button"
              onClick={() => setClearTrackModalOpen(false)}
              className="px-3 py-1.5 rounded-lg font-mono text-mono-400 hover:text-mono-200"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={clearConfirmText !== 'RESET'}
              onClick={async () => {
                if (clearConfirmText === 'RESET') {
                  await handleClearTrack();
                  setClearTrackModalOpen(false);
                  showToast('Track cleared. Tracker reset to fresh start.', 'info');
                }
              }}
              className="px-4 py-1.5 rounded-lg font-mono font-semibold bg-rose-600 hover:bg-rose-500 disabled:opacity-40 disabled:cursor-not-allowed text-white shadow"
            >
              Reset All Data
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}
