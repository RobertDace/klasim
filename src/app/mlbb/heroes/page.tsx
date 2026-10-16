// src/app/mlbb/heroes/page.tsx
'use client';

import { useState, useMemo, useEffect } from 'react';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import HeroCard from '@/components/mlbb/HeroCard';
import HeroFilters from '@/components/mlbb/HeroFilters';
import HeroQuickViewModal from '@/components/mlbb/HeroQuickViewModal';
import {
  heroes as allHeroes,
  heroTierStats,
  heroRelations,
  type MLBBHero,
  type MLBBTierStat,
  type MLBBHeroRelation
} from '@/data/mlbb';

export default function HeroesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedLane, setSelectedLane] = useState('all');
  const [selectedTier, setSelectedTier] = useState('all');
  const [sortBy, setSortBy] = useState('name_asc');
  const [viewMode, setViewMode] = useState<'grid' | 'compact'>('grid');
  const [selectedHero, setSelectedHero] = useState<MLBBHero | null>(null);

  // Pre-index tier stats by hero name (preferring rank 'all' or 'mythic')
  const tierStatsMap = useMemo(() => {
    const map = new Map<string, MLBBTierStat>();
    // First fill with 'mythic' or 'all'
    heroTierStats.forEach(st => {
      const key = st.hero_name.toLowerCase();
      if (!map.has(key) || st.rank === 'all' || st.rank === 'mythic') {
        map.set(key, st);
      }
    });
    return map;
  }, []);

  // Pre-index relations by hero name
  const relationsMap = useMemo(() => {
    const map = new Map<string, MLBBHeroRelation>();
    heroRelations.forEach(r => {
      map.set(r.hero_name.toLowerCase(), r);
    });
    return map;
  }, []);

  // Calculate role counts
  const roleCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    allHeroes.forEach(h => {
      h.roles.forEach(r => {
        counts[r] = (counts[r] || 0) + 1;
      });
    });
    return counts;
  }, []);

  // Filtering & Sorting
  const filteredHeroes = useMemo(() => {
    return allHeroes.filter(hero => {
      // Search query (matches name, roles, speciality, lane, title)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = hero.name.toLowerCase().includes(q);
        const matchesTitle = hero.title.toLowerCase().includes(q);
        const matchesRole = hero.roles.some(r => r.toLowerCase().includes(q));
        const matchesLane = hero.lane.some(l => l.toLowerCase().includes(q));
        const matchesSpeciality = hero.speciality.some(s => s.toLowerCase().includes(q));
        if (!matchesName && !matchesTitle && !matchesRole && !matchesLane && !matchesSpeciality) {
          return false;
        }
      }

      // Role filter
      if (selectedRole !== 'all') {
        const hasRole = hero.roles.some(r => r.toLowerCase() === selectedRole.toLowerCase());
        if (!hasRole) return false;
      }

      // Lane filter
      if (selectedLane !== 'all') {
        const hasLane = hero.lane.some(l => l.toLowerCase() === selectedLane.toLowerCase());
        if (!hasLane) return false;
      }

      // Tier filter
      if (selectedTier !== 'all') {
        const tierStat = tierStatsMap.get(hero.name.toLowerCase());
        if (tierStat?.tier !== selectedTier) return false;
      }

      return true;
    }).sort((a, b) => {
      const tierA = tierStatsMap.get(a.name.toLowerCase());
      const tierB = tierStatsMap.get(b.name.toLowerCase());

      switch (sortBy) {
        case 'name_desc':
          return b.name.localeCompare(a.name);
        case 'win_rate_desc': {
          const wrA = tierA?.win_rate ?? 0;
          const wrB = tierB?.win_rate ?? 0;
          return wrB - wrA;
        }
        case 'ban_rate_desc': {
          const brA = tierA?.ban_rate ?? 0;
          const brB = tierB?.ban_rate ?? 0;
          return brB - brA;
        }
        case 'pick_rate_desc': {
          const prA = tierA?.pick_rate ?? 0;
          const prB = tierB?.pick_rate ?? 0;
          return prB - prA;
        }
        case 'difficulty_desc':
          return b.stats.difficulty - a.stats.difficulty;
        case 'difficulty_asc':
          return a.stats.difficulty - b.stats.difficulty;
        case 'name_asc':
        default:
          return a.name.localeCompare(b.name);
      }
    });
  }, [searchQuery, selectedRole, selectedLane, selectedTier, sortBy, tierStatsMap]);

  const handleSelectHeroByName = (name: string) => {
    const target = allHeroes.find(h => h.name.toLowerCase() === name.toLowerCase());
    if (target) {
      setSelectedHero(target);
    }
  };

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedRole('all');
    setSelectedLane('all');
    setSelectedTier('all');
    setSortBy('name_asc');
  };

  return (
    <div className="min-h-screen bg-[#05070c] text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-black">
      <Navbar activeSection="mlbb" />

      {/* Main Container */}
      <main className="flex-1 pt-24 pb-20 px-3.5 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        {/* Header Hero Section */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0c101d] via-[#070913] to-[#04060a] p-6 sm:p-10 shadow-2xl">
          {/* Ambient Lighting Gradients */}
          <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
          
          <div className="relative z-10 space-y-4 max-w-3xl">
            {/* Telemetry Tag */}
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-amber-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>PATCH 2.2.1 ACTIVE META // MOLEBUILD DIRECTORY</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-sans text-3xl sm:text-5xl font-black uppercase tracking-tight text-white leading-none">
              DAFTAR HERO <span className="text-amber-400">MOBILE LEGENDS</span>
            </h1>

            {/* Subtitle Description */}
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              Direktori lengkap 133 hero Mobile Legends: Bang Bang dengan artwork resmi berkualitas tinggi, statistik winrate/banrate, rekomendasi lane, dan showcase 587 skill interaktif.
            </p>

            {/* High-Level Telemetry Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
              <div className="rounded-xl border border-white/10 bg-black/40 p-3">
                <span className="block font-mono text-[9px] uppercase tracking-wider text-slate-500">TOTAL HERO</span>
                <span className="font-mono text-xl sm:text-2xl font-black text-amber-400">133</span>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/40 p-3">
                <span className="block font-mono text-[9px] uppercase tracking-wider text-slate-500">TOTAL SKILL</span>
                <span className="font-mono text-xl sm:text-2xl font-black text-cyan-400">587</span>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/40 p-3">
                <span className="block font-mono text-[9px] uppercase tracking-wider text-slate-500">ROLE KELAS</span>
                <span className="font-mono text-xl sm:text-2xl font-black text-emerald-400">6 UTAMA</span>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/40 p-3">
                <span className="block font-mono text-[9px] uppercase tracking-wider text-slate-500">COUNTER MATRIX</span>
                <span className="font-mono text-xl sm:text-2xl font-black text-rose-400">133 RELASI</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar Controls */}
        <HeroFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedRole={selectedRole}
          onRoleChange={setSelectedRole}
          selectedLane={selectedLane}
          onLaneChange={setSelectedLane}
          selectedTier={selectedTier}
          onTierChange={setSelectedTier}
          sortBy={sortBy}
          onSortChange={setSortBy}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          roleCounts={roleCounts}
          totalCount={allHeroes.length}
          filteredCount={filteredHeroes.length}
          onResetFilters={resetAllFilters}
        />

        {/* Hero Cards Grid or Compact View */}
        {filteredHeroes.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
              {filteredHeroes.map(hero => (
                <HeroCard
                  key={hero.id}
                  hero={hero}
                  tierStat={tierStatsMap.get(hero.name.toLowerCase())}
                  onSelect={setSelectedHero}
                  viewMode="grid"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {filteredHeroes.map(hero => (
                <HeroCard
                  key={hero.id}
                  hero={hero}
                  tierStat={tierStatsMap.get(hero.name.toLowerCase())}
                  onSelect={setSelectedHero}
                  viewMode="compact"
                />
              ))}
            </div>
          )
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-slate-950/60 p-12 text-center space-y-4">
            <div className="h-14 w-14 rounded-2xl border border-amber-400/30 bg-amber-400/10 flex items-center justify-center text-2xl">
              🎯
            </div>
            <div className="space-y-1">
              <h3 className="font-sans text-lg font-bold text-white uppercase">Hero Tidak Ditemukan</h3>
              <p className="font-mono text-xs text-slate-400 max-w-md">
                Tidak ada hero yang sesuai dengan filter pencarian "{searchQuery}" pada role {selectedRole.toUpperCase()}.
              </p>
            </div>
            <button
              onClick={resetAllFilters}
              className="rounded-xl border border-amber-400 bg-amber-400/10 px-4 py-2 font-mono text-xs font-bold text-amber-400 hover:bg-amber-400 hover:text-black transition-colors cursor-pointer"
            >
              ↺ Reset Semua Filter
            </button>
          </div>
        )}
      </main>

      {/* Quick View Modal Drawer */}
      <HeroQuickViewModal
        hero={selectedHero}
        tierStat={selectedHero ? tierStatsMap.get(selectedHero.name.toLowerCase()) : undefined}
        relation={selectedHero ? relationsMap.get(selectedHero.name.toLowerCase()) : undefined}
        onClose={() => setSelectedHero(null)}
        onSelectHeroByName={handleSelectHeroByName}
      />

      <Footer />
    </div>
  );
}
