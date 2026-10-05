import React, { useState, useMemo } from 'react';
import {
  Search,
  ArrowUpDown,
  ExternalLink,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { Problem, Progress, Settings, ProblemDifficulty, ProblemStatus } from '../../types';
import { DifficultyBadge, StatusBadge } from '../common/Badge';
import { SpoilerControl } from '../spoilers/SpoilerControl';

interface AllProblemsViewProps {
  problems: Problem[];
  progressMap: Map<number, Progress>;
  bestVersionsMap: Map<number, boolean>;
  settings?: Settings;
  initialFilter?: { status?: ProblemStatus; day?: number; behindScheduleOnly?: boolean };
  onOpenProblem: (problemId: number) => void;
  onUpdateProgress: (problemId: number, updates: Partial<Progress>) => void;
}

type SortField = 'id' | 'title' | 'day' | 'difficulty' | 'status';
type SortOrder = 'asc' | 'desc';

export const AllProblemsView: React.FC<AllProblemsViewProps> = ({
  problems,
  progressMap,
  bestVersionsMap,
  settings,
  initialFilter,
  onOpenProblem,
  onUpdateProgress,
}) => {
  const spoilerSafeMode = settings?.spoilerSafeMode !== false;

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>(initialFilter?.status || 'ALL');
  const [selectedDay, setSelectedDay] = useState<string>(
    initialFilter?.day ? String(initialFilter.day) : 'ALL'
  );
  const [hasRemarksFilter, setHasRemarksFilter] = useState<string>('ALL');
  const [premiumFilter, setPremiumFilter] = useState<string>('ALL');
  const [selectedTopic, setSelectedTopic] = useState<string>('ALL'); // only used when spoilerSafeMode is OFF

  // Sorting
  const [sortField, setSortField] = useState<SortField>('id');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Filtered and sorted problems
  const filteredProblems = useMemo(() => {
    return problems.filter((problem) => {
      const prog = progressMap.get(problem.id);
      const status = prog?.status || 'NOT_STARTED';

      // 1. Title/ID Free text search (MUST NEVER search topic or hint text!)
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const matchesTitle = problem.title.toLowerCase().includes(query);
        const matchesId = String(problem.id).includes(query);
        if (!matchesTitle && !matchesId) {
          return false;
        }
      }

      // 2. Difficulty filter
      if (selectedDifficulty !== 'ALL' && problem.difficulty !== selectedDifficulty) {
        return false;
      }

      // 3. Status filter
      if (selectedStatus !== 'ALL' && status !== selectedStatus) {
        return false;
      }

      // 4. Day filter
      if (selectedDay !== 'ALL' && problem.day !== Number(selectedDay)) {
        return false;
      }

      // 5. Remarks filter
      if (hasRemarksFilter === 'YES' && (!prog?.remarks || !prog.remarks.trim())) {
        return false;
      }
      if (hasRemarksFilter === 'NO' && Boolean(prog?.remarks && prog.remarks.trim())) {
        return false;
      }

      // 6. Premium filter
      if (premiumFilter === 'PREMIUM' && !problem.leetcodePremium) return false;
      if (premiumFilter === 'FREE' && problem.leetcodePremium) return false;

      // 7. Topic filter: ONLY available when spoilerSafeMode is OFF
      if (!spoilerSafeMode && selectedTopic !== 'ALL' && problem.topic !== selectedTopic) {
        return false;
      }

      return true;
    });
  }, [
    problems,
    progressMap,
    searchQuery,
    selectedDifficulty,
    selectedStatus,
    selectedDay,
    hasRemarksFilter,
    premiumFilter,
    selectedTopic,
    spoilerSafeMode,
  ]);

  // Sort comparator
  const sortedProblems = useMemo(() => {
    const list = [...filteredProblems];
    const difficultyWeights: Record<ProblemDifficulty, number> = {
      Easy: 1,
      Medium: 2,
      Hard: 3,
    };
    const statusWeights: Record<ProblemStatus, number> = {
      NOT_STARTED: 0,
      IN_PROGRESS: 1,
      NEEDS_REVISION: 2,
      SOLVED: 3,
    };

    list.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'id':
          comparison = a.id - b.id;
          break;
        case 'day':
          comparison = a.day !== b.day ? a.day - b.day : a.order - b.order;
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'difficulty':
          comparison = difficultyWeights[a.difficulty] - difficultyWeights[b.difficulty];
          break;
        case 'status': {
          const statusA = progressMap.get(a.id)?.status || 'NOT_STARTED';
          const statusB = progressMap.get(b.id)?.status || 'NOT_STARTED';
          comparison = statusWeights[statusA] - statusWeights[statusB];
          break;
        }
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return list;
  }, [filteredProblems, sortField, sortOrder, progressMap]);

  // Unique topics list only if spoilerSafeMode is OFF
  const allUniqueTopics = useMemo(() => {
    if (spoilerSafeMode) return [];
    return Array.from(new Set(problems.map((p) => p.topic))).sort();
  }, [problems, spoilerSafeMode]);

  return (
    <div className="flex flex-col gap-6 pb-16">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-mono-100 tracking-tight">
            All 75 LeetCode Problems
          </h1>
          <p className="text-xs text-mono-400 mt-1">
            Browse, filter, and inspect problems. Topic columns & filters remain hidden in Spoiler-Safe Mode.
          </p>
        </div>

        <div className="text-xs font-mono text-mono-400">
          Showing <span className="font-semibold text-mono-100">{sortedProblems.length}</span> of {problems.length}
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="p-4 rounded-xl bg-mono-900 border border-mono-800 flex flex-col gap-3.5 shadow-md">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* SEARCH INPUT */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-mono-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search problem title or #ID (e.g., 'Two Sum' or '1')..."
              className="w-full bg-mono-950 border border-mono-800 rounded-lg pl-9 pr-4 py-2 text-xs text-mono-100 placeholder:text-mono-500 font-sans focus:outline-none focus:border-mono-600 transition-colors"
            />
          </div>

          {/* RESET FILTERS */}
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedDifficulty('ALL');
              setSelectedStatus('ALL');
              setSelectedDay('ALL');
              setHasRemarksFilter('ALL');
              setPremiumFilter('ALL');
              setSelectedTopic('ALL');
            }}
            className="px-3 py-2 rounded-lg bg-mono-850 hover:bg-mono-800 border border-mono-800 text-xs font-mono text-mono-300 transition-colors shrink-0"
          >
            Clear Filters
          </button>
        </div>

        {/* FILTER CONTROLS */}
        <div className="flex items-center gap-2.5 flex-wrap text-xs">
          <div className="flex items-center gap-1.5 text-mono-400 font-mono">
            <Filter className="w-3.5 h-3.5" />
            <span>Filters:</span>
          </div>

          {/* Difficulty */}
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="bg-mono-950 border border-mono-800 text-mono-200 rounded-lg px-2.5 py-1.5 font-mono focus:outline-none"
          >
            <option value="ALL">Difficulty: All</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          {/* Status */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-mono-950 border border-mono-800 text-mono-200 rounded-lg px-2.5 py-1.5 font-mono focus:outline-none"
          >
            <option value="ALL">Status: All</option>
            <option value="NOT_STARTED">Not Started</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="SOLVED">Solved</option>
            <option value="NEEDS_REVISION">Needs Revision</option>
          </select>

          {/* Day */}
          <select
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
            className="bg-mono-950 border border-mono-800 text-mono-200 rounded-lg px-2.5 py-1.5 font-mono focus:outline-none"
          >
            <option value="ALL">Plan Day: All</option>
            {Array.from({ length: 15 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                Day {i + 1}
              </option>
            ))}
          </select>

          {/* Has Remarks */}
          <select
            value={hasRemarksFilter}
            onChange={(e) => setHasRemarksFilter(e.target.value)}
            className="bg-mono-950 border border-mono-800 text-mono-200 rounded-lg px-2.5 py-1.5 font-mono focus:outline-none"
          >
            <option value="ALL">Remarks: All</option>
            <option value="YES">Has Remarks</option>
            <option value="NO">No Remarks</option>
          </select>

          {/* Premium */}
          <select
            value={premiumFilter}
            onChange={(e) => setPremiumFilter(e.target.value)}
            className="bg-mono-950 border border-mono-800 text-mono-200 rounded-lg px-2.5 py-1.5 font-mono focus:outline-none"
          >
            <option value="ALL">Access: All</option>
            <option value="FREE">Free</option>
            <option value="PREMIUM">LeetCode Premium</option>
          </select>

          {/* Topic filter ONLY when spoilerSafeMode is OFF */}
          {!spoilerSafeMode && (
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="bg-mono-950 border border-mono-800 text-mono-200 rounded-lg px-2.5 py-1.5 font-mono focus:outline-none"
            >
              <option value="ALL">Topic: All</option>
              {allUniqueTopics.map((top) => (
                <option key={top} value={top}>
                  {top}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* PROBLEMS LIST / TABLE */}
      <div className="rounded-2xl bg-mono-900 border border-mono-800 overflow-hidden shadow-xl">
        {/* Table Header with sortable columns */}
        <div className="grid grid-cols-12 gap-3 px-5 py-3.5 bg-mono-850/80 border-b border-mono-800 text-xs font-mono font-semibold text-mono-400">
          <div
            className="col-span-1 flex items-center gap-1 cursor-pointer hover:text-mono-100"
            onClick={() => handleSort('id')}
          >
            <span>#ID</span>
            <ArrowUpDown className="w-3 h-3" />
          </div>

          <div
            className="col-span-1 flex items-center gap-1 cursor-pointer hover:text-mono-100"
            onClick={() => handleSort('day')}
          >
            <span>Day</span>
            <ArrowUpDown className="w-3 h-3" />
          </div>

          <div
            className={`${spoilerSafeMode ? 'col-span-5' : 'col-span-4'} flex items-center gap-1 cursor-pointer hover:text-mono-100`}
            onClick={() => handleSort('title')}
          >
            <span>Problem Title</span>
            <ArrowUpDown className="w-3 h-3" />
          </div>

          {!spoilerSafeMode && (
            <div className="col-span-2">
              <span>Topic</span>
            </div>
          )}

          <div
            className="col-span-2 flex items-center gap-1 cursor-pointer hover:text-mono-100"
            onClick={() => handleSort('difficulty')}
          >
            <span>Difficulty</span>
            <ArrowUpDown className="w-3 h-3" />
          </div>

          <div
            className="col-span-2 flex items-center gap-1 cursor-pointer hover:text-mono-100"
            onClick={() => handleSort('status')}
          >
            <span>Status</span>
            <ArrowUpDown className="w-3 h-3" />
          </div>

          <div className="col-span-1 text-right">
            <span>Action</span>
          </div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-mono-800/80">
          {sortedProblems.length === 0 ? (
            <div className="p-8 text-center text-mono-500 font-mono text-sm">
              No problems found matching your criteria.
            </div>
          ) : (
            sortedProblems.map((problem) => {
              const prog = progressMap.get(problem.id);
              const status = prog?.status || 'NOT_STARTED';
              const hasBestVersion = Boolean(bestVersionsMap.get(problem.id));

              return (
                <div
                  key={problem.id}
                  className="px-5 py-4 flex flex-col gap-2.5 hover:bg-mono-850/40 transition-colors"
                >
                  <div className="grid grid-cols-12 gap-3 items-center">
                    {/* ID */}
                    <div className="col-span-1 font-mono text-xs font-semibold text-mono-300">
                      {problem.id}
                    </div>

                    {/* DAY */}
                    <div className="col-span-1 font-mono text-xs text-mono-400">
                      D{problem.day}.{problem.order}
                    </div>

                    {/* TITLE & LINKS */}
                    <div
                      className={`${
                        spoilerSafeMode ? 'col-span-5' : 'col-span-4'
                      } flex flex-col gap-1 pr-2`}
                    >
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          type="button"
                          onClick={() => onOpenProblem(problem.id)}
                          className="font-semibold text-sm text-mono-100 hover:text-white hover:underline text-left"
                        >
                          {problem.title}
                        </button>
                        {problem.leetcodePremium && (
                          <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-amber-950/60 text-amber-300 border border-amber-800/60">
                            🔒 Prem
                          </span>
                        )}
                        {hasBestVersion && (
                          <span
                            className="text-amber-400 text-xs"
                            title="Has Best Solution Version"
                          >
                            ★
                          </span>
                        )}
                        {prog?.remarks && (
                          <span
                            className="text-mono-400 text-xs font-mono"
                            title="Has remarks recorded"
                          >
                            📝
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-[11px] font-mono text-mono-400">
                        {problem.leetcodeUrl && (
                          <a
                            href={problem.leetcodeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-mono-200 inline-flex items-center gap-0.5"
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
                            className="hover:text-mono-200 inline-flex items-center gap-0.5"
                          >
                            <span>NeetCode</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>
                    </div>

                    {/* TOPIC COLUMN (ONLY VISIBLE WHEN SPOILER-SAFE MODE IS OFF) */}
                    {!spoilerSafeMode && (
                      <div className="col-span-2 font-mono text-xs text-mono-300">
                        {problem.topic}
                      </div>
                    )}

                    {/* DIFFICULTY */}
                    <div className="col-span-2">
                      <DifficultyBadge difficulty={problem.difficulty} />
                    </div>

                    {/* STATUS */}
                    <div className="col-span-2 flex items-center gap-2">
                      <StatusBadge status={status} />
                    </div>

                    {/* ACTION */}
                    <div className="col-span-1 text-right">
                      <button
                        type="button"
                        onClick={() => onOpenProblem(problem.id)}
                        className="p-1.5 rounded-lg text-mono-400 hover:text-mono-100 hover:bg-mono-800 transition-colors"
                        title="Open problem details & code editor"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* INLINE SPOILER CONTROLS (CRITICAL SPEC REQUIREMENT 4.3.1) */}
                  <div className="pt-1 border-t border-mono-800/40">
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
            })
          )}
        </div>
      </div>
    </div>
  );
};
