import React, { useState } from 'react';
import {
  Download,
  Upload,
  Shield,
  FileText,
  AlertTriangle,
  Calendar,
  EyeOff,
  Trash2,
} from 'lucide-react';
import { Settings, Problem, Progress, CodeVersion, Submission, CustomCase } from '../../types';
import { Modal } from '../common/Modal';
import { useToast } from '../common/Toast';
import {
  exportAppToJson,
  generateMarkdownReport,
  validateImportData,
} from '../../utils/importExport';
import { toLocalDateString } from '../../utils/streaks';

interface SettingsViewProps {
  settings: Settings;
  problems: Problem[];
  progressList: Progress[];
  codeVersions: CodeVersion[];
  submissionsList?: Submission[];
  customCasesList?: CustomCase[];
  onUpdateSettings: (newSettings: Partial<Settings>) => Promise<void>;
  onRehideAllSpoilers: () => Promise<void>;
  onClearTrack: () => Promise<void>;
  onImportData: (
    importedProgress: Progress[],
    importedVersions: CodeVersion[],
    importedSettings?: Settings,
    mode?: 'replace' | 'merge',
    importedSubmissions?: Submission[],
    importedCustomCases?: CustomCase[]
  ) => Promise<void>;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  problems,
  progressList,
  codeVersions,
  submissionsList,
  customCasesList,
  onUpdateSettings,
  onRehideAllSpoilers,
  onClearTrack,
  onImportData,
}) => {
  const { showToast } = useToast();
  const todayStr = toLocalDateString(new Date());

  // Modals state
  const [spoilerOffModalOpen, setSpoilerOffModalOpen] = useState(false);
  const [rehideAllModalOpen, setRehideAllModalOpen] = useState(false);
  const [clearTrackModalOpen, setClearTrackModalOpen] = useState(false);
  const [clearConfirmText, setClearConfirmText] = useState('');

  // Import modal state
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importStrategy, setImportStrategy] = useState<'replace' | 'merge'>('replace');
  const [pendingImportData, setPendingImportData] = useState<{
    progress: Progress[];
    codeVersions: CodeVersion[];
    settings?: Settings;
    submissions?: Submission[];
    customCases?: CustomCase[];
  } | null>(null);

  // File download helper
  const downloadFile = (filename: string, content: string, contentType: string) => {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Export full JSON
  const handleExportJson = () => {
    const jsonStr = exportAppToJson({
      progress: progressList,
      codeVersions,
      settings,
      submissions: submissionsList,
      customCases: customCasesList,
    });
    const filename = `blind75-backup-${new Date().toISOString().slice(0, 10)}.json`;
    downloadFile(filename, jsonStr, 'application/json');
    showToast('Exported all study data and code to JSON', 'success');
  };

  // Export Markdown Report
  const handleExportMarkdown = () => {
    const md = generateMarkdownReport({
      problems,
      progressList,
      codeVersions,
      spoilerSafeMode: settings.spoilerSafeMode !== false,
    });
    const filename = `blind75-solved-report-${new Date().toISOString().slice(0, 10)}.md`;
    downloadFile(filename, md, 'text/markdown');
    showToast('Exported Markdown study report of solved problems', 'success');
  };

  // Handle file select for JSON import
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const raw = JSON.parse(event.target?.result as string);
        const validation = validateImportData(raw);

        if (!validation.valid || !validation.data) {
          showToast(`Invalid JSON file: ${validation.error}`, 'error');
          return;
        }

        setPendingImportData({
          progress: validation.data.progress,
          codeVersions: validation.data.codeVersions,
          settings: validation.data.settings,
          submissions: validation.data.submissions,
          customCases: validation.data.customCases,
        });
        setImportModalOpen(true);
      } catch (err: unknown) {
        showToast(err instanceof Error ? err.message : 'Failed to parse JSON file', 'error');
      }
    };
    reader.readAsText(file);
    // Reset input
    e.target.value = '';
  };

  // Execute import
  const handleConfirmImport = async () => {
    if (!pendingImportData) return;
    try {
      await onImportData(
        pendingImportData.progress,
        pendingImportData.codeVersions,
        pendingImportData.settings,
        importStrategy,
        pendingImportData.submissions,
        pendingImportData.customCases
      );
      setImportModalOpen(false);
      setPendingImportData(null);
      showToast('Import completed successfully!', 'success');
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Import failed', 'error');
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-20 max-w-4xl mx-auto">
      {/* HEADER */}
      <div>
        <h1 className="text-xl font-bold text-mono-100 tracking-tight">Settings & Persistence</h1>
        <p className="text-xs text-mono-400 mt-1">
          Configure study schedule, spoiler protections, local storage backups, and data reset.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {/* SECTION 1: SCHEDULE & PLAN */}
        <div className="p-6 rounded-2xl bg-mono-900 border border-mono-800 shadow-md flex flex-col gap-4">
          <div className="flex items-center gap-2 pb-2 border-b border-mono-800">
            <Calendar className="w-4 h-4 text-mono-400" />
            <h2 className="text-sm font-bold text-mono-100 uppercase font-mono tracking-wider">
              Study Plan Schedule
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="startDateInput" className="text-xs font-semibold text-mono-200">
                Study Plan Start Date
              </label>
              <p className="text-xs text-mono-400">
                Maps each of the 15 days to a calendar date and calculates your &quot;Today&apos;s Plan&quot;.
              </p>
            </div>

            <input
              id="startDateInput"
              type="date"
              max={todayStr}
              value={settings.startDate || ''}
              onChange={(e) => {
                const val = e.target.value;
                if (!val) return;
                if (val > todayStr) {
                  showToast('Start date cannot be later than today', 'error');
                  onUpdateSettings({ startDate: todayStr });
                } else {
                  onUpdateSettings({ startDate: val });
                }
              }}
              className="bg-mono-950 border border-mono-800 rounded-lg px-3 py-1.5 text-xs font-mono text-mono-100 focus:outline-none focus:border-mono-600 self-start sm:self-auto"
            />
          </div>
        </div>

        {/* SECTION 2: SPOILER-SAFE MODE (CRITICAL REQUIREMENT) */}
        <div className="p-6 rounded-2xl bg-mono-900 border border-mono-800 shadow-md flex flex-col gap-5">
          <div className="flex items-center gap-2 pb-2 border-b border-mono-800">
            <Shield className="w-4 h-4 text-mono-400" />
            <h2 className="text-sm font-bold text-mono-100 uppercase font-mono tracking-wider">
              Spoiler-Safe Protection (Pattern Recognition)
            </h2>
          </div>

          {/* Toggle Spoiler-Safe Mode */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-mono-200">
                  Spoiler-Safe Mode (Default: ON)
                </span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                    settings.spoilerSafeMode !== false
                      ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/60'
                      : 'bg-rose-950/60 text-rose-300 border border-rose-800/60'
                  }`}
                >
                  {settings.spoilerSafeMode !== false ? 'ACTIVE' : 'OFF'}
                </span>
              </div>
              <p className="text-xs text-mono-400">
                Hides topics and hints behind dropdowns. Zero DOM leakage. No topic sorting or
                filtering until revealed.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                if (settings.spoilerSafeMode !== false) {
                  // Prompt confirmation before turning OFF
                  setSpoilerOffModalOpen(true);
                } else {
                  // Turn back ON directly
                  onUpdateSettings({ spoilerSafeMode: true });
                  showToast('Spoiler-Safe Mode re-enabled', 'info');
                }
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-colors self-start sm:self-auto ${
                settings.spoilerSafeMode !== false
                  ? 'bg-mono-850 hover:bg-rose-950/40 text-mono-300 hover:text-rose-300 border border-mono-700'
                  : 'bg-mono-100 hover:bg-white text-mono-950 font-bold'
              }`}
            >
              {settings.spoilerSafeMode !== false ? 'Turn OFF Spoiler-Safe' : 'Turn ON Spoiler-Safe'}
            </button>
          </div>

          {/* Auto Reveal on Solve */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-mono-800/60">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-mono-200">
                Auto-Reveal Topic on Solved
              </span>
              <p className="text-xs text-mono-400">
                Automatically reveals the problem&apos;s topic when you mark it as Solved (hints remain as they were).
              </p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer self-start sm:self-auto">
              <input
                type="checkbox"
                checked={settings.autoRevealTopicOnSolve !== false}
                onChange={(e) => onUpdateSettings({ autoRevealTopicOnSolve: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-mono-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-mono-200"></div>
            </label>
          </div>

          {/* Re-hide all topics and hints */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-mono-800/60">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-mono-200">
                Re-hide All Topics and Hints
              </span>
              <p className="text-xs text-mono-400">
                Collapses and re-locks all topics and progressive hints across all 75 problems
                without deleting your remarks or code.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setRehideAllModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-mono-850 hover:bg-mono-800 border border-mono-700 text-mono-300 hover:text-mono-100 transition-colors self-start sm:self-auto"
            >
              <EyeOff className="w-3.5 h-3.5" />
              <span>Re-hide All</span>
            </button>
          </div>
        </div>

        {/* SECTION 3: EXPORT & BACKUPS */}
        <div className="p-6 rounded-2xl bg-mono-900 border border-mono-800 shadow-md flex flex-col gap-5">
          <div className="flex items-center gap-2 pb-2 border-b border-mono-800">
            <Download className="w-4 h-4 text-mono-400" />
            <h2 className="text-sm font-bold text-mono-100 uppercase font-mono tracking-wider">
              Data Backup & Reports
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Export JSON */}
            <div className="p-4 rounded-xl bg-mono-950 border border-mono-800/80 flex flex-col justify-between gap-3">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-mono-200 flex items-center gap-1.5">
                  <Download className="w-3.5 h-3.5 text-mono-400" />
                  Full JSON Export
                </span>
                <p className="text-[11px] text-mono-400">
                  Exports complete snapshot of all progress, every Java version, remarks, and settings.
                </p>
              </div>
              <button
                type="button"
                onClick={handleExportJson}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-mono-100 text-mono-950 hover:bg-white transition-colors"
              >
                <span>Export JSON Backup</span>
              </button>
            </div>

            {/* Export Markdown */}
            <div className="p-4 rounded-xl bg-mono-950 border border-mono-800/80 flex flex-col justify-between gap-3">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-mono-200 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-mono-400" />
                  Markdown Study Report
                </span>
                <p className="text-[11px] text-mono-400">
                  Readable study notes for solved problems (includes topic only if revealed, never hints).
                </p>
              </div>
              <button
                type="button"
                onClick={handleExportMarkdown}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-mono-850 hover:bg-mono-800 border border-mono-700 text-mono-200 transition-colors"
              >
                <span>Download Report (.md)</span>
              </button>
            </div>
          </div>

          {/* Import JSON */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-mono-800/60">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-mono-200 flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5 text-mono-400" />
                Import JSON Backup
              </span>
              <p className="text-xs text-mono-400">
                Restore data from a previously exported Blind 75 JSON backup with schema validation.
              </p>
            </div>

            <label className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono bg-mono-850 hover:bg-mono-800 border border-mono-700 text-mono-200 cursor-pointer transition-colors self-start sm:self-auto">
              <span>Choose File</span>
              <input
                type="file"
                accept=".json,application/json"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* SECTION 4: CLEAR TRACK / RESET ALL (USER REQUIREMENT) */}
        <div className="p-6 rounded-2xl bg-mono-900 border border-rose-900/40 shadow-md flex flex-col gap-4">
          <div className="flex items-center gap-2 pb-2 border-b border-mono-800 text-rose-400">
            <Trash2 className="w-4 h-4" />
            <h2 className="text-sm font-bold uppercase font-mono tracking-wider">
              Danger Zone — Clear Track
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-mono-200">
                Reset All Progress & Saved Codes
              </span>
              <p className="text-xs text-mono-400">
                Wipes all problem statuses, remarks, and saved Java versions from your browser,
                returning the tracker to a brand-new study plan.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setClearConfirmText('');
                setClearTrackModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-200 transition-colors self-start sm:self-auto"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset Track</span>
            </button>
          </div>
        </div>
      </div>

      {/* CONFIRMATION MODAL: SPOILER SAFE MODE OFF */}
      <Modal
        isOpen={spoilerOffModalOpen}
        onClose={() => setSpoilerOffModalOpen(false)}
        title="⚠️ Disable Spoiler-Safe Mode?"
        maxWidth="max-w-md"
      >
        <div className="flex flex-col gap-4 text-xs text-mono-300">
          <p>
            Disabling Spoiler-Safe Mode will immediately display <strong>all topics and hints inline</strong> across the app,
            and enable topic filters and grouping.
          </p>
          <p className="text-mono-400">
            This will make it impossible to practice blind pattern recognition. You can re-enable it at any time.
          </p>
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-mono-800">
            <button
              type="button"
              onClick={() => setSpoilerOffModalOpen(false)}
              className="px-3 py-1.5 rounded-lg font-mono text-mono-400 hover:text-mono-200"
            >
              Keep Protected
            </button>
            <button
              type="button"
              onClick={async () => {
                await onUpdateSettings({ spoilerSafeMode: false });
                setSpoilerOffModalOpen(false);
                showToast('Spoiler-Safe Mode disabled', 'info');
              }}
              className="px-4 py-1.5 rounded-lg font-mono font-semibold bg-amber-600 hover:bg-amber-500 text-black shadow"
            >
              Disable Spoilers
            </button>
          </div>
        </div>
      </Modal>

      {/* CONFIRMATION MODAL: RE-HIDE ALL */}
      <Modal
        isOpen={rehideAllModalOpen}
        onClose={() => setRehideAllModalOpen(false)}
        title="Re-hide All Topics and Hints?"
        maxWidth="max-w-md"
      >
        <div className="flex flex-col gap-4 text-xs text-mono-300">
          <p>
            This will re-lock and collapse topics and reset hint reveals back to 0 across all 75
            problems.
          </p>
          <p className="text-mono-400">
            Your problem statuses, notes, and code versions will NOT be affected.
          </p>
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-mono-800">
            <button
              type="button"
              onClick={() => setRehideAllModalOpen(false)}
              className="px-3 py-1.5 rounded-lg font-mono text-mono-400 hover:text-mono-200"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={async () => {
                await onRehideAllSpoilers();
                setRehideAllModalOpen(false);
                showToast('All topics and hints are now hidden', 'success');
              }}
              className="px-4 py-1.5 rounded-lg font-mono font-semibold bg-mono-100 text-mono-950 hover:bg-white shadow"
            >
              Re-hide All
            </button>
          </div>
        </div>
      </Modal>

      {/* IMPORT STRATEGY MODAL */}
      <Modal
        isOpen={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        title="Import Study Data"
        maxWidth="max-w-md"
      >
        {pendingImportData && (
          <div className="flex flex-col gap-4 text-xs text-mono-300">
            <p>
              Found valid backup file with <strong>{pendingImportData.progress.length} progress entries</strong> and{' '}
              <strong>{pendingImportData.codeVersions.length} code versions</strong>.
            </p>

            <div className="flex flex-col gap-2 pt-2">
              <span className="font-semibold text-mono-200">Select Import Mode:</span>
              <label className="flex items-start gap-2.5 p-2.5 rounded-lg border border-mono-800 bg-mono-950 cursor-pointer">
                <input
                  type="radio"
                  name="importMode"
                  value="replace"
                  checked={importStrategy === 'replace'}
                  onChange={() => setImportStrategy('replace')}
                  className="mt-0.5"
                />
                <div className="flex flex-col">
                  <span className="font-semibold text-mono-100">Replace (Clean Restore)</span>
                  <span className="text-mono-500 text-[11px]">
                    Clears existing user data and replaces with backup contents.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-2.5 p-2.5 rounded-lg border border-mono-800 bg-mono-950 cursor-pointer">
                <input
                  type="radio"
                  name="importMode"
                  value="merge"
                  checked={importStrategy === 'merge'}
                  onChange={() => setImportStrategy('merge')}
                  className="mt-0.5"
                />
                <div className="flex flex-col">
                  <span className="font-semibold text-mono-100">Merge</span>
                  <span className="text-mono-500 text-[11px]">
                    Merges records; existing records take newest timestamp.
                  </span>
                </div>
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-mono-800">
              <button
                type="button"
                onClick={() => setImportModalOpen(false)}
                className="px-3 py-1.5 rounded-lg font-mono text-mono-400 hover:text-mono-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmImport}
                className="px-4 py-1.5 rounded-lg font-mono font-semibold bg-mono-100 text-mono-950 hover:bg-white shadow"
              >
                Confirm Import
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* CLEAR TRACK CONFIRMATION MODAL (USER REQUIREMENT) */}
      <Modal
        isOpen={clearTrackModalOpen}
        onClose={() => setClearTrackModalOpen(false)}
        title="⚠️ Reset Entire Study Track?"
        maxWidth="max-w-md"
      >
        <div className="flex flex-col gap-4 text-xs text-mono-300">
          <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-900/60 text-rose-200 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <p>
              This will permanently delete all your progress marks, notes, and code versions.
              Export a JSON backup first if you want to save a copy.
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="confirmResetInput" className="font-mono text-mono-400">
              Type <strong className="text-mono-100">RESET</strong> to confirm:
            </label>
            <input
              id="confirmResetInput"
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
                  await onClearTrack();
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
};
