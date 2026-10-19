// src/components/common/CommandPalette.tsx
'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { heroes, items, emblemTalents, MLBBHero, MLBBItem, MLBBEmblemTalent } from '@/data/mlbb';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PaletteItem {
  id: string;
  type: 'HERO' | 'ITEM' | 'TALENT' | 'MODULE';
  title: string;
  subtitle: string;
  href: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  image?: string;
  badge?: string;
  badgeColor?: string;
  icon?: string;
}

const MODULE_ITEMS: PaletteItem[] = [
  {
    id: 'mod-builder',
    type: 'MODULE',
    title: 'Custom Build Creator & Workshop',
    subtitle: 'Simulasi stat item, 3-tier emblem, bless roam/jungle & combat damage EHP',
    href: '/mlbb/builder',
    icon: '🛠️',
    badge: 'WORKSHOP',
    badgeColor: 'border-amber-400/40 text-amber-400 bg-amber-400/10',
  },
  {
    id: 'mod-draft',
    type: 'MODULE',
    title: 'Draft Simulator 5v5',
    subtitle: 'Simulasi pick & ban turnamen, analisis komposisi dan sinergi tim',
    href: '/mlbb/draft',
    icon: '⚔️',
    badge: 'COMPETITIVE',
    badgeColor: 'border-cyan-400/40 text-cyan-400 bg-cyan-400/10',
  },
  {
    id: 'mod-tierlist',
    type: 'MODULE',
    title: 'Meta Tier List S-Plus',
    subtitle: 'Ranking hero S+ sampai C per lane berdasarkan win rate dan turnamen resmi',
    href: '/mlbb/tier-list',
    icon: '🏆',
    badge: 'TIER LIST',
    badgeColor: 'border-emerald-400/40 text-emerald-400 bg-emerald-400/10',
  },
  {
    id: 'mod-counter',
    type: 'MODULE',
    title: 'Counter Pick Finder',
    subtitle: 'Temukan counter hero tunggal atau kombinasi 5 hero musuh secara matematis',
    href: '/mlbb/counter-pick',
    icon: '🎯',
    badge: 'STRATEGY',
    badgeColor: 'border-rose-400/40 text-rose-400 bg-rose-400/10',
  },
  {
    id: 'mod-compare',
    type: 'MODULE',
    title: 'Dual Hero Head-to-Head Comparator',
    subtitle: 'Bandingkan stat base, durabilitas, offense, dan match-up dua hero secara berdampingan',
    href: '/mlbb/compare',
    icon: '⚖️',
    badge: 'ANALYSIS',
    badgeColor: 'border-purple-400/40 text-purple-400 bg-purple-400/10',
  },
  {
    id: 'mod-builds',
    type: 'MODULE',
    title: 'Tournament Builds Database',
    subtitle: '365+ build resmi pro player MPL dan kejuaraan dunia M-Series',
    href: '/mlbb/builds',
    icon: '🎖️',
    badge: 'PRO DATA',
    badgeColor: 'border-blue-400/40 text-blue-400 bg-blue-400/10',
  },
  {
    id: 'mod-guides',
    type: 'MODULE',
    title: 'Strategy & Macro Hub',
    subtitle: 'Panduan 5 role masterclass, wave timing, gold pacing, dan objektif lord/turtle',
    href: '/mlbb/guides',
    icon: '🧭',
    badge: 'GUIDES',
    badgeColor: 'border-teal-400/40 text-teal-400 bg-teal-400/10',
  },
  {
    id: 'mod-patch',
    type: 'MODULE',
    title: 'Patch Notes & Meta Analysis',
    subtitle: 'Arsip patch resmi v2.2.1, buff, nerf, dan rincian penyesuaian atribut hero/item',
    href: '/mlbb/patch-notes',
    icon: '📈',
    badge: 'BALANCE',
    badgeColor: 'border-amber-400/40 text-amber-400 bg-amber-400/10',
  },
  {
    id: 'mod-heroes',
    type: 'MODULE',
    title: 'Hero Hub & Skill Directory',
    subtitle: 'Katalog 133 hero MLBB lengkap dengan scaling damage, cooldown, dan rasio winrate',
    href: '/mlbb/heroes',
    icon: '🛡️',
    badge: 'HEROES',
    badgeColor: 'border-slate-400/40 text-slate-300 bg-white/5',
  },
  {
    id: 'mod-items',
    type: 'MODULE',
    title: 'Item Equipment Database',
    subtitle: 'Katalog 90 equipment MLBB lengkap dengan pasif unik, jalur sintesis, dan filter',
    href: '/mlbb/items',
    icon: '📦',
    badge: 'ITEMS',
    badgeColor: 'border-slate-400/40 text-slate-300 bg-white/5',
  },
  {
    id: 'mod-tournament-create',
    type: 'MODULE',
    title: 'Buat Turnamen Esports Baru',
    subtitle: 'Generator jadwal turnamen sistem Swiss, Group Stage, atau Double Elimination',
    href: '/tournament/create',
    icon: '⚔️',
    badge: 'ESPORTS',
    badgeColor: 'border-amber-400/40 text-amber-400 bg-amber-400/10',
  },
];

