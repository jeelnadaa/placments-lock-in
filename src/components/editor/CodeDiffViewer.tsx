import React, { useState } from 'react';
import { diffLines, Change } from 'diff';
import { CodeVersion } from '../../types';
import { Columns, AlignJustify } from 'lucide-react';

interface CodeDiffViewerProps {
  versionA: CodeVersion;
  versionB: CodeVersion;
}

export const CodeDiffViewer: React.FC<CodeDiffViewerProps> = ({ versionA, versionB }) => {
  const [viewMode, setViewMode] = useState<'split' | 'unified'>('split');

  const diffResult: Change[] = diffLines(versionA.code, versionB.code);

  return (
    <div className="flex flex-col gap-6">
      {/* METADATA COMPARISON TABLE */}
      <div className="rounded-lg border border-mono-800 overflow-hidden bg-mono-900/60">
        <table className="w-full text-xs font-mono text-left">
          <thead className="bg-mono-850/80 border-b border-mono-800 text-mono-400">
            <tr>
              <th className="p-3 w-1/4">Metric</th>
              <th className="p-3 w-3/8 text-rose-300">
                v{versionA.versionNumber} {versionA.label ? `(${versionA.label})` : ''}
              </th>
              <th className="p-3 w-3/8 text-emerald-300">
                v{versionB.versionNumber} {versionB.label ? `(${versionB.label})` : ''}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-mono-800/60 text-mono-200">
            <tr>
              <td className="p-3 font-semibold text-mono-400">Time Complexity</td>
              <td className="p-3 font-mono text-mono-200">{versionA.timeComplexity}</td>
              <td className="p-3 font-mono text-mono-200">{versionB.timeComplexity}</td>
            </tr>
            <tr>
              <td className="p-3 font-semibold text-mono-400">Space Complexity</td>
              <td className="p-3 font-mono text-mono-200">{versionA.spaceComplexity}</td>
              <td className="p-3 font-mono text-mono-200">{versionB.spaceComplexity}</td>
            </tr>
            <tr>
              <td className="p-3 font-semibold text-mono-400 align-top">Remarks</td>
              <td className="p-3 font-sans text-mono-300 whitespace-pre-wrap">
                {versionA.remarks || <span className="text-mono-600 italic">None</span>}
              </td>
              <td className="p-3 font-sans text-mono-300 whitespace-pre-wrap">
                {versionB.remarks || <span className="text-mono-600 italic">None</span>}
              </td>
            </tr>
            <tr>
              <td className="p-3 font-semibold text-mono-400">Saved At</td>
              <td className="p-3 text-mono-400">
                {new Date(versionA.createdAt).toLocaleString()}
              </td>
              <td className="p-3 text-mono-400">
                {new Date(versionB.createdAt).toLocaleString()}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* DIFF CODE HEADER WITH VIEW TOGGLE */}
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-mono-200 flex items-center gap-2">
          <span>Source Code Diff</span>
          <span className="text-xs font-mono text-mono-500">
            (Comparing v{versionA.versionNumber} → v{versionB.versionNumber})
          </span>
        </h4>
        <div className="flex items-center gap-1 bg-mono-900 border border-mono-800 p-0.5 rounded-lg text-xs font-mono">
          <button
            type="button"
            onClick={() => setViewMode('split')}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded transition-colors ${
              viewMode === 'split' ? 'bg-mono-800 text-mono-100 font-semibold' : 'text-mono-400 hover:text-mono-200'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Split</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('unified')}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded transition-colors ${
              viewMode === 'unified' ? 'bg-mono-800 text-mono-100 font-semibold' : 'text-mono-400 hover:text-mono-200'
            }`}
          >
            <AlignJustify className="w-3.5 h-3.5" />
            <span>Unified</span>
          </button>
        </div>
      </div>

      {/* DIFF DISPLAY */}
      {viewMode === 'split' ? (
        <div className="grid grid-cols-2 gap-2 border border-mono-800 rounded-lg overflow-hidden bg-mono-950 font-mono text-xs shadow-inner">
          <div className="border-r border-mono-800 overflow-x-auto">
            <div className="bg-mono-900/90 px-3 py-1.5 border-b border-mono-800 text-mono-400 font-semibold text-[11px]">
              v{versionA.versionNumber} (Original)
            </div>
            <pre className="p-3 leading-relaxed text-mono-300">
              <code>
                {diffResult.map((part, i) => {
                  if (part.added) return null;
                  const bg = part.removed ? 'bg-rose-950/60 text-rose-200 block -mx-3 px-3' : '';
                  return (
                    <span key={i} className={bg}>
                      {part.value}
                    </span>
                  );
                })}
              </code>
            </pre>
          </div>
          <div className="overflow-x-auto">
            <div className="bg-mono-900/90 px-3 py-1.5 border-b border-mono-800 text-mono-400 font-semibold text-[11px]">
              v{versionB.versionNumber} (Target)
            </div>
            <pre className="p-3 leading-relaxed text-mono-300">
              <code>
                {diffResult.map((part, i) => {
                  if (part.removed) return null;
                  const bg = part.added ? 'bg-emerald-950/60 text-emerald-200 block -mx-3 px-3' : '';
                  return (
                    <span key={i} className={bg}>
                      {part.value}
                    </span>
                  );
                })}
              </code>
            </pre>
          </div>
        </div>
      ) : (
        <div className="border border-mono-800 rounded-lg overflow-x-auto bg-mono-950 font-mono text-xs shadow-inner">
          <div className="bg-mono-900/90 px-3 py-1.5 border-b border-mono-800 text-mono-400 font-semibold text-[11px]">
            Unified Diff
          </div>
          <pre className="p-3 leading-relaxed">
            <code>
              {diffResult.map((part, i) => {
                const prefix = part.added ? '+ ' : part.removed ? '- ' : '  ';
                const style = part.added
                  ? 'bg-emerald-950/50 text-emerald-200'
                  : part.removed
                  ? 'bg-rose-950/50 text-rose-200'
                  : 'text-mono-400';

                const lines = part.value.split('\n');
                // Remove trailing empty line if string ended with newline
                if (lines[lines.length - 1] === '') lines.pop();

                return (
                  <span key={i}>
                    {lines.map((line, lineIdx) => (
                      <span key={lineIdx} className={`block -mx-3 px-3 ${style}`}>
                        <span className="opacity-50 select-none mr-2 font-mono">{prefix}</span>
                        {line}
                      </span>
                    ))}
                  </span>
                );
              })}
            </code>
          </pre>
        </div>
      )}
    </div>
  );
};
