// src/app/tournament/pmwc-2026/page.tsx
import PUBGMTournamentContainer from '@/components/pubgm/PUBGMTournamentContainer';
import { pubgmTeams } from '@/lib/pubgmTeamsData';

export default function PMWCTournamentPage() {
  return (
    <main className="min-h-screen bg-[#05070c] text-slate-100">
      <PUBGMTournamentContainer
        tournamentName="PUBG Mobile World Cup 2026"
        teams={pubgmTeams}
      />
    </main>
  );
}