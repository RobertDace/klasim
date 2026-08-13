// src/app/tournament/vct-pacific-2026/page.tsx
import ValorantTournamentContainer from '@/components/valorant/ValorantTournamentContainer';
import { valorantTeams, initialValorantMatches } from '@/lib/valorantTeamsData';

export default function VCTPacificPage() {
  return (
    <main className="min-h-screen bg-[#05070c] text-slate-100">
      <ValorantTournamentContainer
        tournamentName="VCT Pacific Kickoff 2026"
        teams={valorantTeams}
        initialMatches={initialValorantMatches}
      />
    </main>
  );
}