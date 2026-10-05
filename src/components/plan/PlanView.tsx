import React, { useState, useEffect, useRef } from 'react';
import { ExternalLink, CheckCircle2, ChevronRight, BookOpen } from 'lucide-react';
import { Problem, Progress, Settings, ProblemStatus } from '../../types';
import { DifficultyBadge, StatusBadge } from '../common/Badge';
import { SpoilerControl } from '../spoilers/SpoilerControl';
import { calculateCurrentPlanDay } from '../../utils/schedule';

interface PlanViewProps {
  problems: Problem[];
  progressMap: Map<number, Progress>;
  settings?: Settings;
  selectedDay?: number;
  onSelectDay?: (day: number) => void;
  onOpenGuide?: () => void;
  onOpenProblem: (problemId: number) => void;
  onUpdateProgress: (problemId: number, updates: Partial<Progress>) => void;
}

export const PlanView: React.FC<PlanViewProps> = ({
  problems,
  progressMap,
  settings,
  selectedDay: initialSelectedDay,
  onSelectDay,
  onOpenGuide,
  onOpenProblem,
  onUpdateProgress,
}) => {
  const startDate = settings?.startDate || '';
  const currentPlanDay = calculateCurrentPlanDay(startDate);
  const [activeDay, setActiveDay] = useState<number>(initialSelectedDay || currentPlanDay);
  const activeTabRef = useRef<HTMLButtonElement | null>(null);

  // Sync if selectedDay prop changes (e.g. from Dashboard or parent)
  useEffect(() => {
    if (initialSelectedDay && initialSelectedDay >= 1 && initialSelectedDay <= 15) {
      setActiveDay(initialSelectedDay);
    }
  }, [initialSelectedDay]);

  // Keep parent in sync with active day
  useEffect(() => {
    if (activeDay >= 1 && activeDay <= 15) {
      onSelectDay?.(activeDay);
    }
  }, [activeDay, onSelectDay]);

  // Scroll active day into view in the horizontal tabs bar if needed
  useEffect(() => {
    if (activeTabRef.current) {
      activeTabRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [activeDay]);

  const handleSelectDay = (day: number) => {
    setActiveDay(day);
    onSelectDay?.(day);
  };

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

  return (
    <div className="flex flex-col gap-6 pb-16">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl font-bold text-mono-100 tracking-tight">
              15-Day Blind 75 Study Plan
            </h1>
            {onOpenGuide && (
              <button
                type="button"
                onClick={onOpenGuide}
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-mono-900 border border-mono-800 text-[11px] font-mono text-emerald-400 hover:text-emerald-300 hover:border-mono-700 transition-colors shadow-xs"
                title="Read guide on running Java code locally vs LeetCode/NeetCode links"
              >
                <BookOpen className="w-3 h-3" />
                <span>Read This</span>
              </button>
            )}
          </div>
          <p className="text-xs text-mono-400 mt-1">
            5 problems per day from different topic categories to maximize interleaving practice.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-mono-900/90 border border-mono-800 text-xs font-mono shadow-sm">
          <span className="font-bold text-mono-100">Day {activeDay}</span>
          <span className="text-mono-600">•</span>
          <span className="text-mono-400">
            {dayStats[activeDay - 1]?.solved}/5 Solved
          </span>
          {activeDay === currentPlanDay && (
            <span className="ml-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-mono-800 text-mono-200 border border-mono-700">
              Today
            </span>
          )}
        </div>
      </div>

      {/* DAY SELECTOR TABS (DAY 1 TO 15) */}
      <div className="flex items-center gap-2.5 overflow-x-auto py-2.5 px-0.5 scrollbar-thin">
        {dayStats.map((stat) => {
          const isActive = stat.day === activeDay;
          const pct = Math.round((stat.solved / stat.total) * 100);

          return (
            <button
              key={stat.day}
              ref={isActive ? activeTabRef : undefined}
              type="button"
              onClick={() => handleSelectDay(stat.day)}
              className={`group flex flex-col justify-between min-w-[110px] sm:min-w-[118px] h-[78px] p-2.5 sm:p-3 rounded-xl border transition-all shrink-0 text-left ${
                isActive
                  ? 'bg-mono-850 border-mono-300 text-mono-100 ring-2 ring-mono-100/20 shadow-lg'
                  : 'bg-mono-900/90 border-mono-800 text-mono-400 hover:border-mono-700 hover:bg-mono-850/80 hover:text-mono-200 shadow-sm'
              }`}
            >
              {/* TOP ROW: DAY TITLE & STATUS BADGES */}
              <div className="flex items-center justify-between gap-1.5 w-full">
                <span
                  className={`text-xs font-mono font-bold tracking-tight ${
                    isActive ? 'text-white' : 'text-mono-200 group-hover:text-white'
                  }`}
                >
                  Day {stat.day}
                </span>

                <div className="flex items-center gap-1 shrink-0">
                  {stat.isToday && (
                    <span
                      className={`px-1.5 py-0.5 rounded text-[8.5px] font-mono font-extrabold tracking-wider uppercase ${
                        isActive
                          ? 'bg-mono-100 text-mono-950 shadow-xs'
                          : 'bg-mono-800 text-mono-200 border border-mono-700'
                      }`}
                    >
                      TODAY
                    </span>
                  )}
                  {stat.isCompleted && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  )}
                </div>
              </div>

              {/* BOTTOM ROW: SOLVED COUNT & MINI PROGRESS BAR */}
              <div className="flex flex-col gap-1.5 w-full mt-auto">
                <div className="flex items-center justify-between text-[11px] font-mono leading-none">
                  {stat.isCompleted ? (
                    <span className="text-emerald-400 font-medium">5/5 Solved</span>
                  ) : stat.solved > 0 ? (
                    <span className={isActive ? 'text-mono-200 font-medium' : 'text-mono-300'}>
                      {stat.solved}/5 solved
                    </span>
                  ) : (
                    <span className={isActive ? 'text-mono-400' : 'text-mono-500'}>
                      0/5 solved
                    </span>
                  )}

                  {stat.solved > 0 && !stat.isCompleted && (
                    <span className="text-[10px] text-mono-500 font-mono">
                      {pct}%
                    </span>
                  )}
                </div>

                {/* PROGRESS TRACK */}
                <div
                  className={`w-full h-1 rounded-full overflow-hidden ${
                    isActive ? 'bg-mono-800' : 'bg-mono-850'
                  }`}
                >
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      stat.isCompleted
                        ? 'bg-emerald-400'
                        : isActive
                        ? 'bg-mono-200'
                        : 'bg-mono-500'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
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
