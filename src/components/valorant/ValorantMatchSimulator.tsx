// src/components/valorant/ValorantMatchSimulator.tsx
'use client';

import { ValorantMatchData, ValorantTeam } from '@/lib/valorantCalculator';

interface ValorantMatchSimulatorProps {
  matches: ValorantMatchData[];
  teams: ValorantTeam[];
  onScoreChange: (
    matchId: string,
    homeMaps: number,
    awayMaps: number,
    homeRounds: number,
    awayRounds: number
  ) => void;
}

export default function ValorantMatchSimulator({
  matches,
  teams,
  onScoreChange,
}: ValorantMatchSimulatorProps) {
  return (
    <div className="flex h-full flex-col justify-between rounded-2xl border border-cyan-500/20 bg-slate-950/80 p-5 shadow-2xl backdrop-blur-2xl">
      <div>
        <div className="mb-4 flex items-center justify-between border-b border-cyan-500/20 pb-4">
          <h2 className="font-mono text-xs font-black uppercase tracking-widest text-slate-300">
            Simulasi Match VCT (BO3)
          </h2>
          <span className="font-mono text-[10px] font-bold text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded border border-cyan-400/20">
            BO3 MAP SERIES
          </span>
        </div>

        <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
          {matches.map((match) => {
            const home = teams.find((t) => t.id === match.homeTeamId);
            const away = teams.find((t) => t.id === match.awayTeamId);

            const homeName = home?.name || match.homeTeamId;
            const awayName = away?.name || match.awayTeamId;

            return (
              <div
                key={match.id}
                className="rounded-xl border border-white/10 bg-black/40 p-2.5 transition-all hover:border-cyan-500/30"
              >
                <div className="mb-2 flex items-center justify-between text-xs font-black tracking-wider">
                  <span className="text-white uppercase truncate max-w-[110px]">{homeName}</span>
                  <span className="rounded bg-cyan-400/10 text-cyan-300 px-1.5 py-0.5 font-mono text-[10px]">
                    GROUP {match.group}
                  </span>
                  <span className="text-white uppercase truncate max-w-[110px] text-right">{awayName}</span>
                </div>

                {/* Score Selector Buttons */}
                <div className="grid grid-cols-4 gap-1 rounded-lg bg-slate-900/90 p-1 ring-1 ring-white/10">
                  {[
                    { hm: 2, am: 0, hr: 26, ar: 14 },
                    { hm: 2, am: 1, hr: 32, ar: 28 },
                    { hm: 1, am: 2, hr: 28, ar: 32 },
                    { hm: 0, am: 2, hr: 14, ar: 26 },
                  ].map((score) => {
                    const isActive =
                      match.isCompleted &&
                      match.homeMaps === score.hm &&
                      match.awayMaps === score.am;

                    return (
                      <button
                        key={`${score.hm}-${score.am}`}
                        onClick={() =>
                          onScoreChange(match.id, score.hm, score.am, score.hr, score.ar)
                        }
                        className={`rounded-md py-1 font-mono text-xs font-black transition-all active:scale-95 ${
                          isActive
                            ? 'bg-cyan-400 text-black shadow-[0_0_15px_rgba(34,211,238,0.4)] ring-1 ring-cyan-300'
                            : 'text-slate-400 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        {score.hm} - {score.am}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-white/10 text-center font-mono text-[10px] text-slate-500">
        KLIK SKOR MAP UNTUK MEMPERBARUI KLASEMEN GROUP
      </div>
    </div>
  );
}