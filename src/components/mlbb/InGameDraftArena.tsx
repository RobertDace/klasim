// src/components/mlbb/InGameDraftArena.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { type MLBBHero, heroRelations } from '@/data/mlbb';

interface InGameDraftArenaProps {
  blueTeamName: string;
  redTeamName: string;
  matchTitle: string;
  bluePicks: (MLBBHero | null)[];
  redPicks: (MLBBHero | null)[];
  blueBans: (MLBBHero | null)[];
  redBans: (MLBBHero | null)[];
  draftMode: 'tournament' | 'free';
  currentStepIndex: number;
  tournamentSteps: Array<{ team: 'blue' | 'red'; type: 'ban' | 'pick'; index: number; label: string }>;
  currentStep?: { team: 'blue' | 'red'; type: 'ban' | 'pick'; index: number; label: string };
  isDraftComplete?: boolean;
  usedHeroIds: Set<string>;
  allHeroes: MLBBHero[];
  onSelectHero: (hero: MLBBHero) => void;
  onClearSlot: (team: 'blue' | 'red', type: 'ban' | 'pick', index: number) => void;
  onUndo?: () => void;
  onNextStep: () => void;
  onReset: () => void;
  onOpenPresets: () => void;
  onExportCard: () => void;
  isExportingCard: boolean;
  shareUrlCopied: boolean;
  onCopyShareUrl: () => void;
  onSwitchToBroadcastView?: () => void;
  onOpenAnalysisModal?: () => void;
  onCloseDraft?: () => void;
  matchPrediction: { blueProb: number; redProb: number; advantageReason: string };
}

