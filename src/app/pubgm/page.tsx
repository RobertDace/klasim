// src/app/pubgm/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import { pubgmTeams } from '@/lib/pubgmTeamsData';

export default function PubgmHubPage() {
  const [activeTab, setActiveTab] = useState<'matrix' | 'resolver' | 'teams'>('matrix');

  const pointDistribution = [
    { rank: '#1 (WWCD)', pts: 10, highlight: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30' },
    { rank: '#2', pts: 6, highlight: 'text-slate-200 bg-white/5 border-white/10' },
    { rank: '#3', pts: 5, highlight: 'text-slate-200 bg-white/5 border-white/10' },
    { rank: '#4', pts: 4, highlight: 'text-slate-200 bg-white/5 border-white/10' },
    { rank: '#5', pts: 3, highlight: 'text-slate-200 bg-white/5 border-white/10' },
    { rank: '#6', pts: 2, highlight: 'text-slate-200 bg-white/5 border-white/10' },
    { rank: '#7 - #8', pts: 1, highlight: 'text-slate-400 bg-white/5 border-white/10' },
    { rank: '#9 - #16', pts: 0, highlight: 'text-slate-600 bg-black/40 border-white/5' },
  ];

  return (
    <div className="min-h-screen bg-[#05070c] text-slate-100 flex flex-col font-sans selection:bg-emerald-400 selection:text-black">
      <Navbar activeSection="pubgm" />

      <main className="flex-1 pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-12">
        {/* ========================================================================= */}
        {/* 1. HERO BANNER                                                            */}
        {/* ========================================================================= */}
        <div className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-[#071a12] via-[#050e0b] to-[#04060a] p-6 sm:p-10 lg:p-12 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 font-mono text-xs font-bold text-emerald-400 tracking-wider">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              PUBG MOBILE BATTLE ROYALE TELEMETRY HUB
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase font-sans">
              PMWC 10-POINTS MATRIX & <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-200 to-emerald-500 bg-clip-text text-transparent">
                SURVIVAL STANDINGS
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans max-w-2xl">
              Engine kalkulasi klasemen resmi turnamen dunia PUBG Mobile World Cup (PMWC) dan PMGC. Menyelesaikan skenario poin kembar secara akurat berdasarkan regulasi resmi Moonton / Krafton Esports.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 font-mono text-xs">
              <Link
                href="/tournament/pmwc-2026"
                className="rounded-xl border border-emerald-400 bg-emerald-400 px-5 py-3 font-black text-black hover:bg-emerald-300 transition-all shadow-lg shadow-emerald-400/20 flex items-center gap-2 cursor-pointer"
              >
                <span>🏆</span>
                <span>BUKA KLASEMEN PMWC 2026</span>
              </Link>
              <Link
                href="/tournament/create"
                className="rounded-xl border border-white/20 bg-white/5 px-5 py-3 font-bold text-white hover:bg-white/10 hover:border-white/40 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>⚡</span>
                <span>BUAT TURNAMEN PUBGM SENDIRI</span>
              </Link>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
            <div className="rounded-xl border border-white/5 bg-black/40 p-3">
              <span className="text-[10px] text-slate-400 uppercase block">Distribusi Poin</span>
              <span className="text-xl sm:text-2xl font-black text-emerald-400">10-PTS</span>
              <span className="text-[9px] text-slate-500 block">Standard PMWC / PMGC</span>
            </div>
            <div className="rounded-xl border border-white/5 bg-black/40 p-3">
              <span className="text-[10px] text-slate-400 uppercase block">Kill Points</span>
              <span className="text-xl sm:text-2xl font-black text-amber-400">1 PT / ELIM</span>
              <span className="text-[9px] text-slate-500 block">Uncapped Per Match</span>
            </div>
            <div className="rounded-xl border border-white/5 bg-black/40 p-3">
              <span className="text-[10px] text-slate-400 uppercase block">Tim Per Lobi</span>
              <span className="text-xl sm:text-2xl font-black text-cyan-400">16 TEAMS</span>
              <span className="text-[9px] text-slate-500 block">Survival Grid</span>
            </div>
            <div className="rounded-xl border border-white/5 bg-black/40 p-3">
              <span className="text-[10px] text-slate-400 uppercase block">Primary Tiebreaker</span>
              <span className="text-xl sm:text-2xl font-black text-purple-400">WWCD</span>
              <span className="text-[9px] text-slate-500 block">Jumlah Kemenangan Match</span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. TABBED CONTENT: POINT MATRIX | TIEBREAKER RESOLVER | TEAMS             */}
        {/* ========================================================================= */}
        <section className="space-y-6">
          <div className="flex border-b border-white/10 font-mono text-xs">
            <button
              onClick={() => setActiveTab('matrix')}
              className={`pb-3 px-4 font-bold uppercase transition-all border-b-2 cursor-pointer ${
                activeTab === 'matrix'
                  ? 'border-emerald-400 text-emerald-400'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              1. DISTRIBUSI POIN RESMI (10-PTS)
            </button>
            <button
              onClick={() => setActiveTab('resolver')}
              className={`pb-3 px-4 font-bold uppercase transition-all border-b-2 cursor-pointer ${
                activeTab === 'resolver'
                  ? 'border-emerald-400 text-emerald-400'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              2. HIERARKI TIEBREAKER
            </button>
            <button
              onClick={() => setActiveTab('teams')}
              className={`pb-3 px-4 font-bold uppercase transition-all border-b-2 cursor-pointer ${
                activeTab === 'teams'
                  ? 'border-emerald-400 text-emerald-400'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              3. PRO TEAMS ROSTER ({pubgmTeams.length})
            </button>
          </div>

          {activeTab === 'matrix' && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-in fade-in duration-200">
              {pointDistribution.map((item, idx) => (
                <div
                  key={idx}
                  className={`rounded-2xl border p-4 flex flex-col justify-between space-y-2 ${item.highlight}`}
                >
                  <span className="font-mono text-xs font-bold uppercase">{item.rank}</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black font-mono">{item.pts}</span>
                    <span className="text-[10px] font-mono text-slate-400">PTS</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'resolver' && (
            <div className="rounded-3xl border border-white/10 bg-[#070b14] p-6 sm:p-8 space-y-4 font-mono text-xs animate-in fade-in duration-200">
              <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">
                URUTAN PENENTU POIN SAMA (KRAFTON RULEBOOK):
              </h3>
              <div className="space-y-3 font-sans text-xs text-slate-300">
                <div className="rounded-xl border border-white/5 bg-black/40 p-3.5 space-y-1">
                  <span className="font-mono font-bold text-emerald-400">PRIORITAS #1: TOTAL WWCD (FIRST PLACE)</span>
                  <p className="text-slate-400">Tim dengan jumlah kemenangan match (WWCD) terbanyak berhak menempati posisi lebih tinggi.</p>
                </div>
                <div className="rounded-xl border border-white/5 bg-black/40 p-3.5 space-y-1">
                  <span className="font-mono font-bold text-amber-400">PRIORITAS #2: TOTAL PLACEMENT POINTS</span>
                  <p className="text-slate-400">Jika jumlah WWCD sama, sistem membandingkan akumulasi poin posisi finis dari seluruh match.</p>
                </div>
                <div className="rounded-xl border border-white/5 bg-black/40 p-3.5 space-y-1">
                  <span className="font-mono font-bold text-cyan-400">PRIORITAS #3: TOTAL ELIMINATION (KILL) POINTS</span>
                  <p className="text-slate-400">Jika placement points identik, jumlah kill terbanyak dihitung sebagai penentu.</p>
                </div>
                <div className="rounded-xl border border-white/5 bg-black/40 p-3.5 space-y-1">
                  <span className="font-mono font-bold text-purple-400">PRIORITAS #4: PERINGKAT MATCH PENUTUP (LAST MATCH)</span>
                  <p className="text-slate-400">Posisi finis di match terakhir turnamen menjadi penentu akhir jika seluruh metrik di atas imbang.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'teams' && (
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 animate-in fade-in duration-200">
              {pubgmTeams.map((t) => (
                <div
                  key={t.id}
                  className="rounded-xl border border-white/10 bg-black/40 p-3 text-center space-y-1 hover:border-emerald-400/50 transition-colors"
                >
                  <span className="font-mono text-xs font-bold text-emerald-400 block truncate">{t.code}</span>
                  <span className="text-xs font-bold text-white block truncate">{t.name}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
