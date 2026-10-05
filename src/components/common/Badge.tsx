import React from 'react';
import { ProblemDifficulty, ProblemStatus } from '../../types';

interface DifficultyBadgeProps {
  difficulty: ProblemDifficulty;
  className?: string;
}

export const DifficultyBadge: React.FC<DifficultyBadgeProps> = ({ difficulty, className = '' }) => {
  const styles = {
    Easy: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60',
    Medium: 'bg-amber-950/60 text-amber-300 border-amber-800/60',
    Hard: 'bg-rose-950/60 text-rose-300 border-rose-800/60',
  }[difficulty];

  const dots = {
    Easy: '●',
    Medium: '●●',
    Hard: '●●●',
  }[difficulty];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-mono border ${styles} ${className}`}
    >
      <span className="text-[10px] tracking-tighter opacity-80">{dots}</span>
      <span>{difficulty}</span>
    </span>
  );
};

interface StatusBadgeProps {
  status: ProblemStatus;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const config = {
    NOT_STARTED: {
      label: 'Not Started',
      style: 'bg-mono-900 text-mono-400 border-mono-800',
      dot: 'bg-mono-600',
    },
    IN_PROGRESS: {
      label: 'In Progress',
      style: 'bg-blue-950/50 text-blue-300 border-blue-800/50',
      dot: 'bg-blue-400 animate-pulse',
    },
    SOLVED: {
      label: 'Solved',
      style: 'bg-zinc-100 text-zinc-950 font-medium border-zinc-200 shadow-sm',
      dot: 'bg-emerald-500',
    },
    NEEDS_REVISION: {
      label: 'Needs Revision',
      style: 'bg-purple-950/50 text-purple-300 border-purple-800/50',
      dot: 'bg-purple-400',
    },
  }[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.style} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <span>{config.label}</span>
    </span>
  );
};