const renderModuleIcon = (id: string) => {
  switch (id) {
    case 'mod-builder':
      return (
        <svg className="w-4 h-4 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
      );
    case 'mod-draft':
    case 'mod-tournament-create':
      return (
        <svg className="w-4 h-4 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5" />
          <line x1="13" y1="19" x2="19" y2="13" />
          <line x1="16" y1="16" x2="20" y2="20" />
          <line x1="19" y1="21" x2="21" y2="19" />
          <polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5" />
          <line x1="5" y1="14" x2="9" y2="18" />
          <line x1="7" y1="17" x2="4" y2="20" />
          <line x1="3" y1="19" x2="5" y2="21" />
        </svg>
      );
    case 'mod-tierlist':
      return (
        <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
          <path d="M4 22h16" />
          <path d="M10 14.66V17c0 .55-.45 1-1 1H7v2h10v-2h-2c-.55 0-1-.45-1-1v-2.34" />
          <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
        </svg>
      );
    case 'mod-counter':
      return (
        <svg className="w-4 h-4 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <circle cx="12" cy="12" r="10" />
          <line x1="22" y1="12" x2="18" y2="12" />
          <line x1="6" y1="12" x2="2" y2="12" />
          <line x1="12" y1="6" x2="12" y2="2" />
          <line x1="12" y1="22" x2="12" y2="18" />
        </svg>
      );
    case 'mod-compare':
      return (
        <svg className="w-4 h-4 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
          <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
          <path d="M7 21h10" />
          <path d="M12 3v18" />
          <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
        </svg>
      );
    case 'mod-builds':
      return (
        <svg className="w-4 h-4 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <circle cx="12" cy="8" r="7" />
          <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
        </svg>
      );
    case 'mod-guides':
      return (
        <svg className="w-4 h-4 text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <circle cx="12" cy="12" r="10" />
          <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
        </svg>
      );
    case 'mod-patch':
      return (
        <svg className="w-4 h-4 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
          <polyline points="16 7 22 7 22 13" />
        </svg>
      );
    case 'mod-heroes':
      return (
        <svg className="w-4 h-4 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      );
    case 'mod-items':
      return (
        <svg className="w-4 h-4 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      );
    default:
      return (
        <svg className="w-4 h-4 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      );
  }
};

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'HERO' | 'ITEM' | 'TALENT' | 'MODULE'>('ALL');
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Global keyboard shortcuts (Ctrl+K, Cmd+K, Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Trigger open via document event or parent handler
          const openEvt = new CustomEvent('open-command-palette');
          window.dispatchEvent(openEvt);
        }
      } else if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Pre-indexed heroes
  const heroItems: PaletteItem[] = useMemo(() => {
    return heroes.map((h: MLBBHero) => ({
      id: `hero-${h.id}`,
      type: 'HERO',
      title: h.name,
      subtitle: `${h.title || h.roles.join(', ')} • ${h.lane?.join(', ') || 'Flex'}`,
      href: `/mlbb/heroes/${h.slug}`,
      secondaryHref: `/mlbb/builder?hero=${h.slug}`,
      secondaryLabel: 'Workshop',
      image: h.image,
      badge: h.roles[0]?.toUpperCase() || 'HERO',
      badgeColor: 'border-amber-400/30 text-amber-300 bg-amber-400/10',
    }));
  }, []);

  // Pre-indexed items
  const itemItems: PaletteItem[] = useMemo(() => {
    return items.map((i: MLBBItem) => ({
      id: `item-${i.id}`,
      type: 'ITEM',
      title: i.name,
      subtitle: `${i.type.toUpperCase()} • Biaya ${i.price} Gold • ${i.passive_description ? i.passive_description.slice(0, 70) + '...' : 'Equipment MLBB'}`,
      href: `/mlbb/items`,
      secondaryHref: `/mlbb/builder`,
      secondaryLabel: 'Workshop',
      image: i.image,
      badge: `${i.price}G`,
      badgeColor: 'border-yellow-400/30 text-yellow-300 bg-yellow-400/10',
    }));
  }, []);

  // Pre-indexed talents
  const talentItems: PaletteItem[] = useMemo(() => {
    return emblemTalents.map((t: MLBBEmblemTalent) => ({
      id: `talent-${t.id}`,
      type: 'TALENT',
      title: t.name,
      subtitle: `Tier ${t.tier} Talent • ${t.description.slice(0, 75)}...`,
      href: `/mlbb/builder`,
      image: t.image,
      badge: `TIER ${t.tier}`,
      badgeColor: t.tier === 3 ? 'border-amber-400/40 text-amber-300 bg-amber-400/10' : 'border-cyan-400/40 text-cyan-300 bg-cyan-400/10',
    }));
  }, []);

  // Filtered results
  const results: PaletteItem[] = useMemo(() => {
    const q = query.trim().toLowerCase();

    let all: PaletteItem[] = [];
    if (filterType === 'ALL' || filterType === 'MODULE') all.push(...MODULE_ITEMS);
    if (filterType === 'ALL' || filterType === 'HERO') all.push(...heroItems);
    if (filterType === 'ALL' || filterType === 'ITEM') all.push(...itemItems);
    if (filterType === 'ALL' || filterType === 'TALENT') all.push(...talentItems);

    if (!q) {
      // Default: show modules first, then popular heroes/items
      return all.slice(0, 20);
    }

    return all.filter((item) => {
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchSubtitle = item.subtitle.toLowerCase().includes(q);
      const matchBadge = item.badge?.toLowerCase().includes(q);
      return matchTitle || matchSubtitle || matchBadge;
    }).slice(0, 30);
  }, [query, filterType, heroItems, itemItems, talentItems]);

  // Handle arrow keys
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        handleSelect(results[selectedIndex].href);
      }
    }
  };

  const handleSelect = (href: string) => {
    onClose();
    router.push(href);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-2xl border border-white/15 bg-[#090e17] shadow-2xl overflow-hidden flex flex-col max-h-[80vh] border-amber-400/30"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center border-b border-white/10 px-4 py-3 bg-[#0c121e]">
          <svg className="w-4 h-4 text-amber-400 mr-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Cari 133 hero, 90 equipment, emblem talent, atau modul turnamen..."
            className="w-full bg-transparent font-mono text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="text-xs font-mono text-slate-500 hover:text-white px-2 py-1 rounded cursor-pointer"
            >
              Clear
            </button>
          )}
          <kbd className="hidden sm:inline-block ml-2 rounded border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-mono text-slate-400">
            ESC
          </kbd>
        </div>

        {/* Filter Badges with SVGs */}
        <div className="flex items-center gap-1.5 px-4 py-2 border-b border-white/5 bg-[#060910] overflow-x-auto scrollbar-none font-mono text-[11px]">
          {(['ALL', 'HERO', 'ITEM', 'TALENT', 'MODULE'] as const).map((type) => (
            <button
              key={type}
              onClick={() => {
                setFilterType(type);
                setSelectedIndex(0);
              }}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                filterType === type
                  ? 'bg-amber-400 text-black font-bold'
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
              }`}
            >
              {type === 'ALL' && (
                <>
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                  <span>Semua</span>
                </>
              )}
              {type === 'HERO' && (
                <>
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  <span>Hero (133)</span>
                </>
              )}
              {type === 'ITEM' && (
                <>
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                    <line x1="12" y1="22.08" x2="12" y2="12" />
                  </svg>
                  <span>Item (90)</span>
                </>
              )}
              {type === 'TALENT' && (
                <>
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                  <span>Talent (26)</span>
                </>
              )}
              {type === 'MODULE' && (
                <>
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <circle cx="12" cy="12" r="10" />
                    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
                  </svg>
                  <span>Modul (11)</span>
                </>
              )}
            </button>
          ))}
          <span className="ml-auto text-[10px] text-slate-500 hidden sm:inline">
            {results.length} hasil
          </span>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 space-y-1 flex-1 scrollbar-none">
          {results.length === 0 ? (
            <div className="py-12 text-center">
              <div className="flex justify-center mb-2">
                <svg className="w-10 h-10 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
              <p className="text-sm font-sans text-slate-300">
                Tidak ada entitas yang cocok dengan &quot;<span className="text-amber-400">{query}</span>&quot;
              </p>
              <p className="text-xs text-slate-500 mt-1 font-mono">
                Coba cari nama hero (misal: Suyou, Fanny), item (misal: Blade of Despair), atau modul (misal: Draft).
              </p>
            </div>
          ) : (
            results.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item.href)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between gap-3 p-2.5 rounded-xl transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-amber-400/10 border-amber-400/40 text-white'
                      : 'border-transparent hover:bg-white/5 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Icon or Image */}
                    <div className="h-9 w-9 rounded-lg overflow-hidden shrink-0 bg-black/40 border border-white/10 flex items-center justify-center relative">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.title}
                          width={36}
                          height={36}
                          className="object-cover h-full w-full"
                          unoptimized
                        />
                      ) : (
                        renderModuleIcon(item.id)
                      )}
                    </div>

                    {/* Title & Subtitle */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white font-sans truncate">
                          {item.title}
                        </span>
                        {item.badge && (
                          <span
                            className={`px-1.5 py-0.5 rounded text-[9px] font-mono border font-bold shrink-0 ${
                              item.badgeColor || 'border-white/10 text-slate-400 bg-white/5'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 font-sans truncate mt-0.5">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Actions / Enter hint */}
                  <div className="flex items-center gap-2 shrink-0 font-mono text-[10px]">
                    {item.secondaryHref && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelect(item.secondaryHref!);
                        }}
                        className="hidden sm:inline-flex items-center gap-1.5 px-2 py-1 rounded bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 hover:bg-cyan-400 hover:text-black transition-all cursor-pointer"
                      >
                        <svg className="w-2.5 h-2.5 text-cyan-400" viewBox="0 0 24 24" fill="currentColor">
                          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                        </svg>
                        <span>{item.secondaryLabel || 'Buka'}</span>
                      </button>
                    )}
                    {isSelected && (
                      <span className="hidden sm:inline-flex items-center gap-1.5 text-amber-400 font-bold">
                        <svg className="w-3 h-3 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                          <polyline points="9 10 4 15 9 20" />
                          <path d="M20 4v7a4 4 0 0 1-4 4H4" />
                        </svg>
                        <span>PILIH</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Shortcut Bar */}
        <div className="border-t border-white/10 bg-[#060910] px-4 py-2.5 flex items-center justify-between text-[10px] font-mono text-slate-500">
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1">
              <kbd className="inline-flex items-center justify-center text-slate-300 bg-white/10 px-1.5 py-0.5 rounded border border-white/10">
                <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                  <polyline points="18 15 12 9 6 15" />
                </svg>
              </kbd>
              <kbd className="inline-flex items-center justify-center text-slate-300 bg-white/10 px-1.5 py-0.5 rounded border border-white/10">
                <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </kbd>
              <span className="ml-1">Navigasi</span>
            </span>

            <span className="inline-flex items-center gap-1">
              <kbd className="inline-flex items-center justify-center text-slate-300 bg-white/10 px-1.5 py-0.5 rounded border border-white/10">
                <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                  <polyline points="9 10 4 15 9 20" />
                  <path d="M20 4v7a4 4 0 0 1-4 4H4" />
                </svg>
              </kbd>
              <span className="ml-1">Buka</span>
            </span>

            <span className="inline-flex items-center gap-1">
              <kbd className="text-slate-300 bg-white/10 px-1.5 py-0.5 rounded border border-white/10">ESC</kbd>
              <span className="ml-1">Tutup</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-amber-400/80 font-bold">
            <svg className="w-3 h-3 text-amber-400" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            <span>KLASIM FAST INDEX</span>
          </div>
        </div>
      </div>
    </div>
  );
}
