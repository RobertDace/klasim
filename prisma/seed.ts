// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Reset Data (Opsional: Membersihkan data lama agar tidak duplikat saat re-seed)
  await prisma.match.deleteMany();
  await prisma.team.deleteMany();
  await prisma.tournament.deleteMany();
  await prisma.game.deleteMany();

  // 2. Buat Data Game
  const game = await prisma.game.create({
    data: {
      name: 'Mobile Legends: Bang Bang',
      slug: 'mlbb',
    },
  });

  // 3. Buat Data Turnamen
  const tournament = await prisma.tournament.create({
    data: {
      gameId: game.id,
      name: 'MPL ID Season 14',
      slug: 'mpl-id-s14',
      format: 'MPL_BO3',
    },
  });

  // 4. Buat 9 Tim Peserta MPL ID
  const teamsData = [
    { name: 'Fnatic ONIC', code: 'ONIC', logoUrl: '/logos/onic.png' },
    { name: 'RRQ Hoshi', code: 'RRQ', logoUrl: '/logos/rrq.png' },
    { name: 'EVOS Glory', code: 'EVOS', logoUrl: '/logos/evos.png' },
    { name: 'Bigetron Alpha', code: 'BTR', logoUrl: '/logos/btr.png' },
    { name: 'Alter Ego', code: 'AE', logoUrl: '/logos/ae.png' },
    { name: 'Geek Fam', code: 'GEEK', logoUrl: '/logos/geek.png' },
    { name: 'Team Liquid ID', code: 'TLID', logoUrl: '/logos/tlid.png' },
    { name: 'Dewa United Esports', code: 'DEWA', logoUrl: '/logos/dewa.png' },
    { name: 'Rebellion Esports', code: 'RBL', logoUrl: '/logos/rbl.png' },
  ];

  const createdTeams: Record<string, string> = {};

  for (const team of teamsData) {
    const created = await prisma.team.create({
      data: {
        tournamentId: tournament.id,
        name: team.name,
        code: team.code,
        logoUrl: team.logoUrl,
      },
    });
    createdTeams[team.code] = created.id;
  }

  console.log(`✅ Created 9 MPL ID teams.`);

  // 5. Sampel Match Schedules (Week 1 & Week 2)
  const matchesData = [
    // --- WEEK 1 ---
    {
      week: 1,
      home: 'ONIC',
      away: 'TLID',
      homeScore: 2,
      awayScore: 0,
      isCompleted: true,
    },
    {
      week: 1,
      home: 'EVOS',
      away: 'BTR',
      homeScore: 1,
      awayScore: 2,
      isCompleted: true,
    },
    {
      week: 1,
      home: 'RRQ',
      away: 'GEEK',
      homeScore: 2,
      awayScore: 1,
      isCompleted: true,
    },
    {
      week: 1,
      home: 'AE',
      away: 'DEWA',
      homeScore: 2,
      awayScore: 0,
      isCompleted: true,
    },
    {
      week: 1,
      home: 'RBL',
      away: 'ONIC',
      homeScore: 0,
      awayScore: 2,
      isCompleted: true,
    },

    // --- WEEK 2 (Sebagian Belum Dimainkan untuk Bahan Simulasi) ---
    {
      week: 2,
      home: 'RRQ',
      away: 'EVOS',
      homeScore: 2,
      awayScore: 1,
      isCompleted: true,
    },
    {
      week: 2,
      home: 'BTR',
      away: 'AE',
      homeScore: 2,
      awayScore: 0,
      isCompleted: true,
    },
    {
      week: 2,
      home: 'TLID',
      away: 'DEWA',
      homeScore: 0,
      awayScore: 0,
      isCompleted: false, // Belum dimainkan
    },
    {
      week: 2,
      home: 'GEEK',
      away: 'RBL',
      homeScore: 0,
      awayScore: 0,
      isCompleted: false, // Belum dimainkan
    },
    {
      week: 2,
      home: 'ONIC',
      away: 'RRQ',
      homeScore: 0,
      awayScore: 0,
      isCompleted: false, // Belum dimainkan
    },
  ];

  for (const match of matchesData) {
    await prisma.match.create({
      data: {
        tournamentId: tournament.id,
        week: match.week,
        homeTeamId: createdTeams[match.home],
        awayTeamId: createdTeams[match.away],
        homeScore: match.homeScore,
        awayScore: match.awayScore,
        isCompleted: match.isCompleted,
      },
    });
  }

  console.log(`✅ Created ${matchesData.length} match schedules.`);
  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });