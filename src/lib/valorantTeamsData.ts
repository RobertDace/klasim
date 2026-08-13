// src/lib/valorantTeamsData.ts
import { ValorantTeam, ValorantMatchData } from './valorantCalculator';

export const valorantTeams: ValorantTeam[] = [
  // GROUP A (ALPHA)
  { id: 'prx', name: 'Paper Rex', code: 'PRX', group: 'A' },
  { id: 'gen', name: 'Gen.G Esports', code: 'GEN', group: 'A' },
  { id: 'rrq_v', name: 'Rex Regum Qeon', code: 'RRQ', group: 'A' },
  { id: 'tln_v', name: 'Talon Esports', code: 'TLN', group: 'A' },
  { id: 'ts', name: 'Team Secret', code: 'TS', group: 'A' },

  // GROUP B (OMEGA)
  { id: 'drx', name: 'DRX', code: 'DRX', group: 'B' },
  { id: 't1', name: 'T1', code: 'T1', group: 'B' },
  { id: 'zeta', name: 'ZETA DIVISION', code: 'ZETA', group: 'B' },
  { id: 'ge', name: 'Global Esports', code: 'GE', group: 'B' },
  { id: 'dfm', name: 'DetonatioN FocusMe', code: 'DFM', group: 'B' },
  { id: 'bld', name: 'BLEED Esports', code: 'BLD', group: 'B' },
];

export const initialValorantMatches: ValorantMatchData[] = [
  // Group A Matches
  { id: 'v_m1', group: 'A', homeTeamId: 'prx', awayTeamId: 'gen', homeMaps: 0, awayMaps: 0, homeRounds: 0, awayRounds: 0, isCompleted: false },
  { id: 'v_m2', group: 'A', homeTeamId: 'rrq_v', awayTeamId: 'tln_v', homeMaps: 0, awayMaps: 0, homeRounds: 0, awayRounds: 0, isCompleted: false },
  { id: 'v_m3', group: 'A', homeTeamId: 'ts', awayTeamId: 'prx', homeMaps: 0, awayMaps: 0, homeRounds: 0, awayRounds: 0, isCompleted: false },
  { id: 'v_m4', group: 'A', homeTeamId: 'gen', awayTeamId: 'rrq_v', homeMaps: 0, awayMaps: 0, homeRounds: 0, awayRounds: 0, isCompleted: false },

  // Group B Matches
  { id: 'v_m5', group: 'B', homeTeamId: 'drx', awayTeamId: 't1', homeMaps: 0, awayMaps: 0, homeRounds: 0, awayRounds: 0, isCompleted: false },
  { id: 'v_m6', group: 'B', homeTeamId: 'zeta', awayTeamId: 'ge', homeMaps: 0, awayMaps: 0, homeRounds: 0, awayRounds: 0, isCompleted: false },
  { id: 'v_m7', group: 'B', homeTeamId: 'dfm', awayTeamId: 'bld', homeMaps: 0, awayMaps: 0, homeRounds: 0, awayRounds: 0, isCompleted: false },
  { id: 'v_m8', group: 'B', homeTeamId: 't1', awayTeamId: 'zeta', homeMaps: 0, awayMaps: 0, homeRounds: 0, awayRounds: 0, isCompleted: false },
];