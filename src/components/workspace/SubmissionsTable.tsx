import React, { useState } from 'react';
import { Submission } from '../../types';
import { Clock, XCircle, ChevronRight, Save } from 'lucide-react';
import { Modal } from '../common/Modal';
import { CodeEditor } from '../editor/CodeEditor';

interface SubmissionsTableProps {
  submissions: Submission[];
  onSaveAsVersion: (code: string) => void;
}

export const SubmissionsTable: React.FC<SubmissionsTableProps> = ({ submissions, onSaveAsVersion }) => {
  const [selectedSub, setSelectedSub] = useState<Submission | null>(null);

  if (submissions.length === 0) {
    return (
      <div className="p-8 text-center text-mono-400 font-mono text-xs flex flex-col items-center justify-center gap-2">
        <Clock className="w-8 h-8 text-mono-600 mb-1" />
        <p className="font-semibold text-mono-300">No Submissions Yet</p>
        <p className="text-mono-500 max-w-xs">
          Click &quot;Submit&quot; to test your solution against all sample and hidden testcases.
        </p>
      </div>
    );
  }

  const sortedSubs = [...submissions].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const getVerdictStyle = (v: Submission['verdict']) => {
    switch (v) {
      case 'Accepted':
        return 'text-emerald-400 bg-emerald-950/50 border-emerald-800/60';
      case 'Wrong Answer':
        return 'text-rose-400 bg-rose-950/50 border-rose-800/60';
      case 'Time Limit Exceeded':
        return 'text-amber-400 bg-amber-950/50 border-amber-800/60';
      case 'Compile Error':
        return 'text-purple-400 bg-purple-950/50 border-purple-800/60';
      default:
        return 'text-rose-400 bg-rose-950/50 border-rose-800/60';
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-xl border border-mono-800 bg-mono-950 overflow-hidden divide-y divide-mono-800/60 font-mono text-xs">
        {sortedSubs.map((sub) => (
          <div
            key={sub.id}
            onClick={() => setSelectedSub(sub)}
            className="p-3.5 flex items-center justify-between gap-3 hover:bg-mono-900/60 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className={`px-2.5 py-0.5 rounded border font-semibold ${getVerdictStyle(sub.verdict)}`}>
                {sub.verdict}
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-bold bg-mono-800 text-amber-300 border border-mono-700">
                {sub.language || 'java'}
              </span>
              <span className="text-mono-400">
                {sub.passed}/{sub.total} passed
              </span>
              {sub.runtimeMs > 0 && (
                <span className="text-mono-500">• {sub.runtimeMs} ms</span>
              )}
            </div>

            <div className="flex items-center gap-2 text-mono-400">
              <span>{new Date(sub.createdAt).toLocaleDateString()} {new Date(sub.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              <ChevronRight className="w-4 h-4 text-mono-500" />
            </div>
          </div>
        ))}
      </div>

      {/* SUBMISSION DETAIL MODAL */}
      <Modal
        isOpen={Boolean(selectedSub)}
        onClose={() => setSelectedSub(null)}
        title="Submission Details"
        maxWidth="max-w-3xl"
      >
        {selectedSub && (
          <div className="flex flex-col gap-4 font-mono text-xs">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-mono-950 border border-mono-800">
              <div className="flex items-center gap-3">
                <span className={`px-2.5 py-0.5 rounded border font-semibold text-sm ${getVerdictStyle(selectedSub.verdict)}`}>
                  {selectedSub.verdict}
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-bold bg-mono-800 text-amber-300 border border-mono-700">
                  {selectedSub.language || 'java'}
                </span>
                <span className="text-mono-300 font-medium">
                  {selectedSub.passed} / {selectedSub.total} Testcases Passed
                </span>
                <span className="text-mono-400">
                  {selectedSub.runtimeMs} ms
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  onSaveAsVersion(selectedSub.code);
                  setSelectedSub(null);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-mono-100 text-mono-950 hover:bg-white font-medium transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save as Version</span>
              </button>
            </div>

            {/* Failing Testcase Details if not accepted */}
            {selectedSub.failing && (
              <div className="p-4 rounded-xl bg-mono-950 border border-rose-900/60 flex flex-col gap-2.5 text-xs font-mono">
                <div className="flex items-center gap-1.5 text-rose-300 font-bold">
                  <XCircle className="w-4 h-4 text-rose-400" />
                  <span>Failed on Testcase #{selectedSub.failing.index}</span>
                </div>

                <div className="flex flex-col gap-1 text-mono-300">
                  <span className="text-mono-500 font-semibold">Input:</span>
                  <pre className="p-2 rounded bg-mono-900 border border-mono-800 overflow-x-auto text-mono-200">
                    {typeof selectedSub.failing.input === 'string'
                      ? selectedSub.failing.input
                      : JSON.stringify(selectedSub.failing.input, null, 2)}
                  </pre>
                </div>

                {selectedSub.failing.actual !== undefined && (
                  <div className="flex flex-col gap-1 text-mono-300">
                    <span className="text-rose-400 font-semibold">Output:</span>
                    <pre className="p-2 rounded bg-mono-900 border border-mono-800 overflow-x-auto text-rose-200">
                      {selectedSub.failing.actual}
                    </pre>
                  </div>
                )}

                {selectedSub.failing.expected !== undefined && (
                  <div className="flex flex-col gap-1 text-mono-300">
                    <span className="text-emerald-400 font-semibold">Expected:</span>
                    <pre className="p-2 rounded bg-mono-900 border border-mono-800 overflow-x-auto text-emerald-200">
                      {selectedSub.failing.expected}
                    </pre>
                  </div>
                )}

                {selectedSub.failing.stdout && (
                  <div className="flex flex-col gap-1 text-mono-300">
                    <span className="text-mono-400 font-semibold">Stdout:</span>
                    <pre className="p-2 rounded bg-mono-900 border border-mono-800 overflow-x-auto text-mono-300">
                      {selectedSub.failing.stdout}
                    </pre>
                  </div>
                )}

                {selectedSub.failing.error && (
                  <div className="flex flex-col gap-1 text-mono-300">
                    <span className="text-rose-400 font-semibold">Error Message:</span>
                    <pre className="p-2 rounded bg-mono-900 border border-rose-900/60 overflow-x-auto text-rose-300">
                      {selectedSub.failing.error}
                    </pre>
                  </div>
                )}
              </div>
            )}

            {/* Code snapshot */}
            <div className="flex flex-col gap-1.5">
              <span className="text-mono-400 font-semibold">Submitted Code ({selectedSub.language || 'java'}):</span>
              <CodeEditor language={selectedSub.language || 'java'} value={selectedSub.code} readOnly minHeight="240px" />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
