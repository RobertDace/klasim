// src/lib/customTournamentStore.ts

export type GameFormat = 'MOBA' | 'BATTLE_ROYALE' | 'FPS';

export interface CustomTeam {
  id: string;
  name: string;
  code: string;
  group?: 'A' | 'B';
}

export interface CustomTournament {
  id: string;
  title: string;
  format: GameFormat;
  createdAt: number;
  teams: CustomTeam[];
}

const STORAGE_KEY = 'klasim_custom_tournaments';

export function getCustomTournaments(): CustomTournament[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function getCustomTournamentById(id: string): CustomTournament | null {
  const list = getCustomTournaments();
  return list.find((t) => t.id === id) || null;
}

export function saveCustomTournament(tournament: Omit<CustomTournament, 'id' | 'createdAt'>): string {
  const list = getCustomTournaments();
  const id = `custom_${Date.now()}`;
  const newTournament: CustomTournament = {
    ...tournament,
    id,
    createdAt: Date.now(),
  };

  list.unshift(newTournament);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  return id;
}

export function deleteCustomTournament(id: string): void {
  const list = getCustomTournaments().filter((t) => t.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}