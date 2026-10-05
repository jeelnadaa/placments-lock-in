import React from 'react';
import { LayoutDashboard, Calendar, List, Settings as SettingsIcon, Flame, ShieldCheck, FlaskConical, BookOpen } from 'lucide-react';
import { Settings } from '../../types';

export type NavigationTab = 'dashboard' | 'plan' | 'problems' | 'settings' | 'guide';

interface NavbarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  solvedCount: number;
  currentStreak: number;
  settings?: Settings;
  onClearTrackClick: () => void;
  onOpenSandbox?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  solvedCount,
  currentStreak,
  settings,
  onClearTrackClick,
  onOpenSandbox,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-mono-800 bg-mono-950/85 backdrop-blur-md">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-3 lg:gap-5">
        {/* LOGO & TITLE */}
        <div className="flex items-center gap-3 cursor-pointer shrink-0" onClick={() => onSelectTab('dashboard')}>
          <div className="w-8 h-8 rounded-lg bg-mono-100 text-mono-950 flex items-center justify-center font-black text-sm tracking-wider shadow-sm shrink-0">
            75
          </div>
          <div className="hidden lg:flex flex-col shrink-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight text-mono-100 whitespace-nowrap">BLIND 75 TRACKER</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-mono-800 text-mono-300 border border-mono-700 whitespace-nowrap">
                LOCKED-IN
              </span>
            </div>
            <span className="text-[11px] text-mono-400 font-mono whitespace-nowrap">15-Day Pattern Grinder</span>
          </div>
        </div>

        {/* NAVIGATION TABS — scrollable, can shrink */}
        <nav className="flex items-center gap-1 bg-mono-900 border border-mono-800 p-1 rounded-xl text-xs font-medium min-w-0 overflow-x-auto scrollbar-thin">
          <button
            type="button"
            onClick={() => onSelectTab('dashboard')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap shrink-0 ${
              currentTab === 'dashboard'
                ? 'bg-mono-100 text-mono-950 font-semibold shadow'
                : 'text-mono-400 hover:text-mono-200 hover:bg-mono-800/50'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5 shrink-0" />
            <span>Dashboard</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('plan')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap shrink-0 ${
              currentTab === 'plan'
                ? 'bg-mono-100 text-mono-950 font-semibold shadow'
                : 'text-mono-400 hover:text-mono-200 hover:bg-mono-800/50'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 shrink-0" />
            <span>15-Day Plan</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('problems')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap shrink-0 ${
              currentTab === 'problems'
                ? 'bg-mono-100 text-mono-950 font-semibold shadow'
                : 'text-mono-400 hover:text-mono-200 hover:bg-mono-800/50'
            }`}
          >
            <List className="w-3.5 h-3.5 shrink-0" />
            <span>All Problems</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('settings')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap shrink-0 ${
              currentTab === 'settings'
                ? 'bg-mono-100 text-mono-950 font-semibold shadow'
                : 'text-mono-400 hover:text-mono-200 hover:bg-mono-800/50'
            }`}
          >
            <SettingsIcon className="w-3.5 h-3.5 shrink-0" />
            <span>Settings</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('guide')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap shrink-0 ${
              currentTab === 'guide'
                ? 'bg-mono-100 text-mono-950 font-semibold shadow'
                : 'text-mono-400 hover:text-mono-200 hover:bg-mono-800/50'
            }`}
            title="Read This: Guide on running Java code, external links, and study workflow"
          >
            <BookOpen className="w-3.5 h-3.5 shrink-0" />
            <span>Read This</span>
          </button>

          {onOpenSandbox && (
            <button
              type="button"
              onClick={onOpenSandbox}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/40 border border-emerald-800/60 font-semibold transition-all whitespace-nowrap shrink-0 shadow-sm"
              title="Open Judge Diagnostics Sandbox (#0) to test Java execution, stdout, and error handling"
            >
              <FlaskConical className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
              <span className="whitespace-nowrap font-bold">🧪 Judge Sandbox</span>
            </button>
          )}
        </nav>

        {/* SPACER — pushes stats to right edge */}
        <div className="flex-1 min-w-0" />

        {/* STATS & QUICK ACTIONS — always visible, never clipped */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Spoiler Safe status indicator */}
          <div
            className={`hidden xl:flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono border shrink-0 whitespace-nowrap ${
              settings?.spoilerSafeMode !== false
                ? 'bg-mono-900 border-mono-700/60 text-mono-300'
                : 'bg-amber-950/40 border-amber-800 text-amber-300'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-mono-400 shrink-0" />
            <span>{settings?.spoilerSafeMode !== false ? 'Spoiler-Safe' : 'Spoilers Visible'}</span>
          </div>

          {/* Current Streak */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-mono-900 border border-mono-800 text-xs font-mono shrink-0 whitespace-nowrap">
            <Flame className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="font-semibold text-mono-100">{currentStreak}</span>
            <span className="text-mono-400">d streak</span>
          </div>

          {/* Solved Progress Counter */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-mono-900 border border-mono-800 text-xs font-mono shrink-0 whitespace-nowrap">
            <span className="font-semibold text-mono-100">{solvedCount}</span>
            <span className="text-mono-500">/</span>
            <span className="text-mono-400">75</span>
          </div>

          {/* Reset Track — always visible */}
          <button
            type="button"
            onClick={onClearTrackClick}
            className="inline-flex items-center text-xs font-mono text-mono-400 hover:text-rose-400 border border-transparent hover:border-rose-900/60 px-2 py-1 rounded transition-colors shrink-0 whitespace-nowrap"
            title="Reset all study progress and saved code"
          >
            Reset Track
          </button>
        </div>
      </div>
    </header>
  );
};
