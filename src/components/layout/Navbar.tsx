import React from 'react';
import { LayoutDashboard, Calendar, List, Settings as SettingsIcon, Flame, ShieldCheck } from 'lucide-react';
import { Settings } from '../../types';

export type NavigationTab = 'dashboard' | 'plan' | 'problems' | 'settings';

interface NavbarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  solvedCount: number;
  currentStreak: number;
  settings?: Settings;
  onClearTrackClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  solvedCount,
  currentStreak,
  settings,
  onClearTrackClick,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-mono-800 bg-mono-950/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* LOGO & TITLE */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onSelectTab('dashboard')}>
          <div className="w-8 h-8 rounded-lg bg-mono-100 text-mono-950 flex items-center justify-center font-black text-sm tracking-wider shadow-sm">
            75
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight text-mono-100">BLIND 75 TRACKER</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-mono-800 text-mono-300 border border-mono-700">
                LOCKED-IN
              </span>
            </div>
            <span className="text-[11px] text-mono-400 font-mono">15-Day Pattern Grinder</span>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <nav className="flex items-center gap-1 bg-mono-900 border border-mono-800 p-1 rounded-xl text-xs font-medium">
          <button
            type="button"
            onClick={() => onSelectTab('dashboard')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              currentTab === 'dashboard'
                ? 'bg-mono-100 text-mono-950 font-semibold shadow'
                : 'text-mono-400 hover:text-mono-200 hover:bg-mono-800/50'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('plan')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              currentTab === 'plan'
                ? 'bg-mono-100 text-mono-950 font-semibold shadow'
                : 'text-mono-400 hover:text-mono-200 hover:bg-mono-800/50'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>15-Day Plan</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('problems')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              currentTab === 'problems'
                ? 'bg-mono-100 text-mono-950 font-semibold shadow'
                : 'text-mono-400 hover:text-mono-200 hover:bg-mono-800/50'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>All Problems</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('settings')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              currentTab === 'settings'
                ? 'bg-mono-100 text-mono-950 font-semibold shadow'
                : 'text-mono-400 hover:text-mono-200 hover:bg-mono-800/50'
            }`}
          >
            <SettingsIcon className="w-3.5 h-3.5" />
            <span>Settings</span>
          </button>
        </nav>

        {/* STATS & QUICK ACTIONS */}
        <div className="flex items-center gap-3">
          {/* Spoiler Safe status indicator */}
          <div
            className={`hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono border ${
              settings?.spoilerSafeMode !== false
                ? 'bg-mono-900 border-mono-700/60 text-mono-300'
                : 'bg-amber-950/40 border-amber-800 text-amber-300'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-mono-400" />
            <span>{settings?.spoilerSafeMode !== false ? 'Spoiler-Safe' : 'Spoilers Visible'}</span>
          </div>

          {/* Current Streak */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-mono-900 border border-mono-800 text-xs font-mono">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-semibold text-mono-100">{currentStreak}</span>
            <span className="text-mono-400">d streak</span>
          </div>

          {/* Solved Progress Counter */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-mono-900 border border-mono-800 text-xs font-mono">
            <span className="font-semibold text-mono-100">{solvedCount}</span>
            <span className="text-mono-500">/</span>
            <span className="text-mono-400">75</span>
          </div>

          {/* User Request: Option to clear track / reset progress */}
          <button
            type="button"
            onClick={onClearTrackClick}
            className="hidden md:inline-flex items-center text-xs font-mono text-mono-400 hover:text-rose-400 border border-transparent hover:border-rose-900/60 px-2 py-1 rounded transition-colors"
            title="Reset all study progress and saved code"
          >
            Reset Track
          </button>
        </div>
      </div>
    </header>
  );
};
