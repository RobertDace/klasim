// src/components/tournament/TournamentContainer.tsx
'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import StandingsTable from '@/components/tournament/StandingsTable';
import MatchSimulator from '@/components/tournament/MatchSimulator';
import PlayoffBracket from '@/components/tournament/PlayoffBracket';
import HeadToHeadMatrix from '@/components/tournament/HeadToHeadMatrix';
import ScenarioSolverView from '@/components/tournament/ScenarioSolverView';
import ShareModal from '@/components/common/ShareModal';
import ShareCardModal from '@/components/common/ShareCardModal';
import { calculateMPLStandings, TeamData, MatchData } from '@/lib/calculator';
import { exportStandingsToExcel, exportStandingsToPdf } from '@/lib/exportUtils';
import { encodeMatchScoresToUrl } from '@/lib/shareUtils';

interface TournamentContainerProps {
  tournamentName: string;
  teams: TeamData[];
  initialMatches: MatchData[];
}

export default function TournamentContainer({
  tournamentName,
  teams,
  initialMatches,
}: TournamentContainerProps) {
  // State Skor Pertandingan
  const [matches, setMatches] = useState<MatchData[]>(initialMatches);
  const [resetKey, setResetKey] = useState(0);

  // State Modal Dialog
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);

  // State View Switcher Tab (ALL, SEASON, H2H, SOLVER, PLAYOFFS)
  const [viewMode, setViewMode] = useState<'ALL' | 'SEASON' | 'H2H' | 'PLAYOFFS' | 'SOLVER'>('ALL');

  // Normalisasi data pertandingan agar setiap match memiliki objek homeTeam & awayTeam
  const normalizedMatches = useMemo(() => {
    return matches.map((m) => {
      const home = teams.find((t) => t.id === m.homeTeamId) || m.homeTeam || {
        id: m.homeTeamId,
        name: 'Home',
        code: 'HOM',
      };
      const away = teams.find((t) => t.id === m.awayTeamId) || m.awayTeam || {
        id: m.awayTeamId,
        name: 'Away',
        code: 'AWY',
      };
      return {
        ...m,
        homeTeam: home,
        awayTeam: away,
      };
    });
  }, [matches, teams]);

  // Kalkulasi Klasemen secara Otomatis menggunakan Engine Deterministik MPL ID
  const standings = useMemo(() => {
    return calculateMPLStandings(teams, matches);
  }, [teams, matches]);

  // Handler Perubahan Skor Pertandingan
  const handleScoreChange = (matchId: string, homeScore: number, awayScore: number) => {
    setMatches((prevMatches) =>
      prevMatches.map((m) =>
        m.id === matchId
          ? {
              ...m,
              homeScore,
              awayScore,
              isCompleted: homeScore > 0 || awayScore > 0,
            }
          : m
      )
    );
  };

  // Handler Reset Skor
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

  // Generate URL Berbagi
  const currentOrigin =
    typeof window !== 'undefined'
      ? window.location.origin + window.location.pathname
      : '';
  const encodedQuery = encodeMatchScoresToUrl(matches);
  const shareUrl = encodedQuery ? `${currentOrigin}?sim=${encodedQuery}` : currentOrigin;

  return (
    <div className="relative min-h-screen bg-[#05070c] text-slate-100 selection:bg-amber-400 selection:text-black font-mono">
      {/* Background Ambient Grid */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/3 h-[600px] w-[600px] rounded-full bg-amber-500/10 blur-[160px]" />
        <div className="absolute top-1/2 -right-40 h-[500px] w-[500px] rounded-full bg-indigo-600/10 blur-[160px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-4 sm:space-y-6">
        {/* Navigation Bar Top */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs font-bold text-slate-300 transition-all hover:border-amber-400/40 hover:bg-amber-400/10 hover:text-amber-400 active:scale-95"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            BERANDA
          </Link>

          <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-slate-500">
            KLASIM // MOBA MODULE
          </span>
        </div>

        {/* Header Title Section */}
        <header className="border-b border-white/10 pb-4 sm:pb-6">
          <span className="text-[10px] sm:text-xs font-semibold tracking-wider text-slate-400 uppercase">
            MPL ID Professional League Ruleset
          </span>
          <h1 className="mt-1 text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-white uppercase leading-tight font-sans">
            {tournamentName}
          </h1>
        </header>

        {/* Unified Control Toolbar */}
        <div className="flex flex-col justify-between gap-3 sm:gap-4 rounded-2xl border border-white/10 bg-slate-950/80 p-2 sm:p-2.5 backdrop-blur-md">
          {/* Tab View Switcher (Horizontal Swipe Rail di Mobile) */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {[
              { id: 'ALL', label: 'SEMUA' },
              { id: 'SEASON', label: 'REGULAR SEASON' },
              { id: 'H2H', label: 'MATRIKS H2H' },
              { id: 'SOLVER', label: 'WHAT-IF SOLVER' },
              { id: 'PLAYOFFS', label: 'PLAYOFF' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setViewMode(tab.id as any)}
                className={`rounded-lg px-2.5 py-1.5 sm:px-3.5 sm:py-2 text-[10px] sm:text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                  viewMode === tab.id
                    ? 'bg-amber-400 text-black shadow-md shadow-amber-400/20 font-black'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Action Buttons: Export Excel, Export PDF, Kartu Grafis, Bagikan Link, Reset */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pt-2 border-t border-white/10 sm:border-t-0 sm:pt-0 scrollbar-none">
            {/* Tombol Export Excel */}
            <button
              onClick={() => exportStandingsToExcel(tournamentName, standings, normalizedMatches)}
              className="inline-flex items-center gap-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1.5 text-[10px] sm:text-[11px] font-bold text-emerald-400 transition-all hover:bg-emerald-500/20 active:scale-95 cursor-pointer whitespace-nowrap shrink-0"
            >
              <svg className="h-3 w-3 sm:h-3.5 sm:w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>EXCEL</span>
            </button>

            {/* Tombol Export PDF */}
            <button
              onClick={() => exportStandingsToPdf(tournamentName, standings)}
              className="inline-flex items-center gap-1 rounded-lg border border-rose-500/30 bg-rose-500/10 px-2.5 py-1.5 text-[10px] sm:text-[11px] font-bold text-rose-400 transition-all hover:bg-rose-500/20 active:scale-95 cursor-pointer whitespace-nowrap shrink-0"
            >
              <svg className="h-3 w-3 sm:h-3.5 sm:w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <span>PDF</span>
            </button>

            {/* Tombol Bagikan Kartu Grafis */}
            <button
              onClick={() => setIsCardModalOpen(true)}
              className="inline-flex items-center gap-1 rounded-lg border border-sky-500/30 bg-sky-500/10 px-2.5 py-1.5 text-[10px] sm:text-[11px] font-bold text-sky-400 transition-all hover:bg-sky-500/20 active:scale-95 cursor-pointer whitespace-nowrap shrink-0"
            >
              <svg className="h-3 w-3 sm:h-3.5 sm:w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>KARTU</span>
            </button>

            {/* Tombol Bagikan Link */}
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="inline-flex items-center gap-1 rounded-lg border border-amber-400/40 bg-amber-400/10 px-2.5 py-1.5 text-[10px] sm:text-[11px] font-bold text-amber-400 transition-all hover:bg-amber-400/20 active:scale-95 cursor-pointer whitespace-nowrap shrink-0"
            >
              <svg className="h-3 w-3 sm:h-3.5 sm:w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              <span>BAGIKAN</span>
            </button>

            {/* Tombol Skor Real */}
            <button
              onClick={handleResetToDefault}
              className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-[10px] sm:text-[11px] font-bold text-slate-300 transition-all hover:border-amber-400/40 hover:bg-amber-400/10 hover:text-amber-400 cursor-pointer whitespace-nowrap shrink-0"
            >
              SKOR REAL
            </button>

            {/* Tombol Kosongkan Skor */}
            <button
              onClick={handleClearAllScores}
              className="rounded-lg border border-rose-500/20 bg-rose-500/5 px-2.5 py-1.5 text-[10px] sm:text-[11px] font-bold text-rose-300 transition-all hover:bg-rose-500/15 cursor-pointer whitespace-nowrap shrink-0"
            >
              KOSONGKAN
            </button>
          </div>
        </div>

        {/* Dashboard Grid Layout: Standings & Match Simulator */}
        {(viewMode === 'ALL' || viewMode === 'SEASON') && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-stretch">
            <div className="lg:col-span-7">
              <StandingsTable standings={standings} />
            </div>
            <div className="lg:col-span-5">
              <MatchSimulator matches={normalizedMatches} onScoreChange={handleScoreChange} />
            </div>
          </div>
        )}

        {/* What-If Scenario Solver View */}
        {viewMode === 'SOLVER' && (
          <ScenarioSolverView
            teams={teams}
            matches={normalizedMatches}
            onApplyScenario={(updatedMatches) => {
              setMatches(updatedMatches);
            }}
          />
        )}

        {/* Matriks Head-to-Head */}
        {(viewMode === 'ALL' || viewMode === 'H2H') && (
          <div className={viewMode === 'ALL' ? 'mt-4 sm:mt-6' : ''}>
            <div className={viewMode === 'H2H' ? 'grid grid-cols-1 gap-6 lg:grid-cols-12 items-start' : ''}>
              <div className={viewMode === 'H2H' ? 'lg:col-span-7' : 'w-full'}>
                <HeadToHeadMatrix
                  teams={standings.map((s) => ({
                    id: s.teamId,
                    name: s.teamName,
                    code: s.teamCode,
                    logoUrl: s.logoUrl,
                    rank: s.rank,
                  }))}
                  matches={normalizedMatches}
                  accentColor="amber"
                  title="Matriks Head-to-Head MPL ID (Cross-Table Grid)"
                />
              </div>
              {viewMode === 'H2H' && (
                <div className="lg:col-span-5">
                  <MatchSimulator matches={normalizedMatches} onScoreChange={handleScoreChange} />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Proyeksi Bagan Playoff */}
        {(viewMode === 'ALL' || viewMode === 'PLAYOFFS') && (
          <div className={viewMode === 'ALL' ? 'mt-4 sm:mt-6' : ''}>
            <PlayoffBracket key={resetKey} standings={standings} />
          </div>
        )}
      </div>

      {/* Share Link Modal Dialog */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        tournamentName={tournamentName}
        shareUrl={shareUrl}
      />

      {/* Share Social Card Modal Dialog */}
      <ShareCardModal
        isOpen={isCardModalOpen}
        onClose={() => setIsCardModalOpen(false)}
        tournamentName={tournamentName}
        standings={standings}
      />
    </div>
  );
}