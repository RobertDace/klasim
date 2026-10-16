// src/app/mlbb/builder/page.tsx
'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import {
  heroes as allHeroes,
  items as allItems,
  battleSpells as allSpells,
  emblems as allEmblems,
  type MLBBHero,
  type MLBBItem,
  type MLBBBattleSpell,
  type MLBBEmblem,
} from '@/data/mlbb';

export default function BuildWorkshopPage() {
  // Selected Hero
  const [selectedHeroSlug, setSelectedHeroSlug] = useState<string>('chou');
  const hero = useMemo(() => {
    return allHeroes.find(h => h.slug === selectedHeroSlug) || allHeroes[0];
  }, [selectedHeroSlug]);

  // Selected Equipment (6 slots, default starter setup)
  const [equippedItems, setEquippedItems] = useState<Array<MLBBItem | null>>([
    allItems.find(i => i.slug === 'tough-boots') || null,
    allItems.find(i => i.slug === 'blade-of-the-heptaseas') || null,
    allItems.find(i => i.slug === 'hunter-strike') || null,
    allItems.find(i => i.slug === 'malefic-roar') || null,
    allItems.find(i => i.slug === 'blade-of-despair') || null,
    allItems.find(i => i.slug === 'immortality') || null,
  ]);

  // Selected Spell & Emblem
  const [selectedSpellId, setSelectedSpellId] = useState<string>(allSpells[0]?.id || '');
  const [selectedEmblemId, setSelectedEmblemId] = useState<string>(allEmblems[0]?.id || '');

  const spell = useMemo(() => {
    return allSpells.find(s => s.id === selectedSpellId) || allSpells[0];
  }, [selectedSpellId]);

  const emblem = useMemo(() => {
    return allEmblems.find(e => e.id === selectedEmblemId) || allEmblems[0];
  }, [selectedEmblemId]);

  // Simulation Level (1-15)
  const [level, setLevel] = useState<number>(15);
  const [buildTitle, setBuildTitle] = useState<string>('Tournament High-Impact Build');
  const [copiedSuccess, setCopiedSuccess] = useState<boolean>(false);

  // Modals
  const [isHeroModalOpen, setIsHeroModalOpen] = useState(false);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [activeSlotIndex, setActiveSlotIndex] = useState<number | null>(null);
  const [isSpellModalOpen, setIsSpellModalOpen] = useState(false);
  const [isEmblemModalOpen, setIsEmblemModalOpen] = useState(false);

  // Filter & Search states for modals
  const [heroSearchQuery, setHeroSearchQuery] = useState('');
  const [heroRoleFilter, setHeroRoleFilter] = useState('ALL');
  const [itemSearchQuery, setItemSearchQuery] = useState('');
  const [itemCategoryFilter, setItemCategoryFilter] = useState('ALL');

  // Saved Custom Builds (LocalStorage)
  const [savedBuilds, setSavedBuilds] = useState<Array<{
    id: string;
    title: string;
    heroSlug: string;
    itemSlugs: string[];
    spellId: string;
    emblemId: string;
    savedAt: string;
  }>>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('klasim_mlbb_custom_builds');
      if (stored) {
        setSavedBuilds(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  const saveCurrentBuild = () => {
    const newEntry = {
      id: Date.now().toString(),
      title: buildTitle || `${hero.name} Custom Build`,
      heroSlug: hero.slug,
      itemSlugs: equippedItems.map(i => i?.slug || ''),
      spellId: spell?.id || '',
      emblemId: emblem?.id || '',
      savedAt: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
    };

    const updated = [newEntry, ...savedBuilds.slice(0, 9)];
    setSavedBuilds(updated);
    try {
      localStorage.setItem('klasim_mlbb_custom_builds', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const loadSavedBuild = (b: typeof savedBuilds[0]) => {
    setSelectedHeroSlug(b.heroSlug);
    setBuildTitle(b.title);
    setSelectedSpellId(b.spellId);
    setSelectedEmblemId(b.emblemId);

    const itemsFromSlugs = b.itemSlugs.map(slug => allItems.find(i => i.slug === slug) || null);
    setEquippedItems(itemsFromSlugs);
  };

  const deleteSavedBuild = (id: string) => {
    const updated = savedBuilds.filter(b => b.id !== id);
    setSavedBuilds(updated);
    try {
      localStorage.setItem('klasim_mlbb_custom_builds', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  // Item slot assignment
  const handleAssignItem = (item: MLBBItem) => {
    if (activeSlotIndex !== null) {
      const next = [...equippedItems];
      next[activeSlotIndex] = item;
      setEquippedItems(next);
      setActiveSlotIndex(null);
      setIsItemModalOpen(false);
      setItemSearchQuery('');
    }
  };

  const handleRemoveItem = (index: number) => {
    const next = [...equippedItems];
    next[index] = null;
    setEquippedItems(next);
  };

  // Base Combat stats + Equipment stats calculation
  const calculatedStats = useMemo(() => {
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

    const rawAtkSpeed = 1.0 + (level - 1) * 0.02;

    // Aggregate stats from items
    let itemCost = 0;
    let itemHp = 0;
    let itemPhyAtk = 0;
    let itemMagPower = 0;
    let itemPhyDef = 0;
    let itemMagDef = 0;
    let itemAtkSpeedBonus = 0;
    let itemCdr = 0;
    let itemCrit = 0;
    let itemLifesteal = 0;
    let itemMovement = 0;
    let itemPenetration = 0;

    equippedItems.forEach(item => {
      if (!item) return;
      itemCost += item.price || 0;
      const stats = item.stats || {};

      Object.entries(stats).forEach(([k, val]) => {
        const key = k.toLowerCase().trim();
        let numVal = 0;
        if (typeof val === 'number') numVal = val;
        else if (typeof val === 'string') {
          numVal = parseFloat(val.replace('*', '').replace('+', '')) || 0;
        }

        if (key.includes('physical') && key.includes('attack')) itemPhyAtk += numVal;
        else if (key === 'adaptive_attack') itemPhyAtk += numVal;
        else if (key.includes('magic_power') || key === 'magic power') itemMagPower += numVal;
        else if (key === 'hp') itemHp += numVal;
        else if (key.includes('physical_defense') || key === 'physical defense') itemPhyDef += numVal;
        else if (key.includes('magic_defense') || key === 'magic defense') itemMagDef += numVal;
        else if (key.includes('attack_speed') || key === 'attack speed') {
          itemAtkSpeedBonus += numVal < 1 ? numVal : numVal / 100;
        } else if (key.includes('cooldown') || key.includes('cd')) {
          itemCdr += numVal < 1 ? Math.round(numVal * 100) : numVal;
        } else if (key.includes('crit')) {
          itemCrit += numVal < 1 ? Math.round(numVal * 100) : numVal;
        } else if (key.includes('lifesteal') || key.includes('vamp')) {
          itemLifesteal += numVal < 1 ? Math.round(numVal * 100) : numVal;
        } else if (key.includes('movement')) {
          itemMovement += numVal;
        } else if (key.includes('penetration')) {
          itemPenetration += numVal;
        }
      });
    });

    // Emblem Bonuses
    if (emblem?.attributes) {
      if (emblem.attributes.adaptive_attack) itemPhyAtk += Number(emblem.attributes.adaptive_attack) || 0;
      if (emblem.attributes.adaptive_penetration) itemPenetration += Number(emblem.attributes.adaptive_penetration) || 0;
    }

    const cappedCdr = Math.min(itemCdr, 40); // MLBB cap is 40% CDR

    return {
      totalCost: itemCost,
      finalHp: rawHp + itemHp,
      finalPhyAtk: Math.round(rawAtk + itemPhyAtk),
      finalMagPower: Math.round(itemMagPower),
      finalPhyDef: rawPhyDef + itemPhyDef,
      finalMagDef: rawMagDef + itemMagDef,
      finalAtkSpeed: (rawAtkSpeed * (1 + itemAtkSpeedBonus)).toFixed(2),
      finalCdr: cappedCdr,
      finalCrit: itemCrit,
      finalLifesteal: itemLifesteal,
      finalMovement: 240 + itemMovement,
      finalPenetration: itemPenetration,
    };
  }, [hero, level, equippedItems, emblem]);

  // Aggregate Passives & check duplicate passives
  const uniquePassives = useMemo(() => {
    const list: Array<{ itemName: string; passive: string }> = [];
    equippedItems.forEach(item => {
      if (item && item.passive_description) {
        list.push({ itemName: item.name, passive: item.passive_description });
      }
    });
    return list;
  }, [equippedItems]);

  const copyBuildSummary = () => {
    const itemList = equippedItems.filter(Boolean).map(i => i!.name).join(', ');
    const text = `🎮 KLASIM MLBB PRO BUILD\nHero: ${hero.name}\nBuild: ${buildTitle}\nItems: ${itemList}\nSpell: ${spell.name}\nEmblem: ${emblem.name}\nTotal Cost: ${calculatedStats.totalCost.toLocaleString()} Gold\nCombat Stats (Lv.${level}): HP ${calculatedStats.finalHp.toLocaleString()} | ATK ${calculatedStats.finalPhyAtk} | DEF ${calculatedStats.finalPhyDef}/${calculatedStats.finalMagDef} | CDR ${calculatedStats.finalCdr}%\nRacik di Klasim: https://klasim.com/mlbb/builder`;
    navigator.clipboard.writeText(text);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2500);
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
                  <span>INTERACTIVE EQUIPMENT & EMBLEM WORKSHOP</span>
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white font-sans uppercase">
                  CUSTOM BUILD <span className="text-amber-400">CREATOR</span>
                </h1>
                <p className="mt-2 max-w-2xl text-xs sm:text-sm text-slate-400 font-sans">
                  Racik kombinasi 6 equipment item, battle spell, dan custom emblem. Kalkulasi akumulasi atribut tempur dan efek pasif unik secara real-time pada Level 1–15.
                </p>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                <button
                  onClick={copyBuildSummary}
                  className="rounded-xl border border-amber-400/40 bg-amber-400/10 px-4 py-2.5 font-bold text-amber-400 hover:bg-amber-400 hover:text-black transition-all flex items-center gap-2 cursor-pointer shadow-lg"
                >
                  <span>{copiedSuccess ? '✓' : '📋'}</span>
                  <span>{copiedSuccess ? 'Tersalin!' : 'Salin Ringkasan Build'}</span>
                </button>
                <button
                  onClick={saveCurrentBuild}
                  className="rounded-xl bg-amber-400 px-4 py-2.5 font-bold text-black hover:bg-amber-300 transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-400/20"
                >
                  <span>💾</span>
                  <span>Simpan Build</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Main Workshop Grid */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 8 Cols: Workshop Canvas (Hero, 6 Slots, Spell, Emblem) */}
            <div className="lg:col-span-8 space-y-6">
              {/* Build Meta Title Input & Hero Bar */}
              <div className="rounded-3xl border border-white/10 bg-[#080d16] p-5 sm:p-6 shadow-2xl space-y-4">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <input
                    type="text"
                    value={buildTitle}
                    onChange={(e) => setBuildTitle(e.target.value)}
                    placeholder="Beri nama racikan build ini..."
                    className="flex-1 rounded-xl border border-white/10 bg-black/60 px-4 py-2 text-sm font-bold text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none font-sans"
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-slate-400">Total Biaya:</span>
                    <span className="rounded-lg bg-amber-400/10 border border-amber-400/30 px-2.5 py-1 text-xs font-black font-mono text-amber-400">
                      💰 {calculatedStats.totalCost.toLocaleString()} Gold
                    </span>
                  </div>
                </div>

                {/* Hero Selection Header */}
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/40 p-4">
                  <div className="flex items-center gap-4">
                    <div className="relative h-16 w-16 shrink-0 rounded-2xl overflow-hidden border-2 border-amber-400/60 shadow-xl bg-black">
                      <img src={hero.image} alt={hero.name} className="h-full w-full object-cover" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-black text-white font-sans">{hero.name}</h3>
                        <span className="rounded bg-amber-400/20 text-amber-300 text-[10px] font-mono font-bold px-2 py-0.5">
                          {hero.roles.join(' / ')}
                        </span>
                      </div>
                      <div className="text-xs font-mono text-slate-400 mt-1">
                        Lane Utama: {hero.lane.join(', ')} • Durability: {hero.stats.durability}/100 • Offense: {hero.stats.offense}/100
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsHeroModalOpen(true)}
                    className="rounded-xl border border-amber-400/40 bg-amber-400/10 px-3.5 py-2 text-xs font-mono font-bold text-amber-400 hover:bg-amber-400 hover:text-black transition-all cursor-pointer whitespace-nowrap"
                  >
                    Ganti Hero ↗
                  </button>
                </div>
              </div>

              {/* 6 Equipment Slots */}
              <div className="rounded-3xl border border-white/10 bg-[#080d16] p-5 sm:p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="text-xs font-mono font-bold uppercase text-slate-400 tracking-wider">
                    Equipment Slots (6 Items)
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">Klik slot untuk mengganti item</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                  {equippedItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="group relative flex flex-col items-center justify-between rounded-2xl border border-white/10 bg-black/50 p-3 hover:border-amber-400/60 transition-all min-h-[140px]"
                    >
                      {/* Slot Number */}
                      <span className="absolute top-2 left-2 text-[9px] font-mono text-slate-500 font-bold">
                        #{idx + 1}
                      </span>

                      {/* Remove Button if equipped */}
                      {item && (
                        <button
                          onClick={() => handleRemoveItem(idx)}
                          title="Hapus item dari slot"
                          className="absolute top-2 right-2 text-slate-500 hover:text-rose-400 text-xs px-1"
                        >
                          ✕
                        </button>
                      )}

                      {/* Item Visual */}
                      <div
                        onClick={() => {
                          setActiveSlotIndex(idx);
                          setIsItemModalOpen(true);
                        }}
                        className="mt-4 flex flex-col items-center gap-2 cursor-pointer w-full text-center"
                      >
                        {item ? (
                          <div className="relative h-14 w-14 rounded-xl overflow-hidden border border-amber-400/40 bg-slate-900 p-1 group-hover:scale-105 transition-transform">
                            <img src={item.image} alt={item.name} className="h-full w-full object-contain" />
                          </div>
                        ) : (
                          <div className="h-14 w-14 rounded-xl border-2 border-dashed border-white/20 flex items-center justify-center text-slate-600 hover:border-amber-400 hover:text-amber-400 transition-colors">
                            <span className="text-2xl">+</span>
                          </div>
                        )}

                        <div className="w-full">
                          <div className="text-xs font-bold text-white truncate font-sans">
                            {item ? item.name : 'Kosong'}
                          </div>
                          <div className="text-[10px] font-mono text-amber-400 mt-0.5">
                            {item ? `${item.price}g` : 'Pilih Item'}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Spell & Emblem Slots */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Battle Spell */}
                <div className="rounded-3xl border border-white/10 bg-[#080d16] p-5 shadow-2xl flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="relative h-14 w-14 shrink-0 rounded-2xl overflow-hidden border border-white/15 bg-black p-1 shadow-lg">
                      <img src={spell.image} alt={spell.name} className="h-full w-full object-contain" />
                    </div>
                    <div>
                      <span className="text-[9px] font-mono uppercase text-slate-400 font-bold">BATTLE SPELL</span>
                      <h4 className="text-base font-bold text-white font-sans">{spell.name}</h4>
                      <span className="text-[10px] font-mono text-amber-400">CD: {spell.cooldown}s</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsSpellModalOpen(true)}
                    className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-mono text-slate-300 hover:border-amber-400 hover:text-amber-400 transition-all cursor-pointer whitespace-nowrap"
                  >
                    Ganti Spell ↗
                  </button>
                </div>

                {/* Custom Emblem */}
                <div className="rounded-3xl border border-white/10 bg-[#080d16] p-5 shadow-2xl flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="relative h-14 w-14 shrink-0 rounded-2xl overflow-hidden border border-white/15 bg-black p-1 shadow-lg">
                      <img src={emblem.image} alt={emblem.name} className="h-full w-full object-contain" />
                    </div>
                    <div>
                      <span className="text-[9px] font-mono uppercase text-slate-400 font-bold">CUSTOM EMBLEM</span>
                      <h4 className="text-base font-bold text-white font-sans">{emblem.name}</h4>
                      <span className="text-[10px] font-mono text-emerald-400">Adaptive Attributes Active</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsEmblemModalOpen(true)}
                    className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-mono text-slate-300 hover:border-amber-400 hover:text-amber-400 transition-all cursor-pointer whitespace-nowrap"
                  >
                    Ganti Emblem ↗
                  </button>
                </div>
              </div>

              {/* Active Unique Passives Box */}
              <div className="rounded-3xl border border-white/10 bg-[#080d16] p-5 sm:p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-amber-400">
                    <span>⚡</span>
                    <span>Efek Pasif Unik Aktif ({uniquePassives.length})</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">Agregasi Efek Equipment</span>
                </div>

                <div className="space-y-2.5">
                  {uniquePassives.length === 0 ? (
                    <div className="text-xs text-slate-500 italic font-mono py-2">
                      Belum ada item dengan pasif unik yang dipasang.
                    </div>
                  ) : (
                    uniquePassives.map((p, idx) => (
                      <div
                        key={idx}
                        className="rounded-2xl border border-white/5 bg-black/40 p-3.5 text-xs font-sans space-y-1"
                      >
                        <div className="font-bold text-amber-300 font-mono flex items-center gap-1.5">
                          <span>📦</span>
                          <span>{p.itemName}</span>
                        </div>
                        <p className="text-slate-300 text-xs leading-relaxed whitespace-pre-line">
                          {p.passive}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Right 4 Cols: Live Combat Stats Telemetry */}
            <div className="lg:col-span-4 space-y-6">
              {/* Level Controller Widget */}
              <div className="rounded-3xl border border-white/10 bg-[#080d16] p-5 shadow-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-400 uppercase">
                    Level Hero Simulator
                  </span>
                  <span className="rounded bg-amber-400/20 border border-amber-400/40 px-2.5 py-0.5 text-xs font-black font-mono text-amber-400">
                    LEVEL {level}
                  </span>
                </div>

                <input
                  type="range"
                  min="1"
                  max="15"
                  value={level}
                  onChange={(e) => setLevel(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />

                <div className="flex justify-between font-mono text-[9px] text-slate-500">
                  <span>Lv.1 Early</span>
                  <span>Lv.4 Ult</span>
                  <span>Lv.9 Mid</span>
                  <span>Lv.15 Late</span>
                </div>
              </div>

              {/* Calculated Stats Matrix */}
              <div className="rounded-3xl border border-amber-400/30 bg-gradient-to-b from-[#0e1422] to-[#080d16] p-5 sm:p-6 shadow-2xl space-y-4">
                <div className="text-xs font-mono font-bold uppercase text-amber-400 tracking-wider border-b border-white/10 pb-3 flex items-center justify-between">
                  <span>Statistik Tempur Akhir</span>
                  <span className="text-slate-500 text-[10px]">LIVE TELEMETRY</span>
                </div>

                <div className="space-y-2.5 font-mono text-xs">
                  <div className="flex items-center justify-between rounded-xl bg-black/40 border border-white/5 p-2.5">
                    <span className="text-slate-400">Total Max HP</span>
                    <span className="font-bold text-emerald-400">{calculatedStats.finalHp.toLocaleString()}</span>
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-black/40 border border-white/5 p-2.5">
                    <span className="text-slate-400">Physical Attack</span>
                    <span className="font-bold text-rose-400">+{calculatedStats.finalPhyAtk}</span>
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-black/40 border border-white/5 p-2.5">
                    <span className="text-slate-400">Magic Power</span>
                    <span className="font-bold text-purple-400">+{calculatedStats.finalMagPower}</span>
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-black/40 border border-white/5 p-2.5">
                    <span className="text-slate-400">Physical Defense</span>
                    <span className="font-bold text-cyan-400">{calculatedStats.finalPhyDef}</span>
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-black/40 border border-white/5 p-2.5">
                    <span className="text-slate-400">Magic Defense</span>
                    <span className="font-bold text-cyan-400">{calculatedStats.finalMagDef}</span>
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-black/40 border border-white/5 p-2.5">
                    <span className="text-slate-400">Attack Speed</span>
                    <span className="font-bold text-amber-400">{calculatedStats.finalAtkSpeed} /s</span>
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-black/40 border border-white/5 p-2.5">
                    <span className="text-slate-400">Cooldown Reduction</span>
                    <span className="font-bold text-amber-400">{calculatedStats.finalCdr}% (Cap 40%)</span>
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-black/40 border border-white/5 p-2.5">
                    <span className="text-slate-400">Critical Chance</span>
                    <span className="font-bold text-amber-400">{calculatedStats.finalCrit}%</span>
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-black/40 border border-white/5 p-2.5">
                    <span className="text-slate-400">Lifesteal / Vamp</span>
                    <span className="font-bold text-emerald-400">{calculatedStats.finalLifesteal}%</span>
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-black/40 border border-white/5 p-2.5">
                    <span className="text-slate-400">Penetration (PEN)</span>
                    <span className="font-bold text-amber-400">+{calculatedStats.finalPenetration}</span>
                  </div>
                </div>
              </div>

              {/* Saved Builds Shelf */}
              <div className="rounded-3xl border border-white/10 bg-[#080d16] p-5 shadow-2xl space-y-4">
                <div className="text-xs font-mono font-bold uppercase text-slate-400 tracking-wider border-b border-white/10 pb-3 flex items-center justify-between">
                  <span>Koleksi Build Tersimpan ({savedBuilds.length})</span>
                  <span className="text-[10px] text-slate-500 font-mono">LOCAL STORAGE</span>
                </div>

                <div className="space-y-2">
                  {savedBuilds.length === 0 ? (
                    <div className="text-xs text-slate-500 italic font-mono py-2 text-center">
                      Belum ada build yang disimpan. Klik tombol &ldquo;Simpan Build&rdquo; di atas untuk menyimpan.
                    </div>
                  ) : (
                    savedBuilds.map((b) => (
                      <div
                        key={b.id}
                        className="rounded-2xl border border-white/5 bg-black/40 p-3 flex items-center justify-between gap-3 hover:border-amber-400/40 transition-colors"
                      >
                        <div
                          onClick={() => loadSavedBuild(b)}
                          className="min-w-0 flex-1 cursor-pointer"
                        >
                          <div className="text-xs font-bold text-white truncate font-sans hover:text-amber-400">
                            {b.title}
                          </div>
                          <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                            {b.heroSlug.toUpperCase()} • {b.savedAt}
                          </div>
                        </div>

                        <button
                          onClick={() => deleteSavedBuild(b.id)}
                          className="text-slate-500 hover:text-rose-400 text-xs px-2 py-1"
                        >
                          ✕
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Hero Selector Modal */}
      {isHeroModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-in fade-in duration-150"
        >
          <div className="relative w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col rounded-3xl border border-white/15 bg-[#080d16] p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="font-mono text-sm font-bold text-amber-400">
                PILIH HERO UNTUK WORKSHOP BUILD
              </div>
              <button
                onClick={() => setIsHeroModalOpen(false)}
                className="h-8 w-8 rounded-full border border-white/10 bg-white/5 text-slate-400 hover:text-white flex items-center justify-center font-mono"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-3">
              <input
                type="text"
                value={heroSearchQuery}
                onChange={(e) => setHeroSearchQuery(e.target.value)}
                placeholder="Cari nama hero (contoh: Chou, Fanny, Xavier, Hayabusa)..."
                className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
              />

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {['ALL', 'TANK', 'FIGHTER', 'ASSASSIN', 'MAGE', 'MARKSMAN', 'SUPPORT'].map(r => (
                  <button
                    key={r}
                    onClick={() => setHeroRoleFilter(r)}
                    className={`rounded-lg px-2.5 py-1 text-[10px] font-mono font-bold transition-all ${
                      heroRoleFilter === r ? 'bg-amber-400 text-black' : 'bg-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5 pr-1">
              {allHeroes
                .filter(h => {
                  if (heroRoleFilter !== 'ALL' && !h.roles.some(r => r.toUpperCase() === heroRoleFilter)) return false;
                  if (heroSearchQuery.trim()) {
                    const q = heroSearchQuery.toLowerCase();
                    return h.name.toLowerCase().includes(q) || h.roles.some(r => r.toLowerCase().includes(q));
                  }
                  return true;
                })
                .map(h => (
                  <button
                    key={h.id}
                    onClick={() => {
                      setSelectedHeroSlug(h.slug);
                      setIsHeroModalOpen(false);
                      setHeroSearchQuery('');
                    }}
                    className="group flex flex-col items-center gap-1.5 rounded-2xl border border-white/10 bg-black/40 p-2.5 hover:border-amber-400 hover:bg-amber-400/10 transition-all text-center cursor-pointer"
                  >
                    <img src={h.image} alt={h.name} className="h-14 w-14 rounded-xl object-cover border border-white/10 group-hover:border-amber-400 transition-colors" />
                    <span className="text-xs font-bold text-white group-hover:text-amber-400 truncate w-full font-sans">
                      {h.name}
                    </span>
                    <span className="text-[9px] font-mono text-slate-500">{h.roles[0]}</span>
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Equipment Item Picker Modal */}
      {isItemModalOpen && activeSlotIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-in fade-in duration-150"
        >
          <div className="relative w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col rounded-3xl border border-white/15 bg-[#080d16] p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="font-mono text-sm font-bold text-amber-400">
                PILIH EQUIPMENT UNTUK SLOT #{activeSlotIndex + 1}
              </div>
              <button
                onClick={() => {
                  setIsItemModalOpen(false);
                  setActiveSlotIndex(null);
                  setItemSearchQuery('');
                }}
                className="h-8 w-8 rounded-full border border-white/10 bg-white/5 text-slate-400 hover:text-white flex items-center justify-center font-mono"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-3">
              <input
                type="text"
                value={itemSearchQuery}
                onChange={(e) => setItemSearchQuery(e.target.value)}
                placeholder="Cari item equipment atau efek pasif..."
                className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
              />

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {['ALL', 'ATTACK', 'MAGIC', 'DEFENSE', 'MOVEMENT'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setItemCategoryFilter(cat)}
                    className={`rounded-lg px-2.5 py-1 text-[10px] font-mono font-bold transition-all ${
                      itemCategoryFilter === cat ? 'bg-amber-400 text-black' : 'bg-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pr-1">
              {allItems
                .filter(it => {
                  if (itemCategoryFilter !== 'ALL' && it.type.toUpperCase() !== itemCategoryFilter) return false;
                  if (itemSearchQuery.trim()) {
                    const q = itemSearchQuery.toLowerCase();
                    return it.name.toLowerCase().includes(q) || (it.passive_description && it.passive_description.toLowerCase().includes(q));
                  }
                  return true;
                })
                .map(it => (
                  <button
                    key={it.id}
                    onClick={() => handleAssignItem(it)}
                    className="group flex flex-col justify-between rounded-2xl border border-white/10 bg-black/40 p-3 hover:border-amber-400 hover:bg-amber-400/10 transition-all text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <img src={it.image} alt={it.name} className="h-10 w-10 rounded-lg object-contain border border-white/10 p-0.5 bg-slate-900" />
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white group-hover:text-amber-400 truncate font-sans">
                          {it.name}
                        </div>
                        <div className="text-[10px] font-mono text-amber-400">
                          💰 {it.price?.toLocaleString()}g
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Battle Spell Modal */}
      {isSpellModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-in fade-in duration-150"
        >
          <div className="relative w-full max-w-xl max-h-[85vh] overflow-hidden flex flex-col rounded-3xl border border-white/15 bg-[#080d16] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="font-mono text-sm font-bold text-amber-400">
                PILIH BATTLE SPELL
              </div>
              <button
                onClick={() => setIsSpellModalOpen(false)}
                className="h-8 w-8 rounded-full border border-white/10 bg-white/5 text-slate-400 hover:text-white flex items-center justify-center font-mono"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-3 pr-1">
              {allSpells.map(s => (
                <button
                  key={s.id}
                  onClick={() => {
                    setSelectedSpellId(s.id);
                    setIsSpellModalOpen(false);
                  }}
                  className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-black/40 p-3 hover:border-amber-400 hover:bg-amber-400/10 transition-all text-left cursor-pointer"
                >
                  <img src={s.image} alt={s.name} className="h-10 w-10 rounded-xl object-contain border border-white/10 bg-black p-0.5" />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white group-hover:text-amber-400 truncate font-sans">
                      {s.name}
                    </div>
                    <div className="text-[10px] font-mono text-slate-400">
                      CD: {s.cooldown}s
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Emblem Modal */}
      {isEmblemModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-in fade-in duration-150"
        >
          <div className="relative w-full max-w-xl max-h-[85vh] overflow-hidden flex flex-col rounded-3xl border border-white/15 bg-[#080d16] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="font-mono text-sm font-bold text-amber-400">
                PILIH CUSTOM EMBLEM
              </div>
              <button
                onClick={() => setIsEmblemModalOpen(false)}
                className="h-8 w-8 rounded-full border border-white/10 bg-white/5 text-slate-400 hover:text-white flex items-center justify-center font-mono"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-3 pr-1">
              {allEmblems.map(e => (
                <button
                  key={e.id}
                  onClick={() => {
                    setSelectedEmblemId(e.id);
                    setIsEmblemModalOpen(false);
                  }}
                  className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-black/40 p-3 hover:border-amber-400 hover:bg-amber-400/10 transition-all text-left cursor-pointer"
                >
                  <img src={e.image} alt={e.name} className="h-10 w-10 rounded-xl object-contain border border-white/10 bg-black p-0.5" />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white group-hover:text-amber-400 truncate font-sans">
                      {e.name}
                    </div>
                    <div className="text-[10px] font-mono text-emerald-400">
                      Emblem Set
                    </div>
                  </div>
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
