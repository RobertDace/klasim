// src/lib/exportUtils.ts
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { TeamStanding } from '@/lib/calculator';
import { PUBGMStanding, PUBGMMatchResult } from '@/lib/pubgmCalculator';
import { ValorantStanding, ValorantMatchData } from '@/lib/valorantCalculator';

// =========================================================================
// 1. MODUL MOBA (MPL ID / CUSTOM MOBA)
// =========================================================================

export function exportStandingsToExcel(
  tournamentName: string,
  standings: TeamStanding[],
  matches: any[] = []
) {
  const wb = XLSX.utils.book_new();

  // Sheet 1: Klasemen
  const sheet1Rows: any[][] = [
    [`KLASIM ESPORTS TELEMETRY // ${tournamentName.toUpperCase()}`],
    ['Laporan Rekap Simulasi Klasemen Regular Season & Proyeksi Playoff'],
    [],
    ['POS', 'KODE', 'NAMA TIM', 'MATCH', 'WIN', 'LOSS', 'WIN RATE', 'GAME W-L', 'NET GAMES', 'STATUS KUALIFIKASI']
  ];

  standings.forEach((team) => {
    const rank = team.rank ?? 0;
    const status = rank <= 2 ? 'Upper Semifinals' : rank <= 6 ? 'Play-in Stage' : 'Tereliminasi';
    sheet1Rows.push([
      rank,
      team.teamCode,
      team.teamName,
      team.matchPlayed,
      team.matchWins,
      team.matchLosses,
      `${(team.matchWinRate * 100).toFixed(1)}%`,
      `${team.gameWins} - ${team.gameLosses}`,
      team.netGames > 0 ? `+${team.netGames}` : team.netGames,
      status,
    ]);
  });

  const ws1 = XLSX.utils.aoa_to_sheet(sheet1Rows);
  ws1['!cols'] = [{ wch: 6 }, { wch: 8 }, { wch: 24 }, { wch: 8 }, { wch: 6 }, { wch: 6 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 20 }];
  XLSX.utils.book_append_sheet(wb, ws1, 'Klasemen Season');

  // Sheet 2: Hasil Pertandingan
  const sheet2Rows: any[][] = [
    ['DETAIL HASIL SIMULASI MATCH (BO3)'],
    [],
    ['WEEK', 'MATCH ID', 'TIM HOME', 'SKOR', 'TIM AWAY', 'FORMAT', 'STATUS']
  ];
  matches.forEach((m) => {
    sheet2Rows.push([
      m.week || 1,
      m.id,
      m.homeTeam?.name || m.homeTeamId,
      m.isCompleted ? `${m.homeScore} - ${m.awayScore}` : '0 - 0',
      m.awayTeam?.name || m.awayTeamId,
      'BO3',
      m.isCompleted ? 'COMPLETED' : 'UPCOMING',
    ]);
  });
  const ws2 = XLSX.utils.aoa_to_sheet(sheet2Rows);
  ws2['!cols'] = [{ wch: 8 }, { wch: 12 }, { wch: 24 }, { wch: 10 }, { wch: 24 }, { wch: 10 }, { wch: 14 }];
  XLSX.utils.book_append_sheet(wb, ws2, 'Jadwal & Hasil Match');

  // Sheet 3: Playoff
  const t = (pos: number) => standings.find((s) => s.rank === pos)?.teamName || `Rank #${pos}`;
  const sheet3Rows: any[][] = [
    ['PROYEKSI BAGAN PLAYOFFS (DOUBLE ELIMINATION)'],
    [],
    ['ROUND', 'MATCH', 'TIM 1', 'TIM 2', 'PEMENANG SIMULASI'],
    ['R1 // Play-Ins', 'Match 1', `#3 ${t(3)}`, `#6 ${t(6)}`, t(3)],
    ['R1 // Play-Ins', 'Match 2', `#4 ${t(4)}`, `#5 ${t(5)}`, t(4)],
    ['R2 // Upper Semis', 'Match 3', `#1 ${t(1)}`, `WM1: ${t(3)}`, t(1)],
    ['R2 // Upper Semis', 'Match 4', `#2 ${t(2)}`, `WM2: ${t(4)}`, t(2)],
    ['Lower Semis', 'Match 5', `LM3: ${t(3)}`, `LM4: ${t(4)}`, t(3)],
    ['Upper Final', 'Match 6', `WM3: ${t(1)}`, `WM4: ${t(2)}`, t(2)],
    ['Lower Final', 'Match 7', `WM5: ${t(3)}`, `LM6: ${t(1)}`, t(1)],
    ['Grand Final', 'Match 8', `WM6: ${t(2)}`, `WM7: ${t(1)}`, `${t(2)} (CHAMPION)`],
  ];
  const ws3 = XLSX.utils.aoa_to_sheet(sheet3Rows);
  ws3['!cols'] = [{ wch: 18 }, { wch: 12 }, { wch: 26 }, { wch: 26 }, { wch: 30 }];
  XLSX.utils.book_append_sheet(wb, ws3, 'Proyeksi Playoff');

  XLSX.writeFile(wb, `Rekap_Simulasi_Klasim_${tournamentName.replace(/\s+/g, '_')}.xlsx`);
}

