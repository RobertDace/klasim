// src/app/mlbb/patch-notes/page.tsx
'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import { heroes as allHeroes, items as allItems } from '@/data/mlbb';

interface PatchChange {
  id: string;
  targetType: 'hero' | 'item' | 'system';
  name: string;
  slug: string;
  type: 'buff' | 'nerf' | 'adjusted' | 'revamp';
  role?: string;
  summary: string;
  details: string[];
  impactRating: 'HIGH' | 'MEDIUM' | 'SLIGHT';
  image?: string;
}

export default function PatchNotesPage() {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'buff' | 'nerf' | 'adjusted' | 'item'>('all');
  const [selectedRole, setSelectedRole] = useState<string>('ALL');

  // Season 34 / latest meta patch notes curated dataset
  const patchChanges: PatchChange[] = [
    {
      id: 'patch-suyou',
      targetType: 'hero',
      name: 'Suyou',
      slug: 'suyou',
      type: 'buff',
      role: 'Assassin',
      summary: 'Peningkatan scaling base damage Mortal Form dan kecepatan eksekusi skill Tap.',
      details: [
        'Skill 1 (Tap): Base Damage ditingkatkan dari 250–400 menjadi 300–450 (+80% Extra Physical ATK).',
        'Skill 2 (Hold): Efek Damage Reduction saat channeling dinaikkan dari 30% menjadi 40%.',
        'Cooldown Ultimate dikurangi 4 detik di semua level.',
      ],
      impactRating: 'HIGH',
      image: allHeroes.find(h => h.slug === 'suyou')?.image,
    },
    {
      id: 'patch-zhuxin',
      targetType: 'hero',
      name: 'Zhuxin',
      slug: 'zhuxin',
      type: 'nerf',
      role: 'Mage',
      summary: 'Konsumsi Mana per detik dinaikkan pada skill 2 dan durasi airborne dikurangi.',
      details: [
        'Skill 2 (Fluttering Grace): Konsumsi Mana per detik meningkat dari 30–50 menjadi 45–65.',
        'Durasi efek airborne saat mengangkat hero lawan dikurangi dari 1.0 detik menjadi 0.8 detik.',
        'Base HP pada Level 1 dikurangi dari 2510 menjadi 2420.',
      ],
      impactRating: 'HIGH',
      image: allHeroes.find(h => h.slug === 'zhuxin')?.image,
    },
    {
      id: 'patch-nolan',
      targetType: 'hero',
      name: 'Nolan',
      slug: 'nolan',
      type: 'buff',
      role: 'Assassin',
      summary: 'Efek Cosmic Rift memberikan bonus damage lebih konsisten terhadap jungle creeps.',
      details: [
        'Pasif (Dimensional Rift): Bonus regenerasi energi saat memicu rift dinaikkan dari 15 menjadi 20.',
        'Skill 1: Cooldown pada level 1 dikurangi dari 2.0 detik menjadi 1.8 detik.',
      ],
      impactRating: 'MEDIUM',
      image: allHeroes.find(h => h.slug === 'nolan')?.image,
    },
    {
      id: 'patch-fanny',
      targetType: 'hero',
      name: 'Fanny',
      slug: 'fanny',
      type: 'nerf',
      role: 'Assassin',
      summary: 'Pengurangan scaling physical damage skill tornado strike saat terbang berturut-turut.',
      details: [
        'Skill 1 (Tornado Strike): Bonus Total Physical Attack scaling dikurangi dari 90% menjadi 80%.',
        'Konsumsi Energi Steel Cable dinaikkan 1 poin di level awal jika tidak mengenai dinding.',
      ],
      impactRating: 'MEDIUM',
      image: allHeroes.find(h => h.slug === 'fanny')?.image,
    },
    {
      id: 'patch-lukas',
      targetType: 'hero',
      name: 'Lukas',
      slug: 'lukas',
      type: 'revamp',
      role: 'Fighter',
      summary: 'Penyesuaian transformasi Sacred Beast untuk gameplay yang lebih responsif.',
      details: [
        'Transformasi Beast Form kini memberikan peningkatan Movement Speed 25% instan selama 2 detik.',
        'Base Shield dari pasif disesuaikan dengan Max HP hero.',
      ],
      impactRating: 'HIGH',
      image: allHeroes.find(h => h.slug === 'lukas')?.image,
    },
    {
      id: 'patch-xavier',
      targetType: 'hero',
      name: 'Xavier',
      slug: 'xavier',
      type: 'buff',
      role: 'Mage',
      summary: 'Kecepatan aktivasi State Transcendence dipercepat saat mengombinasikan skill 1 dan 2.',
      details: [
        'Skill 2 (Mystic Field): Area ledakan saat terpicu oleh Skill 1 diperluas 10%.',
        'Ultimate (Dawning Light): Cooldown berkurang 5 detik di level 1.',
      ],
      impactRating: 'MEDIUM',
      image: allHeroes.find(h => h.slug === 'xavier')?.image,
    },
    {
      id: 'patch-chou',
      targetType: 'hero',
      name: 'Chou',
      slug: 'chou',
      type: 'adjusted',
      role: 'Fighter',
      summary: 'Penyesuaian base defense dan scaling attack untuk mendorong fleksibilitas EXP vs Roam.',
      details: [
        'Base Physical Defense dinaikkan dari 19 menjadi 22.',
        'Scaling damage Jeet Kune Do ketiga disesuaikan agar lebih berdampak pada item offensive.',
      ],
      impactRating: 'SLIGHT',
      image: allHeroes.find(h => h.slug === 'chou')?.image,
    },
    {
      id: 'patch-sky-piercer',
      targetType: 'item',
      name: 'Sky Piercer',
      slug: 'sky-piercer',
      type: 'adjusted',
      summary: 'Threshold eksekusi True Damage disesuaikan dengan stack kill dan assist.',
      details: [
        'Threshold eksekusi dasar dimulai dari 4% Max HP lawan (sebelumnya 5%).',
        'Stack bertambah 1 per kill (maksimal 10% eksekusi pada 60 stack).',
        'Harga beli naik 50 Gold menjadi 1,550 Gold.',
      ],
      impactRating: 'HIGH',
      image: allItems.find(i => i.slug === 'sky-piercer')?.image,
    },
    {
      id: 'patch-malefic-gun',
      targetType: 'item',
      name: 'Malefic Gun',
      slug: 'malefic-gun',
      type: 'buff',
      summary: 'Peningkatan durasi bonus range tembakan basic attack marksman.',
      details: [
        'Pasif Unik - Malefic: Durasi jangkauan tembakan tambahan diperpanjang dari 3 detik menjadi 4 detik.',
        'Cooldown pasif dikurangi dari 8 detik menjadi 6 detik.',
      ],
      impactRating: 'MEDIUM',
      image: allItems.find(i => i.slug === 'malefic-gun')?.image,
    },
    {
      id: 'patch-wishing-lantern',
      targetType: 'item',
      name: 'Wishing Lantern',
      slug: 'wishing-lantern',
      type: 'buff',
      summary: 'Peningkatan efisiensi True Damage terhadap target hero berdarah tebal / Tank.',
      details: [
        'Proyektil Butterfly kini menghasilkan 10% Magic Damage berdasarkan HP lawan saat ini.',
        'Stat Magic Power dasar dinaikkan dari 70 menjadi 75.',
      ],
      impactRating: 'MEDIUM',
      image: allItems.find(i => i.slug === 'wishing-lantern')?.image,
    },
  ];

  const filteredChanges = useMemo(() => {
    return patchChanges.filter(item => {
      if (selectedFilter === 'buff' && item.type !== 'buff') return false;
      if (selectedFilter === 'nerf' && item.type !== 'nerf') return false;
      if (selectedFilter === 'adjusted' && item.type !== 'adjusted' && item.type !== 'revamp') return false;
      if (selectedFilter === 'item' && item.targetType !== 'item') return false;

      if (selectedRole !== 'ALL' && item.role && item.role.toUpperCase() !== selectedRole) {
        return false;
      }
      return true;
    });
  }, [selectedFilter, selectedRole]);

  return (
    <div className="min-h-screen bg-[#05070c] text-white selection:bg-amber-400 selection:text-black">
      <Navbar activeSection="mlbb" />

      <main className="pt-24 sm:pt-28 pb-32">
        {/* Header HUD Banner */}
        <section className="relative overflow-hidden border-b border-white/10 bg-gradient-to-b from-[#090e17] via-[#05070c] to-[#05070c] py-10 sm:py-14">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-400/10 via-transparent to-transparent pointer-events-none" />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 font-mono text-[10px] sm:text-xs text-amber-400 mb-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>SEASON 34 OFFICIAL BALANCE PATCH & META SHIFTS</span>
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white font-sans uppercase">
                  PATCH NOTES & <span className="text-amber-400">META ANALYSIS</span>
                </h1>
                <p className="mt-2 max-w-2xl text-xs sm:text-sm text-slate-400 font-sans">
                  Rangkuman penyesuaian keseimbangan hero dan equipment MLBB terbaru. Analisis pergeseran tier meta, buff, nerf, dan rekomendasi draft turnamen.
                </p>
              </div>

              {/* Navigation Pills */}
              <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                <Link
                  href="/mlbb/tier-list"
                  className="rounded-lg border border-amber-400/40 bg-amber-400/10 px-3 py-2 text-amber-400 hover:bg-amber-400 hover:text-black transition-all flex items-center gap-1.5 font-bold"
                >
                  <span>🏆</span>
                  <span>Cek Meta Tier List</span>
                </Link>
                <Link
                  href="/mlbb/draft"
                  className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-slate-300 hover:border-amber-400/40 hover:text-amber-400 transition-all flex items-center gap-1.5"
                >
                  <span>⚔️</span>
                  <span>Draft Simulator</span>
                </Link>
              </div>
            </div>

            {/* Meta Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 font-mono">
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>EXP & JUNGLE META</span>
                  <span className="text-emerald-400 font-bold">▲ SURGING</span>
                </div>
                <div className="text-base font-black text-white font-sans">
                  Assassin & Skirmish Fighter
                </div>
                <p className="text-[11px] text-slate-400 font-sans">
                  Suyou, Nolan, dan Hayabusa mendominasi tempo rotasi early-to-mid turnamen.
                </p>
              </div>

              <div className="rounded-2xl border border-rose-500/30 bg-rose-500/5 p-4 space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>MID LANE ADJUSTMENT</span>
                  <span className="text-rose-400 font-bold">▼ TUNED DOWN</span>
                </div>
                <div className="text-base font-black text-white font-sans">
                  Zhuxin Mana Tuning
                </div>
                <p className="text-[11px] text-slate-400 font-sans">
                  Kebutuhan manajemen Mana yang lebih ketat membuka peluang bagi Xavier dan Novaria.
                </p>
              </div>

              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>EQUIPMENT FOCUS</span>
                  <span className="text-amber-400 font-bold">⚡ CRITICAL</span>
                </div>
                <div className="text-base font-black text-white font-sans">
                  Sky Piercer & Wishing Lantern
                </div>
                <p className="text-[11px] text-slate-400 font-sans">
                  Threshold eksekusi disesuaikan untuk mencegah snowballing instan yang terlalu cepat.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Filter Bar */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-6">
          <div className="rounded-2xl border border-white/10 bg-[#080d16] p-4 sm:p-5 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none w-full md:w-auto">
              {[
                { id: 'all', label: 'SEMUA PERUBAHAN' },
                { id: 'buff', label: '📈 HERO BUFF' },
                { id: 'nerf', label: '📉 HERO NERF' },
                { id: 'adjusted', label: '🔄 PENYESUAIAN / REVAMP' },
                { id: 'item', label: '📦 ITEM EQUIPMENT' },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFilter(f.id as any)}
                  className={`rounded-xl px-3.5 py-2 text-xs font-mono font-bold uppercase transition-all whitespace-nowrap cursor-pointer ${
                    selectedFilter === f.id
                      ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
                      : 'border border-white/5 bg-black/40 text-slate-400 hover:border-white/20 hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Role filter */}
            <div className="flex items-center gap-2 font-mono text-xs w-full md:w-auto justify-end">
              <span className="text-slate-400">Role:</span>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-slate-300 focus:border-amber-400 focus:outline-none"
              >
                <option value="ALL">Semua Role</option>
                <option value="ASSASSIN">Assassin</option>
                <option value="MAGE">Mage</option>
                <option value="FIGHTER">Fighter</option>
                <option value="MARKSMAN">Marksman</option>
                <option value="TANK">Tank</option>
                <option value="SUPPORT">Support</option>
              </select>
            </div>
          </div>
        </section>

        {/* Patch Changes Cards */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-6">
          <div className="space-y-4">
            {filteredChanges.map(change => {
              const isBuff = change.type === 'buff';
              const isNerf = change.type === 'nerf';
              const isItem = change.targetType === 'item';

              return (
                <div
                  key={change.id}
                  className="rounded-3xl border border-white/10 bg-[#080d16] p-5 sm:p-6 shadow-2xl hover:border-white/20 transition-all space-y-4"
                >
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3.5">
                      {change.image && (
                        <img
                          src={change.image}
                          alt={change.name}
                          className="h-14 w-14 rounded-2xl object-cover border-2 border-white/15 bg-black p-0.5"
                        />
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg sm:text-xl font-black text-white font-sans">
                            {change.name}
                          </h3>
                          {change.role && (
                            <span className="rounded bg-white/10 text-slate-300 font-mono text-[10px] px-2 py-0.5 font-bold">
                              {change.role}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-400 font-sans mt-0.5">
                          {change.summary}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 font-mono text-xs">
                      {/* Change Type Badge */}
                      <span className={`rounded-xl border px-3 py-1 font-bold uppercase text-[10px] ${
                        isBuff
                          ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-400'
                          : isNerf
                          ? 'border-rose-400/40 bg-rose-400/10 text-rose-400'
                          : 'border-cyan-400/40 bg-cyan-400/10 text-cyan-400'
                      }`}>
                        {change.type.toUpperCase()}
                      </span>

                      {/* Impact rating */}
                      <span className="rounded-xl border border-white/10 bg-white/5 px-2.5 py-1 text-slate-400 text-[10px]">
                        IMPACT: <strong className="text-white">{change.impactRating}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Bullet points of adjustments */}
                  <div className="space-y-2 font-sans text-xs sm:text-sm">
                    {change.details.map((d, dIdx) => (
                      <div key={dIdx} className="flex items-start gap-2.5 text-slate-300">
                        <span className="text-amber-400 font-bold shrink-0 mt-0.5">•</span>
                        <span className="leading-relaxed">{d}</span>
                      </div>
                    ))}
                  </div>

                  {/* Direct Link */}
                  <div className="pt-3 border-t border-white/5 flex items-center justify-end">
                    {isItem ? (
                      <Link
                        href="/mlbb/items"
                        className="text-xs font-mono font-bold text-amber-400 hover:underline flex items-center gap-1"
                      >
                        <span>Lihat Item di Encyclopedia</span>
                        <span>→</span>
                      </Link>
                    ) : (
                      <Link
                        href={`/mlbb/heroes/${change.slug}`}
                        className="text-xs font-mono font-bold text-amber-400 hover:underline flex items-center gap-1"
                      >
                        <span>Buka Halaman Hero & Pro Builds</span>
                        <span>→</span>
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
