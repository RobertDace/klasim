// src/components/mlbb/DraftAiAdvisor.tsx
'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import {
  heroes as allHeroes,
  heroTierStats,
  heroRelations,
  type MLBBHero,
  type MLBBTierStat,
} from '@/data/mlbb';

export interface DraftAiAdvisorProps {
  currentStep: { team: 'blue' | 'red'; type: 'ban' | 'pick'; index: number; label: string } | null;
  activeSlot: { team: 'blue' | 'red'; type: 'ban' | 'pick'; index: number } | null;
  draftMode: 'tournament' | 'free';
  bluePicks: (MLBBHero | null)[];
  redPicks: (MLBBHero | null)[];
  blueBans: (MLBBHero | null)[];
  redBans: (MLBBHero | null)[];
  usedHeroIds: Set<string>;
  onSelectHero: (hero: MLBBHero) => void;
}

export interface RecommendationItem {
  hero: MLBBHero;
  category: 'counter' | 'synergy' | 'role' | 'meta' | 'ban';
  reason: string;
  badge: string;
  badgeColor: string;
  score: number;
}

export interface ThreatItem {
  type: 'mobility' | 'sustain' | 'late' | 'damage_type' | 'direct_counter';
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium';
  solutions: string[];
}

export default function DraftAiAdvisor({
  currentStep,
  activeSlot,
  draftMode,
  bluePicks,
  redPicks,
  blueBans,
  redBans,
  usedHeroIds,
  onSelectHero,
}: DraftAiAdvisorProps) {
  const [filterTab, setFilterTab] = useState<'all' | 'counter' | 'synergy' | 'role' | 'meta'>('all');
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  // Active drafting team and phase
  const activeTeam = draftMode === 'tournament' ? currentStep?.team || 'blue' : activeSlot?.team || 'blue';
  const activeType = draftMode === 'tournament' ? currentStep?.type || 'pick' : activeSlot?.type || 'pick';

  const myPicks = useMemo(() => (activeTeam === 'blue' ? bluePicks : redPicks).filter(Boolean) as MLBBHero[], [activeTeam, bluePicks, redPicks]);
  const enemyPicks = useMemo(() => (activeTeam === 'blue' ? redPicks : bluePicks).filter(Boolean) as MLBBHero[], [activeTeam, bluePicks, redPicks]);

  // 1. Calculate Recommendations
  const recommendations = useMemo<RecommendationItem[]>(() => {
    const list: RecommendationItem[] = [];
    const availableHeroes = allHeroes.filter(h => !usedHeroIds.has(h.id));

    // A. If BAN phase: Recommend top meta bans or dangerous enemy pocket picks
    if (activeType === 'ban') {
      // Find highest ban rate & win rate heroes
      const banCandidates = availableHeroes.map(candidate => {
        const tier = heroTierStats.find(t => t.hero_name.toLowerCase() === candidate.name.toLowerCase());
        const banRate = tier ? tier.ban_rate : 0.1;
        const winRate = tier ? tier.win_rate : 0.5;
        const score = banRate * 0.6 + winRate * 0.4;

        return {
          hero: candidate,
          category: 'ban' as const,
          reason: `Ban rate ${(banRate * 100).toFixed(1)}% · Win rate ${(winRate * 100).toFixed(1)}% di Mythic/Glory`,
          badge: tier?.tier ? `PRIORITAS BAN [${tier.tier}]` : 'PRIORITAS BAN',
          badgeColor: 'border-rose-500/50 bg-rose-500/10 text-rose-400',
          score,
        };
      });

      return banCandidates.sort((a, b) => b.score - a.score).slice(0, 6);
    }

    // B. If PICK phase: Evaluate Counters, Synergies, Role Gaps, and S-Tier Meta
    // Check missing lanes in my team
    const myLanes = {
      exp: myPicks.some(h => h.lane.some(l => l.toLowerCase().includes('exp')) || h.roles.includes('Fighter')),
      jungle: myPicks.some(h => h.lane.some(l => l.toLowerCase().includes('jungl')) || h.roles.includes('Assassin')),
      mid: myPicks.some(h => h.lane.some(l => l.toLowerCase().includes('mid')) || h.roles.includes('Mage')),
      gold: myPicks.some(h => h.lane.some(l => l.toLowerCase().includes('gold')) || h.roles.includes('Marksman')),
      roam: myPicks.some(h => h.lane.some(l => l.toLowerCase().includes('roam')) || h.roles.includes('Tank') || h.roles.includes('Support')),
    };

    availableHeroes.forEach(candidate => {
      let score = 0;
      let primaryCategory: 'counter' | 'synergy' | 'role' | 'meta' = 'meta';
      let reason = '';
      let badge = '';
      let badgeColor = '';

      const candRel = heroRelations.find(r => r.hero_name.toLowerCase() === candidate.name.toLowerCase());
      const candTier = heroTierStats.find(t => t.hero_name.toLowerCase() === candidate.name.toLowerCase());

      // 1. Counter Check
      const counteredEnemies: string[] = [];
      enemyPicks.forEach(enemy => {
        const enemyRel = heroRelations.find(r => r.hero_name.toLowerCase() === enemy.name.toLowerCase());
        const enemyCountersMe = enemyRel?.counters?.some((c: any) => c.name.toLowerCase() === candidate.name.toLowerCase());
        const iCounterEnemy = candRel?.counters?.some((c: any) => c.name.toLowerCase() === enemy.name.toLowerCase());

        if (enemyCountersMe || iCounterEnemy) {
          counteredEnemies.push(enemy.name);
        }
      });

      // 2. Synergy Check
      const synergyAllies: string[] = [];
      myPicks.forEach(ally => {
        const allyRel = heroRelations.find(r => r.hero_name.toLowerCase() === ally.name.toLowerCase());
        const allySynergyWithMe = allyRel?.synergies?.some((s: any) => s.name.toLowerCase() === candidate.name.toLowerCase());
        const mySynergyWithAlly = candRel?.synergies?.some((s: any) => s.name.toLowerCase() === ally.name.toLowerCase());

        if (allySynergyWithMe || mySynergyWithAlly) {
          synergyAllies.push(ally.name);
        }
      });

      // 3. Lane Gap Match
      const fillsExp = !myLanes.exp && (candidate.lane.some(l => l.toLowerCase().includes('exp')) || candidate.roles.includes('Fighter'));
      const fillsJungle = !myLanes.jungle && (candidate.lane.some(l => l.toLowerCase().includes('jungl')) || candidate.roles.includes('Assassin'));
      const fillsMid = !myLanes.mid && (candidate.lane.some(l => l.toLowerCase().includes('mid')) || candidate.roles.includes('Mage'));
      const fillsGold = !myLanes.gold && (candidate.lane.some(l => l.toLowerCase().includes('gold')) || candidate.roles.includes('Marksman'));
      const fillsRoam = !myLanes.roam && (candidate.lane.some(l => l.toLowerCase().includes('roam')) || candidate.roles.includes('Tank') || candidate.roles.includes('Support'));
      const fillsAnyGap = fillsExp || fillsJungle || fillsMid || fillsGold || fillsRoam;

      // Base Meta Score
      const winRate = candTier?.win_rate || 0.5;
      score += winRate * 20;

      // Prioritize counter
      if (counteredEnemies.length > 0) {
        score += counteredEnemies.length * 40;
        primaryCategory = 'counter';
        reason = `Counter efektif terhadap ${counteredEnemies.join(' & ')} dengan keunggulan matchup tinggi.`;
        badge = `COUNTER [${counteredEnemies[0]}]`;
        badgeColor = 'border-rose-400/50 bg-rose-400/10 text-rose-400';
      } else if (synergyAllies.length > 0) {
        score += synergyAllies.length * 30;
        primaryCategory = 'synergy';
        reason = `Sinergi kombo kuat dengan ${synergyAllies.join(', ')} untuk teamfight setup.`;
        badge = `SINERGI KOMBO [${synergyAllies[0]}]`;
        badgeColor = 'border-cyan-400/50 bg-cyan-400/10 text-cyan-400';
      } else if (fillsAnyGap) {
        score += 25;
        primaryCategory = 'role';
        const gapName = fillsRoam ? 'Roamer' : fillsJungle ? 'Jungler' : fillsMid ? 'Mid Lane' : fillsGold ? 'Gold Lane' : 'Exp Lane';
        reason = `Mengisi kekosongan peran ${gapName} yang belum ada di komposisi tim Anda.`;
        badge = `ISI PERAN [${gapName.toUpperCase()}]`;
        badgeColor = 'border-emerald-400/50 bg-emerald-400/10 text-emerald-400';
      } else if (candTier && (candTier.tier === 'S+' || candTier.tier === 'S')) {
        score += 20;
        primaryCategory = 'meta';
        reason = `Hero Tier ${candTier.tier} power-pick dengan win rate ${(candTier.win_rate * 100).toFixed(1)}%.`;
        badge = `S34 POWER PICK [${candTier.tier}]`;
        badgeColor = 'border-amber-400/50 bg-amber-400/10 text-amber-400';
      }

      if (score > 15) {
        list.push({
          hero: candidate,
          category: primaryCategory,
          reason,
          badge: badge || 'REKOMENDASI AI',
          badgeColor: badgeColor || 'border-amber-400/40 bg-amber-400/10 text-amber-400',
          score,
        });
      }
    });

    return list.sort((a, b) => b.score - a.score).slice(0, 8);
  }, [activeType, usedHeroIds, myPicks, enemyPicks]);

  // Filtered by sub-tab
  const filteredRecommendations = useMemo(() => {
    if (filterTab === 'all') return recommendations;
    return recommendations.filter(r => r.category === filterTab);
  }, [recommendations, filterTab]);

  // 2. Real-Time Threat Radar Detection
  const threats = useMemo<ThreatItem[]>(() => {
    const list: ThreatItem[] = [];
    if (enemyPicks.length === 0) return list;

    // Check Hyper-Mobility
    const mobilityAssassins = enemyPicks.filter(h =>
      ['fanny', 'ling', 'nolan', 'hayabusa', 'lancelot', 'benedetta', 'joy'].includes(h.slug.toLowerCase())
    );
    if (mobilityAssassins.length > 0) {
      list.push({
        type: 'mobility',
        title: `ANCAMAN MOBILITAS TINGGI (${mobilityAssassins.map(h => h.name).join(', ')})`,
        description: 'Musuh memiliki Assassin kabel/dash sangat lincah yang dapat menyusup ke lini belakang dengan cepat.',
        severity: 'critical',
        solutions: ['Amankan hero Hard CC / Suppression (Khufra, Chou, Saber, Franco, Kaja)', 'Beli Twilight Armor & Antique Cuirass'],
      });
    }

    // Check Sustain & Healing
    const healers = enemyPicks.filter(h =>
      ['estes', 'rafaela', 'angela', 'floryn', 'uranus', 'minotaur'].includes(h.slug.toLowerCase())
    );
    if (healers.length > 0) {
      list.push({
        type: 'sustain',
        title: `KOMPOSISI SUSTAIN / HEALING DERAS (${healers.map(h => h.name).join(', ')})`,
        description: 'Musuh memiliki kemampuan pemulihan HP massal yang membuat teamfight berkepanjangan sangat menguntungkan mereka.',
        severity: 'high',
        solutions: ['Pilih hero anti-regen / early burst (Baxia, Dyrroth, Luo Yi)', 'Wajib beli Dominance Ice, Sea Halberd, atau Glowing Wand'],
      });
    }

    // Check Late Game Scaling Carry
    const lateCarries = enemyPicks.filter(h =>
      ['claude', 'moskov', 'beatrix', 'miya', 'layla', 'cecilion', 'aldous'].includes(h.slug.toLowerCase())
    );
    if (lateCarries.length > 0) {
      list.push({
        type: 'late',
        title: `LATE-GAME HYPER-CARRY (${lateCarries.map(h => h.name).join(', ')})`,
        description: 'Musuh membawa hero scaling tinggi yang akan mendominasi jika pertandingan melebihi menit ke-12.',
        severity: 'high',
        solutions: ['Fokus objektif cepat: amankan Turtle menit 2 & 4, snowballing early game', 'Bawa dive assassin untuk mengunci carry sebelum teamfight'],
      });
    }

    // Check Damage Type Imbalance
    let enemyMagic = 0;
    let enemyPhysical = 0;
    enemyPicks.forEach(h => {
      if (h.roles.includes('Mage') || h.speciality.includes('Magic Damage')) enemyMagic++;
      else enemyPhysical++;
    });
    const total = enemyMagic + enemyPhysical;
    if (total >= 3) {
      if (enemyPhysical / total >= 0.75) {
        list.push({
          type: 'damage_type',
          title: 'DRAFT MUSUH BERAT KE PHYSICAL DAMAGE (75%+)',
          description: 'Musuh kekurangan variasi Magic Damage, membuat pertahanan tim Anda sangat mudah dioptimasi.',
          severity: 'medium',
          solutions: ['Roamer & EXP bisa memprioritaskan Blade Armor & Antique Cuirass lebih awal'],
        });
      } else if (enemyMagic / total >= 0.6) {
        list.push({
          type: 'damage_type',
          title: 'DRAFT MUSUH BERAT KE MAGIC BURST (60%+)',
          description: 'Potensi magic damage burst musuh sangat masif dari mid hingga late game.',
          severity: 'medium',
          solutions: ['Wajib beli Radiant Armor atau Athena Shield di mid-game'],
        });
      }
    }

    // Direct Counter Alerts against My Team
    myPicks.forEach(myHero => {
      const myRel = heroRelations.find(r => r.hero_name.toLowerCase() === myHero.name.toLowerCase());
      enemyPicks.forEach(enemyHero => {
        const isCountered = myRel?.counters?.some((c: any) => c.name.toLowerCase() === enemyHero.name.toLowerCase());
        if (isCountered) {
          list.push({
            type: 'direct_counter',
            title: `PERINGATAN COUNTER: ${enemyHero.name} ➔ ${myHero.name}`,
            description: `${myHero.name} Anda memiliki matchup sulit melawan ${enemyHero.name}. Sesuaikan positioning dan itemisasi.`,
            severity: 'high',
            solutions: [`Bantu ${myHero.name} di fase laning`, 'Jangan duel 1v1 tanpa backup roamer'],
          });
        }
      });
    });

    return list;
  }, [enemyPicks, myPicks]);

  // 3. Dynamic Comparative Draft Power Meter
  const draftPower = useMemo(() => {
    const calcScore = (picks: MLBBHero[], enemy: MLBBHero[]) => {
      if (picks.length === 0) return 50;
      let score = 50;

      // Lane completeness
      const roles = new Set(picks.flatMap(h => h.roles));
      score += Math.min(roles.size * 4, 16);

      // Average durability + offense
      const avgDur = picks.reduce((acc, h) => acc + h.stats.durability, 0) / picks.length;
      const avgOff = picks.reduce((acc, h) => acc + h.stats.offense, 0) / picks.length;
      score += (avgDur + avgOff) * 0.15;

      // Synergy count
      let synCount = 0;
      picks.forEach(h1 => {
        const r = heroRelations.find(rel => rel.hero_name.toLowerCase() === h1.name.toLowerCase());
        picks.forEach(h2 => {
          if (h1.id !== h2.id && r?.synergies?.some((s: any) => s.name.toLowerCase() === h2.name.toLowerCase())) {
            synCount++;
          }
        });
      });
      score += synCount * 3;

      // Counter power against enemy
      let counterPower = 0;
      picks.forEach(h1 => {
        const r = heroRelations.find(rel => rel.hero_name.toLowerCase() === h1.name.toLowerCase());
        enemy.forEach(e => {
          if (r?.counters?.some((c: any) => c.name.toLowerCase() === e.name.toLowerCase())) {
            counterPower++;
          }
        });
      });
      score += counterPower * 4;

      return Math.round(score);
    };

    const validBlue = bluePicks.filter(Boolean) as MLBBHero[];
    const validRed = redPicks.filter(Boolean) as MLBBHero[];

    if (validBlue.length === 0 && validRed.length === 0) {
      return { blue: 50, red: 50, leader: 'EQUAL' };
    }

    const rawBlue = calcScore(validBlue, validRed);
    const rawRed = calcScore(validRed, validBlue);
    const total = rawBlue + rawRed || 100;

    const bluePct = Math.round((rawBlue / total) * 100);
    const redPct = 100 - bluePct;
    const leader = bluePct > 52 ? 'BLUE ADVANTAGE' : redPct > 52 ? 'RED ADVANTAGE' : 'BALANCED';

    return { blue: bluePct, red: redPct, leader };
  }, [bluePicks, redPicks]);

  return (
    <div className="rounded-3xl border border-amber-400/40 bg-gradient-to-b from-[#080c18] via-slate-950 to-black p-4 sm:p-5 backdrop-blur-2xl shadow-2xl shadow-amber-400/5 space-y-4 font-mono text-xs">
      {/* 1. Header Bar with Toggle Collapse */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-400 text-black font-black text-sm shadow-md shadow-amber-400/30">
            AI
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold uppercase tracking-wider text-white text-xs sm:text-sm font-sans">
                AI DRAFT ADVISOR & TACTICAL TELEMETRY
              </span>
              <span className="hidden sm:inline-block rounded border border-amber-400/40 bg-amber-400/10 px-1.5 py-0.5 text-[8px] font-black uppercase text-amber-400">
                PRO COACH v2.4
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono block">
              TARGET: <strong className={activeTeam === 'blue' ? 'text-blue-400' : 'text-rose-400'}>{activeTeam.toUpperCase()} TEAM</strong> · FASE:{' '}
              <strong className="text-amber-400">{activeType.toUpperCase()}</strong>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Quick Tab Filters */}
          {activeType === 'pick' && !isCollapsed && (
            <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-black/50 p-0.5 text-[9px] overflow-x-auto scrollbar-none">
              {[
                { id: 'all', label: 'SEMUA' },
                { id: 'counter', label: 'COUNTER' },
                { id: 'synergy', label: 'SINERGI' },
                { id: 'role', label: 'ISI PERAN' },
                { id: 'meta', label: 'S-TIER' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setFilterTab(tab.id as any)}
                  className={`px-2 py-1 rounded transition-all cursor-pointer whitespace-nowrap ${
                    filterTab === tab.id
                      ? 'bg-amber-400 text-black font-black'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-bold text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            {isCollapsed ? 'TAMPILKAN ▾' : 'SEMBUNYIKAN ▴'}
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <>
          {/* 2. Comparative Draft Power Meter */}
          <div className="rounded-2xl border border-white/10 bg-black/50 p-3 space-y-2">
            <div className="flex items-center justify-between text-[10px]">
              <div className="flex items-center gap-2">
                <span className="font-bold text-blue-400">BLUE TEAM: {draftPower.blue}%</span>
              </div>
              <div className="font-bold text-slate-300 uppercase tracking-widest text-[9px]">
                PREDIKSI EVALUASI DRAFT // <span className="text-amber-400">{draftPower.leader}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-rose-400">RED TEAM: {draftPower.red}%</span>
              </div>
            </div>

            {/* Split Progress Bar */}
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-900 flex">
              <div
                className="h-full bg-blue-500 transition-all duration-500 shadow-[0_0_10px_rgba(59,130,246,0.6)]"
                style={{ width: `${draftPower.blue}%` }}
              />
              <div
                className="h-full bg-rose-500 transition-all duration-500 shadow-[0_0_10px_rgba(244,63,94,0.6)]"
                style={{ width: `${draftPower.red}%` }}
              />
            </div>
          </div>

          {/* 3. Threat Radar Alerts (If any) */}
          {threats.length > 0 && (
            <div className="rounded-2xl border border-rose-500/30 bg-rose-950/20 p-3.5 space-y-2">
              <div className="flex items-center justify-between border-b border-rose-500/20 pb-1.5">
                <div className="flex items-center gap-2 text-rose-400 font-bold uppercase text-[10px] tracking-wider">
                  <span className="h-2 w-2 rounded-full bg-rose-400 animate-ping" />
                  <span>THREAT RADAR // {threats.length} INDIKATOR ANCAMAN MUSUH</span>
                </div>
                <span className="text-[9px] text-rose-300 font-mono">TACTICAL WARNING</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
                {threats.map((t, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-rose-500/20 bg-black/60 p-2.5 space-y-1 text-[10px]"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-black text-rose-300 uppercase tracking-tight truncate pr-1">
                        ⚠️ {t.title}
                      </span>
                      <span className="rounded px-1.5 py-0.2 bg-rose-500/20 text-rose-400 font-bold text-[8px] uppercase shrink-0">
                        {t.severity}
                      </span>
                    </div>
                    <p className="text-slate-400 text-[10px] leading-tight">
                      {t.description}
                    </p>
                    <div className="text-slate-300 pt-1 border-t border-white/5 font-mono text-[9px]">
                      <span className="text-emerald-400 font-bold">SOLUSI: </span>
                      {t.solutions.join(' · ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. Strategic Recommendations Grid */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                REKOMENDASI OPSI TERBAIK ({filteredRecommendations.length} HERO TERFILTER):
              </span>
              <span className="text-[9px] text-slate-500 font-mono">
                [ KLIK HERO UNTUK LANGSUNG MEMILIH ]
              </span>
            </div>

            {filteredRecommendations.length === 0 ? (
              <div className="rounded-xl border border-white/10 bg-black/40 p-4 text-center text-slate-400 text-xs">
                Tidak ada rekomendasi spesifik untuk kategori ini. Pilih hero bebas dari kolam bawah.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {filteredRecommendations.map((rec) => (
                  <div
                    key={rec.hero.id}
                    onClick={() => onSelectHero(rec.hero)}
                    className="group relative flex flex-col justify-between rounded-xl border border-white/10 bg-black/60 p-2.5 hover:border-amber-400 hover:bg-slate-900 transition-all cursor-pointer shadow-md"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={`rounded-md border px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider truncate max-w-[140px] ${rec.badgeColor}`}>
                          {rec.badge}
                        </span>
                        <span className="text-[9px] text-amber-400 font-bold tabular-nums">
                          SCORE {Math.round(rec.score)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <div className="relative h-11 w-11 rounded-lg overflow-hidden border border-white/15 bg-slate-900 shrink-0 group-hover:border-amber-400 transition-colors">
                          <Image
                            src={rec.hero.image}
                            alt={rec.hero.name}
                            fill
                            sizes="44px"
                            className="object-cover"
                          />
                        </div>
                        <div className="truncate">
                          <div className="font-sans font-black text-white text-xs uppercase group-hover:text-amber-400 transition-colors truncate">
                            {rec.hero.name}
                          </div>
                          <div className="text-[9px] text-slate-400 truncate">
                            {rec.hero.roles.join(', ')} · {rec.hero.lane[0] || 'Flex'}
                          </div>
                        </div>
                      </div>

                      <p className="text-[10px] text-slate-400 leading-tight line-clamp-2">
                        {rec.reason}
                      </p>
                    </div>

                    <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between text-[9px] font-bold">
                      <span className="text-amber-400 group-hover:underline">
                        + Pilih {rec.hero.name}
                      </span>
                      <span className="text-slate-500">→</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