export function exportStandingsToPdf(tournamentName: string, standings: TeamStanding[]) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  doc.setFillColor(5, 7, 12);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Header Card
  doc.setFillColor(15, 23, 42);
  doc.setDrawColor(255, 255, 255);
  doc.roundedRect(10, 10, pageWidth - 20, 24, 2, 2, 'FD');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(245, 158, 11);
  doc.text('KLASIM TELEMETRY REPORT // MOBA MODULE', 14, 16);

  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text(tournamentName.toUpperCase(), 14, 23);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text('Simulasi Regular Season & Proyeksi Playoff Double Elimination', 14, 29);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(245, 158, 11);
  doc.text('1. KLASEMEN REGULAR SEASON', 10, 40);

  const tableData = standings.map((team) => [
    (team.rank ?? 0).toString(),
    `${team.teamCode}  ${team.teamName}`,
    team.matchPlayed.toString(),
    `${team.matchWins} / ${team.matchLosses}`,
    `${(team.matchWinRate * 100).toFixed(1)}%`,
    team.netGames > 0 ? `+${team.netGames}` : team.netGames.toString(),
    (team.rank ?? 0) <= 2 ? 'Upper Semi' : (team.rank ?? 0) <= 6 ? 'Play-In' : 'Eliminated',
  ]);

  autoTable(doc, {
    startY: 43,
    margin: { left: 10, right: 10 },
    head: [['POS', 'TIM', 'MN', 'M / K', 'MW%', 'NET', 'STATUS']],
    body: tableData,
    theme: 'plain',
    styles: { fontSize: 8, cellPadding: 2.2, textColor: [241, 245, 249], fillColor: [15, 23, 42], lineWidth: 0.1, lineColor: [30, 41, 59], halign: 'center' },
    headStyles: { fillColor: [15, 23, 42], textColor: [148, 163, 184], fontStyle: 'bold', halign: 'center' },
    columnStyles: { 0: { cellWidth: 12, fontStyle: 'bold' }, 1: { cellWidth: 55, halign: 'left', fontStyle: 'bold' }, 5: { fontStyle: 'bold' }, 6: { fontStyle: 'bold' } },
    didParseCell: (data) => {
      if (data.section === 'body' && data.column.index === 6) {
        const txt = String(data.cell.raw);
        if (txt.includes('Upper')) data.cell.styles.textColor = [52, 211, 153];
        else if (txt.includes('Play-In')) data.cell.styles.textColor = [56, 189, 248];
        else data.cell.styles.textColor = [248, 113, 113];
      }
    },
  });

  const finalY1 = (doc as any).lastAutoTable.finalY + 8;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(245, 158, 11);
  doc.text('2. BAGAN PLAYOFF (DOUBLE ELIMINATION)', 10, finalY1);

  const tName = (pos: number) => standings.find((s) => s.rank === pos)?.teamName || `Rank #${pos}`;
  const playoffData = [
    ['R1 // Play-In', 'Match 1', `#3 ${tName(3)} vs #6 ${tName(6)}`, tName(3)],
    ['R1 // Play-In', 'Match 2', `#4 ${tName(4)} vs #5 ${tName(5)}`, tName(4)],
    ['R2 // Upper Semis', 'Match 3', `#1 ${tName(1)} vs ${tName(3)}`, tName(1)],
    ['R2 // Upper Semis', 'Match 4', `#2 ${tName(2)} vs ${tName(4)}`, tName(2)],
    ['Lower Semis', 'Match 5', `${tName(3)} vs ${tName(4)}`, tName(3)],
    ['Upper Final', 'Match 6', `${tName(1)} vs ${tName(2)}`, tName(2)],
    ['Lower Final', 'Match 7', `${tName(3)} vs ${tName(1)}`, tName(1)],
    ['Grand Final', 'Match 8', `${tName(2)} vs ${tName(1)}`, tName(2)],
  ];

  autoTable(doc, {
    startY: finalY1 + 3,
    margin: { left: 10, right: 10 },
    head: [['BABAK', 'MATCH', 'TIM BERTANDING', 'PEMENANG SIMULASI']],
    body: playoffData,
    theme: 'plain',
    styles: { fontSize: 8, cellPadding: 2, textColor: [241, 245, 249], fillColor: [15, 23, 42], lineWidth: 0.1, lineColor: [30, 41, 59], halign: 'left' },
    headStyles: { fillColor: [15, 23, 42], textColor: [148, 163, 184], fontStyle: 'bold' },
    columnStyles: { 3: { fontStyle: 'bold', textColor: [245, 158, 11] } },
  });

  const finalY2 = (doc as any).lastAutoTable.finalY + 6;
  const champ = standings.find((s) => s.rank === 2)?.teamName || standings[0]?.teamName || 'TIM JUARA';
  doc.setFillColor(245, 158, 11, 0.1);
  doc.setDrawColor(245, 158, 11);
  doc.roundedRect(10, finalY2, pageWidth - 20, 14, 2, 2, 'FD');
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(245, 158, 11);
  doc.text('PROSPECTIVE CHAMPION', pageWidth / 2, finalY2 + 5, { align: 'center' });
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text(champ.toUpperCase(), pageWidth / 2, finalY2 + 10.5, { align: 'center' });

  doc.save(`Laporan_Simulasi_Klasim_${tournamentName.replace(/\s+/g, '_')}.pdf`);
}


