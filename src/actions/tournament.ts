// src/actions/tournament.ts
'use server';

import { prisma } from '@/lib/prisma';

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
    console.error('Failed to fetch tournament:', error);
    return null;
  }
}