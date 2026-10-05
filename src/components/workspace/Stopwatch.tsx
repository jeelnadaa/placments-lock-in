import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Timer } from 'lucide-react';

interface StopwatchProps {
  onElapsedUpdate?: (ms: number) => void;
  className?: string;
}

export const Stopwatch: React.FC<StopwatchProps> = ({ onElapsedUpdate, className = '' }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      const startTime = Date.now() - elapsedMs;
      intervalRef.current = setInterval(() => {
        const now = Date.now() - startTime;
        setElapsedMs(now);
        onElapsedUpdate?.(now);
      }, 100);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, elapsedMs, onElapsedUpdate]);

  const toggle = () => setIsRunning(!isRunning);
  const reset = () => {
    setIsRunning(false);
    setElapsedMs(0);
    onElapsedUpdate?.(0);
  };

  const totalSecs = Math.floor(elapsedMs / 1000);
  const mins = Math.floor(totalSecs / 60);
  const secs = totalSecs % 60;
  const timeStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-mono-900 border border-mono-800 text-xs font-mono text-mono-200 ${className}`}>
      <Timer className="w-3.5 h-3.5 text-mono-400" />
      <span className="font-semibold text-mono-100">{timeStr}</span>
      <button
        type="button"
        onClick={toggle}
        className="p-1 rounded hover:bg-mono-800 text-mono-400 hover:text-mono-100 transition-colors"
        title={isRunning ? 'Pause' : 'Start'}
      >
        {isRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
      </button>
      <button
        type="button"
        onClick={reset}
        className="p-1 rounded hover:bg-mono-800 text-mono-400 hover:text-mono-100 transition-colors"
        title="Reset stopwatch"
      >
        <RotateCcw className="w-3 h-3" />
      </button>
    </div>
  );
};
