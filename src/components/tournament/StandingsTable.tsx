// src/components/tournament/StandingsTable.tsx
'use client';

import { TeamStanding } from '@/lib/calculator';

interface StandingsTableProps {
  standings: TeamStanding[];
}

export default function StandingsTable({ standings }: StandingsTableProps) {
  return (
    <div className="flex h-full flex-col justify-between rounded-2xl border border-white/10 bg-slate-950/80 p-4 sm:p-6 shadow-2xl backdrop-blur-2xl font-mono">
      <div>
        {/* Header Title & Legend */}
        <div className="mb-4 sm:mb-6 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-3.5 sm:pb-4">
          <div>
            <h2 className="text-xs sm:text-sm font-black uppercase tracking-widest text-slate-200">
              Klasemen Regular Season
            </h2>
            <span className="text-[9px] text-slate-500 block uppercase sm:hidden mt-0.5">
              Geser tabel ke samping untuk detail lengkap
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" /> Upper (1-2)
            </span>
            <span className="flex items-center gap-1.5 text-sky-400">
              <span className="h-2 w-2 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.8)]" /> Play-in (3-6)
            </span>
            <span className="flex items-center gap-1.5 text-rose-400">
              <span className="h-2 w-2 rounded-full bg-rose-500" /> Gugur (7-9)
            </span>
          </div>
        </div>

        {/* Responsive Table with Non-Colliding Fixed Columns */}
        <div className="w-full overflow-x-auto scrollbar-none">
          <table className="w-full text-left text-xs font-medium border-collapse min-w-[340px] sm:min-w-full select-none">
            <thead>
              <tr className="border-b border-white/10 text-[10px] uppercase tracking-wider text-slate-400">
                <th className="pb-3 text-center w-8 sm:w-10 whitespace-nowrap">POS</th>
                <th className="pb-3 pl-2 sm:pl-3 whitespace-nowrap">TIM</th>
                <th className="pb-3 text-center hidden md:table-cell px-2 whitespace-nowrap">MAIN</th>
                <th className="pb-3 text-center px-3 whitespace-nowrap">M / K</th>
                <th className="pb-3 text-center hidden sm:table-cell px-2 whitespace-nowrap">WIN RATE</th>
                <th className="pb-3 text-center hidden sm:table-cell px-2 whitespace-nowrap">GAME W-L</th>
                <th className="pb-3 text-center font-bold text-white px-3 pr-2 sm:pr-4 whitespace-nowrap">NET</th>
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
                        ? 'bg-emerald-500/[0.04]'
                        : isPlayoff
                        ? 'bg-sky-500/[0.02]'
                        : 'bg-rose-500/[0.02]'
                    }`}
                  >
                    {/* 1. Rank Badge */}
                    <td className="py-3 text-center whitespace-nowrap">
                      <span
                        className={`inline-flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-lg font-mono font-black text-xs ${
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

                    {/* 2. Team Code & Name */}
                    <td className="py-3 pl-2 sm:pl-3 whitespace-nowrap">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <span className="rounded border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[10px] sm:text-[11px] font-bold text-slate-300 group-hover:border-amber-400/50 group-hover:text-amber-400 shrink-0">
                          {team.teamCode}
                        </span>
                        <span className="font-bold text-white tracking-wide text-xs sm:text-sm truncate max-w-[110px] sm:max-w-[160px] md:max-w-none">
                          {team.teamName}
                        </span>
                      </div>
                    </td>

                    {/* 3. Main (MN) - Hidden di Mobile */}
                    <td className="py-3 text-center text-slate-400 hidden md:table-cell px-2 whitespace-nowrap tabular-nums">
                      {team.matchPlayed}
                    </td>

                    {/* 4. Match Win / Loss */}
                    <td className="py-3 text-center font-bold text-xs sm:text-sm px-3 whitespace-nowrap tabular-nums">
                      <span className="text-emerald-400">{team.matchWins}</span>
                      <span className="text-slate-600 mx-1">/</span>
                      <span className="text-rose-400">{team.matchLosses}</span>
                    </td>

                    {/* 5. Win Rate - Hidden di Mobile Kecil */}
                    <td className="py-3 text-center text-slate-400 hidden sm:table-cell px-2 whitespace-nowrap text-xs tabular-nums">
                      {(team.matchWinRate * 100).toFixed(0)}%
                    </td>

                    {/* 6. Game W-L - Hidden di Mobile Kecil */}
                    <td className="py-3 text-center text-slate-400 hidden sm:table-cell px-2 whitespace-nowrap text-xs tabular-nums">
                      {team.gameWins} - {team.gameLosses}
                    </td>

                    {/* 7. Net Game Difference */}
                    <td className="py-3 text-center font-black text-xs sm:text-sm px-3 pr-2 sm:pr-4 whitespace-nowrap tabular-nums">
                      <span
                        className={`inline-block min-w-[28px] text-center px-1.5 py-0.5 rounded ${
                          team.netGames > 0
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : team.netGames < 0
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                            : 'bg-white/5 text-slate-400'
                        }`}
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
      <div className="mt-4 sm:mt-6 flex items-center justify-between border-t border-white/10 pt-3 text-[10px] text-slate-400">
        <span className="flex items-center gap-1.5 truncate pr-2">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
          <span className="truncate">RANK 1-2 AUTOMATIC UPPER SEMIFINALS</span>
        </span>
        <span className="text-slate-500 shrink-0 uppercase">TOP 6 ADVANCE</span>
      </div>
    </div>
  );
}