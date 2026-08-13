// src/app/page.tsx
import Link from 'next/link';

export default function HomePage() {
  const activeTournaments = [
    {
      slug: 'mpl-id-s14',
      title: 'MPL ID Season 14',
      game: 'Mobile Legends: Bang Bang',
      category: 'MOBA // REGULAR SEASON & PLAYOFFS',
      teamsCount: 9,
      status: 'LIVE SIMULATOR',
      featured: true,
      color: 'border-amber-500/30 text-amber-400',
      href: '/tournament/mpl-id-s14',
    },
    {
      slug: 'pmwc-2026',
      title: 'PMWC 2026 Main Stage',
      game: 'PUBG Mobile',
      category: 'BATTLE ROYALE // PMWC POINT SYSTEM',
      teamsCount: 16,
      status: 'PMWC RULES ACTIVE',
      featured: true,
      color: 'border-amber-500/30 text-amber-400',
      href: '/tournament/pmwc-2026',
    },
    {
      slug: 'vct-pacific-2026',
      title: 'VCT Pacific Kickoff 2026',
      game: 'VALORANT',
      category: 'FPS // GROUP STAGE (BO3)',
      teamsCount: 11,
      status: 'VCT RULES ACTIVE',
      featured: true,
      color: 'border-cyan-500/30 text-cyan-400',
      href: '/tournament/vct-pacific-2026',
    },
  ];

  return (
    <main className="relative min-h-screen bg-[#05070c] text-slate-100 selection:bg-amber-400 selection:text-black">
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-amber-500/10 blur-[160px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-16 flex items-center justify-between border-b border-white/10 pb-6">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-400 font-mono text-lg font-black text-black shadow-[0_0_20px_rgba(251,191,36,0.3)]">
              K
            </span>
            <span className="font-mono text-xl font-black uppercase tracking-wider text-white">
              KLASIM
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/tournament/create"
              className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-4 py-2 font-mono text-xs font-black uppercase text-black shadow-lg shadow-amber-400/20 transition-all hover:bg-amber-300 active:scale-95"
            >
              + Buat Turnamen
            </Link>
          </div>
        </header>

        <section className="mb-16 max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-1 font-mono text-[11px] font-extrabold uppercase tracking-widest text-amber-400">
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
            SIMULASI SKENARIO PRO
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tight text-white sm:text-6xl leading-none">
            HITUNG KANSA LOLOS TIM FAVORITMU
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
            Pilih format turnamen pilihanmu. Simulasi skor H2H untuk MOBA, kalkulasi poin placement & kill untuk Battle Royale, atau skor ronde Map BO3 untuk VALORANT.
          </p>
        </section>

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-mono text-xs font-black uppercase tracking-widest text-slate-300">
              Pilih Turnamen Aktif
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {activeTournaments.map((item) => (
              <div
                key={item.slug}
                className="group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-slate-950/80 p-6 transition-all hover:border-amber-400/50 backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.5)]"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {item.game}
                    </span>
                    <span className={`rounded px-2 py-0.5 font-mono text-[10px] font-extrabold uppercase bg-white/5 border ${item.color}`}>
                      {item.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-extrabold uppercase text-white group-hover:text-amber-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="mt-1 font-mono text-xs text-slate-400">
                      {item.category} // {item.teamsCount} Teams
                    </p>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-white/5">
                  <Link
                    href={item.href}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-400 px-4 py-3 font-mono text-xs font-black uppercase text-black shadow-lg shadow-amber-400/20 transition-all hover:bg-amber-300 active:scale-95"
                  >
                    Buka Simulator
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}