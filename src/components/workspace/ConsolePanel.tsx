import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  BookmarkPlus,
  Save,
  Maximize2,
  Minimize2,
  AlertCircle,
} from 'lucide-react';
import { CustomCase, ProblemMeta, RunResponse, SubmitResponse } from '../../types';
import { ErrorDisplay } from './ErrorDisplay';
import { formatParamValue, parseAndValidateParam } from '../../utils/testcaseParser';

interface ConsolePanelProps {
  meta?: ProblemMeta;
  activeConsoleTab: 'testcase' | 'result';
  setActiveConsoleTab: (tab: 'testcase' | 'result') => void;
  sampleCases: { rawInputs?: Record<string, string>; inputs?: Record<string, unknown>; expected?: unknown }[];
  customCases: CustomCase[];
  onAddCustomCase: (inputs: Record<string, string>) => void;
  onDeleteCustomCase: (id: string) => void;
  onUpdateSampleCase: (index: number, paramName: string, value: string) => void;
  onUpdateCustomCase?: (id: string, paramName: string, value: string) => void;
  runResult: RunResponse | null;
  submitResult: SubmitResponse | null;
  isRunning: boolean;
  onSaveAsVersionClick: () => void;
  onAddFailingToCustomCases: (failingInput: Record<string, unknown> | string) => void;
  onJumpToLine?: (line: number) => void;
  isMaximized?: boolean;
  onToggleMaximize?: () => void;
}