// =========================================================================
// 2. MODUL BATTLE ROYALE (PUBGM / PMWC RULES)
// =========================================================================

export function exportPubgmToExcel(
  tournamentName: string,
  standings: PUBGMStanding[],
  matches: PUBGMMatchResult[] = []
) {
  const wb = XLSX.utils.book_new();

  // Sheet 1: Leaderboard Overall
  const sheet1Rows: any[][] = [
    [`KLASIM TELEMETRY // ${tournamentName.toUpperCase()}`],
    ['Official PMWC 10-Point Scoring System (10 Pts WWCD // 1 Pt per Kill)'],
    [],
    ['POS', 'KODE', 'NAMA TIM', 'MATCH', 'WWCD', 'RANK PTS', 'ELIM PTS', 'TOTAL PTS', 'STATUS KUALIFIKASI']
  ];

  standings.forEach((team) => {
    const rank = team.rank ?? 0;
    const status = rank <= 3 ? 'Grand Finals (Top 3)' : rank <= 8 ? 'Survival Stage (4-8)' : 'Eliminated (Red Zone)';
    sheet1Rows.push([
      rank,
      team.teamCode,
      team.teamName,
      team.matchesPlayed,
      team.wwcd,
      team.rankPoints,
      team.elimPoints,
      team.totalPoints,
      status,
    ]);
  });

  const ws1 = XLSX.utils.aoa_to_sheet(sheet1Rows);
  ws1['!cols'] = [{ wch: 6 }, { wch: 8 }, { wch: 24 }, { wch: 8 }, { wch: 8 }, { wch: 12 }, { wch: 12 }, { wch: 14 }, { wch: 24 }];
  XLSX.utils.book_append_sheet(wb, ws1, 'Overall Leaderboard');

  // Sheet 2: Log Match & Map
  const sheet2Rows: any[][] = [
    ['DETAIL LOG HASIL PERTANDINGAN MAP'],
    [],
    ['MATCH #', 'MAP', 'TIM ID', 'PLACEMENT RANK', 'KILLS', 'TOTAL PTS MATCH']
  ];

  matches.forEach((m) => {
    m.teamResults.forEach((res) => {
      const rankPts = res.rank === 1 ? 10 : res.rank === 2 ? 6 : res.rank === 3 ? 5 : res.rank === 4 ? 4 : res.rank === 5 ? 3 : res.rank === 6 ? 2 : res.rank <= 8 ? 1 : 0;
      sheet2Rows.push([
        `Match #${m.matchNumber}`,
        m.mapName,
        res.teamId.toUpperCase(),
        `#${res.rank}`,
        res.kills,
        rankPts + res.kills,
      ]);
    });
  });

  const ws2 = XLSX.utils.aoa_to_sheet(sheet2Rows);
  ws2['!cols'] = [{ wch: 10 }, { wch: 12 }, { wch: 12 }, { wch: 16 }, { wch: 10 }, { wch: 16 }];
  XLSX.utils.book_append_sheet(wb, ws2, 'Log Per-Match');

  XLSX.writeFile(wb, `Rekap_PUBGM_${tournamentName.replace(/\s+/g, '_')}.xlsx`);
}

