// src/app/mlbb/items/page.tsx
'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import {
  items as allItems,
  heroes as allHeroes,
  type MLBBItem,
  type MLBBHero,
} from '@/data/mlbb';
import buildsData from '@/data/mlbb/builds.json';

// Helper to normalize stat names into clean human-readable labels and clean values
function formatStatKey(key: string): string {
  const k = key.toLowerCase().replace(/_/g, ' ').trim();
  if (k.includes('physical') && k.includes('attack')) return 'Physical Attack';
  if (k === 'magic power') return 'Magic Power';
  if (k === 'hp') return 'Max HP';
  if (k === 'mana') return 'Max Mana';
  if (k === 'physical defense') return 'Physical Defense';
  if (k === 'magic defense') return 'Magic Defense';
  if (k === 'attack speed') return 'Attack Speed';
  if (k.includes('cooldown') || k.includes('cd')) return 'Cooldown Reduction';
  if (k === 'movement speed') return 'Movement Speed';
  if (k === 'lifesteal') return 'Lifesteal';
  if (k === 'spell vamp') return 'Spell Vamp';
  if (k === 'hybrid lifesteal') return 'Hybrid Lifesteal';
  if (k === 'adaptive attack') return 'Adaptive Attack';
  if (k === 'crit chance') return 'Crit Chance';
  if (k === 'magic penetration') return 'Magic Penetration';
  if (k === 'physical penetration') return 'Physical Penetration';
  if (k === 'hp regen') return 'HP Regen';
  if (k === 'mana regen') return 'Mana Regen';
  if (k === 'slow reduction') return 'Slow Reduction';
  return key;
}

function formatStatValue(val: any, key: string): string {
  if (typeof val === 'number') {
    if (val < 1 && val > 0 && (key.includes('speed') || key.includes('crit') || key.includes('vamp') || key.includes('lifesteal') || key.includes('cooldown') || key.includes('reduction'))) {
      return `+${Math.round(val * 100)}%`;
    }
    return `+${val}`;
  }
  const s = String(val).trim();
  if (s.startsWith('*')) {
    const num = parseFloat(s.slice(1));
    if (!isNaN(num)) return `+${Math.round(num * 100)}%`;
  }
  return s;
}

function getItemTier(price?: number | null): { label: string; tier: number; color: string; border: string } {
  const p = price || 0;
  if (p >= 1500) {
    return { label: 'T3 CORE', tier: 3, color: 'text-amber-400 bg-amber-400/10', border: 'border-amber-400/40' };
  } else if (p >= 700) {
    return { label: 'T2 MID', tier: 2, color: 'text-cyan-400 bg-cyan-400/10', border: 'border-cyan-400/40' };
  }
  return { label: 'T1 BASIC', tier: 1, color: 'text-slate-400 bg-slate-800/40', border: 'border-white/10' };
}

