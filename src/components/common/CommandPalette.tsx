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
          <span className="text-amber-400 text-lg mr-3">🔍</span>
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
              className="text-xs font-mono text-slate-500 hover:text-white px-2 py-1 rounded"
            >
              Clear
            </button>
          )}
          <kbd className="hidden sm:inline-block ml-2 rounded border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-mono text-slate-400">
            ESC
          </kbd>
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-1.5 px-4 py-2 border-b border-white/5 bg-[#060910] overflow-x-auto scrollbar-none font-mono text-[11px]">
          {(['ALL', 'HERO', 'ITEM', 'TALENT', 'MODULE'] as const).map((type) => (
            <button
              key={type}
              onClick={() => {
                setFilterType(type);
                setSelectedIndex(0);
              }}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                filterType === type
                  ? 'bg-amber-400 text-black font-bold'
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
              }`}
            >
              {type === 'ALL' && '🌐 Semua'}
              {type === 'HERO' && '🛡️ Hero (133)'}
              {type === 'ITEM' && '📦 Item (90)'}
              {type === 'TALENT' && '⚡ Talent (26)'}
              {type === 'MODULE' && '🧭 Modul (11)'}
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
              <span className="text-3xl block mb-2">🔎</span>
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
                        <span className="text-base">{item.icon || '📌'}</span>
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
                        className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 hover:bg-cyan-400 hover:text-black transition-all"
                      >
                        <span>⚡</span>
                        <span>{item.secondaryLabel || 'Buka'}</span>
                      </button>
                    )}
                    {isSelected && (
                      <span className="hidden sm:inline-flex items-center gap-1 text-amber-400 font-bold">
                        <span>↵</span>
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
            <span><kbd className="text-slate-300 bg-white/10 px-1 py-0.5 rounded">↑</kbd> <kbd className="text-slate-300 bg-white/10 px-1 py-0.5 rounded">↓</kbd> Navigasi</span>
            <span><kbd className="text-slate-300 bg-white/10 px-1 py-0.5 rounded">↵</kbd> Buka</span>
            <span><kbd className="text-slate-300 bg-white/10 px-1 py-0.5 rounded">ESC</kbd> Tutup</span>
          </div>
          <div className="flex items-center gap-1.5 text-amber-400/80 font-bold">
            <span>⚡ KLASIM FAST INDEX</span>
          </div>
        </div>
      </div>
    </div>
  );
}
