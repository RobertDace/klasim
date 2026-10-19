// src/app/tournament/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';

interface TournamentItem {
  id: string;
  slug: string;
  title: string;
  game: 'MLBB' | 'PUBGM' | 'VALORANT';
  gameName: string;
  format: string;
  teamsCount: number;
  badge: string;
  badgeColor: string;
  accentColor: string;
  bgGradient: string;
  href: string;
  description: string;
  isOfficial?: boolean;
}

export default function TournamentHubPage() {
  const [selectedGame, setSelectedGame] = useState<'all' | 'MLBB' | 'PUBGM' | 'VALORANT'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const tournaments: TournamentItem[] = [
    {
      id: 'mpl-s14',
      slug: 'mpl-id-s14',
      title: 'MPL ID Season 14',
      game: 'MLBB',
      gameName: 'Mobile Legends: Bang Bang',
      format: 'Double Round Robin (BO3) + Playoff Double Elimination',
      teamsCount: 9,
      badge: 'MPL OFFICIAL',
      badgeColor: 'border-amber-400/40 bg-amber-400/10 text-amber-400',
      accentColor: 'text-amber-400 border-amber-400/30',
      bgGradient: 'from-amber-950/20 via-[#070b14] to-black',
      href: '/tournament/mpl-id-s14',
      description: 'Klasemen resmi turnamen kasta tertinggi MLBB Indonesia. Dilengkapi resolver tiebreaker head-to-head, net game diff, dan simulasi skenario lolos playoff.',
      isOfficial: true,
    },
    {
      id: 'pmwc-2026',
      slug: 'pmwc-2026',
      title: 'PUBG Mobile World Cup 2026',
      game: 'PUBGM',
      gameName: 'PUBG Mobile',
      format: '10-Point PMWC Matrix // Survival & Grand Finals',
      teamsCount: 16,
      badge: 'PMWC OFFICIAL',
      badgeColor: 'border-emerald-400/40 bg-emerald-400/10 text-emerald-400',
      accentColor: 'text-emerald-400 border-emerald-400/30',
      bgGradient: 'from-emerald-950/20 via-[#070b14] to-black',
      href: '/tournament/pmwc-2026',
      description: 'Papan klasemen turnamen dunia PUBG Mobile dengan kalkulasi poin resmi 10-Pts (WWCD, Placement Points, dan Kill Points) per matchday.',
      isOfficial: true,
    },
    {
      id: 'vct-pacific-2026',
      slug: 'vct-pacific-2026',
      title: 'VCT Pacific Kickoff 2026',
      game: 'VALORANT',
      gameName: 'VALORANT',
      format: 'Dual Groups BO3 // Map & Round Diff Tiebreakers',
      teamsCount: 11,
      badge: 'VCT PACIFIC',
      badgeColor: 'border-cyan-400/40 bg-cyan-400/10 text-cyan-400',
      accentColor: 'text-cyan-400 border-cyan-400/30',
      bgGradient: 'from-cyan-950/20 via-[#070b14] to-black',
      href: '/tournament/vct-pacific-2026',
      description: 'Sistem klasemen grup VCT Pacific format Tactical FPS. Menyelesaikan skenario poin imbang menggunakan delta selisih map dan round pertandingan.',
      isOfficial: true,
    },
  ];

  const filteredTournaments = tournaments.filter((t) => {
    if (selectedGame !== 'all' && t.game !== selectedGame) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        t.title.toLowerCase().includes(q) ||
        t.gameName.toLowerCase().includes(q) ||
        t.format.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#05070c] text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-black">
      <Navbar activeSection="turnamen" />

      <main className="flex-1 pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-10">
        {/* ========================================================================= */}
        {/* 1. HERO HEADER WITH PRIMARY "BUAT TURNAMEN" CALL-TO-ACTION                */}
        {/* ========================================================================= */}
        <div className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-[#0c101d] via-[#070a14] to-[#04060a] p-6 sm:p-10 lg:p-12 overflow-hidden shadow-2xl">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 font-mono text-xs font-bold text-amber-400 tracking-wider">
                <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                TOURNAMENT ENGINE & STANDINGS HUB
              </div>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase font-sans">
                PUSAT TURNAMEN & <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 bg-clip-text text-transparent">
                  KLASEMEN ESPORTS
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
                Kelola klasemen otomatis dengan aturan tiebreaker resmi turnamen tier-1 dunia. Buat turnamen kustom komunitasmu sendiri atau pantau klasemen turnamen resmi MPL, PMWC, dan VCT.
              </p>
            </div>

            {/* ACTION BUTTONS: PRIMARY BUAT TURNAMEN + TURNAMEN SAYA */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0 font-mono text-xs">
              <Link
                href="/tournament/create"
                className="group relative rounded-2xl border-2 border-amber-400 bg-amber-400 px-6 py-4 font-black text-black hover:bg-amber-300 transition-all shadow-xl shadow-amber-400/25 flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <span className="text-lg">⚡</span>
                <span className="text-sm tracking-wider uppercase font-bold">BUAT TURNAMEN BARU</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>

              <Link
                href="/my-tournaments"
                className="rounded-2xl border border-white/20 bg-white/5 px-6 py-3 font-bold text-slate-200 hover:text-white hover:bg-white/10 hover:border-white/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>📂</span>
                <span>LIHAT TURNAMEN SAYA</span>
              </Link>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
            <div className="rounded-xl border border-white/5 bg-black/40 p-3">
              <span className="text-[10px] text-slate-400 uppercase block">Engine Format</span>
              <span className="text-lg font-black text-amber-400">3 FORMAT</span>
              <span className="text-[9px] text-slate-500 block">MOBA, BR, Tactical FPS</span>
            </div>
            <div className="rounded-xl border border-white/5 bg-black/40 p-3">
              <span className="text-[10px] text-slate-400 uppercase block">Tiebreaker Logic</span>
              <span className="text-lg font-black text-emerald-400">DETERMINISTIC</span>
              <span className="text-[9px] text-slate-500 block">H2H, Net Diff, Mini-League</span>
            </div>
            <div className="rounded-xl border border-white/5 bg-black/40 p-3">
              <span className="text-[10px] text-slate-400 uppercase block">Calculation Speed</span>
              <span className="text-lg font-black text-cyan-400">&lt; 0.05ms</span>
              <span className="text-[9px] text-slate-500 block">Realtime In-Memory</span>
            </div>
            <div className="rounded-xl border border-white/5 bg-black/40 p-3">
              <span className="text-[10px] text-slate-400 uppercase block">Export & Share</span>
              <span className="text-lg font-black text-purple-400">LIVE SYNC</span>
              <span className="text-[9px] text-slate-500 block">Shareable Standings Link</span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. TOURNAMENTS LIST & FILTER CONTROLS                                     */}
        {/* ========================================================================= */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white uppercase font-sans">
                DAFTAR TURNAMEN AKTIF
              </h2>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                PILIH TURNAMEN UNTUK MELIHAT LIVE MATRIX KLASEMEN ATAU MENJALANKAN SIMULASI SKENARIO
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari turnamen..."
                className="w-full rounded-xl border border-white/10 bg-black/60 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-400 outline-none font-sans"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2 text-xs text-slate-500 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Game Filter Pills */}
          <div className="flex flex-wrap gap-2 font-mono text-xs">
            {[
              { id: 'all', label: 'SEMUA GAME' },
              { id: 'MLBB', label: 'MOBILE LEGENDS' },
              { id: 'PUBGM', label: 'PUBG MOBILE' },
              { id: 'VALORANT', label: 'VALORANT' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedGame(f.id as any)}
                className={`rounded-xl px-4 py-2 font-bold uppercase transition-all cursor-pointer ${
                  selectedGame === f.id
                    ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
                    : 'border border-white/10 bg-white/5 text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Tournaments Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTournaments.map((t) => (
              <div
                key={t.id}
                className={`rounded-2xl border bg-gradient-to-br ${t.bgGradient} p-6 flex flex-col justify-between space-y-4 hover:border-white/40 transition-all shadow-xl group`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`rounded-full border px-2.5 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider ${t.badgeColor}`}>
                      {t.badge}
                    </span>
                    <span className="font-mono text-[10px] text-slate-400">
                      {t.teamsCount} TIM TERDAFTAR
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-black text-white group-hover:text-amber-400 transition-colors uppercase font-sans">
                      {t.title}
                    </h3>
                    <span className="text-xs font-mono font-bold text-slate-400 block mt-0.5">
                      {t.gameName}
                    </span>
                    <p className="text-xs text-slate-300 font-sans mt-2.5 leading-relaxed">
                      {t.description}
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-black/40 p-2.5 font-mono text-[10px] text-slate-400 space-y-1">
                    <div className="text-slate-300 font-bold uppercase">Format Aturan:</div>
                    <div>{t.format}</div>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href={t.href}
                    className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 font-mono text-xs font-bold text-white hover:bg-amber-400 hover:text-black hover:border-amber-400 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <span>BUKA KLASEMEN LIVE</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            ))}

            {/* Card Creator Banner in Grid */}
            <div className="rounded-2xl border-2 border-dashed border-amber-400/40 bg-amber-400/5 p-6 flex flex-col items-center justify-center text-center space-y-4">
              <div className="h-14 w-14 rounded-2xl bg-amber-400/20 border border-amber-400/50 flex items-center justify-center text-2xl">
                ➕
              </div>
              <div>
                <h3 className="text-lg font-black text-white font-sans uppercase">
                  PUNYA TURNAMEN SENDIRI?
                </h3>
                <p className="text-xs text-slate-400 font-sans mt-1 max-w-xs">
                  Gunakan template MOBA, Battle Royale, atau FPS untuk membuat turnamen komunitas dengan sistem poin otomatis.
                </p>
              </div>
              <Link
                href="/tournament/create"
                className="rounded-xl bg-amber-400 px-5 py-2.5 font-mono text-xs font-black text-black hover:bg-amber-300 transition-all cursor-pointer shadow-lg shadow-amber-400/20"
              >
                + BUAT SEKARANG (GRATIS)
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. HOW THE STANDINGS RESOLVER ENGINE WORKS                                */}
        {/* ========================================================================= */}
        <section className="rounded-3xl border border-white/10 bg-[#070b14] p-6 sm:p-8 space-y-4 font-mono text-xs">
          <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider">
            <span>⚙️</span>
            <span>KLASIM STANDINGS TELEMETRY ARCHITECTURE</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-slate-300">
            <div className="rounded-2xl border border-white/5 bg-black/40 p-4 space-y-1.5">
              <span className="text-amber-400 font-bold block">1. MOBA BO3 RESOLVER</span>
              <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                Mengutamakan Head-to-Head langsung antar tim. Jika terjadi lingkaran sirkular (A&gt;B&gt;C&gt;A), sistem mengaktifkan Recursive Mini-League khusus tanpa mengganggu poin tim lain.
              </p>
            </div>
            <div className="rounded-2xl border border-white/5 bg-black/40 p-4 space-y-1.5">
              <span className="text-emerald-400 font-bold block">2. PMWC 10-PTS BR MATRIX</span>
              <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                Menghitung total poin (10-6-5-4-3-2-1-1-0-0) + Kill. Tiebreaker dipecahkan via jumlah WWCD terbanyak, total placement pts, dan peringkat match penutup.
              </p>
            </div>
            <div className="rounded-2xl border border-white/5 bg-black/40 p-4 space-y-1.5">
              <span className="text-cyan-400 font-bold block">3. TACTICAL FPS DELTA</span>
              <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                Mengintegrasikan Match Win-Loss, disusul Map Differential delta (+/-), dan Round Differential kumulatif untuk menentukan unggulan grup VCT.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
