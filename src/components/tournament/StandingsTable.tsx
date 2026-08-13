// src/components/tournament/StandingsTable.tsx
'use client';

import { TeamStanding } from '@/lib/calculator';

interface StandingsTableProps {
  standings: TeamStanding[];
}

export default function StandingsTable({ standings }: StandingsTableProps) {
  return (
    <div className="flex h-full flex-col justify-between rounded-2xl border border-white/10 bg-slate-950/70 p-5 sm:p-6 shadow-2xl backdrop-blur-2xl">
      <div>
        {/* Header Legend */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
          <h2 className="font-mono text-xs font-black uppercase tracking-widest text-slate-300">
            Klasemen Regular Season
          </h2>
          <div className="flex items-center gap-4 text-[10px] font-mono font-bold uppercase tracking-wider">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" /> Upper (1-2)
            </span>
            <span className="flex items-center gap-1.5 text-sky-400">
              <span className="h-2 w-2 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.8)]" /> Play-in (3-6)
            </span>
            <span className="flex items-center gap-1.5 text-rose-400">
              <span className="h-2 w-2 rounded-full bg-rose-500" /> Tereliminasi
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-medium">
            <thead>
              <tr className="border-b border-white/10 font-mono text-[10px] uppercase tracking-wider text-slate-400">
                <th className="pb-3 text-center w-10">POS</th>
                <th className="pb-3 pl-2">TIM</th>
                <th className="pb-3 text-center">MN</th>
                <th className="pb-3 text-center">M / K</th>
                <th className="pb-3 text-center">MW%</th>
                <th className="pb-3 text-center">GAME W-L</th>
                <th className="pb-3 text-center font-bold text-white">NET</th>
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
                    <td className="py-2.5 text-center">
                      <span
                        className={`inline-flex h-6 w-6 items-center justify-center rounded font-mono font-black text-xs ${
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

                    <td className="py-2.5 pl-2">
                      <div className="flex items-center gap-3">
                        <span className="rounded border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[11px] font-bold text-slate-300 group-hover:border-amber-400/50 group-hover:text-amber-400">
                          {team.teamCode}
                        </span>
                        <span className="font-extrabold text-white tracking-wide">
                          {team.teamName}
                        </span>
                      </div>
                    </td>

                    <td className="py-2.5 text-center font-mono text-slate-400">{team.matchPlayed}</td>
                    <td className="py-2.5 text-center font-mono font-bold">
                      <span className="text-emerald-400">{team.matchWins}</span>
                      <span className="text-slate-600 mx-1">/</span>
                      <span className="text-rose-400">{team.matchLosses}</span>
                    </td>
                    <td className="py-2.5 text-center font-mono text-slate-400">
                      {(team.matchWinRate * 100).toFixed(0)}%
                    </td>
                    <td className="py-2.5 text-center font-mono text-slate-400">
                      {team.gameWins} - {team.gameLosses}
                    </td>
                    <td className="py-2.5 text-center font-mono font-black text-sm">
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

      {/* Footer Info Bar (Menyelaraskan tinggi dengan panel kanan) */}
      <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-3 font-mono text-[10px] text-slate-400">
        <span className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          RANK 1-2 AUTOMATIC UPPER SEMIFINALS
        </span>
        <span className="text-slate-500">TOP 6 ADVANCE TO PLAYOFFS</span>
      </div>
    </div>
  );
}