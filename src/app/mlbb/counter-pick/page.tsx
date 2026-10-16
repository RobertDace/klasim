// src/app/mlbb/counter-pick/page.tsx
'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import HeroQuickViewModal from '@/components/mlbb/HeroQuickViewModal';
import {
  heroes as allHeroes,
  heroRelations,
  type MLBBHero,
  type MLBBHeroRelation,
} from '@/data/mlbb';

export default function CounterPickPage() {
  const [selectedEnemies, setSelectedEnemies] = useState<MLBBHero[]>([]);
  const [searchEnemy, setSearchEnemy] = useState('');
  const [selectedHeroModal, setSelectedHeroModal] = useState<MLBBHero | null>(null);

  // Available enemies search
  const availableEnemies = useMemo(() => {
    return allHeroes
      .filter(h => !selectedEnemies.some(e => e.id === h.id))
      .filter(h => {
        if (!searchEnemy.trim()) return true;
        const q = searchEnemy.toLowerCase().trim();
        return h.name.toLowerCase().includes(q) || h.roles.some(r => r.toLowerCase().includes(q));
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [selectedEnemies, searchEnemy]);

  const handleAddEnemy = (hero: MLBBHero) => {
    if (selectedEnemies.length < 5) {
      setSelectedEnemies([...selectedEnemies, hero]);
      setSearchEnemy('');
    }
  };

  const handleRemoveEnemy = (id: string) => {
    setSelectedEnemies(selectedEnemies.filter(e => e.id !== id));
  };

  // Compute counter recommendations based on selectedEnemies
  const counterRecommendations = useMemo(() => {
    if (selectedEnemies.length === 0) return [];

    // Map hero counter power against selected enemies
    // Score based on: for each enemy hero, if myHero is listed in enemy's counters list -> +1
    // Also if enemy is listed in myHero's counters list -> +1
    const scores = new Map<string, { hero: MLBBHero; counteredEnemies: string[]; score: number }>();

    allHeroes.forEach(candidate => {
      // Don't recommend someone already on enemy team
      if (selectedEnemies.some(e => e.id === candidate.id)) return;

      const candidateRel = heroRelations.find(r => r.hero_name.toLowerCase() === candidate.name.toLowerCase());
      const countered: string[] = [];

      selectedEnemies.forEach(enemy => {
        const enemyRel = heroRelations.find(r => r.hero_name.toLowerCase() === enemy.name.toLowerCase());
        
        const enemyWeakAgainstMe = enemyRel?.counters?.some(
          (c: any) => c.name.toLowerCase() === candidate.name.toLowerCase()
        );
        const meCountersEnemy = candidateRel?.counters?.some(
          (c: any) => c.name.toLowerCase() === enemy.name.toLowerCase()
        );

        if (enemyWeakAgainstMe || meCountersEnemy) {
          countered.push(enemy.name);
        }
      });

      if (countered.length > 0) {
        scores.set(candidate.id, {
          hero: candidate,
          counteredEnemies: [...new Set(countered)],
          score: countered.length,
        });
      }
    });

    return Array.from(scores.values()).sort((a, b) => b.score - a.score);
  }, [selectedEnemies]);

  // Group recommendations by Lane
  const recommendationsByLane = useMemo(() => {
    const lanes: Record<string, typeof counterRecommendations> = {
      'EXP Lane': [],
      'Jungling': [],
      'Mid Lane': [],
      'Gold Lane': [],
      'Roam': [],
    };

    counterRecommendations.forEach(item => {
      const h = item.hero;
      if (h.lane.some(l => l.toLowerCase().includes('exp')) || h.roles.includes('Fighter')) {
        lanes['EXP Lane'].push(item);
      }
      if (h.lane.some(l => l.toLowerCase().includes('jungl')) || h.roles.includes('Assassin')) {
        lanes['Jungling'].push(item);
      }
      if (h.lane.some(l => l.toLowerCase().includes('mid')) || h.roles.includes('Mage')) {
        lanes['Mid Lane'].push(item);
      }
      if (h.lane.some(l => l.toLowerCase().includes('gold')) || h.roles.includes('Marksman')) {
        lanes['Gold Lane'].push(item);
      }
      if (h.lane.some(l => l.toLowerCase().includes('roam')) || h.roles.includes('Tank') || h.roles.includes('Support')) {
        lanes['Roam'].push(item);
      }
    });

    return lanes;
  }, [counterRecommendations]);

  return (
    <div className="min-h-screen bg-[#05070c] text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-black">
      <Navbar activeSection="mlbb" />

      <main className="flex-1 pt-24 pb-20 px-3.5 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        {/* Header Telemetry */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0c101d] via-[#070913] to-[#04060a] p-6 sm:p-10 shadow-2xl">
          <div className="space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-400/30 bg-rose-400/10 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-rose-400">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-400 animate-pulse" />
              <span>COUNTER PICK ENGINE // MATCHUP MATRIX</span>
            </div>

            <h1 className="font-sans text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
              CARI COUNTER <span className="text-amber-400">KOMPOSISI LAWAN</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              Pilih 1 sampai 5 hero lawan yang di-pick musuh. Sistem secara otomatis menganalisis database counter dan merekomendasikan pilihan hero terbaik untuk memenangkan draft pertandingan.
            </p>
          </div>
        </div>

        {/* Enemy Draft Slots (Up to 5) */}
        <div className="rounded-3xl border border-rose-500/30 bg-rose-950/15 p-6 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-rose-500/20 pb-3">
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-rose-400">
                KOMPOSISI DRAFT MUSUH ({selectedEnemies.length}/5 HERO)
              </span>
              <span className="font-mono text-[10px] text-slate-400 block">
                PILIH HERO DARI DAFTAR DI BAWAH UNTUK MENAMBAHKAN LAWAN
              </span>
            </div>

            {selectedEnemies.length > 0 && (
              <button
                onClick={() => setSelectedEnemies([])}
                className="font-mono text-xs text-slate-400 hover:text-rose-400 transition-colors"
              >
                ✕ Hapus Semua Musuh
              </button>
            )}
          </div>

          {/* 5 Enemy Slots Display */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[0, 1, 2, 3, 4].map(idx => {
              const enemy = selectedEnemies[idx];
              return (
                <div
                  key={idx}
                  className={`relative flex flex-col items-center justify-center rounded-2xl border p-3 text-center transition-all ${
                    enemy
                      ? 'border-rose-500/40 bg-black/60 shadow-lg'
                      : 'border-dashed border-white/15 bg-black/20 text-slate-600'
                  }`}
                >
                  {enemy ? (
                    <>
                      <button
                        onClick={() => handleRemoveEnemy(enemy.id)}
                        className="absolute top-2 right-2 rounded-full bg-black/80 px-1.5 py-0.5 text-[9px] text-slate-400 hover:text-white"
                        title="Hapus"
                      >
                        ✕
                      </button>
                      <div className="relative h-16 w-16 overflow-hidden rounded-xl border border-white/15 mb-2">
                        <img src={enemy.image} alt={enemy.name} className="h-full w-full object-cover" />
                      </div>
                      <span className="font-sans text-xs font-bold text-white truncate w-full">
                        {enemy.name}
                      </span>
                      <span className="font-mono text-[9px] text-rose-400 font-semibold truncate w-full">
                        {enemy.lane[0] || enemy.roles[0]}
                      </span>
                    </>
                  ) : (
                    <div className="py-6 font-mono text-xs text-slate-500">
                      + Slot Musuh #{idx + 1}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Search to Add Enemy */}
          {selectedEnemies.length < 5 && (
            <div className="pt-2">
              <input
                type="text"
                value={searchEnemy}
                onChange={e => setSearchEnemy(e.target.value)}
                placeholder="Cari hero musuh untuk dimasukkan ke draft... (misal: Fanny, Ling, Terizla)"
                className="w-full rounded-xl border border-white/10 bg-black/70 px-4 py-2.5 font-sans text-xs text-white placeholder-slate-500 outline-none focus:border-rose-400"
              />

              {searchEnemy && (
                <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-8 gap-2 mt-3 max-h-48 overflow-y-auto p-1 bg-black/40 rounded-xl border border-white/5">
                  {availableEnemies.slice(0, 16).map(h => (
                    <button
                      key={h.id}
                      onClick={() => handleAddEnemy(h)}
                      className="flex items-center gap-2 rounded-lg border border-white/10 bg-black/60 p-1.5 hover:border-rose-400 hover:bg-rose-950/30 text-left transition-all"
                    >
                      <img src={h.image} alt={h.name} className="h-7 w-7 rounded object-cover shrink-0" />
                      <span className="font-sans text-xs font-bold text-white truncate">{h.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Counter Recommendations Results */}
        {selectedEnemies.length > 0 ? (
          <div className="space-y-6">
            {/* Top Overall Counters Banner */}
            <div className="rounded-3xl border border-emerald-500/30 bg-emerald-950/15 p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-400">
                  🔥 TOP 8 REKOMENDASI HARD COUNTER UTAMA
                </span>
                <span className="font-mono text-xs text-slate-400">
                  DITEMUKAN {counterRecommendations.length} HERO COUNTER
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
                {counterRecommendations.slice(0, 8).map(({ hero, counteredEnemies, score }) => (
                  <div
                    key={hero.id}
                    onClick={() => setSelectedHeroModal(hero)}
                    className="group flex flex-col items-center rounded-2xl border border-white/10 bg-black/60 p-2.5 text-center transition-all hover:border-emerald-400 hover:bg-slate-900 cursor-pointer shadow-md"
                  >
                    <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-slate-950 mb-2 border border-white/10">
                      <img src={hero.image} alt={hero.name} className="h-full w-full object-cover group-hover:scale-110 transition-transform" />
                      <span className="absolute bottom-1 right-1 rounded bg-emerald-500 px-1 font-mono text-[8px] font-black text-black">
                        {score} COUNTER
                      </span>
                    </div>

                    <span className="font-sans text-xs font-bold text-white group-hover:text-emerald-300 truncate w-full">
                      {hero.name}
                    </span>
                    <span className="font-mono text-[9px] text-slate-400 truncate w-full">
                      {hero.lane[0] || hero.roles[0]}
                    </span>
                    <span className="font-mono text-[8px] text-emerald-400 mt-1 line-clamp-1">
                      vs {counteredEnemies.join(', ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations Grouped by Lane */}
            <div className="space-y-4">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-amber-400 block border-b border-white/10 pb-2">
                REKOMENDASI COUNTER BERDASARKAN JALUR LANE:
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(recommendationsByLane).map(([laneName, list]) => (
                  <div
                    key={laneName}
                    className="rounded-2xl border border-white/10 bg-black/50 p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <span className="font-sans text-sm font-bold text-white uppercase flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-cyan-400" />
                        {laneName}
                      </span>
                      <span className="font-mono text-[10px] text-slate-400">
                        {list.length} Pilihan
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {list.slice(0, 6).map(({ hero, counteredEnemies }) => (
                        <div
                          key={hero.id}
                          onClick={() => setSelectedHeroModal(hero)}
                          className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-950/80 px-2.5 py-1.5 hover:border-amber-400 hover:bg-slate-900 transition-all cursor-pointer"
                        >
                          <img src={hero.image} alt={hero.name} className="h-7 w-7 rounded-lg object-cover" />
                          <div className="min-w-0">
                            <span className="font-sans text-xs font-bold text-white block truncate">
                              {hero.name}
                            </span>
                            <span className="font-mono text-[8px] text-emerald-400 block truncate">
                              Counter: {counteredEnemies[0]}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-12 text-center space-y-3">
            <div className="text-3xl">🛡️</div>
            <h3 className="font-sans text-lg font-bold text-white uppercase">
              Pilih Hero Musuh Terlebih Dahulu
            </h3>
            <p className="font-mono text-xs text-slate-400 max-w-md mx-auto">
              Gunakan pencarian di atas untuk memasukkan 1 sampai 5 hero yang dipilih oleh lawan pada fase draft.
            </p>
          </div>
        )}
      </main>

      <HeroQuickViewModal
        hero={selectedHeroModal}
        onClose={() => setSelectedHeroModal(null)}
      />

      <Footer />
    </div>
  );
}
