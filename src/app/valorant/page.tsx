// src/app/valorant/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import { valorantTeams } from '@/lib/valorantTeamsData';

export default function ValorantHubPage() {
  const [activeTab, setActiveTab] = useState<'resolver' | 'groups' | 'teams'>('resolver');

  const groupATeams = valorantTeams.filter((t) => t.group === 'A');
  const groupBTeams = valorantTeams.filter((t) => t.group === 'B');

  return (
    <div className="min-h-screen bg-[#05070c] text-slate-100 flex flex-col font-sans selection:bg-cyan-400 selection:text-black">
      <Navbar activeSection="valorant" />

      <main className="flex-1 pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-12">
        {/* ========================================================================= */}
        {/* 1. HERO BANNER                                                            */}
        {/* ========================================================================= */}
        <div className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-[#081524] via-[#060c18] to-[#04060a] p-6 sm:p-10 lg:p-12 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 font-mono text-xs font-bold text-cyan-400 tracking-wider">
              <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
              VALORANT TACTICAL FPS STANDINGS HUB
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase font-sans">
              VCT PACIFIC MATRIX & <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-cyan-400 via-sky-200 to-blue-500 bg-clip-text text-transparent">
                MAP/ROUND DELTA RESOLVER
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans max-w-2xl">
              Engine pemecah tiebreaker resmi VCT Pacific League. Menghitung peringkat grup berdasarkan Match Win-Loss (W-L), selisih Map (+/-), hingga akumulasi Round Differential delta.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 font-mono text-xs">
              <Link
                href="/tournament/vct-pacific-2026"
                className="rounded-xl border border-cyan-400 bg-cyan-400 px-5 py-3 font-black text-black hover:bg-cyan-300 transition-all shadow-lg shadow-cyan-400/20 flex items-center gap-2 cursor-pointer"
              >
                <span>🏆</span>
                <span>BUKA KLASEMEN VCT PACIFIC</span>
              </Link>
              <Link
                href="/tournament/create"
                className="rounded-xl border border-white/20 bg-white/5 px-5 py-3 font-bold text-white hover:bg-white/10 hover:border-white/40 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>⚡</span>
                <span>BUAT TURNAMEN VALORANT SENDIRI</span>
              </Link>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
            <div className="rounded-xl border border-white/5 bg-black/40 p-3">
              <span className="text-[10px] text-slate-400 uppercase block">Format Liga</span>
              <span className="text-xl sm:text-2xl font-black text-cyan-400">BO3 SERIES</span>
              <span className="text-[9px] text-slate-500 block">Dual Groups Stage</span>
            </div>
            <div className="rounded-xl border border-white/5 bg-black/40 p-3">
              <span className="text-[10px] text-slate-400 uppercase block">Map Delta</span>
              <span className="text-xl sm:text-2xl font-black text-amber-400">NET MAPS</span>
              <span className="text-[9px] text-slate-500 block">Maps Won vs Lost</span>
            </div>
            <div className="rounded-xl border border-white/5 bg-black/40 p-3">
              <span className="text-[10px] text-slate-400 uppercase block">Round Delta</span>
              <span className="text-xl sm:text-2xl font-black text-emerald-400">NET ROUNDS</span>
              <span className="text-[9px] text-slate-500 block">Rounds Won vs Lost</span>
            </div>
            <div className="rounded-xl border border-white/5 bg-black/40 p-3">
              <span className="text-[10px] text-slate-400 uppercase block">Head-to-Head</span>
              <span className="text-xl sm:text-2xl font-black text-purple-400">DIRECT H2H</span>
              <span className="text-[9px] text-slate-500 block">Matrix Duel Antar Tim</span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. TABBED CONTENT                                                         */}
        {/* ========================================================================= */}
        <section className="space-y-6">
          <div className="flex border-b border-white/10 font-mono text-xs">
            <button
              onClick={() => setActiveTab('resolver')}
              className={`pb-3 px-4 font-bold uppercase transition-all border-b-2 cursor-pointer ${
                activeTab === 'resolver'
                  ? 'border-cyan-400 text-cyan-400'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              1. HIERARKI TIEBREAKER VCT
            </button>
            <button
              onClick={() => setActiveTab('groups')}
              className={`pb-3 px-4 font-bold uppercase transition-all border-b-2 cursor-pointer ${
                activeTab === 'groups'
                  ? 'border-cyan-400 text-cyan-400'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              2. STRUKTUR GRUP VCT PACIFIC
            </button>
            <button
              onClick={() => setActiveTab('teams')}
              className={`pb-3 px-4 font-bold uppercase transition-all border-b-2 cursor-pointer ${
                activeTab === 'teams'
                  ? 'border-cyan-400 text-cyan-400'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              3. TIM PACIFIC ({valorantTeams.length})
            </button>
          </div>

          {activeTab === 'resolver' && (
            <div className="rounded-3xl border border-white/10 bg-[#070b14] p-6 sm:p-8 space-y-4 font-mono text-xs animate-in fade-in duration-200">
              <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider">
                URUTAN ATURAN PENENTU PERINGKAT VCT PACIFIC (RIOT GAMES):
              </h3>
              <div className="space-y-3 font-sans text-xs text-slate-300">
                <div className="rounded-xl border border-white/5 bg-black/40 p-3.5 space-y-1">
                  <span className="font-mono font-bold text-cyan-400">PRIORITAS #1: MATCH WIN-LOSS RECORD (W-L)</span>
                  <p className="text-slate-400">Jumlah kemenangan seri pertandingan (BO3) menjadi metrik utama penentuan klasemen.</p>
                </div>
                <div className="rounded-xl border border-white/5 bg-black/40 p-3.5 space-y-1">
                  <span className="font-mono font-bold text-amber-400">PRIORITAS #2: HEAD-TO-HEAD MATCH RECORD</span>
                  <p className="text-slate-400">Jika 2 tim memiliki rekor W-L yang sama, pemenang pertemuan langsung (H2H) diunggulkan.</p>
                </div>
                <div className="rounded-xl border border-white/5 bg-black/40 p-3.5 space-y-1">
                  <span className="font-mono font-bold text-emerald-400">PRIORITAS #3: MAP DIFFERENTIAL DELTA (+/-)</span>
                  <p className="text-slate-400">Selisih total map yang dimenangkan dikurangi map yang kalah di seluruh pertandingan babak grup.</p>
                </div>
                <div className="rounded-xl border border-white/5 bg-black/40 p-3.5 space-y-1">
                  <span className="font-mono font-bold text-purple-400">PRIORITAS #4: ROUND DIFFERENTIAL DELTA (+/-)</span>
                  <p className="text-slate-400">Selisih total round (in-game round won vs lost) menjadi penentu akhir jika map diff identik.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'groups' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-200">
              {/* Group Alpha */}
              <div className="rounded-2xl border border-cyan-400/30 bg-[#07101c] p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-cyan-400/20 pb-2">
                  <span className="font-mono text-sm font-bold text-cyan-400 uppercase">GRUP ALPHA (A)</span>
                  <span className="font-mono text-[10px] text-slate-400">{groupATeams.length} TIM</span>
                </div>
                <div className="space-y-2">
                  {groupATeams.map((t) => (
                    <div key={t.id} className="flex items-center justify-between rounded-xl border border-white/5 bg-black/40 p-2.5">
                      <span className="text-xs font-bold text-white">{t.name}</span>
                      <span className="font-mono text-xs font-bold text-cyan-400">{t.code}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Group Omega */}
              <div className="rounded-2xl border border-blue-400/30 bg-[#07101c] p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-blue-400/20 pb-2">
                  <span className="font-mono text-sm font-bold text-blue-400 uppercase">GRUP OMEGA (B)</span>
                  <span className="font-mono text-[10px] text-slate-400">{groupBTeams.length} TIM</span>
                </div>
                <div className="space-y-2">
                  {groupBTeams.map((t) => (
                    <div key={t.id} className="flex items-center justify-between rounded-xl border border-white/5 bg-black/40 p-2.5">
                      <span className="text-xs font-bold text-white">{t.name}</span>
                      <span className="font-mono text-xs font-bold text-blue-400">{t.code}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'teams' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 animate-in fade-in duration-200">
              {valorantTeams.map((t) => (
                <div
                  key={t.id}
                  className="rounded-xl border border-white/10 bg-black/40 p-3 text-center space-y-1 hover:border-cyan-400/50 transition-colors"
                >
                  <span className="font-mono text-xs font-bold text-cyan-400 block truncate">{t.code}</span>
                  <span className="text-xs font-bold text-white block truncate">{t.name}</span>
                  <span className="text-[10px] font-mono text-slate-500 block">Grup {t.group}</span>
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
