import React, { useState } from 'react';
import { Lock, EyeOff, ChevronDown, ChevronUp, Lightbulb } from 'lucide-react';
import { Problem, Progress } from '../../types';
import { getSafeProblemView } from '../../utils/spoilers';

interface SpoilerControlProps {
  problem: Problem;
  progress?: Progress;
  spoilerSafeMode: boolean;
  onUpdateProgress: (updates: Partial<Progress>) => void;
  className?: string;
  compact?: boolean;
}

export const SpoilerControl: React.FC<SpoilerControlProps> = ({
  problem,
  progress,
  spoilerSafeMode,
  onUpdateProgress,
  className = '',
  compact = false,
}) => {
  const [isHintsAccordionOpen, setIsHintsAccordionOpen] = useState(false);

  // Fetch safe view through the single accessor
  const safe = getSafeProblemView(problem, progress, spoilerSafeMode);

  const handleRevealTopic = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdateProgress({ topicRevealed: true });
  };

  const handleRehideTopic = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdateProgress({ topicRevealed: false });
  };

  const handleRevealNextHint = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (safe.nextAvailableHintIndex !== null) {
      onUpdateProgress({
        hintsRevealed: safe.nextAvailableHintIndex as 1 | 2 | 3,
      });
    }
  };

  const handleRehideHints = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdateProgress({ hintsRevealed: 0 });
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className={`flex items-center flex-wrap gap-2 ${compact ? 'text-xs' : 'text-sm'}`}>
        {/* TOPIC CONTROL */}
        {safe.isTopicRevealed ? (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-mono-850 border border-mono-700/80 text-mono-200">
            <span className="text-mono-400 text-xs font-mono uppercase tracking-wider">Topic:</span>
            <span className="font-medium text-mono-100">{safe.topic}</span>
            {spoilerSafeMode && (
              <button
                type="button"
                onClick={handleRehideTopic}
                className="ml-1 p-0.5 rounded text-mono-400 hover:text-mono-200 hover:bg-mono-800 transition-colors"
                title="Re-hide topic"
              >
                <EyeOff className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={handleRevealTopic}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-mono-900 border border-mono-800 text-mono-400 hover:text-mono-200 hover:border-mono-700 transition-colors font-mono text-xs"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Reveal topic</span>
          </button>
        )}

        {/* HINTS ACCORDION TOGGLE */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsHintsAccordionOpen(!isHintsAccordionOpen);
          }}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded border transition-colors font-mono text-xs ${
            safe.hintsRevealedCount > 0
              ? 'bg-amber-950/40 border-amber-800/50 text-amber-300'
              : 'bg-mono-900 border-mono-800 text-mono-400 hover:text-mono-200 hover:border-mono-700'
          }`}
        >
          <Lightbulb className="w-3.5 h-3.5" />
          <span>
            Hints ({safe.hintsRevealedCount}/{safe.totalHints} used)
          </span>
          {isHintsAccordionOpen ? (
            <ChevronUp className="w-3 h-3 text-mono-400" />
          ) : (
            <ChevronDown className="w-3 h-3 text-mono-400" />
          )}
        </button>
      </div>

      {/* EXPANDABLE HINTS PANEL */}
      {isHintsAccordionOpen && (
        <div
          className="p-3.5 rounded-lg bg-mono-900/90 border border-mono-800 text-xs flex flex-col gap-2.5 animate-in fade-in slide-in-from-top-1 duration-150"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between border-b border-mono-800/80 pb-2">
            <span className="font-semibold text-mono-300">
              Progressive Hints ({safe.hintsRevealedCount} of {safe.totalHints} unlocked)
            </span>
            {safe.hintsRevealedCount > 0 && spoilerSafeMode && (
              <button
                type="button"
                onClick={handleRehideHints}
                className="inline-flex items-center gap-1 text-[11px] text-mono-400 hover:text-mono-200 hover:underline"
              >
                <EyeOff className="w-3 h-3" />
                <span>Re-hide all hints</span>
              </button>
            )}
          </div>

          {/* List of unlocked hints only - unrevealed hints are NEVER rendered */}
          {safe.revealedHints.length === 0 ? (
            <p className="text-mono-400 italic py-1">
              No hints revealed yet. Try solving it on your own first!
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {safe.revealedHints.map((hintText, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded bg-mono-950/80 border border-mono-800/80 text-mono-200 leading-relaxed font-sans"
                >
                  <span className="font-mono font-semibold text-amber-400 mr-1.5">
                    Hint {idx + 1}:
                  </span>
                  {hintText}
                </div>
              ))}
            </div>
          )}

          {/* Button to unlock next hint */}
          {spoilerSafeMode && safe.nextAvailableHintIndex !== null && (
            <div className="pt-1">
              <button
                type="button"
                onClick={handleRevealNextHint}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-mono-850 hover:bg-mono-800 border border-mono-700 text-mono-200 text-xs font-mono transition-colors"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                <span>Unlock Hint {safe.nextAvailableHintIndex}</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