export default function InGameDraftArena({
  blueTeamName,
  redTeamName,
  matchTitle,
  bluePicks,
  redPicks,
  blueBans,
  redBans,
  draftMode,
  currentStepIndex,
  tournamentSteps,
  currentStep,
  isDraftComplete = false,
  usedHeroIds,
  allHeroes,
  onSelectHero,
  onClearSlot,
  onUndo,
  onNextStep,
  onReset,
  onOpenPresets,
  onExportCard,
  isExportingCard,
  shareUrlCopied,
  onCopyShareUrl,
  onSwitchToBroadcastView,
  onOpenAnalysisModal,
  onCloseDraft,
  matchPrediction,
}: InGameDraftArenaProps) {
  // Molebuild exact role tabs: SEMUA | TANK | MARKSMAN | FIGHTER | ASSASSIN | MAGE | SUPPORT
  const [selectedRole, setSelectedRole] = useState('all'); // Default 'all' to show full roster
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'release' | 'release_desc' | 'name' | 'build'>('release');
  const [isSortOpen, setIsSortOpen] = useState(false);

  // Live Timer Countdown: Default 45s as in Molebuild
  const [timeLeft, setTimeLeft] = useState(45);
  const [isTimerPaused, setIsTimerPaused] = useState(false);

  // Counter Pick Popup state (Molebuild Screenshot 2)
  const [activeCounterHero, setActiveCounterHero] = useState<MLBBHero | null>(null);

  // Reset timer on step change
  useEffect(() => {
    if (!isDraftComplete) {
      setTimeLeft(45);
    }
  }, [currentStepIndex, isDraftComplete]);

  // Tick countdown timer with progress bar
  useEffect(() => {
    if (isTimerPaused || isDraftComplete) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Time expired, auto advance or reset timer
          return 45;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerPaused, isDraftComplete]);

  // Determine current active team and phase
  const activeTeam = currentStep?.team || 'blue';
  const activeType = currentStep?.type || 'ban';
  const isBlueTurn = activeTeam === 'blue';

  const ROLES_TABS = [
    { id: 'all', label: 'SEMUA' },
    { id: 'Tank', label: 'TANK' },
    { id: 'Marksman', label: 'MARKSMAN' },
    { id: 'Fighter', label: 'FIGHTER' },
    { id: 'Assassin', label: 'ASSASSIN' },
    { id: 'Mage', label: 'MAGE' },
    { id: 'Support', label: 'SUPPORT' },
  ];

  // Filter and sort hero pool
  const filteredHeroPool = useMemo(() => {
    let list = allHeroes.filter((h) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = h.name.toLowerCase().includes(q);
        const matchesRole = h.roles.some((r) => r.toLowerCase().includes(q));
        if (!matchesName && !matchesRole) return false;
      }
      if (selectedRole !== 'all') {
        if (!h.roles.some((r) => r.toLowerCase() === selectedRole.toLowerCase())) return false;
      }
      return true;
    });

    if (sortBy === 'release') {
      list = [...list].sort((a, b) => a.moonton_hero_id - b.moonton_hero_id);
    } else if (sortBy === 'release_desc') {
      list = [...list].sort((a, b) => b.moonton_hero_id - a.moonton_hero_id);
    } else if (sortBy === 'name') {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'build') {
      list = [...list].sort((a, b) => (b.stats.offense + b.stats.durability) - (a.stats.offense + a.stats.durability));
    }
    return list;
  }, [allHeroes, searchQuery, selectedRole, sortBy]);

  // Set of banned heroes vs picked heroes for Molebuild badges
  const bannedHeroIds = useMemo(() => {
    const ids = new Set<string>();
    [...blueBans, ...redBans].forEach((h) => {
      if (h) ids.add(h.id);
    });
    return ids;
  }, [blueBans, redBans]);

  const pickedHeroIds = useMemo(() => {
    const ids = new Set<string>();
    [...bluePicks, ...redPicks].forEach((h) => {
      if (h) ids.add(h.id);
    });
    return ids;
  }, [bluePicks, redPicks]);

  // Handle clicking a hero: Immediately picks/bans in tournament mode and shows counter pick card
  const handleHeroClick = (hero: MLBBHero) => {
    if (isDraftComplete) return;
    if (usedHeroIds.has(hero.id)) {
      // If already picked, show counter pick popup
      if (pickedHeroIds.has(hero.id)) {
        setActiveCounterHero(hero);
      }
      return;
    }

    onSelectHero(hero);

    // If picking (not banning), open counter pick popup for that hero
    if (activeType === 'pick') {
      setActiveCounterHero(hero);
    }
  };

  // Helper to get counter heroes for counter pick popup (from data or dynamic recommendation)
  const counterPicksForActiveHero = useMemo(() => {
    if (!activeCounterHero) return [];

    // Find relations in dataset if available
    const rel = heroRelations.find((r) => r.hero_name.toLowerCase() === activeCounterHero.name.toLowerCase());
    if (rel && rel.counters && rel.counters.length > 0) {
      return rel.counters.slice(0, 3).map((c, i) => {
        const found = allHeroes.find((h) => h.name.toLowerCase() === (c.name || '').toLowerCase());
        return {
          name: c.name || 'Hero Counter',
          image: found?.image || activeCounterHero.image,
          votes: 25 - i * 8,
          author: `komunitas_${i + 1}`,
        };
      });
    }

    // Fallback realistic counter heroes based on role
    const counterRole =
      activeCounterHero.roles[0] === 'Tank'
        ? ['Mage', 'Marksman', 'Fighter']
        : activeCounterHero.roles[0] === 'Assassin'
        ? ['Tank', 'Support']
        : ['Assassin', 'Fighter'];

    const candidates = allHeroes
      .filter((h) => h.id !== activeCounterHero.id && counterRole.includes(h.roles[0]))
      .slice(0, 3);

    return candidates.map((c, i) => ({
      name: c.name,
      image: c.image,
      votes: [25, 13, 5][i] || 10,
      author: ['bima_077', 'fande_9922', 'amzkclehd'][i] || 'pro_player',
    }));
  }, [activeCounterHero, allHeroes]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-white/10 bg-[#070913] shadow-2xl select-none font-sans text-white p-2 sm:p-4 min-h-[680px] lg:min-h-[740px] flex flex-col justify-between">
      {/* ========================================================================= */}
      {/* 1. TOP HEADER: LEFT BAN BOX | CENTER PHASE HUD | RIGHT BAN BOX            */}
      {/* ========================================================================= */}
      <div className="flex items-center justify-between gap-2 sm:gap-4 mb-3 sm:mb-4">
        {/* LEFT BAN BOX (Blue Team - 5 Circular Slots) */}
        <div className="rounded-2xl border border-blue-500/40 bg-slate-950/90 p-1.5 sm:p-2.5 flex items-center gap-1.5 sm:gap-2 shadow-[0_0_20px_rgba(59,130,246,0.15)]">
          {blueBans.map((hero, idx) => {
            const isCurrent =
              !isDraftComplete &&
              draftMode === 'tournament' &&
              currentStep?.team === 'blue' &&
              currentStep?.type === 'ban' &&
              currentStep?.index === idx;

            return (
              <div
                key={idx}
                onClick={() => {
                  if (hero) onClearSlot('blue', 'ban', idx);
                }}
                className={`relative h-9 w-9 sm:h-11 sm:w-11 md:h-12 md:w-12 rounded-full overflow-hidden border transition-all flex items-center justify-center bg-black/60 ${
                  isCurrent
                    ? 'border-amber-400 ring-2 ring-amber-400 animate-pulse shadow-[0_0_12px_rgba(251,191,36,0.5)]'
                    : hero
                    ? 'border-blue-400/60 shadow-[0_0_8px_rgba(59,130,246,0.3)] cursor-pointer'
                    : 'border-blue-500/25'
                }`}
                title={hero ? `Ban #${idx + 1}: ${hero.name}` : `Slot Ban Left #${idx + 1}`}
              >
                {hero ? (
                  <>
                    <Image
                      src={hero.image}
                      alt={hero.name}
                      width={48}
                      height={48}
                      className="object-cover h-full w-full grayscale contrast-125 brightness-75"
                      unoptimized
                    />
                    {/* Red diagonal ban slash line */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-[130%] h-[2.5px] bg-rose-500 rotate-45 shadow-[0_0_5px_#ff0055]" />
                    </div>
                  </>
                ) : (
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500/30" />
                )}
              </div>
            );
          })}
        </div>

        {/* CENTER PHASE HUD PILL */}
        <div className="rounded-2xl border border-white/10 bg-slate-950/90 px-4 sm:px-8 py-2 flex flex-col items-center justify-center shadow-xl min-w-[200px] sm:min-w-[260px] relative">
          <div className="flex items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm font-sans font-black tracking-wider uppercase">
            <span className="text-white">
              {isDraftComplete ? 'DRAFT SELESAI' : activeType === 'ban' ? 'FASE BAN' : 'FASE PICK'}
            </span>

            {/* Countdown timer (Green / Lime digits) */}
            <span className="text-lime-400 font-mono text-xl sm:text-2xl font-black">
              {isDraftComplete ? 'OK' : timeLeft}
            </span>

            <span className={isBlueTurn ? 'text-blue-400' : 'text-rose-500'}>
              {isDraftComplete ? '' : isBlueTurn ? 'LEFT TEAM' : 'RIGHT TEAM'}
            </span>

            {/* Pause / Resume Button */}
            {!isDraftComplete && (
              <button
                onClick={() => setIsTimerPaused(!isTimerPaused)}
                className="text-slate-400 hover:text-white p-0.5 ml-1 text-xs"
                title={isTimerPaused ? 'Lanjutkan Timer' : 'Jeda Timer'}
              >
                {isTimerPaused ? '▶' : '||'}
              </button>
            )}
          </div>

          {/* Green Progress Bar */}
          <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden mt-1.5">
            <div
              style={{ width: `${(timeLeft / 45) * 100}%` }}
              className="h-full bg-gradient-to-r from-lime-400 to-emerald-500 transition-all duration-1000"
            />
          </div>
        </div>

        {/* RIGHT BAN BOX (Red Team - 5 Circular Slots) */}
        <div className="rounded-2xl border border-rose-500/40 bg-slate-950/90 p-1.5 sm:p-2.5 flex items-center gap-1.5 sm:gap-2 shadow-[0_0_20px_rgba(244,63,94,0.15)]">
          {redBans.map((hero, idx) => {
            const isCurrent =
              !isDraftComplete &&
              draftMode === 'tournament' &&
              currentStep?.team === 'red' &&
              currentStep?.type === 'ban' &&
              currentStep?.index === idx;

            return (
              <div
                key={idx}
                onClick={() => {
                  if (hero) onClearSlot('red', 'ban', idx);
                }}
                className={`relative h-9 w-9 sm:h-11 sm:w-11 md:h-12 md:w-12 rounded-full overflow-hidden border transition-all flex items-center justify-center bg-black/60 ${
                  isCurrent
                    ? 'border-amber-400 ring-2 ring-amber-400 animate-pulse shadow-[0_0_12px_rgba(251,191,36,0.5)]'
                    : hero
                    ? 'border-rose-400/60 shadow-[0_0_8px_rgba(244,63,94,0.3)] cursor-pointer'
                    : 'border-rose-500/25'
                }`}
                title={hero ? `Ban #${idx + 1}: ${hero.name}` : `Slot Ban Right #${idx + 1}`}
              >
                {hero ? (
                  <>
                    <Image
                      src={hero.image}
                      alt={hero.name}
                      width={48}
                      height={48}
                      className="object-cover h-full w-full grayscale contrast-125 brightness-75"
                      unoptimized
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-[130%] h-[2.5px] bg-rose-500 rotate-45 shadow-[0_0_5px_#ff0055]" />
                    </div>
                  </>
                ) : (
                  <div className="h-1.5 w-1.5 rounded-full bg-rose-500/30" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN 3-COLUMN BODY: LEFT PICKS | CENTER HERO BOARD | RIGHT PICKS       */}
      {/* ========================================================================= */}
      <div className="flex flex-row items-stretch gap-2.5 sm:gap-3.5 md:gap-4 w-full flex-1 min-h-[560px]">
        {/* ======================================================================= */}
        {/* LEFT COLUMN: 5 BLUE TEAM PICK CARDS                                    */}
        {/* ======================================================================= */}
        <div className="w-36 sm:w-44 md:w-48 lg:w-56 shrink-0 flex flex-col justify-between gap-2 py-0.5">
          {bluePicks.map((hero, idx) => {
            const isCurrent =
              !isDraftComplete &&
              draftMode === 'tournament' &&
              currentStep?.team === 'blue' &&
              currentStep?.type === 'pick' &&
              currentStep?.index === idx;

            return (
              <div
                key={idx}
                onClick={() => {
                  if (hero) onClearSlot('blue', 'pick', idx);
                }}
                className={`relative flex-1 min-h-[85px] max-h-[115px] w-full rounded-xl overflow-hidden transition-all duration-200 cursor-pointer flex items-center border ${
                  isCurrent
                    ? 'border-2 border-amber-400 ring-2 ring-amber-400 shadow-[0_0_25px_rgba(251,191,36,0.5)] bg-blue-950/60 scale-[1.02] z-10'
                    : hero
                    ? 'border border-blue-500/40 bg-slate-900/60'
                    : 'border border-blue-500/20 bg-gradient-to-r from-blue-950/40 via-slate-950/70 to-black/80'
                }`}
              >
                {/* Blue Left Accent Bar */}
                <div
                  className={`absolute top-0 bottom-0 left-0 w-1.5 ${
                    isCurrent ? 'bg-amber-400' : 'bg-blue-500'
                  }`}
                />

                {hero ? (
                  <>
                    {/* Full Hero Image filling card */}
                    <Image
                      src={hero.image}
                      alt={hero.name}
                      fill
                      className="object-cover object-top brightness-90"
                      unoptimized
                    />
                    {/* Dark gradient vignette */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                    {/* Hero Name on Bottom Left */}
                    <span className="absolute bottom-1.5 left-2.5 font-sans text-xs sm:text-sm font-bold text-white drop-shadow-md">
                      {hero.name}
                    </span>
                    {/* Clear button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onClearSlot('blue', 'pick', idx);
                      }}
                      className="absolute top-1 right-1 bg-black/80 rounded px-1.5 text-[9px] text-slate-400 hover:text-rose-400 font-mono"
                      title="Hapus Hero"
                    >
                      ✕
                    </button>
                  </>
                ) : (
                  <div className="pl-4 w-full flex items-center justify-between pr-2 text-slate-600 font-bold">
                    <span className="text-xs uppercase font-mono tracking-wider">
                      {isCurrent ? (
                        <span className="text-amber-400 animate-pulse">Memilih...</span>
                      ) : (
                        `Pick ${idx + 1}`
                      )}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ======================================================================= */}
        {/* CENTER COLUMN: THE MOLEBUILD HERO POOL BOARD                            */}
        {/* ======================================================================= */}
        <div className="flex-1 min-w-0 rounded-2xl border border-white/10 bg-[#0c0f18] p-3 sm:p-4 md:p-5 shadow-2xl flex flex-col justify-between relative overflow-hidden">
          {/* If draft is complete, show celebration & match analysis overlay */}
          {isDraftComplete ? (
            <div className="my-auto flex flex-col items-center justify-center text-center p-4 space-y-4 animate-in fade-in zoom-in-95 duration-300">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400/20 via-blue-900/40 to-black border-2 border-amber-400 flex flex-col items-center justify-center shadow-[0_0_30px_rgba(251,191,36,0.5)]">
                <span className="text-2xl font-black text-white font-sans">M</span>
                <span className="text-[7px] font-mono font-bold text-amber-300 tracking-widest">
                  MATCH READY
                </span>
              </div>

              <div>
                <h3 className="font-sans text-xl sm:text-2xl font-black text-amber-300 uppercase tracking-wider">
                  DRAFT SELESAI!
                </h3>
                <p className="text-xs text-slate-300 mt-1 max-w-md">
                  Semua 10 hero pick dan 10 ban telah terkunci dengan sempurna.
                </p>
              </div>

              {/* Match Probability */}
              <div className="w-full max-w-sm rounded-xl border border-white/10 bg-black/60 p-2.5 font-mono text-xs space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className="text-cyan-400">{blueTeamName}: {matchPrediction.blueProb}%</span>
                  <span className="text-slate-500">VS</span>
                  <span className="text-rose-400">{redTeamName}: {matchPrediction.redProb}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden flex">
                  <div style={{ width: `${matchPrediction.blueProb}%` }} className="bg-cyan-500 h-full" />
                  <div style={{ width: `${matchPrediction.redProb}%` }} className="bg-rose-500 h-full" />
                </div>
                <div className="text-[10px] text-slate-400 text-center italic">
                  {matchPrediction.advantageReason}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2 font-mono text-xs">
                <button
                  onClick={onExportCard}
                  disabled={isExportingCard}
                  className="rounded-xl border border-amber-400/50 bg-amber-400 px-4 py-2 font-black text-black hover:bg-amber-300 transition-all cursor-pointer shadow-lg shadow-amber-400/20"
                >
                  📸 {isExportingCard ? 'MEMPROSES...' : 'UNDUH KARTU SHOWDOWN HD'}
                </button>
                <button
                  onClick={onUndo}
                  className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white hover:bg-white/20 transition-all cursor-pointer"
                >
                  ↶ URUNGKAN
                </button>
                <button
                  onClick={onReset}
                  className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-rose-300 hover:bg-rose-500/20 transition-all cursor-pointer"
                >
                  ↺ RESET DRAFT
                </button>
                <button
                  onClick={onOpenAnalysisModal || onSwitchToBroadcastView}
                  className="rounded-xl border border-cyan-400/40 bg-cyan-400/10 px-3 py-2 text-cyan-300 hover:bg-cyan-400 hover:text-black transition-all cursor-pointer font-bold shadow-lg shadow-cyan-400/20"
                >
                  📊 ANALISIS PASCA-DRAFT
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Top Controls inside Center Card: Sort Dropdown & Search Bar */}
              <div className="flex items-center justify-between gap-3 mb-3 shrink-0">
                {/* Sort Button / Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsSortOpen(!isSortOpen)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-black/60 text-xs font-sans text-slate-300 hover:text-white transition-all cursor-pointer"
                  >
                    <span>⇅</span>
                    <span>
                      {sortBy === 'release'
                        ? 'Urutan Rilis'
                        : sortBy === 'release_desc'
                        ? 'Rilis Terbaru'
                        : sortBy === 'name'
                        ? 'Nama (A-Z)'
                        : 'Popularitas'}
                    </span>
                  </button>

                  {isSortOpen && (
                    <div className="absolute left-0 top-full mt-1 w-44 rounded-xl border border-white/10 bg-[#0e121e] p-1 shadow-2xl z-30 font-sans text-xs">
                      <button
                        onClick={() => {
                          setSortBy('release');
                          setIsSortOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors ${
                          sortBy === 'release' ? 'bg-amber-400/20 text-amber-300 font-bold' : 'text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        Urutan Rilis (Official)
                      </button>
                      <button
                        onClick={() => {
                          setSortBy('release_desc');
                          setIsSortOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors ${
                          sortBy === 'release_desc' ? 'bg-amber-400/20 text-amber-300 font-bold' : 'text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        Rilis Terbaru
                      </button>
                      <button
                        onClick={() => {
                          setSortBy('name');
                          setIsSortOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors ${
                          sortBy === 'name' ? 'bg-amber-400/20 text-amber-300 font-bold' : 'text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        Nama (A-Z)
                      </button>
                      <button
                        onClick={() => {
                          setSortBy('build');
                          setIsSortOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors ${
                          sortBy === 'build' ? 'bg-amber-400/20 text-amber-300 font-bold' : 'text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        Popularitas
                      </button>
                    </div>
                  )}
                </div>

                {/* Search Bar */}
                <div className="relative flex-1 max-w-xs">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5 text-slate-500">
                    <svg className="w-3.5 h-3.5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari hero..."
                    className="w-full rounded-xl bg-black/60 border border-white/10 pl-8 pr-7 py-1.5 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-400"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2 top-2 text-slate-400 hover:text-white cursor-pointer"
                    >
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {/* Role Tabs: SEMUA | TANK | MARKSMAN | FIGHTER | ASSASSIN | MAGE | SUPPORT */}
              <div className="flex items-center justify-center gap-2 sm:gap-4 border-b border-white/10 pb-2 mb-3 shrink-0 overflow-x-auto scrollbar-none font-sans text-xs tracking-wider">
                {ROLES_TABS.map((r) => {
                  const isActive = selectedRole === r.id;
                  return (
                    <button
                      key={r.id}
                      onClick={() => setSelectedRole(r.id)}
                      className={`pb-1 transition-all uppercase cursor-pointer shrink-0 font-bold ${
                        isActive
                          ? 'border-b-2 border-amber-400 text-amber-400'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {r.label}
                    </button>
                  );
                })}
              </div>

              {/* =================================================================== */}
              {/* CIRCULAR HERO GRID (MOLEBUILD EXACT STYLE)                          */}
              {/* =================================================================== */}
              <div className="flex-1 overflow-y-auto pr-1 py-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-8 gap-x-2 gap-y-3.5 place-items-center">
                  {filteredHeroPool.map((hero) => {
                    const isBanned = bannedHeroIds.has(hero.id);
                    const isPicked = pickedHeroIds.has(hero.id);
                    const isUsed = isBanned || isPicked;

                    return (
                      <div
                        key={hero.id}
                        onClick={() => handleHeroClick(hero)}
                        className={`group relative flex flex-col items-center cursor-pointer transition-all duration-150 ${
                          isUsed ? 'cursor-pointer hover:scale-105' : 'hover:scale-110'
                        }`}
                      >
                        {/* Circular Avatar */}
                        <div
                          className={`relative h-12 w-12 sm:h-13 sm:w-13 md:h-14 md:w-14 rounded-full overflow-hidden border transition-all flex items-center justify-center ${
                            isUsed
                              ? 'border-white/15 bg-black'
                              : 'border-white/20 bg-slate-900 hover:border-amber-400 hover:shadow-[0_0_12px_rgba(251,191,36,0.6)]'
                          }`}
                        >
                          <Image
                            src={hero.image}
                            alt={hero.name}
                            width={56}
                            height={56}
                            className={`object-cover h-full w-full rounded-full ${
                              isUsed ? 'grayscale contrast-125 brightness-40' : ''
                            }`}
                            unoptimized
                          />

                          {/* DIBAN Overlay Badge (Molebuild Screenshot 1) */}
                          {isBanned && (
                            <div className="absolute inset-0 bg-black/75 rounded-full flex items-center justify-center border border-white/20">
                              <span className="text-[10px] sm:text-[11px] font-sans font-black text-slate-300 uppercase tracking-wider">
                                DIBAN
                              </span>
                            </div>
                          )}

                          {/* DIPILIH Overlay Badge (Molebuild Screenshot 2) */}
                          {isPicked && (
                            <div className="absolute inset-0 bg-black/75 rounded-full flex items-center justify-center border border-white/20">
                              <span className="text-[9px] sm:text-[10px] font-sans font-black text-slate-300 uppercase tracking-wider">
                                DIPILIH
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Hero Name below avatar */}
                        <span
                          className={`text-[10px] sm:text-[11px] font-sans font-medium mt-1 truncate max-w-[62px] sm:max-w-[70px] text-center leading-none ${
                            isUsed ? 'text-slate-500' : 'text-slate-300 group-hover:text-white'
                          }`}
                        >
                          {hero.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Counter Pick Tooltip Floating Card (Molebuild Screenshot 2) */}
              {activeCounterHero && (
                <div className="absolute right-4 bottom-14 w-64 rounded-xl border border-white/15 bg-[#101424]/95 p-3 shadow-2xl backdrop-blur-md z-40 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between border-b border-white/10 pb-1.5 mb-2">
                    <span className="font-sans text-xs font-bold text-white">
                      Counter Pick untuk {activeCounterHero.name}
                    </span>
                    <button
                      onClick={() => setActiveCounterHero(null)}
                      className="text-slate-400 hover:text-white text-xs p-0.5"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="space-y-2">
                    {counterPicksForActiveHero.map((cp, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full overflow-hidden border border-white/20 shrink-0">
                          <Image
                            src={cp.image}
                            alt={cp.name}
                            width={28}
                            height={28}
                            className="object-cover h-full w-full"
                            unoptimized
                          />
                        </div>
                        <div className="min-w-0 flex-1 leading-tight font-sans">
                          <div className="text-xs font-bold text-white">{cp.name}</div>
                          <div className="text-[9px] text-slate-400">
                            {cp.votes} suara • by {cp.author}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-2 pt-1.5 border-t border-white/10 text-[8px] text-slate-500 font-mono">
                    Berdasarkan database counter komunitas
                  </div>
                </div>
              )}

              {/* =================================================================== */}
              {/* BOTTOM ACTIONS: URUNGKAN | RESET DRAFT | TUTUP DRAFT                */}
              {/* =================================================================== */}
              <div className="flex items-center justify-center gap-2 sm:gap-3 pt-3 border-t border-white/10 shrink-0 mt-2 font-sans text-xs">
                {/* ↶ Urungkan (Undo) */}
                <button
                  onClick={onUndo}
                  disabled={currentStepIndex <= 0}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-amber-400/30 bg-black/60 text-amber-400 hover:bg-amber-400/10 transition-all disabled:opacity-30 cursor-pointer font-bold"
                >
                  <span>↶</span>
                  <span>Urungkan</span>
                </button>

                {/* ↺ Reset Draft */}
                <button
                  onClick={onReset}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-white/15 bg-black/60 text-slate-200 hover:bg-white/10 transition-all cursor-pointer font-medium"
                >
                  <span>↺</span>
                  <span>Reset Draft</span>
                </button>

                {/* ✕ Tutup Draft */}
                <button
                  onClick={onCloseDraft || onOpenAnalysisModal || onNextStep}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-bold transition-all shadow-md shadow-rose-600/30 cursor-pointer"
                >
                  <span>✕</span>
                  <span>Tutup Draft</span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* ======================================================================= */}
        {/* RIGHT COLUMN: 5 RED TEAM PICK CARDS                                    */}
        {/* ======================================================================= */}
        <div className="w-36 sm:w-44 md:w-48 lg:w-56 shrink-0 flex flex-col justify-between gap-2 py-0.5">
          {redPicks.map((hero, idx) => {
            const isCurrent =
              !isDraftComplete &&
              draftMode === 'tournament' &&
              currentStep?.team === 'red' &&
              currentStep?.type === 'pick' &&
              currentStep?.index === idx;

            return (
              <div
                key={idx}
                onClick={() => {
                  if (hero) onClearSlot('red', 'pick', idx);
                }}
                className={`relative flex-1 min-h-[85px] max-h-[115px] w-full rounded-xl overflow-hidden transition-all duration-200 cursor-pointer flex items-center justify-end border ${
                  isCurrent
                    ? 'border-2 border-amber-400 ring-2 ring-amber-400 shadow-[0_0_25px_rgba(251,191,36,0.5)] bg-rose-950/60 scale-[1.02] z-10'
                    : hero
                    ? 'border border-rose-500/40 bg-slate-900/60'
                    : 'border border-rose-500/20 bg-gradient-to-l from-rose-950/40 via-slate-950/70 to-black/80'
                }`}
              >
                {/* Red Right Accent Bar */}
                <div
                  className={`absolute top-0 bottom-0 right-0 w-1.5 ${
                    isCurrent ? 'bg-amber-400' : 'bg-rose-500'
                  }`}
                />

                {hero ? (
                  <>
                    {/* Full Hero Image filling card */}
                    <Image
                      src={hero.image}
                      alt={hero.name}
                      fill
                      className="object-cover object-top brightness-90"
                      unoptimized
                    />
                    {/* Dark gradient vignette */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                    {/* Hero Name on Bottom Right */}
                    <span className="absolute bottom-1.5 right-2.5 font-sans text-xs sm:text-sm font-bold text-white drop-shadow-md">
                      {hero.name}
                    </span>
                    {/* Clear button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onClearSlot('red', 'pick', idx);
                      }}
                      className="absolute top-1 left-1 bg-black/80 rounded px-1.5 text-[9px] text-slate-400 hover:text-rose-400 font-mono"
                      title="Hapus Hero"
                    >
                      ✕
                    </button>
                  </>
                ) : (
                  <div className="pr-4 w-full flex items-center justify-between pl-2 text-slate-600 font-bold">
                    <span className="text-xs uppercase font-mono tracking-wider text-right w-full">
                      {isCurrent ? (
                        <span className="text-amber-400 animate-pulse">Memilih...</span>
                      ) : (
                        `Pick ${idx + 1}`
                      )}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
