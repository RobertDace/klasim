// src/components/mlbb/HeroCard.tsx
'use client';

import { useState } from 'react';
import type { MLBBHero, MLBBTierStat } from '@/data/mlbb';

interface HeroCardProps {
  hero: MLBBHero;
  tierStat?: MLBBTierStat;
  onSelect: (hero: MLBBHero) => void;
  viewMode?: 'grid' | 'compact';
}

const roleColors: Record<string, { badge: string; text: string; border: string }> = {
  Tank: { badge: 'bg-blue-500/15 text-blue-400 border-blue-500/30', text: 'text-blue-400', border: 'hover:border-blue-500/50' },
  Fighter: { badge: 'bg-amber-500/15 text-amber-400 border-amber-500/30', text: 'text-amber-400', border: 'hover:border-amber-500/50' },
  Assassin: { badge: 'bg-purple-500/15 text-purple-400 border-purple-500/30', text: 'text-purple-400', border: 'hover:border-purple-500/50' },
  Mage: { badge: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30', text: 'text-cyan-400', border: 'hover:border-cyan-500/50' },
  Marksman: { badge: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30', text: 'text-yellow-400', border: 'hover:border-yellow-500/50' },
  Support: { badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', text: 'text-emerald-400', border: 'hover:border-emerald-500/50' },
};

const tierStyles: Record<string, string> = {
  'S+': 'bg-gradient-to-r from-amber-400 to-yellow-300 text-black font-black shadow-[0_0_12px_rgba(251,191,36,0.6)]',
  'S': 'bg-amber-400/20 text-amber-300 border border-amber-400/50 font-bold',
  'A': 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-bold',
  'B': 'bg-slate-700/40 text-slate-300 border border-slate-600/40 font-medium',
  'C': 'bg-slate-800/60 text-slate-400 border border-slate-700/30',
  'D': 'bg-slate-900/60 text-slate-500 border border-slate-800/30',
};

export default function HeroCard({ hero, tierStat, onSelect, viewMode = 'grid' }: HeroCardProps) {
  const [imgSrc, setImgSrc] = useState(hero.image);
  const primaryRole = hero.roles[0] || 'Fighter';
  const roleColor = roleColors[primaryRole] || roleColors.Fighter;
  const tier = tierStat?.tier || 'A';
  const winRate = tierStat ? (tierStat.win_rate * 100).toFixed(1) : null;
  const banRate = tierStat ? (tierStat.ban_rate * 100).toFixed(1) : null;

  if (viewMode === 'compact') {
    return (
      <div
        onClick={() => onSelect(hero)}
        className="group flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-slate-950/70 p-2.5 transition-all duration-200 hover:border-amber-400/40 hover:bg-slate-900/90 hover:shadow-lg hover:shadow-amber-500/5 cursor-pointer"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-md border border-white/10 bg-black/50">
            <img
              src={imgSrc}
              alt={hero.name}
              onError={() => setImgSrc(hero.image_remote)}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-110"
            />
            {tier && (
              <span className={`absolute -bottom-1 -right-1 rounded px-1 text-[8px] leading-tight ${tierStyles[tier] || tierStyles.A}`}>
                {tier}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-sans text-xs font-black uppercase tracking-wide text-white group-hover:text-amber-400 transition-colors truncate">
                {hero.name}
              </span>
              <span className="font-mono text-[9px] text-slate-500 shrink-0">#{hero.moonton_hero_id}</span>
            </div>
            <div className="flex flex-wrap items-center gap-1 mt-0.5">
              {hero.roles.map(r => (
                <span key={r} className="rounded bg-white/5 px-1 py-0.2 text-[8px] font-mono text-slate-300">
                  {r}
                </span>
              ))}
              {hero.lane[0] && (
                <span className="rounded bg-amber-400/10 px-1 py-0.2 text-[8px] font-mono text-amber-300">
                  {hero.lane[0]}
                </span>
              )}
            </div>
          </div>
        </div>

        {tierStat && (
          <div className="flex items-center gap-3 shrink-0 text-right font-mono">
            <div>
              <span className="block text-[8px] uppercase tracking-wider text-slate-500">WIN RATE</span>
              <span className={`text-[11px] font-black ${Number(winRate) >= 50 ? 'text-emerald-400' : 'text-slate-300'}`}>
                {winRate}%
              </span>
            </div>
            <div>
              <span className="block text-[8px] uppercase tracking-wider text-slate-500">BAN RATE</span>
              <span className="text-[11px] font-black text-rose-400">
                {banRate}%
              </span>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      onClick={() => onSelect(hero)}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-white/10 bg-[#080b13] transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/40 hover:shadow-xl hover:shadow-amber-500/10 cursor-pointer"
    >
      {/* Aspect Ratio Hero Image Showcase */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-950">
        <img
          src={imgSrc}
          alt={hero.name}
          onError={() => setImgSrc(hero.image_remote)}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-108"
        />

        {/* Gradient dark overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080b13] via-[#080b13]/30 to-black/20" />
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/60 to-transparent" />

        {/* Top telemetry badges */}
        <div className="absolute top-2 inset-x-2 flex items-center justify-between pointer-events-none">
          {/* Moonton ID */}
          <span className="rounded bg-black/60 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-slate-400 backdrop-blur-md border border-white/10">
            #{hero.moonton_hero_id}
          </span>

          {/* Tier badge */}
          {tier && (
            <span className={`rounded px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider ${tierStyles[tier] || tierStyles.A}`}>
              TIER {tier}
            </span>
          )}
        </div>

        {/* Lane indicator pill */}
        {hero.lane[0] && (
          <div className="absolute bottom-2 left-2 pointer-events-none">
            <span className="rounded-md border border-amber-400/30 bg-black/75 px-1.5 py-0.5 font-mono text-[9px] font-bold text-amber-300 backdrop-blur-md shadow-sm">
              {hero.lane[0]}
            </span>
          </div>
        )}

        {/* Winrate pill */}
        {winRate && (
          <div className="absolute bottom-2 right-2 pointer-events-none">
            <span className={`rounded-md border px-1.5 py-0.5 font-mono text-[9px] font-black backdrop-blur-md shadow-sm ${
              Number(winRate) >= 50
                ? 'border-emerald-500/40 bg-emerald-950/75 text-emerald-400'
                : 'border-white/10 bg-black/75 text-slate-300'
            }`}>
              WR {winRate}%
            </span>
          </div>
        )}
      </div>

      {/* Hero Card Bottom Info */}
      <div className="flex flex-1 flex-col justify-between p-3">
        <div>
          {/* Name & Title */}
          <h3 className="font-sans text-sm font-black uppercase tracking-wide text-white group-hover:text-amber-400 transition-colors truncate">
            {hero.name}
          </h3>
          <p className="font-mono text-[10px] text-slate-400 truncate mt-0.5">
            {hero.title || hero.speciality.join(' · ') || 'Mobile Legends Hero'}
          </p>
        </div>

        {/* Roles Tags */}
        <div className="mt-2.5 flex flex-wrap items-center gap-1">
          {hero.roles.map(role => {
            const rc = roleColors[role] || roleColors.Fighter;
            return (
              <span
                key={role}
                className={`rounded border px-1.5 py-0.5 font-mono text-[8px] font-bold uppercase tracking-wider ${rc.badge}`}
              >
                {role}
              </span>
            );
          })}
          {hero.skills.length > 0 && (
            <span className="ml-auto font-mono text-[9px] text-slate-500">
              {hero.skills.length} Skills
            </span>
          )}
        </div>
      </div>

      {/* Hover bottom edge accent glow */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-amber-400/0 to-transparent transition-all duration-300 group-hover:via-amber-400" />
    </div>
  );
}
