// src/app/mlbb/builds/page.tsx
'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import {
  heroes as allHeroes,
  type MLBBHero,
  type MLBBEnrichedBuild,
} from '@/data/mlbb';
import buildsData from '@/data/mlbb/builds.json';

interface FlattenedBuild {
  hero: MLBBHero;
  build: MLBBEnrichedBuild;
  category: 'mpl' | 'mseries' | 'community';
}

export default function BuildsHubPage() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'mpl' | 'mseries' | 'community'>('all');
  const [selectedRole, setSelectedRole] = useState<string>('ALL');
  const [selectedLane, setSelectedLane] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [inspectedBuild, setInspectedBuild] = useState<FlattenedBuild | null>(null);

  // Flatten all 365 builds with their parent hero
  const allFlattenedBuilds = useMemo<FlattenedBuild[]>(() => {
    const list: FlattenedBuild[] = [];
    const buildsMap = (buildsData as unknown) as Record<string, MLBBEnrichedBuild[]>;

    Object.entries(buildsMap).forEach(([heroSlug, bList]) => {
      const hero = allHeroes.find(h => h.slug === heroSlug);
      if (!hero) return;

      bList.forEach((b, idx) => {
        // Tag category based on verification and likes
        let category: 'mpl' | 'mseries' | 'community' = 'community';
        if (b.is_verified || (b.likes_count && b.likes_count >= 4) || idx === 0) {
          category = 'mpl';
        } else if (idx === 1) {
          category = 'mseries';
        }

        list.push({
          hero,
          build: b,
          category,
        });
      });
    });

    return list;
  }, []);

  // Filtered builds
  const filteredBuilds = useMemo(() => {
    return allFlattenedBuilds.filter(item => {
      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }

      // Role filter
      if (selectedRole !== 'ALL' && !item.hero.roles.some(r => r.toUpperCase() === selectedRole)) {
        return false;
      }

      // Lane filter
      if (selectedLane !== 'ALL' && !item.hero.lane.some(l => l.toUpperCase().includes(selectedLane))) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchHero = item.hero.name.toLowerCase().includes(q);
        const matchTitle = item.build.title?.toLowerCase().includes(q);
        const matchDesc = item.build.description?.toLowerCase().includes(q);
        if (!matchHero && !matchTitle && !matchDesc) return false;
      }

      return true;
    }).sort((a, b) => (b.build.likes_count || 0) - (a.build.likes_count || 0));
  }, [allFlattenedBuilds, selectedCategory, selectedRole, selectedLane, searchQuery]);

  // Categories definition
  const categories = [
    { id: 'all', label: 'SEMUA BUILD', icon: '📦', count: allFlattenedBuilds.length },
    { id: 'mpl', label: '🏆 MPL PRO BUILDS', icon: '🏆', count: allFlattenedBuilds.filter(b => b.category === 'mpl').length },
    { id: 'mseries', label: '🌍 M-SERIES BUILDS', icon: '🌍', count: allFlattenedBuilds.filter(b => b.category === 'mseries').length },
    { id: 'community', label: '👥 TOP KOMUNITAS', icon: '👥', count: allFlattenedBuilds.filter(b => b.category === 'community').length },
  ];

  return (
    <div className="min-h-screen bg-[#05070c] text-white selection:bg-amber-400 selection:text-black">
      <Navbar activeSection="mlbb" />

      <main className="pt-24 sm:pt-28 pb-32">
        {/* Header HUD Banner */}
        <section className="relative overflow-hidden border-b border-white/10 bg-gradient-to-b from-[#090e17] via-[#05070c] to-[#05070c] py-10 sm:py-14">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-400/10 via-transparent to-transparent pointer-events-none" />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 font-mono text-[10px] sm:text-xs text-amber-400 mb-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                  <span>PRO LEAGUE & TOURNAMENT BUILDS REPOSITORY</span>
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white font-sans uppercase">
                  TOURNAMENT <span className="text-amber-400">BUILDS HUB</span>
                </h1>
                <p className="mt-2 max-w-2xl text-xs sm:text-sm text-slate-400 font-sans">
                  Koleksi 365+ racikan build equipment resmi MPL dan M-Series Championship dari 133 hero MLBB. Lengkap dengan komposisi spell, emblem, dan kalkulasi akumulasi stat.
                </p>
              </div>

              {/* Quick Navigation Pills */}
              <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                <Link
                  href="/mlbb/builder"
                  className="rounded-lg border border-amber-400/40 bg-amber-400/10 px-3 py-2 text-amber-400 hover:bg-amber-400 hover:text-black transition-all flex items-center gap-1.5 font-bold"
                >
                  <span>🛠️</span>
                  <span>Workshop Builder</span>
                </Link>
                <Link
                  href="/mlbb/heroes"
                  className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-slate-300 hover:border-amber-400/40 hover:text-amber-400 transition-all flex items-center gap-1.5"
                >
                  <span>🛡️</span>
                  <span>Hero Hub</span>
                </Link>
                <Link
                  href="/mlbb/tier-list"
                  className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-slate-300 hover:border-amber-400/40 hover:text-amber-400 transition-all flex items-center gap-1.5"
                >
                  <span>🏆</span>
                  <span>Tier List</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Filter & Search Matrix */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-6">
          <div className="rounded-2xl border border-white/10 bg-[#080d16] p-4 sm:p-5 shadow-2xl space-y-4">
            {/* Search and Dropdowns */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              <div className="relative flex-1">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                  <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari berdasarkan nama hero atau strategi build (contoh: Fanny, One Shot, Burst, Tank, Roam)..."
                  className="w-full rounded-xl border border-white/10 bg-black/60 pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none font-sans"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                {/* Role Filter */}
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-slate-300 focus:border-amber-400 focus:outline-none"
                >
                  <option value="ALL">Semua Role</option>
                  <option value="ASSASSIN">Assassin</option>
                  <option value="MARKSMAN">Marksman</option>
                  <option value="MAGE">Mage</option>
                  <option value="FIGHTER">Fighter</option>
                  <option value="TANK">Tank</option>
                  <option value="SUPPORT">Support</option>
                </select>

                {/* Lane Filter */}
                <select
                  value={selectedLane}
                  onChange={(e) => setSelectedLane(e.target.value)}
                  className="rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-slate-300 focus:border-amber-400 focus:outline-none"
                >
                  <option value="ALL">Semua Lane</option>
                  <option value="EXP">EXP Lane</option>
                  <option value="MID">Mid Lane</option>
                  <option value="GOLD">Gold Lane</option>
                  <option value="ROAM">Roam</option>
                  <option value="JUNGLE">Jungling</option>
                </select>
              </div>
            </div>

            {/* Category Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-t border-white/5 pt-3">
              {categories.map(cat => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id as any)}
                    className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-mono font-bold uppercase transition-all whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
                        : 'border border-white/5 bg-black/40 text-slate-400 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded ${isActive ? 'bg-black/20 text-black' : 'bg-white/10 text-slate-400'}`}>
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Results Counter */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-4 flex items-center justify-between text-xs font-mono text-slate-400">
          <div>
            Menampilkan <strong className="text-amber-400">{filteredBuilds.length}</strong> racikan build turnamen
          </div>
        </section>

        {/* Builds Grid */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-4">
          {filteredBuilds.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-black/40 p-12 text-center">
              <div className="flex justify-center mb-3">
                <svg className="w-12 h-12 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
              <h3 className="mt-3 text-lg font-bold text-white font-sans">Build Tidak Ditemukan</h3>
              <p className="mt-1 text-xs text-slate-400 font-sans">
                Tidak ada build yang cocok dengan kriteria pencarian Anda. Silakan reset filter.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredBuilds.map((item, idx) => {
                const totalCost = (item.build.items || []).reduce((acc: number, cur: any) => acc + (cur.price || 0), 0);
                const isMpl = item.category === 'mpl';

                return (
                  <div
                    key={idx}
                    onClick={() => setInspectedBuild(item)}
                    className="group relative flex flex-col justify-between rounded-3xl border border-white/10 bg-[#080d16] p-5 hover:border-amber-400/50 hover:shadow-2xl transition-all duration-200 cursor-pointer"
                  >
                    <div>
                      {/* Top Header: Hero Avatar + Title */}
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={item.hero.image}
                            alt={item.hero.name}
                            className="h-12 w-12 rounded-xl object-cover border border-white/15 bg-black shrink-0 group-hover:scale-105 transition-transform"
                          />
                          <div className="min-w-0">
                            <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors truncate font-sans">
                              {item.hero.name}
                            </h4>
                            <div className="text-[10px] font-mono text-slate-400 truncate">
                              {item.build.title || 'Official Tournament Build'}
                            </div>
                          </div>
                        </div>

                        {/* Category Badge */}
                        <span className={`shrink-0 rounded-md border px-2 py-0.5 text-[9px] font-mono font-bold uppercase ${
                          isMpl ? 'border-amber-400/40 bg-amber-400/10 text-amber-400' : 'border-cyan-400/40 bg-cyan-400/10 text-cyan-400'
                        }`}>
                          {isMpl ? 'MPL PRO' : 'M-SERIES'}
                        </span>
                      </div>

                      {/* 6 Equipment Items Icons */}
                      <div className="grid grid-cols-6 gap-1.5 my-3.5 bg-black/40 border border-white/5 rounded-2xl p-2">
                        {item.build.items?.map((it: any, itemIdx: number) => (
                          <div
                            key={itemIdx}
                            title={it.name}
                            className="relative h-10 rounded-lg overflow-hidden border border-white/10 bg-slate-900 p-0.5 flex items-center justify-center"
                          >
                            <img src={it.image} alt={it.name} className="h-full w-full object-contain" />
                          </div>
                        ))}
                      </div>

                      {/* Spell & Emblem */}
                      <div className="flex items-center justify-between font-mono text-xs pt-1">
                        <div className="flex items-center gap-2">
                          {item.build.spell && (
                            <div className="flex items-center gap-1 text-[11px] text-slate-300">
                              <img src={item.build.spell.image} alt={item.build.spell.name} className="h-5 w-5 rounded object-contain" />
                              <span className="truncate max-w-[90px]">{item.build.spell.name}</span>
                            </div>
                          )}
                          {item.build.emblem && (
                            <div className="flex items-center gap-1 text-[11px] text-slate-300">
                              <img src={item.build.emblem.image} alt={item.build.emblem.name} className="h-5 w-5 rounded object-contain" />
                              <span className="truncate max-w-[80px]">{item.build.emblem.name}</span>
                            </div>
                          )}
                        </div>

                        <span className="text-[10px] font-bold text-amber-400">
                          💰 {totalCost.toLocaleString()}g
                        </span>
                      </div>

                      {/* 3 Talents Preview */}
                      {item.build.talents && (
                        <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-white/5 mt-2">
                          {item.build.talents.tier1 && (
                            <div title={`Tier 1: ${item.build.talents.tier1.name} — ${item.build.talents.tier1.description}`} className="flex items-center gap-1 rounded-md border border-amber-400/20 bg-amber-400/5 px-1.5 py-0.5">
                              <img src={item.build.talents.tier1.image} alt={item.build.talents.tier1.name} className="h-3.5 w-3.5 object-contain shrink-0" />
                              <span className="text-[9px] font-mono text-amber-300 truncate">{item.build.talents.tier1.name}</span>
                            </div>
                          )}
                          {item.build.talents.tier2 && (
                            <div title={`Tier 2: ${item.build.talents.tier2.name} — ${item.build.talents.tier2.description}`} className="flex items-center gap-1 rounded-md border border-cyan-400/20 bg-cyan-400/5 px-1.5 py-0.5">
                              <img src={item.build.talents.tier2.image} alt={item.build.talents.tier2.name} className="h-3.5 w-3.5 object-contain shrink-0" />
                              <span className="text-[9px] font-mono text-cyan-300 truncate">{item.build.talents.tier2.name}</span>
                            </div>
                          )}
                          {item.build.talents.tier3 && (
                            <div title={`Tier 3: ${item.build.talents.tier3.name} — ${item.build.talents.tier3.description}`} className="flex items-center gap-1 rounded-md border border-purple-400/20 bg-purple-400/5 px-1.5 py-0.5">
                              <img src={item.build.talents.tier3.image} alt={item.build.talents.tier3.name} className="h-3.5 w-3.5 object-contain shrink-0" />
                              <span className="text-[9px] font-mono text-purple-300 truncate">{item.build.talents.tier3.name}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Bottom Card Actions */}
                    <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                      <span className="text-[10px] font-mono text-slate-500">
                        👍 {item.build.likes_count || 1} Pro Upvotes
                      </span>
                      <span className="text-[10px] font-mono font-bold text-amber-400 flex items-center gap-1">
                        <span>Inspect Build</span>
                        <span>→</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* Build Detail Inspector Modal */}
      {inspectedBuild && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-in fade-in duration-150"
        >
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/15 bg-[#080d16] p-6 sm:p-7 shadow-2xl space-y-6">
            <button
              onClick={() => setInspectedBuild(null)}
              className="absolute top-5 right-5 h-8 w-8 rounded-full border border-white/10 bg-white/5 text-slate-400 hover:text-white flex items-center justify-center font-mono text-sm cursor-pointer"
            >
              ✕
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-4">
              <img
                src={inspectedBuild.hero.image}
                alt={inspectedBuild.hero.name}
                className="h-16 w-16 rounded-2xl object-cover border-2 border-amber-400/50 bg-black"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-black text-white font-sans">{inspectedBuild.hero.name}</h3>
                  <span className="rounded bg-amber-400/20 text-amber-300 font-mono text-[10px] font-bold px-2 py-0.5">
                    {inspectedBuild.category.toUpperCase()}
                  </span>
                </div>
                <div className="text-sm font-bold text-slate-300 mt-0.5 font-sans">
                  {inspectedBuild.build.title || 'Official Tournament Build'}
                </div>
                <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                  Role: {inspectedBuild.hero.roles.join(', ')} • Lane: {inspectedBuild.hero.lane.join(', ')}
                </div>
              </div>
            </div>

            {/* 6 Equipment items with full stats */}
            <div className="space-y-3">
              <div className="text-xs font-mono font-bold uppercase text-slate-400 tracking-wider">
                Komposisi 6 Equipment Item
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {inspectedBuild.build.items?.map((it: any, iIdx: number) => (
                  <div
                    key={iIdx}
                    className="flex items-center gap-3 rounded-2xl border border-white/5 bg-black/40 p-3"
                  >
                    <img src={it.image} alt={it.name} className="h-10 w-10 rounded-xl object-contain border border-white/10 p-0.5 bg-slate-900" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white truncate font-sans">{it.name}</span>
                        <span className="text-[10px] font-mono text-amber-400 font-bold">{it.price}g</span>
                      </div>
                      <div className="text-[10px] font-mono text-slate-400 truncate">
                        {it.type} Equipment
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Spell & Emblem Details */}
            <div className="grid grid-cols-2 gap-3">
              {inspectedBuild.build.spell && (
                <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-black/40 p-3">
                  <img src={inspectedBuild.build.spell.image} alt={inspectedBuild.build.spell.name} className="h-10 w-10 rounded-xl object-contain border border-white/10 p-0.5 bg-slate-900" />
                  <div className="min-w-0">
                    <span className="text-[9px] font-mono text-slate-500 uppercase font-bold block">BATTLE SPELL</span>
                    <span className="text-xs font-bold text-white truncate block">{inspectedBuild.build.spell.name}</span>
                    <span className="text-[10px] font-mono text-amber-400">CD: {inspectedBuild.build.spell.cooldown}s</span>
                  </div>
                </div>
              )}
              {inspectedBuild.build.emblem && (
                <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-black/40 p-3">
                  <img src={inspectedBuild.build.emblem.image} alt={inspectedBuild.build.emblem.name} className="h-10 w-10 rounded-xl object-contain border border-white/10 p-0.5 bg-slate-900" />
                  <div className="min-w-0">
                    <span className="text-[9px] font-mono text-slate-500 uppercase font-bold block">CUSTOM EMBLEM</span>
                    <span className="text-xs font-bold text-white truncate block">{inspectedBuild.build.emblem.name}</span>
                    <span className="text-[10px] font-mono text-emerald-400">Adaptive Set</span>
                  </div>
                </div>
              )}
            </div>

            {/* 3-Tier Talents Breakdown */}
            {inspectedBuild.build.talents && (
              <div className="rounded-2xl border border-white/10 bg-black/50 p-4 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono font-bold uppercase text-amber-400 tracking-wider">
                  <span>✨ 3-TIER EMBLEM TALENTS CONFIGURATION</span>
                  <span className="text-[10px] text-slate-500">Official MoleBuild</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {inspectedBuild.build.talents.tier1 && (
                    <div className="rounded-xl border border-amber-400/20 bg-amber-400/5 p-2.5 space-y-1">
                      <div className="flex items-center gap-2">
                        <img src={inspectedBuild.build.talents.tier1.image} alt={inspectedBuild.build.talents.tier1.name} className="h-6 w-6 object-contain" />
                        <span className="text-[10px] font-mono text-amber-400 font-bold uppercase">TIER 1 (STAT)</span>
                      </div>
                      <div className="text-xs font-bold text-white">{inspectedBuild.build.talents.tier1.name}</div>
                      <p className="text-[10px] text-slate-400 line-clamp-2 leading-tight">{inspectedBuild.build.talents.tier1.description}</p>
                    </div>
                  )}
                  {inspectedBuild.build.talents.tier2 && (
                    <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-2.5 space-y-1">
                      <div className="flex items-center gap-2">
                        <img src={inspectedBuild.build.talents.tier2.image} alt={inspectedBuild.build.talents.tier2.name} className="h-6 w-6 object-contain" />
                        <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">TIER 2 (UTILITY)</span>
                      </div>
                      <div className="text-xs font-bold text-white">{inspectedBuild.build.talents.tier2.name}</div>
                      <p className="text-[10px] text-slate-400 line-clamp-2 leading-tight">{inspectedBuild.build.talents.tier2.description}</p>
                    </div>
                  )}
                  {inspectedBuild.build.talents.tier3 && (
                    <div className="rounded-xl border border-purple-400/20 bg-purple-400/5 p-2.5 space-y-1">
                      <div className="flex items-center gap-2">
                        <img src={inspectedBuild.build.talents.tier3.image} alt={inspectedBuild.build.talents.tier3.name} className="h-6 w-6 object-contain" />
                        <span className="text-[10px] font-mono text-purple-400 font-bold uppercase">TIER 3 (CORE)</span>
                      </div>
                      <div className="text-xs font-bold text-white">{inspectedBuild.build.talents.tier3.name}</div>
                      <p className="text-[10px] text-slate-400 line-clamp-2 leading-tight">{inspectedBuild.build.talents.tier3.description}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Total Stats Telemetry */}
            {inspectedBuild.build.totalStats && (
              <div className="rounded-2xl border border-amber-400/20 bg-amber-400/5 p-4 space-y-2">
                <div className="text-xs font-mono font-bold uppercase text-amber-400 tracking-wider">
                  Akumulasi Bonus Statistik Build
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-xs">
                  {Object.entries(inspectedBuild.build.totalStats).map(([k, val]) => (
                    <div key={k} className="flex justify-between border-b border-white/5 py-1">
                      <span className="text-slate-400 capitalize">{k.replace('_', ' ')}:</span>
                      <span className="font-bold text-emerald-400">+{typeof val === 'number' && val < 1 && val > 0 ? `${Math.round(val * 100)}%` : val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Bottom Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-white/10">
              <div className="flex items-center gap-4">
                <Link
                  href={`/mlbb/heroes/${inspectedBuild.hero.slug}`}
                  className="text-xs font-mono font-bold text-amber-400 hover:underline"
                >
                  Detail Hero →
                </Link>

                <Link
                  href={`/mlbb/builder?hero=${encodeURIComponent(inspectedBuild.hero.slug)}&items=${encodeURIComponent(inspectedBuild.build.items.map((i: any) => i.slug).join(','))}&spell=${encodeURIComponent(inspectedBuild.build.spell?.id || '')}&emblem=${encodeURIComponent(inspectedBuild.build.emblem?.id || '')}&t1=${encodeURIComponent(inspectedBuild.build.talents?.tier1?.id || '')}&t2=${encodeURIComponent(inspectedBuild.build.talents?.tier2?.id || '')}&t3=${encodeURIComponent(inspectedBuild.build.talents?.tier3?.id || '')}&title=${encodeURIComponent(inspectedBuild.build.title)}`}
                  className="text-xs font-mono font-bold text-cyan-400 hover:underline flex items-center gap-1"
                >
                  <span>Buka di Workshop Builder</span>
                  <span>🛠️</span>
                </Link>
              </div>

              <button
                onClick={() => setInspectedBuild(null)}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-mono text-slate-300 hover:bg-white/10 transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
