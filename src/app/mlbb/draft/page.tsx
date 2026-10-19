'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toPng } from 'html-to-image';
import {
  heroes as allHeroes,
  heroTierStats,
  heroRelations,
  type MLBBHero,
  type MLBBTierStat,
  type MLBBHeroRelation,
} from '@/data/mlbb';
import InGameDraftArena from '@/components/mlbb/InGameDraftArena';
import PostDraftAnalysisModal from '@/components/mlbb/PostDraftAnalysisModal';

interface DraftSlot {
  type: 'ban' | 'pick';
  team: 'blue' | 'red';
  index: number;
  hero: MLBBHero | null;
}

export default function DraftSimulatorPage() {
  const router = useRouter();
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [draftMode, setDraftMode] = useState<'tournament' | 'free'>('tournament');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Team Customization & Export Card
  const [blueTeamName, setBlueTeamName] = useState('BLUE TEAM');
  const [redTeamName, setRedTeamName] = useState('RED TEAM');
  const [matchTitle, setMatchTitle] = useState('MPL 5V5 TOURNAMENT DRAFT');
  const [isEditingTeams, setIsEditingTeams] = useState(false);
  const [tempBlueName, setTempBlueName] = useState('');
  const [tempRedName, setTempRedName] = useState('');
  const [tempMatchTitle, setTempMatchTitle] = useState('');
  const [isPresetModalOpen, setIsPresetModalOpen] = useState(false);
  const [isExportingCard, setIsExportingCard] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [shareUrlCopied, setShareUrlCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // 5 Bans & 5 Picks per team (Official Tournament Format)
  const [blueBans, setBlueBans] = useState<(MLBBHero | null)[]>([null, null, null, null, null]);
  const [redBans, setRedBans] = useState<(MLBBHero | null)[]>([null, null, null, null, null]);
  const [bluePicks, setBluePicks] = useState<(MLBBHero | null)[]>([null, null, null, null, null]);
  const [redPicks, setRedPicks] = useState<(MLBBHero | null)[]>([null, null, null, null, null]);

  const PRO_PRESETS = [
    {
      title: 'MPL ID S14 Grand Finals',
      blueName: 'TEAM LIQUID ID',
      redName: 'RRQ HOSHI',
      bluePicks: ['fanny', 'phoveus', 'zhask', 'roger', 'tigreal'],
      redPicks: ['ling', 'cici', 'vexana', 'moskov', 'minotaur'],
      blueBans: ['harith', 'nolan', 'luo-yi', 'mathilda', 'edith'],
      redBans: ['hayabusa', 'suyou', 'valentina', 'gatotkaca', 'hylos'],
      description: 'Pertarungan drafting legendaris tempo tinggi antara Fanny Jungle vs Ling Jungle.',
    },
    {
      title: 'M5 World Championship Showdown',
      blueName: 'ONIC ESPORTS',
      redName: 'AP.BREN',
      bluePicks: ['nolan', 'terizla', 'faramis', 'bruno', 'mathilda'],
      redPicks: ['joy', 'arlott', 'novaria', 'claude', 'grock'],
      blueBans: ['guinevere', 'wanwan', 'valentina', 'fredrinn', 'baxia'],
      redBans: ['fanny', 'angela', 'kadita', 'ruby', 'khufra'],
      description: 'Duel meta global M5 dengan setup sustain front-to-back dan dive counterpick.',
    },
    {
      title: 'Classic Burst Assassin vs Tank Jungle',
      blueName: 'EVOS GLORY',
      redName: 'BIGETRON ALPHA',
      bluePicks: ['hayabusa', 'chou', 'valentina', 'harith', 'khufra'],
      redPicks: ['baxia', 'yu-zhong', 'yve', 'karrie', 'hylos'],
      blueBans: ['ling', 'fanny', 'floryn', 'diggie', 'claude'],
      redBans: ['lancelot', 'mathilda', 'luo-yi', 'ruby', 'akai'],
      description: 'Komposisi klasik burst pickoff melawan wall tanky frontline anti-burst.',
    },
  ];

  // Hydrate from URL query parameters if present
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const titleParam = params.get('title');
    const blueNameParam = params.get('blueName');
    const redNameParam = params.get('redName');
    const bluePicksParam = params.get('bluePicks');
    const redPicksParam = params.get('redPicks');
    const blueBansParam = params.get('blueBans');
    const redBansParam = params.get('redBans');

    if (titleParam) setMatchTitle(titleParam);
    if (blueNameParam) setBlueTeamName(blueNameParam);
    if (redNameParam) setRedTeamName(redNameParam);

    if (bluePicksParam) {
      const slugs = bluePicksParam.split(',');
      const loaded = slugs.map(s => allHeroes.find(h => h.slug === s.trim() || h.id === s.trim()) || null);
      while (loaded.length < 5) loaded.push(null);
      setBluePicks(loaded.slice(0, 5));
    }
    if (redPicksParam) {
      const slugs = redPicksParam.split(',');
      const loaded = slugs.map(s => allHeroes.find(h => h.slug === s.trim() || h.id === s.trim()) || null);
      while (loaded.length < 5) loaded.push(null);
      setRedPicks(loaded.slice(0, 5));
    }
    if (blueBansParam) {
      const slugs = blueBansParam.split(',');
      const loaded = slugs.map(s => allHeroes.find(h => h.slug === s.trim() || h.id === s.trim()) || null);
      while (loaded.length < 5) loaded.push(null);
      setBlueBans(loaded.slice(0, 5));
    }
    if (redBansParam) {
      const slugs = redBansParam.split(',');
      const loaded = slugs.map(s => allHeroes.find(h => h.slug === s.trim() || h.id === s.trim()) || null);
      while (loaded.length < 5) loaded.push(null);
      setRedBans(loaded.slice(0, 5));
    }
  }, []);

  const handleLoadPreset = (preset: typeof PRO_PRESETS[0]) => {
    setMatchTitle(preset.title);
    setBlueTeamName(preset.blueName);
    setRedTeamName(preset.redName);

    const bp = preset.bluePicks.map(slug => allHeroes.find(h => h.slug === slug) || null);
    const rp = preset.redPicks.map(slug => allHeroes.find(h => h.slug === slug) || null);
    const bb = preset.blueBans.map(slug => allHeroes.find(h => h.slug === slug) || null);
    const rb = preset.redBans.map(slug => allHeroes.find(h => h.slug === slug) || null);

    setBluePicks(bp);
    setRedPicks(rp);
    setBlueBans(bb);
    setRedBans(rb);
    setCurrentStepIndex(tournamentSteps.length);
    setIsPresetModalOpen(false);
    setIsAnalysisModalOpen(true);
  };

  const handleCopyShareUrl = () => {
    if (typeof window === 'undefined') return;
    const bp = bluePicks.map(h => h?.slug || '').filter(Boolean).join(',');
    const rp = redPicks.map(h => h?.slug || '').filter(Boolean).join(',');
    const bb = blueBans.map(h => h?.slug || '').filter(Boolean).join(',');
    const rb = redBans.map(h => h?.slug || '').filter(Boolean).join(',');

    const url = `${window.location.origin}/mlbb/draft?title=${encodeURIComponent(matchTitle)}&blueName=${encodeURIComponent(blueTeamName)}&redName=${encodeURIComponent(redTeamName)}&bluePicks=${encodeURIComponent(bp)}&redPicks=${encodeURIComponent(rp)}&blueBans=${encodeURIComponent(bb)}&redBans=${encodeURIComponent(rb)}`;
    navigator.clipboard.writeText(url);
    setShareUrlCopied(true);
    setTimeout(() => setShareUrlCopied(false), 2500);
  };

  const handleDownloadCard = async () => {
    if (!cardRef.current) return;
    try {
      setIsExportingCard(true);
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        quality: 0.95,
      });

      const link = document.createElement('a');
      link.download = `klasim-draft-${blueTeamName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-vs-${redTeamName.toLowerCase().replace(/[^a-z0-9]/g, '-')}.png`;
      link.href = dataUrl;
      link.click();

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to export card image:', err);
      alert('Gagal mengekspor kartu grafis showdown. Silakan coba kembali.');
    } finally {
      setIsExportingCard(false);
    }
  };

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
  const isDraftComplete = draftMode === 'tournament' && currentStepIndex >= tournamentSteps.length;

  // Auto-open Post-Draft Analysis Modal upon completion
  useEffect(() => {
    if (isDraftComplete) {
      setIsAnalysisModalOpen(true);
    }
  }, [isDraftComplete]);

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
      if (isDraftComplete || !currentStep) return;
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

      setCurrentStepIndex(prev => prev + 1);
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
    setIsAnalysisModalOpen(false);
  };

  const handleUndoStep = () => {
    if (draftMode === 'tournament') {
      if (currentStepIndex <= 0) return;
      const prevIndex = currentStepIndex - 1;
      const stepToRevert = tournamentSteps[prevIndex];
      if (stepToRevert.team === 'blue') {
        if (stepToRevert.type === 'ban') {
          const next = [...blueBans];
          next[stepToRevert.index] = null;
          setBlueBans(next);
        } else {
          const next = [...bluePicks];
          next[stepToRevert.index] = null;
          setBluePicks(next);
        }
      } else {
        if (stepToRevert.type === 'ban') {
          const next = [...redBans];
          next[stepToRevert.index] = null;
          setRedBans(next);
        } else {
          const next = [...redPicks];
          next[stepToRevert.index] = null;
          setRedPicks(next);
        }
      }
      setCurrentStepIndex(prevIndex);
    }
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

  // Predictive Win Probability Engine
  const matchPrediction = useMemo(() => {
    const validBlue = bluePicks.filter(Boolean) as MLBBHero[];
    const validRed = redPicks.filter(Boolean) as MLBBHero[];

    if (validBlue.length === 0 && validRed.length === 0) {
      return { blueProb: 50, redProb: 50, advantageReason: 'Belum ada hero yang dipilih di kedua sisi.' };
    }

    let blueScore = 50;
    let redScore = 50;

    const blueAvgDmg = validBlue.length > 0 ? validBlue.reduce((s, h) => s + h.stats.offense, 0) / validBlue.length : 50;
    const redAvgDmg = validRed.length > 0 ? validRed.reduce((s, h) => s + h.stats.offense, 0) / validRed.length : 50;

    const blueAvgDur = validBlue.length > 0 ? validBlue.reduce((s, h) => s + h.stats.durability, 0) / validBlue.length : 50;
    const redAvgDur = validRed.length > 0 ? validRed.reduce((s, h) => s + h.stats.durability, 0) / validRed.length : 50;

    blueScore += (blueAvgDmg - redAvgDmg) * 0.15 + (blueAvgDur - redAvgDur) * 0.15;
    redScore += (redAvgDmg - blueAvgDmg) * 0.15 + (redAvgDur - blueAvgDur) * 0.15;

    let blueCounters = 0;
    let redCounters = 0;

    validBlue.forEach(b => {
      const rel = heroRelations.find(r => r.hero_name.toLowerCase() === b.name.toLowerCase());
      validRed.forEach(r => {
        if (rel?.counters?.some((c: any) => c.name.toLowerCase() === r.name.toLowerCase())) {
          redCounters++;
        }
      });
    });

    validRed.forEach(r => {
      const rel = heroRelations.find(rel => rel.hero_name.toLowerCase() === r.name.toLowerCase());
      validBlue.forEach(b => {
        if (rel?.counters?.some((c: any) => c.name.toLowerCase() === b.name.toLowerCase())) {
          blueCounters++;
        }
      });
    });

    blueScore += (blueCounters - redCounters) * 3.5;
    redScore += (redCounters - blueCounters) * 3.5;

    const blueLanes = Object.values(blueAnalysis.lanesCovered).filter(Boolean).length;
    const redLanes = Object.values(redAnalysis.lanesCovered).filter(Boolean).length;
    blueScore += (blueLanes - redLanes) * 2;
    redScore += (redLanes - blueLanes) * 2;

    const total = blueScore + redScore || 100;
    let blueProb = Math.round((blueScore / total) * 100);
    blueProb = Math.max(25, Math.min(75, blueProb));
    const redProb = 100 - blueProb;

    let advantageReason = 'Draft seimbang dengan kekuatan tempo dan matchup yang relatif berimbang.';
    if (blueCounters > redCounters) {
      advantageReason = `${blueTeamName} mengungguli draft dengan ${blueCounters} counter-pick aktif terhadap komposisi lawan.`;
    } else if (redCounters > blueCounters) {
      advantageReason = `${redTeamName} mengungguli draft dengan ${redCounters} counter-pick aktif terhadap komposisi lawan.`;
    } else if (blueLanes > redLanes) {
      advantageReason = `${blueTeamName} memiliki kelengkapan lane yang lebih solid dan map control lebih luas.`;
    } else if (redLanes > blueLanes) {
      advantageReason = `${redTeamName} memiliki kelengkapan lane yang lebih solid dan map control lebih luas.`;
    }

    return { blueProb, redProb, advantageReason, blueCounters, redCounters };
  }, [bluePicks, redPicks, blueAnalysis, redAnalysis, blueTeamName, redTeamName]);

  const rolesList = ['all', 'Tank', 'Fighter', 'Assassin', 'Mage', 'Marksman', 'Support'];

  return (
    <div className="min-h-screen bg-[#05070c] text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-black relative">
      {/* Subtle Floating Exit Button */}
      <Link
        href="/mlbb"
        className="fixed top-3 left-4 z-40 flex items-center gap-1.5 text-xs font-mono font-medium text-slate-400 hover:text-white bg-black/70 hover:bg-black/95 px-3 py-1.5 rounded-full border border-white/10 hover:border-amber-400/50 transition-all backdrop-blur-md shadow-lg"
        title="Kembali ke Halaman MLBB"
      >
        <span>←</span>
        <span>Kembali ke MLBB</span>
      </Link>

      <main className="flex-1 py-4 sm:py-6 px-2 sm:px-4 max-w-[1440px] mx-auto w-full flex flex-col justify-center min-h-screen">
        <InGameDraftArena
          blueTeamName={blueTeamName}
          redTeamName={redTeamName}
          matchTitle={matchTitle}
          bluePicks={bluePicks}
          redPicks={redPicks}
          blueBans={blueBans}
          redBans={redBans}
          draftMode={draftMode}
          currentStepIndex={currentStepIndex}
          tournamentSteps={tournamentSteps}
          currentStep={currentStep}
          isDraftComplete={isDraftComplete}
          usedHeroIds={usedHeroIds}
          allHeroes={allHeroes}
          onSelectHero={handleSelectHero}
          onClearSlot={handleClearSlot}
          onUndo={handleUndoStep}
          onNextStep={() => {
            if (currentStepIndex < tournamentSteps.length) {
              setCurrentStepIndex(currentStepIndex + 1);
            }
          }}
          onReset={handleResetDraft}
          onOpenPresets={() => setIsPresetModalOpen(true)}
          onExportCard={handleDownloadCard}
          isExportingCard={isExportingCard}
          shareUrlCopied={shareUrlCopied}
          onCopyShareUrl={handleCopyShareUrl}
          onOpenAnalysisModal={() => setIsAnalysisModalOpen(true)}
          onCloseDraft={() => router.push('/mlbb')}
          matchPrediction={matchPrediction}
        />
      </main>

      {/* Post-Draft Analysis Modal (Molebuild exact popup) */}
      <PostDraftAnalysisModal
        isOpen={isAnalysisModalOpen}
        onClose={() => setIsAnalysisModalOpen(false)}
        blueTeamName={blueTeamName}
        redTeamName={redTeamName}
        bluePicks={bluePicks}
        redPicks={redPicks}
        blueBans={blueBans}
        redBans={redBans}
        blueAnalysis={blueAnalysis}
        redAnalysis={redAnalysis}
        matchPrediction={matchPrediction}
        onReset={handleResetDraft}
        onExportCard={handleDownloadCard}
        isExportingCard={isExportingCard}
        onCopyShareUrl={handleCopyShareUrl}
        shareUrlCopied={shareUrlCopied}
      />

      {/* Hidden HD Export Card Ref (Captured via html-to-image) */}
      <div className="fixed -left-[9999px] top-0 pointer-events-none">
        <div
          ref={cardRef}
          className="w-[1080px] bg-gradient-to-br from-[#070b14] via-[#05070c] to-[#030408] text-white p-8 font-sans border-4 border-amber-400/50 shadow-2xl relative overflow-hidden"
        >
          {/* Card Top Header */}
          <div className="flex items-center justify-between border-b border-white/15 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-amber-400 flex items-center justify-center text-black font-black text-xl font-mono">
                K
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-amber-400 uppercase block">
                  KLASIM ESPORTS DRAFT SHOWDOWN // 5V5 TOURNAMENT REPORT
                </span>
                <h2 className="text-2xl font-black uppercase tracking-tight text-white font-sans">
                  {matchTitle}
                </h2>
              </div>
            </div>

            <div className="text-right font-mono">
              <span className="text-xs font-bold text-emerald-400 block">OFFICIAL SIMULATOR RESULT</span>
              <span className="text-[10px] text-slate-500">WWW.KLASIM.COM</span>
            </div>
          </div>

          {/* Probability Bar in Export Card */}
          <div className="rounded-2xl border border-white/10 bg-black/50 p-4 mb-6 space-y-2 font-mono">
            <div className="flex justify-between text-xs font-black">
              <span className="text-blue-400 uppercase">{blueTeamName}: {matchPrediction.blueProb}%</span>
              <span className="text-slate-400 text-[10px]">{matchPrediction.advantageReason}</span>
              <span className="text-rose-400 uppercase">{redTeamName}: {matchPrediction.redProb}%</span>
            </div>
            <div className="h-3 w-full rounded-full bg-slate-900 overflow-hidden flex border border-white/10">
              <div style={{ width: `${matchPrediction.blueProb}%` }} className="h-full bg-blue-500" />
              <div style={{ width: `${matchPrediction.redProb}%` }} className="h-full bg-rose-500" />
            </div>
          </div>

          {/* 5v5 Showdown Face-off Grid */}
          <div className="grid grid-cols-2 gap-6">
            {/* Blue Side */}
            <div className="rounded-2xl border border-blue-500/30 bg-blue-950/20 p-4 space-y-4">
              <div className="flex items-center justify-between border-b border-blue-500/30 pb-2">
                <span className="text-lg font-black text-blue-400 uppercase">{blueTeamName}</span>
                <span className="text-[10px] font-mono text-slate-400">FIRST PICK</span>
              </div>

              {/* Bans */}
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono text-slate-400 uppercase">Bans:</span>
                <div className="flex gap-1.5">
                  {blueBans.map((h, i) => (
                    <div key={i} className="h-8 w-8 rounded-lg overflow-hidden border border-white/10 bg-slate-900">
                      {h ? <img src={h.image} alt={h.name} className="h-full w-full object-cover grayscale" /> : <div className="h-full w-full bg-slate-800" />}
                    </div>
                  ))}
                </div>
              </div>

              {/* Picks */}
              <div className="space-y-2">
                {bluePicks.map((h, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/60 p-2">
                    <div className="h-12 w-12 rounded-lg overflow-hidden border border-blue-400/50 bg-slate-900 shrink-0">
                      {h ? <img src={h.image} alt={h.name} className="h-full w-full object-cover" /> : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-sm font-black text-white uppercase block truncate">{h?.name || `Slot #${i + 1}`}</span>
                      <span className="text-[10px] font-mono text-slate-400 block">{h ? `${h.roles.join(', ')} · ${h.lane[0] || 'Flex'}` : 'Kosong'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Red Side */}
            <div className="rounded-2xl border border-rose-500/30 bg-rose-950/20 p-4 space-y-4">
              <div className="flex items-center justify-between border-b border-rose-500/30 pb-2">
                <span className="text-lg font-black text-rose-400 uppercase">{redTeamName}</span>
                <span className="text-[10px] font-mono text-slate-400">COUNTER PICK</span>
              </div>

              {/* Bans */}
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono text-slate-400 uppercase">Bans:</span>
                <div className="flex gap-1.5">
                  {redBans.map((h, i) => (
                    <div key={i} className="h-8 w-8 rounded-lg overflow-hidden border border-white/10 bg-slate-900">
                      {h ? <img src={h.image} alt={h.name} className="h-full w-full object-cover grayscale" /> : <div className="h-full w-full bg-slate-800" />}
                    </div>
                  ))}
                </div>
              </div>

              {/* Picks */}
              <div className="space-y-2">
                {redPicks.map((h, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/60 p-2">
                    <div className="h-12 w-12 rounded-lg overflow-hidden border border-rose-400/50 bg-slate-900 shrink-0">
                      {h ? <img src={h.image} alt={h.name} className="h-full w-full object-cover" /> : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-sm font-black text-white uppercase block truncate">{h?.name || `Slot #${i + 1}`}</span>
                      <span className="text-[10px] font-mono text-slate-400 block">{h ? `${h.roles.join(', ')} · ${h.lane[0] || 'Flex'}` : 'Kosong'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Card Footer */}
          <div className="mt-6 pt-4 border-t border-white/15 flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>DRAFT MATRIX & TELEMETRY ENGINE BY KLASIM MLBB</span>
            <span className="text-amber-400 font-bold uppercase">AUTHENTIC ESPORTS MATCHUP REPORT</span>
          </div>
        </div>
      </div>

      {/* Edit Match & Teams Modal */}
      {isEditingTeams && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-in fade-in duration-150"
        >
          <div className="relative w-full max-w-lg rounded-3xl border border-white/15 bg-[#080d16] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-lg font-black text-white font-sans uppercase">Edit Tim & Judul Match</h3>
              <button
                onClick={() => setIsEditingTeams(false)}
                className="h-8 w-8 rounded-full border border-white/10 bg-white/5 text-slate-400 hover:text-white flex items-center justify-center font-mono cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 font-sans text-xs">
              <div>
                <label className="text-[11px] font-mono text-slate-400 uppercase font-bold block mb-1">Judul Pertandingan</label>
                <input
                  type="text"
                  value={tempMatchTitle}
                  onChange={e => setTempMatchTitle(e.target.value)}
                  placeholder="Contoh: MPL ID S14 Grand Finals"
                  className="w-full rounded-xl border border-white/10 bg-black/60 px-3.5 py-2 text-white focus:border-amber-400 outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-blue-400 uppercase font-bold block mb-1">Nama Blue Team (First Pick)</label>
                <input
                  type="text"
                  value={tempBlueName}
                  onChange={e => setTempBlueName(e.target.value)}
                  placeholder="Contoh: ONIC ESPORTS"
                  className="w-full rounded-xl border border-blue-500/30 bg-black/60 px-3.5 py-2 text-white focus:border-blue-400 outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-rose-400 uppercase font-bold block mb-1">Nama Red Team (Last Pick)</label>
                <input
                  type="text"
                  value={tempRedName}
                  onChange={e => setTempRedName(e.target.value)}
                  placeholder="Contoh: RRQ HOSHI"
                  className="w-full rounded-xl border border-rose-500/30 bg-black/60 px-3.5 py-2 text-white focus:border-rose-400 outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
              <button
                onClick={() => setIsEditingTeams(false)}
                className="rounded-xl border border-white/10 px-4 py-2 text-xs font-mono text-slate-400 hover:text-white cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  if (tempMatchTitle.trim()) setMatchTitle(tempMatchTitle.trim());
                  if (tempBlueName.trim()) setBlueTeamName(tempBlueName.trim());
                  if (tempRedName.trim()) setRedTeamName(tempRedName.trim());
                  setIsEditingTeams(false);
                }}
                className="rounded-xl bg-amber-400 px-4 py-2 text-xs font-mono font-bold text-black hover:bg-amber-300 cursor-pointer"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preset Pro Meta Modal */}
      {isPresetModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-in fade-in duration-150"
        >
          <div className="relative w-full max-w-xl rounded-3xl border border-white/15 bg-[#080d16] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <span className="text-[10px] font-mono text-amber-400 font-bold uppercase block">ARSIP DRAFT TURNAMEN</span>
                <h3 className="text-lg font-black text-white font-sans uppercase">Pilih Preset Pro Meta</h3>
              </div>
              <button
                onClick={() => setIsPresetModalOpen(false)}
                className="h-8 w-8 rounded-full border border-white/10 bg-white/5 text-slate-400 hover:text-white flex items-center justify-center font-mono cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              {PRO_PRESETS.map((p, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-white/10 bg-black/50 p-4 space-y-2 hover:border-amber-400/50 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-black text-white font-sans">{p.title}</h4>
                    <button
                      onClick={() => handleLoadPreset(p)}
                      className="rounded-lg bg-amber-400 px-3 py-1 text-xs font-mono font-bold text-black hover:bg-amber-300 transition-colors cursor-pointer"
                    >
                      Terapkan Draft ⚡
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono font-bold">
                    <span className="text-blue-400">{p.blueName}</span>
                    <span className="text-slate-500">VS</span>
                    <span className="text-rose-400">{p.redName}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans">{p.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
