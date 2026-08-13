// src/components/valorant/ValorantStandingsTable.tsx
'use client';

import { ValorantStanding } from '@/lib/valorantCalculator';

interface ValorantStandingsTableProps {
  standings: ValorantStanding[];
  groupName: string;
}

export default function ValorantStandingsTable({ standings, groupName }: ValorantStandingsTableProps) {
  return (
    <div className="flex h-full flex-col justify-between rounded-2xl border border-cyan-500/20 bg-slate-950/80 p-5 shadow-2xl backdrop-blur-2xl">
      <div>
        {/* Header Section */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-cyan-500/20 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
              <h2 className="font-mono text-xs font-black uppercase tracking-widest text-slate-100">
                Group {groupName} Standings
              </h2>
            </div>
            <p className="mt-1 font-mono text-[10px] text-slate-400">
              VCT TIEBREAKER: MATCH WINS // MAP DIFF // ROUND DIFF
            </p>
          </div>

          <div className="flex items-center gap-3 font-mono text-[10px] font-bold uppercase">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
              PLAYOFFS (TOP 3)
            </span>
            <span className="flex items-center gap-1.5 text-rose-400">
              <span className="h-2 w-2 rounded-full bg-rose-500" />
              ELIMINATED
            </span>
          </div>
        </div>

        {/* Table Area */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-medium">
            <thead>
              <tr className="border-b border-white/10 font-mono text-[10px] uppercase tracking-wider text-slate-400">
                <th className="pb-3 text-center w-8">POS</th>
                <th className="pb-3 pl-2">TIM</th>
                <th className="pb-3 text-center">MATCH</th>
                <th className="pb-3 text-center">MAPS (W-L)</th>
                <th className="pb-3 text-center text-cyan-400">MAP DIFF</th>
                <th className="pb-3 text-center font-bold text-white">ROUND DIFF</th>
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
                    <td className="py-2.5 text-center">
                      <span
                        className={`inline-flex h-6 w-6 items-center justify-center rounded font-mono font-black text-xs ${
                          isPlayoffs
                            ? 'bg-cyan-400/20 text-cyan-300 ring-1 ring-cyan-400/40 shadow-[0_0_10px_rgba(34,211,238,0.2)]'
                            : 'bg-slate-800/80 text-slate-400'
                        }`}
                      >
                        {rank}
                      </span>
                    </td>

                    <td className="py-2.5 pl-2">
                      <div className="flex items-center gap-2.5">
                        <span className="rounded border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[11px] font-bold text-slate-300 group-hover:border-cyan-400/50 group-hover:text-cyan-400">
                          {team.teamCode}
                        </span>
                        <span className="font-extrabold text-white tracking-wide truncate max-w-[140px]">
                          {team.teamName}
                        </span>
                      </div>
                    </td>

                    <td className="py-2.5 text-center font-mono font-bold">
                      <span className="text-cyan-400">{team.matchWins}</span>
                      <span className="text-slate-600 mx-1">-</span>
                      <span className="text-rose-400">{team.matchLosses}</span>
                    </td>

                    <td className="py-2.5 text-center font-mono text-slate-400">
                      {team.mapsWon} - {team.mapsLost}
                    </td>

                    <td className="py-2.5 text-center font-mono font-black text-xs">
                      <span
                        className={
                          team.mapDiff > 0
                            ? 'text-cyan-400'
                            : team.mapDiff < 0
                            ? 'text-rose-400'
                            : 'text-slate-400'
                        }
                      >
                        {team.mapDiff > 0 ? `+${team.mapDiff}` : team.mapDiff}
                      </span>
                    </td>

                    <td className="py-2.5 text-center font-mono font-black text-xs">
                      <span
                        className={
                          team.roundDiff > 0
                            ? 'text-emerald-400'
                            : team.roundDiff < 0
                            ? 'text-rose-400'
                            : 'text-slate-400'
                        }
                      >
                        {team.roundDiff > 0 ? `+${team.roundDiff}` : team.roundDiff}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 font-mono text-[10px] text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
          TOP 3 QUALIFY FOR VCT PACIFIC STAGE 1 PLAYOFFS
        </span>
        <span className="text-slate-500">BO3 SERIES FORMAT</span>
      </div>
    </div>
  );
}