export const ConsolePanel: React.FC<ConsolePanelProps> = ({
  meta,
  activeConsoleTab,
  setActiveConsoleTab,
  sampleCases,
  customCases,
  onAddCustomCase,
  onDeleteCustomCase,
  onUpdateSampleCase,
  onUpdateCustomCase,
  runResult,
  submitResult,
  isRunning,
  onSaveAsVersionClick,
  onAddFailingToCustomCases,
  onJumpToLine,
  isMaximized = false,
  onToggleMaximize,
}) => {
  const [selectedCaseIdx, setSelectedCaseIdx] = useState(0);
  const [selectedResultCaseIdx, setSelectedResultCaseIdx] = useState(0);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Auto-expand console when execution starts or results arrive so errors are never hidden
  useEffect(() => {
    if (runResult || submitResult || isRunning) {
      setIsCollapsed(false);
    }
  }, [runResult, submitResult, isRunning]);

  // Total cases count (samples + custom)
  const totalCasesCount = sampleCases.length + customCases.length;

  // Reset selected case when meta (problem) changes
  useEffect(() => {
    setSelectedCaseIdx(0);
  }, [meta?.id]);

  // Keep selectedCaseIdx within valid bounds
  useEffect(() => {
    if (totalCasesCount > 0 && selectedCaseIdx >= totalCasesCount) {
      setSelectedCaseIdx(Math.max(0, totalCasesCount - 1));
    }
  }, [totalCasesCount, selectedCaseIdx]);

  const getParamValue = (caseIdx: number, paramName: string): string => {
    if (caseIdx < sampleCases.length) {
      const sc = sampleCases[caseIdx];
      if (!sc) return '';
      if (sc.rawInputs && sc.rawInputs[paramName] !== undefined) {
        return sc.rawInputs[paramName];
      }
      if (sc.inputs && sc.inputs[paramName] !== undefined) {
        return formatParamValue(sc.inputs[paramName]);
      }
      return '';
    } else {
      const customIdx = caseIdx - sampleCases.length;
      const cc = customCases[customIdx];
      return cc?.inputs[paramName] ?? '';
    }
  };

  const handleAddNewCase = () => {
    if (!meta) return;
    const initialInputs: Record<string, string> = {};
    for (const p of meta.params) {
      if (
        p.type.includes('[]') ||
        p.type === 'ListNode' ||
        p.type === 'TreeNode' ||
        p.type === 'Node' ||
        p.type.startsWith('List<')
      ) {
        initialInputs[p.name] = '[]';
      } else if (p.type === 'int' || p.type === 'long') {
        initialInputs[p.name] = '0';
      } else if (p.type === 'boolean') {
        initialInputs[p.name] = 'true';
      } else {
        initialInputs[p.name] = '""';
      }
    }
    onAddCustomCase(initialInputs);
    setSelectedCaseIdx(totalCasesCount);
  };

  const getVerdictStyle = (v?: string) => {
    switch (v) {
      case 'Accepted':
        return 'text-emerald-400 bg-emerald-950/60 border-emerald-800/80';
      case 'Wrong Answer':
        return 'text-rose-400 bg-rose-950/60 border-rose-800/80';
      case 'Time Limit Exceeded':
        return 'text-amber-400 bg-amber-950/60 border-amber-800/80';
      case 'Compile Error':
        return 'text-purple-400 bg-purple-950/60 border-purple-800/80';
      default:
        return 'text-rose-400 bg-rose-950/60 border-rose-800/80';
    }
  };

  return (
    <div
      className={`flex flex-col border-t border-mono-800 bg-mono-950 font-mono text-xs shadow-xl overflow-hidden ${
        isCollapsed ? 'shrink-0' : 'h-full flex-1 min-h-0'
      }`}
    >
      {/* CONSOLE HEADER BAR */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-mono-800 bg-mono-900/90 select-none">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveConsoleTab('testcase')}
            className={`px-3 py-1 rounded font-medium transition-colors ${
              activeConsoleTab === 'testcase'
                ? 'bg-mono-800 text-mono-100 font-bold'
                : 'text-mono-400 hover:text-mono-200'
            }`}
          >
            Testcase
          </button>

          <button
            type="button"
            onClick={() => setActiveConsoleTab('result')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded font-medium transition-colors ${
              activeConsoleTab === 'result'
                ? 'bg-mono-800 text-mono-100 font-bold'
                : 'text-mono-400 hover:text-mono-200'
            }`}
          >
            <span>Test Result</span>
            {runResult && (
              <span
                className={`w-2 h-2 rounded-full ${
                  runResult.verdict === 'Accepted' ? 'bg-emerald-400' : 'bg-rose-400'
                }`}
              />
            )}
            {submitResult && (
              <span
                className={`w-2 h-2 rounded-full ${
                  submitResult.verdict === 'Accepted' ? 'bg-emerald-400' : 'bg-rose-400'
                }`}
              />
            )}
          </button>
        </div>

        <div className="flex items-center gap-1">
          {onToggleMaximize && !isCollapsed && (
            <button
              type="button"
              onClick={onToggleMaximize}
              className="p-1 rounded hover:bg-mono-800 text-mono-400 hover:text-mono-200 transition-colors"
              title={isMaximized ? 'Restore height' : 'Expand testcase panel to full height'}
            >
              {isMaximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded hover:bg-mono-800 text-mono-400 hover:text-mono-200 transition-colors"
            title={isCollapsed ? 'Expand console' : 'Collapse console'}
          >
            {isCollapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <div className="p-4 flex-1 min-h-0 overflow-y-auto">
          {/* TAB 1: TESTCASE */}
          {activeConsoleTab === 'testcase' && (
            <div className="flex flex-col gap-3">
              {/* CASE CHIPS */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {sampleCases.map((_, idx) => (
                  <button
                    key={`sample-${idx}`}
                    type="button"
                    onClick={() => setSelectedCaseIdx(idx)}
                    className={`px-3 py-1 rounded-lg text-xs transition-colors shrink-0 ${
                      selectedCaseIdx === idx
                        ? 'bg-mono-800 text-mono-100 font-bold border border-mono-700'
                        : 'bg-mono-900 text-mono-400 border border-mono-800 hover:text-mono-200'
                    }`}
                  >
                    Case {idx + 1}
                  </button>
                ))}

                {customCases.map((cc, idx) => {
                  const globalIdx = sampleCases.length + idx;
                  return (
                    <div key={cc.id} className="inline-flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => setSelectedCaseIdx(globalIdx)}
                        className={`px-3 py-1 rounded-lg text-xs transition-colors ${
                          selectedCaseIdx === globalIdx
                            ? 'bg-mono-800 text-mono-100 font-bold border border-mono-700'
                            : 'bg-mono-900 text-mono-400 border border-mono-800 hover:text-mono-200'
                        }`}
                      >
                        Custom {idx + 1}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onDeleteCustomCase(cc.id);
                          setSelectedCaseIdx((prev) => {
                            if (prev >= globalIdx && prev > 0) return prev - 1;
                            return prev;
                          });
                        }}
                        className="p-1 rounded text-mono-500 hover:text-rose-400"
                        title="Delete custom case"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}

                <button
                  type="button"
                  onClick={handleAddNewCase}
                  className="p-1.5 rounded-lg bg-mono-900 hover:bg-mono-850 border border-mono-800 text-mono-400 hover:text-mono-200 transition-colors"
                  title="Add custom testcase"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* PARAMETER INPUTS */}
              {meta ? (
                <div className="flex flex-col gap-3 pt-1">
                  {meta.params.map((param) => {
                    const isCustom = selectedCaseIdx >= sampleCases.length;
                    const customIdx = selectedCaseIdx - sampleCases.length;
                    const customCase = isCustom ? customCases[customIdx] : null;

                    const val = getParamValue(selectedCaseIdx, param.name);
                    const validation = parseAndValidateParam(val, param.type);
                    const hasError = val.trim() !== '' && !validation.valid;

                    return (
                      <div key={param.name} className="flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                          <label className="text-mono-400 font-medium text-[11px] flex items-center gap-1.5">
                            <span className="text-mono-200 font-semibold">{param.name} =</span>
                            <span className="text-mono-500 font-normal">({param.type})</span>
                          </label>
                          {hasError && (
                            <span className="text-[11px] text-rose-400 font-mono flex items-center gap-1">
                              <AlertCircle className="w-3 h-3 shrink-0" />
                              <span>{validation.error}</span>
                            </span>
                          )}
                        </div>
                        <input
                          type="text"
                          value={val}
                          onChange={(e) => {
                            if (isCustom && customCase) {
                              if (onUpdateCustomCase) {
                                onUpdateCustomCase(customCase.id, param.name, e.target.value);
                              } else {
                                customCase.inputs[param.name] = e.target.value;
                              }
                            } else {
                              onUpdateSampleCase(selectedCaseIdx, param.name, e.target.value);
                            }
                          }}
                          className={`bg-mono-900 border rounded-lg px-3 py-1.5 text-mono-100 focus:outline-none font-mono text-xs transition-colors ${
                            hasError
                              ? 'border-rose-700/80 focus:border-rose-500'
                              : 'border-mono-800 focus:border-mono-600'
                          }`}
                          placeholder={`e.g. ${
                            param.type.includes('[]') || param.type === 'ListNode'
                              ? '[1, 2, 3] or [1,2,3]'
                              : param.type === 'int'
                              ? '0'
                              : '""'
                          }`}
                        />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-mono-500 italic">No structured test parameters available for this problem.</p>
              )}
            </div>
          )}

          {/* TAB 2: TEST RESULT */}
          {activeConsoleTab === 'result' && (
            <div className="flex flex-col gap-3">
              {isRunning ? (
                <div className="flex items-center gap-2 text-mono-400 py-6 justify-center font-mono">
                  <Clock className="w-4 h-4 animate-spin text-mono-300" />
                  <span>Compiling and executing in sandbox...</span>
                </div>
              ) : submitResult ? (
                // SUBMIT RESULT DISPLAY
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between p-3.5 rounded-xl border bg-mono-900/60">
                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-0.5 rounded border font-bold ${getVerdictStyle(submitResult.verdict)}`}>
                        {submitResult.verdict}
                      </span>
                      <span className="text-mono-300 font-semibold">
                        {submitResult.passed} / {submitResult.total} testcases passed
                      </span>
                      {submitResult.runtimeMs > 0 && (
                        <span className="text-mono-400 font-mono">• Runtime: {submitResult.runtimeMs} ms</span>
                      )}
                    </div>

                    {submitResult.verdict === 'Accepted' && (
                      <button
                        type="button"
                        onClick={onSaveAsVersionClick}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-mono-100 text-mono-950 font-bold hover:bg-white transition-colors"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save as Version</span>
                      </button>
                    )}
                  </div>

                  {/* COMPILE ERROR (SUBMIT) */}
                  {(submitResult.verdict === 'Compile Error' || submitResult.compileError) && (
                    <ErrorDisplay
                      verdict="Compile Error"
                      compileError={submitResult.compileError || submitResult.error}
                      onJumpToLine={onJumpToLine}
                    />
                  )}

                  {/* RUNTIME ERROR (SUBMIT) */}
                  {submitResult.verdict === 'Runtime Error' && (
                    <ErrorDisplay
                      verdict="Runtime Error"
                      error={submitResult.failing?.error || submitResult.error}
                      stackTrace={submitResult.failing?.stackTrace}
                      failingInput={submitResult.failing?.input}
                      onJumpToLine={onJumpToLine}
                    />
                  )}

                  {/* FAILING TESTCASE (WRONG ANSWER / TLE) */}
                  {submitResult.failing &&
                    submitResult.verdict !== 'Compile Error' &&
                    submitResult.verdict !== 'Runtime Error' && (
                      <div className="p-4 rounded-xl bg-mono-900 border border-rose-900/60 flex flex-col gap-2.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-rose-300 flex items-center gap-1.5 text-sm">
                            <XCircle className="w-4 h-4 text-rose-400" />
                            <span>Failing Testcase #{submitResult.failing.index}</span>
                          </span>

                          <button
                            type="button"
                            onClick={() => onAddFailingToCustomCases(submitResult.failing!.input)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-mono-850 hover:bg-mono-800 border border-mono-700 text-mono-200 text-xs font-semibold"
                            title="Copy this failing test into your custom testcases"
                          >
                            <BookmarkPlus className="w-3.5 h-3.5 text-amber-400" />
                            <span>Add to my testcases</span>
                          </button>
                        </div>

                        <div className="flex flex-col gap-1">
                          <span className="text-mono-400 font-medium text-xs">Input:</span>
                          <pre className="p-3 rounded-lg bg-mono-950 border border-mono-800 overflow-x-auto text-mono-200 text-sm">
                            {typeof submitResult.failing.input === 'string'
                              ? submitResult.failing.input
                              : JSON.stringify(submitResult.failing.input, null, 2)}
                          </pre>
                        </div>

                        {submitResult.failing.actual !== undefined && (
                          <div className="flex flex-col gap-1">
                            <span className="text-rose-400 font-medium text-xs">Output:</span>
                            <pre className="p-3 rounded-lg bg-mono-950 border border-mono-800 overflow-x-auto text-rose-200 text-sm">
                              {submitResult.failing.actual}
                            </pre>
                          </div>
                        )}

                        {submitResult.failing.expected !== undefined && (
                          <div className="flex flex-col gap-1">
                            <span className="text-emerald-400 font-medium text-xs">Expected:</span>
                            <pre className="p-3 rounded-lg bg-mono-950 border border-mono-800 overflow-x-auto text-emerald-200 text-sm">
                              {submitResult.failing.expected}
                            </pre>
                          </div>
                        )}

                        {submitResult.failing.stdout && (
                          <div className="flex flex-col gap-1">
                            <span className="text-mono-400 font-medium text-xs">Stdout:</span>
                            <pre className="p-3 rounded-lg bg-mono-950 border border-mono-800 overflow-x-auto text-mono-300 text-sm">
                              {submitResult.failing.stdout}
                            </pre>
                          </div>
                        )}

                        {submitResult.failing.error && (
                          <div className="flex flex-col gap-1">
                            <span className="text-rose-400 font-medium text-xs">Error:</span>
                            <pre className="p-3 rounded-lg bg-mono-950 border border-rose-900/60 overflow-x-auto text-rose-300 text-sm">
                              {submitResult.failing.error}
                            </pre>
                          </div>
                        )}
                      </div>
                    )}

                  {submitResult.error &&
                    !submitResult.failing &&
                    submitResult.verdict !== 'Compile Error' &&
                    submitResult.verdict !== 'Runtime Error' && (
                      <div className="p-4 rounded-xl bg-mono-900 border border-rose-900/60 text-rose-300 whitespace-pre-wrap text-sm font-mono">
                        {submitResult.error}
                      </div>
                    )}
                </div>
              ) : runResult ? (
                // RUN RESULT DISPLAY
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 p-3.5 rounded-xl border bg-mono-900/60">
                    <span className={`px-2.5 py-0.5 rounded border font-bold text-sm ${getVerdictStyle(runResult.verdict)}`}>
                      {runResult.verdict}
                    </span>
                    <span className="text-mono-300 text-sm">Runtime: {runResult.runtimeMs} ms</span>
                  </div>

                  {/* COMPILE ERROR (RUN) */}
                  {(runResult.verdict === 'Compile Error' ||
                    runResult.compileError ||
                    (runResult.error && (!runResult.results || runResult.results.length === 0))) && (
                    <ErrorDisplay
                      verdict="Compile Error"
                      compileError={runResult.compileError || runResult.error}
                      onJumpToLine={onJumpToLine}
                    />
                  )}

                  {/* RUNTIME ERROR BEFORE TESTS (RUN) */}
                  {runResult.verdict === 'Runtime Error' && (!runResult.results || runResult.results.length === 0) && (
                    <ErrorDisplay
                      verdict="Runtime Error"
                      error={runResult.error}
                      onJumpToLine={onJumpToLine}
                    />
                  )}

                  {runResult.results && runResult.results.length > 0 && (
                    <>
                      {/* Case selector */}
                      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                        {runResult.results.map((r, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setSelectedResultCaseIdx(idx)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors shrink-0 ${
                              selectedResultCaseIdx === idx
                                ? 'bg-mono-800 text-mono-100 font-bold border border-mono-700'
                                : 'bg-mono-900 text-mono-400 border border-mono-800 hover:text-mono-200'
                            }`}
                          >
                            <span>Case {idx + 1}</span>
                            {r.passed ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <XCircle className="w-3.5 h-3.5 text-rose-400" />
                            )}
                          </button>
                        ))}
                      </div>

                      {/* Selected result details */}
                      {(() => {
                        const cur = runResult.results[selectedResultCaseIdx];
                        if (!cur) return null;

                        return (
                          <div className="p-4 rounded-xl bg-mono-900 border border-mono-800 flex flex-col gap-3 text-sm">
                            <div className="flex flex-col gap-1">
                              <span className="text-mono-400 font-medium text-xs">Input:</span>
                              <pre className="p-3 rounded-lg bg-mono-950 border border-mono-800 overflow-x-auto text-mono-200 text-sm">
                                {JSON.stringify(cur.input, null, 2)}
                              </pre>
                            </div>

                            {cur.error ? (
                              <ErrorDisplay
                                verdict={
                                  cur.error.includes('Exception') || cur.error.includes('Error')
                                    ? 'Runtime Error'
                                    : 'Execution Error'
                                }
                                error={cur.error}
                                stackTrace={cur.stackTrace}
                                failingInput={cur.input}
                                onJumpToLine={onJumpToLine}
                              />
                            ) : (
                              <>
                                <div className="flex flex-col gap-1">
                                  <span className="text-mono-400 font-medium text-xs">Output:</span>
                                  <pre
                                    className={`p-3 rounded-lg bg-mono-950 border border-mono-800 overflow-x-auto text-sm ${
                                      cur.passed ? 'text-emerald-300' : 'text-rose-300'
                                    }`}
                                  >
                                    {cur.actual !== undefined ? JSON.stringify(cur.actual) : 'null'}
                                  </pre>
                                </div>

                                {cur.expected !== undefined && (
                                  <div className="flex flex-col gap-1">
                                    <span className="text-mono-400 font-medium text-xs">Expected:</span>
                                    <pre className="p-3 rounded-lg bg-mono-950 border border-mono-800 overflow-x-auto text-emerald-300 text-sm">
                                      {JSON.stringify(cur.expected)}
                                    </pre>
                                  </div>
                                )}
                              </>
                            )}

                            {cur.stdout && (
                              <div className="flex flex-col gap-1">
                                <span className="text-mono-400 font-medium text-xs">Stdout:</span>
                                <pre className="p-3 rounded-lg bg-mono-950 border border-mono-800 overflow-x-auto text-mono-300 text-sm">
                                  {cur.stdout}
                                </pre>
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </>
                  )}
                </div>
              ) : (
                <div className="p-8 text-center text-mono-400 font-mono text-sm">
                  Run or submit code to see test results.
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
