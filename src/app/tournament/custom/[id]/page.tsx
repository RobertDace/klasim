// src/app/tournament/custom/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import TournamentContainer from '@/components/tournament/TournamentContainer';
import PUBGMTournamentContainer from '@/components/pubgm/PUBGMTournamentContainer';
import ValorantTournamentContainer from '@/components/valorant/ValorantTournamentContainer';
import { getCustomTournamentById, CustomTournament } from '@/lib/customTournamentStore';

export default function CustomTournamentViewPage() {
  const params = useParams();
  const router = useRouter();
  const [tournament, setTournament] = useState<CustomTournament | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      const data = getCustomTournamentById(params.id as string);
      if (data) {
        setTournament(data);
      }
    }
    setLoading(false);
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#05070c] font-mono text-xs text-slate-400">
        MEMUAT DATA TURNAMEN...
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#05070c] space-y-4 font-mono">
        <div className="text-sm font-bold text-rose-400">TURNAMEN TIDAK DITEMUKAN</div>
        <button
          onClick={() => router.push('/')}
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-slate-200"
        >
          KEMBALI KE BERANDA
        </button>
      </div>
    );
  }

  // Generate Initial Match Scaffolding untuk Custom Tournament
  if (tournament.format === 'MOBA') {
    const mobaTeams = tournament.teams.map((t) => ({
      id: t.id,
      name: t.name,
      code: t.code,
    }));

    // Round Robin Matches 1 Week
    const initialMatches: any[] = [];
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

  if (tournament.format === 'FPS') {
    const valTeams = tournament.teams.map((t, idx) => ({
      id: t.id,
      name: t.name,
      code: t.code,
      group: (idx % 2 === 0 ? 'A' : 'B') as 'A' | 'B',
    }));

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

    return (
      <main className="min-h-screen bg-[#05070c] text-slate-100">
        <ValorantTournamentContainer
          tournamentName={tournament.title}
          teams={valTeams}
          initialMatches={[...groupAMatches, ...groupBMatches]}
        />
      </main>
    );
  }

  return null;
}