// src/components/pubgm/PUBGMTournamentContainer.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import PUBGMStandingsTable from './PUBGMStandingsTable';
import PUBGMMatchInput from './PUBGMMatchInput';
import PUBGMShareCardModal from './PUBGMShareCardModal';
import { calculatePUBGMStandings, PUBGMTeam, PUBGMMatchResult } from '@/lib/pubgmCalculator';
import { exportPubgmToExcel, exportPubgmToPdf } from '@/lib/exportUtils';

interface PUBGMTournamentContainerProps {
  tournamentName: string;
  teams: PUBGMTeam[];
}

export default function PUBGMTournamentContainer({
  tournamentName,
  teams,
}: PUBGMTournamentContainerProps) {
  const [matches, setMatches] = useState<PUBGMMatchResult[]>([]);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);

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
            KLASIM // BATTLE ROYALE MODULE
          </span>
        </div>

        {/* Header Section with Export & Card Actions */}
        <header className="flex flex-col justify-between gap-6 border-b border-white/10 pb-6 lg:flex-row lg:items-center">
          <div>
            <span className="font-mono text-xs font-semibold tracking-wider text-slate-400 uppercase">
              PUBG Mobile World Cup Ruleset
            </span>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-5xl uppercase leading-none">
              {tournamentName}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Tombol Export Excel */}
            <button
              onClick={() => exportPubgmToExcel(tournamentName, standings, matches)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2 font-mono text-xs font-bold text-emerald-400 transition-all hover:bg-emerald-500/20 active:scale-95"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              EXPORT EXCEL
            </button>

            {/* Tombol Export PDF */}
            <button
              onClick={() => exportPubgmToPdf(tournamentName, standings)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3.5 py-2 font-mono text-xs font-bold text-rose-400 transition-all hover:bg-rose-500/20 active:scale-95"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              EXPORT PDF
            </button>

            {/* Tombol Kartu Grafis (PNG) */}
            <button
              onClick={() => setIsCardModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-sky-400/40 bg-sky-400/10 px-3.5 py-2 font-mono text-xs font-bold text-sky-400 transition-all hover:bg-sky-400/20 active:scale-95"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              KARTU GRAFIS
            </button>

            {/* Tombol Reset */}
            <button
              onClick={handleResetMatches}
              className="rounded-lg border border-white/10 bg-white/5 px-3.5 py-2 font-mono text-xs font-bold text-slate-400 transition-all hover:bg-white/10 hover:text-white active:scale-95"
            >
              RESET
            </button>
          </div>
        </header>

        {/* Dashboard Grid Layout */}
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

      {/* Share Social Card Modal Dialog */}
      <PUBGMShareCardModal
        isOpen={isCardModalOpen}
        onClose={() => setIsCardModalOpen(false)}
        tournamentName={tournamentName}
        standings={standings}
      />
    </div>
  );
}