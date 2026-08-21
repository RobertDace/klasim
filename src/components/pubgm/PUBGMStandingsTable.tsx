// src/components/pubgm/PUBGMStandingsTable.tsx
'use client';

import { PUBGMStanding } from '@/lib/pubgmCalculator';

interface PUBGMStandingsTableProps {
  standings: PUBGMStanding[];
}

export default function PUBGMStandingsTable({ standings }: PUBGMStandingsTableProps) {
  // Hitung total eliminasi dan match di seluruh lobby
  const totalLobbyKills = standings.reduce((acc, curr) => acc + curr.elimPoints, 0);
  const totalLobbyMatches = standings[0]?.matchesPlayed || 0;
  const maxPoints = Math.max(...standings.map((s) => s.totalPoints), 1);

  return (
    <div className="flex h-full flex-col justify-between rounded-2xl border border-white/10 bg-slate-950/80 p-4 sm:p-6 shadow-2xl backdrop-blur-2xl font-mono">
      <div>
        {/* Header Broadcast HUD */}
        <div className="mb-4 sm:mb-6 border-b border-white/10 pb-3.5 sm:pb-4">
          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                <h2 className="text-xs sm:text-sm font-black uppercase tracking-widest text-slate-100 font-sans">
                  PMWC Overall Leaderboard
                </h2>
              </div>
              <p className="mt-1 text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-wider">
                Official PMWC 10-Point System // 1 Pt per Kill
              </p>
            </div>

            {/* Quick Telemetry Badges */}
            <div className="flex items-center gap-2 text-[10px]">
              <div className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-slate-300">
                MATCHES: <span className="font-bold text-amber-400">{totalLobbyMatches}</span>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-slate-300">
                TOTAL KILLS: <span className="font-bold text-amber-400">{totalLobbyKills}</span>
              </div>
            </div>
          </div>

          {/* Qualification Zone Legends */}
          <div className="mt-3 flex flex-wrap items-center justify-between border-t border-white/5 pt-2 text-[9px] sm:text-[10px] font-bold uppercase gap-2">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              1-3 GRAND FINALS
            </span>
            <span className="flex items-center gap-1.5 text-sky-400">
              <span className="h-2 w-2 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
              4-8 SURVIVAL
            </span>
            <span className="flex items-center gap-1.5 text-rose-400">
              <span className="h-2 w-2 rounded-full bg-rose-500" />
              9-16 RED ZONE
            </span>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="w-full overflow-x-auto scrollbar-none">
          <table className="w-full text-left text-xs font-medium border-collapse min-w-[320px] sm:min-w-full select-none">
            <thead>
              <tr className="border-b border-white/10 text-[10px] uppercase tracking-wider text-slate-400">
                <th className="pb-3 text-center w-8 sm:w-10 whitespace-nowrap">POS</th>
                <th className="pb-3 pl-2 sm:pl-3 whitespace-nowrap">TIM</th>
                <th className="pb-3 text-center hidden md:table-cell px-2 whitespace-nowrap">MN</th>
                <th className="pb-3 text-center text-amber-400 px-3 whitespace-nowrap">WWCD</th>
                <th className="pb-3 text-center hidden sm:table-cell px-2 whitespace-nowrap">RANK PTS</th>
                <th className="pb-3 text-center hidden sm:table-cell px-2 whitespace-nowrap">ELIM PTS</th>
                <th className="pb-3 text-right pr-2 sm:pr-4 font-bold text-white whitespace-nowrap">TOTAL PTS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-sans">
              {standings.map((team) => {
                const rank = team.rank ?? 0;
                const isGrandFinals = rank <= 3;
                const isSurvival = rank >= 4 && rank <= 8;

                return (
                  <tr
                    key={team.teamId}
                    className={`group transition-all hover:bg-white/[0.05] ${
                      rank === 1
                        ? 'bg-amber-400/[0.06]'
                        : isGrandFinals
                        ? 'bg-emerald-500/[0.03]'
                        : isSurvival
                        ? 'bg-sky-500/[0.02]'
                        : 'bg-rose-500/[0.01]'
                    }`}
                  >
                    {/* Rank Indicator */}
                    <td className="py-2.5 text-center whitespace-nowrap">
                      <span
                        className={`inline-flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-lg font-mono font-black text-xs ${
                          rank === 1
                            ? 'bg-amber-400 text-black shadow-[0_0_12px_rgba(251,191,36,0.5)]'
                            : isGrandFinals
                            ? 'bg-emerald-400/20 text-emerald-300 ring-1 ring-emerald-400/40'
                            : isSurvival
                            ? 'bg-sky-400/20 text-sky-300 ring-1 ring-sky-400/40'
                            : 'bg-slate-800/80 text-slate-400'
                        }`}
                      >
                        {rank}
                      </span>
                    </td>

                    {/* Team Info */}
                    <td className="py-2.5 pl-2 sm:pl-3 whitespace-nowrap">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <span className="rounded border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[10px] sm:text-[11px] font-bold text-slate-300 group-hover:border-amber-400/50 group-hover:text-amber-400 shrink-0">
                          {team.teamCode}
                        </span>
                        <span className="font-bold text-white tracking-wide text-xs sm:text-sm truncate max-w-[110px] sm:max-w-[160px] md:max-w-none">
                          {team.teamName}
                        </span>
                      </div>
                    </td>

                    {/* Matches Played */}
                    <td className="py-2.5 text-center font-mono text-slate-400 hidden md:table-cell px-2 whitespace-nowrap tabular-nums">
                      {team.matchesPlayed}
                    </td>

                    {/* WWCD */}
                    <td className="py-2.5 text-center font-mono font-black text-amber-400 text-xs sm:text-sm px-3 whitespace-nowrap tabular-nums">
                      {team.wwcd}x
                    </td>

                    {/* Rank Points */}
                    <td className="py-2.5 text-center font-mono text-slate-300 hidden sm:table-cell px-2 whitespace-nowrap text-xs tabular-nums">
                      {team.rankPoints}
                    </td>

                    {/* Elim Points */}
                    <td className="py-2.5 text-center font-mono text-slate-300 hidden sm:table-cell px-2 whitespace-nowrap text-xs tabular-nums">
                      {team.elimPoints}
                    </td>

                    {/* Total Points */}
                    <td className="py-2.5 text-right pr-2 sm:pr-4 font-mono font-black text-xs sm:text-sm text-white whitespace-nowrap tabular-nums">
                      <span className="inline-block min-w-[32px] text-center px-2 py-0.5 rounded bg-white/10 border border-white/10">
                        {team.totalPoints}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Leaderboard Footer */}
      <div className="mt-4 sm:mt-6 flex items-center justify-between border-t border-white/10 pt-3 text-[10px] text-slate-400">
        <span className="text-emerald-400 uppercase">TOP 3 ADVANCE TO GRAND FINALS</span>
        <span className="text-slate-500 uppercase">PMWC 10-PTS SYSTEM</span>
      </div>
    </div>
  );
}