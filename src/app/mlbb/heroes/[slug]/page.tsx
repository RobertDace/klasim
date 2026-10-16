// src/app/mlbb/heroes/[slug]/page.tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import HeroBuildSection from '@/components/mlbb/HeroBuildSection';
import HeroLevelScalingSection from '@/components/mlbb/HeroLevelScalingSection';
import HeroMatchupComparator from '@/components/mlbb/HeroMatchupComparator';
import HeroInfographicCard from '@/components/mlbb/HeroInfographicCard';
import {
  heroes as allHeroes,
  heroTierStats,
  heroRelations,
  getHeroBySlug,
  getHeroBuilds,
} from '@/data/mlbb';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return allHeroes.map(h => ({
    slug: h.slug,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const hero = getHeroBySlug(slug);
  if (!hero) return { title: 'Hero Tidak Ditemukan | Klasim MLBB' };

  return {
    title: `${hero.name} - Panduan, Build, Counter & Skill Mobile Legends | Klasim MLBB`,
    description: `Panduan lengkap ${hero.name} (${hero.title}). Rekomendasi build pro equipment, statistik winrate tier rank, analisis counter matchup, dan simulator stats level 1-15.`,
  };
}

export default async function HeroDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const hero = getHeroBySlug(slug);

  if (!hero) {
    notFound();
  }

  // Tier stats
  const tierStat = heroTierStats.find(
    s => s.hero_name.toLowerCase() === hero.name.toLowerCase() && (s.rank === 'mythic' || s.rank === 'all')
  ) || heroTierStats.find(s => s.hero_name.toLowerCase() === hero.name.toLowerCase());

  // Relations
  const relation = heroRelations.find(r => r.hero_name.toLowerCase() === hero.name.toLowerCase());

  // Builds
  const builds = getHeroBuilds(slug);
  const primaryBuild = builds[0];

  const statBars = [
    { label: 'DURABILITY', val: hero.stats.durability, color: 'bg-blue-400' },
    { label: 'OFFENSE', val: hero.stats.offense, color: 'bg-rose-400' },
    { label: 'SKILL EFFECTS', val: hero.stats.ability, color: 'bg-cyan-400' },
    { label: 'DIFFICULTY', val: hero.stats.difficulty, color: 'bg-amber-400' },
  ];

  return (
    <div className="min-h-screen bg-[#05070c] text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-black">
      <Navbar activeSection="mlbb" />

      <main className="flex-1 pt-24 pb-20 px-3.5 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-10">
        {/* Top Breadcrumb Navigation */}
        <div className="flex items-center justify-between font-mono text-xs text-slate-400 border-b border-white/10 pb-3">
          <Link
            href="/mlbb/heroes"
            className="flex items-center gap-2 hover:text-amber-400 transition-colors uppercase tracking-wider"
          >
            <span>←</span>
            <span>KEMBALI KE DAFTAR HERO</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-slate-600">ID: #{hero.moonton_hero_id}</span>
            <span className="text-slate-700">|</span>
            <span className="text-amber-400 font-bold uppercase">{hero.name}</span>
          </div>
        </div>

        {/* 1. Hero Hero Banner Showcase */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-[#0a0f1d] via-[#070a14] to-[#04060a] p-6 sm:p-10 shadow-2xl">
          <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
            {/* Hero Artwork Frame */}
            <div className="relative h-64 w-48 sm:h-80 sm:w-60 shrink-0 overflow-hidden rounded-2xl border border-white/20 bg-black shadow-2xl">
              <img
                src={hero.image}
                alt={hero.name}
                className="h-full w-full object-cover object-top"
              />
              {tierStat?.tier && (
                <div className="absolute top-3 right-3 rounded-lg bg-amber-400 px-2 py-0.5 font-mono text-xs font-black text-black shadow-lg">
                  TIER {tierStat.tier}
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded bg-black/60 px-2 py-0.5 font-mono text-xs text-slate-400 border border-white/10">
                  HERO #{hero.moonton_hero_id}
                </span>
                {hero.roles.map(r => (
                  <span
                    key={r}
                    className="rounded-md border border-amber-400/30 bg-amber-400/10 px-2.5 py-0.5 font-mono text-xs font-bold text-amber-300 uppercase"
                  >
                    {r}
                  </span>
                ))}
                {hero.lane.map(l => (
                  <span
                    key={l}
                    className="rounded-md border border-cyan-400/30 bg-cyan-400/10 px-2.5 py-0.5 font-mono text-xs font-bold text-cyan-300"
                  >
                    {l}
                  </span>
                ))}
              </div>

              <div>
                <h1 className="font-sans text-4xl sm:text-6xl font-black uppercase tracking-tight text-white">
                  {hero.name}
                </h1>
                <p className="font-mono text-sm sm:text-base text-amber-400 font-semibold mt-1">
                  "{hero.title}"
                </p>
              </div>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
                {hero.lore.id || hero.lore.en}
              </p>

              {/* Quick Telemetry Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/10">
                <div className="rounded-xl border border-white/10 bg-black/40 p-3">
                  <span className="block font-mono text-[9px] uppercase tracking-wider text-slate-500">WIN RATE</span>
                  <span className="font-mono text-xl font-black text-emerald-400">
                    {tierStat ? (tierStat.win_rate * 100).toFixed(1) + '%' : '50.0%'}
                  </span>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/40 p-3">
                  <span className="block font-mono text-[9px] uppercase tracking-wider text-slate-500">BAN RATE</span>
                  <span className="font-mono text-xl font-black text-rose-400">
                    {tierStat ? (tierStat.ban_rate * 100).toFixed(1) + '%' : '10.0%'}
                  </span>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/40 p-3">
                  <span className="block font-mono text-[9px] uppercase tracking-wider text-slate-500">PICK RATE</span>
                  <span className="font-mono text-xl font-black text-slate-200">
                    {tierStat ? (tierStat.pick_rate * 100).toFixed(2) + '%' : '1.0%'}
                  </span>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/40 p-3">
                  <span className="block font-mono text-[9px] uppercase tracking-wider text-slate-500">PRIORITAS SKILL</span>
                  <span className="font-mono text-xl font-black text-amber-400">
                    {String(hero.skill_order || '1-2-3')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Pro Equipment Builds Section */}
        <HeroBuildSection hero={hero} builds={builds} />

        {/* 3. Level 1 - 15 Base Stats Scaling Simulator */}
        <HeroLevelScalingSection hero={hero} activeBuild={primaryBuild} />

        {/* 4. Interactive Matchup & Counter Comparator */}
        <HeroMatchupComparator
          currentHero={hero}
          allHeroes={allHeroes}
          allTierStats={heroTierStats}
          allRelations={heroRelations}
        />

        {/* 5. Tournament Infographic Card with PNG Export */}
        <HeroInfographicCard hero={hero} tierStat={tierStat} activeBuild={primaryBuild} />

        {/* 6. Base Attributes & Complete Skills Archive */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Attribute Bars */}
          <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 sm:p-8 space-y-6 h-fit shadow-2xl">
            <span className="block font-mono text-xs font-bold uppercase tracking-wider text-amber-400 border-b border-white/10 pb-2">
              STATISTIK KEMAMPUAN DASAR
            </span>

            <div className="space-y-4">
              {statBars.map(st => (
                <div key={st.label}>
                  <div className="flex items-center justify-between font-mono text-xs mb-1.5">
                    <span className="text-slate-400">{st.label}</span>
                    <span className="font-bold text-white">{st.val}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                    <div
                      className={`h-full ${st.color} rounded-full`}
                      style={{ width: `${Math.min(100, Math.max(5, st.val))}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-white/10 bg-black/40 p-4 space-y-2 font-mono text-xs">
              <span className="text-slate-400 block font-bold">INFO SPESIALISASI</span>
              <div className="flex flex-wrap gap-1.5">
                {hero.speciality.map(sp => (
                  <span key={sp} className="rounded bg-white/10 px-2 py-0.5 text-slate-300">
                    {sp}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Complete Skills Showcase */}
          <div className="lg:col-span-2 space-y-4">
            <span className="block font-mono text-xs font-bold uppercase tracking-wider text-amber-400 border-b border-white/10 pb-2">
              ARSIP KEMAMPUAN LENGKAP ({hero.skills.length} SKILL)
            </span>

            <div className="space-y-4">
              {hero.skills.map((s, idx) => (
                <div
                  key={s.id}
                  className="rounded-2xl border border-white/10 bg-slate-950/70 p-5 sm:p-6 space-y-3 transition-all hover:border-amber-400/30 shadow-lg"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-white/15 bg-black">
                        {s.icon && (
                          <img
                            src={s.icon}
                            alt={s.name}
                            className="h-full w-full object-cover"
                          />
                        )}
                        <span className="absolute bottom-0 right-0 rounded bg-black/90 px-1 font-mono text-[9px] font-bold text-amber-300">
                          {idx === 0 ? 'P' : `S${idx}`}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-sans text-base font-bold text-white">
                            {s.name}
                          </h3>
                          <span className="font-mono text-[10px] text-slate-500">
                            {idx === 0 ? 'Kemampuan Pasif' : `Skill Aktif ${idx}`}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {s.tags.map(t => (
                            <span
                              key={t.name}
                              style={{ borderColor: `${t.color}40`, backgroundColor: `${t.color}15`, color: t.color }}
                              className="rounded border px-1.5 py-0.2 font-mono text-[9px] font-bold"
                            >
                              {t.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {s.cdCost && (
                      <span className="rounded-lg border border-amber-400/30 bg-amber-400/10 px-2.5 py-1 font-mono text-xs font-bold text-amber-400">
                        {s.cdCost}
                      </span>
                    )}
                  </div>

                  <div className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line font-sans">
                    {(s.desc_id.length > 0 ? s.desc_id : s.desc_en).map((part, pIdx) => (
                      <span key={pIdx} style={{ color: part.c || 'inherit' }}>
                        {part.t || ''}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 7. Counter Matrix & Sinergi Hub */}
        {relation && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/10">
            {/* Counter Picks */}
            <div className="rounded-3xl border border-rose-500/20 bg-rose-950/10 p-6 space-y-4">
              <span className="block font-mono text-xs font-bold uppercase tracking-wider text-rose-400 border-b border-rose-500/20 pb-2">
                🛡️ HERO COUNTER ({hero.name} LEMAH LAWAN INI)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {relation.counters && relation.counters.length > 0 ? (
                  relation.counters.map((c: any) => {
                    const counterHero = allHeroes.find(h => h.name.toLowerCase() === c.name.toLowerCase());
                    return (
                      <Link
                        key={c.name}
                        href={counterHero ? `/mlbb/heroes/${counterHero.slug}` : `/mlbb/heroes`}
                        className="group flex items-center gap-3 rounded-xl border border-white/10 bg-black/50 p-2.5 transition-all hover:border-rose-400/50 hover:bg-rose-950/30"
                      >
                        <img
                          src={c.icon}
                          alt={c.name}
                          className="h-10 w-10 rounded-lg object-cover"
                        />
                        <div className="min-w-0">
                          <span className="block font-sans text-xs font-bold text-white group-hover:text-rose-300 truncate">
                            {c.name}
                          </span>
                          <span className="block font-mono text-[10px] text-slate-400">Lihat Profil →</span>
                        </div>
                      </Link>
                    );
                  })
                ) : (
                  <span className="font-mono text-xs text-slate-500">Tidak ada data counter tercatat.</span>
                )}
              </div>
            </div>

            {/* Synergies */}
            <div className="rounded-3xl border border-emerald-500/20 bg-emerald-950/10 p-6 space-y-4">
              <span className="block font-mono text-xs font-bold uppercase tracking-wider text-emerald-400 border-b border-emerald-500/20 pb-2">
                🤝 SINERGI TERBAIK ({hero.name} KUAT BERSAMA INI)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {relation.synergies && relation.synergies.length > 0 ? (
                  relation.synergies.map((s: any) => {
                    const synergyHero = allHeroes.find(h => h.name.toLowerCase() === s.name.toLowerCase());
                    return (
                      <Link
                        key={s.name}
                        href={synergyHero ? `/mlbb/heroes/${synergyHero.slug}` : `/mlbb/heroes`}
                        className="group flex items-center gap-3 rounded-xl border border-white/10 bg-black/50 p-2.5 transition-all hover:border-emerald-400/50 hover:bg-emerald-950/30"
                      >
                        <img
                          src={s.icon}
                          alt={s.name}
                          className="h-10 w-10 rounded-lg object-cover"
                        />
                        <div className="min-w-0">
                          <span className="block font-sans text-xs font-bold text-white group-hover:text-emerald-300 truncate">
                            {s.name}
                          </span>
                          <span className="block font-mono text-[10px] text-slate-400">Lihat Profil →</span>
                        </div>
                      </Link>
                    );
                  })
                ) : (
                  <span className="font-mono text-xs text-slate-500">Tidak ada data sinergi tercatat.</span>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