export function exportPubgmToPdf(tournamentName: string, standings: PUBGMStanding[]) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  doc.setFillColor(5, 7, 12);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Header Card Box
  doc.setFillColor(15, 23, 42);
  doc.setDrawColor(245, 158, 11);
  doc.roundedRect(10, 10, pageWidth - 20, 24, 2, 2, 'FD');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(245, 158, 11);
  doc.text('PMWC OFFICIAL POINT SYSTEM TELEMETRY', 14, 16);

  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text(tournamentName.toUpperCase(), 14, 23);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text('10 Pts WWCD // 1 Pt per Kill // Official Tiebreaker Active', 14, 29);

  // Table Data Standings
  const tableData = standings.map((team) => {
    const rank = team.rank ?? 0;
    const status = rank <= 3 ? 'Grand Finals' : rank <= 8 ? 'Survival' : 'Eliminated';
    return [
      rank.toString(),
      `${team.teamCode}  ${team.teamName}`,
      team.matchesPlayed.toString(),
      `${team.wwcd}x`,
      team.rankPoints.toString(),
      team.elimPoints.toString(),
      team.totalPoints.toString(),
      status,
    ];
  });

  autoTable(doc, {
    startY: 38,
    margin: { left: 10, right: 10 },
    head: [['POS', 'TIM', 'MATCH', 'WWCD', 'RANK', 'ELIM', 'TOTAL', 'STATUS']],
    body: tableData,
    theme: 'plain',
    styles: { fontSize: 7.5, cellPadding: 1.8, textColor: [241, 245, 249], fillColor: [15, 23, 42], lineWidth: 0.1, lineColor: [30, 41, 59], halign: 'center' },
    headStyles: { fillColor: [15, 23, 42], textColor: [148, 163, 184], fontStyle: 'bold', halign: 'center' },
    columnStyles: {
      0: { cellWidth: 10, fontStyle: 'bold' },
      1: { cellWidth: 50, halign: 'left', fontStyle: 'bold' },
      3: { textColor: [245, 158, 11], fontStyle: 'bold' },
      6: { fontStyle: 'bold', textColor: [255, 255, 255] },
      7: { cellWidth: 28, fontStyle: 'bold' },
    },
    didParseCell: (data) => {
      if (data.section === 'body' && data.column.index === 7) {
        const txt = String(data.cell.raw);
        if (txt.includes('Grand')) data.cell.styles.textColor = [52, 211, 153];
        else if (txt.includes('Survival')) data.cell.styles.textColor = [56, 189, 248];
        else data.cell.styles.textColor = [248, 113, 113];
      }
    },
  });

  const finalY = (doc as any).lastAutoTable.finalY + 6;
  const leader = standings[0]?.teamName || 'LEADER TIM';

  doc.setFillColor(245, 158, 11, 0.1);
  doc.setDrawColor(245, 158, 11);
  doc.roundedRect(10, finalY, pageWidth - 20, 14, 2, 2, 'FD');
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(245, 158, 11);
  doc.text('CURRENT OVERALL #1 LEADER', pageWidth / 2, finalY + 5, { align: 'center' });
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text(`${leader.toUpperCase()} (${standings[0]?.totalPoints || 0} PTS)`, pageWidth / 2, finalY + 10.5, { align: 'center' });

  doc.save(`Laporan_PUBGM_${tournamentName.replace(/\s+/g, '_')}.pdf`);
}


