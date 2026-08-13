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
    <div className="flex h-full flex-col justify-between rounded-2xl border border-white/10 bg-slate-950/80 p-5 shadow-2xl backdrop-blur-2xl font-sans">
      <div>
        {/* Header Broadcast HUD */}
        <div className="mb-4 border-b border-white/10 pb-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                <h2 className="font-mono text-xs font-black uppercase tracking-widest text-slate-100">
                  PMWC Overall Leaderboard
                </h2>
              </div>
              <p className="mt-1 font-mono text-[10px] text-slate-400 uppercase tracking-wider">
                Official PMWC 10-Point System // 1 Pt per Kill
              </p>
            </div>

            {/* Quick Telemetry Badges */}
            <div className="flex items-center gap-2 font-mono text-[10px]">
              <div className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-slate-300">
                MATCHES: <span className="font-bold text-amber-400">{totalLobbyMatches}</span>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-slate-300">
                TOTAL KILLS: <span className="font-bold text-amber-400">{totalLobbyKills}</span>
              </div>
            </div>
          </div>

          {/* Qualification Zone Legends */}
          <div className="mt-3 flex flex-wrap items-center justify-between border-t border-white/5 pt-2 font-mono text-[10px] font-bold uppercase">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              1-3 GRAND FINALS
            </span>
            <span className="flex items-center gap-1.5 text-sky-400">
              <span className="h-2 w-2 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
              4-8 SURVIVAL STAGE
            </span>
            <span className="flex items-center gap-1.5 text-rose-400">
              <span className="h-2 w-2 rounded-full bg-rose-500" />
              9-16 RED ZONE
            </span>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-medium">
            <thead>
              <tr className="border-b border-white/10 font-mono text-[10px] uppercase tracking-wider text-slate-400">
                <th className="pb-2.5 text-center w-8">POS</th>
                <th className="pb-2.5 pl-2">TIM</th>
                <th className="pb-2.5 text-center">MN</th>
                <th className="pb-2.5 text-center text-amber-400">WWCD</th>
                <th className="pb-2.5 text-center">RANK</th>
                <th className="pb-2.5 text-center">ELIM</th>
                <th className="pb-2.5 text-right pr-2 font-bold text-white">TOTAL PTS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {standings.map((team) => {
                const rank = team.rank ?? 0;
                const isGrandFinals = rank <= 3;
                const isSurvival = rank >= 4 && rank <= 8;
                const pointPercentage = maxPoints > 0 ? (team.totalPoints / maxPoints) * 100 : 0;

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
                    <td className="py-2 text-center">
                      <span
                        className={`inline-flex h-5 w-5 items-center justify-center rounded font-mono font-black text-[11px] ${
                          rank === 1
                            ? 'bg-amber-400 text-black ring-1 ring-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.4)]'
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

                    {/* Team Code & Full Name */}
                    <td className="py-2 pl-2">
                      <div className="flex items-center gap-2">
                        <span className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[10px] font-bold text-slate-300 group-hover:border-amber-400/50 group-hover:text-amber-400">
                          {team.teamCode}
                        </span>
                        <span className="font-extrabold text-white tracking-wide truncate max-w-[140px]">
                          {team.teamName}
                        </span>
                      </div>
                    </td>

                    <td className="py-2 text-center font-mono text-slate-400">{team.matchesPlayed}</td>

                    {/* WWCD Badge */}
                    <td className="py-2 text-center font-mono font-black">
                      {team.wwcd > 0 ? (
                        <span className="inline-flex items-center gap-1 rounded bg-amber-400/20 px-1.5 py-0.5 text-[10px] text-amber-300 ring-1 ring-amber-400/40">
                          <svg className="h-2.5 w-2.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          {team.wwcd}
                        </span>
                      ) : (
                        <span className="text-slate-600">0</span>
                      )}
                    </td>

                    <td className="py-2 text-center font-mono text-slate-300">{team.rankPoints}</td>
                    <td className="py-2 text-center font-mono text-slate-300">{team.elimPoints}</td>

                    {/* Total Points with Visual Progress Bar */}
                    <td className="py-2 pr-2 text-right">
                      <div className="relative inline-flex items-center justify-end w-20 h-6 rounded bg-slate-900 overflow-hidden border border-white/10 px-2">
                        {/* Visual Bar Fill */}
                        <div
                          className={`absolute left-0 top-0 bottom-0 transition-all duration-500 opacity-20 ${
                            rank === 1
                              ? 'bg-amber-400'
                              : isGrandFinals
                              ? 'bg-emerald-400'
                              : isSurvival
                              ? 'bg-sky-400'
                              : 'bg-slate-500'
                          }`}
                          style={{ width: `${pointPercentage}%` }}
                        />
                        <span className="relative z-10 font-mono font-black text-xs text-white">
                          {team.totalPoints}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Status Bar */}
      <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 font-mono text-[10px] text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          QUALIFIER STATUS ACTIVE
        </span>
        <span className="text-slate-500">PMWC OFFICIAL TIEBREAKER RULESET</span>
      </div>
    </div>
  );
}