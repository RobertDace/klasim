// src/components/mlbb/PostDraftAnalysisModal.tsx
'use client';

import Image from 'next/image';
import { type MLBBHero } from '@/data/mlbb';

interface PostDraftAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  blueTeamName: string;
  redTeamName: string;
  bluePicks: (MLBBHero | null)[];
  redPicks: (MLBBHero | null)[];
  blueBans: (MLBBHero | null)[];
  redBans: (MLBBHero | null)[];
  blueAnalysis: {
    warnings: string[];
    lanesCovered: Record<string, boolean>;
    physicalRatio: number;
    magicRatio: number;
    avgDurability: number;
  };
  redAnalysis: {
    warnings: string[];
    lanesCovered: Record<string, boolean>;
    physicalRatio: number;
    magicRatio: number;
    avgDurability: number;
  };
  matchPrediction: {
    blueProb: number;
    redProb: number;
    advantageReason: string;
  };
  onReset: () => void;
  onExportCard: () => void;
  isExportingCard: boolean;
  onCopyShareUrl: () => void;
  shareUrlCopied: boolean;
}

export default function PostDraftAnalysisModal({
  isOpen,
  onClose,
  blueTeamName,
  redTeamName,
  bluePicks,
  redPicks,
  blueBans,
  redBans,
  blueAnalysis,
  redAnalysis,
  matchPrediction,
  onReset,
  onExportCard,
  isExportingCard,
  onCopyShareUrl,
  shareUrlCopied,
}: PostDraftAnalysisModalProps) {
  if (!isOpen) return null;

  // Generate standardized role warnings matching Molebuild screenshot
  const getRoleWarnings = (picks: (MLBBHero | null)[]) => {
    const valid = picks.filter(Boolean) as MLBBHero[];
    const warnings: string[] = [];
    const hasMarksman = valid.some((h) => h.roles.includes('Marksman'));
    const hasAssassin = valid.some((h) => h.roles.includes('Assassin'));
    const hasMage = valid.some((h) => h.roles.includes('Mage'));
    const hasTank = valid.some((h) => h.roles.includes('Tank') || h.roles.includes('Support'));

    if (!hasMarksman) warnings.push('Warning: No Marksman');
    if (!hasAssassin) warnings.push('Warning: No Assassin');
    if (!hasMage) warnings.push('Warning: No Mage');
    if (!hasTank) warnings.push('Warning: No Frontline Tank');

    if (warnings.length === 0) {
      warnings.push('Komposisi Role Seimbang (All Core Roles Covered)');
    }
    return warnings;
  };

  const blueRoleWarnings = getRoleWarnings(bluePicks);
  const redRoleWarnings = getRoleWarnings(redPicks);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Main Modal Card matching Molebuild screenshot */}
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-2xl border border-white/20 bg-[#0b0e17] shadow-2xl p-4 sm:p-6 text-white font-sans flex flex-col justify-between z-10 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
        {/* Top Header: Title & Close Button */}
        <div className="relative flex items-center justify-center border-b border-white/10 pb-4 mb-4">
          <h2 className="text-lg sm:text-xl md:text-2xl font-black uppercase tracking-widest text-white text-center">
            ANALISIS PASCA-DRAFT
          </h2>
          <button
            onClick={onClose}
            className="absolute right-0 top-0 text-slate-400 hover:text-white p-1 text-sm font-bold rounded-lg transition-colors"
            title="Tutup Popup"
          >
            ✕
          </button>
        </div>

        {/* Content: Left Team Column | Center VS | Right Team Column */}
        <div className="grid grid-cols-1 md:grid-cols-11 gap-3 sm:gap-4 items-stretch mb-5">
          {/* =================================================================== */}
          {/* LEFT TEAM COLUMN (BLUE)                                             */}
          {/* =================================================================== */}
          <div className="md:col-span-5 flex flex-col justify-between space-y-3">
            {/* Team Title & Ban Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-5 bg-blue-500 rounded-full" />
                <span className="font-sans text-sm sm:text-base font-black uppercase text-blue-400 tracking-wider">
                  {blueTeamName}
                </span>
              </div>

              {/* Bans */}
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  HERO YANG DI-BAN
                </span>
                <div className="flex items-center gap-1.5">
                  {blueBans.map((h, i) => (
                    <div
                      key={i}
                      className="relative h-8 w-8 sm:h-9 sm:w-9 rounded-full overflow-hidden border border-blue-500/30 bg-black/60 flex items-center justify-center"
                    >
                      {h ? (
                        <>
                          <Image
                            src={h.image}
                            alt={h.name}
                            width={36}
                            height={36}
                            className="object-cover h-full w-full grayscale contrast-125"
                            unoptimized
                          />
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-[130%] h-[2px] bg-rose-500 rotate-45 shadow-[0_0_4px_#ff0055]" />
                          </div>
                        </>
                      ) : (
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-500/30" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 5 Picks List (Molebuild exact card style) */}
            <div className="space-y-2">
              {bluePicks.map((hero, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-white/10 bg-black/50 p-2 sm:p-2.5 flex items-center gap-3 border-l-4 border-l-blue-500 shadow-sm"
                >
                  <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-full overflow-hidden border border-white/20 bg-slate-900 shrink-0">
                    {hero ? (
                      <Image
                        src={hero.image}
                        alt={hero.name}
                        width={44}
                        height={44}
                        className="object-cover h-full w-full"
                        unoptimized
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-slate-600 text-xs font-bold">
                        P{i + 1}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1 leading-tight font-sans">
                    <div className="text-xs sm:text-sm font-bold text-white truncate">
                      {hero ? hero.name : `Slot Pick ${i + 1}`}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate mt-0.5">
                      {hero ? hero.roles.join(', ') : 'Belum memilih'}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Box: PERINGATAN KOMPOSISI */}
            <div className="rounded-xl border border-rose-500/30 bg-rose-950/20 p-3 space-y-1">
              <span className="text-[11px] font-sans font-bold uppercase text-rose-400 block tracking-wider">
                PERINGATAN KOMPOSISI
              </span>
              <div className="space-y-0.5 text-[11px] text-slate-300 font-sans">
                {blueRoleWarnings.map((w, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <span>•</span>
                    <span>{w}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* =================================================================== */}
          {/* CENTER VS BADGE                                                     */}
          {/* =================================================================== */}
          <div className="hidden md:flex md:col-span-1 flex-col items-center justify-center my-auto">
            <div className="h-10 w-10 rounded-full bg-black border-2 border-white/20 flex items-center justify-center shadow-2xl">
              <span className="font-sans font-black italic text-xs text-white tracking-widest">
                VS
              </span>
            </div>
          </div>

          {/* =================================================================== */}
          {/* RIGHT TEAM COLUMN (RED)                                             */}
          {/* =================================================================== */}
          <div className="md:col-span-5 flex flex-col justify-between space-y-3">
            {/* Team Title & Ban Bar */}
            <div className="space-y-1.5 text-right">
              <div className="flex items-center justify-end gap-2">
                <span className="font-sans text-sm sm:text-base font-black uppercase text-rose-400 tracking-wider">
                  {redTeamName}
                </span>
                <span className="w-1.5 h-5 bg-rose-500 rounded-full" />
              </div>

              {/* Bans */}
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  HERO YANG DI-BAN
                </span>
                <div className="flex items-center justify-end gap-1.5">
                  {redBans.map((h, i) => (
                    <div
                      key={i}
                      className="relative h-8 w-8 sm:h-9 sm:w-9 rounded-full overflow-hidden border border-rose-500/30 bg-black/60 flex items-center justify-center"
                    >
                      {h ? (
                        <>
                          <Image
                            src={h.image}
                            alt={h.name}
                            width={36}
                            height={36}
                            className="object-cover h-full w-full grayscale contrast-125"
                            unoptimized
                          />
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-[130%] h-[2px] bg-rose-500 rotate-45 shadow-[0_0_4px_#ff0055]" />
                          </div>
                        </>
                      ) : (
                        <div className="h-1.5 w-1.5 rounded-full bg-rose-500/30" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 5 Picks List (Molebuild exact card style) */}
            <div className="space-y-2">
              {redPicks.map((hero, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-white/10 bg-black/50 p-2 sm:p-2.5 flex items-center justify-end gap-3 border-r-4 border-r-rose-500 shadow-sm text-right"
                >
                  <div className="min-w-0 flex-1 leading-tight font-sans">
                    <div className="text-xs sm:text-sm font-bold text-white truncate">
                      {hero ? hero.name : `Slot Pick ${i + 1}`}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate mt-0.5">
                      {hero ? hero.roles.join(', ') : 'Belum memilih'}
                    </div>
                  </div>
                  <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-full overflow-hidden border border-white/20 bg-slate-900 shrink-0">
                    {hero ? (
                      <Image
                        src={hero.image}
                        alt={hero.name}
                        width={44}
                        height={44}
                        className="object-cover h-full w-full"
                        unoptimized
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-slate-600 text-xs font-bold">
                        P{i + 1}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Box: PERINGATAN KOMPOSISI */}
            <div className="rounded-xl border border-rose-500/30 bg-rose-950/20 p-3 space-y-1 text-right">
              <span className="text-[11px] font-sans font-bold uppercase text-rose-400 block tracking-wider">
                PERINGATAN KOMPOSISI
              </span>
              <div className="space-y-0.5 text-[11px] text-slate-300 font-sans">
                {redRoleWarnings.map((w, idx) => (
                  <div key={idx} className="flex items-center justify-end gap-1.5">
                    <span>{w}</span>
                    <span>•</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Win Probability Dual Bar */}
        <div className="rounded-xl border border-white/10 bg-black/60 p-3 mb-4 font-mono text-xs space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-bold">
            <span className="text-cyan-400">{blueTeamName}: {matchPrediction.blueProb}%</span>
            <span className="text-slate-400 italic font-normal text-[10px]">
              {matchPrediction.advantageReason}
            </span>
            <span className="text-rose-400">{redTeamName}: {matchPrediction.redProb}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden flex">
            <div style={{ width: `${matchPrediction.blueProb}%` }} className="bg-cyan-500 h-full" />
            <div style={{ width: `${matchPrediction.redProb}%` }} className="bg-rose-500 h-full" />
          </div>
        </div>

        {/* Bottom Modal Actions */}
        <div className="flex flex-wrap items-center justify-center sm:justify-between gap-2 pt-3 border-t border-white/10 font-sans text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={onReset}
              className="px-3.5 py-2 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 transition-all cursor-pointer font-bold"
            >
              ↺ Reset & Draft Ulang
            </button>
            <button
              onClick={onCopyShareUrl}
              className="px-3.5 py-2 rounded-xl border border-white/20 bg-white/10 text-white hover:bg-white/20 transition-all cursor-pointer"
            >
              🔗 {shareUrlCopied ? 'URL Disalin!' : 'Bagikan'}
            </button>
          </div>

          <button
            onClick={onExportCard}
            disabled={isExportingCard}
            className="px-4 py-2 rounded-xl bg-amber-400 text-black font-black hover:bg-amber-300 transition-all cursor-pointer shadow-lg shadow-amber-400/20 disabled:opacity-50"
          >
            📸 {isExportingCard ? 'Memproses...' : 'Unduh Kartu HD Showdown'}
          </button>
        </div>
      </div>
    </div>
  );
}
