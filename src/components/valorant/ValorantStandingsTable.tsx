// src/components/valorant/ValorantStandingsTable.tsx
'use client';

import { ValorantStanding } from '@/lib/valorantCalculator';

interface ValorantStandingsTableProps {
  standings: ValorantStanding[];
  groupName: string;
}

export default function ValorantStandingsTable({ standings, groupName }: ValorantStandingsTableProps) {
  return (
    <div className="flex h-full flex-col justify-between rounded-2xl border border-cyan-500/20 bg-slate-950/80 p-4 sm:p-6 shadow-2xl backdrop-blur-2xl font-mono">
      <div>
        {/* Header Section */}
        <div className="mb-4 sm:mb-6 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between border-b border-cyan-500/20 pb-3.5 sm:pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
              <h2 className="text-xs sm:text-sm font-black uppercase tracking-widest text-slate-100 font-sans">
                Group {groupName} Standings
              </h2>
            </div>
            <p className="mt-1 text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-wider">
              VCT TIEBREAKER: MATCH WINS // MAP DIFF // ROUND DIFF
            </p>
          </div>

          <div className="flex items-center gap-3 text-[9px] sm:text-[10px] font-bold uppercase">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
              PLAYOFFS (1-3)
            </span>
            <span className="flex items-center gap-1.5 text-rose-400">
              <span className="h-2 w-2 rounded-full bg-rose-500" />
              GUGUR (4-6)
            </span>
          </div>
        </div>

        {/* Table Area */}
        <div className="w-full overflow-x-auto scrollbar-none">
          <table className="w-full text-left text-xs font-medium border-collapse min-w-[320px] sm:min-w-full select-none">
            <thead>
              <tr className="border-b border-white/10 text-[10px] uppercase tracking-wider text-slate-400">
                <th className="pb-3 text-center w-8 sm:w-10 whitespace-nowrap">POS</th>
                <th className="pb-3 pl-2 sm:pl-3 whitespace-nowrap">TIM</th>
                <th className="pb-3 text-center px-3 whitespace-nowrap">MATCH</th>
                <th className="pb-3 text-center hidden sm:table-cell px-2 whitespace-nowrap">MAPS (W-L)</th>
                <th className="pb-3 text-center text-cyan-400 px-3 whitespace-nowrap">MAP DIFF</th>
                <th className="pb-3 text-center font-bold text-white hidden sm:table-cell px-2 whitespace-nowrap">ROUND DIFF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-sans">
              {standings.map((team) => {
                const rank = team.rank ?? 0;
                const isPlayoffs = rank <= 3;

                return (
                  <tr
                    key={team.teamId}
                    className={`group transition-all hover:bg-white/[0.04] ${
                      isPlayoffs ? 'bg-cyan-500/[0.03]' : 'bg-rose-500/[0.01]'
                    }`}
                  >
                    <td className="py-3 text-center whitespace-nowrap">
                      <span
                        className={`inline-flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-lg font-mono font-black text-xs ${
                          isPlayoffs
                            ? 'bg-cyan-400/20 text-cyan-300 ring-1 ring-cyan-400/40 shadow-[0_0_10px_rgba(34,211,238,0.2)]'
                            : 'bg-slate-800/80 text-slate-400'
                        }`}
                      >
                        {rank}
                      </span>
                    </td>

                    <td className="py-3 pl-2 sm:pl-3 whitespace-nowrap">
                      <div className="flex items-center gap-2 sm:gap-2.5">
                        <span className="rounded border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[10px] sm:text-[11px] font-bold text-slate-300 group-hover:border-cyan-400/50 group-hover:text-cyan-400 shrink-0">
                          {team.teamCode}
                        </span>
                        <span className="font-extrabold text-white tracking-wide text-xs sm:text-sm truncate max-w-[110px] sm:max-w-[160px] md:max-w-none">
                          {team.teamName}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 text-center font-mono font-bold text-xs sm:text-sm px-3 whitespace-nowrap tabular-nums">
                      <span className="text-cyan-400">{team.matchWins}</span>
                      <span className="text-slate-600 mx-1">-</span>
                      <span className="text-rose-400">{team.matchLosses}</span>
                    </td>

                    <td className="py-3 text-center font-mono text-slate-400 hidden sm:table-cell px-2 whitespace-nowrap text-xs tabular-nums">
                      {team.mapsWon} - {team.mapsLost}
                    </td>

                    <td className="py-3 text-center font-mono font-black text-xs sm:text-sm px-3 whitespace-nowrap tabular-nums">
                      <span
                        className={`inline-block min-w-[28px] text-center px-1.5 py-0.5 rounded ${
                          team.mapDiff > 0
                            ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                            : team.mapDiff < 0
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                            : 'bg-white/5 text-slate-400'
                        }`}
                      >
                        {team.mapDiff > 0 ? `+${team.mapDiff}` : team.mapDiff}
                      </span>
                    </td>

                    <td className="py-3 text-center font-mono text-slate-300 hidden sm:table-cell px-2 whitespace-nowrap text-xs tabular-nums">
                      {team.roundDiff > 0 ? `+${team.roundDiff}` : team.roundDiff}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-4 sm:mt-6 flex items-center justify-between border-t border-cyan-500/20 pt-3 text-[10px] font-mono text-slate-400">
        <span className="text-cyan-400">TOP 3 LOLOS KE PLAYOFF DOUBLE ELIMINATION</span>
        <span className="text-slate-500">GROUP {groupName}</span>
      </div>
    </div>
  );
}