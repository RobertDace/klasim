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
    game: 'MOBILE LEGENDS: BANG BANG',
    formatTag: 'MOBA BO3',
    accentColor: 'text-amber-400',
    borderColor: 'border-amber-400/50',
    badgeBg: 'bg-amber-400/10 text-amber-400 border-amber-400/30',
    activeBtnBg: 'bg-amber-400 text-black',
    title: 'MPL ID TIEBREAKER RESOLVER',
    description: 'Menyelesaikan skenario poin kembar BO3 Double Round-Robin menggunakan hierarki head-to-head, net game differential, hingga recursive mini-league.',
    headers: ['SEED', 'TIM', 'MATCH W-L', 'NET GAME DIFF'],
    scenarios: [
      {
        id: 'ml_1',
        label: 'BASELINE H2H',
        sub: 'EQUAL DIFF',
        telemetryText: 'RESOLVER: DIRECT MATCH HEAD-TO-HEAD',
        data: [
          { seed: '#1', name: 'RRQ HOSHI', stat1: '8 - 6', stat2: '+5 (H2H 2-0)', color: 'text-amber-400', stat2Color: 'text-emerald-400' },
          { seed: '#2', name: 'ONIC ESPORTS', stat1: '8 - 6', stat2: '+2 (H2H 1-1)', color: 'text-slate-400', stat2Color: 'text-slate-300' },
          { seed: '#3', name: 'BIGETRON ALPHA', stat1: '8 - 6', stat2: '-1 (H2H 0-2)', color: 'text-rose-400', stat2Color: 'text-rose-400' },
        ],
      },
      {
        id: 'ml_2',
        label: 'CIRCULAR TIE',
        sub: 'MINI-LEAGUE',
        telemetryText: 'RESOLVER: RECURSIVE MINI-LEAGUE (A > B > C > A)',
        data: [
          { seed: '#1', name: 'ONIC ESPORTS', stat1: '8 - 6', stat2: '+4 (Mini-League 3-2)', color: 'text-amber-400', stat2Color: 'text-emerald-400' },
          { seed: '#2', name: 'BIGETRON ALPHA', stat1: '8 - 6', stat2: '+2 (Mini-League 2-2)', color: 'text-slate-400', stat2Color: 'text-slate-300' },
          { seed: '#3', name: 'RRQ HOSHI', stat1: '8 - 6', stat2: '-2 (Mini-League 1-3)', color: 'text-rose-400', stat2Color: 'text-rose-400' },
        ],
      },
      {
        id: 'ml_3',
        label: 'NET DIFF UPSET',
        sub: 'SWEEP (+7)',
        telemetryText: 'RESOLVER: AGGREGATE GAME DIFFERENCE DELTA',
        data: [
          { seed: '#1', name: 'BIGETRON ALPHA', stat1: '8 - 6', stat2: '+7 (Sweep Upset)', color: 'text-amber-400', stat2Color: 'text-emerald-400' },
          { seed: '#2', name: 'RRQ HOSHI', stat1: '8 - 6', stat2: '+3', color: 'text-slate-400', stat2Color: 'text-slate-300' },
          { seed: '#3', name: 'ONIC ESPORTS', stat1: '8 - 6', stat2: '+1', color: 'text-rose-400', stat2Color: 'text-rose-400' },
        ],
      },
    ],
    rules: [
      'Match Win % (Persentase Kemenangan Match)',
      'Head-to-Head Matches (Antar tim yang imbang)',
      'Net Game Differential (Total Game Menang - Kalah)',
      'Head-to-Head Game Points (Selisih Game khusus antar tim terkait)',
    ],
    techNote: 'Kasus loop circular 3 tim (A kalahkan B, B kalahkan C, C kalahkan A) diisolasi ke dalam sub-tabel tanpa melibatkan tim luar.',
  },
  pubgm: {
    id: 'pubgm',
    code: '02 // PMWC 2026',
    game: 'PUBG MOBILE',
    formatTag: 'BATTLE ROYALE',
    accentColor: 'text-emerald-400',
    borderColor: 'border-emerald-400/50',
    badgeBg: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/30',
    activeBtnBg: 'bg-emerald-400 text-black',
    title: 'PMWC 10-POINTS MATRIX RESOLVER',
    description: 'Menyelesaikan poin sama pada klasemen Battle Royale resmi PMWC/PMGC berdasarkan jumlah WWCD, Placement Pts, dan Last Match Placement.',
    headers: ['SEED', 'TIM', 'TOTAL PTS', 'WWCD / ELIMS / LAST'],
    scenarios: [
      {
        id: 'pm_1',
        label: 'WWCD DECIDER',
        sub: 'TIED 72 PTS',
        telemetryText: 'RESOLVER: HIGHEST FIRST-PLACE (WWCD) COUNT',
        data: [
          { seed: '#1', name: 'ALTER EGO ARES', stat1: '72 PTS', stat2: '2 WWCD (38 Elims)', color: 'text-emerald-400', stat2Color: 'text-emerald-400' },
          { seed: '#2', name: 'BIGETRON KNIGHTS', stat1: '72 PTS', stat2: '1 WWCD (42 Elims)', color: 'text-slate-400', stat2Color: 'text-slate-300' },
          { seed: '#3', name: 'BOOM ESPORTS', stat1: '72 PTS', stat2: '0 WWCD (52 Elims)', color: 'text-rose-400', stat2Color: 'text-rose-400' },
        ],
      },
      {
        id: 'pm_2',
        label: 'PLACEMENT PTS',
        sub: '1 WWCD EACH',
        telemetryText: 'RESOLVER: TOTAL ACCUMULATIVE PLACEMENT POINTS',
        data: [
          { seed: '#1', name: 'BIGETRON KNIGHTS', stat1: '65 PTS', stat2: '1 WWCD (38 Place Pts)', color: 'text-emerald-400', stat2Color: 'text-emerald-400' },
          { seed: '#2', name: 'TALON ESPORTS', stat1: '65 PTS', stat2: '1 WWCD (30 Place Pts)', color: 'text-slate-400', stat2Color: 'text-slate-300' },
          { seed: '#3', name: 'VAMPIRE ESPORTS', stat1: '65 PTS', stat2: '1 WWCD (26 Place Pts)', color: 'text-rose-400', stat2Color: 'text-rose-400' },
        ],
      },
      {
        id: 'pm_3',
        label: 'LAST MATCH TIE',
        sub: 'SAME KILLS',
        telemetryText: 'RESOLVER: PLACEMENT IN THE FINAL MATCH (#4 vs #9)',
        data: [
          { seed: '#1', name: 'TALON ESPORTS', stat1: '58 PTS', stat2: 'Last Match: #4 (3 Kills)', color: 'text-emerald-400', stat2Color: 'text-emerald-400' },
          { seed: '#2', name: 'ALTER EGO ARES', stat1: '58 PTS', stat2: 'Last Match: #9 (3 Kills)', color: 'text-slate-400', stat2Color: 'text-slate-300' },
          { seed: '#3', name: 'ARCHANGEL', stat1: '51 PTS', stat2: 'Last Match: #14 (1 Kill)', color: 'text-rose-400', stat2Color: 'text-rose-400' },
        ],
      },
    ],
    rules: [
      'Total Overall Points (Placement + Elimination Points)',
      'Total Winner Winner Chicken Dinner (WWCD)',
      'Total Accumulative Placement Points',
      'Total Elimination Points (Jumlah Kill)',
      'Placement Finish Position pada Match Terakhir',
    ],
    techNote: 'Format 10-Pts resmi menggunakan distribusi: 10-6-5-4-3-2-1-1-0-0. WWCD menjadi penentu sebelum kalkulasi kill.',
  },
  valorant: {
    id: 'valorant',
    code: '03 // VCT PACIFIC',
    game: 'VALORANT',
    formatTag: 'TACTICAL FPS',
    accentColor: 'text-cyan-400',
    borderColor: 'border-cyan-400/50',
    badgeBg: 'bg-cyan-400/10 text-cyan-400 border-cyan-400/30',
    activeBtnBg: 'bg-cyan-400 text-black',
    title: 'VCT GROUP STAGE MATRIX RESOLVER',
    description: 'Menghitung peringkat grup VCT Pacific berdasarkan Match W-L, Map Differential, dan Round Differential delta.',
    headers: ['SEED', 'TIM', 'MATCH W-L', 'MAP / RND DIFF'],
    scenarios: [
      {
        id: 'vct_1',
        label: 'MAP DIFF ADV',
        sub: '4-1 RECORD',
        telemetryText: 'RESOLVER: BO3 MAP DIFFERENTIAL (+5 vs +3)',
        data: [
          { seed: '#1', name: 'PAPER REX', stat1: '4 - 1', stat2: '+5 Map Diff (8-3)', color: 'text-cyan-400', stat2Color: 'text-emerald-400' },
          { seed: '#2', name: 'DRX', stat1: '4 - 1', stat2: '+3 Map Diff (8-5)', color: 'text-slate-400', stat2Color: 'text-slate-300' },
          { seed: '#3', name: 'GEN.G', stat1: '4 - 1', stat2: '+2 Map Diff (8-6)', color: 'text-rose-400', stat2Color: 'text-rose-400' },
        ],
      },
      {
        id: 'vct_2',
        label: 'ROUND DIFF',
        sub: 'MAP EQUAL (+2)',
        telemetryText: 'RESOLVER: OVERALL ROUND DIFFERENTIAL (+24 vs +11)',
        data: [
          { seed: '#1', name: 'T1', stat1: '3 - 2', stat2: '+2 Map / +24 Rnd Diff', color: 'text-cyan-400', stat2Color: 'text-emerald-400' },
          { seed: '#2', name: 'ZETA DIVISION', stat1: '3 - 2', stat2: '+2 Map / +11 Rnd Diff', color: 'text-slate-400', stat2Color: 'text-slate-300' },
          { seed: '#3', name: 'TEAM SECRET', stat1: '3 - 2', stat2: '+2 Map / -4 Rnd Diff', color: 'text-rose-400', stat2Color: 'text-rose-400' },
        ],
      },
      {
        id: 'vct_3',
        label: 'DIRECT H2H RND',
        sub: '13-11, 13-9',
        telemetryText: 'RESOLVER: DIRECT MAP ROUNDS (HEAD-TO-HEAD DELTA)',
        data: [
          { seed: '#1', name: 'GEN.G', stat1: '3 - 2', stat2: 'H2H Win (13-11, 13-9)', color: 'text-cyan-400', stat2Color: 'text-emerald-400' },
          { seed: '#2', name: 'RRQ VALORANT', stat1: '3 - 2', stat2: 'H2H Loss (11-13, 9-13)', color: 'text-slate-400', stat2Color: 'text-slate-300' },
          { seed: '#3', name: 'GLOBAL ESPORTS', stat1: '2 - 3', stat2: '-3 Map Diff', color: 'text-rose-400', stat2Color: 'text-rose-400' },
        ],
      },
    ],
    rules: [
      'Match Win-Loss Record (Kemenangan Seri BO3)',
      'Head-to-Head Match Result',
      'Map Differential (Total Map Menang - Kalah)',
      'Round Differential (Total Ronde Menang - Kalah)',
      'Head-to-Head Direct Round Difference',
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

  // Current Game Config
  const currentGameConfig = ruleEnginePresets[selectedGame];
  const currentScenario = currentGameConfig.scenarios[activeScenarioIndex] || currentGameConfig.scenarios[0];

  // Telemetry Boot Sequence
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
      setIntroPhase(4);
      setTimeout(() => {
        setIsIntroDismissed(true);
        setHighlightState('drawing');
      }, 350);
    }, 2800);

    const t5 = setTimeout(() => {
      setHighlightState('clearing');
      setTimeout(() => setHighlightState('done'), 350);
    }, 4400);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
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
      { threshold: 0.25, rootMargin: '-10% 0px -40% 0px' }
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

  const handleSkip = () => {
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
          onClick={handleSkip}
          className="fixed inset-0 z-50 flex cursor-pointer flex-col justify-between select-none"
        >
          <div
            className={`absolute top-0 left-0 right-0 h-1/2 border-b border-white/15 bg-[#05070c] transition-transform duration-300 ease-out z-10 ${
              introPhase === 4 ? '-translate-y-full' : 'translate-y-0'
            }`}
          >
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px] opacity-40" />
            <div className="absolute top-6 left-6 font-mono text-[10px] text-slate-500 flex items-center gap-2">
              <span className="h-2 w-2 border-l border-t border-amber-400" />
              <span>KLASIM // SIMULATION KERNEL V2.4</span>
            </div>
            <div className="absolute top-6 right-6 font-mono text-[10px] text-amber-400/80 hover:text-amber-400 flex items-center gap-1.5">
              <span>[ LEWATI // KLIK DI MANA SAJA ]</span>
              <span className="h-2 w-2 border-r border-t border-amber-400" />
            </div>
          </div>

          <div
            className={`absolute bottom-0 left-0 right-0 h-1/2 border-t border-white/15 bg-[#05070c] transition-transform duration-300 ease-out z-10 ${
              introPhase === 4 ? 'translate-y-full' : 'translate-y-0'
            }`}
          >
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px] opacity-40" />
            <div className="absolute bottom-6 left-6 font-mono text-[10px] text-slate-500 flex items-center gap-2">
              <span className="h-2 w-2 border-l border-b border-amber-400" />
              <span>BROADCAST SAFE AREA: 100% // DETERMINISTIC</span>
            </div>
            <div className="absolute bottom-6 right-6 font-mono text-[10px] text-slate-500 flex items-center gap-2">
              <span>LATENCY: 0.02ms</span>
              <span className="h-2 w-2 border-r border-b border-amber-400" />
            </div>
          </div>

          <div
            className={`relative z-20 mx-auto my-auto w-full max-w-xl p-6 font-mono transition-opacity duration-200 ${
              introPhase === 4 ? 'opacity-0' : 'opacity-100'
            }`}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-amber-400 font-mono text-sm font-black text-black shadow-lg shadow-amber-400/20">
                  K
                </div>
                <div>
                  <div className="text-sm font-black tracking-widest text-white uppercase">
                    KLASIM BROADCAST TELEMETRY
                  </div>
                  <div className="text-[10px] text-slate-500">
                    DIAGNOSTIC MATRIX // CALIBRATING TOURNAMENT ENGINES
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="font-mono text-2xl font-black text-amber-400 tabular-nums">
                  {progressPercent.toString().padStart(2, '0')}%
                </span>
              </div>
            </div>

            <div className="my-5 space-y-2 rounded-xl border border-white/10 bg-black/60 p-4 backdrop-blur-md text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`h-1.5 w-1.5 rounded-full ${introPhase >= 1 ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`} />
                  <span className="text-slate-300 font-medium">MPL ID MATRIX (MLBB DOUBLE RR)</span>
                </div>
                <span className="font-mono font-bold text-emerald-400">
                  {introPhase >= 1 ? 'LOCKED [OK]' : 'INGESTING...'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`h-1.5 w-1.5 rounded-full ${introPhase >= 2 ? 'bg-emerald-400' : introPhase === 1 ? 'bg-amber-400 animate-pulse' : 'bg-slate-700'}`} />
                  <span className="text-slate-300 font-medium">PMWC 10-PTS SYSTEM (PUBGM BR)</span>
                </div>
                <span className={`font-mono font-bold ${introPhase >= 2 ? 'text-emerald-400' : introPhase === 1 ? 'text-amber-400' : 'text-slate-600'}`}>
                  {introPhase >= 2 ? 'LOCKED [OK]' : introPhase === 1 ? 'CALIBRATING...' : 'QUEUED'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`h-1.5 w-1.5 rounded-full ${introPhase >= 3 ? 'bg-emerald-400' : introPhase === 2 ? 'bg-amber-400 animate-pulse' : 'bg-slate-700'}`} />
                  <span className="text-slate-300 font-medium">VCT PACIFIC GROUP STAGE (FPS)</span>
                </div>
                <span className={`font-mono font-bold ${introPhase >= 3 ? 'text-emerald-400' : introPhase === 2 ? 'text-amber-400' : 'text-slate-600'}`}>
                  {introPhase >= 3 ? 'LOCKED [OK]' : introPhase === 2 ? 'CALIBRATING...' : 'QUEUED'}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
                <div className="flex items-center gap-1.5">
                  <span className="inline-block h-3 w-1 bg-amber-400 animate-pulse" />
                  <span className="inline-block h-4 w-1 bg-amber-400 animate-pulse delay-75" />
                  <span className="inline-block h-2 w-1 bg-amber-400 animate-pulse delay-150" />
                  <span className="ml-1 text-[11px] font-bold text-slate-400">ENGINE STATUS:</span>
                </div>
                <span className={`font-mono font-black tracking-wide ${introPhase >= 3 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {introPhase >= 3 ? 'CALIBRATION COMPLETE // READY' : 'INITIALIZING LOGIC PIPELINE...'}
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full bg-amber-400 transition-all duration-150 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between font-mono text-[9px] text-slate-500">
                <span>MEM: 64MB // HASH: 0x9BF284</span>
                <span>TELEMETRY SYNC: ACTIVE</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. AMBIENT BACKGROUND */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/3 h-[600px] w-[600px] rounded-full bg-amber-500/10 blur-[160px]" />
        <div className="absolute top-1/2 -right-40 h-[500px] w-[500px] rounded-full bg-indigo-600/10 blur-[160px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px]" />
      </div>

      {/* 3. FIXED NAVBAR */}
      <Navbar activeSection={activeSection} />

      {/* 4. MAIN PAGE CONTENT */}
      <main className="relative z-10 mx-auto max-w-7xl px-4 pt-28 pb-16 sm:px-6 lg:px-8 space-y-28 font-mono">
        {/* SEKSI 1: BERANDA / HERO */}
        <section
          id="beranda"
          ref={berandaRef}
          className="space-y-8 max-w-4xl pt-4 scroll-mt-32"
        >
          <div className="inline-block border-l-2 border-amber-400 pl-3">
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
              Deterministic Scenario Modeler
            </span>
          </div>

          <h1 className="text-4xl font-black uppercase tracking-tight text-white sm:text-6xl lg:text-7xl leading-[0.95] font-sans">
            <span className="relative inline-block mr-3 overflow-hidden align-top rounded-sm">
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
                className={`relative z-10 inline-block px-1.5 transition-colors duration-300 ${
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

          <div className="grid grid-cols-2 gap-4 border-y border-white/10 py-4 sm:grid-cols-3 text-xs">
            <div>
              <span className="block text-[10px] text-slate-500 uppercase">Tiebreaker Logic</span>
              <span className="font-bold text-slate-200">Head-to-Head & Aggregate</span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-500 uppercase">Supported Formats</span>
              <span className="font-bold text-slate-200">MOBA / BR / FPS</span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="block text-[10px] text-slate-500 uppercase">Export Pipeline</span>
              <span className="font-bold text-slate-200">Excel, PDF & Card PNG</span>
            </div>
          </div>
        </section>

        {/* SEKSI 2: MODUL TURNAMEN */}
        <section
          id="modul"
          ref={modulRef}
          className="space-y-6 pt-6 border-t border-white/10 scroll-mt-32"
        >
          <div className="flex items-center justify-between pb-2">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-300">
                MODUL TURNAMEN RESMI
              </h2>
            </div>
            <span className="text-[10px] text-slate-500">
              3 PRESET TERSEDIA
            </span>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {activeTournaments.map((t) => (
              <div
                key={t.slug}
                className="group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-slate-950/80 p-6 backdrop-blur-xl transition-all duration-300 hover:border-amber-400/50"
              >
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-500">
                      {t.code}
                    </span>
                    <span className={`rounded-md border px-2 py-0.5 text-[9px] font-extrabold uppercase ${t.tagColor}`}>
                      {t.tag}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase">
                      {t.game}
                    </span>
                    <h3 className="mt-1 text-2xl font-black uppercase tracking-tight text-white group-hover:text-amber-400 transition-colors font-sans">
                      {t.title}
                    </h3>
                  </div>

                  <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3 text-[11px] text-slate-400 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Jumlah Tim:</span>
                      <span className="font-bold text-slate-200">{t.teamsCount} Tim Peserta</span>
                    </div>
                    <div className="text-slate-400 pt-1 border-t border-white/5 text-[10px] leading-tight">
                      {t.format}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10">
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
          className="space-y-6 pt-8 border-t border-white/10 scroll-mt-28"
        >
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between pb-2">
            <div>
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-amber-400">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-ping" />
                <span>SCENARIO STRESS-TESTER // MULTI-RULE ENGINE</span>
              </div>
              <h2 className="text-2xl font-black uppercase tracking-tight text-white sm:text-3xl font-sans">
                BAGAIMANA KLASIM MEMECAHKAN TIEBREAKER KUSUT?
              </h2>
            </div>
            <div className="text-[10px] text-slate-500 uppercase flex items-center gap-2">
              <span>ACTIVE PRESET:</span>
              <strong className={currentGameConfig.accentColor}>{currentGameConfig.game}</strong>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-stretch">
            {/* KARTU KIRI: DYNAMIC INTERACTIVE MATRIX (COL 7) */}
            <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-slate-950/80 p-6 backdrop-blur-xl lg:col-span-7 space-y-5">
              <div className="space-y-4">
                {/* Header Matriks */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-amber-400" />
                    <span className="text-xs font-black uppercase tracking-wider text-white">
                      {currentGameConfig.title}
                    </span>
                  </div>
                  <span className={`border px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-widest rounded ${currentGameConfig.badgeBg}`}>
                    {currentGameConfig.formatTag}
                  </span>
                </div>

                <p className="text-xs leading-relaxed text-slate-400">
                  {currentGameConfig.description}
                </p>

                {/* 3 TOMBOL SKENARIO SEJAJAR DALAM 1 BARIS */}
                <div className="grid grid-cols-3 gap-1 rounded-xl border border-white/10 bg-black/50 p-1.5">
                  {currentGameConfig.scenarios.map((sc, idx) => {
                    const isSelected = activeScenarioIndex === idx;
                    return (
                      <button
                        key={sc.id}
                        onClick={() => setActiveScenarioIndex(idx)}
                        className={`flex flex-col items-center justify-center py-2 px-1 text-center rounded-lg transition-all duration-200 ${
                          isSelected
                            ? `${currentGameConfig.activeBtnBg} font-black shadow-md`
                            : 'text-slate-400 hover:text-white hover:bg-white/5 font-bold'
                        }`}
                      >
                        <span className="text-[8px] opacity-70 uppercase tracking-wider">
                          {sc.sub}
                        </span>
                        <span className="text-[11px] truncate w-full">
                          {sc.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* TABEL TELEMETRY STANDINGS */}
                <div className="rounded-xl border border-white/10 bg-black/60 overflow-hidden text-xs">
                  <div className="grid grid-cols-12 bg-white/5 px-4 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-white/10">
                    <span className="col-span-2">{currentGameConfig.headers[0]}</span>
                    <span className="col-span-4">{currentGameConfig.headers[1]}</span>
                    <span className="col-span-3 text-center">{currentGameConfig.headers[2]}</span>
                    <span className="col-span-3 text-right">{currentGameConfig.headers[3]}</span>
                  </div>

                  <div className="divide-y divide-white/5 px-4">
                    {currentScenario.data.map((row, idx) => (
                      <div key={idx} className="grid grid-cols-12 items-center py-2.5">
                        <span className={`col-span-2 font-black ${row.color}`}>{row.seed}</span>
                        <span className="col-span-4 font-bold text-white truncate pr-2">{row.name}</span>
                        <span className="col-span-3 text-center text-slate-400 tabular-nums">{row.stat1}</span>
                        <span className={`col-span-3 text-right font-black tabular-nums ${row.stat2Color}`}>
                          {row.stat2}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Status Bar Bawah Matriks */}
              <div className="flex items-center justify-between border-t border-white/10 pt-3 text-[10px] text-slate-500">
                <span className="flex items-center gap-1.5 truncate max-w-[70%]">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                  <span className="truncate">{currentScenario.telemetryText}</span>
                </span>
                <span className="text-emerald-400 font-bold shrink-0">DETERMINISTIC ✓</span>
              </div>
            </div>

            {/* KARTU KANAN: CLICKABLE RULEBOOK SELECTOR & DETAILS (COL 5) */}
            <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-slate-950/80 p-6 backdrop-blur-xl lg:col-span-5 space-y-5">
              <div className="space-y-4">
                <div className="border-b border-white/10 pb-3 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block">
                      PILIH REGULASI RESMI
                    </span>
                    <h3 className="text-sm font-black uppercase text-white font-sans">
                      HIERARKI TIEBREAKER ENGINE
                    </h3>
                  </div>
                  <span className="text-[9px] text-slate-500 font-mono">
                    [ KLIK UNTUK UJI ]
                  </span>
                </div>

                {/* 3 KARTU SELEKSI GAME (CLICKABLE) */}
                <div className="space-y-2.5 text-xs">
                  {/* Option 1: MLBB */}
                  <button
                    onClick={() => handleGameSelect('mlbb')}
                    className={`w-full text-left rounded-xl border p-3 transition-all duration-200 ${
                      selectedGame === 'mlbb'
                        ? 'border-amber-400 bg-amber-400/10 shadow-md shadow-amber-400/10'
                        : 'border-white/5 bg-black/40 hover:border-white/20 hover:bg-white/[0.02]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-black uppercase ${selectedGame === 'mlbb' ? 'text-amber-400' : 'text-slate-300'}`}>
                        01 // MPL ID (MLBB)
                      </span>
                      <span className="text-[9px] text-slate-500 font-mono">
                        {selectedGame === 'mlbb' ? '● TERPILIH' : 'MOBA BO3'}
                      </span>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed mt-1">
                      Match Win % &rarr; H2H Matches &rarr; Net Game Diff &rarr; H2H Game Points.
                    </p>
                  </button>

                  {/* Option 2: PUBGM */}
                  <button
                    onClick={() => handleGameSelect('pubgm')}
                    className={`w-full text-left rounded-xl border p-3 transition-all duration-200 ${
                      selectedGame === 'pubgm'
                        ? 'border-emerald-400 bg-emerald-400/10 shadow-md shadow-emerald-400/10'
                        : 'border-white/5 bg-black/40 hover:border-white/20 hover:bg-white/[0.02]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-black uppercase ${selectedGame === 'pubgm' ? 'text-emerald-400' : 'text-slate-300'}`}>
                        02 // PMWC (PUBG MOBILE)
                      </span>
                      <span className="text-[9px] text-slate-500 font-mono">
                        {selectedGame === 'pubgm' ? '● TERPILIH' : 'BATTLE ROYALE'}
                      </span>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed mt-1">
                      Total Points (10-pts) &rarr; Total WWCD &rarr; Placement Pts &rarr; Total Elims &rarr; Last Match.
                    </p>
                  </button>

                  {/* Option 3: VALORANT */}
                  <button
                    onClick={() => handleGameSelect('valorant')}
                    className={`w-full text-left rounded-xl border p-3 transition-all duration-200 ${
                      selectedGame === 'valorant'
                        ? 'border-cyan-400 bg-cyan-400/10 shadow-md shadow-cyan-400/10'
                        : 'border-white/5 bg-black/40 hover:border-white/20 hover:bg-white/[0.02]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-black uppercase ${selectedGame === 'valorant' ? 'text-cyan-400' : 'text-slate-300'}`}>
                        03 // VCT PACIFIC (VALORANT)
                      </span>
                      <span className="text-[9px] text-slate-500 font-mono">
                        {selectedGame === 'valorant' ? '● TERPILIH' : 'TACTICAL FPS'}
                      </span>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed mt-1">
                      Match W-L &rarr; Head-to-Head &rarr; Map Diff &rarr; Round Diff &rarr; Direct Round H2H.
                    </p>
                  </button>
                </div>
              </div>

              {/* Dynamic Technical Note Box */}
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5 text-[10px] text-slate-400 mt-auto">
                <span className="font-bold text-slate-200 block mb-1">
                  CATATAN LOGIKA ENGINE // {currentGameConfig.game}
                </span>
                {currentGameConfig.techNote}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* SEKSI 4: TENTANG / FOOTER */}
      <div id="tentang" ref={tentangRef} className="scroll-mt-32">
        <Footer />
      </div>
    </div>
  );
}