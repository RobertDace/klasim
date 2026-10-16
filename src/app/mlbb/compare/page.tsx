// src/app/mlbb/compare/page.tsx
'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import {
  heroes as allHeroes,
  heroTierStats,
  heroRelations,
  getHeroBuilds,
  type MLBBHero,
  type MLBBEnrichedBuild,
} from '@/data/mlbb';

// Helper to calculate combat stats at specific level
function calculateHeroStats(hero: MLBBHero, level: number, build?: MLBBEnrichedBuild, includeItems = true) {
  const durabilityRatio = (hero.stats.durability || 50) / 100;
  const offenseRatio = (hero.stats.offense || 50) / 100;

  const baseHp = 2300 + Math.round(durabilityRatio * 500);
  const hpPerLevel = 160 + Math.round(durabilityRatio * 90);
  const rawHp = baseHp + (level - 1) * hpPerLevel;

  const baseAtk = 110 + Math.round(offenseRatio * 40);
  const atkPerLevel = 8 + Math.round(offenseRatio * 7);
  const rawAtk = baseAtk + (level - 1) * atkPerLevel;

  const basePhyDef = 16 + Math.round(durabilityRatio * 8);
  const phyDefPerLevel = 3.2 + durabilityRatio * 2.5;
  const rawPhyDef = Math.round(basePhyDef + (level - 1) * phyDefPerLevel);

  const baseMagDef = 10;
  const magDefPerLevel = 1.8 + durabilityRatio * 1.2;
  const rawMagDef = Math.round(baseMagDef + (level - 1) * magDefPerLevel);

  const rawAtkSpeed = (1.0 + (level - 1) * 0.02).toFixed(2);

  const itemStats = includeItems ? build?.totalStats || {} : {};
  const bonusHp = itemStats.hp || 0;
  const bonusAtk = itemStats.physical_attack || itemStats.adaptive_attack || 0;
  const bonusMag = itemStats.magic_power || 0;
  const bonusPhyDef = itemStats.physical_defense || 0;
  const bonusMagDef = itemStats.magic_defense || 0;
  const bonusAtkSpeed = itemStats.attack_speed ? Math.round(itemStats.attack_speed * 100) : 0;
  const bonusCdr = itemStats.cooldown_reduction ? Math.round(itemStats.cooldown_reduction * 100) : 0;

  return {
    hp: rawHp + bonusHp,
    rawHp,
    bonusHp,
    atk: rawAtk + bonusAtk,
    rawAtk,
    bonusAtk,
    magPower: bonusMag,
    phyDef: rawPhyDef + bonusPhyDef,
    rawPhyDef,
    bonusPhyDef,
    magDef: rawMagDef + bonusMagDef,
    rawMagDef,
    bonusMagDef,
    atkSpeed: rawAtkSpeed,
    bonusAtkSpeed,
    cdr: bonusCdr,
  };
}