// =========================================================================
// 3. MODUL FPS (VALORANT / VCT PACIFIC RULES)
// =========================================================================

export function exportValorantToExcel(
  tournamentName: string,
  standingsA: ValorantStanding[],
  standingsB: ValorantStanding[],
  matches: ValorantMatchData[] = []
) {
  const wb = XLSX.utils.book_new();

  // Helper Pembuat Sheet Group
  const createGroupRows = (groupName: string, groupStandings: ValorantStanding[]) => {
    const rows: any[][] = [
      [`KLASIM VCT TELEMETRY // ${tournamentName.toUpperCase()} - GROUP ${groupName}`],
      ['Tiebreaker: Match Wins // Map Differential // Round Differential'],
      [],
      ['POS', 'KODE', 'NAMA TIM', 'MATCH W-L', 'MAPS (W-L)', 'MAP DIFF', 'ROUNDS (W-L)', 'ROUND DIFF', 'STATUS']
    ];

    groupStandings.forEach((team) => {
      const rank = team.rank ?? 0;
      rows.push([
        rank,
        team.teamCode,
        team.teamName,
        `${team.matchWins} - ${team.matchLosses}`,
        `${team.mapsWon} - ${team.mapsLost}`,
        team.mapDiff > 0 ? `+${team.mapDiff}` : team.mapDiff,
        `${team.roundsWon} - ${team.roundsLost}`,
        team.roundDiff > 0 ? `+${team.roundDiff}` : team.roundDiff,
        rank <= 3 ? 'Playoffs (Top 3)' : 'Eliminated',
      ]);
    });

    const ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 6 }, { wch: 8 }, { wch: 24 }, { wch: 12 }, { wch: 12 }, { wch: 10 }, { wch: 14 }, { wch: 12 }, { wch: 18 }];
    return ws;
  };

  XLSX.utils.book_append_sheet(wb, createGroupRows('A (Alpha)', standingsA), 'Group A Standings');
  XLSX.utils.book_append_sheet(wb, createGroupRows('B (Omega)', standingsB), 'Group B Standings');

  // Sheet 3: Hasil Match BO3
  const matchRows: any[][] = [
    ['DETAIL HASIL SIMULASI SERIES BO3'],
    [],
    ['GROUP', 'MATCH ID', 'TIM HOME', 'MAPS', 'ROUNDS', 'TIM AWAY', 'STATUS']
  ];
  matches.forEach((m) => {
    matchRows.push([
      `Group ${m.group}`,
      m.id,
      m.homeTeamId.toUpperCase(),
      m.isCompleted ? `${m.homeMaps} - ${m.awayMaps}` : '0 - 0',
      m.isCompleted ? `${m.homeRounds} - ${m.awayRounds}` : '0 - 0',
      m.awayTeamId.toUpperCase(),
      m.isCompleted ? 'COMPLETED' : 'UPCOMING',
    ]);
  });
  const wsMatches = XLSX.utils.aoa_to_sheet(matchRows);
  wsMatches['!cols'] = [{ wch: 10 }, { wch: 12 }, { wch: 18 }, { wch: 10 }, { wch: 12 }, { wch: 18 }, { wch: 14 }];
  XLSX.utils.book_append_sheet(wb, wsMatches, 'Jadwal & Skor BO3');

  XLSX.writeFile(wb, `Rekap_VCT_${tournamentName.replace(/\s+/g, '_')}.xlsx`);
}

