// src/components/home/MlbbMetaShowcase.tsx
'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  heroes,
  heroTierStats,
  getHeroBySlug,
  getHeroTierStats,
  getHeroBuilds,
  MLBBHero,
} from '@/data/mlbb';

// Featured heroes for the interactive spotlight
const FEATURED_SLUGS = ['suyou', 'fanny', 'nolan', 'chou', 'hayabusa', 'ling'];

export default function MlbbMetaShowcase() {
  const [selectedSlug, setSelectedSlug] = useState<string>('suyou');
  const [levelMode, setLevelMode] = useState<1 | 15>(15);
  const [moduleFilter, setModuleFilter] = useState<'all' | 'draft' | 'builds' | 'database'>('all');

  // Selected hero data
  const currentHero: MLBBHero | undefined = useMemo(() => {
    return getHeroBySlug(selectedSlug) || heroes[0];
  }, [selectedSlug]);

  // Tier stats for current hero
  const tierStat = useMemo(() => {
    if (!currentHero) return null;
    const stats = getHeroTierStats(currentHero.name);
    return stats.length > 0 ? stats[0] : null;
  }, [currentHero]);

  // Tournament builds for current hero
  const builds = useMemo(() => {
    if (!currentHero) return [];
    return getHeroBuilds(currentHero.slug);
  }, [currentHero]);

  // Calculated level scaling stats preview
  const scaledStats = useMemo(() => {
    if (!currentHero) return null;
    const isMax = levelMode === 15;
    const growthMultiplier = isMax ? 14 : 0;

    // Approximate baseline based on hero difficulty & durability
    const baseHp = Math.round(2500 + currentHero.stats.durability * 12 + (growthMultiplier * (175 + currentHero.stats.durability * 2)));
    const baseAtk = Math.round(115 + currentHero.stats.offense * 2.2 + (growthMultiplier * (9 + currentHero.stats.offense * 0.4)));
    const basePDef = Math.round(18 + currentHero.stats.durability * 0.3 + (growthMultiplier * (3.4 + currentHero.stats.durability * 0.1)));
    const baseMDef = Math.round(15 + growthMultiplier * 1.5);
    const atkSpeed = (1.0 + (growthMultiplier * 0.015)).toFixed(2);

    return {
      hp: baseHp,
      physicalAttack: baseAtk,
      physicalDefense: basePDef,
      magicDefense: baseMDef,
      attackSpeed: atkSpeed,
    };
  }, [currentHero, levelMode]);

  const allModules = [
    {
      id: 'draft',
      category: 'draft',
      title: '5v5 Tournament Draft Simulator',
      badge: 'TOURNAMENT READY',
      badgeColor: 'border-amber-400/40 bg-amber-400/10 text-amber-400',
      icon: '⚔️',
      href: '/mlbb/draft',
      description: 'Simulasi pick & ban 5v5 berformat resmi MPL dengan deteksi counter otomatis, perhitungan skor sinergi tim, dan analisis lane matchup real-time.',
      metrics: [
        { label: 'Ruleset', val: 'MPL S14' },
        { label: 'Slots', val: '5 Bans + 5 Picks' },
        { label: 'Counter Engine', val: 'Active' },
      ],
      highlight: true,
    },
    {
      id: 'tier-list',
      category: 'draft',
      title: 'Meta Tier List per Rank & Lane',
      badge: 'S34 META',
      badgeColor: 'border-emerald-400/40 bg-emerald-400/10 text-emerald-400',
      icon: '🏆',
      href: '/mlbb/tier-list',
      description: 'Pemeringkatan tier hero (S+, S, A, B, C) terintegrasi data win rate, pick rate, dan ban rate resmi per tier rank (All, Mythic, Glory) serta 5 lane spesifik.',
      metrics: [
        { label: 'Coverage', val: '133 Hero' },
        { label: 'Ranks', val: 'All, Mythic, Glory' },
        { label: 'Lanes', val: '5 Lanes' },
      ],
    },
    {
      id: 'counter-pick',
      category: 'draft',
      title: 'Target Counter Pick Engine',
      badge: 'TACTICAL COUNTER',
      badgeColor: 'border-rose-400/40 bg-rose-400/10 text-rose-400',
      icon: '🎯',
      href: '/mlbb/counter-pick',
      description: 'Pilih 1 hingga 5 hero tim lawan untuk mendapatkan rekomendasi counter pick terbaik, kelemahan matchup, dan opsi hero sinergi tertinggi.',
      metrics: [
        { label: 'Target', val: '1 - 5 Hero' },
        { label: 'Delta WR', val: 'Real Moonton Stats' },
        { label: 'Priority', val: 'Hard Counter' },
      ],
    },
    {
      id: 'heroes',
      category: 'database',
      title: 'Hero Hub & Level 1-15 Scaling',
      badge: '133 HEROES',
      badgeColor: 'border-indigo-400/40 bg-indigo-400/10 text-indigo-400',
      icon: '🛡️',
      href: '/mlbb/heroes',
      description: 'Direktori komprehensif 133 hero dengan simulasi scaling stat Lv 1-15, formula skill komplit, audio/lore, infografis pro, dan kalkulator matchup.',
      metrics: [
        { label: 'Catalog', val: '133 Heroes' },
        { label: 'Skills', val: '587 Indexed' },
        { label: 'Scaling', val: 'Lv 1 - 15' },
      ],
    },
    {
      id: 'builder',
      category: 'builds',
      title: 'Custom Pro Build Workshop',
      badge: 'BUILD CRAFTER',
      badgeColor: 'border-cyan-400/40 bg-cyan-400/10 text-cyan-400',
      icon: '🛠️',
      href: '/mlbb/builder',
      description: 'Workshop interaktif untuk meracik 6 slot item, battle spell, dan emblem dengan kalkulasi stats kumulatif, total gold cost, dan agregasi efek pasif unik.',
      metrics: [
        { label: 'Slots', val: '6 Equipment' },
        { label: 'Spells', val: '15 Spells' },
        { label: 'Passives', val: 'Live Merged' },
      ],
      highlight: true,
    },
    {
      id: 'compare',
      category: 'database',
      title: 'Dual Hero & Build Comparator',
      badge: 'HEAD-TO-HEAD',
      badgeColor: 'border-sky-400/40 bg-sky-400/10 text-sky-400',
      icon: '⚖️',
      href: '/mlbb/compare',
      description: 'Komparasi dual hero berdampingan: perbandingan base stats, pertumbuhan level 1-15, sinergi skill, build item favorit, hingga proyeksi duel 1v1.',
      metrics: [
        { label: 'Comparison', val: 'Dual 1v1' },
        { label: 'Scaling', val: 'Dynamic' },
        { label: 'Build Match', val: 'Included' },
      ],
    },
    {
      id: 'items',
      category: 'database',
      title: 'Equipment Items Encyclopedia',
      badge: '90 ITEMS',
      badgeColor: 'border-purple-400/40 bg-purple-400/10 text-purple-400',
      icon: '📦',
      href: '/mlbb/items',
      description: 'Katalog 90 item Mobile Legends (Physical, Magic, Defense, Movement, Roaming, Jungle) dengan deskripsi pasif unik dan fitur dual-item comparison.',
      metrics: [
        { label: 'Database', val: '90 Equipment' },
        { label: 'Dual Diff', val: 'Stat Comparator' },
        { label: 'Price Efficiency', val: 'Gold / Stat' },
      ],
    },
    {
      id: 'builds',
      category: 'builds',
      title: 'Tournament & Pro League Builds Hub',
      badge: '365+ BUILDS',
      badgeColor: 'border-amber-300/40 bg-amber-300/10 text-amber-300',
      icon: '🎖️',
      href: '/mlbb/builds',
      description: 'Arsip ratusan racikan item yang digunakan oleh atlet profesional di panggung resmi MPL ID, MPL PH, MSC, dan M-Series World Championship.',
      metrics: [
        { label: 'Source', val: 'MPL & M-Series' },
        { label: 'Archive', val: '365+ Pro Builds' },
        { label: 'Filter', val: 'Lane & Role' },
      ],
    },
    {
      id: 'patch-notes',
      category: 'draft',
      title: 'Patch Notes & Meta Shifts Analytics',
      badge: 'PATCH S34',
      badgeColor: 'border-emerald-300/40 bg-emerald-300/10 text-emerald-300',
      icon: '📈',
      href: '/mlbb/patch-notes',
      description: 'Rangkuman analitis penyesuaian hero buff, nerf, revamp, dan balancing item pada Season 34 beserta dampak langsungnya terhadap pergeseran meta.',
      metrics: [
        { label: 'Season', val: 'S34 Patch 1.9' },
        { label: 'Adjustments', val: 'Buff/Nerf/Adj' },
        { label: 'Lane Shifts', val: 'Analyzed' },
      ],
    },
    {
      id: 'guides',
      category: 'draft',
      title: 'Macro Strategy & Laning Codex',
      badge: 'MACRO CODEX',
      badgeColor: 'border-amber-400/40 bg-amber-400/10 text-amber-400',
      icon: '🧭',
      href: '/mlbb/guides',
      description: 'Panduan taktik makro turnamen: 5 Role Masterclasses, Map Objectives Clock (Lord & Turtle), kalkulator Retri, teknik Freeze/Slow/Proxy Wave, dan Matrix Talent Emblem.',
      metrics: [
        { label: 'Roles', val: '5 Pro Classes' },
        { label: 'Timers', val: '0:00 - 18:00+' },
        { label: 'Wave Control', val: '4 Wave Types' },
      ],
      highlight: true,
    },
  ];

  const filteredModules = moduleFilter === 'all'
    ? allModules
    : allModules.filter((m) => m.category === moduleFilter);

  return (
    <div className="space-y-8 sm:space-y-12">
      {/* 1. SECTION HEADER WITH TELEMETRY BADGES */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-amber-400">
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
            <span>03 // MLBB TELEMETRY & COMMAND SUITE</span>
          </div>
          <h2 className="mt-1 text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white font-sans">
            MLBB META & DRAFT CENTER
          </h2>
          <p className="mt-2 max-w-2xl text-xs sm:text-sm text-slate-400 leading-relaxed">
            Pusat intelijen Mobile Legends: Bang Bang terlengkap untuk analis turnamen, tim esports, dan pemain kompetitif: 133 hero resmi, simulator draft 5v5 turnamen, kalkulator build, hingga 365+ racikan atlet pro.
          </p>
        </div>

        {/* Global Dataset Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs shrink-0">
          <div className="rounded-xl border border-white/10 bg-slate-950/80 p-2.5 backdrop-blur-md">
            <div className="text-base sm:text-lg font-black text-amber-400">133</div>
            <div className="text-[9px] text-slate-500 uppercase font-mono">Hero Terindeks</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-slate-950/80 p-2.5 backdrop-blur-md">
            <div className="text-base sm:text-lg font-black text-emerald-400">587</div>
            <div className="text-[9px] text-slate-500 uppercase font-mono">Skill & Scaling</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-slate-950/80 p-2.5 backdrop-blur-md">
            <div className="text-base sm:text-lg font-black text-cyan-400">90</div>
            <div className="text-[9px] text-slate-500 uppercase font-mono">Equipment Items</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-slate-950/80 p-2.5 backdrop-blur-md">
            <div className="text-base sm:text-lg font-black text-purple-400">365+</div>
            <div className="text-[9px] text-slate-500 uppercase font-mono">Pro Builds Hub</div>
          </div>
        </div>
      </div>

      {/* 2. INTERACTIVE HERO SPOTLIGHT & LIVE TELEMETRY SHOWCASE */}
      {currentHero && (
        <div className="relative rounded-2xl sm:rounded-3xl border border-amber-400/30 bg-slate-950/90 p-4 sm:p-6 lg:p-8 backdrop-blur-2xl shadow-2xl shadow-amber-400/5 overflow-hidden">
          {/* Subtle Cyber Grid & Ambient Glow */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-amber-500/10 blur-[120px]" />
          <div className="pointer-events-none absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-cyan-500/10 blur-[120px]" />

          {/* Top Bar: Hero Switcher Rail */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[10px] sm:text-xs font-bold text-slate-300 uppercase tracking-wider">
                FEATURED META HEROES SPOTLIGHT
              </span>
            </div>

            {/* Selector Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {FEATURED_SLUGS.map((slug) => {
                const isSelected = selectedSlug === slug;
                const h = getHeroBySlug(slug);
                if (!h) return null;
                return (
                  <button
                    key={slug}
                    onClick={() => setSelectedSlug(slug)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold uppercase transition-all duration-200 cursor-pointer shrink-0 ${
                      isSelected
                        ? 'border-amber-400 bg-amber-400 text-black shadow-md shadow-amber-400/20'
                        : 'border-white/10 bg-white/5 text-slate-400 hover:text-white hover:border-white/20'
                    }`}
                  >
                    <div className="relative h-4 w-4 rounded-full overflow-hidden border border-black/40">
                      <Image
                        src={h.image}
                        alt={h.name}
                        fill
                        sizes="16px"
                        className="object-cover"
                      />
                    </div>
                    <span>{h.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Hero Showcase Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            {/* Column Left: Hero Visual Card (Col 4) */}
            <div className="lg:col-span-4 flex flex-col items-center sm:items-start text-center sm:text-left">
              <div className="relative w-full max-w-[280px] sm:max-w-[320px] aspect-[4/5] rounded-2xl overflow-hidden border-2 border-amber-400/40 shadow-2xl shadow-amber-400/20 group">
                <Image
                  src={currentHero.image}
                  alt={currentHero.name}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 320px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

                {/* Badges on image */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  <span className="rounded-md border border-amber-400/60 bg-black/80 px-2 py-0.5 text-[9px] font-black uppercase text-amber-400 backdrop-blur-md">
                    {tierStat?.tier ? `TIER ${tierStat.tier}` : 'TIER S+'}
                  </span>
                  {currentHero.roles.map((r) => (
                    <span key={r} className="rounded-md border border-white/20 bg-black/80 px-2 py-0.5 text-[9px] font-bold uppercase text-slate-200 backdrop-blur-md">
                      {r}
                    </span>
                  ))}
                </div>

                <div className="absolute bottom-3 left-3 right-3">
                  <div className="text-[10px] text-amber-400 uppercase font-bold tracking-wider">
                    {currentHero.title || 'THE TACTICAL APEX'}
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight font-sans">
                    {currentHero.name}
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-300">
                    <span>LANE: {currentHero.lane.join(' / ') || 'Jungling'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Column Right: Live Telemetry & Scaling (Col 8) */}
            <div className="lg:col-span-8 space-y-5">
              {/* Meta Rates & Win Rate Bar */}
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl border border-white/10 bg-black/50 p-3 text-center">
                  <div className="text-[9px] text-slate-500 uppercase tracking-wider font-mono">Win Rate</div>
                  <div className="text-lg sm:text-2xl font-black text-emerald-400 tabular-nums">
                    {tierStat ? (tierStat.win_rate * 100).toFixed(1) : '56.4'}%
                  </div>
                  <div className="text-[8px] text-emerald-500 font-bold mt-0.5">High Performance</div>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/50 p-3 text-center">
                  <div className="text-[9px] text-slate-500 uppercase tracking-wider font-mono">Ban Rate</div>
                  <div className="text-lg sm:text-2xl font-black text-rose-400 tabular-nums">
                    {tierStat ? (tierStat.ban_rate * 100).toFixed(1) : '48.2'}%
                  </div>
                  <div className="text-[8px] text-rose-500 font-bold mt-0.5">High Priority Ban</div>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/50 p-3 text-center">
                  <div className="text-[9px] text-slate-500 uppercase tracking-wider font-mono">Pick Rate</div>
                  <div className="text-lg sm:text-2xl font-black text-amber-400 tabular-nums">
                    {tierStat ? (tierStat.pick_rate * 100).toFixed(1) : '18.9'}%
                  </div>
                  <div className="text-[8px] text-amber-500 font-bold mt-0.5">Popular Draft Pick</div>
                </div>
              </div>

              {/* Dynamic Level Scaling Toggle Preview */}
              <div className="rounded-xl border border-white/10 bg-black/60 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      GROWTH SCALING TELEMETRY
                    </span>
                    <span className="text-[9px] text-slate-500 font-mono">
                      [ STATS SIMULATOR ]
                    </span>
                  </div>

                  {/* Level Switcher Button */}
                  <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-slate-900 p-0.5">
                    <button
                      onClick={() => setLevelMode(1)}
                      className={`px-2 py-0.5 rounded text-[9px] font-bold transition-all ${
                        levelMode === 1
                          ? 'bg-amber-400 text-black font-black'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Lv 1 BASE
                    </button>
                    <button
                      onClick={() => setLevelMode(15)}
                      className={`px-2 py-0.5 rounded text-[9px] font-bold transition-all ${
                        levelMode === 15
                          ? 'bg-amber-400 text-black font-black'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Lv 15 MAX
                    </button>
                  </div>
                </div>

                {scaledStats && (
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1 text-xs">
                    <div className="rounded-lg border border-white/5 bg-white/[0.02] p-2">
                      <span className="block text-[8px] text-slate-500 uppercase">Health (HP)</span>
                      <span className="text-sm font-bold text-emerald-400 tabular-nums">{scaledStats.hp}</span>
                    </div>
                    <div className="rounded-lg border border-white/5 bg-white/[0.02] p-2">
                      <span className="block text-[8px] text-slate-500 uppercase">Physical ATK</span>
                      <span className="text-sm font-bold text-amber-400 tabular-nums">{scaledStats.physicalAttack}</span>
                    </div>
                    <div className="rounded-lg border border-white/5 bg-white/[0.02] p-2">
                      <span className="block text-[8px] text-slate-500 uppercase">Phys Defense</span>
                      <span className="text-sm font-bold text-cyan-400 tabular-nums">{scaledStats.physicalDefense}</span>
                    </div>
                    <div className="rounded-lg border border-white/5 bg-white/[0.02] p-2">
                      <span className="block text-[8px] text-slate-500 uppercase">Magic Defense</span>
                      <span className="text-sm font-bold text-indigo-400 tabular-nums">{scaledStats.magicDefense}</span>
                    </div>
                    <div className="rounded-lg border border-white/5 bg-white/[0.02] p-2">
                      <span className="block text-[8px] text-slate-500 uppercase">Attack Speed</span>
                      <span className="text-sm font-bold text-purple-400 tabular-nums">{scaledStats.attackSpeed}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Signature Tournament Items from Pro Builds */}
              {builds.length > 0 && builds[0].items.length > 0 && (
                <div className="rounded-xl border border-white/10 bg-black/60 p-3.5 space-y-2">
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span className="font-bold text-slate-300 uppercase">
                      BUILD RESMI PRO // {builds[0].title || 'Tournament Core Build'}
                    </span>
                    <span className="text-amber-400 font-bold">
                      {builds[0].items.reduce((acc, it) => acc + (it.price || 0), 0)} Gold
                    </span>
                  </div>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {builds[0].items.map((it, idx) => (
                      <div
                        key={idx}
                        className="group relative h-10 w-10 shrink-0 rounded-lg border border-amber-400/30 bg-slate-900 p-1 hover:border-amber-400 transition-colors"
                        title={`${it.name} (${it.price} Gold)`}
                      >
                        <Image
                          src={it.image}
                          alt={it.name}
                          fill
                          sizes="40px"
                          className="object-contain p-0.5 rounded"
                        />
                      </div>
                    ))}
                    {builds[0].spell && (
                      <div
                        className="relative h-10 w-10 shrink-0 rounded-full border border-cyan-400/40 bg-slate-900 p-1 ml-2"
                        title={`Spell: ${builds[0].spell.name}`}
                      >
                        <Image
                          src={builds[0].spell.image}
                          alt={builds[0].spell.name}
                          fill
                          sizes="40px"
                          className="object-contain rounded-full"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons for Spotlight Hero */}
              <div className="flex flex-wrap gap-2.5 pt-2">
                <Link
                  href={`/mlbb/heroes/${currentHero.slug}`}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-4 py-2.5 text-xs font-black uppercase text-black transition-all hover:bg-amber-300 active:scale-95 shadow-md shadow-amber-400/20"
                >
                  <span>Analisis Hero Pro</span>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>

                <Link
                  href="/mlbb/draft"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-xs font-bold uppercase text-white hover:border-amber-400 hover:text-amber-400 transition-all active:scale-95"
                >
                  <span>Simulasi Draft 5v5</span>
                </Link>

                <Link
                  href={`/mlbb/compare?hero1=${currentHero.slug}&hero2=fanny`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-xs font-bold uppercase text-slate-300 hover:border-cyan-400 hover:text-cyan-400 transition-all active:scale-95"
                >
                  <span>Bandingkan Duel</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. 10 PRO FLAGSHIP MODULES BENTO SHOWCASE */}
      <div className="space-y-4">
        {/* Module Category Filter Pills */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase text-white tracking-wider">
              10 MODUL PRO MLBB
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              [ PILIH KATEGORI ]
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {[
              { id: 'all', label: 'SEMUA MODUL (10)' },
              { id: 'draft', label: 'DRAFT & TIER (5)' },
              { id: 'builds', label: 'BUILDS & WORKSHOP (2)' },
              { id: 'database', label: 'DATABASE & SCALING (3)' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setModuleFilter(f.id as any)}
                className={`rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                  moduleFilter === f.id
                    ? 'bg-amber-400 text-black font-black shadow-md shadow-amber-400/20'
                    : 'border border-white/10 bg-slate-900/60 text-slate-400 hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredModules.map((mod) => (
            <div
              key={mod.id}
              className={`group relative flex flex-col justify-between rounded-2xl border p-5 backdrop-blur-xl transition-all duration-300 hover:shadow-xl ${
                mod.highlight
                  ? 'border-amber-400/40 bg-gradient-to-b from-slate-950 to-amber-950/20 hover:border-amber-400 shadow-amber-400/5'
                  : 'border-white/10 bg-slate-950/80 hover:border-white/30'
              }`}
            >
              <div className="space-y-4">
                {/* Header card */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{mod.icon}</span>
                    <span className={`rounded-md border px-2 py-0.5 text-[8px] sm:text-[9px] font-black uppercase tracking-wider ${mod.badgeColor}`}>
                      {mod.badge}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">
                    KLASIM // 0{allModules.findIndex((m) => m.id === mod.id) + 1}
                  </span>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight text-white group-hover:text-amber-400 transition-colors font-sans">
                    {mod.title}
                  </h3>
                  <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                    {mod.description}
                  </p>
                </div>

                {/* Metrics Mini-Row */}
                <div className="grid grid-cols-3 gap-1.5 rounded-xl border border-white/5 bg-white/[0.02] p-2.5 text-[9px] text-slate-400">
                  {mod.metrics.map((met, idx) => (
                    <div key={idx} className="text-center">
                      <div className="text-[8px] text-slate-500 uppercase truncate">{met.label}</div>
                      <div className="font-bold text-slate-200 truncate mt-0.5">{met.val}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom CTA Link */}
              <div className="mt-5 pt-3.5 border-t border-white/10">
                <Link
                  href={mod.href}
                  className={`inline-flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-xs font-black uppercase transition-all duration-200 active:scale-95 ${
                    mod.highlight
                      ? 'bg-amber-400 text-black hover:bg-amber-300 shadow-md shadow-amber-400/10'
                      : 'border border-white/15 bg-white/5 text-white hover:border-amber-400 hover:text-amber-400 hover:bg-amber-400/10'
                  }`}
                >
                  <span>Buka Modul</span>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. TOURNAMENT ORGANIZER BRIDGE CALLOUT */}
      <div className="rounded-2xl border border-amber-400/30 bg-gradient-to-r from-amber-400/10 via-slate-950 to-indigo-950/20 p-5 sm:p-6 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-[10px] font-bold text-amber-400 uppercase tracking-wider">
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
            <span>INTEGRASI TURNAMEN & DRAFTING</span>
          </div>
          <h4 className="text-lg sm:text-xl font-black text-white uppercase font-sans">
            Mengatur Turnamen atau Sesi Scrim MLBB?
          </h4>
          <p className="text-xs text-slate-400 max-w-xl">
            Gunakan kalkulator klasemen deterministik Klasim untuk menentukan seed, dan bawa tim ke Draft Simulator 5v5 untuk simulasi ban-pick turnamen resmi.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2.5 shrink-0">
          <Link
            href="/tournament/create"
            className="rounded-xl bg-amber-400 px-4 py-2.5 text-xs font-black uppercase text-black hover:bg-amber-300 transition-all active:scale-95 shadow-md shadow-amber-400/20"
          >
            Buat Turnamen Kustom
          </Link>
          <Link
            href="/tournament/mpl-id-s14"
            className="rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-xs font-bold uppercase text-white hover:border-amber-400 hover:text-amber-400 transition-all active:scale-95"
          >
            Buka MPL ID S14
          </Link>
        </div>
      </div>
    </div>
  );
}
