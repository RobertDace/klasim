// src/app/mlbb/draft/page.tsx
'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import {
  heroes as allHeroes,
  heroTierStats,
  heroRelations,
  type MLBBHero,
  type MLBBTierStat,
  type MLBBHeroRelation,
} from '@/data/mlbb';
import DraftAiAdvisor from '@/components/mlbb/DraftAiAdvisor';

interface DraftSlot {
  type: 'ban' | 'pick';
  team: 'blue' | 'red';
  index: number;
  hero: MLBBHero | null;
}

export default function DraftSimulatorPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [draftMode, setDraftMode] = useState<'tournament' | 'free'>('tournament');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // 5 Bans & 5 Picks per team (Official Tournament Format)
  const [blueBans, setBlueBans] = useState<(MLBBHero | null)[]>([null, null, null, null, null]);
  const [redBans, setRedBans] = useState<(MLBBHero | null)[]>([null, null, null, null, null]);
  const [bluePicks, setBluePicks] = useState<(MLBBHero | null)[]>([null, null, null, null, null]);
  const [redPicks, setRedPicks] = useState<(MLBBHero | null)[]>([null, null, null, null, null]);

  // Selected slot for free mode
  const [activeSlot, setActiveSlot] = useState<{ team: 'blue' | 'red'; type: 'ban' | 'pick'; index: number } | null>({
    team: 'blue',
    type: 'ban',
    index: 0,
  });

  // Tournament sequence
  // P1 Bans: Blue 0, Red 0, Blue 1, Red 1, Blue 2, Red 2 (6 bans)
  // P1 Picks: Blue 0, Red 0, Red 1, Blue 1, Blue 2, Red 2 (6 picks)
  // P2 Bans: Red 3, Blue 3, Red 4, Blue 4 (4 bans)
  // P2 Picks: Red 3, Blue 3, Blue 4, Red 4 (4 picks)
  const tournamentSteps: Array<{ team: 'blue' | 'red'; type: 'ban' | 'pick'; index: number; label: string }> = [
    // Phase 1 Bans
    { team: 'blue', type: 'ban', index: 0, label: 'BLUE BAN 1' },
    { team: 'red', type: 'ban', index: 0, label: 'RED BAN 1' },
    { team: 'blue', type: 'ban', index: 1, label: 'BLUE BAN 2' },
    { team: 'red', type: 'ban', index: 1, label: 'RED BAN 2' },
    { team: 'blue', type: 'ban', index: 2, label: 'BLUE BAN 3' },
    { team: 'red', type: 'ban', index: 2, label: 'RED BAN 3' },
    // Phase 1 Picks
    { team: 'blue', type: 'pick', index: 0, label: 'BLUE PICK 1' },
    { team: 'red', type: 'pick', index: 0, label: 'RED PICK 1' },
    { team: 'red', type: 'pick', index: 1, label: 'RED PICK 2' },
    { team: 'blue', type: 'pick', index: 1, label: 'BLUE PICK 2' },
    { team: 'blue', type: 'pick', index: 2, label: 'BLUE PICK 3' },
    { team: 'red', type: 'pick', index: 2, label: 'RED PICK 3' },
    // Phase 2 Bans
    { team: 'red', type: 'ban', index: 3, label: 'RED BAN 4' },
    { team: 'blue', type: 'ban', index: 3, label: 'BLUE BAN 4' },
    { team: 'red', type: 'ban', index: 4, label: 'RED BAN 5' },
    { team: 'blue', type: 'ban', index: 4, label: 'BLUE BAN 5' },
    // Phase 2 Picks
    { team: 'red', type: 'pick', index: 3, label: 'RED PICK 4' },
    { team: 'blue', type: 'pick', index: 3, label: 'BLUE PICK 4' },
    { team: 'blue', type: 'pick', index: 4, label: 'BLUE PICK 5' },
    { team: 'red', type: 'pick', index: 4, label: 'RED PICK 5' },
  ];

  const currentStep = tournamentSteps[currentStepIndex];

  // Set of all drafted / banned hero IDs
  const usedHeroIds = useMemo(() => {
    const ids = new Set<string>();
    [...blueBans, ...redBans, ...bluePicks, ...redPicks].forEach(h => {
      if (h) ids.add(h.id);
    });
    return ids;
  }, [blueBans, redBans, bluePicks, redPicks]);

  // Filter hero pool
  const filteredHeroPool = useMemo(() => {
    return allHeroes.filter(h => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = h.name.toLowerCase().includes(q);
        const matchesRole = h.roles.some(r => r.toLowerCase().includes(q));
        if (!matchesName && !matchesRole) return false;
      }
      if (selectedRole !== 'all') {
        if (!h.roles.some(r => r.toLowerCase() === selectedRole.toLowerCase())) return false;
      }
      return true;
    });
  }, [searchQuery, selectedRole]);

  // Handle hero selection
  const handleSelectHero = (hero: MLBBHero) => {
    if (usedHeroIds.has(hero.id)) return; // already picked or banned

    if (draftMode === 'tournament') {
      if (!currentStep) return;
      if (currentStep.team === 'blue') {
        if (currentStep.type === 'ban') {
          const next = [...blueBans];
          next[currentStep.index] = hero;
          setBlueBans(next);
        } else {
          const next = [...bluePicks];
          next[currentStep.index] = hero;
          setBluePicks(next);
        }
      } else {
        if (currentStep.type === 'ban') {
          const next = [...redBans];
          next[currentStep.index] = hero;
          setRedBans(next);
        } else {
          const next = [...redPicks];
          next[currentStep.index] = hero;
          setRedPicks(next);
        }
      }

      if (currentStepIndex < tournamentSteps.length - 1) {
        setCurrentStepIndex(currentStepIndex + 1);
      }
    } else {
      // Free mode
      if (!activeSlot) return;
      if (activeSlot.team === 'blue') {
        if (activeSlot.type === 'ban') {
          const next = [...blueBans];
          next[activeSlot.index] = hero;
          setBlueBans(next);
        } else {
          const next = [...bluePicks];
          next[activeSlot.index] = hero;
          setBluePicks(next);
        }
      } else {
        if (activeSlot.type === 'ban') {
          const next = [...redBans];
          next[activeSlot.index] = hero;
          setRedBans(next);
        } else {
          const next = [...redPicks];
          next[activeSlot.index] = hero;
          setRedPicks(next);
        }
      }
    }
  };

  const handleClearSlot = (team: 'blue' | 'red', type: 'ban' | 'pick', index: number) => {
    if (team === 'blue') {
      if (type === 'ban') {
        const next = [...blueBans];
        next[index] = null;
        setBlueBans(next);
      } else {
        const next = [...bluePicks];
        next[index] = null;
        setBluePicks(next);
      }
    } else {
      if (type === 'ban') {
        const next = [...redBans];
        next[index] = null;
        setRedBans(next);
      } else {
        const next = [...redPicks];
        next[index] = null;
        setRedPicks(next);
      }
    }
  };

  const handleResetDraft = () => {
    setBlueBans([null, null, null, null, null]);
    setRedBans([null, null, null, null, null]);
    setBluePicks([null, null, null, null, null]);
    setRedPicks([null, null, null, null, null]);
    setCurrentStepIndex(0);
    setActiveSlot({ team: 'blue', type: 'ban', index: 0 });
  };

  // Team Synergy & Balance Analysis
  const analyzeTeam = (picks: (MLBBHero | null)[], enemyPicks: (MLBBHero | null)[]) => {
    const validPicks = picks.filter(Boolean) as MLBBHero[];
    const validEnemies = enemyPicks.filter(Boolean) as MLBBHero[];

    // Lane coverage
    const lanesCovered = {
      exp: validPicks.some(h => h.lane.some(l => l.toLowerCase().includes('exp')) || h.roles.includes('Fighter')),
      jungle: validPicks.some(h => h.lane.some(l => l.toLowerCase().includes('jungl')) || h.roles.includes('Assassin')),
      mid: validPicks.some(h => h.lane.some(l => l.toLowerCase().includes('mid')) || h.roles.includes('Mage')),
      gold: validPicks.some(h => h.lane.some(l => l.toLowerCase().includes('gold')) || h.roles.includes('Marksman')),
      roam: validPicks.some(h => h.lane.some(l => l.toLowerCase().includes('roam')) || h.roles.includes('Tank') || h.roles.includes('Support')),
    };

    // Damage type estimation
    let magicCount = 0;
    let physicalCount = 0;
    validPicks.forEach(h => {
      if (h.roles.includes('Mage') || h.speciality.includes('Magic Damage')) magicCount++;
      else physicalCount++;
    });
    const totalDmg = magicCount + physicalCount || 1;
    const magicRatio = Math.round((magicCount / totalDmg) * 100);
    const physicalRatio = Math.round((physicalCount / totalDmg) * 100);

    // CC & Durability score
    const avgDurability = validPicks.length > 0
      ? Math.round(validPicks.reduce((acc, h) => acc + h.stats.durability, 0) / validPicks.length)
      : 0;
    const avgOffense = validPicks.length > 0
      ? Math.round(validPicks.reduce((acc, h) => acc + h.stats.offense, 0) / validPicks.length)
      : 0;

    // Detect Counter Warnings
    const warnings: string[] = [];
    validPicks.forEach(myHero => {
      const relation = heroRelations.find(r => r.hero_name.toLowerCase() === myHero.name.toLowerCase());
      validEnemies.forEach(enemyHero => {
        const isCountered = relation?.counters?.some((c: any) => c.name.toLowerCase() === enemyHero.name.toLowerCase());
        if (isCountered) {
          warnings.push(`${enemyHero.name} meng-counter ${myHero.name}`);
        }
      });
    });

    return {
      lanesCovered,
      magicRatio,
      physicalRatio,
      avgDurability,
      avgOffense,
      warnings,
      count: validPicks.length,
    };
  };

  const blueAnalysis = useMemo(() => analyzeTeam(bluePicks, redPicks), [bluePicks, redPicks]);
  const redAnalysis = useMemo(() => analyzeTeam(redPicks, bluePicks), [redPicks, bluePicks]);

  const rolesList = ['all', 'Tank', 'Fighter', 'Assassin', 'Mage', 'Marksman', 'Support'];

  return (
    <div className="min-h-screen bg-[#05070c] text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-black">
      <Navbar activeSection="mlbb" />

      <main className="flex-1 pt-24 pb-20 px-3.5 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-6">
        {/* Top Header & Mode Toggles */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-amber-400">
                KLASIM DRAFT SIMULATOR V2.4 // 5V5 TOURNAMENT ENGINE
              </span>
            </div>
            <h1 className="font-sans text-2xl sm:text-3xl font-black uppercase text-white mt-1">
              SIMULATOR DRAFT PICK & BAN TURNAMEN
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Mode Switcher */}
            <div className="flex rounded-xl border border-white/10 bg-slate-950/80 p-1 font-mono text-xs">
              <button
                onClick={() => setDraftMode('tournament')}
                className={`rounded-lg px-3 py-1.5 transition-all cursor-pointer ${
                  draftMode === 'tournament'
                    ? 'bg-amber-400 text-black font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                TURNAMEN RESMI (STEP)
              </button>
              <button
                onClick={() => setDraftMode('free')}
                className={`rounded-lg px-3 py-1.5 transition-all cursor-pointer ${
                  draftMode === 'free'
                    ? 'bg-amber-400 text-black font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                FREE DRAFT (BEBAS)
              </button>
            </div>

            <button
              onClick={handleResetDraft}
              className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 font-mono text-xs font-bold text-rose-300 hover:bg-rose-500/20 transition-all cursor-pointer"
            >
              ↺ Reset Draft
            </button>
          </div>
        </div>

        {/* Tournament Phase Prompt Banner */}
        {draftMode === 'tournament' && (
          <div className={`flex items-center justify-between rounded-2xl border p-4 font-mono text-xs transition-all ${
            currentStep?.team === 'blue'
              ? 'border-blue-500/40 bg-blue-950/30 text-blue-200'
              : 'border-rose-500/40 bg-rose-950/30 text-rose-200'
          }`}>
            <div className="flex items-center gap-3">
              <span className="h-3 w-3 rounded-full animate-ping bg-amber-400" />
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest block">
                  GILIRAN SAAT INI (LANGKAH {currentStepIndex + 1} DARI {tournamentSteps.length})
                </span>
                <span className="text-base font-black uppercase text-white">
                  {currentStep?.label}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400 hidden sm:inline">PILIH HERO DARI POOL DI BAWAH</span>
              <button
                onClick={() => {
                  if (currentStepIndex < tournamentSteps.length - 1) {
                    setCurrentStepIndex(currentStepIndex + 1);
                  }
                }}
                className="rounded-lg bg-white/10 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-white/20 transition-colors"
              >
                Lewati →
              </button>
            </div>
          </div>
        )}

        {/* AI Draft Advisor & Tactical Telemetry Engine */}
        <DraftAiAdvisor
          currentStep={currentStep || null}
          activeSlot={activeSlot}
          draftMode={draftMode}
          bluePicks={bluePicks}
          redPicks={redPicks}
          blueBans={blueBans}
          redBans={redBans}
          usedHeroIds={usedHeroIds}
          onSelectHero={handleSelectHero}
        />

        {/* 5v5 Arena Board Layout (Blue vs Red) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* BLUE TEAM (6 Cols) */}
          <div className="lg:col-span-6 rounded-3xl border border-blue-500/30 bg-gradient-to-br from-blue-950/20 via-[#060812] to-black p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-blue-500/20 pb-2">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-400" />
                <span className="font-sans text-base font-black uppercase text-blue-400">BLUE TEAM</span>
              </div>
              <span className="font-mono text-[10px] text-slate-400">FIRST PICK ADVANTAGE</span>
            </div>

            {/* Blue Bans (5 slots) */}
            <div>
              <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 block mb-1.5">
                BANS ({blueBans.filter(Boolean).length}/5)
              </span>
              <div className="grid grid-cols-5 gap-2">
                {blueBans.map((h, i) => {
                  const isCurrent = draftMode === 'tournament' && currentStep?.team === 'blue' && currentStep?.type === 'ban' && currentStep?.index === i;
                  return (
                    <div
                      key={i}
                      onClick={() => {
                        if (draftMode === 'free') setActiveSlot({ team: 'blue', type: 'ban', index: i });
                      }}
                      className={`relative aspect-square rounded-xl border overflow-hidden flex items-center justify-center bg-black/60 cursor-pointer transition-all ${
                        isCurrent
                          ? 'border-amber-400 ring-2 ring-amber-400 animate-pulse'
                          : 'border-white/10 hover:border-blue-400/50'
                      }`}
                    >
                      {h ? (
                        <>
                          <img src={h.image} alt={h.name} className="h-full w-full object-cover grayscale" />
                          <div className="absolute inset-0 bg-rose-950/40 flex items-center justify-center">
                            <span className="text-rose-400 font-bold text-xs">✕</span>
                          </div>
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              handleClearSlot('blue', 'ban', i);
                            }}
                            className="absolute top-0.5 right-0.5 bg-black/80 rounded px-1 text-[8px] text-slate-400 hover:text-white"
                          >
                            ✕
                          </button>
                        </>
                      ) : (
                        <span className="font-mono text-[9px] text-slate-600">BAN {i + 1}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Blue Picks (5 slots) */}
            <div className="space-y-2">
              <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 block">
                PICKS ({bluePicks.filter(Boolean).length}/5)
              </span>
              <div className="space-y-2">
                {bluePicks.map((h, i) => {
                  const isCurrent = draftMode === 'tournament' && currentStep?.team === 'blue' && currentStep?.type === 'pick' && currentStep?.index === i;
                  return (
                    <div
                      key={i}
                      onClick={() => {
                        if (draftMode === 'free') setActiveSlot({ team: 'blue', type: 'pick', index: i });
                      }}
                      className={`relative flex items-center justify-between rounded-xl border p-2 bg-black/50 transition-all cursor-pointer ${
                        isCurrent
                          ? 'border-blue-400 ring-2 ring-blue-400 bg-blue-950/40'
                          : 'border-white/10 hover:border-blue-400/40'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 rounded-lg border border-white/10 overflow-hidden bg-slate-900 shrink-0">
                          {h ? (
                            <img src={h.image} alt={h.name} className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center font-mono text-[10px] text-slate-600">
                              P{i + 1}
                            </div>
                          )}
                        </div>
                        <div>
                          <span className="font-sans text-sm font-black uppercase text-white block">
                            {h ? h.name : `Slot Pick #${i + 1}`}
                          </span>
                          <span className="font-mono text-[10px] text-slate-400 block">
                            {h ? `${h.roles.join(', ')} · ${h.lane[0] || 'Flex'}` : 'Menunggu pilihan hero'}
                          </span>
                        </div>
                      </div>

                      {h && (
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            handleClearSlot('blue', 'pick', i);
                          }}
                          className="font-mono text-xs text-slate-500 hover:text-rose-400 p-1"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Blue Team Composition Metrics */}
            <div className="rounded-2xl border border-white/10 bg-black/40 p-3 space-y-2 font-mono text-xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">
                KOMPOSISI BLUE TEAM:
              </span>
              <div className="flex flex-wrap gap-1.5 text-[10px]">
                {Object.entries(blueAnalysis.lanesCovered).map(([lane, ok]) => (
                  <span
                    key={lane}
                    className={`rounded px-2 py-0.5 font-bold uppercase ${
                      ok ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {lane}: {ok ? '✓' : '✗'}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between text-[10px] pt-1 border-t border-white/5">
                <span>DAMAGE: {blueAnalysis.physicalRatio}% Phy / {blueAnalysis.magicRatio}% Mag</span>
                <span>DURABILITAS: {blueAnalysis.avgDurability}%</span>
              </div>
              {blueAnalysis.warnings.length > 0 && (
                <div className="text-[10px] text-rose-400 space-y-0.5 pt-1">
                  {blueAnalysis.warnings.map((w, idx) => (
                    <div key={idx}>⚠️ {w}</div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RED TEAM (6 Cols) */}
          <div className="lg:col-span-6 rounded-3xl border border-rose-500/30 bg-gradient-to-br from-rose-950/20 via-[#060812] to-black p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-rose-500/20 pb-2">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                <span className="font-sans text-base font-black uppercase text-rose-400">RED TEAM</span>
              </div>
              <span className="font-mono text-[10px] text-slate-400">LAST PICK COUNTER ADVANTAGE</span>
            </div>

            {/* Red Bans (5 slots) */}
            <div>
              <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 block mb-1.5">
                BANS ({redBans.filter(Boolean).length}/5)
              </span>
              <div className="grid grid-cols-5 gap-2">
                {redBans.map((h, i) => {
                  const isCurrent = draftMode === 'tournament' && currentStep?.team === 'red' && currentStep?.type === 'ban' && currentStep?.index === i;
                  return (
                    <div
                      key={i}
                      onClick={() => {
                        if (draftMode === 'free') setActiveSlot({ team: 'red', type: 'ban', index: i });
                      }}
                      className={`relative aspect-square rounded-xl border overflow-hidden flex items-center justify-center bg-black/60 cursor-pointer transition-all ${
                        isCurrent
                          ? 'border-amber-400 ring-2 ring-amber-400 animate-pulse'
                          : 'border-white/10 hover:border-rose-400/50'
                      }`}
                    >
                      {h ? (
                        <>
                          <img src={h.image} alt={h.name} className="h-full w-full object-cover grayscale" />
                          <div className="absolute inset-0 bg-rose-950/40 flex items-center justify-center">
                            <span className="text-rose-400 font-bold text-xs">✕</span>
                          </div>
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              handleClearSlot('red', 'ban', i);
                            }}
                            className="absolute top-0.5 right-0.5 bg-black/80 rounded px-1 text-[8px] text-slate-400 hover:text-white"
                          >
                            ✕
                          </button>
                        </>
                      ) : (
                        <span className="font-mono text-[9px] text-slate-600">BAN {i + 1}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Red Picks (5 slots) */}
            <div className="space-y-2">
              <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 block">
                PICKS ({redPicks.filter(Boolean).length}/5)
              </span>
              <div className="space-y-2">
                {redPicks.map((h, i) => {
                  const isCurrent = draftMode === 'tournament' && currentStep?.team === 'red' && currentStep?.type === 'pick' && currentStep?.index === i;
                  return (
                    <div
                      key={i}
                      onClick={() => {
                        if (draftMode === 'free') setActiveSlot({ team: 'red', type: 'pick', index: i });
                      }}
                      className={`relative flex items-center justify-between rounded-xl border p-2 bg-black/50 transition-all cursor-pointer ${
                        isCurrent
                          ? 'border-rose-400 ring-2 ring-rose-400 bg-rose-950/40'
                          : 'border-white/10 hover:border-rose-400/40'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 rounded-lg border border-white/10 overflow-hidden bg-slate-900 shrink-0">
                          {h ? (
                            <img src={h.image} alt={h.name} className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center font-mono text-[10px] text-slate-600">
                              P{i + 1}
                            </div>
                          )}
                        </div>
                        <div>
                          <span className="font-sans text-sm font-black uppercase text-white block">
                            {h ? h.name : `Slot Pick #${i + 1}`}
                          </span>
                          <span className="font-mono text-[10px] text-slate-400 block">
                            {h ? `${h.roles.join(', ')} · ${h.lane[0] || 'Flex'}` : 'Menunggu pilihan hero'}
                          </span>
                        </div>
                      </div>

                      {h && (
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            handleClearSlot('red', 'pick', i);
                          }}
                          className="font-mono text-xs text-slate-500 hover:text-rose-400 p-1"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Red Team Composition Metrics */}
            <div className="rounded-2xl border border-white/10 bg-black/40 p-3 space-y-2 font-mono text-xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">
                KOMPOSISI RED TEAM:
              </span>
              <div className="flex flex-wrap gap-1.5 text-[10px]">
                {Object.entries(redAnalysis.lanesCovered).map(([lane, ok]) => (
                  <span
                    key={lane}
                    className={`rounded px-2 py-0.5 font-bold uppercase ${
                      ok ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {lane}: {ok ? '✓' : '✗'}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between text-[10px] pt-1 border-t border-white/5">
                <span>DAMAGE: {redAnalysis.physicalRatio}% Phy / {redAnalysis.magicRatio}% Mag</span>
                <span>DURABILITAS: {redAnalysis.avgDurability}%</span>
              </div>
              {redAnalysis.warnings.length > 0 && (
                <div className="text-[10px] text-rose-400 space-y-0.5 pt-1">
                  {redAnalysis.warnings.map((w, idx) => (
                    <div key={idx}>⚠️ {w}</div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Hero Pool Selection Grid */}
        <div className="rounded-3xl border border-white/10 bg-[#070a14] p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-amber-400">
                KOLAM HERO AKTIF ({filteredHeroPool.length} TERSEDIA)
              </span>
              <span className="text-slate-500 font-mono text-[10px] block">
                KLIK HERO UNTUK MENEMPATKAN KE DALAM SLOT DRAFT
              </span>
            </div>

            {/* Search Input */}
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Cari hero draft..."
              className="rounded-xl border border-white/10 bg-black/60 px-3 py-1.5 font-sans text-xs text-white placeholder-slate-500 outline-none focus:border-amber-400 w-full sm:w-64"
            />
          </div>

          {/* Role Filter Pills */}
          <div className="flex flex-wrap gap-1.5">
            {rolesList.map(role => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`rounded-lg px-2.5 py-1 font-mono text-[11px] font-bold uppercase transition-all cursor-pointer ${
                  selectedRole === role
                    ? 'bg-amber-400 text-black'
                    : 'border border-white/10 bg-white/5 text-slate-300 hover:text-white'
                }`}
              >
                {role === 'all' ? 'SEMUA ROLE' : role}
              </button>
            ))}
          </div>

          {/* Hero Grid */}
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 max-h-[420px] overflow-y-auto p-1">
            {filteredHeroPool.map(hero => {
              const isUsed = usedHeroIds.has(hero.id);
              return (
                <button
                  key={hero.id}
                  disabled={isUsed}
                  onClick={() => handleSelectHero(hero)}
                  className={`group relative aspect-[3/4] rounded-xl overflow-hidden border p-1 text-center transition-all ${
                    isUsed
                      ? 'border-transparent opacity-20 grayscale pointer-events-none'
                      : 'border-white/10 bg-black/40 hover:border-amber-400 hover:scale-105 cursor-pointer shadow'
                  }`}
                >
                  <img src={hero.image} alt={hero.name} className="h-full w-full object-cover rounded-lg" />
                  <div className="absolute inset-x-0 bottom-0 bg-black/80 px-1 py-0.5">
                    <span className="font-sans text-[10px] font-bold text-white block truncate">
                      {hero.name}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
