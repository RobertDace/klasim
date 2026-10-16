// src/components/mlbb/HeroBuildSection.tsx
'use client';

import { useState } from 'react';
import type { MLBBHero, MLBBEnrichedBuild, MLBBItem } from '@/data/mlbb';

interface HeroBuildSectionProps {
  hero: MLBBHero;
  builds: MLBBEnrichedBuild[];
}

export default function HeroBuildSection({ hero, builds }: HeroBuildSectionProps) {
  const [selectedBuildIndex, setSelectedBuildIndex] = useState(0);
  const [hoveredItem, setHoveredItem] = useState<MLBBItem | null>(null);

  if (!builds || builds.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-6 text-center font-mono text-xs text-slate-400">
        Belum ada racikan build yang tersimpan untuk {hero.name}.
      </div>
    );
  }

  const currentBuild = builds[selectedBuildIndex] || builds[0];

  const formatStatKey = (key: string) => {
    return key
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-[#0a0e1c] to-[#060810] p-6 sm:p-8 space-y-6 shadow-2xl">
      {/* Top Header & Build Selector Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-amber-400">
              REKOMENDASI EQUIPMENT PRO & META
            </span>
          </div>
          <h2 className="font-sans text-xl sm:text-2xl font-black uppercase text-white mt-1">
            RACIKAN BUILD {hero.name}
          </h2>
        </div>

        {/* Build Selectors */}
        <div className="flex flex-wrap items-center gap-2">
          {builds.map((b, idx) => {
            const isSelected = idx === selectedBuildIndex;
            return (
              <button
                key={b.id}
                onClick={() => setSelectedBuildIndex(idx)}
                className={`flex items-center gap-2 rounded-xl border px-3 py-1.5 font-mono text-xs font-bold uppercase transition-all cursor-pointer ${
                  isSelected
                    ? 'border-amber-400 bg-amber-400 text-black shadow-lg shadow-amber-500/20'
                    : 'border-white/10 bg-black/40 text-slate-300 hover:border-white/20 hover:bg-white/5'
                }`}
              >
                <span>#{idx + 1}</span>
                <span className="max-w-[140px] truncate">{b.title}</span>
                <span className={`rounded px-1 text-[9px] ${isSelected ? 'bg-black/20 text-black' : 'bg-white/10 text-slate-400'}`}>
                  ♥ {b.likes_count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Build Description */}
      {currentBuild.description && (
        <p className="font-sans text-xs sm:text-sm text-slate-300 italic bg-black/30 p-3 rounded-xl border border-white/5">
          "{currentBuild.description}"
        </p>
      )}

      {/* Main Grid: 6 Core Items & Spell/Emblem */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left (8 Cols): 6 Core Items */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between font-mono text-xs text-slate-400">
            <span className="font-bold uppercase tracking-wider text-slate-300">
              6 CORE EQUIPMENT (URUTAN BELI)
            </span>
            <span className="text-slate-500 text-[10px]">
              TOTAL GOLD: ~{currentBuild.items.reduce((acc, i) => acc + (i.price || 0), 0).toLocaleString('id-ID')}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {currentBuild.items.map((item, idx) => (
              <div
                key={item.id + idx}
                onMouseEnter={() => setHoveredItem(item)}
                className="group relative flex flex-col items-center rounded-2xl border border-white/10 bg-black/60 p-3 text-center transition-all duration-200 hover:-translate-y-1 hover:border-amber-400/50 hover:bg-slate-950 hover:shadow-xl hover:shadow-amber-500/10 cursor-pointer"
              >
                <span className="absolute top-1.5 left-2 font-mono text-[9px] font-bold text-slate-500">
                  #{idx + 1}
                </span>

                <div className="relative my-2 h-14 w-14 overflow-hidden rounded-xl border border-white/15 bg-slate-900 shadow-md">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>

                <span className="font-sans text-xs font-bold text-white group-hover:text-amber-300 truncate w-full">
                  {item.name}
                </span>
                <span className="font-mono text-[10px] text-amber-400/90 font-semibold mt-0.5">
                  🪙 {item.price}
                </span>
                <span className="rounded bg-white/5 px-1.5 py-0.2 font-mono text-[8px] text-slate-400 mt-1 uppercase">
                  {item.type}
                </span>
              </div>
            ))}
          </div>

          {/* Conditional / Situational Items if available */}
          {currentBuild.conditional_items.length > 0 && (
            <div className="rounded-2xl border border-white/5 bg-black/40 p-4 space-y-3">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-400 block">
                OPSI ITEM KONDISIONAL / LATE GAME
              </span>
              <div className="flex flex-wrap items-center gap-3">
                {currentBuild.conditional_items.map((item, idx) => (
                  <div
                    key={item.id + idx}
                    onMouseEnter={() => setHoveredItem(item)}
                    className="group flex items-center gap-2.5 rounded-xl border border-white/10 bg-black/60 px-3 py-1.5 transition-all hover:border-amber-400/40 cursor-pointer"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-8 w-8 rounded-lg object-cover"
                    />
                    <div>
                      <span className="block font-sans text-xs font-bold text-slate-200 group-hover:text-amber-300">
                        {item.name}
                      </span>
                      <span className="block font-mono text-[9px] text-slate-400">
                        🪙 {item.price} · {item.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hovered Item Passive / Stat Inspector Box */}
          {hoveredItem && (
            <div className="rounded-2xl border border-amber-400/30 bg-amber-400/5 p-4 space-y-2 animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-amber-400/20 pb-1.5">
                <div className="flex items-center gap-2">
                  <img src={hoveredItem.image} alt={hoveredItem.name} className="h-6 w-6 rounded object-cover" />
                  <span className="font-sans text-sm font-bold text-amber-300">{hoveredItem.name}</span>
                  <span className="rounded bg-amber-400/20 px-1.5 py-0.2 font-mono text-[9px] text-amber-200">
                    🪙 {hoveredItem.price}
                  </span>
                </div>
                <button
                  onClick={() => setHoveredItem(null)}
                  className="font-mono text-[10px] text-slate-400 hover:text-white"
                >
                  ✕ Tutup
                </button>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-2 text-xs font-mono text-slate-200">
                {hoveredItem.stats && Object.entries(hoveredItem.stats).map(([k, v]) => (
                  <span key={k} className="rounded bg-white/10 px-2 py-0.5">
                    {formatStatKey(k)}: <strong className="text-emerald-400">{String(v)}</strong>
                  </span>
                ))}
              </div>

              {/* Passive Description */}
              {hoveredItem.passive_description && (
                <p className="font-sans text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                  {hoveredItem.passive_description}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Right (4 Cols): Battle Spell, Custom Emblem & Stat Accumulator */}
        <div className="lg:col-span-4 space-y-4">
          <span className="block font-mono text-xs font-bold uppercase tracking-wider text-slate-300">
            SPELL & EMBLEM REKOMENDASI
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
            {/* Battle Spell Card */}
            {currentBuild.spell ? (
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/60 p-3.5">
                <img
                  src={currentBuild.spell.image}
                  alt={currentBuild.spell.name}
                  className="h-12 w-12 rounded-xl object-cover border border-white/10 shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-xs font-bold text-white truncate">
                      {currentBuild.spell.name}
                    </span>
                    <span className="font-mono text-[9px] text-amber-400 font-bold ml-1">
                      CD: {currentBuild.spell.cooldown}s
                    </span>
                  </div>
                  <p className="font-mono text-[10px] text-slate-400 line-clamp-2 mt-0.5">
                    {currentBuild.spell.description}
                  </p>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-white/10 bg-black/40 p-3 font-mono text-xs text-slate-500">
                Spell: Flicker / Retribution
              </div>
            )}

            {/* Emblem Card */}
            {currentBuild.emblem ? (
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/60 p-3.5">
                <img
                  src={currentBuild.emblem.image}
                  alt={currentBuild.emblem.name}
                  className="h-12 w-12 rounded-xl object-cover border border-white/10 shrink-0"
                />
                <div className="min-w-0">
                  <span className="font-sans text-xs font-bold text-white">
                    Custom {currentBuild.emblem.name} Emblem
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {currentBuild.emblem.attributes && Object.entries(currentBuild.emblem.attributes).map(([k, v]) => (
                      <span key={k} className="rounded bg-white/10 px-1.5 py-0.2 font-mono text-[8px] text-slate-300">
                        {k.replace(/_/g, ' ')}: +{String(v)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-white/10 bg-black/40 p-3 font-mono text-xs text-slate-500">
                Emblem: Custom Class
              </div>
            )}
          </div>

          {/* Accumulated Build Stats Card */}
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/10 p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
              <span className="font-mono text-xs font-bold text-emerald-400 uppercase tracking-wider">
                ⚡ AKUMULASI STATS ITEM
              </span>
              <span className="font-mono text-[9px] text-slate-400">FULL 6 ITEMS</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              {Object.keys(currentBuild.totalStats).length > 0 ? (
                Object.entries(currentBuild.totalStats).map(([key, val]) => (
                  <div key={key} className="rounded-lg bg-black/40 p-2 border border-white/5">
                    <span className="block text-[9px] text-slate-400 uppercase truncate">
                      {formatStatKey(key)}
                    </span>
                    <span className="text-sm font-black text-emerald-400">
                      +{val >= 1 ? Math.round(val) : `${Math.round(val * 100)}%`}
                    </span>
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-slate-500 text-xs">Stats dasar seimbang</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
