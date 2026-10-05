import React, { useState } from 'react';
import { ExternalLink, CheckCircle2, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { Problem, Progress, Settings, ProblemStatus } from '../../types';
import { DifficultyBadge, StatusBadge } from '../common/Badge';
import { SpoilerControl } from '../spoilers/SpoilerControl';
import { calculateCurrentPlanDay, getDateForPlanDay } from '../../utils/schedule';

interface PlanViewProps {
  problems: Problem[];
  progressMap: Map<number, Progress>;
  settings?: Settings;
  selectedDay?: number;
  onOpenProblem: (problemId: number) => void;
  onUpdateProgress: (problemId: number, updates: Partial<Progress>) => void;
}

export const PlanView: React.FC<PlanViewProps> = ({
  problems,
  progressMap,
  settings,
  selectedDay: initialSelectedDay,
  onOpenProblem,
  onUpdateProgress,
}) => {
  const startDate = settings?.startDate || '';
  const currentPlanDay = calculateCurrentPlanDay(startDate);
  const [activeDay, setActiveDay] = useState<number>(initialSelectedDay || currentPlanDay);

  const spoilerSafeMode = settings?.spoilerSafeMode !== false;

  // Filter problems for the active day
  const dayProblems = problems
    .filter((p) => p.day === activeDay)
    .sort((a, b) => a.order - b.order);

  // Calculate solve count for each day (1..15)
  const dayStats = Array.from({ length: 15 }, (_, i) => {
    const dayNum = i + 1;
    const probs = problems.filter((p) => p.day === dayNum);
    const solvedCount = probs.filter((p) => progressMap.get(p.id)?.status === 'SOLVED').length;
    return {
      day: dayNum,
      total: probs.length,
      solved: solvedCount,
      isCompleted: solvedCount === probs.length && probs.length > 0,
      isToday: dayNum === currentPlanDay,
    };
  });

  const activeDayDateStr = getDateForPlanDay(startDate, activeDay);

  return (
    <div className="flex flex-col gap-6 pb-16">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-mono-100 tracking-tight">
            15-Day Blind 75 Study Plan
          </h1>
          <p className="text-xs text-mono-400 mt-1">
            5 problems per day from different topic categories to maximize interleaving practice.
          </p>
        </div>

        {startDate && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-mono-900 border border-mono-800 text-xs font-mono text-mono-300">
            <CalendarIcon className="w-3.5 h-3.5 text-mono-400" />
            <span>Target Date for Day {activeDay}: {activeDayDateStr}</span>
          </div>
        )}
      </div>

      {/* DAY SELECTOR TABS (DAY 1 TO 15) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
        {dayStats.map((stat) => {
          const isActive = stat.day === activeDay;
          return (
            <button
              key={stat.day}
              type="button"
              onClick={() => setActiveDay(stat.day)}
              className={`relative flex flex-col items-center min-w-[70px] px-3 py-2.5 rounded-xl border transition-all shrink-0 ${
                isActive
                  ? 'bg-mono-100 text-mono-950 border-mono-100 font-bold shadow-lg'
                  : 'bg-mono-900 text-mono-400 border-mono-800 hover:border-mono-700 hover:text-mono-200'
              }`}
            >
              {stat.isToday && (
                <span
                  className={`absolute -top-1.5 px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold ${
                    isActive ? 'bg-black text-white' : 'bg-mono-200 text-mono-900'
                  }`}
                >
                  TODAY
                </span>
              )}
              <span className="text-xs font-mono">Day {stat.day}</span>
              <div className="flex items-center gap-1 mt-1 text-[11px] font-mono">
                {stat.isCompleted ? (
                  <CheckCircle2
                    className={`w-3 h-3 ${isActive ? 'text-black' : 'text-emerald-400'}`}
                  />
                ) : (
                  <span className={isActive ? 'text-mono-800' : 'text-mono-500'}>
                    {stat.solved}/{stat.total}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* ACTIVE DAY PROBLEMS LIST */}
      <div className="rounded-2xl bg-mono-900 border border-mono-800 overflow-hidden shadow-xl">
        <div className="p-5 border-b border-mono-800 bg-mono-900/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-bold text-mono-100">Day {activeDay} Problems</h2>
            <span className="text-xs font-mono text-mono-400 px-2.5 py-0.5 rounded-full bg-mono-850 border border-mono-800">
              {dayStats[activeDay - 1]?.solved} of 5 Solved
            </span>
          </div>

          <div className="text-xs text-mono-400 font-mono">
            {dayStats[activeDay - 1]?.isCompleted ? (
              <span className="text-emerald-400 font-medium">✓ Day {activeDay} Completed!</span>
            ) : (
              <span>Remaining: {5 - (dayStats[activeDay - 1]?.solved || 0)}</span>
            )}
          </div>
        </div>

        <div className="divide-y divide-mono-800/80">
          {dayProblems.map((problem) => {
            const prog = progressMap.get(problem.id);
            const status = prog?.status || 'NOT_STARTED';

            return (
              <div
                key={problem.id}
                className="p-5 flex flex-col gap-3 hover:bg-mono-850/30 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-start md:items-center gap-3.5">
                    <span className="w-8 h-8 rounded-lg bg-mono-850 border border-mono-800 flex items-center justify-center font-mono text-xs font-bold text-mono-300 shrink-0 mt-0.5 md:mt-0">
                      #{problem.order}
                    </span>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 flex-wrap">
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
                            title="LeetCode Premium Problem"
                          >
                            🔒 Premium
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2.5 text-xs text-mono-400 mt-1 flex-wrap">
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
                    {/* Status dropdown selector */}
                    <select
                      value={status}
                      onChange={(e) => {
                        const newStatus = e.target.value as ProblemStatus;
                        const updates: Partial<Progress> = { status: newStatus };
                        if (
                          newStatus === 'SOLVED' &&
                          settings?.autoRevealTopicOnSolve !== false
                        ) {
                          updates.topicRevealed = true;
                        }
                        if (newStatus === 'SOLVED' && !prog?.firstSolvedAt) {
                          updates.firstSolvedAt = new Date().toISOString();
                        }
                        onUpdateProgress(problem.id, updates);
                      }}
                      className="bg-mono-850 border border-mono-800 text-mono-200 text-xs rounded-lg px-2.5 py-1 font-mono focus:outline-none focus:border-mono-600"
                    >
                      <option value="NOT_STARTED">Not Started</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="SOLVED">Solved</option>
                      <option value="NEEDS_REVISION">Needs Revision</option>
                    </select>

                    <StatusBadge status={status} />

                    <button
                      type="button"
                      onClick={() => onOpenProblem(problem.id)}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium bg-mono-100 text-mono-950 hover:bg-white transition-colors"
                    >
                      <span>Open</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Inline Spoiler-Safe topic and hints controls */}
                <div className="pl-0 sm:pl-11 pt-1">
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
    </div>
  );
};
