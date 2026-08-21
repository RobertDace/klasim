// src/components/tournament/MatchSimulator.tsx
'use client';

import { useState } from 'react';
import { MatchData, TeamData } from '@/lib/calculator';

interface MatchWithTeams extends MatchData {
  homeTeam?: TeamData;
  awayTeam?: TeamData;
  homeTeamId: string;
  awayTeamId: string;
  week: number;
}

interface MatchSimulatorProps {
  matches: MatchWithTeams[];
  onScoreChange: (matchId: string, homeScore: number, awayScore: number) => void;
}

export default function MatchSimulator({ matches, onScoreChange }: MatchSimulatorProps) {
  const matchesByWeek = matches.reduce<Record<number, MatchWithTeams[]>>((acc, match) => {
    if (!acc[match.week]) acc[match.week] = [];
    acc[match.week].push(match);
    return acc;
  }, {});

  const weeks = Object.keys(matchesByWeek).map(Number);
  const [activeWeek, setActiveWeek] = useState<number>(weeks[0] || 1);

  const currentMatches = matchesByWeek[activeWeek] || [];

  return (
    <div className="flex h-full flex-col justify-between rounded-2xl border border-white/10 bg-slate-950/70 p-3.5 sm:p-6 shadow-2xl backdrop-blur-2xl font-mono">
      <div>
        {/* Header Panel */}
        <div className="mb-3.5 sm:mb-4 flex items-center justify-between border-b border-white/10 pb-3 sm:pb-4">
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-300">
            Simulasi Match
          </h2>
          <span className="text-[9px] sm:text-[10px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
            WEEK {activeWeek} OF {weeks.length || 1}
          </span>
        </div>

        {/* Tab Selector Minggu (Horizontal Scroll Rail) */}
        <div className="mb-3.5 sm:mb-4 flex items-center gap-1 rounded-xl bg-black/50 p-1 border border-white/5 overflow-x-auto scrollbar-none">
          {weeks.map((week) => {
            const isSelected = activeWeek === week;
            return (
              <button
                key={week}
                onClick={() => setActiveWeek(week)}
                className={`flex-1 min-w-[32px] py-1 text-[11px] font-black rounded-lg transition-all active:scale-95 whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-amber-400 text-black shadow-[0_0_12px_rgba(251,191,36,0.3)] ring-1 ring-amber-300'
                    : 'text-slate-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                W{week}
              </button>
            );
          })}
        </div>

        {/* List Match Minggu Aktif */}
        <div className="space-y-2">
          {currentMatches.map((match) => {
            const homeName = match.homeTeam?.name || match.homeTeamId?.toUpperCase() || 'HOME';
            const awayName = match.awayTeam?.name || match.awayTeamId?.toUpperCase() || 'AWAY';
            const homeCode = match.homeTeam?.code || match.homeTeamId?.substring(0, 4).toUpperCase();
            const awayCode = match.awayTeam?.code || match.awayTeamId?.substring(0, 4).toUpperCase();

            return (
              <div
                key={match.id}
                className="rounded-xl border border-white/10 bg-black/40 p-2.5 transition-all hover:border-white/20"
              >
                <div className="mb-2 flex items-center justify-between text-xs font-black tracking-wider">
                  <div className="flex items-center gap-1.5 truncate max-w-[42%]">
                    <span className="text-[9px] px-1 py-0.5 rounded bg-white/10 text-slate-300 font-bold">
                      {homeCode}
                    </span>
                    <span className="text-white uppercase truncate text-[11px]" title={homeName}>
                      {homeName}
                    </span>
                  </div>

                  <span className="rounded bg-white/10 px-1.5 py-0.5 text-[9px] text-slate-400 shrink-0">
                    BO3
                  </span>

                  <div className="flex items-center gap-1.5 truncate max-w-[42%] justify-end text-right">
                    <span className="text-white uppercase truncate text-[11px]" title={awayName}>
                      {awayName}
                    </span>
                    <span className="text-[9px] px-1 py-0.5 rounded bg-white/10 text-slate-300 font-bold">
                      {awayCode}
                    </span>
                  </div>
                </div>

                {/* Segmented Control Buttons */}
                <div className="grid grid-cols-4 gap-1 rounded-lg bg-slate-900/90 p-1 ring-1 ring-white/10">
                  {[
                    { h: 2, a: 0 },
                    { h: 2, a: 1 },
                    { h: 1, a: 2 },
                    { h: 0, a: 2 },
                  ].map((score) => {
                    const isActive =
                      match.isCompleted &&
                      match.homeScore === score.h &&
                      match.awayScore === score.a;

                    return (
                      <button
                        key={`${score.h}-${score.a}`}
                        onClick={() => onScoreChange(match.id!, score.h, score.a)}
                        className={`rounded-md py-1.5 text-xs font-black transition-all active:scale-95 cursor-pointer ${
                          isActive
                            ? 'bg-amber-400 text-black shadow-[0_0_15px_rgba(251,191,36,0.4)] ring-1 ring-amber-300'
                            : 'text-slate-400 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        {score.h} - {score.a}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigasi Bawah Minggu */}
      <div className="mt-3.5 sm:mt-5 flex items-center justify-between border-t border-white/10 pt-2.5 sm:pt-3 text-xs">
        <button
          disabled={activeWeek <= 1}
          onClick={() => setActiveWeek((prev) => Math.max(1, prev - 1))}
          className="rounded border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-bold text-slate-300 transition-all hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >
          &larr; PREV
        </button>
        <span className="text-slate-500 text-[9px] sm:text-[10px] uppercase truncate px-1">
          KLIK SKOR UNTUK UPDATE
        </span>
        <button
          disabled={activeWeek >= weeks.length}
          onClick={() => setActiveWeek((prev) => Math.min(weeks.length, prev + 1))}
          className="rounded border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-bold text-slate-300 transition-all hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >
          NEXT &rarr;
        </button>
      </div>
    </div>
  );
}