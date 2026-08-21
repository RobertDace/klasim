// src/app/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';

// Config Data untuk 3 Ekosistem Game Resmi
const ruleEnginePresets = {
  mlbb: {
    id: 'mlbb',
    code: '01 // MPL ID',
    game: 'MOBILE LEGENDS',
    formatTag: 'MOBA BO3',
    accentColor: 'text-amber-400',
    borderColor: 'border-amber-400/50',
    badgeBg: 'bg-amber-400/10 text-amber-400 border-amber-400/30',
    activeBtnBg: 'bg-amber-400 text-black',
    title: 'MPL ID TIEBREAKER RESOLVER',
    description: 'Menyelesaikan skenario poin kembar BO3 Double Round-Robin menggunakan hierarki head-to-head, net game differential, hingga recursive mini-league.',
    headers: ['SEED', 'TIM', 'MATCH', 'DIFF / H2H'],
    scenarios: [
      {
        id: 'ml_1',
        label: 'BASELINE',
        sub: 'H2H DIRECT',
        telemetryText: 'RESOLVER: DIRECT MATCH HEAD-TO-HEAD',
        data: [
          { seed: '#1', name: 'RRQ HOSHI', stat1: '8 - 6', stat2: '+5 (H2H 2-0)', color: 'text-amber-400', stat2Color: 'text-emerald-400' },
          { seed: '#2', name: 'ONIC ESPORTS', stat1: '8 - 6', stat2: '+2 (H2H 1-1)', color: 'text-slate-400', stat2Color: 'text-slate-300' },
          { seed: '#3', name: 'BIGETRON ALPHA', stat1: '8 - 6', stat2: '-1 (H2H 0-2)', color: 'text-rose-400', stat2Color: 'text-rose-400' },
        ],
      },
      {
        id: 'ml_2',
        label: 'CIRCULAR',
        sub: 'MINI-LEAGUE',
        telemetryText: 'RESOLVER: RECURSIVE MINI-LEAGUE (A > B > C > A)',
        data: [
          { seed: '#1', name: 'ONIC ESPORTS', stat1: '8 - 6', stat2: '+4 (ML 3-2)', color: 'text-amber-400', stat2Color: 'text-emerald-400' },
          { seed: '#2', name: 'BIGETRON ALPHA', stat1: '8 - 6', stat2: '+2 (ML 2-2)', color: 'text-slate-400', stat2Color: 'text-slate-300' },
          { seed: '#3', name: 'RRQ HOSHI', stat1: '8 - 6', stat2: '-2 (ML 1-3)', color: 'text-rose-400', stat2Color: 'text-rose-400' },
        ],
      },
      {
        id: 'ml_3',
        label: 'UPSET',
        sub: 'SWEEP (+7)',
        telemetryText: 'RESOLVER: AGGREGATE GAME DIFFERENCE DELTA',
        data: [
          { seed: '#1', name: 'BIGETRON ALPHA', stat1: '8 - 6', stat2: '+7 (Sweep)', color: 'text-amber-400', stat2Color: 'text-emerald-400' },
          { seed: '#2', name: 'RRQ HOSHI', stat1: '8 - 6', stat2: '+3', color: 'text-slate-400', stat2Color: 'text-slate-300' },
          { seed: '#3', name: 'ONIC ESPORTS', stat1: '8 - 6', stat2: '+1', color: 'text-rose-400', stat2Color: 'text-rose-400' },
        ],
      },
    ],
    techNote: 'Kasus loop circular 3 tim (A kalahkan B, B kalahkan C, C kalahkan A) diisolasi ke dalam sub-tabel tanpa melibatkan tim luar.',
  },
  pubgm: {
    id: 'pubgm',
    code: '02 // PMWC',
    game: 'PUBG MOBILE',
    formatTag: 'BATTLE ROYALE',
    accentColor: 'text-emerald-400',
    borderColor: 'border-emerald-400/50',
    badgeBg: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/30',
    activeBtnBg: 'bg-emerald-400 text-black',
    title: 'PMWC 10-PTS MATRIX RESOLVER',
    description: 'Menyelesaikan poin sama pada klasemen Battle Royale resmi PMWC/PMGC berdasarkan jumlah WWCD, Placement Pts, dan Last Match Placement.',
    headers: ['SEED', 'TIM', 'PTS', 'WWCD / ELIMS'],
    scenarios: [
      {
        id: 'pm_1',
        label: 'WWCD TIE',
        sub: '72 PTS EACH',
        telemetryText: 'RESOLVER: HIGHEST FIRST-PLACE (WWCD) COUNT',
        data: [
          { seed: '#1', name: 'ALTER EGO', stat1: '72', stat2: '2 WWCD (38K)', color: 'text-emerald-400', stat2Color: 'text-emerald-400' },
          { seed: '#2', name: 'BIGETRON', stat1: '72', stat2: '1 WWCD (42K)', color: 'text-slate-400', stat2Color: 'text-slate-300' },
          { seed: '#3', name: 'BOOM ESPORTS', stat1: '72', stat2: '0 WWCD (52K)', color: 'text-rose-400', stat2Color: 'text-rose-400' },
        ],
      },
      {
        id: 'pm_2',
        label: 'PLACE PTS',
        sub: '1 WWCD EACH',
        telemetryText: 'RESOLVER: TOTAL ACCUMULATIVE PLACEMENT POINTS',
        data: [
          { seed: '#1', name: 'BIGETRON', stat1: '65', stat2: '1 WWCD (38 Place)', color: 'text-emerald-400', stat2Color: 'text-emerald-400' },
          { seed: '#2', name: 'TALON ESPORTS', stat1: '65', stat2: '1 WWCD (30 Place)', color: 'text-slate-400', stat2Color: 'text-slate-300' },
          { seed: '#3', name: 'VAMPIRE ESPORTS', stat1: '65', stat2: '1 WWCD (26 Place)', color: 'text-rose-400', stat2Color: 'text-rose-400' },
        ],
      },
      {
        id: 'pm_3',
        label: 'LAST MATCH',
        sub: 'SAME KILLS',
        telemetryText: 'RESOLVER: PLACEMENT IN THE FINAL MATCH (#4 vs #9)',
        data: [
          { seed: '#1', name: 'TALON ESPORTS', stat1: '58', stat2: 'Last: #4 (3K)', color: 'text-emerald-400', stat2Color: 'text-emerald-400' },
          { seed: '#2', name: 'ALTER EGO', stat1: '58', stat2: 'Last: #9 (3K)', color: 'text-slate-400', stat2Color: 'text-slate-300' },
          { seed: '#3', name: 'ARCHANGEL', stat1: '51', stat2: 'Last: #14 (1K)', color: 'text-rose-400', stat2Color: 'text-rose-400' },
        ],
      },
    ],
    techNote: 'Format 10-Pts resmi menggunakan distribusi: 10-6-5-4-3-2-1-1-0-0. WWCD menjadi penentu sebelum kalkulasi kill.',
  },
  valorant: {
    id: 'valorant',
    code: '03 // VCT',
    game: 'VALORANT',
    formatTag: 'TACTICAL FPS',
    accentColor: 'text-cyan-400',
    borderColor: 'border-cyan-400/50',
    badgeBg: 'bg-cyan-400/10 text-cyan-400 border-cyan-400/30',
    activeBtnBg: 'bg-cyan-400 text-black',
    title: 'VCT PACIFIC GROUP RESOLVER',
    description: 'Menghitung peringkat grup VCT Pacific berdasarkan Match W-L, Map Differential, dan Round Differential delta.',
    headers: ['SEED', 'TIM', 'MATCH', 'MAP / RND DIFF'],
    scenarios: [
      {
        id: 'vct_1',
        label: 'MAP DIFF',
        sub: '4-1 RECORD',
        telemetryText: 'RESOLVER: BO3 MAP DIFFERENTIAL (+5 vs +3)',
        data: [
          { seed: '#1', name: 'PAPER REX', stat1: '4 - 1', stat2: '+5 Map (8-3)', color: 'text-cyan-400', stat2Color: 'text-emerald-400' },
          { seed: '#2', name: 'DRX', stat1: '4 - 1', stat2: '+3 Map (8-5)', color: 'text-slate-400', stat2Color: 'text-slate-300' },
          { seed: '#3', name: 'GEN.G', stat1: '4 - 1', stat2: '+2 Map (8-6)', color: 'text-rose-400', stat2Color: 'text-rose-400' },
        ],
      },
      {
        id: 'vct_2',
        label: 'RND DIFF',
        sub: 'MAP EQUAL',
        telemetryText: 'RESOLVER: OVERALL ROUND DIFFERENTIAL (+24 vs +11)',
        data: [
          { seed: '#1', name: 'T1', stat1: '3 - 2', stat2: '+2 Map (+24 Rnd)', color: 'text-cyan-400', stat2Color: 'text-emerald-400' },
          { seed: '#2', name: 'ZETA DIVISION', stat1: '3 - 2', stat2: '+2 Map (+11 Rnd)', color: 'text-slate-400', stat2Color: 'text-slate-300' },
          { seed: '#3', name: 'TEAM SECRET', stat1: '3 - 2', stat2: '+2 Map (-4 Rnd)', color: 'text-rose-400', stat2Color: 'text-rose-400' },
        ],
      },
      {
        id: 'vct_3',
        label: 'DIRECT H2H',
        sub: 'ROUNDS',
        telemetryText: 'RESOLVER: DIRECT MAP ROUNDS (HEAD-TO-HEAD DELTA)',
        data: [
          { seed: '#1', name: 'GEN.G', stat1: '3 - 2', stat2: 'H2H Win (13-11)', color: 'text-cyan-400', stat2Color: 'text-emerald-400' },
          { seed: '#2', name: 'RRQ VAL', stat1: '3 - 2', stat2: 'H2H Loss (11-13)', color: 'text-slate-400', stat2Color: 'text-slate-300' },
          { seed: '#3', name: 'GLOBAL ESPORTS', stat1: '2 - 3', stat2: '-3 Map Diff', color: 'text-rose-400', stat2Color: 'text-rose-400' },
        ],
      },
    ],
    techNote: 'Jika map differential sama persis, engine mengagregasi seluruh skor ronde reguler (misal: 13-9 = +4 delta).',
  },
};

