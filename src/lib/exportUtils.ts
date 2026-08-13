// src/lib/exportUtils.ts
import * as XLSX from 'xlsx';
import { TeamStanding } from '@/lib/calculator';

export function exportStandingsToExcel(
  tournamentName: string,
  standings: TeamStanding[]
) {
  // 1. Format Data Klasemen
  const excelData = standings.map((team) => ({
    POS: team.rank,
    KODE: team.teamCode,
    NAMA_TIM: team.teamName,
    MATCH: team.matchPlayed,
    WIN: team.matchWins,
    LOSS: team.matchLosses,
    WIN_RATE: `${(team.matchWinRate * 100).toFixed(1)}%`,
    GAME_WL: `${team.gameWins} - ${team.gameLosses}`,
    NET_GAMES: team.netGames,
    STATUS:
      team.rank! <= 2
        ? 'Upper Semifinals'
        : team.rank! <= 6
        ? 'Play-In Stage'
        : 'Tereliminasi',
  }));

  // 2. Buat Worksheet & Workbook
  const worksheet = XLSX.utils.json_to_sheet(excelData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Klasemen Season');

  // 3. Set Lebar Kolom Otomatis
  const colWidths = [
    { wch: 6 },  // POS
    { wch: 8 },  // KODE
    { wch: 22 }, // NAMA_TIM
    { wch: 8 },  // MATCH
    { wch: 6 },  // WIN
    { wch: 6 },  // LOSS
    { wch: 10 }, // WIN_RATE
    { wch: 12 }, // GAME_WL
    { wch: 12 }, // NET_GAMES
    { wch: 18 }, // STATUS
  ];
  worksheet['!cols'] = colWidths;

  // 4. Download File XLSX
  const fileName = `${tournamentName.replace(/\s+/g, '_')}_Klasemen.xlsx`;
  XLSX.writeFile(workbook, fileName);
}