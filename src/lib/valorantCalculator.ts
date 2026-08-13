// src/lib/valorantCalculator.ts

export interface ValorantTeam {
  id: string;
  name: string;
  code: string;
  group: 'A' | 'B';
}

export interface ValorantMatchData {
  id: string;
  group: 'A' | 'B';
  homeTeamId: string;
  awayTeamId: string;
  homeMaps: number; // 0, 1, atau 2
  awayMaps: number; // 0, 1, atau 2
  homeRounds: number;
  awayRounds: number;
  isCompleted: boolean;
}

export interface ValorantStanding {
  teamId: string;
  teamName: string;
  teamCode: string;
  group: 'A' | 'B';
  matchPlayed: number;
  matchWins: number;
  matchLosses: number;
  mapsWon: number;
  mapsLost: number;
  mapDiff: number;
  roundsWon: number;
  roundsLost: number;
  roundDiff: number;
  rank?: number;
}

export function calculateValorantStandings(
  teams: ValorantTeam[],
  matches: ValorantMatchData[],
  groupFilter?: 'A' | 'B'
): ValorantStanding[] {
  const filteredTeams = groupFilter ? teams.filter((t) => t.group === groupFilter) : teams;
  const standingsMap: Record<string, ValorantStanding> = {};

  filteredTeams.forEach((team) => {
    standingsMap[team.id] = {
      teamId: team.id,
      teamName: team.name,
      teamCode: team.code,
      group: team.group,
      matchPlayed: 0,
      matchWins: 0,
      matchLosses: 0,
      mapsWon: 0,
      mapsLost: 0,
      mapDiff: 0,
      roundsWon: 0,
      roundsLost: 0,
      roundDiff: 0,
    };
  });

  matches.forEach((match) => {
    if (!match.isCompleted) return;

    const home = standingsMap[match.homeTeamId];
    const away = standingsMap[match.awayTeamId];

    if (home) {
      home.matchPlayed += 1;
      home.mapsWon += match.homeMaps;
      home.mapsLost += match.awayMaps;
      home.roundsWon += match.homeRounds;
      home.roundsLost += match.awayRounds;

      if (match.homeMaps > match.awayMaps) {
        home.matchWins += 1;
      } else {
        home.matchLosses += 1;
      }
    }

    if (away) {
      away.matchPlayed += 1;
      away.mapsWon += match.awayMaps;
      away.mapsLost += match.homeMaps;
      away.roundsWon += match.awayRounds;
      away.roundsLost += match.homeRounds;

      if (match.awayMaps > match.homeMaps) {
        away.matchWins += 1;
      } else {
        away.matchLosses += 1;
      }
    }
  });

  const standingsList = Object.values(standingsMap).map((team) => ({
    ...team,
    mapDiff: team.mapsWon - team.mapsLost,
    roundDiff: team.roundsWon - team.roundsLost,
  }));

  // Tiebreaker Resmi VCT: Match Wins -> Map Diff -> Round Diff
  standingsList.sort((a, b) => {
    if (b.matchWins !== a.matchWins) {
      return b.matchWins - a.matchWins;
    }
    if (b.mapDiff !== a.mapDiff) {
      return b.mapDiff - a.mapDiff;
    }
    return b.roundDiff - a.roundDiff;
  });

  return standingsList.map((team, index) => ({
    ...team,
    rank: index + 1,
  }));
}