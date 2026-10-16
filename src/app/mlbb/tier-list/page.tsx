// src/app/mlbb/tier-list/page.tsx
'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import HeroQuickViewModal from '@/components/mlbb/HeroQuickViewModal';
import {
  heroes as allHeroes,
  heroTierStats,
  heroRelations,
  type MLBBHero,
  type MLBBTierStat,
} from '@/data/mlbb';

export default function TierListPage() {
  const [selectedRank, setSelectedRank] = useState<string>('all');
  const [selectedLane, setSelectedLane] = useState<string>('all');
  const [selectedHero, setSelectedHero] = useState<MLBBHero | null>(null);

  const ranks = [
    { id: 'all', label: 'SEMUA RANK' },
    { id: 'mythic', label: 'MYTHIC' },
    { id: 'glory', label: 'MYTHICAL GLORY' },
    { id: 'honor', label: 'MYTHICAL HONOR' },
    { id: 'legend', label: 'LEGEND' },
    { id: 'epic', label: 'EPIC' },
  ];

  const lanes = [
    { id: 'all', label: 'Semua Lane' },
    { id: 'exp', label: 'EXP Lane' },
    { id: 'mid', label: 'Mid Lane' },
    { id: 'gold', label: 'Gold Lane' },
    { id: 'roam', label: 'Roam' },
    { id: 'jungl', label: 'Jungling' },
  ];

  // Map hero objects by name for fast lookup
  const heroByName = useMemo(() => {
    const map = new Map<string, MLBBHero>();
    allHeroes.forEach(h => {
      map.set(h.name.toLowerCase(), h);
    });
    return map;
  }, []);

  // Filter tier stats based on selected rank & lane
  const tieredHeroes = useMemo(() => {
    const statsForRank = heroTierStats.filter(st => {
      if (selectedRank !== 'all' && st.rank.toLowerCase() !== selectedRank.toLowerCase()) return false;
      return true;
    });

    // Group by hero name to get best/representative entry
    const map = new Map<string, MLBBTierStat>();
    statsForRank.forEach(st => {
      const key = st.hero_name.toLowerCase();
      if (!map.has(key)) {
        map.set(key, st);
      }
    });

    const list: Array<{ hero: MLBBHero; stat: MLBBTierStat }> = [];
    allHeroes.forEach(h => {
      const stat = map.get(h.name.toLowerCase());
      if (stat) {
        // Check lane filter
        if (selectedLane !== 'all') {
          const matchesLane = h.lane.some(l => l.toLowerCase().includes(selectedLane.toLowerCase()));
          if (!matchesLane) return;
        }
        list.push({ hero: h, stat });
      }
    });

    // Bucket by tier
    const groups: Record<string, Array<{ hero: MLBBHero; stat: MLBBTierStat }>> = {
      'S+': [],
      'S': [],
      'A': [],
      'B': [],
      'C': [],
    };

    list.forEach(item => {
      const t = item.stat.tier || 'A';
      if (groups[t]) {
        groups[t].push(item);
      } else {
        groups['B'].push(item);
      }
    });

    // Sort within each tier by winrate desc
    Object.keys(groups).forEach(t => {
      groups[t].sort((a, b) => b.stat.win_rate - a.stat.win_rate);
    });

    return groups;
  }, [selectedRank, selectedLane]);

  const tierStyles: Record<string, { badge: string; border: string; glow: string; desc: string }> = {
    'S+': {
      badge: 'bg-gradient-to-r from-amber-400 to-yellow-300 text-black shadow-[0_0_15px_rgba(251,191,36,0.6)] font-black',
      border: 'border-amber-400/40 bg-amber-400/5',
      glow: 'text-amber-400',
      desc: 'GOD TIER · Prioritas Wajib First Pick / Ban Utama Turnamen'
    },
    'S': {
      badge: 'bg-purple-500 text-white shadow-[0_0_12px_rgba(168,85,247,0.5)] font-bold',
      border: 'border-purple-500/30 bg-purple-950/10',
      glow: 'text-purple-400',
      desc: 'META DEFINITIVE · Pilihan Kuat dengan Winrate & Kontrol Game Tinggi'
    },
    'A': {
      badge: 'bg-cyan-500 text-black font-bold shadow-[0_0_10px_rgba(6,182,212,0.4)]',
      border: 'border-cyan-500/30 bg-cyan-950/10',
      glow: 'text-cyan-400',
      desc: 'SOLID & STABIL · Hero Efektif yang Andal di Sebagian Besar Komposisi'
    },
    'B': {
      badge: 'bg-slate-600 text-white font-semibold',
      border: 'border-white/10 bg-black/40',
      glow: 'text-slate-300',
      desc: 'SITUASIONAL · Kuat sebagai Counter Pick Tertentu atau Pemain Berpengalaman'
    },
    'C': {
      badge: 'bg-slate-800 text-slate-400',
      border: 'border-white/5 bg-black/20',
      glow: 'text-slate-500',
      desc: 'OFF-META · Memerlukan Kondisi Draft Sangat Spesifik'
    },
  };

  return (
    <div className="min-h-screen bg-[#05070c] text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-black">
      <Navbar activeSection="mlbb" />

      <main className="flex-1 pt-24 pb-20 px-3.5 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        {/* Header Telemetry */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0c101d] via-[#070913] to-[#04060a] p-6 sm:p-10 shadow-2xl">
          <div className="space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-amber-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>PATCH 2.2.1 TIER RANKINGS // MOLEBUILD DATA SYNC</span>
            </div>

            <h1 className="font-sans text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
              TIER LIST HERO <span className="text-amber-400">MOBILE LEGENDS</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              Tingkatan hero terkuat dalam meta Mobile Legends terkini. Berdasarkan analitik win rate, ban rate, dan performa di berbagai tingkatan rank dari Mythic hingga turnamen resmi.
            </p>
          </div>
        </div>

        {/* Filter Controls: Rank & Lane Selector */}
        <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-4 space-y-4 shadow-xl">
          {/* Rank Tabs */}
          <div>
            <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest block mb-2">
              TINGKATAN RANK:
            </span>
            <div className="flex flex-wrap gap-2">
              {ranks.map(r => (
                <button
                  key={r.id}
                  onClick={() => setSelectedRank(r.id)}
                  className={`rounded-xl px-3 py-1.5 font-mono text-xs uppercase font-bold transition-all cursor-pointer ${
                    selectedRank === r.id
                      ? 'bg-amber-400 text-black shadow-md shadow-amber-400/20'
                      : 'border border-white/10 bg-black/40 text-slate-400 hover:text-white'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Lane Tabs */}
          <div className="border-t border-white/5 pt-3">
            <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest block mb-2">
              FILTER JALUR LANE:
            </span>
            <div className="flex flex-wrap gap-2">
              {lanes.map(l => (
                <button
                  key={l.id}
                  onClick={() => setSelectedLane(l.id)}
                  className={`rounded-xl px-3 py-1.5 font-mono text-xs font-semibold transition-all cursor-pointer ${
                    selectedLane === l.id
                      ? 'bg-cyan-500 text-black font-black'
                      : 'border border-white/10 bg-black/40 text-slate-400 hover:text-white'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tier Groups Showcase */}
        <div className="space-y-6">
          {(['S+', 'S', 'A', 'B', 'C'] as const).map(tierKey => {
            const list = tieredHeroes[tierKey] || [];
            const style = tierStyles[tierKey];

            return (
              <div
                key={tierKey}
                className={`rounded-3xl border p-5 sm:p-6 space-y-4 transition-all shadow-xl ${style.border}`}
              >
                {/* Tier Group Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                  <div className="flex items-center gap-3">
                    <span className={`rounded-xl px-3 py-1 font-mono text-lg ${style.badge}`}>
                      TIER {tierKey}
                    </span>
                    <span className="font-mono text-xs text-slate-400 hidden sm:inline">
                      {style.desc}
                    </span>
                  </div>
                  <span className="font-mono text-xs text-slate-400">
                    {list.length} Hero Tercatat
                  </span>
                </div>

                {/* Heroes Grid within this Tier */}
                {list.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                    {list.map(({ hero, stat }) => (
                      <div
                        key={hero.id}
                        onClick={() => setSelectedHero(hero)}
                        className="group relative flex flex-col items-center rounded-2xl border border-white/10 bg-black/60 p-2 text-center transition-all duration-200 hover:-translate-y-1 hover:border-amber-400/50 hover:bg-slate-900 cursor-pointer shadow-md"
                      >
                        <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-slate-950 mb-2 border border-white/10">
                          <img
                            src={hero.image}
                            alt={hero.name}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                          <div className="absolute bottom-1 right-1 rounded bg-black/80 px-1 font-mono text-[8px] font-bold text-emerald-400">
                            {(stat.win_rate * 100).toFixed(1)}% WR
                          </div>
                        </div>

                        <span className="font-sans text-xs font-bold text-white group-hover:text-amber-300 truncate w-full">
                          {hero.name}
                        </span>
                        <span className="font-mono text-[9px] text-slate-500 truncate w-full">
                          {hero.lane[0] || hero.roles[0]}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="font-mono text-xs text-slate-500 italic py-2">
                    Tidak ada hero di Tier {tierKey} untuk filter lane ini.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </main>

      {/* Quick View Modal */}
      <HeroQuickViewModal
        hero={selectedHero}
        onClose={() => setSelectedHero(null)}
      />

      <Footer />
    </div>
  );
}