export function exportValorantToPdf(
  tournamentName: string,
  standingsA: ValorantStanding[],
  standingsB: ValorantStanding[]
) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  doc.setFillColor(5, 7, 12);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Header Box Cyan Theme
  doc.setFillColor(15, 23, 42);
  doc.setDrawColor(34, 211, 238);
  doc.roundedRect(10, 10, pageWidth - 20, 24, 2, 2, 'FD');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(34, 211, 238);
  doc.text('VCT PACIFIC OFFICIAL REPORT // FPS TELEMETRY', 14, 16);

  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text(tournamentName.toUpperCase(), 14, 23);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text('Tiebreaker: Match Wins // Map Differential // Round Differential', 14, 29);

  // Group A Table
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(34, 211, 238);
  doc.text('1. GROUP A (ALPHA) STANDINGS', 10, 40);

  const formatRows = (list: ValorantStanding[]) =>
    list.map((t) => [
      (t.rank ?? 0).toString(),
      `${t.teamCode}  ${t.teamName}`,
      `${t.matchWins}-${t.matchLosses}`,
      `${t.mapsWon}-${t.mapsLost}`,
      t.mapDiff > 0 ? `+${t.mapDiff}` : t.mapDiff.toString(),
      t.roundDiff > 0 ? `+${t.roundDiff}` : t.roundDiff.toString(),
      (t.rank ?? 0) <= 3 ? 'Playoffs' : 'Eliminated',
    ]);

  autoTable(doc, {
    startY: 43,
    margin: { left: 10, right: 10 },
    head: [['POS', 'TIM', 'MATCH', 'MAPS', 'MAP DIFF', 'RD DIFF', 'STATUS']],
    body: formatRows(standingsA),
    theme: 'plain',
    styles: { fontSize: 7.5, cellPadding: 2, textColor: [241, 245, 249], fillColor: [15, 23, 42], lineWidth: 0.1, lineColor: [30, 41, 59], halign: 'center' },
    headStyles: { fillColor: [15, 23, 42], textColor: [148, 163, 184], fontStyle: 'bold', halign: 'center' },
    columnStyles: { 0: { cellWidth: 10, fontStyle: 'bold' }, 1: { cellWidth: 55, halign: 'left', fontStyle: 'bold' }, 4: { fontStyle: 'bold' }, 5: { fontStyle: 'bold' } },
    didParseCell: (data) => {
      if (data.section === 'body' && data.column.index === 6) {
        data.cell.styles.textColor = String(data.cell.raw).includes('Playoffs') ? [34, 211, 238] : [248, 113, 113];
      }
    },
  });

  // Group B Table
  const finalY1 = (doc as any).lastAutoTable.finalY + 8;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(34, 211, 238);
  doc.text('2. GROUP B (OMEGA) STANDINGS', 10, finalY1);

  autoTable(doc, {
    startY: finalY1 + 3,
    margin: { left: 10, right: 10 },
    head: [['POS', 'TIM', 'MATCH', 'MAPS', 'MAP DIFF', 'RD DIFF', 'STATUS']],
    body: formatRows(standingsB),
    theme: 'plain',
    styles: { fontSize: 7.5, cellPadding: 2, textColor: [241, 245, 249], fillColor: [15, 23, 42], lineWidth: 0.1, lineColor: [30, 41, 59], halign: 'center' },
    headStyles: { fillColor: [15, 23, 42], textColor: [148, 163, 184], fontStyle: 'bold', halign: 'center' },
    columnStyles: { 0: { cellWidth: 10, fontStyle: 'bold' }, 1: { cellWidth: 55, halign: 'left', fontStyle: 'bold' }, 4: { fontStyle: 'bold' }, 5: { fontStyle: 'bold' } },
    didParseCell: (data) => {
      if (data.section === 'body' && data.column.index === 6) {
        data.cell.styles.textColor = String(data.cell.raw).includes('Playoffs') ? [34, 211, 238] : [248, 113, 113];
      }
    },
  });

  doc.save(`Laporan_VCT_${tournamentName.replace(/\s+/g, '_')}.pdf`);
}