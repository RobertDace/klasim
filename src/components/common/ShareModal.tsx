// src/components/common/ShareModal.tsx
'use client';

import { useState } from 'react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  tournamentName: string;
  shareUrl: string;
}

export default function ShareModal({
  isOpen,
  onClose,
  tournamentName,
  shareUrl,
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const encodedText = encodeURIComponent(
    `Cek hasil simulasi ${tournamentName} versi saya di Klasim Esports Simulator:\n${shareUrl}`
  );

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedText}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedText}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-950 p-6 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h3 className="font-mono text-xs font-black uppercase tracking-widest text-amber-400">
              BAGIKAN HASIL SIMULASI
            </h3>
            <p className="mt-0.5 font-mono text-[10px] text-slate-400">
              {tournamentName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-xs text-slate-400 hover:bg-white/10 hover:text-white"
          >
            TUTUP
          </button>
        </div>

        {/* Input Link & Copy Button */}
        <div className="space-y-2">
          <label className="block font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Tautan Simulasi Unik
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 rounded-xl border border-white/15 bg-slate-900 px-3 py-2 font-mono text-xs font-bold text-slate-200 focus:outline-none"
            />
            <button
              onClick={handleCopy}
              className={`rounded-xl px-4 py-2 font-mono text-xs font-black uppercase transition-all ${
                copied
                  ? 'bg-emerald-400 text-black shadow-[0_0_12px_rgba(52,211,153,0.4)]'
                  : 'bg-amber-400 text-black hover:bg-amber-300'
              }`}
            >
              {copied ? 'TERSALIN' : 'SALIN'}
            </button>
          </div>
        </div>

        {/* Quick Social Share Buttons */}
        <div className="space-y-2 pt-2 border-t border-white/10">
          <label className="block font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Bagikan Langsung
          </label>
          <div className="grid grid-cols-2 gap-3 font-mono text-xs">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 py-2.5 font-bold text-emerald-400 transition-all hover:bg-emerald-500/20"
            >
              WHATSAPP
            </a>
            <a
              href={twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl border border-sky-500/30 bg-sky-500/10 py-2.5 font-bold text-sky-400 transition-all hover:bg-sky-500/20"
            >
              X / TWITTER
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}