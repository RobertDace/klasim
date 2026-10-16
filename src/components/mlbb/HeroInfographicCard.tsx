// src/components/mlbb/HeroInfographicCard.tsx
'use client';

import { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import type { MLBBHero, MLBBTierStat, MLBBEnrichedBuild } from '@/data/mlbb';

interface HeroInfographicCardProps {
  hero: MLBBHero;
  tierStat?: MLBBTierStat;
  activeBuild?: MLBBEnrichedBuild;
}

export default function HeroInfographicCard({ hero, tierStat, activeBuild }: HeroInfographicCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownloadImage = async () => {
    if (!cardRef.current) return;
    try {
      setIsExporting(true);
      // Wait for all fonts and assets to stabilize
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        quality: 0.95,
      });

      const link = document.createElement('a');
      link.download = `klasim-${hero.slug}-pro-infographic.png`;
      link.href = dataUrl;
      link.click();

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to export infographic image:', err);
      alert('Gagal mengekspor infografis. Silakan coba kembali.');
    } finally {
      setIsExporting(false);
    }
  };

  const tier = tierStat?.tier || 'A';
  const winRate = tierStat ? (tierStat.win_rate * 100).toFixed(1) : '51.2';
  const banRate = tierStat ? (tierStat.ban_rate * 100).toFixed(1) : '15.4';

  return (
    <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-[#0a0e1c] to-[#060810] p-6 sm:p-8 space-y-6 shadow-2xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-amber-400">
              MPL TOURNAMENT BROADCAST INFOGRAPHIC
            </span>
          </div>
          <h2 className="font-sans text-xl sm:text-2xl font-black uppercase text-white mt-1">
            KARTU INFOGRAFIS TURNAMEN
          </h2>
        </div>

        {/* Download Button */}
        <button
          onClick={handleDownloadImage}
          disabled={isExporting}
          className="inline-flex items-center gap-2 rounded-xl border border-amber-400 bg-amber-400 px-4 py-2 font-mono text-xs font-black uppercase text-black transition-all hover:bg-amber-300 active:scale-95 shadow-lg shadow-amber-500/20 disabled:opacity-50 cursor-pointer"
        >
          {isExporting ? (
            <>
              <span className="h-3 w-3 rounded-full border-2 border-black border-t-transparent animate-spin" />
              <span>MEMPROSES GAMBAR...</span>
            </>
          ) : downloadSuccess ? (
            <>
              <span>✓</span>
              <span>BERHASIL DIUNDUH!</span>
            </>
          ) : (
            <>
              <span>📸</span>
              <span>UNDUH GAMBAR INFOGRAFIS (PNG)</span>
            </>
          )}
        </button>
      </div>

      {/* The Printable Infographic Card Canvas (Captured by html-to-image) */}
      <div className="overflow-x-auto pb-2">
        <div
          ref={cardRef}
          style={{ width: '840px' }}
          className="relative overflow-hidden rounded-3xl border-2 border-amber-400/40 bg-[#060811] p-8 text-white shadow-2xl shrink-0 select-none"
        >
          {/* Ambient Corner Accents */}
          <div className="pointer-events-none absolute -top-20 -right-20 h-60 w-60 rounded-full bg-amber-500/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-cyan-500/15 blur-3xl" />

          {/* Top Telemetry Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4 font-mono text-xs">
            <div className="flex items-center gap-3">
              <div className="flex h-7 w-7 items-center justify-center rounded border border-amber-400 bg-amber-400/10 font-black text-amber-400 text-xs">
                K
              </div>
              <div>
                <span className="block font-black tracking-wider text-white">KLASIM TELEMETRY</span>
                <span className="block text-[8px] text-slate-500 uppercase">OFFICIAL MLBB META ENGINE · PATCH 2.2.1</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="rounded bg-amber-400 px-2 py-0.5 font-black text-black text-[10px] uppercase">
                TIER {tier}
              </span>
              <span className="rounded border border-emerald-500/30 bg-emerald-950/60 px-2 py-0.5 font-bold text-emerald-400 text-[10px]">
                WR {winRate}%
              </span>
              <span className="rounded border border-rose-500/30 bg-rose-950/60 px-2 py-0.5 font-bold text-rose-400 text-[10px]">
                BAN {banRate}%
              </span>
            </div>
          </div>

          {/* Main Content Layout */}
          <div className="grid grid-cols-12 gap-6 my-6 items-center">
            {/* Hero Artwork Frame (4 Cols) */}
            <div className="col-span-4 relative h-64 overflow-hidden rounded-2xl border-2 border-white/20 bg-black shadow-xl">
              <img
                src={hero.image}
                alt={hero.name}
                className="h-full w-full object-cover object-top"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/40 to-transparent p-3">
                <span className="font-mono text-[9px] text-amber-400 uppercase font-bold block">
                  #{hero.moonton_hero_id} · {hero.lane[0] || 'Lane Meta'}
                </span>
                <span className="font-sans text-xl font-black uppercase text-white truncate block">
                  {hero.name}
                </span>
              </div>
            </div>

            {/* Profile Info & 6 Build Items (8 Cols) */}
            <div className="col-span-8 space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {hero.roles.map(r => (
                    <span key={r} className="rounded bg-amber-400/15 border border-amber-400/30 px-2 py-0.2 font-mono text-[10px] font-bold text-amber-300">
                      {r}
                    </span>
                  ))}
                  <span className="font-mono text-xs text-slate-400">"{hero.title}"</span>
                </div>
                <h3 className="font-sans text-3xl font-black uppercase text-white tracking-wide">
                  {hero.name}
                </h3>
              </div>

              {/* 6 Core Items Grid */}
              <div className="space-y-2">
                <span className="font-mono text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  PRO TOURNAMENT EQUIPMENT BUILD:
                </span>
                <div className="grid grid-cols-6 gap-2">
                  {(activeBuild?.items || []).slice(0, 6).map((item, idx) => (
                    <div
                      key={item.id + idx}
                      className="flex flex-col items-center rounded-xl border border-white/10 bg-black/60 p-2 text-center"
                    >
                      <img src={item.image} alt={item.name} className="h-10 w-10 rounded-lg object-cover mb-1 border border-white/10" />
                      <span className="font-sans text-[9px] font-bold text-white truncate w-full">
                        {item.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Spell & Emblem & Attributes */}
              <div className="grid grid-cols-3 gap-3 pt-2 font-mono text-[11px]">
                {/* Spell */}
                <div className="rounded-xl border border-white/10 bg-black/50 p-2.5 flex items-center gap-2">
                  {activeBuild?.spell && (
                    <img src={activeBuild.spell.image} alt={activeBuild.spell.name} className="h-7 w-7 rounded object-cover" />
                  )}
                  <div className="min-w-0">
                    <span className="text-[8px] text-slate-500 block uppercase">SPELL</span>
                    <span className="font-bold text-white text-[10px] truncate block">
                      {activeBuild?.spell?.name || 'Flicker'}
                    </span>
                  </div>
                </div>

                {/* Emblem */}
                <div className="rounded-xl border border-white/10 bg-black/50 p-2.5 flex items-center gap-2">
                  {activeBuild?.emblem && (
                    <img src={activeBuild.emblem.image} alt={activeBuild.emblem.name} className="h-7 w-7 rounded object-cover" />
                  )}
                  <div className="min-w-0">
                    <span className="text-[8px] text-slate-500 block uppercase">EMBLEM</span>
                    <span className="font-bold text-white text-[10px] truncate block">
                      {activeBuild?.emblem ? `Custom ${activeBuild.emblem.name}` : 'Custom Meta'}
                    </span>
                  </div>
                </div>

                {/* Priority Skill */}
                <div className="rounded-xl border border-white/10 bg-black/50 p-2.5">
                  <span className="text-[8px] text-slate-500 block uppercase">PRIORITAS SKILL</span>
                  <span className="font-bold text-amber-400 text-xs block">
                    {String(hero.skill_order || '1-2-3')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Strip */}
          <div className="flex items-center justify-between border-t border-white/10 pt-3 font-mono text-[9px] text-slate-500">
            <span>DETERMINISTIC SIMULATION · HTTPS://KLASIM.ESPORTS.ID</span>
            <span className="text-amber-400 font-bold uppercase">KLASIM PRO ARCHIVE // {hero.name.toUpperCase()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
