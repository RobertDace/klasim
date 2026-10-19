// src/app/mlbb/page.tsx
'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import {
  heroes as allHeroes,
  heroTierStats,
  type MLBBHero,
} from '@/data/mlbb';

export default function MlbbHubPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');

  // Filter heroes for quick finder
  const filteredHeroes = useMemo(() => {
    let result = allHeroes;
    if (selectedRole !== 'all') {
      result = result.filter(h => h.roles.includes(selectedRole));
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(h => 
        h.name.toLowerCase().includes(q) ||
        h.roles.some(r => r.toLowerCase().includes(q)) ||
        h.lane.some(l => l.toLowerCase().includes(q))
      );
    }
    return result.slice(0, 18);
  }, [searchQuery, selectedRole]);

  // Highlighted Top Meta Heroes
  const topMetaHeroes = useMemo(() => {
    const featuredNames = ['Suyou', 'Nolan', 'Fanny', 'Chou', 'Hayabusa', 'Zhuxin', 'Ling', 'Roger'];
    return allHeroes.filter(h => featuredNames.includes(h.name));
  }, []);

  const coreModules = [
    {
      id: 'draft',
      title: '5v5 Tournament Draft Simulator',
      badge: 'ESPORTS STANDARD',
      badgeColor: 'border-amber-400/40 bg-amber-400/10 text-amber-400',
      icon: '⚔️',
      href: '/mlbb/draft',
      description: 'Simulasi pick & ban 5v5 berformat resmi MPL dengan deteksi counter otomatis, skor sinergi, dan layout arena interaktif.',
      highlight: true,
      stats: '10 Bans · 10 Picks · Realtime Timer',
    },
    {
      id: 'tier-list',
      title: 'Meta Tier List & Win Rates',
      badge: 'PATCH 1.9.22',
      badgeColor: 'border-emerald-400/40 bg-emerald-400/10 text-emerald-400',
      icon: '🏆',
      href: '/mlbb/tier-list',
      description: 'Ranking efektivitas hero dari S+ sampai C di semua lane dengan data winrate, ban rate, dan popularitas rank Mythic.',
      stats: 'Tier S+ hingga C · 5 Lane',
    },
    {
      id: 'heroes',
      title: 'Hero Hub & Scaling Data',
      badge: '133 HEROES',
      badgeColor: 'border-cyan-400/40 bg-cyan-400/10 text-cyan-400',
      icon: '🛡️',
      href: '/mlbb/heroes',
      description: 'Database lengkap 133 hero Mobile Legends dengan rincian skill, pasif, base stats, dan scaling level 1 hingga 15.',
      stats: 'Statistik Lvl 1-15 · Damage Ratio',
    },
    {
      id: 'counter-pick',
      title: 'Counter Pick Matrix',
      badge: 'ALGORITMA RELASI',
      badgeColor: 'border-rose-400/40 bg-rose-400/10 text-rose-400',
      icon: '🎯',
      href: '/mlbb/counter-pick',
      description: 'Temukan counter hero terbaik untuk mengunci kemenangan draft. Masukkan 1-5 hero lawan untuk melihat rekomendasi otomatis.',
      stats: 'Hard Counter & Soft Synergy',
    },
    {
      id: 'items',
      title: 'Database Item & Equipment',
      badge: '90 ITEMS',
      badgeColor: 'border-purple-400/40 bg-purple-400/10 text-purple-400',
      icon: '📦',
      href: '/mlbb/items',
      description: 'Koleksi seluruh item Physical, Magic, Defense, Movement, Roaming, dan Jungling dengan rincian atribut dan pasif unik.',
      stats: 'Komparator Item · Tier 1-3',
    },
    {
      id: 'compare',
      title: 'Dual Hero Head-to-Head',
      badge: 'DUEL SIMULATOR',
      badgeColor: 'border-blue-400/40 bg-blue-400/10 text-blue-400',
      icon: '⚖️',
      href: '/mlbb/compare',
      description: 'Bandingkan dua hero secara langsung berdampingan: radar chart stats, keunggulan duel 1v1, dan kecocokan fase permainan.',
      stats: 'Head-to-Head Radar Chart',
    },
    {
      id: 'builder',
      title: 'Custom Build & Emblem Creator',
      badge: 'WORKSHOP',
      badgeColor: 'border-amber-400/40 bg-amber-400/10 text-amber-400',
      icon: '🛠️',
      href: '/mlbb/builder',
      description: 'Racik kombinasi 6 item dan set emblem impianmu dengan kalkulator stat kumulatif, DPS output, dan ketahanan HP efektif.',
      stats: 'Kalkulator Stat Realtime',
    },
    {
      id: 'builds',
      title: 'Tournament Pro Builds',
      badge: '365+ BUILDS',
      badgeColor: 'border-emerald-400/40 bg-emerald-400/10 text-emerald-400',
      icon: '🎖️',
      href: '/mlbb/builds',
      description: 'Kumpulan build item dan emblem resmi yang digunakan oleh atlet profesional di panggung turnamen MPL ID dan M-Series.',
      stats: 'MPL S14 & M6 Verified',
    },
    {
      id: 'guides',
      title: 'Strategy & Macro Hub',
      badge: 'MASTERCLASS',
      badgeColor: 'border-teal-400/40 bg-teal-400/10 text-teal-400',
      icon: '🧭',
      href: '/mlbb/guides',
      description: 'Panduan makro gameplay 5 role: rute rotasi roamer/jungler, wave management, turtle timing, dan setup lord turnamen.',
      stats: 'Rotasi Map & Wave Control',
    },
    {
      id: 'patch-notes',
      title: 'Patch Notes & Meta Shifts',
      badge: 'LIVE UPDATE',
      badgeColor: 'border-indigo-400/40 bg-indigo-400/10 text-indigo-400',
      icon: '📈',
      href: '/mlbb/patch-notes',
      description: 'Rangkuman dan analisis mendalam perubahan update patch: buff, nerf, revamp hero, serta dampaknya terhadap pergeseran meta.',
      stats: 'Analisis Buff/Nerf Patch',
    },
  ];

  return (
    <div className="min-h-screen bg-[#05070c] text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-black">
      <Navbar activeSection="mlbb" />

      <main className="flex-1 pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-12">
        {/* ========================================================================= */}
        {/* HERO BANNER SECTION                                                       */}
        {/* ========================================================================= */}
        <div className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-[#0c101d] via-[#070a14] to-[#04060a] p-6 sm:p-10 lg:p-12 overflow-hidden shadow-2xl">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 font-mono text-xs font-bold text-amber-400 tracking-wider">
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              MLBB ESPORTS INTELLIGENCE & TELEMETRY HUB
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase font-sans">
              PUSAT ANALITIK & <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-yellow-500 bg-clip-text text-transparent">
                SIMULASI DRAFT MLBB
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans max-w-2xl">
              Platform komprehensif terlengkap untuk Mobile Legends: Bang Bang. Eksplorasi simulasi draft 5v5 turnamen, tier list patch terkini, kalkulator build, hingga database 133 hero dan 90 equipment resmi.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 font-mono text-xs">
              <Link
                href="/mlbb/draft"
                className="rounded-xl border border-amber-400 bg-amber-400 px-5 py-3 font-black text-black hover:bg-amber-300 transition-all shadow-lg shadow-amber-400/20 flex items-center gap-2 cursor-pointer"
              >
                <span>⚔️</span>
                <span>BUKA DRAFT SIMULATOR 5v5</span>
              </Link>
              <Link
                href="/mlbb/tier-list"
                className="rounded-xl border border-white/20 bg-white/5 px-5 py-3 font-bold text-white hover:bg-white/10 hover:border-white/40 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>🏆</span>
                <span>LIHAT META TIER LIST</span>
              </Link>
            </div>
          </div>

          {/* Quick Telemetry Rail in Hero */}
          <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono">
            <div className="rounded-xl border border-white/5 bg-black/40 p-3">
              <span className="text-[10px] text-slate-400 uppercase block">Hero Terdaftar</span>
              <span className="text-xl sm:text-2xl font-black text-cyan-400">133</span>
              <span className="text-[9px] text-slate-500 block">Hero Resmi MLBB</span>
            </div>
            <div className="rounded-xl border border-white/5 bg-black/40 p-3">
              <span className="text-[10px] text-slate-400 uppercase block">Tournament Builds</span>
              <span className="text-xl sm:text-2xl font-black text-amber-400">365+</span>
              <span className="text-[9px] text-slate-500 block">MPL ID & M-Series</span>
            </div>
            <div className="rounded-xl border border-white/5 bg-black/40 p-3">
              <span className="text-[10px] text-slate-400 uppercase block">Equipment & Item</span>
              <span className="text-xl sm:text-2xl font-black text-emerald-400">90</span>
              <span className="text-[9px] text-slate-500 block">Atribut & Pasif Unik</span>
            </div>
            <div className="rounded-xl border border-white/5 bg-black/40 p-3">
              <span className="text-[10px] text-slate-400 uppercase block">Active Patch</span>
              <span className="text-xl sm:text-2xl font-black text-purple-400">v1.9.22</span>
              <span className="text-[9px] text-slate-500 block">Season 34 Meta</span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CORE MODULES GRID                                                         */}
        {/* ========================================================================= */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white uppercase font-sans tracking-tight">
                MODUL & FITUR UTAMA
              </h2>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                PILIH TOOL ANALITIK DAN SIMULATOR YANG INGIN KAMU JALANKAN
              </p>
            </div>
            <span className="font-mono text-xs text-amber-400">10 TOOLS TERSEDIA</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {coreModules.map((m) => (
              <Link
                key={m.id}
                href={m.href}
                className={`group relative rounded-2xl border p-5 transition-all duration-200 flex flex-col justify-between hover:scale-[1.01] ${
                  m.highlight
                    ? 'border-amber-400/50 bg-gradient-to-br from-[#12182b] to-[#0a0d18] shadow-lg shadow-amber-400/10'
                    : 'border-white/10 bg-[#080c16] hover:border-white/30 hover:bg-[#0c1222]'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{m.icon}</span>
                    <span className={`rounded-full border px-2.5 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider ${m.badgeColor}`}>
                      {m.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base sm:text-lg font-black text-white group-hover:text-amber-400 transition-colors font-sans uppercase">
                      {m.title}
                    </h3>
                    <p className="text-xs text-slate-400 font-sans mt-1.5 leading-relaxed">
                      {m.description}
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                  <span className="text-[11px] text-slate-500">{m.stats}</span>
                  <span className="text-amber-400 group-hover:translate-x-1 transition-transform font-bold">
                    Buka Tool →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* TOP META HEROES SPOTLIGHT                                                 */}
        {/* ========================================================================= */}
        <section className="rounded-3xl border border-white/10 bg-[#070a14] p-6 sm:p-8 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
            <div>
              <h2 className="text-xl font-black text-white uppercase font-sans">
                TRENDING META HEROES (S34)
              </h2>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                HERO DENGAN PICK & BAN RATE TERTINGGI DI KOMPETITIF MPL SAAT INI
              </p>
            </div>
            <Link
              href="/mlbb/tier-list"
              className="text-xs font-mono text-amber-400 hover:text-amber-300 font-bold"
            >
              Lihat Semua Ranking Tier List →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {topMetaHeroes.map((hero) => (
              <Link
                key={hero.id}
                href={`/mlbb/heroes/${hero.slug}`}
                className="group relative rounded-xl border border-white/10 bg-black/40 p-2.5 flex flex-col items-center hover:border-amber-400/60 hover:scale-105 transition-all text-center"
              >
                <div className="relative h-14 w-14 rounded-full overflow-hidden border border-white/15 mb-2 group-hover:border-amber-400">
                  <Image
                    src={hero.image}
                    alt={hero.name}
                    width={56}
                    height={56}
                    className="object-cover h-full w-full"
                    unoptimized
                  />
                </div>
                <span className="text-xs font-bold text-white group-hover:text-amber-400 truncate w-full block">
                  {hero.name}
                </span>
                <span className="text-[10px] font-mono text-slate-400 mt-0.5 truncate w-full block">
                  {hero.roles.join(', ')}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* QUICK HERO SEARCH & EXPLORER                                              */}
        {/* ========================================================================= */}
        <section className="rounded-3xl border border-white/10 bg-[#080d1a] p-6 sm:p-8 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <h2 className="text-xl font-black text-white uppercase font-sans">
                QUICK HERO EXPLORER
              </h2>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                CARI CEPAT 133 HERO BERDASARKAN NAMA, ROLE, ATAU LANE
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari hero (e.g. Fanny, Tank)..."
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

          {/* Role Filters */}
          <div className="flex flex-wrap gap-1.5 font-mono text-xs">
            {['all', 'Tank', 'Fighter', 'Assassin', 'Mage', 'Marksman', 'Support'].map((r) => (
              <button
                key={r}
                onClick={() => setSelectedRole(r)}
                className={`rounded-lg px-3 py-1 font-bold uppercase transition-all cursor-pointer ${
                  selectedRole === r
                    ? 'bg-amber-400 text-black shadow-md shadow-amber-400/20'
                    : 'border border-white/10 bg-white/5 text-slate-300 hover:text-white'
                }`}
              >
                {r === 'all' ? 'SEMUA ROLE' : r}
              </button>
            ))}
          </div>

          {/* Hero Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-9 gap-3">
            {filteredHeroes.map((hero) => (
              <Link
                key={hero.id}
                href={`/mlbb/heroes/${hero.slug}`}
                className="group relative rounded-xl border border-white/10 bg-black/50 p-2 flex flex-col items-center hover:border-amber-400 hover:scale-105 transition-all text-center"
              >
                <div className="relative h-12 w-12 rounded-lg overflow-hidden border border-white/15 mb-1.5">
                  <Image
                    src={hero.image}
                    alt={hero.name}
                    width={48}
                    height={48}
                    className="object-cover h-full w-full"
                    unoptimized
                  />
                </div>
                <span className="text-[11px] font-bold text-white group-hover:text-amber-400 truncate w-full block">
                  {hero.name}
                </span>
                <span className="text-[9px] font-mono text-slate-400 truncate w-full block">
                  {hero.lane[0] || hero.roles[0]}
                </span>
              </Link>
            ))}
          </div>

          <div className="pt-2 text-center">
            <Link
              href="/mlbb/heroes"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-2.5 font-mono text-xs font-bold text-slate-200 hover:text-white hover:bg-white/10 transition-all"
            >
              <span>JELAJAHI SEMUA 133 HERO LENGKAP</span>
              <span>→</span>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