function getTypeColor(type: string): { bg: string; text: string; border: string; glow: string } {
  switch (type.toLowerCase()) {
    case 'attack':
      return { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/30', glow: 'hover:shadow-rose-500/20' };
    case 'magic':
      return { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30', glow: 'hover:shadow-purple-500/20' };
    case 'defense':
      return { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30', glow: 'hover:shadow-emerald-500/20' };
    case 'movement':
      return { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/30', glow: 'hover:shadow-cyan-500/20' };
    default:
      return { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30', glow: 'hover:shadow-amber-500/20' };
  }
}

export default function ItemsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [selectedAttribute, setSelectedAttribute] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'price-desc' | 'price-asc' | 'name-asc' | 'name-desc'>('price-desc');
  
  // Quick View Modal
  const [inspectedItem, setInspectedItem] = useState<MLBBItem | null>(null);

  // Comparison Dock (up to 2 items)
  const [comparedItems, setComparedItems] = useState<MLBBItem[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // Precompute heroes using each item
  const itemHeroUsage = useMemo(() => {
    const map = new Map<string, MLBBHero[]>();
    const allBuilds = buildsData as Record<string, Array<{ items?: Array<{ slug?: string; name?: string }> }>>;
    
    allItems.forEach(item => {
      const heroesUsingThis: MLBBHero[] = [];
      Object.entries(allBuilds).forEach(([heroSlug, bList]) => {
        const isUsed = bList.some(b => 
          b.items && b.items.some(it => (it.slug && it.slug === item.slug) || (it.name && it.name.toLowerCase() === item.name.toLowerCase()))
        );
        if (isUsed) {
          const hero = allHeroes.find(h => h.slug === heroSlug);
          if (hero && !heroesUsingThis.some(h => h.id === hero.id)) {
            heroesUsingThis.push(hero);
          }
        }
      });
      map.set(item.slug, heroesUsingThis);
    });
    return map;
  }, []);

  // Category Tabs
  const typeCategories = [
    { id: 'all', label: 'SEMUA ITEM', icon: '📦', count: allItems.length },
    { id: 'Attack', label: 'ATTACK / PHYSICAL', icon: '⚔️', count: allItems.filter(i => i.type.toLowerCase() === 'attack').length },
    { id: 'Magic', label: 'MAGIC', icon: '🔮', count: allItems.filter(i => i.type.toLowerCase() === 'magic').length },
    { id: 'Defense', label: 'DEFENSE', icon: '🛡️', count: allItems.filter(i => i.type.toLowerCase() === 'defense').length },
    { id: 'Movement', label: 'MOVEMENT / BOOTS', icon: '👟', count: allItems.filter(i => i.type.toLowerCase() === 'movement').length },
  ];

  // Attribute Filters
  const attributeFilters = [
    { id: 'all', label: 'Semua Atribut' },
    { id: 'physical_attack', label: 'Physical Attack' },
    { id: 'magic_power', label: 'Magic Power' },
    { id: 'hp', label: 'Max HP' },
    { id: 'physical_defense', label: 'Physical Defense' },
    { id: 'magic_defense', label: 'Magic Defense' },
    { id: 'attack_speed', label: 'Attack Speed' },
    { id: 'cooldown_reduction', label: 'CD Reduction' },
    { id: 'lifesteal', label: 'Lifesteal / Spell Vamp' },
    { id: 'crit_chance', label: 'Crit Chance' },
    { id: 'penetration', label: 'Penetration (PEN)' },
    { id: 'movement_speed', label: 'Movement Speed' },
  ];

  // Tier Filters
  const tierFilters = [
    { id: 'all', label: 'Semua Tier' },
    { id: '3', label: 'Tier 3 (Core Finished)' },
    { id: '2', label: 'Tier 2 (Mid Components)' },
    { id: '1', label: 'Tier 1 (Basic / Starter)' },
  ];

  // Filter and sort items
  const filteredItems = useMemo(() => {
    return allItems.filter(item => {
      // Type category filter
      if (selectedType !== 'all' && item.type.toLowerCase() !== selectedType.toLowerCase()) {
        return false;
      }

      // Tier filter
      const itemTier = getItemTier(item.price).tier;
      if (selectedTier !== 'all' && String(itemTier) !== selectedTier) {
        return false;
      }

      // Attribute filter
      if (selectedAttribute !== 'all') {
        const statsKeys = Object.keys(item.stats || {}).map(k => k.toLowerCase());
        if (selectedAttribute === 'physical_attack') {
          if (!statsKeys.some(k => k.includes('physical') && k.includes('attack'))) return false;
        } else if (selectedAttribute === 'magic_power') {
          if (!statsKeys.some(k => k.includes('magic_power') || k.includes('magic power'))) return false;
        } else if (selectedAttribute === 'hp') {
          if (!statsKeys.some(k => k === 'hp')) return false;
        } else if (selectedAttribute === 'physical_defense') {
          if (!statsKeys.some(k => k.includes('physical_defense') || k.includes('physical defense'))) return false;
        } else if (selectedAttribute === 'magic_defense') {
          if (!statsKeys.some(k => k.includes('magic_defense') || k.includes('magic defense'))) return false;
        } else if (selectedAttribute === 'attack_speed') {
          if (!statsKeys.some(k => k.includes('attack_speed') || k.includes('attack speed'))) return false;
        } else if (selectedAttribute === 'cooldown_reduction') {
          if (!statsKeys.some(k => k.includes('cooldown') || k.includes('cd'))) return false;
        } else if (selectedAttribute === 'lifesteal') {
          if (!statsKeys.some(k => k.includes('lifesteal') || k.includes('vamp'))) return false;
        } else if (selectedAttribute === 'crit_chance') {
          if (!statsKeys.some(k => k.includes('crit'))) return false;
        } else if (selectedAttribute === 'penetration') {
          if (!statsKeys.some(k => k.includes('penetration'))) return false;
        } else if (selectedAttribute === 'movement_speed') {
          if (!statsKeys.some(k => k.includes('movement'))) return false;
        }
      }

      // Search query (name, passive, stats)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = item.name.toLowerCase().includes(q);
        const matchPassive = item.passive_description && item.passive_description.toLowerCase().includes(q);
        const matchStats = Object.keys(item.stats || {}).some(k => k.toLowerCase().includes(q));
        if (!matchName && !matchPassive && !matchStats) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
      return 0;
    });
  }, [selectedType, selectedTier, selectedAttribute, searchQuery, sortBy]);

  // Comparison dock toggling
  const toggleCompare = (item: MLBBItem) => {
    setComparedItems(prev => {
      const exists = prev.some(i => i.id === item.id);
      if (exists) {
        return prev.filter(i => i.id !== item.id);
      }
      if (prev.length >= 2) {
        // Replace second item
        return [prev[0], item];
      }
      return [...prev, item];
    });
  };

  const isItemCompared = (itemId: string) => {
    return comparedItems.some(i => i.id === itemId);
  };

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
                  <span>DATABASE ITEM RESMI MLBB • MOLEBUILD ENGINE</span>
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white font-sans uppercase">
                  ITEM <span className="text-amber-400">ENCYCLOPEDIA</span>
                </h1>
                <p className="mt-2 max-w-2xl text-xs sm:text-sm text-slate-400 font-sans">
                  Katalog lengkap 90 equipment Mobile Legends: Bang Bang. Eksplorasi statistik dasar, efek pasif unik, build path, kompatibilitas hero, dan perbandingan item head-to-head.
                </p>
              </div>

              {/* Quick Navigation Pills */}
              <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
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
                  <span>Meta Tier List</span>
                </Link>
                <Link
                  href="/mlbb/draft"
                  className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-slate-300 hover:border-amber-400/40 hover:text-amber-400 transition-all flex items-center gap-1.5"
                >
                  <span>⚔️</span>
                  <span>Draft 5v5</span>
                </Link>
                <Link
                  href="/mlbb/counter-pick"
                  className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-slate-300 hover:border-amber-400/40 hover:text-amber-400 transition-all flex items-center gap-1.5"
                >
                  <span>🎯</span>
                  <span>Counter Pick</span>
                </Link>
              </div>
            </div>

            {/* Quick Stat Counter Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
              <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-3 flex items-center gap-3">
                <span className="text-2xl">⚔️</span>
                <div>
                  <div className="text-lg font-black text-rose-400 font-mono">
                    {allItems.filter(i => i.type.toLowerCase() === 'attack').length}
                  </div>
                  <div className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Physical Attack</div>
                </div>
              </div>

              <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-3 flex items-center gap-3">
                <span className="text-2xl">🔮</span>
                <div>
                  <div className="text-lg font-black text-purple-400 font-mono">
                    {allItems.filter(i => i.type.toLowerCase() === 'magic').length}
                  </div>
                  <div className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Magic Power</div>
                </div>
              </div>

              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 flex items-center gap-3">
                <span className="text-2xl">🛡️</span>
                <div>
                  <div className="text-lg font-black text-emerald-400 font-mono">
                    {allItems.filter(i => i.type.toLowerCase() === 'defense').length}
                  </div>
                  <div className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Defense & HP</div>
                </div>
              </div>

              <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-3 flex items-center gap-3">
                <span className="text-2xl">👟</span>
                <div>
                  <div className="text-lg font-black text-cyan-400 font-mono">
                    {allItems.filter(i => i.type.toLowerCase() === 'movement').length}
                  </div>
                  <div className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Movement Boots</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Filter & Search Matrix */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-6">
          <div className="rounded-2xl border border-white/10 bg-[#080d16] p-4 sm:p-5 shadow-2xl space-y-4">
            {/* Top Row: Search & Sorters */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              {/* Search Bar */}
              <div className="relative flex-1">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm">🔍</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari nama item, atribut, atau efek pasif (contoh: anti-heal, lifesteal, burn, despair)..."
                  className="w-full rounded-xl border border-white/10 bg-black/60 pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 transition-all font-sans"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-white"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Sorters & Secondary Filters */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Attribute Selector */}
                <select
                  value={selectedAttribute}
                  onChange={(e) => setSelectedAttribute(e.target.value)}
                  className="rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-xs font-mono text-slate-300 focus:border-amber-400 focus:outline-none"
                >
                  {attributeFilters.map(attr => (
                    <option key={attr.id} value={attr.id} className="bg-slate-900 text-white">
                      {attr.label}
                    </option>
                  ))}
                </select>

                {/* Tier Selector */}
                <select
                  value={selectedTier}
                  onChange={(e) => setSelectedTier(e.target.value)}
                  className="rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-xs font-mono text-slate-300 focus:border-amber-400 focus:outline-none"
                >
                  {tierFilters.map(tier => (
                    <option key={tier.id} value={tier.id} className="bg-slate-900 text-white">
                      {tier.label}
                    </option>
                  ))}
                </select>

                {/* Sort Selector */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-xs font-mono text-slate-300 focus:border-amber-400 focus:outline-none"
                >
                  <option value="price-desc" className="bg-slate-900 text-white">💰 Harga: Tertinggi ke Terendah</option>
                  <option value="price-asc" className="bg-slate-900 text-white">💰 Harga: Terendah ke Tertinggi</option>
                  <option value="name-asc" className="bg-slate-900 text-white">🔤 Nama: A → Z</option>
                  <option value="name-desc" className="bg-slate-900 text-white">🔤 Nama: Z → A</option>
                </select>
              </div>
            </div>

            {/* Bottom Row: Category Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-t border-white/5 pt-3">
              {typeCategories.map(cat => {
                const isActive = selectedType === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedType(cat.id)}
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

        {/* Results Info Bar */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-4 flex items-center justify-between text-xs font-mono text-slate-400">
          <div>
            Menampilkan <strong className="text-amber-400">{filteredItems.length}</strong> dari 90 item
            {searchQuery && <span> untuk &ldquo;{searchQuery}&rdquo;</span>}
          </div>
          {comparedItems.length > 0 && (
            <div className="flex items-center gap-2 text-amber-400">
              <span>{comparedItems.length}/2 item dipilih untuk perbandingan</span>
              <button
                onClick={() => setIsCompareModalOpen(true)}
                className="underline hover:text-amber-300 font-bold"
              >
                Buka Komparator →
              </button>
            </div>
          )}
        </section>

        {/* Items Grid */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-4">
          {filteredItems.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-black/40 p-12 text-center">
              <span className="text-4xl">🔍</span>
              <h3 className="mt-3 text-lg font-bold text-white font-sans">Item Tidak Ditemukan</h3>
              <p className="mt-1 text-xs text-slate-400 font-sans">
                Tidak ada item yang cocok dengan filter atau kata kunci &ldquo;{searchQuery}&rdquo;. Silakan reset filter.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedType('all');
                  setSelectedTier('all');
                  setSelectedAttribute('all');
                }}
                className="mt-4 rounded-xl border border-amber-400/40 bg-amber-400/10 px-4 py-2 text-xs font-mono text-amber-400 hover:bg-amber-400 hover:text-black transition-all"
              >
                Reset Semua Filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredItems.map(item => {
                const tierInfo = getItemTier(item.price);
                const typeStyle = getTypeColor(item.type);
                const statsEntries = Object.entries(item.stats || {});
                const isCompared = isItemCompared(item.id);

                return (
                  <div
                    key={item.id}
                    onClick={() => setInspectedItem(item)}
                    className={`group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-[#080d16] p-4 transition-all duration-200 hover:-translate-y-1 hover:border-amber-400/50 hover:shadow-xl cursor-pointer ${typeStyle.glow}`}
                  >
                    {/* Top Header: Category & Price */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className={`rounded-md border px-2 py-0.5 text-[9px] font-mono font-bold uppercase ${typeStyle.bg} ${typeStyle.text} ${typeStyle.border}`}>
                          {item.type}
                        </span>
                        <div className="flex items-center gap-1.5 font-mono text-xs font-black text-amber-400">
                          <span>💰</span>
                          <span>{(item.price ?? 0).toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Item Visual & Title */}
                      <div className="flex items-center gap-3">
                        <div className="relative h-14 w-14 shrink-0 rounded-xl overflow-hidden border border-white/15 bg-black/60 p-1 group-hover:border-amber-400 transition-colors">
                          <img
                            src={item.image}
                            alt={item.name}
                            onError={(e) => {
                              // Remote fallback
                              if (item.image_remote) {
                                (e.target as HTMLImageElement).src = item.image_remote;
                              }
                            }}
                            className="h-full w-full object-contain"
                          />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors truncate font-sans">
                            {item.name}
                          </h4>
                          <span className={`inline-block mt-0.5 rounded border px-1.5 py-0.2 text-[8px] font-mono font-bold ${tierInfo.color} ${tierInfo.border}`}>
                            {tierInfo.label}
                          </span>
                        </div>
                      </div>

                      {/* Stat Lines */}
                      <div className="mt-3.5 space-y-1 border-t border-white/5 pt-2.5">
                        {statsEntries.length > 0 ? (
                          statsEntries.slice(0, 3).map(([k, val]) => (
                            <div key={k} className="flex items-center justify-between text-[11px] font-mono">
                              <span className="text-slate-400 truncate max-w-[130px]">{formatStatKey(k)}</span>
                              <span className="font-bold text-emerald-400">{formatStatValue(val, k)}</span>
                            </div>
                          ))
                        ) : (
                          <div className="text-[10px] text-slate-500 italic font-mono">Tidak ada stat dasar</div>
                        )}
                        {statsEntries.length > 3 && (
                          <div className="text-[9px] text-slate-500 font-mono">
                            +{statsEntries.length - 3} efek stat lainnya...
                          </div>
                        )}
                      </div>

                      {/* Passive snippet if exists */}
                      {item.passive_description && (
                        <div className="mt-3 rounded-lg bg-black/40 border border-white/5 p-2 text-[10px] text-slate-400 font-sans line-clamp-2 leading-relaxed">
                          {item.passive_description}
                        </div>
                      )}
                    </div>

                    {/* Bottom Card Actions */}
                    <div className="mt-4 pt-2.5 border-t border-white/5 flex items-center justify-between gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setInspectedItem(item);
                        }}
                        className="text-[10px] font-mono font-bold text-slate-400 hover:text-white transition-colors flex items-center gap-1"
                      >
                        <span>Inspect</span>
                        <span>↗</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCompare(item);
                        }}
                        className={`rounded-lg px-2.5 py-1 text-[10px] font-mono font-bold transition-all ${
                          isCompared
                            ? 'bg-amber-400 text-black shadow-sm font-black'
                            : 'border border-white/10 bg-white/5 text-slate-300 hover:border-amber-400/40 hover:text-amber-400'
                        }`}
                      >
                        {isCompared ? '✓ Terpilih' : '+ Bandingkan'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* Floating Comparison Dock */}
      {comparedItems.length > 0 && (
        <aside
          aria-label="Item Comparison Dock"
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-full max-w-2xl px-4 animate-in slide-in-from-bottom-6 duration-200"
        >
          <div className="rounded-2xl border border-amber-400/40 bg-[#080d16]/95 backdrop-blur-2xl p-3 sm:p-4 shadow-2xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xl">⚖️</span>
              <div>
                <div className="text-xs font-bold text-white font-mono">
                  DOCK PERBANDINGAN ({comparedItems.length}/2)
                </div>
                <div className="text-[10px] text-slate-400 font-sans">
                  {comparedItems.length === 1
                    ? 'Pilih 1 item lagi untuk melihat perbandingan head-to-head.'
                    : '2 item siap dikomparasikan secara detail!'}
                </div>
              </div>
            </div>

            {/* Selected item chips */}
            <div className="flex items-center gap-2">
              {comparedItems.map(item => (
                <div
                  key={item.id}
                  className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-black/60 px-2 py-1"
                >
                  <img src={item.image} alt={item.name} className="h-6 w-6 object-contain" />
                  <span className="text-[10px] font-bold text-white font-sans max-w-[80px] sm:max-w-[100px] truncate">
                    {item.name}
                  </span>
                  <button
                    onClick={() => toggleCompare(item)}
                    className="text-slate-500 hover:text-rose-400 text-xs px-1"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setComparedItems([])}
                className="text-[10px] font-mono text-slate-400 hover:text-white px-2 py-1"
              >
                Reset
              </button>
              <button
                disabled={comparedItems.length < 2}
                onClick={() => setIsCompareModalOpen(true)}
                className={`rounded-xl px-3 py-1.5 text-xs font-mono font-bold uppercase transition-all ${
                  comparedItems.length === 2
                    ? 'bg-amber-400 text-black hover:bg-amber-300 shadow-md shadow-amber-400/20'
                    : 'bg-white/10 text-slate-500 cursor-not-allowed'
                }`}
              >
                Bandingkan
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* Item Quick Inspect Modal */}
      {inspectedItem && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={inspectedItem.name}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in duration-150"
        >
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/15 bg-[#080d16] p-6 shadow-2xl space-y-6">
            {/* Close button */}
            <button
              onClick={() => setInspectedItem(null)}
              className="absolute top-5 right-5 h-8 w-8 rounded-full border border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white flex items-center justify-center font-mono text-sm cursor-pointer"
            >
              ✕
            </button>

            {/* Modal Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="relative h-20 w-20 shrink-0 rounded-2xl overflow-hidden border-2 border-amber-400/50 bg-black p-1.5 shadow-xl">
                <img
                  src={inspectedItem.image}
                  alt={inspectedItem.name}
                  onError={(e) => {
                    if (inspectedItem.image_remote) (e.target as HTMLImageElement).src = inspectedItem.image_remote;
                  }}
                  className="h-full w-full object-contain"
                />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className={`rounded-md border px-2 py-0.5 text-[10px] font-mono font-bold uppercase ${getTypeColor(inspectedItem.type).bg} ${getTypeColor(inspectedItem.type).text} ${getTypeColor(inspectedItem.type).border}`}>
                    {inspectedItem.type}
                  </span>
                  <span className={`rounded-md border px-2 py-0.5 text-[10px] font-mono font-bold ${getItemTier(inspectedItem.price).color} ${getItemTier(inspectedItem.price).border}`}>
                    {getItemTier(inspectedItem.price).label}
                  </span>
                  <span className="font-mono text-xs font-black text-amber-400 bg-amber-400/10 border border-amber-400/30 px-2 py-0.5 rounded-md">
                    💰 {(inspectedItem.price ?? 0).toLocaleString()} Gold
                  </span>
                </div>
                <h3 className="text-2xl font-black text-white font-sans">
                  {inspectedItem.name}
                </h3>
                <div className="text-xs font-mono text-slate-400 mt-0.5">
                  ID: #{inspectedItem.mpl_id || inspectedItem.slug}
                </div>
              </div>
            </div>

            {/* Full Stats Breakdown */}
            <div className="rounded-2xl border border-white/10 bg-black/40 p-4 space-y-3">
              <div className="text-xs font-mono font-bold uppercase text-slate-400 tracking-wider">
                Statistik Equipment
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {Object.entries(inspectedItem.stats || {}).length > 0 ? (
                  Object.entries(inspectedItem.stats || {}).map(([k, val]) => (
                    <div
                      key={k}
                      className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 px-3 py-2 text-xs font-mono"
                    >
                      <span className="text-slate-300">{formatStatKey(k)}</span>
                      <span className="font-bold text-emerald-400">{formatStatValue(val, k)}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-slate-500 italic font-mono col-span-2">
                    Item ini tidak menambahkan atribut dasar secara langsung.
                  </div>
                )}
              </div>
            </div>

            {/* Passive Description */}
            {inspectedItem.passive_description ? (
              <div className="rounded-2xl border border-amber-400/20 bg-amber-400/5 p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-amber-400">
                  <span>⚡</span>
                  <span>Efek Pasif & Atribut Unik</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans whitespace-pre-line">
                  {inspectedItem.passive_description}
                </p>
              </div>
            ) : (
              <div className="rounded-2xl border border-white/5 bg-white/5 p-4 text-xs text-slate-400 italic font-mono">
                Item komponen dasar (tidak memiliki pasif unik tersendiri).
              </div>
            )}

            {/* Synergistic Heroes using this item */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-xs font-mono font-bold uppercase text-slate-400 tracking-wider">
                  Hero Populer Pemakai Item Ini ({itemHeroUsage.get(inspectedItem.slug)?.length || 0})
                </div>
                <span className="text-[10px] text-slate-500 font-mono">Berdasarkan Pro Builds Database</span>
              </div>

              {(itemHeroUsage.get(inspectedItem.slug)?.length ?? 0) > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {(itemHeroUsage.get(inspectedItem.slug) || []).slice(0, 12).map(hero => (
                    <Link
                      key={hero.id}
                      href={`/mlbb/heroes/${hero.slug}`}
                      className="group flex flex-col items-center gap-1 rounded-xl border border-white/10 bg-black/40 p-2 hover:border-amber-400/50 hover:bg-amber-400/5 transition-all text-center"
                    >
                      <img
                        src={hero.image}
                        alt={hero.name}
                        className="h-10 w-10 rounded-lg object-cover border border-white/10 group-hover:border-amber-400 transition-colors"
                      />
                      <span className="text-[10px] font-bold text-slate-300 group-hover:text-amber-400 truncate w-full">
                        {hero.name}
                      </span>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-slate-500 italic font-mono bg-black/20 p-3 rounded-xl border border-white/5">
                  Item situasional / komponen menengah yang dapat disesuaikan dengan kebutuhan draft match.
                </div>
              )}
            </div>

            {/* Modal Bottom Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <button
                onClick={() => {
                  toggleCompare(inspectedItem);
                }}
                className={`rounded-xl px-4 py-2.5 text-xs font-mono font-bold uppercase transition-all ${
                  isItemCompared(inspectedItem.id)
                    ? 'bg-amber-400 text-black font-black'
                    : 'border border-amber-400/40 bg-amber-400/10 text-amber-400 hover:bg-amber-400 hover:text-black'
                }`}
              >
                {isItemCompared(inspectedItem.id) ? '✓ Terpilih di Komparator' : '+ Tambah ke Komparator'}
              </button>

              <button
                onClick={() => setInspectedItem(null)}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-mono text-slate-300 hover:bg-white/10 transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Side-by-Side Item Compare Modal */}
      {isCompareModalOpen && comparedItems.length === 2 && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Item Comparison"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-in fade-in duration-150"
        >
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border border-amber-400/30 bg-[#080d16] p-6 sm:p-8 shadow-2xl space-y-6">
            {/* Close button */}
            <button
              onClick={() => setIsCompareModalOpen(false)}
              className="absolute top-5 right-5 h-8 w-8 rounded-full border border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white flex items-center justify-center font-mono text-sm cursor-pointer"
            >
              ✕
            </button>

            {/* Header */}
            <div className="text-center space-y-1">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-0.5 font-mono text-xs text-amber-400">
                HEAD-TO-HEAD ITEM COMPARATOR
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white font-sans uppercase">
                {comparedItems[0].name} <span className="text-amber-400">VS</span> {comparedItems[1].name}
              </h2>
            </div>

            {/* Dual Item Headers */}
            <div className="grid grid-cols-2 gap-4">
              {comparedItems.map((item, idx) => (
                <div
                  key={item.id}
                  className={`rounded-2xl border p-4 flex flex-col sm:flex-row items-center sm:items-start gap-3 bg-black/40 ${
                    idx === 0 ? 'border-amber-400/40' : 'border-cyan-400/40'
                  }`}
                >
                  <img src={item.image} alt={item.name} className="h-16 w-16 rounded-xl object-contain border border-white/10 p-1" />
                  <div className="text-center sm:text-left">
                    <span className="text-[10px] font-mono uppercase font-bold text-slate-400">{item.type}</span>
                    <h3 className="text-lg font-bold text-white font-sans">{item.name}</h3>
                    <div className="font-mono text-sm font-black text-amber-400 mt-0.5">
                      💰 {(item.price ?? 0).toLocaleString()} Gold
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Cost Difference Alert */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-3 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Selisih Biaya Gold:</span>
              <span className="font-bold text-amber-400">
                {Math.abs((comparedItems[0].price ?? 0) - (comparedItems[1].price ?? 0)) === 0
                  ? 'Harga Identik (0 Gold)'
                  : `${comparedItems[0].name} lebih ${(comparedItems[0].price ?? 0) > (comparedItems[1].price ?? 0) ? 'mahal' : 'murah'} ${Math.abs((comparedItems[0].price ?? 0) - (comparedItems[1].price ?? 0))} Gold`}
              </span>
            </div>

            {/* Side-by-side Combined Stats Matrix */}
            <div className="space-y-3">
              <div className="text-xs font-mono font-bold uppercase text-slate-400 tracking-wider">
                Matriks Perbandingan Atribut Dasar
              </div>
              
              {(() => {
                const itemAStats = comparedItems[0].stats || {};
                const itemBStats = comparedItems[1].stats || {};
                const allStatKeys = Array.from(new Set([...Object.keys(itemAStats), ...Object.keys(itemBStats)]));

                if (allStatKeys.length === 0) {
                  return <div className="text-xs text-slate-500 font-mono italic">Kedua item tidak memiliki statistik dasar numerik.</div>;
                }

                return (
                  <div className="rounded-2xl border border-white/10 bg-black/40 divide-y divide-white/5 overflow-hidden">
                    {allStatKeys.map(k => {
                      const valA = itemAStats[k] ? formatStatValue(itemAStats[k], k) : '-';
                      const valB = itemBStats[k] ? formatStatValue(itemBStats[k], k) : '-';
                      const hasA = valA !== '-';
                      const hasB = valB !== '-';

                      return (
                        <div key={k} className="grid grid-cols-3 items-center p-3 text-xs font-mono">
                          <div className={`font-bold ${hasA ? 'text-amber-400' : 'text-slate-600'}`}>
                            {valA}
                          </div>
                          <div className="text-center text-slate-300 font-sans">
                            {formatStatKey(k)}
                          </div>
                          <div className={`text-right font-bold ${hasB ? 'text-cyan-400' : 'text-slate-600'}`}>
                            {valB}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>

            {/* Side-by-side Passives */}
            <div className="space-y-3">
              <div className="text-xs font-mono font-bold uppercase text-slate-400 tracking-wider">
                Perbandingan Efek Pasif / Unik
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {comparedItems.map((item, idx) => (
                  <div
                    key={item.id}
                    className={`rounded-2xl border p-4 space-y-2 bg-black/40 ${
                      idx === 0 ? 'border-amber-400/20' : 'border-cyan-400/20'
                    }`}
                  >
                    <div className="text-xs font-mono font-bold uppercase text-slate-300 flex items-center gap-1.5">
                      <span>⚡</span>
                      <span>{item.name}</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed font-sans whitespace-pre-line">
                      {item.passive_description || 'Tidak memiliki efek pasif unik.'}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Comparator Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <button
                onClick={() => setComparedItems([])}
                className="text-xs font-mono text-rose-400 hover:text-rose-300"
              >
                Hapus Pilihan Komparasi
              </button>
              <button
                onClick={() => setIsCompareModalOpen(false)}
                className="rounded-xl bg-amber-400 px-5 py-2.5 text-xs font-mono font-bold text-black hover:bg-amber-300 transition-colors"
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
