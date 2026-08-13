// src/lib/pubgmCalculator.ts

export interface PUBGMTeam {
  id: string;
  name: string;
  code: string;
}

export interface PUBGMMatchResult {
  matchId: string;
  mapName: string;
  matchNumber: number;
  teamResults: {
    teamId: string;
    rank: number;
    kills: number;
  }[];
}

export interface PUBGMStanding {
  teamId: string;
  teamName: string;
  teamCode: string;
  matchesPlayed: number;
  wwcd: number;
  rankPoints: number;
  elimPoints: number;
  totalPoints: number;
  lastMatchPoints: number;
  lastMatchRank: number;
  rank?: number;
}

const PMWC_RANK_POINTS: Record<number, number> = {
  1: 10,
  2: 6,
  3: 5,
  4: 4,
  5: 3,
  6: 2,
  7: 1,
  8: 1,
  9: 0,
  10: 0,
  11: 0,
  12: 0,
  13: 0,
  14: 0,
  15: 0,
  16: 0,
};

export function calculatePUBGMStandings(
  teams: PUBGMTeam[],
  matches: PUBGMMatchResult[]
): PUBGMStanding[] {
  const standingsMap: Record<string, PUBGMStanding> = {};

  teams.forEach((team) => {
    standingsMap[team.id] = {
      teamId: team.id,
      teamName: team.name,
      teamCode: team.code,
      matchesPlayed: 0,
      wwcd: 0,
      rankPoints: 0,
      elimPoints: 0,
      totalPoints: 0,
      lastMatchPoints: 0,
      lastMatchRank: 99,
    };
  });

  const sortedMatches = [...matches].sort((a, b) => a.matchNumber - b.matchNumber);

  sortedMatches.forEach((match) => {
    match.teamResults.forEach((res) => {
      const standing = standingsMap[res.teamId];
      if (!standing) return;

      const rankPts = PMWC_RANK_POINTS[res.rank] ?? 0;
      const elimPts = Math.max(0, res.kills);
      const matchPts = rankPts + elimPts;

      standing.matchesPlayed += 1;
      if (res.rank === 1) {
        standing.wwcd += 1;
      }
      standing.rankPoints += rankPts;
      standing.elimPoints += elimPts;
      standing.totalPoints += matchPts;

      standing.lastMatchPoints = matchPts;
      standing.lastMatchRank = res.rank;
    });
  });

  const standingsList = Object.values(standingsMap);

  // Sorting Tiebreaker Resmi PMWC
  standingsList.sort((a, b) => {
    if (b.totalPoints !== a.totalPoints) {
      return b.totalPoints - a.totalPoints;
    }
    if (b.wwcd !== a.wwcd) {
      return b.wwcd - a.wwcd;
    }
    if (b.elimPoints !== a.elimPoints) {
      return b.elimPoints - a.elimPoints;
    }
    if (b.lastMatchPoints !== a.lastMatchPoints) {
      return b.lastMatchPoints - a.lastMatchPoints;
    }
    return a.lastMatchRank - b.lastMatchRank;
  });

  return standingsList.map((team, index) => ({
    ...team,
    rank: index + 1,
  }));
}