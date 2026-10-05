import React, { useState } from 'react';
import {
  Trophy,
  Flame,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  ArrowRight,
  Sparkles,
  Lock,
} from 'lucide-react';
import { Problem, Progress, Settings } from '../../types';
import { DifficultyBadge, StatusBadge } from '../common/Badge';
import { SpoilerControl } from '../spoilers/SpoilerControl';
import { calculateCurrentPlanDay, getBehindScheduleProblems } from '../../utils/schedule';

interface DashboardViewProps {
  problems: Problem[];
  progressMap: Map<number, Progress>;
  settings?: Settings;
  currentStreak: number;
  longestStreak: number;
  onOpenProblem: (problemId: number) => void;
  onUpdateProgress: (problemId: number, updates: Partial<Progress>) => void;
  onNavigateToPlanDay: (day: number) => void;
  onNavigateToUnsolvedBehind: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  problems,
  progressMap,
  settings,
  currentStreak,
  longestStreak,
  onOpenProblem,
  onUpdateProgress,
  onNavigateToPlanDay,
  onNavigateToUnsolvedBehind,
}) => {
  const [isTopicBreakdownOpen, setIsTopicBreakdownOpen] = useState(false);

  const spoilerSafeMode = settings?.spoilerSafeMode !== false;
  const startDate = settings?.startDate || '';

  // 1. Overall stats
  const totalProblems = problems.length;
  const solvedList = problems.filter((p) => progressMap.get(p.id)?.status === 'SOLVED');
  const solvedCount = solvedList.length;
  const solvedPercentage = Math.round((solvedCount / (totalProblems || 1)) * 100);

  // 2. Difficulty breakdown
  const diffStats = {
    Easy: { total: 0, solved: 0 },
    Medium: { total: 0, solved: 0 },
    Hard: { total: 0, solved: 0 },
  };

  for (const p of problems) {
    diffStats[p.difficulty].total += 1;
    if (progressMap.get(p.id)?.status === 'SOLVED') {
      diffStats[p.difficulty].solved += 1;
    }
  }

  // 3. Solved without hints stat: X / Y (Y = total solved, X = solved with 0 hints used)
  const solvedWithoutHints = solvedList.filter((p) => {
    const prog = progressMap.get(p.id);
    return (prog?.hintsRevealed ?? 0) === 0;
  }).length;

  // 4. Current plan day & Today's 5 problems
  const currentPlanDay = calculateCurrentPlanDay(startDate);
  const todayProblems = problems.filter((p) => p.day === currentPlanDay);

  // 5. Behind schedule problems
  const behindScheduleProblems = getBehindScheduleProblems(problems, progressMap, currentPlanDay);

  // 6. Topic breakdown (SPOILER-SAFE RULE 4.3.1: Only list revealed topics!)
  // If spoilerSafeMode is ON: only count problems where topicRevealed is true.
  // Never show unrevealed topics, not even as counts or empty bars!
  const topicStats = new Map<string, { total: number; solved: number }>();
  let hiddenTopicsCount = 0;

  for (const p of problems) {
    const prog = progressMap.get(p.id);
    const isRevealed = !spoilerSafeMode || Boolean(prog?.topicRevealed);

    if (isRevealed) {
      const cur = topicStats.get(p.topic) || { total: 0, solved: 0 };
      cur.total += 1;
      if (prog?.status === 'SOLVED') {
        cur.solved += 1;
      }
      topicStats.set(p.topic, cur);
    } else {
      hiddenTopicsCount += 1;
    }
  }

  const revealedTopicEntries = Array.from(topicStats.entries()).sort(
    (a, b) => b[1].solved - a[1].solved
  );

  return (
    <div className="flex flex-col gap-8 pb-16">
      {/* WELCOME / BANNER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-mono-900 via-mono-900 to-mono-850 border border-mono-800 shadow-xl">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-mono-400 font-mono text-xs uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-mono-300" />
            <span>Blind 75 Study Dashboard</span>
          </div>
          <h1 className="text-2xl font-bold text-mono-100 tracking-tight">
            Day {currentPlanDay} of 15
          </h1>
          <p className="text-sm text-mono-400">
            {behindScheduleProblems.length === 0
              ? 'You are on track! Stay locked in and master pattern recognition.'
              : `${behindScheduleProblems.length} problem(s) from earlier days still need attention.`}
          </p>
        </div>

        {/* BEHIND SCHEDULE ALERT */}
        {behindScheduleProblems.length > 0 && (
          <button
            type="button"
            onClick={onNavigateToUnsolvedBehind}
            className="flex items-center gap-3 p-3.5 rounded-xl bg-amber-950/40 border border-amber-800/60 text-amber-200 hover:bg-amber-950/60 transition-colors text-left"
          >
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <div className="text-xs font-semibold text-amber-300">Behind Schedule Alert</div>
              <div className="text-xs text-amber-200/80 font-mono">
                {behindScheduleProblems.length} unsolved from earlier days →
              </div>
            </div>
          </button>
        )}
      </div>

      {/* METRICS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Overall Solved */}
        <div className="p-5 rounded-xl bg-mono-900 border border-mono-800 flex flex-col gap-3 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-mono-400">
              Overall Progress
            </span>
            <Trophy className="w-4 h-4 text-mono-300" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-mono-100 font-mono">{solvedCount}</span>
            <span className="text-sm text-mono-500 font-mono">/ 75</span>
            <span className="ml-auto text-xs font-mono font-medium px-2 py-0.5 rounded bg-mono-800 text-mono-200">
              {solvedPercentage}%
            </span>
          </div>
          {/* Progress bar */}
          <div className="w-full h-2 rounded-full bg-mono-800 overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-500"
              style={{ width: `${solvedPercentage}%` }}
            />
          </div>
        </div>

        {/* Streaks */}
        <div className="p-5 rounded-xl bg-mono-900 border border-mono-800 flex flex-col gap-3 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-mono-400">
              Grind Streaks
            </span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-3">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-mono-100 font-mono">{currentStreak}</span>
              <span className="text-xs text-mono-400">days curr</span>
            </div>
            <div className="text-xs font-mono text-mono-400 pl-3 border-l border-mono-800">
              Best: <span className="text-mono-200 font-semibold">{longestStreak}</span> days
            </div>
          </div>
          <p className="text-[11px] text-mono-400">
            A day counts if at least one problem is marked solved.
          </p>
        </div>

        {/* Solved Without Hints */}
        <div className="p-5 rounded-xl bg-mono-900 border border-mono-800 flex flex-col gap-3 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-mono-400">
              Hint Independence
            </span>
            <span className="text-xs font-mono text-amber-400">💡</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-mono-100 font-mono">
              {solvedWithoutHints}
            </span>
            <span className="text-sm text-mono-500 font-mono">/ {solvedCount}</span>
            <span className="text-xs text-mono-400">solved</span>
          </div>
          <p className="text-[11px] text-mono-400">
            Solved without revealing hints ({solvedCount > 0 ? Math.round((solvedWithoutHints / solvedCount) * 100) : 0}%)
          </p>
        </div>

        {/* Difficulty Breakdown */}
        <div className="p-5 rounded-xl bg-mono-900 border border-mono-800 flex flex-col gap-2 shadow-md">
          <div className="flex items-center justify-between pb-1">
            <span className="text-xs font-mono uppercase tracking-wider text-mono-400">
              By Difficulty
            </span>
            <span className="text-[11px] font-mono text-mono-500">Solved / Total</span>
          </div>
          <div className="flex flex-col gap-1.5 text-xs font-mono">
            <div className="flex items-center justify-between">
              <span className="text-emerald-400">Easy</span>
              <span className="text-mono-200">
                {diffStats.Easy.solved} / {diffStats.Easy.total}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-amber-400">Medium</span>
              <span className="text-mono-200">
                {diffStats.Medium.solved} / {diffStats.Medium.total}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-rose-400">Hard</span>
              <span className="text-mono-200">
                {diffStats.Hard.solved} / {diffStats.Hard.total}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* TODAY'S PLAN CARD */}
      <div className="flex flex-col gap-4 p-6 rounded-2xl bg-mono-900 border border-mono-800 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-mono-800">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-mono-100">Today&apos;s Plan — Day {currentPlanDay}</h2>
              <span className="text-xs font-mono text-mono-400 px-2 py-0.5 rounded bg-mono-850 border border-mono-800">
                5 Problems
              </span>
            </div>
            <p className="text-xs text-mono-400 mt-0.5">
              5 problems from 5 different patterns to build cross-topic muscle memory.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigateToPlanDay(currentPlanDay)}
            className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-mono-300 hover:text-white bg-mono-850 hover:bg-mono-800 border border-mono-700/80 px-3 py-1.5 rounded-lg transition-colors"
          >
            <span>Open in Plan View</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 5 Problems for today */}
        <div className="flex flex-col divide-y divide-mono-800/70">
          {todayProblems.map((problem) => {
            const prog = progressMap.get(problem.id);
            const status = prog?.status || 'NOT_STARTED';

            return (
              <div
                key={problem.id}
                className="py-4 flex flex-col gap-3 group transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-mono-850 border border-mono-800 flex items-center justify-center font-mono text-xs font-bold text-mono-300">
                      #{problem.order}
                    </span>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onOpenProblem(problem.id)}
                          className="font-semibold text-sm text-mono-100 hover:text-white hover:underline text-left"
                        >
                          {problem.id}. {problem.title}
                        </button>
                        {problem.leetcodePremium && (
                          <span
                            className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-950/60 text-amber-300 border border-amber-800/60"
                            title="LeetCode Premium problem (Free NeetCode link provided)"
                          >
                            🔒 Premium
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-mono-400 mt-1">
                        <DifficultyBadge difficulty={problem.difficulty} />
                        {problem.leetcodeUrl && (
                          <a
                            href={problem.leetcodeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-mono text-mono-400 hover:text-mono-200"
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
                            className="inline-flex items-center gap-1 text-[11px] font-mono text-mono-400 hover:text-mono-200"
                          >
                            <span>NeetCode</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end md:self-auto">
                    {/* Status badge */}
                    <StatusBadge status={status} />

                    <button
                      type="button"
                      onClick={() => onOpenProblem(problem.id)}
                      className="px-3 py-1 rounded-lg text-xs font-medium bg-mono-100 text-mono-950 hover:bg-white transition-colors"
                    >
                      Open
                    </button>
                  </div>
                </div>

                {/* Inline Spoiler Safe Controls (CRITICAL: Section 4.3.1) */}
                <div className="pl-11">
                  <SpoilerControl
                    problem={problem}
                    progress={prog}
                    spoilerSafeMode={spoilerSafeMode}
                    compact
                    onUpdateProgress={(updates) => onUpdateProgress(problem.id, updates)}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* TOPIC BREAKDOWN (COLLAPSED DROPDOWN BY DEFAULT - CRITICAL SPEC REQUIREMENT) */}
      <div className="rounded-2xl bg-mono-900 border border-mono-800 overflow-hidden shadow-lg">
        <button
          type="button"
          onClick={() => setIsTopicBreakdownOpen(!isTopicBreakdownOpen)}
          className="w-full px-6 py-4 flex items-center justify-between bg-mono-900 hover:bg-mono-850/80 transition-colors text-left"
        >
          <div className="flex items-center gap-2.5">
            <Lock className="w-4 h-4 text-mono-400" />
            <h3 className="text-sm font-semibold text-mono-200">
              Revealed Topic Breakdown
            </h3>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-mono-800 text-mono-400">
              {revealedTopicEntries.length} revealed
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-mono-400">
            <span>{isTopicBreakdownOpen ? 'Collapse' : 'Expand'}</span>
            {isTopicBreakdownOpen ? (
              <ChevronUp className="w-4 h-4 text-mono-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-mono-400" />
            )}
          </div>
        </button>

        {isTopicBreakdownOpen && (
          <div className="p-6 border-t border-mono-800 flex flex-col gap-4 animate-in fade-in duration-150">
            {revealedTopicEntries.length === 0 ? (
              <p className="text-sm text-mono-400 italic">
                No topics revealed yet. Topics will appear here as you reveal them or solve problems.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {revealedTopicEntries.map(([topic, stats]) => {
                  const pct = Math.round((stats.solved / stats.total) * 100);
                  return (
                    <div
                      key={topic}
                      className="p-3.5 rounded-xl bg-mono-950 border border-mono-800/80 flex flex-col gap-2"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-mono-200">{topic}</span>
                        <span className="font-mono text-mono-400">
                          {stats.solved}/{stats.total}
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-mono-800 overflow-hidden">
                        <div
                          className="h-full bg-mono-200 transition-all duration-300"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {spoilerSafeMode && hiddenTopicsCount > 0 && (
              <div className="text-xs text-mono-400 italic font-mono pt-2 border-t border-mono-800/60">
                🔒 {hiddenTopicsCount} problems currently have hidden topics to protect pattern recognition.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
