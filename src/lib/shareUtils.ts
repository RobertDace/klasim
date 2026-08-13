// src/lib/shareUtils.ts

export interface MatchScoreState {
  id: string;
  homeScore: number;
  awayScore: number;
  isCompleted: boolean;
}

/**
 * Mengubah array match menjadi query string URL yang singkat
 * Format: m1:2-0|m2:2-1
 */
export function encodeMatchScoresToUrl(matches: MatchScoreState[]): string {
  const activeMatches = matches.filter((m) => m.isCompleted);
  if (activeMatches.length === 0) return '';

  const encodedString = activeMatches
    .map((m) => `${m.id}:${m.homeScore}-${m.awayScore}`)
    .join('|');

  return encodeURIComponent(encodedString);
}

/**
 * Membaca query string URL dan mengembalikan object mapping skor match
 */
export function decodeUrlToMatchScores(encodedQuery: string): Record<string, { homeScore: number; awayScore: number }> {
  if (!encodedQuery) return {};

  const result: Record<string, { homeScore: number; awayScore: number }> = {};

  try {
    const decoded = decodeURIComponent(encodedQuery);
    const pairs = decoded.split('|');

    pairs.forEach((pair) => {
      const [matchId, scores] = pair.split(':');
      if (matchId && scores) {
        const [home, away] = scores.split('-').map(Number);
        if (!isNaN(home) && !isNaN(away)) {
          result[matchId] = { homeScore: home, awayScore: away };
        }
      }
    });
  } catch {
    return {};
  }

  return result;
}