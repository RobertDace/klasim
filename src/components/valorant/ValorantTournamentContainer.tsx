// src/components/valorant/ValorantTournamentContainer.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import ValorantStandingsTable from './ValorantStandingsTable';
import ValorantMatchSimulator from './ValorantMatchSimulator';
import {
  calculateValorantStandings,
  ValorantTeam,
  ValorantMatchData,
} from '@/lib/valorantCalculator';

interface ValorantTournamentContainerProps {
  tournamentName: string;
  teams: ValorantTeam[];
  initialMatches: ValorantMatchData[];
}

export default function ValorantTournamentContainer({
  tournamentName,
  teams,
  initialMatches,
}: ValorantTournamentContainerProps) {
  const [matches, setMatches] = useState<ValorantMatchData[]>(initialMatches);
  const [activeGroup, setActiveGroup] = useState<'A' | 'B'>('A');

  const standings = calculateValorantStandings(teams, matches, activeGroup);
  const currentGroupMatches = matches.filter((m) => m.group === activeGroup);

  const handleScoreChange = (
    matchId: string,
    homeMaps: number,
    awayMaps: number,
    homeRounds: number,
    awayRounds: number
  ) => {
    setMatches((prev) =>
      prev.map((m) =>
        m.id === matchId
          ? { ...m, homeMaps, awayMaps, homeRounds, awayRounds, isCompleted: true }
          : m
      )
    );
  };

  const handleResetMatches = () => {
    setMatches(initialMatches);
  };

  return (
    <div className="relative min-h-screen bg-[#05070c] text-slate-100 selection:bg-cyan-400 selection:text-black">
      {/* Background Ambient Layer */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/3 h-[600px] w-[600px] rounded-full bg-cyan-500/10 blur-[160px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        {/* Navigation Top */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 font-mono text-xs font-bold text-slate-300 transition-all hover:border-cyan-400/40 hover:bg-cyan-400/10 hover:text-cyan-400 active:scale-95"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            BERANDA
          </Link>

          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-500">
            KLASIM // VALORANT MODULE
          </span>
        </div>

        {/* Header */}
        <header className="flex flex-col justify-between gap-6 border-b border-white/10 pb-6 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-md border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 font-mono text-[11px] font-extrabold uppercase tracking-widest text-cyan-400">
                <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                VCT OFFICIAL RULESET
              </span>
              <span className="font-mono text-xs font-semibold tracking-wider text-slate-400 uppercase">
                VCT Pacific 2026
              </span>
            </div>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-5xl uppercase leading-none">
              {tournamentName}
            </h1>
          </div>

          <button
            onClick={handleResetMatches}
            className="rounded-xl border border-rose-500/20 bg-rose-500/5 px-5 py-3 font-mono text-xs font-bold uppercase tracking-wider text-rose-300 transition-all hover:bg-rose-500/15 active:scale-95"
          >
            RESET SIMULASI
          </button>
        </header>

        {/* Group Selector Toolbar */}
        <div className="flex gap-2 rounded-xl border border-white/10 bg-slate-950/80 p-1.5 backdrop-blur-md max-w-md">
          <button
            onClick={() => setActiveGroup('A')}
            className={`flex-1 rounded-lg py-2 font-mono text-xs font-bold transition-all ${
              activeGroup === 'A'
                ? 'bg-cyan-400 text-black shadow-[0_0_15px_rgba(34,211,238,0.3)]'
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            GROUP A (ALPHA)
          </button>
          <button
            onClick={() => setActiveGroup('B')}
            className={`flex-1 rounded-lg py-2 font-mono text-xs font-bold transition-all ${
              activeGroup === 'B'
                ? 'bg-cyan-400 text-black shadow-[0_0_15px_rgba(34,211,238,0.3)]'
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            GROUP B (OMEGA)
          </button>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-stretch">
          <div className="lg:col-span-7">
            <ValorantStandingsTable standings={standings} groupName={activeGroup} />
          </div>
          <div className="lg:col-span-5">
            <ValorantMatchSimulator
              matches={currentGroupMatches}
              teams={teams}
              onScoreChange={handleScoreChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}