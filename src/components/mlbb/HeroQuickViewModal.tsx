// src/components/mlbb/HeroQuickViewModal.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { MLBBHero, MLBBTierStat, MLBBHeroRelation } from '@/data/mlbb';

interface HeroQuickViewModalProps {
  hero: MLBBHero | null;
  tierStat?: MLBBTierStat;
  relation?: MLBBHeroRelation;
  onClose: () => void;
  onSelectHeroByName?: (name: string) => void;
}

export default function HeroQuickViewModal({
  hero,
  tierStat,
  relation,
  onClose,
  onSelectHeroByName,
}: HeroQuickViewModalProps) {
  const [activeSkillIndex, setActiveSkillIndex] = useState(0);

  // Reset active skill index when hero changes
  useEffect(() => {
    setActiveSkillIndex(0);
  }, [hero?.id]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!hero) return null;

  const currentSkill = hero.skills[activeSkillIndex] || hero.skills[0];

  const renderDescription = (descList: Array<{ t?: string; c?: string }>) => {
    if (!descList || descList.length === 0) return 'Tidak ada deskripsi.';
    return descList.map((part, idx) => (
      <span key={idx} style={{ color: part.c || 'inherit' }}>
        {part.t || ''}
      </span>
    ));
  };

  const statBars = [
    { label: 'DURABILITY', val: hero.stats.durability, color: 'bg-blue-400' },
    { label: 'OFFENSE', val: hero.stats.offense, color: 'bg-rose-400' },
    { label: 'SKILL EFFECTS', val: hero.stats.ability, color: 'bg-cyan-400' },
    { label: 'DIFFICULTY', val: hero.stats.difficulty, color: 'bg-amber-400' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 select-none">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
      />

      {/* Modal Dialog Shell */}
      <div className="relative z-10 flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#080c16] shadow-2xl shadow-black/80 animate-in zoom-in-95 duration-200">
        {/* Top Header Rail */}
        <div className="flex items-center justify-between border-b border-white/10 bg-black/40 px-4 py-2.5 sm:px-6 font-mono text-[10px]">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-slate-400">HERO TELEMETRY //</span>
            <span className="font-bold text-amber-400 uppercase tracking-widest">{hero.name}</span>
            <span className="text-slate-600">· #{hero.moonton_hero_id}</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/mlbb/heroes/${hero.slug}`}
              className="text-slate-400 hover:text-amber-400 transition-colors uppercase tracking-wider flex items-center gap-1"
            >
              <span>BUKA HALAMAN PENUH</span>
              <span>↗</span>
            </Link>
            <span className="text-slate-700">|</span>
            <button
              onClick={onClose}
              className="rounded p-1 text-slate-400 hover:bg-white/10 hover:text-white transition-all cursor-pointer font-bold"
              aria-label="Tutup"
            >
              ✕ ESC
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Hero Profile Main Header Block */}
          <div className="flex flex-col sm:flex-row gap-5 items-start">
            {/* Hero Image Avatar with Tier Ribbon */}
            <div className="relative h-28 w-28 sm:h-36 sm:w-36 shrink-0 overflow-hidden rounded-xl border border-white/15 bg-black shadow-lg">
              <img
                src={hero.image}
                alt={hero.name}
                className="h-full w-full object-cover object-top"
              />
              {tierStat?.tier && (
                <div className="absolute top-2 right-2 rounded bg-amber-400 px-1.5 py-0.5 font-mono text-[9px] font-black text-black shadow">
                  TIER {tierStat.tier}
                </div>
              )}
            </div>

            {/* Title, Lore & Meta Info */}
            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-sans text-2xl sm:text-3xl font-black uppercase tracking-wide text-white">
                  {hero.name}
                </h2>
                {hero.roles.map(r => (
                  <span
                    key={r}
                    className="rounded-md border border-white/15 bg-white/5 px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-slate-300"
                  >
                    {r}
                  </span>
                ))}
                {hero.lane.map(l => (
                  <span
                    key={l}
                    className="rounded-md border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 font-mono text-[10px] font-bold text-amber-300"
                  >
                    {l}
                  </span>
                ))}
              </div>

              <p className="font-mono text-xs text-amber-400 font-semibold">
                "{hero.title}"
              </p>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                {hero.lore.id || hero.lore.en || 'Ksatria Land of Dawn dengan kekuatan istimewa.'}
              </p>

              {hero.speciality.length > 0 && (
                <div className="flex items-center gap-1.5 pt-1">
                  <span className="font-mono text-[10px] text-slate-500 uppercase">SPESIALISASI:</span>
                  <span className="font-mono text-[11px] font-bold text-slate-300">
                    {hero.speciality.join(', ')}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Grid Split: Attribute Bars & Rank Winrate/Banrate */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Attribute Radar / Progress Bars */}
            <div className="rounded-xl border border-white/10 bg-slate-950/60 p-4 space-y-2.5">
              <span className="block font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-white/10 pb-1.5">
                STATISTIK DASAR HERO
              </span>
              <div className="space-y-2 pt-1">
                {statBars.map(st => (
                  <div key={st.label}>
                    <div className="flex items-center justify-between font-mono text-[10px] mb-1">
                      <span className="text-slate-400">{st.label}</span>
                      <span className="font-bold text-white">{st.val}%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                      <div
                        className={`h-full ${st.color} rounded-full transition-all duration-500`}
                        style={{ width: `${Math.min(100, Math.max(5, st.val))}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Meta Statistics Telemetry */}
            <div className="rounded-xl border border-white/10 bg-slate-950/60 p-4 flex flex-col justify-between">
              <div>
                <span className="block font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-white/10 pb-1.5">
                  TELEMETRI RANK & TURNAMEN
                </span>
                <div className="grid grid-cols-3 gap-3 pt-3 text-center">
                  <div className="rounded-lg bg-white/5 p-2 border border-white/5">
                    <span className="block font-mono text-[9px] text-slate-400">WIN RATE</span>
                    <span className="font-mono text-sm sm:text-base font-black text-emerald-400">
                      {tierStat ? (tierStat.win_rate * 100).toFixed(1) + '%' : '50.2%'}
                    </span>
                  </div>
                  <div className="rounded-lg bg-white/5 p-2 border border-white/5">
                    <span className="block font-mono text-[9px] text-slate-400">PICK RATE</span>
                    <span className="font-mono text-sm sm:text-base font-black text-slate-200">
                      {tierStat ? (tierStat.pick_rate * 100).toFixed(2) + '%' : '1.20%'}
                    </span>
                  </div>
                  <div className="rounded-lg bg-white/5 p-2 border border-white/5">
                    <span className="block font-mono text-[9px] text-slate-400">BAN RATE</span>
                    <span className="font-mono text-sm sm:text-base font-black text-rose-400">
                      {tierStat ? (tierStat.ban_rate * 100).toFixed(1) + '%' : '12.5%'}
                    </span>
                  </div>
                </div>
              </div>

              {hero.skill_order && (
                <div className="mt-3 flex items-center justify-between rounded bg-amber-400/10 px-3 py-1.5 border border-amber-400/20 font-mono text-[10px]">
                  <span className="text-amber-300 font-semibold">REKOMENDASI PRIORITAS SKILL:</span>
                  <span className="font-black text-amber-400">{String(hero.skill_order)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Interactive Skill Showcase */}
          {hero.skills.length > 0 && (
            <div className="rounded-xl border border-white/10 bg-slate-950/80 p-4 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-amber-400">
                  SKILL ARCHIVE // {hero.skills.length} KEMAMPUAN
                </span>
                <span className="font-mono text-[9px] text-slate-500">
                  KLIK IKON UNTUK DETAIL SKILL
                </span>
              </div>

              {/* Skill Tabs */}
              <div className="flex flex-wrap items-center gap-2">
                {hero.skills.map((s, idx) => {
                  const isSelected = idx === activeSkillIndex;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setActiveSkillIndex(idx)}
                      className={`group flex items-center gap-2 rounded-xl border p-1.5 pr-3 text-left transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? 'border-amber-400 bg-amber-400/15 shadow-md shadow-amber-500/10'
                          : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                      }`}
                    >
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-black/60">
                        {s.icon ? (
                          <img
                            src={s.icon}
                            alt={s.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center font-mono text-xs text-amber-400">
                            {idx === 0 ? 'P' : idx}
                          </div>
                        )}
                        <span className="absolute bottom-0.5 right-0.5 rounded bg-black/80 px-1 font-mono text-[8px] font-bold text-amber-300">
                          {idx === 0 ? 'P' : `S${idx}`}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <span className={`block font-sans text-xs font-bold truncate ${isSelected ? 'text-amber-300' : 'text-slate-300'}`}>
                          {s.name}
                        </span>
                        <span className="block font-mono text-[9px] text-slate-500">
                          {idx === 0 ? 'Pasif' : `Skill ${idx}`}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Selected Skill Detail Body */}
              {currentSkill && (
                <div className="rounded-lg border border-white/5 bg-black/50 p-4 space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-sans text-sm font-bold text-white">
                        {currentSkill.name}
                      </span>
                      {currentSkill.tags.map(t => (
                        <span
                          key={t.name}
                          style={{ borderColor: `${t.color}40`, backgroundColor: `${t.color}15`, color: t.color }}
                          className="rounded border px-1.5 py-0.2 font-mono text-[9px] font-bold"
                        >
                          {t.name}
                        </span>
                      ))}
                    </div>

                    {currentSkill.cdCost && (
                      <span className="font-mono text-[10px] font-semibold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                        {currentSkill.cdCost}
                      </span>
                    )}
                  </div>

                  <div className="font-sans text-xs leading-relaxed text-slate-300 whitespace-pre-line">
                    {renderDescription(currentSkill.desc_id.length > 0 ? currentSkill.desc_id : currentSkill.desc_en)}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Counter Picks & Synergies Matrix */}
          {relation && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Counters */}
              <div className="rounded-xl border border-rose-500/20 bg-rose-950/15 p-4 space-y-2">
                <span className="block font-mono text-[10px] font-bold uppercase tracking-wider text-rose-400 border-b border-rose-500/20 pb-1">
                  🛡️ COUNTER HERO (LEMAH LAWAN)
                </span>
                <div className="flex flex-wrap gap-2 pt-1">
                  {relation.counters && relation.counters.length > 0 ? (
                    relation.counters.map((c: any) => (
                      <button
                        key={c.name}
                        onClick={() => onSelectHeroByName && onSelectHeroByName(c.name)}
                        className="group flex items-center gap-1.5 rounded-lg border border-white/10 bg-black/60 px-2 py-1 text-left transition-all hover:border-rose-400/50 hover:bg-rose-950/30 cursor-pointer"
                      >
                        <img
                          src={c.icon}
                          alt={c.name}
                          className="h-6 w-6 rounded object-cover"
                        />
                        <span className="font-sans text-[11px] font-bold text-slate-200 group-hover:text-rose-300">
                          {c.name}
                        </span>
                      </button>
                    ))
                  ) : (
                    <span className="font-mono text-xs text-slate-500">Data counter tidak tersedia</span>
                  )}
                </div>
              </div>

              {/* Synergies */}
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/15 p-4 space-y-2">
                <span className="block font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-400 border-b border-emerald-500/20 pb-1">
                  🤝 SINERGI COMBO TERBAIK
                </span>
                <div className="flex flex-wrap gap-2 pt-1">
                  {relation.synergies && relation.synergies.length > 0 ? (
                    relation.synergies.map((s: any) => (
                      <button
                        key={s.name}
                        onClick={() => onSelectHeroByName && onSelectHeroByName(s.name)}
                        className="group flex items-center gap-1.5 rounded-lg border border-white/10 bg-black/60 px-2 py-1 text-left transition-all hover:border-emerald-400/50 hover:bg-emerald-950/30 cursor-pointer"
                      >
                        <img
                          src={s.icon}
                          alt={s.name}
                          className="h-6 w-6 rounded object-cover"
                        />
                        <span className="font-sans text-[11px] font-bold text-slate-200 group-hover:text-emerald-300">
                          {s.name}
                        </span>
                      </button>
                    ))
                  ) : (
                    <span className="font-mono text-xs text-slate-500">Data sinergi tidak tersedia</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Actions */}
        <div className="border-t border-white/10 bg-slate-950/90 px-4 py-3 sm:px-6 flex items-center justify-between">
          <span className="font-mono text-[10px] text-slate-500">
            KLASIM MLBB DATA · SOURCE: OFFICIAL MOONTON PATCH 2.2.1
          </span>
          <Link
            href={`/mlbb/heroes/${hero.slug}`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-amber-400 bg-amber-400 px-3.5 py-1.5 font-mono text-[11px] font-bold text-black uppercase transition-all hover:bg-amber-300 active:scale-95 shadow-sm"
          >
            <span>HALAMAN LENGKAP {hero.name}</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
