// src/components/tournament/TournamentContainer.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import StandingsTable from './StandingsTable';
import MatchSimulator from './MatchSimulator';
import PlayoffBracket from './PlayoffBracket';
import ShareModal from '@/components/common/ShareModal';
import { calculateMPLStandings, TeamData } from '@/lib/calculator';
import { exportStandingsToExcel } from '@/lib/exportUtils';
import { encodeMatchScoresToUrl, decodeUrlToMatchScores } from '@/lib/shareUtils';

interface TournamentContainerProps {
  tournamentName: string;
  teams: TeamData[];
  initialMatches: any[];
}

export default function TournamentContainer({
  tournamentName,
  teams,
  initialMatches,
}: TournamentContainerProps) {
  const searchParams = useSearchParams();
  const [matches, setMatches] = useState(initialMatches);
  const [viewMode, setViewMode] = useState<'ALL' | 'SEASON' | 'PLAYOFFS'>('ALL');
  const [resetKey, setResetKey] = useState(0);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Load URL query params saat halaman dibuka dari shared link
  useEffect(() => {
    const simParam = searchParams.get('sim');
    if (simParam) {
      const decodedScores = decodeUrlToMatchScores(simParam);
      setMatches((prev) =>
        prev.map((m) => {
          if (decodedScores[m.id]) {
            return {
              ...m,
              homeScore: decodedScores[m.id].homeScore,
              awayScore: decodedScores[m.id].awayScore,
              isCompleted: true,
            };
          }
          return m;
        })
      );
    }
  }, [searchParams]);

  const normalizedMatches = matches.map((m) => {
    const home = m.homeTeam || teams.find((t) => t.id === m.homeTeamId);
    const away = m.awayTeam || teams.find((t) => t.id === m.awayTeamId);

    return {
      ...m,
      homeTeam: home || { id: m.homeTeamId, name: m.homeTeamId, code: m.homeTeamId },
      awayTeam: away || { id: m.awayTeamId, name: m.awayTeamId, code: m.awayTeamId },
    };
  });

  const standings = calculateMPLStandings(teams, normalizedMatches);

  const handleScoreChange = (matchId: string, homeScore: number, awayScore: number) => {
    setMatches((prev) =>
      prev.map((m) =>
        m.id === matchId ? { ...m, homeScore, awayScore, isCompleted: true } : m
      )
    );
  };

  const handleResetToDefault = () => {
    setMatches(initialMatches);
    setResetKey((prev) => prev + 1);
  };

  const handleClearAllScores = () => {
    setMatches((prev) =>
      prev.map((m) => ({
        ...m,
        homeScore: 0,
        awayScore: 0,
        isCompleted: false,
      }))
    );
    setResetKey((prev) => prev + 1);
  };

  // Generate Current Share URL
  const currentOrigin =
    typeof window !== 'undefined'
      ? window.location.origin + window.location.pathname
      : '';
  const encodedQuery = encodeMatchScoresToUrl(matches);
  const shareUrl = encodedQuery ? `${currentOrigin}?sim=${encodedQuery}` : currentOrigin;

  return (
    <div className="relative min-h-screen bg-[#05070c] text-slate-100 selection:bg-amber-400 selection:text-black">
      {/* Background Ambient Layer */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/3 h-[600px] w-[600px] rounded-full bg-amber-500/10 blur-[160px]" />
        <div className="absolute top-1/2 -right-40 h-[500px] w-[500px] rounded-full bg-indigo-600/10 blur-[160px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Navigation Bar Top */}
        <div className="mb-6 flex items-center justify-between">
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
            KLASIM // MLBB MODULE
          </span>
        </div>

        {/* Header Title Section */}
        <header className="mb-8 border-b border-white/10 pb-6">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-1 font-mono text-[11px] font-extrabold uppercase tracking-widest text-amber-400">
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              SIMULATOR POKOK
            </span>
            <span className="font-mono text-xs font-semibold tracking-wider text-slate-400 uppercase">
              MPL ID Professional League
            </span>
          </div>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-5xl uppercase leading-none">
            {tournamentName}
          </h1>
        </header>

        {/* Unified Control Toolbar (Grup Tombol Aksi) */}
        <div className="mb-8 flex flex-col justify-between gap-4 rounded-xl border border-white/10 bg-slate-950/80 p-2.5 backdrop-blur-md sm:flex-row sm:items-center">
          {/* Tab View Switcher */}
          <div className="flex gap-1">
            {[
              { id: 'ALL', label: 'SEMUA VIEW' },
              { id: 'SEASON', label: 'REGULAR SEASON' },
              { id: 'PLAYOFFS', label: 'PLAYOFF BRACKET' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setViewMode(tab.id as any)}
                className={`rounded-lg px-3.5 py-2 font-mono text-xs font-bold transition-all ${
                  viewMode === tab.id
                    ? 'bg-amber-400 text-black shadow-[0_0_15px_rgba(251,191,36,0.3)]'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Action Buttons: Export Excel, Bagikan, Reset */}
          <div className="flex flex-wrap items-center gap-2 border-t border-white/10 pt-2 sm:border-t-0 sm:pt-0">
            {/* Tombol Export Excel */}
            <button
              onClick={() => exportStandingsToExcel(tournamentName, standings)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 font-mono text-[11px] font-bold text-emerald-400 transition-all hover:bg-emerald-500/20 active:scale-95"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              EXPORT EXCEL
            </button>

            {/* Tombol Bagikan Simulasi */}
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-amber-400/40 bg-amber-400/10 px-3 py-1.5 font-mono text-[11px] font-bold text-amber-400 transition-all hover:bg-amber-400/20 active:scale-95"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              BAGIKAN
            </button>

            {/* Tombol Skor Real */}
            <button
              onClick={handleResetToDefault}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-[11px] font-bold text-slate-300 transition-all hover:border-amber-400/40 hover:bg-amber-400/10 hover:text-amber-400"
            >
              SKOR REAL
            </button>

            {/* Tombol Reset */}
            <button
              onClick={handleClearAllScores}
              className="rounded-lg border border-rose-500/20 bg-rose-500/5 px-3 py-1.5 font-mono text-[11px] font-bold text-rose-300 transition-all hover:bg-rose-500/15"
            >
              KOSONGKAN
            </button>
          </div>
        </div>

        {/* Dashboard Grid Layout */}
        {(viewMode === 'ALL' || viewMode === 'SEASON') && (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-stretch">
            <div className="lg:col-span-7">
              <StandingsTable standings={standings} />
            </div>
            <div className="lg:col-span-5">
              <MatchSimulator matches={normalizedMatches} onScoreChange={handleScoreChange} />
            </div>
          </div>
        )}

        {/* Proyeksi Bagan Playoff */}
        {(viewMode === 'ALL' || viewMode === 'PLAYOFFS') && (
          <div className={viewMode === 'ALL' ? 'mt-12' : ''}>
            <PlayoffBracket key={resetKey} standings={standings} />
          </div>
        )}
      </div>

      {/* Share Modal Dialog */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        tournamentName={tournamentName}
        shareUrl={shareUrl}
      />
    </div>
  );
}