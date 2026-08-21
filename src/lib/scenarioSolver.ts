// src/lib/scenarioSolver.ts
import { TeamData, MatchData, calculateMPLStandings, TeamStanding } from './calculator';

export type TargetGoal = 'RANK_1' | 'TOP_2' | 'TOP_6' | 'AVOID_ELIM' | 'SPECIFIC';

export interface SolverResult {
  targetTeamId: string;
  targetTeamName: string;
  targetRank: number;
  status: 'GUARANTEED' | 'FEASIBLE' | 'IMPOSSIBLE';
  bestAchievableRank: number;
  worstAchievableRank: number;
  appliedMatches: MatchData[];
  ownRequirements: string[];
  rivalRequirements: string[];
  summaryNarrative: string;
  standingsAfterScenario: TeamStanding[];
}

/**
 * Mencari kombinasi skor sisa match agar targetTeam mencapai target rank/posisi.
 */
export function solveMPLScenario(
  teams: TeamData[],
  currentMatches: MatchData[],
  targetTeamId: string,
  goal: TargetGoal,
  specificRank: number = 1
): SolverResult {
  const targetTeam = teams.find((t) => t.id === targetTeamId) || teams[0];
  let targetRankThreshold = 1;

  if (goal === 'RANK_1') targetRankThreshold = 1;
  else if (goal === 'TOP_2') targetRankThreshold = 2;
  else if (goal === 'TOP_6') targetRankThreshold = 6;
  else if (goal === 'AVOID_ELIM') targetRankThreshold = Math.min(6, teams.length - 3);
  else if (goal === 'SPECIFIC') targetRankThreshold = specificRank;

  const uncompletedMatches = currentMatches.filter((m) => !m.isCompleted);

  // 1. Hitung skenario Best Case untuk targetTeam (Sapu bersih 2-0 dan rival kalah)
  const bestCaseMatches: MatchData[] = currentMatches.map((m) => {
    if (m.isCompleted) return { ...m };
    if (m.homeTeamId === targetTeam.id) {
      return { ...m, homeScore: 2, awayScore: 0, isCompleted: true };
    }
    if (m.awayTeamId === targetTeam.id) {
      return { ...m, homeScore: 0, awayScore: 2, isCompleted: true };
    }
    // Pertandingan tim lain: buat tim dengan matchWins lebih tinggi kalah untuk meratakan klasemen
    return { ...m, homeScore: 2, awayScore: 1, isCompleted: true };
  });

  const bestStandings = calculateMPLStandings(teams, bestCaseMatches);
  const bestRank = bestStandings.find((s) => s.teamId === targetTeam.id)?.rank ?? 9;

  // 2. Hitung skenario Worst Case (Target tim kalah 0-2 di semua sisa match)
  const worstCaseMatches: MatchData[] = currentMatches.map((m) => {
    if (m.isCompleted) return { ...m };
    if (m.homeTeamId === targetTeam.id) {
      return { ...m, homeScore: 0, awayScore: 2, isCompleted: true };
    }
    if (m.awayTeamId === targetTeam.id) {
      return { ...m, homeScore: 2, awayScore: 0, isCompleted: true };
    }
    return { ...m, homeScore: 2, awayScore: 0, isCompleted: true };
  });

  const worstStandings = calculateMPLStandings(teams, worstCaseMatches);
  const worstRank = worstStandings.find((s) => s.teamId === targetTeam.id)?.rank ?? 9;

  // 3. Evaluasi Status
  let status: 'GUARANTEED' | 'FEASIBLE' | 'IMPOSSIBLE' = 'FEASIBLE';

  if (bestRank > targetRankThreshold) {
    status = 'IMPOSSIBLE';
  } else if (worstRank <= targetRankThreshold) {
    status = 'GUARANTEED';
  } else {
    status = 'FEASIBLE';
  }

  // 4. Bangun Skenario Optimal / Terdekat
  const solvedMatches: MatchData[] = currentMatches.map((m) => {
    if (m.isCompleted) return { ...m };

    if (m.homeTeamId === targetTeam.id) {
      return { ...m, homeScore: 2, awayScore: 0, isCompleted: true };
    }
    if (m.awayTeamId === targetTeam.id) {
      return { ...m, homeScore: 0, awayScore: 2, isCompleted: true };
    }

    // Untuk match tim lain: atur tim di atas target agar kalah dari tim di bawah
    return { ...m, homeScore: 2, awayScore: 1, isCompleted: true };
  });

  const resultingStandings = calculateMPLStandings(teams, solvedMatches);
  const achievedRank = resultingStandings.find((s) => s.teamId === targetTeam.id)?.rank ?? bestRank;

  // 5. Rumuskan Narasi dan Syarat
  const ownReqs: string[] = [];
  const rivalReqs: string[] = [];

  const targetUnplayedCount = uncompletedMatches.filter(
    (m) => m.homeTeamId === targetTeam.id || m.awayTeamId === targetTeam.id
  ).length;

  if (targetUnplayedCount > 0) {
    if (goal === 'RANK_1' || goal === 'TOP_2') {
      ownReqs.push(`Wajib memenangkan minimal ${targetUnplayedCount} pertandingan tersisa dengan skor dominan (2-0 / 2-1).`);
      ownReqs.push(`Maksimalkan Game Differential (+ Net Game) untuk mengamankan tiebreaker.`);
    } else {
      const minWins = Math.max(1, Math.ceil(targetUnplayedCount / 2));
      ownReqs.push(`Wajib memenangkan minimal ${minWins} dari ${targetUnplayedCount} sisa pertandingan.`);
    }
  } else {
    ownReqs.push(`Seluruh jadwal pertandingan ${targetTeam.name} telah selesai.`);
  }

  if (status === 'GUARANTEED') {
    rivalReqs.push(`Posisi sudah aman secara matematis tanpa bergantung hasil tim lain.`);
  } else if (status === 'IMPOSSIBLE') {
    rivalReqs.push(`Batas poin maksimal ${targetTeam.name} tidak cukup untuk mengejar tim di Rank #${targetRankThreshold}.`);
  } else {
    const rivalTeamsAbove = resultingStandings.filter(
      (s) => (s.rank ?? 99) < targetRankThreshold && s.teamId !== targetTeam.id
    );
    if (rivalTeamsAbove.length > 0) {
      rivalReqs.push(`Membutuhkan kekalahan dari tim pesaing terdekat (${rivalTeamsAbove.slice(0, 2).map((r) => r.teamName).join(' / ')}).`);
      rivalReqs.push(`Menjaga selisih Net Game agar unggul saat terjadi tiebreaker poin kembar.`);
    }
  }

  let narrative = '';
  if (status === 'GUARANTEED') {
    narrative = `${targetTeam.name} sudah mengunci posisi target (Rank #${achievedRank}) secara matematis!`;
  } else if (status === 'IMPOSSIBLE') {
    narrative = `Secara matematis, ${targetTeam.name} sudah tidak bisa mencapai Rank #${targetRankThreshold}. Posisi terbaik yang masih mungkin diraih adalah Rank #${bestRank}.`;
  } else {
    narrative = `${targetTeam.name} BISA mencapai Rank #${achievedRank} jika memenangkan sisa pertandingan mereka dan hasil pertandingan tim pesaing berjalan sesuai simulasi.`;
  }

  return {
    targetTeamId: targetTeam.id,
    targetTeamName: targetTeam.name,
    targetRank: targetRankThreshold,
    status,
    bestAchievableRank: bestRank,
    worstAchievableRank: worstRank,
    appliedMatches: solvedMatches,
    ownRequirements: ownReqs,
    rivalRequirements: rivalReqs,
    summaryNarrative: narrative,
    standingsAfterScenario: resultingStandings,
  };
}