export default function ComparePage() {
  // Default to two iconic assassins/fighters: Fanny (id/slug: fanny) vs Ling (ling)
  const [hero1Slug, setHero1Slug] = useState<string>('fanny');
  const [hero2Slug, setHero2Slug] = useState<string>('ling');
  const [level, setLevel] = useState<number>(15);
  const [includeItems, setIncludeItems] = useState<boolean>(true);

  // Hero selection modals
  const [isPickingHero1, setIsPickingHero1] = useState(false);
  const [isPickingHero2, setIsPickingHero2] = useState(false);
  const [searchPickerQuery, setSearchPickerQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  const hero1 = useMemo(() => {
    return allHeroes.find(h => h.slug === hero1Slug) || allHeroes[0];
  }, [hero1Slug]);

  const hero2 = useMemo(() => {
    return allHeroes.find(h => h.slug === hero2Slug) || allHeroes[1];
  }, [hero2Slug]);

  // Tier stats
  const hero1Tier = useMemo(() => {
    return heroTierStats.find(s => s.hero_name.toLowerCase() === hero1.name.toLowerCase());
  }, [hero1.name]);

  const hero2Tier = useMemo(() => {
    return heroTierStats.find(s => s.hero_name.toLowerCase() === hero2.name.toLowerCase());
  }, [hero2.name]);

  // Pro builds
  const hero1Builds = useMemo(() => getHeroBuilds(hero1.slug), [hero1.slug]);
  const hero2Builds = useMemo(() => getHeroBuilds(hero2.slug), [hero2.slug]);
  const hero1ActiveBuild = hero1Builds[0];
  const hero2ActiveBuild = hero2Builds[0];

  // Relations & Counter analysis
  const hero1Relation = useMemo(() => {
    return heroRelations.find(r => r.hero_name.toLowerCase() === hero1.name.toLowerCase());
  }, [hero1.name]);

  const hero2Relation = useMemo(() => {
    return heroRelations.find(r => r.hero_name.toLowerCase() === hero2.name.toLowerCase());
  }, [hero2.name]);

  const matchupVerdict = useMemo(() => {
    const hero1CountersHero2 = hero2Relation?.counters?.some(
      (c: any) => c.name?.toLowerCase() === hero1.name.toLowerCase()
    );
    const hero2CountersHero1 = hero1Relation?.counters?.some(
      (c: any) => c.name?.toLowerCase() === hero2.name.toLowerCase()
    );

    if (hero1CountersHero2 && !hero2CountersHero1) {
      return {
        winner: 1,
        title: `${hero1.name} Diunggulkan (Hard Counter)`,
        desc: `${hero1.name} tercatat sebagai counter efektif terhadap ${hero2.name} dalam data turnamen resmi.`,
        color: 'text-amber-400',
        border: 'border-amber-400/40 bg-amber-400/10',
      };
    }
    if (hero2CountersHero1 && !hero1CountersHero2) {
      return {
        winner: 2,
        title: `${hero2.name} Diunggulkan (Hard Counter)`,
        desc: `${hero2.name} tercatat sebagai counter efektif terhadap ${hero1.name} dalam data turnamen resmi.`,
        color: 'text-cyan-400',
        border: 'border-cyan-400/40 bg-cyan-400/10',
      };
    }
    return {
      winner: 0,
      title: 'Matchup Berimbang (Skill Dependent)',
      desc: `Kedua hero tidak saling melakukan hard-counter langsung. Pertarungan sangat ditentukan oleh timing skill dan penguasaan mekanik pemain.`,
      color: 'text-emerald-400',
      border: 'border-emerald-400/40 bg-emerald-400/10',
    };
  }, [hero1.name, hero2.name, hero1Relation, hero2Relation]);

  // Combat stats calculation
  const stats1 = useMemo(() => calculateHeroStats(hero1, level, hero1ActiveBuild, includeItems), [hero1, level, hero1ActiveBuild, includeItems]);
  const stats2 = useMemo(() => calculateHeroStats(hero2, level, hero2ActiveBuild, includeItems), [hero2, level, hero2ActiveBuild, includeItems]);

  // Swap heroes
  const handleSwap = () => {
    const temp = hero1Slug;
    setHero1Slug(hero2Slug);
    setHero2Slug(temp);
  };

  // Filtered heroes for picker modal
  const filteredPickerHeroes = useMemo(() => {
    return allHeroes.filter(h => {
      if (roleFilter !== 'ALL' && !h.roles.some(r => r.toUpperCase() === roleFilter)) {
        return false;
      }
      if (searchPickerQuery.trim()) {
        const q = searchPickerQuery.toLowerCase();
        return h.name.toLowerCase().includes(q) || h.roles.some(r => r.toLowerCase().includes(q));
      }
      return true;
    });
  }, [searchPickerQuery, roleFilter]);

  const selectHeroFromModal = (slug: string) => {
    if (isPickingHero1) {
      if (slug === hero2Slug) handleSwap();
      else setHero1Slug(slug);
      setIsPickingHero1(false);
    } else if (isPickingHero2) {
      if (slug === hero1Slug) handleSwap();
      else setHero2Slug(slug);
      setIsPickingHero2(false);
    }
    setSearchPickerQuery('');
    setRoleFilter('ALL');
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
                  <span>HEAD-TO-HEAD MATCHUP & COMPARISON ENGINE</span>
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white font-sans uppercase">
                  HERO <span className="text-amber-400">COMPARATOR</span>
                </h1>
                <p className="mt-2 max-w-2xl text-xs sm:text-sm text-slate-400 font-sans">
                  Bandingkan statistik dasar, pertumbuhan level 1–15, radar atribut, skill set, dan racikan pro build dua hero MLBB secara berdampingan.
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
                  <span>Tier List</span>
                </Link>
                <Link
                  href="/mlbb/items"
                  className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-slate-300 hover:border-amber-400/40 hover:text-amber-400 transition-all flex items-center gap-1.5"
                >
                  <span>📦</span>
                  <span>Database Item</span>
                </Link>
                <Link
                  href="/mlbb/draft"
                  className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-slate-300 hover:border-amber-400/40 hover:text-amber-400 transition-all flex items-center gap-1.5"
                >
                  <span>⚔️</span>
                  <span>Draft 5v5</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Dual Hero Selection Cards & Swap Bar */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-11 gap-4 items-center">
            {/* Hero 1 Card */}
            <div className="lg:col-span-5 rounded-3xl border-2 border-amber-400/40 bg-gradient-to-b from-[#0e1422] to-[#080d16] p-5 sm:p-6 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 h-32 w-32 bg-amber-400/5 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between mb-4">
                <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-0.5 text-[10px] font-mono font-bold text-amber-400 uppercase">
                  HERO 1
                </span>
                <button
                  onClick={() => setIsPickingHero1(true)}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-1 text-xs font-mono text-slate-300 hover:border-amber-400 hover:text-amber-400 transition-all cursor-pointer"
                >
                  Ganti Hero ↗
                </button>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative h-20 w-20 sm:h-24 sm:w-24 shrink-0 rounded-2xl overflow-hidden border-2 border-amber-400/50 shadow-xl bg-black">
                  <img
                    src={hero1.image}
                    alt={hero1.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white font-sans">{hero1.name}</h3>
                  <div className="flex flex-wrap items-center gap-1.5 mt-1.5 font-mono text-[10px]">
                    {hero1.roles.map(r => (
                      <span key={r} className="rounded bg-white/10 px-2 py-0.5 text-slate-200">
                        {r}
                      </span>
                    ))}
                    {hero1.lane.map(l => (
                      <span key={l} className="rounded bg-amber-400/20 text-amber-300 px-2 py-0.5">
                        {l}
                      </span>
                    ))}
                  </div>
                  {hero1Tier && (
                    <div className="flex items-center gap-3 mt-2 text-xs font-mono">
                      <span className="font-bold text-emerald-400">WR {hero1Tier.win_rate}%</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-400">Tier {hero1Tier.tier}</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-400">Pick {hero1Tier.pick_rate}%</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Swap & VS Controller */}
            <div className="lg:col-span-1 flex flex-col items-center justify-center gap-2">
              <button
                onClick={handleSwap}
                title="Tukar Posisi Hero"
                className="h-12 w-12 rounded-2xl border border-white/15 bg-black/80 text-amber-400 hover:bg-amber-400 hover:text-black hover:border-amber-400 transition-all shadow-xl flex items-center justify-center font-bold text-lg active:scale-90 cursor-pointer"
              >
                ⇄
              </button>
              <span className="font-black font-mono text-xs text-slate-500 uppercase tracking-widest">
                VS
              </span>
            </div>

            {/* Hero 2 Card */}
            <div className="lg:col-span-5 rounded-3xl border-2 border-cyan-400/40 bg-gradient-to-b from-[#0b1622] to-[#080d16] p-5 sm:p-6 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 h-32 w-32 bg-cyan-400/5 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between mb-4">
                <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-0.5 text-[10px] font-mono font-bold text-cyan-400 uppercase">
                  HERO 2
                </span>
                <button
                  onClick={() => setIsPickingHero2(true)}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-1 text-xs font-mono text-slate-300 hover:border-cyan-400 hover:text-cyan-400 transition-all cursor-pointer"
                >
                  Ganti Hero ↗
                </button>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative h-20 w-20 sm:h-24 sm:w-24 shrink-0 rounded-2xl overflow-hidden border-2 border-cyan-400/50 shadow-xl bg-black">
                  <img
                    src={hero2.image}
                    alt={hero2.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white font-sans">{hero2.name}</h3>
                  <div className="flex flex-wrap items-center gap-1.5 mt-1.5 font-mono text-[10px]">
                    {hero2.roles.map(r => (
                      <span key={r} className="rounded bg-white/10 px-2 py-0.5 text-slate-200">
                        {r}
                      </span>
                    ))}
                    {hero2.lane.map(l => (
                      <span key={l} className="rounded bg-cyan-400/20 text-cyan-300 px-2 py-0.5">
                        {l}
                      </span>
                    ))}
                  </div>
                  {hero2Tier && (
                    <div className="flex items-center gap-3 mt-2 text-xs font-mono">
                      <span className="font-bold text-emerald-400">WR {hero2Tier.win_rate}%</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-400">Tier {hero2Tier.tier}</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-400">Pick {hero2Tier.pick_rate}%</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Matchup Verdict Banner */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-6">
          <div className={`rounded-2xl border p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl ${matchupVerdict.border}`}>
            <div className="flex items-center gap-3">
              <span className="text-3xl">⚔️</span>
              <div>
                <h4 className={`text-base sm:text-lg font-black font-sans uppercase ${matchupVerdict.color}`}>
                  {matchupVerdict.title}
                </h4>
                <p className="text-xs text-slate-300 font-sans mt-0.5">
                  {matchupVerdict.desc}
                </p>
              </div>
            </div>
            <div className="font-mono text-xs text-slate-400 whitespace-nowrap">
              DATASET: MOLEBUILD RELATIONS
            </div>
          </div>
        </section>

        {/* Level Scaling Slider & Settings */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-6">
          <div className="rounded-2xl border border-white/10 bg-[#080d16] p-4 sm:p-5 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="w-full md:w-1/2 flex items-center gap-4">
              <span className="text-xs font-mono font-bold text-amber-400 whitespace-nowrap">
                SIMULASI LEVEL:
              </span>
              <input
                type="range"
                min="1"
                max="15"
                value={level}
                onChange={(e) => setLevel(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
              <span className="rounded-lg bg-amber-400/20 border border-amber-400/40 px-2.5 py-1 font-mono text-sm font-black text-amber-400">
                LV.{level}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-xs font-mono text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeItems}
                  onChange={(e) => setIncludeItems(e.target.checked)}
                  className="rounded border-white/20 bg-black text-amber-400 focus:ring-amber-400"
                />
                <span>Sertakan Bonus Stat Build Item Pro</span>
              </label>

              <div className="flex items-center gap-1 font-mono text-[10px]">
                {[1, 4, 8, 12, 15].map(lvl => (
                  <button
                    key={lvl}
                    onClick={() => setLevel(lvl)}
                    className={`rounded px-2 py-0.5 transition-all ${
                      level === lvl ? 'bg-amber-400 text-black font-bold' : 'bg-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    L{lvl}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Side-by-Side Combat Stats Comparison Matrix */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-6">
          <div className="rounded-3xl border border-white/10 bg-[#080d16] p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="text-xs font-mono font-bold uppercase text-slate-400 tracking-wider">
                Matriks Statistik Tempur (Level {level})
              </div>
              <div className="flex items-center gap-4 font-mono text-xs">
                <span className="text-amber-400 font-bold">{hero1.name}</span>
                <span className="text-slate-500">vs</span>
                <span className="text-cyan-400 font-bold">{hero2.name}</span>
              </div>
            </div>

            {/* Stat Rows */}
            <div className="space-y-3">
              {[
                { label: 'Max HP', val1: stats1.hp, val2: stats2.hp, isNumber: true },
                { label: 'Physical Attack', val1: stats1.atk, val2: stats2.atk, isNumber: true },
                { label: 'Magic Power', val1: stats1.magPower, val2: stats2.magPower, isNumber: true },
                { label: 'Physical Defense', val1: stats1.phyDef, val2: stats2.phyDef, isNumber: true },
                { label: 'Magic Defense', val1: stats1.magDef, val2: stats2.magDef, isNumber: true },
                { label: 'Attack Speed', val1: parseFloat(stats1.atkSpeed), val2: parseFloat(stats2.atkSpeed), isNumber: true, suffix: '/s' },
                { label: 'Cooldown Reduction', val1: stats1.cdr, val2: stats2.cdr, isNumber: true, suffix: '%' },
                { label: 'Durability Rating', val1: hero1.stats.durability, val2: hero2.stats.durability, isNumber: true },
                { label: 'Offense Rating', val1: hero1.stats.offense, val2: hero2.stats.offense, isNumber: true },
                { label: 'Ability Effect Rating', val1: hero1.stats.ability, val2: hero2.stats.ability, isNumber: true },
                { label: 'Difficulty Rating', val1: hero1.stats.difficulty, val2: hero2.stats.difficulty, isNumber: true },
              ].map((stat, idx) => {
                const diff = stat.val1 - stat.val2;
                const isHero1Ahead = diff > 0;
                const isHero2Ahead = diff < 0;

                return (
                  <div
                    key={idx}
                    className="grid grid-cols-12 items-center rounded-xl border border-white/5 bg-black/40 p-3 text-xs font-mono hover:border-white/10 transition-colors"
                  >
                    {/* Hero 1 Value */}
                    <div className="col-span-3 text-left flex items-center gap-2">
                      <span className={`text-sm font-black ${isHero1Ahead ? 'text-amber-400' : 'text-slate-300'}`}>
                        {stat.val1.toLocaleString()}{stat.suffix || ''}
                      </span>
                      {isHero1Ahead && (
                        <span className="rounded bg-amber-400/20 text-amber-300 text-[10px] px-1.5 py-0.2 font-bold">
                          +{diff.toLocaleString()}
                        </span>
                      )}
                    </div>

                    {/* Stat Label & Bar comparison */}
                    <div className="col-span-6 text-center">
                      <div className="text-slate-300 font-sans font-medium text-xs mb-1">
                        {stat.label}
                      </div>
                      <div className="flex items-center gap-1 h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-400 transition-all duration-300"
                          style={{
                            width: `${(stat.val1 / (stat.val1 + stat.val2 || 1)) * 100}%`,
                          }}
                        />
                        <div
                          className="h-full bg-cyan-400 transition-all duration-300"
                          style={{
                            width: `${(stat.val2 / (stat.val1 + stat.val2 || 1)) * 100}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Hero 2 Value */}
                    <div className="col-span-3 text-right flex items-center justify-end gap-2">
                      {isHero2Ahead && (
                        <span className="rounded bg-cyan-400/20 text-cyan-300 text-[10px] px-1.5 py-0.2 font-bold">
                          +{Math.abs(diff).toLocaleString()}
                        </span>
                      )}
                      <span className={`text-sm font-black ${isHero2Ahead ? 'text-cyan-400' : 'text-slate-300'}`}>
                        {stat.val2.toLocaleString()}{stat.suffix || ''}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Side-by-Side Skills Breakdown */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-6">
          <div className="rounded-3xl border border-white/10 bg-[#080d16] p-5 sm:p-6 shadow-2xl space-y-5">
            <div className="text-xs font-mono font-bold uppercase text-slate-400 tracking-wider border-b border-white/10 pb-3">
              Perbandingan Kemampuan Skill & Cooldown
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Hero 1 Skills */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-amber-400 font-mono">
                  <span>⚡</span>
                  <span>Skill Set {hero1.name}</span>
                </div>
                {hero1.skills.map((skill, sIdx) => (
                  <div
                    key={skill.id || sIdx}
                    className="rounded-2xl border border-amber-400/20 bg-black/40 p-3.5 flex items-start gap-3"
                  >
                    <div className="relative h-12 w-12 shrink-0 rounded-xl overflow-hidden border border-white/10 bg-slate-900">
                      {skill.icon ? (
                        <img src={skill.icon} alt={skill.name} className="h-full w-full object-cover" />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center text-xs font-bold font-mono">SK</span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-xs font-sans truncate">{skill.name}</span>
                        {skill.cdCost && (
                          <span className="text-[10px] font-mono text-amber-300 bg-amber-400/10 px-1.5 py-0.2 rounded border border-amber-400/20">
                            {skill.cdCost}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {skill.tags?.map((t, tidx) => (
                          <span
                            key={tidx}
                            className="rounded px-1.5 py-0.2 text-[8px] font-mono font-bold"
                            style={{ backgroundColor: `${t.color}25`, color: t.color, borderColor: `${t.color}40`, borderWidth: 1 }}
                          >
                            {t.name}
                          </span>
                        ))}
                      </div>
                      <p className="mt-1 text-[11px] text-slate-400 line-clamp-2 leading-relaxed font-sans">
                        {skill.desc_id?.[0]?.t || skill.desc_en?.[0]?.t || 'Tidak ada deskripsi'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Hero 2 Skills */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-cyan-400 font-mono">
                  <span>⚡</span>
                  <span>Skill Set {hero2.name}</span>
                </div>
                {hero2.skills.map((skill, sIdx) => (
                  <div
                    key={skill.id || sIdx}
                    className="rounded-2xl border border-cyan-400/20 bg-black/40 p-3.5 flex items-start gap-3"
                  >
                    <div className="relative h-12 w-12 shrink-0 rounded-xl overflow-hidden border border-white/10 bg-slate-900">
                      {skill.icon ? (
                        <img src={skill.icon} alt={skill.name} className="h-full w-full object-cover" />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center text-xs font-bold font-mono">SK</span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-xs font-sans truncate">{skill.name}</span>
                        {skill.cdCost && (
                          <span className="text-[10px] font-mono text-cyan-300 bg-cyan-400/10 px-1.5 py-0.2 rounded border border-cyan-400/20">
                            {skill.cdCost}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {skill.tags?.map((t, tidx) => (
                          <span
                            key={tidx}
                            className="rounded px-1.5 py-0.2 text-[8px] font-mono font-bold"
                            style={{ backgroundColor: `${t.color}25`, color: t.color, borderColor: `${t.color}40`, borderWidth: 1 }}
                          >
                            {t.name}
                          </span>
                        ))}
                      </div>
                      <p className="mt-1 text-[11px] text-slate-400 line-clamp-2 leading-relaxed font-sans">
                        {skill.desc_id?.[0]?.t || skill.desc_en?.[0]?.t || 'Tidak ada deskripsi'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Side-by-Side Pro Builds */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-6">
          <div className="rounded-3xl border border-white/10 bg-[#080d16] p-5 sm:p-6 shadow-2xl space-y-5">
            <div className="text-xs font-mono font-bold uppercase text-slate-400 tracking-wider border-b border-white/10 pb-3">
              Perbandingan Pro Tournament Build
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Hero 1 Pro Build */}
              <div className="rounded-2xl border border-amber-400/30 bg-black/40 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-amber-400 uppercase">
                    Build {hero1.name}: {hero1ActiveBuild?.title || 'Meta Pro Build'}
                  </span>
                  <Link
                    href={`/mlbb/heroes/${hero1.slug}`}
                    className="text-[10px] font-mono text-slate-400 hover:text-amber-400"
                  >
                    Buka Halaman Hero →
                  </Link>
                </div>

                <div className="grid grid-cols-6 gap-2">
                  {hero1ActiveBuild?.items?.map((item: any, idx: number) => (
                    <div
                      key={idx}
                      title={item.name}
                      className="group/item relative h-12 rounded-xl overflow-hidden border border-white/10 bg-slate-900 p-1 flex items-center justify-center hover:border-amber-400 transition-colors"
                    >
                      <img src={item.image} alt={item.name} className="h-full w-full object-contain" />
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-3 pt-2 border-t border-white/5 font-mono text-xs">
                  {hero1ActiveBuild?.spell && (
                    <div className="flex items-center gap-1.5">
                      <img src={hero1ActiveBuild.spell.image} alt={hero1ActiveBuild.spell.name} className="h-6 w-6 rounded-md object-contain" />
                      <span className="text-slate-300 text-[11px]">{hero1ActiveBuild.spell.name}</span>
                    </div>
                  )}
                  {hero1ActiveBuild?.emblem && (
                    <div className="flex items-center gap-1.5">
                      <img src={hero1ActiveBuild.emblem.image} alt={hero1ActiveBuild.emblem.name} className="h-6 w-6 rounded-md object-contain" />
                      <span className="text-slate-300 text-[11px]">{hero1ActiveBuild.emblem.name}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Hero 2 Pro Build */}
              <div className="rounded-2xl border border-cyan-400/30 bg-black/40 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-cyan-400 uppercase">
                    Build {hero2.name}: {hero2ActiveBuild?.title || 'Meta Pro Build'}
                  </span>
                  <Link
                    href={`/mlbb/heroes/${hero2.slug}`}
                    className="text-[10px] font-mono text-slate-400 hover:text-cyan-400"
                  >
                    Buka Halaman Hero →
                  </Link>
                </div>

                <div className="grid grid-cols-6 gap-2">
                  {hero2ActiveBuild?.items?.map((item: any, idx: number) => (
                    <div
                      key={idx}
                      title={item.name}
                      className="group/item relative h-12 rounded-xl overflow-hidden border border-white/10 bg-slate-900 p-1 flex items-center justify-center hover:border-cyan-400 transition-colors"
                    >
                      <img src={item.image} alt={item.name} className="h-full w-full object-contain" />
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-3 pt-2 border-t border-white/5 font-mono text-xs">
                  {hero2ActiveBuild?.spell && (
                    <div className="flex items-center gap-1.5">
                      <img src={hero2ActiveBuild.spell.image} alt={hero2ActiveBuild.spell.name} className="h-6 w-6 rounded-md object-contain" />
                      <span className="text-slate-300 text-[11px]">{hero2ActiveBuild.spell.name}</span>
                    </div>
                  )}
                  {hero2ActiveBuild?.emblem && (
                    <div className="flex items-center gap-1.5">
                      <img src={hero2ActiveBuild.emblem.image} alt={hero2ActiveBuild.emblem.name} className="h-6 w-6 rounded-md object-contain" />
                      <span className="text-slate-300 text-[11px]">{hero2ActiveBuild.emblem.name}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Hero Picker Modal */}
      {(isPickingHero1 || isPickingHero2) && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-in fade-in duration-150"
        >
          <div className="relative w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col rounded-3xl border border-white/15 bg-[#080d16] p-6 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2 font-mono text-sm font-bold text-amber-400">
                <span>🔍</span>
                <span>PILIH HERO {isPickingHero1 ? 'PERTAMA' : 'KEDUA'}</span>
              </div>
              <button
                onClick={() => {
                  setIsPickingHero1(false);
                  setIsPickingHero2(false);
                  setSearchPickerQuery('');
                }}
                className="h-8 w-8 rounded-full border border-white/10 bg-white/5 text-slate-400 hover:text-white flex items-center justify-center font-mono"
              >
                ✕
              </button>
            </div>

            {/* Search & Role Filter */}
            <div className="py-4 space-y-3">
              <input
                type="text"
                value={searchPickerQuery}
                onChange={(e) => setSearchPickerQuery(e.target.value)}
                placeholder="Cari nama hero (contoh: Fanny, Ling, Chou, Nolan)..."
                className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
              />

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {['ALL', 'TANK', 'FIGHTER', 'ASSASSIN', 'MAGE', 'MARKSMAN', 'SUPPORT'].map(r => (
                  <button
                    key={r}
                    onClick={() => setRoleFilter(r)}
                    className={`rounded-lg px-2.5 py-1 text-[10px] font-mono font-bold transition-all ${
                      roleFilter === r
                        ? 'bg-amber-400 text-black'
                        : 'bg-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Hero Grid */}
            <div className="flex-1 overflow-y-auto grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5 pr-1">
              {filteredPickerHeroes.map(hero => (
                <button
                  key={hero.id}
                  onClick={() => selectHeroFromModal(hero.slug)}
                  className="group flex flex-col items-center gap-1.5 rounded-2xl border border-white/10 bg-black/40 p-2.5 hover:border-amber-400 hover:bg-amber-400/10 transition-all text-center cursor-pointer"
                >
                  <img
                    src={hero.image}
                    alt={hero.name}
                    className="h-14 w-14 rounded-xl object-cover border border-white/10 group-hover:border-amber-400 transition-colors"
                  />
                  <span className="text-xs font-bold text-white group-hover:text-amber-400 truncate w-full font-sans">
                    {hero.name}
                  </span>
                  <span className="text-[9px] font-mono text-slate-500">
                    {hero.roles[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
