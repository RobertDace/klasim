// src/lib/calculator.ts

export interface TeamData {
  id: string;
  name: string;
  code: string;
  logoUrl?: string | null;
}

export interface MatchData {
  id?: string;
  week: number;
  homeTeamId: string;
  awayTeamId: string;
  homeScore: number;
  awayScore: number;
  isCompleted: boolean;
  homeTeam?: TeamData;
  awayTeam?: TeamData;
}

export interface TeamStanding {
  rank?: number;
  teamId: string;
  teamName: string;
  teamCode: string;
  logoUrl?: string | null;
  matchPlayed: number;
  matchWins: number;
  matchLosses: number;
  matchWinRate: number;
  gameWins: number;
  gameLosses: number;
  netGames: number; // Aggregate Points / Game Difference (+/-)
  gameWinRate: number;
  headToHead: Record<string, { wins: number; losses: number }>;
}

export function calculateMPLStandings(
  teams: TeamData[],
  matches: MatchData[]
): TeamStanding[] {
  const standingsMap: Record<string, TeamStanding> = {};

  // 1. Inisialisasi data statistik untuk setiap tim
  teams.forEach((team) => {
    standingsMap[team.id] = {
      teamId: team.id,
      teamName: team.name,
      teamCode: team.code,
      logoUrl: team.logoUrl,
      matchPlayed: 0,
      matchWins: 0,
      matchLosses: 0,
      matchWinRate: 0,
      gameWins: 0,
      gameLosses: 0,
      netGames: 0,
      gameWinRate: 0,
      headToHead: {},
    };
  });

  // 2. Olah data dari setiap pertandingan yang sudah selesai atau disimulasikan
  matches.forEach((match) => {
    if (!match.isCompleted) return;

    const home = standingsMap[match.homeTeamId];
    const away = standingsMap[match.awayTeamId];

    if (!home || !away) return;

    // Tambah jumlah game yang dimenangkan & kalah
    home.gameWins += match.homeScore;
    home.gameLosses += match.awayScore;
    away.gameWins += match.awayScore;
    away.gameLosses += match.homeScore;

    // Inisialisasi Head-to-Head record jika belum ada
    if (!home.headToHead[away.teamId]) {
      home.headToHead[away.teamId] = { wins: 0, losses: 0 };
    }
    if (!away.headToHead[home.teamId]) {
      away.headToHead[home.teamId] = { wins: 0, losses: 0 };
    }

    // Tentukan pemenang match (Bo3)
    if (match.homeScore > match.awayScore) {
      home.matchWins += 1;
      away.matchLosses += 1;
      home.headToHead[away.teamId].wins += 1;
      away.headToHead[home.teamId].losses += 1;
    } else if (match.awayScore > match.homeScore) {
      away.matchWins += 1;
      home.matchLosses += 1;
      away.headToHead[home.teamId].wins += 1;
      away.headToHead[away.teamId].losses += 1;
    }

    home.matchPlayed += 1;
    away.matchPlayed += 1;
  });

  // 3. Hitung persentase & Net Games
  const standingsList = Object.values(standingsMap).map((team) => {
    const totalGames = team.gameWins + team.gameLosses;
    return {
      ...team,
      netGames: team.gameWins - team.gameLosses,
      matchWinRate: team.matchPlayed > 0 ? team.matchWins / team.matchPlayed : 0,
      gameWinRate: totalGames > 0 ? team.gameWins / totalGames : 0,
    };
  });

  // 4. Urutkan klasemen berdasarkan Hirarki Tiebreaker MPL ID
  standingsList.sort((a, b) => {
    // Tiebreaker 1: Total Match Wins / Match Points
    if (b.matchWins !== a.matchWins) {
      return b.matchWins - a.matchWins;
    }

    // Tiebreaker 2: Aggregate Points / Net Games (+/-)
    if (b.netGames !== a.netGames) {
      return b.netGames - a.netGames;
    }

    // Tiebreaker 3: Head-to-Head (H2H) antar tim yang imbang
    const aVsB = a.headToHead[b.teamId];
    const bVsA = b.headToHead[a.teamId];

    if (aVsB && bVsA) {
      const h2hDiff = aVsB.wins - bVsA.wins;
      if (h2hDiff !== 0) {
        return h2hDiff > 0 ? -1 : 1; // Jika a menang H2H, a berada di atas b
      }
    }

    // Tiebreaker 4: Game Win Rate
    if (b.gameWinRate !== a.gameWinRate) {
      return b.gameWinRate - a.gameWinRate;
    }

    return 0;
  });

  // 5. Beri nomor peringkat (Rank 1-9)
  return standingsList.map((team, index) => ({
    ...team,
    rank: index + 1,
  }));
}