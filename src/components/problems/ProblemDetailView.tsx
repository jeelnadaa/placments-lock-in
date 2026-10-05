import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  ExternalLink,
  Plus,
  Star,
  Trash2,
  GitCompare,
  RotateCcw,
  Edit2,
  Save,
  Clock,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Problem, Progress, CodeVersion, Settings, ProblemStatus } from '../../types';
import { DifficultyBadge, StatusBadge } from '../common/Badge';
import { SpoilerControl } from '../spoilers/SpoilerControl';
import { JavaEditor } from '../editor/JavaEditor';
import { CodeDiffViewer } from '../editor/CodeDiffViewer';
import { Modal } from '../common/Modal';
import { useToast } from '../common/Toast';
import {
  COMMON_COMPLEXITIES,
  createNewCodeVersion,
  restoreAsNewVersion,
  updateVersionMetadata,
} from '../../utils/versioning';

interface ProblemDetailViewProps {
  problem: Problem;
  progress?: Progress;
  versions: CodeVersion[];
  settings?: Settings;
  onBack: () => void;
  onUpdateProgress: (updates: Partial<Progress>) => void;
  onSaveNewVersion: (version: CodeVersion) => Promise<void>;
  onUpdateVersion: (version: CodeVersion) => Promise<void>;
  onDeleteVersion: (versionId: string) => Promise<void>;
  onMarkBestVersion: (versionId: string) => Promise<void>;
}

