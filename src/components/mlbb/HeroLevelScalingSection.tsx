// src/components/mlbb/HeroLevelScalingSection.tsx
'use client';

import { useState } from 'react';
import type { MLBBHero, MLBBEnrichedBuild } from '@/data/mlbb';

interface HeroLevelScalingSectionProps {
  hero: MLBBHero;
  activeBuild?: MLBBEnrichedBuild;
}

export default function HeroLevelScalingSection({ hero, activeBuild }: HeroLevelScalingSectionProps) {
  const [level, setLevel] = useState<number>(15);
  const [includeItemStats, setIncludeItemStats] = useState<boolean>(true);

  // Coefficients derived from hero attributes
  const isTank = hero.roles.includes('Tank');
  const isAssassin = hero.roles.includes('Assassin');
  const isMage = hero.roles.includes('Mage');
  const isMarksman = hero.roles.includes('Marksman');

  // Base stats calculation
  const durabilityRatio = (hero.stats.durability || 50) / 100;
  const offenseRatio = (hero.stats.offense || 50) / 100;

  const baseHp = 2300 + Math.round(durabilityRatio * 500);
  const hpPerLevel = 160 + Math.round(durabilityRatio * 90);
  const totalBaseHp = baseHp + (level - 1) * hpPerLevel;

  const baseAtk = 110 + Math.round(offenseRatio * 40);
  const atkPerLevel = 8 + Math.round(offenseRatio * 7);
  const totalBaseAtk = baseAtk + (level - 1) * atkPerLevel;

  const basePhyDef = 16 + Math.round(durabilityRatio * 8);
  const phyDefPerLevel = 3.2 + durabilityRatio * 2.5;
  const totalPhyDef = Math.round(basePhyDef + (level - 1) * phyDefPerLevel);

  const baseMagDef = 10;
  const magDefPerLevel = 1.8 + durabilityRatio * 1.2;
  const totalMagDef = Math.round(baseMagDef + (level - 1) * magDefPerLevel);

  const totalAtkSpeed = (1.0 + (level - 1) * 0.02).toFixed(2);

  // Bonus from items
  const itemHp = includeItemStats ? (activeBuild?.totalStats?.hp || 0) : 0;
  const itemAtk = includeItemStats ? (activeBuild?.totalStats?.physical_attack || activeBuild?.totalStats?.adaptive_attack || 0) : 0;
  const itemMag = includeItemStats ? (activeBuild?.totalStats?.magic_power || 0) : 0;
  const itemPhyDef = includeItemStats ? (activeBuild?.totalStats?.physical_defense || 0) : 0;
  const itemMagDef = includeItemStats ? (activeBuild?.totalStats?.magic_defense || 0) : 0;

  const milestones = [
    { lvl: 1, label: 'Early Laning' },
    { lvl: 4, label: 'Ultimate Buka' },
    { lvl: 8, label: 'Mid Game Roam' },
    { lvl: 12, label: 'Core Item Ready' },
    { lvl: 15, label: 'Max Level Spike' },
  ];

  return (
    <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-[#0a0e1c] to-[#060810] p-6 sm:p-8 space-y-6 shadow-2xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-cyan-400">
              SIMULATOR PERTUMBUHAN STATS
            </span>
          </div>
          <h2 className="font-sans text-xl sm:text-2xl font-black uppercase text-white mt-1">
            STATISTIK LEVEL 1 - 15 {hero.name}
          </h2>
        </div>

        {/* Toggle include item stats */}
        {activeBuild && (
          <label className="flex items-center gap-2 font-mono text-xs text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={includeItemStats}
              onChange={e => setIncludeItemStats(e.target.checked)}
              className="rounded accent-amber-400 h-4 w-4"
            />
            <span>+ Gabungkan Bonus Item Build ({activeBuild.title})</span>
          </label>
        )}
      </div>

      {/* Interactive Level Slider Bar */}
      <div className="space-y-3 bg-black/40 p-4 sm:p-6 rounded-2xl border border-white/10">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-400">
            PILIH LEVEL HERO:
          </span>
          <span className="font-mono text-2xl font-black text-amber-400 bg-amber-400/10 px-3 py-0.5 rounded-lg border border-amber-400/30">
            LEVEL {level}
          </span>
        </div>

        <input
          type="range"
          min={1}
          max={15}
          value={level}
          onChange={e => setLevel(Number(e.target.value))}
          className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
        />

        {/* Milestones Buttons */}
        <div className="flex justify-between items-center pt-2">
          {milestones.map(m => (
            <button
              key={m.lvl}
              onClick={() => setLevel(m.lvl)}
              className={`font-mono text-[10px] sm:text-xs rounded-lg px-2 py-1 transition-all cursor-pointer ${
                level === m.lvl
                  ? 'bg-amber-400 text-black font-black'
                  : 'text-slate-400 hover:text-white bg-white/5'
              }`}
            >
              Lv.{m.lvl} <span className="hidden md:inline">({m.label})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Stats Computed Display Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* HP */}
        <div className="rounded-2xl border border-blue-500/30 bg-blue-950/20 p-4 text-center">
          <span className="block font-mono text-[10px] uppercase tracking-wider text-blue-300">
            MAX HP
          </span>
          <span className="font-mono text-xl sm:text-2xl font-black text-white block my-1">
            {totalBaseHp + itemHp}
          </span>
          {itemHp > 0 && (
            <span className="font-mono text-[10px] text-emerald-400 font-bold block">
              +{itemHp} item HP
            </span>
          )}
        </div>

        {/* Physical Attack */}
        <div className="rounded-2xl border border-rose-500/30 bg-rose-950/20 p-4 text-center">
          <span className="block font-mono text-[10px] uppercase tracking-wider text-rose-300">
            PHYSICAL ATK
          </span>
          <span className="font-mono text-xl sm:text-2xl font-black text-white block my-1">
            {totalBaseAtk + itemAtk}
          </span>
          {itemAtk > 0 && (
            <span className="font-mono text-[10px] text-emerald-400 font-bold block">
              +{itemAtk} item ATK
            </span>
          )}
        </div>

        {/* Magic Power */}
        <div className="rounded-2xl border border-cyan-500/30 bg-cyan-950/20 p-4 text-center">
          <span className="block font-mono text-[10px] uppercase tracking-wider text-cyan-300">
            MAGIC POWER
          </span>
          <span className="font-mono text-xl sm:text-2xl font-black text-white block my-1">
            {itemMag}
          </span>
          <span className="font-mono text-[10px] text-slate-500 block">
            {isMage ? 'Skala Sihir' : 'Standard'}
          </span>
        </div>

        {/* Physical Defense */}
        <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-4 text-center">
          <span className="block font-mono text-[10px] uppercase tracking-wider text-amber-300">
            PHYSICAL DEF
          </span>
          <span className="font-mono text-xl sm:text-2xl font-black text-white block my-1">
            {totalPhyDef + itemPhyDef}
          </span>
          {itemPhyDef > 0 && (
            <span className="font-mono text-[10px] text-emerald-400 font-bold block">
              +{itemPhyDef} item DEF
            </span>
          )}
        </div>

        {/* Magic Defense */}
        <div className="rounded-2xl border border-purple-500/30 bg-purple-950/20 p-4 text-center">
          <span className="block font-mono text-[10px] uppercase tracking-wider text-purple-300">
            MAGIC DEF
          </span>
          <span className="font-mono text-xl sm:text-2xl font-black text-white block my-1">
            {totalMagDef + itemMagDef}
          </span>
          {itemMagDef > 0 && (
            <span className="font-mono text-[10px] text-emerald-400 font-bold block">
              +{itemMagDef} item DEF
            </span>
          )}
        </div>

        {/* Attack Speed */}
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4 text-center">
          <span className="block font-mono text-[10px] uppercase tracking-wider text-emerald-300">
            ATK SPEED
          </span>
          <span className="font-mono text-xl sm:text-2xl font-black text-white block my-1">
            {totalAtkSpeed}x
          </span>
          <span className="font-mono text-[10px] text-slate-400 block">
            +{Math.round((level - 1) * 2)}% scaling
          </span>
        </div>
      </div>
    </div>
  );
}
