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
    <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-slate-950/80 p-4 sm:p-6 shadow-2xl backdrop-blur-2xl space-y-5 font-mono transition-all duration-300 animate-in fade-in">
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-3 w-3">
            <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${accentStyles.pulse} opacity-75`} />
            <span className={`relative inline-flex h-3 w-3 rounded-full ${accentStyles.dot}`} />
          </span>
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-200">
            {title}
          </h2>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold uppercase tracking-wider">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="h-2.5 w-2.5 rounded-sm bg-emerald-400/20 border border-emerald-400/40 shadow-[0_0_8px_rgba(52,211,153,0.3)]" /> Menang (W)
          </span>
          <span className="flex items-center gap-1.5 text-rose-400">
            <span className="h-2.5 w-2.5 rounded-sm bg-rose-400/20 border border-rose-400/40 shadow-[0_0_8px_rgba(244,63,94,0.2)]" /> Kalah (L)
          </span>
          <span className="flex items-center gap-1.5 text-slate-500">
            <span className="h-2.5 w-2.5 rounded-sm bg-white/5 border border-white/10" /> Belum Main
          </span>
          <span className="flex items-center gap-1.5 text-slate-600">
            <span className="h-2.5 w-2.5 rounded-sm bg-black/40 border border-white/5" /> Tim Sendiri
          </span>
        </div>
      </div>

      {/* Cross Table Matrix Grid */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-center text-xs select-none">
          <thead>
            <tr>
              <th className="p-2.5 text-left font-mono text-[10px] text-slate-500 uppercase tracking-wider min-w-[130px] border-b border-r border-white/10">
                TIM \ LAWAN
              </th>
              {teams.map((opponent) => {
                const isHoveredCol = hoveredCell?.colId === opponent.id;
                return (
                  <th
                    key={opponent.id}
                    className={`p-2.5 font-mono text-[11px] font-extrabold uppercase border-b border-r border-white/10 transition-all duration-200 min-w-[54px] ${
                      isHoveredCol ? accentStyles.highlightRow : 'text-slate-300 bg-white/[0.02]'
                    }`}
                  >
                    <span title={opponent.name}>{opponent.code}</span>
                  </th>
                );
              })}
              {/* Kolom Ringkasan */}
              <th className="p-2.5 font-mono text-[10px] text-slate-400 uppercase tracking-wider border-b border-white/10 min-w-[70px]">
                REKOR
              </th>
              <th className="p-2.5 font-mono text-[10px] text-slate-400 uppercase tracking-wider border-b border-white/10 min-w-[60px]">
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
                  {/* Label Baris Tim */}
                  <td
                    className={`p-2.5 text-left border-r border-white/10 font-bold transition-all duration-200 ${
                      isHoveredRow ? accentStyles.highlightRow : 'text-white bg-white/[0.01]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] font-mono text-slate-300 group-hover:border-amber-400/40">
                        {rowTeam.code}
                      </span>
                      <span className="truncate max-w-[90px] sm:max-w-[110px] text-[11px]" title={rowTeam.name}>
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
                          className="p-2 border-r border-white/10 bg-black/40 text-slate-700 font-mono text-[11px]"
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
                        className={`p-1.5 border-r border-white/10 relative transition-all duration-150 ${
                          isHovered ? 'bg-white/10 scale-105 z-10 shadow-lg shadow-black/40' : ''
                        }`}
                      >
                        {completedMatchups.length === 0 ? (
                          <span className="inline-block py-1 text-slate-600 font-mono text-[11px]">
                            -
                          </span>
                        ) : (
                          <div className="flex flex-col gap-1 items-center justify-center">
                            {completedMatchups.map((match, idx) => {
                              const isHome = match.homeTeamId === rowTeam.id;
                              const teamScore = isHome ? match.homeScore : match.awayScore;
                              const oppScore = isHome ? match.awayScore : match.homeScore;
                              const isWin = teamScore > oppScore;

                              return (
                                <span
                                  key={match.id || idx}
                                  title={`Week ${match.week || '?'}: ${rowTeam.code} ${teamScore} - ${oppScore} ${colTeam.code}`}
                                  className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-mono font-black border transition-transform duration-150 hover:scale-110 cursor-default ${
                                    isWin
                                      ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 shadow-[0_0_8px_rgba(52,211,153,0.2)]'
                                      : 'bg-rose-500/15 text-rose-300 border-rose-500/40 shadow-[0_0_6px_rgba(244,63,94,0.15)]'
                                  }`}
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

                  {/* Ringkasan Rekor H2H */}
                  <td className="p-2 border-r border-white/10 font-mono text-[11px] font-bold">
                    <span className="text-emerald-400">{summary.matchWins}</span>
                    <span className="text-slate-600 mx-0.5">/</span>
                    <span className="text-rose-400">{summary.matchLosses}</span>
                  </td>

                  {/* Net Game Difference */}
                  <td className="p-2 font-mono text-[11px] font-black">
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

      {/* Footer Instructions / Info */}
      <div className="flex flex-wrap items-center justify-between border-t border-white/10 pt-3 text-[10px] text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Format sel: Skor Baris Tim vs Kolom Lawan (misal: 2-0 = Tim Baris menang 2-0).
        </span>
        <span className="text-slate-500">
          Ubah skor pada Match Simulator untuk melihat pembaruan matriks seketika.
        </span>
      </div>
    </div>
  );
}
