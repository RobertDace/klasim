// src/app/tournament/custom/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import TournamentContainer from '@/components/tournament/TournamentContainer';
import PUBGMTournamentContainer from '@/components/pubgm/PUBGMTournamentContainer';
import ValorantTournamentContainer from '@/components/valorant/ValorantTournamentContainer';
import { getCustomTournamentById, CustomTournament, GameFormat } from '@/lib/customTournamentStore';
import { getCustomTournamentBySlugOrId } from '@/actions/tournament';

export default function CustomTournamentViewPage() {
  const params = useParams();
  const router = useRouter();
  const [tournament, setTournament] = useState<CustomTournament | null>(null);
  const [dbMatches, setDbMatches] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      const idOrSlug = params.id as string;
      if (!idOrSlug) {
        setLoading(false);
        return;
      }

      // 1. Coba ambil dari database server via Server Action
      try {
        const dbData = await getCustomTournamentBySlugOrId(idOrSlug);
        if (dbData && isMounted) {
          let format: GameFormat = 'MOBA';
          if (dbData.format.includes('BR')) format = 'BATTLE_ROYALE';
          else if (dbData.format.includes('FPS')) format = 'FPS';

          setTournament({
            id: dbData.slug || dbData.id,
            title: dbData.name,
            format: format,
            createdAt: new Date(dbData.createdAt).getTime(),
            teams: dbData.teams.map((t, idx) => ({
              id: t.id,
              name: t.name,
              code: t.code,
              group: format === 'FPS' ? (idx % 2 === 0 ? 'A' : 'B') : undefined,
            })),
          });

          if (dbData.matches && dbData.matches.length > 0) {
            setDbMatches(dbData.matches);
          }

          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn('Server fetch error, falling back to localStorage:', err);
      }

      // 2. Fallback ke localStorage jika tidak ada di database
      const localData = getCustomTournamentById(idOrSlug);
      if (localData && isMounted) {
        setTournament(localData);
      }

      if (isMounted) {
        setLoading(false);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#05070c] font-mono text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
          <span>MEMUAT DATA TURNAMEN CLOUD...</span>
        </div>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#05070c] space-y-4 font-mono">
        <div className="text-sm font-bold text-rose-400">TURNAMEN TIDAK DITEMUKAN</div>
        <button
          onClick={() => router.push('/')}
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-slate-200 hover:bg-white/10 active:scale-95 transition-all"
        >
          KEMBALI KE BERANDA
        </button>
      </div>
    );
  }

  // 1. FORMAT MOBA
  if (tournament.format === 'MOBA') {
    const mobaTeams = tournament.teams.map((t) => ({
      id: t.id,
      name: t.name,
      code: t.code,
    }));

    let initialMatches: any[] = [];

    if (dbMatches && dbMatches.length > 0) {
      initialMatches = dbMatches.map((m) => ({
        id: m.id,
        week: m.week || 1,
        homeTeamId: m.homeTeamId,
        awayTeamId: m.awayTeamId,
        homeTeam: m.homeTeam,
        awayTeam: m.awayTeam,
        homeScore: m.homeScore,
        awayScore: m.awayScore,
        isCompleted: m.isCompleted,
      }));
    } else {
      // Scaffolding Round Robin Lokal
      let matchCounter = 1;
      for (let i = 0; i < mobaTeams.length; i++) {
        for (let j = i + 1; j < mobaTeams.length; j++) {
          initialMatches.push({
            id: `custom_m_${matchCounter++}`,
            week: 1,
            homeTeamId: mobaTeams[i].id,
            awayTeamId: mobaTeams[j].id,
            homeScore: 0,
            awayScore: 0,
            isCompleted: false,
          });
        }
      }
    }

    return (
      <main className="min-h-screen bg-[#05070c] text-slate-100">
        <TournamentContainer
          tournamentName={tournament.title}
          teams={mobaTeams}
          initialMatches={initialMatches}
        />
      </main>
    );
  }

  // 2. FORMAT BATTLE ROYALE
  if (tournament.format === 'BATTLE_ROYALE') {
    const pubgmTeams = tournament.teams.map((t) => ({
      id: t.id,
      name: t.name,
      code: t.code,
    }));

    return (
      <main className="min-h-screen bg-[#05070c] text-slate-100">
        <PUBGMTournamentContainer
          tournamentName={tournament.title}
          teams={pubgmTeams}
        />
      </main>
    );
  }

  // 3. FORMAT FPS
  if (tournament.format === 'FPS') {
    const valTeams = tournament.teams.map((t, idx) => ({
      id: t.id,
      name: t.name,
      code: t.code,
      group: (t.group || (idx % 2 === 0 ? 'A' : 'B')) as 'A' | 'B',
    }));

    let initialMatches: any[] = [];

    if (dbMatches && dbMatches.length > 0) {
      initialMatches = dbMatches.map((m) => {
        const homeTeamObj = valTeams.find((t) => t.id === m.homeTeamId);
        return {
          id: m.id,
          week: m.week || 1,
          group: (homeTeamObj ? homeTeamObj.group : 'A') as 'A' | 'B',
          homeTeamId: m.homeTeamId,
          awayTeamId: m.awayTeamId,
          homeMaps: m.homeScore,
          awayMaps: m.awayScore,
          homeRounds: 0,
          awayRounds: 0,
          isCompleted: m.isCompleted,
        };
      });
    } else {
      const groupAMatches: any[] = [];
      const groupBMatches: any[] = [];

      const groupA = valTeams.filter((t) => t.group === 'A');
      const groupB = valTeams.filter((t) => t.group === 'B');

      let counter = 1;

      for (let i = 0; i < groupA.length; i++) {
        for (let j = i + 1; j < groupA.length; j++) {
          groupAMatches.push({
            id: `val_custom_${counter++}`,
            group: 'A',
            homeTeamId: groupA[i].id,
            awayTeamId: groupA[j].id,
            homeMaps: 0,
            awayMaps: 0,
            homeRounds: 0,
            awayRounds: 0,
            isCompleted: false,
          });
        }
      }

      for (let i = 0; i < groupB.length; i++) {
        for (let j = i + 1; j < groupB.length; j++) {
          groupBMatches.push({
            id: `val_custom_${counter++}`,
            group: 'B',
            homeTeamId: groupB[i].id,
            awayTeamId: groupB[j].id,
            homeMaps: 0,
            awayMaps: 0,
            homeRounds: 0,
            awayRounds: 0,
            isCompleted: false,
          });
        }
      }

      initialMatches = [...groupAMatches, ...groupBMatches];
    }

    return (
      <main className="min-h-screen bg-[#05070c] text-slate-100">
        <ValorantTournamentContainer
          tournamentName={tournament.title}
          teams={valTeams}
          initialMatches={initialMatches}
        />
      </main>
    );
  }

  return null;
}