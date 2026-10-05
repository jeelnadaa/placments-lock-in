import React, { useState } from 'react';
import { AlertOctagon, Bug, Copy, Check, Terminal, ChevronDown, ChevronUp, FileCode } from 'lucide-react';

interface ParsedCompileError {
  file: string;
  line: number;
  column?: number;
  message: string;
  snippet?: string;
  pointer?: string;
  extra?: string[];
}

interface ErrorDisplayProps {
  verdict: string;
  error?: string;
  compileError?: string;
  stackTrace?: string;
  failingInput?: Record<string, unknown> | string;
  onJumpToLine?: (line: number) => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  verdict,
  error,
  compileError,
  stackTrace,
  failingInput,
  onJumpToLine,
}) => {
  const [copied, setCopied] = useState(false);
  const [showRaw, setShowRaw] = useState(false);

  const rawErrorMessage = compileError || error || stackTrace || '';

  const handleCopy = () => {
    navigator.clipboard.writeText(rawErrorMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isCompileError = verdict === 'Compile Error' || !!compileError;

  // Parse javac compiler errors
  const parseCompileErrors = (text: string): ParsedCompileError[] => {
    const lines = text.split('\n');
    const errors: ParsedCompileError[] = [];
    let current: ParsedCompileError | null = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      // Match Solution.java:4: error: message
      const match = line.match(/(?:.*[/\\])?([A-Za-z0-9_]+\.java):(\d+):\s*(?:error:\s*)?(.*)/i);
      if (match) {
        if (current) errors.push(current);
        current = {
          file: match[1],
          line: parseInt(match[2], 10),
          message: match[3] || 'Compilation error',
          extra: [],
        };
        // Check if next lines are snippet and caret pointer
        if (i + 1 < lines.length && !lines[i + 1].includes('.java:')) {
          current.snippet = lines[i + 1];
          if (i + 2 < lines.length && lines[i + 2].includes('^')) {
            current.pointer = lines[i + 2];
            i += 2;
          } else {
            i += 1;
          }
        }
      } else if (current && line.trim()) {
        current.extra?.push(line);
      }
    }
    if (current) errors.push(current);
    return errors;
  };

  // Parse runtime exception & stack trace
  const parseRuntimeError = (errText: string, traceText?: string) => {
    const fullText = (errText + '\n' + (traceText || '')).trim();
    const lines = fullText.split('\n');
    const firstLine = lines[0] || 'Unknown Runtime Exception';

    // Separate exception name and message
    const colonIdx = firstLine.indexOf(':');
    let exceptionName = firstLine;
    let exceptionMessage = '';
    if (colonIdx !== -1) {
      exceptionName = firstLine.substring(0, colonIdx).trim();
      exceptionMessage = firstLine.substring(colonIdx + 1).trim();
    }

    // Find lines referencing Solution.java
    const solutionFrames: { line: number; text: string }[] = [];
    const otherFrames: string[] = [];

    for (let i = 1; i < lines.length; i++) {
      const frame = lines[i].trim();
      if (!frame) continue;
      const match = frame.match(/Solution\.java:(\d+)/i);
      if (match) {
        solutionFrames.push({
          line: parseInt(match[1], 10),
          text: frame,
        });
      } else if (frame.startsWith('at ') && !frame.includes('Judge.') && !frame.includes('jdk.internal')) {
        otherFrames.push(frame);
      }
    }

    return {
      exceptionName,
      exceptionMessage,
      solutionFrames,
      otherFrames,
    };
  };

  const parsedCompile = isCompileError ? parseCompileErrors(rawErrorMessage) : [];
  const parsedRuntime = !isCompileError ? parseRuntimeError(error || '', stackTrace) : null;

  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-mono-900/90 border border-rose-900/70 p-4 shadow-2xl">
      {/* HEADER BAR */}
      <div className="flex items-center justify-between pb-3 border-b border-rose-900/50 flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-rose-950 border border-rose-800 text-rose-400">
            {isCompileError ? <AlertOctagon className="w-5 h-5" /> : <Bug className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="text-base font-bold text-rose-300 font-mono flex items-center gap-2">
              <span>{isCompileError ? 'Compile Time Error' : 'Runtime Error'}</span>
              {isCompileError && parsedCompile.length > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-rose-950 border border-rose-800 text-rose-400 font-medium">
                  {parsedCompile.length} {parsedCompile.length === 1 ? 'error' : 'errors'}
                </span>
              )}
            </h3>
            <p className="text-xs text-mono-400">
              {isCompileError
                ? 'Your code failed to compile with the Java compiler (javac).'
                : 'Your code compiled successfully but threw an unhandled exception during execution.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-mono-950 hover:bg-mono-800 border border-mono-800 text-mono-300 hover:text-mono-100 text-xs font-mono transition-colors"
            title="Copy error details"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Error'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowRaw(!showRaw)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-mono-950 hover:bg-mono-800 border border-mono-800 text-mono-300 hover:text-mono-100 text-xs font-mono transition-colors"
            title="Toggle raw output view"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>{showRaw ? 'Formatted' : 'Raw Log'}</span>
            {showRaw ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* FAILING INPUT (FOR RUNTIME ERROR) */}
      {!isCompileError && failingInput && (
        <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-mono-950/80 border border-mono-800 text-xs font-mono">
          <span className="text-mono-400 font-semibold uppercase tracking-wider text-[11px]">Failing Input:</span>
          <pre className="text-mono-200 overflow-x-auto text-sm leading-relaxed">
            {typeof failingInput === 'string' ? failingInput : JSON.stringify(failingInput, null, 2)}
          </pre>
        </div>
      )}

      {/* FORMATTED VIEW OR RAW LOG */}
      {showRaw ? (
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-mono text-mono-400">Raw Compiler / Runtime Output:</span>
          <pre className="p-3.5 rounded-xl bg-mono-950 border border-mono-800 text-rose-300 font-mono text-sm leading-relaxed overflow-x-auto whitespace-pre-wrap select-text">
            {rawErrorMessage || 'No error message available.'}
          </pre>
        </div>
      ) : isCompileError ? (
        // COMPILE ERRORS LIST
        <div className="flex flex-col gap-3 font-mono">
          {parsedCompile.length > 0 ? (
            parsedCompile.map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col gap-2 p-3.5 rounded-xl bg-mono-950 border border-rose-900/60 shadow-md"
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-rose-950 border border-rose-800 text-rose-400 text-xs font-bold">
                      {item.file} : Line {item.line}
                    </span>
                    <span className="text-sm font-semibold text-rose-200">{item.message}</span>
                  </div>

                  {onJumpToLine && (
                    <button
                      type="button"
                      onClick={() => onJumpToLine(item.line)}
                      className="inline-flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 hover:underline"
                    >
                      <FileCode className="w-3 h-3" />
                      <span>Jump to line {item.line}</span>
                    </button>
                  )}
                </div>

                {item.snippet && (
                  <div className="mt-1 p-2.5 rounded-lg bg-mono-900 border border-mono-800 overflow-x-auto text-sm">
                    <div className="text-mono-200">{item.snippet}</div>
                    {item.pointer && <div className="text-amber-400 font-bold whitespace-pre">{item.pointer}</div>}
                  </div>
                )}

                {item.extra && item.extra.length > 0 && (
                  <div className="text-xs text-mono-400 whitespace-pre-wrap">
                    {item.extra.join('\n')}
                  </div>
                )}
              </div>
            ))
          ) : (
            <pre className="p-3.5 rounded-xl bg-mono-950 border border-mono-800 text-rose-300 text-sm leading-relaxed overflow-x-auto whitespace-pre-wrap">
              {rawErrorMessage}
            </pre>
          )}
        </div>
      ) : (
        // RUNTIME ERROR DETAILS
        <div className="flex flex-col gap-3 font-mono">
          {parsedRuntime ? (
            <div className="flex flex-col gap-3">
              {/* EXCEPTION TITLE CARD */}
              <div className="p-3.5 rounded-xl bg-mono-950 border border-rose-900/80 flex flex-col gap-1.5 shadow-md">
                <span className="text-xs uppercase tracking-wider text-rose-400 font-bold">Exception:</span>
                <span className="text-sm md:text-base font-bold text-rose-200 break-words">
                  {parsedRuntime.exceptionName}
                </span>
                {parsedRuntime.exceptionMessage && (
                  <span className="text-xs md:text-sm text-mono-300 break-words mt-1">
                    {parsedRuntime.exceptionMessage}
                  </span>
                )}
              </div>

              {/* SOLUTION FRAMES (CLICKABLE) */}
              {parsedRuntime.solutionFrames.length > 0 && (
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold text-mono-400 uppercase tracking-wider">
                    Error Location in Solution.java:
                  </span>
                  {parsedRuntime.solutionFrames.map((frame, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-rose-950/40 border border-rose-900 text-xs md:text-sm text-mono-200"
                    >
                      <span className="font-semibold text-rose-300">
                        Solution.java (Line {frame.line})
                      </span>
                      {onJumpToLine && (
                        <button
                          type="button"
                          onClick={() => onJumpToLine(frame.line)}
                          className="inline-flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 hover:underline"
                        >
                          <FileCode className="w-3.5 h-3.5" />
                          <span>Go to line {frame.line}</span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* FULL STACK TRACE */}
              {stackTrace && (
                <div className="flex flex-col gap-1 mt-1">
                  <span className="text-xs text-mono-500 font-semibold uppercase tracking-wider">
                    Full Stack Trace:
                  </span>
                  <pre className="p-3 rounded-xl bg-mono-950 border border-mono-800 text-mono-400 text-xs leading-relaxed overflow-x-auto max-h-48 whitespace-pre">
                    {stackTrace}
                  </pre>
                </div>
              )}
            </div>
          ) : (
            <pre className="p-3.5 rounded-xl bg-mono-950 border border-mono-800 text-rose-300 text-sm leading-relaxed overflow-x-auto whitespace-pre-wrap">
              {rawErrorMessage}
            </pre>
          )}
        </div>
      )}
    </div>
  );
};
