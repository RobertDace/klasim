// src/components/tournament/ScenarioSolverView.tsx
'use client';

import { useState, useMemo } from 'react';
import { TeamData, MatchData } from '@/lib/calculator';
import { solveMPLScenario, TargetGoal, SolverResult } from '@/lib/scenarioSolver';

interface ScenarioSolverViewProps {
  teams: TeamData[];
  matches: MatchData[];
  onApplyScenario: (updatedMatches: MatchData[]) => void;
}

export default function ScenarioSolverView({
  teams,
  matches,
  onApplyScenario,
}: ScenarioSolverViewProps) {
  const [selectedTeamId, setSelectedTeamId] = useState<string>(teams[0]?.id || '');
  const [selectedGoal, setSelectedGoal] = useState<TargetGoal>('TOP_2');
  const [appliedToast, setAppliedToast] = useState(false);

  // Komputasi Solver secara real-time
  const solverResult: SolverResult = useMemo(() => {
    return solveMPLScenario(teams, matches, selectedTeamId, selectedGoal);
  }, [teams, matches, selectedTeamId, selectedGoal]);

  const handleApply = () => {
    onApplyScenario(solverResult.appliedMatches);
    setAppliedToast(true);
    setTimeout(() => setAppliedToast(false), 3000);
  };

  const selectedTeam = teams.find((t) => t.id === selectedTeamId) || teams[0];

  const goalsList: { id: TargetGoal; label: string; desc: string; rankTarget: string }[] = [
    { id: 'RANK_1', label: 'JUARA REGULAR', desc: 'Finis di Peringkat #1', rankTarget: '#1' },
    { id: 'TOP_2', label: 'UPPER BRACKET', desc: 'Kunci Slot Top 2 Playoff', rankTarget: '#1 - #2' },
    { id: 'TOP_6', label: 'TIKET PLAYOFF', desc: 'Lolos ke Babak Playoff', rankTarget: '#1 - #6' },
    { id: 'AVOID_ELIM', label: 'BEBAS DEGRADASI', desc: 'Hindari 3 Posisi Terbawah', rankTarget: '#1 - #6' },
  ];

  // Sisa pertandingan yang direkomendasikan skornya
  const unplayedMatches = matches.filter((m) => !m.isCompleted);
  const recommendedMatches = solverResult.appliedMatches.filter((m) =>
    unplayedMatches.some((u) => u.id === m.id)
  );

  return (
    <div className="space-y-6 font-mono select-none">
      {/* Toast Notifikasi Penerapan Skenario */}
      {appliedToast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-2xl border border-emerald-400/50 bg-slate-950/95 p-4 shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom-5 duration-300">
          <div className="flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-400 font-black text-black text-xs">
              ✓
            </span>
            <div>
              <div className="text-xs font-black uppercase text-emerald-400 font-sans">
                SKENARIO BERHASIL DITERAPKAN!
              </div>
              <div className="text-[10px] text-slate-400">
                Skor pertandingan tersisa telah diisi ke simulator aktif.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header Solver */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-amber-400 mb-1">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
            REVERSE TIEBREAKER SOLVER
          </div>
          <h2 className="text-xl sm:text-2xl font-black uppercase text-white tracking-tight font-sans">
            WHAT-IF GOAL FINDER
          </h2>
          <p className="text-xs text-slate-400">
            Pilih tim target dan posisi yang diinginkan. Sistem otomatis menghitung kombinasi hasil sisa match yang dibutuhkan.
          </p>
        </div>

        <div className="flex items-center gap-2 text-[10px] text-slate-500">
          <span>SISA MATCH:</span>
          <strong className="text-white bg-white/10 px-2 py-0.5 rounded">
            {unplayedMatches.length} Pertandingan
          </strong>
        </div>
      </div>

      {/* 1. SELEKTOR TIM & TARGET GOAL */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Pilih Tim (Col 6) */}
        <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-4 sm:p-5 backdrop-blur-xl lg:col-span-6 space-y-3">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            01 // PILIH TIM TARGET
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {teams.map((t) => {
              const isSelected = selectedTeamId === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setSelectedTeamId(t.id)}
                  className={`flex items-center gap-2 rounded-xl border p-2.5 text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-amber-400 bg-amber-400/15 shadow-md shadow-amber-400/10'
                      : 'border-white/10 bg-black/40 hover:border-white/20 active:scale-95'
                  }`}
                >
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded font-bold text-xs shrink-0 ${
                      isSelected ? 'bg-amber-400 text-black font-black' : 'bg-white/10 text-slate-300'
                    }`}
                  >
                    {t.code}
                  </div>
                  <div className="truncate">
                    <span
                      className={`block text-[11px] font-bold truncate ${
                        isSelected ? 'text-amber-400' : 'text-white'
                      }`}
                    >
                      {t.name}
                    </span>
                    <span className="block text-[8px] text-slate-500 uppercase">{t.code}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Pilih Target Goal (Col 6) */}
        <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-4 sm:p-5 backdrop-blur-xl lg:col-span-6 space-y-3">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            02 // PILIH TARGET POSISI
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {goalsList.map((g) => {
              const isSelected = selectedGoal === g.id;
              return (
                <button
                  key={g.id}
                  onClick={() => setSelectedGoal(g.id)}
                  className={`flex flex-col justify-between rounded-xl border p-3 text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-amber-400 bg-amber-400/15 shadow-md shadow-amber-400/10'
                      : 'border-white/10 bg-black/40 hover:border-white/20 active:scale-95'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-black uppercase font-sans ${
                        isSelected ? 'text-amber-400' : 'text-white'
                      }`}
                    >
                      {g.label}
                    </span>
                    <span className="rounded bg-white/10 px-1.5 py-0.5 text-[9px] font-bold text-slate-400">
                      {g.rankTarget}
                    </span>
                  </div>
                  <span className="mt-1 text-[10px] text-slate-400 leading-tight">{g.desc}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. HASIL ANALISIS KELAYAKAN (SOLVER REPORT) */}
      <div className="rounded-2xl border border-white/10 bg-slate-950/90 p-5 sm:p-6 backdrop-blur-2xl space-y-5">
        {/* Status Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl font-black text-sm ${
                solverResult.status === 'GUARANTEED'
                  ? 'bg-emerald-400 text-black shadow-lg shadow-emerald-400/20'
                  : solverResult.status === 'FEASIBLE'
                  ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
                  : 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
              }`}
            >
              {solverResult.status === 'GUARANTEED' ? '✓' : solverResult.status === 'FEASIBLE' ? '⚡️' : '✕'}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded border ${
                    solverResult.status === 'GUARANTEED'
                      ? 'bg-emerald-400/10 text-emerald-400 border-emerald-400/30'
                      : solverResult.status === 'FEASIBLE'
                      ? 'bg-amber-400/10 text-amber-400 border-amber-400/30'
                      : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                  }`}
                >
                  {solverResult.status === 'GUARANTEED'
                    ? 'STATUS: TERJAMIN MATEMATIS'
                    : solverResult.status === 'FEASIBLE'
                    ? 'STATUS: BISA DICAPAI (BERSYARAT)'
                    : 'STATUS: TIDAK MUNGKIN SECARA MATEMATIS'}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black uppercase text-white font-sans mt-0.5">
                {selectedTeam?.name} &rarr; Target {goalsList.find((g) => g.id === selectedGoal)?.label}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div>
              <span className="text-[9px] text-slate-500 block uppercase">Jangkauan Rank</span>
              <span className="font-bold text-slate-200">
                Rank #{solverResult.bestAchievableRank} (Terbaik) &ndash; #{solverResult.worstAchievableRank} (Terburuk)
              </span>
            </div>
          </div>
        </div>

        {/* Narrative Box */}
        <div
          className={`rounded-xl border p-4 text-xs sm:text-sm leading-relaxed ${
            solverResult.status === 'GUARANTEED'
              ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300'
              : solverResult.status === 'FEASIBLE'
              ? 'border-amber-400/30 bg-amber-400/10 text-amber-300'
              : 'border-rose-500/30 bg-rose-500/10 text-rose-300'
          }`}
        >
          <div className="font-bold uppercase text-[10px] tracking-wider mb-1 opacity-80">
            KESIMPULAN TELEMETRY ENGINE:
          </div>
          {solverResult.summaryNarrative}
        </div>

        {/* 2 Kolom Persyaratan (Syarat Tim Sendiri vs Syarat Tim Rival) */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Kolom 1: Syarat Tim Target */}
          <div className="rounded-xl border border-white/10 bg-black/50 p-4 space-y-2">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-amber-400 border-b border-white/10 pb-2">
              <span>🎯</span>
              <span>SYARAT {selectedTeam?.name.toUpperCase()}</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {solverResult.ownRequirements.map((req, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom 2: Syarat Tim Pesaing / Eksternal */}
          <div className="rounded-xl border border-white/10 bg-black/50 p-4 space-y-2">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-sky-400 border-b border-white/10 pb-2">
              <span>⚔️</span>
              <span>SYARAT HASIL TIM RIVAL</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {solverResult.rivalRequirements.map((req, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-sky-400 font-bold">•</span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 3. DAFTAR SKOR PERTANDINGAN YANG DIREKOMENDASIKAN */}
        {recommendedMatches.length > 0 && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs text-slate-400 border-b border-white/10 pb-2">
              <span>PROYEKSI SKOR REKOMENDASI ({recommendedMatches.length} MATCH)</span>
              <span className="text-[10px] text-slate-500">FORMAT: BEST OF 3</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {recommendedMatches.map((m) => {
                const homeTeam = teams.find((t) => t.id === m.homeTeamId);
                const awayTeam = teams.find((t) => t.id === m.awayTeamId);
                const isTargetMatch = m.homeTeamId === selectedTeamId || m.awayTeamId === selectedTeamId;

                return (
                  <div
                    key={m.id}
                    className={`flex items-center justify-between rounded-xl border p-3 text-xs ${
                      isTargetMatch
                        ? 'border-amber-400/40 bg-amber-400/5'
                        : 'border-white/5 bg-black/40'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate max-w-[42%]">
                      <span className="font-bold text-white truncate">{homeTeam?.code || 'HOME'}</span>
                    </div>

                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-black/60 font-black tabular-nums border border-white/10">
                      <span className={m.homeScore > m.awayScore ? 'text-amber-400' : 'text-slate-400'}>
                        {m.homeScore}
                      </span>
                      <span className="text-slate-600">:</span>
                      <span className={m.awayScore > m.homeScore ? 'text-amber-400' : 'text-slate-400'}>
                        {m.awayScore}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 truncate max-w-[42%] justify-end">
                      <span className="font-bold text-white truncate">{awayTeam?.code || 'AWAY'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 4. TOMBOL ACTION TERAPKAN SKENARIO */}
        <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[10px] text-slate-400 text-center sm:text-left">
            Klik tombol untuk memasukkan seluruh skor rekomendasi di atas langsung ke simulator.
          </div>

          <button
            onClick={handleApply}
            disabled={solverResult.status === 'IMPOSSIBLE'}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-6 py-3.5 text-xs font-black uppercase text-black transition-all hover:bg-amber-300 active:scale-95 shadow-xl shadow-amber-400/20 disabled:opacity-30 cursor-pointer"
          >
            <span>⚡️ TERAPKAN SKENARIO KE SIMULATOR</span>
          </button>
        </div>
      </div>
    </div>
  );
}

