// src/app/tournament/[slug]/page.tsx
import TournamentContainer from '@/components/tournament/TournamentContainer';
import { initialMatches } from '@/lib/matchesData';

// Contoh data tim MPL ID
const teams = [
  { id: 'rrq', name: 'RRQ Hoshi', code: 'RRQ' },
  { id: 'onic', name: 'Fnatic ONIC', code: 'ONIC' },
  { id: 'evos', name: 'EVOS Glory', code: 'EVOS' },
  { id: 'btr', name: 'Bigetron Alpha', code: 'BTR' },
  { id: 'ae', name: 'Alter Ego', code: 'AE' },
  { id: 'geek', name: 'Geek Fam', code: 'GEEK' },
  { id: 'tlid', name: 'Team Liquid ID', code: 'TLID' },
  { id: 'dewa', name: 'Dewa United Esports', code: 'DEWA' },
  { id: 'rbl', name: 'Rebellion Esports', code: 'RBL' },
];

export default function TournamentPage() {
  return (
    <main className="min-h-screen bg-[#05070c] text-slate-100">
      <TournamentContainer
        tournamentName="MPL ID Season 14"
        teams={teams}
        initialMatches={initialMatches}
      />
    </main>
  );
}