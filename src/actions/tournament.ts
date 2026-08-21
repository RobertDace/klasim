// src/actions/tournament.ts
'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rateLimit';

export interface CreateCustomTournamentInput {
  title: string;
  format: 'MOBA' | 'BATTLE_ROYALE' | 'FPS';
  teams: { name: string; code: string; group?: 'A' | 'B' }[];
}

const MAX_TOURNAMENTS_PER_USER = 5;

export async function getTournamentBySlug(slug: string) {
  try {
    const tournament = await prisma.tournament.findUnique({
      where: { slug },
      include: {
        teams: true,
        matches: {
          include: {
            homeTeam: true,
            awayTeam: true,
          },
          orderBy: [
            { week: 'asc' },
            { id: 'asc' },
          ],
        },
      },
    });

    return tournament;
  } catch (error) {
    console.error('Failed to fetch tournament by slug:', error);
    return null;
  }
}

export async function getCustomTournamentBySlugOrId(identifier: string) {
  try {
    const tournament = await prisma.tournament.findFirst({
      where: {
        OR: [{ slug: identifier }, { id: identifier }],
      },
      include: {
        game: true,
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        teams: true,
        matches: {
          include: {
            homeTeam: true,
            awayTeam: true,
          },
          orderBy: [
            { week: 'asc' },
            { id: 'asc' },
          ],
        },
      },
    });

    return tournament;
  } catch (error) {
    console.error('Failed to fetch custom tournament:', error);
    return null;
  }
}

export async function getUserTournamentsAction() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return { success: false, error: 'Unauthorized', tournaments: [] };
    }

    const tournaments = await prisma.tournament.findMany({
      where: { userId: currentUser.id },
      include: {
        game: true,
        teams: true,
        matches: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      success: true,
      tournaments,
      quotaUsed: tournaments.length,
      maxQuota: MAX_TOURNAMENTS_PER_USER,
    };
  } catch (error) {
    console.error('Error fetching user tournaments:', error);
    return { success: false, error: 'Gagal memuat turnamen', tournaments: [] };
  }
}

export async function deleteCustomTournamentAction(tournamentId: string) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return { success: false, error: 'Silakan masuk untuk menghapus turnamen.' };
    }

    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
    });

    if (!tournament) {
      return { success: false, error: 'Turnamen tidak ditemukan.' };
    }

    // Pastikan hanya pemilik yang bisa menghapus
    if (tournament.userId !== currentUser.id) {
      return { success: false, error: 'Anda tidak memiliki hak akses untuk menghapus turnamen ini.' };
    }

    await prisma.tournament.delete({
      where: { id: tournamentId },
    });

    return { success: true };
  } catch (error) {
    console.error('Error deleting tournament:', error);
    return { success: false, error: 'Gagal menghapus turnamen dari server.' };
  }
}

export async function createCustomTournamentAction(input: CreateCustomTournamentInput) {
  try {
    // 0. Rate Limiting: Maksimal 5 pembuatan turnamen per menit per IP
    const rateLimit = await checkRateLimit('create_tournament', 5, 60 * 1000);
    if (!rateLimit.allowed) {
      return {
        success: false,
        error: 'Terlalu banyak permintaan pembuatan turnamen. Silakan tunggu 1 menit sebelum mencoba lagi.',
      };
    }

    const { title, format, teams } = input;

    // 1. Cek session user & kuota jika login
    const currentUser = await getCurrentUser();

    if (currentUser) {
      const userTournamentCount = await prisma.tournament.count({
        where: { userId: currentUser.id },
      });

      if (userTournamentCount >= MAX_TOURNAMENTS_PER_USER) {
        return {
          success: false,
          error: `Batas kuota tercapai (Maksimal ${MAX_TOURNAMENTS_PER_USER} turnamen aktif per akun). Hapus turnamen lama di dashboard untuk membuat yang baru.`,
        };
      }
    }

    // 2. Generate slug yang bersih dan unik
    const baseSlug =
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') || 'turnamen';
    const uniqueSuffix = Math.random().toString(36).substring(2, 7);
    const slug = `${baseSlug}-${uniqueSuffix}`;

    // 3. Pemetaan format ke Game identifier
    let gameSlug = 'mlbb';
    let gameName = 'Mobile Legends: Bang Bang';
    let formatCode = 'CUSTOM_MOBA';

    if (format === 'BATTLE_ROYALE') {
      gameSlug = 'pubgm';
      gameName = 'PUBG Mobile';
      formatCode = 'CUSTOM_BR';
    } else if (format === 'FPS') {
      gameSlug = 'valorant';
      gameName = 'VALORANT';
      formatCode = 'CUSTOM_FPS';
    }

    // 4. Pastikan record Game tersedia
    const game = await prisma.game.upsert({
      where: { slug: gameSlug },
      update: {},
      create: {
        name: gameName,
        slug: gameSlug,
      },
    });

    // 5. Buat Tournament beserta Teams (terhubung dengan userId jika login)
    const tournament = await prisma.tournament.create({
      data: {
        gameId: game.id,
        userId: currentUser ? currentUser.id : null,
        name: title.trim(),
        slug: slug,
        format: formatCode,
        teams: {
          create: teams.map((t) => ({
            name: t.name.trim(),
            code: t.code.trim().toUpperCase(),
          })),
        },
      },
      include: {
        teams: true,
      },
    });

    // 6. Scaffolding jadwal pertandingan awal (Matches)
    if (format === 'MOBA') {
      const createdTeams = tournament.teams;
      const matchesToCreate = [];

      for (let i = 0; i < createdTeams.length; i++) {
        for (let j = i + 1; j < createdTeams.length; j++) {
          matchesToCreate.push({
            tournamentId: tournament.id,
            week: 1,
            homeTeamId: createdTeams[i].id,
            awayTeamId: createdTeams[j].id,
            homeScore: 0,
            awayScore: 0,
            isCompleted: false,
          });
        }
      }

      if (matchesToCreate.length > 0) {
        await prisma.match.createMany({
          data: matchesToCreate,
        });
      }
    } else if (format === 'FPS') {
      const createdTeams = tournament.teams;
      const groupA: typeof createdTeams = [];
      const groupB: typeof createdTeams = [];

      teams.forEach((t, idx) => {
        const ct = createdTeams.find((item) => item.code === t.code.toUpperCase()) || createdTeams[idx];
        if (ct) {
          if (t.group === 'B' || (!t.group && idx % 2 === 1)) {
            groupB.push(ct);
          } else {
            groupA.push(ct);
          }
        }
      });

      const matchesToCreate = [];

      for (let i = 0; i < groupA.length; i++) {
        for (let j = i + 1; j < groupA.length; j++) {
          matchesToCreate.push({
            tournamentId: tournament.id,
            week: 1,
            homeTeamId: groupA[i].id,
            awayTeamId: groupA[j].id,
            homeScore: 0,
            awayScore: 0,
            isCompleted: false,
          });
        }
      }

      for (let i = 0; i < groupB.length; i++) {
        for (let j = i + 1; j < groupB.length; j++) {
          matchesToCreate.push({
            tournamentId: tournament.id,
            week: 1,
            homeTeamId: groupB[i].id,
            awayTeamId: groupB[j].id,
            homeScore: 0,
            awayScore: 0,
            isCompleted: false,
          });
        }
      }

      if (matchesToCreate.length > 0) {
        await prisma.match.createMany({
          data: matchesToCreate,
        });
      }
    }

    return {
      success: true,
      slug: tournament.slug,
      id: tournament.id,
    };
  } catch (error) {
    console.error('Error creating custom tournament action:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown database error',
    };
  }
}