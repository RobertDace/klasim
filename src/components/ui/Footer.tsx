// src/components/ui/Footer.tsx
'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#04060a] font-mono text-slate-400 select-none text-xs">
      {/* 1. TOP TELEMETRY DIAGNOSTICS STRIP */}
      <div className="border-b border-white/5 bg-black/40 px-4 py-2 text-[10px] text-slate-500">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-slate-300 font-bold">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              KLASIM // SIMULATION KERNEL V2.4
            </span>
            <span className="text-slate-700">|</span>
            <span>ENV: PRODUCTION (CLIENT-RECURSIVE)</span>
            <span className="text-slate-700 hidden sm:inline">|</span>
            <span className="hidden sm:inline">ZERO TELEMETRY TRACKERS</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span className="text-emerald-400 font-bold">SHA-256 DETERMINISTIC ✓</span>
            <span className="text-slate-700">/</span>
            <span>BUILD: 2026.08</span>
          </div>
        </div>
      </div>

      {/* 2. MAIN TECHNICAL COLOPHON & LEGAL GRID */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 items-start">
          
          {/* KOLOM 1: AUTHOR & LEAD ENGINEER (4 Cols) */}
          <div className="space-y-4 md:col-span-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">
                AUTHOR // LEAD ENGINEER
              </span>
              <span className="text-[9px] text-slate-500">PROVENANCE</span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-black tracking-wider text-white font-sans uppercase">
                    2OB1T
                  </span>
                  <span className="inline-flex items-center gap-1 rounded bg-emerald-500/10 border border-emerald-500/30 px-1.5 py-0.5 text-[8px] font-bold text-emerald-400 uppercase">
                    <span className="h-1 w-1 rounded-full bg-emerald-400" />
                    CREATOR
                  </span>
                </div>
                <span className="block text-[10px] uppercase tracking-widest text-slate-500 font-medium">
                  Software Architect & Core Maintainer
                </span>
              </div>

              <p className="text-[11px] leading-relaxed text-slate-400">
                Mengembangkan platform kalkulasi dan pemodelan skenario esports independen untuk komunitas, caster, analis data, dan turnamen kompetitif.
              </p>

              {/* Verified Author Social Links with Official SVGs */}
              <div className="grid grid-cols-2 gap-2 pt-1 text-[10px]">
                <a
                  href="https://github.com/RobertDace"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 hover:border-amber-400/50 hover:bg-amber-400/10 hover:text-amber-400 transition-all"
                >
                  <div className="flex items-center gap-2 truncate">
                    <svg className="h-3.5 w-3.5 shrink-0 text-slate-400 group-hover:text-amber-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                    </svg>
                    <span className="font-bold  truncate">RobertDace</span>
                  </div>
                  <span className="shrink-0 text-slate-500 group-hover:text-amber-400 transition-colors">↗</span>
                </a>

                <a
                  href="https://www.instagram.com/alfrbtt/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 hover:border-amber-400/50 hover:bg-amber-400/10 hover:text-amber-400 transition-all"
                >
                  <div className="flex items-center gap-2 truncate">
                    <svg className="h-3.5 w-3.5 shrink-0 text-slate-400 group-hover:text-amber-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                    <span className="font-bold lowercase truncate">@alfrbtt</span>
                  </div>
                  <span className="shrink-0 text-slate-500 group-hover:text-amber-400 transition-colors">↗</span>
                </a>
              </div>
            </div>
          </div>

          {/* KOLOM 2: KLASIM OPEN ENGINE & ECOSYSTEM (4 Cols) */}
          <div className="space-y-4 md:col-span-4 border-t md:border-t-0 md:border-l border-white/10 md:pl-8 pt-6 md:pt-0">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">
                ENGINE // ECOSYSTEM
              </span>
              <span className="text-[9px] text-slate-500">OPEN ARCHITECTURE</span>
            </div>

            <div className="space-y-3">
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white uppercase">Klasim Open Core</span>
                  <span className="rounded bg-emerald-500/10 border border-emerald-500/30 px-1.5 py-0.5 text-[9px] font-bold text-emerald-400">
                    DETERMINISTIC
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-400">
                  Modul kalkulasi tiebreaker terpisah (*decoupled core*) yang mengevaluasi skenario mini-league H2H dan scoring matrix secara instan di peramban tanpa latensi database.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <Link
                  href="/tournament/create"
                  className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-2.5 hover:border-amber-400/50 hover:bg-amber-400/10 hover:text-amber-400 transition-all"
                >
                  <span className="font-bold uppercase">+ Buat Turnamen</span>
                  <span>&rarr;</span>
                </Link>
                <a
                  href="https://github.com/RobertDace"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-2.5 hover:border-white/30 hover:bg-white/10 hover:text-white transition-all"
                >
                  <span className="font-bold uppercase">Repository</span>
                  <span>↗</span>
                </a>
              </div>
            </div>
          </div>

          {/* KOLOM 3: LEGALITAS, FAIR USE & DISCLAIMER (4 Cols) */}
          <div className="space-y-4 md:col-span-4 border-t md:border-t-0 md:border-l border-white/10 md:pl-8 pt-6 md:pt-0">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">
                LEGAL // NON-AFFILIATION
              </span>
              <span className="text-[9px] text-slate-500">FAIR USE COMPLIANCE</span>
            </div>

            <div className="space-y-2 text-[10px] leading-relaxed text-slate-400">
              <p>
                <strong className="text-slate-200 uppercase font-semibold">Bukan Produk Resmi:</strong> Klasim adalah platform kalkulator simulasi independen dan tidak berafiliasi, disponsori, atau disetujui oleh publisher maupun penyelenggara turnamen terkait.
              </p>
              <ul className="space-y-1 text-slate-400 border-l border-white/10 pl-2">
                <li>• <strong className="text-slate-300">MPL / MLBB:</strong> Hak cipta milik Moonton Interactive.</li>
                <li>• <strong className="text-slate-300">PMWC / PUBGM:</strong> Hak cipta milik KRAFTON & Level Infinite.</li>
                <li>• <strong className="text-slate-300">VCT / VALORANT:</strong> Hak cipta milik Riot Games, Inc.</li>
              </ul>
              <p className="text-[9px] text-slate-500 pt-1">
                Seluruh merek dagang, logo tim, dan nama turnamen digunakan semata-mata di bawah doktrin *Fair Use* untuk keperluan edukasi analitik dan simulasi komunitas.
              </p>
            </div>
          </div>

        </div>

        {/* 3. BOTTOM EDITORIAL METRICS & COPYRIGHT */}
        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 text-[11px] text-slate-500 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span>&copy; {new Date().getFullYear()} KLASIM. BUILT BY 2OB1T.</span>
            <span className="text-slate-700 hidden sm:inline">/</span>
            <span className="text-slate-400">MIT LICENSE APPLIED TO CORE LOGIC.</span>
          </div>

          <div className="flex items-center gap-3 text-[10px]">
            <span className="text-slate-400">STATUS: ALL ENGINES HEALTHY</span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </div>
        </div>
      </div>
    </footer>
  );
}