type GameKey = keyof typeof ruleEnginePresets;

export default function HomePage() {
  // Intro State Machine
  const [introPhase, setIntroPhase] = useState<0 | 1 | 2 | 3 | 4>(0);
  const [progressPercent, setProgressPercent] = useState(0);
  const [isIntroDismissed, setIsIntroDismissed] = useState(false);

  // Hero Highlighter State
  const [highlightState, setHighlightState] = useState<'idle' | 'drawing' | 'clearing' | 'done'>('idle');

  // Interactive Scenario State
  const [selectedGame, setSelectedGame] = useState<GameKey>('mlbb');
  const [activeScenarioIndex, setActiveScenarioIndex] = useState<number>(0);

  // Active Section for Navbar Spy
  const [activeSection, setActiveSection] = useState<'beranda' | 'modul' | 'lab' | 'tentang'>('beranda');

  // Section Refs
  const berandaRef = useRef<HTMLDivElement>(null);
  const modulRef = useRef<HTMLDivElement>(null);
  const labRef = useRef<HTMLDivElement>(null);
  const tentangRef = useRef<HTMLDivElement>(null);

  const currentGameConfig = ruleEnginePresets[selectedGame];
  const currentScenario = currentGameConfig.scenarios[activeScenarioIndex] || currentGameConfig.scenarios[0];

  // Helper untuk transisi skip/intro
  const triggerDismissSequence = () => {
    setIntroPhase(4);
    setTimeout(() => {
      setIsIntroDismissed(true);
      setHighlightState('drawing');
      setTimeout(() => {
        setHighlightState('clearing');
        setTimeout(() => setHighlightState('done'), 300);
      }, 1200);
    }, 300);
  };

  // Boot Sequence
  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgressPercent((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        const jump = Math.floor(Math.random() * 12) + 6;
        return Math.min(100, prev + jump);
      });
    }, 120);

    const t1 = setTimeout(() => setIntroPhase(1), 600);
    const t2 = setTimeout(() => setIntroPhase(2), 1400);
    const t3 = setTimeout(() => setIntroPhase(3), 2200);
    const t4 = setTimeout(() => {
      triggerDismissSequence();
    }, 2800);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  // Scroll Spy Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === berandaRef.current) setActiveSection('beranda');
            if (entry.target === modulRef.current) setActiveSection('modul');
            if (entry.target === labRef.current) setActiveSection('lab');
            if (entry.target === tentangRef.current) setActiveSection('tentang');
          }
        });
      },
      { threshold: 0.2, rootMargin: '-10% 0px -40% 0px' }
    );

    if (berandaRef.current) observer.observe(berandaRef.current);
    if (modulRef.current) observer.observe(modulRef.current);
    if (labRef.current) observer.observe(labRef.current);
    if (tentangRef.current) observer.observe(tentangRef.current);

    return () => observer.disconnect();
  }, []);

  const handleGameSelect = (gameKey: GameKey) => {
    setSelectedGame(gameKey);
    setActiveScenarioIndex(0);
  };

  const activeTournaments = [
    {
      slug: 'mpl-id-s14',
      code: 'MLBB-01',
      title: 'MPL ID Season 14',
      game: 'Mobile Legends: Bang Bang',
      format: 'Double Round Robin (BO3) + Playoff Double Elimination',
      teamsCount: 9,
      tag: 'MPL OFFICIAL',
      tagColor: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
      href: '/tournament/mpl-id-s14',
    },
    {
      slug: 'pmwc-2026',
      code: 'PUBGM-02',
      title: 'PMWC 2026 Main Stage',
      game: 'PUBG Mobile',
      format: '10-Point PMWC Matrix // Survival & Grand Finals',
      teamsCount: 16,
      tag: 'PMWC 10-PTS',
      tagColor: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
      href: '/tournament/pmwc-2026',
    },
    {
      slug: 'vct-pacific-2026',
      code: 'VCT-03',
      title: 'VCT Pacific Stage 1',
      game: 'VALORANT',
      format: 'Dual Groups BO3 // Map & Round Diff Tiebreakers',
      teamsCount: 11,
      tag: 'VCT PACIFIC',
      tagColor: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
      href: '/tournament/vct-pacific-2026',
    },
  ];

  return (
    <div className="relative min-h-screen bg-[#05070c] text-slate-100 selection:bg-amber-400 selection:text-black overflow-x-hidden">
      {/* 1. CINEMATIC BOOT SEQUENCE */}
      {!isIntroDismissed && (
        <div
          onClick={triggerDismissSequence}
          className="fixed inset-0 z-50 flex cursor-pointer flex-col justify-between select-none"
        >
          <div
            className={`absolute top-0 left-0 right-0 h-1/2 border-b border-white/15 bg-[#05070c] transition-transform duration-300 ease-out z-10 ${
              introPhase === 4 ? '-translate-y-full' : 'translate-y-0'
            }`}
          >
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px] opacity-40" />
            <div className="absolute top-4 left-4 sm:top-6 sm:left-6 font-mono text-[9px] sm:text-[10px] text-slate-500 flex items-center gap-2">
              <span className="h-2 w-2 border-l border-t border-amber-400" />
              <span>KLASIM // SIMULATION KERNEL V2.4</span>
            </div>
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 font-mono text-[9px] sm:text-[10px] text-amber-400/80 hover:text-amber-400 flex items-center gap-1.5">
              <span>[ SKIP ]</span>
              <span className="h-2 w-2 border-r border-t border-amber-400" />
            </div>
          </div>

          <div
            className={`absolute bottom-0 left-0 right-0 h-1/2 border-t border-white/15 bg-[#05070c] transition-transform duration-300 ease-out z-10 ${
              introPhase === 4 ? 'translate-y-full' : 'translate-y-0'
            }`}
          >
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px] opacity-40" />
            <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 font-mono text-[9px] sm:text-[10px] text-slate-500 flex items-center gap-2">
              <span className="h-2 w-2 border-l border-b border-amber-400" />
              <span className="truncate max-w-[200px] sm:max-w-none">SAFE AREA: 100% // DETERMINISTIC</span>
            </div>
            <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 font-mono text-[9px] sm:text-[10px] text-slate-500 flex items-center gap-2">
              <span>0.02ms</span>
              <span className="h-2 w-2 border-r border-b border-amber-400" />
            </div>
          </div>

          <div
            className={`relative z-20 mx-auto my-auto w-full max-w-lg p-4 sm:p-6 font-mono transition-opacity duration-200 ${
              introPhase === 4 ? 'opacity-0' : 'opacity-100'
            }`}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3 sm:pb-4">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded bg-amber-400 font-mono text-xs sm:text-sm font-black text-black shadow-lg shadow-amber-400/20">
                  K
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-black tracking-widest text-white uppercase font-sans">
                    KLASIM TELEMETRY
                  </div>
                  <div className="text-[9px] sm:text-[10px] text-slate-500">
                    CALIBRATING ENGINES
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="font-mono text-xl sm:text-2xl font-black text-amber-400 tabular-nums">
                  {progressPercent.toString().padStart(2, '0')}%
                </span>
              </div>
            </div>

            <div className="my-4 sm:my-5 space-y-2 rounded-xl border border-white/10 bg-black/60 p-3 sm:p-4 backdrop-blur-md text-[11px] sm:text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 font-medium truncate pr-2">MPL ID (MLBB)</span>
                <span className="font-mono font-bold text-emerald-400 shrink-0">
                  {introPhase >= 1 ? '[OK]' : 'INGESTING...'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-300 font-medium truncate pr-2">PMWC (PUBGM BR)</span>
                <span className={`font-mono font-bold shrink-0 ${introPhase >= 2 ? 'text-emerald-400' : introPhase === 1 ? 'text-amber-400' : 'text-slate-600'}`}>
                  {introPhase >= 2 ? '[OK]' : introPhase === 1 ? 'CALIBRATING' : 'QUEUED'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-300 font-medium truncate pr-2">VCT PACIFIC (FPS)</span>
                <span className={`font-mono font-bold shrink-0 ${introPhase >= 3 ? 'text-emerald-400' : introPhase === 2 ? 'text-amber-400' : 'text-slate-600'}`}>
                  {introPhase >= 3 ? '[OK]' : introPhase === 2 ? 'CALIBRATING' : 'QUEUED'}
                </span>
              </div>

              <div className="mt-2.5 flex items-center justify-between border-t border-white/10 pt-2.5">
                <span className="text-[10px] font-bold text-slate-400">STATUS:</span>
                <span className={`font-mono text-[11px] font-black tracking-wide ${introPhase >= 3 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {introPhase >= 3 ? 'READY' : 'INITIALIZING...'}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full bg-amber-400 transition-all duration-150 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between font-mono text-[8px] sm:text-[9px] text-slate-500">
                <span>MEM: 64MB</span>
                <span>SYNC: ACTIVE</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. AMBIENT BACKGROUND */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/3 h-[500px] w-[500px] rounded-full bg-amber-500/10 blur-[140px]" />
        <div className="absolute top-1/2 -right-40 h-[400px] w-[400px] rounded-full bg-indigo-600/10 blur-[140px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px] sm:bg-[size:32px_32px]" />
      </div>

      {/* 3. FIXED NAVBAR */}
      <Navbar activeSection={activeSection} />

      {/* 4. MAIN PAGE CONTENT */}
      <main className="relative z-10 mx-auto max-w-7xl px-3.5 pt-24 pb-16 sm:px-6 sm:pt-28 lg:px-8 space-y-16 sm:space-y-24 md:space-y-28 font-mono">
        {/* SEKSI 1: BERANDA / HERO */}
        <section
          id="beranda"
          ref={berandaRef}
          className="space-y-6 sm:space-y-8 max-w-4xl pt-2 sm:pt-4 scroll-mt-24 sm:scroll-mt-32"
        >
          <div className="inline-block border-l-2 border-amber-400 pl-2.5 sm:pl-3">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-slate-400">
              Deterministic Scenario Modeler
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white leading-[1.05] sm:leading-[0.95] font-sans">
            <span className="relative inline-block mr-2 sm:mr-3 overflow-hidden align-top rounded-sm">
              <span
                className={`absolute inset-0 bg-amber-400 transition-all duration-300 ease-out ${
                  highlightState === 'idle'
                    ? 'scale-x-0 origin-left'
                    : highlightState === 'drawing'
                    ? 'scale-x-100 origin-left'
                    : 'scale-x-0 origin-right'
                }`}
              />
              <span
                className={`relative z-10 inline-block px-1 sm:px-1.5 transition-colors duration-300 ${
                  highlightState === 'drawing' ? 'text-black' : 'text-white'
                }`}
              >
                KALKULASI
              </span>
            </span>
            <span>SKENARIO</span>
            <br />
            <span>KELOLOSAN TIM.</span>
          </h1>

          <p className="max-w-2xl text-xs sm:text-sm leading-relaxed text-slate-400">
            Simulator klasemen berbasis regulasi resmi turnamen esports dunia. Ubah skor tiap pertandingan, uji skenario head-to-head, dan dapatkan proyeksi bagan kualifikasi secara seketika.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 border-y border-white/10 py-3.5 sm:py-4 text-xs">
            <div className="border-b sm:border-b-0 sm:border-r border-white/10 pb-2 sm:pb-0 sm:pr-4">
              <span className="block text-[9px] sm:text-[10px] text-slate-500 uppercase">Tiebreaker Logic</span>
              <span className="font-bold text-slate-200">Head-to-Head & Aggregate</span>
            </div>
            <div className="border-b sm:border-b-0 sm:border-r border-white/10 pb-2 sm:pb-0 sm:pr-4">
              <span className="block text-[9px] sm:text-[10px] text-slate-500 uppercase">Supported Formats</span>
              <span className="font-bold text-slate-200">MOBA / BR / FPS</span>
            </div>
            <div>
              <span className="block text-[9px] sm:text-[10px] text-slate-500 uppercase">Export Pipeline</span>
              <span className="font-bold text-slate-200">Excel, PDF & Card PNG</span>
            </div>
          </div>
        </section>

        {/* SEKSI 2: MODUL TURNAMEN */}
        <section
          id="modul"
          ref={modulRef}
          className="space-y-4 sm:space-y-6 pt-6 border-t border-white/10 scroll-mt-24 sm:scroll-mt-32"
        >
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-300">
                MODUL TURNAMEN RESMI
              </h2>
            </div>
            <span className="text-[9px] sm:text-[10px] text-slate-500">
              3 PRESET
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {activeTournaments.map((t) => (
              <div
                key={t.slug}
                className="group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-slate-950/80 p-5 sm:p-6 backdrop-blur-xl transition-all duration-300 hover:border-amber-400/50"
              >
                <div className="space-y-4 sm:space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-500">
                      {t.code}
                    </span>
                    <span className={`rounded-md border px-2 py-0.5 text-[8px] sm:text-[9px] font-extrabold uppercase ${t.tagColor}`}>
                      {t.tag}
                    </span>
                  </div>

                  <div>
                    <span className="text-[9px] sm:text-[10px] font-semibold text-slate-400 uppercase">
                      {t.game}
                    </span>
                    <h3 className="mt-1 text-xl sm:text-2xl font-black uppercase tracking-tight text-white group-hover:text-amber-400 transition-colors font-sans">
                      {t.title}
                    </h3>
                  </div>

                  <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3 text-[10px] sm:text-[11px] text-slate-400 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Peserta:</span>
                      <span className="font-bold text-slate-200">{t.teamsCount} Tim</span>
                    </div>
                    <div className="text-slate-400 pt-1 border-t border-white/5 text-[9px] sm:text-[10px] leading-tight">
                      {t.format}
                    </div>
                  </div>
                </div>

                <div className="mt-5 sm:mt-6 pt-3.5 sm:pt-4 border-t border-white/10">
                  <Link
                    href={t.href}
                    className="inline-flex w-full items-center justify-between rounded-xl bg-amber-400 px-4 py-3 text-xs font-black uppercase text-black transition-all duration-200 hover:bg-amber-300 active:scale-95 shadow-md shadow-amber-400/10"
                  >
                    <span>Buka Simulator</span>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SEKSI 3: DYNAMIC SCENARIO LAB & INTERACTIVE RULEBOOK */}
        <section
          id="lab"
          ref={labRef}
          className="space-y-6 pt-6 sm:pt-8 border-t border-white/10 scroll-mt-24 sm:scroll-mt-28"
        >
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between pb-1">
            <div>
              <div className="flex items-center gap-2 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-amber-400">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-ping" />
                <span>SCENARIO STRESS-TESTER</span>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tight text-white font-sans">
                RESOLUSI TIEBREAKER
              </h2>
            </div>
            <div className="text-[9px] sm:text-[10px] text-slate-500 uppercase flex items-center gap-2">
              <span>ACTIVE:</span>
              <strong className={currentGameConfig.accentColor}>{currentGameConfig.game}</strong>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-stretch">
            {/* KARTU KIRI: DYNAMIC INTERACTIVE MATRIX (COL 7) */}
            <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-slate-950/80 p-4 sm:p-6 backdrop-blur-xl lg:col-span-7 space-y-4 sm:space-y-5">
              <div className="space-y-3.5 sm:space-y-4">
                {/* Header Matriks */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2 truncate pr-2">
                    <span className="h-2 w-2 rounded-full bg-amber-400 shrink-0" />
                    <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-white truncate font-sans">
                      {currentGameConfig.title}
                    </span>
                  </div>
                  <span className={`border px-2 py-0.5 text-[8px] sm:text-[9px] font-extrabold uppercase tracking-widest rounded shrink-0 ${currentGameConfig.badgeBg}`}>
                    {currentGameConfig.formatTag}
                  </span>
                </div>

                <p className="text-[11px] sm:text-xs leading-relaxed text-slate-400">
                  {currentGameConfig.description}
                </p>

                {/* 3 TOMBOL SKENARIO SEJAJAR */}
                <div className="grid grid-cols-3 gap-1 rounded-xl border border-white/10 bg-black/50 p-1">
                  {currentGameConfig.scenarios.map((sc, idx) => {
                    const isSelected = activeScenarioIndex === idx;
                    return (
                      <button
                        key={sc.id}
                        onClick={() => setActiveScenarioIndex(idx)}
                        className={`flex flex-col items-center justify-center py-2 px-1 text-center rounded-lg transition-all duration-200 active:scale-95 ${
                          isSelected
                            ? `${currentGameConfig.activeBtnBg} font-black shadow-md`
                            : 'text-slate-400 hover:text-white hover:bg-white/5 font-bold'
                        }`}
                      >
                        <span className="text-[7px] sm:text-[8px] opacity-70 uppercase tracking-wider truncate w-full">
                          {sc.sub}
                        </span>
                        <span className="text-[9px] sm:text-[11px] truncate w-full font-sans">
                          {sc.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* TABEL TELEMETRY STANDINGS */}
                <div className="rounded-xl border border-white/10 bg-black/60 overflow-hidden text-xs">
                  <div className="grid grid-cols-12 bg-white/5 px-3 sm:px-4 py-2 text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-white/10">
                    <span className="col-span-2">{currentGameConfig.headers[0]}</span>
                    <span className="col-span-4">{currentGameConfig.headers[1]}</span>
                    <span className="col-span-3 text-center">{currentGameConfig.headers[2]}</span>
                    <span className="col-span-3 text-right">{currentGameConfig.headers[3]}</span>
                  </div>

                  <div className="divide-y divide-white/5 px-3 sm:px-4">
                    {currentScenario.data.map((row, idx) => (
                      <div key={idx} className="grid grid-cols-12 items-center py-2.5 text-[11px] sm:text-xs">
                        <span className={`col-span-2 font-black ${row.color}`}>{row.seed}</span>
                        <span className="col-span-4 font-bold text-white truncate pr-1">{row.name}</span>
                        <span className="col-span-3 text-center text-slate-400 tabular-nums">{row.stat1}</span>
                        <span className={`col-span-3 text-right font-black tabular-nums truncate ${row.stat2Color}`}>
                          {row.stat2}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Status Bar Bawah Matriks */}
              <div className="flex items-center justify-between border-t border-white/10 pt-3 text-[9px] sm:text-[10px] text-slate-500">
                <span className="flex items-center gap-1.5 truncate max-w-[75%]">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                  <span className="truncate">{currentScenario.telemetryText}</span>
                </span>
                <span className="text-emerald-400 font-bold shrink-0">DETERMINISTIC ✓</span>
              </div>
            </div>

            {/* KARTU KANAN: CLICKABLE RULEBOOK SELECTOR & DETAILS (COL 5) */}
            <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-slate-950/80 p-4 sm:p-6 backdrop-blur-xl lg:col-span-5 space-y-4 sm:space-y-5">
              <div className="space-y-3.5 sm:space-y-4">
                <div className="border-b border-white/10 pb-2.5 sm:pb-3 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-slate-500 block">
                      PILIH REGULASI
                    </span>
                    <h3 className="text-xs sm:text-sm font-black uppercase text-white font-sans">
                      HIERARKI TIEBREAKER
                    </h3>
                  </div>
                  <span className="text-[8px] sm:text-[9px] text-slate-500 font-mono">
                    [ TAP UNTUK UJI ]
                  </span>
                </div>

                {/* 3 KARTU SELEKSI GAME */}
                <div className="space-y-2 text-xs">
                  <button
                    onClick={() => handleGameSelect('mlbb')}
                    className={`w-full text-left rounded-xl border p-3 transition-all duration-200 active:scale-[0.99] ${
                      selectedGame === 'mlbb'
                        ? 'border-amber-400 bg-amber-400/10 shadow-md shadow-amber-400/10'
                        : 'border-white/5 bg-black/40 hover:border-white/20 active:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-black uppercase ${selectedGame === 'mlbb' ? 'text-amber-400' : 'text-slate-300'}`}>
                        01 // MPL ID (MLBB)
                      </span>
                      <span className="text-[8px] sm:text-[9px] text-slate-500 font-mono">
                        {selectedGame === 'mlbb' ? '● AKTIF' : 'MOBA BO3'}
                      </span>
                    </div>
                    <p className="text-slate-300 text-[10px] sm:text-[11px] leading-relaxed mt-1">
                      Match Win % &rarr; H2H Matches &rarr; Net Game Diff &rarr; H2H Game Points.
                    </p>
                  </button>

                  <button
                    onClick={() => handleGameSelect('pubgm')}
                    className={`w-full text-left rounded-xl border p-3 transition-all duration-200 active:scale-[0.99] ${
                      selectedGame === 'pubgm'
                        ? 'border-emerald-400 bg-emerald-400/10 shadow-md shadow-emerald-400/10'
                        : 'border-white/5 bg-black/40 hover:border-white/20 active:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-black uppercase ${selectedGame === 'pubgm' ? 'text-emerald-400' : 'text-slate-300'}`}>
                        02 // PMWC (PUBGM)
                      </span>
                      <span className="text-[8px] sm:text-[9px] text-slate-500 font-mono">
                        {selectedGame === 'pubgm' ? '● AKTIF' : 'BATTLE ROYALE'}
                      </span>
                    </div>
                    <p className="text-slate-300 text-[10px] sm:text-[11px] leading-relaxed mt-1">
                      Total Points &rarr; Total WWCD &rarr; Placement Pts &rarr; Elims &rarr; Last Match.
                    </p>
                  </button>

                  <button
                    onClick={() => handleGameSelect('valorant')}
                    className={`w-full text-left rounded-xl border p-3 transition-all duration-200 active:scale-[0.99] ${
                      selectedGame === 'valorant'
                        ? 'border-cyan-400 bg-cyan-400/10 shadow-md shadow-cyan-400/10'
                        : 'border-white/5 bg-black/40 hover:border-white/20 active:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-black uppercase ${selectedGame === 'valorant' ? 'text-cyan-400' : 'text-slate-300'}`}>
                        03 // VCT PACIFIC (VALORANT)
                      </span>
                      <span className="text-[8px] sm:text-[9px] text-slate-500 font-mono">
                        {selectedGame === 'valorant' ? '● AKTIF' : 'TACTICAL FPS'}
                      </span>
                    </div>
                    <p className="text-slate-300 text-[10px] sm:text-[11px] leading-relaxed mt-1">
                      Match W-L &rarr; Head-to-Head &rarr; Map Diff &rarr; Round Diff &rarr; Direct H2H.
                    </p>
                  </button>
                </div>
              </div>

              {/* Dynamic Technical Note Box */}
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3 sm:p-3.5 text-[9px] sm:text-[10px] text-slate-400 mt-auto">
                <span className="font-bold text-slate-200 block mb-1">
                  CATATAN LOGIKA // {currentGameConfig.game}
                </span>
                {currentGameConfig.techNote}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* SEKSI 4: TENTANG / FOOTER */}
      <div id="tentang" ref={tentangRef} className="scroll-mt-24 sm:scroll-mt-32">
        <Footer />
      </div>
    </div>
  );
}