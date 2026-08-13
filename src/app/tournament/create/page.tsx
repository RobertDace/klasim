// src/app/tournament/create/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { GameFormat, CustomTeam, saveCustomTournament } from '@/lib/customTournamentStore';

const PRESET_TEAMS: Record<GameFormat, CustomTeam[]> = {
  MOBA: [
    { id: 't1', name: 'Alpha Squad', code: 'ALP' },
    { id: 't2', name: 'Beta Warriors', code: 'BTW' },
    { id: 't3', name: 'Cyber Dragons', code: 'CDR' },
    { id: 't4', name: 'Delta Force', code: 'DTF' },
    { id: 't5', name: 'Echo Esports', code: 'ECH' },
    { id: 't6', name: 'Falcon Gaming', code: 'FLC' },
  ],
  BATTLE_ROYALE: Array.from({ length: 16 }).map((_, i) => ({
    id: `br_t${i + 1}`,
    name: `Team ${String.fromCharCode(65 + i)}`,
    code: `T${i + 1}`,
  })),
  FPS: [
    { id: 'fps_1', name: 'Aero Vanguard', code: 'AVG', group: 'A' },
    { id: 'fps_2', name: 'Blaze Syndicate', code: 'BLZ', group: 'A' },
    { id: 'fps_3', name: 'Cobalt Prime', code: 'CBL', group: 'A' },
    { id: 'fps_4', name: 'Dynasty Gaming', code: 'DYN', group: 'A' },
    { id: 'fps_5', name: 'Eclipse Esports', code: 'ECL', group: 'B' },
    { id: 'fps_6', name: 'Frostbite Legion', code: 'FST', group: 'B' },
    { id: 'fps_7', name: 'Ghost Protocol', code: 'GHS', group: 'B' },
    { id: 'fps_8', name: 'Hyperion Crew', code: 'HYP', group: 'B' },
  ],
};

export default function CreateTournamentPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [format, setFormat] = useState<GameFormat>('MOBA');
  const [teams, setTeams] = useState<CustomTeam[]>(PRESET_TEAMS.MOBA);

  const handleFormatChange = (newFormat: GameFormat) => {
    setFormat(newFormat);
    setTeams(PRESET_TEAMS[newFormat]);
  };

  const handleTeamChange = (id: string, field: 'name' | 'code', value: string) => {
    setTeams((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [field]: value } : t))
    );
  };

  const handleAddTeam = () => {
    const newId = `custom_t_${Date.now()}`;
    setTeams((prev) => [
      ...prev,
      {
        id: newId,
        name: `Team ${prev.length + 1}`,
        code: `T${prev.length + 1}`,
        group: format === 'FPS' ? (prev.length % 2 === 0 ? 'A' : 'B') : undefined,
      },
    ]);
  };

  const handleRemoveTeam = (id: string) => {
    if (teams.length <= 4) return;
    setTeams((prev) => prev.filter((t) => t.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const createdId = saveCustomTournament({
      title: title.trim(),
      format,
      teams,
    });

    router.push(`/tournament/custom/${createdId}`);
  };

  return (
    <main className="relative min-h-screen bg-[#05070c] text-slate-100 selection:bg-amber-400 selection:text-black">
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/3 h-[600px] w-[600px] rounded-full bg-amber-500/10 blur-[160px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 font-mono text-xs font-bold text-slate-300 transition-all hover:border-amber-400/40 hover:bg-amber-400/10 hover:text-amber-400 active:scale-95"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            BERANDA
          </Link>

          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-500">
            CUSTOM TOURNAMENT GENERATOR
          </span>
        </div>

        <header className="border-b border-white/10 pb-6">
          <h1 className="text-3xl font-black uppercase tracking-tight text-white sm:text-5xl">
            BUAT TURNAMEN KOMUNITAS
          </h1>
          <p className="mt-2 font-mono text-xs text-slate-400">
            Atur nama turnamen, format peraturan game, dan tim bertanding sesuai kebutuhan liga komunitasmu.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-6 space-y-6 backdrop-blur-xl">
            <div>
              <label className="block font-mono text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Nama Turnamen
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Komunitas Cup Season 1"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-black/60 px-4 py-3 font-mono text-sm font-bold text-white focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
            </div>

            <div>
              <label className="block font-mono text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Format Game & Ruleset
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'MOBA', label: 'MOBA (MLBB)', desc: 'Regular Season & Playoff Bracket' },
                  { id: 'BATTLE_ROYALE', label: 'BATTLE ROYALE (PUBGM)', desc: 'PMWC 10-Pts Official System' },
                  { id: 'FPS', label: 'FPS (VALORANT)', desc: 'Group Stage Map BO3' },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => handleFormatChange(f.id as GameFormat)}
                    className={`rounded-xl border p-4 text-left transition-all ${
                      format === f.id
                        ? 'border-amber-400 bg-amber-400/10 ring-1 ring-amber-400/50'
                        : 'border-white/10 bg-black/40 hover:border-white/20'
                    }`}
                  >
                    <div className="font-mono text-xs font-black uppercase text-amber-400">{f.label}</div>
                    <div className="mt-1 font-mono text-[10px] text-slate-400">{f.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-300">
                    Daftar Tim Partisipan ({teams.length})
                  </h3>
                  <p className="font-mono text-[10px] text-slate-500">Edit nama dan kode singkatan tim</p>
                </div>
                <button
                  type="button"
                  onClick={handleAddTeam}
                  className="rounded-lg border border-amber-400/30 bg-amber-400/10 px-3 py-1.5 font-mono text-xs font-bold text-amber-400 hover:bg-amber-400/20 active:scale-95 transition-all"
                >
                  TAMBAH TIM
                </button>
              </div>

              <div className="max-h-[360px] overflow-y-auto space-y-2 pr-2">
                {teams.map((team, idx) => (
                  <div
                    key={team.id}
                    className="flex items-center gap-3 rounded-xl border border-white/5 bg-black/40 p-2.5 font-mono text-xs"
                  >
                    <span className="w-6 text-center font-bold text-slate-500">#{idx + 1}</span>

                    <input
                      type="text"
                      required
                      placeholder="Nama Tim"
                      value={team.name}
                      onChange={(e) => handleTeamChange(team.id, 'name', e.target.value)}
                      className="flex-1 rounded-lg border border-white/15 bg-slate-900 px-3 py-1.5 font-bold text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                    />

                    <input
                      type="text"
                      required
                      maxLength={4}
                      placeholder="KODE"
                      value={team.code}
                      onChange={(e) => handleTeamChange(team.id, 'code', e.target.value.toUpperCase())}
                      className="w-20 rounded-lg border border-white/15 bg-slate-900 px-2 py-1.5 text-center font-bold text-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 uppercase"
                    />

                    <button
                      type="button"
                      disabled={teams.length <= 4}
                      onClick={() => handleRemoveTeam(team.id)}
                      className="rounded-lg border border-rose-500/20 bg-rose-500/10 px-2.5 py-1.5 font-bold text-rose-400 hover:bg-rose-500/20 disabled:opacity-20"
                    >
                      HAPUS
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-amber-400 py-4 font-mono text-xs font-black uppercase text-black transition-all hover:bg-amber-300 active:scale-95 shadow-xl shadow-amber-400/20"
          >
            GENERATE & BUKA SIMULATOR
          </button>
        </form>
      </div>
    </main>
  );
}