// src/components/pubgm/PUBGMTournamentContainer.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import PUBGMStandingsTable from './PUBGMStandingsTable';
import PUBGMMatchInput from './PUBGMMatchInput';
import { calculatePUBGMStandings, PUBGMTeam, PUBGMMatchResult } from '@/lib/pubgmCalculator';

interface PUBGMTournamentContainerProps {
  tournamentName: string;
  teams: PUBGMTeam[];
}

export default function PUBGMTournamentContainer({
  tournamentName,
  teams,
}: PUBGMTournamentContainerProps) {
  const [matches, setMatches] = useState<PUBGMMatchResult[]>([]);

  const standings = calculatePUBGMStandings(teams, matches);

  const handleAddMatch = (newMatch: PUBGMMatchResult) => {
    setMatches((prev) => [...prev, newMatch]);
  };

  const handleResetMatches = () => {
    setMatches([]);
  };

  return (
    <div className="relative min-h-screen bg-[#05070c] text-slate-100 selection:bg-amber-400 selection:text-black">
      {/* Background Ambient Layer */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/3 h-[600px] w-[600px] rounded-full bg-amber-500/10 blur-[160px]" />
        <div className="absolute top-1/2 -right-40 h-[500px] w-[500px] rounded-full bg-indigo-600/10 blur-[160px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        {/* Navigation Bar Top */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 font-mono text-xs font-bold text-slate-300 transition-all hover:border-amber-400/40 hover:bg-amber-400/10 hover:text-amber-400 active:scale-95"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            BERANDA
          </Link>

          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-500">
            KLASIM // PUBGM MODULE
          </span>
        </div>

        {/* Header Section */}
        <header className="flex flex-col justify-between gap-6 border-b border-white/10 pb-6 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-1 font-mono text-[11px] font-extrabold uppercase tracking-widest text-amber-400">
                <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                PMWC OFFICIAL POINT SYSTEM
              </span>
              <span className="font-mono text-xs font-semibold tracking-wider text-slate-400 uppercase">
                PUBG Mobile World Cup 2026
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
            RESET SELURUH MATCH
          </button>
        </header>

        {/* Match Timeline Log Tracker */}
        {matches.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto rounded-xl border border-white/10 bg-slate-950/80 p-3 backdrop-blur-md">
            <span className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-widest mr-2">
              COMPLETED MATCHES ({matches.length}):
            </span>
            {matches.map((m) => (
              <span
                key={m.matchId}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-xs font-bold text-amber-400"
              >
                <span>#{m.matchNumber}</span>
                <span className="text-slate-400">{m.mapName}</span>
              </span>
            ))}
          </div>
        )}

        {/* Equal Height Dashboard Layout */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-stretch">
          <div className="lg:col-span-7">
            <PUBGMStandingsTable standings={standings} />
          </div>
          <div className="lg:col-span-5">
            <PUBGMMatchInput
              teams={teams}
              onAddMatch={handleAddMatch}
              existingMatchesCount={matches.length}
            />
          </div>
        </div>
      </div>
    </div>
  );
}