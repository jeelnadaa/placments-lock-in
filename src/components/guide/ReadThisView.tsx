import React, { useState } from 'react';
import {
  BookOpen,
  Terminal,
  ExternalLink,
  ShieldCheck,
  Code2,
  Calendar,
  FlaskConical,
  Copy,
  Check,
  ArrowRight,
  Clock,
  Layers,
} from 'lucide-react';
import rawMarkdown from '../../../content/READ_THIS.md?raw';
import { NavigationTab } from '../layout/Navbar';

interface ReadThisViewProps {
  onNavigateTab: (tab: NavigationTab) => void;
  onOpenSandbox: () => void;
}

export const ReadThisView: React.FC<ReadThisViewProps> = ({
  onNavigateTab,
  onOpenSandbox,
}) => {
  const [viewMode, setViewMode] = useState<'formatted' | 'raw'>('formatted');
  const [copied, setCopied] = useState(false);

  const handleCopyRaw = () => {
    navigator.clipboard.writeText(rawMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-8 pb-20 max-w-5xl mx-auto">
      {/* HERO HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-mono-800 pb-6">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <span className="p-2 rounded-xl bg-mono-900 border border-mono-800 text-emerald-400">
              <BookOpen className="w-5 h-5" />
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-mono-800 text-mono-300 border border-mono-700">
              Documentation & User Guide
            </span>
          </div>
          <h1 className="text-2xl font-bold text-mono-100 tracking-tight">
            How Locked-In Works
          </h1>
          <p className="text-xs text-mono-400 mt-1">
            Zero-spoiler algorithm mastery, local Java execution, and 15-day interleaving study workflow.
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="inline-flex rounded-xl bg-mono-900 border border-mono-800 p-1 text-xs font-mono">
            <button
              type="button"
              onClick={() => setViewMode('formatted')}
              className={`px-3 py-1 rounded-lg transition-colors font-medium ${
                viewMode === 'formatted'
                  ? 'bg-mono-100 text-mono-950 font-bold shadow'
                  : 'text-mono-400 hover:text-mono-200'
              }`}
            >
              Formatted Guide
            </button>
            <button
              type="button"
              onClick={() => setViewMode('raw')}
              className={`px-3 py-1 rounded-lg transition-colors font-medium ${
                viewMode === 'raw'
                  ? 'bg-mono-100 text-mono-950 font-bold shadow'
                  : 'text-mono-400 hover:text-mono-200'
              }`}
            >
              Raw Markdown (.md)
            </button>
          </div>

          {viewMode === 'raw' && (
            <button
              type="button"
              onClick={handleCopyRaw}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-mono-900 border border-mono-800 text-xs font-mono text-mono-300 hover:text-white hover:border-mono-700 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {viewMode === 'raw' ? (
        /* RAW MARKDOWN VIEW */
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs font-mono text-mono-400 px-1">
            <span>content/READ_THIS.md</span>
            <span>{rawMarkdown.split('\n').length} lines</span>
          </div>
          <div className="rounded-2xl bg-mono-900 border border-mono-800 p-6 overflow-x-auto shadow-xl">
            <pre className="text-xs font-mono text-mono-200 leading-relaxed whitespace-pre-wrap selection:bg-mono-700">
              {rawMarkdown}
            </pre>
          </div>
        </div>
      ) : (
        /* FORMATTED INTERACTIVE GUIDE */
        <div className="flex flex-col gap-8">
          {/* QUICK SUMMARY CALLOUT */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-mono-900/90 border border-mono-800 shadow-md flex flex-col gap-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs font-mono uppercase tracking-wider">
                <Terminal className="w-4 h-4" />
                <span>1. Run Java Code Locally</span>
              </div>
              <p className="text-xs text-mono-300 leading-relaxed">
                Write code in the built-in IDE. Run against sample test cases or submit to the local Java judge for real runtime execution and verdicts.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-mono-900/90 border border-mono-800 shadow-md flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sky-400 font-bold text-xs font-mono uppercase tracking-wider">
                <ExternalLink className="w-4 h-4" />
                <span>2. Or Solve Externally</span>
              </div>
              <p className="text-xs text-mono-300 leading-relaxed">
                Prefer LeetCode or NeetCode? Click direct problem links to practice anywhere, then log versions and track your streak here.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-mono-900/90 border border-mono-800 shadow-md flex flex-col gap-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs font-mono uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>3. Zero-Spoiler Safety</span>
              </div>
              <p className="text-xs text-mono-300 leading-relaxed">
                Topics and sequential hints stay strictly obscured with zero DOM leakage to protect your authentic problem-solving instincts.
              </p>
            </div>
          </div>

          {/* SECTION: TWO WAYS TO PRACTICE */}
          <section className="flex flex-col gap-4">
            <h2 className="text-lg font-bold text-mono-100 flex items-center gap-2">
              <Code2 className="w-5 h-5 text-mono-300" />
              <span>Two Ways to Practice Each Problem</span>
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Option 1 Card */}
              <div className="p-6 rounded-2xl bg-mono-900 border border-mono-800 shadow-xl flex flex-col justify-between gap-4">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      Option 1 (Recommended)
                    </span>
                    <span className="text-xs font-mono text-mono-400">Integrated IDE</span>
                  </div>

                  <h3 className="text-base font-bold text-mono-100">
                    Run & Judge Java Code Locally
                  </h3>

                  <p className="text-xs text-mono-300 leading-relaxed">
                    You don&apos;t need to switch between tabs or leave the application:
                  </p>

                  <ul className="flex flex-col gap-2 text-xs text-mono-300 list-disc pl-4 leading-relaxed">
                    <li>
                      <span className="font-semibold text-mono-100">Run Mode:</span> Test your code against sample cases or custom testcases with <kbd className="px-1.5 py-0.5 rounded bg-mono-800 border border-mono-700 text-mono-200 font-mono text-[10px]">Ctrl + &apos;</kbd>.
                    </li>
                    <li>
                      <span className="font-semibold text-mono-100">Submit Mode:</span> Execute against comprehensive hidden judge testcases with <kbd className="px-1.5 py-0.5 rounded bg-mono-800 border border-mono-700 text-mono-200 font-mono text-[10px]">Ctrl + Enter</kbd>.
                    </li>
                    <li>
                      <span className="font-semibold text-mono-100">Instant Verdicts:</span> Get immediate feedback on <span className="text-emerald-400 font-medium">Accepted</span>, <span className="text-rose-400 font-medium">Wrong Answer</span>, <span className="text-amber-400 font-medium">Time Limit Exceeded</span>, or compile/runtime errors.
                    </li>
                    <li>
                      <span className="font-semibold text-mono-100">Java Diagnostics:</span> Live AST and token linter catches scoping errors, semicolon lapses, and <code className="text-amber-300">==</code> vs <code className="text-emerald-300">.equals()</code> as you type.
                    </li>
                  </ul>
                </div>

                <div className="pt-2 border-t border-mono-800/80">
                  <button
                    type="button"
                    onClick={onOpenSandbox}
                    className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-emerald-400 hover:text-emerald-300 bg-emerald-950/40 hover:bg-emerald-950/60 border border-emerald-800/60 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <FlaskConical className="w-3.5 h-3.5" />
                    <span>Try the Judge Sandbox (#0)</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Option 2 Card */}
              <div className="p-6 rounded-2xl bg-mono-900 border border-mono-800 shadow-xl flex flex-col justify-between gap-4">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-sky-500/15 text-sky-400 border border-sky-500/30">
                      Option 2
                    </span>
                    <span className="text-xs font-mono text-mono-400">External Platforms</span>
                  </div>

                  <h3 className="text-base font-bold text-mono-100">
                    Solve on LeetCode or NeetCode
                  </h3>

                  <p className="text-xs text-mono-300 leading-relaxed">
                    If you prefer writing in Python, C++, Go, or solving directly on LeetCode:
                  </p>

                  <ul className="flex flex-col gap-2 text-xs text-mono-300 list-disc pl-4 leading-relaxed">
                    <li>
                      <span className="font-semibold text-mono-100">Direct Problem Links:</span> Every problem card includes 1-click links to the official <span className="text-mono-100 font-medium">LeetCode</span> problem statement and <span className="text-mono-100 font-medium">NeetCode</span> video walk-through.
                    </li>
                    <li>
                      <span className="font-semibold text-mono-100">Log & Version:</span> Paste your final code in the editor to create immutable versions (<code className="text-mono-300">v1</code>, <code className="text-mono-300">v2</code>) with Big-O time and space complexities.
                    </li>
                    <li>
                      <span className="font-semibold text-mono-100">Streak & Status:</span> Use the status dropdown on the card to mark it as <span className="text-emerald-400 font-medium">Solved</span> or <span className="text-amber-400 font-medium">Needs Revision</span> to maintain your 15-day streak.
                    </li>
                    <li>
                      <span className="font-semibold text-mono-100">Private Notes:</span> Add per-problem notes and reflections that persist safely in your browser.
                    </li>
                  </ul>
                </div>

                <div className="pt-2 border-t border-mono-800/80">
                  <button
                    type="button"
                    onClick={() => onNavigateTab('problems')}
                    className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-mono-300 hover:text-white bg-mono-850 hover:bg-mono-800 border border-mono-700/80 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Browse All 75 Problems</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION: ZERO-SPOILER ARCHITECTURE */}
          <section className="p-6 rounded-2xl bg-mono-900 border border-mono-800 shadow-xl flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              <h2 className="text-base font-bold text-mono-100">
                The Strict Zero-Spoiler Rulebook
              </h2>
            </div>

            <p className="text-xs text-mono-300 leading-relaxed">
              In real technical interviews, no one announces what pattern a question uses. To build genuine intuition:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-4 rounded-xl bg-mono-850 border border-mono-800 flex flex-col gap-1.5">
                <span className="text-xs font-mono font-bold text-mono-100">1. Locked Topics</span>
                <p className="text-[11px] text-mono-400 leading-relaxed">
                  Topic names (e.g., &quot;Two Pointers&quot;, &quot;Dynamic Programming&quot;) do not exist in the DOM until explicitly unlocked.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-mono-850 border border-mono-800 flex flex-col gap-1.5">
                <span className="text-xs font-mono font-bold text-mono-100">2. Sequential Hints</span>
                <p className="text-[11px] text-mono-400 leading-relaxed">
                  Hints unlock one by one (1 → 2 → 3). You cannot jump straight to the algorithm answer without reading earlier nudges.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-mono-850 border border-mono-800 flex flex-col gap-1.5">
                <span className="text-xs font-mono font-bold text-mono-100">3. Global Re-Hide</span>
                <p className="text-[11px] text-mono-400 leading-relaxed">
                  Want to practice previous problems with fresh eyes? Re-hide all spoilers with a single click in Settings or Navbar.
                </p>
              </div>
            </div>
          </section>

          {/* SECTION: 15-DAY INTERLEAVING STUDY PLAN */}
          <section className="p-6 rounded-2xl bg-mono-900 border border-mono-800 shadow-xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-mono-200" />
                <h2 className="text-base font-bold text-mono-100">
                  15-Day Interleaving Schedule
                </h2>
              </div>
              <button
                type="button"
                onClick={() => onNavigateTab('plan')}
                className="inline-flex items-center gap-1 text-xs font-mono text-mono-300 hover:text-white"
              >
                <span>Go to Plan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-xs text-mono-300 leading-relaxed">
              Standard study guides group all 10 Array problems together, then all 10 Tree problems together. That causes the illusion of mastery (blocked practice).
              Instead, **Locked-In interleaves 5 problems per day from 5 completely different topic categories** every single day:
            </p>

            <div className="p-4 rounded-xl bg-mono-850 border border-mono-800 text-xs font-mono text-mono-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-mono-400" />
                <span>Remembers where you left off across tabs and browser restarts.</span>
              </div>
              <span className="text-mono-400 font-bold">15 Days • 5 Problems/Day = 75 Problems</span>
            </div>
          </section>

          {/* BOTTOM QUICK ACTIONS */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-mono-800">
            <div className="text-xs text-mono-400 font-mono">
              Ready to lock in? Pick where to start:
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                type="button"
                onClick={() => onNavigateTab('dashboard')}
                className="px-4 py-2 rounded-xl text-xs font-mono font-medium text-mono-300 hover:text-white bg-mono-900 hover:bg-mono-850 border border-mono-800 transition-colors"
              >
                Dashboard
              </button>

              <button
                type="button"
                onClick={onOpenSandbox}
                className="px-4 py-2 rounded-xl text-xs font-mono font-semibold text-emerald-400 bg-emerald-950/40 hover:bg-emerald-950/70 border border-emerald-800/60 transition-colors"
              >
                🧪 Judge Sandbox
              </button>

              <button
                type="button"
                onClick={() => onNavigateTab('plan')}
                className="px-4 py-2 rounded-xl text-xs font-mono font-bold text-mono-950 bg-mono-100 hover:bg-white transition-colors shadow"
              >
                Start 15-Day Plan →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
