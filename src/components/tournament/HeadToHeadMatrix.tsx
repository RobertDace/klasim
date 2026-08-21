// src/components/tournament/HeadToHeadMatrix.tsx
'use client';

import { useState } from 'react';

export interface MatrixTeam {
  id: string;
  name: string;
  code: string;
  logoUrl?: string | null;
  rank?: number;
}

export interface MatrixMatch {
  id?: string;
  week?: number;
  homeTeamId: string;
  awayTeamId: string;
  homeScore: number;
  awayScore: number;
  isCompleted: boolean;
}

interface HeadToHeadMatrixProps {
  teams: MatrixTeam[];
  matches: MatrixMatch[];
  title?: string;
  accentColor?: 'amber' | 'cyan' | 'emerald';
}

export default function HeadToHeadMatrix({
  teams,
  matches,
  title = 'Matriks Head-to-Head Antar Tim',
  accentColor = 'amber',
}: HeadToHeadMatrixProps) {
  const [hoveredCell, setHoveredCell] = useState<{ rowId: string; colId: string } | null>(null);

  // Helper untuk mencari semua match antara Tim A dan Tim B
  const getMatchups = (teamAId: string, teamBId: string) => {
    return matches.filter(
      (m) =>
        (m.homeTeamId === teamAId && m.awayTeamId === teamBId) ||
        (m.homeTeamId === teamBId && m.awayTeamId === teamAId)
    );
  };

  // Helper untuk menghitung total rekor H2H sebuah tim terhadap seluruh tim lainnya
  const getTeamH2HSummary = (teamId: string) => {
    let matchWins = 0;
    let matchLosses = 0;
    let gamesWon = 0;
    let gamesLost = 0;

    matches.forEach((m) => {
      if (!m.isCompleted) return;

      const isHome = m.homeTeamId === teamId;
      const isAway = m.awayTeamId === teamId;

      if (!isHome && !isAway) return;

      const teamScore = isHome ? m.homeScore : m.awayScore;
      const opponentScore = isHome ? m.awayScore : m.homeScore;

      gamesWon += teamScore;
      gamesLost += opponentScore;

      if (teamScore > opponentScore) {
        matchWins += 1;
      } else if (opponentScore > teamScore) {
        matchLosses += 1;
      }
    });

    return {
      matchWins,
      matchLosses,
      netGames: gamesWon - gamesLost,
    };
  };

  const accentStyles = {
    amber: {
      badge: 'bg-amber-400/10 text-amber-400 border-amber-400/30',
      highlightRow: 'bg-amber-400/15 text-amber-300 font-black',
      dot: 'bg-amber-400',
      pulse: 'bg-amber-400/30',
      border: 'border-amber-400/30',
    },
    cyan: {
      badge: 'bg-cyan-400/10 text-cyan-400 border-cyan-400/30',
      highlightRow: 'bg-cyan-400/15 text-cyan-300 font-black',
      dot: 'bg-cyan-400',
      pulse: 'bg-cyan-400/30',
      border: 'border-cyan-400/30',
    },
    emerald: {
      badge: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/30',
      highlightRow: 'bg-emerald-400/15 text-emerald-300 font-black',
      dot: 'bg-emerald-400',
      pulse: 'bg-emerald-400/30',
      border: 'border-emerald-400/30',
    },
  }[accentColor];

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-3.5 sm:p-6 shadow-2xl backdrop-blur-2xl font-mono">
      {/* Header Matriks */}
      <div className="mb-3.5 sm:mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-3 sm:pb-4">
        <div>
          <div className="flex items-center gap-2 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            <span className={`h-1.5 w-1.5 rounded-full ${accentStyles.dot} animate-pulse`} />
            CROSS-TABLE MATCHUP ENGINE
          </div>
          <h2 className="text-sm sm:text-base font-black uppercase text-white tracking-tight font-sans">
            {title}
          </h2>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-[9px] sm:text-[10px] font-bold">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="h-2 w-2 rounded-sm bg-emerald-500/20 border border-emerald-500/40" /> Menang
          </span>
          <span className="flex items-center gap-1.5 text-rose-400">
            <span className="h-2 w-2 rounded-sm bg-rose-500/20 border border-rose-500/40" /> Kalah
          </span>
          <span className="flex items-center gap-1.5 text-slate-400">
            <span className="h-2 w-2 rounded-sm bg-white/5 border border-white/10" /> Belum Main
          </span>
          <span className="sm:hidden text-amber-400/80 text-[8px]">
            &rarr; GESER TABEL
          </span>
        </div>
      </div>

      {/* Cross Table Matrix Grid dengan Sticky First Column di Mobile */}
      <div className="overflow-x-auto scrollbar-none">
        <table className="w-full border-collapse text-center text-xs select-none min-w-[500px]">
          <thead>
            <tr>
              <th className="sticky left-0 bg-slate-950/95 backdrop-blur z-20 p-2 sm:p-2.5 text-left text-[9px] sm:text-[10px] text-slate-500 uppercase tracking-wider min-w-[100px] sm:min-w-[130px] border-b border-r border-white/10 shadow-md">
                TIM \ LAWAN
              </th>
              {teams.map((opponent) => {
                const isHoveredCol = hoveredCell?.colId === opponent.id;
                return (
                  <th
                    key={opponent.id}
                    className={`p-2 sm:p-2.5 text-[10px] sm:text-[11px] font-extrabold uppercase border-b border-r border-white/10 transition-all duration-200 min-w-[48px] sm:min-w-[54px] ${
                      isHoveredCol ? accentStyles.highlightRow : 'text-slate-300 bg-white/[0.02]'
                    }`}
                  >
                    <span title={opponent.name}>{opponent.code}</span>
                  </th>
                );
              })}
              {/* Kolom Ringkasan */}
              <th className="p-2 sm:p-2.5 text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-wider border-b border-white/10 min-w-[60px] sm:min-w-[70px]">
                REKOR
              </th>
              <th className="p-2 sm:p-2.5 text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-wider border-b border-white/10 min-w-[50px] sm:min-w-[60px]">
                NET
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {teams.map((rowTeam) => {
              const isHoveredRow = hoveredCell?.rowId === rowTeam.id;
              const summary = getTeamH2HSummary(rowTeam.id);

              return (
                <tr key={rowTeam.id} className="transition-colors duration-150 hover:bg-white/[0.03]">
                  {/* Label Baris Tim (Sticky di Mobile) */}
                  <td
                    className={`sticky left-0 bg-slate-950/95 backdrop-blur z-20 p-2 sm:p-2.5 text-left border-r border-white/10 font-bold transition-all duration-200 shadow-md ${
                      isHoveredRow ? accentStyles.highlightRow : 'text-white'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <span className="rounded border border-white/10 bg-white/5 px-1 sm:px-1.5 py-0.5 text-[9px] sm:text-[10px] font-mono text-slate-300">
                        {rowTeam.code}
                      </span>
                      <span className="truncate max-w-[70px] sm:max-w-[105px] text-[10px] sm:text-[11px] font-sans" title={rowTeam.name}>
                        {rowTeam.name}
                      </span>
                    </div>
                  </td>

                  {/* Sel Matriks Tiap Lawan */}
                  {teams.map((colTeam) => {
                    const isSelf = rowTeam.id === colTeam.id;
                    const isHovered =
                      hoveredCell?.rowId === rowTeam.id && hoveredCell?.colId === colTeam.id;

                    if (isSelf) {
                      return (
                        <td
                          key={colTeam.id}
                          className="p-1.5 sm:p-2 border-r border-white/10 bg-black/40 text-slate-700 text-[10px] sm:text-[11px]"
                        >
                          —
                        </td>
                      );
                    }

                    const matchups = getMatchups(rowTeam.id, colTeam.id);
                    const completedMatchups = matchups.filter((m) => m.isCompleted);

                    return (
                      <td
                        key={colTeam.id}
                        onMouseEnter={() => setHoveredCell({ rowId: rowTeam.id, colId: colTeam.id })}
                        onMouseLeave={() => setHoveredCell(null)}
                        className={`p-1 sm:p-1.5 border-r border-white/10 relative transition-all duration-150 ${
                          isHovered ? 'bg-white/10 scale-105 z-10 shadow-lg shadow-black/40' : ''
                        }`}
                      >
                        {completedMatchups.length === 0 ? (
                          <span className="inline-block py-0.5 text-slate-600 text-[10px] sm:text-[11px]">
                            -
                          </span>
                        ) : (
                          <div className="flex flex-col gap-0.5 sm:gap-1 items-center justify-center">
                            {completedMatchups.map((match, idx) => {
                              const isHome = match.homeTeamId === rowTeam.id;
                              const teamScore = isHome ? match.homeScore : match.awayScore;
                              const oppScore = isHome ? match.awayScore : match.homeScore;
                              const isWin = teamScore > oppScore;

                              return (
                                <span
                                  key={idx}
                                  className={`inline-block rounded px-1 sm:px-1.5 py-0.5 font-mono text-[9px] sm:text-[10px] font-black border transition-all ${
                                    isWin
                                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm shadow-emerald-500/20'
                                      : 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-sm shadow-rose-500/20'
                                  }`}
                                  title={`${rowTeam.name} vs ${colTeam.name}: ${teamScore} - ${oppScore}`}
                                >
                                  {teamScore}-{oppScore}
                                </span>
                              );
                            })}
                          </div>
                        )}
                      </td>
                    );
                  })}

                  {/* Ringkasan Rekor H2H Total */}
                  <td className="p-1.5 sm:p-2 font-bold text-[10px] sm:text-xs border-r border-white/10">
                    <span className="text-emerald-400">{summary.matchWins}</span>
                    <span className="text-slate-600 mx-0.5">/</span>
                    <span className="text-rose-400">{summary.matchLosses}</span>
                  </td>

                  {/* Ringkasan Net Games H2H */}
                  <td className="p-1.5 sm:p-2 font-black text-[10px] sm:text-xs">
                    <span
                      className={
                        summary.netGames > 0
                          ? 'text-emerald-400'
                          : summary.netGames < 0
                          ? 'text-rose-400'
                          : 'text-slate-500'
                      }
                    >
                      {summary.netGames > 0 ? `+${summary.netGames}` : summary.netGames}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer Info */}
      <div className="mt-3.5 sm:mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between border-t border-white/10 pt-2.5 sm:pt-3 text-[9px] sm:text-[10px] text-slate-400 gap-1.5">
        <span>Baris = Tim Evaluasi | Kolom = Lawan Bertanding</span>
        <span className="text-slate-500">Skor otomatis diperbarui saat simulasi diubah</span>
      </div>
    </div>
  );
}
