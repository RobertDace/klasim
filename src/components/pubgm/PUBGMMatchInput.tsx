// src/components/pubgm/PUBGMMatchInput.tsx
'use client';

import { useState } from 'react';
import { PUBGMTeam, PUBGMMatchResult } from '@/lib/pubgmCalculator';

interface PUBGMMatchInputProps {
  teams: PUBGMTeam[];
  onAddMatch: (newMatch: PUBGMMatchResult) => void;
  existingMatchesCount: number;
}

const MAP_CONFIGS = [
  { name: 'Erangel', color: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10' },
  { name: 'Miramar', color: 'border-amber-500/40 text-amber-400 bg-amber-500/10' },
  { name: 'Sanhok', color: 'border-teal-500/40 text-teal-400 bg-teal-500/10' },
  { name: 'Vikendi', color: 'border-sky-500/40 text-sky-400 bg-sky-500/10' },
];

export default function PUBGMMatchInput({
  teams,
  onAddMatch,
  existingMatchesCount,
}: PUBGMMatchInputProps) {
  const [selectedMapIndex, setSelectedMapIndex] = useState(0);

  // Inisialisasi awal peringkat 1 s/d 16 secara eksplisit tanpa duplikat
  const [teamInputs, setTeamInputs] = useState<Record<string, { rank: number; kills: number }>>(
    () => {
      const initial: Record<string, { rank: number; kills: number }> = {};
      teams.forEach((team, idx) => {
        initial[team.id] = { rank: idx + 1, kills: 0 };
      });
      return initial;
    }
  );

  const activeMap = MAP_CONFIGS[selectedMapIndex];

  // Logic Auto-Swap: Mencegah Duplikasi Peringkat
  const handleRankChange = (teamId: string, targetRankInput: number) => {
    const targetRank = Math.max(1, Math.min(teams.length, targetRankInput));

    setTeamInputs((prev) => {
      const currentOldRank = prev[teamId]?.rank || teams.length;
      if (currentOldRank === targetRank) return prev;

      const updated = { ...prev };

      // Cari tim lain yang saat ini menduduki targetRank
      const conflictingTeamId = Object.keys(updated).find(
        (id) => id !== teamId && updated[id]?.rank === targetRank
      );

      // Tukar (swap) peringkat tim lain ke peringkat lama tim ini
      if (conflictingTeamId) {
        updated[conflictingTeamId] = {
          ...updated[conflictingTeamId],
          rank: currentOldRank,
        };
      }

      updated[teamId] = {
        ...updated[teamId],
        rank: targetRank,
      };

      return updated;
    });
  };

  const handleKillsChange = (teamId: string, kills: number) => {
    setTeamInputs((prev) => ({
      ...prev,
      [teamId]: { ...prev[teamId], kills: Math.max(0, kills) },
    }));
  };

  // Auto-Generate Simulasi Match Acak Tanpa Duplikat
  const handleAutoSimulateMatch = () => {
    const shuffledTeams = [...teams].sort(() => Math.random() - 0.5);
    const simulatedInputs: Record<string, { rank: number; kills: number }> = {};

    shuffledTeams.forEach((team, idx) => {
      const rank = idx + 1;
      const kills = rank <= 3 ? Math.floor(Math.random() * 8) + 4 : Math.floor(Math.random() * 4);
      simulatedInputs[team.id] = { rank, kills };
    });

    setTeamInputs(simulatedInputs);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const results: PUBGMMatchResult = {
      matchId: `pubgm_m_${Date.now()}`,
      mapName: activeMap.name,
      matchNumber: existingMatchesCount + 1,
      teamResults: teams.map((team) => ({
        teamId: team.id,
        rank: teamInputs[team.id]?.rank || teams.length,
        kills: teamInputs[team.id]?.kills || 0,
      })),
    };

    onAddMatch(results);
    setSelectedMapIndex((prev) => (prev + 1) % MAP_CONFIGS.length);
  };

  // Urutkan daftar tim berdasarkan peringkat saat ini (1 s/d 16)
  const sortedTeams = [...teams].sort(
    (a, b) => (teamInputs[a.id]?.rank || 99) - (teamInputs[b.id]?.rank || 99)
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="flex h-full flex-col justify-between rounded-2xl border border-white/10 bg-slate-950/70 p-5 shadow-2xl backdrop-blur-2xl"
    >
      <div>
        {/* Header Operasi Match */}
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div>
            <h3 className="font-mono text-xs font-black uppercase tracking-widest text-slate-200">
              Input Result Match #{existingMatchesCount + 1}
            </h3>
            <p className="mt-0.5 font-mono text-[10px] text-slate-400">
              PERINGKAT OTOMATIS SWAP (NO DUPLICATE)
            </p>
          </div>

          <button
            type="button"
            onClick={handleAutoSimulateMatch}
            className="rounded-lg border border-amber-400/30 bg-amber-400/10 px-2 py-1 font-mono text-[10px] font-bold text-amber-400 hover:bg-amber-400/20 active:scale-95 transition-all"
          >
            AUTO-FILL RESULT
          </button>
        </div>

        {/* Map Selector Pills */}
        <div className="mb-3 grid grid-cols-4 gap-1.5 rounded-xl bg-black/50 p-1 border border-white/5">
          {MAP_CONFIGS.map((map, idx) => {
            const isSelected = selectedMapIndex === idx;
            return (
              <button
                key={map.name}
                type="button"
                onClick={() => setSelectedMapIndex(idx)}
                className={`py-1 font-mono text-xs font-bold rounded-lg transition-all active:scale-95 ${
                  isSelected
                    ? `${map.color} border ring-1`
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                {map.name}
              </button>
            );
          })}
        </div>

        {/* List Team Ranks (Terurut 1 s/d 16 & Auto-Swap) */}
        <div className="space-y-1.5">
          {sortedTeams.map((team) => {
            const currentRank = teamInputs[team.id]?.rank || 16;

            return (
              <div
                key={team.id}
                className="flex items-center justify-between gap-2 rounded-lg border border-white/5 bg-black/40 px-2 py-1 text-xs font-mono transition-all hover:border-white/15"
              >
                <div className="flex items-center gap-2">
                  <span className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-bold text-[10px] text-slate-300">
                    {team.code}
                  </span>
                  <span className="font-bold text-white truncate max-w-[120px]">{team.name}</span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Controls Peringkat / Swap */}
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-slate-500">RANK</span>
                    <div className="flex items-center gap-0.5">
                      <button
                        type="button"
                        disabled={currentRank <= 1}
                        onClick={() => handleRankChange(team.id, currentRank - 1)}
                        className="rounded bg-white/5 px-1 py-0.5 text-[10px] font-bold text-slate-300 hover:bg-amber-400 hover:text-black disabled:opacity-20"
                      >
                        ▲
                      </button>
                      <input
                        type="number"
                        min="1"
                        max={teams.length}
                        value={currentRank}
                        onChange={(e) => handleRankChange(team.id, parseInt(e.target.value) || 1)}
                        className="w-10 rounded border border-white/15 bg-slate-900 py-0.5 text-center font-bold text-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
                      />
                      <button
                        type="button"
                        disabled={currentRank >= teams.length}
                        onClick={() => handleRankChange(team.id, currentRank + 1)}
                        className="rounded bg-white/5 px-1 py-0.5 text-[10px] font-bold text-slate-300 hover:bg-amber-400 hover:text-black disabled:opacity-20"
                      >
                        ▼
                      </button>
                    </div>
                  </div>

                  {/* Input Kill */}
                  <div className="flex items-center gap-1 ml-1">
                    <span className="text-[10px] text-slate-500">KILLS</span>
                    <input
                      type="number"
                      min="0"
                      value={teamInputs[team.id]?.kills || 0}
                      onChange={(e) => handleKillsChange(team.id, parseInt(e.target.value) || 0)}
                      className="w-10 rounded border border-white/15 bg-slate-900 py-0.5 text-center font-bold text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Submit Action */}
      <div className="mt-4 pt-2.5 border-t border-white/10">
        <button
          type="submit"
          className="w-full rounded-xl bg-amber-400 py-2.5 font-mono text-xs font-black uppercase text-black transition-all hover:bg-amber-300 active:scale-95 shadow-lg shadow-amber-400/20"
        >
          SIMPAN HASIL MATCH #{existingMatchesCount + 1} ({activeMap.name.toUpperCase()})
        </button>
      </div>
    </form>
  );
}