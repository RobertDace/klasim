// src/components/mlbb/HeroFilters.tsx
'use client';

import { useRef, useEffect } from 'react';

interface HeroFiltersProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedRole: string;
  onRoleChange: (r: string) => void;
  selectedLane: string;
  onLaneChange: (l: string) => void;
  selectedTier: string;
  onTierChange: (t: string) => void;
  sortBy: string;
  onSortChange: (s: string) => void;
  viewMode: 'grid' | 'compact';
  onViewModeChange: (v: 'grid' | 'compact') => void;
  roleCounts: Record<string, number>;
  totalCount: number;
  filteredCount: number;
  onResetFilters: () => void;
}

const roles = [
  { id: 'all', label: 'SEMUA' },
  { id: 'Tank', label: 'TANK' },
  { id: 'Fighter', label: 'FIGHTER' },
  { id: 'Assassin', label: 'ASSASSIN' },
  { id: 'Mage', label: 'MAGE' },
  { id: 'Marksman', label: 'MARKSMAN' },
  { id: 'Support', label: 'SUPPORT' },
];

const lanes = [
  { id: 'all', label: 'Semua Jalur' },
  { id: 'EXP Lane', label: 'EXP Lane' },
  { id: 'Mid Lane', label: 'Mid Lane' },
  { id: 'Gold Lane', label: 'Gold Lane' },
  { id: 'Roam', label: 'Roamer' },
  { id: 'Jungling', label: 'Jungler' },
];

const tiers = [
  { id: 'all', label: 'Semua Tier' },
  { id: 'S+', label: 'Tier S+' },
  { id: 'S', label: 'Tier S' },
  { id: 'A', label: 'Tier A' },
  { id: 'B', label: 'Tier B' },
];

const sortOptions = [
  { id: 'name_asc', label: 'Nama (A - Z)' },
  { id: 'name_desc', label: 'Nama (Z - A)' },
  { id: 'win_rate_desc', label: 'Win Rate Tertinggi' },
  { id: 'ban_rate_desc', label: 'Ban Rate Tertinggi' },
  { id: 'pick_rate_desc', label: 'Pick Rate Terpopuler' },
  { id: 'difficulty_desc', label: 'Difficulty (Tersulit)' },
  { id: 'difficulty_asc', label: 'Difficulty (Termudah)' },
];

export default function HeroFilters({
  searchQuery,
  onSearchChange,
  selectedRole,
  onRoleChange,
  selectedLane,
  onLaneChange,
  selectedTier,
  onTierChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  roleCounts,
  totalCount,
  filteredCount,
  onResetFilters,
}: HeroFiltersProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut '/' to focus search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedRole !== 'all' ||
    selectedLane !== 'all' ||
    selectedTier !== 'all' ||
    sortBy !== 'name_asc';

  return (
    <div className="space-y-4 rounded-2xl border border-white/10 bg-[#070a12]/90 p-3.5 sm:p-5 backdrop-blur-xl shadow-xl">
      {/* 1. Top Controls: Search Bar & Sort & View Toggle */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search Bar with Tactical Icon & Shortcut indicator */}
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500 font-mono text-xs">
            <svg className="w-3.5 h-3.5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Cari nama hero, role, lane, atau spesialisasi... (Tekan '/' untuk fokus)"
            className="w-full rounded-xl border border-white/10 bg-slate-950/80 py-2.5 pl-9 pr-16 font-sans text-xs sm:text-sm text-white placeholder-slate-500 outline-none transition-all duration-200 focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
          />
          {searchQuery ? (
            <button
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 flex items-center gap-1 pr-3.5 font-mono text-xs text-slate-400 hover:text-white cursor-pointer"
            >
              <svg className="w-3 h-3 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
              <span>Hapus</span>
            </button>
          ) : (
            <span className="pointer-events-none absolute inset-y-0 right-0 hidden sm:flex items-center pr-3 font-mono text-[10px] text-slate-600">
              <kbd className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5"> / </kbd>
            </span>
          )}
        </div>

        {/* Secondary controls: Lane, Tier, Sort, View Toggle */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Lane Filter */}
          <select
            value={selectedLane}
            onChange={e => onLaneChange(e.target.value)}
            className="rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2 font-mono text-xs text-slate-200 outline-none hover:border-white/20 focus:border-amber-400 cursor-pointer"
          >
            {lanes.map(l => (
              <option key={l.id} value={l.id} className="bg-slate-900 text-slate-200">
                {l.label}
              </option>
            ))}
          </select>

          {/* Tier Filter */}
          <select
            value={selectedTier}
            onChange={e => onTierChange(e.target.value)}
            className="rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2 font-mono text-xs text-slate-200 outline-none hover:border-white/20 focus:border-amber-400 cursor-pointer"
          >
            {tiers.map(t => (
              <option key={t.id} value={t.id} className="bg-slate-900 text-slate-200">
                {t.label}
              </option>
            ))}
          </select>

          {/* Sort Selector */}
          <select
            value={sortBy}
            onChange={e => onSortChange(e.target.value)}
            className="rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2 font-mono text-xs text-slate-200 outline-none hover:border-white/20 focus:border-amber-400 cursor-pointer"
          >
            {sortOptions.map(s => (
              <option key={s.id} value={s.id} className="bg-slate-900 text-slate-200">
                {s.label}
              </option>
            ))}
          </select>

          {/* View Toggle (Grid vs Compact) */}
          <div className="flex items-center rounded-xl border border-white/10 bg-slate-950/80 p-0.5">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`rounded-lg px-2.5 py-1.5 font-mono text-xs transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-amber-400 text-black font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Tampilan Kartu Grid"
            >
              ⊞ GRID
            </button>
            <button
              onClick={() => onViewModeChange('compact')}
              className={`rounded-lg px-2.5 py-1.5 font-mono text-xs transition-colors cursor-pointer ${
                viewMode === 'compact'
                  ? 'bg-amber-400 text-black font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Tampilan Padat / List"
            >
              ☰ LIST
            </button>
          </div>
        </div>
      </div>

      {/* 2. Role Selector Bar */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-white/5">
        <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest mr-1 hidden sm:inline">
          ROLE:
        </span>
        {roles.map(r => {
          const isSelected = selectedRole === r.id;
          const count = r.id === 'all' ? totalCount : roleCounts[r.id] || 0;
          return (
            <button
              key={r.id}
              onClick={() => onRoleChange(r.id)}
              className={`group flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-mono text-xs uppercase transition-all duration-150 cursor-pointer ${
                isSelected
                  ? 'bg-amber-400 text-black font-black shadow-sm'
                  : 'border border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:bg-white/10'
              }`}
            >
              <span>{r.label}</span>
              <span
                className={`rounded px-1 text-[9px] font-bold ${
                  isSelected ? 'bg-black/20 text-black' : 'bg-black/40 text-slate-400 group-hover:text-slate-300'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}

        {/* Results Counter and Reset Filter */}
        <div className="ml-auto flex items-center gap-2 font-mono text-[11px]">
          <span className="text-slate-400">
            Menampilkan <strong className="text-amber-400 font-bold">{filteredCount}</strong> dari {totalCount} Hero
          </span>

          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 text-[10px] text-rose-300 hover:bg-rose-500/20 transition-colors cursor-pointer"
            >
              ↺ Reset Filter
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
