// src/components/pubgm/PUBGMShareCardModal.tsx
'use client';

import { useState, useRef } from 'react';
import { toPng } from 'html-to-image';
import { PUBGMStanding } from '@/lib/pubgmCalculator';

interface PUBGMShareCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  tournamentName: string;
  standings: PUBGMStanding[];
}

export default function PUBGMShareCardModal({
  isOpen,
  onClose,
  tournamentName,
  standings,
}: PUBGMShareCardModalProps) {
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '9:16'>('1:1');
  const [isGenerating, setIsGenerating] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setIsGenerating(true);
    try {
      const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `Klasim_PUBGM_${tournamentName.replace(/\s+/g, '_')}_${aspectRatio === '1:1' ? 'Feed' : 'Story'}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const leader = standings[0]?.teamName || 'LEADER TIM';
  const leaderPts = standings[0]?.totalPoints || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl border border-white/10 bg-slate-950 p-6 shadow-2xl space-y-6 my-8">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h3 className="font-mono text-xs font-black uppercase tracking-widest text-amber-400">
              PUBGM LEADERBOARD CARD GENERATOR
            </h3>
            <p className="mt-0.5 font-mono text-[10px] text-slate-400">
              PMWC Official 10-Point Scoring System
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-xs text-slate-400 hover:bg-white/10 hover:text-white"
          >
            TUTUP
          </button>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setAspectRatio('1:1')}
              className={`rounded-lg px-3 py-1.5 font-mono text-xs font-bold transition-all ${
                aspectRatio === '1:1'
                  ? 'bg-amber-400 text-black shadow-md shadow-amber-400/20'
                  : 'border border-white/10 bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              1:1 (FEED)
            </button>
            <button
              onClick={() => setAspectRatio('9:16')}
              className={`rounded-lg px-3 py-1.5 font-mono text-xs font-bold transition-all ${
                aspectRatio === '9:16'
                  ? 'bg-amber-400 text-black shadow-md shadow-amber-400/20'
                  : 'border border-white/10 bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              9:16 (STORY)
            </button>
          </div>

          <button
            onClick={handleDownload}
            disabled={isGenerating}
            className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-4 py-2 font-mono text-xs font-black uppercase text-black transition-all hover:bg-amber-300 active:scale-95 disabled:opacity-50"
          >
            {isGenerating ? 'MEMPROSES...' : 'UNDUH GAMBAR (PNG)'}
          </button>
        </div>

        <div className="flex justify-center overflow-auto rounded-xl border border-white/10 bg-black/40 p-4">
          <div
            ref={cardRef}
            className={`flex flex-col justify-between border border-white/15 bg-[#05070c] p-6 text-slate-100 ${
              aspectRatio === '1:1' ? 'w-[480px] h-[480px]' : 'w-[380px] h-[675px]'
            }`}
          >
            <div>
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded bg-amber-400 font-mono text-xs font-black text-black">
                    K
                  </span>
                  <span className="font-mono text-xs font-black uppercase tracking-wider text-white">
                    KLASIM BATTLE ROYALE
                  </span>
                </div>
                <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-amber-400">
                  PMWC RULES
                </span>
              </div>

              <div className="mt-3">
                <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-slate-400">
                  OVERALL LEADERBOARD
                </span>
                <h2 className="text-xl font-black uppercase tracking-tight text-white leading-none">
                  {tournamentName}
                </h2>
              </div>
            </div>

            <div className="my-3 space-y-1">
              <div className="grid grid-cols-12 gap-1 border-b border-white/10 pb-1 font-mono text-[9px] font-bold uppercase text-slate-400">
                <span className="col-span-2 text-center">POS</span>
                <span className="col-span-5">TIM</span>
                <span className="col-span-2 text-center">WWCD</span>
                <span className="col-span-3 text-right">TOTAL PTS</span>
              </div>

              {standings.slice(0, aspectRatio === '1:1' ? 6 : 10).map((team) => {
                const rank = team.rank ?? 0;
                const badgeColor =
                  rank <= 3
                    ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
                    : rank <= 8
                    ? 'text-sky-400 border-sky-500/30 bg-sky-500/10'
                    : 'text-rose-400 border-rose-500/30 bg-rose-500/10';

                return (
                  <div
                    key={team.teamId}
                    className="grid grid-cols-12 items-center gap-1 rounded border border-white/5 bg-slate-950/60 px-1.5 py-1 font-mono text-[10px]"
                  >
                    <div className="col-span-2 flex justify-center">
                      <span className={`flex h-4 w-4 items-center justify-center rounded border font-bold ${badgeColor}`}>
                        {rank}
                      </span>
                    </div>
                    <div className="col-span-5 truncate font-extrabold text-white">
                      <span className="text-amber-400/80 mr-1">{team.teamCode}</span>
                      {team.teamName}
                    </div>
                    <span className="col-span-2 text-center font-bold text-amber-400">
                      {team.wwcd}x
                    </span>
                    <span className="col-span-3 text-right font-black text-white">
                      {team.totalPoints} PTS
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="space-y-2">
              <div className="rounded-lg border border-amber-400/40 bg-amber-400/10 px-3 py-1.5 text-center">
                <span className="block font-mono text-[8px] font-black uppercase tracking-widest text-amber-400">
                  CURRENT LEADER
                </span>
                <span className="block font-mono text-xs font-black uppercase text-white">
                  {leader} ({leaderPts} PTS)
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-white/10 pt-2 font-mono text-[8px] text-slate-500">
                <span>KLASIM TELEMETRY ENGINE</span>
                <span>klasim.vercel.app</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}