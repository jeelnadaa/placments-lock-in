import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Play,
  CheckCircle,
  ExternalLink,
  Star,
  Trash2,
  GitCompare,
  RotateCcw,
  Save,
  Maximize2,
  Minimize2,
  Code2,
  FileText,
  Lightbulb,
  History,
  CheckCircle2,
  Type,
  AlignLeft,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  Problem,
  Progress,
  CodeVersion,
  Settings,
  Submission,
  CustomCase,
  RunResponse,
  SubmitResponse,
} from '../../types';
import { DifficultyBadge, StatusBadge } from '../common/Badge';
import { SpoilerControl } from '../spoilers/SpoilerControl';
import { JavaEditor } from '../editor/JavaEditor';
import { CodeDiffViewer } from '../editor/CodeDiffViewer';
import { Modal } from '../common/Modal';
import { useToast } from '../common/Toast';
import { Stopwatch } from '../workspace/Stopwatch';
import { SubmissionsTable } from '../workspace/SubmissionsTable';
import { ConsolePanel } from '../workspace/ConsolePanel';
import { getProblemContent } from '../../contentRegistry';
import { runJudgeCases, submitJudgeSolution } from '../../utils/judgeApi';
import {
  COMMON_COMPLEXITIES,
  createNewCodeVersion,
  restoreAsNewVersion,
} from '../../utils/versioning';

interface ProblemDetailViewProps {
  problem: Problem;
  allProblems: Problem[];
  progress?: Progress;
  versions: CodeVersion[];
  submissions: Submission[];
  customCases: CustomCase[];
  settings?: Settings;
  onBack: () => void;
  onNavigateProblem: (problemId: number) => void;
  onUpdateProgress: (updates: Partial<Progress>) => void;
  onSaveNewVersion: (version: CodeVersion) => Promise<void>;
  onUpdateVersion?: (version: CodeVersion) => Promise<void>;
  onDeleteVersion: (versionId: string) => Promise<void>;
  onMarkBestVersion: (versionId: string) => Promise<void>;
  onAddSubmission: (sub: Submission) => Promise<void>;
  onAddCustomCase: (cc: CustomCase) => Promise<void>;
  onDeleteCustomCase: (id: string) => Promise<void>;
}

