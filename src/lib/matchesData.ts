// src/lib/matchesData.ts
import { MatchData } from './calculator';

export const initialMatches: Omit<MatchData, 'homeTeam' | 'awayTeam'>[] = [
  // ==================== WEEK 1 ====================
  { id: 'm1_1', week: 1, homeTeamId: 'rrq', awayTeamId: 'evos', homeScore: 0, awayScore: 0, isCompleted: false },
  { id: 'm1_2', week: 1, homeTeamId: 'onic', awayTeamId: 'btr', homeScore: 0, awayScore: 0, isCompleted: false },
  { id: 'm1_3', week: 1, homeTeamId: 'geek', awayTeamId: 'ae', homeScore: 0, awayScore: 0, isCompleted: false },
  { id: 'm1_4', week: 1, homeTeamId: 'tlid', awayTeamId: 'rbl', homeScore: 0, awayScore: 0, isCompleted: false },

  // ==================== WEEK 2 ====================
  { id: 'm2_1', week: 2, homeTeamId: 'evos', awayTeamId: 'onic', homeScore: 0, awayScore: 0, isCompleted: false },
  { id: 'm2_2', week: 2, homeTeamId: 'btr', awayTeamId: 'rrq', homeScore: 0, awayScore: 0, isCompleted: false },
  { id: 'm2_3', week: 2, homeTeamId: 'dewa', awayTeamId: 'geek', homeScore: 0, awayScore: 0, isCompleted: false },
  { id: 'm2_4', week: 2, homeTeamId: 'ae', awayTeamId: 'tlid', homeScore: 0, awayScore: 0, isCompleted: false },

  // ==================== WEEK 3 ====================
  { id: 'm3_1', week: 3, homeTeamId: 'rrq', awayTeamId: 'dewa', homeScore: 0, awayScore: 0, isCompleted: false },
  { id: 'm3_2', week: 3, homeTeamId: 'onic', awayTeamId: 'ae', homeScore: 0, awayScore: 0, isCompleted: false },
  { id: 'm3_3', week: 3, homeTeamId: 'rbl', awayTeamId: 'evos', homeScore: 0, awayScore: 0, isCompleted: false },
  { id: 'm3_4', week: 3, homeTeamId: 'geek', awayTeamId: 'btr', homeScore: 0, awayScore: 0, isCompleted: false },

  // ==================== WEEK 4 ====================
  { id: 'm4_1', week: 4, homeTeamId: 'tlid', awayTeamId: 'rrq', homeScore: 0, awayScore: 0, isCompleted: false },
  { id: 'm4_2', week: 4, homeTeamId: 'evos', awayTeamId: 'geek', homeScore: 0, awayScore: 0, isCompleted: false },
  { id: 'm4_3', week: 4, homeTeamId: 'dewa', awayTeamId: 'onic', homeScore: 0, awayScore: 0, isCompleted: false },
  { id: 'm4_4', week: 4, homeTeamId: 'btr', awayTeamId: 'rbl', homeScore: 0, awayScore: 0, isCompleted: false },

  // ==================== WEEK 5 ====================
  { id: 'm5_1', week: 5, homeTeamId: 'ae', awayTeamId: 'evos', homeScore: 0, awayScore: 0, isCompleted: false },
  { id: 'm5_2', week: 5, homeTeamId: 'rbl', awayTeamId: 'dewa', homeScore: 0, awayScore: 0, isCompleted: false },
  { id: 'm5_3', week: 5, homeTeamId: 'onic', awayTeamId: 'tlid', homeScore: 0, awayScore: 0, isCompleted: false },
  { id: 'm5_4', week: 5, homeTeamId: 'geek', awayTeamId: 'rrq', homeScore: 0, awayScore: 0, isCompleted: false },

  // ==================== WEEK 6 ====================
  { id: 'm6_1', week: 6, homeTeamId: 'btr', awayTeamId: 'tlid', homeScore: 0, awayScore: 0, isCompleted: false },
  { id: 'm6_2', week: 6, homeTeamId: 'rrq', awayTeamId: 'ae', homeScore: 0, awayScore: 0, isCompleted: false },
  { id: 'm6_3', week: 6, homeTeamId: 'dewa', awayTeamId: 'evos', homeScore: 0, awayScore: 0, isCompleted: false },
  { id: 'm6_4', week: 6, homeTeamId: 'rbl', awayTeamId: 'onic', homeScore: 0, awayScore: 0, isCompleted: false },

  // ==================== WEEK 7 ====================
  { id: 'm7_1', week: 7, homeTeamId: 'tlid', awayTeamId: 'geek', homeScore: 0, awayScore: 0, isCompleted: false },
  { id: 'm7_2', week: 7, homeTeamId: 'evos', awayTeamId: 'btr', homeScore: 0, awayScore: 0, isCompleted: false },
  { id: 'm7_3', week: 7, homeTeamId: 'ae', awayTeamId: 'dewa', homeScore: 0, awayScore: 0, isCompleted: false },
  { id: 'm7_4', week: 7, homeTeamId: 'rbl', awayTeamId: 'rrq', homeScore: 0, awayScore: 0, isCompleted: false },

  // ==================== WEEK 8 ====================
  { id: 'm8_1', week: 8, homeTeamId: 'onic', awayTeamId: 'geek', homeScore: 0, awayScore: 0, isCompleted: false },
  { id: 'm8_2', week: 8, homeTeamId: 'btr', awayTeamId: 'ae', homeScore: 0, awayScore: 0, isCompleted: false },
  { id: 'm8_3', week: 8, homeTeamId: 'tlid', awayTeamId: 'dewa', homeScore: 0, awayScore: 0, isCompleted: false },
  { id: 'm8_4', week: 8, homeTeamId: 'ae', awayTeamId: 'rbl', homeScore: 0, awayScore: 0, isCompleted: false },

  // ==================== WEEK 9 ====================
  { id: 'm9_1', week: 9, homeTeamId: 'rrq', awayTeamId: 'onic', homeScore: 0, awayScore: 0, isCompleted: false },
  { id: 'm9_2', week: 9, homeTeamId: 'geek', awayTeamId: 'rbl', homeScore: 0, awayScore: 0, isCompleted: false },
  { id: 'm9_3', week: 9, homeTeamId: 'evos', awayTeamId: 'tlid', homeScore: 0, awayScore: 0, isCompleted: false },
  { id: 'm9_4', week: 9, homeTeamId: 'dewa', awayTeamId: 'btr', homeScore: 0, awayScore: 0, isCompleted: false },
];