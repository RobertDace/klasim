// src/components/tournament/StandingsTable.tsx
'use client';

import { TeamStanding } from '@/lib/calculator';

interface StandingsTableProps {
  standings: TeamStanding[];
}

export default function StandingsTable({ standings }: StandingsTableProps) {
  return (
    <div className="flex h-full flex-col justify-between rounded-2xl border border-white/10 bg-slate-950/70 p-3.5 sm:p-6 shadow-2xl backdrop-blur-2xl font-mono">
      <div>
        {/* Header Legend */}
        <div className="mb-3.5 sm:mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-white/10 pb-3 sm:pb-4">
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-300">
            Klasemen Regular Season
          </h2>
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" /> Upper (1-2)
            </span>
            <span className="flex items-center gap-1.5 text-sky-400">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.8)]" /> Play-in (3-6)
            </span>
            <span className="flex items-center gap-1.5 text-rose-400">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500" /> Gugur
            </span>
          </div>
        </div>

        {/* Responsive Table Wrapper */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left text-xs font-medium border-collapse min-w-[320px] sm:min-w-full">
            <thead>
              <tr className="border-b border-white/10 text-[9px] sm:text-[10px] uppercase tracking-wider text-slate-400">
                <th className="pb-2 text-center w-7 sm:w-10">POS</th>
                <th className="pb-2 pl-1 sm:pl-2">TIM</th>
                <th className="pb-2 text-center hidden md:table-cell">MN</th>
                <th className="pb-2 text-center">M / K</th>
                <th className="pb-2 text-center hidden sm:table-cell">MW%</th>
                <th className="pb-2 text-center text-[9px] sm:text-xs">GAME</th>
                <th className="pb-2 text-center font-bold text-white pr-1">NET</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {standings.map((team) => {
                const rank = team.rank ?? 0;
                const isUpper = rank <= 2;
                const isPlayoff = rank >= 3 && rank <= 6;

                return (
                  <tr
                    key={team.teamId}
                    className={`group transition-all hover:bg-white/[0.04] ${
                      isUpper
                        ? 'bg-emerald-500/[0.03]'
                        : isPlayoff
                        ? 'bg-sky-500/[0.02]'
                        : 'bg-rose-500/[0.02]'
                    }`}
                  >
                    {/* Rank Badge */}
                    <td className="py-2 text-center">
                      <span
                        className={`inline-flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded font-mono font-black text-[10px] sm:text-xs ${
                          isUpper
                            ? 'bg-emerald-400/20 text-emerald-300 ring-1 ring-emerald-400/40 shadow-[0_0_10px_rgba(52,211,153,0.15)]'
                            : isPlayoff
                            ? 'bg-sky-400/20 text-sky-300 ring-1 ring-sky-400/40'
                            : 'bg-slate-800/80 text-slate-400'
                        }`}
                      >
                        {rank}
                      </span>
                    </td>

                    {/* Team Code & Name */}
                    <td className="py-2 pl-1 sm:pl-2">
                      <div className="flex items-center gap-1.5 sm:gap-3">
                        <span className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[9px] sm:text-[11px] font-bold text-slate-300 group-hover:border-amber-400/50 group-hover:text-amber-400">
                          {team.teamCode}
                        </span>
                        <span className="font-extrabold text-white tracking-wide text-[11px] sm:text-xs truncate max-w-[95px] sm:max-w-none">
                          {team.teamName}
                        </span>
                      </div>
                    </td>

                    {/* MN (Match Played) */}
                    <td className="py-2 text-center text-slate-400 hidden md:table-cell">
                      {team.matchPlayed}
                    </td>

                    {/* Match W/L */}
                    <td className="py-2 text-center font-bold text-[11px] sm:text-xs">
                      <span className="text-emerald-400">{team.matchWins}</span>
                      <span className="text-slate-600 mx-0.5 sm:mx-1">/</span>
                      <span className="text-rose-400">{team.matchLosses}</span>
                    </td>

                    {/* MW% */}
                    <td className="py-2 text-center text-slate-400 hidden sm:table-cell text-[11px]">
                      {(team.matchWinRate * 100).toFixed(0)}%
                    </td>

                    {/* Game W-L */}
                    <td className="py-2 text-center text-slate-400 text-[10px] sm:text-xs tabular-nums">
                      {team.gameWins}-{team.gameLosses}
                    </td>

                    {/* Net Game */}
                    <td className="py-2 text-center font-black text-xs sm:text-sm pr-1 tabular-nums">
                      <span
                        className={
                          team.netGames > 0
                            ? 'text-emerald-400'
                            : team.netGames < 0
                            ? 'text-rose-400'
                            : 'text-slate-400'
                        }
                      >
                        {team.netGames > 0 ? `+${team.netGames}` : team.netGames}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Info Bar */}
      <div className="mt-3.5 sm:mt-5 flex items-center justify-between border-t border-white/10 pt-2.5 sm:pt-3 text-[9px] sm:text-[10px] text-slate-400">
        <span className="flex items-center gap-1.5 truncate pr-1">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
          <span className="truncate">TOP 2: UPPER SEMIS</span>
        </span>
        <span className="text-slate-500 shrink-0">TOP 6: PLAYOFFS</span>
      </div>
    </div>
  );
}