export const ProblemDetailView: React.FC<ProblemDetailViewProps> = ({
  problem,
  allProblems,
  progress,
  versions,
  submissions,
  customCases,
  settings,
  onBack,
  onNavigateProblem,
  onUpdateProgress,
  onSaveNewVersion,
  onUpdateVersion: _onUpdateVersion,
  onDeleteVersion,
  onMarkBestVersion,
  onAddSubmission,
  onAddCustomCase,
  onDeleteCustomCase,
}) => {
  const { showToast } = useToast();
  const spoilerSafeMode = settings?.spoilerSafeMode !== false;

  // Shipped static problem content
  const content = getProblemContent(problem.id);
  const meta = content?.meta;

  // Left pane tabs
  const [leftTab, setLeftTab] = useState<'description' | 'hints' | 'submissions' | 'versions'>('description');

  // Resizable split layout
  const [leftWidthPct, setLeftWidthPct] = useState<number>(48);
  const isDraggingRef = useRef(false);

  // Top bar options
  const [interviewMode, setInterviewMode] = useState(false);
  const [stopwatchMs, setStopwatchMs] = useState(0);

  // Editor states
  const starterCode = content?.starterCode || `class Solution {\n    // Solution for ${problem.id}. ${problem.title}\n    \n}`;
  const latestVersion = [...versions].sort((a, b) => b.versionNumber - a.versionNumber)[0];
  const [editorCode, setEditorCode] = useState<string>(latestVersion ? latestVersion.code : starterCode);

  // Sync editor when problem changes
  useEffect(() => {
    const latest = [...versions].sort((a, b) => b.versionNumber - a.versionNumber)[0];
    setEditorCode(latest ? latest.code : starterCode);
  }, [problem.id, versions, starterCode]);

  // Editor Toolbar settings
  const [assistMode, setAssistMode] = useState(true);
  const [editorFontSize, setEditorFontSize] = useState<number>(settings?.fontSize || 15);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Reset to starter code modal
  const [resetConfirmModalOpen, setResetConfirmModalOpen] = useState(false);

  // Console states
  const [activeConsoleTab, setActiveConsoleTab] = useState<'testcase' | 'result'>('testcase');
  const [isRunning, setIsRunning] = useState(false);
  const [runResult, setRunResult] = useState<RunResponse | null>(null);
  const [submitResult, setSubmitResult] = useState<SubmitResponse | null>(null);

  // Active error detection and editor line jumping
  const [highlightLine, setHighlightLine] = useState<number | null>(null);
  const [dismissedError, setDismissedError] = useState(false);

  useEffect(() => {
    setDismissedError(false);
  }, [runResult, submitResult, isRunning]);

  const activeError = (() => {
    if (runResult) {
      if (runResult.verdict === 'Compile Error' || runResult.compileError) {
        const text = runResult.compileError || runResult.error || 'Compilation failed';
        const lineMatch = text.match(/(?:[A-Za-z0-9_]+\.java):(\d+)/i);
        const line = lineMatch ? parseInt(lineMatch[1], 10) : undefined;
        const msgLines = text.split('\n').filter(Boolean);
        const summary = msgLines[0]?.replace(/^.*\.java:\d+:\s*(?:error:\s*)?/i, '') || 'Compilation error';
        return {
          type: 'Compile Error',
          line,
          summary,
        };
      }
      if (runResult.verdict === 'Runtime Error') {
        const failingCase = runResult.results?.find((r) => !r.passed && (r.error || r.stackTrace));
        const text = failingCase?.error || runResult.error || 'Runtime error occurred';
        const trace = failingCase?.stackTrace || '';
        const lineMatch = (text + '\n' + trace).match(/Solution\.java:(\d+)/i);
        const line = lineMatch ? parseInt(lineMatch[1], 10) : undefined;
        return {
          type: 'Runtime Error',
          line,
          summary: text.split('\n')[0] || 'Runtime exception',
        };
      }
      if (runResult.error && (!runResult.results || runResult.results.length === 0)) {
        return {
          type: 'Execution Error',
          line: undefined,
          summary: runResult.error.split('\n')[0],
        };
      }
    }

    if (submitResult) {
      if (submitResult.verdict === 'Compile Error' || submitResult.compileError) {
        const text = submitResult.compileError || submitResult.error || 'Compilation failed';
        const lineMatch = text.match(/(?:[A-Za-z0-9_]+\.java):(\d+)/i);
        const line = lineMatch ? parseInt(lineMatch[1], 10) : undefined;
        const msgLines = text.split('\n').filter(Boolean);
        const summary = msgLines[0]?.replace(/^.*\.java:\d+:\s*(?:error:\s*)?/i, '') || 'Compilation error';
        return {
          type: 'Compile Error',
          line,
          summary,
        };
      }
      if (submitResult.verdict === 'Runtime Error') {
        const text = submitResult.failing?.error || submitResult.error || 'Runtime error occurred';
        const trace = submitResult.failing?.stackTrace || '';
        const lineMatch = (text + '\n' + trace).match(/Solution\.java:(\d+)/i);
        const line = lineMatch ? parseInt(lineMatch[1], 10) : undefined;
        return {
          type: 'Runtime Error',
          line,
          summary: text.split('\n')[0] || 'Runtime exception',
        };
      }
      if (submitResult.error && !submitResult.failing) {
        return {
          type: 'Submission Error',
          line: undefined,
          summary: submitResult.error.split('\n')[0],
        };
      }
    }

    return null;
  })();

  // Sample testcases state (allows editing sample cases)
  const [sampleCasesState, setSampleCasesState] = useState<{ inputs: Record<string, unknown>; expected?: unknown }[]>(
    meta ? meta.examples.map((ex) => ({ inputs: ex.input, expected: ex.output })) : []
  );

  useEffect(() => {
    if (meta) {
      setSampleCasesState(meta.examples.map((ex) => ({ inputs: ex.input, expected: ex.output })));
    }
  }, [meta]);

  // Save Version Modal state
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [timeComplexity, setTimeComplexity] = useState('O(n)');
  const [spaceComplexity, setSpaceComplexity] = useState('O(1)');
  const [versionLabel, setVersionLabel] = useState('');
  const [versionRemarks, setVersionRemarks] = useState('');
  const [isBestChecked, setIsBestChecked] = useState(versions.length === 0);

  // Diff comparison modal
  const [diffModalOpen, setDiffModalOpen] = useState(false);
  const [diffVersionAId, setDiffVersionAId] = useState('');
  const [diffVersionBId, setDiffVersionBId] = useState('');

  // Delete version modal
  const [deleteModalVersionId, setDeleteModalVersionId] = useState<string | null>(null);

  // Problem-level remarks (auto-saved)
  const [problemRemarks, setProblemRemarks] = useState(progress?.remarks || '');
  const [remarksSavedIndicator, setRemarksSavedIndicator] = useState(false);
  const remarksTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setProblemRemarks(progress?.remarks || '');
  }, [progress?.remarks]);

  const handleRemarksChange = (val: string) => {
    setProblemRemarks(val);
    if (remarksTimeoutRef.current) clearTimeout(remarksTimeoutRef.current);
    remarksTimeoutRef.current = setTimeout(() => {
      onUpdateProgress({ remarks: val });
      setRemarksSavedIndicator(true);
      setTimeout(() => setRemarksSavedIndicator(false), 2000);
    }, 600);
  };

  // Resizer drag handler
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const totalWidth = window.innerWidth;
      const newPct = (e.clientX / totalWidth) * 100;
      if (newPct >= 25 && newPct <= 75) {
        setLeftWidthPct(Math.round(newPct));
      }
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // Prev / Next navigation
  const currentIndex = allProblems.findIndex((p) => p.id === problem.id);
  const prevProblem = currentIndex > 0 ? allProblems[currentIndex - 1] : null;
  const nextProblem = currentIndex < allProblems.length - 1 ? allProblems[currentIndex + 1] : null;

  // Day stats: Day N - k/5
  const dayProblems = allProblems.filter((p) => p.day === problem.day).sort((a, b) => a.order - b.order);
  const problemDayIndex = dayProblems.findIndex((p) => p.id === problem.id) + 1;

  // Run Code
  const handleRun = async () => {
    if (!content) {
      showToast('No judge content configured for this problem yet', 'info');
      return;
    }
    setIsRunning(true);
    setActiveConsoleTab('result');

    try {
      // Build test cases: samples + custom cases
      const casesToRun: { inputs: Record<string, unknown>; expected?: unknown }[] = [
        ...sampleCasesState,
      ];

      for (const cc of customCases) {
        const parsedInputs: Record<string, unknown> = {};
        for (const [k, v] of Object.entries(cc.inputs)) {
          try {
            parsedInputs[k] = JSON.parse(v);
          } catch {
            parsedInputs[k] = v;
          }
        }
        casesToRun.push({ inputs: parsedInputs });
      }

      const res = await runJudgeCases({
        problemId: problem.id,
        code: editorCode,
        cases: casesToRun,
      });

      setRunResult(res);
      setSubmitResult(null);

      if (res.verdict === 'Accepted') {
        showToast('Run completed: All sample/custom testcases passed!', 'success');
      } else {
        showToast(`Run: ${res.verdict}`, 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Run failed', 'error');
      setRunResult({
        verdict: 'Runtime Error',
        results: [],
        runtimeMs: 0,
        error: err.message || 'Run execution failed',
      });
      setSubmitResult(null);
    } finally {
      setIsRunning(false);
    }
  };

  // Submit Code
  const handleSubmit = async () => {
    if (!content) {
      showToast('No judge content configured for this problem yet', 'info');
      return;
    }
    setIsRunning(true);
    setActiveConsoleTab('result');

    try {
      const res = await submitJudgeSolution({
        problemId: problem.id,
        code: editorCode,
      });

      setSubmitResult(res);
      setRunResult(null);

      // Record submission
      const newSub: Submission = {
        id: Math.random().toString(36).substring(2, 9),
        problemId: problem.id,
        code: editorCode,
        verdict: res.verdict,
        passed: res.passed,
        total: res.total,
        runtimeMs: res.runtimeMs,
        failing: res.failing,
        createdAt: new Date().toISOString(),
      };
      await onAddSubmission(newSub);

      // Update attempts
      const attemptsCount = (progress?.attempts || 0) + 1;
      const progressUpdates: Partial<Progress> = { attempts: attemptsCount };

      if (res.verdict === 'Accepted') {
        // Mark Solved automatically (setting, default on)
        progressUpdates.status = 'SOLVED';
        if (settings?.autoRevealTopicOnSolve !== false) {
          progressUpdates.topicRevealed = true;
        }
        if (!progress?.firstAcceptedAt) {
          progressUpdates.firstAcceptedAt = new Date().toISOString();
          if (stopwatchMs > 0) {
            progressUpdates.timeToAcceptMs = stopwatchMs;
          }
        }
        try {
          confetti({ particleCount: 70, spread: 70, origin: { y: 0.7 } });
        } catch {}
        showToast(`Accepted! ${res.passed}/${res.total} testcases passed in ${res.runtimeMs}ms`, 'success');
      } else {
        showToast(`${res.verdict}: ${res.passed}/${res.total} testcases passed`, 'error');
      }

      onUpdateProgress(progressUpdates);
    } catch (err: any) {
      showToast(err.message || 'Submit failed', 'error');
      setSubmitResult({
        verdict: 'Runtime Error',
        passed: 0,
        total: 0,
        runtimeMs: 0,
        error: err.message || 'Submit execution failed',
      });
      setRunResult(null);
    } finally {
      setIsRunning(false);
    }
  };

  // Keyboard Shortcuts (Run: Ctrl+', Submit: Ctrl+Enter, Save: Ctrl+S)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "'") {
        e.preventDefault();
        handleRun();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleSubmit();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        setSaveModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editorCode, sampleCasesState, customCases]);

  // Save new code version submit
  const handleSaveVersion = async () => {
    if (!timeComplexity.trim() || !spaceComplexity.trim()) {
      showToast('Time and space complexity are required', 'error');
      return;
    }
    try {
      const v = createNewCodeVersion({
        problemId: problem.id,
        code: editorCode,
        timeComplexity,
        spaceComplexity,
        label: versionLabel,
        remarks: versionRemarks,
        existingVersions: versions,
        isBest: isBestChecked,
      });
      await onSaveNewVersion(v);
      setSaveModalOpen(false);
      showToast(`Saved as version v${v.versionNumber}!`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to save version', 'error');
    }
  };

  // Add failing testcase to custom testcases
  const handleAddFailingToCustom = (failingInput: Record<string, unknown> | string) => {
    if (!meta) return;
    const inputsRecord: Record<string, string> = {};
    if (typeof failingInput === 'object' && failingInput !== null) {
      for (const p of meta.params) {
        inputsRecord[p.name] = JSON.stringify(failingInput[p.name] ?? '');
      }
    } else {
      inputsRecord[meta.params[0]?.name || 'input'] = String(failingInput);
    }
    const newCase: CustomCase = {
      id: Math.random().toString(36).substring(2, 9),
      problemId: problem.id,
      inputs: inputsRecord,
      source: 'hidden-failure',
      createdAt: new Date().toISOString(),
    };
    onAddCustomCase(newCase);
    setActiveConsoleTab('testcase');
    showToast('Failing testcase added to your testcase tab', 'success');
  };

  // Format code (clean up extra trailing spaces & tabs)
  const handleFormatCode = () => {
    const formatted = editorCode
      .split('\n')
      .map((line) => line.replace(/\t/g, '    ').trimEnd())
      .join('\n');
    setEditorCode(formatted);
    showToast('Code formatted', 'info');
  };

  return (
    <div className={`flex flex-col h-screen max-h-screen bg-mono-950 text-mono-100 overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50 p-2' : ''}`}>
      {/* 1. TOP BAR */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-mono-800 bg-mono-900/90 backdrop-blur-md gap-4 flex-wrap select-none text-xs">
        {/* Left: Navigation & Problem Title */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-mono-400 hover:text-mono-100 hover:bg-mono-800 transition-colors font-mono"
            title="Back to study plan"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Plan</span>
          </button>

          <span className="text-mono-600">|</span>

          {/* Day N - k/5 indicator */}
          <span className="font-mono text-mono-400">
            Day {problem.day} • {problemDayIndex}/5
          </span>

          {/* Title & Difficulty */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-mono-100 text-sm tracking-tight">
              {problem.id}. {problem.title}
            </span>
            <DifficultyBadge difficulty={problem.difficulty} />
          </div>

          {/* Prev / Next navigation buttons */}
          <div className="flex items-center gap-1 ml-1">
            <button
              type="button"
              disabled={!prevProblem}
              onClick={() => prevProblem && onNavigateProblem(prevProblem.id)}
              className="p-1 rounded text-mono-400 hover:text-mono-100 hover:bg-mono-800 disabled:opacity-30 disabled:hover:bg-transparent"
              title={prevProblem ? `Prev: #${prevProblem.id} ${prevProblem.title}` : 'No previous problem'}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={!nextProblem}
              onClick={() => nextProblem && onNavigateProblem(nextProblem.id)}
              className="p-1 rounded text-mono-400 hover:text-mono-100 hover:bg-mono-800 disabled:opacity-30 disabled:hover:bg-transparent"
              title={nextProblem ? `Next: #${nextProblem.id} ${nextProblem.title}` : 'No next problem'}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Center: Stopwatch */}
        <div className="flex items-center gap-2">
          <Stopwatch onElapsedUpdate={setStopwatchMs} />

          <button
            type="button"
            onClick={() => setInterviewMode(!interviewMode)}
            className={`px-2.5 py-1 rounded-lg font-mono text-[11px] border transition-colors ${
              interviewMode
                ? 'bg-amber-950/60 border-amber-800 text-amber-300 font-bold'
                : 'bg-mono-900 border-mono-800 text-mono-400 hover:text-mono-200'
            }`}
            title="Interview mode hides hints and pattern details"
          >
            Interview Mode
          </button>
        </div>

        {/* Right: Run, Submit, Save Version */}
        <div className="flex items-center gap-2 font-mono">
          <button
            type="button"
            onClick={handleRun}
            disabled={isRunning}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-mono-850 hover:bg-mono-800 border border-mono-700 text-mono-200 font-medium disabled:opacity-50 transition-colors"
            title="Run sample & custom cases (Ctrl + ')"
          >
            <Play className="w-3 h-3 text-emerald-400 fill-emerald-400" />
            <span>Run</span>
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isRunning}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow disabled:opacity-50 transition-colors"
            title="Submit against all tests (Ctrl + Enter)"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Submit</span>
          </button>

          <button
            type="button"
            onClick={() => setSaveModalOpen(true)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-mono-100 text-mono-950 font-bold hover:bg-white shadow transition-colors"
            title="Save code version (Ctrl + S)"
          >
            <Save className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Save</span>
          </button>
        </div>
      </div>

      {/* 2. MAIN TWO-PANE RESIZABLE WORKSPACE */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* LEFT PANE */}
        <div
          style={{ width: window.innerWidth >= 768 ? `${leftWidthPct}%` : '100%' }}
          className="flex flex-col border-r border-mono-800 bg-mono-900/60 overflow-hidden"
        >
          {/* LEFT TABS HEADER */}
          <div className="flex items-center gap-1 px-4 py-2 border-b border-mono-800 bg-mono-900/90 text-xs font-mono font-medium overflow-x-auto">
            <button
              type="button"
              onClick={() => setLeftTab('description')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-colors ${
                leftTab === 'description'
                  ? 'bg-mono-800 text-mono-100 font-bold shadow'
                  : 'text-mono-400 hover:text-mono-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Description</span>
            </button>

            {!interviewMode && (
              <button
                type="button"
                onClick={() => setLeftTab('hints')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-colors ${
                  leftTab === 'hints'
                    ? 'bg-mono-800 text-mono-100 font-bold shadow'
                    : 'text-mono-400 hover:text-mono-200'
                }`}
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                <span>Hints ({progress?.hintsRevealed || 0}/3)</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setLeftTab('submissions')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-colors ${
                leftTab === 'submissions'
                  ? 'bg-mono-800 text-mono-100 font-bold shadow'
                  : 'text-mono-400 hover:text-mono-200'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Submissions ({submissions.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setLeftTab('versions')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-colors ${
                leftTab === 'versions'
                  ? 'bg-mono-800 text-mono-100 font-bold shadow'
                  : 'text-mono-400 hover:text-mono-200'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Versions & Notes ({versions.length})</span>
            </button>
          </div>

          {/* LEFT TAB BODY */}
          <div className="flex-1 overflow-y-auto p-5 text-mono-200 leading-relaxed font-sans text-sm">
            {/* TAB: DESCRIPTION */}
            {leftTab === 'description' && (
              <div className="flex flex-col gap-5">
                {/* Title & Links */}
                <div className="flex flex-col gap-2 pb-3 border-b border-mono-800">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-xl font-bold text-mono-100">
                      {problem.id}. {problem.title}
                    </h2>
                    <StatusBadge status={progress?.status || 'NOT_STARTED'} />
                  </div>

                  <div className="flex items-center gap-3 text-xs font-mono text-mono-400">
                    <DifficultyBadge difficulty={problem.difficulty} />
                    {problem.leetcodeUrl && (
                      <a
                        href={problem.leetcodeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 hover:text-white"
                      >
                        <span>LeetCode</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                    {problem.neetcodeUrl && (
                      <a
                        href={problem.neetcodeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 hover:text-white"
                      >
                        <span>NeetCode</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Collapsed Topic Control (Strict Spoiler-Safe Section 4.3.1) */}
                {!interviewMode && (
                  <SpoilerControl
                    problem={problem}
                    progress={progress}
                    spoilerSafeMode={spoilerSafeMode}
                    onUpdateProgress={onUpdateProgress}
                  />
                )}

                {/* Statement */}
                {content?.statement ? (
                  <div className="prose prose-invert max-w-none text-mono-200 text-sm leading-relaxed whitespace-pre-line">
                    {content.statement}
                  </div>
                ) : (
                  <p className="text-mono-400 italic">
                    Original problem statement loading or available on official links above.
                  </p>
                )}

                {/* Examples */}
                {meta?.examples && meta.examples.length > 0 && (
                  <div className="flex flex-col gap-3 pt-2">
                    <span className="font-mono font-bold text-xs uppercase tracking-wider text-mono-400">
                      Examples
                    </span>
                    {meta.examples.map((ex, i) => (
                      <div
                        key={i}
                        className="p-3.5 rounded-xl bg-mono-950 border border-mono-800 text-xs font-mono flex flex-col gap-1.5"
                      >
                        <span className="text-mono-400 font-bold">Example {i + 1}:</span>
                        <div>
                          <strong className="text-mono-400">Input: </strong>
                          <span className="text-mono-200">
                            {Object.entries(ex.input)
                              .map(([k, v]) => `${k} = ${JSON.stringify(v)}`)
                              .join(', ')}
                          </span>
                        </div>
                        <div>
                          <strong className="text-mono-400">Output: </strong>
                          <span className="text-mono-100 font-semibold">{JSON.stringify(ex.output)}</span>
                        </div>
                        {ex.explanation && (
                          <div className="text-mono-400 font-sans text-xs italic pt-1">
                            Explanation: {ex.explanation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Constraints */}
                {meta?.constraints && meta.constraints.length > 0 && (
                  <div className="flex flex-col gap-2 pt-2">
                    <span className="font-mono font-bold text-xs uppercase tracking-wider text-mono-400">
                      Constraints
                    </span>
                    <ul className="list-disc pl-5 text-xs font-mono text-mono-300 flex flex-col gap-1">
                      {meta.constraints.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Follow-up */}
                {meta?.followUp && (
                  <div className="p-3 rounded-xl bg-mono-950/80 border border-mono-800/80 text-xs font-sans text-mono-300 italic">
                    <strong>Follow up:</strong> {meta.followUp}
                  </div>
                )}
              </div>
            )}

            {/* TAB: HINTS */}
            {leftTab === 'hints' && (
              <div className="flex flex-col gap-4">
                <span className="font-mono font-bold text-xs uppercase tracking-wider text-mono-400">
                  Progressive Hints (1 → 2 → 3)
                </span>
                <SpoilerControl
                  problem={problem}
                  progress={progress}
                  spoilerSafeMode={spoilerSafeMode}
                  onUpdateProgress={onUpdateProgress}
                />
              </div>
            )}

            {/* TAB: SUBMISSIONS */}
            {leftTab === 'submissions' && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between pb-2 border-b border-mono-800">
                  <span className="font-mono font-bold text-xs uppercase tracking-wider text-mono-400">
                    Submission History ({submissions.length})
                  </span>
                  {progress?.attempts && (
                    <span className="text-xs font-mono text-mono-400">
                      Total Attempts: {progress.attempts}
                    </span>
                  )}
                </div>

                <SubmissionsTable
                  submissions={submissions}
                  onSaveAsVersion={(code) => {
                    setEditorCode(code);
                    setSaveModalOpen(true);
                  }}
                />
              </div>
            )}

            {/* TAB: VERSIONS & NOTES */}
            {leftTab === 'versions' && (
              <div className="flex flex-col gap-5">
                {/* Remarks markdown editor */}
                <div className="flex flex-col gap-2 p-4 rounded-xl bg-mono-950 border border-mono-800">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-mono-300 flex items-center gap-1.5">
                      <span>Problem Remarks & Patterns</span>
                      {remarksSavedIndicator && (
                        <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Saved
                        </span>
                      )}
                    </span>
                    <span className="text-mono-500 font-mono text-[11px]">Auto-saved</span>
                  </div>
                  <textarea
                    rows={4}
                    value={problemRemarks}
                    onChange={(e) => handleRemarksChange(e.target.value)}
                    placeholder="Record key patterns, edge cases, mistakes, or interview follow-ups..."
                    className="w-full bg-mono-900 border border-mono-800 rounded-lg p-2.5 text-xs font-mono text-mono-100 placeholder:text-mono-600 focus:outline-none focus:border-mono-600"
                  />
                </div>

                {/* Versions list */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between pb-1 border-b border-mono-800 text-xs font-mono">
                    <span className="font-bold text-mono-300 uppercase">
                      Code Versions ({versions.length})
                    </span>
                    {versions.length >= 2 && (
                      <button
                        type="button"
                        onClick={() => {
                          setDiffVersionAId(versions[1].id);
                          setDiffVersionBId(versions[0].id);
                          setDiffModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1 text-mono-300 hover:text-white"
                      >
                        <GitCompare className="w-3.5 h-3.5" />
                        <span>Compare Diff</span>
                      </button>
                    )}
                  </div>

                  {versions.length === 0 ? (
                    <p className="text-xs font-mono text-mono-500 italic py-2">
                      No code versions saved yet. Click &quot;Save&quot; in the top bar to save a version.
                    </p>
                  ) : (
                    <div className="flex flex-col divide-y divide-mono-800/60 rounded-xl bg-mono-950 border border-mono-800 overflow-hidden font-mono text-xs">
                      {versions.map((v) => (
                        <div key={v.id} className="p-3 flex items-center justify-between gap-3 hover:bg-mono-900/60">
                          <div className="flex items-center gap-2.5">
                            <span className="px-2 py-0.5 rounded font-bold bg-mono-850 text-mono-200 border border-mono-700">
                              v{v.versionNumber}
                            </span>
                            <span className="font-semibold text-mono-100">{v.label || `v${v.versionNumber}`}</span>
                            {v.isBest && <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />}
                            <span className="text-mono-400 text-[11px]">{v.timeComplexity} • {v.spaceComplexity}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => onMarkBestVersion(v.id)}
                              className="p-1 rounded text-mono-400 hover:text-amber-400"
                              title="Mark as best"
                            >
                              <Star className={`w-3.5 h-3.5 ${v.isBest ? 'fill-amber-400 text-amber-400' : ''}`} />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const restored = restoreAsNewVersion(v, versions);
                                onSaveNewVersion(restored);
                                showToast(`Restored v${v.versionNumber} as v${restored.versionNumber}`, 'success');
                              }}
                              className="p-1 rounded text-mono-400 hover:text-mono-100"
                              title="Restore as new version"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteModalVersionId(v.id)}
                              className="p-1 rounded text-mono-500 hover:text-rose-400"
                              title="Delete version"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RESIZABLE DIVIDER (DESKTOP) */}
        <div
          onMouseDown={() => {
            isDraggingRef.current = true;
          }}
          className="hidden md:flex w-1 bg-mono-800 hover:bg-mono-600 active:bg-white cursor-col-resize items-center justify-center transition-colors select-none z-10"
          title="Drag to resize panes"
        />

        {/* RIGHT PANE: EDITOR (TOP) + CONSOLE (BOTTOM) */}
        <div className="flex-1 flex flex-col bg-mono-950 overflow-hidden">
          {/* EDITOR TOOLBAR */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-mono-800 bg-mono-900/90 text-xs font-mono select-none">
            <div className="flex items-center gap-3">
              <span className="font-bold text-mono-200">Java</span>
              <span className="text-mono-600">•</span>
              <button
                type="button"
                onClick={() => setAssistMode(!assistMode)}
                className={`px-2 py-0.5 rounded text-[11px] border transition-colors ${
                  assistMode
                    ? 'bg-mono-800 border-mono-700 text-mono-200'
                    : 'bg-mono-900 border-mono-800 text-mono-500'
                }`}
                title="Toggle autocomplete assist mode"
              >
                Assist Mode: {assistMode ? 'ON' : 'OFF'}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleFormatCode}
                className="px-2 py-1 rounded hover:bg-mono-800 text-mono-400 hover:text-mono-200 transition-colors"
                title="Format Code"
              >
                <AlignLeft className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setResetConfirmModalOpen(true)}
                className="px-2 py-1 rounded hover:bg-mono-800 text-mono-400 hover:text-mono-200 transition-colors"
                title="Reset to starter code"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              {/* Font size control */}
              <div className="flex items-center gap-1 text-[11px] text-mono-400 border border-mono-800 px-1.5 py-0.5 rounded bg-mono-950">
                <Type className="w-3 h-3 text-mono-500" />
                <select
                  value={editorFontSize}
                  onChange={(e) => setEditorFontSize(Number(e.target.value))}
                  className="bg-transparent text-mono-200 focus:outline-none cursor-pointer"
                >
                  <option value={13}>13px</option>
                  <option value={14.5}>14.5px</option>
                  <option value={16}>16px</option>
                  <option value={18}>18px</option>
                </select>
              </div>

              <button
                type="button"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-1 rounded hover:bg-mono-800 text-mono-400 hover:text-mono-200 transition-colors"
                title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
              >
                {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* ACTIVE ERROR CALLOUT BANNER */}
          {activeError && !dismissedError && (
            <div className="flex items-center justify-between px-4 py-2 bg-rose-950/90 border-b border-rose-800 text-rose-200 text-xs font-mono select-none">
              <div className="flex items-center gap-2.5 overflow-hidden text-ellipsis">
                <span className="px-2 py-0.5 rounded bg-rose-900 border border-rose-700 text-rose-300 font-bold shrink-0">
                  {activeError.type}
                </span>
                {activeError.line !== undefined && (
                  <button
                    type="button"
                    onClick={() => {
                      setHighlightLine(activeError.line!);
                      showToast(`Navigated to line ${activeError.line}`, 'info');
                    }}
                    className="px-2 py-0.5 rounded bg-rose-900/60 hover:bg-rose-850 border border-rose-700 text-rose-200 font-bold shrink-0 underline hover:no-underline cursor-pointer transition-colors"
                    title={`Click to jump to line ${activeError.line} in code editor`}
                  >
                    Line {activeError.line}
                  </button>
                )}
                <span className="truncate text-rose-100 font-medium" title={activeError.summary}>
                  {activeError.summary}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0 ml-3">
                {activeError.line !== undefined && (
                  <button
                    type="button"
                    onClick={() => setHighlightLine(activeError.line!)}
                    className="px-2 py-1 rounded bg-rose-900/80 hover:bg-rose-800 border border-rose-700 text-rose-100 text-[11px] font-semibold transition-colors"
                  >
                    Jump to Line
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setActiveConsoleTab('result');
                  }}
                  className="px-2 py-1 rounded bg-rose-900/80 hover:bg-rose-800 border border-rose-700 text-rose-100 text-[11px] font-semibold transition-colors"
                >
                  View in Console ↓
                </button>
                <button
                  type="button"
                  onClick={() => setDismissedError(true)}
                  className="p-1 rounded hover:bg-rose-900 text-rose-400 hover:text-rose-100 transition-colors"
                  title="Dismiss banner"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* CODE EDITOR */}
          <div className="flex-1 overflow-auto bg-mono-950">
            <JavaEditor
              value={editorCode}
              onChange={setEditorCode}
              fontSize={editorFontSize}
              highlightLine={highlightLine}
              minHeight="280px"
              maxHeight="100%"
            />
          </div>

          {/* BOTTOM CONSOLE PANEL */}
          <ConsolePanel
            meta={meta}
            activeConsoleTab={activeConsoleTab}
            setActiveConsoleTab={setActiveConsoleTab}
            sampleCases={sampleCasesState}
            customCases={customCases}
            onAddCustomCase={(inputs) => {
              const newCase: CustomCase = {
                id: Math.random().toString(36).substring(2, 9),
                problemId: problem.id,
                inputs,
                source: 'user',
                createdAt: new Date().toISOString(),
              };
              onAddCustomCase(newCase);
            }}
            onDeleteCustomCase={onDeleteCustomCase}
            onUpdateSampleCase={(idx, paramName, val) => {
              const updated = [...sampleCasesState];
              try {
                updated[idx].inputs[paramName] = JSON.parse(val);
              } catch {
                updated[idx].inputs[paramName] = val;
              }
              setSampleCasesState(updated);
            }}
            runResult={runResult}
            submitResult={submitResult}
            isRunning={isRunning}
            onSaveAsVersionClick={() => setSaveModalOpen(true)}
            onAddFailingToCustomCases={handleAddFailingToCustom}
            onJumpToLine={(line) => setHighlightLine(line)}
          />
        </div>
      </div>

      {/* SAVE VERSION MODAL */}
      <Modal
        isOpen={saveModalOpen}
        onClose={() => setSaveModalOpen(false)}
        title={`Save Code as Version (v${versions.length + 1})`}
        maxWidth="max-w-md"
      >
        <div className="flex flex-col gap-4 text-xs font-mono text-mono-300">
          <p className="text-mono-400 font-sans">
            Saving snapshots your Java code immutably. Time and space complexities are required.
          </p>

          <div className="flex flex-col gap-1.5">
            <label className="text-mono-300 font-semibold flex items-center justify-between">
              <span>Time Complexity *</span>
              <span className="text-[10px] text-mono-500">Required</span>
            </label>
            <div className="flex items-center gap-2">
              <select
                value={timeComplexity}
                onChange={(e) => setTimeComplexity(e.target.value)}
                className="bg-mono-950 border border-mono-800 rounded px-2 py-1.5"
              >
                {COMMON_COMPLEXITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <input
                type="text"
                value={timeComplexity}
                onChange={(e) => setTimeComplexity(e.target.value)}
                className="flex-1 bg-mono-950 border border-mono-800 rounded px-3 py-1.5"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-mono-300 font-semibold flex items-center justify-between">
              <span>Space Complexity *</span>
              <span className="text-[10px] text-mono-500">Required</span>
            </label>
            <div className="flex items-center gap-2">
              <select
                value={spaceComplexity}
                onChange={(e) => setSpaceComplexity(e.target.value)}
                className="bg-mono-950 border border-mono-800 rounded px-2 py-1.5"
              >
                {COMMON_COMPLEXITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <input
                type="text"
                value={spaceComplexity}
                onChange={(e) => setSpaceComplexity(e.target.value)}
                className="flex-1 bg-mono-950 border border-mono-800 rounded px-3 py-1.5"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-mono-300">Version Label (Optional)</label>
            <input
              type="text"
              value={versionLabel}
              onChange={(e) => setVersionLabel(e.target.value)}
              placeholder="e.g. Optimal One-Pass, In-Place"
              className="bg-mono-950 border border-mono-800 rounded px-3 py-1.5 font-sans"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-mono-300">Version Notes (Optional)</label>
            <input
              type="text"
              value={versionRemarks}
              onChange={(e) => setVersionRemarks(e.target.value)}
              placeholder="Tradeoffs, failed testcases..."
              className="bg-mono-950 border border-mono-800 rounded px-3 py-1.5 font-sans"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={isBestChecked}
              onChange={(e) => setIsBestChecked(e.target.checked)}
              className="rounded border-mono-700 bg-mono-950"
            />
            <span className="text-mono-300 flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              Mark as Best Solution
            </span>
          </label>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-mono-800">
            <button
              type="button"
              onClick={() => setSaveModalOpen(false)}
              className="px-3 py-1.5 rounded text-mono-400 hover:text-mono-200"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveVersion}
              className="px-4 py-1.5 rounded bg-mono-100 text-mono-950 font-bold hover:bg-white transition-colors"
            >
              Save Version
            </button>
          </div>
        </div>
      </Modal>

      {/* RESET TO STARTER CODE CONFIRMATION MODAL */}
      <Modal
        isOpen={resetConfirmModalOpen}
        onClose={() => setResetConfirmModalOpen(false)}
        title="Reset to Starter Code?"
        maxWidth="max-w-sm"
      >
        <div className="flex flex-col gap-4 text-xs font-mono text-mono-300">
          <p>
            Are you sure you want to reset the editor to the default starter template? Any unsaved
            edits in the editor will be replaced.
          </p>
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setResetConfirmModalOpen(false)}
              className="px-3 py-1.5 rounded text-mono-400 hover:text-mono-200"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                setEditorCode(starterCode);
                setResetConfirmModalOpen(false);
                showToast('Reset editor to starter code', 'info');
              }}
              className="px-4 py-1.5 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold"
            >
              Reset Code
            </button>
          </div>
        </div>
      </Modal>

      {/* DIFF MODAL */}
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
            if (!vA || !vB) return <p className="text-xs text-mono-400">Select two versions to compare.</p>;
            return <CodeDiffViewer versionA={vA} versionB={vB} />;
          })()}
        </div>
      </Modal>

      {/* DELETE VERSION MODAL */}
      <Modal
        isOpen={Boolean(deleteModalVersionId)}
        onClose={() => setDeleteModalVersionId(null)}
        title="Confirm Delete Version"
        maxWidth="max-w-md"
      >
        <div className="flex flex-col gap-4 text-xs font-mono text-mono-300">
          <p>
            Are you sure you want to delete this version? Deleting does not renumber other versions.
          </p>
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-mono-800">
            <button
              type="button"
              onClick={() => setDeleteModalVersionId(null)}
              className="px-3 py-1.5 rounded text-mono-400 hover:text-mono-200"
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
              className="px-4 py-1.5 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