export const ProblemDetailView: React.FC<ProblemDetailViewProps> = ({
  problem,
  progress,
  versions,
  settings,
  onBack,
  onUpdateProgress,
  onSaveNewVersion,
  onUpdateVersion,
  onDeleteVersion,
  onMarkBestVersion,
}) => {
  const { showToast } = useToast();
  const spoilerSafeMode = settings?.spoilerSafeMode !== false;

  // Problem-level remarks (auto-saved)
  const [problemRemarks, setProblemRemarks] = useState(progress?.remarks || '');
  const [remarksSavedIndicator, setRemarksSavedIndicator] = useState(false);
  const remarksTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync state if progress prop changes
  useEffect(() => {
    setProblemRemarks(progress?.remarks || '');
  }, [progress?.remarks]);

  // Handle remarks change with debounce auto-save
  const handleRemarksChange = (val: string) => {
    setProblemRemarks(val);
    if (remarksTimeoutRef.current) clearTimeout(remarksTimeoutRef.current);
    remarksTimeoutRef.current = setTimeout(() => {
      onUpdateProgress({ remarks: val });
      setRemarksSavedIndicator(true);
      setTimeout(() => setRemarksSavedIndicator(false), 2000);
    }, 600);
  };

  // Sorted versions (newest first)
  const sortedVersions = [...versions].sort((a, b) => b.versionNumber - a.versionNumber);
  const latestVersion = sortedVersions[0];

  // Selected version for viewing in read-only mode
  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(
    latestVersion ? latestVersion.id : null
  );

  // Editor mode: 'idle' (viewing selected version or empty), 'new' (creating new version), 'edit-metadata' (editing complexity/remarks of a version)
  const [editorMode, setEditorMode] = useState<'idle' | 'new' | 'edit-metadata'>('idle');

  // Form states for creating a new version
  const [editorCode, setEditorCode] = useState<string>('');
  const [timeComplexity, setTimeComplexity] = useState<string>('O(n)');
  const [spaceComplexity, setSpaceComplexity] = useState<string>('O(1)');
  const [versionLabel, setVersionLabel] = useState<string>('');
  const [versionRemarks, setVersionRemarks] = useState<string>('');
  const [isBestChecked, setIsBestChecked] = useState<boolean>(false);

  // Form states for editing metadata of an existing version
  const [editingVersion, setEditingVersion] = useState<CodeVersion | null>(null);

  // Diff comparison modal state
  const [diffModalOpen, setDiffModalOpen] = useState(false);
  const [diffVersionAId, setDiffVersionAId] = useState<string>('');
  const [diffVersionBId, setDiffVersionBId] = useState<string>('');

  // Delete version confirmation modal
  const [deleteModalVersionId, setDeleteModalVersionId] = useState<string | null>(null);

  // Active view version
  const activeViewingVersion =
    versions.find((v) => v.id === selectedVersionId) || latestVersion || null;

  // Start creating a new version: pre-fill with latest code
  const handleOpenNewVersion = () => {
    const baseCode = latestVersion
      ? latestVersion.code
      : `class Solution {\n    // Solution for ${problem.id}. ${problem.title}\n    \n}`;
    setEditorCode(baseCode);
    setTimeComplexity(latestVersion ? latestVersion.timeComplexity : 'O(n)');
    setSpaceComplexity(latestVersion ? latestVersion.spaceComplexity : 'O(1)');
    setVersionLabel('');
    setVersionRemarks('');
    setIsBestChecked(versions.length === 0);
    setEditorMode('new');
  };

  // Keyboard shortcut listener: Ctrl+S to save, N to open new version
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if active element is an input or textarea (unless Ctrl+S)
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        if (editorMode === 'new') {
          handleSaveNewVersionSubmit();
        }
      } else if (e.key === 'n' && !isInput && editorMode === 'idle') {
        e.preventDefault();
        handleOpenNewVersion();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editorMode, editorCode, timeComplexity, spaceComplexity, versionLabel, versionRemarks, isBestChecked, versions]);

  // Save new version
  const handleSaveNewVersionSubmit = async () => {
    if (!timeComplexity.trim()) {
      showToast('Time complexity is required', 'error');
      return;
    }
    if (!spaceComplexity.trim()) {
      showToast('Space complexity is required', 'error');
      return;
    }
    if (!editorCode.trim()) {
      showToast('Code cannot be empty', 'error');
      return;
    }

    try {
      const newVersion = createNewCodeVersion({
        problemId: problem.id,
        code: editorCode,
        timeComplexity,
        spaceComplexity,
        label: versionLabel,
        remarks: versionRemarks,
        existingVersions: versions,
        isBest: isBestChecked,
      });

      await onSaveNewVersion(newVersion);
      setSelectedVersionId(newVersion.id);
      setEditorMode('idle');
      showToast(`Saved as version v${newVersion.versionNumber}!`, 'success');
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed to save version', 'error');
    }
  };

  // Restore old version as a new version
  const handleRestoreVersion = async (targetVersion: CodeVersion) => {
    try {
      const restored = restoreAsNewVersion(targetVersion, versions);
      await onSaveNewVersion(restored);
      setSelectedVersionId(restored.id);
      setEditorMode('idle');
      showToast(
        `Restored v${targetVersion.versionNumber} as new version v${restored.versionNumber}!`,
        'success'
      );
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed to restore', 'error');
    }
  };

  // Save metadata edit
  const handleSaveMetadataEdit = async () => {
    if (!editingVersion) return;
    try {
      const updated = updateVersionMetadata(editingVersion, {
        label: versionLabel,
        timeComplexity,
        spaceComplexity,
        remarks: versionRemarks,
      });
      await onUpdateVersion(updated);
      setEditorMode('idle');
      setEditingVersion(null);
      showToast(`Updated metadata for v${updated.versionNumber}`, 'success');
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed to update', 'error');
    }
  };

  // Status change handler
  const handleStatusChange = (newStatus: ProblemStatus) => {
    const updates: Partial<Progress> = { status: newStatus };
    if (newStatus === 'SOLVED') {
      if (settings?.autoRevealTopicOnSolve !== false) {
        updates.topicRevealed = true;
      }
      if (!progress?.firstSolvedAt) {
        updates.firstSolvedAt = new Date().toISOString();
      }
      // Confetti!
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
        });
      } catch {
        // ignore in non-browser environments
      }
      showToast('Problem marked Solved! Great job!', 'success');
    }
    onUpdateProgress(updates);
  };

  return (
    <div className="flex flex-col gap-6 pb-20 max-w-6xl mx-auto">
      {/* TOP NAVIGATION / BACK BUTTON */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-mono text-mono-400 hover:text-mono-100 p-2 rounded-lg hover:bg-mono-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to list</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-mono-400">Day {problem.day}, #{problem.order}</span>
          <DifficultyBadge difficulty={problem.difficulty} />
        </div>
      </div>

      {/* HEADER CARD */}
      <div className="p-6 rounded-2xl bg-mono-900 border border-mono-800 shadow-xl flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl font-bold text-mono-100 tracking-tight">
                {problem.id}. {problem.title}
              </h1>
              {problem.leetcodePremium && (
                <span
                  className="text-xs font-mono px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-800/60"
                  title="LeetCode Premium Problem (Free NeetCode link provided)"
                >
                  🔒 Premium
                </span>
              )}
            </div>

            {/* External Links */}
            <div className="flex items-center gap-3 text-xs font-mono text-mono-400 mt-2">
              {problem.leetcodeUrl && (
                <a
                  href={problem.leetcodeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white inline-flex items-center gap-1 bg-mono-950 border border-mono-800 px-2.5 py-1 rounded"
                >
                  <span>LeetCode Problem</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
              {problem.neetcodeUrl && (
                <a
                  href={problem.neetcodeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white inline-flex items-center gap-1 bg-mono-950 border border-mono-800 px-2.5 py-1 rounded"
                >
                  <span>NeetCode Explanation</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>

          {/* STATUS SELECTOR */}
          <div className="flex items-center gap-3 self-start lg:self-center">
            <span className="text-xs font-mono text-mono-400">Status:</span>
            <select
              value={progress?.status || 'NOT_STARTED'}
              onChange={(e) => handleStatusChange(e.target.value as ProblemStatus)}
              className="bg-mono-950 border border-mono-700 text-mono-100 text-xs font-medium rounded-lg px-3 py-1.5 focus:outline-none focus:border-mono-500 shadow-sm"
            >
              <option value="NOT_STARTED">Not Started</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="SOLVED">Solved</option>
              <option value="NEEDS_REVISION">Needs Revision</option>
            </select>
            <StatusBadge status={progress?.status || 'NOT_STARTED'} />
          </div>
        </div>

        {/* SPOILER CONTROLS (CRITICAL SPEC REQUIREMENT 4.3.1) */}
        <div className="pt-3 border-t border-mono-800">
          <SpoilerControl
            problem={problem}
            progress={progress}
            spoilerSafeMode={spoilerSafeMode}
            onUpdateProgress={onUpdateProgress}
          />
        </div>
      </div>

      {/* TWO COLUMN GRID: REMARKS & CODE VERSIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: PROBLEM REMARKS (4 COLS) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="p-5 rounded-2xl bg-mono-900 border border-mono-800 shadow-lg flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-mono-200 flex items-center gap-2">
                <span>Problem Remarks</span>
                {remarksSavedIndicator && (
                  <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Saved
                  </span>
                )}
              </h3>
              <span className="text-[10px] font-mono text-mono-500">Markdown</span>
            </div>

            <p className="text-xs text-mono-400 leading-relaxed">
              Record key patterns, edge cases, intuition, or interview follow-ups. Auto-saved.
            </p>

            <textarea
              rows={8}
              value={problemRemarks}
              onChange={(e) => handleRemarksChange(e.target.value)}
              placeholder="e.g. Key insight: use two pointers from both ends. Watch out for non-alphanumeric chars..."
              className="w-full bg-mono-950 border border-mono-800 rounded-lg p-3 text-xs text-mono-100 placeholder:text-mono-600 font-mono focus:outline-none focus:border-mono-600 leading-relaxed resize-y"
            />
          </div>

          {/* QUICK SHORTCUTS INFO */}
          <div className="p-4 rounded-xl bg-mono-900/60 border border-mono-800/80 text-xs font-mono text-mono-400 flex flex-col gap-1.5">
            <span className="font-semibold text-mono-300">Keyboard Shortcuts:</span>
            <div className="flex items-center justify-between">
              <span>Save Version:</span>
              <kbd className="px-1.5 py-0.5 rounded bg-mono-850 border border-mono-700 text-mono-200">
                Ctrl/Cmd + S
              </kbd>
            </div>
            <div className="flex items-center justify-between">
              <span>New Version:</span>
              <kbd className="px-1.5 py-0.5 rounded bg-mono-850 border border-mono-700 text-mono-200">
                N
              </kbd>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CODE VERSIONS & JAVA EDITOR (8 COLS) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="p-6 rounded-2xl bg-mono-900 border border-mono-800 shadow-lg flex flex-col gap-4">
            {/* VERSIONS HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-mono-800">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-mono-100">Java Code Versions</h3>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-mono-850 border border-mono-800 text-mono-300">
                  {versions.length} {versions.length === 1 ? 'version' : 'versions'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {versions.length >= 2 && (
                  <button
                    type="button"
                    onClick={() => {
                      setDiffVersionAId(versions[1].id);
                      setDiffVersionBId(versions[0].id);
                      setDiffModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-mono-850 hover:bg-mono-800 border border-mono-700 text-mono-200 transition-colors"
                  >
                    <GitCompare className="w-3.5 h-3.5" />
                    <span>Compare Diff</span>
                  </button>
                )}

                {editorMode === 'idle' ? (
                  <button
                    type="button"
                    onClick={handleOpenNewVersion}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-mono-100 text-mono-950 hover:bg-white shadow transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>New Version (N)</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setEditorMode('idle');
                      setEditingVersion(null);
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-mono text-mono-400 hover:text-mono-200 border border-mono-800"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>

            {/* NEW VERSION / EDIT METADATA FORM */}
            {editorMode === 'new' && (
              <div className="flex flex-col gap-4 p-4 rounded-xl bg-mono-950/80 border border-mono-700 animate-in fade-in duration-150">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-mono-200">
                    Drafting New Version (v{versions.length + 1})
                  </span>
                  <span className="text-[11px] font-mono text-mono-400">
                    Pre-filled with previous code to iterate
                  </span>
                </div>

                {/* Java Editor */}
                <JavaEditor
                  value={editorCode}
                  onChange={setEditorCode}
                  placeholder="// Paste or write your Java solution here..."
                />

                {/* REQUIRED TIME & SPACE COMPLEXITY COMBO INPUTS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Time Complexity */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono text-mono-300 flex items-center justify-between">
                      <span>Time Complexity *</span>
                      <span className="text-[10px] text-mono-500">Required</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <select
                        value={timeComplexity}
                        onChange={(e) => setTimeComplexity(e.target.value)}
                        className="bg-mono-900 border border-mono-800 rounded-lg px-2.5 py-1.5 text-xs font-mono text-mono-200 focus:outline-none"
                      >
                        {COMMON_COMPLEXITIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={timeComplexity}
                        onChange={(e) => setTimeComplexity(e.target.value)}
                        placeholder="Custom (e.g. O(n log k))"
                        className="flex-1 bg-mono-900 border border-mono-800 rounded-lg px-3 py-1.5 text-xs font-mono text-mono-100 focus:outline-none focus:border-mono-600"
                      />
                    </div>
                  </div>

                  {/* Space Complexity */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono text-mono-300 flex items-center justify-between">
                      <span>Space Complexity *</span>
                      <span className="text-[10px] text-mono-500">Required</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <select
                        value={spaceComplexity}
                        onChange={(e) => setSpaceComplexity(e.target.value)}
                        className="bg-mono-900 border border-mono-800 rounded-lg px-2.5 py-1.5 text-xs font-mono text-mono-200 focus:outline-none"
                      >
                        {COMMON_COMPLEXITIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={spaceComplexity}
                        onChange={(e) => setSpaceComplexity(e.target.value)}
                        placeholder="Custom (e.g. O(k))"
                        className="flex-1 bg-mono-900 border border-mono-800 rounded-lg px-3 py-1.5 text-xs font-mono text-mono-100 focus:outline-none focus:border-mono-600"
                      />
                    </div>
                  </div>
                </div>

                {/* Optional Label & Remarks */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono text-mono-300">
                      Label / Tag (Optional)
                    </label>
                    <input
                      type="text"
                      value={versionLabel}
                      onChange={(e) => setVersionLabel(e.target.value)}
                      placeholder="e.g. Brute Force, HashMap, Two Pointers"
                      className="bg-mono-900 border border-mono-800 rounded-lg px-3 py-1.5 text-xs font-sans text-mono-100 focus:outline-none focus:border-mono-600"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono text-mono-300">
                      Version Remarks (Optional)
                    </label>
                    <input
                      type="text"
                      value={versionRemarks}
                      onChange={(e) => setVersionRemarks(e.target.value)}
                      placeholder="Tradeoffs, test cases that failed, why this approach..."
                      className="bg-mono-900 border border-mono-800 rounded-lg px-3 py-1.5 text-xs font-sans text-mono-100 focus:outline-none focus:border-mono-600"
                    />
                  </div>
                </div>

                {/* Best Version Toggle */}
                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={isBestChecked}
                    onChange={(e) => setIsBestChecked(e.target.checked)}
                    className="rounded border-mono-700 bg-mono-900 text-mono-100 focus:ring-0"
                  />
                  <span className="text-xs font-mono text-mono-300 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    Mark as Best Solution
                  </span>
                </label>

                {/* Save Button */}
                <div className="flex items-center justify-end gap-3 pt-2 border-t border-mono-800">
                  <button
                    type="button"
                    onClick={() => setEditorMode('idle')}
                    className="px-3 py-1.5 rounded-lg text-xs font-mono text-mono-400 hover:text-mono-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveNewVersionSubmit}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium bg-mono-100 text-mono-950 hover:bg-white shadow transition-all"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Version (Ctrl+S)</span>
                  </button>
                </div>
              </div>
            )}

            {/* EDIT METADATA FORM (CODE IS STRICTLY IMMUTABLE) */}
            {editorMode === 'edit-metadata' && editingVersion && (
              <div className="flex flex-col gap-4 p-4 rounded-xl bg-mono-950/80 border border-mono-700 animate-in fade-in duration-150">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-mono-200">
                    Edit Metadata for v{editingVersion.versionNumber}
                  </span>
                  <span className="text-[11px] font-mono text-mono-500">
                    (Code is immutable — changes to code require a new version)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono text-mono-300">Time Complexity *</label>
                    <input
                      type="text"
                      value={timeComplexity}
                      onChange={(e) => setTimeComplexity(e.target.value)}
                      className="bg-mono-900 border border-mono-800 rounded-lg px-3 py-1.5 text-xs font-mono text-mono-100"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono text-mono-300">Space Complexity *</label>
                    <input
                      type="text"
                      value={spaceComplexity}
                      onChange={(e) => setSpaceComplexity(e.target.value)}
                      className="bg-mono-900 border border-mono-800 rounded-lg px-3 py-1.5 text-xs font-mono text-mono-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono text-mono-300">Label / Tag</label>
                    <input
                      type="text"
                      value={versionLabel}
                      onChange={(e) => setVersionLabel(e.target.value)}
                      className="bg-mono-900 border border-mono-800 rounded-lg px-3 py-1.5 text-xs font-sans text-mono-100"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono text-mono-300">Remarks</label>
                    <input
                      type="text"
                      value={versionRemarks}
                      onChange={(e) => setVersionRemarks(e.target.value)}
                      className="bg-mono-900 border border-mono-800 rounded-lg px-3 py-1.5 text-xs font-sans text-mono-100"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2 border-t border-mono-800">
                  <button
                    type="button"
                    onClick={() => {
                      setEditorMode('idle');
                      setEditingVersion(null);
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-mono text-mono-400 hover:text-mono-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveMetadataEdit}
                    className="px-4 py-2 rounded-lg text-xs font-medium bg-mono-100 text-mono-950 hover:bg-white shadow transition-all"
                  >
                    Update Metadata
                  </button>
                </div>
              </div>
            )}

            {/* VERSION VIEWER (IDLE MODE) */}
            {editorMode === 'idle' && (
              <>
                {versions.length === 0 ? (
                  <div className="p-10 border border-dashed border-mono-800 rounded-xl flex flex-col items-center justify-center text-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-mono-850 flex items-center justify-center text-mono-400">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold text-sm text-mono-200">
                        No Code Versions Saved Yet
                      </span>
                      <p className="text-xs text-mono-500 max-w-sm">
                        Write and save your Java solution, along with required Big-O time and space
                        complexity.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleOpenNewVersion}
                      className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium bg-mono-100 text-mono-950 hover:bg-white transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Create First Version</span>
                    </button>
                  </div>
                ) : (
                  activeViewingVersion && (
                    <div className="flex flex-col gap-3">
                      {/* Active version detail banner */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-mono-950/80 border border-mono-800">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className="px-2 py-0.5 rounded font-mono font-bold text-xs bg-mono-800 text-mono-100 border border-mono-700">
                            v{activeViewingVersion.versionNumber}
                          </span>
                          {activeViewingVersion.label && (
                            <span className="font-medium text-xs text-mono-200">
                              {activeViewingVersion.label}
                            </span>
                          )}
                          {activeViewingVersion.isBest && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-mono text-amber-300 bg-amber-950/50 border border-amber-800/50 px-2 py-0.5 rounded-full">
                              <Star className="w-3 h-3 fill-amber-300" />
                              Best Solution
                            </span>
                          )}
                          <span className="text-xs font-mono text-mono-400 px-2 py-0.5 rounded bg-mono-900 border border-mono-800">
                            Time: {activeViewingVersion.timeComplexity}
                          </span>
                          <span className="text-xs font-mono text-mono-400 px-2 py-0.5 rounded bg-mono-900 border border-mono-800">
                            Space: {activeViewingVersion.spaceComplexity}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-xs font-mono">
                          <button
                            type="button"
                            onClick={() => onMarkBestVersion(activeViewingVersion.id)}
                            className="p-1.5 rounded hover:bg-mono-800 text-mono-400 hover:text-amber-300 transition-colors"
                            title={
                              activeViewingVersion.isBest ? 'Best solution' : 'Mark as best solution'
                            }
                          >
                            <Star
                              className={`w-4 h-4 ${
                                activeViewingVersion.isBest
                                  ? 'text-amber-400 fill-amber-400'
                                  : 'text-mono-400'
                              }`}
                            />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleRestoreVersion(activeViewingVersion)}
                            className="inline-flex items-center gap-1 p-1.5 rounded hover:bg-mono-800 text-mono-400 hover:text-mono-200 transition-colors"
                            title="Restore as new version"
                          >
                            <RotateCcw className="w-4 h-4" />
                            <span className="hidden sm:inline">Restore</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setEditingVersion(activeViewingVersion);
                              setTimeComplexity(activeViewingVersion.timeComplexity);
                              setSpaceComplexity(activeViewingVersion.spaceComplexity);
                              setVersionLabel(activeViewingVersion.label || '');
                              setVersionRemarks(activeViewingVersion.remarks || '');
                              setEditorMode('edit-metadata');
                            }}
                            className="inline-flex items-center gap-1 p-1.5 rounded hover:bg-mono-800 text-mono-400 hover:text-mono-200 transition-colors"
                            title="Edit metadata (label, complexity, remarks)"
                          >
                            <Edit2 className="w-4 h-4" />
                            <span className="hidden sm:inline">Edit</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeleteModalVersionId(activeViewingVersion.id)}
                            className="p-1.5 rounded hover:bg-rose-950/40 text-mono-500 hover:text-rose-400 transition-colors"
                            title="Delete version"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Version remarks if present */}
                      {activeViewingVersion.remarks && (
                        <div className="p-3 rounded-lg bg-mono-950 border border-mono-800/80 text-xs text-mono-300 font-sans leading-relaxed">
                          <span className="font-mono text-mono-500 font-semibold mr-1.5">Notes:</span>
                          {activeViewingVersion.remarks}
                        </div>
                      )}

                      {/* Read-only Java Editor */}
                      <JavaEditor value={activeViewingVersion.code} readOnly />
                    </div>
                  )
                )}

                {/* VERSION HISTORY LIST (NEWEST FIRST) */}
                {versions.length > 0 && (
                  <div className="mt-6 flex flex-col gap-2.5 pt-4 border-t border-mono-800">
                    <span className="text-xs font-mono uppercase tracking-wider text-mono-400 font-semibold">
                      Version History ({versions.length})
                    </span>

                    <div className="flex flex-col divide-y divide-mono-800/60 rounded-xl bg-mono-950 border border-mono-800 overflow-hidden">
                      {sortedVersions.map((v) => {
                        const isSelected = v.id === selectedVersionId;
                        return (
                          <div
                            key={v.id}
                            onClick={() => setSelectedVersionId(v.id)}
                            className={`p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 cursor-pointer transition-colors ${
                              isSelected ? 'bg-mono-900 border-l-2 border-l-white' : 'hover:bg-mono-900/40'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-mono-850 text-mono-200 border border-mono-800">
                                v{v.versionNumber}
                              </span>
                              <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-semibold text-mono-100">
                                    {v.label || `Version ${v.versionNumber}`}
                                  </span>
                                  {v.isBest && (
                                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                                  )}
                                </div>
                                <div className="flex items-center gap-2 text-[11px] font-mono text-mono-400 mt-0.5">
                                  <span>Time: {v.timeComplexity}</span>
                                  <span>•</span>
                                  <span>Space: {v.spaceComplexity}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 text-xs font-mono text-mono-400 self-end sm:self-auto">
                              <div className="flex items-center gap-1 text-[11px]">
                                <Clock className="w-3 h-3 text-mono-500" />
                                <span>{new Date(v.createdAt).toLocaleDateString()}</span>
                              </div>
                              <span className="text-mono-300 font-medium">
                                {isSelected ? 'Viewing' : 'Select'}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* VERSION DIFF MODAL */}
      <Modal
        isOpen={diffModalOpen}
        onClose={() => setDiffModalOpen(false)}
        title="Compare Code Versions"
        maxWidth="max-w-4xl"
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4 flex-wrap pb-3 border-b border-mono-800 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="text-mono-400">Original (A):</span>
              <select
                value={diffVersionAId}
                onChange={(e) => setDiffVersionAId(e.target.value)}
                className="bg-mono-950 border border-mono-800 text-mono-200 rounded px-2.5 py-1"
              >
                {versions.map((v) => (
                  <option key={v.id} value={v.id}>
                    v{v.versionNumber} {v.label ? `(${v.label})` : ''}
                  </option>
                ))}
              </select>
            </div>

            <span className="text-mono-600 font-bold">vs</span>

            <div className="flex items-center gap-2">
              <span className="text-mono-400">Target (B):</span>
              <select
                value={diffVersionBId}
                onChange={(e) => setDiffVersionBId(e.target.value)}
                className="bg-mono-950 border border-mono-800 text-mono-200 rounded px-2.5 py-1"
              >
                {versions.map((v) => (
                  <option key={v.id} value={v.id}>
                    v{v.versionNumber} {v.label ? `(${v.label})` : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {(() => {
            const vA = versions.find((v) => v.id === diffVersionAId);
            const vB = versions.find((v) => v.id === diffVersionBId);
            if (!vA || !vB) {
              return <p className="text-xs text-mono-400">Please select two versions to compare.</p>;
            }
            return <CodeDiffViewer versionA={vA} versionB={vB} />;
          })()}
        </div>
      </Modal>

      {/* DELETE VERSION CONFIRMATION MODAL */}
      <Modal
        isOpen={Boolean(deleteModalVersionId)}
        onClose={() => setDeleteModalVersionId(null)}
        title="Confirm Delete Version"
        maxWidth="max-w-md"
      >
        <div className="flex flex-col gap-4 text-xs font-sans text-mono-300">
          <p>
            Are you sure you want to delete this version? Deleting does not renumber other
            versions, but this action cannot be undone.
          </p>
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-mono-800">
            <button
              type="button"
              onClick={() => setDeleteModalVersionId(null)}
              className="px-3 py-1.5 rounded-lg font-mono text-mono-400 hover:text-mono-200"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={async () => {
                if (deleteModalVersionId) {
                  await onDeleteVersion(deleteModalVersionId);
                  setDeleteModalVersionId(null);
                  showToast('Version deleted', 'info');
                }
              }}
              className="px-4 py-1.5 rounded-lg font-mono font-semibold bg-rose-600 hover:bg-rose-500 text-white shadow"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
