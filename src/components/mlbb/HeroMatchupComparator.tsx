// src/components/mlbb/HeroMatchupComparator.tsx
'use client';

import { useState, useMemo } from 'react';
import type { MLBBHero, MLBBTierStat, MLBBHeroRelation } from '@/data/mlbb';

interface HeroMatchupComparatorProps {
  currentHero: MLBBHero;
  allHeroes: MLBBHero[];
  allTierStats: MLBBTierStat[];
  allRelations: MLBBHeroRelation[];
}

export default function HeroMatchupComparator({
  currentHero,
  allHeroes,
  allTierStats,
  allRelations,
}: HeroMatchupComparatorProps) {
  // Pre-sort heroes alphabetically except current
  const opponentOptions = useMemo(() => {
    return allHeroes
      .filter(h => h.id !== currentHero.id)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [allHeroes, currentHero.id]);

  const [selectedOpponentSlug, setSelectedOpponentSlug] = useState<string>(
    opponentOptions[0]?.slug || ''
  );

  const opponent = useMemo(() => {
    return allHeroes.find(h => h.slug === selectedOpponentSlug) || opponentOptions[0];
  }, [allHeroes, selectedOpponentSlug, opponentOptions]);

  // Current hero relation & opponent relation
  const currentRelation = useMemo(() => {
    return allRelations.find(r => r.hero_name.toLowerCase() === currentHero.name.toLowerCase());
  }, [allRelations, currentHero.name]);

  const opponentRelation = useMemo(() => {
    if (!opponent) return undefined;
    return allRelations.find(r => r.hero_name.toLowerCase() === opponent.name.toLowerCase());
  }, [allRelations, opponent]);

  // Tier stats
  const currentStat = useMemo(() => {
    return allTierStats.find(s => s.hero_name.toLowerCase() === currentHero.name.toLowerCase());
  }, [allTierStats, currentHero.name]);

  const opponentStat = useMemo(() => {
    if (!opponent) return undefined;
    return allTierStats.find(s => s.hero_name.toLowerCase() === opponent.name.toLowerCase());
  }, [allTierStats, opponent]);

  // Matchup calculation
  const matchupStatus = useMemo(() => {
    if (!opponent) return { verdict: 'EQUAL', label: 'SEIMBANG', color: 'text-amber-400', bg: 'border-amber-400/30 bg-amber-400/10' };

    // Check if opponent counters current hero
    const isCounteredByOpponent = currentRelation?.counters?.some(
      (c: any) => c.name.toLowerCase() === opponent.name.toLowerCase()
    );

    // Check if current hero counters opponent
    const isCounteringOpponent = opponentRelation?.counters?.some(
      (c: any) => c.name.toLowerCase() === currentHero.name.toLowerCase()
    );

    // Check if they are synergy duo
    const isSynergy = currentRelation?.synergies?.some(
      (s: any) => s.name.toLowerCase() === opponent.name.toLowerCase()
    );

    if (isCounteredByOpponent) {
      return {
        verdict: 'DISADVANTAGE',
        label: 'TERTEKAN (COUNTER BERAT)',
        color: 'text-rose-400',
        bg: 'border-rose-500/30 bg-rose-950/30',
        note: `${opponent.name} memiliki kit kemampuan yang secara langsung meredam efektivitas ${currentHero.name}.`
      };
    }

    if (isCounteringOpponent) {
      return {
        verdict: 'ADVANTAGE',
        label: 'UNGGUL (COUNTER DOMINAN)',
        color: 'text-emerald-400',
        bg: 'border-emerald-500/30 bg-emerald-950/30',
        note: `${currentHero.name} memiliki keunggulan skill dan mobilitas yang dapat mendominasi ${opponent.name}.`
      };
    }

    if (isSynergy) {
      return {
        verdict: 'SYNERGY',
        label: 'SINERGIS (COMBO PARTNER)',
        color: 'text-cyan-400',
        bg: 'border-cyan-500/30 bg-cyan-950/30',
        note: `Kedua hero ini saling melengkapi dengan crowd control dan burst damage tinggi.`
      };
    }

    const wrDelta = (currentStat?.win_rate || 0.5) - (opponentStat?.win_rate || 0.5);
    if (wrDelta > 0.03) {
      return {
        verdict: 'SLIGHT_ADVANTAGE',
        label: 'SEDANG UNGGUL (+WR)',
        color: 'text-emerald-300',
        bg: 'border-emerald-500/20 bg-emerald-950/20',
        note: `${currentHero.name} memiliki rata-rata winrate rank lebih tinggi dalam meta saat ini.`
      };
    } else if (wrDelta < -0.03) {
      return {
        verdict: 'SLIGHT_DISADVANTAGE',
        label: 'SEDANG TERTEKAN (-WR)',
        color: 'text-rose-300',
        bg: 'border-rose-500/20 bg-rose-950/20',
        note: `${opponent.name} memiliki rata-rata winrate rank lebih tinggi dalam patch ini.`
      };
    }

    return {
      verdict: 'BALANCED',
      label: 'ADU MEKANIK (SKILL MATCHUP)',
      color: 'text-amber-400',
      bg: 'border-amber-400/30 bg-amber-400/10',
      note: 'Hasil pertarungan sangat bergantung pada eksekusi positioning, kiting, dan timing skill.'
    };
  }, [currentHero, opponent, currentRelation, opponentRelation, currentStat, opponentStat]);

  // Recommended counter items against opponent
  const counterItemTips = useMemo(() => {
    if (!opponent) return [];
    const tips = [];
    if (opponent.roles.includes('Mage') || opponent.speciality.includes('Magic Damage')) {
      tips.push({ item: "Athena's Shield / Radiant Armor", reason: 'Meredam burst sihir bertubi-tubi lawan.' });
    }
    if (opponent.speciality.includes('Regen') || opponent.roles.includes('Support') || opponent.roles.includes('Tank')) {
      tips.push({ item: 'Sea Halberd / Dominance Ice / Glowing Wand', reason: 'Memotong efek pemulihan HP & shield lawan hingga 50%.' });
    }
    if (opponent.roles.includes('Marksman') || opponent.roles.includes('Assassin')) {
      tips.push({ item: 'Wind of Nature / Antique Cuirass', reason: 'Kekebalan physical damage dan mereduksi Physical Attack lawan.' });
    }
    if (tips.length === 0) {
      tips.push({ item: 'Immortality', reason: 'Resurrection cadangan krusial untuk team fight penentu.' });
    }
    return tips;
  }, [opponent]);

  if (!opponent) return null;

  return (
    <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-[#0a0e1c] to-[#060810] p-6 sm:p-8 space-y-6 shadow-2xl">
      {/* Header & Opponent Picker */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-rose-400 animate-pulse" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-rose-400">
              KOMPARATOR MATCHUP & COUNTER ANALYSIS
            </span>
          </div>
          <h2 className="font-sans text-xl sm:text-2xl font-black uppercase text-white mt-1">
            HEAD-TO-HEAD: {currentHero.name} VS {opponent.name}
          </h2>
        </div>

        {/* Dropdown Selector */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-slate-400 hidden sm:inline">PILIH LAWAN:</span>
          <select
            value={selectedOpponentSlug}
            onChange={e => setSelectedOpponentSlug(e.target.value)}
            className="rounded-xl border border-white/15 bg-black/80 px-3 py-2 font-mono text-xs text-amber-300 outline-none hover:border-amber-400 focus:border-amber-400 cursor-pointer"
          >
            {opponentOptions.map(h => (
              <option key={h.id} value={h.slug} className="bg-slate-900 text-slate-200">
                {h.name} ({h.roles.join('/')})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Versus Visual Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/60 p-4 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
          {/* Left: Current Hero */}
          <div className="md:col-span-4 flex items-center gap-4">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-amber-400/40 bg-black">
              <img src={currentHero.image} alt={currentHero.name} className="h-full w-full object-cover" />
            </div>
            <div>
              <span className="font-mono text-[9px] text-amber-400 font-bold uppercase block">HERO ANDA</span>
              <h3 className="font-sans text-lg sm:text-xl font-black uppercase text-white truncate">
                {currentHero.name}
              </h3>
              <p className="font-mono text-[10px] text-slate-400">
                {currentHero.roles.join(', ')} · WR {currentStat ? (currentStat.win_rate * 100).toFixed(1) : '50.0'}%
              </p>
            </div>
          </div>

          {/* Center: Matchup Verdict Banner */}
          <div className="md:col-span-3 text-center py-2 px-3 rounded-xl border border-white/5 bg-slate-950/80">
            <span className="block font-mono text-[9px] text-slate-500 uppercase tracking-widest">
              STATUS ANALISIS MATCHUP
            </span>
            <span className={`block font-sans text-sm sm:text-base font-black uppercase mt-0.5 ${matchupStatus.color}`}>
              {matchupStatus.label}
            </span>
            <p className="font-mono text-[9px] text-slate-400 mt-1 leading-snug">
              {matchupStatus.note}
            </p>
          </div>

          {/* Right: Opponent Hero */}
          <div className="md:col-span-4 flex items-center justify-end gap-4 text-right">
            <div>
              <span className="font-mono text-[9px] text-rose-400 font-bold uppercase block">HERO LAWAN</span>
              <h3 className="font-sans text-lg sm:text-xl font-black uppercase text-white truncate">
                {opponent.name}
              </h3>
              <p className="font-mono text-[10px] text-slate-400">
                {opponent.roles.join(', ')} · WR {opponentStat ? (opponentStat.win_rate * 100).toFixed(1) : '50.0'}%
              </p>
            </div>
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-rose-500/40 bg-black">
              <img src={opponent.image} alt={opponent.name} className="h-full w-full object-cover" />
            </div>
          </div>
        </div>
      </div>

      {/* Attribute Head-to-Head Comparison Bars */}
      <div className="rounded-2xl border border-white/5 bg-black/40 p-5 space-y-3">
        <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-300 block border-b border-white/5 pb-2">
          PERBANDINGAN ATRIBUT DASAR
        </span>

        <div className="space-y-3 font-mono text-xs">
          {[
            { label: 'DURABILITY', val1: currentHero.stats.durability, val2: opponent.stats.durability },
            { label: 'OFFENSE DAMAGE', val1: currentHero.stats.offense, val2: opponent.stats.offense },
            { label: 'SKILL EFFECTS', val1: currentHero.stats.ability, val2: opponent.stats.ability },
            { label: 'DIFFICULTY', val1: currentHero.stats.difficulty, val2: opponent.stats.difficulty },
          ].map(row => (
            <div key={row.label} className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-amber-400 font-bold">{row.val1}%</span>
                <span className="text-slate-400 font-semibold">{row.label}</span>
                <span className="text-rose-400 font-bold">{row.val2}%</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 h-2 w-full">
                {/* Current Bar (Right to Left direction) */}
                <div className="bg-slate-800 rounded-l-full overflow-hidden flex justify-end">
                  <div className="bg-amber-400 h-full rounded-l-full" style={{ width: `${row.val1}%` }} />
                </div>
                {/* Opponent Bar (Left to Right) */}
                <div className="bg-slate-800 rounded-r-full overflow-hidden">
                  <div className="bg-rose-500 h-full rounded-r-full" style={{ width: `${row.val2}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tactical Advice & Recommended Counter Equipment */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Counter Item Tips */}
        <div className="rounded-2xl border border-white/10 bg-black/50 p-4 space-y-2.5">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-amber-400 block border-b border-white/10 pb-1.5">
            ⚔️ REKOMENDASI ITEM COUNTER UNTUK {currentHero.name.toUpperCase()}
          </span>
          <div className="space-y-2">
            {counterItemTips.map((tip, idx) => (
              <div key={idx} className="rounded-xl border border-white/5 bg-slate-950/70 p-2.5 font-sans text-xs">
                <span className="font-bold text-emerald-400 block">{tip.item}</span>
                <span className="text-slate-400 text-[11px] block mt-0.5">{tip.reason}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Danger Skills to Avoid */}
        <div className="rounded-2xl border border-white/10 bg-black/50 p-4 space-y-2.5">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-rose-400 block border-b border-white/10 pb-1.5">
            ⚠️ SKILL LAWAN YANG WAJIB DIWASPADAI
          </span>
          <div className="space-y-2">
            {opponent.skills.slice(0, 3).map((s, idx) => (
              <div key={s.id} className="flex items-center gap-3 rounded-xl border border-white/5 bg-slate-950/70 p-2 font-sans text-xs">
                {s.icon && (
                  <img src={s.icon} alt={s.name} className="h-8 w-8 rounded-lg object-cover border border-white/10 shrink-0" />
                )}
                <div className="min-w-0">
                  <span className="font-bold text-white block truncate">
                    {idx === 0 ? '[Pasif] ' : `[Skill ${idx}] `}{s.name}
                  </span>
                  <span className="text-[10px] text-slate-400 block truncate">
                    {s.tags.map(t => t.name).join(', ') || 'Damage/Utility'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
